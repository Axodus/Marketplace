import type {
  MarketplaceStore,
  OwnershipReconciliationRecord,
  OwnershipReconciliationSnapshot,
  OwnershipSnapshotEntity,
  ProductEntity
} from "../dto/contracts.js";

const STALE_THRESHOLD_BLOCKS = 100;

function normalizeAddress(value: string | null | undefined) {
  return typeof value === "string" ? value.toLowerCase() : null;
}

function isNftBound(product: ProductEntity) {
  return Boolean(product.nftBound);
}

function getProductContract(product: ProductEntity) {
  return typeof product.contractAddress === "string" ? product.contractAddress : null;
}

function getProductTokenId(product: ProductEntity) {
  return typeof product.tokenId === "string" ? product.tokenId : null;
}

function findOwnershipSnapshot(store: MarketplaceStore, product: ProductEntity) {
  const contract = normalizeAddress(getProductContract(product));
  const tokenId = getProductTokenId(product);
  return (store.ownershipSnapshots ?? [])
    .filter((snapshot) => {
      const sameProduct = snapshot.productId === product.id;
      const sameContract = contract && normalizeAddress(snapshot.contractAddress) === contract;
      const sameToken = !tokenId || snapshot.tokenId === tokenId;
      return (sameProduct || sameContract) && sameToken;
    })
    .sort((a, b) => b.blockNumber - a.blockNumber)[0];
}

function expectedHolders(store: MarketplaceStore, product: ProductEntity) {
  const licenseHolders = (store.licenseRuntimes ?? [])
    .filter((license) => license.productId === product.id && ["issued", "active"].includes(license.state))
    .map((license) => license.holder);
  const purchaseHolders = store.purchases
    .filter((purchase) => purchase.productId === product.id && purchase.status !== "blocked")
    .map((purchase) => purchase.buyer);
  return [...new Set([...licenseHolders, ...purchaseHolders])];
}

function latestBlockForSnapshot(store: MarketplaceStore, snapshot?: OwnershipSnapshotEntity) {
  if (!snapshot) return null;
  return store.chainSnapshots?.find((chain) => chain.chain === snapshot.chain)?.latestBlockNumber ?? snapshot.blockNumber;
}

function buildRecord(store: MarketplaceStore, product: ProductEntity): OwnershipReconciliationRecord {
  const contractAddress = getProductContract(product);
  const tokenId = getProductTokenId(product);
  const holders = expectedHolders(store, product);
  const snapshot = findOwnershipSnapshot(store, product);
  const latestBlock = latestBlockForSnapshot(store, snapshot);
  const blockLag = snapshot && latestBlock !== null ? Math.max(0, latestBlock - snapshot.blockNumber) : null;
  const stale = blockLag !== null && blockLag > STALE_THRESHOLD_BLOCKS;
  const invalidAsset = !contractAddress || !tokenId || contractAddress.startsWith("mock:");
  const observedOwner = snapshot?.owner ?? null;
  const observedBalance = snapshot?.balance ?? null;
  const expectedMatches =
    holders.length === 0 ||
    holders.some((holder) => normalizeAddress(holder) === normalizeAddress(observedOwner)) ||
    (observedBalance !== null && Number(observedBalance) > 0);
  const reasonCodes: string[] = [];

  let status: OwnershipReconciliationRecord["status"] = "verified";
  if (invalidAsset) reasonCodes.push("invalid-or-symbolic-nft-contract");

  if (!snapshot) {
    status = "missing_snapshot";
    reasonCodes.push("ownership-snapshot-missing");
  } else if (!expectedMatches) {
    status = "mismatch";
    reasonCodes.push("ownership-holder-mismatch");
  } else if (stale) {
    status = "stale";
    reasonCodes.push("ownership-snapshot-stale");
  } else if (invalidAsset) {
    status = "invalid_asset";
  } else {
    reasonCodes.push("ownership-reconciled");
  }

  if (stale && status !== "stale") reasonCodes.push("ownership-snapshot-stale");

  if (holders.length === 0) reasonCodes.push("no-runtime-holder-to-compare");

  return {
    productId: product.id,
    chain: snapshot?.chain ?? null,
    contractAddress,
    tokenId,
    expectedHolders: holders,
    observedOwner,
    observedBalance,
    sourceOwnershipSnapshotId: snapshot?.id ?? null,
    sourceBlockNumber: snapshot?.blockNumber ?? null,
    latestChainBlockNumber: latestBlock,
    status,
    stale,
    blockLag,
    reasonCodes
  };
}

export function buildOwnershipReconciliationSnapshot(store: MarketplaceStore): OwnershipReconciliationSnapshot {
  const records = store.products.filter(isNftBound).map((product) => buildRecord(store, product));
  return {
    id: `ownership-reconciliation-${crypto.randomUUID()}`,
    records,
    metrics: {
      productsChecked: records.length,
      verified: records.filter((record) => record.status === "verified").length,
      mismatches: records.filter((record) => record.status === "mismatch").length,
      stale: records.filter((record) => record.stale).length,
      missingSnapshots: records.filter((record) => record.status === "missing_snapshot").length,
      invalidAssets: records.filter((record) => record.status === "invalid_asset").length
    },
    consistencyChecks: {
      ownershipSnapshotsAvailable: (store.ownershipSnapshots ?? []).length > 0,
      licenseRuntimeCompared: (store.licenseRuntimes ?? []).length > 0,
      purchaseRuntimeCompared: store.purchases.length > 0,
      staleThresholdBlocks: STALE_THRESHOLD_BLOCKS
    },
    enforcementEnabled: false,
    chainReadsEnabled: false,
    generatedAt: new Date().toISOString()
  };
}

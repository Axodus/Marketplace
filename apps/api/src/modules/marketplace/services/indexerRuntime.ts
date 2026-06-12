import type {
  ChainIngestionEventEntity,
  ChainIngestionEventRequest,
  ChainSnapshotEntity,
  ListingSnapshotEntity,
  MarketplaceIndexerRuntimeSnapshot,
  MarketplaceStore,
  OwnershipSnapshotEntity,
  ProductEntity
} from "../dto/contracts.js";

function normalizeAddress(value: string) {
  return value.toLowerCase();
}

function getTenantId(product?: ProductEntity) {
  return typeof product?.tenantId === "string" ? product.tenantId : "tenant-axodus-dao";
}

function findProductForEvent(store: MarketplaceStore, event: ChainIngestionEventRequest) {
  const contractAddress = normalizeAddress(event.contractAddress);
  return store.products.find((product) => {
    const productContract = typeof product.contractAddress === "string" ? normalizeAddress(product.contractAddress) : null;
    const tokenId = typeof product.tokenId === "string" ? product.tokenId : null;
    return productContract === contractAddress && (!event.tokenId || tokenId === event.tokenId);
  });
}

function buildDedupeKey(input: ChainIngestionEventRequest) {
  return `${input.chain}:${input.transactionHash}:${input.logIndex}:${input.eventKind}`;
}

function listingStatus(eventKind: ChainIngestionEventRequest["eventKind"]): ListingSnapshotEntity["status"] {
  if (eventKind === "listing.created") return "active";
  if (eventKind === "listing.updated") return "updated";
  if (eventKind === "listing.cancelled") return "cancelled";
  if (eventKind === "auction.settled") return "settled";
  if (eventKind === "bid.placed") return "bid-active";
  return "unknown";
}

function shouldCreateOwnershipSnapshot(event: ChainIngestionEventEntity) {
  return event.eventKind === "nft.transfer" || event.eventKind === "ownership.verified";
}

function shouldCreateListingSnapshot(event: ChainIngestionEventEntity) {
  return (
    event.eventKind === "listing.created" ||
    event.eventKind === "listing.updated" ||
    event.eventKind === "listing.cancelled" ||
    event.eventKind === "auction.created" ||
    event.eventKind === "auction.settled" ||
    event.eventKind === "bid.placed"
  );
}

function upsertChainSnapshot(store: MarketplaceStore, event: ChainIngestionEventEntity): ChainSnapshotEntity {
  const snapshots = store.chainSnapshots ?? [];
  const existing = snapshots.find((snapshot) => snapshot.chain === event.chain);
  const contractsObserved = [...new Set([...(existing?.contractsObserved ?? []), event.contractAddress])];
  const snapshot: ChainSnapshotEntity = {
    id: existing?.id ?? `chain-snapshot-${crypto.randomUUID()}`,
    chain: event.chain,
    latestBlockNumber: Math.max(existing?.latestBlockNumber ?? 0, event.blockNumber),
    latestBlockHash: event.blockHash,
    eventsIngested: (existing?.eventsIngested ?? 0) + 1,
    contractsObserved,
    lastIngestedAt: event.ingestedAt,
    persistenceEnabled: true
  };
  store.chainSnapshots = [snapshot, ...snapshots.filter((item) => item.chain !== event.chain)];
  return snapshot;
}

function createOwnershipSnapshot(event: ChainIngestionEventEntity): OwnershipSnapshotEntity {
  return {
    id: `ownership-snapshot-${crypto.randomUUID()}`,
    chain: event.chain,
    productId: event.productId,
    contractAddress: event.contractAddress,
    tokenStandard: event.tokenStandard ?? "unknown",
    tokenId: event.tokenId ?? null,
    owner: event.owner ?? event.buyer ?? null,
    balance: event.amount ?? null,
    sourceEventId: event.id,
    blockNumber: event.blockNumber,
    stale: false,
    persistedAt: new Date().toISOString()
  };
}

function createListingSnapshot(event: ChainIngestionEventEntity, previous?: ListingSnapshotEntity): ListingSnapshotEntity {
  return {
    id: `listing-snapshot-${crypto.randomUUID()}`,
    chain: event.chain,
    productId: event.productId,
    listingId: event.listingId ?? previous?.listingId ?? null,
    contractAddress: event.contractAddress,
    status: listingStatus(event.eventKind),
    seller: event.seller ?? previous?.seller ?? null,
    bidder: event.bidder ?? previous?.bidder ?? null,
    price: event.price ?? previous?.price ?? null,
    highestBid: event.eventKind === "bid.placed" ? event.amount ?? previous?.highestBid ?? null : previous?.highestBid ?? null,
    bidCount: event.eventKind === "bid.placed" ? (previous?.bidCount ?? 0) + 1 : previous?.bidCount ?? 0,
    expiration: event.expiration ?? previous?.expiration ?? null,
    sourceEventId: event.id,
    blockNumber: event.blockNumber,
    persistedAt: new Date().toISOString()
  };
}

export function ingestChainEvent(store: MarketplaceStore, input: ChainIngestionEventRequest): ChainIngestionEventEntity {
  const existing = (store.chainIngestionEvents ?? []).find((event) => event.dedupeKey === buildDedupeKey(input));
  if (existing) return existing;

  const product = findProductForEvent(store, input);
  const event: ChainIngestionEventEntity = {
    ...input,
    id: `chain-event-${crypto.randomUUID()}`,
    productId: product?.id ?? null,
    tenantId: getTenantId(product),
    ingestedAt: new Date().toISOString(),
    replaySafe: true,
    dedupeKey: buildDedupeKey(input),
    liveSettlementEnabled: false,
    chainWriteEnabled: false
  };

  store.chainIngestionEvents = [event, ...(store.chainIngestionEvents ?? [])];
  upsertChainSnapshot(store, event);

  if (shouldCreateOwnershipSnapshot(event)) {
    store.ownershipSnapshots = [createOwnershipSnapshot(event), ...(store.ownershipSnapshots ?? [])];
  }

  if (shouldCreateListingSnapshot(event)) {
    const previous = (store.listingSnapshots ?? []).find((snapshot) => snapshot.listingId === event.listingId && snapshot.chain === event.chain);
    store.listingSnapshots = [createListingSnapshot(event, previous), ...(store.listingSnapshots ?? [])];
  }

  store.indexerRuntime = buildMarketplaceIndexerRuntimeSnapshot(store);
  return event;
}

export function buildMarketplaceIndexerRuntimeSnapshot(store: MarketplaceStore): MarketplaceIndexerRuntimeSnapshot {
  const events = store.chainIngestionEvents ?? [];
  return {
    id: `marketplace-indexer-runtime-${crypto.randomUUID()}`,
    chainSnapshots: store.chainSnapshots ?? [],
    ownershipSnapshots: store.ownershipSnapshots ?? [],
    listingSnapshots: store.listingSnapshots ?? [],
    metrics: {
      events: events.length,
      nftEvents: events.filter((event) => event.eventKind.startsWith("nft.")).length,
      listingEvents: events.filter((event) => event.eventKind.startsWith("listing.")).length,
      auctionEvents: events.filter((event) => event.eventKind.startsWith("auction.")).length,
      bidEvents: events.filter((event) => event.eventKind.startsWith("bid.")).length,
      ownershipEvents: events.filter((event) => event.eventKind.startsWith("ownership.")).length,
      chains: new Set(events.map((event) => event.chain)).size
    },
    ingestionEnabled: true,
    settlementEnabled: false,
    chainWritesEnabled: false,
    generatedAt: new Date().toISOString()
  };
}

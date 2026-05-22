import type { GreenfieldAuthRuntime, GreenfieldAuthRuntimeSnapshot, MarketplaceStore, ProductEntity } from "../dto/contracts.js";
import { buildEntitlementSnapshot } from "./entitlementRuntime.js";
import { evaluateEntitlementEnforcement } from "./entitlementEnforcementRuntime.js";

function valueAsString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function valueAsBoolean(value: unknown) {
  return value === true;
}

function findProduct(store: MarketplaceStore, idOrSlug: string) {
  return store.products.find((product) => product.id === idOrSlug || product.slug === idOrSlug);
}

function findOwnershipSnapshot(store: MarketplaceStore, product: ProductEntity) {
  const contractAddress = valueAsString(product.contractAddress);
  const tokenId = valueAsString(product.tokenId);
  return (store.ownershipSnapshots ?? [])
    .filter((snapshot) => snapshot.productId === product.id || snapshot.contractAddress === contractAddress)
    .filter((snapshot) => !tokenId || snapshot.tokenId === tokenId)
    .sort((left, right) => right.blockNumber - left.blockNumber)[0];
}

function signedUrlPreview(product: ProductEntity, allowed: boolean) {
  if (!allowed || !valueAsBoolean(product.signedUrlPreviewAvailable)) return null;
  return `https://greenfield.mock.axodus.local/access/${product.slug}?signature=auth-preview`;
}

function bucketScope(product: ProductEntity): GreenfieldAuthRuntime["bucket"]["scope"] {
  if (valueAsString(product.greenfieldBucket)) return "product";
  if (valueAsString(product.tenantId)) return "tenant";
  return "none";
}

export function buildGreenfieldAuthRuntime(store: MarketplaceStore, productId: string, holder = "0xMockBuyer...A11C", daoId?: string): GreenfieldAuthRuntime {
  const product = findProduct(store, productId);
  const now = new Date().toISOString();
  if (!product) {
    const entitlement = buildEntitlementSnapshot(store, holder, now);
    return {
      id: `greenfield-auth-${crypto.randomUUID()}`,
      productId,
      holder,
      bucket: {
        name: null,
        scope: "none",
        accessMode: "not-required",
        bucketAuthReady: false
      },
      ownership: {
        required: false,
        verified: false,
        source: "none",
        snapshotId: null
      },
      accessVerification: {
        status: "blocked-preview",
        reasons: ["product-not-found"],
        entitlementSnapshotId: entitlement.id,
        expiresAt: null
      },
      delivery: {
        deliveryType: "unknown",
        signedUrlPreview: null,
        productionSignedUrlEnabled: false,
        productionGreenfieldEnabled: false
      },
      authExecutionEnabled: false,
      externalGreenfieldCallEnabled: false,
      createdAt: now
    };
  }

  const entitlement = buildEntitlementSnapshot(store, holder, now);
  const permission = entitlement.deliveryPermissions.find((item) => item.productId === product.id);
  const activeLicense = entitlement.activeLicenses.some((licenseId) => (store.licenseRuntimes ?? []).some((license) => license.id === licenseId && license.productId === product.id));
  const activeSubscription = entitlement.activeSubscriptions.some((subscriptionId) =>
    store.subscriptions.some((subscription) => subscription.id === subscriptionId && subscription.productId === product.id)
  );
  const ownershipSnapshot = findOwnershipSnapshot(store, product);
  const ownershipRequired = valueAsBoolean(product.nftBound);
  const ownershipVerified = Boolean(ownershipSnapshot?.owner && ownershipSnapshot.owner === holder);
  const entitlementSatisfied = permission?.permission === "allowed-preview";
  const enforcement = evaluateEntitlementEnforcement(store, { productId: product.id, holder, daoId });
  const accessAllowed = enforcement.decision === "allowed" && (entitlementSatisfied || activeLicense || activeSubscription || (ownershipRequired && ownershipVerified));
  const reasons = [
    ...new Set([
      ...(permission?.reasons ?? []),
      ...(ownershipRequired && !ownershipVerified ? ["greenfield-nft-ownership-not-verified"] : []),
      ...(product.governanceStatus === "restricted" || product.governanceStatus === "suspended" ? [`greenfield-${product.governanceStatus}`] : [])
    ])
  ];
  const bucketName = valueAsString(product.greenfieldBucket) || null;
  const bucketAuthReady = Boolean(bucketName) && product.governanceStatus !== "restricted" && product.governanceStatus !== "suspended";

  return {
    id: `greenfield-auth-${crypto.randomUUID()}`,
    productId: product.id,
    holder,
    bucket: {
      name: bucketName,
      scope: bucketScope(product),
      accessMode: bucketName ? "bucket-auth-preview" : valueAsBoolean(product.signedUrlPreviewAvailable) ? "signed-url-preview" : "not-required",
      bucketAuthReady
    },
    ownership: {
      required: ownershipRequired,
      verified: ownershipVerified || activeLicense || activeSubscription,
      source: ownershipVerified ? "ownership_snapshot" : activeLicense ? "license" : activeSubscription ? "subscription" : "none",
      snapshotId: ownershipSnapshot?.id ?? null
    },
    accessVerification: {
      status: accessAllowed && bucketAuthReady ? "verified-preview" : bucketName || valueAsBoolean(product.signedUrlPreviewAvailable) ? "blocked-preview" : "not-required",
      reasons: accessAllowed && bucketAuthReady ? ["greenfield-access-preview-verified", "entitlement-enforcement-allowed"] : [...new Set([...reasons, ...Object.values(enforcement.checks).flatMap((check) => check.reasonCodes)])],
      entitlementSnapshotId: entitlement.id,
      expiresAt: accessAllowed && bucketAuthReady ? new Date(Date.now() + 30 * 60 * 1000).toISOString() : null
    },
    delivery: {
      deliveryType: valueAsString(product.deliveryType, "Manual Service"),
      signedUrlPreview: signedUrlPreview(product, accessAllowed && bucketAuthReady),
      productionSignedUrlEnabled: false,
      productionGreenfieldEnabled: false
    },
    authExecutionEnabled: false,
    externalGreenfieldCallEnabled: false,
    createdAt: now
  };
}

export function buildGreenfieldAuthSnapshot(records: GreenfieldAuthRuntime[]): GreenfieldAuthRuntimeSnapshot {
  return {
    id: `greenfield-auth-snapshot-${crypto.randomUUID()}`,
    records,
    metrics: {
      bucketsPrepared: records.filter((record) => record.bucket.bucketAuthReady).length,
      verifiedAccess: records.filter((record) => record.accessVerification.status === "verified-preview").length,
      blockedAccess: records.filter((record) => record.accessVerification.status === "blocked-preview").length,
      ownershipVerified: records.filter((record) => record.ownership.verified).length
    },
    productionGreenfieldEnabled: false,
    externalAuthEnabled: false,
    generatedAt: new Date().toISOString()
  };
}

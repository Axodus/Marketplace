import type {
  GovernanceAuthorityRecord,
  GovernanceEnforcementRecord,
  GovernanceEnforcementSnapshot,
  MarketplaceStore,
  ProductEntity,
  SellerEntity,
  TenantEntity
} from "../dto/contracts.js";
import { withGovernanceAuthority } from "./governanceAuthorityAdapter.js";

export function withGovernanceEnforcement(store: MarketplaceStore): MarketplaceStore {
  const authorityStore = store.governanceAuthority ? store : withGovernanceAuthority(store);
  const governanceEnforcement = buildGovernanceEnforcementSnapshot(authorityStore);
  return {
    ...authorityStore,
    governanceEnforcement,
    products: authorityStore.products.map((product) => ({
      ...product,
      governanceEnforcement: governanceEnforcement.records.find((record) => record.entityId === product.id)
    })),
    sellers: authorityStore.sellers.map((seller) => ({
      ...seller,
      governanceEnforcement: governanceEnforcement.records.find((record) => record.entityId === seller.id)
    })),
    tenants: authorityStore.tenants.map((tenant) => ({
      ...tenant,
      governanceEnforcement: governanceEnforcement.records.find((record) => record.entityId === tenant.id)
    }))
  };
}

export function buildGovernanceEnforcementSnapshot(store: MarketplaceStore, now = new Date().toISOString()): GovernanceEnforcementSnapshot {
  const authority = store.governanceAuthority ?? withGovernanceAuthority(store).governanceAuthority!;
  const records = [
    ...store.products.map((product) => productEnforcement(product, authority.records, now)),
    ...store.sellers.map((seller) => sellerEnforcement(seller, authority.records, now)),
    ...store.tenants.map((tenant) => tenantEnforcement(tenant, authority.records, now))
  ];
  const productRecords = records.filter((record) => record.entityType === "product");
  return {
    id: `governance-enforcement-${now}`,
    sourceAuthoritySnapshotId: authority.id,
    records,
    hiddenProductIds: productRecords.filter((record) => record.visibility.effectiveState === "hidden-preview").map((record) => record.entityId),
    restrictedProductIds: productRecords.filter((record) => record.severity === "restricted").map((record) => record.entityId),
    suspendedSellerIds: records
      .filter((record) => record.entityType === "seller" && record.severity === "suspended")
      .map((record) => record.entityId),
    restrictedTenantIds: records
      .filter((record) => record.entityType === "tenant" && ["restricted", "suspended", "emergency"].includes(record.severity))
      .map((record) => record.entityId),
    entitlementInvalidationPreviews: productRecords
      .filter((record) => record.entitlementImpact.entitlementInvalidationPreview)
      .map((record) => ({ productId: record.entityId, reasonCodes: record.entitlementImpact.reasonCodes })),
    hardBlockingEnabled: false,
    destructiveActionsEnabled: false,
    generatedAt: now
  };
}

function productEnforcement(product: ProductEntity, authorityRecords: GovernanceAuthorityRecord[], now: string): GovernanceEnforcementRecord {
  const authority = findAuthority(authorityRecords, product.id);
  const severity = getSeverity(authority);
  const approvalRequired = authority?.operationalApproval === "approval_required" || product.governanceStatus === "under-review";
  const hiddenPreview = severity === "suspended" || severity === "emergency";
  const restrictedPreview = severity === "restricted";
  const warningPreview = severity === "warning" || approvalRequired;
  const reasonCodes = [
    hiddenPreview ? "product-hidden-by-governance-preview" : null,
    restrictedPreview ? "product-restricted-by-governance-preview" : null,
    warningPreview ? "product-review-required-preview" : null,
    product.visibility === "private-preview" ? "private-preview-visibility" : null
  ].filter(Boolean) as string[];
  return {
    entityId: product.id,
    entityType: "product",
    authorityRef: authority?.entityId ?? product.id,
    severity,
    visibility: {
      requestedState: getString(product.visibility, "public"),
      effectiveState: hiddenPreview ? "hidden-preview" : restrictedPreview ? "limited-preview" : warningPreview ? "review-required-preview" : "visible",
      publicExplorerVisible: !hiddenPreview,
      detailPageVisible: true,
      storefrontVisible: !hiddenPreview,
      reasonCodes
    },
    commerce: {
      purchasePreviewAllowed: severity === "none" || severity === "warning",
      bidPreviewAllowed: (severity === "none" || severity === "warning") && product.listingType !== "license-preview",
      listingPreviewAllowed: severity !== "suspended" && severity !== "emergency",
      reasonCodes: commerceReasons(severity, approvalRequired)
    },
    entitlementImpact: {
      entitlementInvalidationPreview: restrictedPreview || hiddenPreview,
      subscriptionRestrictionPreview: restrictedPreview || hiddenPreview || product.accessModel === "subscription",
      licenseRestrictionPreview: restrictedPreview || hiddenPreview || Boolean(product.governanceRequired),
      governanceOverrideVisible: restrictedPreview || hiddenPreview || warningPreview,
      reasonCodes: entitlementReasons(severity, approvalRequired)
    },
    reviewQueue: {
      required: restrictedPreview || warningPreview || hiddenPreview,
      queue: hiddenPreview ? "emergency" : restrictedPreview ? "constitutional" : warningPreview ? "constitutional" : "none",
      reasonCodes
    },
    enforcementMode: "preview-only",
    hardBlockingEnabled: false,
    destructiveActionsEnabled: false,
    generatedAt: now
  };
}

function sellerEnforcement(seller: SellerEntity, authorityRecords: GovernanceAuthorityRecord[], now: string): GovernanceEnforcementRecord {
  const authority = findAuthority(authorityRecords, seller.id);
  const severity = getSeverity(authority);
  const reasonCodes = [
    severity === "suspended" ? "seller-storefront-suspended-preview" : null,
    severity === "restricted" ? "seller-publisher-restricted-preview" : null,
    severity === "warning" ? "seller-review-queue-preview" : null
  ].filter(Boolean) as string[];
  return {
    entityId: seller.id,
    entityType: "seller",
    authorityRef: authority?.entityId ?? seller.id,
    severity,
    visibility: {
      requestedState: getString(seller.governanceStanding, "verified"),
      effectiveState: severity === "suspended" ? "hidden-preview" : severity === "restricted" ? "limited-preview" : severity === "warning" ? "review-required-preview" : "visible",
      publicExplorerVisible: severity !== "suspended",
      detailPageVisible: true,
      storefrontVisible: severity !== "suspended",
      reasonCodes
    },
    commerce: {
      purchasePreviewAllowed: severity === "none" || severity === "warning",
      bidPreviewAllowed: severity === "none" || severity === "warning",
      listingPreviewAllowed: severity === "none" || severity === "warning",
      reasonCodes: commerceReasons(severity, severity === "warning")
    },
    entitlementImpact: {
      entitlementInvalidationPreview: severity === "restricted" || severity === "suspended" || severity === "emergency",
      subscriptionRestrictionPreview: severity !== "none",
      licenseRestrictionPreview: severity !== "none",
      governanceOverrideVisible: severity !== "none",
      reasonCodes: entitlementReasons(severity, severity === "warning")
    },
    reviewQueue: {
      required: severity !== "none",
      queue: severity === "suspended" || severity === "emergency" ? "emergency" : severity === "none" ? "none" : "seller",
      reasonCodes
    },
    enforcementMode: "preview-only",
    hardBlockingEnabled: false,
    destructiveActionsEnabled: false,
    generatedAt: now
  };
}

function tenantEnforcement(tenant: TenantEntity, authorityRecords: GovernanceAuthorityRecord[], now: string): GovernanceEnforcementRecord {
  const authority = findAuthority(authorityRecords, tenant.id);
  const severity = getSeverity(authority);
  const constitutionalReview = authority?.constitutionalStanding === "requires-review";
  const reasonCodes = [
    severity === "suspended" ? "tenant-frozen-preview" : null,
    severity === "restricted" ? "tenant-restricted-preview" : null,
    constitutionalReview ? "constitutional-review-required-preview" : null
  ].filter(Boolean) as string[];
  return {
    entityId: tenant.id,
    entityType: "tenant",
    authorityRef: authority?.entityId ?? tenant.id,
    severity: constitutionalReview && severity === "none" ? "warning" : severity,
    visibility: {
      requestedState: getString(tenant.governanceStanding, "verified"),
      effectiveState:
        severity === "suspended" || severity === "emergency"
          ? "hidden-preview"
          : severity === "restricted"
            ? "limited-preview"
            : constitutionalReview
              ? "review-required-preview"
              : "visible",
      publicExplorerVisible: severity !== "suspended" && severity !== "emergency",
      detailPageVisible: true,
      storefrontVisible: severity !== "suspended" && severity !== "emergency",
      reasonCodes
    },
    commerce: {
      purchasePreviewAllowed: severity === "none" || severity === "warning",
      bidPreviewAllowed: severity === "none" || severity === "warning",
      listingPreviewAllowed: severity === "none" || severity === "warning",
      reasonCodes: commerceReasons(severity, constitutionalReview)
    },
    entitlementImpact: {
      entitlementInvalidationPreview: severity === "restricted" || severity === "suspended" || severity === "emergency",
      subscriptionRestrictionPreview: severity !== "none" || constitutionalReview,
      licenseRestrictionPreview: severity !== "none" || constitutionalReview,
      governanceOverrideVisible: severity !== "none" || constitutionalReview,
      reasonCodes: entitlementReasons(severity, constitutionalReview)
    },
    reviewQueue: {
      required: severity !== "none" || constitutionalReview,
      queue: severity === "suspended" || severity === "emergency" ? "emergency" : severity === "none" && !constitutionalReview ? "none" : "tenant",
      reasonCodes
    },
    enforcementMode: "preview-only",
    hardBlockingEnabled: false,
    destructiveActionsEnabled: false,
    generatedAt: now
  };
}

function findAuthority(records: GovernanceAuthorityRecord[], entityId: string) {
  return records.find((record) => record.entityId === entityId);
}

function getSeverity(authority?: GovernanceAuthorityRecord): GovernanceEnforcementRecord["severity"] {
  if (authority?.emergencyState === "active") return "emergency";
  if (authority?.restrictionState === "suspended") return "suspended";
  if (authority?.restrictionState === "restricted") return "restricted";
  if (authority?.restrictionState === "warning" || authority?.operationalApproval === "approval_required") return "warning";
  return "none";
}

function commerceReasons(severity: GovernanceEnforcementRecord["severity"], approvalRequired: boolean) {
  return [
    severity === "restricted" ? "purchase-preview-restricted-by-governance" : null,
    severity === "suspended" || severity === "emergency" ? "commerce-preview-suspended-by-governance" : null,
    approvalRequired ? "governance-review-required-before-live-commerce" : null,
    "no-settlement-no-contract-write"
  ].filter(Boolean) as string[];
}

function entitlementReasons(severity: GovernanceEnforcementRecord["severity"], approvalRequired: boolean) {
  return [
    severity === "restricted" ? "active-entitlements-require-review-preview" : null,
    severity === "suspended" || severity === "emergency" ? "entitlement-invalidation-preview-required" : null,
    approvalRequired ? "license-and-subscription-review-preview" : null,
    "preview-only-no-access-revocation"
  ].filter(Boolean) as string[];
}

function getString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

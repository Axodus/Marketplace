import type {
  ConstitutionalInheritanceRecord,
  DAOFederationRuntimeSnapshot,
  DAOStorefrontRuntimeRecord,
  MarketplaceStore,
  TenantEntity,
  TenantRuntimeIsolationRecord
} from "../dto/contracts.js";

export function withDAOFederationRuntime(store: MarketplaceStore): MarketplaceStore {
  return {
    ...store,
    daoFederationRuntime: buildDAOFederationRuntime(store)
  };
}

export function buildDAOFederationRuntime(store: MarketplaceStore, now = new Date().toISOString()): DAOFederationRuntimeSnapshot {
  const storefronts = store.tenants.map((tenant) => buildStorefrontRuntime(store, tenant));
  const tenantIsolation = store.tenants.map((tenant) => buildTenantIsolation(store, tenant));
  const constitutionalInheritance = store.tenants.map((tenant) => buildInheritance(store, tenant));
  const reviewRequiredStorefronts = storefronts.filter((storefront) => storefront.activationState === "review-required-preview").length;
  const restrictedStorefronts = storefronts.filter((storefront) =>
    ["restricted-preview", "frozen-preview"].includes(storefront.activationState)
  ).length;

  return {
    id: `dao-federation-${now}`,
    storefronts,
    tenantIsolation,
    constitutionalInheritance,
    federationMetrics: {
      tenants: store.tenants.length,
      activeStorefronts: storefronts.filter((storefront) => storefront.activationState === "active-preview").length,
      reviewRequiredStorefronts,
      restrictedStorefronts,
      federationHealth: restrictedStorefronts > 0 ? "restricted-preview" : reviewRequiredStorefronts > 0 ? "warning-preview" : "healthy-preview",
      governanceActivity: getGovernanceActivity(store),
      operationalVisibility: "preview-only"
    },
    publicActivationEnabled: false,
    settlementEnabled: false,
    generatedAt: now
  };
}

function buildStorefrontRuntime(store: MarketplaceStore, tenant: TenantEntity): DAOStorefrontRuntimeRecord {
  const storefront = store.storefronts?.find((item) => item.type === "tenant" && item.ownerId === tenant.id);
  const enforcement = store.governanceEnforcement?.records.find((record) => record.entityId === tenant.id);
  const productIds = store.products.filter((product) => getTenantId(product) === tenant.id).map((product) => product.id);
  const sellerIds = store.sellers.filter((seller) => productIds.some((productId) => store.products.find((product) => product.id === productId)?.sellerId === seller.id)).map((seller) => seller.id);
  const invoices = (store.invoices ?? []).filter((invoice) => invoice.productReferences.some((productId) => productIds.includes(productId)));
  const licenses = (store.licenseRuntimes ?? []).filter((license) => productIds.includes(license.productId));
  const subscriptions = (store.subscriptions ?? []).filter((subscription) => productIds.includes(subscription.productId));
  const inheritedRestrictions = getInheritedRestrictions(store, tenant);

  return {
    tenantId: tenant.id,
    storefrontId: storefront?.id ?? `storefront-tenant-${tenant.id}`,
    slug: storefront?.slug ?? tenant.id.replace(/^tenant-/, ""),
    activationState: getActivationState(tenant, enforcement?.severity, inheritedRestrictions),
    operationalStatus: getOperationalStatus(tenant, enforcement?.severity, inheritedRestrictions),
    governanceVisibility: {
      authorityState: getString(tenant.governanceStanding, "warning"),
      enforcementState: enforcement?.visibility.effectiveState ?? "visible",
      inheritedRestrictions,
      publicActivationEnabled: false
    },
    daoOwnedProductIds: productIds,
    metrics: {
      products: productIds.length,
      activeProducts: productIds.filter((productId) => store.products.find((product) => product.id === productId)?.status === "listed").length,
      restrictedProducts: productIds.filter((productId) => {
        const product = store.products.find((item) => item.id === productId);
        return product?.governanceStatus === "restricted" || product?.governanceStatus === "suspended";
      }).length,
      sellers: sellerIds.length,
      invoices: invoices.length,
      activeLicenses: licenses.filter((license) => license.state === "active" || license.state === "issued").length,
      activeSubscriptions: subscriptions.filter((subscription) => subscription.status === "active" || subscription.status === "renewal_due").length
    }
  };
}

function buildTenantIsolation(store: MarketplaceStore, tenant: TenantEntity): TenantRuntimeIsolationRecord {
  const productIds = store.products.filter((product) => getTenantId(product) === tenant.id).map((product) => product.id);
  const sellerIds = [...new Set(store.products.filter((product) => productIds.includes(product.id)).map((product) => product.sellerId))];
  return {
    tenantId: tenant.id,
    boundary: {
      productIds,
      sellerIds,
      invoiceIds: (store.invoices ?? [])
        .filter((invoice) => invoice.productReferences.some((productId) => productIds.includes(productId)))
        .map((invoice) => invoice.id),
      licenseIds: (store.licenseRuntimes ?? []).filter((license) => productIds.includes(license.productId)).map((license) => license.id),
      subscriptionIds: (store.subscriptions ?? []).filter((subscription) => productIds.includes(subscription.productId)).map((subscription) => subscription.id),
      entitlementSnapshotIds: (store.entitlementSnapshots ?? []).filter((snapshot) => snapshot.ownedProducts.some((productId) => productIds.includes(productId))).map((snapshot) => snapshot.id),
      governanceRecordIds: [
        tenant.id,
        ...productIds,
        ...sellerIds
      ].filter((entityId) => Boolean(store.governanceAuthority?.records.some((record) => record.entityId === entityId)))
    },
    scopedRuntime: {
      productsScoped: true,
      billingScoped: true,
      entitlementsScoped: true,
      governanceScoped: true,
      crossTenantSettlementEnabled: false
    }
  };
}

function buildInheritance(store: MarketplaceStore, tenant: TenantEntity): ConstitutionalInheritanceRecord {
  const parentTenantId = getNullableString(tenant.parentTenantId);
  const parent = parentTenantId ? store.tenants.find((item) => item.id === parentTenantId) : undefined;
  const inheritedRestrictions = getInheritedRestrictions(store, tenant);
  return {
    tenantId: tenant.id,
    parentTenantId,
    federationTier: getString(tenant.federationTier, "provisional"),
    inheritedRestrictions,
    inheritedVisibilityRules: [
      parent?.governanceStanding === "restricted" || parent?.governanceStanding === "suspended" ? "parent-restriction-limits-storefront-preview" : null,
      tenant.governanceStanding === "warning" ? "tenant-warning-requires-review-preview" : null,
      getString(tenant.constitutionalStanding, "requires-review") !== "aligned" ? "constitutional-standing-review-preview" : null
    ].filter(Boolean) as string[],
    inheritedGovernanceStanding: parent?.governanceStanding ?? getString(tenant.governanceStanding, "warning"),
    inheritedFederationMetadata: {
      rootAuthority: "Axodus Constitutional Governance",
      operationalAuthority: getString(parent?.operationalAuthority ?? tenant.operationalAuthority, "Federation Operations"),
      inheritanceMode: "preview-only"
    }
  };
}

function getInheritedRestrictions(store: MarketplaceStore, tenant: TenantEntity) {
  const parentTenantId = getNullableString(tenant.parentTenantId);
  const parent = parentTenantId ? store.tenants.find((item) => item.id === parentTenantId) : undefined;
  return [
    parent?.governanceStanding === "restricted" ? "parent-tenant-restricted-preview" : null,
    parent?.governanceStanding === "suspended" ? "parent-tenant-suspended-preview" : null,
    tenant.governanceStanding === "warning" ? "tenant-warning-inherited-review-preview" : null,
    getString(tenant.constitutionalStanding, "requires-review") !== "aligned" ? "constitutional-review-inherited-preview" : null
  ].filter(Boolean) as string[];
}

function getActivationState(
  tenant: TenantEntity,
  severity: string | undefined,
  inheritedRestrictions: string[]
): DAOStorefrontRuntimeRecord["activationState"] {
  if (severity === "suspended" || severity === "emergency") return "frozen-preview";
  if (severity === "restricted" || tenant.governanceStanding === "restricted") return "restricted-preview";
  if (severity === "warning" || inheritedRestrictions.length > 0 || tenant.governanceStanding === "warning") return "review-required-preview";
  return "active-preview";
}

function getOperationalStatus(
  tenant: TenantEntity,
  severity: string | undefined,
  inheritedRestrictions: string[]
): DAOStorefrontRuntimeRecord["operationalStatus"] {
  if (severity === "suspended" || severity === "emergency") return "frozen-preview";
  if (severity === "restricted" || tenant.governanceStanding === "restricted") return "restricted-preview";
  if (severity === "warning" || inheritedRestrictions.length > 0 || tenant.governanceStanding === "warning") return "warning-preview";
  return "operational-preview";
}

function getGovernanceActivity(store: MarketplaceStore) {
  const validationCount = store.governanceValidations.length;
  const authorityWarnings = store.governanceAuthority?.records.filter((record) => record.warnings.length > 0 || record.sanctions.length > 0).length ?? 0;
  const enforcementReviews = store.governanceEnforcement?.records.filter((record) => record.reviewQueue.required).length ?? 0;
  return validationCount + authorityWarnings + enforcementReviews;
}

function getTenantId(product: { tenantId?: unknown }) {
  return getString(product.tenantId, "tenant-axodus-dao");
}

function getString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function getNullableString(value: unknown) {
  return typeof value === "string" && value.trim() ? value : null;
}

import type { EntitlementEnforcementRecord, EntitlementEnforcementSnapshot, MarketplaceStore, ProductEntity, TenantEntity } from "../dto/contracts.js";

function valueAsString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function findProduct(store: MarketplaceStore, productId: string) {
  return store.products.find((product) => product.id === productId || product.slug === productId);
}

function findTenant(store: MarketplaceStore, product?: ProductEntity) {
  return store.tenants.find((tenant) => tenant.id === product?.tenantId);
}

function isDaoMatch(tenant: TenantEntity | undefined, daoId?: string) {
  if (!tenant || !daoId) return false;
  const normalized = daoId.trim().toLowerCase();
  return normalized === tenant.id.toLowerCase() || normalized === tenant.name.toLowerCase();
}

function licenseCheck(store: MarketplaceStore, product: ProductEntity | undefined, holder: string) {
  const accessModel = valueAsString(product?.accessModel);
  const required = Boolean(product) && accessModel !== "public" && accessModel !== "subscription" && accessModel !== "dao-gated";
  const license = (store.licenseRuntimes ?? []).find(
    (item) => item.productId === product?.id && item.holder === holder && (item.state === "active" || item.state === "issued")
  );
  const valid = !required || Boolean(license);
  return {
    required,
    valid,
    licenseRuntimeId: license?.id ?? null,
    reasonCodes: valid ? ["license-valid"] : ["license-required"]
  };
}

function subscriptionCheck(store: MarketplaceStore, product: ProductEntity | undefined, holder: string) {
  const required =
    Boolean(product) && (valueAsString(product?.accessModel) === "subscription" || valueAsString(product?.licenseType).toLowerCase().includes("subscription"));
  const subscription = store.subscriptions.find(
    (item) => item.productId === product?.id && item.holder === holder && (item.status === "active" || item.status === "renewal_due")
  );
  const valid = !required || Boolean(subscription);
  return {
    required,
    valid,
    subscriptionId: subscription?.id ?? null,
    reasonCodes: valid ? ["subscription-valid"] : ["subscription-required"]
  };
}

function daoCheck(store: MarketplaceStore, product: ProductEntity | undefined, daoId?: string) {
  const required = Boolean(product) && (valueAsString(product?.accessModel) === "dao-gated" || valueAsString(product?.visibility) === "dao-gated");
  const tenant = findTenant(store, product);
  const valid = !required || isDaoMatch(tenant, daoId);
  return {
    required,
    valid,
    tenantId: tenant?.id ?? null,
    reasonCodes: valid ? ["dao-access-valid"] : ["dao-access-required"]
  };
}

function governanceCheck(product: ProductEntity | undefined, tenant?: TenantEntity) {
  if (!product) {
    return { valid: false, standing: "missing", reasonCodes: ["product-not-found"] };
  }
  const productStanding = valueAsString(product.governanceStatus, "unknown");
  const tenantStanding = valueAsString(tenant?.governanceStanding, "unknown");
  const blocking = productStanding === "restricted" || productStanding === "suspended" || tenantStanding === "restricted" || tenantStanding === "suspended";
  const review = productStanding === "under-review" || tenantStanding === "warning";
  return {
    valid: !blocking,
    standing: `${productStanding}:${tenantStanding}`,
    reasonCodes: blocking ? ["governance-blocked"] : review ? ["governance-review-required"] : ["governance-valid"]
  };
}

export function evaluateEntitlementEnforcement(
  store: MarketplaceStore,
  input: { productId: string; holder?: string; daoId?: string }
): EntitlementEnforcementRecord {
  const holder = input.holder?.trim() || "0xMockBuyer...A11C";
  const product = findProduct(store, input.productId);
  const tenant = findTenant(store, product);
  const license = licenseCheck(store, product, holder);
  const subscription = subscriptionCheck(store, product, holder);
  const dao = daoCheck(store, product, input.daoId);
  const governance = governanceCheck(product, tenant);
  const hardDenied = !product || !license.valid || !subscription.valid || !dao.valid || !governance.valid;
  const reviewRequired = !hardDenied && governance.reasonCodes.includes("governance-review-required");
  const decision = hardDenied ? "denied" : reviewRequired ? "review_required" : "allowed";

  return {
    id: `entitlement-enforcement-${crypto.randomUUID()}`,
    productId: product?.id ?? input.productId,
    holder,
    daoId: input.daoId ?? null,
    decision,
    checks: {
      license,
      subscription,
      dao,
      governance
    },
    deliveryAllowed: decision === "allowed",
    signedUrlAllowed: decision === "allowed",
    enforcementApplied: true,
    settlementEnabled: false,
    walletExecutionEnabled: false,
    generatedAt: new Date().toISOString()
  };
}

export function buildEntitlementEnforcementSnapshot(records: EntitlementEnforcementRecord[]): EntitlementEnforcementSnapshot {
  return {
    id: `entitlement-enforcement-snapshot-${crypto.randomUUID()}`,
    records,
    metrics: {
      allowed: records.filter((record) => record.decision === "allowed").length,
      denied: records.filter((record) => record.decision === "denied").length,
      reviewRequired: records.filter((record) => record.decision === "review_required").length,
      licenseFailures: records.filter((record) => record.checks.license.required && !record.checks.license.valid).length,
      subscriptionFailures: records.filter((record) => record.checks.subscription.required && !record.checks.subscription.valid).length,
      daoFailures: records.filter((record) => record.checks.dao.required && !record.checks.dao.valid).length
    },
    enforcementOperational: true,
    settlementEnabled: false,
    walletExecutionEnabled: false,
    generatedAt: new Date().toISOString()
  };
}

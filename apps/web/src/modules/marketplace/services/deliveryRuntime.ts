import type { License, Product, PurchaseRecord, Seller } from "../types/marketplace";
import { getLicenseForProduct, getSellerById } from "./marketplaceService";

export type DeliveryAssetKind =
  | "downloadable-asset"
  | "protected-asset"
  | "streamed-asset"
  | "acs-package"
  | "educational-asset"
  | "enterprise-bundle";

export type DeliveryAuthorizationState =
  | "preview-issued"
  | "entitlement-required"
  | "license-required"
  | "subscription-required"
  | "dao-approval-required"
  | "governance-restricted"
  | "expired"
  | "revoked";

export type SignedUrlLifecycle = "not-required" | "preview" | "issued" | "expired" | "revoked" | "blocked";

export interface EntitlementContext {
  walletConnected?: boolean;
  ownsNft?: boolean;
  hasActiveSubscription?: boolean;
  hasActiveLicense?: boolean;
  daoApproved?: boolean;
  accessRevoked?: boolean;
  accessExpired?: boolean;
}

export interface DeliveryRuntime {
  service: "DeliveryRuntime";
  mode: "mock-only";
  productId: string;
  assetKind: DeliveryAssetKind;
  protectedAsset: boolean;
  entitlementRequired: boolean;
  authorizationState: DeliveryAuthorizationState;
  deliveryExecutionEnabled: false;
  productionGreenfieldEnabled: false;
  ownershipValidationEnabled: false;
  subscriptionValidationEnabled: false;
  licenseValidationEnabled: false;
  daoValidationEnabled: false;
  telemetryEnabled: true;
  labels: string[];
  reasonCodes: string[];
}

export interface SignedUrlPreview {
  adapter: "GreenfieldAccessAdapter";
  mode: "mock-only";
  productId: string;
  lifecycle: SignedUrlLifecycle;
  signedUrl: string | null;
  expiresAt: string | null;
  revokedAt: string | null;
  authorizationState: DeliveryAuthorizationState;
  deliveryExecutionEnabled: false;
  productionGreenfieldEnabled: false;
  reasonCodes: string[];
  disclaimer: string;
}

export interface DeliveryTelemetryEvent {
  id: string;
  type: "delivery-event" | "entitlement-check" | "access-attempt" | "revocation" | "preview-issuance";
  productId: string;
  severity: "info" | "warning" | "blocked";
  message: string;
  createdAt: string;
}

const previewNow = "2026-05-21T00:00:00.000Z";

export function getDeliveryRuntime(product: Product, context: EntitlementContext = {}): DeliveryRuntime {
  const assetKind = resolveDeliveryAssetKind(product);
  const protectedAsset = product.visibility !== "public" || product.accessModel !== "public" || product.governanceRequired;
  const entitlementRequired = product.accessModel !== "public" || product.nftBound || product.licenseType !== "Personal Use";
  const authorizationState = resolveAuthorizationState(product, context);
  const labels = [
    protectedAsset ? "Protected asset" : "Public preview",
    entitlementRequired ? "Entitlement required" : "Open preview",
    product.governanceStatus === "restricted" ? "Governance restricted" : null,
    context.accessRevoked ? "Access revoked" : null,
    context.accessExpired ? "Access expired" : null,
    "Preview only",
    "No production delivery"
  ].filter(Boolean) as string[];

  return {
    service: "DeliveryRuntime",
    mode: "mock-only",
    productId: product.id,
    assetKind,
    protectedAsset,
    entitlementRequired,
    authorizationState,
    deliveryExecutionEnabled: false,
    productionGreenfieldEnabled: false,
    ownershipValidationEnabled: false,
    subscriptionValidationEnabled: false,
    licenseValidationEnabled: false,
    daoValidationEnabled: false,
    telemetryEnabled: true,
    labels,
    reasonCodes: getDeliveryReasonCodes(product, context, authorizationState)
  };
}

export function getEntitlementEnforcementPreview(product: Product, context: EntitlementContext = {}) {
  const license = getLicenseForProduct(product);
  const seller = getSellerById(product.sellerId);
  const checks = [
    buildCheck("ownership", product.nftBound, Boolean(context.ownsNft), "ownership validation boundary"),
    buildCheck("subscription", product.accessModel === "subscription" || product.licenseType === "Subscription License", Boolean(context.hasActiveSubscription), "subscription-gated delivery"),
    buildCheck("license", Boolean(product.licenseType), Boolean(context.hasActiveLicense), "license-gated delivery"),
    buildCheck("dao", product.visibility === "dao-gated" || product.accessModel === "dao-gated", Boolean(context.daoApproved), "DAO-gated delivery"),
    buildCheck("governance", product.governanceStatus === "restricted" || product.governanceStatus === "suspended", false, "governance restriction")
  ];

  return {
    service: "EntitlementEnforcementRuntime",
    mode: "mock-only",
    productId: product.id,
    licenseId: license.id,
    sellerStanding: seller?.governanceStanding ?? "restricted",
    checks,
    eligible: checks.every((check) => !check.required || check.previewSatisfied),
    authorizationState: getDeliveryRuntime(product, context).authorizationState,
    enforcementEnabled: false,
    ownershipValidationEnabled: false,
    subscriptionValidationEnabled: false,
    licenseValidationEnabled: false,
    daoValidationEnabled: false,
    governanceRestrictionEnabled: true
  };
}

export function createSignedUrlPreview(product: Product, context: EntitlementContext = {}): SignedUrlPreview {
  const runtime = getDeliveryRuntime(product, context);
  const blocked = runtime.authorizationState === "governance-restricted" || runtime.authorizationState === "revoked";
  const expired = runtime.authorizationState === "expired";
  const lifecycle: SignedUrlLifecycle = !product.signedUrlPreviewAvailable
    ? "not-required"
    : blocked
      ? "blocked"
      : expired
        ? "expired"
        : "preview";

  return {
    adapter: "GreenfieldAccessAdapter",
    mode: "mock-only",
    productId: product.id,
    lifecycle,
    signedUrl: lifecycle === "preview" ? buildSignedUrl(product) : null,
    expiresAt: lifecycle === "preview" ? "2026-05-21T00:15:00.000Z" : null,
    revokedAt: runtime.authorizationState === "revoked" ? previewNow : null,
    authorizationState: runtime.authorizationState,
    deliveryExecutionEnabled: false,
    productionGreenfieldEnabled: false,
    reasonCodes: runtime.reasonCodes,
    disclaimer: "Signed URL is a preview only. No production Greenfield delivery or authorization call is executed."
  };
}

export function buildDeliveryTelemetry(products: Product[]): DeliveryTelemetryEvent[] {
  return products.flatMap((product) => {
    const runtime = getDeliveryRuntime(product);
    const signedUrl = createSignedUrlPreview(product);
    const events: DeliveryTelemetryEvent[] = [
      {
        id: `entitlement-${product.id}`,
        type: "entitlement-check",
        productId: product.id,
        severity: runtime.authorizationState === "governance-restricted" ? "blocked" : runtime.entitlementRequired ? "warning" : "info",
        message: `${runtime.assetKind} entitlement preview: ${runtime.authorizationState}`,
        createdAt: previewNow
      },
      {
        id: `access-attempt-${product.id}`,
        type: "access-attempt",
        productId: product.id,
        severity: signedUrl.lifecycle === "blocked" ? "blocked" : "info",
        message: `Access attempt preview: ${signedUrl.lifecycle}`,
        createdAt: previewNow
      }
    ];

    if (signedUrl.lifecycle === "preview") {
      events.push({
        id: `signed-url-${product.id}`,
        type: "preview-issuance",
        productId: product.id,
        severity: "info",
        message: "Signed URL preview issued with mock expiration.",
        createdAt: previewNow
      });
    }

    if (runtime.authorizationState === "revoked" || runtime.authorizationState === "governance-restricted") {
      events.push({
        id: `revocation-${product.id}`,
        type: "revocation",
        productId: product.id,
        severity: "blocked",
        message: "Access revocation or governance block visible in delivery telemetry.",
        createdAt: previewNow
      });
    }

    return events;
  });
}

export function getDeliveryTelemetrySummary(products: Product[]) {
  const events = buildDeliveryTelemetry(products);
  return {
    service: "DeliveryTelemetryRuntime",
    mode: "mock-only",
    events,
    deliveryEvents: events.filter((event) => event.type === "delivery-event").length,
    entitlementChecks: events.filter((event) => event.type === "entitlement-check").length,
    accessAttempts: events.filter((event) => event.type === "access-attempt").length,
    revocations: events.filter((event) => event.type === "revocation").length,
    previewIssuance: events.filter((event) => event.type === "preview-issuance").length,
    blockedEvents: events.filter((event) => event.severity === "blocked").length,
    telemetryExecutionEnabled: false
  };
}

export function getPurchaseDeliveryPreview(product: Product, purchase?: PurchaseRecord) {
  const context: EntitlementContext = {
    hasActiveLicense: purchase?.status === "mock-issued" || purchase?.status === "pending-governance-review",
    ownsNft: product.nftBound && purchase?.status !== "blocked",
    daoApproved: product.visibility !== "dao-gated",
    hasActiveSubscription: product.licenseType !== "Subscription License",
    accessRevoked: purchase?.status === "blocked"
  };

  return {
    runtime: getDeliveryRuntime(product, context),
    entitlement: getEntitlementEnforcementPreview(product, context),
    signedUrl: createSignedUrlPreview(product, context)
  };
}

function resolveDeliveryAssetKind(product: Product): DeliveryAssetKind {
  if (product.deliveryType === "MCP Runtime" || product.category === "MCPs") return "acs-package";
  if (product.category === "Education") return "educational-asset";
  if (product.licenseType === "Enterprise License") return "enterprise-bundle";
  if (product.deliveryType === "Dashboard Access") return "streamed-asset";
  if (product.deliveryType === "Greenfield" || product.deliveryType === "Signed URL") return "protected-asset";
  return "downloadable-asset";
}

function resolveAuthorizationState(product: Product, context: EntitlementContext): DeliveryAuthorizationState {
  if (context.accessRevoked) return "revoked";
  if (context.accessExpired) return "expired";
  if (product.governanceStatus === "restricted" || product.governanceStatus === "suspended") return "governance-restricted";
  if (product.visibility === "dao-gated" || product.accessModel === "dao-gated") return context.daoApproved ? "preview-issued" : "dao-approval-required";
  if (product.accessModel === "subscription" || product.licenseType === "Subscription License") {
    return context.hasActiveSubscription ? "preview-issued" : "subscription-required";
  }
  if (product.licenseType && !context.hasActiveLicense) return "license-required";
  if (product.nftBound && !context.ownsNft) return "entitlement-required";
  return "preview-issued";
}

function getDeliveryReasonCodes(product: Product, context: EntitlementContext, authorizationState: DeliveryAuthorizationState) {
  return [
    authorizationState,
    product.signedUrlPreviewAvailable ? "signed-url-preview-ready" : "signed-url-preview-unavailable",
    product.greenfieldBucket ? "greenfield-bucket-modeled" : null,
    product.nftBound ? "ownership-boundary-required" : null,
    product.licenseType ? "license-boundary-required" : null,
    product.visibility === "dao-gated" ? "dao-approval-boundary-required" : null,
    context.accessRevoked ? "access-revoked" : null,
    context.accessExpired ? "access-expired" : null,
    "mock-only",
    "no-production-greenfield-execution"
  ].filter(Boolean) as string[];
}

function buildCheck(id: string, required: boolean, previewSatisfied: boolean, label: string) {
  return {
    id,
    label,
    required,
    previewSatisfied: required ? previewSatisfied : true,
    enforcementEnabled: false
  };
}

function buildSignedUrl(product: Product) {
  const bucket = product.greenfieldBucket ?? "mock-greenfield-default";
  return `https://greenfield.mock.axodus.local/${bucket}/access/${product.slug}?signature=preview&expires=900`;
}

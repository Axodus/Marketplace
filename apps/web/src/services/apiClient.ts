import {
  filterAndSortProducts,
  getProductBySlug,
  listLicenses as listMockLicenses,
  listProducts as listMockProducts,
  listSellers as listMockSellers,
  type ProductFilters
} from "../modules/marketplace/services/marketplaceService";
import { createDraftListingPreview, issueMockPurchase } from "../modules/marketplace/services/marketplaceService";
import type { DraftListingInput, License, Product, PurchaseRecord, Seller } from "../modules/marketplace/types/marketplace";

interface ApiEnvelope<T> {
  data: T;
  mode: "mock-persistent";
  runtime: {
    source: "marketplace-api";
    persisted: boolean;
    settlementEnabled: false;
    walletExecutionEnabled: false;
    blockchainWritesEnabled: false;
  };
}

export interface MarketplaceRuntimeSnapshot {
  products: Product[];
  sellers: Seller[];
  tenants: Array<Record<string, unknown>>;
  productRegistry?: ProductRegistryRecord[];
  sellerRegistry?: SellerRegistryRecord[];
  tenantRegistry?: TenantRegistryRecord[];
  storefronts?: StorefrontView[];
  daoFederationRuntime?: DAOFederationRuntimeSnapshot;
  governanceEnforcement?: GovernanceEnforcementSnapshot;
  licenses: License[];
  purchases: PurchaseRecord[];
  subscriptions: Array<Record<string, unknown>>;
  billingPreviews: Array<Record<string, unknown>>;
  governanceValidations: Array<Record<string, unknown>>;
  draftListings: Array<Record<string, unknown>>;
  deliveryPreviews: Array<Record<string, unknown>>;
  events: Array<Record<string, unknown>>;
}

export interface BillingPreview {
  id: string;
  productId: string;
  buyer: string;
  amount: number;
  currency: string;
  platformFee: number;
  royaltyPreview: number;
  sellerNetPreview: number;
  status: "invoice-preview";
  settlementEnabled: false;
  createdAt: string;
}

export interface ProductRegistryRecord {
  canonicalEntityId: string;
  productId: string;
  slug: string;
  title: string;
  sellerId: string;
  tenantId: string;
  ownership: {
    ownerType: "tenant" | "seller";
    ownerId: string;
    publisherId: string;
    governanceAuthority: string;
  };
  visibilityState: string;
  lifecycleState: string;
  governanceStanding: string;
  supportedChains: string[];
  licenseModel: string;
  nftMetadata: {
    tokenStandard: string;
    contractAddress: string | null;
    tokenId: string | null;
    nftBound: boolean;
  };
  royaltyMetadata: {
    standard: string;
    bps: number;
    recipient: string;
  };
  deliveryMetadata: {
    deliveryType: string;
    greenfieldBucket: string | null;
    signedUrlPreviewAvailable: boolean;
  };
  versioning: {
    currentVersion: string;
    previousVersions: string[];
    archived: boolean;
    deprecated: boolean;
    updatedAt: string | null;
  };
}

export interface SellerRegistryRecord {
  sellerId: string;
  publisherIdentity: {
    name: string;
    type: string;
    verificationState: string;
  };
  standing: string;
  tenantRelationship: {
    tenantIds: string[];
    registeredDAOs: string[];
    primaryTenantId: string | null;
  };
  storefront: {
    storefrontId: string;
    slug: string;
    title: string;
    operationalStatus: string;
  };
}

export interface TenantRegistryRecord {
  tenantId: string;
  name: string;
  daoEntityId: string;
  federationTier: string;
  governanceStanding: string;
  constitutionalMetadata: {
    standing: string;
    restrictions: string[];
    authority: string;
  };
  ownershipHierarchy: {
    parentTenantId: string | null;
    sellerIds: string[];
    productIds: string[];
  };
  storefrontOwnership: {
    storefrontId: string;
    slug: string;
    publicActivationEnabled: false;
  };
}

export interface StorefrontView {
  id: string;
  type: "seller" | "tenant";
  ownerId: string;
  slug: string;
  title: string;
  description: string;
  governance: {
    standing: string;
    constitutionalStanding: string;
    federationTier: string;
    warnings: string[];
    restrictions: string[];
  };
  metrics: {
    products: number;
    activeProducts: number;
    restrictedProducts: number;
    nftBoundProducts: number;
    sellers: number;
  };
  productIds: string[];
  sellerIds: string[];
  activationEnabled: false;
}

export interface DAOStorefrontRuntimeRecord {
  tenantId: string;
  storefrontId: string;
  slug: string;
  activationState: "active-preview" | "review-required-preview" | "restricted-preview" | "frozen-preview";
  operationalStatus: "operational-preview" | "warning-preview" | "restricted-preview" | "frozen-preview";
  governanceVisibility: {
    authorityState: string;
    enforcementState: string;
    inheritedRestrictions: string[];
    publicActivationEnabled: false;
  };
  daoOwnedProductIds: string[];
  metrics: {
    products: number;
    activeProducts: number;
    restrictedProducts: number;
    sellers: number;
    invoices: number;
    activeLicenses: number;
    activeSubscriptions: number;
  };
}

export interface TenantRuntimeIsolationRecord {
  tenantId: string;
  boundary: {
    productIds: string[];
    sellerIds: string[];
    invoiceIds: string[];
    licenseIds: string[];
    subscriptionIds: string[];
    entitlementSnapshotIds: string[];
    governanceRecordIds: string[];
  };
  scopedRuntime: {
    productsScoped: true;
    billingScoped: true;
    entitlementsScoped: true;
    governanceScoped: true;
    crossTenantSettlementEnabled: false;
  };
}

export interface ConstitutionalInheritanceRecord {
  tenantId: string;
  parentTenantId: string | null;
  federationTier: string;
  inheritedRestrictions: string[];
  inheritedVisibilityRules: string[];
  inheritedGovernanceStanding: string;
  inheritedFederationMetadata: {
    rootAuthority: string;
    operationalAuthority: string;
    inheritanceMode: "preview-only";
  };
}

export interface DAOFederationRuntimeSnapshot {
  id: string;
  storefronts: DAOStorefrontRuntimeRecord[];
  tenantIsolation: TenantRuntimeIsolationRecord[];
  constitutionalInheritance: ConstitutionalInheritanceRecord[];
  federationMetrics: {
    tenants: number;
    activeStorefronts: number;
    reviewRequiredStorefronts: number;
    restrictedStorefronts: number;
    federationHealth: "healthy-preview" | "warning-preview" | "restricted-preview";
    governanceActivity: number;
    operationalVisibility: "preview-only";
  };
  publicActivationEnabled: false;
  settlementEnabled: false;
  generatedAt: string;
}

export interface LicenseRuntimeRecord {
  id: string;
  licenseDefinitionId: string;
  productId: string;
  holder: string;
  sellerId: string;
  tenantId: string;
  state: "preview" | "issued" | "active" | "suspended" | "expired" | "revoked";
  issuedFromPurchaseId?: string;
  issuedAt: string;
  expiresAt: string | null;
  suspendedAt: string | null;
  revokedAt: string | null;
  governanceRestrictions: string[];
  permissions: string[];
  nftOwnershipMergeReady: true;
  walletOwnershipMergeReady: true;
  settlementEnabled: false;
  nftExecutionEnabled: false;
}

export interface SubscriptionRuntimeRecord {
  id: string;
  productId: string;
  holder: string;
  plan: string;
  status: "active" | "paused" | "renewal_due" | "pending" | "cancelled" | "expired";
  billingLifecycle: "invoice-preview";
  licenseLifecycle: LicenseRuntimeRecord["state"];
  renewalPreviewAt: string | null;
  cancellationPreviewAt: string | null;
  governanceRestrictions: string[];
  settlementEnabled: false;
}

export interface EntitlementSnapshot {
  id: string;
  holder: string;
  ownedProducts: string[];
  activeLicenses: string[];
  activeSubscriptions: string[];
  governanceRestrictions: string[];
  tenantRestrictions: string[];
  deliveryPermissions: Array<{
    productId: string;
    deliveryType: string;
    permission: "allowed-preview" | "restricted-preview" | "subscription-required-preview" | "license-required-preview";
    reasons: string[];
  }>;
  accessEnforcement: {
    licenseGatedAssetsReady: true;
    subscriptionGatedProductsReady: true;
    daoRestrictedAccessReady: true;
    governanceRestrictedAccessReady: true;
    entitlementDeliveryReady: true;
    realBlockingEnabled: false;
  };
  futureMerges: {
    nftOwnershipMergeReady: true;
    walletOwnershipMergeReady: true;
  };
  generatedAt: string;
}

export interface InvoicePreviewRecord {
  id: string;
  buyer: string;
  state: "draft" | "preview" | "pending" | "mock_paid" | "failed" | "cancelled" | "refunded_preview";
  productReferences: string[];
  subscriptionReferences: string[];
  lineItems: Array<{
    id: string;
    label: string;
    productId?: string;
    subscriptionId?: string;
    quantity: number;
    unitAmount: number;
    currency: string;
    subtotal: number;
  }>;
  subtotal: number;
  currency: string;
  royaltyPreview: number;
  platformFeePreview: number;
  treasurySplitPreview: number;
  creatorSplitPreview: number;
  ecosystemFeePreview: number;
  taxPlaceholder: {
    enabled: false;
    jurisdiction: "preview-unset";
    amount: 0;
  };
  totalPreview: number;
  reconciliation: {
    state: "preview_unreconciled" | "preview_reconciled";
    externalPaymentId: null;
    settlementTxHash: null;
    treasuryExecutionEnabled: false;
  };
  settlementEnabled: false;
  treasuryExecutionEnabled: false;
  createdAt: string;
  updatedAt: string;
}

export interface AccountingTelemetryRecord {
  id: string;
  invoiceId: string;
  type: "invoice.created" | "invoice.lifecycle_updated" | "accounting.preview_generated";
  amount: number;
  currency: string;
  settlementPreviewTrace: string;
  reconciliationState: InvoicePreviewRecord["reconciliation"]["state"];
  createdAt: string;
}

export interface RuntimeEventRecord {
  id: string;
  category?: string;
  type: string;
  entityId: string;
  entityType: string;
  createdAt: string;
  replaySafe?: true;
  correlationId?: string;
  payload: Record<string, unknown>;
}

export interface GovernanceAuthorityRecord {
  entityId: string;
  entityType: "product" | "seller" | "tenant";
  constitutionalStanding: string;
  governanceStatus: string;
  federationTier: string;
  warnings: string[];
  sanctions: string[];
  operationalApproval: "approved" | "approval_required" | "suspended" | "emergency_review";
  restrictionState: "none" | "warning" | "restricted" | "suspended";
  emergencyState: "none" | "active";
  authority: {
    constitutional: string;
    federal: string;
    technical: string;
    operational: string;
  };
  readOnly: true;
  hydratedFrom: "governance-runtime-adapter";
  generatedAt: string;
}

export interface GovernanceAuthoritySnapshot {
  id: string;
  source: "governance-runtime-local-read-model" | "governance-runtime-api";
  records: GovernanceAuthorityRecord[];
  writeExecutionEnabled: false;
  governanceWritesEnabled: false;
  generatedAt: string;
}

export interface GovernanceEnforcementRecord {
  entityId: string;
  entityType: "product" | "seller" | "tenant";
  authorityRef: string;
  severity: "none" | "warning" | "restricted" | "suspended" | "emergency";
  visibility: {
    requestedState: string;
    effectiveState: "visible" | "limited-preview" | "hidden-preview" | "review-required-preview";
    publicExplorerVisible: boolean;
    detailPageVisible: boolean;
    storefrontVisible: boolean;
    reasonCodes: string[];
  };
  commerce: {
    purchasePreviewAllowed: boolean;
    bidPreviewAllowed: boolean;
    listingPreviewAllowed: boolean;
    reasonCodes: string[];
  };
  entitlementImpact: {
    entitlementInvalidationPreview: boolean;
    subscriptionRestrictionPreview: boolean;
    licenseRestrictionPreview: boolean;
    governanceOverrideVisible: boolean;
    reasonCodes: string[];
  };
  reviewQueue: {
    required: boolean;
    queue: "none" | "constitutional" | "seller" | "tenant" | "emergency";
    reasonCodes: string[];
  };
  enforcementMode: "preview-only";
  hardBlockingEnabled: false;
  destructiveActionsEnabled: false;
  generatedAt: string;
}

export interface GovernanceEnforcementSnapshot {
  id: string;
  sourceAuthoritySnapshotId: string;
  records: GovernanceEnforcementRecord[];
  hiddenProductIds: string[];
  restrictedProductIds: string[];
  suspendedSellerIds: string[];
  restrictedTenantIds: string[];
  entitlementInvalidationPreviews: Array<{
    productId: string;
    reasonCodes: string[];
  }>;
  hardBlockingEnabled: false;
  destructiveActionsEnabled: false;
  generatedAt: string;
}

export interface GovernanceWorkflowActionRecord {
  id: string;
  actor: string;
  queue: "product" | "seller" | "storefront" | "entitlement" | "billing";
  entityId: string;
  entityType: string;
  action: "pending_approval" | "approved" | "rejected" | "restricted" | "escalated" | "emergency_review";
  reasonCode: string;
  notes?: string;
  timestamp: string;
  governanceWritesEnabled: false;
  moderationOnly: true;
}

export interface GovernanceWorkflowSnapshot {
  id: string;
  queues: Array<{
    queue: GovernanceWorkflowActionRecord["queue"];
    items: Array<{
      id: string;
      queue: GovernanceWorkflowActionRecord["queue"];
      entityId: string;
      entityType: string;
      tenantId: string;
      lifecycle: GovernanceWorkflowActionRecord["action"];
      severity: "low" | "medium" | "high" | "critical";
      reasonCodes: string[];
      source: "authority" | "enforcement" | "federation" | "entitlement" | "billing";
      createdAt: string;
    }>;
    metrics: {
      pending: number;
      escalated: number;
      emergency: number;
      restricted: number;
    };
  }>;
  approvalLifecycle: {
    supportedStates: GovernanceWorkflowActionRecord["action"][];
    currentByEntity: Record<string, GovernanceWorkflowActionRecord["action"]>;
  };
  constitutionalReasonCodes: Array<{
    code: string;
    category: "warning" | "sanction" | "restriction" | "escalation";
    severity: "low" | "medium" | "high" | "critical";
    description: string;
    constitutionalReference: string;
  }>;
  moderationRuntime: {
    queuedItems: number;
    pendingApproval: number;
    escalated: number;
    emergencyReview: number;
    restricted: number;
    moderationWritesEnabled: false;
    governanceWritesEnabled: false;
  };
  governanceAudit: GovernanceWorkflowActionRecord[];
  generatedAt: string;
}

export interface GovernanceOperatorConsoleSnapshot {
  id: string;
  emergencyRuntime: {
    controls: Array<{
      id: string;
      entityId: string;
      entityType: string;
      tenantId: string;
      control: "emergency_restriction" | "emergency_freeze" | "emergency_suspension" | "emergency_visibility";
      trigger: string;
      severity: "warning" | "restricted" | "critical";
      previewState: "prepared" | "active-preview";
      executionEnabled: false;
      reasonCodes: string[];
    }>;
    emergencyRestrictions: number;
    emergencyFreezes: number;
    emergencySuspensions: number;
    emergencyVisibilityControls: number;
    executionEnabled: false;
  };
  telemetry: {
    records: Array<{
      id: string;
      category: "governance_action" | "restriction" | "moderation" | "emergency_event";
      entityId: string;
      entityType: string;
      tenantId: string;
      severity: "info" | "warning" | "critical";
      message: string;
      reasonCodes: string[];
      createdAt: string;
    }>;
    governanceActions: number;
    restrictions: number;
    moderationEvents: number;
    emergencyEvents: number;
  };
  operatorConsole: {
    governanceVisibility: "available";
    moderationVisibility: "available";
    restrictionVisibility: "available";
    federationVisibility: "available";
    liveControlsEnabled: false;
  };
  federation: {
    health: "healthy-preview" | "warning-preview" | "restricted-preview";
    tenants: number;
    restrictedStorefronts: number;
    reviewRequiredStorefronts: number;
  };
  generatedAt: string;
}

export interface AuditLogRecord {
  id: string;
  actor: string;
  entity: {
    id: string;
    type: string;
  };
  action: string;
  timestamp: string;
  tenant: string;
  governanceContext: {
    standing: string;
    restrictions: string[];
    reviewRequired: boolean;
  };
  runtimeMetadata: {
    source: "marketplace-api";
    mode: "mock-persistent";
    settlementEnabled: false;
    walletExecutionEnabled: false;
    blockchainWritesEnabled: false;
    replaySafe: true;
    correlationId: string;
  };
}

export interface ReconciliationSnapshotRecord {
  id: string;
  scope: "marketplace";
  status: "preview_ready" | "pending_indexer" | "blocked";
  blockchainReads: {
    prepared: true;
    enabled: false;
    supportedChecks: string[];
  };
  ownershipVerification: {
    prepared: true;
    enabled: false;
    pendingProductIds: string[];
  };
  treasuryVerification: {
    prepared: true;
    enabled: false;
    pendingInvoiceIds: string[];
  };
  settlementVerification: {
    prepared: true;
    enabled: false;
    pendingPurchaseIds: string[];
  };
  licenseVerification: {
    prepared: true;
    enabled: false;
    pendingLicenseIds: string[];
  };
  generatedAt: string;
}

export interface IndexerSnapshotRecord {
  id: string;
  entitySync: {
    products: number;
    sellers: number;
    tenants: number;
    licenses: number;
    invoices: number;
  };
  contracts: Array<{
    chain: string;
    contractAddress: string;
    tokenStandard: string;
    ingestionReady: true;
    liveIngestionEnabled: false;
  }>;
  runtimeSnapshot: {
    eventCount: number;
    auditCount: number;
    ownershipMergeReady: true;
    nftEventIngestionReady: true;
  };
  generatedAt: string;
}

const marketplaceApiBaseUrl = (import.meta.env.VITE_MARKETPLACE_API_URL ?? "/api/marketplace").replace(/\/$/, "");

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${marketplaceApiBaseUrl}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...init?.headers
    }
  });
  if (!response.ok) throw new Error(`Marketplace API request failed: ${response.status}`);
  const payload = (await response.json()) as ApiEnvelope<T>;
  return payload.data;
}

function applyProductFilters(products: Product[], filters: ProductFilters = {}) {
  return filterAndSortProducts(products, filters, listMockSellers());
}

async function listProducts(filters: ProductFilters = {}) {
  try {
    return applyProductFilters(await request<Product[]>("/products"), filters);
  } catch {
    return listMockProducts(filters);
  }
}

async function getProduct(slugOrId: string) {
  try {
    return await request<Product>(`/products/${encodeURIComponent(slugOrId)}`);
  } catch {
    return getProductBySlug(slugOrId);
  }
}

async function listSellers() {
  try {
    return await request<Seller[]>("/sellers");
  } catch {
    return listMockSellers();
  }
}

async function listLicenses() {
  try {
    return await request<License[]>("/licenses");
  } catch {
    return listMockLicenses();
  }
}

async function listLicenseRuntimes() {
  try {
    return await request<LicenseRuntimeRecord[]>("/licenses/runtime");
  } catch {
    return [];
  }
}

async function listSubscriptions() {
  try {
    return await request<SubscriptionRuntimeRecord[]>("/subscriptions");
  } catch {
    return [];
  }
}

async function getEntitlementSnapshot(holder: string): Promise<EntitlementSnapshot> {
  try {
    return await request<EntitlementSnapshot>(`/entitlements/${encodeURIComponent(holder)}`);
  } catch {
    return {
      id: `entitlement-${holder}`,
      holder,
      ownedProducts: [],
      activeLicenses: [],
      activeSubscriptions: [],
      governanceRestrictions: [],
      tenantRestrictions: [],
      deliveryPermissions: [],
      accessEnforcement: {
        licenseGatedAssetsReady: true,
        subscriptionGatedProductsReady: true,
        daoRestrictedAccessReady: true,
        governanceRestrictedAccessReady: true,
        entitlementDeliveryReady: true,
        realBlockingEnabled: false
      },
      futureMerges: {
        nftOwnershipMergeReady: true,
        walletOwnershipMergeReady: true
      },
      generatedAt: new Date().toISOString()
    };
  }
}

async function listInvoices() {
  try {
    return await request<InvoicePreviewRecord[]>("/invoices");
  } catch {
    return [];
  }
}

async function listAccountingTelemetry() {
  try {
    return await request<AccountingTelemetryRecord[]>("/accounting-telemetry");
  } catch {
    return [];
  }
}

async function createInvoicePreview(productIds: string[], buyer?: string) {
  try {
    return await request<InvoicePreviewRecord>("/invoices/preview", {
      method: "POST",
      body: JSON.stringify({ buyer, productIds })
    });
  } catch {
    const products = listMockProducts().filter((product) => productIds.includes(product.id));
    const subtotal = products.reduce((sum, product) => sum + product.pricing.amount, 0);
    const royaltyPreview = products.reduce((sum, product) => sum + product.royaltyModel.previewAmount, 0);
    const platformFeePreview = Number((subtotal * 0.025).toFixed(4));
    const ecosystemFeePreview = Number((subtotal * 0.01).toFixed(4));
    return {
      id: `invoice-preview-${Date.now()}`,
      buyer: buyer ?? "0xMockBuyer...A11C",
      state: "preview" as const,
      productReferences: productIds,
      subscriptionReferences: [],
      lineItems: products.map((product) => ({
        id: `line-${product.id}`,
        label: product.title,
        productId: product.id,
        quantity: 1,
        unitAmount: product.pricing.amount,
        currency: product.pricing.currency,
        subtotal: product.pricing.amount
      })),
      subtotal,
      currency: products[0]?.pricing.currency ?? "USDC",
      royaltyPreview,
      platformFeePreview,
      treasurySplitPreview: Number((platformFeePreview + ecosystemFeePreview).toFixed(4)),
      creatorSplitPreview: Number((subtotal - royaltyPreview - platformFeePreview - ecosystemFeePreview).toFixed(4)),
      ecosystemFeePreview,
      taxPlaceholder: { enabled: false as const, jurisdiction: "preview-unset" as const, amount: 0 as const },
      totalPreview: subtotal,
      reconciliation: {
        state: "preview_unreconciled" as const,
        externalPaymentId: null,
        settlementTxHash: null,
        treasuryExecutionEnabled: false as const
      },
      settlementEnabled: false as const,
      treasuryExecutionEnabled: false as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
}

async function listRuntimeEvents() {
  try {
    return await request<RuntimeEventRecord[]>("/events");
  } catch {
    return [];
  }
}

async function getGovernanceAuthoritySnapshot() {
  try {
    return await request<GovernanceAuthoritySnapshot>("/governance-authority");
  } catch {
    return {
      id: `governance-authority-${Date.now()}`,
      source: "governance-runtime-local-read-model" as const,
      records: [],
      writeExecutionEnabled: false as const,
      governanceWritesEnabled: false as const,
      generatedAt: new Date().toISOString()
    };
  }
}

async function getGovernanceAuthority(entityId: string) {
  try {
    return await request<GovernanceAuthorityRecord>(`/governance-authority/${encodeURIComponent(entityId)}`);
  } catch {
    return undefined;
  }
}

async function getGovernanceEnforcementSnapshot(): Promise<GovernanceEnforcementSnapshot> {
  try {
    return await request<GovernanceEnforcementSnapshot>("/governance-enforcement");
  } catch {
    return buildFallbackGovernanceEnforcementSnapshot();
  }
}

async function getGovernanceEnforcement(entityId: string) {
  try {
    return await request<GovernanceEnforcementRecord>(`/governance-enforcement/${encodeURIComponent(entityId)}`);
  } catch {
    return buildFallbackGovernanceEnforcementSnapshot().records.find((record) => record.entityId === entityId);
  }
}

async function getDAOFederationRuntime(): Promise<DAOFederationRuntimeSnapshot> {
  try {
    return await request<DAOFederationRuntimeSnapshot>("/dao-federation");
  } catch {
    return buildFallbackDAOFederationRuntime();
  }
}

async function getTenantRuntime(tenantId: string) {
  try {
    return await request<TenantRuntimeIsolationRecord>(`/dao-federation/tenants/${encodeURIComponent(tenantId)}`);
  } catch {
    return buildFallbackDAOFederationRuntime().tenantIsolation.find((record) => record.tenantId === tenantId);
  }
}

async function getGovernanceWorkflow(): Promise<GovernanceWorkflowSnapshot> {
  try {
    return await request<GovernanceWorkflowSnapshot>("/governance-workflow");
  } catch {
    return buildFallbackGovernanceWorkflow();
  }
}

async function getGovernanceObservability(): Promise<GovernanceOperatorConsoleSnapshot> {
  try {
    return await request<GovernanceOperatorConsoleSnapshot>("/governance-observability");
  } catch {
    return buildFallbackGovernanceObservability();
  }
}

async function listAuditLogs() {
  try {
    return await request<AuditLogRecord[]>("/audit-logs");
  } catch {
    return [];
  }
}

async function listReconciliationSnapshots() {
  try {
    return await request<ReconciliationSnapshotRecord[]>("/reconciliation");
  } catch {
    return [];
  }
}

async function createReconciliationSnapshot() {
  try {
    return await request<ReconciliationSnapshotRecord>("/reconciliation/snapshot", { method: "POST" });
  } catch {
    return {
      id: `reconciliation-preview-${Date.now()}`,
      scope: "marketplace" as const,
      status: "preview_ready" as const,
      blockchainReads: { prepared: true as const, enabled: false as const, supportedChecks: [] },
      ownershipVerification: { prepared: true as const, enabled: false as const, pendingProductIds: [] },
      treasuryVerification: { prepared: true as const, enabled: false as const, pendingInvoiceIds: [] },
      settlementVerification: { prepared: true as const, enabled: false as const, pendingPurchaseIds: [] },
      licenseVerification: { prepared: true as const, enabled: false as const, pendingLicenseIds: [] },
      generatedAt: new Date().toISOString()
    };
  }
}

async function createIndexerSnapshot() {
  try {
    return await request<IndexerSnapshotRecord>("/indexer-snapshots", { method: "POST" });
  } catch {
    return {
      id: `indexer-preview-${Date.now()}`,
      entitySync: { products: listMockProducts().length, sellers: listMockSellers().length, tenants: 0, licenses: 0, invoices: 0 },
      contracts: [],
      runtimeSnapshot: { eventCount: 0, auditCount: 0, ownershipMergeReady: true as const, nftEventIngestionReady: true as const },
      generatedAt: new Date().toISOString()
    };
  }
}

async function getMarketplaceRuntime(): Promise<MarketplaceRuntimeSnapshot> {
  try {
    return await request<MarketplaceRuntimeSnapshot>("");
  } catch {
    return {
      products: listMockProducts(),
      sellers: listMockSellers(),
      tenants: [],
      productRegistry: [],
      sellerRegistry: [],
      tenantRegistry: [],
      storefronts: [],
      daoFederationRuntime: buildFallbackDAOFederationRuntime(),
      governanceEnforcement: buildFallbackGovernanceEnforcementSnapshot(),
      licenses: listMockLicenses(),
      purchases: [],
      subscriptions: [],
      billingPreviews: [],
      governanceValidations: [],
      draftListings: [],
      deliveryPreviews: [],
      events: []
    };
  }
}

async function listProductRegistry() {
  try {
    return await request<ProductRegistryRecord[]>("/registry/products");
  } catch {
    return listMockProducts().map((product) => ({
      canonicalEntityId: `marketplace:product:${product.id}`,
      productId: product.id,
      slug: product.slug,
      title: product.title,
      sellerId: product.sellerId,
      tenantId: "tenant-axodus-dao",
      ownership: {
        ownerType: "tenant" as const,
        ownerId: "tenant-axodus-dao",
        publisherId: product.sellerId,
        governanceAuthority: "Marketplace Governance"
      },
      visibilityState: product.visibility,
      lifecycleState: product.governanceStatus === "restricted" ? "restricted" : "active",
      governanceStanding: product.governanceStatus,
      supportedChains: product.supportedChains,
      licenseModel: product.licenseType,
      nftMetadata: {
        tokenStandard: product.tokenStandard,
        contractAddress: product.contractAddress ?? null,
        tokenId: product.tokenId ?? null,
        nftBound: product.nftBound
      },
      royaltyMetadata: {
        standard: product.royaltyModel.standard,
        bps: product.royaltyModel.bps,
        recipient: product.royaltyModel.recipient
      },
      deliveryMetadata: {
        deliveryType: product.deliveryType,
        greenfieldBucket: product.greenfieldBucket ?? null,
        signedUrlPreviewAvailable: product.signedUrlPreviewAvailable
      },
      versioning: {
        currentVersion: product.version,
        previousVersions: [],
        archived: false,
        deprecated: product.governanceStatus === "deprecated",
        updatedAt: product.updatedAt
      }
    }));
  }
}

async function listTenantRegistry() {
  try {
    return await request<TenantRegistryRecord[]>("/registry/tenants");
  } catch {
    return [];
  }
}

async function getTenantStorefront(tenantIdOrSlug: string) {
  try {
    return await request<StorefrontView>(`/tenants/${encodeURIComponent(tenantIdOrSlug)}/storefront`);
  } catch {
    return undefined;
  }
}

async function getSellerStorefront(sellerIdOrSlug: string) {
  try {
    return await request<StorefrontView>(`/sellers/${encodeURIComponent(sellerIdOrSlug)}/storefront`);
  } catch {
    return undefined;
  }
}

async function createPurchasePreview(product: Product, buyer?: string): Promise<PurchaseRecord> {
  try {
    return await request<PurchaseRecord>("/purchases/preview", {
      method: "POST",
      body: JSON.stringify({ productId: product.id, buyer })
    });
  } catch {
    return issueMockPurchase(product, buyer);
  }
}

async function createDraftListing(input: DraftListingInput) {
  try {
    return await request<Record<string, unknown>>("/draft-listings", {
      method: "POST",
      body: JSON.stringify(input)
    });
  } catch {
    return createDraftListingPreview(input);
  }
}

async function createBillingPreview(product: Product, buyer?: string) {
  try {
    return await request<BillingPreview>("/billing-previews", {
      method: "POST",
      body: JSON.stringify({ productId: product.id, buyer })
    });
  } catch {
    const royaltyPreview = product.royaltyModel.previewAmount;
    const platformFee = Number((product.pricing.amount * 0.025).toFixed(4));
    return {
      id: `billing-preview-${Date.now()}`,
      productId: product.id,
      buyer: buyer ?? "0xMockBuyer...A11C",
      amount: product.pricing.amount,
      currency: product.pricing.currency,
      platformFee,
      royaltyPreview,
      sellerNetPreview: Number((product.pricing.amount - platformFee - royaltyPreview).toFixed(4)),
      status: "invoice-preview" as const,
      settlementEnabled: false as const,
      createdAt: new Date().toISOString()
    };
  }
}

export const apiClient = {
  listProducts,
  getProduct,
  listSellers,
  listLicenses,
  listLicenseRuntimes,
  listSubscriptions,
  getEntitlementSnapshot,
  listInvoices,
  listAccountingTelemetry,
  createInvoicePreview,
  listRuntimeEvents,
  getGovernanceAuthoritySnapshot,
  getGovernanceAuthority,
  getGovernanceEnforcementSnapshot,
  getGovernanceEnforcement,
  getDAOFederationRuntime,
  getTenantRuntime,
  getGovernanceWorkflow,
  getGovernanceObservability,
  listAuditLogs,
  listReconciliationSnapshots,
  createReconciliationSnapshot,
  createIndexerSnapshot,
  listProductRegistry,
  listTenantRegistry,
  getTenantStorefront,
  getSellerStorefront,
  getMarketplaceRuntime,
  createPurchasePreview,
  createDraftListing,
  createBillingPreview
};

function buildFallbackDAOFederationRuntime(): DAOFederationRuntimeSnapshot {
  const generatedAt = new Date().toISOString();
  const productIds = listMockProducts().map((product) => product.id);
  const sellerIds = [...new Set(listMockProducts().map((product) => product.sellerId))];
  return {
    id: `dao-federation-${Date.now()}`,
    storefronts: [
      {
        tenantId: "tenant-axodus-dao",
        storefrontId: "storefront-tenant-tenant-axodus-dao",
        slug: "axodus-dao",
        activationState: "active-preview",
        operationalStatus: "operational-preview",
        governanceVisibility: {
          authorityState: "verified",
          enforcementState: "visible",
          inheritedRestrictions: [],
          publicActivationEnabled: false
        },
        daoOwnedProductIds: productIds,
        metrics: {
          products: productIds.length,
          activeProducts: productIds.length,
          restrictedProducts: listMockProducts().filter((product) => product.governanceStatus === "restricted").length,
          sellers: sellerIds.length,
          invoices: 0,
          activeLicenses: 0,
          activeSubscriptions: 0
        }
      }
    ],
    tenantIsolation: [
      {
        tenantId: "tenant-axodus-dao",
        boundary: {
          productIds,
          sellerIds,
          invoiceIds: [],
          licenseIds: [],
          subscriptionIds: [],
          entitlementSnapshotIds: [],
          governanceRecordIds: productIds
        },
        scopedRuntime: {
          productsScoped: true,
          billingScoped: true,
          entitlementsScoped: true,
          governanceScoped: true,
          crossTenantSettlementEnabled: false
        }
      }
    ],
    constitutionalInheritance: [
      {
        tenantId: "tenant-axodus-dao",
        parentTenantId: null,
        federationTier: "core",
        inheritedRestrictions: [],
        inheritedVisibilityRules: [],
        inheritedGovernanceStanding: "verified",
        inheritedFederationMetadata: {
          rootAuthority: "Axodus Constitutional Governance",
          operationalAuthority: "Axodus Governance",
          inheritanceMode: "preview-only"
        }
      }
    ],
    federationMetrics: {
      tenants: 1,
      activeStorefronts: 1,
      reviewRequiredStorefronts: 0,
      restrictedStorefronts: 0,
      federationHealth: "healthy-preview",
      governanceActivity: 0,
      operationalVisibility: "preview-only"
    },
    publicActivationEnabled: false,
    settlementEnabled: false,
    generatedAt
  };
}

function buildFallbackGovernanceWorkflow(): GovernanceWorkflowSnapshot {
  const generatedAt = new Date().toISOString();
  const restrictedProducts = listMockProducts().filter((product) => product.governanceStatus !== "compliant" || product.governanceRequired);
  const productItems: GovernanceWorkflowSnapshot["queues"][number]["items"] = restrictedProducts.map((product) => ({
    id: `review-product-${product.id}`,
    queue: "product" as const,
    entityId: product.id,
    entityType: "product",
    tenantId: "tenant-axodus-dao",
    lifecycle: product.governanceStatus === "restricted" ? ("restricted" as const) : ("pending_approval" as const),
    severity: product.governanceStatus === "restricted" ? ("high" as const) : ("medium" as const),
    reasonCodes: [product.governanceStatus === "restricted" ? "RESTRICT_PRODUCT_COMMERCE" : "WARN_REVIEW_REQUIRED"],
    source: "enforcement" as const,
    createdAt: generatedAt
  }));
  const queues: GovernanceWorkflowSnapshot["queues"] = ["product", "seller", "storefront", "entitlement", "billing"].map((queue) => {
    const items = queue === "product" ? productItems : [];
    return {
      queue: queue as GovernanceWorkflowActionRecord["queue"],
      items,
      metrics: {
        pending: items.filter((item) => item.lifecycle === "pending_approval").length,
        escalated: items.filter((item) => item.lifecycle === "escalated").length,
        emergency: items.filter((item) => item.lifecycle === "emergency_review").length,
        restricted: items.filter((item) => item.lifecycle === "restricted").length
      }
    };
  });
  return {
    id: `governance-workflow-${Date.now()}`,
    queues,
    approvalLifecycle: {
      supportedStates: ["pending_approval", "approved", "rejected", "restricted", "escalated", "emergency_review"],
      currentByEntity: Object.fromEntries(productItems.map((item) => [item.entityId, item.lifecycle]))
    },
    constitutionalReasonCodes: [
      {
        code: "WARN_REVIEW_REQUIRED",
        category: "warning",
        severity: "medium",
        description: "Entity requires constitutional or operational review before live execution.",
        constitutionalReference: "Marketplace constitutional review boundary"
      },
      {
        code: "RESTRICT_PRODUCT_COMMERCE",
        category: "restriction",
        severity: "high",
        description: "Product commerce preview is restricted by governance enforcement.",
        constitutionalReference: "Marketplace commerce restriction boundary"
      }
    ],
    moderationRuntime: {
      queuedItems: productItems.length,
      pendingApproval: productItems.filter((item) => item.lifecycle === "pending_approval").length,
      escalated: 0,
      emergencyReview: 0,
      restricted: productItems.filter((item) => item.lifecycle === "restricted").length,
      moderationWritesEnabled: false,
      governanceWritesEnabled: false
    },
    governanceAudit: [],
    generatedAt
  };
}

function buildFallbackGovernanceObservability(): GovernanceOperatorConsoleSnapshot {
  const generatedAt = new Date().toISOString();
  const workflow = buildFallbackGovernanceWorkflow();
  const controls = workflow.queues
    .flatMap((queue) => queue.items)
    .filter((item) => item.lifecycle === "restricted" || item.lifecycle === "emergency_review")
    .map((item) => ({
      id: `emergency-restriction-${item.entityId}`,
      entityId: item.entityId,
      entityType: item.entityType,
      tenantId: item.tenantId,
      control: "emergency_restriction" as const,
      trigger: item.lifecycle,
      severity: item.lifecycle === "emergency_review" ? ("critical" as const) : ("restricted" as const),
      previewState: "prepared" as const,
      executionEnabled: false as const,
      reasonCodes: item.reasonCodes
    }));
  const records: GovernanceOperatorConsoleSnapshot["telemetry"]["records"] = [
    ...workflow.queues.flatMap((queue) =>
      queue.items.map((item) => ({
        id: `telemetry-moderation-${item.id}`,
        category: "moderation" as const,
        entityId: item.entityId,
        entityType: item.entityType,
        tenantId: item.tenantId,
        severity: item.severity === "critical" ? ("critical" as const) : item.severity === "high" ? ("warning" as const) : ("info" as const),
        message: `${queue.queue} queue item in ${item.lifecycle}`,
        reasonCodes: item.reasonCodes,
        createdAt: item.createdAt
      }))
    ),
    ...controls.map((control) => ({
      id: `telemetry-${control.id}`,
      category: "restriction" as const,
      entityId: control.entityId,
      entityType: control.entityType,
      tenantId: control.tenantId,
      severity: control.severity === "critical" ? ("critical" as const) : ("warning" as const),
      message: `${control.control} ${control.previewState}`,
      reasonCodes: control.reasonCodes,
      createdAt: generatedAt
    }))
  ];
  return {
    id: `governance-observability-${Date.now()}`,
    emergencyRuntime: {
      controls,
      emergencyRestrictions: controls.filter((control) => control.control === "emergency_restriction").length,
      emergencyFreezes: 0,
      emergencySuspensions: 0,
      emergencyVisibilityControls: 0,
      executionEnabled: false
    },
    telemetry: {
      records,
      governanceActions: 0,
      restrictions: records.filter((record) => record.category === "restriction").length,
      moderationEvents: records.filter((record) => record.category === "moderation").length,
      emergencyEvents: records.filter((record) => record.category === "emergency_event").length
    },
    operatorConsole: {
      governanceVisibility: "available",
      moderationVisibility: "available",
      restrictionVisibility: "available",
      federationVisibility: "available",
      liveControlsEnabled: false
    },
    federation: {
      health: "warning-preview",
      tenants: 1,
      restrictedStorefronts: 0,
      reviewRequiredStorefronts: workflow.moderationRuntime.pendingApproval
    },
    generatedAt
  };
}

function buildFallbackGovernanceEnforcementSnapshot(): GovernanceEnforcementSnapshot {
  const generatedAt = new Date().toISOString();
  const records = listMockProducts().map((product): GovernanceEnforcementRecord => {
    const restricted = product.governanceStatus === "restricted";
    const review = product.governanceStatus === "under-review" || product.governanceRequired;
    return {
      entityId: product.id,
      entityType: "product",
      authorityRef: product.id,
      severity: restricted ? "restricted" : review ? "warning" : "none",
      visibility: {
        requestedState: product.visibility,
        effectiveState: restricted ? "limited-preview" : review ? "review-required-preview" : "visible",
        publicExplorerVisible: true,
        detailPageVisible: true,
        storefrontVisible: true,
        reasonCodes: [restricted ? "product-restricted-by-governance-preview" : null, review ? "product-review-required-preview" : null].filter(
          Boolean
        ) as string[]
      },
      commerce: {
        purchasePreviewAllowed: !restricted,
        bidPreviewAllowed: !restricted && product.listingType !== "license-preview",
        listingPreviewAllowed: true,
        reasonCodes: [restricted ? "purchase-preview-restricted-by-governance" : null, "no-settlement-no-contract-write"].filter(Boolean) as string[]
      },
      entitlementImpact: {
        entitlementInvalidationPreview: restricted,
        subscriptionRestrictionPreview: restricted || product.accessModel === "subscription",
        licenseRestrictionPreview: restricted || product.governanceRequired,
        governanceOverrideVisible: restricted || review,
        reasonCodes: [restricted ? "active-entitlements-require-review-preview" : null, "preview-only-no-access-revocation"].filter(Boolean) as string[]
      },
      reviewQueue: {
        required: restricted || review,
        queue: restricted || review ? "constitutional" : "none",
        reasonCodes: [restricted ? "product-restricted-by-governance-preview" : null, review ? "product-review-required-preview" : null].filter(
          Boolean
        ) as string[]
      },
      enforcementMode: "preview-only",
      hardBlockingEnabled: false,
      destructiveActionsEnabled: false,
      generatedAt
    };
  });
  return {
    id: `governance-enforcement-${Date.now()}`,
    sourceAuthoritySnapshotId: "fallback-local-authority",
    records,
    hiddenProductIds: [],
    restrictedProductIds: records.filter((record) => record.severity === "restricted").map((record) => record.entityId),
    suspendedSellerIds: [],
    restrictedTenantIds: [],
    entitlementInvalidationPreviews: records
      .filter((record) => record.entitlementImpact.entitlementInvalidationPreview)
      .map((record) => ({ productId: record.entityId, reasonCodes: record.entitlementImpact.reasonCodes })),
    hardBlockingEnabled: false,
    destructiveActionsEnabled: false,
    generatedAt
  };
}

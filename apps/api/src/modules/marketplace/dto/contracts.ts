export type ProductEntity = Record<string, unknown> & {
  id: string;
  canonicalEntityId?: string;
  slug: string;
  title: string;
  sellerId: string;
  tenantId?: string;
  governanceStatus: string;
};

export type SellerEntity = Record<string, unknown> & {
  id: string;
  name: string;
  governanceStanding: string;
};

export type TenantEntity = Record<string, unknown> & {
  id: string;
  name: string;
  governanceStanding: string;
};

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
  lifecycleState: "draft" | "active" | "deprecated" | "archived" | "restricted" | "suspended";
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
  governanceRelationship: {
    constitutionalBound: boolean;
    riskScore: number;
    sanctions: string[];
    warnings: string[];
  };
  tenantRelationship: {
    tenantIds: string[];
    registeredDAOs: string[];
    primaryTenantId: string | null;
  };
  storefront: {
    storefrontId: string;
    slug: string;
    title: string;
    operationalStatus: "active-preview" | "warning-preview" | "restricted-preview" | "suspended-preview";
  };
  futureReputationReady: true;
  futureSanctionsReady: true;
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
  tenantScopedAccessReady: true;
}

export interface StorefrontViewEntity {
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

export type GovernanceReviewQueueName = "product" | "seller" | "storefront" | "entitlement" | "billing";
export type GovernanceApprovalLifecycleState = "pending_approval" | "approved" | "rejected" | "restricted" | "escalated" | "emergency_review";
export type ConstitutionalReasonCategory = "warning" | "sanction" | "restriction" | "escalation";

export interface ConstitutionalReasonCode {
  code: string;
  category: ConstitutionalReasonCategory;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  constitutionalReference: string;
}

export interface GovernanceWorkflowQueueItem {
  id: string;
  queue: GovernanceReviewQueueName;
  entityId: string;
  entityType: string;
  tenantId: string;
  lifecycle: GovernanceApprovalLifecycleState;
  severity: "low" | "medium" | "high" | "critical";
  reasonCodes: string[];
  source: "authority" | "enforcement" | "federation" | "entitlement" | "billing";
  createdAt: string;
}

export interface GovernanceReviewQueue {
  queue: GovernanceReviewQueueName;
  items: GovernanceWorkflowQueueItem[];
  metrics: {
    pending: number;
    escalated: number;
    emergency: number;
    restricted: number;
  };
}

export interface GovernanceWorkflowActionRequest {
  actor: string;
  queue: GovernanceReviewQueueName;
  entityId: string;
  entityType: string;
  action: GovernanceApprovalLifecycleState;
  reasonCode: string;
  notes?: string;
}

export interface GovernanceWorkflowActionRecord extends GovernanceWorkflowActionRequest {
  id: string;
  timestamp: string;
  governanceWritesEnabled: false;
  moderationOnly: true;
}

export interface GovernanceWorkflowSnapshot {
  id: string;
  queues: GovernanceReviewQueue[];
  approvalLifecycle: {
    supportedStates: GovernanceApprovalLifecycleState[];
    currentByEntity: Record<string, GovernanceApprovalLifecycleState>;
  };
  constitutionalReasonCodes: ConstitutionalReasonCode[];
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

export interface EmergencyGovernanceControl {
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
}

export interface GovernanceTelemetryRecord {
  id: string;
  category: "governance_action" | "restriction" | "moderation" | "emergency_event";
  entityId: string;
  entityType: string;
  tenantId: string;
  severity: "info" | "warning" | "critical";
  message: string;
  reasonCodes: string[];
  createdAt: string;
}

export interface GovernanceOperatorConsoleSnapshot {
  id: string;
  emergencyRuntime: {
    controls: EmergencyGovernanceControl[];
    emergencyRestrictions: number;
    emergencyFreezes: number;
    emergencySuspensions: number;
    emergencyVisibilityControls: number;
    executionEnabled: false;
  };
  telemetry: {
    records: GovernanceTelemetryRecord[];
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

export type GovernanceEnforcementSubject = "product" | "seller" | "tenant";
export type GovernanceVisibilityAction = "visible" | "limited-preview" | "hidden-preview" | "review-required-preview";
export type GovernanceRestrictionSeverity = "none" | "warning" | "restricted" | "suspended" | "emergency";

export interface GovernanceEnforcementRecord {
  entityId: string;
  entityType: GovernanceEnforcementSubject;
  authorityRef: string;
  severity: GovernanceRestrictionSeverity;
  visibility: {
    requestedState: string;
    effectiveState: GovernanceVisibilityAction;
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

export type LicenseEntity = Record<string, unknown> & {
  id: string;
  type: string;
};

export type LicenseLifecycleState = "preview" | "issued" | "active" | "suspended" | "expired" | "revoked";
export type SubscriptionLifecycleState = "active" | "paused" | "renewal_due" | "pending" | "cancelled" | "expired";

export interface LicenseRuntimeEntity {
  id: string;
  licenseDefinitionId: string;
  productId: string;
  holder: string;
  sellerId: string;
  tenantId: string;
  state: LicenseLifecycleState;
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

export interface EntitlementSnapshotEntity {
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

export interface EntitlementEnforcementRequest {
  productId: string;
  holder?: string;
  daoId?: string;
}

export interface EntitlementEnforcementRecord {
  id: string;
  productId: string;
  holder: string;
  daoId: string | null;
  decision: "allowed" | "denied" | "review_required";
  checks: {
    license: {
      required: boolean;
      valid: boolean;
      licenseRuntimeId: string | null;
      reasonCodes: string[];
    };
    subscription: {
      required: boolean;
      valid: boolean;
      subscriptionId: string | null;
      reasonCodes: string[];
    };
    dao: {
      required: boolean;
      valid: boolean;
      tenantId: string | null;
      reasonCodes: string[];
    };
    governance: {
      valid: boolean;
      standing: string;
      reasonCodes: string[];
    };
  };
  deliveryAllowed: boolean;
  signedUrlAllowed: boolean;
  enforcementApplied: true;
  settlementEnabled: false;
  walletExecutionEnabled: false;
  generatedAt: string;
}

export interface EntitlementEnforcementSnapshot {
  id: string;
  records: EntitlementEnforcementRecord[];
  metrics: {
    allowed: number;
    denied: number;
    reviewRequired: number;
    licenseFailures: number;
    subscriptionFailures: number;
    daoFailures: number;
  };
  enforcementOperational: true;
  settlementEnabled: false;
  walletExecutionEnabled: false;
  generatedAt: string;
}

export interface PurchaseEntity {
  id: string;
  buyer: string;
  productId: string;
  sellerId: string;
  timestamp: string;
  amount: number;
  currency: string;
  licenseIssued: string;
  status: "mock-issued" | "pending-governance-review" | "blocked";
  governanceReviewRequired: boolean;
  signedUrlPreview?: string;
  settlementEnabled: false;
  walletExecutionEnabled: false;
  blockchainWritesEnabled: false;
}

export interface SettlementExecutionRequest {
  productId: string;
  buyer?: string;
  controlledRollout?: boolean;
}

export interface SettlementRuntime {
  id: string;
  purchaseId: string | null;
  productId: string;
  buyer: string;
  sellerId: string | null;
  amount: number;
  currency: string;
  status: "confirmed" | "blocked";
  transaction: {
    id: string;
    lifecycle: "initialized" | "authorized" | "confirmed" | "blocked";
    confirmationId: string | null;
    reasonCodes: string[];
    executedAt: string;
  };
  controlledRollout: true;
  settlementRuntimeEnabled: true;
  walletExecutionEnabled: false;
  blockchainWritesEnabled: false;
  externalPaymentEnabled: false;
  treasuryMovementEnabled: false;
}

export interface SettlementRuntimeSnapshot {
  id: string;
  records: SettlementRuntime[];
  metrics: {
    confirmed: number;
    blocked: number;
    totalVolume: number;
  };
  controlledRollout: true;
  walletExecutionEnabled: false;
  blockchainWritesEnabled: false;
  generatedAt: string;
}

export interface RoyaltyDistributionRequest {
  settlementId: string;
  controlledRollout?: boolean;
}

export interface RoyaltyDistributionRuntime {
  id: string;
  settlementId: string;
  productId: string;
  sellerId: string | null;
  currency: string;
  grossAmount: number;
  status: "allocated" | "blocked";
  reasonCodes: string[];
  eip2981: {
    standard: "EIP-2981";
    bps: number;
    recipient: string;
    royaltyAmount: number;
    settlementReady: boolean;
  };
  creatorPayout: {
    recipient: string;
    amount: number;
    status: "allocated" | "blocked";
    payoutExecutionEnabled: false;
  };
  treasuryAllocation: {
    recipient: string;
    platformFee: number;
    ecosystemFee: number;
    treasuryAmount: number;
    status: "allocated" | "blocked";
    treasuryMovementEnabled: false;
  };
  accounting: {
    royaltyAccountingReady: true;
    creatorPayoutReady: true;
    treasuryAllocationReady: true;
    externalAccountingEnabled: false;
  };
  controlledRollout: true;
  royaltyRuntimeEnabled: true;
  externalPayoutEnabled: false;
  contractExecutionEnabled: false;
  treasuryMovementEnabled: false;
  createdAt: string;
}

export interface RoyaltyDistributionSnapshot {
  id: string;
  records: RoyaltyDistributionRuntime[];
  metrics: {
    allocated: number;
    blocked: number;
    grossVolume: number;
    royaltyTotal: number;
    creatorPayoutTotal: number;
    treasuryTotal: number;
  };
  eip2981SettlementReady: true;
  creatorPayoutRuntimeReady: true;
  treasuryAllocationRuntimeReady: true;
  externalPayoutEnabled: false;
  contractExecutionEnabled: false;
  treasuryMovementEnabled: false;
  generatedAt: string;
}

export interface SubscriptionEntity {
  id: string;
  productId: string;
  holder: string;
  plan: string;
  status: SubscriptionLifecycleState;
  billingLifecycle: "invoice-preview";
  licenseLifecycle: LicenseLifecycleState;
  renewalPreviewAt: string | null;
  cancellationPreviewAt: string | null;
  governanceRestrictions: string[];
  settlementEnabled: false;
}

export interface BillingPreviewEntity {
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

export type InvoiceState = "draft" | "preview" | "pending" | "mock_paid" | "failed" | "cancelled" | "refunded_preview";

export interface InvoicePreviewEntity {
  id: string;
  buyer: string;
  state: InvoiceState;
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

export interface AccountingTelemetryEntity {
  id: string;
  invoiceId: string;
  type: "invoice.created" | "invoice.lifecycle_updated" | "accounting.preview_generated";
  amount: number;
  currency: string;
  settlementPreviewTrace: string;
  reconciliationState: InvoicePreviewEntity["reconciliation"]["state"];
  createdAt: string;
}

export type RuntimeEventCategory =
  | "product"
  | "governance"
  | "billing"
  | "subscription"
  | "license"
  | "entitlement"
  | "delivery"
  | "storefront"
  | "treasury_preview"
  | "indexer"
  | "telemetry";

export interface AuditLogEntity {
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

export interface ReconciliationSnapshotEntity {
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

export interface TreasuryReconciliationRecord {
  invoiceId: string;
  buyer: string;
  currency: string;
  expectedRoyalty: number;
  observedRoyalty: number;
  expectedPlatformFee: number;
  observedPlatformFee: number;
  expectedEcosystemFee: number;
  observedEcosystemFee: number;
  expectedTreasurySplit: number;
  observedTreasurySplit: number;
  expectedCreatorSplit: number;
  observedCreatorSplit: number;
  expectedTotal: number;
  observedTotal: number;
  status: "reconciled" | "mismatch" | "pending_preview";
  mismatchAmount: number;
  reasonCodes: string[];
}

export interface TreasuryReconciliationSnapshot {
  id: string;
  records: TreasuryReconciliationRecord[];
  metrics: {
    invoicesChecked: number;
    reconciled: number;
    mismatches: number;
    pendingPreviews: number;
    royaltyMismatchTotal: number;
    treasuryMismatchTotal: number;
    totalMismatchAmount: number;
  };
  accountingConsistency: {
    telemetryRecords: number;
    invoiceTelemetryLinked: boolean;
    royaltyAccountingReady: true;
    treasuryPreviewReady: true;
    settlementPreviewReady: true;
  };
  treasuryExecutionEnabled: false;
  settlementEnabled: false;
  generatedAt: string;
}

export interface IndexerSnapshotEntity {
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

export type ChainIngestionEventKind =
  | "nft.transfer"
  | "nft.approval"
  | "listing.created"
  | "listing.updated"
  | "listing.cancelled"
  | "auction.created"
  | "auction.settled"
  | "bid.placed"
  | "ownership.verified";

export interface ChainIngestionEventRequest {
  chain: string;
  blockNumber: number;
  blockHash: string;
  transactionHash: string;
  logIndex: number;
  eventKind: ChainIngestionEventKind;
  contractAddress: string;
  tokenStandard?: string;
  tokenId?: string;
  listingId?: string;
  seller?: string;
  buyer?: string;
  bidder?: string;
  owner?: string;
  amount?: string;
  price?: string;
  expiration?: string;
  raw?: Record<string, unknown>;
}

export interface ChainIngestionEventEntity extends ChainIngestionEventRequest {
  id: string;
  productId: string | null;
  tenantId: string;
  ingestedAt: string;
  replaySafe: true;
  dedupeKey: string;
  liveSettlementEnabled: false;
  chainWriteEnabled: false;
}

export interface ChainSnapshotEntity {
  id: string;
  chain: string;
  latestBlockNumber: number;
  latestBlockHash: string;
  eventsIngested: number;
  contractsObserved: string[];
  lastIngestedAt: string;
  persistenceEnabled: true;
}

export interface OwnershipSnapshotEntity {
  id: string;
  chain: string;
  productId: string | null;
  contractAddress: string;
  tokenStandard: string;
  tokenId: string | null;
  owner: string | null;
  balance: string | null;
  sourceEventId: string;
  blockNumber: number;
  stale: false;
  persistedAt: string;
}

export interface ListingSnapshotEntity {
  id: string;
  chain: string;
  productId: string | null;
  listingId: string | null;
  contractAddress: string;
  status: "active" | "updated" | "cancelled" | "settled" | "bid-active" | "unknown";
  seller: string | null;
  bidder: string | null;
  price: string | null;
  highestBid: string | null;
  bidCount: number;
  expiration: string | null;
  sourceEventId: string;
  blockNumber: number;
  persistedAt: string;
}

export interface MarketplaceIndexerRuntimeSnapshot {
  id: string;
  chainSnapshots: ChainSnapshotEntity[];
  ownershipSnapshots: OwnershipSnapshotEntity[];
  listingSnapshots: ListingSnapshotEntity[];
  metrics: {
    events: number;
    nftEvents: number;
    listingEvents: number;
    auctionEvents: number;
    bidEvents: number;
    ownershipEvents: number;
    chains: number;
  };
  ingestionEnabled: true;
  settlementEnabled: false;
  chainWritesEnabled: false;
  generatedAt: string;
}

export interface OwnershipReconciliationRecord {
  productId: string;
  chain: string | null;
  contractAddress: string | null;
  tokenId: string | null;
  expectedHolders: string[];
  observedOwner: string | null;
  observedBalance: string | null;
  sourceOwnershipSnapshotId: string | null;
  sourceBlockNumber: number | null;
  latestChainBlockNumber: number | null;
  status: "verified" | "mismatch" | "missing_snapshot" | "stale" | "invalid_asset";
  stale: boolean;
  blockLag: number | null;
  reasonCodes: string[];
}

export interface OwnershipReconciliationSnapshot {
  id: string;
  records: OwnershipReconciliationRecord[];
  metrics: {
    productsChecked: number;
    verified: number;
    mismatches: number;
    stale: number;
    missingSnapshots: number;
    invalidAssets: number;
  };
  consistencyChecks: {
    ownershipSnapshotsAvailable: boolean;
    licenseRuntimeCompared: boolean;
    purchaseRuntimeCompared: boolean;
    staleThresholdBlocks: number;
  };
  enforcementEnabled: false;
  chainReadsEnabled: false;
  generatedAt: string;
}

export interface GovernanceValidationEntity {
  id: string;
  productId: string;
  standing: string;
  requiredReviews: string[];
  blockers: string[];
  activationEnabled: false;
  settlementAllowed: false;
  createdAt: string;
}

export interface DraftListingEntity {
  id: string;
  title: string;
  category: string;
  tokenStandard: string;
  listingType: string;
  chain: string;
  price: number;
  currency: string;
  royaltyBps: number;
  deliveryType: string;
  governanceReviewRequired: boolean;
  description: string;
  status: "draft-created" | "requires-governance-review";
  settlementEnabled: false;
  contractWriteEnabled: false;
  createdAt: string;
}

export interface AssetDeliveryPreviewEntity {
  id: string;
  productId: string;
  lifecycle: "preview" | "not-required" | "blocked";
  signedUrl: string | null;
  expiresAt: string | null;
  deliveryExecutionEnabled: false;
  productionGreenfieldEnabled: false;
  createdAt: string;
}

export interface GreenfieldAuthRequest {
  productId: string;
  holder?: string;
  daoId?: string;
}

export interface GreenfieldAuthRuntime {
  id: string;
  productId: string;
  holder: string;
  bucket: {
    name: string | null;
    scope: "product" | "tenant" | "none";
    accessMode: "signed-url-preview" | "bucket-auth-preview" | "not-required";
    bucketAuthReady: boolean;
  };
  ownership: {
    required: boolean;
    verified: boolean;
    source: "license" | "subscription" | "ownership_snapshot" | "none";
    snapshotId: string | null;
  };
  accessVerification: {
    status: "verified-preview" | "blocked-preview" | "not-required";
    reasons: string[];
    entitlementSnapshotId: string;
    expiresAt: string | null;
  };
  delivery: {
    deliveryType: string;
    signedUrlPreview: string | null;
    productionSignedUrlEnabled: false;
    productionGreenfieldEnabled: false;
  };
  authExecutionEnabled: false;
  externalGreenfieldCallEnabled: false;
  createdAt: string;
}

export interface GreenfieldAuthRuntimeSnapshot {
  id: string;
  records: GreenfieldAuthRuntime[];
  metrics: {
    bucketsPrepared: number;
    verifiedAccess: number;
    blockedAccess: number;
    ownershipVerified: number;
  };
  productionGreenfieldEnabled: false;
  externalAuthEnabled: false;
  generatedAt: string;
}

export interface SignedUrlIssueRequest {
  productId: string;
  holder?: string;
  daoId?: string;
  ttlSeconds?: number;
}

export interface SignedUrlRevokeRequest {
  signedUrlId: string;
  reason?: string;
}

export interface SignedUrlRuntime {
  id: string;
  productId: string;
  holder: string;
  greenfieldAuthId: string;
  bucket: string | null;
  url: string | null;
  signature: string | null;
  nonce: string;
  status: "issued" | "blocked" | "expired" | "revoked";
  issuedAt: string;
  expiresAt: string | null;
  revokedAt: string | null;
  revocationReason: string | null;
  expirationVisible: true;
  revocationVisible: true;
  signing: {
    algorithm: "HMAC-SHA256";
    keySource: "env" | "runtime-ephemeral";
    productionSignerEnabled: false;
  };
  productionGreenfieldEnabled: false;
  externalSignedUrlEnabled: false;
}

export interface SignedUrlRuntimeSnapshot {
  id: string;
  records: SignedUrlRuntime[];
  metrics: {
    issued: number;
    blocked: number;
    expired: number;
    revoked: number;
  };
  productionGreenfieldEnabled: false;
  generatedAt: string;
}

export interface SecureDeliveryRequest {
  productId: string;
  holder?: string;
  daoId?: string;
  mode?: "encrypted_download" | "secure_stream" | "acs_package";
}

export interface SecureDeliveryRuntime {
  id: string;
  productId: string;
  holder: string;
  mode: "encrypted_download" | "secure_stream" | "acs_package";
  enforcementId: string;
  status: "prepared" | "blocked";
  encryptedDownload: {
    enabled: boolean;
    algorithm: "AES-256-GCM";
    contentDigest: string | null;
    keyWrap: "HMAC-SHA256";
    downloadToken: string | null;
  };
  secureStream: {
    enabled: boolean;
    protocol: "HLS-preview";
    streamToken: string | null;
    segmentTtlSeconds: number;
  };
  acsPackage: {
    enabled: boolean;
    packageId: string | null;
    manifestDigest: string | null;
    provisioningEnabled: false;
  };
  access: {
    expiresAt: string | null;
    reasonCodes: string[];
  };
  productionDeliveryEnabled: false;
  externalObjectStoreEnabled: false;
  createdAt: string;
}

export interface SecureDeliverySnapshot {
  id: string;
  records: SecureDeliveryRuntime[];
  metrics: {
    prepared: number;
    blocked: number;
    encryptedDownloads: number;
    secureStreams: number;
    acsPackages: number;
  };
  productionDeliveryEnabled: false;
  generatedAt: string;
}

export interface DeliveryTelemetryRequest {
  deliveryId: string;
  event: "download_requested" | "stream_started" | "acs_package_requested" | "access_denied" | "delivery_completed";
  actor?: string;
}

export interface DeliveryTelemetryRecord {
  id: string;
  deliveryId: string;
  productId: string;
  holder: string;
  actor: string;
  mode: SecureDeliveryRuntime["mode"];
  event: DeliveryTelemetryRequest["event"];
  outcome: "allowed" | "denied" | "observed";
  entitlementTrace: {
    enforcementId: string;
    decision: "allowed" | "denied" | "review_required" | "unknown";
    reasonCodes: string[];
  };
  deliveryAudit: {
    encryptedDownloadObserved: boolean;
    secureStreamObserved: boolean;
    acsPackageObserved: boolean;
    productionDeliveryEnabled: false;
    externalObjectStoreEnabled: false;
  };
  recordedAt: string;
}

export interface DeliveryObservabilitySnapshot {
  id: string;
  telemetry: DeliveryTelemetryRecord[];
  analytics: {
    totalEvents: number;
    downloadEvents: number;
    streamEvents: number;
    acsPackageEvents: number;
    deniedEvents: number;
    uniqueHolders: number;
    uniqueProducts: number;
  };
  audit: {
    deliveryAuditRecords: number;
    entitlementTraceRecords: number;
    productionDeliveryEnabled: false;
  };
  generatedAt: string;
}

export interface MarketplaceRuntimeEventEntity {
  id: string;
  category?: RuntimeEventCategory;
  type:
    | "listing.created"
    | "validation.requested"
    | "purchase.preview_issued"
    | "settlement.executed"
    | "settlement.blocked"
    | "license.preview_issued"
    | "license.lifecycle_updated"
    | "subscription.preview_updated"
    | "subscription.lifecycle_updated"
    | "billing.preview_generated"
    | "invoice.preview_created"
    | "invoice.lifecycle_updated"
    | "accounting.preview_generated"
    | "audit.recorded"
    | "reconciliation.snapshot_generated"
    | "reconciliation.ownership_snapshot_generated"
    | "reconciliation.treasury_snapshot_generated"
    | "realtime.snapshot_generated"
    | "resilience.snapshot_generated"
    | "indexer.snapshot_generated"
    | "indexer.event_ingested"
    | "indexer.chain_snapshot_persisted"
    | "greenfield.auth_verified"
    | "signed_url.issued"
    | "signed_url.revoked"
    | "secure_delivery.prepared"
    | "delivery.telemetry_recorded"
    | "delivery.preview_issued"
    | "entitlement.snapshot_generated"
    | "entitlement.enforcement_evaluated";
  entityId: string;
  entityType: string;
  createdAt: string;
  replaySafe?: true;
  correlationId?: string;
  payload: Record<string, unknown>;
}

export interface MarketplaceRealtimeSnapshot {
  id: string;
  channels: Array<"listings" | "bids" | "governance" | "telemetry">;
  transport: {
    websocketPrepared: true;
    ssePrepared: true;
    pollingFallbackPrepared: true;
    endpoint: "/api/marketplace/live";
    streamEndpoint: "/api/marketplace/live/stream";
    websocketEndpoint: "/api/marketplace/live/ws";
  };
  liveUpdates: {
    listingUpdates: MarketplaceRuntimeEventEntity[];
    bidUpdates: ChainIngestionEventEntity[];
    governanceUpdates: MarketplaceRuntimeEventEntity[];
    telemetryUpdates: MarketplaceRuntimeEventEntity[];
  };
  metrics: {
    listingUpdates: number;
    bidUpdates: number;
    governanceUpdates: number;
    telemetryUpdates: number;
    streamableEvents: number;
  };
  realtimeExecutionEnabled: false;
  externalBrokerEnabled: false;
  generatedAt: string;
}

export interface MarketplaceRetryQueueItem {
  id: string;
  source: "ownership_reconciliation" | "treasury_reconciliation" | "realtime_stream" | "indexer_snapshot";
  entityId: string;
  action: "retry_reconciliation" | "retry_stream_publish" | "recover_stale_snapshot";
  reasonCode: string;
  attempts: number;
  status: "queued_preview" | "ready_for_retry" | "blocked_preview";
  nextRetryAt: string;
  executionEnabled: false;
}

export interface MarketplaceOperationalResilienceSnapshot {
  id: string;
  mode: "healthy" | "degraded" | "recovery_required";
  degradedMode: {
    enabled: boolean;
    reasons: string[];
    readOnlyFallbackEnabled: true;
    writeSuppressionRecommended: boolean;
  };
  retryQueues: {
    reconciliation: MarketplaceRetryQueueItem[];
    treasury: MarketplaceRetryQueueItem[];
    realtime: MarketplaceRetryQueueItem[];
    indexer: MarketplaceRetryQueueItem[];
  };
  failover: {
    localStoreAvailable: true;
    mockFallbackAvailable: true;
    externalBrokerAvailable: false;
    databaseFailoverPrepared: true;
    indexerFailoverPrepared: true;
  };
  staleRecovery: {
    staleOwnershipSnapshots: number;
    staleRealtimeSnapshots: number;
    staleChainSnapshots: number;
    recoveryActions: string[];
    automaticRecoveryEnabled: false;
  };
  metrics: {
    queuedRetries: number;
    reconciliationRetries: number;
    treasuryRetries: number;
    realtimeRetries: number;
    indexerRetries: number;
    staleSnapshots: number;
  };
  retryExecutionEnabled: false;
  failoverExecutionEnabled: false;
  generatedAt: string;
}

export interface MarketplaceStore {
  products: ProductEntity[];
  sellers: SellerEntity[];
  tenants: TenantEntity[];
  productRegistry?: ProductRegistryRecord[];
  sellerRegistry?: SellerRegistryRecord[];
  tenantRegistry?: TenantRegistryRecord[];
  storefronts?: StorefrontViewEntity[];
  daoFederationRuntime?: DAOFederationRuntimeSnapshot;
  governanceWorkflow?: GovernanceWorkflowSnapshot;
  governanceWorkflowActions?: GovernanceWorkflowActionRecord[];
  governanceObservability?: GovernanceOperatorConsoleSnapshot;
  governanceAuthority?: GovernanceAuthoritySnapshot;
  governanceEnforcement?: GovernanceEnforcementSnapshot;
  licenses: LicenseEntity[];
  licenseRuntimes?: LicenseRuntimeEntity[];
  entitlementSnapshots?: EntitlementSnapshotEntity[];
  entitlementEnforcements?: EntitlementEnforcementRecord[];
  entitlementEnforcementSnapshots?: EntitlementEnforcementSnapshot[];
  purchases: PurchaseEntity[];
  settlements?: SettlementRuntime[];
  settlementSnapshots?: SettlementRuntimeSnapshot[];
  royaltyDistributions?: RoyaltyDistributionRuntime[];
  royaltyDistributionSnapshots?: RoyaltyDistributionSnapshot[];
  subscriptions: SubscriptionEntity[];
  billingPreviews: BillingPreviewEntity[];
  invoices?: InvoicePreviewEntity[];
  accountingTelemetry?: AccountingTelemetryEntity[];
  auditLogs?: AuditLogEntity[];
  reconciliationSnapshots?: ReconciliationSnapshotEntity[];
  ownershipReconciliationSnapshots?: OwnershipReconciliationSnapshot[];
  treasuryReconciliationSnapshots?: TreasuryReconciliationSnapshot[];
  realtimeSnapshots?: MarketplaceRealtimeSnapshot[];
  operationalResilienceSnapshots?: MarketplaceOperationalResilienceSnapshot[];
  indexerSnapshots?: IndexerSnapshotEntity[];
  chainIngestionEvents?: ChainIngestionEventEntity[];
  chainSnapshots?: ChainSnapshotEntity[];
  ownershipSnapshots?: OwnershipSnapshotEntity[];
  listingSnapshots?: ListingSnapshotEntity[];
  indexerRuntime?: MarketplaceIndexerRuntimeSnapshot;
  governanceValidations: GovernanceValidationEntity[];
  draftListings: DraftListingEntity[];
  deliveryPreviews: AssetDeliveryPreviewEntity[];
  greenfieldAuthRuntimes?: GreenfieldAuthRuntime[];
  greenfieldAuthSnapshots?: GreenfieldAuthRuntimeSnapshot[];
  signedUrlRuntimes?: SignedUrlRuntime[];
  signedUrlSnapshots?: SignedUrlRuntimeSnapshot[];
  secureDeliveryRuntimes?: SecureDeliveryRuntime[];
  secureDeliverySnapshots?: SecureDeliverySnapshot[];
  deliveryTelemetry?: DeliveryTelemetryRecord[];
  deliveryObservabilitySnapshots?: DeliveryObservabilitySnapshot[];
  events: MarketplaceRuntimeEventEntity[];
}

export interface DraftListingRequest {
  title: string;
  category: string;
  tokenStandard: string;
  listingType: string;
  chain: string;
  price: number;
  currency: string;
  royaltyBps: number;
  deliveryType: string;
  governanceReviewRequired: boolean;
  description: string;
}

export interface PurchasePreviewRequest {
  productId: string;
  buyer?: string;
}

export interface BillingPreviewRequest {
  productId: string;
  buyer?: string;
}

export interface InvoicePreviewRequest {
  buyer?: string;
  productIds?: string[];
  subscriptionIds?: string[];
}

export interface InvoiceLifecycleRequest {
  invoiceId: string;
  state: InvoiceState;
  reason?: string;
}

export interface SubscriptionPreviewRequest {
  productId: string;
  holder?: string;
}

export interface LicenseLifecycleRequest {
  licenseId: string;
  state: LicenseLifecycleState;
  reason?: string;
}

export interface SubscriptionLifecycleRequest {
  subscriptionId: string;
  state: SubscriptionLifecycleState;
  reason?: string;
}

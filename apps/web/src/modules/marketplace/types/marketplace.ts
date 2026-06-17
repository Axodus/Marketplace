export type ProductCategory =
  | "Education"
  | "Governance"
  | "Trading"
  | "Business"
  | "MCPs"
  | "Digital Assets";

export type TokenStandard = "ERC721" | "ERC1155" | "OffchainLicense";
export type ListingType = "fixed" | "english-auction" | "dutch-auction" | "license-preview";
export type ProductStanding = "compliant" | "under-review" | "restricted" | "suspended" | "deprecated";
export type SellerStanding = "verified" | "warning" | "sanctioned" | "restricted" | "suspended";
export type ConstitutionalStanding = "aligned" | "requires-review" | "restricted" | "not-applicable";
export type ProductVisibility = "public" | "dao-gated" | "private-preview" | "restricted";
export type SellerType = "Individual" | "DAO" | "Company" | "Tutor" | "Partner" | "Internal Axodus Nucleus";
export type VerificationStatus = "verified" | "pending" | "rejected" | "internal";
export type TenantStatus =
  | "draft"
  | "configured-mock"
  | "active-mock"
  | "review-required"
  | "governance-review"
  | "restricted"
  | "disabled"
  | "archived";
export type TenantType = "global" | "community" | "creator" | "academy" | "acs" | "enterprise" | "dao" | "partner" | "demo";
export type TenantVisibility = "public-mock" | "private-preview" | "restricted" | "archived";
export type TenantGovernanceStatus = "governance-aligned" | "governance-review" | "restricted" | "disabled";
export type TenantThemeStatus = "global-default" | "configured-mock" | "tenant-custom-mock" | "review-required" | "restricted" | "disabled";
export type TenantThemeMode = "light" | "dark-preview" | "system";
export type TenantDomainType = "slug" | "alias" | "subdomain-simulated" | "custom-domain-simulated" | "global";
export type TenantDomainStatus = "active-mock" | "configured-mock" | "draft" | "review-required" | "restricted" | "disabled" | "conflict" | "not-found";
export type TenantDomainVerificationStatus =
  | "not-required-mock"
  | "pending-mock"
  | "verified-mock"
  | "review-required"
  | "restricted"
  | "disabled"
  | "not-verified";
export type TenantDomainResolutionStatus = "resolved" | "global-fallback" | "not-found" | "restricted" | "disabled" | "conflict" | "invalid";
export type TenantDomainInputType = "slug" | "alias" | "hostname" | "route" | "global";
export type TenantCatalogStatus = "configured-mock" | "active-mock" | "draft" | "review-required" | "restricted" | "disabled" | "empty" | "conflict";
export type TenantCatalogScope = "global" | "tenant" | "curated" | "federated" | "mixed";
export type TenantCatalogRuleType =
  | "allow-product"
  | "block-product"
  | "allow-collection"
  | "block-collection"
  | "allow-category"
  | "block-category"
  | "allow-external-collection"
  | "block-external-collection"
  | "feature-product"
  | "feature-collection"
  | "inherit-global"
  | "allow-federated-assets"
  | "block-federated-assets"
  | "allow-native-products"
  | "block-native-products";
export type TenantCatalogRuleEffect = "include" | "exclude" | "feature" | "inherit" | "restrict" | "warn";
export type TenantCatalogRuleTargetType = "product" | "collection" | "external-collection" | "category" | "catalog" | "asset-origin";
export type TenantCatalogSource =
  | "global catalog inheritance"
  | "tenant explicit allow rule"
  | "tenant featured rule"
  | "collection allow rule"
  | "category allow rule"
  | "federated catalog rule"
  | "external collection rule"
  | "global catalog";
export type CuratedCatalogStatus = "draft" | "configured-mock" | "active-mock" | "review-required" | "restricted" | "disabled" | "archived";
export type CuratedCatalogType = "curated" | "editorial" | "featured" | "segment" | "federated" | "mixed";
export type CuratedCatalogVisibility = "public-mock" | "tenant-preview" | "private-preview" | "restricted";
export type CuratedCatalogGovernanceStatus = "governance-aligned" | "governance-review" | "restricted" | "disabled";
export type CuratedCatalogOwnerScope = "global" | "tenant" | "community" | "academy" | "acs" | "dao" | "enterprise";
export type CuratedCatalogSectionType = "hero" | "featured" | "segment" | "editorial" | "federated" | "mixed";
export type CuratedCatalogItemType = "product" | "collection" | "external-collection";
export type CuratedCatalogRuleType =
  | "allow-product"
  | "block-product"
  | "allow-collection"
  | "block-collection"
  | "allow-category"
  | "block-category"
  | "allow-external-collection"
  | "block-external-collection"
  | "feature-product"
  | "feature-collection"
  | "require-governance-review"
  | "preserve-federation-boundary";
export type CuratedCatalogRuleEffect = "include" | "exclude" | "feature" | "warn" | "restrict";
export type CuratedCatalogRuleTargetType = "product" | "collection" | "external-collection" | "category" | "catalog" | "asset-origin";
export type CuratedCatalogItemSource =
  | "curated catalog rule"
  | "curated featured rule"
  | "curated section rule"
  | "editorial mock rule"
  | "federated catalog rule"
  | "tenant catalog reference"
  | "global catalog reference";
export type EditorialRuleType = "include" | "exclude" | "feature" | "restrict" | "warn" | "review-required" | "governance-review";
export type CurationReviewStatus =
  | "not-reviewed"
  | "editorial-review-mock"
  | "governance-review-mock"
  | "approved-mock"
  | "restricted"
  | "blocked"
  | "needs-update";
export type CurationWorkflowState = "draft-mock" | "editorial-review-mock" | "governance-review-mock" | "approved-mock" | "restricted" | "blocked";
export type CurationDecision = "include" | "exclude" | "feature" | "restrict" | "warn" | "needs-review";
export type CurationReason = "inclusion reason" | "exclusion reason" | "governance reason" | "review reason" | "restriction reason";
export type CatalogSegmentStatus = "configured-mock" | "active-mock" | "review-required" | "restricted" | "disabled";
export type FeaturedCatalogStatus = "configured-mock" | "active-mock" | "review-required" | "restricted" | "disabled";
export type CatalogSegmentType = "academy" | "acs" | "enterprise" | "community" | "creator" | "dao" | "federated" | "seasonal" | "demo";
export type FeaturedCatalogPlacement = "hero" | "section" | "tenant-preview" | "segment-highlight" | "federated-feature";
export type TenantCuratedCatalogRuleType =
  | "inherit-global-curated"
  | "allow-curated-catalog"
  | "block-curated-catalog"
  | "feature-curated-catalog"
  | "allow-segment"
  | "block-segment"
  | "allow-federated-curated"
  | "block-federated-curated";
export type TenantCuratedCatalogRuleEffect = "include" | "exclude" | "feature" | "inherit" | "restrict" | "warn";
export type TenantCuratedCatalogRuleTargetType = "curated-catalog" | "catalog-segment" | "federated-curated-catalog" | "global-curated-catalogs";
export type DistributionChannelType =
  | "tenant"
  | "partner"
  | "distributor"
  | "agency"
  | "affiliate"
  | "community"
  | "academy"
  | "acs"
  | "enterprise"
  | "creator"
  | "dao"
  | "demo";
export type DistributionStatus = "draft" | "configured-mock" | "active-mock" | "review-required" | "governance-review" | "restricted" | "disabled" | "archived";
export type DistributionVisibility = "public-mock" | "private-mock" | "tenant-only" | "restricted" | "hidden";
export type DistributionScope = "global" | "tenant" | "curated-catalog" | "catalog-segment" | "product" | "collection" | "community" | "demo";
export type DistributionGovernanceStatus = "governance-aligned" | "governance-review" | "restricted" | "disabled";
export type DistributionPlacementType = "storefront" | "catalog-section" | "featured-slot" | "campaign-mock" | "community-shelf" | "demo-preview";
export type DistributionPlacementTargetType = "tenant" | "curated-catalog" | "catalog-segment" | "product" | "collection" | "external-collection";
export type DistributionSourceType = "tenant-storefront" | "curated-catalog" | "catalog-segment" | "referral-mock" | "campaign-mock" | "placement-mock" | "community-mock";
export type AttributionSourceType =
  | DistributionSourceType
  | "distribution-channel"
  | "partner-profile"
  | "affiliate-profile"
  | "tenant-route"
  | "community-marketplace"
  | "manual-source-mock"
  | "demo";
export type CommercialOriginType = "tenant" | "partner" | "distributor" | "agency" | "affiliate" | "community" | "curated-catalog" | "campaign-mock" | "manual-mock" | "demo";
export type AttributionStatus = "not-tracked" | "simulated-only" | "configured-mock" | "active-mock" | "review-required" | "restricted" | "disabled";
export type TrackingMode = "none" | "simulated-only" | "manual-mock" | "referral-code-mock" | "campaign-label-mock" | "placement-mock";
export type AttributionScope = "global" | "tenant" | "channel" | "profile" | "catalog" | "curated-catalog" | "segment" | "placement" | "community" | "demo";
export type AttributionNoteType = "boundary" | "referral" | "campaign" | "placement" | "commercial-origin" | "distribution-source" | "risk";
export type AttributionNoteSeverity = "info" | "warning" | "restricted";
export type DistributionProfileType =
  | "distributor"
  | "partner"
  | "agency"
  | "affiliate"
  | "community-marketplace"
  | "tenant-operator"
  | "creator-network"
  | "academy-network"
  | "acs-network"
  | "enterprise-network"
  | "dao-network"
  | "demo";
export type DistributionProfileStatus =
  | "draft"
  | "configured-mock"
  | "active-mock"
  | "review-required"
  | "governance-review"
  | "restricted"
  | "disabled"
  | "archived";
export type DistributionProfileVisibility = "public-mock" | "private-mock" | "tenant-only" | "restricted" | "hidden";
export type DistributionProfileGovernanceStatus = "not-reviewed" | "review-required" | "governance-review-mock" | "approved-mock" | "restricted" | "blocked";
export type DistributionProfileRelationshipType = "operates-channel" | "represents-tenant" | "features-curated-catalog" | "covers-segment" | "community-context";
export type DistributionProfileRelationshipTargetType = "distribution-channel" | "tenant" | "curated-catalog" | "catalog-segment" | "community";
export type CommunityDistributionStatus = "draft" | "configured-mock" | "active-mock" | "review-required" | "governance-review" | "restricted" | "disabled" | "archived" | "empty";
export type CommunityDistributionVisibility = "public-mock" | "private-mock" | "community-only" | "tenant-only" | "restricted" | "hidden";
export type CommunityDistributionGovernanceStatus = "not-reviewed" | "review-required" | "governance-review-mock" | "approved-mock" | "restricted" | "blocked";
export type CommunityDistributionScope = "global" | "tenant" | "curated-catalog" | "catalog-segment" | "product" | "collection" | "mixed" | "demo";
export type CommunityType =
  | "creator-community"
  | "academy-community"
  | "acs-community"
  | "dao-community"
  | "enterprise-community"
  | "partner-community"
  | "local-community"
  | "federated-community"
  | "demo-community";
export type CommunityDistributionRuleType =
  | "allow-tenant"
  | "block-tenant"
  | "allow-curated-catalog"
  | "block-curated-catalog"
  | "allow-segment"
  | "block-segment"
  | "allow-product"
  | "block-product"
  | "allow-collection"
  | "block-collection"
  | "allow-federated-assets"
  | "block-federated-assets"
  | "feature-catalog"
  | "feature-product"
  | "feature-collection"
  | "warn"
  | "restrict";
export type CommunityDistributionRuleEffect = "include" | "exclude" | "feature" | "warn" | "restrict";
export type CommunityDistributionRuleTargetType = "tenant" | "curated-catalog" | "catalog-segment" | "product" | "collection" | "external-collection" | "federated-assets";
export type CommunityDistributionItemType = "tenant" | "curated-catalog" | "featured-catalog" | "catalog-segment" | "product" | "collection" | "external-collection";
export type TenantDistributionRuleType =
  | "allow-channel"
  | "block-channel"
  | "feature-channel"
  | "allow-profile"
  | "block-profile"
  | "allow-community-distribution"
  | "block-community-distribution"
  | "allow-attribution-source"
  | "block-attribution-source"
  | "allow-curated-catalog"
  | "block-curated-catalog"
  | "allow-segment"
  | "block-segment"
  | "allow-federated-assets"
  | "block-federated-assets"
  | "inherit-global-distribution"
  | "warn"
  | "restrict";
export type CuratedCatalogDistributionRuleType =
  | "allow-channel"
  | "block-channel"
  | "feature-channel"
  | "allow-profile"
  | "block-profile"
  | "allow-community-distribution"
  | "block-community-distribution"
  | "allow-attribution-source"
  | "block-attribution-source"
  | "allow-tenant"
  | "block-tenant"
  | "allow-segment"
  | "block-segment"
  | "allow-federated-assets"
  | "block-federated-assets"
  | "inherit-global-distribution"
  | "warn"
  | "restrict";
export type DistributionIntegrationRuleEffect = "include" | "exclude" | "feature" | "inherit" | "warn" | "restrict";
export type DistributionIntegrationRuleTargetType =
  | "distribution-channel"
  | "distribution-profile"
  | "community-distribution"
  | "attribution-source"
  | "curated-catalog"
  | "tenant"
  | "catalog-segment"
  | "federated-assets"
  | "global-distribution";
export type DistributionIntegrationStatus =
  | "configured-mock"
  | "active-mock"
  | "review-required"
  | "governance-review"
  | "restricted"
  | "disabled"
  | "archived"
  | "empty"
  | "conflict";
export type DistributionIntegrationScope =
  | "tenant"
  | "curated-catalog"
  | "featured-catalog"
  | "catalog-segment"
  | "community-distribution"
  | "mixed"
  | "demo";
export type DistributionIntegratedContextType = "tenant" | "curated-catalog";
export type RevenueSharingStatus =
  | "draft"
  | "configured-mock"
  | "active-mock"
  | "preview-only"
  | "review-required"
  | "governance-review"
  | "restricted"
  | "disabled"
  | "archived"
  | "conflict";
export type RevenueSharingScope = "global" | "tenant" | "distribution-channel" | "distribution-profile" | "community-distribution" | "curated-catalog" | "catalog-segment" | "product" | "collection" | "demo";
export type RevenueParticipantType =
  | "platform"
  | "tenant"
  | "creator"
  | "seller"
  | "distributor"
  | "partner"
  | "agency"
  | "affiliate"
  | "community"
  | "academy"
  | "acs"
  | "enterprise"
  | "dao"
  | "curator"
  | "provider"
  | "demo";
export type RevenueGovernanceStatus = "not-reviewed" | "review-required" | "governance-review-mock" | "approved-mock" | "restricted" | "blocked";
export type RevenueSplitRuleType =
  | "fixed-percentage-mock"
  | "weighted-percentage-mock"
  | "flat-amount-mock"
  | "tiered-mock"
  | "attribution-based-mock"
  | "catalog-based-mock"
  | "tenant-based-mock"
  | "distribution-based-mock"
  | "community-based-mock"
  | "manual-mock"
  | "demo";
export type RevenueSplitTargetType = "tenant" | "distribution-channel" | "distribution-profile" | "community-distribution" | "curated-catalog" | "catalog-segment" | "product" | "collection" | "global" | "demo";
export type ParticipantShareType = "percentage-mock" | "weighted-percentage-mock" | "flat-amount-mock" | "tiered-mock" | "manual-mock" | "demo";
export type CommissionModelStatus = "valid-mock" | "warning-mock" | "conflict-mock" | "incomplete" | "restricted" | "disabled";
export type ParticipantShareValidationStatus = CommissionModelStatus;
export type AttributionToSplitStatus = "configured-mock" | "simulated-only" | "preview-only" | "review-required" | "blocked" | "disabled";
export type RevenueSharingPreviewStatus = "preview-only" | "configured-mock" | "warning-mock" | "conflict-mock" | "blocked" | "disabled";
export type RevenueSharingAuditEventType =
  | "preview-generated-mock"
  | "rule-applied-mock"
  | "rule-blocked-mock"
  | "participant-share-explained-mock"
  | "conflict-warning-mock"
  | "payout-preview-mock"
  | "settlement-preview-mock"
  | "boundary-note-mock";
export type RevenueSplitConflictPolicy = "warn-only" | "block-preview" | "review-required" | "manual-resolution";
export type SettlementBoundaryStatus = "no-settlement" | "preview-only" | "blocked" | "review-required" | "restricted" | "disabled" | "not-configured";
export type LicenseType =
  | "Personal Use"
  | "DAO License"
  | "Enterprise License"
  | "NFT Access License"
  | "Subscription License";
export type DeliveryType = "Greenfield" | "Signed URL" | "MCP Runtime" | "Dashboard Access" | "Manual Service";
export type Chain = "Ethereum" | "BNB" | "Arbitrum" | "Harmony" | "Polygon";
export type PurchaseStatus = "mock-issued" | "pending-governance-review" | "blocked";
export type CollectionOrigin = "native" | "external" | "federated";
export type AssetHistoryStatus = "mock-confirmed" | "mock-pending" | "mock-blocked";
export type FederationValidationStatus =
  | "unverified"
  | "provider-reported"
  | "metadata-validated"
  | "contract-referenced"
  | "contract-reviewed"
  | "collection-reviewed"
  | "governance-reviewed"
  | "blocked"
  | "quarantined";
export type FederationRiskClassification =
  | "low-mock"
  | "medium-mock"
  | "high-mock"
  | "unknown-external"
  | "metadata-risk"
  | "contract-risk"
  | "provider-risk"
  | "phishing-risk"
  | "blocked";

export interface Pricing {
  amount: number;
  currency: string;
  settlementMode: "mock-only" | "future-on-chain";
}

export interface RoyaltyModel {
  standard: "EIP-2981" | "Custom Split" | "None";
  bps: number;
  recipient: string;
  previewAmount: number;
}

export interface AuctionState {
  type: Extract<ListingType, "english-auction" | "dutch-auction">;
  status: "scheduled" | "active" | "ended";
  reservePrice: number;
  highestBid?: number;
  bidCount: number;
  endsAt: string;
}

export interface BridgeReadiness {
  layerZeroReady: boolean;
  sourceChain: Chain;
  destinationChains: Chain[];
  notes: string;
}

export interface TenantIdentity {
  displayName: string;
  shortName: string;
  handle: string;
  description: string;
  operatorName: string;
  operatorType: string;
  supportLabel: string;
  trustLabel: string;
  governanceLabel: string;
}

export interface TenantConfiguration {
  defaultRoute: string;
  enabledSections: string[];
  featuredCollectionIds: string[];
  featuredProductIds: string[];
  allowedCategoryIds: ProductCategory[];
  allowedCollectionIds: string[];
  allowedProductIds: string[];
  allowedExternalCollectionIds: string[];
  blockedProductIds: string[];
  blockedCollectionIds: string[];
  canDisplay: boolean;
  canTrade: boolean;
  canSettle: boolean;
  canRouteCustomDomain: boolean;
  isWhiteLabel: boolean;
  isCommunityMarketplace: boolean;
  isFederatedCatalogEnabled: boolean;
  isTenantCatalogEnabled: boolean;
}

export interface TenantCatalogRule {
  id: string;
  tenantId: string;
  ruleType: TenantCatalogRuleType;
  targetType: TenantCatalogRuleTargetType;
  targetId: string;
  effect: TenantCatalogRuleEffect;
  reason: string;
  priority: number;
  status: TenantCatalogStatus;
  source: TenantCatalogSource | "tenant catalog rule";
  warnings: string[];
  disclaimers: string[];
}

export interface TenantExposureRule extends TenantCatalogRule {
  exposureLabel: string;
}

export interface TenantCatalog {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  status: TenantCatalogStatus;
  scope: TenantCatalogScope;
  inheritsGlobalCatalog: boolean;
  allowsFederatedAssets: boolean;
  allowsExternalCollections: boolean;
  allowsNativeProducts: boolean;
  featuredProductIds: string[];
  featuredCollectionIds: string[];
  allowedProductIds: string[];
  blockedProductIds: string[];
  allowedCollectionIds: string[];
  blockedCollectionIds: string[];
  allowedExternalCollectionIds: string[];
  blockedExternalCollectionIds: string[];
  allowedCategoryIds: ProductCategory[];
  blockedCategoryIds: ProductCategory[];
  exposureRules: TenantExposureRule[];
  rules: TenantCatalogRule[];
  warnings: string[];
  disclaimers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TenantTheme {
  themeId: string;
  themeName: string;
  themeMode: TenantThemeMode;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundHint: string;
  surfaceHint: string;
  textHint: string;
  borderRadius: "sm" | "md";
  density: "compact" | "comfortable";
  contrastLevel: "standard" | "high";
  isCustomTheme: boolean;
  isMockTheme: boolean;
}

export interface TenantVisualIdentity {
  headline: string;
  subheadline: string;
  badgeLabel: string;
  trustLabel: string;
  operatorLabel: string;
  governanceLabel: string;
  marketplaceLabel: string;
}

export interface TenantBranding {
  logoUrl?: string;
  logoAlt: string;
  iconUrl?: string;
  displayName: string;
  shortName: string;
  tagline: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundHint: string;
  surfaceHint: string;
  textHint: string;
  themeMode: TenantThemeMode;
  visualStyle: "global-default" | "academy" | "acs" | "community";
  brandStatus: TenantThemeStatus;
  isBrandingEnabled: boolean;
  usesGlobalFallback: boolean;
  warnings: string[];
  disclaimers: string[];
  theme: TenantTheme;
  visualIdentity: TenantVisualIdentity;
}

export interface TenantDomain {
  id: string;
  tenantId: string;
  domainType: TenantDomainType;
  hostname?: string;
  slug?: string;
  alias?: string;
  displayLabel: string;
  status: TenantDomainStatus;
  verificationStatus: TenantDomainVerificationStatus;
  routingMode: "mock-read-only";
  isPrimary: boolean;
  isSimulated: boolean;
  canRoute: boolean;
  createdAt: string;
  updatedAt: string;
  warnings: string[];
  disclaimers: string[];
}

export interface TenantDomainAlias {
  id: string;
  tenantId: string;
  alias: string;
  aliasType: "slug-alias" | "display-alias" | "domain-alias";
  targetTenantSlug: string;
  status: TenantDomainStatus;
  isPrimary: boolean;
  isSimulated: boolean;
  warnings: string[];
  disclaimers: string[];
}

export interface TenantDomainResolution {
  input: string;
  inputType: TenantDomainInputType;
  matchedTenantId?: string;
  matchedTenantSlug?: string;
  matchedDomainId?: string;
  resolutionStatus: TenantDomainResolutionStatus;
  routingMode: "mock-read-only";
  isFallback: boolean;
  warnings: string[];
  disclaimers: string[];
}

export interface TenantRoutingContext {
  tenant: Tenant;
  domain: TenantDomain | null;
  resolution: TenantDomainResolution;
  isTenantRoute: boolean;
  isGlobalRoute: boolean;
  isSimulatedRoute: boolean;
  canRoute: boolean;
  warnings: string[];
  disclaimers: string[];
}

export interface TenantCatalogItem {
  productId?: string;
  collectionId?: string;
  tenantId: string;
  source: TenantCatalogSource;
  inclusionReason: string;
  exclusionReason?: string;
  isFeatured: boolean;
  isFederated: boolean;
  isExternal: boolean;
  isNative: boolean;
  canDisplay: boolean;
  canTrade: boolean;
  canSettle: boolean;
  warnings: string[];
  disclaimers: string[];
}

export interface TenantCatalogResolution {
  tenantId: string;
  resolvedAt: string;
  includedProductIds: string[];
  excludedProductIds: string[];
  includedCollectionIds: string[];
  excludedCollectionIds: string[];
  includedExternalCollectionIds: string[];
  excludedExternalCollectionIds: string[];
  featuredProductIds: string[];
  featuredCollectionIds: string[];
  appliedRules: TenantCatalogRule[];
  blockedRules: TenantCatalogRule[];
  productItems: TenantCatalogItem[];
  collectionItems: TenantCatalogItem[];
  warnings: string[];
  disclaimers: string[];
}

export interface TenantCuratedCatalogRule {
  id: string;
  tenantId: string;
  ruleType: TenantCuratedCatalogRuleType;
  targetType: TenantCuratedCatalogRuleTargetType;
  targetId: string;
  effect: TenantCuratedCatalogRuleEffect;
  reason: string;
  priority: number;
  status: TenantCatalogStatus;
  warnings: string[];
  disclaimers: string[];
}

export interface TenantCuratedCatalogConfig {
  tenantId: string;
  inheritsGlobalCuratedCatalogs: boolean;
  allowedCuratedCatalogIds: string[];
  blockedCuratedCatalogIds: string[];
  featuredCuratedCatalogIds: string[];
  allowedSegmentIds: string[];
  blockedSegmentIds: string[];
  allowsFederatedCuratedCatalogs: boolean;
  rules: TenantCuratedCatalogRule[];
  warnings: string[];
  disclaimers: string[];
}

export interface TenantCuratedCatalogItem {
  itemId: string;
  catalogId: string;
  tenantId: string;
  itemType: CuratedCatalogItemType;
  productId?: string;
  collectionId?: string;
  externalCollectionId?: string;
  inclusionReason?: string;
  exclusionReason?: string;
  canDisplay: boolean;
  isFeatured: boolean;
  isFederated: boolean;
  warnings: string[];
  disclaimers: string[];
}

export interface TenantCuratedCatalogResolution {
  tenantId: string;
  resolvedAt: string;
  includedCatalogIds: string[];
  excludedCatalogIds: string[];
  featuredCatalogIds: string[];
  appliedRules: TenantCuratedCatalogRule[];
  includedItems: TenantCuratedCatalogItem[];
  excludedItems: TenantCuratedCatalogItem[];
  warnings: string[];
  disclaimers: string[];
}

export interface CommercialOrigin {
  originType: CommercialOriginType;
  originLabel: string;
  channelId: string;
  tenantId?: string;
  partnerId?: string;
  distributorId?: string;
  sourceLabel: string;
  isSimulated: boolean;
  warnings: string[];
  disclaimers: string[];
}

export interface AttributionSource {
  id: string;
  sourceType: DistributionSourceType;
  sourceLabel: string;
  channelId: string;
  tenantId?: string;
  catalogId?: string;
  placementId?: string;
  campaignLabel?: string;
  referralCodeMock?: string;
  trackingMode: TrackingMode;
  status: AttributionStatus;
  isSimulated: boolean;
  canTrack: boolean;
  canAttributeRevenue: boolean;
  warnings: string[];
  disclaimers: string[];
}

export interface DistributionSource {
  id: string;
  sourceType: DistributionSourceType;
  sourceLabel: string;
  channelId: string;
  tenantId?: string;
  catalogId?: string;
  placementId?: string;
  status: DistributionStatus | AttributionStatus;
  isSimulated: boolean;
  warnings: string[];
  disclaimers: string[];
}

export interface DistributionPlacement {
  id: string;
  channelId: string;
  placementType: DistributionPlacementType;
  placementLabel: string;
  targetType: DistributionPlacementTargetType;
  targetId: string;
  catalogId?: string;
  curatedCatalogId?: string;
  tenantId?: string;
  position: number;
  status: DistributionStatus;
  visibility: DistributionVisibility;
  warnings: string[];
  disclaimers: string[];
}

export interface DistributionChannel {
  id: string;
  slug: string;
  name: string;
  displayName: string;
  description: string;
  channelType: DistributionChannelType;
  status: DistributionStatus;
  visibility: DistributionVisibility;
  governanceStatus: DistributionGovernanceStatus;
  scope: DistributionScope;
  operatorType: string;
  operatorId: string;
  tenantId?: string;
  partnerId?: string;
  distributorId?: string;
  communityId?: string;
  allowedCatalogIds: string[];
  allowedCuratedCatalogIds: string[];
  allowedSegmentIds: string[];
  allowedProductIds: string[];
  allowedCollectionIds: string[];
  blockedCatalogIds: string[];
  blockedProductIds: string[];
  blockedCollectionIds: string[];
  allowsFederatedAssets: boolean;
  commercialOrigin: CommercialOrigin;
  attributionSource: AttributionSource;
  distributionSource: DistributionSource;
  placementIds: string[];
  canDisplay: boolean;
  canTrack: boolean;
  canAttributeRevenue: boolean;
  canSettle: boolean;
  warnings: string[];
  disclaimers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DistributionNetwork {
  id: string;
  slug: string;
  name: string;
  displayName: string;
  description: string;
  status: DistributionStatus;
  visibility: DistributionVisibility;
  governanceStatus: DistributionGovernanceStatus;
  channelIds: string[];
  defaultChannelId: string;
  warnings: string[];
  disclaimers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DistributionProfileRelationship {
  id: string;
  profileId: string;
  relationshipType: DistributionProfileRelationshipType;
  targetType: DistributionProfileRelationshipTargetType;
  targetId: string;
  status: DistributionProfileStatus;
  visibility: DistributionProfileVisibility;
  governanceStatus: DistributionProfileGovernanceStatus;
  warnings: string[];
  disclaimers: string[];
}

export interface DistributionProfile {
  id: string;
  slug: string;
  name: string;
  displayName: string;
  description: string;
  profileType: DistributionProfileType;
  status: DistributionProfileStatus;
  visibility: DistributionProfileVisibility;
  governanceStatus: DistributionProfileGovernanceStatus;
  operatorType: string;
  operatorLabel: string;
  trustLabel: string;
  commercialLabel: string;
  tenantIds: string[];
  channelIds: string[];
  curatedCatalogIds: string[];
  catalogSegmentIds: string[];
  communityId?: string;
  contactLabel?: string;
  websiteLabel?: string;
  regionLabel?: string;
  capabilityLabels: string[];
  limitationLabels: string[];
  relationships: DistributionProfileRelationship[];
  warnings: string[];
  disclaimers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AttributionNote {
  id: string;
  sourceId: string;
  noteType: AttributionNoteType;
  title: string;
  description: string;
  severity: AttributionNoteSeverity;
  status: AttributionStatus;
  warnings: string[];
  disclaimers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AttributionSourceRecord {
  id: string;
  slug: string;
  name: string;
  displayName: string;
  description: string;
  sourceType: AttributionSourceType;
  status: AttributionStatus | "governance-review" | "archived";
  scope: AttributionScope;
  trackingMode: TrackingMode;
  channelId?: string;
  profileId?: string;
  tenantId?: string;
  catalogId?: string;
  curatedCatalogId?: string;
  segmentId?: string;
  placementId?: string;
  campaignLabel?: string;
  referralCodeMock?: string;
  sourceLabel: string;
  commercialOrigin: CommercialOrigin;
  distributionSource: DistributionSource;
  attributionNotes: AttributionNote[];
  isSimulated: boolean;
  canTrack: boolean;
  canAttributeRevenue: boolean;
  canTriggerPayout: boolean;
  canSettle: boolean;
  warnings: string[];
  disclaimers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AttributionContext {
  sourceId: string;
  resolvedAt: string;
  sourceType: AttributionSourceType;
  trackingMode: TrackingMode;
  channelId?: string;
  profileId?: string;
  tenantId?: string;
  catalogId?: string;
  curatedCatalogId?: string;
  segmentId?: string;
  placementId?: string;
  commercialOriginLabel: string;
  isSimulated: boolean;
  canTrack: boolean;
  canAttributeRevenue: boolean;
  canTriggerPayout: boolean;
  canSettle: boolean;
  warnings: string[];
  disclaimers: string[];
}

export interface AttributionToSplitRule {
  id: string;
  slug: string;
  name: string;
  description: string;
  status: AttributionToSplitStatus;
  attributionSourceId: string;
  distributionSourceId: string;
  commercialOriginId: string;
  distributionChannelId?: string;
  distributionProfileId?: string;
  communityDistributionId?: string;
  tenantId?: string;
  curatedCatalogId?: string;
  targetPolicyId: string;
  targetCommissionModelId: string;
  targetParticipantId: string;
  suggestedShareType: ParticipantShareType;
  suggestedShareValue: number;
  priority: number;
  reason: string;
  isSimulated: boolean;
  canTrack: boolean;
  canAttributeRevenue: boolean;
  canSettle: boolean;
  canTriggerPayout: boolean;
  warnings: string[];
  disclaimers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AttributionSplitMapping {
  ruleId: string;
  attributionSourceId: string;
  participantShareIds: string[];
  targetPolicyId: string;
  targetCommissionModelId: string;
  targetParticipantId: string;
  suggestedShareType: ParticipantShareType;
  suggestedShareValue: number;
  isSimulated: boolean;
  boundaryNotes: string[];
}

export interface CommercialOriginSplitMapping {
  commercialOriginId: string;
  originLabel: string;
  appliedRuleIds: string[];
  targetPolicyIds: string[];
  isSimulated: boolean;
  boundaryNotes: string[];
}

export interface DistributionSourceSplitMapping {
  distributionSourceId: string;
  sourceLabel: string;
  appliedRuleIds: string[];
  targetPolicyIds: string[];
  targetCommissionModelIds: string[];
  isSimulated: boolean;
  boundaryNotes: string[];
}

export interface AttributionSplitResolution {
  attributionSourceId: string;
  resolvedAt: string;
  policyId?: string;
  commissionModelId?: string;
  participantShareIds: string[];
  appliedRuleIds: string[];
  blockedRuleIds: string[];
  warnings: string[];
  disclaimers: string[];
  canTrack: boolean;
  canAttributeRevenue: boolean;
  canSettle: boolean;
  canTriggerPayout: boolean;
}

export interface AttributionSplitExplanation {
  ruleId: string;
  ruleName: string;
  reason: string;
  attributionSourceId: string;
  distributionSourceId: string;
  commercialOriginId: string;
  targetPolicyId: string;
  targetCommissionModelId: string;
  targetParticipantId: string;
  participantShareIds: string[];
  suggestedShareLabel: string;
  status: AttributionToSplitStatus;
  priority: number;
  boundaryNotes: string[];
}

export interface PayoutPreviewMock {
  id: string;
  previewId: string;
  policyId: string;
  status: "preview-only" | "blocked" | "disabled";
  payoutLabelMock: string;
  participantShareIds: string[];
  canTriggerPayout: boolean;
  canReceivePayout: boolean;
  warnings: string[];
  disclaimers: string[];
}

export interface SettlementPreviewMock {
  id: string;
  previewId: string;
  policyId: string;
  status: "preview-only" | "blocked" | "disabled";
  settlementLabelMock: string;
  settlementBoundaryId: string;
  canSettle: boolean;
  canRouteTreasury: boolean;
  canInvoice: boolean;
  canAccount: boolean;
  warnings: string[];
  disclaimers: string[];
}

export interface RevenueSharingPreview {
  id: string;
  policyId: string;
  commissionModelId: string;
  generatedAt: string;
  previewStatus: RevenueSharingPreviewStatus;
  participantShareIds: string[];
  attributionSourceIds: string[];
  commercialOriginId?: string;
  appliedRuleIds: string[];
  blockedRuleIds: string[];
  conflictIds: string[];
  totalShareValueMock: number;
  canCalculatePreview: boolean;
  canSettle: boolean;
  canTriggerPayout: boolean;
  canRouteTreasury: boolean;
  canInvoice: boolean;
  canAccount: boolean;
  warnings: string[];
  disclaimers: string[];
}

export interface RevenueSharingAuditEntry {
  id: string;
  policyId: string;
  eventType: RevenueSharingAuditEventType;
  eventLabel: string;
  targetType: "policy" | "commission-model" | "split-rule" | "participant-share" | "attribution-source" | "payout-preview" | "settlement-preview" | "boundary";
  targetId: string;
  ruleId?: string;
  participantId?: string;
  attributionSourceId?: string;
  reason: string;
  severity: "info" | "warning" | "conflict" | "blocked";
  createdAt: string;
  isSimulated: boolean;
  warnings: string[];
  disclaimers: string[];
}

export interface ParticipantSplitExplanation {
  participantId: string;
  participantLabel: string;
  participantType: RevenueParticipantType;
  participantShareId: string;
  sourceRuleId: string;
  shareLabel: string;
  attributionSourceId?: string;
  commercialOriginId?: string;
  canSettle: boolean;
  canTriggerPayout: boolean;
  canReceivePayout: boolean;
  boundaryNotes: string[];
}

export interface CommunityDistributionRule {
  id: string;
  communityDistributionId: string;
  ruleType: CommunityDistributionRuleType;
  targetType: CommunityDistributionRuleTargetType;
  targetId: string;
  effect: CommunityDistributionRuleEffect;
  reason: string;
  priority: number;
  status: CommunityDistributionStatus;
  warnings: string[];
  disclaimers: string[];
}

export interface CommunityDistributionItem {
  id: string;
  communityDistributionId: string;
  itemType: CommunityDistributionItemType;
  targetId: string;
  tenantId?: string;
  catalogId?: string;
  curatedCatalogId?: string;
  segmentId?: string;
  productId?: string;
  collectionId?: string;
  source: string;
  inclusionReason: string;
  exclusionReason?: string;
  isFeatured: boolean;
  isFederated: boolean;
  isExternal: boolean;
  isNative: boolean;
  canDisplay: boolean;
  canTrack: boolean;
  canAttributeRevenue: boolean;
  canTriggerPayout: boolean;
  canSettle: boolean;
  warnings: string[];
  disclaimers: string[];
}

export interface CommunityDistributionContext {
  communityDistributionId: string;
  resolvedAt: string;
  profileId: string;
  channelId: string;
  tenantIds: string[];
  curatedCatalogIds: string[];
  featuredCatalogIds: string[];
  segmentIds: string[];
  includedProductIds: string[];
  excludedProductIds: string[];
  includedCollectionIds: string[];
  excludedCollectionIds: string[];
  attributionSourceId: string;
  commercialOriginLabel: string;
  isSimulated: boolean;
  canDisplay: boolean;
  canTrack: boolean;
  canAttributeRevenue: boolean;
  canTriggerPayout: boolean;
  canSettle: boolean;
  warnings: string[];
  disclaimers: string[];
}

export interface CommunityMarketplaceDistribution {
  id: string;
  slug: string;
  name: string;
  displayName: string;
  description: string;
  communityType: CommunityType;
  status: CommunityDistributionStatus;
  visibility: CommunityDistributionVisibility;
  governanceStatus: CommunityDistributionGovernanceStatus;
  scope: CommunityDistributionScope;
  profileId: string;
  channelId: string;
  tenantIds: string[];
  curatedCatalogIds: string[];
  featuredCatalogIds: string[];
  segmentIds: string[];
  productIds: string[];
  collectionIds: string[];
  allowedProductIds: string[];
  blockedProductIds: string[];
  allowedCollectionIds: string[];
  blockedCollectionIds: string[];
  allowsFederatedAssets: boolean;
  attributionSourceId: string;
  commercialOriginId: string;
  distributionSourceId: string;
  featuredReason?: string;
  rules: CommunityDistributionRule[];
  items: CommunityDistributionItem[];
  warnings: string[];
  disclaimers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TenantDistributionRule {
  id: string;
  tenantId: string;
  ruleType: TenantDistributionRuleType;
  targetType: DistributionIntegrationRuleTargetType;
  targetId: string;
  effect: DistributionIntegrationRuleEffect;
  reason: string;
  priority: number;
  status: DistributionIntegrationStatus;
  warnings: string[];
  disclaimers: string[];
}

export interface CuratedCatalogDistributionRule {
  id: string;
  curatedCatalogId: string;
  ruleType: CuratedCatalogDistributionRuleType;
  targetType: DistributionIntegrationRuleTargetType;
  targetId: string;
  effect: DistributionIntegrationRuleEffect;
  reason: string;
  priority: number;
  status: DistributionIntegrationStatus;
  warnings: string[];
  disclaimers: string[];
}

export interface TenantDistributionConfig {
  tenantId: string;
  status: DistributionIntegrationStatus;
  scope: DistributionIntegrationScope;
  inheritsGlobalDistributionChannels: boolean;
  allowedDistributionChannelIds: string[];
  blockedDistributionChannelIds: string[];
  featuredDistributionChannelIds: string[];
  allowedDistributionProfileIds: string[];
  blockedDistributionProfileIds: string[];
  allowedCommunityDistributionIds: string[];
  blockedCommunityDistributionIds: string[];
  allowedAttributionSourceIds: string[];
  blockedAttributionSourceIds: string[];
  allowedCuratedCatalogIds: string[];
  blockedCuratedCatalogIds: string[];
  allowedSegmentIds: string[];
  blockedSegmentIds: string[];
  allowsFederatedAssets: boolean;
  canDisplay: boolean;
  canTrack: boolean;
  canAttributeRevenue: boolean;
  canTriggerPayout: boolean;
  canSettle: boolean;
  rules: TenantDistributionRule[];
  warnings: string[];
  disclaimers: string[];
}

export interface CuratedCatalogDistributionConfig {
  curatedCatalogId: string;
  status: DistributionIntegrationStatus;
  scope: DistributionIntegrationScope;
  inheritsGlobalDistributionChannels: boolean;
  allowedDistributionChannelIds: string[];
  blockedDistributionChannelIds: string[];
  featuredDistributionChannelIds: string[];
  allowedDistributionProfileIds: string[];
  blockedDistributionProfileIds: string[];
  allowedCommunityDistributionIds: string[];
  blockedCommunityDistributionIds: string[];
  allowedAttributionSourceIds: string[];
  blockedAttributionSourceIds: string[];
  allowedTenantIds: string[];
  blockedTenantIds: string[];
  allowedSegmentIds: string[];
  blockedSegmentIds: string[];
  allowsFederatedAssets: boolean;
  canDisplay: boolean;
  canTrack: boolean;
  canAttributeRevenue: boolean;
  canTriggerPayout: boolean;
  canSettle: boolean;
  rules: CuratedCatalogDistributionRule[];
  warnings: string[];
  disclaimers: string[];
}

export interface TenantDistributionResolution {
  tenantId: string;
  resolvedAt: string;
  includedChannelIds: string[];
  excludedChannelIds: string[];
  featuredChannelIds: string[];
  includedProfileIds: string[];
  excludedProfileIds: string[];
  includedCommunityDistributionIds: string[];
  excludedCommunityDistributionIds: string[];
  includedAttributionSourceIds: string[];
  excludedAttributionSourceIds: string[];
  includedCuratedCatalogIds: string[];
  excludedCuratedCatalogIds: string[];
  includedSegmentIds: string[];
  excludedSegmentIds: string[];
  appliedRules: TenantDistributionRule[];
  blockedRules: TenantDistributionRule[];
  warnings: string[];
  disclaimers: string[];
}

export interface CuratedCatalogDistributionResolution {
  curatedCatalogId: string;
  resolvedAt: string;
  includedChannelIds: string[];
  excludedChannelIds: string[];
  featuredChannelIds: string[];
  includedProfileIds: string[];
  excludedProfileIds: string[];
  includedCommunityDistributionIds: string[];
  excludedCommunityDistributionIds: string[];
  includedAttributionSourceIds: string[];
  excludedAttributionSourceIds: string[];
  includedTenantIds: string[];
  excludedTenantIds: string[];
  includedSegmentIds: string[];
  excludedSegmentIds: string[];
  appliedRules: CuratedCatalogDistributionRule[];
  blockedRules: CuratedCatalogDistributionRule[];
  warnings: string[];
  disclaimers: string[];
}

export interface TenantRevenueSharingConfig {
  tenantId: string;
  policyIds: string[];
  defaultPolicyId: string;
  allowedDistributionPolicyIds: string[];
  blockedDistributionPolicyIds: string[];
  allowedCuratedCatalogPolicyIds: string[];
  blockedCuratedCatalogPolicyIds: string[];
  canCalculatePreview: boolean;
  canSettle: boolean;
  canTriggerPayout: boolean;
  canRouteTreasury: boolean;
  warnings: string[];
  disclaimers: string[];
}

export interface DistributionRevenueSharingConfig {
  distributionChannelId: string;
  profileId?: string;
  communityDistributionId?: string;
  policyIds: string[];
  defaultPolicyId: string;
  attributionSourceIds: string[];
  commercialOriginId?: string;
  canCalculatePreview: boolean;
  canSettle: boolean;
  canTriggerPayout: boolean;
  canRouteTreasury: boolean;
  warnings: string[];
  disclaimers: string[];
}

export interface CuratedCatalogRevenueSharingConfig {
  curatedCatalogId: string;
  policyIds: string[];
  defaultPolicyId: string;
  attributionSourceIds: string[];
  commercialOriginId?: string;
  canCalculatePreview: boolean;
  canSettle: boolean;
  canTriggerPayout: boolean;
  canRouteTreasury: boolean;
  warnings: string[];
  disclaimers: string[];
}

export interface CommunityRevenueSharingConfig {
  communityDistributionId: string;
  policyIds: string[];
  defaultPolicyId: string;
  attributionSourceIds: string[];
  commercialOriginId?: string;
  canCalculatePreview: boolean;
  canSettle: boolean;
  canTriggerPayout: boolean;
  canRouteTreasury: boolean;
  warnings: string[];
  disclaimers: string[];
}

export interface RevenueSharingIntegratedContext {
  contextType: "tenant" | "distribution-channel" | "distribution-profile" | "community-distribution" | "curated-catalog";
  tenantId?: string;
  distributionChannelId?: string;
  distributionProfileId?: string;
  communityDistributionId?: string;
  curatedCatalogId?: string;
  policyId?: string;
  commissionModelId?: string;
  previewId?: string;
  settlementBoundaryId?: string;
  canCalculatePreview: boolean;
  canSettle: boolean;
  canTriggerPayout: boolean;
  canRouteTreasury: boolean;
  warnings: string[];
  disclaimers: string[];
}

export interface RevenueSharingResolution {
  contextType: RevenueSharingIntegratedContext["contextType"];
  contextId: string;
  resolvedAt: string;
  policyIds: string[];
  defaultPolicyId?: string;
  commissionModelIds: string[];
  previewIds: string[];
  settlementBoundaryIds: string[];
  attributionSourceIds: string[];
  appliedAttributionRuleIds: string[];
  blockedAttributionRuleIds: string[];
  warnings: string[];
  disclaimers: string[];
  canCalculatePreview: boolean;
  canSettle: boolean;
  canTriggerPayout: boolean;
  canRouteTreasury: boolean;
}

export interface DistributionIntegratedContext {
  contextId: string;
  contextType: DistributionIntegratedContextType;
  tenantId?: string;
  curatedCatalogId?: string;
  channelId?: string;
  profileId?: string;
  communityDistributionId?: string;
  attributionSourceId?: string;
  commercialOriginLabel: string;
  distributionSourceLabel: string;
  routingMode: string;
  isSimulated: boolean;
  canDisplay: boolean;
  canTrack: boolean;
  canAttributeRevenue: boolean;
  canTriggerPayout: boolean;
  canSettle: boolean;
  warnings: string[];
  disclaimers: string[];
}

export interface DistributionIntegratedItem {
  id: string;
  contextId: string;
  contextType: DistributionIntegratedContextType;
  targetType: DistributionIntegrationRuleTargetType;
  targetId: string;
  tenantId?: string;
  curatedCatalogId?: string;
  channelId?: string;
  profileId?: string;
  communityDistributionId?: string;
  attributionSourceId?: string;
  source: string;
  inclusionReason?: string;
  exclusionReason?: string;
  isFeatured: boolean;
  isFederated: boolean;
  isExternal: boolean;
  isNative: boolean;
  canDisplay: boolean;
  canTrack: boolean;
  canAttributeRevenue: boolean;
  canTriggerPayout: boolean;
  canSettle: boolean;
  warnings: string[];
  disclaimers: string[];
}

export interface RevenueParticipant {
  id: string;
  participantType: RevenueParticipantType;
  participantRefId: string;
  displayName: string;
  status: RevenueSharingStatus;
  governanceStatus: RevenueGovernanceStatus;
  walletLabelMock: string;
  payoutLabelMock: string;
  canReceivePayout: boolean;
  canSettle: boolean;
  warnings: string[];
  disclaimers: string[];
}

export interface RevenueSplitRule {
  id: string;
  policyId: string;
  ruleType: RevenueSplitRuleType;
  scope: RevenueSharingScope;
  targetType: RevenueSplitTargetType;
  targetId: string;
  participantType: RevenueParticipantType;
  participantId: string;
  shareType: ParticipantShareType;
  shareValue: number;
  priority: number;
  status: RevenueSharingStatus;
  capValueMock?: number;
  floorValueMock?: number;
  conflictPolicy: RevenueSplitConflictPolicy;
  warnings: string[];
  disclaimers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ParticipantShare {
  id: string;
  policyId: string;
  commissionModelId?: string;
  participantId: string;
  participantType: RevenueParticipantType;
  participantRefId: string;
  shareType: ParticipantShareType;
  shareValue: number;
  sourceRuleId: string;
  attributionSourceId?: string;
  commercialOriginId?: string;
  capValueMock?: number;
  floorValueMock?: number;
  isSimulated: boolean;
  canCalculatePreview: boolean;
  canSettle: boolean;
  canTriggerPayout: boolean;
  canReceivePayout: boolean;
  warnings: string[];
  disclaimers: string[];
}

export interface CommissionModelRule {
  id: string;
  commissionModelId: string;
  sourceRuleId: string;
  participantShareId: string;
  participantType: RevenueParticipantType;
  shareType: ParticipantShareType;
  shareValue: number;
  capValueMock?: number;
  floorValueMock?: number;
  validationStatus: ParticipantShareValidationStatus;
  conflictStatus: ParticipantShareValidationStatus;
  warnings: string[];
  disclaimers: string[];
}

export interface ParticipantShareConflict {
  id: string;
  commissionModelId: string;
  participantShareId?: string;
  severity: "info" | "warning" | "conflict";
  conflictType: "share-total" | "cap" | "floor" | "missing-participant" | "boundary";
  message: string;
  isBlocking: boolean;
  warnings: string[];
  disclaimers: string[];
}

export interface ParticipantShareValidation {
  commissionModelId: string;
  policyId: string;
  totalShareValueMock: number;
  validationStatus: ParticipantShareValidationStatus;
  conflictStatus: ParticipantShareValidationStatus;
  capWarnings: string[];
  floorWarnings: string[];
  conflictWarnings: string[];
  boundaryNotes: string[];
  conflicts: ParticipantShareConflict[];
}

export interface CommissionModel {
  id: string;
  slug: string;
  name: string;
  displayName: string;
  description: string;
  scope: RevenueSharingScope;
  status: CommissionModelStatus;
  policyId: string;
  participantShareIds: string[];
  ruleIds: string[];
  shareType: ParticipantShareType;
  totalShareValueMock: number;
  validationStatus: ParticipantShareValidationStatus;
  conflictStatus: ParticipantShareValidationStatus;
  warnings: string[];
  disclaimers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SettlementBoundary {
  id: string;
  scope: RevenueSharingScope;
  scopeId: string;
  status: SettlementBoundaryStatus;
  canSettle: boolean;
  canTriggerPayout: boolean;
  canRouteTreasury: boolean;
  canInvoice: boolean;
  canAccount: boolean;
  boundaryLabel: string;
  warnings: string[];
  disclaimers: string[];
}

export interface RevenueSharingPolicy {
  id: string;
  slug: string;
  name: string;
  displayName: string;
  description: string;
  scope: RevenueSharingScope;
  status: RevenueSharingStatus;
  governanceStatus: RevenueGovernanceStatus;
  tenantId?: string;
  distributionChannelId?: string;
  distributionProfileId?: string;
  communityDistributionId?: string;
  curatedCatalogId?: string;
  catalogSegmentId?: string;
  productId?: string;
  collectionId?: string;
  participantIds: string[];
  ruleIds: string[];
  commissionModelIds?: string[];
  attributionSourceIds: string[];
  commercialOriginId?: string;
  settlementBoundaryId: string;
  allowsFederatedAssets: boolean;
  canCalculatePreview: boolean;
  canSettle: boolean;
  canTriggerPayout: boolean;
  canRouteTreasury: boolean;
  warnings: string[];
  disclaimers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CuratedCatalogRule {
  id: string;
  catalogId: string;
  sectionId?: string;
  ruleType: CuratedCatalogRuleType;
  targetType: CuratedCatalogRuleTargetType;
  targetId: string;
  effect: CuratedCatalogRuleEffect;
  priority: number;
  reason: string;
  status: CuratedCatalogStatus;
  source: CuratedCatalogItemSource;
  warnings: string[];
  disclaimers: string[];
}

export interface EditorialRule {
  id: string;
  catalogId: string;
  sectionId?: string;
  targetType: CuratedCatalogRuleTargetType;
  targetId: string;
  ruleType: EditorialRuleType;
  effect: CuratedCatalogRuleEffect;
  reason: string;
  editorialNote: string;
  reviewStatus: CurationReviewStatus;
  governanceLabel: string;
  priority: number;
  status: CuratedCatalogStatus;
  warnings: string[];
  disclaimers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CurationNote {
  id: string;
  targetType: CuratedCatalogRuleTargetType;
  targetId: string;
  noteType: CurationReason;
  note: string;
  reviewStatus: CurationReviewStatus;
  governanceLabel: string;
  createdAt: string;
}

export interface CatalogSegment {
  id: string;
  slug: string;
  name: string;
  displayName: string;
  description: string;
  segmentType: CatalogSegmentType;
  status: CatalogSegmentStatus;
  visibility: CuratedCatalogVisibility;
  featuredCatalogIds: string[];
  warnings: string[];
  disclaimers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FeaturedCatalog {
  id: string;
  catalogId: string;
  segmentId: string;
  placement: FeaturedCatalogPlacement;
  position: number;
  featuredReason: string;
  editorialStatus: CurationReviewStatus;
  governanceStatus: CuratedCatalogGovernanceStatus;
  status: FeaturedCatalogStatus;
  visibility: CuratedCatalogVisibility;
  warnings: string[];
  disclaimers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CuratedCatalogSection {
  id: string;
  catalogId: string;
  title: string;
  description: string;
  sectionType: CuratedCatalogSectionType;
  position: number;
  featuredProductIds: string[];
  featuredCollectionIds: string[];
  itemIds: string[];
  ruleIds: string[];
  visibility: CuratedCatalogVisibility;
  warnings: string[];
  disclaimers: string[];
}

export interface CuratedCatalogItem {
  id: string;
  catalogId: string;
  sectionId: string;
  itemType: CuratedCatalogItemType;
  productId?: string;
  collectionId?: string;
  externalCollectionId?: string;
  source: CuratedCatalogItemSource;
  inclusionReason: string;
  exclusionReason?: string;
  editorialNote: string;
  editorialStatus: CurationReviewStatus;
  governanceLabel: string;
  reviewState: CurationWorkflowState;
  isFeatured: boolean;
  isFederated: boolean;
  isExternal: boolean;
  isNative: boolean;
  canDisplay: boolean;
  canTrade: boolean;
  canSettle: boolean;
  warnings: string[];
  disclaimers: string[];
}

export interface CuratedCatalog {
  id: string;
  slug: string;
  name: string;
  displayName: string;
  description: string;
  catalogType: CuratedCatalogType;
  status: CuratedCatalogStatus;
  visibility: CuratedCatalogVisibility;
  governanceStatus: CuratedCatalogGovernanceStatus;
  ownerScope: CuratedCatalogOwnerScope;
  tenantId?: string;
  segmentIds: string[];
  sectionIds: string[];
  featuredProductIds: string[];
  featuredCollectionIds: string[];
  allowedProductIds: string[];
  blockedProductIds: string[];
  allowedCollectionIds: string[];
  blockedCollectionIds: string[];
  allowedCategoryIds: ProductCategory[];
  blockedCategoryIds: ProductCategory[];
  allowedExternalCollectionIds: string[];
  blockedExternalCollectionIds: string[];
  allowsFederatedAssets: boolean;
  inheritsGlobalCatalog: boolean;
  inheritsTenantCatalog: boolean;
  curationNotes: string[];
  sections: CuratedCatalogSection[];
  items: CuratedCatalogItem[];
  rules: CuratedCatalogRule[];
  editorialRules: EditorialRule[];
  curationWorkflow: {
    state: CurationWorkflowState;
    decision: CurationDecision;
    reviewStatus: CurationReviewStatus;
    governanceLabel: string;
    notes: CurationNote[];
    warnings: string[];
    disclaimers: string[];
  };
  warnings: string[];
  disclaimers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  displayName: string;
  description: string;
  status: TenantStatus;
  tenantType: TenantType;
  visibility: TenantVisibility;
  governanceStatus: TenantGovernanceStatus;
  identity: TenantIdentity;
  configuration: TenantConfiguration;
  branding?: TenantBranding;
  domains?: TenantDomain[];
  domainAliases?: TenantDomainAlias[];
  catalog?: TenantCatalog;
  curatedCatalogConfig?: TenantCuratedCatalogConfig;
  createdAt: string;
  updatedAt: string;
  warnings: string[];
  disclaimers: string[];
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  category: ProductCategory;
  subcategory: string;
  collectionId?: string;
  sellerId: string;
  description: string;
  shortDescription: string;
  tags: string[];
  images: string[];
  media: string[];
  version: string;
  status: "draft" | "listed" | "retired";
  governanceStatus: ProductStanding;
  constitutionalStanding: ConstitutionalStanding;
  visibility: ProductVisibility;
  pricing: Pricing;
  acceptedCurrencies: string[];
  royaltyModel: RoyaltyModel;
  accessModel: "public" | "wallet-gated" | "dao-gated" | "subscription" | "license-key";
  deliveryType: DeliveryType;
  licenseType: LicenseType;
  supportedChains: Chain[];
  nftBound: boolean;
  governanceRequired: boolean;
  maturity: "alpha" | "beta" | "production" | "deprecated";
  createdAt: string;
  updatedAt: string;
  tokenStandard: TokenStandard;
  contractAddress?: string;
  tokenId?: string;
  marketplaceContractAddress?: string;
  auctionContractAddress?: string;
  royaltyContractAddress?: string;
  listingId?: string;
  listingType: ListingType;
  auction?: AuctionState;
  bridgeReadiness: BridgeReadiness;
  greenfieldBucket?: string;
  signedUrlPreviewAvailable: boolean;
  metadataAttributes?: Array<{
    traitType: string;
    value: string;
  }>;
}

export interface AssetHistoryEntry {
  id: string;
  timestamp: string;
  actor: string;
  status: AssetHistoryStatus;
  note: string;
}

export interface OwnershipHistoryEntry extends AssetHistoryEntry {
  owner: string;
}

export interface TransferHistoryEntry extends AssetHistoryEntry {
  from: string;
  to: string;
  chain: Chain;
}

export interface LicenseHistoryEntry extends AssetHistoryEntry {
  licenseType: LicenseType;
  holder: string;
}

export interface AssetValidationLayer {
  metadata: ProductStanding;
  contract: ProductStanding;
  collection: ProductStanding;
  origin: ProductStanding;
  royalty: ProductStanding;
  notes: string[];
}

export interface AssetRegistryRecord {
  productId: string;
  currentOwner: string;
  ownershipHistory: OwnershipHistoryEntry[];
  transferHistory: TransferHistoryEntry[];
  licenseHistory: LicenseHistoryEntry[];
  validation: AssetValidationLayer;
}

export interface CollectionMetrics {
  volume: number;
  floorPrice: number;
  holders: number;
  recentActivity: number;
}

export interface FederationProviderReference {
  id: string;
  name: string;
  type: "mock-provider" | "marketplace" | "ecosystem" | "wallet-discovery" | "aggregator";
  origin: string;
  trustLevel: "mock-only" | "provider-reported" | "review-required" | "blocked";
}

export type FederationProviderHealthStatus = "healthy-mock" | "degraded-mock" | "paused-mock" | "blocked-mock";
export type FederationProviderCapability =
  | "contract-reference"
  | "collection-reference"
  | "asset-reference"
  | "metadata-reference"
  | "statistics-reference"
  | "wallet-discovery-reference";
export type FederationProviderOperation = "read-contract" | "read-collection" | "read-asset" | "read-metadata" | "read-statistics" | "read-wallet-assets";

export interface FederationProviderDescriptor extends FederationProviderReference {
  slug: string;
  description: string;
  supportedChains: Chain[];
  supportedStandards: Array<Extract<TokenStandard, "ERC721" | "ERC1155">>;
  capabilities: FederationProviderCapability[];
  supportedOperations: FederationProviderOperation[];
  dataScope: string[];
  limitations: string[];
  rateLimitNotes: string;
  validationLimits: string[];
  health: {
    status: FederationProviderHealthStatus;
    lastCheckedAt: string;
    notes: string[];
  };
  trustBoundary: FederationTrustBoundary;
  externalDependencyWarning: string;
  readOnly: boolean;
  executionEnabled: boolean;
}

export interface ExternalCollectionMetadata {
  source: "provider-reported-mock" | "external-metadata-mock";
  externalUrl: string;
  metadataUrl: string;
  metadataHash?: string;
  lastSyncedAt: string;
  importedAt: string;
  warnings: string[];
  disclaimers: string[];
}

export interface ExternalCollectionStatistics {
  source: "provider-reported-mock";
  itemCount: number;
  volume: number;
  floorPrice: number;
  holders: number;
  listings: number;
  bids: number;
  recentActivity: number;
  lastSyncedAt: string;
  disclaimers: string[];
}

export interface FederationTrustBoundary {
  origin: string;
  provider: string;
  validationStatus: FederationValidationStatus;
  provenance: string;
  riskClassification: FederationRiskClassification;
  executionState: "read-only" | "non-executing" | "blocked";
  canDisplay: boolean;
  canTrade: boolean;
  canSettle: boolean;
  canBridge: boolean;
  notes: string[];
}

export interface ExternalContractReference {
  providerId: string;
  chainId: string;
  chainName: Chain;
  contractAddress: string;
  tokenStandard: Extract<TokenStandard, "ERC721" | "ERC1155">;
  externalUrl: string;
  validationStatus: FederationValidationStatus;
  riskClassification: FederationRiskClassification;
  provenance: string;
}

export type DiscoveredAssetKind = "nft" | "certificate" | "license";
export type DiscoveredOwnershipState = "owned-mock" | "discovered-mock" | "verified-ownership-unavailable";
export type WalletDiscoveryStatus = "ready" | "empty" | "wallet-not-found" | "invalid-wallet";

export interface DiscoveredAsset {
  id: string;
  walletAddress: string;
  kind: DiscoveredAssetKind;
  name: string;
  description: string;
  image?: string;
  productId?: string;
  collectionId?: string;
  licenseId?: string;
  issuer: string;
  provider: FederationProviderReference;
  origin: CollectionOrigin | "mock-wallet";
  chain?: Chain;
  contractAddress?: string;
  tokenId?: string;
  tokenStandard?: TokenStandard;
  discoverySource: "mock-wallet-discovery";
  ownershipState: DiscoveredOwnershipState;
  validationStatus: FederationValidationStatus;
  riskClassification: FederationRiskClassification;
  provenance: string;
  trustBoundary: FederationTrustBoundary;
  warnings: string[];
  disclaimers: string[];
}

export interface WalletDiscoveryRecord {
  walletAddress: string;
  label: string;
  status: WalletDiscoveryStatus;
  provider: FederationProviderReference;
  assets: DiscoveredAsset[];
}

export interface MarketplaceCollection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  chain: Chain;
  contractAddress: string;
  assetType: Extract<TokenStandard, "ERC721" | "ERC1155">;
  origin: CollectionOrigin;
  validationStatus: ProductStanding;
  governanceStatus: ProductStanding;
  sellerId: string;
  metrics?: Partial<CollectionMetrics>;
  provider?: FederationProviderReference;
  externalContract?: ExternalContractReference;
  externalMetadata?: ExternalCollectionMetadata;
  externalStatistics?: ExternalCollectionStatistics;
  federationValidationStatus?: FederationValidationStatus;
  riskClassification?: FederationRiskClassification;
  provenance?: string;
  trustBoundary?: FederationTrustBoundary;
  displayStatus?: "displayable" | "limited" | "blocked" | "quarantined";
  isNative?: boolean;
  isExternal?: boolean;
  isFederated?: boolean;
}

export interface Seller {
  id: string;
  name: string;
  handle?: string;
  avatar?: string;
  mockAccount?: string;
  type: SellerType;
  verificationStatus: VerificationStatus;
  verificationNote?: string;
  governanceStanding: SellerStanding;
  reputation: number;
  registeredDAOs: string[];
  productsPublished: number;
  constitutionalBound: boolean;
  treasuryLinked: boolean;
  riskScore: number;
  description: string;
}

export interface License {
  id: string;
  type: LicenseType;
  transferable: boolean;
  revokable: boolean;
  nftBound: boolean;
  expiration: string | null;
  governanceControlled: boolean;
  permissions: string[];
  ownershipModel: "wallet" | "dao" | "enterprise-seat" | "account-bound" | "soulbound";
}

export interface PurchaseRecord {
  id: string;
  buyer: string;
  productId: string;
  sellerId: string;
  timestamp: string;
  amount: number;
  currency: string;
  licenseIssued: string;
  status: PurchaseStatus;
  governanceReviewRequired: boolean;
  signedUrlPreview?: string;
}

export interface DraftListingInput {
  title: string;
  category: ProductCategory;
  tokenStandard: TokenStandard;
  listingType: ListingType;
  chain: Chain;
  price: number;
  currency: string;
  royaltyBps: number;
  deliveryType: DeliveryType;
  governanceReviewRequired: boolean;
  description: string;
}

export interface DraftListingPreview {
  id: string;
  input: DraftListingInput;
  status: "draft-created" | "requires-governance-review";
  contractAdapterAction: "createListing";
  royaltyPreviewAmount: number;
  txPreview: string;
}

export interface MarketplaceBoundaryStatus {
  id: string;
  label: string;
  status: "mocked" | "ready-boundary" | "deferred";
  description: string;
}

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
export type CommercialOriginType = "tenant" | "partner" | "distributor" | "agency" | "affiliate" | "community" | "demo";
export type AttributionStatus = "not-tracked" | "simulated-only" | "configured-mock" | "active-mock" | "review-required" | "restricted" | "disabled";
export type TrackingMode = "none" | "simulated-only" | "manual-mock" | "referral-code-mock" | "placement-mock";
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
  status: DistributionStatus;
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

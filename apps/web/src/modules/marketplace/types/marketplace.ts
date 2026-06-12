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

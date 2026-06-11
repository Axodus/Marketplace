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
export type LicenseType =
  | "Personal Use"
  | "DAO License"
  | "Enterprise License"
  | "NFT Access License"
  | "Subscription License";
export type DeliveryType = "Greenfield" | "Signed URL" | "MCP Runtime" | "Dashboard Access" | "Manual Service";
export type Chain = "Ethereum" | "BNB" | "Arbitrum" | "Harmony" | "Polygon";
export type PurchaseStatus = "mock-issued" | "pending-governance-review" | "blocked";
export type CollectionOrigin = "native" | "future-external";

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
}

export interface CollectionMetrics {
  volume: number;
  floorPrice: number;
  holders: number;
  recentActivity: number;
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
}

export interface Seller {
  id: string;
  name: string;
  type: SellerType;
  verificationStatus: VerificationStatus;
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

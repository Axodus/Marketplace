import {
  marketplaceAttributionSources,
  marketplaceAssetRegistry,
  marketplaceAcademyDataBoundaries,
  marketplaceAcademyDistributionContexts,
  marketplaceAcademyIntelligenceSummaries,
  marketplaceAcademyProducts,
  marketplaceACSAccessPreviews,
  marketplaceACSCapabilityDataBoundaries,
  marketplaceACSCapabilityProducts,
  marketplaceACSDistributionContexts,
  marketplaceACSExecutionBoundaries,
  marketplaceACSIntelligenceSummaries,
  marketplaceACSProvisioningBoundaries,
  marketplaceAgentCapabilities,
  marketplaceAIAgents,
  marketplaceBoundaries,
  marketplaceCertificateBadgeMocks,
  marketplaceCertificationRequirements,
  marketplaceCertifications,
  marketplaceCredentialPreviews,
  marketplaceAttributionToSplitRules,
  marketplaceCatalogSegments,
  marketplaceCollections,
  marketplaceCommunityDistributions,
  marketplaceCommissionModels,
  marketplaceCommunityRevenueSharingConfigs,
  marketplaceCuratedCatalogDistributionConfigs,
  marketplaceCuratedCatalogRevenueSharingConfigs,
  marketplaceCuratedCatalogs,
  marketplaceDistributionRevenueSharingConfigs,
  marketplaceDistributionChannels,
  marketplaceDistributionNetworks,
  marketplaceDistributionPlacements,
  marketplaceDistributionProfiles,
  marketplaceFederationProviders,
  marketplaceFeaturedCatalogs,
  marketplaceCourseModules,
  marketplaceCourses,
  marketplaceLessons,
  marketplaceLearningAccessPreviews,
  marketplaceLearningEntitlementMocks,
  marketplaceLearningPaths,
  marketplaceLearningSubscriptions,
  marketplaceLearningSubscriptionTiers,
  marketplaceComputeAccess,
  marketplaceComputeTiers,
  marketplaceDataBoundaries,
  marketplaceInsightSignals,
  marketplaceInsights,
  marketplaceIntelligenceAuditNotes,
  marketplaceIntelligenceSnapshots,
  marketplaceFederationIntelligenceContexts,
  marketplaceProviderValidationInsights,
  marketplaceRankingExplanations,
  marketplaceRecommendationPreviews,
  marketplaceProvenanceInsights,
  marketplaceRevenueIntelligenceSummaries,
  marketplaceRevenuePreviewInsights,
  marketplaceRiskTrustInsights,
  marketplaceLicenses,
  marketplaceParticipantShares,
  marketplaceProducts,
  marketplaceRevenueParticipants,
  marketplaceRevenueSharingPolicies,
  marketplaceRevenueSharingPreviews,
  marketplacePayoutPreviewMocks,
  marketplaceRevenueSplitRules,
  marketplaceSellers,
  marketplaceSettlementBoundaries,
  marketplaceSettlementBoundaryInsights,
  marketplaceSettlementPreviewMocks,
  marketplaceRevenueSharingAuditEntries,
  marketplaceMCPPackages,
  marketplaceMCPVersions,
  marketplaceWorkflowBundles,
  marketplaceWorkflowSystems,
  marketplaceWorkflowTemplates,
  marketplaceTenantDistributionConfigs,
  marketplaceTenantRevenueSharingConfigs,
  marketplaceTenants,
  marketplaceWalletDiscoveryRecords
} from "../../../data/mock/marketplace.mock";
import type {
  AcademyDataBoundary,
  AcademyDistributionContext,
  AcademyIntelligenceSummary,
  AcademyProduct,
  ACSAccessPreview,
  ACSCapabilityDataBoundary,
  ACSCapabilityProduct,
  ACSDistributionContext,
  ACSExecutionBoundary,
  ACSIntelligenceSummary,
  ACSProvisioningBoundary,
  AgentCapability,
  AIAgent,
  AssetRegistryRecord,
  AttributionContext,
  AttributionSplitExplanation,
  AttributionSplitMapping,
  AttributionSplitResolution,
  AttributionSourceRecord,
  AttributionToSplitRule,
  Chain,
  CommercialOriginSplitMapping,
  ComputeAccess,
  ComputeTier,
  CommunityDistributionContext,
  CommunityDistributionItem,
  CommunityMarketplaceDistribution,
  CommunityRevenueSharingConfig,
  CertificateBadgeMock,
  Certification,
  CertificationRequirement,
  Course,
  CourseModule,
  CredentialPreview,
  CuratedCatalog,
  CuratedCatalogDistributionConfig,
  CuratedCatalogDistributionResolution,
  CuratedCatalogDistributionRule,
  CuratedCatalogRevenueSharingConfig,
  CuratedCatalogItem,
  CuratedCatalogSection,
  EditorialRule,
  CatalogSegment,
  DiscoveredAsset,
  DistributionIntegratedContext,
  DistributionIntegratedItem,
  DistributionChannel,
  DistributionRevenueSharingConfig,
  DistributionNetwork,
  DistributionPlacement,
  DistributionProfile,
  DistributionSourceSplitMapping,
  DataBoundary,
  ExternalCollectionStatistics,
  ExternalContractReference,
  DraftListingInput,
  DraftListingPreview,
  FederationProviderDescriptor,
  FederationIntelligenceContext,
  FederationTrustBoundary,
  FeaturedCatalog,
  License,
  LearningAccessPreview,
  LearningEntitlementMock,
  LearningPath,
  LearningSubscription,
  LearningSubscriptionTier,
  Lesson,
  InsightSignal,
  IntelligenceAuditNote,
  IntelligenceSnapshot,
  SnapshotScope,
  MarketplaceBoundaryStatus,
  MarketplaceCollection,
  MarketplaceInsight,
  MCPPackage,
  MCPVersion,
  CommissionModel,
  ParticipantShareConflict,
  ParticipantShareValidation,
  ParticipantShareValidationStatus,
  ParticipantShare,
  ParticipantSplitExplanation,
  PayoutPreviewMock,
  Product,
  ProductCategory,
  ProductStanding,
  PurchaseRecord,
  RankingExplanation,
  RecommendationPreview,
  ProviderValidationInsight,
  ProvenanceInsight,
  RevenueParticipant,
  RevenueIntelligenceSummary,
  RevenuePreviewInsight,
  RevenueSharingAuditEntry,
  RevenueSharingIntegratedContext,
  RevenueSharingPreview,
  RevenueSharingPolicy,
  RevenueSharingResolution,
  RevenueSplitRule,
  SettlementPreviewMock,
  Seller,
  SettlementBoundary,
  SettlementBoundaryInsight,
  RiskTrustInsight,
  Tenant,
  TenantBranding,
  TenantCatalog,
  TenantCatalogItem,
  TenantCatalogResolution,
  TenantCatalogRule,
  TenantCatalogSource,
  TenantCuratedCatalogConfig,
  TenantCuratedCatalogItem,
  TenantCuratedCatalogResolution,
  TenantDistributionConfig,
  TenantDistributionResolution,
  TenantDistributionRule,
  TenantRevenueSharingConfig,
  TenantDomain,
  TenantDomainAlias,
  TenantDomainInputType,
  TenantDomainResolutionStatus,
  TenantRoutingContext,
  TenantTheme,
  TokenStandard,
  WalletDiscoveryRecord,
  WalletDiscoveryStatus,
  WorkflowBundle,
  WorkflowSystem,
  WorkflowTemplate
} from "../types/marketplace";
import { getDeliveryTelemetrySummary } from "./deliveryRuntime";

export type ProductAssetTypeFilter = "all" | "nft" | "erc721" | "erc1155" | "offchain";
export type ProductListingStatusFilter = Product["status"] | "auction-active" | "all";
export type ProductSortOption = "relevance" | "price-asc" | "price-desc" | "recent" | "activity" | "name";

export interface ProductFilters {
  category?: ProductCategory | "all";
  search?: string;
  governanceStatus?: ProductStanding | "all";
  licenseType?: string;
  chain?: Chain | "all";
  assetType?: ProductAssetTypeFilter;
  listingStatus?: ProductListingStatusFilter;
  listingType?: Product["listingType"] | "all";
  sellerId?: string | "all";
  maturity?: string;
  daoOwned?: boolean;
  minSellerReputation?: number;
  sortBy?: ProductSortOption;
}

export const DEFAULT_PRODUCT_EXPLORER_FILTERS: ProductFilters = {
  category: "all",
  chain: "all",
  governanceStatus: "all",
  assetType: "all",
  listingStatus: "all",
  listingType: "all",
  sellerId: "all",
  sortBy: "relevance"
};

const products = marketplaceProducts as Product[];
const collections = marketplaceCollections as MarketplaceCollection[];
const sellers = marketplaceSellers as Seller[];
const licenses = marketplaceLicenses as License[];
const tenants = marketplaceTenants as Tenant[];
const curatedCatalogs = marketplaceCuratedCatalogs as CuratedCatalog[];
const catalogSegments = marketplaceCatalogSegments as CatalogSegment[];
const featuredCatalogs = marketplaceFeaturedCatalogs as FeaturedCatalog[];
const distributionNetworks = marketplaceDistributionNetworks as DistributionNetwork[];
const distributionChannels = marketplaceDistributionChannels as DistributionChannel[];
const distributionPlacements = marketplaceDistributionPlacements as DistributionPlacement[];
const distributionProfiles = marketplaceDistributionProfiles as DistributionProfile[];
const attributionSources = marketplaceAttributionSources as AttributionSourceRecord[];
const attributionToSplitRules = marketplaceAttributionToSplitRules as AttributionToSplitRule[];
const communityDistributions = marketplaceCommunityDistributions as CommunityMarketplaceDistribution[];
const tenantDistributionConfigs = marketplaceTenantDistributionConfigs as TenantDistributionConfig[];
const curatedCatalogDistributionConfigs = marketplaceCuratedCatalogDistributionConfigs as CuratedCatalogDistributionConfig[];
const tenantRevenueSharingConfigs = marketplaceTenantRevenueSharingConfigs as TenantRevenueSharingConfig[];
const distributionRevenueSharingConfigs = marketplaceDistributionRevenueSharingConfigs as DistributionRevenueSharingConfig[];
const curatedCatalogRevenueSharingConfigs = marketplaceCuratedCatalogRevenueSharingConfigs as CuratedCatalogRevenueSharingConfig[];
const communityRevenueSharingConfigs = marketplaceCommunityRevenueSharingConfigs as CommunityRevenueSharingConfig[];
const revenueSharingPolicies = marketplaceRevenueSharingPolicies as RevenueSharingPolicy[];
const revenueSharingPreviews = marketplaceRevenueSharingPreviews as RevenueSharingPreview[];
const payoutPreviewMocks = marketplacePayoutPreviewMocks as PayoutPreviewMock[];
const settlementPreviewMocks = marketplaceSettlementPreviewMocks as SettlementPreviewMock[];
const revenueSharingAuditEntries = marketplaceRevenueSharingAuditEntries as RevenueSharingAuditEntry[];
const marketplaceInsightRecords = marketplaceInsights as MarketplaceInsight[];
const insightSignals = marketplaceInsightSignals as InsightSignal[];
const intelligenceSnapshots = marketplaceIntelligenceSnapshots as IntelligenceSnapshot[];
const dataBoundaries = marketplaceDataBoundaries as DataBoundary[];
const intelligenceAuditNotes = marketplaceIntelligenceAuditNotes as IntelligenceAuditNote[];
const recommendationPreviews = marketplaceRecommendationPreviews as RecommendationPreview[];
const rankingExplanations = marketplaceRankingExplanations as RankingExplanation[];
const revenueIntelligenceSummaries = marketplaceRevenueIntelligenceSummaries as RevenueIntelligenceSummary[];
const revenuePreviewInsights = marketplaceRevenuePreviewInsights as RevenuePreviewInsight[];
const settlementBoundaryInsights = marketplaceSettlementBoundaryInsights as SettlementBoundaryInsight[];
const riskTrustInsights = marketplaceRiskTrustInsights as RiskTrustInsight[];
const federationIntelligenceContexts = marketplaceFederationIntelligenceContexts as FederationIntelligenceContext[];
const providerValidationInsights = marketplaceProviderValidationInsights as ProviderValidationInsight[];
const provenanceInsights = marketplaceProvenanceInsights as ProvenanceInsight[];
const commissionModels = marketplaceCommissionModels as CommissionModel[];
const revenueParticipants = marketplaceRevenueParticipants as RevenueParticipant[];
const revenueSplitRules = marketplaceRevenueSplitRules as RevenueSplitRule[];
const participantShares = marketplaceParticipantShares as ParticipantShare[];
const settlementBoundaries = marketplaceSettlementBoundaries as SettlementBoundary[];
const boundaries = marketplaceBoundaries as MarketplaceBoundaryStatus[];
const assetRegistry = marketplaceAssetRegistry as AssetRegistryRecord[];
const walletDiscoveryRecords = marketplaceWalletDiscoveryRecords as WalletDiscoveryRecord[];
const federationProviders = marketplaceFederationProviders as FederationProviderDescriptor[];
const academyProducts = marketplaceAcademyProducts as AcademyProduct[];
const academyDataBoundaries = marketplaceAcademyDataBoundaries as AcademyDataBoundary[];
const academyDistributionContexts = marketplaceAcademyDistributionContexts as AcademyDistributionContext[];
const academyIntelligenceSummaries = marketplaceAcademyIntelligenceSummaries as AcademyIntelligenceSummary[];
const courses = marketplaceCourses as Course[];
const courseModules = marketplaceCourseModules as CourseModule[];
const lessons = marketplaceLessons as Lesson[];
const learningPaths = marketplaceLearningPaths as LearningPath[];
const certifications = marketplaceCertifications as Certification[];
const certificationRequirements = marketplaceCertificationRequirements as CertificationRequirement[];
const credentialPreviews = marketplaceCredentialPreviews as CredentialPreview[];
const certificateBadgeMocks = marketplaceCertificateBadgeMocks as CertificateBadgeMock[];
const learningSubscriptions = marketplaceLearningSubscriptions as LearningSubscription[];
const learningSubscriptionTiers = marketplaceLearningSubscriptionTiers as LearningSubscriptionTier[];
const learningAccessPreviews = marketplaceLearningAccessPreviews as LearningAccessPreview[];
const learningEntitlementMocks = marketplaceLearningEntitlementMocks as LearningEntitlementMock[];
const acsCapabilityProducts = marketplaceACSCapabilityProducts as ACSCapabilityProduct[];
const aiAgents = marketplaceAIAgents as AIAgent[];
const agentCapabilities = marketplaceAgentCapabilities as AgentCapability[];
const mcpPackages = marketplaceMCPPackages as MCPPackage[];
const mcpVersions = marketplaceMCPVersions as MCPVersion[];
const workflowSystems = marketplaceWorkflowSystems as WorkflowSystem[];
const workflowTemplates = marketplaceWorkflowTemplates as WorkflowTemplate[];
const workflowBundles = marketplaceWorkflowBundles as WorkflowBundle[];
const computeAccessRecords = marketplaceComputeAccess as ComputeAccess[];
const computeTiers = marketplaceComputeTiers as ComputeTier[];
const acsAccessPreviews = marketplaceACSAccessPreviews as ACSAccessPreview[];
const acsExecutionBoundaries = marketplaceACSExecutionBoundaries as ACSExecutionBoundary[];
const acsProvisioningBoundaries = marketplaceACSProvisioningBoundaries as ACSProvisioningBoundary[];
const acsCapabilityDataBoundaries = marketplaceACSCapabilityDataBoundaries as ACSCapabilityDataBoundary[];
const acsDistributionContexts = marketplaceACSDistributionContexts as ACSDistributionContext[];
const acsIntelligenceSummaries = marketplaceACSIntelligenceSummaries as ACSIntelligenceSummary[];

function normalizeSearch(value?: string) {
  return value?.trim().toLowerCase() ?? "";
}

function getSearchFields(product: Product, seller?: Seller) {
  const collection = collections.find((item) => item.id === product.collectionId);

  return [
    product.title,
    product.description,
    product.shortDescription,
    product.category,
    product.subcategory,
    product.licenseType,
    product.tokenStandard,
    product.listingType,
    product.status,
    product.contractAddress,
    product.tokenId,
    collection?.name,
    collection?.description,
    collection?.assetType,
    collection?.chain,
    seller?.name,
    seller?.type,
    seller?.verificationStatus,
    seller?.governanceStanding,
    ...product.tags,
    ...product.supportedChains,
    ...(seller?.registeredDAOs ?? [])
  ].filter(Boolean);
}

function matchesAssetType(product: Product, assetType?: ProductAssetTypeFilter) {
  if (!assetType || assetType === "all") return true;
  if (assetType === "nft") return product.nftBound;
  if (assetType === "offchain") return product.tokenStandard === "OffchainLicense" || !product.nftBound;
  return product.tokenStandard.toLowerCase() === assetType;
}

function matchesListingStatus(product: Product, listingStatus?: ProductListingStatusFilter) {
  if (!listingStatus || listingStatus === "all") return true;
  if (listingStatus === "auction-active") return product.auction?.status === "active";
  return product.status === listingStatus;
}

function relevanceScore(product: Product, query: string, seller?: Seller) {
  if (!query) return 0;
  const title = product.title.toLowerCase();
  const sellerName = seller?.name.toLowerCase() ?? "";
  const tags = product.tags.join(" ").toLowerCase();
  let score = 0;
  if (title === query) score += 100;
  if (title.includes(query)) score += 50;
  if (sellerName.includes(query)) score += 30;
  if (product.category.toLowerCase().includes(query)) score += 25;
  if (product.subcategory.toLowerCase().includes(query)) score += 20;
  if (tags.includes(query)) score += 15;
  if (product.shortDescription.toLowerCase().includes(query)) score += 10;
  if (product.description.toLowerCase().includes(query)) score += 5;
  return score;
}

function activityScore(product: Product) {
  return (product.auction?.bidCount ?? 0) + (product.signedUrlPreviewAvailable ? 1 : 0) + (product.nftBound ? 1 : 0);
}

function sortProducts(sourceProducts: Product[], filters: ProductFilters, sourceSellers: Seller[]) {
  const query = normalizeSearch(filters.search);
  const sortBy = filters.sortBy ?? "relevance";

  return [...sourceProducts].sort((left, right) => {
    const leftSeller = sourceSellers.find((seller) => seller.id === left.sellerId);
    const rightSeller = sourceSellers.find((seller) => seller.id === right.sellerId);

    if (sortBy === "price-asc") return left.pricing.amount - right.pricing.amount || left.title.localeCompare(right.title);
    if (sortBy === "price-desc") return right.pricing.amount - left.pricing.amount || left.title.localeCompare(right.title);
    if (sortBy === "recent") return Date.parse(right.updatedAt) - Date.parse(left.updatedAt) || left.title.localeCompare(right.title);
    if (sortBy === "activity") return activityScore(right) - activityScore(left) || left.title.localeCompare(right.title);
    if (sortBy === "name") return left.title.localeCompare(right.title);

    return relevanceScore(right, query, rightSeller) - relevanceScore(left, query, leftSeller) || left.title.localeCompare(right.title);
  });
}

export function filterAndSortProducts(sourceProducts: Product[], filters: ProductFilters = {}, sourceSellers: Seller[] = sellers) {
  const query = normalizeSearch(filters.search);
  const filtered = sourceProducts.filter((product) => {
    const seller = sourceSellers.find((item) => item.id === product.sellerId);

    if (filters.category && filters.category !== "all" && product.category !== filters.category) return false;
    if (filters.governanceStatus && filters.governanceStatus !== "all" && product.governanceStatus !== filters.governanceStatus) {
      return false;
    }
    if (filters.licenseType && filters.licenseType !== "all" && product.licenseType !== filters.licenseType) return false;
    if (filters.chain && filters.chain !== "all" && !product.supportedChains.includes(filters.chain)) return false;
    if (!matchesAssetType(product, filters.assetType)) return false;
    if (!matchesListingStatus(product, filters.listingStatus)) return false;
    if (filters.listingType && filters.listingType !== "all" && product.listingType !== filters.listingType) return false;
    if (filters.sellerId && filters.sellerId !== "all" && product.sellerId !== filters.sellerId) return false;
    if (filters.maturity && filters.maturity !== "all" && product.maturity !== filters.maturity) return false;
    if (filters.daoOwned && !seller?.registeredDAOs.length) return false;
    if (filters.minSellerReputation && (!seller || seller.reputation < filters.minSellerReputation)) return false;

    if (!query) return true;
    return getSearchFields(product, seller).join(" ").toLowerCase().includes(query);
  });

  return sortProducts(filtered, filters, sourceSellers);
}

export function getProductExplorerFacets() {
  return {
    categories: Array.from(new Set(products.map((product) => product.category))).sort(),
    chains: Array.from(new Set(products.flatMap((product) => product.supportedChains))).sort(),
    sellers: sellers.map((seller) => ({ id: seller.id, name: seller.name })).sort((left, right) => left.name.localeCompare(right.name)),
    tokenStandards: Array.from(new Set(products.map((product) => product.tokenStandard))).sort() as TokenStandard[],
    listingTypes: Array.from(new Set(products.map((product) => product.listingType))).sort(),
    listingStatuses: Array.from(new Set(products.map((product) => product.status))).sort()
  };
}

export function listProducts(filters: ProductFilters = {}) {
  return filterAndSortProducts(products, filters, sellers);
}

export interface CollectionView {
  collection: MarketplaceCollection;
  products: Product[];
  metrics: {
    itemCount: number;
    listings: number;
    bids: number;
    volume: number;
    holders: number;
    floorPrice: number;
    recentActivity: number;
    rankScore: number;
    ranking: number;
    source: "native-mock" | "provider-reported-mock";
    sourceLabel: string;
    lastSyncedAt?: string;
  };
  boundaries: FederationTrustBoundary;
  labels: string[];
  warnings: string[];
}

export interface SellerProfileView {
  seller: Seller;
  products: Product[];
  collections: CollectionView[];
  metrics: {
    listings: number;
    activeListings: number;
    mockSales: number;
    mockVolume: number;
    totalBids: number;
    collections: number;
    averagePrice: number;
    nftBoundListings: number;
  };
  reputation: {
    score: number;
    label: "excellent-mock" | "trusted-mock" | "review-mock" | "restricted-mock";
    riskLabel: "low" | "medium" | "high";
  };
  activity: Array<{
    id: string;
    label: string;
    timestamp: string;
    detail: string;
  }>;
}

export interface AssetRegistryView {
  product: Product;
  collection: CollectionView | null;
  seller: Seller | undefined;
  license: License | undefined;
  registry: AssetRegistryRecord;
  metadataAttributes: Array<{
    traitType: string;
    value: string;
  }>;
  boundaries: Array<{
    label: string;
    value: string;
    detail: string;
  }>;
}

export interface MarketplaceAnalyticsView {
  volume: {
    totalVolume: number;
    averagePrice: number;
    floorPrice: number;
    royaltyPreview: number;
    salesCount: number;
  };
  activity: {
    activeListings: number;
    activeAuctions: number;
    totalBids: number;
    bidActivity: number;
    recentActivity: Array<{
      id: string;
      label: string;
      timestamp: string;
      detail: string;
    }>;
  };
  market: {
    totalProducts: number;
    nftBoundProducts: number;
    erc721Products: number;
    erc1155Products: number;
    categories: Record<string, number>;
    marketStatus: "healthy-mock" | "review-needed-mock" | "restricted-mock";
  };
  collections: Array<{
    id: string;
    name: string;
    slug: string;
    volume: number;
    floorPrice: number;
    itemCount: number;
    bids: number;
    ranking: number;
  }>;
  sellers: Array<{
    id: string;
    name: string;
    listings: number;
    mockVolume: number;
    mockSales: number;
    reputation: number;
  }>;
  notes: string[];
}

export interface MarketplaceInsightView {
  insight: MarketplaceInsight;
  signals: InsightSignal[];
  snapshot: IntelligenceSnapshot | null;
  dataBoundary: DataBoundary | null;
  auditNotes: IntelligenceAuditNote[];
  sourceLabel: string;
  boundaryNotes: string[];
}

export interface IntelligenceSnapshotView {
  snapshot: IntelligenceSnapshot;
  signals: InsightSignal[];
  insights: MarketplaceInsight[];
  dataBoundary: DataBoundary | null;
  sourceLabel: string;
  boundaryNotes: string[];
}

export interface MarketplaceIntelligencePanelView {
  panelType: "marketplace" | "tenant" | "catalog" | "distribution" | "community" | "attribution";
  title: string;
  snapshot: IntelligenceSnapshotView | null;
  badges: string[];
  boundaryWarnings: string[];
  canUseAnalyticsReal: boolean;
  canUseTrackingReal: boolean;
  canUseBIReal: boolean;
  canScore: boolean;
  canRecommendAutomatically: boolean;
  canUseAutomatedDecisioning: boolean;
  canExportData: boolean;
}

export interface RecommendationPreviewView {
  preview: RecommendationPreview;
  rankingExplanation: RankingExplanation | null;
  mockSignals: InsightSignal[];
  dataBoundary: DataBoundary | null;
  targetLabel: string;
  boundaryNotes: string[];
}

export interface RevenueTrustRiskIntelligenceView {
  revenueSummary: RevenueIntelligenceSummary | null;
  revenuePreviewInsight: RevenuePreviewInsight | null;
  settlementBoundaryInsight: SettlementBoundaryInsight | null;
  riskTrustInsights: RiskTrustInsight[];
  federationContext: FederationIntelligenceContext | null;
  providerValidationInsight: ProviderValidationInsight | null;
  provenanceInsight: ProvenanceInsight | null;
  dataBoundary: DataBoundary | null;
  revenuePreview: RevenueSharingPreviewView | null;
  settlementBoundary: SettlementBoundary | null;
  collection: MarketplaceCollection | null;
  provider: FederationProviderDescriptor | null;
  boundaryNotes: string[];
}

export interface AcademyCourseView {
  course: Course;
  modules: CourseModule[];
  lessons: Lesson[];
  learningPaths: LearningPath[];
  accessPreview: LearningAccessPreview | null;
  academyProduct: AcademyProduct | null;
  distributionContext: AcademyDistributionContext | null;
  dataBoundary: AcademyDataBoundary | null;
  revenuePolicy: RevenueSharingPolicyView | null;
  revenuePreview: RevenueSharingPreviewView | null;
  intelligenceSummary: AcademyIntelligenceSummary | null;
  intelligenceSnapshot: IntelligenceSnapshotView | null;
  tenant: Tenant | null;
  curatedCatalog: CuratedCatalog | null;
  distributionChannel: DistributionChannel | null;
  boundaryNotes: string[];
}

export interface AcademyCertificationView {
  certification: Certification;
  requirements: CertificationRequirement[];
  credentialPreview: CredentialPreview | null;
  certificateBadgeMock: CertificateBadgeMock | null;
  accessPreview: LearningAccessPreview | null;
  academyProduct: AcademyProduct | null;
  distributionContext: AcademyDistributionContext | null;
  dataBoundary: AcademyDataBoundary | null;
  revenuePolicy: RevenueSharingPolicyView | null;
  revenuePreview: RevenueSharingPreviewView | null;
  intelligenceSummary: AcademyIntelligenceSummary | null;
  intelligenceSnapshot: IntelligenceSnapshotView | null;
  tenant: Tenant | null;
  curatedCatalog: CuratedCatalog | null;
  distributionChannel: DistributionChannel | null;
  boundaryNotes: string[];
}

export interface AcademySubscriptionView {
  subscription: LearningSubscription;
  tiers: LearningSubscriptionTier[];
  courses: AcademyCourseView[];
  certifications: AcademyCertificationView[];
  accessPreview: LearningAccessPreview | null;
  learningEntitlementMock: LearningEntitlementMock | null;
  academyProduct: AcademyProduct | null;
  distributionContext: AcademyDistributionContext | null;
  dataBoundary: AcademyDataBoundary | null;
  revenuePolicy: RevenueSharingPolicyView | null;
  revenuePreview: RevenueSharingPreviewView | null;
  intelligenceSummary: AcademyIntelligenceSummary | null;
  intelligenceSnapshot: IntelligenceSnapshotView | null;
  tenant: Tenant | null;
  curatedCatalog: CuratedCatalog | null;
  distributionChannel: DistributionChannel | null;
  boundaryNotes: string[];
}

export interface AcademyDistributionOverview {
  products: AcademyProduct[];
  courses: AcademyCourseView[];
  certifications: AcademyCertificationView[];
  learningPaths: LearningPath[];
  subscriptions: AcademySubscriptionView[];
  learningEntitlementMocks: LearningEntitlementMock[];
  dataBoundaries: AcademyDataBoundary[];
  contexts: AcademyDistributionContext[];
  intelligenceSummaries: AcademyIntelligenceSummary[];
  boundaryNotes: string[];
}

export interface AIAgentView {
  agent: AIAgent;
  capabilities: AgentCapability[];
  mcpPackages: MCPPackageView[];
  workflowTemplates: WorkflowTemplate[];
  accessPreview: ACSAccessPreview | null;
  executionBoundary: ACSExecutionBoundary | null;
  capabilityDataBoundary: ACSCapabilityDataBoundary | null;
  acsCapabilityProduct: ACSCapabilityProduct | null;
  distributionContext: ACSDistributionContext | null;
  revenuePolicy: RevenueSharingPolicyView | null;
  intelligenceSummary: ACSIntelligenceSummary | null;
  intelligenceSnapshot: IntelligenceSnapshotView | null;
  tenant: Tenant | null;
  curatedCatalog: CuratedCatalog | null;
  distributionChannel: DistributionChannel | null;
  boundaryNotes: string[];
}

export interface MCPPackageView {
  package: MCPPackage;
  versions: MCPVersion[];
  accessPreview: ACSAccessPreview | null;
  provisioningBoundary: ACSProvisioningBoundary | null;
  capabilityDataBoundary: ACSCapabilityDataBoundary | null;
  tenant: Tenant | null;
  curatedCatalog: CuratedCatalog | null;
  distributionChannel: DistributionChannel | null;
  boundaryNotes: string[];
}

export interface WorkflowSystemView {
  system: WorkflowSystem;
  templates: WorkflowTemplate[];
  bundles: WorkflowBundle[];
  accessPreview: ACSAccessPreview | null;
  executionBoundary: ACSExecutionBoundary | null;
  tenant: Tenant | null;
  curatedCatalog: CuratedCatalog | null;
  distributionChannel: DistributionChannel | null;
  boundaryNotes: string[];
}

export interface ComputeAccessView {
  computeAccess: ComputeAccess;
  tiers: ComputeTier[];
  accessPreview: ACSAccessPreview | null;
  provisioningBoundary: ACSProvisioningBoundary | null;
  tenant: Tenant | null;
  boundaryNotes: string[];
}

export interface ACSDistributionOverview {
  capabilityProducts: ACSCapabilityProduct[];
  agents: AIAgentView[];
  mcpPackages: MCPPackageView[];
  workflowSystems: WorkflowSystemView[];
  workflowBundles: WorkflowBundle[];
  computeAccess: ComputeAccessView[];
  accessPreviews: ACSAccessPreview[];
  executionBoundaries: ACSExecutionBoundary[];
  provisioningBoundaries: ACSProvisioningBoundary[];
  capabilityDataBoundaries: ACSCapabilityDataBoundary[];
  contexts: ACSDistributionContext[];
  intelligenceSummaries: ACSIntelligenceSummary[];
  boundaryNotes: string[];
}

export interface WalletDiscoveryView {
  walletAddress: string;
  normalizedWallet: string;
  label: string;
  status: WalletDiscoveryStatus;
  provider: WalletDiscoveryRecord["provider"] | null;
  assets: Array<
    DiscoveredAsset & {
      product?: Product;
      collection?: CollectionView | null;
      license?: License;
    }
  >;
  summary: {
    total: number;
    nfts: number;
    certificates: number;
    licenses: number;
    ownedMock: number;
    discoveredMock: number;
    verifiedOwnershipUnavailable: number;
  };
  boundaries: string[];
}

export interface FederationProviderView {
  provider: FederationProviderDescriptor;
  references: {
    collections: MarketplaceCollection[];
    walletDiscoveryRecords: WalletDiscoveryRecord[];
  };
  boundaryNotes: string[];
}

export interface ExternalContractView {
  id: string;
  name: string;
  contract: ExternalContractReference;
  collection: MarketplaceCollection;
  provider: FederationProviderDescriptor | MarketplaceCollection["provider"] | null;
  trustBoundary: FederationTrustBoundary;
  importPreview: {
    displayEligible: boolean;
    importStatus: "preview-ready" | "blocked" | "quarantined";
    dataSource: "local-mock";
    lastImportedAt?: string;
    lastSyncedAt?: string;
    supportedCapabilities: string[];
    warnings: string[];
    disclaimers: string[];
  };
}

export interface TenantContextView {
  tenant: Tenant;
  routingContext: TenantRoutingContext;
  catalog: TenantCatalog;
  catalogResolution: TenantCatalogResolution;
  curatedCatalogResolution: TenantCuratedCatalogResolution;
  tenantCuratedCatalogs: TenantCuratedCatalogView[];
  isGlobalMarketplace: boolean;
  branding: TenantBranding;
  theme: TenantTheme;
  usesGlobalBrandingFallback: boolean;
  referencedProducts: Product[];
  referencedCollections: CollectionView[];
  enabledSections: string[];
  executionBoundaries: string[];
}

export interface CuratedCatalogResolvedItem {
  item: CuratedCatalogItem;
  product?: Product;
  collection?: CollectionView;
  editorialRules: EditorialRule[];
  curationReasons: {
    inclusionReason: string;
    exclusionReason?: string;
    reviewStatus: string;
    governanceLabel: string;
  };
  trustBoundary?: FederationTrustBoundary;
  boundaryNotes: string[];
}

export interface CuratedCatalogSectionView {
  section: CuratedCatalogSection;
  items: CuratedCatalogResolvedItem[];
}

export interface CuratedCatalogView {
  catalog: CuratedCatalog;
  sections: CuratedCatalogSectionView[];
  items: CuratedCatalogResolvedItem[];
  editorialRules: EditorialRule[];
  workflowSummary: {
    state: string;
    reviewStatus: string;
    governanceLabel: string;
    notes: string[];
    warnings: string[];
    disclaimers: string[];
  };
  featuredProducts: Product[];
  featuredCollections: CollectionView[];
  boundaryNotes: string[];
}

export interface FeaturedCatalogView {
  featured: FeaturedCatalog;
  catalog: CuratedCatalogView | null;
  segment: CatalogSegment | null;
  boundaryNotes: string[];
}

export interface CatalogSegmentView {
  segment: CatalogSegment;
  featuredCatalogs: FeaturedCatalogView[];
  catalogs: CuratedCatalogView[];
  boundaryNotes: string[];
}

export interface TenantCuratedCatalogView {
  catalog: CuratedCatalogView;
  inclusionReason: string;
  isInherited: boolean;
  isTenantOwned: boolean;
  isFeatured: boolean;
  visibleItems: TenantCuratedCatalogItem[];
  excludedItems: TenantCuratedCatalogItem[];
  appliedRules: TenantCuratedCatalogConfig["rules"];
  boundaryNotes: string[];
}

export interface DistributionPlacementView {
  placement: DistributionPlacement;
  targetLabel: string;
  targetKind: string;
  product?: Product;
  collection?: MarketplaceCollection;
  curatedCatalog?: CuratedCatalogView;
  segment?: CatalogSegment;
  tenant?: Tenant;
  boundaryNotes: string[];
}

export interface DistributionChannelView {
  channel: DistributionChannel;
  tenant?: Tenant;
  placements: DistributionPlacementView[];
  allowedCuratedCatalogs: CuratedCatalogView[];
  allowedSegments: CatalogSegment[];
  allowedProducts: Product[];
  allowedCollections: MarketplaceCollection[];
  blockedProducts: Product[];
  blockedCollections: MarketplaceCollection[];
  boundaryNotes: string[];
}

export interface DistributionNetworkView {
  network: DistributionNetwork;
  channels: DistributionChannelView[];
  defaultChannel: DistributionChannelView | null;
  boundaryNotes: string[];
}

export interface DistributionContextView {
  network: DistributionNetworkView;
  channel: DistributionChannelView;
  isFallback: boolean;
  boundaryNotes: string[];
}

export interface DistributionProfileView {
  profile: DistributionProfile;
  channels: DistributionChannelView[];
  tenants: Tenant[];
  curatedCatalogs: CuratedCatalogView[];
  segments: CatalogSegment[];
  relationshipLabels: string[];
  boundaryNotes: string[];
}

export interface AttributionSourceView {
  source: AttributionSourceRecord;
  context: AttributionContext;
  attributionSplitResolution: AttributionSplitResolution;
  attributionSplitExplanations: AttributionSplitExplanation[];
  channel?: DistributionChannelView;
  profile?: DistributionProfileView;
  tenant?: Tenant;
  curatedCatalog?: CuratedCatalogView;
  segment?: CatalogSegment;
  placement?: DistributionPlacementView;
  noteLabels: string[];
  boundaryNotes: string[];
}

export interface AttributionToSplitRuleView {
  rule: AttributionToSplitRule;
  attributionSource: AttributionSourceView | null;
  targetPolicy: RevenueSharingPolicyView | null;
  targetCommissionModel: CommissionModelView | null;
  participantShares: ParticipantShare[];
  explanation: AttributionSplitExplanation;
  boundaryNotes: string[];
}

export interface CommunityDistributionItemView {
  item: CommunityDistributionItem;
  targetLabel: string;
  tenant?: Tenant;
  curatedCatalog?: CuratedCatalogView;
  segment?: CatalogSegment;
  product?: Product;
  collection?: MarketplaceCollection;
  trustBoundary?: FederationTrustBoundary;
  boundaryNotes: string[];
}

export interface CommunityDistributionView {
  distribution: CommunityMarketplaceDistribution;
  context: CommunityDistributionContext;
  profile?: DistributionProfileView;
  channel?: DistributionChannelView;
  attributionSource?: AttributionSourceView;
  tenants: Tenant[];
  curatedCatalogs: CuratedCatalogView[];
  featuredCatalogs: FeaturedCatalogView[];
  segments: CatalogSegment[];
  products: Product[];
  collections: MarketplaceCollection[];
  visibleItems: CommunityDistributionItemView[];
  excludedItems: CommunityDistributionItemView[];
  boundaryNotes: string[];
}

export interface TenantDistributionView {
  tenant: Tenant;
  config: TenantDistributionConfig;
  resolution: TenantDistributionResolution;
  channels: DistributionChannelView[];
  featuredChannels: DistributionChannelView[];
  excludedChannels: DistributionChannelView[];
  profiles: DistributionProfileView[];
  excludedProfiles: DistributionProfileView[];
  communityDistributions: CommunityDistributionView[];
  excludedCommunityDistributions: CommunityDistributionView[];
  attributionSources: AttributionSourceView[];
  excludedAttributionSources: AttributionSourceView[];
  curatedCatalogs: CuratedCatalogView[];
  excludedCuratedCatalogs: CuratedCatalogView[];
  segments: CatalogSegment[];
  excludedSegments: CatalogSegment[];
  context: DistributionIntegratedContext;
  includedItems: DistributionIntegratedItem[];
  excludedItems: DistributionIntegratedItem[];
  boundaryNotes: string[];
}

export interface CuratedCatalogDistributionView {
  catalog: CuratedCatalogView;
  config: CuratedCatalogDistributionConfig;
  resolution: CuratedCatalogDistributionResolution;
  channels: DistributionChannelView[];
  featuredChannels: DistributionChannelView[];
  excludedChannels: DistributionChannelView[];
  profiles: DistributionProfileView[];
  excludedProfiles: DistributionProfileView[];
  communityDistributions: CommunityDistributionView[];
  excludedCommunityDistributions: CommunityDistributionView[];
  attributionSources: AttributionSourceView[];
  excludedAttributionSources: AttributionSourceView[];
  tenants: Tenant[];
  excludedTenants: Tenant[];
  segments: CatalogSegment[];
  excludedSegments: CatalogSegment[];
  context: DistributionIntegratedContext;
  includedItems: DistributionIntegratedItem[];
  excludedItems: DistributionIntegratedItem[];
  boundaryNotes: string[];
}

export interface RevenueSharingPolicyView {
  policy: RevenueSharingPolicy;
  participants: RevenueParticipant[];
  rules: RevenueSplitRule[];
  participantShares: ParticipantShare[];
  commissionModels: CommissionModelView[];
  settlementBoundary: SettlementBoundary | null;
  tenant?: Tenant;
  distributionChannel?: DistributionChannelView;
  distributionProfile?: DistributionProfileView;
  communityDistribution?: CommunityDistributionView;
  curatedCatalog?: CuratedCatalogView;
  catalogSegment?: CatalogSegment;
  product?: Product;
  collection?: MarketplaceCollection;
  attributionSources: AttributionSourceView[];
  shareTotal: number;
  boundaryNotes: string[];
}

export interface CommissionModelView {
  model: CommissionModel;
  policy: RevenueSharingPolicy | null;
  participants: RevenueParticipant[];
  rules: RevenueSplitRule[];
  participantShares: ParticipantShare[];
  validation: ParticipantShareValidation;
  boundaryNotes: string[];
}

export interface RevenueSharingPreviewView {
  preview: RevenueSharingPreview;
  policy: RevenueSharingPolicyView | null;
  commissionModel: CommissionModelView | null;
  payoutPreview: PayoutPreviewMock | null;
  settlementPreview: SettlementPreviewMock | null;
  auditEntries: RevenueSharingAuditEntry[];
  participantSplitExplanations: ParticipantSplitExplanation[];
  ruleApplicationExplanations: AttributionSplitExplanation[];
  conflictWarnings: string[];
  boundaryNotes: string[];
}

export interface RevenueSharingIntegrationView {
  contextType: RevenueSharingIntegratedContext["contextType"];
  config: TenantRevenueSharingConfig | DistributionRevenueSharingConfig | CuratedCatalogRevenueSharingConfig | CommunityRevenueSharingConfig;
  resolution: RevenueSharingResolution;
  integratedContext: RevenueSharingIntegratedContext;
  policies: RevenueSharingPolicyView[];
  commissionModels: CommissionModelView[];
  previews: RevenueSharingPreviewView[];
  auditEntries: RevenueSharingAuditEntry[];
  attributionSources: AttributionSourceView[];
  boundaryNotes: string[];
}

export function normalizeMockWalletAddress(walletAddress?: string) {
  return walletAddress?.trim().toLowerCase() ?? "";
}

export function isValidMockWalletAddress(walletAddress?: string) {
  const value = walletAddress?.trim() ?? "";
  return /^0x[a-fA-F0-9]{40}$/.test(value) || /^0xMock[A-Za-z0-9]+$/.test(value);
}

function buildWalletDiscoverySummary(assets: DiscoveredAsset[]) {
  return {
    total: assets.length,
    nfts: assets.filter((asset) => asset.kind === "nft").length,
    certificates: assets.filter((asset) => asset.kind === "certificate").length,
    licenses: assets.filter((asset) => asset.kind === "license").length,
    ownedMock: assets.filter((asset) => asset.ownershipState === "owned-mock").length,
    discoveredMock: assets.filter((asset) => asset.ownershipState === "discovered-mock").length,
    verifiedOwnershipUnavailable: assets.filter((asset) => asset.ownershipState === "verified-ownership-unavailable").length
  };
}

function enrichDiscoveredAsset(asset: DiscoveredAsset) {
  const product = asset.productId ? getProductBySlug(asset.productId) ?? products.find((item) => item.id === asset.productId) : undefined;
  const collection = asset.collectionId ? listCollections().find((view) => view.collection.id === asset.collectionId || view.collection.slug === asset.collectionId) ?? null : null;
  const license = asset.licenseId ? licenses.find((item) => item.id === asset.licenseId) : undefined;

  return {
    ...asset,
    product,
    collection,
    license
  };
}

export function listWalletDiscoveryRecords() {
  return walletDiscoveryRecords;
}

export function listFederationProviders(): FederationProviderView[] {
  return federationProviders.map((provider) => ({
    provider,
    references: {
      collections: collections.filter((collection) => collection.provider?.id === provider.id || collection.externalContract?.providerId === provider.id),
      walletDiscoveryRecords: walletDiscoveryRecords.filter((record) => record.provider.id === provider.id)
    },
    boundaryNotes: [
      ...provider.trustBoundary.notes,
      provider.externalDependencyWarning,
      "Provider descriptors are mock-first and do not execute external calls, SDKs, API keys, scraping, sync jobs, indexers or subgraphs."
    ]
  }));
}

export function getFederationProviderById(idOrSlug: string) {
  const key = idOrSlug.trim().toLowerCase();
  return listFederationProviders().find((view) => view.provider.id.toLowerCase() === key || view.provider.slug.toLowerCase() === key) ?? null;
}

export function getFederationProviderReference(providerId: string) {
  return federationProviders.find((provider) => provider.id === providerId) ?? null;
}

function buildExternalContractId(collection: MarketplaceCollection, contract: ExternalContractReference) {
  return `${contract.chainName.toLowerCase()}-${contract.tokenStandard.toLowerCase()}-${contract.contractAddress.toLowerCase()}-${collection.slug}`.replace(/[^a-z0-9-]/g, "-");
}

function buildExternalContractView(collection: MarketplaceCollection): ExternalContractView | null {
  if (!collection.externalContract) return null;
  const provider = getFederationProviderReference(collection.externalContract.providerId) ?? collection.provider ?? null;
  const trustBoundary = getCollectionBoundary(collection);
  const displayEligible = trustBoundary.canDisplay && collection.displayStatus !== "blocked" && collection.displayStatus !== "quarantined";
  const importStatus: ExternalContractView["importPreview"]["importStatus"] =
    collection.displayStatus === "blocked" ? "blocked" : collection.displayStatus === "quarantined" ? "quarantined" : "preview-ready";

  return {
    id: buildExternalContractId(collection, collection.externalContract),
    name: `${collection.name} Contract`,
    contract: collection.externalContract,
    collection,
    provider,
    trustBoundary,
    importPreview: {
      displayEligible,
      importStatus,
      dataSource: "local-mock",
      lastImportedAt: collection.externalMetadata?.importedAt,
      lastSyncedAt: collection.externalMetadata?.lastSyncedAt ?? collection.externalStatistics?.lastSyncedAt,
      supportedCapabilities: [
        "contract-reference",
        "collection-link",
        "metadata-reference",
        "display-eligibility-preview",
        "read-only-boundary"
      ],
      warnings: [
        ...(collection.externalMetadata?.warnings ?? []),
        "External Contract is a mock-first/read-only descriptor and is not verified on-chain by Axodus."
      ],
      disclaimers: [
        ...(collection.externalMetadata?.disclaimers ?? []),
        "Contract Import preview does not enable trading, custody, settlement, wallet signatures, contract writes, bridge execution or royalties."
      ]
    }
  };
}

export function listExternalContracts() {
  return collections.map(buildExternalContractView).filter((contract): contract is ExternalContractView => Boolean(contract));
}

export function getExternalContractById(idOrAddress: string) {
  const key = idOrAddress.trim().toLowerCase();
  return (
    listExternalContracts().find(
      (view) =>
        view.id.toLowerCase() === key ||
        view.contract.contractAddress.toLowerCase() === key ||
        view.collection.slug.toLowerCase() === key
    ) ?? null
  );
}

export function listTenants() {
  return tenants;
}

export function getGlobalTenant() {
  return tenants.find((tenant) => tenant.tenantType === "global") ?? tenants[0];
}

export function getTenantById(id: string) {
  return tenants.find((tenant) => tenant.id === id) ?? null;
}

export function getTenantBySlug(slug: string) {
  return tenants.find((tenant) => tenant.slug === slug) ?? null;
}

export function listTenantDomains() {
  return tenants.flatMap((tenant) => tenant.domains ?? []);
}

export function listTenantAliases() {
  return tenants.flatMap((tenant) => tenant.domainAliases ?? []);
}

export function getTenantDomains(tenantIdOrSlug: string) {
  const tenant = getTenantById(tenantIdOrSlug) ?? getTenantBySlug(tenantIdOrSlug);
  return tenant?.domains ?? [];
}

export function getPrimaryTenantDomain(tenantIdOrSlug: string) {
  return getTenantDomains(tenantIdOrSlug).find((domain) => domain.isPrimary) ?? null;
}

export function isValidTenantSlug(value?: string) {
  return Boolean(value && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value));
}

export function isValidTenantAlias(value?: string) {
  return Boolean(value && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value));
}

export function isValidSimulatedHostname(value?: string) {
  return Boolean(value && /^[a-z0-9.-]+\.mock(?:\.axodus\.local)?$/i.test(value));
}

function normalizeTenantRouteInput(value?: string) {
  return value?.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "") ?? "";
}

function routeBoundaryNotes() {
  return {
    warnings: [
      "Tenant Domains are simulated mock/read-only routing descriptors.",
      "Domain verification mock does not represent DNS ownership, TLS certificate issuance, proxy routing or production tenant routing."
    ],
    disclaimers: [
      "No DNS real, no custom DNS, no TLS certificate, no proxy, no edge routing, no backend routing and no separate tenant deploy is active.",
      "canRoute means only SPA mock routing eligibility and never productive infrastructure routing."
    ]
  };
}

function getInputType(input: string): TenantDomainInputType {
  if (!input) return "global";
  if (input.startsWith("/marketplace/t/")) return "route";
  if (input.includes(".")) return "hostname";
  if (listTenantAliases().some((alias) => alias.alias === input)) return "alias";
  return "slug";
}

function isBlockedTenant(tenant: Tenant) {
  return tenant.status === "disabled" || tenant.status === "restricted" || tenant.governanceStatus === "disabled" || tenant.governanceStatus === "restricted";
}

function isBlockedDomain(domain?: TenantDomain | null) {
  return Boolean(domain && (domain.status === "disabled" || domain.status === "restricted" || domain.status === "conflict" || !domain.canRoute));
}

function buildRoutingContext(args: {
  input: string;
  inputType: TenantDomainInputType;
  tenant: Tenant;
  domain: TenantDomain | null;
  resolutionStatus: TenantDomainResolutionStatus;
  isFallback: boolean;
}): TenantRoutingContext {
  const notes = routeBoundaryNotes();
  const resolution = {
    input: args.input,
    inputType: args.inputType,
    matchedTenantId: args.tenant.id,
    matchedTenantSlug: args.tenant.slug,
    matchedDomainId: args.domain?.id,
    resolutionStatus: args.resolutionStatus,
    routingMode: "mock-read-only" as const,
    isFallback: args.isFallback,
    warnings: [...notes.warnings, ...(args.domain?.warnings ?? [])],
    disclaimers: [...notes.disclaimers, ...(args.domain?.disclaimers ?? [])]
  };

  return {
    tenant: args.tenant,
    domain: args.domain,
    resolution,
    isTenantRoute: !args.isFallback && args.tenant.tenantType !== "global",
    isGlobalRoute: args.tenant.tenantType === "global",
    isSimulatedRoute: args.domain?.isSimulated ?? true,
    canRoute: !args.isFallback && args.resolutionStatus === "resolved" && !isBlockedDomain(args.domain),
    warnings: resolution.warnings,
    disclaimers: resolution.disclaimers
  };
}

function fallbackRoutingContext(input: string, inputType: TenantDomainInputType, status: TenantDomainResolutionStatus): TenantRoutingContext {
  return buildRoutingContext({
    input,
    inputType,
    tenant: getGlobalTenant(),
    domain: getPrimaryTenantDomain("global"),
    resolutionStatus: status,
    isFallback: true
  });
}

export function resolveTenantBySlug(slug: string) {
  if (!isValidTenantSlug(slug)) return null;
  return getTenantBySlug(slug);
}

export function resolveTenantByAlias(aliasValue: string) {
  if (!isValidTenantAlias(aliasValue)) return null;
  const matches = listTenantAliases().filter((alias) => alias.alias === aliasValue);
  if (matches.length !== 1 || matches[0].status === "conflict" || matches[0].status === "disabled" || matches[0].status === "restricted") return null;
  return getTenantBySlug(matches[0].targetTenantSlug);
}

export function resolveTenantBySimulatedDomain(hostname: string) {
  const normalized = normalizeTenantRouteInput(hostname);
  if (!isValidSimulatedHostname(normalized)) return null;
  const matches = listTenantDomains().filter((domain) => domain.hostname?.toLowerCase() === normalized);
  if (matches.length !== 1 || isBlockedDomain(matches[0])) return null;
  return getTenantById(matches[0].tenantId);
}

export function resolveTenantRoutingContext(input?: string): TenantRoutingContext {
  const normalized = normalizeTenantRouteInput(input);
  const inputType = getInputType(normalized);
  if (!normalized || inputType === "global") return fallbackRoutingContext(normalized, inputType, "global-fallback");

  const routeSlug = inputType === "route" ? normalized.replace(/^\/marketplace\/t\//, "") : normalized;
  const aliasMatches = inputType === "alias" ? listTenantAliases().filter((alias) => alias.alias === routeSlug) : [];
  if (aliasMatches.length > 1 || aliasMatches.some((alias) => alias.status === "conflict")) {
    return fallbackRoutingContext(normalized, inputType, "conflict");
  }
  if (aliasMatches.some((alias) => alias.status === "disabled" || alias.status === "restricted")) {
    return fallbackRoutingContext(normalized, inputType, aliasMatches[0].status === "disabled" ? "disabled" : "restricted");
  }

  const domainMatches = inputType === "hostname" ? listTenantDomains().filter((domain) => domain.hostname?.toLowerCase() === routeSlug) : [];
  if (domainMatches.length > 1 || domainMatches.some((domain) => domain.status === "conflict")) {
    return fallbackRoutingContext(normalized, inputType, "conflict");
  }
  if (domainMatches.some(isBlockedDomain)) {
    return fallbackRoutingContext(
      normalized,
      inputType,
      domainMatches[0].status === "disabled" ? "disabled" : domainMatches[0].status === "restricted" ? "restricted" : "conflict"
    );
  }

  const tenant =
    inputType === "hostname"
      ? resolveTenantBySimulatedDomain(routeSlug)
      : inputType === "alias"
        ? resolveTenantByAlias(routeSlug)
        : getTenantById(routeSlug) ?? resolveTenantBySlug(routeSlug);

  if (!tenant) return fallbackRoutingContext(normalized, inputType, "not-found");
  if (isBlockedTenant(tenant)) return fallbackRoutingContext(normalized, inputType, tenant.status === "disabled" ? "disabled" : "restricted");

  const domain =
    inputType === "hostname"
      ? domainMatches[0]
      : inputType === "alias"
        ? tenant.domainAliases?.find((alias) => alias.alias === routeSlug)
          ? ({
              id: `alias-domain-${routeSlug}`,
              tenantId: tenant.id,
              domainType: "alias",
              alias: routeSlug,
              displayLabel: `Tenant alias ${routeSlug}`,
              status: "active-mock",
              verificationStatus: "not-required-mock",
              routingMode: "mock-read-only",
              isPrimary: false,
              isSimulated: true,
              canRoute: true,
              createdAt: tenant.createdAt,
              updatedAt: tenant.updatedAt,
              warnings: ["tenant alias resolved through mock/read-only routing."],
              disclaimers: ["tenant alias does not create DNS real, backend routing or production tenant routing."]
            } satisfies TenantDomain)
          : null
        : getPrimaryTenantDomain(tenant.slug);

  if (isBlockedDomain(domain)) return fallbackRoutingContext(normalized, inputType, domain?.status === "disabled" ? "disabled" : domain?.status === "restricted" ? "restricted" : "conflict");

  return buildRoutingContext({
    input: normalized,
    inputType,
    tenant,
    domain,
    resolutionStatus: "resolved",
    isFallback: false
  });
}

function isValidThemeColor(color?: string) {
  return Boolean(color && /^#[0-9a-fA-F]{6}$/.test(color));
}

function canUseTenantBranding(tenant: Tenant) {
  const branding = tenant.branding;
  if (!branding?.isBrandingEnabled) return false;
  if (tenant.status === "disabled" || tenant.status === "restricted" || tenant.visibility === "archived") return false;
  return [branding.primaryColor, branding.secondaryColor, branding.accentColor, branding.backgroundHint, branding.surfaceHint, branding.textHint].every(isValidThemeColor);
}

export function getGlobalBranding() {
  const global = getGlobalTenant();
  if (!global.branding) {
    throw new Error("Global Tenant Branding is required for Marketplace branding fallback");
  }
  return global.branding;
}

export function getTenantBranding(tenant: Tenant) {
  return tenant.branding ?? null;
}

export function resolveTenantBranding(idOrSlug?: string) {
  const requestedTenant = idOrSlug ? getTenantById(idOrSlug) ?? getTenantBySlug(idOrSlug) : null;
  const tenant = requestedTenant ?? getGlobalTenant();
  const globalBranding = getGlobalBranding();
  const shouldUseGlobalFallback = Boolean(idOrSlug && !requestedTenant) || !canUseTenantBranding(tenant);
  const branding = !shouldUseGlobalFallback
    ? tenant.branding!
    : {
        ...globalBranding,
        usesGlobalFallback: true,
        warnings: [
          ...globalBranding.warnings,
          `Tenant Branding fallback applied for ${tenant.slug}; tenant branding is missing, disabled, restricted or invalid.`
        ]
      };

  return {
    tenant,
    branding,
    theme: branding.theme,
    usesGlobalBrandingFallback: shouldUseGlobalFallback
  };
}

export function resolveTenantTheme(idOrSlug?: string) {
  return resolveTenantBranding(idOrSlug).theme;
}

export function getTenantDisplayName(idOrSlug?: string) {
  return resolveTenantBranding(idOrSlug).branding.displayName;
}

export function getTenantLogo(idOrSlug?: string) {
  const { branding } = resolveTenantBranding(idOrSlug);
  return {
    logoUrl: branding.logoUrl,
    logoAlt: branding.logoAlt,
    placeholder: branding.shortName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 3)
      .toUpperCase()
  };
}

function buildFallbackTenantCatalog(tenant: Tenant): TenantCatalog {
  return {
    id: `catalog-${tenant.id}`,
    tenantId: tenant.id,
    name: `${tenant.identity.displayName} Catalog`,
    description: "Fallback Tenant Catalog derived from Tenant Configuration.",
    status: tenant.configuration.canDisplay ? "configured-mock" : "disabled",
    scope: tenant.tenantType === "global" ? "global" : "tenant",
    inheritsGlobalCatalog: tenant.tenantType === "global",
    allowsFederatedAssets: tenant.configuration.isFederatedCatalogEnabled,
    allowsExternalCollections: tenant.configuration.isFederatedCatalogEnabled,
    allowsNativeProducts: true,
    featuredProductIds: tenant.configuration.featuredProductIds,
    featuredCollectionIds: tenant.configuration.featuredCollectionIds,
    allowedProductIds: tenant.configuration.allowedProductIds,
    blockedProductIds: tenant.configuration.blockedProductIds,
    allowedCollectionIds: tenant.configuration.allowedCollectionIds,
    blockedCollectionIds: tenant.configuration.blockedCollectionIds,
    allowedExternalCollectionIds: tenant.configuration.allowedExternalCollectionIds,
    blockedExternalCollectionIds: [],
    allowedCategoryIds: tenant.configuration.allowedCategoryIds,
    blockedCategoryIds: [],
    exposureRules: [],
    rules: [],
    warnings: ["Fallback catalog was derived from Tenant Configuration."],
    disclaimers: ["Tenant Catalog fallback is mock isolation and does not create financial isolation, settlement isolation, RBAC enforcement or isolated database."],
    createdAt: tenant.createdAt,
    updatedAt: tenant.updatedAt
  };
}

export function getTenantCatalog(tenantIdOrSlug: string) {
  const tenant = getTenantById(tenantIdOrSlug) ?? getTenantBySlug(tenantIdOrSlug) ?? getGlobalTenant();
  return tenant.catalog ?? buildFallbackTenantCatalog(tenant);
}

export function listTenantCatalogRules(tenantIdOrSlug: string) {
  const catalog = getTenantCatalog(tenantIdOrSlug);
  return [...catalog.rules, ...catalog.exposureRules].sort((left, right) => left.priority - right.priority || left.id.localeCompare(right.id));
}

function isBlockedCatalogTenant(tenant: Tenant, catalog: TenantCatalog) {
  return isBlockedTenant(tenant) || catalog.status === "disabled" || catalog.status === "restricted" || tenant.visibility === "archived";
}

function isProductExplicitlyAllowed(product: Product, catalog: TenantCatalog) {
  return (
    catalog.allowedProductIds.includes(product.id) ||
    catalog.allowedCategoryIds.includes(product.category) ||
    (product.collectionId ? catalog.allowedCollectionIds.includes(product.collectionId) : false)
  );
}

function isProductBlocked(product: Product, catalog: TenantCatalog) {
  const collection = product.collectionId ? collections.find((item) => item.id === product.collectionId) : undefined;
  return (
    catalog.blockedProductIds.includes(product.id) ||
    catalog.blockedCategoryIds.includes(product.category) ||
    Boolean(product.collectionId && catalog.blockedCollectionIds.includes(product.collectionId)) ||
    Boolean(collection && isExternalCollection(collection) && !catalog.allowsFederatedAssets)
  );
}

function getProductCatalogSource(product: Product, catalog: TenantCatalog): TenantCatalogSource {
  if (catalog.featuredProductIds.includes(product.id)) return "tenant featured rule";
  if (catalog.allowedProductIds.includes(product.id)) return "tenant explicit allow rule";
  if (product.collectionId && catalog.allowedCollectionIds.includes(product.collectionId)) return "collection allow rule";
  if (catalog.allowedCategoryIds.includes(product.category)) return "category allow rule";
  if (catalog.inheritsGlobalCatalog) return "global catalog inheritance";
  return "tenant explicit allow rule";
}

function getCollectionCatalogSource(collection: MarketplaceCollection, catalog: TenantCatalog): TenantCatalogSource {
  if (catalog.featuredCollectionIds.includes(collection.id)) return "tenant featured rule";
  if (isExternalCollection(collection) && catalog.allowedExternalCollectionIds.includes(collection.id)) return "external collection rule";
  if (catalog.allowedCollectionIds.includes(collection.id)) return "collection allow rule";
  if (catalog.inheritsGlobalCatalog) return "global catalog inheritance";
  if (isExternalCollection(collection)) return "federated catalog rule";
  return "collection allow rule";
}

function buildProductCatalogItem(product: Product, tenant: Tenant, catalog: TenantCatalog, source: TenantCatalogSource): TenantCatalogItem {
  const collection = product.collectionId ? collections.find((item) => item.id === product.collectionId) : undefined;
  const external = collection ? isExternalCollection(collection) : false;
  return {
    productId: product.id,
    collectionId: product.collectionId,
    tenantId: tenant.id,
    source,
    inclusionReason: source,
    isFeatured: catalog.featuredProductIds.includes(product.id),
    isFederated: external,
    isExternal: external,
    isNative: !external,
    canDisplay: true,
    canTrade: false,
    canSettle: false,
    warnings: external ? ["Federated catalog rule preserves provider-reported trust boundaries."] : [],
    disclaimers: ["Tenant Catalog item is mock/config-first and does not enable settlement isolation, tenant billing, RBAC enforcement or isolated database."]
  };
}

function buildCollectionCatalogItem(collection: MarketplaceCollection, tenant: Tenant, catalog: TenantCatalog, source: TenantCatalogSource): TenantCatalogItem {
  const external = isExternalCollection(collection);
  return {
    collectionId: collection.id,
    tenantId: tenant.id,
    source,
    inclusionReason: source,
    isFeatured: catalog.featuredCollectionIds.includes(collection.id),
    isFederated: external,
    isExternal: external,
    isNative: !external,
    canDisplay: true,
    canTrade: false,
    canSettle: false,
    warnings: external ? ["External collection preserves origin, provider, validation status, provenance, risk classification and trust boundaries."] : [],
    disclaimers: ["Tenant Collection item is mock/config-first and does not enable financial isolation or settlement isolation."]
  };
}

export function applyTenantCatalogRules(tenant: Tenant, catalog: TenantCatalog): TenantCatalogResolution {
  const blockedRules = listTenantCatalogRules(tenant.id).filter((rule) => rule.status === "disabled" || rule.status === "restricted" || rule.effect === "exclude" || rule.effect === "restrict");
  const appliedRules = listTenantCatalogRules(tenant.id).filter((rule) => !blockedRules.includes(rule));

  if (isBlockedCatalogTenant(tenant, catalog)) {
    return {
      tenantId: tenant.id,
      resolvedAt: new Date(0).toISOString(),
      includedProductIds: [],
      excludedProductIds: products.map((product) => product.id),
      includedCollectionIds: [],
      excludedCollectionIds: collections.filter((collection) => !isExternalCollection(collection)).map((collection) => collection.id),
      includedExternalCollectionIds: [],
      excludedExternalCollectionIds: collections.filter(isExternalCollection).map((collection) => collection.id),
      featuredProductIds: [],
      featuredCollectionIds: [],
      appliedRules,
      blockedRules,
      productItems: [],
      collectionItems: [],
      warnings: ["Tenant disabled/restricted status prevents catalog display."],
      disclaimers: ["Tenant Isolation is mock/config-first and does not enable RBAC enforcement, production data isolation, financial isolation or isolated databases."]
    };
  }

  const includedProducts = products.filter((product) => {
    if (isProductBlocked(product, catalog)) return false;
    if (catalog.inheritsGlobalCatalog) return catalog.allowsNativeProducts || product.nftBound;
    return isProductExplicitlyAllowed(product, catalog);
  });
  const excludedProducts = products.filter((product) => !includedProducts.includes(product));
  const productCollectionIds = new Set(includedProducts.map((product) => product.collectionId).filter(Boolean));
  const includedCollections = listCollections()
    .map((view) => view.collection)
    .filter((collection) => {
      if (catalog.blockedCollectionIds.includes(collection.id) || catalog.blockedExternalCollectionIds.includes(collection.id)) return false;
      if (isExternalCollection(collection) && !catalog.allowsExternalCollections) return false;
      return (
        productCollectionIds.has(collection.id) ||
        catalog.allowedCollectionIds.includes(collection.id) ||
        catalog.allowedExternalCollectionIds.includes(collection.id) ||
        catalog.featuredCollectionIds.includes(collection.id) ||
        catalog.inheritsGlobalCatalog
      );
    });
  const excludedCollections = collections.filter((collection) => !includedCollections.includes(collection));
  const productItems = includedProducts.map((product) => buildProductCatalogItem(product, tenant, catalog, getProductCatalogSource(product, catalog)));
  const collectionItems = includedCollections.map((collection) => buildCollectionCatalogItem(collection, tenant, catalog, getCollectionCatalogSource(collection, catalog)));

  return {
    tenantId: tenant.id,
    resolvedAt: new Date(0).toISOString(),
    includedProductIds: includedProducts.map((product) => product.id),
    excludedProductIds: excludedProducts.map((product) => product.id),
    includedCollectionIds: includedCollections.filter((collection) => !isExternalCollection(collection)).map((collection) => collection.id),
    excludedCollectionIds: excludedCollections.filter((collection) => !isExternalCollection(collection)).map((collection) => collection.id),
    includedExternalCollectionIds: includedCollections.filter(isExternalCollection).map((collection) => collection.id),
    excludedExternalCollectionIds: excludedCollections.filter(isExternalCollection).map((collection) => collection.id),
    featuredProductIds: catalog.featuredProductIds.filter((id) => includedProducts.some((product) => product.id === id)),
    featuredCollectionIds: catalog.featuredCollectionIds.filter((id) => includedCollections.some((collection) => collection.id === id)),
    appliedRules,
    blockedRules,
    productItems,
    collectionItems,
    warnings: [...catalog.warnings],
    disclaimers: [
      ...catalog.disclaimers,
      "Tenant Isolation is mock/config-first isolation only.",
      "No financial isolation, no settlement isolation, no RBAC enforcement, no isolated database, no tenant billing and no revenue sharing are active."
    ]
  };
}

export function resolveTenantCatalog(tenantIdOrSlug?: string) {
  const tenant = tenantIdOrSlug ? getTenantById(tenantIdOrSlug) ?? getTenantBySlug(tenantIdOrSlug) ?? getGlobalTenant() : getGlobalTenant();
  const catalog = getTenantCatalog(tenant.id);
  const resolution = applyTenantCatalogRules(tenant, catalog);
  return { tenant, catalog, resolution };
}

export function getTenantVisibleProducts(tenantIdOrSlug?: string) {
  const { resolution } = resolveTenantCatalog(tenantIdOrSlug);
  return products.filter((product) => resolution.includedProductIds.includes(product.id));
}

export function getTenantVisibleCollections(tenantIdOrSlug?: string) {
  const { resolution } = resolveTenantCatalog(tenantIdOrSlug);
  const visibleIds = new Set([...resolution.includedCollectionIds, ...resolution.includedExternalCollectionIds]);
  return listCollections().filter((view) => visibleIds.has(view.collection.id));
}

export function getTenantFeaturedProducts(tenantIdOrSlug?: string) {
  const { resolution } = resolveTenantCatalog(tenantIdOrSlug);
  return products.filter((product) => resolution.featuredProductIds.includes(product.id));
}

export function getTenantFeaturedCollections(tenantIdOrSlug?: string) {
  const { resolution } = resolveTenantCatalog(tenantIdOrSlug);
  return listCollections().filter((view) => resolution.featuredCollectionIds.includes(view.collection.id));
}

export function isProductVisibleForTenant(tenantIdOrSlug: string, productId: string) {
  return resolveTenantCatalog(tenantIdOrSlug).resolution.includedProductIds.includes(productId);
}

export function isCollectionVisibleForTenant(tenantIdOrSlug: string, collectionId: string) {
  const resolution = resolveTenantCatalog(tenantIdOrSlug).resolution;
  return [...resolution.includedCollectionIds, ...resolution.includedExternalCollectionIds].includes(collectionId);
}

export function explainTenantCatalogInclusion(tenantIdOrSlug: string, targetId: string) {
  const { catalog } = resolveTenantCatalog(tenantIdOrSlug);
  if (catalog.featuredProductIds.includes(targetId) || catalog.featuredCollectionIds.includes(targetId)) return "Tenant featured rule";
  if (catalog.allowedProductIds.includes(targetId)) return "Tenant explicit allow rule";
  if (catalog.allowedCollectionIds.includes(targetId)) return "Collection allow rule";
  if (catalog.allowedExternalCollectionIds.includes(targetId)) return "External collection rule";
  if (catalog.allowedCategoryIds.includes(targetId as ProductCategory)) return "Category allow rule";
  if (catalog.inheritsGlobalCatalog) return "Global catalog inheritance";
  return "Tenant catalog rule";
}

export function explainTenantCatalogExclusion(tenantIdOrSlug: string, targetId: string) {
  const { tenant, catalog, resolution } = resolveTenantCatalog(tenantIdOrSlug);
  if (isBlockedCatalogTenant(tenant, catalog)) return "Tenant disabled/restricted status";
  if (catalog.blockedProductIds.includes(targetId)) return "Product block rule";
  if (catalog.blockedCollectionIds.includes(targetId)) return "Collection block rule";
  if (catalog.blockedExternalCollectionIds.includes(targetId)) return "External asset restriction";
  if (catalog.blockedCategoryIds.includes(targetId as ProductCategory)) return "Category block rule";
  if (resolution.excludedProductIds.includes(targetId) || resolution.excludedCollectionIds.includes(targetId) || resolution.excludedExternalCollectionIds.includes(targetId)) {
    return "Tenant catalog rule excluded this item";
  }
  return "No exclusion found";
}

function buildFallbackTenantCuratedCatalogConfig(tenant: Tenant): TenantCuratedCatalogConfig {
  return {
    tenantId: tenant.id,
    inheritsGlobalCuratedCatalogs: tenant.tenantType === "global",
    allowedCuratedCatalogIds: [],
    blockedCuratedCatalogIds: [],
    featuredCuratedCatalogIds: [],
    allowedSegmentIds: [],
    blockedSegmentIds: [],
    allowsFederatedCuratedCatalogs: tenant.configuration.isFederatedCatalogEnabled,
    rules: [],
    warnings: ["Fallback Tenant Curated Catalog config derived from tenant identity."],
    disclaimers: ["Tenant Curated Catalog fallback is mock/config-first and does not enable revenue sharing, settlement, billing, Marketplace Intelligence or Distribution Network."]
  };
}

export function getTenantCuratedCatalogConfig(tenantIdOrSlug?: string) {
  const tenant = tenantIdOrSlug ? getTenantById(tenantIdOrSlug) ?? getTenantBySlug(tenantIdOrSlug) ?? getGlobalTenant() : getGlobalTenant();
  return tenant.curatedCatalogConfig ?? buildFallbackTenantCuratedCatalogConfig(tenant);
}

function catalogMatchesTenantCuratedConfig(catalog: CuratedCatalog, tenant: Tenant, config: TenantCuratedCatalogConfig) {
  if (config.blockedCuratedCatalogIds.includes(catalog.id)) return false;
  if (catalog.segmentIds.some((segmentId) => config.blockedSegmentIds.includes(segmentId))) return false;
  if (!config.allowsFederatedCuratedCatalogs && catalog.allowsFederatedAssets) return false;
  if (catalog.tenantId === tenant.id) return true;
  if (config.allowedCuratedCatalogIds.includes(catalog.id)) return true;
  if (catalog.segmentIds.some((segmentId) => config.allowedSegmentIds.includes(segmentId))) return true;
  if (config.inheritsGlobalCuratedCatalogs && catalog.ownerScope === "global") return true;
  return false;
}

function explainTenantCuratedCatalogInclusion(catalog: CuratedCatalog, tenant: Tenant, config: TenantCuratedCatalogConfig) {
  if (config.featuredCuratedCatalogIds.includes(catalog.id)) return "featured curated catalogs";
  if (catalog.tenantId === tenant.id) return "tenant owned curated catalog";
  if (config.allowedCuratedCatalogIds.includes(catalog.id)) return "tenant curated catalog allow rule";
  if (catalog.segmentIds.some((segmentId) => config.allowedSegmentIds.includes(segmentId))) return "tenant curated segment allow rule";
  if (config.inheritsGlobalCuratedCatalogs && catalog.ownerScope === "global") return "inherits global curated catalogs";
  return "tenant curated catalog resolution";
}

function explainTenantCuratedCatalogExclusion(catalog: CuratedCatalog, config: TenantCuratedCatalogConfig) {
  if (config.blockedCuratedCatalogIds.includes(catalog.id)) return "blocked curated catalogs";
  if (catalog.segmentIds.some((segmentId) => config.blockedSegmentIds.includes(segmentId))) return "blocked catalog segment";
  if (!config.allowsFederatedCuratedCatalogs && catalog.allowsFederatedAssets) return "federated curated catalog blocked";
  return "tenant curated catalog rule excluded this catalog";
}

function resolveTenantCuratedItem(
  resolvedItem: CuratedCatalogResolvedItem,
  tenant: Tenant,
  catalogResolution: TenantCatalogResolution,
  config: TenantCuratedCatalogConfig
): TenantCuratedCatalogItem {
  const item = resolvedItem.item;
  const productCollectionId = item.productId ? resolvedItem.product?.collectionId : undefined;
  const visibleByProduct = item.productId ? catalogResolution.includedProductIds.includes(item.productId) : true;
  const visibleCollectionId = item.externalCollectionId ?? item.collectionId ?? productCollectionId;
  const visibleByCollection = visibleCollectionId
    ? [...catalogResolution.includedCollectionIds, ...catalogResolution.includedExternalCollectionIds].includes(visibleCollectionId)
    : true;
  const visibleByFederation = item.isFederated ? config.allowsFederatedCuratedCatalogs : true;
  const canDisplay = item.canDisplay && visibleByProduct && visibleByCollection && visibleByFederation;
  const exclusionReason = !visibleByProduct
    ? explainTenantCatalogExclusion(tenant.id, item.productId ?? item.id)
    : !visibleByCollection
      ? explainTenantCatalogExclusion(tenant.id, visibleCollectionId ?? item.id)
      : !visibleByFederation
        ? "federated curated catalog blocked"
        : undefined;

  return {
    itemId: item.id,
    catalogId: item.catalogId,
    tenantId: tenant.id,
    itemType: item.itemType,
    productId: item.productId,
    collectionId: item.collectionId,
    externalCollectionId: item.externalCollectionId,
    inclusionReason: canDisplay ? explainTenantCatalogInclusion(tenant.id, item.productId ?? item.collectionId ?? item.externalCollectionId ?? item.id) : undefined,
    exclusionReason,
    canDisplay,
    isFeatured: item.isFeatured,
    isFederated: item.isFederated,
    warnings: canDisplay ? [...item.warnings] : [...item.warnings, "Tenant catalog isolation excluded this curated catalog item."],
    disclaimers: [
      ...item.disclaimers,
      "tenant catalog isolation is applied before tenant curated catalog display.",
      "Tenant Curated Catalog item does not enable revenue sharing, settlement, billing, Marketplace Intelligence or Distribution Network."
    ]
  };
}

export function resolveTenantCuratedCatalogs(tenantIdOrSlug?: string) {
  const { tenant, resolution: catalogResolution } = resolveTenantCatalog(tenantIdOrSlug);
  const config = getTenantCuratedCatalogConfig(tenant.id);
  const appliedRules = [...config.rules].sort((left, right) => left.priority - right.priority || left.id.localeCompare(right.id));
  const includedCatalogs = curatedCatalogs.filter((catalog) => catalogMatchesTenantCuratedConfig(catalog, tenant, config));
  const excludedCatalogs = curatedCatalogs.filter((catalog) => !includedCatalogs.includes(catalog));
  const tenantCuratedCatalogs = includedCatalogs.map((catalog) => {
    const catalogView = resolveCuratedCatalog(catalog.id)!;
    const resolvedItems = catalogView.items.map((item) => resolveTenantCuratedItem(item, tenant, catalogResolution, config));
    const visibleItems = resolvedItems.filter((item) => item.canDisplay);
    const excludedItems = resolvedItems.filter((item) => !item.canDisplay);

    return {
      catalog: catalogView,
      inclusionReason: explainTenantCuratedCatalogInclusion(catalog, tenant, config),
      isInherited: config.inheritsGlobalCuratedCatalogs && catalog.ownerScope === "global" && catalog.tenantId !== tenant.id,
      isTenantOwned: catalog.tenantId === tenant.id,
      isFeatured: config.featuredCuratedCatalogIds.includes(catalog.id),
      visibleItems,
      excludedItems,
      appliedRules,
      boundaryNotes: [
        ...config.warnings,
        ...config.disclaimers,
        ...catalogView.boundaryNotes,
        "Tenant Curated Catalog resolution is mock/config-first.",
        "Tenant branding/theme and mock/read-only domain routing are preserved by Tenant Context.",
        "No revenue sharing, no settlement, no billing, no marketplace intelligence and no distribution network are active."
      ]
    } satisfies TenantCuratedCatalogView;
  });

  const resolution: TenantCuratedCatalogResolution = {
    tenantId: tenant.id,
    resolvedAt: new Date(0).toISOString(),
    includedCatalogIds: includedCatalogs.map((catalog) => catalog.id),
    excludedCatalogIds: excludedCatalogs.map((catalog) => catalog.id),
    featuredCatalogIds: config.featuredCuratedCatalogIds.filter((id) => includedCatalogs.some((catalog) => catalog.id === id)),
    appliedRules,
    includedItems: tenantCuratedCatalogs.flatMap((view) => view.visibleItems),
    excludedItems: [
      ...tenantCuratedCatalogs.flatMap((view) => view.excludedItems),
      ...excludedCatalogs.map((catalog) => ({
        itemId: `excluded-${catalog.id}`,
        catalogId: catalog.id,
        tenantId: tenant.id,
        itemType: "product" as const,
        exclusionReason: explainTenantCuratedCatalogExclusion(catalog, config),
        canDisplay: false,
        isFeatured: false,
        isFederated: catalog.allowsFederatedAssets,
        warnings: ["Curated catalog excluded by Tenant Curated Catalog config."],
        disclaimers: ["Excluded Tenant Curated Catalog does not create RBAC, billing, settlement, revenue sharing or Distribution Network behavior."]
      }))
    ],
    warnings: [...config.warnings],
    disclaimers: [
      ...config.disclaimers,
      "Tenant Curated Catalog resolution applies Tenant Catalog isolation to curated catalog items.",
      "No revenue sharing, no settlement, no billing, no marketplace intelligence and no distribution network are active."
    ]
  };

  return { tenant, config, resolution, tenantCuratedCatalogs };
}

export function resolveTenantContext(idOrSlug?: string): TenantContextView {
  const routingContext = resolveTenantRoutingContext(idOrSlug);
  const tenant = routingContext.tenant;
  const branding = resolveTenantBranding(tenant.slug);
  const catalog = getTenantCatalog(tenant.id);
  const catalogResolution = applyTenantCatalogRules(tenant, catalog);
  const tenantCurated = resolveTenantCuratedCatalogs(tenant.id);
  const referencedProducts = products.filter((product) => catalogResolution.includedProductIds.includes(product.id));
  const referencedCollections = listCollections().filter((view) =>
    [...catalogResolution.includedCollectionIds, ...catalogResolution.includedExternalCollectionIds].includes(view.collection.id)
  );

  return {
    tenant,
    routingContext,
    catalog,
    catalogResolution,
    curatedCatalogResolution: tenantCurated.resolution,
    tenantCuratedCatalogs: tenantCurated.tenantCuratedCatalogs,
    isGlobalMarketplace: tenant.tenantType === "global",
    branding: branding.branding,
    theme: branding.theme,
    usesGlobalBrandingFallback: branding.usesGlobalBrandingFallback,
    referencedProducts,
    referencedCollections,
    enabledSections: tenant.configuration.enabledSections,
    executionBoundaries: [
      "Tenant Registry is mock/config-first and does not create production tenant routing.",
      "Tenant Identity is display metadata only with no RBAC, authentication or KYC.",
      "Tenant Configuration can resolve mock/config-first catalog isolation without production permissions.",
      tenant.configuration.canTrade ? "Tenant trade flag is inherited from existing mock commerce previews only." : "Tenant trading is disabled for productive execution.",
      tenant.configuration.canSettle ? "Unexpected settlement flag enabled." : "No settlement, tenant billing or treasury routing is active.",
      tenant.configuration.canRouteCustomDomain ? "Unexpected custom domain routing flag enabled." : "No custom DNS, real subdomain routing or separate tenant deploy is active."
    ]
  };
}

function getCollectionViewById(collectionId?: string) {
  if (!collectionId) return null;
  return listCollections().find((view) => view.collection.id === collectionId) ?? null;
}

function getCuratedCatalogItemTargetId(item: CuratedCatalogItem) {
  return item.productId ?? item.collectionId ?? item.externalCollectionId ?? item.id;
}

function getEditorialRulesForItem(catalog: CuratedCatalog, item: CuratedCatalogItem) {
  const targetId = getCuratedCatalogItemTargetId(item);
  return catalog.editorialRules
    .filter((rule) => rule.targetId === targetId || rule.sectionId === item.sectionId)
    .sort((left, right) => left.priority - right.priority || left.id.localeCompare(right.id));
}

function resolveCuratedCatalogItem(catalog: CuratedCatalog, item: CuratedCatalogItem): CuratedCatalogResolvedItem {
  const product = item.productId ? products.find((record) => record.id === item.productId) : undefined;
  const collectionId = item.externalCollectionId ?? item.collectionId ?? product?.collectionId;
  const collection = getCollectionViewById(collectionId) ?? undefined;
  const trustBoundary = collection?.boundaries;
  const external = Boolean(collection && isExternalCollection(collection.collection));
  const editorialRules = getEditorialRulesForItem(catalog, item);
  const reviewStatus = editorialRules[0]?.reviewStatus ?? item.editorialStatus;
  const governanceLabel = editorialRules[0]?.governanceLabel ?? item.governanceLabel;
  const boundaryNotes = [
    `Curation Workflow status: ${item.reviewState}; review status: ${reviewStatus}; governance label: ${governanceLabel}.`,
    ...item.warnings,
    ...item.disclaimers,
    ...editorialRules.flatMap((rule) => [...rule.warnings, ...rule.disclaimers]),
    ...(trustBoundary?.notes ?? []),
    external
      ? "Curated Catalog preserves origin, provider, validation status, provenance, risk classification and trust boundaries for federated assets."
      : "Curated Catalog item references existing native mock records without duplicating product truth.",
    "approved-mock does not mean productive approval, compliance real, certification real or financial/commercial recommendation.",
    "mock curation / config-first curation / no ranking real / no marketplace intelligence / no revenue sharing / no settlement / no billing"
  ];

  return {
    item: {
      ...item,
      isExternal: external || item.isExternal,
      isFederated: external || item.isFederated,
      isNative: !external && item.isNative,
      canDisplay: item.canDisplay && trustBoundary?.canDisplay !== false,
      canTrade: false,
      canSettle: false
    },
    product,
    collection,
    editorialRules,
    curationReasons: {
      inclusionReason: item.inclusionReason,
      exclusionReason: item.exclusionReason,
      reviewStatus,
      governanceLabel
    },
    trustBoundary,
    boundaryNotes
  };
}

export function resolveCuratedCatalogItems(catalogIdOrSlug: string) {
  const catalog = getCuratedCatalogById(catalogIdOrSlug) ?? getCuratedCatalogBySlug(catalogIdOrSlug);
  if (!catalog) return [];
  return catalog.items.map((item) => resolveCuratedCatalogItem(catalog, item));
}

function buildCuratedCatalogView(catalog: CuratedCatalog): CuratedCatalogView {
  const items = catalog.items.map((item) => resolveCuratedCatalogItem(catalog, item));
  const sections = catalog.sections
    .slice()
    .sort((left, right) => left.position - right.position || left.id.localeCompare(right.id))
    .map((section) => ({
      section,
      items: items.filter((item) => item.item.sectionId === section.id)
    }));
  const featuredProducts = products.filter((product) => catalog.featuredProductIds.includes(product.id));
  const featuredCollections = listCollections().filter((view) => catalog.featuredCollectionIds.includes(view.collection.id));

  return {
    catalog,
    sections,
    items,
    editorialRules: catalog.editorialRules,
    workflowSummary: {
      state: catalog.curationWorkflow.state,
      reviewStatus: catalog.curationWorkflow.reviewStatus,
      governanceLabel: catalog.curationWorkflow.governanceLabel,
      notes: catalog.curationWorkflow.notes.map((note) => `${note.noteType}: ${note.note}`),
      warnings: catalog.curationWorkflow.warnings,
      disclaimers: catalog.curationWorkflow.disclaimers
    },
    featuredProducts,
    featuredCollections,
    boundaryNotes: [
      ...catalog.warnings,
      ...catalog.disclaimers,
      "Curated Catalog is mock/config-first curation only.",
      "No ranking real, no recommendation engine, no marketplace intelligence, no approval workflow, no billing and no settlement are active."
    ]
  };
}

export function listCuratedCatalogs() {
  return curatedCatalogs.map(buildCuratedCatalogView);
}

function buildFeaturedCatalogView(featured: FeaturedCatalog): FeaturedCatalogView {
  const catalog = resolveCuratedCatalog(featured.catalogId);
  const segment = catalogSegments.find((item) => item.id === featured.segmentId) ?? null;

  return {
    featured,
    catalog,
    segment,
    boundaryNotes: [
      ...featured.warnings,
      ...featured.disclaimers,
      ...(segment?.warnings ?? []),
      ...(segment?.disclaimers ?? []),
      "Featured Catalog is manual mock/config-first editorial placement.",
      "Featured does not mean ranking real, performance real, recommendation engine, marketplace intelligence, analytics real, scoring real, distribution, revenue sharing, billing or settlement."
    ]
  };
}

function buildCatalogSegmentView(segment: CatalogSegment): CatalogSegmentView {
  const featuredViews = featuredCatalogs
    .filter((featured) => featured.segmentId === segment.id)
    .sort((left, right) => left.position - right.position || left.id.localeCompare(right.id))
    .map(buildFeaturedCatalogView);

  return {
    segment,
    featuredCatalogs: featuredViews,
    catalogs: featuredViews.map((view) => view.catalog).filter((catalog): catalog is CuratedCatalogView => Boolean(catalog)),
    boundaryNotes: [
      ...segment.warnings,
      ...segment.disclaimers,
      "Catalog Segment is mock/config-first grouping only.",
      "Catalog Segment does not activate automatic segmentation, real analytics, Marketplace Intelligence, recommendation engine, ranking real, billing or settlement."
    ]
  };
}

export function listFeaturedCatalogs() {
  return featuredCatalogs
    .slice()
    .sort((left, right) => left.position - right.position || left.id.localeCompare(right.id))
    .map(buildFeaturedCatalogView);
}

export function listCatalogSegments() {
  return catalogSegments.map(buildCatalogSegmentView);
}

export function getCatalogSegmentBySlug(slug: string) {
  const segment = catalogSegments.find((item) => item.slug === slug || item.id === slug);
  return segment ? buildCatalogSegmentView(segment) : null;
}

export function listCatalogsBySegment(segmentIdOrSlug: string) {
  const segment = getCatalogSegmentBySlug(segmentIdOrSlug);
  return segment?.catalogs ?? [];
}

export function listEditorialRules(catalogIdOrSlug?: string) {
  if (!catalogIdOrSlug) return curatedCatalogs.flatMap((catalog) => catalog.editorialRules);
  const catalog = getCuratedCatalogById(catalogIdOrSlug) ?? getCuratedCatalogBySlug(catalogIdOrSlug);
  return catalog?.editorialRules ?? [];
}

export function explainEditorialRules(catalogIdOrSlug: string) {
  const catalog = getCuratedCatalogById(catalogIdOrSlug) ?? getCuratedCatalogBySlug(catalogIdOrSlug);
  if (!catalog) return [];

  return catalog.editorialRules.map((rule) => ({
    rule,
    inclusionReason: rule.effect === "include" || rule.effect === "feature" ? rule.reason : undefined,
    exclusionReason: rule.effect === "exclude" || rule.effect === "restrict" ? rule.reason : undefined,
    reviewStatus: rule.reviewStatus,
    governanceLabel: rule.governanceLabel,
    boundaryNote: "Editorial Rule is mock/config-first; no productive approval workflow, no compliance real, no certification real, no ranking real and no marketplace intelligence are active."
  }));
}

export function getCuratedCatalogById(catalogId: string) {
  return curatedCatalogs.find((catalog) => catalog.id === catalogId) ?? null;
}

export function getCuratedCatalogBySlug(slug: string) {
  return curatedCatalogs.find((catalog) => catalog.slug === slug) ?? null;
}

export function resolveCuratedCatalog(catalogIdOrSlug: string) {
  const catalog = getCuratedCatalogById(catalogIdOrSlug) ?? getCuratedCatalogBySlug(catalogIdOrSlug);
  return catalog ? buildCuratedCatalogView(catalog) : null;
}

function getDistributionChannelByIdOrSlug(channelIdOrSlug: string) {
  const key = channelIdOrSlug.toLowerCase();
  return distributionChannels.find((channel) => channel.id.toLowerCase() === key || channel.slug.toLowerCase() === key) ?? null;
}

function getDistributionNetworkByIdOrSlug(networkIdOrSlug: string) {
  const key = networkIdOrSlug.toLowerCase();
  return distributionNetworks.find((network) => network.id.toLowerCase() === key || network.slug.toLowerCase() === key) ?? null;
}

function getDistributionTargetLabel(placement: DistributionPlacement) {
  if (placement.targetType === "product") {
    return products.find((product) => product.id === placement.targetId)?.title ?? placement.targetId;
  }
  if (placement.targetType === "collection" || placement.targetType === "external-collection") {
    return collections.find((collection) => collection.id === placement.targetId)?.name ?? placement.targetId;
  }
  if (placement.targetType === "curated-catalog") {
    return curatedCatalogs.find((catalog) => catalog.id === placement.targetId)?.displayName ?? placement.targetId;
  }
  if (placement.targetType === "catalog-segment") {
    return catalogSegments.find((segment) => segment.id === placement.targetId)?.displayName ?? placement.targetId;
  }
  if (placement.targetType === "tenant") {
    return tenants.find((tenant) => tenant.id === placement.targetId)?.displayName ?? placement.targetId;
  }
  return placement.targetId;
}

function buildDistributionPlacementView(placement: DistributionPlacement): DistributionPlacementView {
  const product = placement.targetType === "product" ? products.find((item) => item.id === placement.targetId) : undefined;
  const collection =
    placement.targetType === "collection" || placement.targetType === "external-collection"
      ? collections.find((item) => item.id === placement.targetId)
      : undefined;
  const curatedCatalog =
    placement.targetType === "curated-catalog" ? resolveCuratedCatalog(placement.targetId) ?? undefined : undefined;
  const segment = placement.targetType === "catalog-segment" ? catalogSegments.find((item) => item.id === placement.targetId) : undefined;
  const tenant = placement.tenantId ? getTenantById(placement.tenantId) ?? undefined : undefined;
  const collectionBoundary = collection?.trustBoundary;

  return {
    placement,
    targetLabel: getDistributionTargetLabel(placement),
    targetKind: placement.targetType,
    product,
    collection,
    curatedCatalog,
    segment,
    tenant,
    boundaryNotes: [
      ...placement.warnings,
      ...placement.disclaimers,
      ...(collectionBoundary?.notes ?? []),
      "Distribution Placement is mock/config-first and does not execute referral tracking, campaign tracking, commission, payout, billing, settlement or revenue sharing."
    ]
  };
}

function buildDistributionChannelView(channel: DistributionChannel): DistributionChannelView {
  const tenant = channel.tenantId ? getTenantById(channel.tenantId) ?? undefined : undefined;
  const placements = distributionPlacements
    .filter((placement) => channel.placementIds.includes(placement.id) || placement.channelId === channel.id)
    .sort((left, right) => left.position - right.position || left.id.localeCompare(right.id))
    .map(buildDistributionPlacementView);
  const allowedCuratedCatalogs = channel.allowedCuratedCatalogIds
    .map((catalogId) => resolveCuratedCatalog(catalogId))
    .filter((catalog): catalog is CuratedCatalogView => Boolean(catalog));
  const allowedSegments = channel.allowedSegmentIds
    .map((segmentId) => catalogSegments.find((segment) => segment.id === segmentId || segment.slug === segmentId))
    .filter((segment): segment is CatalogSegment => Boolean(segment));
  const allowedProducts = channel.allowedProductIds
    .map((productId) => products.find((product) => product.id === productId))
    .filter((product): product is Product => Boolean(product));
  const blockedProducts = channel.blockedProductIds
    .map((productId) => products.find((product) => product.id === productId))
    .filter((product): product is Product => Boolean(product));
  const allowedCollections = channel.allowedCollectionIds
    .map((collectionId) => collections.find((collection) => collection.id === collectionId))
    .filter((collection): collection is MarketplaceCollection => Boolean(collection));
  const blockedCollections = channel.blockedCollectionIds
    .map((collectionId) => collections.find((collection) => collection.id === collectionId))
    .filter((collection): collection is MarketplaceCollection => Boolean(collection));
  const federationNotes = allowedCollections.flatMap((collection) => collection.trustBoundary?.notes ?? []);

  return {
    channel,
    tenant,
    placements,
    allowedCuratedCatalogs,
    allowedSegments,
    allowedProducts,
    allowedCollections,
    blockedProducts,
    blockedCollections,
    boundaryNotes: [
      ...channel.warnings,
      ...channel.disclaimers,
      ...channel.commercialOrigin.warnings,
      ...channel.commercialOrigin.disclaimers,
      ...channel.attributionSource.warnings,
      ...channel.attributionSource.disclaimers,
      ...channel.distributionSource.warnings,
      ...channel.distributionSource.disclaimers,
      ...federationNotes,
      "Distribution Channel is mock/config-first; canTrack=false, canAttributeRevenue=false and canSettle=false.",
      "Commercial Origin does not mean settlement, payout, billing, commission or revenue sharing.",
      "Attribution Source does not mean affiliate tracking real, cookie tracking, analytics tracking, Marketplace Intelligence or BI."
    ]
  };
}

function buildDistributionNetworkView(network: DistributionNetwork): DistributionNetworkView {
  const channels = network.channelIds
    .map((channelId) => getDistributionChannelByIdOrSlug(channelId))
    .filter((channel): channel is DistributionChannel => Boolean(channel))
    .map(buildDistributionChannelView);
  const defaultChannel = channels.find((view) => view.channel.id === network.defaultChannelId) ?? channels[0] ?? null;

  return {
    network,
    channels,
    defaultChannel,
    boundaryNotes: [
      ...network.warnings,
      ...network.disclaimers,
      "Distribution Network is a mock/config-first read model only.",
      "No revenue sharing, no settlement, no billing, no payout, no commission, no tracking real, no Marketplace Intelligence, no backend, no API, no database, no analytics and no BI are active."
    ]
  };
}

export function listDistributionNetworks() {
  return distributionNetworks.map(buildDistributionNetworkView);
}

export function getDistributionNetworkById(networkIdOrSlug: string) {
  const network = getDistributionNetworkByIdOrSlug(networkIdOrSlug);
  return network ? buildDistributionNetworkView(network) : null;
}

export function listDistributionChannels() {
  return distributionChannels.map(buildDistributionChannelView);
}

export function getDistributionChannelById(channelIdOrSlug: string) {
  const channel = getDistributionChannelByIdOrSlug(channelIdOrSlug);
  return channel ? buildDistributionChannelView(channel) : null;
}

export function resolveDistributionContext(channelIdOrSlug?: string) {
  const network = buildDistributionNetworkView(distributionNetworks[0]);
  const requestedChannel = channelIdOrSlug ? getDistributionChannelById(channelIdOrSlug) : null;
  const channel = requestedChannel ?? network.defaultChannel ?? listDistributionChannels()[0];

  return {
    network,
    channel,
    isFallback: !requestedChannel,
    boundaryNotes: [
      ...network.boundaryNotes,
      ...channel.boundaryNotes,
      "Distribution Context resolution never creates partner onboarding, commission, payout, billing, settlement, tracking real or revenue sharing."
    ]
  };
}

function getDistributionProfileByIdOrSlug(profileIdOrSlug: string) {
  const key = profileIdOrSlug.toLowerCase();
  return distributionProfiles.find((profile) => profile.id.toLowerCase() === key || profile.slug.toLowerCase() === key) ?? null;
}

function getDistributionProfileRelationshipLabel(profile: DistributionProfile, relationshipId: string) {
  const relationship = profile.relationships.find((entry) => entry.id === relationshipId);
  if (!relationship) {
    return relationshipId;
  }

  if (relationship.targetType === "distribution-channel") {
    return getDistributionChannelById(relationship.targetId)?.channel.displayName ?? relationship.targetId;
  }
  if (relationship.targetType === "tenant") {
    return getTenantById(relationship.targetId)?.displayName ?? relationship.targetId;
  }
  if (relationship.targetType === "curated-catalog") {
    return resolveCuratedCatalog(relationship.targetId)?.catalog.displayName ?? relationship.targetId;
  }
  if (relationship.targetType === "catalog-segment") {
    return catalogSegments.find((segment) => segment.id === relationship.targetId || segment.slug === relationship.targetId)?.displayName ?? relationship.targetId;
  }
  if (relationship.targetType === "community") {
    return relationship.targetId;
  }

  return relationship.targetId;
}

function buildDistributionProfileView(profile: DistributionProfile): DistributionProfileView {
  const channels = profile.channelIds
    .map((channelId) => getDistributionChannelById(channelId))
    .filter((channel): channel is DistributionChannelView => Boolean(channel));
  const tenantsForProfile = profile.tenantIds
    .map((tenantId) => getTenantById(tenantId))
    .filter((tenant): tenant is Tenant => Boolean(tenant));
  const curatedCatalogsForProfile = profile.curatedCatalogIds
    .map((catalogId) => resolveCuratedCatalog(catalogId))
    .filter((catalog): catalog is CuratedCatalogView => Boolean(catalog));
  const segmentsForProfile = profile.catalogSegmentIds
    .map((segmentId) => catalogSegments.find((segment) => segment.id === segmentId || segment.slug === segmentId))
    .filter((segment): segment is CatalogSegment => Boolean(segment));
  const relationshipLabels = profile.relationships.map((relationship) => `${relationship.relationshipType}: ${getDistributionProfileRelationshipLabel(profile, relationship.id)}`);

  return {
    profile,
    channels,
    tenants: tenantsForProfile,
    curatedCatalogs: curatedCatalogsForProfile,
    segments: segmentsForProfile,
    relationshipLabels,
    boundaryNotes: [
      ...profile.warnings,
      ...profile.disclaimers,
      ...profile.relationships.flatMap((relationship) => [...relationship.warnings, ...relationship.disclaimers]),
      ...channels.flatMap((channel) => channel.boundaryNotes),
      "Distribution Profile is mock/config-first and is not a Seller Profile, Tenant Identity or Federation Provider.",
      "Distribution Profile does not mean KYC real, onboarding real, commercial contract real, commission, payout, settlement, billing, revenue sharing or tracking real.",
      "Associated channels, tenants, curated catalogs and segments are references only and do not duplicate product, tenant or provider truth."
    ]
  };
}

export function listDistributionProfiles() {
  return distributionProfiles.map(buildDistributionProfileView);
}

export function getDistributionProfileById(profileIdOrSlug: string) {
  const profile = getDistributionProfileByIdOrSlug(profileIdOrSlug);
  return profile ? buildDistributionProfileView(profile) : null;
}

export function getDistributionProfileBySlug(profileSlug: string) {
  const profile = distributionProfiles.find((entry) => entry.slug === profileSlug) ?? null;
  return profile ? buildDistributionProfileView(profile) : null;
}

export function getDistributionProfilesByType(profileType: DistributionProfile["profileType"]) {
  return distributionProfiles.filter((profile) => profile.profileType === profileType).map(buildDistributionProfileView);
}

export function getDistributionProfilesByChannel(channelIdOrSlug: string) {
  const channel = getDistributionChannelByIdOrSlug(channelIdOrSlug);
  if (!channel) {
    return [];
  }
  return distributionProfiles.filter((profile) => profile.channelIds.includes(channel.id)).map(buildDistributionProfileView);
}

export function getDistributionProfileChannels(profileIdOrSlug: string) {
  return getDistributionProfileById(profileIdOrSlug)?.channels ?? [];
}

export function getDistributionProfileTenants(profileIdOrSlug: string) {
  return getDistributionProfileById(profileIdOrSlug)?.tenants ?? [];
}

export function getDistributionProfileCuratedCatalogs(profileIdOrSlug: string) {
  return getDistributionProfileById(profileIdOrSlug)?.curatedCatalogs ?? [];
}

export function resolveDistributionProfileContext(profileIdOrSlug?: string) {
  const requestedProfile = profileIdOrSlug ? getDistributionProfileById(profileIdOrSlug) : null;
  const profile = requestedProfile ?? listDistributionProfiles().find((view) => view.profile.status !== "disabled") ?? listDistributionProfiles()[0];

  return {
    profile,
    isFallback: !requestedProfile,
    boundaryNotes: [
      ...profile.boundaryNotes,
      "Distribution Profile Context resolution never creates KYC real, partner onboarding real, commercial contract real, commission, payout, billing, settlement, tracking real or revenue sharing."
    ]
  };
}

function getAttributionSourceByIdOrSlug(sourceIdOrSlug: string) {
  const key = sourceIdOrSlug.toLowerCase();
  return attributionSources.find((source) => source.id.toLowerCase() === key || source.slug.toLowerCase() === key) ?? null;
}

function buildAttributionContext(source: AttributionSourceRecord): AttributionContext {
  return {
    sourceId: source.id,
    resolvedAt: "2026-06-15T11:30:00.000Z",
    sourceType: source.sourceType,
    trackingMode: source.trackingMode,
    channelId: source.channelId,
    profileId: source.profileId,
    tenantId: source.tenantId,
    catalogId: source.catalogId,
    curatedCatalogId: source.curatedCatalogId,
    segmentId: source.segmentId,
    placementId: source.placementId,
    commercialOriginLabel: source.commercialOrigin.originLabel,
    isSimulated: source.isSimulated,
    canTrack: source.canTrack,
    canAttributeRevenue: source.canAttributeRevenue,
    canTriggerPayout: source.canTriggerPayout,
    canSettle: source.canSettle,
    warnings: [
      ...source.warnings,
      ...source.commercialOrigin.warnings,
      ...source.distributionSource.warnings,
      ...source.attributionNotes.flatMap((note) => note.warnings)
    ],
    disclaimers: [
      ...source.disclaimers,
      ...source.commercialOrigin.disclaimers,
      ...source.distributionSource.disclaimers,
      ...source.attributionNotes.flatMap((note) => note.disclaimers),
      "Attribution Context is mock/config-first and cannot track users, cookies, revenue, commissions, payout, billing, settlement or revenue sharing."
    ]
  };
}

function getAttributionToSplitRulesForSource(sourceId: string) {
  return attributionToSplitRules.filter((rule) => rule.attributionSourceId === sourceId).sort((left, right) => left.priority - right.priority);
}

function getAttributionRuleParticipantShares(rule: AttributionToSplitRule) {
  return participantShares.filter(
    (share) =>
      share.policyId === rule.targetPolicyId &&
      share.commissionModelId === rule.targetCommissionModelId &&
      share.participantId === rule.targetParticipantId
  );
}

function buildAttributionSplitExplanation(rule: AttributionToSplitRule): AttributionSplitExplanation {
  const shares = getAttributionRuleParticipantShares(rule);
  return {
    ruleId: rule.id,
    ruleName: rule.name,
    reason: rule.reason,
    attributionSourceId: rule.attributionSourceId,
    distributionSourceId: rule.distributionSourceId,
    commercialOriginId: rule.commercialOriginId,
    targetPolicyId: rule.targetPolicyId,
    targetCommissionModelId: rule.targetCommissionModelId,
    targetParticipantId: rule.targetParticipantId,
    participantShareIds: shares.map((share) => share.id),
    suggestedShareLabel: `${rule.suggestedShareValue}% ${rule.suggestedShareType} simulated split`,
    status: rule.status,
    priority: rule.priority,
    boundaryNotes: Array.from(
      new Set([
        ...rule.warnings,
        ...rule.disclaimers,
        ...shares.flatMap((share) => [...share.warnings, ...share.disclaimers]),
        "Attribution-to-Split is mock/config-first and simulated split only.",
        "Commercial Origin Split Mapping and Distribution Source Split Mapping do not create attribution financeira real, commission tracking, payout, settlement, billing, analytics tracking, BI or Marketplace Intelligence."
      ])
    )
  };
}

function resolveAttributionSplitForSource(source: AttributionSourceRecord): AttributionSplitResolution {
  const rules = getAttributionToSplitRulesForSource(source.id);
  const appliedRules = rules.filter((rule) => rule.status !== "blocked" && rule.status !== "disabled");
  const blockedRules = rules.filter((rule) => rule.status === "blocked" || rule.status === "disabled");
  const participantShareIds = appliedRules.flatMap((rule) => getAttributionRuleParticipantShares(rule).map((share) => share.id));
  const firstAppliedRule = appliedRules[0];

  return {
    attributionSourceId: source.id,
    resolvedAt: "2026-06-16T11:30:00.000Z",
    policyId: firstAppliedRule?.targetPolicyId,
    commissionModelId: firstAppliedRule?.targetCommissionModelId,
    participantShareIds: Array.from(new Set(participantShareIds)),
    appliedRuleIds: appliedRules.map((rule) => rule.id),
    blockedRuleIds: blockedRules.map((rule) => rule.id),
    warnings: Array.from(
      new Set([
        ...source.warnings,
        ...rules.flatMap((rule) => rule.warnings),
        ...(rules.length ? [] : ["No Attribution-to-Split Rule is configured for this Attribution Source."]),
        ...(blockedRules.length ? ["One or more Attribution-to-Split Rules are blocked because tracking real or commission tracking is unavailable."] : [])
      ])
    ),
    disclaimers: Array.from(
      new Set([
        ...source.disclaimers,
        ...rules.flatMap((rule) => rule.disclaimers),
        "Attribution Split Resolution is simulated split only and cannot track, attribute revenue, settle or trigger payout.",
        "No tracking real, no commission tracking, no payout, no settlement, no billing, no analytics tracking, no BI and no Marketplace Intelligence are active."
      ])
    ),
    canTrack: false,
    canAttributeRevenue: false,
    canSettle: false,
    canTriggerPayout: false
  };
}

function buildAttributionToSplitRuleView(rule: AttributionToSplitRule): AttributionToSplitRuleView {
  const attributionSource = getAttributionSourceById(rule.attributionSourceId);
  const targetPolicy = getRevenueSharingPolicyById(rule.targetPolicyId);
  const targetCommissionModel = getCommissionModelById(rule.targetCommissionModelId);
  const participantSharesForRule = getAttributionRuleParticipantShares(rule);
  const explanation = buildAttributionSplitExplanation(rule);

  return {
    rule,
    attributionSource,
    targetPolicy,
    targetCommissionModel,
    participantShares: participantSharesForRule,
    explanation,
    boundaryNotes: Array.from(
      new Set([
        ...rule.warnings,
        ...rule.disclaimers,
        ...explanation.boundaryNotes,
        ...(targetPolicy?.boundaryNotes ?? []),
        ...(targetCommissionModel?.boundaryNotes ?? []),
        "Attribution-to-Split Rule is simulated split only and does not perform tracking real, commission tracking, payout, settlement or billing."
      ])
    )
  };
}

function buildAttributionSourceView(source: AttributionSourceRecord): AttributionSourceView {
  const channel = source.channelId ? getDistributionChannelById(source.channelId) ?? undefined : undefined;
  const profile = source.profileId ? getDistributionProfileById(source.profileId) ?? undefined : undefined;
  const tenant = source.tenantId ? getTenantById(source.tenantId) ?? undefined : undefined;
  const curatedCatalog = source.curatedCatalogId ? resolveCuratedCatalog(source.curatedCatalogId) ?? undefined : undefined;
  const segment = source.segmentId ? catalogSegments.find((item) => item.id === source.segmentId || item.slug === source.segmentId) : undefined;
  const placement = source.placementId
    ? distributionPlacements.find((item) => item.id === source.placementId)
    : undefined;
  const placementView = placement ? buildDistributionPlacementView(placement) : undefined;
  const context = buildAttributionContext(source);
  const attributionSplitResolution = resolveAttributionSplitForSource(source);
  const attributionSplitExplanations = getAttributionToSplitRulesForSource(source.id).map(buildAttributionSplitExplanation);

  return {
    source,
    context,
    attributionSplitResolution,
    attributionSplitExplanations,
    channel,
    profile,
    tenant,
    curatedCatalog,
    segment,
    placement: placementView,
    noteLabels: source.attributionNotes.map((note) => `${note.noteType}: ${note.title}`),
    boundaryNotes: [
      ...context.warnings,
      ...context.disclaimers,
      ...(channel?.boundaryNotes ?? []),
      ...(profile?.boundaryNotes ?? []),
      ...(placementView?.boundaryNotes ?? []),
      ...attributionSplitResolution.warnings,
      ...attributionSplitResolution.disclaimers,
      ...attributionSplitExplanations.flatMap((explanation) => explanation.boundaryNotes),
      "Attribution Source is not tracking real, cookie tracking, analytics tracking, commission tracking, payout, settlement, billing, revenue sharing, Marketplace Intelligence or BI.",
      "Referral Source mock, Campaign Source mock and Placement Source mock are display descriptors only."
    ]
  };
}

export function listAttributionSources() {
  return attributionSources.map(buildAttributionSourceView);
}

export function getAttributionSourceById(sourceIdOrSlug: string) {
  const source = getAttributionSourceByIdOrSlug(sourceIdOrSlug);
  return source ? buildAttributionSourceView(source) : null;
}

export function getAttributionSourceBySlug(sourceSlug: string) {
  const source = attributionSources.find((entry) => entry.slug === sourceSlug) ?? null;
  return source ? buildAttributionSourceView(source) : null;
}

export function getAttributionSourcesByChannel(channelIdOrSlug: string) {
  const channel = getDistributionChannelByIdOrSlug(channelIdOrSlug);
  if (!channel) {
    return [];
  }
  return attributionSources.filter((source) => source.channelId === channel.id).map(buildAttributionSourceView);
}

export function getAttributionSourcesByProfile(profileIdOrSlug: string) {
  const profile = getDistributionProfileByIdOrSlug(profileIdOrSlug);
  if (!profile) {
    return [];
  }
  return attributionSources.filter((source) => source.profileId === profile.id).map(buildAttributionSourceView);
}

export function getAttributionSourcesByTenant(tenantIdOrSlug: string) {
  const tenant = getTenantById(tenantIdOrSlug) ?? getTenantBySlug(tenantIdOrSlug);
  if (!tenant) {
    return [];
  }
  return attributionSources.filter((source) => source.tenantId === tenant.id).map(buildAttributionSourceView);
}

export function getAttributionSourcesByCuratedCatalog(catalogIdOrSlug: string) {
  const catalog = resolveCuratedCatalog(catalogIdOrSlug);
  if (!catalog) {
    return [];
  }
  return attributionSources.filter((source) => source.curatedCatalogId === catalog.catalog.id).map(buildAttributionSourceView);
}

export function getAttributionSourcesBySegment(segmentIdOrSlug: string) {
  const segment = catalogSegments.find((item) => item.id === segmentIdOrSlug || item.slug === segmentIdOrSlug);
  if (!segment) {
    return [];
  }
  return attributionSources.filter((source) => source.segmentId === segment.id).map(buildAttributionSourceView);
}

export function getAttributionSourcesByPlacement(placementId: string) {
  return attributionSources.filter((source) => source.placementId === placementId).map(buildAttributionSourceView);
}

export function getCommercialOriginForAttribution(sourceIdOrSlug: string) {
  return getAttributionSourceById(sourceIdOrSlug)?.source.commercialOrigin ?? null;
}

export function getDistributionSourceForAttribution(sourceIdOrSlug: string) {
  return getAttributionSourceById(sourceIdOrSlug)?.source.distributionSource ?? null;
}

export function explainAttributionBoundary(sourceIdOrSlug: string) {
  const view = getAttributionSourceById(sourceIdOrSlug);
  if (!view) {
    return [];
  }
  return Array.from(new Set(view.boundaryNotes));
}

export function resolveAttributionContext(sourceIdOrSlug?: string) {
  const requestedSource = sourceIdOrSlug ? getAttributionSourceById(sourceIdOrSlug) : null;
  const source = requestedSource ?? listAttributionSources().find((view) => view.source.status !== "disabled") ?? listAttributionSources()[0];

  return {
    source,
    context: source.context,
    isFallback: !requestedSource,
    boundaryNotes: [
      ...source.boundaryNotes,
      "Attribution Context resolution never creates tracking real, cookies, analytics tracking, commission tracking, payout, settlement, billing, revenue sharing, Marketplace Intelligence or BI."
    ]
  };
}

export function listAttributionToSplitRules() {
  return attributionToSplitRules.map(buildAttributionToSplitRuleView);
}

export function listAttributionToSplitRulesByAttributionSource(sourceIdOrSlug: string) {
  const source = getAttributionSourceByIdOrSlug(sourceIdOrSlug);
  if (!source) return [];
  return getAttributionToSplitRulesForSource(source.id).map(buildAttributionToSplitRuleView);
}

export function listAttributionToSplitRulesByDistributionChannel(channelIdOrSlug: string) {
  const channel = getDistributionChannelByIdOrSlug(channelIdOrSlug);
  if (!channel) return [];
  return attributionToSplitRules.filter((rule) => rule.distributionChannelId === channel.id).map(buildAttributionToSplitRuleView);
}

export function listAttributionToSplitRulesByDistributionProfile(profileIdOrSlug: string) {
  const profile = getDistributionProfileByIdOrSlug(profileIdOrSlug);
  if (!profile) return [];
  return attributionToSplitRules.filter((rule) => rule.distributionProfileId === profile.id).map(buildAttributionToSplitRuleView);
}

export function listAttributionToSplitRulesByCommunityDistribution(distributionIdOrSlug: string) {
  const distribution = getCommunityDistributionByIdOrSlug(distributionIdOrSlug);
  if (!distribution) return [];
  return attributionToSplitRules.filter((rule) => rule.communityDistributionId === distribution.id).map(buildAttributionToSplitRuleView);
}

export function resolveAttributionSplit(sourceIdOrSlug: string) {
  const source = getAttributionSourceByIdOrSlug(sourceIdOrSlug);
  return source ? resolveAttributionSplitForSource(source) : null;
}

export function explainAttributionToSplit(sourceIdOrSlug: string) {
  const source = getAttributionSourceByIdOrSlug(sourceIdOrSlug);
  if (!source) return [];
  return getAttributionToSplitRulesForSource(source.id).map(buildAttributionSplitExplanation);
}

export function getAttributionSplitMapping(sourceIdOrSlug: string): AttributionSplitMapping[] {
  const source = getAttributionSourceByIdOrSlug(sourceIdOrSlug);
  if (!source) return [];
  return getAttributionToSplitRulesForSource(source.id).map((rule) => {
    const shares = getAttributionRuleParticipantShares(rule);
    return {
      ruleId: rule.id,
      attributionSourceId: rule.attributionSourceId,
      participantShareIds: shares.map((share) => share.id),
      targetPolicyId: rule.targetPolicyId,
      targetCommissionModelId: rule.targetCommissionModelId,
      targetParticipantId: rule.targetParticipantId,
      suggestedShareType: rule.suggestedShareType,
      suggestedShareValue: rule.suggestedShareValue,
      isSimulated: true,
      boundaryNotes: buildAttributionSplitExplanation(rule).boundaryNotes
    };
  });
}

export function getCommercialOriginSplitMapping(commercialOriginId: string): CommercialOriginSplitMapping | null {
  const rules = attributionToSplitRules.filter((rule) => rule.commercialOriginId === commercialOriginId);
  if (!rules.length) return null;
  const source = attributionSources.find((entry) => entry.id === rules[0].attributionSourceId);
  return {
    commercialOriginId,
    originLabel: source?.commercialOrigin.originLabel ?? commercialOriginId,
    appliedRuleIds: rules.filter((rule) => rule.status !== "blocked" && rule.status !== "disabled").map((rule) => rule.id),
    targetPolicyIds: Array.from(new Set(rules.map((rule) => rule.targetPolicyId))),
    isSimulated: true,
    boundaryNotes: Array.from(new Set(rules.flatMap((rule) => [...rule.warnings, ...rule.disclaimers])))
  };
}

export function getDistributionSourceSplitMapping(distributionSourceId: string): DistributionSourceSplitMapping | null {
  const rules = attributionToSplitRules.filter((rule) => rule.distributionSourceId === distributionSourceId);
  if (!rules.length) return null;
  const source = attributionSources.find((entry) => entry.distributionSource.id === distributionSourceId);
  return {
    distributionSourceId,
    sourceLabel: source?.distributionSource.sourceLabel ?? distributionSourceId,
    appliedRuleIds: rules.filter((rule) => rule.status !== "blocked" && rule.status !== "disabled").map((rule) => rule.id),
    targetPolicyIds: Array.from(new Set(rules.map((rule) => rule.targetPolicyId))),
    targetCommissionModelIds: Array.from(new Set(rules.map((rule) => rule.targetCommissionModelId))),
    isSimulated: true,
    boundaryNotes: Array.from(new Set(rules.flatMap((rule) => [...rule.warnings, ...rule.disclaimers])))
  };
}

function getCommunityDistributionByIdOrSlug(distributionIdOrSlug: string) {
  const key = distributionIdOrSlug.toLowerCase();
  return communityDistributions.find((distribution) => distribution.id.toLowerCase() === key || distribution.slug.toLowerCase() === key) ?? null;
}

function getCommunityDistributionItemLabel(item: CommunityDistributionItem) {
  if (item.tenantId) {
    return getTenantById(item.tenantId)?.displayName ?? item.targetId;
  }
  if (item.curatedCatalogId) {
    return resolveCuratedCatalog(item.curatedCatalogId)?.catalog.displayName ?? item.targetId;
  }
  if (item.segmentId) {
    return catalogSegments.find((segment) => segment.id === item.segmentId || segment.slug === item.segmentId)?.displayName ?? item.targetId;
  }
  if (item.productId) {
    return products.find((product) => product.id === item.productId)?.title ?? item.targetId;
  }
  if (item.collectionId) {
    return collections.find((collection) => collection.id === item.collectionId)?.name ?? item.targetId;
  }
  return item.targetId;
}

function buildCommunityDistributionItemView(item: CommunityDistributionItem): CommunityDistributionItemView {
  const tenant = item.tenantId ? getTenantById(item.tenantId) ?? undefined : undefined;
  const curatedCatalog = item.curatedCatalogId ? resolveCuratedCatalog(item.curatedCatalogId) ?? undefined : undefined;
  const segment = item.segmentId ? catalogSegments.find((entry) => entry.id === item.segmentId || entry.slug === item.segmentId) : undefined;
  const product = item.productId ? products.find((entry) => entry.id === item.productId) : undefined;
  const collection = item.collectionId ? collections.find((entry) => entry.id === item.collectionId) : undefined;
  const trustBoundary = collection?.trustBoundary;

  return {
    item,
    targetLabel: getCommunityDistributionItemLabel(item),
    tenant,
    curatedCatalog,
    segment,
    product,
    collection,
    trustBoundary,
    boundaryNotes: [
      ...item.warnings,
      ...item.disclaimers,
      ...(trustBoundary?.notes ?? []),
      "Community Distribution Item is mock/config-first and cannot track, attribute revenue, trigger payout or settle.",
      item.isFederated
        ? "Federated Community Distribution Item preserves origin, provider, validation status, provenance, risk classification and trust boundaries."
        : "Community Distribution Item is a reference only and does not duplicate tenant, catalog, product or collection truth."
    ]
  };
}

function buildCommunityDistributionContext(distribution: CommunityMarketplaceDistribution): CommunityDistributionContext {
  return {
    communityDistributionId: distribution.id,
    resolvedAt: "2026-06-15T12:10:00.000Z",
    profileId: distribution.profileId,
    channelId: distribution.channelId,
    tenantIds: distribution.tenantIds,
    curatedCatalogIds: distribution.curatedCatalogIds,
    featuredCatalogIds: distribution.featuredCatalogIds,
    segmentIds: distribution.segmentIds,
    includedProductIds: distribution.items.filter((item) => item.productId && item.canDisplay).map((item) => item.productId as string),
    excludedProductIds: distribution.items.filter((item) => item.productId && !item.canDisplay).map((item) => item.productId as string),
    includedCollectionIds: distribution.items.filter((item) => item.collectionId && item.canDisplay).map((item) => item.collectionId as string),
    excludedCollectionIds: distribution.items.filter((item) => item.collectionId && !item.canDisplay).map((item) => item.collectionId as string),
    attributionSourceId: distribution.attributionSourceId,
    commercialOriginLabel: getAttributionSourceById(distribution.attributionSourceId)?.source.commercialOrigin.originLabel ?? distribution.commercialOriginId,
    isSimulated: true,
    canDisplay: distribution.status !== "disabled" && distribution.status !== "restricted" && distribution.status !== "empty",
    canTrack: false,
    canAttributeRevenue: false,
    canTriggerPayout: false,
    canSettle: false,
    warnings: [
      ...distribution.warnings,
      ...distribution.rules.flatMap((rule) => rule.warnings),
      ...distribution.items.flatMap((item) => item.warnings)
    ],
    disclaimers: [
      ...distribution.disclaimers,
      ...distribution.rules.flatMap((rule) => rule.disclaimers),
      ...distribution.items.flatMap((item) => item.disclaimers),
      "Community Distribution Context is mock/config-first and does not delegate governance, track users, attribute revenue, trigger payout, settle, bill or share revenue."
    ]
  };
}

function buildCommunityDistributionView(distribution: CommunityMarketplaceDistribution): CommunityDistributionView {
  const profile = getDistributionProfileById(distribution.profileId) ?? undefined;
  const channel = getDistributionChannelById(distribution.channelId) ?? undefined;
  const attributionSource = getAttributionSourceById(distribution.attributionSourceId) ?? undefined;
  const tenantsForDistribution = distribution.tenantIds
    .map((tenantId) => getTenantById(tenantId))
    .filter((tenant): tenant is Tenant => Boolean(tenant));
  const curatedCatalogsForDistribution = distribution.curatedCatalogIds
    .map((catalogId) => resolveCuratedCatalog(catalogId))
    .filter((catalog): catalog is CuratedCatalogView => Boolean(catalog));
  const featuredCatalogsForDistribution = distribution.featuredCatalogIds
    .map((featuredId) => listFeaturedCatalogs().find((featured) => featured.featured.id === featuredId))
    .filter((featured): featured is FeaturedCatalogView => Boolean(featured));
  const segmentsForDistribution = distribution.segmentIds
    .map((segmentId) => catalogSegments.find((segment) => segment.id === segmentId || segment.slug === segmentId))
    .filter((segment): segment is CatalogSegment => Boolean(segment));
  const productsForDistribution = distribution.productIds
    .map((productId) => products.find((product) => product.id === productId))
    .filter((product): product is Product => Boolean(product));
  const collectionsForDistribution = distribution.collectionIds
    .map((collectionId) => collections.find((collection) => collection.id === collectionId))
    .filter((collection): collection is MarketplaceCollection => Boolean(collection));
  const itemViews = distribution.items.map(buildCommunityDistributionItemView);
  const context = buildCommunityDistributionContext(distribution);

  return {
    distribution,
    context,
    profile,
    channel,
    attributionSource,
    tenants: tenantsForDistribution,
    curatedCatalogs: curatedCatalogsForDistribution,
    featuredCatalogs: featuredCatalogsForDistribution,
    segments: segmentsForDistribution,
    products: productsForDistribution,
    collections: collectionsForDistribution,
    visibleItems: itemViews.filter((item) => item.item.canDisplay),
    excludedItems: itemViews.filter((item) => !item.item.canDisplay),
    boundaryNotes: [
      ...context.warnings,
      ...context.disclaimers,
      ...(profile?.boundaryNotes ?? []),
      ...(channel?.boundaryNotes ?? []),
      ...(attributionSource?.boundaryNotes ?? []),
      ...itemViews.flatMap((item) => item.boundaryNotes),
      "Community Marketplace Distribution is distinct from Tenant Marketplace, Community Marketplace Profile, Distribution Channel, Curated Catalog, Catalog Segment, Seller Profile and Federation Provider.",
      "Community Marketplace Distribution does not mean governance delegation real, contract real, revenue sharing, commission, payout, settlement, billing, tracking real, Marketplace Intelligence or BI."
    ]
  };
}

export function listCommunityMarketplaceDistributions() {
  return communityDistributions.map(buildCommunityDistributionView);
}

export function getCommunityMarketplaceDistributionById(distributionIdOrSlug: string) {
  const distribution = getCommunityDistributionByIdOrSlug(distributionIdOrSlug);
  return distribution ? buildCommunityDistributionView(distribution) : null;
}

export function getCommunityMarketplaceDistributionBySlug(distributionSlug: string) {
  const distribution = communityDistributions.find((entry) => entry.slug === distributionSlug) ?? null;
  return distribution ? buildCommunityDistributionView(distribution) : null;
}

export function resolveCommunityDistributionContext(distributionIdOrSlug?: string) {
  const requestedDistribution = distributionIdOrSlug ? getCommunityMarketplaceDistributionById(distributionIdOrSlug) : null;
  const distribution =
    requestedDistribution ?? listCommunityMarketplaceDistributions().find((view) => view.distribution.status !== "disabled" && view.distribution.status !== "empty") ?? listCommunityMarketplaceDistributions()[0];

  return {
    distribution,
    context: distribution.context,
    isFallback: !requestedDistribution,
    boundaryNotes: [
      ...distribution.boundaryNotes,
      "Community Distribution Context resolution never creates governance delegation real, commission, payout, settlement, billing, tracking real, revenue sharing, Marketplace Intelligence or BI."
    ]
  };
}

export function getCommunityDistributionTenants(distributionIdOrSlug: string) {
  return getCommunityMarketplaceDistributionById(distributionIdOrSlug)?.tenants ?? [];
}

export function getCommunityDistributionCuratedCatalogs(distributionIdOrSlug: string) {
  return getCommunityMarketplaceDistributionById(distributionIdOrSlug)?.curatedCatalogs ?? [];
}

export function getCommunityDistributionSegments(distributionIdOrSlug: string) {
  return getCommunityMarketplaceDistributionById(distributionIdOrSlug)?.segments ?? [];
}

export function getCommunityDistributionItems(distributionIdOrSlug: string) {
  const distribution = getCommunityMarketplaceDistributionById(distributionIdOrSlug);
  return distribution ? [...distribution.visibleItems, ...distribution.excludedItems] : [];
}

export function getCommunityDistributionAttributionSource(distributionIdOrSlug: string) {
  return getCommunityMarketplaceDistributionById(distributionIdOrSlug)?.attributionSource ?? null;
}

export function getCommunityDistributionCommercialOrigin(distributionIdOrSlug: string) {
  return getCommunityDistributionAttributionSource(distributionIdOrSlug)?.source.commercialOrigin ?? null;
}

export function applyCommunityDistributionRules(distributionIdOrSlug: string) {
  return getCommunityMarketplaceDistributionById(distributionIdOrSlug)?.distribution.rules ?? [];
}

export function explainCommunityDistributionInclusion(distributionIdOrSlug: string) {
  return getCommunityMarketplaceDistributionById(distributionIdOrSlug)?.visibleItems.map((item) => ({
    targetId: item.item.targetId,
    targetLabel: item.targetLabel,
    reason: item.item.inclusionReason,
    boundaryNotes: item.boundaryNotes
  })) ?? [];
}

export function explainCommunityDistributionExclusion(distributionIdOrSlug: string) {
  return getCommunityMarketplaceDistributionById(distributionIdOrSlug)?.excludedItems.map((item) => ({
    targetId: item.item.targetId,
    targetLabel: item.targetLabel,
    reason: item.item.exclusionReason ?? "No exclusion reason",
    boundaryNotes: item.boundaryNotes
  })) ?? [];
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function getTenantByIdOrSlug(tenantIdOrSlug?: string) {
  return tenantIdOrSlug ? getTenantById(tenantIdOrSlug) ?? getTenantBySlug(tenantIdOrSlug) : null;
}

function getCatalogSegmentByIdOrSlug(segmentIdOrSlug: string) {
  return catalogSegments.find((segment) => segment.id === segmentIdOrSlug || segment.slug === segmentIdOrSlug) ?? null;
}

function isAppliedDistributionRule(effect: string) {
  return effect === "include" || effect === "feature" || effect === "inherit" || effect === "warn";
}

function getTenantDistributionTargetLabel(rule: TenantDistributionRule) {
  if (rule.targetType === "distribution-channel") return getDistributionChannelById(rule.targetId)?.channel.displayName ?? rule.targetId;
  if (rule.targetType === "distribution-profile") return getDistributionProfileById(rule.targetId)?.profile.displayName ?? rule.targetId;
  if (rule.targetType === "community-distribution") return getCommunityMarketplaceDistributionById(rule.targetId)?.distribution.displayName ?? rule.targetId;
  if (rule.targetType === "attribution-source") return getAttributionSourceById(rule.targetId)?.source.displayName ?? rule.targetId;
  if (rule.targetType === "curated-catalog") return resolveCuratedCatalog(rule.targetId)?.catalog.displayName ?? rule.targetId;
  if (rule.targetType === "catalog-segment") return getCatalogSegmentByIdOrSlug(rule.targetId)?.displayName ?? rule.targetId;
  return rule.targetId;
}

function getCuratedCatalogDistributionTargetLabel(rule: CuratedCatalogDistributionRule) {
  if (rule.targetType === "distribution-channel") return getDistributionChannelById(rule.targetId)?.channel.displayName ?? rule.targetId;
  if (rule.targetType === "distribution-profile") return getDistributionProfileById(rule.targetId)?.profile.displayName ?? rule.targetId;
  if (rule.targetType === "community-distribution") return getCommunityMarketplaceDistributionById(rule.targetId)?.distribution.displayName ?? rule.targetId;
  if (rule.targetType === "attribution-source") return getAttributionSourceById(rule.targetId)?.source.displayName ?? rule.targetId;
  if (rule.targetType === "tenant") return getTenantById(rule.targetId)?.displayName ?? rule.targetId;
  if (rule.targetType === "catalog-segment") return getCatalogSegmentByIdOrSlug(rule.targetId)?.displayName ?? rule.targetId;
  return rule.targetId;
}

function getDefaultTenantDistributionConfig(tenantId: string): TenantDistributionConfig {
  return {
    tenantId,
    status: "configured-mock",
    scope: "tenant",
    inheritsGlobalDistributionChannels: true,
    allowedDistributionChannelIds: [],
    blockedDistributionChannelIds: [],
    featuredDistributionChannelIds: [],
    allowedDistributionProfileIds: [],
    blockedDistributionProfileIds: [],
    allowedCommunityDistributionIds: [],
    blockedCommunityDistributionIds: [],
    allowedAttributionSourceIds: [],
    blockedAttributionSourceIds: [],
    allowedCuratedCatalogIds: [],
    blockedCuratedCatalogIds: [],
    allowedSegmentIds: [],
    blockedSegmentIds: [],
    allowsFederatedAssets: false,
    canDisplay: true,
    canTrack: false,
    canAttributeRevenue: false,
    canTriggerPayout: false,
    canSettle: false,
    rules: [
      {
        id: `tenant-distribution-${tenantId}-fallback-inherit`,
        tenantId,
        ruleType: "inherit-global-distribution",
        targetType: "global-distribution",
        targetId: "distribution-channel-global-tenant",
        effect: "inherit",
        reason: "Fallback Tenant Distribution Config inherits the global distribution channel.",
        priority: 1,
        status: "configured-mock",
        warnings: ["Fallback Tenant Distribution Config is generated from local mock data."],
        disclaimers: ["No revenue sharing, commission, payout, settlement, billing, tracking real or Marketplace Intelligence is active."]
      }
    ],
    warnings: ["Fallback Tenant Distribution Config uses global mock distribution only."],
    disclaimers: ["Tenant Distribution Config is mock/config-first and cannot execute financial or tracking operations."]
  };
}

function getDefaultCuratedCatalogDistributionConfig(curatedCatalogId: string): CuratedCatalogDistributionConfig {
  return {
    curatedCatalogId,
    status: "configured-mock",
    scope: "curated-catalog",
    inheritsGlobalDistributionChannels: true,
    allowedDistributionChannelIds: [],
    blockedDistributionChannelIds: [],
    featuredDistributionChannelIds: [],
    allowedDistributionProfileIds: [],
    blockedDistributionProfileIds: [],
    allowedCommunityDistributionIds: [],
    blockedCommunityDistributionIds: [],
    allowedAttributionSourceIds: [],
    blockedAttributionSourceIds: [],
    allowedTenantIds: [],
    blockedTenantIds: [],
    allowedSegmentIds: [],
    blockedSegmentIds: [],
    allowsFederatedAssets: false,
    canDisplay: true,
    canTrack: false,
    canAttributeRevenue: false,
    canTriggerPayout: false,
    canSettle: false,
    rules: [
      {
        id: `curated-distribution-${curatedCatalogId}-fallback-inherit`,
        curatedCatalogId,
        ruleType: "inherit-global-distribution",
        targetType: "global-distribution",
        targetId: "distribution-channel-global-tenant",
        effect: "inherit",
        reason: "Fallback Curated Catalog Distribution Config inherits the global distribution channel.",
        priority: 1,
        status: "configured-mock",
        warnings: ["Fallback Curated Catalog Distribution Config is generated from local mock data."],
        disclaimers: ["No ranking real, revenue sharing, commission, payout, settlement, billing, tracking real or Marketplace Intelligence is active."]
      }
    ],
    warnings: ["Fallback Curated Catalog Distribution Config uses global mock distribution only."],
    disclaimers: ["Curated Catalog Distribution Config is mock/config-first and cannot execute financial or tracking operations."]
  };
}

export function getTenantDistributionConfig(tenantIdOrSlug?: string) {
  const tenant = getTenantByIdOrSlug(tenantIdOrSlug) ?? getGlobalTenant();
  return tenantDistributionConfigs.find((config) => config.tenantId === tenant.id) ?? getDefaultTenantDistributionConfig(tenant.id);
}

export function getCuratedCatalogDistributionConfig(catalogIdOrSlug: string) {
  const catalog = resolveCuratedCatalog(catalogIdOrSlug);
  if (!catalog) return null;
  return curatedCatalogDistributionConfigs.find((config) => config.curatedCatalogId === catalog.catalog.id) ?? getDefaultCuratedCatalogDistributionConfig(catalog.catalog.id);
}

export function applyTenantDistributionRules(tenantIdOrSlug?: string) {
  return [...getTenantDistributionConfig(tenantIdOrSlug).rules].sort((left, right) => left.priority - right.priority || left.id.localeCompare(right.id));
}

export function applyCuratedCatalogDistributionRules(catalogIdOrSlug: string) {
  return [...(getCuratedCatalogDistributionConfig(catalogIdOrSlug)?.rules ?? [])].sort((left, right) => left.priority - right.priority || left.id.localeCompare(right.id));
}

export function resolveTenantDistribution(tenantIdOrSlug?: string): TenantDistributionView {
  const tenant = getTenantByIdOrSlug(tenantIdOrSlug) ?? getGlobalTenant();
  const config = getTenantDistributionConfig(tenant.id);
  const rules = applyTenantDistributionRules(tenant.id);
  const inheritedChannelIds = config.inheritsGlobalDistributionChannels ? ["distribution-channel-global-tenant"] : [];
  const includedChannelIds = uniqueValues([...inheritedChannelIds, ...config.allowedDistributionChannelIds]).filter((id) => !config.blockedDistributionChannelIds.includes(id));
  const excludedChannelIds = uniqueValues(config.blockedDistributionChannelIds);
  const featuredChannelIds = uniqueValues(config.featuredDistributionChannelIds).filter((id) => includedChannelIds.includes(id));
  const includedProfileIds = uniqueValues(config.allowedDistributionProfileIds).filter((id) => !config.blockedDistributionProfileIds.includes(id));
  const excludedProfileIds = uniqueValues(config.blockedDistributionProfileIds);
  const includedCommunityDistributionIds = uniqueValues(config.allowedCommunityDistributionIds).filter((id) => !config.blockedCommunityDistributionIds.includes(id));
  const excludedCommunityDistributionIds = uniqueValues(config.blockedCommunityDistributionIds);
  const includedAttributionSourceIds = uniqueValues(config.allowedAttributionSourceIds).filter((id) => !config.blockedAttributionSourceIds.includes(id));
  const excludedAttributionSourceIds = uniqueValues(config.blockedAttributionSourceIds);
  const includedCuratedCatalogIds = uniqueValues(config.allowedCuratedCatalogIds).filter((id) => !config.blockedCuratedCatalogIds.includes(id));
  const excludedCuratedCatalogIds = uniqueValues(config.blockedCuratedCatalogIds);
  const includedSegmentIds = uniqueValues(config.allowedSegmentIds).filter((id) => !config.blockedSegmentIds.includes(id));
  const excludedSegmentIds = uniqueValues(config.blockedSegmentIds);
  const appliedRules = rules.filter((rule) => isAppliedDistributionRule(rule.effect));
  const blockedRules = rules.filter((rule) => rule.effect === "exclude" || rule.effect === "restrict");

  const resolution: TenantDistributionResolution = {
    tenantId: tenant.id,
    resolvedAt: "2026-06-15T13:00:00.000Z",
    includedChannelIds,
    excludedChannelIds,
    featuredChannelIds,
    includedProfileIds,
    excludedProfileIds,
    includedCommunityDistributionIds,
    excludedCommunityDistributionIds,
    includedAttributionSourceIds,
    excludedAttributionSourceIds,
    includedCuratedCatalogIds,
    excludedCuratedCatalogIds,
    includedSegmentIds,
    excludedSegmentIds,
    appliedRules,
    blockedRules,
    warnings: [...config.warnings, ...rules.flatMap((rule) => rule.warnings)],
    disclaimers: [
      ...config.disclaimers,
      ...rules.flatMap((rule) => rule.disclaimers),
      "Tenant Distribution Resolution is mock/config-first distribution integration.",
      "Tenant catalog isolation, branding/theme and simulated domain routing remain preserved.",
      "No revenue sharing, no commission, no payout, no settlement, no billing, no tracking real and no Marketplace Intelligence are active."
    ]
  };

  const channels = includedChannelIds.map((id) => getDistributionChannelById(id)).filter((view): view is DistributionChannelView => Boolean(view));
  const excludedChannels = excludedChannelIds.map((id) => getDistributionChannelById(id)).filter((view): view is DistributionChannelView => Boolean(view));
  const featuredChannels = featuredChannelIds.map((id) => getDistributionChannelById(id)).filter((view): view is DistributionChannelView => Boolean(view));
  const profiles = includedProfileIds.map((id) => getDistributionProfileById(id)).filter((view): view is DistributionProfileView => Boolean(view));
  const excludedProfiles = excludedProfileIds.map((id) => getDistributionProfileById(id)).filter((view): view is DistributionProfileView => Boolean(view));
  const communityDistributionViews = includedCommunityDistributionIds.map((id) => getCommunityMarketplaceDistributionById(id)).filter((view): view is CommunityDistributionView => Boolean(view));
  const excludedCommunityDistributionViews = excludedCommunityDistributionIds.map((id) => getCommunityMarketplaceDistributionById(id)).filter((view): view is CommunityDistributionView => Boolean(view));
  const attributionSourceViews = includedAttributionSourceIds.map((id) => getAttributionSourceById(id)).filter((view): view is AttributionSourceView => Boolean(view));
  const excludedAttributionSourceViews = excludedAttributionSourceIds.map((id) => getAttributionSourceById(id)).filter((view): view is AttributionSourceView => Boolean(view));
  const curatedCatalogViews = includedCuratedCatalogIds.map((id) => resolveCuratedCatalog(id)).filter((view): view is CuratedCatalogView => Boolean(view));
  const excludedCuratedCatalogViews = excludedCuratedCatalogIds.map((id) => resolveCuratedCatalog(id)).filter((view): view is CuratedCatalogView => Boolean(view));
  const segments = includedSegmentIds.map((id) => getCatalogSegmentByIdOrSlug(id)).filter((segment): segment is CatalogSegment => Boolean(segment));
  const excludedSegments = excludedSegmentIds.map((id) => getCatalogSegmentByIdOrSlug(id)).filter((segment): segment is CatalogSegment => Boolean(segment));
  const context = getDistributionContextForTenant(tenant.id);
  const includedItems = [
    ...channels.map((view) => buildTenantDistributionIntegratedItem(context.contextId, tenant.id, "distribution-channel" as const, view.channel.id, "included by tenant distribution rules", featuredChannelIds.includes(view.channel.id))),
    ...profiles.map((view) => buildTenantDistributionIntegratedItem(context.contextId, tenant.id, "distribution-profile" as const, view.profile.id, "included by tenant distribution profile rules")),
    ...communityDistributionViews.map((view) => buildTenantDistributionIntegratedItem(context.contextId, tenant.id, "community-distribution" as const, view.distribution.id, "included by tenant community distribution rules")),
    ...attributionSourceViews.map((view) => buildTenantDistributionIntegratedItem(context.contextId, tenant.id, "attribution-source" as const, view.source.id, "included by tenant attribution source rules")),
    ...curatedCatalogViews.map((view) => buildTenantDistributionIntegratedItem(context.contextId, tenant.id, "curated-catalog" as const, view.catalog.id, "included by tenant curated catalog distribution rules", config.featuredDistributionChannelIds.length > 0)),
    ...segments.map((segment) => buildTenantDistributionIntegratedItem(context.contextId, tenant.id, "catalog-segment" as const, segment.id, "included by tenant segment distribution rules"))
  ];
  const excludedItems = [
    ...excludedChannels.map((view) => buildTenantDistributionIntegratedItem(context.contextId, tenant.id, "distribution-channel" as const, view.channel.id, undefined, false, "blocked distribution channels")),
    ...excludedProfiles.map((view) => buildTenantDistributionIntegratedItem(context.contextId, tenant.id, "distribution-profile" as const, view.profile.id, undefined, false, "blocked distribution profiles")),
    ...excludedCommunityDistributionViews.map((view) => buildTenantDistributionIntegratedItem(context.contextId, tenant.id, "community-distribution" as const, view.distribution.id, undefined, false, "blocked community distributions")),
    ...excludedAttributionSourceViews.map((view) => buildTenantDistributionIntegratedItem(context.contextId, tenant.id, "attribution-source" as const, view.source.id, undefined, false, "blocked attribution sources")),
    ...excludedCuratedCatalogViews.map((view) => buildTenantDistributionIntegratedItem(context.contextId, tenant.id, "curated-catalog" as const, view.catalog.id, undefined, false, "blocked curated catalogs")),
    ...excludedSegments.map((segment) => buildTenantDistributionIntegratedItem(context.contextId, tenant.id, "catalog-segment" as const, segment.id, undefined, false, "blocked catalog segments"))
  ];

  return {
    tenant,
    config,
    resolution,
    channels,
    featuredChannels,
    excludedChannels,
    profiles,
    excludedProfiles,
    communityDistributions: communityDistributionViews,
    excludedCommunityDistributions: excludedCommunityDistributionViews,
    attributionSources: attributionSourceViews,
    excludedAttributionSources: excludedAttributionSourceViews,
    curatedCatalogs: curatedCatalogViews,
    excludedCuratedCatalogs: excludedCuratedCatalogViews,
    segments,
    excludedSegments,
    context,
    includedItems,
    excludedItems,
    boundaryNotes: [
      ...resolution.warnings,
      ...resolution.disclaimers,
      ...channels.flatMap((view) => view.boundaryNotes),
      ...profiles.flatMap((view) => view.boundaryNotes),
      ...communityDistributionViews.flatMap((view) => view.boundaryNotes),
      ...attributionSourceViews.flatMap((view) => view.boundaryNotes)
    ]
  };
}

export function resolveCuratedCatalogDistribution(catalogIdOrSlug: string): CuratedCatalogDistributionView | null {
  const catalog = resolveCuratedCatalog(catalogIdOrSlug);
  if (!catalog) return null;

  const config = getCuratedCatalogDistributionConfig(catalog.catalog.id)!;
  const rules = applyCuratedCatalogDistributionRules(catalog.catalog.id);
  const inheritedChannelIds = config.inheritsGlobalDistributionChannels ? ["distribution-channel-global-tenant"] : [];
  const includedChannelIds = uniqueValues([...inheritedChannelIds, ...config.allowedDistributionChannelIds]).filter((id) => !config.blockedDistributionChannelIds.includes(id));
  const excludedChannelIds = uniqueValues(config.blockedDistributionChannelIds);
  const featuredChannelIds = uniqueValues(config.featuredDistributionChannelIds).filter((id) => includedChannelIds.includes(id));
  const includedProfileIds = uniqueValues(config.allowedDistributionProfileIds).filter((id) => !config.blockedDistributionProfileIds.includes(id));
  const excludedProfileIds = uniqueValues(config.blockedDistributionProfileIds);
  const includedCommunityDistributionIds = uniqueValues(config.allowedCommunityDistributionIds).filter((id) => !config.blockedCommunityDistributionIds.includes(id));
  const excludedCommunityDistributionIds = uniqueValues(config.blockedCommunityDistributionIds);
  const includedAttributionSourceIds = uniqueValues(config.allowedAttributionSourceIds).filter((id) => !config.blockedAttributionSourceIds.includes(id));
  const excludedAttributionSourceIds = uniqueValues(config.blockedAttributionSourceIds);
  const includedTenantIds = uniqueValues(config.allowedTenantIds).filter((id) => !config.blockedTenantIds.includes(id));
  const excludedTenantIds = uniqueValues(config.blockedTenantIds);
  const includedSegmentIds = uniqueValues(config.allowedSegmentIds).filter((id) => !config.blockedSegmentIds.includes(id));
  const excludedSegmentIds = uniqueValues(config.blockedSegmentIds);
  const appliedRules = rules.filter((rule) => isAppliedDistributionRule(rule.effect));
  const blockedRules = rules.filter((rule) => rule.effect === "exclude" || rule.effect === "restrict");

  const resolution: CuratedCatalogDistributionResolution = {
    curatedCatalogId: catalog.catalog.id,
    resolvedAt: "2026-06-15T13:05:00.000Z",
    includedChannelIds,
    excludedChannelIds,
    featuredChannelIds,
    includedProfileIds,
    excludedProfileIds,
    includedCommunityDistributionIds,
    excludedCommunityDistributionIds,
    includedAttributionSourceIds,
    excludedAttributionSourceIds,
    includedTenantIds,
    excludedTenantIds,
    includedSegmentIds,
    excludedSegmentIds,
    appliedRules,
    blockedRules,
    warnings: [...config.warnings, ...rules.flatMap((rule) => rule.warnings), ...catalog.workflowSummary.warnings],
    disclaimers: [
      ...config.disclaimers,
      ...rules.flatMap((rule) => rule.disclaimers),
      ...catalog.workflowSummary.disclaimers,
      "Curated Catalog Distribution Resolution is mock/config-first distribution integration.",
      "Curated catalog editorial rules, featured/segment context and federation boundaries remain preserved.",
      "No revenue sharing, no commission, no payout, no settlement, no billing, no tracking real and no Marketplace Intelligence are active."
    ]
  };

  const channels = includedChannelIds.map((id) => getDistributionChannelById(id)).filter((view): view is DistributionChannelView => Boolean(view));
  const excludedChannels = excludedChannelIds.map((id) => getDistributionChannelById(id)).filter((view): view is DistributionChannelView => Boolean(view));
  const featuredChannels = featuredChannelIds.map((id) => getDistributionChannelById(id)).filter((view): view is DistributionChannelView => Boolean(view));
  const profiles = includedProfileIds.map((id) => getDistributionProfileById(id)).filter((view): view is DistributionProfileView => Boolean(view));
  const excludedProfiles = excludedProfileIds.map((id) => getDistributionProfileById(id)).filter((view): view is DistributionProfileView => Boolean(view));
  const communityDistributionViews = includedCommunityDistributionIds.map((id) => getCommunityMarketplaceDistributionById(id)).filter((view): view is CommunityDistributionView => Boolean(view));
  const excludedCommunityDistributionViews = excludedCommunityDistributionIds.map((id) => getCommunityMarketplaceDistributionById(id)).filter((view): view is CommunityDistributionView => Boolean(view));
  const attributionSourceViews = includedAttributionSourceIds.map((id) => getAttributionSourceById(id)).filter((view): view is AttributionSourceView => Boolean(view));
  const excludedAttributionSourceViews = excludedAttributionSourceIds.map((id) => getAttributionSourceById(id)).filter((view): view is AttributionSourceView => Boolean(view));
  const tenantViews = includedTenantIds.map((id) => getTenantById(id)).filter((tenant): tenant is Tenant => Boolean(tenant));
  const excludedTenantViews = excludedTenantIds.map((id) => getTenantById(id)).filter((tenant): tenant is Tenant => Boolean(tenant));
  const segments = includedSegmentIds.map((id) => getCatalogSegmentByIdOrSlug(id)).filter((segment): segment is CatalogSegment => Boolean(segment));
  const excludedSegments = excludedSegmentIds.map((id) => getCatalogSegmentByIdOrSlug(id)).filter((segment): segment is CatalogSegment => Boolean(segment));
  const context = getDistributionContextForCuratedCatalog(catalog.catalog.id);
  const includedItems = [
    ...channels.map((view) => buildCuratedCatalogDistributionIntegratedItem(context.contextId, catalog.catalog.id, "distribution-channel" as const, view.channel.id, "included by curated catalog distribution rules", featuredChannelIds.includes(view.channel.id))),
    ...profiles.map((view) => buildCuratedCatalogDistributionIntegratedItem(context.contextId, catalog.catalog.id, "distribution-profile" as const, view.profile.id, "included by curated catalog distribution profile rules")),
    ...communityDistributionViews.map((view) => buildCuratedCatalogDistributionIntegratedItem(context.contextId, catalog.catalog.id, "community-distribution" as const, view.distribution.id, "included by curated catalog community distribution rules")),
    ...attributionSourceViews.map((view) => buildCuratedCatalogDistributionIntegratedItem(context.contextId, catalog.catalog.id, "attribution-source" as const, view.source.id, "included by curated catalog attribution source rules")),
    ...tenantViews.map((tenant) => buildCuratedCatalogDistributionIntegratedItem(context.contextId, catalog.catalog.id, "tenant" as const, tenant.id, "included by curated catalog tenant distribution rules")),
    ...segments.map((segment) => buildCuratedCatalogDistributionIntegratedItem(context.contextId, catalog.catalog.id, "catalog-segment" as const, segment.id, "included by curated catalog segment distribution rules"))
  ];
  const excludedItems = [
    ...excludedChannels.map((view) => buildCuratedCatalogDistributionIntegratedItem(context.contextId, catalog.catalog.id, "distribution-channel" as const, view.channel.id, undefined, false, "blocked distribution channels")),
    ...excludedProfiles.map((view) => buildCuratedCatalogDistributionIntegratedItem(context.contextId, catalog.catalog.id, "distribution-profile" as const, view.profile.id, undefined, false, "blocked distribution profiles")),
    ...excludedCommunityDistributionViews.map((view) => buildCuratedCatalogDistributionIntegratedItem(context.contextId, catalog.catalog.id, "community-distribution" as const, view.distribution.id, undefined, false, "blocked community distributions")),
    ...excludedAttributionSourceViews.map((view) => buildCuratedCatalogDistributionIntegratedItem(context.contextId, catalog.catalog.id, "attribution-source" as const, view.source.id, undefined, false, "blocked attribution sources")),
    ...excludedTenantViews.map((tenant) => buildCuratedCatalogDistributionIntegratedItem(context.contextId, catalog.catalog.id, "tenant" as const, tenant.id, undefined, false, "blocked tenants")),
    ...excludedSegments.map((segment) => buildCuratedCatalogDistributionIntegratedItem(context.contextId, catalog.catalog.id, "catalog-segment" as const, segment.id, undefined, false, "blocked catalog segments"))
  ];

  return {
    catalog,
    config,
    resolution,
    channels,
    featuredChannels,
    excludedChannels,
    profiles,
    excludedProfiles,
    communityDistributions: communityDistributionViews,
    excludedCommunityDistributions: excludedCommunityDistributionViews,
    attributionSources: attributionSourceViews,
    excludedAttributionSources: excludedAttributionSourceViews,
    tenants: tenantViews,
    excludedTenants: excludedTenantViews,
    segments,
    excludedSegments,
    context,
    includedItems,
    excludedItems,
    boundaryNotes: [
      ...resolution.warnings,
      ...resolution.disclaimers,
      ...catalog.boundaryNotes,
      ...channels.flatMap((view) => view.boundaryNotes),
      ...profiles.flatMap((view) => view.boundaryNotes),
      ...communityDistributionViews.flatMap((view) => view.boundaryNotes),
      ...attributionSourceViews.flatMap((view) => view.boundaryNotes)
    ]
  };
}

function buildTenantDistributionIntegratedItem(
  contextId: string,
  tenantId: string,
  targetType: DistributionIntegratedItem["targetType"],
  targetId: string,
  inclusionReason?: string,
  isFeatured = false,
  exclusionReason?: string
): DistributionIntegratedItem {
  const collection = targetType === "curated-catalog" ? resolveCuratedCatalog(targetId)?.items.find((item) => item.item.isFederated)?.collection?.collection : undefined;
  return {
    id: `${contextId}-${targetType}-${targetId}`,
    contextId,
    contextType: "tenant",
    targetType,
    targetId,
    tenantId,
    source: "tenant distribution rules",
    inclusionReason,
    exclusionReason,
    isFeatured,
    isFederated: Boolean(collection?.isFederated),
    isExternal: Boolean(collection?.isExternal),
    isNative: !collection?.isExternal,
    canDisplay: Boolean(inclusionReason),
    canTrack: false,
    canAttributeRevenue: false,
    canTriggerPayout: false,
    canSettle: false,
    warnings: ["Distribution Integrated Item is mock/config-first."],
    disclaimers: ["No revenue sharing, commission, payout, settlement, billing, tracking real or Marketplace Intelligence is active."]
  };
}

function buildCuratedCatalogDistributionIntegratedItem(
  contextId: string,
  curatedCatalogId: string,
  targetType: DistributionIntegratedItem["targetType"],
  targetId: string,
  inclusionReason?: string,
  isFeatured = false,
  exclusionReason?: string
): DistributionIntegratedItem {
  const catalog = resolveCuratedCatalog(curatedCatalogId);
  return {
    id: `${contextId}-${targetType}-${targetId}`,
    contextId,
    contextType: "curated-catalog",
    targetType,
    targetId,
    curatedCatalogId,
    source: "curated catalog distribution rules",
    inclusionReason,
    exclusionReason,
    isFeatured,
    isFederated: Boolean(catalog?.catalog.allowsFederatedAssets),
    isExternal: Boolean(catalog?.items.some((item) => item.item.isExternal)),
    isNative: !catalog?.items.some((item) => item.item.isExternal),
    canDisplay: Boolean(inclusionReason),
    canTrack: false,
    canAttributeRevenue: false,
    canTriggerPayout: false,
    canSettle: false,
    warnings: ["Distribution Integrated Item is mock/config-first."],
    disclaimers: ["No revenue sharing, commission, payout, settlement, billing, tracking real or Marketplace Intelligence is active."]
  };
}

export function getTenantDistributionChannels(tenantIdOrSlug?: string) {
  return resolveTenantDistribution(tenantIdOrSlug).channels;
}

export function getTenantDistributionProfiles(tenantIdOrSlug?: string) {
  return resolveTenantDistribution(tenantIdOrSlug).profiles;
}

export function getTenantDistributionAttributionSources(tenantIdOrSlug?: string) {
  return resolveTenantDistribution(tenantIdOrSlug).attributionSources;
}

export function getTenantDistributionCommunityChannels(tenantIdOrSlug?: string) {
  return resolveTenantDistribution(tenantIdOrSlug).communityDistributions;
}

export function getCuratedCatalogDistributionChannels(catalogIdOrSlug: string) {
  return resolveCuratedCatalogDistribution(catalogIdOrSlug)?.channels ?? [];
}

export function getCuratedCatalogDistributionProfiles(catalogIdOrSlug: string) {
  return resolveCuratedCatalogDistribution(catalogIdOrSlug)?.profiles ?? [];
}

export function getCuratedCatalogDistributionAttributionSources(catalogIdOrSlug: string) {
  return resolveCuratedCatalogDistribution(catalogIdOrSlug)?.attributionSources ?? [];
}

export function getDistributionContextForTenant(tenantIdOrSlug?: string): DistributionIntegratedContext {
  const tenant = getTenantByIdOrSlug(tenantIdOrSlug) ?? getGlobalTenant();
  const config = getTenantDistributionConfig(tenant.id);
  const channelId = uniqueValues([...(config.inheritsGlobalDistributionChannels ? ["distribution-channel-global-tenant"] : []), ...config.allowedDistributionChannelIds]).find(
    (id) => !config.blockedDistributionChannelIds.includes(id)
  );
  const channel = channelId ? getDistributionChannelById(channelId) : null;
  const attributionId = config.allowedAttributionSourceIds.find((id) => !config.blockedAttributionSourceIds.includes(id));
  const attribution = attributionId ? getAttributionSourceById(attributionId) : null;

  return {
    contextId: `tenant-distribution-context-${tenant.id}`,
    contextType: "tenant",
    tenantId: tenant.id,
    channelId: channel?.channel.id,
    profileId: config.allowedDistributionProfileIds.find((id) => !config.blockedDistributionProfileIds.includes(id)),
    communityDistributionId: config.allowedCommunityDistributionIds.find((id) => !config.blockedCommunityDistributionIds.includes(id)),
    attributionSourceId: attribution?.source.id,
    commercialOriginLabel: attribution?.source.commercialOrigin.originLabel ?? channel?.channel.commercialOrigin.originLabel ?? "Tenant commercial origin mock",
    distributionSourceLabel: attribution?.source.distributionSource.sourceLabel ?? channel?.channel.distributionSource.sourceLabel ?? "Tenant distribution source mock",
    routingMode: resolveTenantRoutingContext(tenant.slug).resolution.routingMode,
    isSimulated: true,
    canDisplay: config.canDisplay && tenant.configuration.canDisplay,
    canTrack: false,
    canAttributeRevenue: false,
    canTriggerPayout: false,
    canSettle: false,
    warnings: [...config.warnings, ...(channel?.channel.warnings ?? []), ...(attribution?.source.warnings ?? [])],
    disclaimers: [
      ...config.disclaimers,
      ...(channel?.channel.disclaimers ?? []),
      ...(attribution?.source.disclaimers ?? []),
      "Distribution Integrated Context for tenant preserves tenant catalog isolation, branding/theme and domain simulation.",
      "No revenue sharing, no commission, no payout, no settlement, no billing, no tracking real and no Marketplace Intelligence are active."
    ]
  };
}

export function getDistributionContextForCuratedCatalog(catalogIdOrSlug: string): DistributionIntegratedContext {
  const catalog = resolveCuratedCatalog(catalogIdOrSlug);
  const config = catalog ? getCuratedCatalogDistributionConfig(catalog.catalog.id) : null;
  const channelId = config
    ? uniqueValues([...(config.inheritsGlobalDistributionChannels ? ["distribution-channel-global-tenant"] : []), ...config.allowedDistributionChannelIds]).find(
        (id) => !config.blockedDistributionChannelIds.includes(id)
      )
    : undefined;
  const channel = channelId ? getDistributionChannelById(channelId) : null;
  const attributionId = config?.allowedAttributionSourceIds.find((id) => !config.blockedAttributionSourceIds.includes(id));
  const attribution = attributionId ? getAttributionSourceById(attributionId) : null;

  return {
    contextId: `curated-catalog-distribution-context-${catalog?.catalog.id ?? "missing"}`,
    contextType: "curated-catalog",
    curatedCatalogId: catalog?.catalog.id,
    channelId: channel?.channel.id,
    profileId: config?.allowedDistributionProfileIds.find((id) => !config.blockedDistributionProfileIds.includes(id)),
    communityDistributionId: config?.allowedCommunityDistributionIds.find((id) => !config.blockedCommunityDistributionIds.includes(id)),
    attributionSourceId: attribution?.source.id,
    commercialOriginLabel: attribution?.source.commercialOrigin.originLabel ?? channel?.channel.commercialOrigin.originLabel ?? "Curated catalog commercial origin mock",
    distributionSourceLabel: attribution?.source.distributionSource.sourceLabel ?? channel?.channel.distributionSource.sourceLabel ?? "Curated catalog distribution source mock",
    routingMode: "mock/read-only curated catalog distribution",
    isSimulated: true,
    canDisplay: Boolean(config?.canDisplay && catalog?.catalog.status !== "disabled"),
    canTrack: false,
    canAttributeRevenue: false,
    canTriggerPayout: false,
    canSettle: false,
    warnings: [...(config?.warnings ?? []), ...(catalog?.workflowSummary.warnings ?? []), ...(channel?.channel.warnings ?? []), ...(attribution?.source.warnings ?? [])],
    disclaimers: [
      ...(config?.disclaimers ?? []),
      ...(catalog?.workflowSummary.disclaimers ?? []),
      ...(channel?.channel.disclaimers ?? []),
      ...(attribution?.source.disclaimers ?? []),
      "Distribution Integrated Context for curated catalog preserves editorial rules, featured/segment context and federation boundaries.",
      "No revenue sharing, no commission, no payout, no settlement, no billing, no tracking real and no Marketplace Intelligence are active."
    ]
  };
}

export function explainTenantDistributionInclusion(tenantIdOrSlug?: string) {
  const view = resolveTenantDistribution(tenantIdOrSlug);
  return view.resolution.appliedRules.map((rule) => ({
    targetId: rule.targetId,
    targetLabel: getTenantDistributionTargetLabel(rule),
    reason: rule.reason,
    boundaryNotes: [...rule.warnings, ...rule.disclaimers, ...view.context.disclaimers]
  }));
}

export function explainTenantDistributionExclusion(tenantIdOrSlug?: string) {
  const view = resolveTenantDistribution(tenantIdOrSlug);
  return view.resolution.blockedRules.map((rule) => ({
    targetId: rule.targetId,
    targetLabel: getTenantDistributionTargetLabel(rule),
    reason: rule.reason,
    boundaryNotes: [...rule.warnings, ...rule.disclaimers, ...view.context.disclaimers]
  }));
}

export function explainCuratedCatalogDistributionInclusion(catalogIdOrSlug: string) {
  const view = resolveCuratedCatalogDistribution(catalogIdOrSlug);
  if (!view) return [];
  return view.resolution.appliedRules.map((rule) => ({
    targetId: rule.targetId,
    targetLabel: getCuratedCatalogDistributionTargetLabel(rule),
    reason: rule.reason,
    boundaryNotes: [...rule.warnings, ...rule.disclaimers, ...view.context.disclaimers]
  }));
}

export function explainCuratedCatalogDistributionExclusion(catalogIdOrSlug: string) {
  const view = resolveCuratedCatalogDistribution(catalogIdOrSlug);
  if (!view) return [];
  return view.resolution.blockedRules.map((rule) => ({
    targetId: rule.targetId,
    targetLabel: getCuratedCatalogDistributionTargetLabel(rule),
    reason: rule.reason,
    boundaryNotes: [...rule.warnings, ...rule.disclaimers, ...view.context.disclaimers]
  }));
}

function getRevenueSharingPolicyByIdOrSlug(policyIdOrSlug: string) {
  const key = policyIdOrSlug.toLowerCase();
  return revenueSharingPolicies.find((policy) => policy.id.toLowerCase() === key || policy.slug.toLowerCase() === key) ?? null;
}

function getRevenueParticipantById(participantId: string) {
  return revenueParticipants.find((participant) => participant.id === participantId) ?? null;
}

function getRevenueSplitRuleById(ruleId: string) {
  return revenueSplitRules.find((rule) => rule.id === ruleId) ?? null;
}

function getCommissionModelByIdOrSlug(modelIdOrSlug: string) {
  const key = modelIdOrSlug.toLowerCase();
  return commissionModels.find((model) => model.id.toLowerCase() === key || model.slug.toLowerCase() === key) ?? null;
}

function getParticipantShareById(shareId: string) {
  return participantShares.find((share) => share.id === shareId) ?? null;
}

function getCommissionModelShares(model: CommissionModel) {
  return model.participantShareIds.map(getParticipantShareById).filter((share): share is ParticipantShare => Boolean(share));
}

function resolveCommissionValidationStatus(model: CommissionModel, conflicts: ParticipantShareConflict[], totalShareValueMock: number): ParticipantShareValidationStatus {
  if (model.status === "disabled" || model.status === "restricted") return model.status;
  if (conflicts.some((conflict) => conflict.severity === "conflict")) return "conflict-mock";
  if (conflicts.length || totalShareValueMock !== 100 || model.status === "warning-mock") return "warning-mock";
  return "valid-mock";
}

function buildParticipantShareConflict(
  model: CommissionModel,
  conflictType: ParticipantShareConflict["conflictType"],
  message: string,
  severity: ParticipantShareConflict["severity"] = "warning",
  participantShareId?: string
): ParticipantShareConflict {
  return {
    id: `participant-share-conflict-${model.id}-${conflictType}-${participantShareId ?? "model"}`,
    commissionModelId: model.id,
    participantShareId,
    severity,
    conflictType,
    message,
    isBlocking: severity === "conflict",
    warnings: [message],
    disclaimers: ["Participant Share conflict is simulated; no commission real, no obligation financial, no payout, no settlement and no billing are active."]
  };
}

function validateParticipantSharesForCommissionModel(model: CommissionModel): ParticipantShareValidation {
  const shares = getCommissionModelShares(model);
  const totalShareValueMock = shares.reduce((total, share) => total + share.shareValue, 0);
  const conflicts: ParticipantShareConflict[] = [];

  if (totalShareValueMock !== 100) {
    conflicts.push(
      buildParticipantShareConflict(
        model,
        "share-total",
        `Participant Share mock total is ${totalShareValueMock}; review required before any future activation.`,
        totalShareValueMock > 100 ? "conflict" : "warning"
      )
    );
  }

  shares.forEach((share) => {
    const participant = getRevenueParticipantById(share.participantId);
    if (!participant) {
      conflicts.push(buildParticipantShareConflict(model, "missing-participant", `Participant Share ${share.id} references a missing participant.`, "conflict", share.id));
    }
    if (share.capValueMock && share.capValueMock > 0 && share.shareValue > share.capValueMock) {
      conflicts.push(
        buildParticipantShareConflict(
          model,
          "cap",
          `${share.participantType} Participant Share mock ${share.shareValue} exceeds capValueMock ${share.capValueMock}.`,
          "conflict",
          share.id
        )
      );
    }
    if (share.floorValueMock && share.floorValueMock > 0 && share.shareValue < share.floorValueMock) {
      conflicts.push(
        buildParticipantShareConflict(
          model,
          "floor",
          `${share.participantType} Participant Share mock ${share.shareValue} is below floorValueMock ${share.floorValueMock}.`,
          "warning",
          share.id
        )
      );
    }
    if (share.canSettle || share.canTriggerPayout || share.canReceivePayout) {
      conflicts.push(
        buildParticipantShareConflict(
          model,
          "boundary",
          `${share.participantType} Participant Share violates mock/config-first financial execution boundaries.`,
          "conflict",
          share.id
        )
      );
    }
  });

  const capWarnings = conflicts.filter((conflict) => conflict.conflictType === "cap").map((conflict) => conflict.message);
  const floorWarnings = conflicts.filter((conflict) => conflict.conflictType === "floor").map((conflict) => conflict.message);
  const conflictWarnings = conflicts.map((conflict) => conflict.message);
  const validationStatus = resolveCommissionValidationStatus(model, conflicts, totalShareValueMock);

  return {
    commissionModelId: model.id,
    policyId: model.policyId,
    totalShareValueMock,
    validationStatus,
    conflictStatus: conflicts.some((conflict) => conflict.severity === "conflict") ? "conflict-mock" : validationStatus,
    capWarnings,
    floorWarnings,
    conflictWarnings,
    boundaryNotes: Array.from(
      new Set([
        ...model.warnings,
        ...model.disclaimers,
        ...shares.flatMap((share) => [...share.warnings, ...share.disclaimers]),
        ...conflictWarnings,
        "Commission Model is mock/config-first and validates Participant Share records only.",
        "Commission Model does not create commission due, payable record, payout, settlement, billing, invoice, accounting, tax, treasury routing, split on-chain, payment gateway, backend or database."
      ])
    ),
    conflicts
  };
}

function buildCommissionModelView(model: CommissionModel): CommissionModelView {
  const shares = getCommissionModelShares(model);
  const participants = shares.map((share) => getRevenueParticipantById(share.participantId)).filter((participant): participant is RevenueParticipant => Boolean(participant));
  const rules = model.ruleIds.map(getRevenueSplitRuleById).filter((rule): rule is RevenueSplitRule => Boolean(rule));
  const policy = getRevenueSharingPolicyByIdOrSlug(model.policyId);
  const validation = validateParticipantSharesForCommissionModel(model);

  return {
    model,
    policy,
    participants,
    rules,
    participantShares: shares,
    validation,
    boundaryNotes: validation.boundaryNotes
  };
}

function getRevenueSharingPreviewByPolicy(policyId: string) {
  return revenueSharingPreviews.find((preview) => preview.policyId === policyId) ?? null;
}

function getRevenueSharingPreviewByIdOrPolicy(previewIdOrPolicyId: string) {
  const key = previewIdOrPolicyId.toLowerCase();
  return (
    revenueSharingPreviews.find(
      (preview) => preview.id.toLowerCase() === key || preview.policyId.toLowerCase() === key
    ) ?? null
  );
}

function buildParticipantSplitExplanation(share: ParticipantShare): ParticipantSplitExplanation {
  const participant = getRevenueParticipantById(share.participantId);
  return {
    participantId: share.participantId,
    participantLabel: participant?.displayName ?? share.participantId,
    participantType: share.participantType,
    participantShareId: share.id,
    sourceRuleId: share.sourceRuleId,
    shareLabel: `${share.shareValue}% ${share.shareType} Participant split explanation`,
    attributionSourceId: share.attributionSourceId,
    commercialOriginId: share.commercialOriginId,
    canSettle: share.canSettle,
    canTriggerPayout: share.canTriggerPayout,
    canReceivePayout: share.canReceivePayout,
    boundaryNotes: Array.from(
      new Set([
        ...(participant ? [...participant.warnings, ...participant.disclaimers] : []),
        ...share.warnings,
        ...share.disclaimers,
        "Participant split explanation is preview-only and cannot create payout, settlement, invoice, accounting, tax or payment gateway execution."
      ])
    )
  };
}

function buildRevenueSharingPreviewView(preview: RevenueSharingPreview): RevenueSharingPreviewView {
  const policy = getRevenueSharingPolicyById(preview.policyId);
  const commissionModel = getCommissionModelById(preview.commissionModelId);
  const payoutPreview = payoutPreviewMocks.find((entry) => entry.previewId === preview.id) ?? null;
  const settlementPreview = settlementPreviewMocks.find((entry) => entry.previewId === preview.id) ?? null;
  const auditEntries = revenueSharingAuditEntries.filter((entry) => entry.policyId === preview.policyId);
  const shares = preview.participantShareIds.map(getParticipantShareById).filter((share): share is ParticipantShare => Boolean(share));
  const participantSplitExplanations = shares.map(buildParticipantSplitExplanation);
  const attributionExplanations = preview.attributionSourceIds.flatMap((sourceId) => explainAttributionToSplit(sourceId));
  const conflictWarnings = [
    ...(commissionModel?.validation.conflictWarnings ?? []),
    ...preview.warnings,
    ...auditEntries.filter((entry) => entry.severity === "conflict" || entry.severity === "blocked").flatMap((entry) => entry.warnings)
  ];

  return {
    preview,
    policy,
    commissionModel,
    payoutPreview,
    settlementPreview,
    auditEntries,
    participantSplitExplanations,
    ruleApplicationExplanations: attributionExplanations,
    conflictWarnings: Array.from(new Set(conflictWarnings)),
    boundaryNotes: Array.from(
      new Set([
        ...preview.warnings,
        ...preview.disclaimers,
        ...(policy?.boundaryNotes ?? []),
        ...(commissionModel?.boundaryNotes ?? []),
        ...(payoutPreview ? [...payoutPreview.warnings, ...payoutPreview.disclaimers] : ["Payout Preview mock missing; review required."]),
        ...(settlementPreview ? [...settlementPreview.warnings, ...settlementPreview.disclaimers] : ["Settlement Preview mock missing; review required."]),
        ...auditEntries.flatMap((entry) => [...entry.warnings, ...entry.disclaimers]),
        ...participantSplitExplanations.flatMap((entry) => entry.boundaryNotes),
        ...attributionExplanations.flatMap((entry) => entry.boundaryNotes),
        "Revenue Sharing Preview is mock/config-first and preview-only.",
        "Payout Preview mock is non-executing and cannot trigger payout.",
        "Settlement Preview mock is non-executing and cannot settle, invoice, account or route treasury.",
        "Revenue Sharing Audit Trail mock is not accounting, tax, invoice, settlement, payment gateway, wallet signature, backend, database, BI or Marketplace Intelligence."
      ])
    )
  };
}

function buildRevenueSharingPolicyView(policy: RevenueSharingPolicy): RevenueSharingPolicyView {
  const participants = policy.participantIds.map(getRevenueParticipantById).filter((participant): participant is RevenueParticipant => Boolean(participant));
  const rules = policy.ruleIds.map(getRevenueSplitRuleById).filter((rule): rule is RevenueSplitRule => Boolean(rule));
  const shares = participantShares.filter((share) => share.policyId === policy.id);
  const policyCommissionModels = (policy.commissionModelIds ?? []).map(getCommissionModelByIdOrSlug).filter((model): model is CommissionModel => Boolean(model)).map(buildCommissionModelView);
  const settlementBoundary = settlementBoundaries.find((boundary) => boundary.id === policy.settlementBoundaryId) ?? null;
  const tenant = policy.tenantId ? getTenantById(policy.tenantId) ?? undefined : undefined;
  const distributionChannel = policy.distributionChannelId ? getDistributionChannelById(policy.distributionChannelId) ?? undefined : undefined;
  const distributionProfile = policy.distributionProfileId ? getDistributionProfileById(policy.distributionProfileId) ?? undefined : undefined;
  const communityDistribution = policy.communityDistributionId ? getCommunityMarketplaceDistributionById(policy.communityDistributionId) ?? undefined : undefined;
  const curatedCatalog = policy.curatedCatalogId ? resolveCuratedCatalog(policy.curatedCatalogId) ?? undefined : undefined;
  const catalogSegment = policy.catalogSegmentId ? getCatalogSegmentByIdOrSlug(policy.catalogSegmentId) ?? undefined : undefined;
  const product = policy.productId ? products.find((entry) => entry.id === policy.productId) : undefined;
  const collection = policy.collectionId ? collections.find((entry) => entry.id === policy.collectionId) : undefined;
  const attributionSourceViews = policy.attributionSourceIds.map((sourceId) => getAttributionSourceById(sourceId)).filter((source): source is AttributionSourceView => Boolean(source));
  const shareTotal = shares.reduce((total, share) => total + share.shareValue, 0);
  const shareWarning = shareTotal === 100 ? [] : [`Participant Share mock total is ${shareTotal}; review required before any future activation.`];

  return {
    policy,
    participants,
    rules,
    participantShares: shares,
    commissionModels: policyCommissionModels,
    settlementBoundary,
    tenant,
    distributionChannel,
    distributionProfile,
    communityDistribution,
    curatedCatalog,
    catalogSegment,
    product,
    collection,
    attributionSources: attributionSourceViews,
    shareTotal,
    boundaryNotes: Array.from(
      new Set([
        ...policy.warnings,
        ...policy.disclaimers,
        ...shareWarning,
        ...participants.flatMap((participant) => [...participant.warnings, ...participant.disclaimers]),
        ...rules.flatMap((rule) => [...rule.warnings, ...rule.disclaimers]),
        ...shares.flatMap((share) => [...share.warnings, ...share.disclaimers]),
        ...policyCommissionModels.flatMap((model) => model.boundaryNotes),
        ...(settlementBoundary ? [...settlementBoundary.warnings, ...settlementBoundary.disclaimers] : ["Settlement Boundary missing; review required."]),
        ...(distributionChannel?.boundaryNotes ?? []),
        ...(distributionProfile?.boundaryNotes ?? []),
        ...(communityDistribution?.boundaryNotes ?? []),
        ...(curatedCatalog?.boundaryNotes ?? []),
        ...(collection?.trustBoundary?.notes ?? []),
        ...attributionSourceViews.flatMap((source) => source.boundaryNotes),
        "Revenue Sharing Policy is mock/config-first and preview-only.",
        "Revenue Sharing Policy does not execute payout, settlement, billing, invoice, accounting, tax, treasury routing, payment gateway, wallet signature, backend, API, database, analytics tracking, BI or Marketplace Intelligence.",
        "canCalculatePreview may be true only for simulated explanation; canSettle=false, canTriggerPayout=false and canRouteTreasury=false."
      ])
    )
  };
}

export function listRevenueSharingPolicies() {
  return revenueSharingPolicies.map(buildRevenueSharingPolicyView);
}

export function getRevenueSharingPolicyById(policyIdOrSlug: string) {
  const policy = getRevenueSharingPolicyByIdOrSlug(policyIdOrSlug);
  return policy ? buildRevenueSharingPolicyView(policy) : null;
}

export function listRevenueParticipantsByPolicy(policyIdOrSlug: string) {
  return getRevenueSharingPolicyById(policyIdOrSlug)?.participants ?? [];
}

export function listRevenueSplitRulesByPolicy(policyIdOrSlug: string) {
  return getRevenueSharingPolicyById(policyIdOrSlug)?.rules ?? [];
}

export function listParticipantSharesByPolicy(policyIdOrSlug: string) {
  return getRevenueSharingPolicyById(policyIdOrSlug)?.participantShares ?? [];
}

export function listCommissionModels() {
  return commissionModels.map(buildCommissionModelView);
}

export function getCommissionModelById(modelIdOrSlug: string) {
  const model = getCommissionModelByIdOrSlug(modelIdOrSlug);
  return model ? buildCommissionModelView(model) : null;
}

export function listCommissionModelsByPolicy(policyIdOrSlug: string) {
  const policy = getRevenueSharingPolicyByIdOrSlug(policyIdOrSlug);
  if (!policy) return [];
  return listCommissionModels().filter((view) => view.model.policyId === policy.id);
}

export function listParticipantSharesByCommissionModel(modelIdOrSlug: string) {
  return getCommissionModelById(modelIdOrSlug)?.participantShares ?? [];
}

export function calculateCommissionModelShareTotalMock(modelIdOrSlug: string) {
  return getCommissionModelById(modelIdOrSlug)?.validation.totalShareValueMock ?? 0;
}

export function detectParticipantShareConflicts(modelIdOrSlug: string) {
  return getCommissionModelById(modelIdOrSlug)?.validation.conflicts ?? [];
}

export function validateParticipantSharesByCommissionModel(modelIdOrSlug: string) {
  return getCommissionModelById(modelIdOrSlug)?.validation ?? null;
}

export function listRevenueSharingPreviews() {
  return revenueSharingPreviews.map(buildRevenueSharingPreviewView);
}

export function resolveRevenueSharingPreview(policyIdOrSlug: string) {
  const policy = getRevenueSharingPolicyByIdOrSlug(policyIdOrSlug);
  const preview = policy ? getRevenueSharingPreviewByPolicy(policy.id) : getRevenueSharingPreviewByIdOrPolicy(policyIdOrSlug);
  return preview ? buildRevenueSharingPreviewView(preview) : null;
}

export function listRevenueSharingAuditEntriesByPolicy(policyIdOrSlug: string) {
  const policy = getRevenueSharingPolicyByIdOrSlug(policyIdOrSlug);
  if (!policy) return [];
  return revenueSharingAuditEntries.filter((entry) => entry.policyId === policy.id);
}

export function explainParticipantSplitsByPolicy(policyIdOrSlug: string) {
  return resolveRevenueSharingPreview(policyIdOrSlug)?.participantSplitExplanations ?? [];
}

export function explainRevenueSharingRuleApplication(policyIdOrSlug: string) {
  return resolveRevenueSharingPreview(policyIdOrSlug)?.ruleApplicationExplanations ?? [];
}

export function listRevenueSharingPreviewConflicts(policyIdOrSlug: string) {
  return resolveRevenueSharingPreview(policyIdOrSlug)?.conflictWarnings ?? [];
}

export function resolvePayoutPreviewMock(policyIdOrSlug: string) {
  return resolveRevenueSharingPreview(policyIdOrSlug)?.payoutPreview ?? null;
}

export function resolveSettlementPreviewMock(policyIdOrSlug: string) {
  return resolveRevenueSharingPreview(policyIdOrSlug)?.settlementPreview ?? null;
}

export function resolveSettlementBoundary(policyIdOrSlug: string) {
  return getRevenueSharingPolicyById(policyIdOrSlug)?.settlementBoundary ?? null;
}

export function getRevenueSharingPoliciesByTenant(tenantIdOrSlug: string) {
  const tenant = getTenantById(tenantIdOrSlug) ?? getTenantBySlug(tenantIdOrSlug);
  if (!tenant) return [];
  return listRevenueSharingPolicies().filter((view) => view.policy.tenantId === tenant.id);
}

export function getRevenueSharingPoliciesByDistributionChannel(channelIdOrSlug: string) {
  const channel = getDistributionChannelByIdOrSlug(channelIdOrSlug);
  if (!channel) return [];
  return listRevenueSharingPolicies().filter((view) => view.policy.distributionChannelId === channel.id);
}

export function getRevenueSharingPoliciesByDistributionProfile(profileIdOrSlug: string) {
  const profile = getDistributionProfileByIdOrSlug(profileIdOrSlug);
  if (!profile) return [];
  return listRevenueSharingPolicies().filter((view) => view.policy.distributionProfileId === profile.id);
}

export function getRevenueSharingPoliciesByCommunityDistribution(distributionIdOrSlug: string) {
  const distribution = getCommunityMarketplaceDistributionById(distributionIdOrSlug);
  if (!distribution) return [];
  return listRevenueSharingPolicies().filter((view) => view.policy.communityDistributionId === distribution.distribution.id);
}

export function getRevenueSharingPoliciesByCuratedCatalog(catalogIdOrSlug: string) {
  const catalog = resolveCuratedCatalog(catalogIdOrSlug);
  if (!catalog) return [];
  return listRevenueSharingPolicies().filter((view) => view.policy.curatedCatalogId === catalog.catalog.id);
}

export function getTenantRevenueSharingConfigByTenant(tenantIdOrSlug: string) {
  const tenant = getTenantById(tenantIdOrSlug) ?? getTenantBySlug(tenantIdOrSlug);
  if (!tenant) return null;
  return tenantRevenueSharingConfigs.find((config) => config.tenantId === tenant.id) ?? null;
}

export function getDistributionRevenueSharingConfigByChannel(channelIdOrSlug: string) {
  const channel = getDistributionChannelByIdOrSlug(channelIdOrSlug);
  if (!channel) return null;
  return distributionRevenueSharingConfigs.find((config) => config.distributionChannelId === channel.id) ?? null;
}

export function getDistributionRevenueSharingConfigByProfile(profileIdOrSlug: string) {
  const profile = getDistributionProfileByIdOrSlug(profileIdOrSlug);
  if (!profile) return null;
  return distributionRevenueSharingConfigs.find((config) => config.profileId === profile.id) ?? null;
}

export function getCuratedCatalogRevenueSharingConfigByCatalog(catalogIdOrSlug: string) {
  const catalog = resolveCuratedCatalog(catalogIdOrSlug);
  if (!catalog) return null;
  return curatedCatalogRevenueSharingConfigs.find((config) => config.curatedCatalogId === catalog.catalog.id) ?? null;
}

export function getCommunityRevenueSharingConfigByDistribution(distributionIdOrSlug: string) {
  const distribution = getCommunityMarketplaceDistributionById(distributionIdOrSlug);
  if (!distribution) return null;
  return communityRevenueSharingConfigs.find((config) => config.communityDistributionId === distribution.distribution.id) ?? null;
}

function buildRevenueSharingBoundaryNotes(contextType: RevenueSharingIntegratedContext["contextType"], notes: string[]) {
  const contextNotes =
    contextType === "tenant"
      ? ["Tenant isolation preserved."]
      : contextType === "curated-catalog"
        ? ["Curated catalog editorial rules preserved."]
        : contextType === "community-distribution"
          ? ["Federation trust boundaries preserved."]
          : ["Distribution and attribution boundaries preserved."];

  return Array.from(
    new Set([
      ...contextNotes,
      ...notes,
      "preview-only",
      "no payout",
      "no settlement",
      "no billing",
      "no treasury routing"
    ])
  );
}

function buildRevenueSharingIntegrationView(
  contextType: RevenueSharingIntegratedContext["contextType"],
  contextId: string,
  config: TenantRevenueSharingConfig | DistributionRevenueSharingConfig | CuratedCatalogRevenueSharingConfig | CommunityRevenueSharingConfig
): RevenueSharingIntegrationView {
  const policies = ("policyIds" in config ? config.policyIds : []).map(getRevenueSharingPolicyById).filter((view): view is RevenueSharingPolicyView => Boolean(view));
  const commissionModels = Array.from(
    new Map(
      policies
        .flatMap((policy) => policy.commissionModels)
        .map((view) => [view.model.id, view] as const)
    ).values()
  );
  const previews = Array.from(
    new Map(
      policies
        .map((policy) => resolveRevenueSharingPreview(policy.policy.id))
        .filter((view): view is RevenueSharingPreviewView => Boolean(view))
        .map((view) => [view.preview.id, view] as const)
    ).values()
  );
  const attributionSourceIds = "attributionSourceIds" in config ? config.attributionSourceIds : policies.flatMap((policy) => policy.policy.attributionSourceIds);
  const attributionSources = Array.from(
    new Map(
      attributionSourceIds
        .map(getAttributionSourceById)
        .filter((view): view is AttributionSourceView => Boolean(view))
        .map((view) => [view.source.id, view] as const)
    ).values()
  );
  const attributionResolutions = attributionSources
    .map((source) => resolveAttributionSplit(source.source.id))
    .filter((entry): entry is AttributionSplitResolution => Boolean(entry));
  const auditEntries = Array.from(
    new Map(
      policies
        .flatMap((policy) => listRevenueSharingAuditEntriesByPolicy(policy.policy.id))
        .map((entry) => [entry.id, entry] as const)
    ).values()
  );
  const policyIds = policies.map((policy) => policy.policy.id);
  const settlementBoundaryIds = policies.map((policy) => policy.settlementBoundary?.id).filter((value): value is string => Boolean(value));
  const previewIds = previews.map((preview) => preview.preview.id);
  const defaultPolicyId = "defaultPolicyId" in config ? config.defaultPolicyId : undefined;
  const boundaryNotes = buildRevenueSharingBoundaryNotes(
    contextType,
    [
      ...policies.flatMap((policy) => policy.boundaryNotes),
      ...previews.flatMap((preview) => preview.boundaryNotes),
      ...config.warnings,
      ...config.disclaimers
    ]
  );
  const integratedContext: RevenueSharingIntegratedContext = {
    contextType,
    tenantId: contextType === "tenant" ? contextId : policies[0]?.policy.tenantId,
    distributionChannelId: contextType === "distribution-channel" ? contextId : policies[0]?.policy.distributionChannelId,
    distributionProfileId: contextType === "distribution-profile" ? contextId : policies[0]?.policy.distributionProfileId,
    communityDistributionId: contextType === "community-distribution" ? contextId : policies[0]?.policy.communityDistributionId,
    curatedCatalogId: contextType === "curated-catalog" ? contextId : policies[0]?.policy.curatedCatalogId,
    policyId: defaultPolicyId ?? policyIds[0],
    commissionModelId: commissionModels[0]?.model.id,
    previewId: previews[0]?.preview.id,
    settlementBoundaryId: settlementBoundaryIds[0],
    canCalculatePreview: "canCalculatePreview" in config ? config.canCalculatePreview : false,
    canSettle: false,
    canTriggerPayout: false,
    canRouteTreasury: false,
    warnings: [...config.warnings],
    disclaimers: [...config.disclaimers]
  };
  const resolution: RevenueSharingResolution = {
    contextType,
    contextId,
    resolvedAt: new Date().toISOString(),
    policyIds,
    defaultPolicyId,
    commissionModelIds: commissionModels.map((model) => model.model.id),
    previewIds,
    settlementBoundaryIds,
    attributionSourceIds,
    appliedAttributionRuleIds: attributionResolutions.flatMap((entry) => entry.appliedRuleIds),
    blockedAttributionRuleIds: attributionResolutions.flatMap((entry) => entry.blockedRuleIds),
    warnings: [...config.warnings],
    disclaimers: [...config.disclaimers],
    canCalculatePreview: "canCalculatePreview" in config ? config.canCalculatePreview : false,
    canSettle: false,
    canTriggerPayout: false,
    canRouteTreasury: false
  };

  return {
    contextType,
    config,
    resolution,
    integratedContext,
    policies,
    commissionModels,
    previews,
    auditEntries,
    attributionSources,
    boundaryNotes
  };
}

export function resolveTenantRevenueSharing(tenantIdOrSlug: string) {
  const tenant = getTenantById(tenantIdOrSlug) ?? getTenantBySlug(tenantIdOrSlug);
  const config = tenant ? getTenantRevenueSharingConfigByTenant(tenant.id) : null;
  return tenant && config ? buildRevenueSharingIntegrationView("tenant", tenant.id, config) : null;
}

export function resolveDistributionChannelRevenueSharing(channelIdOrSlug: string) {
  const channel = getDistributionChannelById(channelIdOrSlug);
  const config = channel ? getDistributionRevenueSharingConfigByChannel(channel.channel.id) : null;
  return channel && config ? buildRevenueSharingIntegrationView("distribution-channel", channel.channel.id, config) : null;
}

export function resolveDistributionProfileRevenueSharing(profileIdOrSlug: string) {
  const profile = getDistributionProfileById(profileIdOrSlug);
  const config = profile ? getDistributionRevenueSharingConfigByProfile(profile.profile.id) : null;
  return profile && config ? buildRevenueSharingIntegrationView("distribution-profile", profile.profile.id, config) : null;
}

export function resolveCuratedCatalogRevenueSharing(catalogIdOrSlug: string) {
  const catalog = resolveCuratedCatalog(catalogIdOrSlug);
  const config = catalog ? getCuratedCatalogRevenueSharingConfigByCatalog(catalog.catalog.id) : null;
  return catalog && config ? buildRevenueSharingIntegrationView("curated-catalog", catalog.catalog.id, config) : null;
}

export function resolveCommunityRevenueSharing(distributionIdOrSlug: string) {
  const distribution = getCommunityMarketplaceDistributionById(distributionIdOrSlug);
  const config = distribution ? getCommunityRevenueSharingConfigByDistribution(distribution.distribution.id) : null;
  return distribution && config ? buildRevenueSharingIntegrationView("community-distribution", distribution.distribution.id, config) : null;
}

export function explainRevenueSharingBoundary(policyIdOrSlug: string) {
  return getRevenueSharingPolicyById(policyIdOrSlug)?.boundaryNotes ?? [];
}

export function discoverWalletAssets(walletAddress?: string): WalletDiscoveryView {
  const normalizedWallet = normalizeMockWalletAddress(walletAddress);

  if (!normalizedWallet || !isValidMockWalletAddress(walletAddress)) {
    return {
      walletAddress: walletAddress?.trim() ?? "",
      normalizedWallet,
      label: "Invalid mock wallet",
      status: "invalid-wallet",
      provider: null,
      assets: [],
      summary: buildWalletDiscoverySummary([]),
      boundaries: [
        "Wallet Discovery requires a mock wallet address.",
        "No wallet signature, wallet connection, on-chain read, indexer, provider API, custody or settlement was attempted."
      ]
    };
  }

  const record = walletDiscoveryRecords.find((item) => normalizeMockWalletAddress(item.walletAddress) === normalizedWallet);

  if (!record) {
    return {
      walletAddress: walletAddress?.trim() ?? "",
      normalizedWallet,
      label: "Wallet not found in mock discovery dataset",
      status: "wallet-not-found",
      provider: null,
      assets: [],
      summary: buildWalletDiscoverySummary([]),
      boundaries: [
        "Wallet was not found in the local mock discovery dataset.",
        "Discovery does not query a wallet provider, blockchain, indexer, subgraph or external API."
      ]
    };
  }

  const assets = record.assets.map(enrichDiscoveredAsset);

  return {
    walletAddress: record.walletAddress,
    normalizedWallet,
    label: record.label,
    status: assets.length ? "ready" : "empty",
    provider: record.provider,
    assets,
    summary: buildWalletDiscoverySummary(record.assets),
    boundaries: [
      "Wallet Discovery is mock/read-only.",
      "Discovered Asset records are not verified ownership, custody, permission, transfer authority or settlement eligibility.",
      "No wallet signatures, wallet connection, on-chain reads, indexer, subgraph, external API, custody, transfer, bridge or settlement are active."
    ]
  };
}

export function isExternalCollection(collection: MarketplaceCollection) {
  return collection.origin === "external" || collection.origin === "federated" || collection.isExternal === true || collection.isFederated === true;
}

export function getCollectionSourceLabel(collection: MarketplaceCollection) {
  return isExternalCollection(collection) ? "Federated Collection - provider-reported mock" : "Native Axodus mock collection";
}

function buildNativeCollectionBoundary(collection: MarketplaceCollection): FederationTrustBoundary {
  return {
    origin: "Axodus native mock collection",
    provider: "Axodus Marketplace mock data",
    validationStatus: collection.validationStatus === "compliant" ? "governance-reviewed" : "collection-reviewed",
    provenance: "Collection is represented from centralized Axodus Marketplace mock data.",
    riskClassification: collection.governanceStatus === "compliant" ? "low-mock" : "medium-mock",
    executionState: "non-executing",
    canDisplay: true,
    canTrade: false,
    canSettle: false,
    canBridge: false,
    notes: [
      "Native collection metrics are mock-derived for Marketplace UI readiness.",
      "No settlement, contract write, wallet signature, bridge execution or on-chain read is executed."
    ]
  };
}

function getCollectionBoundary(collection: MarketplaceCollection) {
  return collection.trustBoundary ?? buildNativeCollectionBoundary(collection);
}

function buildExternalMetricValue(collection: MarketplaceCollection, key: keyof ExternalCollectionStatistics, fallback: number) {
  const value = collection.externalStatistics?.[key];
  return typeof value === "number" ? value : fallback;
}

function buildCollectionMetrics(collection: MarketplaceCollection, collectionProducts: Product[]) {
  const listings = collectionProducts.filter((product) => product.status === "listed").length;
  const bids = collectionProducts.reduce((sum, product) => sum + (product.auction?.bidCount ?? 0), 0);
  const lowestProductPrice = collectionProducts.reduce<number | null>((lowest, product) => {
    if (lowest === null) return product.pricing.amount;
    return Math.min(lowest, product.pricing.amount);
  }, null);
  const external = isExternalCollection(collection);
  const floorPrice = external ? buildExternalMetricValue(collection, "floorPrice", 0) : collection.metrics?.floorPrice ?? lowestProductPrice ?? 0;
  const volume = external ? buildExternalMetricValue(collection, "volume", 0) : collection.metrics?.volume ?? collectionProducts.reduce((sum, product) => sum + product.pricing.amount, 0);
  const holders = external ? buildExternalMetricValue(collection, "holders", 0) : collection.metrics?.holders ?? Math.max(collectionProducts.length, 0);
  const recentActivity = external ? buildExternalMetricValue(collection, "recentActivity", 0) : collection.metrics?.recentActivity ?? bids + listings;
  const itemCount = external ? buildExternalMetricValue(collection, "itemCount", collectionProducts.length) : collectionProducts.length;
  const listingCount = external ? buildExternalMetricValue(collection, "listings", listings) : listings;
  const bidCount = external ? buildExternalMetricValue(collection, "bids", bids) : bids;
  const rankScore = volume + bidCount * 10 + recentActivity * 5 + holders;
  const source: CollectionView["metrics"]["source"] = external ? "provider-reported-mock" : "native-mock";

  return {
    itemCount,
    listings: listingCount,
    bids: bidCount,
    volume,
    holders,
    floorPrice,
    recentActivity,
    rankScore,
    ranking: 0,
    source,
    sourceLabel: getCollectionSourceLabel(collection),
    lastSyncedAt: collection.externalStatistics?.lastSyncedAt ?? collection.externalMetadata?.lastSyncedAt
  };
}

export function listCollections(): CollectionView[] {
  const displayableCollections = collections.filter((collection) => collection.trustBoundary?.canDisplay !== false && collection.displayStatus !== "blocked" && collection.displayStatus !== "quarantined");
  const views = displayableCollections.map((collection) => {
    const collectionProducts = products.filter((product) => product.collectionId === collection.id);
    const externalWarnings = [
      ...(collection.externalMetadata?.warnings ?? []),
      ...(collection.externalMetadata?.disclaimers ?? []),
      ...(collection.externalStatistics?.disclaimers ?? [])
    ];
    return {
      collection,
      products: collectionProducts,
      metrics: buildCollectionMetrics(collection, collectionProducts),
      boundaries: getCollectionBoundary(collection),
      labels: [
        collection.assetType,
        collection.chain,
        isExternalCollection(collection) ? "Federated Collection" : "Native Collection",
        collection.federationValidationStatus ?? collection.validationStatus,
        collection.riskClassification ?? "low-mock"
      ],
      warnings: externalWarnings
    };
  });

  const ranked = [...views].sort((left, right) => right.metrics.rankScore - left.metrics.rankScore || left.collection.name.localeCompare(right.collection.name));
  const rankByCollectionId = new Map(ranked.map((view, index) => [view.collection.id, index + 1]));

  return ranked.map((view) => ({
    ...view,
    metrics: {
      ...view.metrics,
      ranking: rankByCollectionId.get(view.collection.id) ?? 0
    }
  }));
}

export function getCollectionBySlug(slug: string) {
  return listCollections().find((view) => view.collection.slug === slug || view.collection.id === slug);
}

export function getCollectionForProduct(product: Product) {
  if (!product.collectionId) return null;
  return listCollections().find((view) => view.collection.id === product.collectionId) ?? null;
}

function getReputationLabel(seller: Seller): SellerProfileView["reputation"]["label"] {
  if (seller.governanceStanding === "restricted" || seller.governanceStanding === "suspended" || seller.governanceStanding === "sanctioned") {
    return "restricted-mock";
  }
  if (seller.reputation >= 95) return "excellent-mock";
  if (seller.reputation >= 80) return "trusted-mock";
  return "review-mock";
}

function getRiskLabel(seller: Seller): SellerProfileView["reputation"]["riskLabel"] {
  if (seller.riskScore <= 10) return "low";
  if (seller.riskScore <= 30) return "medium";
  return "high";
}

export function buildSellerProfileView(seller: Seller, sourceProducts: Product[] = products): SellerProfileView {
  const sellerProducts = sourceProducts.filter((product) => product.sellerId === seller.id);
  const sellerCollectionIds = new Set(sellerProducts.map((product) => product.collectionId).filter(Boolean));
  const sellerCollections = listCollections().filter((view) => sellerCollectionIds.has(view.collection.id));
  const totalBids = sellerProducts.reduce((sum, product) => sum + (product.auction?.bidCount ?? 0), 0);
  const mockVolume = sellerProducts.reduce((sum, product) => sum + product.pricing.amount, 0);
  const activeListings = sellerProducts.filter((product) => product.status === "listed").length;
  const mockSales = sellerProducts.filter((product) => product.status === "listed" && product.governanceStatus !== "restricted").length + totalBids;
  const latestProducts = [...sellerProducts].sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt));
  const activity = latestProducts.slice(0, 4).map((product) => ({
    id: `activity-${seller.id}-${product.id}`,
    label: product.auction ? "Auction activity mock" : "Listing activity mock",
    timestamp: product.updatedAt,
    detail: `${product.title} is ${product.status} with ${product.governanceStatus} governance standing.`
  }));

  if (activity.length === 0) {
    activity.push({
      id: `activity-${seller.id}-empty`,
      label: "No listing activity",
      timestamp: new Date(0).toISOString(),
      detail: "This mock seller has no listed Marketplace assets yet."
    });
  }

  return {
    seller,
    products: sellerProducts,
    collections: sellerCollections,
    metrics: {
      listings: sellerProducts.length,
      activeListings,
      mockSales,
      mockVolume,
      totalBids,
      collections: sellerCollections.length,
      averagePrice: sellerProducts.length ? Number((mockVolume / sellerProducts.length).toFixed(2)) : 0,
      nftBoundListings: sellerProducts.filter((product) => product.nftBound).length
    },
    reputation: {
      score: seller.reputation,
      label: getReputationLabel(seller),
      riskLabel: getRiskLabel(seller)
    },
    activity
  };
}

export function getSellerProfileById(id: string) {
  const seller = getSellerById(id);
  return seller ? buildSellerProfileView(seller, products) : null;
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductByItemRef(chain: string, contract: string, tokenId: string) {
  return products.find((product) => {
    return (
      product.supportedChains.some((supportedChain) => supportedChain.toLowerCase() === chain.toLowerCase()) &&
      product.contractAddress?.toLowerCase() === contract.toLowerCase() &&
      product.tokenId?.toLowerCase() === tokenId.toLowerCase()
    );
  });
}

function createFallbackAssetRegistry(product: Product): AssetRegistryRecord {
  return {
    productId: product.id,
    currentOwner: product.nftBound ? "0xMockOwnerUnavailable" : "mock-license-holder-unassigned",
    ownershipHistory: [],
    transferHistory: [],
    licenseHistory: [],
    validation: {
      metadata: product.governanceStatus,
      contract: product.contractAddress ? product.governanceStatus : "under-review",
      collection: product.collectionId ? product.governanceStatus : "under-review",
      origin: product.governanceStatus,
      royalty: product.royaltyModel.standard === "None" ? "under-review" : product.governanceStatus,
      notes: ["Fallback mock registry generated from product metadata", "No chain read, indexer, storage validation or settlement executed"]
    }
  };
}

export function getAssetRegistryForProduct(product: Product): AssetRegistryView {
  const registry = assetRegistry.find((record) => record.productId === product.id) ?? createFallbackAssetRegistry(product);
  const collection = getCollectionForProduct(product);
  const seller = getSellerById(product.sellerId);
  const license = getLicenseForProduct(product);

  return {
    product,
    collection,
    seller,
    license,
    registry,
    metadataAttributes: product.metadataAttributes ?? [],
    boundaries: [
      {
        label: "Contract boundary",
        value: product.contractAddress ?? "mock offchain license",
        detail: product.contractAddress ? "Contract reference is mock metadata only; no contract read or write is executed." : "Offchain license preview has no contract execution."
      },
      {
        label: "Storage boundary",
        value: product.greenfieldBucket ?? "not required",
        detail: product.greenfieldBucket ? "Greenfield bucket is a mock access boundary; no production storage access is executed." : "No storage delivery boundary is required for this asset."
      },
      {
        label: "Bridge boundary",
        value: product.bridgeReadiness.layerZeroReady ? "future-ready metadata" : "deferred",
        detail: product.bridgeReadiness.notes
      },
      {
        label: "Settlement boundary",
        value: product.pricing.settlementMode,
        detail: "Pricing, bids and purchases remain mock-first with no payment, settlement or treasury routing."
      }
    ]
  };
}

export function getAssetRegistryByProductSlug(slug: string) {
  const product = getProductBySlug(slug);
  return product ? getAssetRegistryForProduct(product) : null;
}

export function buildMarketplaceAnalytics(sourceProducts: Product[] = products, sourceSellers: Seller[] = sellers): MarketplaceAnalyticsView {
  const listedProducts = sourceProducts.filter((product) => product.status === "listed");
  const activeAuctions = sourceProducts.filter((product) => product.auction?.status === "active");
  const totalVolume = listedProducts.reduce((sum, product) => sum + product.pricing.amount, 0);
  const floorPrice = listedProducts.reduce<number | null>((lowest, product) => {
    if (lowest === null) return product.pricing.amount;
    return Math.min(lowest, product.pricing.amount);
  }, null);
  const totalBids = sourceProducts.reduce((sum, product) => sum + (product.auction?.bidCount ?? 0), 0);
  const categories = sourceProducts.reduce<Record<string, number>>((acc, product) => {
    acc[product.category] = (acc[product.category] ?? 0) + 1;
    return acc;
  }, {});
  const restrictedProducts = sourceProducts.filter((product) => product.governanceStatus === "restricted" || product.governanceStatus === "suspended").length;
  const reviewProducts = sourceProducts.filter((product) => product.governanceStatus === "under-review").length;
  const marketStatus =
    restrictedProducts > 0 ? "restricted-mock" : reviewProducts > sourceProducts.length / 2 ? "review-needed-mock" : "healthy-mock";
  const recentActivity = [...sourceProducts]
    .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt))
    .slice(0, 6)
    .map((product) => ({
      id: `market-activity-${product.id}`,
      label: product.auction ? "Auction activity mock" : "Listing activity mock",
      timestamp: product.updatedAt,
      detail: `${product.title} is ${product.status} with ${product.pricing.amount} ${product.pricing.currency} mock price and ${product.auction?.bidCount ?? 0} bids.`
    }));
  const collectionsSummary = listCollections()
    .filter((view) => sourceProducts.some((product) => product.collectionId === view.collection.id))
    .map((view) => ({
      id: view.collection.id,
      name: view.collection.name,
      slug: view.collection.slug,
      volume: view.metrics.volume,
      floorPrice: view.metrics.floorPrice,
      itemCount: view.metrics.itemCount,
      bids: view.metrics.bids,
      ranking: view.metrics.ranking
    }))
    .sort((left, right) => right.volume - left.volume || left.ranking - right.ranking);
  const sellersSummary = sourceSellers
    .map((seller) => {
      const profile = buildSellerProfileView(seller, sourceProducts);
      return {
        id: seller.id,
        name: seller.name,
        listings: profile.metrics.listings,
        mockVolume: profile.metrics.mockVolume,
        mockSales: profile.metrics.mockSales,
        reputation: seller.reputation
      };
    })
    .filter((seller) => seller.listings > 0)
    .sort((left, right) => right.mockVolume - left.mockVolume || right.reputation - left.reputation);

  return {
    volume: {
      totalVolume,
      averagePrice: listedProducts.length ? Number((totalVolume / listedProducts.length).toFixed(2)) : 0,
      floorPrice: floorPrice ?? 0,
      royaltyPreview: sourceProducts.reduce((sum, product) => sum + product.royaltyModel.previewAmount, 0),
      salesCount: listedProducts.filter((product) => product.governanceStatus !== "restricted" && product.governanceStatus !== "suspended").length + totalBids
    },
    activity: {
      activeListings: listedProducts.length,
      activeAuctions: activeAuctions.length,
      totalBids,
      bidActivity: activeAuctions.reduce((sum, product) => sum + (product.auction?.bidCount ?? 0), 0),
      recentActivity
    },
    market: {
      totalProducts: sourceProducts.length,
      nftBoundProducts: sourceProducts.filter((product) => product.nftBound).length,
      erc721Products: sourceProducts.filter((product) => product.tokenStandard === "ERC721").length,
      erc1155Products: sourceProducts.filter((product) => product.tokenStandard === "ERC1155").length,
      categories,
      marketStatus
    },
    collections: collectionsSummary,
    sellers: sellersSummary,
    notes: [
      "Analytics are derived from centralized mock Marketplace data.",
      "No tracking events, BI pipeline, analytical database, billing analytics, settlement visibility or Marketplace Intelligence Phase 07 runtime is active.",
      "Metrics are operational transparency previews for Phase 01 NFT Marketplace consolidation."
    ]
  };
}

export function listSellers() {
  return sellers;
}

export function getSellerById(id: string) {
  return sellers.find((seller) => seller.id === id);
}

export function listLicenses() {
  return licenses;
}

export function getLicenseForProduct(product: Product) {
  return licenses.find((license) => license.type === product.licenseType) ?? licenses[0];
}

export function listBoundaries() {
  return boundaries;
}

export function calculateDashboardMetrics() {
  const categories = products.reduce<Record<string, number>>((acc, product) => {
    acc[product.category] = (acc[product.category] ?? 0) + 1;
    return acc;
  }, {});

  const deliveryTelemetry = getDeliveryTelemetrySummary(products);

  return {
    totalProducts: products.length,
    activeListings: products.filter((product) => product.status === "listed").length,
    nftBoundProducts: products.filter((product) => product.nftBound).length,
    pendingGovernance: products.filter((product) => product.governanceStatus === "under-review").length,
    restrictedProducts: products.filter((product) => product.governanceStatus === "restricted").length,
    verifiedSellers: sellers.filter((seller) => seller.governanceStanding === "verified").length,
    royaltyPreview: products.reduce((sum, product) => sum + product.royaltyModel.previewAmount, 0),
    categories,
    protectedAssets: products.filter((product) => product.visibility !== "public" || product.accessModel !== "public").length,
    signedUrlPreviews: products.filter((product) => product.signedUrlPreviewAvailable).length,
    entitlementChecks: deliveryTelemetry.entitlementChecks,
    deliveryRevocations: deliveryTelemetry.revocations,
    deliveryPreviewIssuance: deliveryTelemetry.previewIssuance,
    deliveryBlockedEvents: deliveryTelemetry.blockedEvents
  };
}

function getInsightSourceLabel(insight: MarketplaceInsight) {
  if (insight.tenantId) return tenants.find((tenant) => tenant.id === insight.tenantId)?.displayName ?? insight.tenantId;
  if (insight.curatedCatalogId) return curatedCatalogs.find((catalog) => catalog.id === insight.curatedCatalogId)?.displayName ?? insight.curatedCatalogId;
  if (insight.distributionChannelId) return distributionChannels.find((channel) => channel.id === insight.distributionChannelId)?.displayName ?? insight.distributionChannelId;
  if (insight.distributionProfileId) return distributionProfiles.find((profile) => profile.id === insight.distributionProfileId)?.displayName ?? insight.distributionProfileId;
  if (insight.communityDistributionId) return communityDistributions.find((distribution) => distribution.id === insight.communityDistributionId)?.displayName ?? insight.communityDistributionId;
  if (insight.revenueSharingPolicyId) return revenueSharingPolicies.find((policy) => policy.id === insight.revenueSharingPolicyId)?.displayName ?? insight.revenueSharingPolicyId;
  if (insight.productId) return products.find((product) => product.id === insight.productId)?.title ?? insight.productId;
  if (insight.collectionId) return collections.find((collection) => collection.id === insight.collectionId)?.name ?? insight.collectionId;
  return insight.sourceRefId;
}

function buildMarketplaceInsightBoundaryNotes(insight: MarketplaceInsight, boundary: DataBoundary | null) {
  return [
    "Marketplace Insight is mock intelligence and config-first intelligence only.",
    "No tracking real, no analytics real, no BI, no scoring real, no recommendation engine, no automated decisioning, no personalization, no profiling and no wallet tracking are active.",
    "Insight cannot recommend automatically, rank automatically, trigger commercial action or export data.",
    ...(boundary?.warnings ?? []),
    ...(boundary?.disclaimers ?? []),
    ...insight.warnings,
    ...insight.disclaimers
  ];
}

function buildMarketplaceInsightView(insight: MarketplaceInsight): MarketplaceInsightView {
  const dataBoundary = dataBoundaries.find((boundary) => boundary.id === insight.dataBoundaryId) ?? null;
  return {
    insight,
    signals: insightSignals.filter((signal) => insight.signalIds.includes(signal.id)),
    snapshot: intelligenceSnapshots.find((snapshot) => snapshot.id === insight.snapshotId) ?? null,
    dataBoundary,
    auditNotes: intelligenceAuditNotes.filter((note) => note.insightId === insight.id),
    sourceLabel: getInsightSourceLabel(insight),
    boundaryNotes: buildMarketplaceInsightBoundaryNotes(insight, dataBoundary)
  };
}

function getSnapshotSourceLabel(snapshot: IntelligenceSnapshot) {
  if (snapshot.tenantId) return tenants.find((tenant) => tenant.id === snapshot.tenantId)?.displayName ?? snapshot.tenantId;
  if (snapshot.curatedCatalogId) return curatedCatalogs.find((catalog) => catalog.id === snapshot.curatedCatalogId)?.displayName ?? snapshot.curatedCatalogId;
  if (snapshot.distributionChannelId) return distributionChannels.find((channel) => channel.id === snapshot.distributionChannelId)?.displayName ?? snapshot.distributionChannelId;
  if (snapshot.distributionProfileId) return distributionProfiles.find((profile) => profile.id === snapshot.distributionProfileId)?.displayName ?? snapshot.distributionProfileId;
  if (snapshot.communityDistributionId) return communityDistributions.find((distribution) => distribution.id === snapshot.communityDistributionId)?.displayName ?? snapshot.communityDistributionId;
  if (snapshot.revenueSharingPolicyId) return revenueSharingPolicies.find((policy) => policy.id === snapshot.revenueSharingPolicyId)?.displayName ?? snapshot.revenueSharingPolicyId;
  if (snapshot.collectionId) return collections.find((collection) => collection.id === snapshot.collectionId)?.name ?? snapshot.collectionId;
  return snapshot.scopeId;
}

function buildIntelligenceSnapshotBoundaryNotes(snapshot: IntelligenceSnapshot, boundary: DataBoundary | null) {
  return [
    `${snapshot.title} is a static mock Intelligence Snapshot derived from mock data only.`,
    "No tracking real, no events real, no analytics pipeline, no data warehouse, no BI, no ML, no scoring and no automated decisioning are active.",
    "Snapshot cannot export data, trigger commercial action, recommend automatically or rank automatically.",
    ...(boundary?.warnings ?? []),
    ...(boundary?.disclaimers ?? []),
    ...snapshot.warnings,
    ...snapshot.disclaimers
  ];
}

function buildIntelligenceSnapshotView(snapshot: IntelligenceSnapshot): IntelligenceSnapshotView {
  const dataBoundary = dataBoundaries.find((boundary) => boundary.id === snapshot.dataBoundaryId) ?? null;
  return {
    snapshot,
    signals: insightSignals.filter((signal) => snapshot.signalIds.includes(signal.id)),
    insights: marketplaceInsightRecords.filter((insight) => snapshot.insightIds.includes(insight.id)),
    dataBoundary,
    sourceLabel: getSnapshotSourceLabel(snapshot),
    boundaryNotes: buildIntelligenceSnapshotBoundaryNotes(snapshot, dataBoundary)
  };
}

export function listMarketplaceInsights() {
  return marketplaceInsightRecords.map(buildMarketplaceInsightView);
}

export function getMarketplaceInsightById(insightIdOrSlug: string) {
  const insight = marketplaceInsightRecords.find((entry) => entry.id === insightIdOrSlug || entry.slug === insightIdOrSlug);
  return insight ? buildMarketplaceInsightView(insight) : null;
}

export function listInsightSignalsByInsight(insightIdOrSlug: string) {
  return getMarketplaceInsightById(insightIdOrSlug)?.signals ?? [];
}

export function listInsightSignals() {
  return insightSignals;
}

export function getInsightSignalById(signalIdOrSlug: string) {
  return insightSignals.find((signal) => signal.id === signalIdOrSlug || signal.slug === signalIdOrSlug) ?? null;
}

export function listInsightSignalsByScope(scope: MarketplaceInsight["scope"], scopeId?: string) {
  return insightSignals.filter((signal) => signal.scope === scope && (!scopeId || signal.sourceRefId === scopeId));
}

export function listIntelligenceSnapshots() {
  return intelligenceSnapshots.map(buildIntelligenceSnapshotView);
}

export function getIntelligenceSnapshotById(snapshotIdOrSlug: string) {
  const snapshot = intelligenceSnapshots.find((entry) => entry.id === snapshotIdOrSlug || entry.slug === snapshotIdOrSlug);
  return snapshot ? buildIntelligenceSnapshotView(snapshot) : null;
}

export function resolveIntelligenceSnapshot(snapshotIdOrSlug: string) {
  return getIntelligenceSnapshotById(snapshotIdOrSlug);
}

export function listIntelligenceSnapshotsByScope(scope: SnapshotScope, scopeId?: string) {
  return intelligenceSnapshots.filter((snapshot) => snapshot.scope === scope && (!scopeId || snapshot.scopeId === scopeId)).map(buildIntelligenceSnapshotView);
}

function resolveFirstSnapshotByScope(scope: SnapshotScope, scopeId: string) {
  return listIntelligenceSnapshotsByScope(scope, scopeId)[0] ?? null;
}

export function resolveMarketplaceIntelligenceSnapshot() {
  return resolveFirstSnapshotByScope("marketplace", "marketplace-global");
}

export function resolveTenantIntelligenceSnapshot(tenantId: string) {
  return intelligenceSnapshots
    .filter((snapshot) => snapshot.scope === "tenant" && (snapshot.scopeId === tenantId || snapshot.tenantId === tenantId))
    .map(buildIntelligenceSnapshotView)[0] ?? null;
}

export function resolveCatalogIntelligenceSnapshot(curatedCatalogId: string) {
  return intelligenceSnapshots
    .filter((snapshot) => snapshot.scope === "curated-catalog" && (snapshot.scopeId === curatedCatalogId || snapshot.curatedCatalogId === curatedCatalogId))
    .map(buildIntelligenceSnapshotView)[0] ?? null;
}

export function resolveDistributionIntelligenceSnapshot(distributionId: string) {
  return intelligenceSnapshots
    .filter(
      (snapshot) =>
        (snapshot.scope === "distribution-channel" || snapshot.scope === "distribution-profile") &&
        (snapshot.scopeId === distributionId || snapshot.distributionChannelId === distributionId || snapshot.distributionProfileId === distributionId)
    )
    .map(buildIntelligenceSnapshotView)[0] ?? null;
}

export function resolveRevenueIntelligenceSnapshot(revenueSharingPolicyId: string) {
  return intelligenceSnapshots
    .filter((snapshot) => snapshot.scope === "revenue-sharing-policy" && (snapshot.scopeId === revenueSharingPolicyId || snapshot.revenueSharingPolicyId === revenueSharingPolicyId))
    .map(buildIntelligenceSnapshotView)[0] ?? null;
}

export function resolveCommunityIntelligenceSnapshot(communityDistributionId: string) {
  return intelligenceSnapshots
    .filter((snapshot) => snapshot.scope === "community-distribution" && (snapshot.scopeId === communityDistributionId || snapshot.communityDistributionId === communityDistributionId))
    .map(buildIntelligenceSnapshotView)[0] ?? null;
}

export function resolveFederationIntelligenceSnapshot(collectionId: string) {
  return intelligenceSnapshots
    .filter((snapshot) => snapshot.scope === "collection" && (snapshot.scopeId === collectionId || snapshot.collectionId === collectionId))
    .map(buildIntelligenceSnapshotView)[0] ?? null;
}

export function resolveDataBoundary(scopeOrBoundaryId: DataBoundary["scope"] | string, scopeId?: string) {
  return dataBoundaries.find((boundary) => boundary.id === scopeOrBoundaryId || (boundary.scope === scopeOrBoundaryId && (!scopeId || boundary.scopeId === scopeId))) ?? null;
}

export function listDataBoundaries() {
  return dataBoundaries;
}

export function validateMarketplaceInsightMockOnly(insightIdOrSlug: string) {
  const view = getMarketplaceInsightById(insightIdOrSlug);
  if (!view) return null;
  const { insight, dataBoundary, signals, snapshot } = view;
  const isMockOnly =
    insight.isSimulated &&
    !insight.usesRealTracking &&
    !insight.usesPersonalData &&
    !insight.usesBehavioralData &&
    !insight.usesWalletProfiling &&
    !insight.usesAutomatedDecisioning &&
    !insight.canRecommendAutomatically &&
    !insight.canRankAutomatically &&
    !insight.canTriggerCommercialAction &&
    Boolean(dataBoundary) &&
    !dataBoundary?.usesRealTracking &&
    !dataBoundary?.usesAnalyticsPipeline &&
    !dataBoundary?.usesPersonalData &&
    !dataBoundary?.usesBehavioralData &&
    !dataBoundary?.usesWalletProfiling &&
    !dataBoundary?.usesBI &&
    !dataBoundary?.usesMLModel &&
    !dataBoundary?.usesAutomatedDecisioning &&
    !dataBoundary?.canExportData &&
    !dataBoundary?.canTriggerAction &&
    signals.every((signal) => signal.isSimulated && signal.isDerivedFromMockData && !signal.usesRealEvents && !signal.usesRealTracking && !signal.usesAnalyticsPipeline) &&
    (!snapshot || (snapshot.isSimulated && snapshot.isStaticMock && snapshot.isDerivedFromMockData && !snapshot.usesRealTracking && !snapshot.usesBI && !snapshot.usesMLModel && !snapshot.usesAutomatedDecisioning));

  return {
    insightId: insight.id,
    isMockOnly,
    isNoTracking: !insight.usesRealTracking && !dataBoundary?.usesRealTracking && signals.every((signal) => !signal.usesRealTracking),
    isNoBI: !dataBoundary?.usesBI && !snapshot?.usesBI,
    isNoScoring: true,
    isNoAutomatedDecisioning: !insight.usesAutomatedDecisioning && !dataBoundary?.usesAutomatedDecisioning && !snapshot?.usesAutomatedDecisioning,
    boundaryNotes: view.boundaryNotes
  };
}

export function validateIntelligenceSnapshotMockOnly(snapshotIdOrSlug: string) {
  const view = getIntelligenceSnapshotById(snapshotIdOrSlug);
  if (!view) return null;
  const { snapshot, signals, dataBoundary } = view;
  const isMockOnly =
    snapshot.isSimulated &&
    snapshot.isStaticMock &&
    snapshot.isDerivedFromMockData &&
    !snapshot.usesRealTracking &&
    !snapshot.usesBI &&
    !snapshot.usesMLModel &&
    !snapshot.usesAutomatedDecisioning &&
    Boolean(dataBoundary) &&
    !dataBoundary?.usesRealTracking &&
    !dataBoundary?.usesAnalyticsPipeline &&
    !dataBoundary?.usesBI &&
    !dataBoundary?.usesMLModel &&
    !dataBoundary?.usesAutomatedDecisioning &&
    !dataBoundary?.canExportData &&
    !dataBoundary?.canTriggerAction &&
    signals.every((signal) => signal.isSimulated && signal.isDerivedFromMockData && !signal.usesRealEvents && !signal.usesRealTracking && !signal.usesAnalyticsPipeline);

  return {
    snapshotId: snapshot.id,
    isMockOnly,
    isStaticMock: snapshot.isStaticMock,
    isDerivedFromMockData: snapshot.isDerivedFromMockData,
    isNoTracking: !snapshot.usesRealTracking && !dataBoundary?.usesRealTracking && signals.every((signal) => !signal.usesRealTracking && !signal.usesRealEvents),
    isNoBI: !snapshot.usesBI && !dataBoundary?.usesBI,
    isNoML: !snapshot.usesMLModel && !dataBoundary?.usesMLModel,
    isNoAutomatedDecisioning: !snapshot.usesAutomatedDecisioning && !dataBoundary?.usesAutomatedDecisioning && !dataBoundary?.canTriggerAction
  };
}

const intelligencePanelBadges = ["mock-only", "no-tracking", "no-BI", "no-scoring", "no-recommendation-engine", "no-automated-decisioning"];

function buildMarketplaceIntelligencePanelView(
  panelType: MarketplaceIntelligencePanelView["panelType"],
  title: string,
  snapshot: IntelligenceSnapshotView | null
): MarketplaceIntelligencePanelView {
  return {
    panelType,
    title,
    snapshot,
    badges: intelligencePanelBadges,
    boundaryWarnings: snapshot?.boundaryNotes ?? [
      "No Intelligence Snapshot is configured for this mock context.",
      "No analytics real, tracking real, BI real, scoring real, recommendation engine or automated decisioning was attempted."
    ],
    canUseAnalyticsReal: false,
    canUseTrackingReal: false,
    canUseBIReal: false,
    canScore: false,
    canRecommendAutomatically: false,
    canUseAutomatedDecisioning: false,
    canExportData: false
  };
}

export function resolveMarketplaceIntelligencePanel() {
  return buildMarketplaceIntelligencePanelView("marketplace", "Marketplace Intelligence Panel", resolveMarketplaceIntelligenceSnapshot());
}

export function resolveTenantIntelligencePanel(tenantId: string) {
  return buildMarketplaceIntelligencePanelView("tenant", "Tenant Intelligence Panel", resolveTenantIntelligenceSnapshot(tenantId));
}

export function resolveCatalogIntelligencePanel(curatedCatalogId: string) {
  return buildMarketplaceIntelligencePanelView("catalog", "Catalog Intelligence Panel", resolveCatalogIntelligenceSnapshot(curatedCatalogId));
}

export function resolveDistributionIntelligencePanel(distributionId: string) {
  return buildMarketplaceIntelligencePanelView("distribution", "Distribution Intelligence Panel", resolveDistributionIntelligenceSnapshot(distributionId));
}

export function resolveCommunityIntelligencePanel(communityDistributionId: string) {
  return buildMarketplaceIntelligencePanelView("community", "Community Intelligence Panel", resolveCommunityIntelligenceSnapshot(communityDistributionId));
}

export function resolveAttributionIntelligencePanel(attributionSourceIdOrSlug: string) {
  const sourceView = getAttributionSourceById(attributionSourceIdOrSlug) ?? getAttributionSourceBySlug(attributionSourceIdOrSlug);
  const distributionId = sourceView?.channel?.channel.id ?? sourceView?.source.channelId ?? "";
  return buildMarketplaceIntelligencePanelView("attribution", "Attribution Intelligence Panel", distributionId ? resolveDistributionIntelligenceSnapshot(distributionId) : null);
}

function getRecommendationTargetLabel(preview: RecommendationPreview) {
  if (preview.targetType === "product") return products.find((product) => product.id === preview.targetId)?.title ?? preview.targetId;
  if (preview.targetType === "collection") return collections.find((collection) => collection.id === preview.targetId)?.name ?? preview.targetId;
  if (preview.targetType === "curated-catalog") return curatedCatalogs.find((catalog) => catalog.id === preview.targetId)?.displayName ?? preview.targetId;
  if (preview.targetType === "tenant") return tenants.find((tenant) => tenant.id === preview.targetId)?.displayName ?? preview.targetId;
  if (preview.targetType === "distribution-channel") return distributionChannels.find((channel) => channel.id === preview.targetId)?.displayName ?? preview.targetId;
  if (preview.targetType === "community-distribution") return communityDistributions.find((distribution) => distribution.id === preview.targetId)?.displayName ?? preview.targetId;
  return preview.targetId;
}

function buildRecommendationBoundaryNotes(preview: RecommendationPreview, rankingExplanation: RankingExplanation | null, dataBoundary: DataBoundary | null) {
  return [
    "Recommendation Preview is preview-only and mock/config-first.",
    "Ranking Explanation is editorial mock or manual mock only.",
    "No recommendation engine, no automated ranking, no personalization, no profiling, no behavioral tracking, no wallet profiling, no automated decisioning and no commercial action are active.",
    ...(dataBoundary?.warnings ?? []),
    ...(dataBoundary?.disclaimers ?? []),
    ...(rankingExplanation?.warnings ?? []),
    ...(rankingExplanation?.disclaimers ?? []),
    ...preview.warnings,
    ...preview.disclaimers
  ];
}

function buildRecommendationPreviewView(preview: RecommendationPreview): RecommendationPreviewView {
  const rankingExplanation = rankingExplanations.find((explanation) => explanation.id === preview.rankingExplanationId) ?? null;
  const dataBoundary = dataBoundaries.find((boundary) => boundary.id === preview.dataBoundaryId) ?? null;
  return {
    preview,
    rankingExplanation,
    mockSignals: rankingExplanation ? insightSignals.filter((signal) => rankingExplanation.mockSignalIds.includes(signal.id)) : [],
    dataBoundary,
    targetLabel: getRecommendationTargetLabel(preview),
    boundaryNotes: buildRecommendationBoundaryNotes(preview, rankingExplanation, dataBoundary)
  };
}

export function listRecommendationPreviews() {
  return recommendationPreviews.map(buildRecommendationPreviewView);
}

export function getRecommendationPreviewById(previewIdOrSlug: string) {
  const preview = recommendationPreviews.find((entry) => entry.id === previewIdOrSlug || entry.slug === previewIdOrSlug);
  return preview ? buildRecommendationPreviewView(preview) : null;
}

export function listRecommendationPreviewsByScope(scope: RecommendationPreview["scope"], scopeId?: string) {
  return recommendationPreviews.filter((preview) => preview.scope === scope && (!scopeId || preview.scopeId === scopeId)).map(buildRecommendationPreviewView);
}

export function listRankingExplanations() {
  return rankingExplanations;
}

export function getRankingExplanationById(explanationIdOrSlug: string) {
  return rankingExplanations.find((entry) => entry.id === explanationIdOrSlug || entry.slug === explanationIdOrSlug) ?? null;
}

export function listRankingExplanationsByScope(scope: RankingExplanation["scope"], scopeId?: string) {
  return rankingExplanations.filter((explanation) => explanation.scope === scope && (!scopeId || explanation.scopeId === scopeId));
}

export function explainRecommendationRanking(previewIdOrSlug: string) {
  const view = getRecommendationPreviewById(previewIdOrSlug);
  if (!view) return [];
  return [
    view.preview.reason,
    view.preview.discoveryNote,
    view.rankingExplanation?.reason ?? "No Ranking Explanation configured.",
    view.rankingExplanation?.editorialReason ?? "No Editorial Ranking Notes configured.",
    view.rankingExplanation?.editorialRankingNote ?? "No Editorial Ranking Note configured.",
    ...view.boundaryNotes
  ];
}

export function validateRecommendationPreviewMockOnly(previewIdOrSlug: string) {
  const view = getRecommendationPreviewById(previewIdOrSlug);
  if (!view) return null;
  const { preview, rankingExplanation, dataBoundary } = view;
  const isMockOnly =
    preview.isSimulated &&
    !preview.isPersonalized &&
    !preview.usesBehavioralData &&
    !preview.usesWalletProfiling &&
    !preview.usesAutomatedRanking &&
    !preview.usesRecommendationEngine &&
    !preview.canTriggerAction &&
    Boolean(rankingExplanation) &&
    !rankingExplanation?.isAlgorithmic &&
    !rankingExplanation?.usesBehavioralData &&
    !rankingExplanation?.usesPersonalization &&
    !rankingExplanation?.usesAutomatedDecisioning &&
    Boolean(dataBoundary) &&
    !dataBoundary?.usesRealTracking &&
    !dataBoundary?.usesBehavioralData &&
    !dataBoundary?.usesWalletProfiling &&
    !dataBoundary?.usesBI &&
    !dataBoundary?.usesMLModel &&
    !dataBoundary?.usesAutomatedDecisioning &&
    !dataBoundary?.canExportData &&
    !dataBoundary?.canTriggerAction;

  return {
    previewId: preview.id,
    isMockOnly,
    isPreviewOnly: preview.status === "preview-only" || preview.status === "editorial-mock" || preview.status === "manual-review-required",
    isNoRecommendationEngine: !preview.usesRecommendationEngine,
    isNoAutomatedRanking: !preview.usesAutomatedRanking && !rankingExplanation?.isAlgorithmic,
    isNoPersonalization: !preview.isPersonalized && !rankingExplanation?.usesPersonalization,
    isNoProfiling: !preview.usesWalletProfiling && !preview.usesBehavioralData,
    isNoAutomatedDecisioning: !preview.canTriggerAction && !rankingExplanation?.usesAutomatedDecisioning && !dataBoundary?.canTriggerAction
  };
}

function getDataBoundaryById(boundaryId?: string) {
  return boundaryId ? dataBoundaries.find((boundary) => boundary.id === boundaryId) ?? null : null;
}

function getSettlementBoundaryById(boundaryId?: string) {
  return boundaryId ? settlementBoundaries.find((boundary) => boundary.id === boundaryId) ?? null : null;
}

function getRevenueSummaryByPolicy(policyIdOrSlug: string) {
  const policy = getRevenueSharingPolicyByIdOrSlug(policyIdOrSlug);
  const key = policy?.id ?? policyIdOrSlug;
  return revenueIntelligenceSummaries.find((summary) => summary.policyId === key || summary.id === policyIdOrSlug || summary.slug === policyIdOrSlug) ?? null;
}

function buildRevenueTrustRiskBoundaryNotes(view: Omit<RevenueTrustRiskIntelligenceView, "boundaryNotes">) {
  return [
    "Revenue Intelligence Summary is mock/config-first and cannot become financial BI.",
    "Risk Trust Insight is mock/config-first and cannot become risk scoring real or trust scoring real.",
    "No financial BI, no accounting, no tax, no settlement, no payout, no billing, no risk scoring, no trust scoring, no automated decisioning, no automated blocking, no automated approval and no automated monetization are active.",
    ...(view.dataBoundary?.warnings ?? []),
    ...(view.dataBoundary?.disclaimers ?? []),
    ...(view.revenueSummary?.warnings ?? []),
    ...(view.revenueSummary?.disclaimers ?? []),
    ...(view.revenuePreviewInsight?.warnings ?? []),
    ...(view.revenuePreviewInsight?.disclaimers ?? []),
    ...(view.settlementBoundaryInsight?.warnings ?? []),
    ...(view.settlementBoundaryInsight?.disclaimers ?? []),
    ...view.riskTrustInsights.flatMap((insight) => [...insight.warnings, ...insight.disclaimers]),
    ...(view.federationContext?.warnings ?? []),
    ...(view.federationContext?.disclaimers ?? []),
    ...(view.providerValidationInsight?.warnings ?? []),
    ...(view.providerValidationInsight?.disclaimers ?? []),
    ...(view.provenanceInsight?.warnings ?? []),
    ...(view.provenanceInsight?.disclaimers ?? [])
  ];
}

function buildRevenueTrustRiskIntelligenceView(input: {
  revenueSummary?: RevenueIntelligenceSummary | null;
  revenuePreviewInsight?: RevenuePreviewInsight | null;
  settlementBoundaryInsight?: SettlementBoundaryInsight | null;
  riskTrustInsights?: RiskTrustInsight[];
  federationContext?: FederationIntelligenceContext | null;
}): RevenueTrustRiskIntelligenceView {
  const revenueSummary = input.revenueSummary ?? null;
  const revenuePreviewInsight = input.revenuePreviewInsight ?? (revenueSummary ? revenuePreviewInsights.find((insight) => insight.id === revenueSummary.revenuePreviewInsightId) ?? null : null);
  const settlementBoundaryInsight =
    input.settlementBoundaryInsight ?? (revenueSummary ? settlementBoundaryInsights.find((insight) => insight.id === revenueSummary.settlementBoundaryInsightId) ?? null : null);
  const federationContext = input.federationContext ?? null;
  const riskTrustInsightList = input.riskTrustInsights ?? [];
  const primaryBoundaryId = revenueSummary?.dataBoundaryId ?? revenuePreviewInsight?.dataBoundaryId ?? settlementBoundaryInsight?.dataBoundaryId ?? federationContext?.dataBoundaryId ?? riskTrustInsightList[0]?.dataBoundaryId;
  const collectionId = federationContext?.collectionId ?? riskTrustInsightList.find((insight) => insight.collectionId)?.collectionId;
  const providerId = federationContext?.providerId ?? riskTrustInsightList.find((insight) => insight.providerId)?.providerId;
  const viewBase = {
    revenueSummary,
    revenuePreviewInsight,
    settlementBoundaryInsight,
    riskTrustInsights: riskTrustInsightList,
    federationContext,
    providerValidationInsight: federationContext ? providerValidationInsights.find((insight) => insight.id === federationContext.providerValidationInsightId) ?? null : null,
    provenanceInsight: federationContext ? provenanceInsights.find((insight) => insight.id === federationContext.provenanceInsightId) ?? null : null,
    dataBoundary: getDataBoundaryById(primaryBoundaryId),
    revenuePreview: revenueSummary ? resolveRevenueSharingPreview(revenueSummary.policyId) : revenuePreviewInsight ? resolveRevenueSharingPreview(revenuePreviewInsight.policyId) : null,
    settlementBoundary: getSettlementBoundaryById(revenueSummary?.settlementBoundaryId ?? revenuePreviewInsight?.settlementBoundaryId ?? settlementBoundaryInsight?.settlementBoundaryId),
    collection: collectionId ? collections.find((collection) => collection.id === collectionId || collection.slug === collectionId) ?? null : null,
    provider: providerId ? getFederationProviderReference(providerId) : null
  };

  return {
    ...viewBase,
    boundaryNotes: buildRevenueTrustRiskBoundaryNotes(viewBase)
  };
}

export function listRevenueIntelligenceSummaries() {
  return revenueIntelligenceSummaries;
}

export function getRevenueIntelligenceSummaryByPolicy(policyIdOrSlug: string) {
  return getRevenueSummaryByPolicy(policyIdOrSlug);
}

export function getRevenuePreviewInsightByPolicy(policyIdOrSlug: string) {
  const policy = getRevenueSharingPolicyByIdOrSlug(policyIdOrSlug);
  const key = policy?.id ?? policyIdOrSlug;
  return revenuePreviewInsights.find((insight) => insight.policyId === key || insight.previewId === policyIdOrSlug || insight.id === policyIdOrSlug || insight.slug === policyIdOrSlug) ?? null;
}

export function getSettlementBoundaryInsightByPolicy(policyIdOrSlug: string) {
  const summary = getRevenueSummaryByPolicy(policyIdOrSlug);
  const policy = getRevenueSharingPolicyByIdOrSlug(policyIdOrSlug);
  const key = policy?.id ?? policyIdOrSlug;
  return (
    (summary ? settlementBoundaryInsights.find((insight) => insight.id === summary.settlementBoundaryInsightId) : null) ??
    settlementBoundaryInsights.find((insight) => insight.policyId === key || insight.settlementBoundaryId === policyIdOrSlug || insight.id === policyIdOrSlug || insight.slug === policyIdOrSlug) ??
    null
  );
}

export function listRiskTrustInsights() {
  return riskTrustInsights;
}

export function getRiskTrustInsightById(insightIdOrSlug: string) {
  return riskTrustInsights.find((insight) => insight.id === insightIdOrSlug || insight.slug === insightIdOrSlug) ?? null;
}

export function listRiskTrustInsightsByScope(scope: RiskTrustInsight["scope"], scopeId?: string) {
  return riskTrustInsights.filter((insight) => insight.scope === scope && (!scopeId || insight.scopeId === scopeId));
}

export function getRiskTrustInsightsByRevenuePolicy(policyIdOrSlug: string) {
  const policy = getRevenueSharingPolicyByIdOrSlug(policyIdOrSlug);
  const key = policy?.id ?? policyIdOrSlug;
  return riskTrustInsights.filter((insight) => insight.revenueSharingPolicyId === key || insight.scopeId === key);
}

export function getRiskTrustInsightsByDistributionAttribution(attributionSourceIdOrSlug: string) {
  const source = getAttributionSourceById(attributionSourceIdOrSlug) ?? getAttributionSourceBySlug(attributionSourceIdOrSlug);
  const key = source?.source.id ?? attributionSourceIdOrSlug;
  return riskTrustInsights.filter((insight) => insight.attributionSourceId === key || insight.scopeId === key || insight.sourceRefId === key);
}

export function resolveFederationIntelligenceContext(collectionIdOrSlug: string) {
  const collection = collections.find((item) => item.id === collectionIdOrSlug || item.slug === collectionIdOrSlug);
  const key = collection?.id ?? collectionIdOrSlug;
  const context = federationIntelligenceContexts.find((entry) => entry.collectionId === key || entry.id === collectionIdOrSlug);
  return context
    ? buildRevenueTrustRiskIntelligenceView({
        federationContext: context,
        riskTrustInsights: riskTrustInsights.filter((insight) => insight.collectionId === context.collectionId || insight.providerId === context.providerId)
      })
    : null;
}

export function resolveRevenueTrustRiskIntelligence(policyIdOrSlug: string) {
  const revenueSummary = getRevenueSummaryByPolicy(policyIdOrSlug);
  if (!revenueSummary) return null;
  return buildRevenueTrustRiskIntelligenceView({
    revenueSummary,
    riskTrustInsights: getRiskTrustInsightsByRevenuePolicy(revenueSummary.policyId)
  });
}

export function resolveRiskTrustContext(scope: RiskTrustInsight["scope"], scopeId: string) {
  const insights = listRiskTrustInsightsByScope(scope, scopeId);
  const federationContext = scope === "collection" ? federationIntelligenceContexts.find((entry) => entry.collectionId === scopeId) ?? null : null;
  return insights.length || federationContext ? buildRevenueTrustRiskIntelligenceView({ riskTrustInsights: insights, federationContext }) : null;
}

export function validateRevenuePreviewInsightMockOnly(policyIdOrSlug: string) {
  const view = resolveRevenueTrustRiskIntelligence(policyIdOrSlug);
  if (!view?.revenueSummary || !view.revenuePreviewInsight) return null;
  const records = [view.revenueSummary, view.revenuePreviewInsight];
  const isMockOnly = records.every(
    (record) =>
      record.isSimulated &&
      !record.usesFinancialBI &&
      !record.usesAccounting &&
      !record.usesTax &&
      !record.canSettle &&
      !record.canTriggerPayout &&
      !record.canRouteTreasury &&
      !record.canInvoice
  );

  return {
    policyId: view.revenueSummary.policyId,
    isMockOnly,
    isNoFinancialBI: records.every((record) => !record.usesFinancialBI),
    isNoAccounting: records.every((record) => !record.usesAccounting),
    isNoTax: records.every((record) => !record.usesTax),
    isNoSettlement: records.every((record) => !record.canSettle),
    isNoPayout: records.every((record) => !record.canTriggerPayout),
    isNoTreasuryRouting: records.every((record) => !record.canRouteTreasury),
    isNoInvoice: records.every((record) => !record.canInvoice)
  };
}

export function validateRiskTrustInsightMockOnly(insightIdOrSlug: string) {
  const insight = getRiskTrustInsightById(insightIdOrSlug);
  if (!insight) return null;
  return {
    insightId: insight.id,
    isMockOnly:
      insight.isSimulated &&
      !insight.usesRiskScoring &&
      !insight.usesTrustScoring &&
      !insight.usesAutomatedDecisioning &&
      !insight.canBlockAutomatically &&
      !insight.canApproveAutomatically &&
      !insight.canTriggerCommercialAction,
    isNoRiskScoring: !insight.usesRiskScoring,
    isNoTrustScoring: !insight.usesTrustScoring,
    isNoAutomatedDecisioning: !insight.usesAutomatedDecisioning,
    isNoAutomatedBlocking: !insight.canBlockAutomatically,
    isNoAutomatedApproval: !insight.canApproveAutomatically,
    isNoCommercialAction: !insight.canTriggerCommercialAction
  };
}

export function explainMarketplaceIntelligenceBoundary(insightIdOrSlug: string) {
  return getMarketplaceInsightById(insightIdOrSlug)?.boundaryNotes ?? [];
}

export function explainIntelligenceSnapshotBoundary(snapshotIdOrSlug: string) {
  return getIntelligenceSnapshotById(snapshotIdOrSlug)?.boundaryNotes ?? [];
}

function academyBoundaryNotes(recordWarnings: string[] = [], recordDisclaimers: string[] = []) {
  return [
    ...recordWarnings,
    ...recordDisclaimers,
    "mock academy / config-first academy / no LMS / no progress tracking / no learning analytics / no credential issuance / no credential verification / no billing / no entitlement / no settlement"
  ];
}

function findAcademyProductByAccessPreview(accessPreviewId: string) {
  return academyProducts.find((entry) => entry.accessPreviewId === accessPreviewId) ?? null;
}

function buildAcademyCourseView(course: Course): AcademyCourseView {
  const accessPreview = learningAccessPreviews.find((entry) => entry.id === course.accessPreviewId) ?? null;
  const intelligenceSummary = academyIntelligenceSummaries.find((entry) => entry.scopeId === course.tenantId || entry.scopeId === course.id) ?? null;
  return {
    course,
    modules: courseModules.filter((entry) => course.moduleIds.includes(entry.id)),
    lessons: lessons.filter((entry) => course.lessonIds.includes(entry.id)),
    learningPaths: learningPaths.filter((entry) => course.learningPathIds.includes(entry.id)),
    accessPreview,
    academyProduct: findAcademyProductByAccessPreview(course.accessPreviewId),
    distributionContext: academyDistributionContexts.find((entry) => entry.courseId === course.id) ?? null,
    dataBoundary: academyDataBoundaries.find((entry) => entry.id === course.dataBoundaryId) ?? null,
    revenuePolicy: course.revenueSharingPolicyId ? getRevenueSharingPolicyById(course.revenueSharingPolicyId) : null,
    revenuePreview: course.revenueSharingPolicyId ? resolveRevenueSharingPreview(course.revenueSharingPolicyId) : null,
    intelligenceSummary,
    intelligenceSnapshot: course.intelligenceSnapshotId ? getIntelligenceSnapshotById(course.intelligenceSnapshotId) : null,
    tenant: tenants.find((entry) => entry.id === course.tenantId) ?? null,
    curatedCatalog: curatedCatalogs.find((entry) => entry.id === course.curatedCatalogId) ?? null,
    distributionChannel: distributionChannels.find((entry) => entry.id === course.distributionChannelId) ?? null,
    boundaryNotes: academyBoundaryNotes(course.warnings, course.disclaimers)
  };
}

function buildAcademyCertificationView(certification: Certification): AcademyCertificationView {
  const accessPreview = learningAccessPreviews.find((entry) => entry.scopeId === certification.id) ?? null;
  const intelligenceSummary = academyIntelligenceSummaries.find((entry) => entry.scopeId === certification.tenantId || entry.scopeId === certification.id) ?? null;
  return {
    certification,
    requirements: certificationRequirements.filter((entry) => certification.requirementIds.includes(entry.id)),
    credentialPreview: credentialPreviews.find((entry) => entry.id === certification.credentialPreviewId) ?? null,
    certificateBadgeMock: certificateBadgeMocks.find((entry) => entry.id === certification.certificateBadgeMockId) ?? null,
    accessPreview,
    academyProduct: accessPreview ? findAcademyProductByAccessPreview(accessPreview.id) : null,
    distributionContext: academyDistributionContexts.find((entry) => entry.certificationId === certification.id) ?? null,
    dataBoundary: academyDataBoundaries.find((entry) => entry.id === certification.dataBoundaryId) ?? null,
    revenuePolicy: certification.revenueSharingPolicyId ? getRevenueSharingPolicyById(certification.revenueSharingPolicyId) : null,
    revenuePreview: certification.revenueSharingPolicyId ? resolveRevenueSharingPreview(certification.revenueSharingPolicyId) : null,
    intelligenceSummary,
    intelligenceSnapshot: certification.intelligenceSnapshotId ? getIntelligenceSnapshotById(certification.intelligenceSnapshotId) : null,
    tenant: tenants.find((entry) => entry.id === certification.tenantId) ?? null,
    curatedCatalog: curatedCatalogs.find((entry) => entry.id === certification.curatedCatalogId) ?? null,
    distributionChannel: distributionChannels.find((entry) => entry.id === certification.distributionChannelId) ?? null,
    boundaryNotes: academyBoundaryNotes(certification.warnings, certification.disclaimers)
  };
}

function buildAcademySubscriptionView(subscription: LearningSubscription): AcademySubscriptionView {
  const accessPreview = learningAccessPreviews.find((entry) => entry.id === subscription.accessPreviewId) ?? null;
  const learningEntitlementMock = learningEntitlementMocks.find((entry) => entry.scopeId === subscription.id || entry.accessPreviewId === subscription.accessPreviewId) ?? null;
  const intelligenceSummary = academyIntelligenceSummaries.find((entry) => entry.scopeId === subscription.tenantId || entry.scopeId === subscription.id) ?? null;
  return {
    subscription,
    tiers: learningSubscriptionTiers.filter((entry) => subscription.tierIds.includes(entry.id)),
    courses: subscription.includedCourseIds.map(getAcademyCourseById).filter((entry): entry is AcademyCourseView => Boolean(entry)),
    certifications: subscription.includedCertificationIds.map(getAcademyCertificationById).filter((entry): entry is AcademyCertificationView => Boolean(entry)),
    accessPreview,
    learningEntitlementMock,
    academyProduct: findAcademyProductByAccessPreview(subscription.accessPreviewId),
    distributionContext: academyDistributionContexts.find((entry) => entry.learningSubscriptionId === subscription.id) ?? null,
    dataBoundary: academyDataBoundaries.find((entry) => entry.id === subscription.dataBoundaryId) ?? null,
    revenuePolicy: subscription.revenueSharingPolicyId ? getRevenueSharingPolicyById(subscription.revenueSharingPolicyId) : null,
    revenuePreview: subscription.revenueSharingPolicyId ? resolveRevenueSharingPreview(subscription.revenueSharingPolicyId) : null,
    intelligenceSummary,
    intelligenceSnapshot: subscription.intelligenceSnapshotId ? getIntelligenceSnapshotById(subscription.intelligenceSnapshotId) : null,
    tenant: tenants.find((entry) => entry.id === subscription.tenantId) ?? null,
    curatedCatalog: curatedCatalogs.find((entry) => entry.id === subscription.curatedCatalogId) ?? null,
    distributionChannel: distributionChannels.find((entry) => entry.id === subscription.distributionChannelId) ?? null,
    boundaryNotes: academyBoundaryNotes(subscription.warnings, subscription.disclaimers)
  };
}

export function listAcademyProducts() {
  return academyProducts;
}

export function listAcademyCourses() {
  return courses.map(buildAcademyCourseView);
}

export function getAcademyCourseById(courseIdOrSlug: string) {
  const course = courses.find((entry) => entry.id === courseIdOrSlug || entry.slug === courseIdOrSlug);
  return course ? buildAcademyCourseView(course) : null;
}

export function listAcademyCertifications() {
  return certifications.map(buildAcademyCertificationView);
}

export function getAcademyCertificationById(certificationIdOrSlug: string) {
  const certification = certifications.find((entry) => entry.id === certificationIdOrSlug || entry.slug === certificationIdOrSlug);
  return certification ? buildAcademyCertificationView(certification) : null;
}

export function listAcademyLearningSubscriptions() {
  return learningSubscriptions.map(buildAcademySubscriptionView);
}

export function getAcademyLearningSubscriptionById(subscriptionIdOrSlug: string) {
  const subscription = learningSubscriptions.find((entry) => entry.id === subscriptionIdOrSlug || entry.slug === subscriptionIdOrSlug);
  return subscription ? buildAcademySubscriptionView(subscription) : null;
}

export function listAcademyLearningPaths() {
  return learningPaths;
}

export function listAcademyLearningEntitlementMocks() {
  return learningEntitlementMocks;
}

export function resolveAcademyLearningEntitlementMock(entitlementIdOrScopeId: string) {
  return learningEntitlementMocks.find((entry) => entry.id === entitlementIdOrScopeId || entry.scopeId === entitlementIdOrScopeId || entry.accessPreviewId === entitlementIdOrScopeId) ?? null;
}

export function listAcademyDataBoundaries() {
  return academyDataBoundaries;
}

export function resolveAcademyDataBoundary(boundaryIdOrScope: string, scopeId?: string) {
  return academyDataBoundaries.find((entry) => entry.id === boundaryIdOrScope || (entry.scope === boundaryIdOrScope && (!scopeId || entry.scopeId === scopeId))) ?? null;
}

export function listAcademyDistributionContexts() {
  return academyDistributionContexts;
}

export function resolveAcademyDistributionContext(contextIdOrTargetId: string) {
  return (
    academyDistributionContexts.find(
      (entry) =>
        entry.id === contextIdOrTargetId ||
        entry.academyProductId === contextIdOrTargetId ||
        entry.courseId === contextIdOrTargetId ||
        entry.certificationId === contextIdOrTargetId ||
        entry.learningSubscriptionId === contextIdOrTargetId
    ) ?? null
  );
}

export function listAcademyIntelligenceSummaries() {
  return academyIntelligenceSummaries;
}

export function resolveAcademyDistributionOverview(): AcademyDistributionOverview {
  return {
    products: academyProducts,
    courses: listAcademyCourses(),
    certifications: listAcademyCertifications(),
    learningPaths,
    subscriptions: listAcademyLearningSubscriptions(),
    learningEntitlementMocks,
    dataBoundaries: academyDataBoundaries,
    contexts: academyDistributionContexts,
    intelligenceSummaries: academyIntelligenceSummaries,
    boundaryNotes: academyBoundaryNotes(["Academy Distribution is mock/config-first and non-executing."], ["No LMS real, no credential real, no billing real and no entitlement productive are active."])
  };
}

export function validateAcademyDistributionMockOnly(targetId?: string) {
  const overview = resolveAcademyDistributionOverview();
  const courseRecords = targetId ? overview.courses.filter((entry) => entry.course.id === targetId || entry.course.slug === targetId) : overview.courses;
  const certificationRecords = targetId ? overview.certifications.filter((entry) => entry.certification.id === targetId || entry.certification.slug === targetId) : overview.certifications;
  const subscriptionRecords = targetId ? overview.subscriptions.filter((entry) => entry.subscription.id === targetId || entry.subscription.slug === targetId) : overview.subscriptions;
  const selectedCourses = courseRecords.length || certificationRecords.length || subscriptionRecords.length ? courseRecords : overview.courses;
  const selectedCertifications = courseRecords.length || certificationRecords.length || subscriptionRecords.length ? certificationRecords : overview.certifications;
  const selectedSubscriptions = courseRecords.length || certificationRecords.length || subscriptionRecords.length ? subscriptionRecords : overview.subscriptions;
  const entitlementRecords = selectedSubscriptions.map((entry) => entry.learningEntitlementMock).filter((entry): entry is LearningEntitlementMock => Boolean(entry));
  const boundaries = [
    ...selectedCourses.map((entry) => entry.dataBoundary),
    ...selectedCertifications.map((entry) => entry.dataBoundary),
    ...selectedSubscriptions.map((entry) => entry.dataBoundary)
  ].filter((entry): entry is AcademyDataBoundary => Boolean(entry));

  return {
    isMockOnly:
      selectedCourses.every((entry) => entry.course.isSimulated && !entry.course.hasRealPlayer && !entry.course.canTrackProgress && !entry.course.canRecordCompletion) &&
      selectedCertifications.every(
        (entry) =>
          entry.certification.isSimulated &&
          !entry.certification.canIssueCredential &&
          !entry.certification.canVerifyCredential &&
          !entry.certification.canMintOnChain &&
          !entry.certification.canSignCredential &&
          !entry.certification.canRecordAssessment
      ) &&
      selectedSubscriptions.every(
        (entry) =>
          entry.subscription.isSimulated &&
          !entry.subscription.canBill &&
          !entry.subscription.canInvoice &&
          !entry.subscription.canChargePayment &&
          !entry.subscription.canGrantEntitlement &&
          !entry.subscription.canSettle &&
          !entry.subscription.canTriggerPayout
      ) &&
      entitlementRecords.every(
        (entry) =>
          entry.isSimulated &&
          !entry.canGrantEntitlement &&
          !entry.canRevokeEntitlement &&
          !entry.canStartLearning &&
          !entry.canTrackProgress &&
          !entry.canBill &&
          !entry.canSettle &&
          !entry.canTriggerPayout
      ) &&
      boundaries.every(
        (entry) =>
          entry.isSimulated &&
          !entry.usesLms &&
          !entry.usesRealPlayer &&
          !entry.usesProgressTracking &&
          !entry.usesLearningAnalytics &&
          !entry.usesAssessment &&
          !entry.usesCredentialIssuance &&
          !entry.usesCredentialVerification &&
          !entry.usesBilling &&
          !entry.usesEntitlement &&
          !entry.usesExternalEducationPlatform
      ),
    isNoLms: boundaries.every((entry) => !entry.usesLms && !entry.usesRealPlayer),
    isNoProgressTracking: boundaries.every((entry) => !entry.usesProgressTracking),
    isNoLearningAnalytics: boundaries.every((entry) => !entry.usesLearningAnalytics),
    isNoCredentialIssuance: boundaries.every((entry) => !entry.usesCredentialIssuance),
    isNoCredentialVerification: boundaries.every((entry) => !entry.usesCredentialVerification),
    isNoBilling: boundaries.every((entry) => !entry.usesBilling),
    isNoEntitlement: boundaries.every((entry) => !entry.usesEntitlement) && entitlementRecords.every((entry) => !entry.canGrantEntitlement && !entry.canRevokeEntitlement),
    boundaryCount: boundaries.length
  };
}

function acsBoundaryNotes(recordWarnings: string[] = [], recordDisclaimers: string[] = []) {
  return [
    ...recordWarnings,
    ...recordDisclaimers,
    "mock ACS / config-first ACS / no agent execution / no MCP deployment / no workflow run / no compute allocation / no provisioning / no secret access / no billing / no settlement"
  ];
}

function findACSCapabilityProductByAccessPreview(accessPreviewId: string) {
  return acsCapabilityProducts.find((entry) => entry.accessPreviewId === accessPreviewId) ?? null;
}

function buildMCPPackageView(mcpPackage: MCPPackage): MCPPackageView {
  return {
    package: mcpPackage,
    versions: mcpVersions.filter((entry) => mcpPackage.versionIds.includes(entry.id)),
    accessPreview: acsAccessPreviews.find((entry) => entry.id === mcpPackage.accessPreviewId) ?? null,
    provisioningBoundary: acsProvisioningBoundaries.find((entry) => entry.id === mcpPackage.provisioningBoundaryId) ?? null,
    capabilityDataBoundary: acsCapabilityDataBoundaries.find((entry) => entry.id === mcpPackage.capabilityDataBoundaryId) ?? null,
    tenant: mcpPackage.tenantId ? tenants.find((entry) => entry.id === mcpPackage.tenantId) ?? null : null,
    curatedCatalog: mcpPackage.curatedCatalogId ? curatedCatalogs.find((entry) => entry.id === mcpPackage.curatedCatalogId) ?? null : null,
    distributionChannel: mcpPackage.distributionChannelId ? distributionChannels.find((entry) => entry.id === mcpPackage.distributionChannelId) ?? null : null,
    boundaryNotes: acsBoundaryNotes(mcpPackage.warnings, mcpPackage.disclaimers)
  };
}

function buildAIAgentView(agent: AIAgent): AIAgentView {
  const intelligenceSummary = acsIntelligenceSummaries.find((entry) => entry.scopeId === agent.id || entry.scopeId === agent.tenantId) ?? null;
  return {
    agent,
    capabilities: agentCapabilities.filter((entry) => agent.capabilityIds.includes(entry.id)),
    mcpPackages: agent.mcpPackageIds.map(getMCPPackageById).filter((entry): entry is MCPPackageView => Boolean(entry)),
    workflowTemplates: workflowTemplates.filter((entry) => agent.workflowTemplateIds.includes(entry.id)),
    accessPreview: acsAccessPreviews.find((entry) => entry.id === agent.accessPreviewId) ?? null,
    executionBoundary: acsExecutionBoundaries.find((entry) => entry.id === agent.executionBoundaryId) ?? null,
    capabilityDataBoundary: acsCapabilityDataBoundaries.find((entry) => entry.id === agent.capabilityDataBoundaryId) ?? null,
    acsCapabilityProduct: findACSCapabilityProductByAccessPreview(agent.accessPreviewId),
    distributionContext: acsDistributionContexts.find((entry) => entry.agentId === agent.id) ?? null,
    revenuePolicy: agent.revenueSharingPolicyId ? getRevenueSharingPolicyById(agent.revenueSharingPolicyId) : null,
    intelligenceSummary,
    intelligenceSnapshot: agent.intelligenceSnapshotId ? getIntelligenceSnapshotById(agent.intelligenceSnapshotId) : null,
    tenant: agent.tenantId ? tenants.find((entry) => entry.id === agent.tenantId) ?? null : null,
    curatedCatalog: agent.curatedCatalogId ? curatedCatalogs.find((entry) => entry.id === agent.curatedCatalogId) ?? null : null,
    distributionChannel: agent.distributionChannelId ? distributionChannels.find((entry) => entry.id === agent.distributionChannelId) ?? null : null,
    boundaryNotes: acsBoundaryNotes(agent.warnings, agent.disclaimers)
  };
}

function buildWorkflowSystemView(system: WorkflowSystem): WorkflowSystemView {
  return {
    system,
    templates: workflowTemplates.filter((entry) => system.templateIds.includes(entry.id)),
    bundles: workflowBundles.filter((entry) => system.bundleIds.includes(entry.id)),
    accessPreview: acsAccessPreviews.find((entry) => entry.id === system.accessPreviewId) ?? null,
    executionBoundary: acsExecutionBoundaries.find((entry) => entry.id === system.executionBoundaryId) ?? null,
    tenant: system.tenantId ? tenants.find((entry) => entry.id === system.tenantId) ?? null : null,
    curatedCatalog: system.curatedCatalogId ? curatedCatalogs.find((entry) => entry.id === system.curatedCatalogId) ?? null : null,
    distributionChannel: system.distributionChannelId ? distributionChannels.find((entry) => entry.id === system.distributionChannelId) ?? null : null,
    boundaryNotes: acsBoundaryNotes(system.warnings, system.disclaimers)
  };
}

function buildComputeAccessView(computeAccess: ComputeAccess): ComputeAccessView {
  return {
    computeAccess,
    tiers: computeTiers.filter((entry) => computeAccess.tierIds.includes(entry.id)),
    accessPreview: acsAccessPreviews.find((entry) => entry.id === computeAccess.accessPreviewId) ?? null,
    provisioningBoundary: acsProvisioningBoundaries.find((entry) => entry.id === computeAccess.provisioningBoundaryId) ?? null,
    tenant: computeAccess.tenantId ? tenants.find((entry) => entry.id === computeAccess.tenantId) ?? null : null,
    boundaryNotes: acsBoundaryNotes(computeAccess.warnings, computeAccess.disclaimers)
  };
}

export function listACSCapabilityProducts() {
  return acsCapabilityProducts;
}

export function listAIAgents() {
  return aiAgents.map(buildAIAgentView);
}

export function getAIAgentById(agentIdOrSlug: string) {
  const agent = aiAgents.find((entry) => entry.id === agentIdOrSlug || entry.slug === agentIdOrSlug);
  return agent ? buildAIAgentView(agent) : null;
}

export function listMCPPackages() {
  return mcpPackages.map(buildMCPPackageView);
}

export function getMCPPackageById(packageIdOrSlug: string) {
  const mcpPackage = mcpPackages.find((entry) => entry.id === packageIdOrSlug || entry.slug === packageIdOrSlug);
  return mcpPackage ? buildMCPPackageView(mcpPackage) : null;
}

export function listWorkflowSystems() {
  return workflowSystems.map(buildWorkflowSystemView);
}

export function getWorkflowSystemById(systemIdOrSlug: string) {
  const system = workflowSystems.find((entry) => entry.id === systemIdOrSlug || entry.slug === systemIdOrSlug);
  return system ? buildWorkflowSystemView(system) : null;
}

export function listComputeAccess() {
  return computeAccessRecords.map(buildComputeAccessView);
}

export function getComputeAccessById(computeAccessIdOrSlug: string) {
  const computeAccess = computeAccessRecords.find((entry) => entry.id === computeAccessIdOrSlug || entry.slug === computeAccessIdOrSlug);
  return computeAccess ? buildComputeAccessView(computeAccess) : null;
}

export function listACSAccessPreviews() {
  return acsAccessPreviews;
}

export function listACSExecutionBoundaries() {
  return acsExecutionBoundaries;
}

export function listACSProvisioningBoundaries() {
  return acsProvisioningBoundaries;
}

export function listACSCapabilityDataBoundaries() {
  return acsCapabilityDataBoundaries;
}

export function listACSDistributionContexts() {
  return acsDistributionContexts;
}

export function resolveACSDistributionContext(contextIdOrTargetId: string) {
  return (
    acsDistributionContexts.find(
      (entry) =>
        entry.id === contextIdOrTargetId ||
        entry.acsCapabilityProductId === contextIdOrTargetId ||
        entry.agentId === contextIdOrTargetId ||
        entry.mcpPackageId === contextIdOrTargetId ||
        entry.workflowSystemId === contextIdOrTargetId ||
        entry.workflowBundleId === contextIdOrTargetId ||
        entry.computeAccessId === contextIdOrTargetId
    ) ?? null
  );
}

export function listACSIntelligenceSummaries() {
  return acsIntelligenceSummaries;
}

export function resolveACSDistributionOverview(): ACSDistributionOverview {
  return {
    capabilityProducts: acsCapabilityProducts,
    agents: listAIAgents(),
    mcpPackages: listMCPPackages(),
    workflowSystems: listWorkflowSystems(),
    workflowBundles,
    computeAccess: listComputeAccess(),
    accessPreviews: acsAccessPreviews,
    executionBoundaries: acsExecutionBoundaries,
    provisioningBoundaries: acsProvisioningBoundaries,
    capabilityDataBoundaries: acsCapabilityDataBoundaries,
    contexts: acsDistributionContexts,
    intelligenceSummaries: acsIntelligenceSummaries,
    boundaryNotes: acsBoundaryNotes(["ACS Distribution is mock/config-first and non-executing."], ["No agent execution, no MCP deployment, no workflow run, no compute allocation, no provisioning, no secret access and no billing are active."])
  };
}

export function validateACSDistributionMockOnly(targetId?: string) {
  const overview = resolveACSDistributionOverview();
  const agentRecords = targetId ? overview.agents.filter((entry) => entry.agent.id === targetId || entry.agent.slug === targetId) : overview.agents;
  const packageRecords = targetId ? overview.mcpPackages.filter((entry) => entry.package.id === targetId || entry.package.slug === targetId) : overview.mcpPackages;
  const workflowRecords = targetId ? overview.workflowSystems.filter((entry) => entry.system.id === targetId || entry.system.slug === targetId) : overview.workflowSystems;
  const computeRecords = targetId ? overview.computeAccess.filter((entry) => entry.computeAccess.id === targetId || entry.computeAccess.slug === targetId) : overview.computeAccess;
  const hasScopedRecords = Boolean(agentRecords.length || packageRecords.length || workflowRecords.length || computeRecords.length);
  const selectedAgents = hasScopedRecords ? agentRecords : overview.agents;
  const selectedPackages = hasScopedRecords ? packageRecords : overview.mcpPackages;
  const selectedWorkflows = hasScopedRecords ? workflowRecords : overview.workflowSystems;
  const selectedCompute = hasScopedRecords ? computeRecords : overview.computeAccess;

  const executionBoundaries = selectedAgents.map((entry) => entry.executionBoundary).concat(selectedWorkflows.map((entry) => entry.executionBoundary)).filter((entry): entry is ACSExecutionBoundary => Boolean(entry));
  const provisioningBoundaries = selectedPackages.map((entry) => entry.provisioningBoundary).concat(selectedCompute.map((entry) => entry.provisioningBoundary)).filter((entry): entry is ACSProvisioningBoundary => Boolean(entry));
  const dataBoundaries = selectedAgents.map((entry) => entry.capabilityDataBoundary).concat(selectedPackages.map((entry) => entry.capabilityDataBoundary)).filter((entry): entry is ACSCapabilityDataBoundary => Boolean(entry));

  return {
    isMockOnly:
      selectedAgents.every((entry) => entry.agent.isSimulated && !entry.agent.canExecute && !entry.agent.canCallTools && !entry.agent.canAccessSecrets && !entry.agent.canUseExternalModels && !entry.agent.canWriteMemory) &&
      selectedPackages.every((entry) => entry.package.isSimulated && !entry.package.canDeploy && !entry.package.canInstall && !entry.package.canConnectServer && !entry.package.canExposeTools && !entry.package.canAccessSecrets) &&
      selectedWorkflows.every((entry) => entry.system.isSimulated && !entry.system.canRunWorkflow && !entry.system.canScheduleWorkflow && !entry.system.canCallAgents && !entry.system.canMutateExternalSystems) &&
      selectedCompute.every((entry) => entry.computeAccess.isSimulated && !entry.computeAccess.canAllocateCompute && !entry.computeAccess.canScaleCompute && !entry.computeAccess.canStartRuntime && !entry.computeAccess.canBill) &&
      executionBoundaries.every((entry) => entry.isSimulated && !entry.canExecuteAgent && !entry.canCallTools && !entry.canRunWorkflow && !entry.canMutateData && !entry.canUseExternalModels && !entry.canWriteMemory) &&
      provisioningBoundaries.every((entry) => entry.isSimulated && !entry.canProvision && !entry.canDeployMcp && !entry.canInstallPackage && !entry.canAllocateCompute && !entry.canStartRuntime && !entry.canAccessSecrets && !entry.canBill) &&
      dataBoundaries.every((entry) => entry.isSimulated && !entry.usesProductionData && !entry.usesSecrets && !entry.usesExternalIntegration && !entry.usesTracking && !entry.usesAnalytics && !entry.canExportData && !entry.canTrainModel),
    isNoAgentExecution: executionBoundaries.every((entry) => !entry.canExecuteAgent && !entry.canCallTools),
    isNoMcpDeployment: provisioningBoundaries.every((entry) => !entry.canDeployMcp && !entry.canInstallPackage),
    isNoWorkflowRun: executionBoundaries.every((entry) => !entry.canRunWorkflow),
    isNoComputeAllocation: provisioningBoundaries.every((entry) => !entry.canAllocateCompute && !entry.canStartRuntime),
    isNoProvisioning: provisioningBoundaries.every((entry) => !entry.canProvision),
    isNoSecretAccess: provisioningBoundaries.every((entry) => !entry.canAccessSecrets) && dataBoundaries.every((entry) => !entry.usesSecrets),
    isNoBilling: selectedCompute.every((entry) => !entry.computeAccess.canBill) && provisioningBoundaries.every((entry) => !entry.canBill),
    boundaryCount: executionBoundaries.length + provisioningBoundaries.length + dataBoundaries.length
  };
}

export function issueMockPurchase(product: Product, buyer = "0xMockBuyer...A11C"): PurchaseRecord {
  const license = getLicenseForProduct(product);
  const blocked = product.governanceStatus === "suspended" || product.governanceStatus === "restricted";

  return {
    id: `purchase-${product.id}-${Date.now()}`,
    buyer,
    productId: product.id,
    sellerId: product.sellerId,
    timestamp: new Date().toISOString(),
    amount: product.pricing.amount,
    currency: product.pricing.currency,
    licenseIssued: license.id,
    status: blocked ? "blocked" : product.governanceRequired ? "pending-governance-review" : "mock-issued",
    governanceReviewRequired: product.governanceRequired,
    signedUrlPreview: product.signedUrlPreviewAvailable
      ? `https://greenfield.mock.axodus.local/access/${product.slug}?signature=preview`
      : undefined
  };
}

export function createDraftListingPreview(input: DraftListingInput): DraftListingPreview {
  const royaltyPreviewAmount = Number(((input.price * input.royaltyBps) / 10_000).toFixed(4));

  return {
    id: `draft-listing-${Date.now()}`,
    input,
    status: input.governanceReviewRequired ? "requires-governance-review" : "draft-created",
    contractAdapterAction: "createListing",
    royaltyPreviewAmount,
    txPreview: `mock-tx:create-listing:${input.tokenStandard}:${input.listingType}:${input.chain}`
  };
}

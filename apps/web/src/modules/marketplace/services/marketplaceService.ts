import {
  marketplaceAssetRegistry,
  marketplaceBoundaries,
  marketplaceCatalogSegments,
  marketplaceCollections,
  marketplaceCuratedCatalogs,
  marketplaceDistributionChannels,
  marketplaceDistributionNetworks,
  marketplaceDistributionPlacements,
  marketplaceDistributionProfiles,
  marketplaceFederationProviders,
  marketplaceFeaturedCatalogs,
  marketplaceLicenses,
  marketplaceProducts,
  marketplaceSellers,
  marketplaceTenants,
  marketplaceWalletDiscoveryRecords
} from "../../../data/mock/marketplace.mock";
import type {
  AssetRegistryRecord,
  Chain,
  CuratedCatalog,
  CuratedCatalogItem,
  CuratedCatalogSection,
  EditorialRule,
  CatalogSegment,
  DiscoveredAsset,
  DistributionChannel,
  DistributionNetwork,
  DistributionPlacement,
  DistributionProfile,
  ExternalCollectionStatistics,
  ExternalContractReference,
  DraftListingInput,
  DraftListingPreview,
  FederationProviderDescriptor,
  FederationTrustBoundary,
  FeaturedCatalog,
  License,
  MarketplaceBoundaryStatus,
  MarketplaceCollection,
  Product,
  ProductCategory,
  ProductStanding,
  PurchaseRecord,
  Seller,
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
  TenantDomain,
  TenantDomainAlias,
  TenantDomainInputType,
  TenantDomainResolutionStatus,
  TenantRoutingContext,
  TenantTheme,
  TokenStandard,
  WalletDiscoveryRecord,
  WalletDiscoveryStatus
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
const boundaries = marketplaceBoundaries as MarketplaceBoundaryStatus[];
const assetRegistry = marketplaceAssetRegistry as AssetRegistryRecord[];
const walletDiscoveryRecords = marketplaceWalletDiscoveryRecords as WalletDiscoveryRecord[];
const federationProviders = marketplaceFederationProviders as FederationProviderDescriptor[];

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

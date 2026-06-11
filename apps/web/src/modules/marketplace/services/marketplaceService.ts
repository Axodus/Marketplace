import {
  marketplaceAssetRegistry,
  marketplaceBoundaries,
  marketplaceCollections,
  marketplaceLicenses,
  marketplaceProducts,
  marketplaceSellers
} from "../../../data/mock/marketplace.mock";
import type {
  AssetRegistryRecord,
  Chain,
  DraftListingInput,
  DraftListingPreview,
  License,
  MarketplaceBoundaryStatus,
  MarketplaceCollection,
  Product,
  ProductCategory,
  ProductStanding,
  PurchaseRecord,
  Seller,
  TokenStandard
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
const boundaries = marketplaceBoundaries as MarketplaceBoundaryStatus[];
const assetRegistry = marketplaceAssetRegistry as AssetRegistryRecord[];

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
  };
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

function buildCollectionMetrics(collection: MarketplaceCollection, collectionProducts: Product[]) {
  const listings = collectionProducts.filter((product) => product.status === "listed").length;
  const bids = collectionProducts.reduce((sum, product) => sum + (product.auction?.bidCount ?? 0), 0);
  const lowestProductPrice = collectionProducts.reduce<number | null>((lowest, product) => {
    if (lowest === null) return product.pricing.amount;
    return Math.min(lowest, product.pricing.amount);
  }, null);
  const floorPrice = collection.metrics?.floorPrice ?? lowestProductPrice ?? 0;
  const volume = collection.metrics?.volume ?? collectionProducts.reduce((sum, product) => sum + product.pricing.amount, 0);
  const holders = collection.metrics?.holders ?? Math.max(collectionProducts.length, 0);
  const recentActivity = collection.metrics?.recentActivity ?? bids + listings;
  const rankScore = volume + bids * 10 + recentActivity * 5 + holders;

  return {
    itemCount: collectionProducts.length,
    listings,
    bids,
    volume,
    holders,
    floorPrice,
    recentActivity,
    rankScore,
    ranking: 0
  };
}

export function listCollections(): CollectionView[] {
  const views = collections.map((collection) => {
    const collectionProducts = products.filter((product) => product.collectionId === collection.id);
    return {
      collection,
      products: collectionProducts,
      metrics: buildCollectionMetrics(collection, collectionProducts)
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

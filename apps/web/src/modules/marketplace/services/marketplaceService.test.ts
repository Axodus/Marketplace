import { describe, expect, it } from "vitest";
import {
  buildSellerProfileView,
  buildMarketplaceAnalytics,
  createDraftListingPreview,
  getAssetRegistryByProductSlug,
  getCollectionBySlug,
  getCollectionForProduct,
  getProductByItemRef,
  getProductBySlug,
  getSellerById,
  getSellerProfileById,
  issueMockPurchase,
  listCollections,
  listProducts
} from "./marketplaceService";
import { StorageAccessService, GreenfieldAccessAdapter } from "./boundaryAdapters";

describe("marketplaceService", () => {
  it("filters products by chain and governance standing", () => {
    const products = listProducts({ chain: "Polygon", governanceStatus: "compliant" });

    expect(products.length).toBeGreaterThan(0);
    expect(products.every((product) => product.supportedChains.includes("Polygon"))).toBe(true);
    expect(products.every((product) => product.governanceStatus === "compliant")).toBe(true);
  });

  it("searches products across seller, category, token and description fields", () => {
    const bySeller = listProducts({ search: "Academy Tutor" });
    const byToken = listProducts({ search: "erc1155" });

    expect(bySeller.map((product) => product.slug)).toContain("academy-certification-erc1155-bundle");
    expect(byToken.map((product) => product.slug)).toContain("academy-certification-erc1155-bundle");
  });

  it("filters explorer products by asset type, listing status, listing type and seller", () => {
    const erc721Products = listProducts({ assetType: "erc721" });
    const activeAuctions = listProducts({ listingStatus: "auction-active" });
    const sellerProducts = listProducts({ sellerId: "seller-axodus-core", listingType: "dutch-auction" });

    expect(erc721Products.length).toBeGreaterThan(0);
    expect(erc721Products.every((product) => product.tokenStandard === "ERC721")).toBe(true);
    expect(activeAuctions.length).toBeGreaterThan(0);
    expect(activeAuctions.every((product) => product.auction?.status === "active")).toBe(true);
    expect(sellerProducts).toHaveLength(1);
    expect(sellerProducts[0].slug).toBe("strategy-license-dutch-auction");
  });

  it("sorts explorer products by price and activity without mutating mock data", () => {
    const originalOrder = listProducts().map((product) => product.id);
    const priceAscending = listProducts({ sortBy: "price-asc" });
    const activity = listProducts({ sortBy: "activity" });

    expect(priceAscending.map((product) => product.pricing.amount)).toEqual([80, 120, 250, 300]);
    expect(activity[0].slug).toBe("academy-certification-erc1155-bundle");
    expect(listProducts().map((product) => product.id)).toEqual(originalOrder);
  });

  it("lists ranked native mock collections with derived metrics", () => {
    const collections = listCollections();

    expect(collections).toHaveLength(3);
    expect(collections.map((view) => view.metrics.ranking)).toEqual([1, 2, 3]);
    expect(collections[0].collection.slug).toBe("axodus-governance-access");
    expect(collections[0].metrics.itemCount).toBe(1);
    expect(collections[0].metrics.listings).toBe(1);
  });

  it("resolves collection detail and product collection relationship", () => {
    const collection = getCollectionBySlug("academy-certification-packs");
    const product = getProductBySlug("academy-certification-erc1155-bundle");

    expect(collection?.collection.assetType).toBe("ERC1155");
    expect(collection?.products.map((item) => item.slug)).toContain("academy-certification-erc1155-bundle");
    expect(getCollectionForProduct(product!)?.collection.slug).toBe("academy-certification-packs");
  });

  it("builds seller profile metrics, activity and collection relationships from mock data", () => {
    const seller = getSellerById("seller-axodus-core");
    expect(seller).toBeDefined();

    const profile = buildSellerProfileView(seller!);

    expect(profile.metrics.listings).toBe(2);
    expect(profile.metrics.nftBoundListings).toBe(2);
    expect(profile.metrics.collections).toBe(2);
    expect(profile.metrics.totalBids).toBe(6);
    expect(profile.reputation.label).toBe("excellent-mock");
    expect(profile.reputation.riskLabel).toBe("low");
    expect(profile.activity.length).toBeGreaterThan(0);
    expect(profile.collections.map((view) => view.collection.slug)).toContain("axodus-governance-access");
  });

  it("returns null for unknown seller profiles", () => {
    expect(getSellerProfileById("seller-missing")).toBeNull();
  });

  it("finds products by slug", () => {
    const product = getProductBySlug("academy-certification-erc1155-bundle");

    expect(product?.tokenStandard).toBe("ERC1155");
    expect(product?.listingType).toBe("english-auction");
  });

  it("issues mock purchase records without settlement", () => {
    const product = getProductBySlug("governance-dashboard-nft-access");
    expect(product).toBeDefined();

    const purchase = issueMockPurchase(product!);

    expect(purchase.currency).toBe("USDC");
    expect(purchase.licenseIssued).toBe("license-personal-nft");
    expect(purchase.signedUrlPreview).toContain("greenfield.mock.axodus.local");
  });

  it("previews Greenfield access lifecycle without production delivery", () => {
    const product = getProductBySlug("governance-dashboard-nft-access");
    expect(product).toBeDefined();

    const access = StorageAccessService.getAccessModel(product!);
    const signedUrl = GreenfieldAccessAdapter.requestSignedUrlPreview(product!);

    expect(access.signedUrlLifecycle).toBe("preview");
    expect(access.productionGreenfieldEnabled).toBe(false);
    expect(access.deliveryExecutionEnabled).toBe(false);
    expect(signedUrl.signedUrl).toContain("greenfield.mock.axodus.local");
    expect(signedUrl.deliveryExecutionEnabled).toBe(false);
  });

  it("resolves legacy NFT item references", () => {
    const product = getProductByItemRef("polygon", "mock:governance-dashboard-access", "AXD-GOV-001");

    expect(product?.slug).toBe("governance-dashboard-nft-access");
  });

  it("builds asset registry views with ownership, transfer, license and validation history", () => {
    const registry = getAssetRegistryByProductSlug("governance-dashboard-nft-access");

    expect(registry?.registry.currentOwner).toBe("0xMockOwnerGovernance001");
    expect(registry?.registry.ownershipHistory).toHaveLength(1);
    expect(registry?.registry.transferHistory).toHaveLength(1);
    expect(registry?.registry.licenseHistory).toHaveLength(1);
    expect(registry?.registry.validation.metadata).toBe("compliant");
    expect(registry?.metadataAttributes.map((attribute) => attribute.traitType)).toContain("Access");
    expect(registry?.boundaries.map((boundary) => boundary.label)).toContain("Settlement boundary");
  });

  it("keeps empty asset registry histories explicit for mock assets", () => {
    const registry = getAssetRegistryByProductSlug("academy-certification-erc1155-bundle");

    expect(registry?.registry.transferHistory).toHaveLength(0);
    expect(registry?.registry.licenseHistory[0].status).toBe("mock-pending");
    expect(registry?.registry.validation.collection).toBe("under-review");
  });

  it("returns null for unknown asset registry slugs", () => {
    expect(getAssetRegistryByProductSlug("missing-asset")).toBeNull();
  });

  it("builds mock-first marketplace analytics for volume, activity and market metrics", () => {
    const analytics = buildMarketplaceAnalytics();

    expect(analytics.volume.totalVolume).toBe(750);
    expect(analytics.volume.averagePrice).toBe(187.5);
    expect(analytics.volume.floorPrice).toBe(80);
    expect(analytics.activity.activeListings).toBe(4);
    expect(analytics.activity.activeAuctions).toBe(2);
    expect(analytics.activity.totalBids).toBe(23);
    expect(analytics.market.erc721Products).toBe(2);
    expect(analytics.market.erc1155Products).toBe(1);
    expect(analytics.market.marketStatus).toBe("restricted-mock");
  });

  it("builds collection, seller and recent activity summaries for analytics", () => {
    const analytics = buildMarketplaceAnalytics();

    expect(analytics.collections.map((collection) => collection.slug)).toContain("axodus-governance-access");
    expect(analytics.sellers[0].id).toBe("seller-axodus-core");
    expect(analytics.activity.recentActivity.length).toBeGreaterThan(0);
    expect(analytics.notes.join(" ")).toContain("No tracking events");
  });

  it("creates draft listing previews without mutating products", () => {
    const before = listProducts().length;
    const preview = createDraftListingPreview({
      title: "Mock ERC721 Listing",
      category: "Digital Assets",
      tokenStandard: "ERC721",
      listingType: "fixed",
      chain: "Polygon",
      price: 100,
      currency: "USDC",
      royaltyBps: 500,
      deliveryType: "Signed URL",
      governanceReviewRequired: true,
      description: "Mock listing preview"
    });

    expect(preview.status).toBe("requires-governance-review");
    expect(preview.royaltyPreviewAmount).toBe(5);
    expect(listProducts()).toHaveLength(before);
  });
});

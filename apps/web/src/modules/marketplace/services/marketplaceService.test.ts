import { describe, expect, it } from "vitest";
import { createDraftListingPreview, getProductByItemRef, getProductBySlug, issueMockPurchase, listProducts } from "./marketplaceService";
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

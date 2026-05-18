import { describe, expect, it } from "vitest";
import { getProductBySlug, issueMockPurchase, listProducts } from "./marketplaceService";

describe("marketplaceService", () => {
  it("filters products by chain and governance standing", () => {
    const products = listProducts({ chain: "Polygon", governanceStatus: "compliant" });

    expect(products.length).toBeGreaterThan(0);
    expect(products.every((product) => product.supportedChains.includes("Polygon"))).toBe(true);
    expect(products.every((product) => product.governanceStatus === "compliant")).toBe(true);
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
});

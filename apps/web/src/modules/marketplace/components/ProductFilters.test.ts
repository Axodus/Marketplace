import { describe, expect, it } from "vitest";
import { productFiltersFromSearchParams } from "../hooks/useMarketplace";
import { DEFAULT_PRODUCT_EXPLORER_FILTERS } from "../services/marketplaceService";
import { hasActiveProductFilters, productSortOptions } from "./ProductFilters";

describe("product discovery controls", () => {
  it("initializes only supported cross-route discovery parameters", () => {
    const filters = productFiltersFromSearchParams(
      new URLSearchParams("q=academy&category=Education&assetType=erc1155&sortBy=unsupported")
    );
    expect(filters.search).toBe("academy");
    expect(filters.category).toBe("Education");
    expect(filters.assetType).toBe("erc1155");
    expect(filters.sortBy).toBe("relevance");
  });

  it("rejects unsupported category and asset parameters", () => {
    const filters = productFiltersFromSearchParams(new URLSearchParams("category=Invented&assetType=coin"));
    expect(filters.category).toBe("all");
    expect(filters.assetType).toBe("all");
  });

  it("detects active filters and treats the default state as clear", () => {
    expect(hasActiveProductFilters(DEFAULT_PRODUCT_EXPLORER_FILTERS)).toBe(false);
    expect(hasActiveProductFilters({ ...DEFAULT_PRODUCT_EXPLORER_FILTERS, verifiedSeller: true })).toBe(true);
    expect(hasActiveProductFilters({ ...DEFAULT_PRODUCT_EXPLORER_FILTERS, minPrice: 100 })).toBe(true);
  });

  it("exposes only implemented sorting choices", () => {
    expect(productSortOptions.map((option) => option.value)).toEqual([
      "relevance",
      "recent",
      "price-asc",
      "price-desc",
      "ending-soon"
    ]);
  });
});

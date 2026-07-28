import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { getProductBySlug, getSellerById } from "../services/marketplaceService";
import type { Product } from "../types/marketplace";
import { buildProductCardViewModel, ProductCard } from "./ProductCard";

function product(slug: string) {
  const value = getProductBySlug(slug);
  if (!value) throw new Error(`Missing product fixture: ${slug}`);
  return value;
}

function renderCard(value: Product, withSeller = true) {
  return renderToStaticMarkup(
    <MemoryRouter>
      <ProductCard product={value} seller={withSeller ? getSellerById(value.sellerId) : undefined} />
    </MemoryRouter>
  );
}

describe("ProductCard", () => {
  it("renders core fixed-price product information in the required hierarchy", () => {
    const value = product("governance-dashboard-nft-access");
    const markup = renderCard(value);
    expect(markup).toContain(value.title);
    expect(markup).toContain(`${value.pricing.amount} ${value.pricing.currency}`);
    expect(markup).toContain(value.supportedChains[0]);
    expect(markup).toContain("ERC721");
  });

  it("represents English and Dutch auctions with bids and ending information", () => {
    const english = buildProductCardViewModel(product("academy-certification-erc1155-bundle"), undefined, undefined, new Date("2026-05-01"));
    const dutch = buildProductCardViewModel(product("strategy-license-dutch-auction"), undefined, undefined, new Date("2026-05-01"));
    expect(english.listingMeta).toContain("17 bids");
    expect(english.indicators.map((item) => item.label)).toContain("English auction");
    expect(dutch.listingMeta).toContain("6 bids");
    expect(dutch.indicators.map((item) => item.label)).toContain("Dutch auction");
  });

  it("supports education, ERC1155, MCP and off-chain license variants", () => {
    const education = buildProductCardViewModel(product("academy-certification-erc1155-bundle"));
    const mcp = buildProductCardViewModel(product("mcp-agent-template-license"));
    expect(education.category).toBe("Education");
    expect(education.indicators.some((item) => item.label === "English auction")).toBe(true);
    expect(mcp.category).toBe("MCPs");
    expect(mcp.indicators.some((item) => item.label === "License")).toBe(true);
  });

  it("uses a safe fallback for missing images and optional seller data", () => {
    const value = { ...product("governance-dashboard-nft-access"), images: [] };
    const markup = renderCard(value, false);
    expect(markup).toContain("Preview unavailable");
    expect(markup).toContain("Marketplace seller unavailable");
  });

  it("never exposes more than two card indicators", () => {
    const view = buildProductCardViewModel(product("mcp-agent-template-license"));
    expect(view.indicators.length).toBeLessThanOrEqual(2);
    expect(view.indicators[0].label).toContain("restricted");
  });
});


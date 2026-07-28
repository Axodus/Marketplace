import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  marketplaceCategoryNavigation,
  marketplaceNavigationDestinations,
  marketplaceNavigationGroups,
  primaryMarketplaceNavigation
} from "./marketplaceNavigation";

describe("marketplace navigation", () => {
  it("keeps the primary commerce navigation intentionally small", () => {
    expect(primaryMarketplaceNavigation.map((item) => item.label)).toEqual(["Explore", "Collections", "Curated", "Sell"]);
  });

  it("preserves the approved operational groups and destinations", () => {
    expect(marketplaceNavigationGroups.map((group) => group.label)).toEqual(["Partner Hub", "Platform", "Operations", "Ecosystem"]);
    expect(marketplaceNavigationDestinations).toContain("/marketplace/distribution");
    expect(marketplaceNavigationDestinations).toContain("/marketplace/tenants");
    expect(marketplaceNavigationDestinations).toContain("/marketplace/dashboard");
    expect(marketplaceNavigationDestinations).toContain("/marketplace/sovereign");
    expect(new Set(marketplaceNavigationDestinations).size).toBe(marketplaceNavigationDestinations.length);
  });

  it("keeps commercial category entry points discoverable", () => {
    expect(marketplaceCategoryNavigation.map((item) => item.label)).toEqual([
      "Education",
      "Digital assets",
      "Licenses",
      "AI Agents and MCPs",
      "Enterprise",
      "Communities",
      "All categories"
    ]);
  });

  it("maps every exported destination to the actual router configuration", () => {
    const routerSource = readFileSync(new URL("../main.tsx", import.meta.url), "utf8");
    for (const destination of marketplaceNavigationDestinations) {
      const route = destination.split("?")[0].replace(/^\//, "");
      expect(routerSource, `Missing router path for ${destination}`).toContain(`path: "${route}"`);
    }
    expect(routerSource).toContain('path: "marketpalce"');
    expect(routerSource).toContain('path: "marketpalce/create"');
    expect(routerSource).toContain('path: "item/:chain/:contract/:id"');
  });
});

import { describe, expect, it } from "vitest";
import { isMarketplaceThemePreference, resolveMarketplaceTheme } from "./useMarketplaceTheme";

describe("marketplace theme", () => {
  it("resolves explicit and system preferences deterministically", () => {
    expect(resolveMarketplaceTheme("light", true)).toBe("light");
    expect(resolveMarketplaceTheme("dark", false)).toBe("dark");
    expect(resolveMarketplaceTheme("system", true)).toBe("dark");
    expect(resolveMarketplaceTheme("system", false)).toBe("light");
  });

  it("accepts only supported persisted preferences", () => {
    expect(isMarketplaceThemePreference("light")).toBe(true);
    expect(isMarketplaceThemePreference("dark")).toBe(true);
    expect(isMarketplaceThemePreference("system")).toBe(true);
    expect(isMarketplaceThemePreference("tenant-dark-preview")).toBe(false);
  });
});


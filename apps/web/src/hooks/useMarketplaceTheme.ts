import { useEffect, useState } from "react";

export type MarketplaceThemePreference = "light" | "dark" | "system";

const STORAGE_KEY = "axodus-marketplace-theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";

export function isMarketplaceThemePreference(value: unknown): value is MarketplaceThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

export function resolveMarketplaceTheme(preference: MarketplaceThemePreference, systemPrefersDark: boolean): "light" | "dark" {
  if (preference === "system") return systemPrefersDark ? "dark" : "light";
  return preference;
}

function readInitialPreference(): MarketplaceThemePreference {
  if (typeof document !== "undefined" && isMarketplaceThemePreference(document.documentElement.dataset.themePreference)) {
    return document.documentElement.dataset.themePreference;
  }
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isMarketplaceThemePreference(stored)) return stored;
  }
  return "system";
}

export function useMarketplaceTheme() {
  const [preference, setPreference] = useState<MarketplaceThemePreference>(readInitialPreference);

  useEffect(() => {
    const media = window.matchMedia(DARK_QUERY);
    const applyTheme = () => {
      document.documentElement.dataset.themePreference = preference;
      document.documentElement.dataset.theme = resolveMarketplaceTheme(preference, media.matches);
    };

    window.localStorage.setItem(STORAGE_KEY, preference);
    applyTheme();
    media.addEventListener("change", applyTheme);
    return () => media.removeEventListener("change", applyTheme);
  }, [preference]);

  return {
    preference,
    resolvedTheme: typeof document === "undefined" ? "light" : document.documentElement.dataset.theme ?? "light",
    setPreference
  };
}


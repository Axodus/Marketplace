import { useEffect, useId, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, Search, SunMoon, Wallet, X } from "lucide-react";
import {
  marketplaceCategoryNavigation,
  marketplaceNavigationGroups,
  primaryMarketplaceNavigation
} from "../config/marketplaceNavigation";
import { useMarketplaceTheme } from "../hooks/useMarketplaceTheme";
import { useWallet } from "../hooks/useWallet";
import { resolveTenantBranding } from "../modules/marketplace/services/marketplaceService";

const axodusLogoUrl = new URL("../../../../public/assets/Axodus_logo.svg", import.meta.url).href;

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const wallet = useWallet();
  const theme = useMarketplaceTheme();
  const [appMenuOpen, setAppMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState(() => new URLSearchParams(location.search).get("q") ?? "");
  const appMenuId = useId();
  const mobileMenuId = useId();
  const tenantRouteMatch = location.pathname.match(/^\/marketplace\/(?:tenants|t)\/([^/]+)/);
  const tenantBranding = resolveTenantBranding(tenantRouteMatch?.[1]).branding;

  useEffect(() => {
    setAppMenuOpen(false);
    setMobileMenuOpen(false);
    setSearch(new URLSearchParams(location.search).get("q") ?? "");
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!appMenuOpen && !mobileMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAppMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [appMenuOpen, mobileMenuOpen]);

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = search.trim();
    void navigate(query ? `/marketplace/explore?q=${encodeURIComponent(query)}` : "/marketplace/explore");
  }

  return (
    <div className="min-h-screen bg-marketplace-bg text-marketplace-text">
      <a
        href="#marketplace-main"
        className="fixed left-4 top-3 z-[70] -translate-y-20 rounded-lg bg-marketplace-graphite px-4 py-2 text-sm font-semibold text-marketplace-surface focus:translate-y-0"
      >
        Skip to marketplace content
      </a>

      <header className="sticky top-0 z-50 border-b border-marketplace-border bg-marketplace-surface">
        <div className="marketplace-container flex h-16 items-center gap-3">
          <Link
            to={tenantRouteMatch ? `/marketplace/t/${tenantRouteMatch[1]}` : "/marketplace"}
            className="flex shrink-0 items-center gap-2 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-marketplace-focus"
            aria-label={tenantRouteMatch ? `${tenantBranding.displayName} marketplace home` : "Axodus Marketplace home"}
          >
            <img src={axodusLogoUrl} alt="" className="h-8 w-auto" />
            <span className="hidden text-base font-semibold tracking-tight text-marketplace-graphite sm:block">
              {tenantRouteMatch ? tenantBranding.shortName : "Axodus Marketplace"}
            </span>
          </Link>

          <nav className="ml-3 hidden items-stretch self-stretch xl:flex" aria-label="Primary marketplace navigation">
            {primaryMarketplaceNavigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center border-b-2 px-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-marketplace-focus ${
                    isActive
                      ? "border-marketplace-graphite text-marketplace-graphite"
                      : "border-transparent text-marketplace-text-muted hover:text-marketplace-text"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <form onSubmit={submitSearch} role="search" className="ml-auto hidden min-w-0 max-w-xl flex-1 lg:block">
            <label className="relative block">
              <span className="sr-only">Search marketplace products, licenses and collections</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-marketplace-text-muted" size={18} />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products, licenses and collections"
                className="marketplace-control w-full py-2.5 pl-10 pr-3 text-sm"
              />
            </label>
          </form>

          <WalletControl wallet={wallet} compact />

          <label className="relative hidden sm:block">
            <span className="sr-only">Marketplace color theme</span>
            <SunMoon className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-marketplace-text-muted" size={16} />
            <select
              value={theme.preference}
              onChange={(event) => theme.setPreference(event.target.value as typeof theme.preference)}
              className="marketplace-control appearance-none py-2 pl-8 pr-7 text-xs font-semibold"
              aria-label="Marketplace color theme"
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>

          <div className="relative hidden xl:block">
            <button
              type="button"
              onClick={() => setAppMenuOpen((open) => !open)}
              className="marketplace-control inline-flex items-center gap-2 text-sm font-semibold"
              aria-expanded={appMenuOpen}
              aria-controls={appMenuId}
            >
              Menu <ChevronDown size={16} aria-hidden="true" />
            </button>
            {appMenuOpen ? <ApplicationMenu id={appMenuId} /> : null}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="marketplace-control inline-flex h-10 w-10 items-center justify-center p-0 xl:hidden"
            aria-expanded={mobileMenuOpen}
            aria-controls={mobileMenuId}
            aria-label={mobileMenuOpen ? "Close marketplace menu" : "Open marketplace menu"}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className="marketplace-container pb-3 lg:hidden">
          <form onSubmit={submitSearch} role="search">
            <label className="relative block">
              <span className="sr-only">Search marketplace products, licenses and collections</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-marketplace-text-muted" size={18} />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search marketplace"
                className="marketplace-control w-full pl-10 text-sm"
              />
            </label>
          </form>
        </div>

        {mobileMenuOpen ? (
          <div id={mobileMenuId} className="border-t border-marketplace-border bg-marketplace-surface xl:hidden">
            <div className="marketplace-container max-h-[calc(100vh-8rem)] overflow-y-auto py-4">
              <nav aria-label="Mobile marketplace navigation" className="space-y-5">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {primaryMarketplaceNavigation.map((item) => (
                    <NavLink key={item.to} to={item.to} className={mobileLinkClass}>
                      {item.label}
                    </NavLink>
                  ))}
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  {marketplaceNavigationGroups.map((group) => (
                    <NavigationGroup key={group.id} group={group} />
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-3 border-t border-marketplace-border pt-4 sm:hidden">
                  <SunMoon size={18} aria-hidden="true" />
                  <label className="text-sm font-semibold" htmlFor="mobile-theme-select">Theme</label>
                  <select
                    id="mobile-theme-select"
                    value={theme.preference}
                    onChange={(event) => theme.setPreference(event.target.value as typeof theme.preference)}
                    className="marketplace-control ml-auto text-sm"
                  >
                    <option value="system">System</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
                <WalletControl wallet={wallet} />
              </nav>
            </div>
          </div>
        ) : null}

        <nav className="hidden border-t border-marketplace-border md:block" aria-label="Marketplace categories">
          <div className="marketplace-container flex items-center gap-1 overflow-x-auto py-2">
            {marketplaceCategoryNavigation.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium text-marketplace-text-muted hover:bg-marketplace-muted hover:text-marketplace-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-marketplace-focus"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <main id="marketplace-main" className="marketplace-container py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
function ApplicationMenu({ id }: { id: string }) {
  return (
    <nav
      id={id}
      aria-label="Marketplace application destinations"
      className="absolute right-0 top-12 grid w-[42rem] grid-cols-2 gap-5 rounded-xl border border-marketplace-border bg-marketplace-surface p-5 shadow-xl"
    >
      {marketplaceNavigationGroups.map((group) => (
        <NavigationGroup key={group.id} group={group} />
      ))}
    </nav>
  );
}

function NavigationGroup({ group }: { group: (typeof marketplaceNavigationGroups)[number] }) {
  return (
    <section aria-labelledby={`navigation-${group.id}`}>
      <h2 id={`navigation-${group.id}`} className="text-xs font-semibold uppercase tracking-[0.12em] text-marketplace-text-muted">
        {group.label}
      </h2>
      <div className="mt-2 grid gap-1">
        {group.items.map((item) => (
          <NavLink key={item.to} to={item.to} className={mobileLinkClass}>
            <item.icon size={16} aria-hidden="true" /> {item.label}
          </NavLink>
        ))}
      </div>
    </section>
  );
}

function mobileLinkClass({ isActive }: { isActive: boolean }) {
  return `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-marketplace-focus ${
    isActive ? "bg-marketplace-graphite text-marketplace-surface" : "text-marketplace-text-muted hover:bg-marketplace-muted hover:text-marketplace-text"
  }`;
}

function WalletControl({ wallet, compact = false }: { wallet: ReturnType<typeof useWallet>; compact?: boolean }) {
  const walletTone =
    wallet.status === "connected"
      ? "bg-marketplace-trusted"
      : wallet.status === "unsupported_chain" || wallet.status === "restricted_chain"
        ? "bg-amber-500"
        : wallet.status === "error"
          ? "bg-marketplace-danger"
          : "bg-marketplace-text-muted";

  return (
    <div
      className={`${compact ? "hidden lg:flex" : "flex"} items-center gap-2 rounded-lg border border-marketplace-border bg-marketplace-surface px-2.5 py-2 text-xs`}
      aria-label="Readonly wallet state"
    >
      <Wallet size={16} aria-hidden="true" />
      <span className={`h-2 w-2 rounded-full ${walletTone}`} aria-hidden="true" />
      <span className="font-semibold">{wallet.shortAddress ?? "Disconnected"}</span>
      <span className="hidden text-marketplace-text-muted 2xl:inline">{wallet.chainName}</span>
      {wallet.status === "unsupported_chain" || wallet.status === "restricted_chain" ? (
        <button type="button" onClick={() => void wallet.switchChain(137)} className="font-semibold text-marketplace-accent-text underline-offset-2 hover:underline">
          Switch Polygon
        </button>
      ) : wallet.disconnected ? (
        <button type="button" onClick={() => void wallet.connect()} className="font-semibold text-marketplace-trusted underline-offset-2 hover:underline">
          Connect
        </button>
      ) : (
        <button type="button" onClick={() => void wallet.disconnect()} className="font-semibold text-marketplace-text-muted underline-offset-2 hover:underline">
          Disconnect
        </button>
      )}
      <span className="sr-only">Readonly wallet boundary</span>
    </div>
  );
}

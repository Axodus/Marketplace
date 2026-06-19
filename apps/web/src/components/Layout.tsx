import { Link, NavLink, useLocation } from "react-router-dom";
import { BarChart3, BookMarked, Bot, Box, Building2, CircleDollarSign, FileCode2, FileSearch, FilePlus2, Gavel, Globe2, GraduationCap, Handshake, LayoutDashboard, Layers3, MousePointerClick, RadioTower, ReceiptText, Share2, ShieldCheck, Tags, WalletCards } from "lucide-react";
import { useWallet } from "../hooks/useWallet";
import { resolveTenantBranding } from "../modules/marketplace/services/marketplaceService";

const links = [
  { to: "/marketplace", label: "Home", icon: Box },
  { to: "/marketplace/explore", label: "Explore", icon: Tags },
  { to: "/marketplace/collections", label: "Collections", icon: Layers3 },
  { to: "/marketplace/curated", label: "Curated", icon: BookMarked },
  { to: "/marketplace/distribution", label: "Distribution", icon: Share2 },
  { to: "/marketplace/distribution/attribution", label: "Attribution", icon: MousePointerClick },
  { to: "/marketplace/distribution/communities", label: "Communities", icon: Globe2 },
  { to: "/marketplace/distribution/profiles", label: "Partners", icon: Handshake },
  { to: "/marketplace/revenue-sharing", label: "Revenue", icon: CircleDollarSign },
  { to: "/marketplace/intelligence", label: "Intelligence", icon: BarChart3 },
  { to: "/marketplace/academy", label: "Academy", icon: GraduationCap },
  { to: "/marketplace/acs", label: "ACS", icon: Bot },
  { to: "/marketplace/enterprise", label: "Enterprise", icon: Building2 },
  { to: "/marketplace/create", label: "Create/Sell", icon: FilePlus2 },
  { to: "/marketplace/tenants", label: "Tenants", icon: Building2 },
  { to: "/marketplace/governance", label: "Governance", icon: ShieldCheck },
  { to: "/marketplace/licenses", label: "Licenses", icon: WalletCards },
  { to: "/marketplace/contracts", label: "Contracts", icon: FileCode2 },
  { to: "/marketplace/providers", label: "Providers", icon: RadioTower },
  { to: "/marketplace/wallet-discovery", label: "Discovery", icon: WalletCards },
  { to: "/marketplace/entitlements", label: "Entitlements", icon: WalletCards },
  { to: "/marketplace/orders", label: "Billing", icon: ReceiptText },
  { to: "/marketplace/audit", label: "Audit", icon: FileSearch },
  { to: "/marketplace/operator", label: "Operator", icon: RadioTower },
  { to: "/marketplace/dashboard", label: "Dashboard", icon: LayoutDashboard }
];

export function Layout({ children }: { children: React.ReactNode }) {
  const wallet = useWallet();
  const location = useLocation();
  const tenantRouteMatch = location.pathname.match(/^\/marketplace\/(?:tenants|t)\/([^/]+)/);
  const tenantBranding = resolveTenantBranding(tenantRouteMatch?.[1]);
  const headerBranding = tenantBranding.branding;
  const walletTone =
    wallet.status === "connected"
      ? "bg-emerald-600"
      : wallet.status === "unsupported_chain" || wallet.status === "restricted_chain"
        ? "bg-amber-500"
        : wallet.status === "error"
          ? "bg-rose-600"
          : "bg-slate-400";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to={tenantRouteMatch ? `/marketplace/t/${tenantRouteMatch[1]}` : "/marketplace"} className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded border text-white" style={{ backgroundColor: headerBranding.primaryColor, borderColor: headerBranding.secondaryColor }}>
              <Gavel size={20} />
            </span>
            <span>
              <span className="block text-sm font-semibold uppercase tracking-wide text-slate-500">
                {tenantRouteMatch ? headerBranding.visualIdentity.badgeLabel : "Axodus"}
              </span>
              <span className="block text-lg font-semibold">{tenantRouteMatch ? headerBranding.shortName : "NFT Marketplace"}</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Marketplace sections">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }: { isActive: boolean }) =>
                  `flex items-center gap-2 rounded px-3 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${
                    isActive ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`
                }
              >
                <link.icon size={16} />
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-3 rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm md:flex" aria-label="Readonly wallet state">
            <span className={`h-2 w-2 rounded-full ${walletTone}`} />
            <span className="font-medium">{wallet.shortAddress ?? "Wallet disconnected"}</span>
            <span className="text-slate-500">{wallet.chainName}</span>
            {wallet.status === "unsupported_chain" || wallet.status === "restricted_chain" ? (
              <button
                type="button"
                onClick={() => void wallet.switchChain(137)}
                className="rounded border border-amber-300 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-900 hover:bg-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
              >
                Switch Polygon
              </button>
            ) : null}
            {wallet.disconnected ? (
              <button
                type="button"
                onClick={() => void wallet.connect()}
                className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
              >
                Connect
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void wallet.disconnect()}
                className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
              >
                Disconnect
              </button>
            )}
            <span className="text-xs text-slate-500">readonly</span>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}

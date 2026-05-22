import { Link, NavLink } from "react-router-dom";
import { Box, Building2, FileSearch, FilePlus2, Gavel, LayoutDashboard, ReceiptText, ShieldCheck, Tags, WalletCards } from "lucide-react";

const ReownWalletStateMock = {
  address: "0xAxoD...Mock",
  chain: "Polygon"
};

const links = [
  { to: "/marketplace", label: "Home", icon: Box },
  { to: "/marketplace/explore", label: "Explore", icon: Tags },
  { to: "/marketplace/create", label: "Create/Sell", icon: FilePlus2 },
  { to: "/marketplace/tenants/tenant-axodus-dao", label: "DAO Storefront", icon: Building2 },
  { to: "/marketplace/governance", label: "Governance", icon: ShieldCheck },
  { to: "/marketplace/licenses", label: "Licenses", icon: WalletCards },
  { to: "/marketplace/entitlements", label: "Entitlements", icon: WalletCards },
  { to: "/marketplace/orders", label: "Billing", icon: ReceiptText },
  { to: "/marketplace/audit", label: "Audit", icon: FileSearch },
  { to: "/marketplace/dashboard", label: "Dashboard", icon: LayoutDashboard }
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/marketplace" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded border border-slate-300 bg-slate-950 text-white">
              <Gavel size={20} />
            </span>
            <span>
              <span className="block text-sm font-semibold uppercase tracking-wide text-slate-500">Axodus</span>
              <span className="block text-lg font-semibold">NFT Marketplace</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Marketplace sections">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
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
          <div className="hidden items-center gap-3 rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm md:flex" aria-label="Mock wallet state">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            <span className="font-medium">{ReownWalletStateMock.address}</span>
            <span className="text-slate-500">{ReownWalletStateMock.chain} mock</span>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}

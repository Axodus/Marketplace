import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bot,
  Building2,
  CircleDollarSign,
  FileCode2,
  FileSearch,
  Globe2,
  GraduationCap,
  Handshake,
  LayoutDashboard,
  MousePointerClick,
  RadioTower,
  ReceiptText,
  Share2,
  ShieldCheck,
  Tags,
  WalletCards
} from "lucide-react";

export interface MarketplaceNavigationItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export interface MarketplaceNavigationGroup {
  id: "partner-hub" | "platform" | "operations" | "ecosystem";
  label: string;
  items: MarketplaceNavigationItem[];
}

export const primaryMarketplaceNavigation = [
  { to: "/marketplace/explore", label: "Explore" },
  { to: "/marketplace/collections", label: "Collections" },
  { to: "/marketplace/curated", label: "Curated" },
  { to: "/marketplace/sell", label: "Sell" }
] as const;

export const marketplaceCategoryNavigation = [
  { to: "/marketplace/explore?category=Education", label: "Education" },
  { to: "/marketplace/explore?category=Digital%20Assets", label: "Digital assets" },
  { to: "/marketplace/explore?assetType=offchain", label: "Licenses" },
  { to: "/marketplace/explore?category=MCPs", label: "AI Agents and MCPs" },
  { to: "/marketplace/enterprise", label: "Enterprise" },
  { to: "/marketplace/distribution/communities", label: "Communities" },
  { to: "/marketplace/categories", label: "All categories" }
] as const;

export const marketplaceNavigationGroups: MarketplaceNavigationGroup[] = [
  {
    id: "partner-hub",
    label: "Partner Hub",
    items: [
      { to: "/marketplace/distribution", label: "Distribution", icon: Share2 },
      { to: "/marketplace/distribution/attribution", label: "Attribution", icon: MousePointerClick },
      { to: "/marketplace/distribution/communities", label: "Communities", icon: Globe2 },
      { to: "/marketplace/distribution/profiles", label: "Partners", icon: Handshake },
      { to: "/marketplace/revenue-sharing", label: "Revenue", icon: CircleDollarSign },
      { to: "/marketplace/intelligence", label: "Intelligence", icon: BarChart3 }
    ]
  },
  {
    id: "platform",
    label: "Platform",
    items: [
      { to: "/marketplace/tenants", label: "Tenants", icon: Building2 },
      { to: "/marketplace/governance", label: "Governance", icon: ShieldCheck },
      { to: "/marketplace/licenses", label: "Licenses", icon: WalletCards },
      { to: "/marketplace/contracts", label: "Contracts", icon: FileCode2 },
      { to: "/marketplace/providers", label: "Providers", icon: RadioTower },
      { to: "/marketplace/wallet-discovery", label: "Discovery", icon: WalletCards },
      { to: "/marketplace/entitlements", label: "Entitlements", icon: WalletCards }
    ]
  },
  {
    id: "operations",
    label: "Operations",
    items: [
      { to: "/marketplace/orders", label: "Billing", icon: ReceiptText },
      { to: "/marketplace/audit", label: "Audit", icon: FileSearch },
      { to: "/marketplace/operator", label: "Operator", icon: RadioTower },
      { to: "/marketplace/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/marketplace/enterprise/operations", label: "Enterprise operations", icon: Building2 }
    ]
  },
  {
    id: "ecosystem",
    label: "Ecosystem",
    items: [
      { to: "/marketplace/academy", label: "Academy", icon: GraduationCap },
      { to: "/marketplace/acs", label: "ACS", icon: Bot },
      { to: "/marketplace/enterprise", label: "Enterprise", icon: Building2 },
      { to: "/marketplace/sovereign", label: "Sovereign", icon: Globe2 },
      { to: "/marketplace/categories", label: "All categories", icon: Tags }
    ]
  }
];

export const marketplaceNavigationDestinations = Array.from(
  new Set([
    "/marketplace",
    ...primaryMarketplaceNavigation.map((item) => item.to),
    ...marketplaceCategoryNavigation.map((item) => item.to),
    ...marketplaceNavigationGroups.flatMap((group) => group.items.map((item) => item.to))
  ])
);


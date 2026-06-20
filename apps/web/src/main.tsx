import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { App } from "./App";
import { RouteErrorPage } from "./pages/RouteErrorPage";
import "./styles/globals.css";

const MarketplaceHomePage = lazy(() => import("./modules/marketplace/pages/MarketplaceHomePage").then((module) => ({ default: module.MarketplaceHomePage })));
const ProductExplorerPage = lazy(() => import("./modules/marketplace/pages/ProductExplorerPage").then((module) => ({ default: module.ProductExplorerPage })));
const CollectionsPage = lazy(() => import("./modules/marketplace/pages/CollectionsPage").then((module) => ({ default: module.CollectionsPage })));
const CollectionDetailPage = lazy(() => import("./modules/marketplace/pages/CollectionDetailPage").then((module) => ({ default: module.CollectionDetailPage })));
const CuratedCatalogsPage = lazy(() => import("./modules/marketplace/pages/CuratedCatalogsPage").then((module) => ({ default: module.CuratedCatalogsPage })));
const DistributionNetworkPage = lazy(() => import("./modules/marketplace/pages/DistributionNetworkPage").then((module) => ({ default: module.DistributionNetworkPage })));
const DistributionProfilesPage = lazy(() => import("./modules/marketplace/pages/DistributionProfilesPage").then((module) => ({ default: module.DistributionProfilesPage })));
const AttributionSourcesPage = lazy(() => import("./modules/marketplace/pages/AttributionSourcesPage").then((module) => ({ default: module.AttributionSourcesPage })));
const CommunityDistributionsPage = lazy(() => import("./modules/marketplace/pages/CommunityDistributionsPage").then((module) => ({ default: module.CommunityDistributionsPage })));
const RevenueSharingPage = lazy(() => import("./modules/marketplace/pages/RevenueSharingPage").then((module) => ({ default: module.RevenueSharingPage })));
const MarketplaceIntelligencePage = lazy(() => import("./modules/marketplace/pages/MarketplaceIntelligencePage").then((module) => ({ default: module.MarketplaceIntelligencePage })));
const AcademyDistributionPage = lazy(() => import("./modules/marketplace/pages/AcademyDistributionPage").then((module) => ({ default: module.AcademyDistributionPage })));
const ACSDistributionPage = lazy(() => import("./modules/marketplace/pages/ACSDistributionPage").then((module) => ({ default: module.ACSDistributionPage })));
const EnterpriseMarketplacePage = lazy(() => import("./modules/marketplace/pages/EnterpriseMarketplacePage").then((module) => ({ default: module.EnterpriseMarketplacePage })));
const EnterpriseProductDetailPage = lazy(() => import("./modules/marketplace/pages/EnterpriseProductDetailPage").then((module) => ({ default: module.EnterpriseProductDetailPage })));
const EnterpriseSubscribePreviewPage = lazy(() => import("./modules/marketplace/pages/EnterpriseSubscribePreviewPage").then((module) => ({ default: module.EnterpriseSubscribePreviewPage })));
const EnterpriseLicensePage = lazy(() => import("./modules/marketplace/pages/EnterpriseLicensePage").then((module) => ({ default: module.EnterpriseLicensePage })));
const EnterpriseProvisioningPage = lazy(() => import("./modules/marketplace/pages/EnterpriseProvisioningPage").then((module) => ({ default: module.EnterpriseProvisioningPage })));
const EnterpriseBillingPage = lazy(() => import("./modules/marketplace/pages/EnterpriseBillingPage").then((module) => ({ default: module.EnterpriseBillingPage })));
const EnterpriseTelemetryPage = lazy(() => import("./modules/marketplace/pages/EnterpriseTelemetryPage").then((module) => ({ default: module.EnterpriseTelemetryPage })));
const EnterpriseOperationsPage = lazy(() => import("./modules/marketplace/pages/EnterpriseOperationsPage").then((module) => ({ default: module.EnterpriseOperationsPage })));
const SovereignCommercePage = lazy(() => import("./modules/marketplace/pages/SovereignCommercePage").then((module) => ({ default: module.SovereignCommercePage })));
const CreateSellPage = lazy(() => import("./modules/marketplace/pages/CreateSellPage").then((module) => ({ default: module.CreateSellPage })));
const ProductDetailPage = lazy(() => import("./modules/marketplace/pages/ProductDetailPage").then((module) => ({ default: module.ProductDetailPage })));
const SellerProfilePage = lazy(() => import("./modules/marketplace/pages/SellerProfilePage").then((module) => ({ default: module.SellerProfilePage })));
const TenantStorefrontPage = lazy(() => import("./modules/marketplace/pages/TenantStorefrontPage").then((module) => ({ default: module.TenantStorefrontPage })));
const ProductCategoriesPage = lazy(() => import("./modules/marketplace/pages/ProductCategoriesPage").then((module) => ({ default: module.ProductCategoriesPage })));
const MarketplaceGovernancePage = lazy(() => import("./modules/marketplace/pages/MarketplaceGovernancePage").then((module) => ({ default: module.MarketplaceGovernancePage })));
const MarketplaceLicensePage = lazy(() => import("./modules/marketplace/pages/MarketplaceLicensePage").then((module) => ({ default: module.MarketplaceLicensePage })));
const ExternalContractsPage = lazy(() => import("./modules/marketplace/pages/ExternalContractsPage").then((module) => ({ default: module.ExternalContractsPage })));
const FederationProvidersPage = lazy(() => import("./modules/marketplace/pages/FederationProvidersPage").then((module) => ({ default: module.FederationProvidersPage })));
const WalletDiscoveryPage = lazy(() => import("./modules/marketplace/pages/WalletDiscoveryPage").then((module) => ({ default: module.WalletDiscoveryPage })));
const EntitlementDashboardPage = lazy(() => import("./modules/marketplace/pages/EntitlementDashboardPage").then((module) => ({ default: module.EntitlementDashboardPage })));
const BillingRuntimePage = lazy(() => import("./modules/marketplace/pages/BillingRuntimePage").then((module) => ({ default: module.BillingRuntimePage })));
const TraceabilityDashboardPage = lazy(() => import("./modules/marketplace/pages/TraceabilityDashboardPage").then((module) => ({ default: module.TraceabilityDashboardPage })));
const GovernanceOperatorConsolePage = lazy(() =>
  import("./modules/marketplace/pages/GovernanceOperatorConsolePage").then((module) => ({ default: module.GovernanceOperatorConsolePage }))
);
const MarketplaceDashboardPage = lazy(() => import("./modules/marketplace/pages/MarketplaceDashboardPage").then((module) => ({ default: module.MarketplaceDashboardPage })));
const LegacyItemPage = lazy(() => import("./modules/marketplace/pages/LegacyItemPage").then((module) => ({ default: module.LegacyItemPage })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false
    }
  }
});

function routeElement(element: React.ReactNode) {
  return <Suspense fallback={<RouteLoadingState />}>{element}</Suspense>;
}

function RouteLoadingState() {
  return (
    <section className="rounded border border-slate-200 bg-white p-6 shadow-sm" role="status" aria-live="polite">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Marketplace runtime</p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-950">Loading route preview</h1>
      <p className="mt-2 text-sm text-slate-600">Loading isolated Marketplace chunk. No settlement or wallet action is executing.</p>
    </section>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <Navigate to="/marketplace" replace /> },
      { path: "marketpalce", element: <Navigate to="/marketplace" replace /> },
      { path: "marketpalce/create", element: <Navigate to="/marketplace/create" replace /> },
      { path: "marketpalce/*", element: <Navigate to="/marketplace" replace /> },
      { path: "marketplace", element: routeElement(<MarketplaceHomePage />) },
      { path: "marketplace/explore", element: routeElement(<ProductExplorerPage />) },
      { path: "marketplace/collections", element: routeElement(<CollectionsPage />) },
      { path: "marketplace/collections/:slug", element: routeElement(<CollectionDetailPage />) },
      { path: "marketplace/curated", element: routeElement(<CuratedCatalogsPage />) },
      { path: "marketplace/curated/:catalogId", element: routeElement(<CuratedCatalogsPage />) },
      { path: "marketplace/distribution", element: routeElement(<DistributionNetworkPage />) },
      { path: "marketplace/distribution/attribution", element: routeElement(<AttributionSourcesPage />) },
      { path: "marketplace/distribution/attribution/:sourceSlug", element: routeElement(<AttributionSourcesPage />) },
      { path: "marketplace/distribution/communities", element: routeElement(<CommunityDistributionsPage />) },
      { path: "marketplace/distribution/communities/:communitySlug", element: routeElement(<CommunityDistributionsPage />) },
      { path: "marketplace/revenue-sharing", element: routeElement(<RevenueSharingPage />) },
      { path: "marketplace/revenue-sharing/:policySlug", element: routeElement(<RevenueSharingPage />) },
      { path: "marketplace/intelligence", element: routeElement(<MarketplaceIntelligencePage />) },
      { path: "marketplace/intelligence/:insightSlug", element: routeElement(<MarketplaceIntelligencePage />) },
      { path: "marketplace/academy", element: routeElement(<AcademyDistributionPage />) },
      { path: "marketplace/academy/:academySlug", element: routeElement(<AcademyDistributionPage />) },
      { path: "marketplace/acs", element: routeElement(<ACSDistributionPage />) },
      { path: "marketplace/acs/:acsSlug", element: routeElement(<ACSDistributionPage />) },
      { path: "marketplace/enterprise", element: routeElement(<EnterpriseMarketplacePage />) },
      { path: "marketplace/enterprise/operations", element: routeElement(<EnterpriseOperationsPage />) },
      { path: "marketplace/enterprise/:slug", element: routeElement(<EnterpriseProductDetailPage />) },
      { path: "marketplace/enterprise/:slug/subscribe-preview", element: routeElement(<EnterpriseSubscribePreviewPage />) },
      { path: "marketplace/enterprise/:slug/license", element: routeElement(<EnterpriseLicensePage />) },
      { path: "marketplace/enterprise/:slug/provisioning", element: routeElement(<EnterpriseProvisioningPage />) },
      { path: "marketplace/enterprise/:slug/billing", element: routeElement(<EnterpriseBillingPage />) },
      { path: "marketplace/enterprise/:slug/telemetry", element: routeElement(<EnterpriseTelemetryPage />) },
      { path: "marketplace/sovereign", element: routeElement(<SovereignCommercePage />) },
      { path: "marketplace/sovereign/:nodeSlug", element: routeElement(<SovereignCommercePage />) },
      { path: "marketplace/distribution/profiles", element: routeElement(<DistributionProfilesPage />) },
      { path: "marketplace/distribution/profiles/:profileSlug", element: routeElement(<DistributionProfilesPage />) },
      { path: "marketplace/distribution/:channelId", element: routeElement(<DistributionNetworkPage />) },
      { path: "marketplace/create", element: routeElement(<CreateSellPage />) },
      { path: "marketplace/sell", element: routeElement(<CreateSellPage />) },
      { path: "marketplace/products/:slug", element: routeElement(<ProductDetailPage />) },
      { path: "marketplace/sellers/:sellerId", element: routeElement(<SellerProfilePage />) },
      { path: "marketplace/tenants", element: routeElement(<TenantStorefrontPage />) },
      { path: "marketplace/tenants/:tenantId", element: routeElement(<TenantStorefrontPage />) },
      { path: "marketplace/t/:tenantSlug", element: routeElement(<TenantStorefrontPage />) },
      { path: "marketplace/categories", element: routeElement(<ProductCategoriesPage />) },
      { path: "marketplace/governance", element: routeElement(<MarketplaceGovernancePage />) },
      { path: "marketplace/licenses", element: routeElement(<MarketplaceLicensePage />) },
      { path: "marketplace/contracts", element: routeElement(<ExternalContractsPage />) },
      { path: "marketplace/contracts/:contractId", element: routeElement(<ExternalContractsPage />) },
      { path: "marketplace/providers", element: routeElement(<FederationProvidersPage />) },
      { path: "marketplace/wallet-discovery", element: routeElement(<WalletDiscoveryPage />) },
      { path: "marketplace/wallet-discovery/:walletAddress", element: routeElement(<WalletDiscoveryPage />) },
      { path: "marketplace/entitlements", element: routeElement(<EntitlementDashboardPage />) },
      { path: "marketplace/orders", element: routeElement(<BillingRuntimePage />) },
      { path: "marketplace/audit", element: routeElement(<TraceabilityDashboardPage />) },
      { path: "marketplace/operator", element: routeElement(<GovernanceOperatorConsolePage />) },
      { path: "marketplace/dashboard", element: routeElement(<MarketplaceDashboardPage />) },
      { path: "item/:chain/:contract/:id", element: routeElement(<LegacyItemPage />) },
      { path: "*", element: <RouteErrorPage /> }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);

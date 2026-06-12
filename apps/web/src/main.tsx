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
      { path: "marketplace/create", element: routeElement(<CreateSellPage />) },
      { path: "marketplace/sell", element: routeElement(<CreateSellPage />) },
      { path: "marketplace/products/:slug", element: routeElement(<ProductDetailPage />) },
      { path: "marketplace/sellers/:sellerId", element: routeElement(<SellerProfilePage />) },
      { path: "marketplace/tenants", element: routeElement(<TenantStorefrontPage />) },
      { path: "marketplace/tenants/:tenantId", element: routeElement(<TenantStorefrontPage />) },
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

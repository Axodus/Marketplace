import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { App } from "./App";
import { CreateSellPage } from "./modules/marketplace/pages/CreateSellPage";
import { LegacyItemPage } from "./modules/marketplace/pages/LegacyItemPage";
import { MarketplaceDashboardPage } from "./modules/marketplace/pages/MarketplaceDashboardPage";
import { MarketplaceGovernancePage } from "./modules/marketplace/pages/MarketplaceGovernancePage";
import { MarketplaceHomePage } from "./modules/marketplace/pages/MarketplaceHomePage";
import { MarketplaceLicensePage } from "./modules/marketplace/pages/MarketplaceLicensePage";
import { ProductCategoriesPage } from "./modules/marketplace/pages/ProductCategoriesPage";
import { ProductDetailPage } from "./modules/marketplace/pages/ProductDetailPage";
import { ProductExplorerPage } from "./modules/marketplace/pages/ProductExplorerPage";
import { SellerProfilePage } from "./modules/marketplace/pages/SellerProfilePage";
import { RouteErrorPage } from "./pages/RouteErrorPage";
import "./styles/globals.css";

const queryClient = new QueryClient();

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
      { path: "marketplace", element: <MarketplaceHomePage /> },
      { path: "marketplace/explore", element: <ProductExplorerPage /> },
      { path: "marketplace/create", element: <CreateSellPage /> },
      { path: "marketplace/sell", element: <CreateSellPage /> },
      { path: "marketplace/products/:slug", element: <ProductDetailPage /> },
      { path: "marketplace/sellers/:sellerId", element: <SellerProfilePage /> },
      { path: "marketplace/categories", element: <ProductCategoriesPage /> },
      { path: "marketplace/governance", element: <MarketplaceGovernancePage /> },
      { path: "marketplace/licenses", element: <MarketplaceLicensePage /> },
      { path: "marketplace/dashboard", element: <MarketplaceDashboardPage /> },
      { path: "item/:chain/:contract/:id", element: <LegacyItemPage /> },
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

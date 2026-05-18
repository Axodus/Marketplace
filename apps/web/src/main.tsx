import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { App } from "./App";
import { MarketplaceDashboardPage } from "./modules/marketplace/pages/MarketplaceDashboardPage";
import { MarketplaceGovernancePage } from "./modules/marketplace/pages/MarketplaceGovernancePage";
import { MarketplaceHomePage } from "./modules/marketplace/pages/MarketplaceHomePage";
import { MarketplaceLicensePage } from "./modules/marketplace/pages/MarketplaceLicensePage";
import { ProductCategoriesPage } from "./modules/marketplace/pages/ProductCategoriesPage";
import { ProductDetailPage } from "./modules/marketplace/pages/ProductDetailPage";
import { ProductExplorerPage } from "./modules/marketplace/pages/ProductExplorerPage";
import { SellerProfilePage } from "./modules/marketplace/pages/SellerProfilePage";
import "./styles/globals.css";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/marketplace" replace /> },
      { path: "marketplace", element: <MarketplaceHomePage /> },
      { path: "marketplace/explore", element: <ProductExplorerPage /> },
      { path: "marketplace/products/:slug", element: <ProductDetailPage /> },
      { path: "marketplace/sellers/:sellerId", element: <SellerProfilePage /> },
      { path: "marketplace/categories", element: <ProductCategoriesPage /> },
      { path: "marketplace/governance", element: <MarketplaceGovernancePage /> },
      { path: "marketplace/licenses", element: <MarketplaceLicensePage /> },
      { path: "marketplace/dashboard", element: <MarketplaceDashboardPage /> }
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

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ProductFilters } from "../services/marketplaceService";
import {
  calculateDashboardMetrics,
  getProductBySlug,
  getSellerById,
  listBoundaries,
  listLicenses,
  listProducts,
  listSellers
} from "../services/marketplaceService";

export function useProductFilters() {
  const [filters, setFilters] = useState<ProductFilters>({ category: "all", chain: "all", governanceStatus: "all" });
  const products = useMemo(() => listProducts(filters), [filters]);

  return { filters, setFilters, products };
}

export function useMarketplaceHome() {
  return useQuery({
    queryKey: ["marketplace-home"],
    queryFn: () => ({
      products: listProducts(),
      sellers: listSellers(),
      metrics: calculateDashboardMetrics(),
      boundaries: listBoundaries()
    })
  });
}

export function useMarketplaceDashboard() {
  return useQuery({
    queryKey: ["marketplace-dashboard"],
    queryFn: () => ({
      metrics: calculateDashboardMetrics(),
      products: listProducts(),
      sellers: listSellers(),
      boundaries: listBoundaries()
    })
  });
}

export function useProduct(slug?: string) {
  return useQuery({
    queryKey: ["marketplace-product", slug],
    enabled: Boolean(slug),
    queryFn: () => {
      const product = getProductBySlug(slug ?? "");
      if (!product) throw new Error("Product not found");
      return { product, seller: getSellerById(product.sellerId) };
    }
  });
}

export function useSeller(sellerId?: string) {
  return useQuery({
    queryKey: ["marketplace-seller", sellerId],
    enabled: Boolean(sellerId),
    queryFn: () => {
      const seller = getSellerById(sellerId ?? "");
      if (!seller) throw new Error("Seller not found");
      return {
        seller,
        products: listProducts().filter((product) => product.sellerId === seller.id)
      };
    }
  });
}

export function useLicenses() {
  return useQuery({
    queryKey: ["marketplace-licenses"],
    queryFn: () => ({ licenses: listLicenses(), products: listProducts() })
  });
}

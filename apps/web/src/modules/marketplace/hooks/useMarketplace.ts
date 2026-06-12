import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../services/apiClient";
import type { ProductFilters } from "../services/marketplaceService";
import {
  DEFAULT_PRODUCT_EXPLORER_FILTERS,
  buildMarketplaceAnalytics,
  buildSellerProfileView,
  calculateDashboardMetrics,
  discoverWalletAssets,
  getFederationProviderById,
  getProductByItemRef,
  getCollectionBySlug,
  getSellerById,
  listFederationProviders,
  listBoundaries,
  listCollections,
  listProducts
} from "../services/marketplaceService";
import { instrumentMarketplaceError, traceMarketplaceLifecycle } from "../services/runtimeTelemetry";

export function useProductFilters() {
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_PRODUCT_EXPLORER_FILTERS);
  const fallbackProducts = useMemo(() => listProducts(filters), [filters]);
  const productsQuery = useQuery({
    queryKey: ["marketplace-products", filters],
    queryFn: async () => {
      const [items, enforcement] = await Promise.all([apiClient.listProducts(filters), apiClient.getGovernanceEnforcementSnapshot()]);
      return { items, enforcement };
    }
  });
  const products = productsQuery.data?.items ?? fallbackProducts;

  return { filters, setFilters, products, governanceEnforcement: productsQuery.data?.enforcement, isLoading: productsQuery.isLoading, error: productsQuery.error };
}

export function useMarketplaceHome() {
  return useQuery({
    queryKey: ["marketplace-home"],
    queryFn: async () => {
      traceMarketplaceLifecycle("marketplace-home-query", "started");
      const [products, sellers] = await Promise.all([apiClient.listProducts(), apiClient.listSellers()]);
      return {
        products,
        sellers,
        metrics: calculateDashboardMetrics(),
        boundaries: listBoundaries()
      };
    }
  });
}

export function useMarketplaceDashboard() {
  return useQuery({
    queryKey: ["marketplace-dashboard"],
    queryFn: async () => {
      traceMarketplaceLifecycle("marketplace-dashboard-query", "started");
      const [runtime, governanceWorkflow] = await Promise.all([apiClient.getMarketplaceRuntime(), apiClient.getGovernanceWorkflow()]);
      return {
        metrics: calculateDashboardMetrics(),
        products: runtime.products,
        sellers: runtime.sellers,
        analytics: buildMarketplaceAnalytics(runtime.products, runtime.sellers),
        runtime,
        governanceWorkflow,
        boundaries: listBoundaries()
      };
    }
  });
}

export function useCollections() {
  return useQuery({
    queryKey: ["marketplace-collections"],
    queryFn: () => {
      traceMarketplaceLifecycle("marketplace-collections-query", "completed");
      return listCollections();
    }
  });
}

export function useCollection(slug?: string) {
  return useQuery({
    queryKey: ["marketplace-collection", slug],
    enabled: Boolean(slug),
    queryFn: () => {
      const collection = getCollectionBySlug(slug ?? "");
      if (!collection) {
        const error = new Error("Collection not found");
        instrumentMarketplaceError("marketplace-collection-query", error, { slug: slug ?? null });
        throw error;
      }
      traceMarketplaceLifecycle("marketplace-collection-query", "completed", { collectionId: collection.collection.id });
      return collection;
    }
  });
}

export function useWalletDiscovery(walletAddress?: string) {
  return useQuery({
    queryKey: ["marketplace-wallet-discovery", walletAddress],
    queryFn: () => {
      const discovery = discoverWalletAssets(walletAddress);
      traceMarketplaceLifecycle("marketplace-wallet-discovery-query", "completed", {
        walletAddress: discovery.walletAddress || null,
        status: discovery.status,
        discoveredAssets: discovery.summary.total
      });
      return discovery;
    }
  });
}

export function useFederationProviders() {
  return useQuery({
    queryKey: ["marketplace-federation-providers"],
    queryFn: () => {
      const providers = listFederationProviders();
      traceMarketplaceLifecycle("marketplace-federation-providers-query", "completed", { providerCount: providers.length });
      return providers;
    }
  });
}

export function useFederationProvider(providerId?: string) {
  return useQuery({
    queryKey: ["marketplace-federation-provider", providerId],
    enabled: Boolean(providerId),
    queryFn: () => {
      const provider = getFederationProviderById(providerId ?? "");
      if (!provider) {
        const error = new Error("Federation Provider not found");
        instrumentMarketplaceError("marketplace-federation-provider-query", error, { providerId: providerId ?? null });
        throw error;
      }
      traceMarketplaceLifecycle("marketplace-federation-provider-query", "completed", { providerId: provider.provider.id });
      return provider;
    }
  });
}

export function useProduct(slug?: string) {
  return useQuery({
    queryKey: ["marketplace-product", slug],
    enabled: Boolean(slug),
    queryFn: async () => {
      const product = await apiClient.getProduct(slug ?? "");
      if (!product) {
        const error = new Error("Product not found");
        instrumentMarketplaceError("marketplace-product-query", error, { slug: slug ?? null });
        throw error;
      }
      traceMarketplaceLifecycle("marketplace-product-query", "completed", { productId: product.id });
      const [authority, enforcement] = await Promise.all([
        apiClient.getGovernanceAuthority(product.id),
        apiClient.getGovernanceEnforcement(product.id)
      ]);
      return { product, seller: getSellerById(product.sellerId), authority, enforcement };
    }
  });
}

export function useProductByItemRef(chain?: string, contract?: string, tokenId?: string) {
  return useQuery({
    queryKey: ["marketplace-item-ref", chain, contract, tokenId],
    enabled: Boolean(chain && contract && tokenId),
    queryFn: () => {
      const product = getProductByItemRef(chain ?? "", contract ?? "", tokenId ?? "");
      if (!product) {
        const error = new Error("Item not found");
        instrumentMarketplaceError("marketplace-item-ref-query", error, { chain: chain ?? null, contract: contract ?? null, tokenId: tokenId ?? null });
        throw error;
      }
      return { product, seller: getSellerById(product.sellerId) };
    }
  });
}

export function useSeller(sellerId?: string) {
  return useQuery({
    queryKey: ["marketplace-seller", sellerId],
    enabled: Boolean(sellerId),
    queryFn: async () => {
      const sellers = await apiClient.listSellers();
      const seller = sellers.find((item) => item.id === sellerId);
      if (!seller) {
        const error = new Error("Seller not found");
        instrumentMarketplaceError("marketplace-seller-query", error, { sellerId: sellerId ?? null });
        throw error;
      }
      const [products, authority, enforcement, governanceEnforcement] = await Promise.all([
        apiClient.listProducts(),
        apiClient.getGovernanceAuthority(seller.id),
        apiClient.getGovernanceEnforcement(seller.id),
        apiClient.getGovernanceEnforcementSnapshot()
      ]);
      return {
        ...buildSellerProfileView(seller, products),
        authority,
        enforcement,
        governanceEnforcement
      };
    }
  });
}

export function useLicenses() {
  return useQuery({
    queryKey: ["marketplace-licenses"],
    queryFn: async () => {
      traceMarketplaceLifecycle("marketplace-license-query", "started");
      const [licenses, products, licenseRuntimes, subscriptions] = await Promise.all([
        apiClient.listLicenses(),
        apiClient.listProducts(),
        apiClient.listLicenseRuntimes(),
        apiClient.listSubscriptions()
      ]);
      return { licenses, products, licenseRuntimes, subscriptions };
    }
  });
}

export function useEntitlements(holder = "0xMockBuyer...A11C") {
  return useQuery({
    queryKey: ["marketplace-entitlements", holder],
    queryFn: async () => {
      traceMarketplaceLifecycle("marketplace-entitlement-query", "started", { holder });
      const [snapshot, products, licenseRuntimes, subscriptions] = await Promise.all([
        apiClient.getEntitlementSnapshot(holder),
        apiClient.listProducts(),
        apiClient.listLicenseRuntimes(),
        apiClient.listSubscriptions()
      ]);
      const [governanceAuthority, governanceEnforcement] = await Promise.all([
        apiClient.getGovernanceAuthoritySnapshot(),
        apiClient.getGovernanceEnforcementSnapshot()
      ]);
      return {
        snapshot,
        products,
        governanceAuthority,
        governanceEnforcement,
        licenseRuntimes: licenseRuntimes.filter((license) => license.holder === holder),
        subscriptions: subscriptions.filter((subscription) => subscription.holder === holder)
      };
    }
  });
}

export function useBillingRuntime() {
  return useQuery({
    queryKey: ["marketplace-billing-runtime"],
    queryFn: async () => {
      traceMarketplaceLifecycle("marketplace-billing-runtime-query", "started");
      const [invoices, telemetry, products] = await Promise.all([
        apiClient.listInvoices(),
        apiClient.listAccountingTelemetry(),
        apiClient.listProducts()
      ]);
      const [governanceAuthority, governanceEnforcement] = await Promise.all([
        apiClient.getGovernanceAuthoritySnapshot(),
        apiClient.getGovernanceEnforcementSnapshot()
      ]);
      return { invoices, telemetry, products, governanceAuthority, governanceEnforcement };
    }
  });
}

export function useOperationalTraceability() {
  return useQuery({
    queryKey: ["marketplace-operational-traceability"],
    queryFn: async () => {
      traceMarketplaceLifecycle("marketplace-traceability-query", "started");
      const [auditLogs, events, reconciliation, indexer, telemetry] = await Promise.all([
        apiClient.listAuditLogs(),
        apiClient.listRuntimeEvents(),
        apiClient.createReconciliationSnapshot(),
        apiClient.createIndexerSnapshot(),
        apiClient.listAccountingTelemetry()
      ]);
      return { auditLogs, events, reconciliation, indexer, telemetry };
    }
  });
}

export function useGovernanceOperatorConsole() {
  return useQuery({
    queryKey: ["marketplace-governance-operator-console"],
    queryFn: async () => {
      traceMarketplaceLifecycle("marketplace-governance-operator-console-query", "started");
      const [observability, workflow, federation] = await Promise.all([
        apiClient.getGovernanceObservability(),
        apiClient.getGovernanceWorkflow(),
        apiClient.getDAOFederationRuntime()
      ]);
      return { observability, workflow, federation };
    }
  });
}

export function useTenantStorefront(tenantIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-tenant-storefront", tenantIdOrSlug],
    enabled: Boolean(tenantIdOrSlug),
    queryFn: async () => {
      const storefront = await apiClient.getTenantStorefront(tenantIdOrSlug ?? "");
      if (!storefront) {
        const error = new Error("Tenant storefront not found");
        instrumentMarketplaceError("marketplace-tenant-storefront-query", error, { tenantIdOrSlug: tenantIdOrSlug ?? null });
        throw error;
      }
      const [products, sellers, tenantRegistry, productRegistry, daoFederation] = await Promise.all([
        apiClient.listProducts(),
        apiClient.listSellers(),
        apiClient.listTenantRegistry(),
        apiClient.listProductRegistry(),
        apiClient.getDAOFederationRuntime()
      ]);
      const [authority, enforcement, governanceEnforcement] = await Promise.all([
        apiClient.getGovernanceAuthority(storefront.ownerId),
        apiClient.getGovernanceEnforcement(storefront.ownerId),
        apiClient.getGovernanceEnforcementSnapshot()
      ]);
      return {
        storefront,
        products: products.filter((product) => storefront.productIds.includes(product.id)),
        sellers: sellers.filter((seller) => storefront.sellerIds.includes(seller.id)),
        tenant: tenantRegistry.find((tenant) => tenant.tenantId === storefront.ownerId || tenant.storefrontOwnership.slug === storefront.slug),
        authority,
        enforcement,
        governanceEnforcement,
        daoFederation,
        storefrontRuntime: daoFederation.storefronts.find((record) => record.tenantId === storefront.ownerId),
        tenantRuntime: daoFederation.tenantIsolation.find((record) => record.tenantId === storefront.ownerId),
        constitutionalInheritance: daoFederation.constitutionalInheritance.find((record) => record.tenantId === storefront.ownerId),
        productRegistry: productRegistry.filter((record) => storefront.productIds.includes(record.productId))
      };
    }
  });
}

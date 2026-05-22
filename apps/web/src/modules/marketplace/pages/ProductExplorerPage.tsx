import { ProductCard } from "../components/ProductCard";
import { ProductFiltersPanel } from "../components/ProductFilters";
import { useProductFilters } from "../hooks/useMarketplace";
import { useMarketplaceTelemetry } from "../hooks/useMarketplaceTelemetry";
import { getSellerById } from "../services/marketplaceService";

export function ProductExplorerPage() {
  const { filters, setFilters, products, governanceEnforcement } = useProductFilters();
  useMarketplaceTelemetry("product-explorer-page", { resultCount: products.length });
  const enforcementRecords = governanceEnforcement?.records ?? [];
  const restrictedCount = governanceEnforcement?.restrictedProductIds.length ?? 0;
  const hiddenCount = governanceEnforcement?.hiddenProductIds.length ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Product explorer</p>
        <h1 className="mt-2 text-3xl font-semibold">NFT listings, licenses and ecosystem assets</h1>
      </div>
      <section className="rounded border border-slate-200 bg-white p-4 text-sm shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">Governance visibility runtime</h2>
            <p className="mt-1 text-slate-600">Preview-only visibility enforcement. No destructive blocking, settlement or contract write is executed.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold">Restricted {restrictedCount}</span>
            <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold">Hidden preview {hiddenCount}</span>
          </div>
        </div>
      </section>
      <ProductFiltersPanel filters={filters} setFilters={setFilters} />
      {products.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-live="polite">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              seller={getSellerById(product.sellerId)}
              enforcement={enforcementRecords.find((record) => record.entityId === product.id)}
            />
          ))}
        </div>
      ) : (
        <section className="rounded border border-slate-200 bg-white p-6 shadow-sm" role="status">
          <h2 className="text-xl font-semibold">No Marketplace products match these filters</h2>
          <p className="mt-2 text-sm text-slate-600">Adjust category, chain, governance standing or search terms. No runtime execution was attempted.</p>
        </section>
      )}
    </div>
  );
}

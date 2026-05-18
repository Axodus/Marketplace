import { ProductCard } from "../components/ProductCard";
import { ProductFiltersPanel } from "../components/ProductFilters";
import { useProductFilters } from "../hooks/useMarketplace";
import { getSellerById } from "../services/marketplaceService";

export function ProductExplorerPage() {
  const { filters, setFilters, products } = useProductFilters();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Product explorer</p>
        <h1 className="mt-2 text-3xl font-semibold">NFT listings, licenses and ecosystem assets</h1>
      </div>
      <ProductFiltersPanel filters={filters} setFilters={setFilters} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} seller={getSellerById(product.sellerId)} />
        ))}
      </div>
    </div>
  );
}

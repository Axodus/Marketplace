import type { ProductFilters } from "../services/marketplaceService";

const categories = ["all", "Education", "Governance", "Trading", "Business", "MCPs", "Digital Assets"];
const chains = ["all", "Ethereum", "BNB", "Arbitrum", "Harmony", "Polygon"];
const standings = ["all", "compliant", "under-review", "restricted", "suspended", "deprecated"];

export function ProductFiltersPanel({
  filters,
  setFilters
}: {
  filters: ProductFilters;
  setFilters: React.Dispatch<React.SetStateAction<ProductFilters>>;
}) {
  return (
    <section className="rounded border border-slate-200 bg-white p-4 shadow-sm" aria-label="Marketplace product filters">
      <div className="grid gap-3 md:grid-cols-4">
        <label className="space-y-1 text-sm">
          <span className="font-medium text-slate-700">Search</span>
          <input
            value={filters.search ?? ""}
            onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
            className="w-full rounded border border-slate-300 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            placeholder="Product, tag, seller"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium text-slate-700">Category</span>
          <select
            value={filters.category ?? "all"}
            onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value as ProductFilters["category"] }))}
            className="w-full rounded border border-slate-300 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium text-slate-700">Chain</span>
          <select
            value={filters.chain ?? "all"}
            onChange={(event) => setFilters((current) => ({ ...current, chain: event.target.value as ProductFilters["chain"] }))}
            className="w-full rounded border border-slate-300 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            {chains.map((chain) => (
              <option key={chain}>{chain}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium text-slate-700">Governance</span>
          <select
            value={filters.governanceStatus ?? "all"}
            onChange={(event) =>
              setFilters((current) => ({ ...current, governanceStatus: event.target.value as ProductFilters["governanceStatus"] }))
            }
            className="w-full rounded border border-slate-300 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            {standings.map((standing) => (
              <option key={standing}>{standing}</option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}

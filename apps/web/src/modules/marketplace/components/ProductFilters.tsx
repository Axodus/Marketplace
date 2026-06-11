import {
  DEFAULT_PRODUCT_EXPLORER_FILTERS,
  getProductExplorerFacets,
  type ProductAssetTypeFilter,
  type ProductFilters,
  type ProductListingStatusFilter,
  type ProductSortOption
} from "../services/marketplaceService";

const standings = ["all", "compliant", "under-review", "restricted", "suspended", "deprecated"];
const assetTypes: Array<{ value: ProductAssetTypeFilter; label: string }> = [
  { value: "all", label: "All asset types" },
  { value: "nft", label: "NFT-bound" },
  { value: "erc721", label: "ERC721" },
  { value: "erc1155", label: "ERC1155" },
  { value: "offchain", label: "Offchain/license" }
];
const sortOptions: Array<{ value: ProductSortOption; label: string }> = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "recent", label: "Recently updated" },
  { value: "activity", label: "Activity" },
  { value: "name", label: "Name" }
];

export function ProductFiltersPanel({
  filters,
  setFilters
}: {
  filters: ProductFilters;
  setFilters: React.Dispatch<React.SetStateAction<ProductFilters>>;
}) {
  const facets = getProductExplorerFacets();
  const listingStatuses: Array<{ value: ProductListingStatusFilter; label: string }> = [
    { value: "all", label: "All listing states" },
    ...facets.listingStatuses.map((status) => ({ value: status as ProductListingStatusFilter, label: status })),
    { value: "auction-active", label: "Active auction" }
  ];
  const hasActiveFilters =
    Boolean(filters.search?.trim()) ||
    (filters.category ?? "all") !== "all" ||
    (filters.chain ?? "all") !== "all" ||
    (filters.governanceStatus ?? "all") !== "all" ||
    (filters.assetType ?? "all") !== "all" ||
    (filters.listingStatus ?? "all") !== "all" ||
    (filters.listingType ?? "all") !== "all" ||
    (filters.sellerId ?? "all") !== "all" ||
    (filters.sortBy ?? "relevance") !== "relevance";

  return (
    <section className="rounded border border-slate-200 bg-white p-4 shadow-sm" aria-label="Marketplace product filters">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-slate-950">Discovery controls</h2>
          <p className="mt-1 text-sm text-slate-600">
            Mock-first search, filters and sorting. No indexer, settlement or external provider is executed.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setFilters({ ...DEFAULT_PRODUCT_EXPLORER_FILTERS })}
          disabled={!hasActiveFilters}
          className="rounded border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear filters
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <label className="space-y-1 text-sm">
          <span className="font-medium text-slate-700">Search</span>
          <input
            value={filters.search ?? ""}
            onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
            className="w-full rounded border border-slate-300 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            placeholder="Name, seller, category, NFT"
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium text-slate-700">Category</span>
          <select
            value={filters.category ?? "all"}
            onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value as ProductFilters["category"] }))}
            className="w-full rounded border border-slate-300 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            <option value="all">All categories</option>
            {facets.categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium text-slate-700">Asset type</span>
          <select
            value={filters.assetType ?? "all"}
            onChange={(event) => setFilters((current) => ({ ...current, assetType: event.target.value as ProductFilters["assetType"] }))}
            className="w-full rounded border border-slate-300 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            {assetTypes.map((assetType) => (
              <option key={assetType.value} value={assetType.value}>
                {assetType.label}
              </option>
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
            <option value="all">All chains</option>
            {facets.chains.map((chain) => (
              <option key={chain} value={chain}>
                {chain}
              </option>
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
              <option key={standing} value={standing}>
                {standing === "all" ? "All governance states" : standing}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium text-slate-700">Listing status</span>
          <select
            value={filters.listingStatus ?? "all"}
            onChange={(event) =>
              setFilters((current) => ({ ...current, listingStatus: event.target.value as ProductFilters["listingStatus"] }))
            }
            className="w-full rounded border border-slate-300 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            {listingStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium text-slate-700">Listing type</span>
          <select
            value={filters.listingType ?? "all"}
            onChange={(event) => setFilters((current) => ({ ...current, listingType: event.target.value as ProductFilters["listingType"] }))}
            className="w-full rounded border border-slate-300 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            <option value="all">All listing types</option>
            {facets.listingTypes.map((listingType) => (
              <option key={listingType} value={listingType}>
                {listingType}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium text-slate-700">Seller</span>
          <select
            value={filters.sellerId ?? "all"}
            onChange={(event) => setFilters((current) => ({ ...current, sellerId: event.target.value }))}
            className="w-full rounded border border-slate-300 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            <option value="all">All sellers</option>
            {facets.sellers.map((seller) => (
              <option key={seller.id} value={seller.id}>
                {seller.name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium text-slate-700">Sort</span>
          <select
            value={filters.sortBy ?? "relevance"}
            onChange={(event) => setFilters((current) => ({ ...current, sortBy: event.target.value as ProductSortOption }))}
            className="w-full rounded border border-slate-300 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}

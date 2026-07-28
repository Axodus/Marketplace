import { ChevronDown, RotateCcw, SlidersHorizontal } from "lucide-react";
import {
  DEFAULT_PRODUCT_EXPLORER_FILTERS,
  getProductExplorerFacets,
  type ProductAssetTypeFilter,
  type ProductFilters,
  type ProductSortOption
} from "../services/marketplaceService";

const assetTypes: Array<{ value: ProductAssetTypeFilter; label: string }> = [
  { value: "all", label: "All product types" },
  { value: "nft", label: "NFT-bound" },
  { value: "erc721", label: "ERC721" },
  { value: "erc1155", label: "ERC1155" },
  { value: "offchain", label: "Off-chain / license" }
];

export const productSortOptions: Array<{ value: ProductSortOption; label: string }> = [
  { value: "relevance", label: "Relevance" },
  { value: "recent", label: "Recently added" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "ending-soon", label: "Ending soon" }
];

export function hasActiveProductFilters(filters: ProductFilters) {
  return (
    Boolean(filters.search?.trim()) ||
    (filters.category ?? "all") !== "all" ||
    (filters.chain ?? "all") !== "all" ||
    (filters.governanceStatus ?? "all") !== "all" ||
    (filters.assetType ?? "all") !== "all" ||
    (filters.listingStatus ?? "all") !== "all" ||
    (filters.listingType ?? "all") !== "all" ||
    (filters.sellerId ?? "all") !== "all" ||
    typeof filters.minPrice === "number" ||
    typeof filters.maxPrice === "number" ||
    Boolean(filters.verifiedSeller)
  );
}
export function ProductFiltersPanel({
  filters,
  setFilters,
  headingId = "marketplace-filter-heading"
}: {
  filters: ProductFilters;
  setFilters: React.Dispatch<React.SetStateAction<ProductFilters>>;
  headingId?: string;
}) {
  const facets = getProductExplorerFacets();
  const active = hasActiveProductFilters(filters);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-marketplace-border p-4">
        <h2 id={headingId} className="inline-flex items-center gap-2 text-base font-semibold text-marketplace-graphite">
          <SlidersHorizontal size={17} aria-hidden="true" /> Filters
        </h2>
        <button
          type="button"
          onClick={() => setFilters({ ...DEFAULT_PRODUCT_EXPLORER_FILTERS })}
          disabled={!active}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-marketplace-text-muted hover:bg-marketplace-muted hover:text-marketplace-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-marketplace-focus disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw size={13} aria-hidden="true" /> Clear all
        </button>
      </div>

      <div className="flex-1 divide-y divide-marketplace-border">
        <FilterGroup title="Category" defaultOpen>
          <FilterSelect
            label="Product category"
            value={filters.category ?? "all"}
            onChange={(value) => setFilters((current) => ({ ...current, category: value as ProductFilters["category"] }))}
            options={[{ value: "all", label: "All categories" }, ...facets.categories.map((category) => ({ value: category, label: category }))]}
          />
        </FilterGroup>

        <FilterGroup title="Price" defaultOpen>
          <div className="grid grid-cols-2 gap-2">
            <NumberFilter
              label="Minimum price"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(minPrice) => setFilters((current) => ({ ...current, minPrice }))}
            />
            <NumberFilter
              label="Maximum price"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(maxPrice) => setFilters((current) => ({ ...current, maxPrice }))}
            />
          </div>
          <p className="mt-2 text-[0.68rem] leading-4 text-marketplace-text-muted">Applied to the numeric amount in the current mock product price.</p>
        </FilterGroup>

        <FilterGroup title="Network">
          <FilterSelect
            label="Network"
            value={filters.chain ?? "all"}
            onChange={(value) => setFilters((current) => ({ ...current, chain: value as ProductFilters["chain"] }))}
            options={[{ value: "all", label: "All networks" }, ...facets.chains.map((chain) => ({ value: chain, label: chain }))]}
          />
        </FilterGroup>

        <FilterGroup title="Product type">
          <FilterSelect
            label="Product type"
            value={filters.assetType ?? "all"}
            onChange={(value) => setFilters((current) => ({ ...current, assetType: value as ProductFilters["assetType"] }))}
            options={assetTypes}
          />
        </FilterGroup>

        <FilterGroup title="Listing type">
          <FilterSelect
            label="Listing type"
            value={filters.listingType ?? "all"}
            onChange={(value) => setFilters((current) => ({ ...current, listingType: value as ProductFilters["listingType"] }))}
            options={[
              { value: "all", label: "All listing types" },
              ...facets.listingTypes.map((listingType) => ({ value: listingType, label: humanize(listingType) }))
            ]}
          />
        </FilterGroup>

        <FilterGroup title="Validation">
          <FilterSelect
            label="Governance or validation state"
            value={filters.governanceStatus ?? "all"}
            onChange={(value) => setFilters((current) => ({ ...current, governanceStatus: value as ProductFilters["governanceStatus"] }))}
            options={[
              { value: "all", label: "All validation states" },
              { value: "compliant", label: "Compliant" },
              { value: "under-review", label: "Review required" },
              { value: "restricted", label: "Restricted" },
              { value: "suspended", label: "Suspended" },
              { value: "deprecated", label: "Deprecated" }
            ]}
          />
          <label className="mt-3 flex cursor-pointer items-start gap-2 text-sm text-marketplace-text">
            <input
              type="checkbox"
              checked={Boolean(filters.verifiedSeller)}
              onChange={(event) => setFilters((current) => ({ ...current, verifiedSeller: event.target.checked }))}
              className="mt-0.5 h-4 w-4 accent-marketplace-trusted"
            />
            <span>
              <span className="block font-medium">Verified sellers</span>
              <span className="mt-0.5 block text-xs leading-4 text-marketplace-text-muted">Verified or internal Axodus publishers.</span>
            </span>
          </label>
        </FilterGroup>
      </div>
    </div>
  );
}

export function MarketplaceSort({ filters, setFilters }: { filters: ProductFilters; setFilters: React.Dispatch<React.SetStateAction<ProductFilters>> }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="sr-only">Sort marketplace products</span>
      <select
        value={filters.sortBy ?? "relevance"}
        onChange={(event) => setFilters((current) => ({ ...current, sortBy: event.target.value as ProductSortOption }))}
        className="marketplace-control min-w-44 text-sm font-medium"
        aria-label="Sort marketplace products"
      >
        {productSortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function FilterGroup({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  return (
    <details className="group p-4" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-marketplace-graphite focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-marketplace-focus">
        {title}
        <ChevronDown size={16} className="transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: Array<{ value: string; label: string }>; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="marketplace-control w-full text-sm" aria-label={label}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}

function NumberFilter({ label, value, placeholder, onChange }: { label: string; value?: number; placeholder: string; onChange: (value?: number) => void }) {
  return (
    <label>
      <span className="sr-only">{label}</span>
      <input
        type="number"
        min="0"
        inputMode="decimal"
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value === "" ? undefined : Number(event.target.value))}
        placeholder={placeholder}
        className="marketplace-control w-full min-w-0 text-sm"
        aria-label={label}
      />
    </label>
  );
}

function humanize(value: string) {
  return value.replaceAll("-", " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

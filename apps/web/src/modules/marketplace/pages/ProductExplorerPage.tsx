import { useEffect, useRef, useState } from "react";
import { ChevronRight, Search, SlidersHorizontal, X } from "lucide-react";
import { Link } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { MarketplaceSort, ProductFiltersPanel, hasActiveProductFilters } from "../components/ProductFilters";
import { useProductFilters } from "../hooks/useMarketplace";
import { useMarketplaceTelemetry } from "../hooks/useMarketplaceTelemetry";
import { DEFAULT_PRODUCT_EXPLORER_FILTERS, getProductExplorerFacets, getSellerById } from "../services/marketplaceService";

export function ProductExplorerPage() {
  const { filters, setFilters, products, governanceEnforcement, isLoading, error } = useProductFilters();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const facets = getProductExplorerFacets();
  const enforcementRecords = governanceEnforcement?.records ?? [];
  const restrictedCount = governanceEnforcement?.restrictedProductIds.length ?? 0;
  const hiddenCount = governanceEnforcement?.hiddenProductIds.length ?? 0;
  const activeFilters = hasActiveProductFilters(filters);
  useMarketplaceTelemetry("product-explorer-page", { resultCount: products.length });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (mobileFiltersOpen && !dialog.open) dialog.showModal();
    if (!mobileFiltersOpen && dialog.open) dialog.close();
  }, [mobileFiltersOpen]);

  return (
    <div>
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-marketplace-text-muted">
        <Link to="/marketplace" className="rounded hover:text-marketplace-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-marketplace-focus">Home</Link>
        <ChevronRight size={13} aria-hidden="true" />
        <span aria-current="page">Explore</span>
      </nav>

      <header className="mt-6">
        <h1 className="text-3xl font-semibold tracking-tight text-marketplace-graphite sm:text-4xl">Explore marketplace</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-marketplace-text-muted sm:text-base">
          Discover digital assets, knowledge, software and ecosystem access.
        </p>
      </header>

      <section className="mt-7" aria-labelledby="explore-controls-heading">
        <h2 id="explore-controls-heading" className="sr-only">Search and filter marketplace products</h2>
        <label className="relative block max-w-2xl">
          <span className="sr-only">Search current marketplace results</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-marketplace-text-muted" size={18} />
          <input
            type="search"
            value={filters.search ?? ""}
            onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
            placeholder="Search products, sellers, collections and standards"
            className="marketplace-control w-full py-2.5 pl-10 text-sm"
          />
        </label>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-y border-marketplace-border py-3">
          <div className="flex min-w-0 items-center gap-2 overflow-x-auto" aria-label="Product categories">
            <CategoryButton
              label="All categories"
              active={(filters.category ?? "all") === "all"}
              onClick={() => setFilters((current) => ({ ...current, category: "all" }))}
            />
            {facets.categories.map((category) => (
              <CategoryButton
                key={category}
                label={category}
                active={filters.category === category}
                onClick={() => setFilters((current) => ({ ...current, category }))}
              />
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="marketplace-control inline-flex items-center gap-2 text-sm font-semibold xl:hidden"
              aria-expanded={mobileFiltersOpen}
              aria-controls="mobile-marketplace-filters"
            >
              <SlidersHorizontal size={16} aria-hidden="true" /> Filters
            </button>
            <MarketplaceSort filters={filters} setFilters={setFilters} />
          </div>
        </div>
      </section>

      <div className="mt-5 grid items-start gap-6 xl:grid-cols-[15.5rem_minmax(0,1fr)]">
        <aside className="marketplace-panel sticky top-32 hidden max-h-[calc(100vh-9rem)] overflow-y-auto xl:block" aria-labelledby="desktop-marketplace-filter-heading">
          <ProductFiltersPanel filters={filters} setFilters={setFilters} headingId="desktop-marketplace-filter-heading" />
        </aside>

        <section aria-labelledby="product-results-heading" aria-busy={isLoading}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="product-results-heading" className="text-sm font-semibold text-marketplace-graphite">
              {products.length} {products.length === 1 ? "product" : "products"}
            </h2>
            {activeFilters ? (
              <button
                type="button"
                onClick={() => setFilters({ ...DEFAULT_PRODUCT_EXPLORER_FILTERS })}
                className="text-xs font-semibold text-marketplace-text-muted underline-offset-4 hover:text-marketplace-text hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-marketplace-focus"
              >
                Clear active filters
              </button>
            ) : null}
          </div>

          {isLoading ? <ExplorerNotice title="Loading marketplace products" detail="Hydrating the existing Marketplace read model." /> : null}
          {error ? <ExplorerNotice title="Using local Marketplace data" detail="The API read model was unavailable; deterministic mock fallback remains active." tone="warning" /> : null}

          {products.length ? (
            <div className="mt-4 grid grid-cols-1 gap-4 min-[520px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-live="polite">
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
            <div className="marketplace-panel mt-4 p-8 text-center" role="status">
              <h3 className="text-lg font-semibold text-marketplace-graphite">No products match these filters</h3>
              <p className="mt-2 text-sm text-marketplace-text-muted">Adjust the current filters or clear them to restore the complete mock catalog.</p>
              <button type="button" onClick={() => setFilters({ ...DEFAULT_PRODUCT_EXPLORER_FILTERS })} className="marketplace-control mt-5 text-sm font-semibold">
                Clear all filters
              </button>
            </div>
          )}

          <details className="marketplace-panel mt-6 p-4 text-sm">
            <summary className="cursor-pointer font-semibold text-marketplace-graphite focus-visible:outline focus-visible:outline-2 focus-visible:outline-marketplace-focus">
              Development transparency
            </summary>
            <p className="mt-3 leading-6 text-marketplace-text-muted">
              Visibility and commerce controls remain preview-only. Restricted {restrictedCount}; hidden preview {hiddenCount}. No settlement,
              wallet signature, contract write, external indexer or provider action is executed by this page.
            </p>
          </details>
        </section>
      </div>

      <dialog
        ref={dialogRef}
        id="mobile-marketplace-filters"
        onClose={() => setMobileFiltersOpen(false)}
        onCancel={() => setMobileFiltersOpen(false)}
        className="m-0 ml-auto h-full max-h-full w-[min(23rem,92vw)] border-0 bg-marketplace-surface p-0 text-marketplace-text shadow-2xl backdrop:bg-black/40"
        aria-labelledby="mobile-marketplace-filter-heading"
      >
        <div className="flex justify-end border-b border-marketplace-border p-2">
          <button type="button" onClick={() => setMobileFiltersOpen(false)} className="marketplace-control inline-flex h-10 w-10 items-center justify-center p-0" aria-label="Close product filters">
            <X size={19} />
          </button>
        </div>
        <ProductFiltersPanel filters={filters} setFilters={setFilters} headingId="mobile-marketplace-filter-heading" />
      </dialog>
    </div>
  );
}
function CategoryButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap rounded-lg border px-3 py-2 text-xs font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-marketplace-focus ${
        active
          ? "border-marketplace-graphite bg-marketplace-graphite text-marketplace-surface"
          : "border-marketplace-border bg-marketplace-surface text-marketplace-text-muted hover:border-marketplace-border-strong hover:text-marketplace-text"
      }`}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

function ExplorerNotice({ title, detail, tone = "neutral" }: { title: string; detail: string; tone?: "neutral" | "warning" }) {
  return (
    <div className={`mt-4 rounded-lg border p-4 text-sm ${tone === "warning" ? "border-marketplace-accent/50 bg-marketplace-accent/10" : "border-marketplace-border bg-marketplace-muted"}`} role="status">
      <p className="font-semibold text-marketplace-graphite">{title}</p>
      <p className="mt-1 text-marketplace-text-muted">{detail}</p>
    </div>
  );
}

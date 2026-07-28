import { useState } from "react";
import { ArrowRight, Search, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { marketplaceCategoryNavigation } from "../../../config/marketplaceNavigation";
import { ProductCard } from "../components/ProductCard";
import { MetricCard } from "../components/MetricCard";
import { useCuratedCatalogs, useMarketplaceHome } from "../hooks/useMarketplace";
import { getSellerById } from "../services/marketplaceService";

export function MarketplaceHomePage() {
  const { data } = useMarketplaceHome();
  const { data: curatedCatalogs = [] } = useCuratedCatalogs();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  if (!data) return null;

  const trustedSellers = data.sellers.filter((seller) => seller.verificationStatus === "verified" || seller.verificationStatus === "internal");

  return (
    <div className="space-y-10">
      <section className="border-b border-marketplace-border pb-8 pt-3">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-marketplace-trusted">Axodus Marketplace</p>
        <div className="mt-3 grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.65fr)]">
          <div>
            <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-marketplace-graphite sm:text-5xl">
              Digital products and ecosystem access, clearly presented.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-marketplace-text-muted">
              Explore NFT-bound assets, knowledge, software, licenses and governed access through the existing mock-first Marketplace.
            </p>
          </div>
          <form
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              const query = search.trim();
              void navigate(query ? `/marketplace/explore?q=${encodeURIComponent(query)}` : "/marketplace/explore");
            }}
          >
            <label className="relative block">
              <span className="sr-only">Search Axodus Marketplace</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-marketplace-text-muted" size={19} />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search marketplace"
                className="marketplace-control w-full py-3 pl-11 text-sm"
              />
            </label>
          </form>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/marketplace/explore" className="rounded-lg bg-marketplace-graphite px-4 py-2.5 text-sm font-semibold text-marketplace-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marketplace-focus">
            Explore products
          </Link>
          <Link to="/marketplace/sell" className="marketplace-control text-sm font-semibold">Sell preview</Link>
        </div>
      </section>

      <section aria-labelledby="featured-products-heading">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-marketplace-text-muted">Marketplace selection</p>
            <h2 id="featured-products-heading" className="mt-1 text-2xl font-semibold text-marketplace-graphite">Featured products</h2>
          </div>
          <Link to="/marketplace/explore" className="inline-flex items-center gap-1 text-sm font-semibold text-marketplace-trusted hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-marketplace-focus">
            View all <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-4 min-[520px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} seller={getSellerById(product.sellerId)} />
          ))}
        </div>
      </section>

      <section aria-labelledby="curated-heading">
        <div className="flex items-end justify-between gap-4">
          <h2 id="curated-heading" className="text-2xl font-semibold text-marketplace-graphite">Curated collections</h2>
          <Link to="/marketplace/curated" className="text-sm font-semibold text-marketplace-trusted hover:underline">Browse curated</Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {curatedCatalogs.slice(0, 3).map((catalog) => (
            <Link
              key={catalog.id}
              to={`/marketplace/curated/${catalog.slug}`}
              className="marketplace-panel p-5 transition-colors hover:border-marketplace-border-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-marketplace-focus"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-marketplace-text-muted">{catalog.catalogType}</p>
              <h3 className="mt-2 text-lg font-semibold text-marketplace-graphite">{catalog.name}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-marketplace-text-muted">{catalog.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="verticals-heading">
        <h2 id="verticals-heading" className="text-2xl font-semibold text-marketplace-graphite">Explore by vertical</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {marketplaceCategoryNavigation.slice(0, 6).map((item) => (
            <Link key={item.to} to={item.to} className="marketplace-control text-sm font-medium">{item.label}</Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="trusted-sellers-heading">
        <h2 id="trusted-sellers-heading" className="text-2xl font-semibold text-marketplace-graphite">Trusted sellers</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {trustedSellers.map((seller) => (
            <Link key={seller.id} to={`/marketplace/sellers/${seller.id}`} className="marketplace-panel flex items-center gap-3 p-4 hover:border-marketplace-border-strong">
              {seller.avatar ? <img src={seller.avatar} alt="" className="h-11 w-11 rounded-full object-cover" /> : null}
              <div className="min-w-0">
                <h3 className="truncate font-semibold text-marketplace-graphite">{seller.name}</h3>
                <p className="mt-0.5 text-xs text-marketplace-text-muted">Verified marketplace publisher</p>
              </div>
              <ShieldCheck className="ml-auto shrink-0 text-marketplace-trusted" size={18} aria-label="Verified seller" />
            </Link>
          ))}
        </div>
      </section>

      <section className="marketplace-panel p-5" aria-labelledby="development-transparency-heading">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 shrink-0 text-marketplace-trusted" size={21} aria-hidden="true" />
          <div>
            <h2 id="development-transparency-heading" className="text-lg font-semibold text-marketplace-graphite">Development transparency</h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-marketplace-text-muted">
              Marketplace commerce remains mock-first and preview-only. No real settlement, production addresses, wallet signatures,
              contract writes or treasury routing are activated.
            </p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Active listings" value={data.metrics.activeListings} detail="Fixed, auction and license previews" />
          <MetricCard label="NFT-bound assets" value={data.metrics.nftBoundProducts} detail="ERC721 and ERC1155 models" />
          <MetricCard label="Governance review" value={data.metrics.pendingGovernance} detail="Existing validation states" />
          <MetricCard label="Royalty preview" value={`${data.metrics.royaltyPreview} USDC`} detail="Mock royalty calculation" />
        </div>
      </section>
    </div>
  );
}

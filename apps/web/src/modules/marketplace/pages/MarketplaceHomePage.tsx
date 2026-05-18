import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { MetricCard } from "../components/MetricCard";
import { useMarketplaceHome } from "../hooks/useMarketplace";
import { getSellerById } from "../services/marketplaceService";

export function MarketplaceHomePage() {
  const { data } = useMarketplaceHome();
  if (!data) return null;

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Governance-aware NFT marketplace</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-normal text-slate-950">
            Axodus marketplace for ERC721/1155 assets, licenses, auctions and ecosystem access.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            Mock-first MVP for fixed listings, buy-now, bids, EIP-2981 royalties, Greenfield delivery previews and governance validation
            states. Products and licenses extend the NFT marketplace without replacing it.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/marketplace/explore" className="rounded bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
              Explore listings
            </Link>
            <Link to="/marketplace/create" className="rounded border border-slate-300 px-4 py-2 text-sm font-semibold">
              Create / sell preview
            </Link>
            <Link to="/marketplace/dashboard" className="rounded border border-slate-300 px-4 py-2 text-sm font-semibold">
              View dashboard
            </Link>
          </div>
        </div>
        <div className="rounded border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
          <ShieldCheck size={28} />
          <h2 className="mt-4 text-2xl font-semibold">Phase 1 boundary</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            No real settlement, no production addresses, no treasury routing. Contract, storage, wallet and bridge services are explicit
            mock boundaries prepared for Phase 2.
          </p>
          <div className="mt-4 space-y-2 text-sm">
            {data.boundaries.map((boundary) => (
              <div key={boundary.id} className="rounded border border-white/10 bg-white/5 p-3">
                <p className="font-semibold">{boundary.label}</p>
                <p className="text-slate-300">{boundary.status}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Active listings" value={data.metrics.activeListings} detail="Fixed, auction and license previews" />
        <MetricCard label="NFT-bound assets" value={data.metrics.nftBoundProducts} detail="ERC721/1155 access models" />
        <MetricCard label="Governance review" value={data.metrics.pendingGovernance} detail="Pending validation queue" />
        <MetricCard label="Royalty preview" value={`${data.metrics.royaltyPreview} USDC`} detail="Mock EIP-2981/custom splits" />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Featured listings</h2>
          <Link to="/marketplace/explore" className="flex items-center gap-2 text-sm font-semibold text-teal-700">
            All listings <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {data.products.map((product) => (
            <ProductCard key={product.id} product={product} seller={getSellerById(product.sellerId)} />
          ))}
        </div>
      </section>
    </div>
  );
}

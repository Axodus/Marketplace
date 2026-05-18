import { MetricCard } from "../components/MetricCard";
import { useMarketplaceDashboard } from "../hooks/useMarketplace";

export function MarketplaceDashboardPage() {
  const { data } = useMarketplaceDashboard();
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Marketplace dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold">Operational telemetry preview</h1>
      </div>
      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Listings" value={data.metrics.activeListings} detail="Mock fixed and auction listings" />
        <MetricCard label="Verified sellers" value={data.metrics.verifiedSellers} detail="Governance standing verified" />
        <MetricCard label="NFT-bound" value={data.metrics.nftBoundProducts} detail="ERC721/1155 products" />
        <MetricCard label="Royalty preview" value={`${data.metrics.royaltyPreview} USDC`} detail="No settlement executed" />
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Category metrics</h2>
          <div className="mt-4 space-y-3">
            {Object.entries(data.metrics.categories).map(([category, count]) => (
              <div key={category}>
                <div className="flex justify-between text-sm">
                  <span>{category}</span>
                  <span>{count}</span>
                </div>
                <div className="mt-1 h-2 rounded bg-slate-100">
                  <div className="h-2 rounded bg-teal-700" style={{ width: `${Math.max(Number(count) * 20, 12)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Integration boundaries</h2>
          <div className="mt-4 space-y-3">
            {data.boundaries.map((boundary) => (
              <div key={boundary.id} className="rounded border border-slate-200 bg-slate-50 p-3">
                <p className="font-semibold">{boundary.label}</p>
                <p className="text-sm text-slate-600">{boundary.description}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-teal-700">{boundary.status}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold">Pending validations</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="py-2">Product</th>
                <th>Listing</th>
                <th>Governance</th>
                <th>Chain readiness</th>
                <th>Delivery</th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product) => (
                <tr key={product.id} className="border-b border-slate-100">
                  <td className="py-3 font-medium">{product.title}</td>
                  <td>{product.listingType}</td>
                  <td>{product.governanceStatus}</td>
                  <td>{product.bridgeReadiness.layerZeroReady ? "LayerZero ready" : "deferred"}</td>
                  <td>{product.deliveryType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

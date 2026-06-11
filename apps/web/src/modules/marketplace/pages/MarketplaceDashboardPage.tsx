import { Link } from "react-router-dom";
import { Activity, BarChart3, BadgeDollarSign, Gavel, Layers3, Store, TrendingUp } from "lucide-react";
import { MetricCard } from "../components/MetricCard";
import { useMarketplaceDashboard } from "../hooks/useMarketplace";
import { useMarketplaceTelemetry } from "../hooks/useMarketplaceTelemetry";
import { buildDeliveryTelemetry } from "../services/deliveryRuntime";
import { getMarketplaceRuntimeMetrics } from "../services/runtimeTelemetry";

export function MarketplaceDashboardPage() {
  const { data } = useMarketplaceDashboard();
  useMarketplaceTelemetry("marketplace-dashboard-page");

  if (!data) {
    return (
      <section className="rounded border border-slate-200 bg-white p-6 shadow-sm" role="status" aria-live="polite">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Marketplace dashboard</p>
        <h1 className="mt-2 text-2xl font-semibold">Loading telemetry preview</h1>
      </section>
    );
  }
  const deliveryEvents = buildDeliveryTelemetry(data.products);
  const runtimeMetrics = getMarketplaceRuntimeMetrics();
  const { analytics } = data;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Marketplace dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold">NFT marketplace analytics mock-first</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Volume, activity and market metrics are derived from local mock data for Phase 01. This is not Marketplace Intelligence Phase 07,
          BI, tracking, billing analytics or settlement visibility.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total volume mock" value={`${analytics.volume.totalVolume} USDC`} detail={`${analytics.volume.salesCount} mock sales/bids`} />
        <MetricCard label="Average price mock" value={`${analytics.volume.averagePrice} USDC`} detail="Listed products only" />
        <MetricCard label="Floor price mock" value={`${analytics.volume.floorPrice} USDC`} detail="Lowest active listing" />
        <MetricCard label="Royalty preview" value={`${analytics.volume.royaltyPreview} USDC`} detail="EIP-2981/custom preview only" />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Active listings" value={analytics.activity.activeListings} detail="Mock listed products" />
        <MetricCard label="Active auctions" value={analytics.activity.activeAuctions} detail="English and dutch previews" />
        <MetricCard label="Total bids" value={analytics.activity.totalBids} detail="Mock bid counters" />
        <MetricCard label="Market status" value={analytics.market.marketStatus} detail="Governance-aware summary" />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="NFT-bound" value={analytics.market.nftBoundProducts} detail="ERC721/1155 listings" />
        <MetricCard label="ERC721" value={analytics.market.erc721Products} detail="Mock asset standard" />
        <MetricCard label="ERC1155" value={analytics.market.erc1155Products} detail="Mock asset standard" />
        <MetricCard label="Runtime traces" value={runtimeMetrics.traceCount} detail="In-memory observability preview" />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <AnalyticsPanel icon={<BadgeDollarSign />} title="Volume Metrics">
          <MetricRow label="Total mock volume" value={`${analytics.volume.totalVolume} USDC`} />
          <MetricRow label="Mock sales count" value={analytics.volume.salesCount} />
          <MetricRow label="Average mock price" value={`${analytics.volume.averagePrice} USDC`} />
          <MetricRow label="Royalty preview" value={`${analytics.volume.royaltyPreview} USDC`} />
        </AnalyticsPanel>
        <AnalyticsPanel icon={<Activity />} title="Activity Metrics">
          <MetricRow label="Active listings" value={analytics.activity.activeListings} />
          <MetricRow label="Active auctions" value={analytics.activity.activeAuctions} />
          <MetricRow label="Total bids" value={analytics.activity.totalBids} />
          <MetricRow label="Auction bid activity" value={analytics.activity.bidActivity} />
        </AnalyticsPanel>
        <AnalyticsPanel icon={<TrendingUp />} title="Market Metrics">
          <MetricRow label="Total products" value={analytics.market.totalProducts} />
          <MetricRow label="NFT-bound products" value={analytics.market.nftBoundProducts} />
          <MetricRow label="Floor price mock" value={`${analytics.volume.floorPrice} USDC`} />
          <MetricRow label="Status" value={analytics.market.marketStatus} />
        </AnalyticsPanel>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Category metrics</h2>
          <div className="mt-4 space-y-3">
            {Object.entries(analytics.market.categories).map(([category, count]) => (
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
          <h2 className="text-xl font-semibold">Mock analytics boundaries</h2>
          <div className="mt-4 space-y-3">
            {analytics.notes.map((note) => (
              <div key={note} className="rounded border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm leading-6 text-slate-600">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-950">
            <Layers3 size={20} />
            <h2 className="text-xl font-semibold">Top collections</h2>
          </div>
          {analytics.collections.length ? (
            <div className="mt-4 space-y-3">
              {analytics.collections.slice(0, 5).map((collection) => (
                <Link key={collection.id} to={`/marketplace/collections/${collection.slug}`} className="block rounded border border-slate-200 bg-slate-50 p-3 hover:border-teal-700">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-950">{collection.name}</p>
                    <span className="text-sm font-semibold text-teal-700">Rank #{collection.ranking}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    {collection.volume} USDC volume | {collection.floorPrice} USDC floor | {collection.bids} bids
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState>No collection metrics are available in mock data.</EmptyState>
          )}
        </div>

        <div className="rounded border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-950">
            <Store size={20} />
            <h2 className="text-xl font-semibold">Top sellers</h2>
          </div>
          {analytics.sellers.length ? (
            <div className="mt-4 space-y-3">
              {analytics.sellers.slice(0, 5).map((seller) => (
                <Link key={seller.id} to={`/marketplace/sellers/${seller.id}`} className="block rounded border border-slate-200 bg-slate-50 p-3 hover:border-teal-700">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-950">{seller.name}</p>
                    <span className="text-sm font-semibold text-teal-700">{seller.mockVolume} USDC</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    {seller.listings} listings | {seller.mockSales} mock sales/bids | {seller.reputation}/100 reputation
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState>No seller metrics are available in mock data.</EmptyState>
          )}
        </div>
      </section>

      <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-slate-950">
          <BarChart3 size={20} />
          <h2 className="text-xl font-semibold">Recent market activity</h2>
        </div>
        {analytics.activity.recentActivity.length ? (
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {analytics.activity.recentActivity.map((event) => (
              <div key={event.id} className="rounded border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-950">{event.label}</p>
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{event.timestamp}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{event.detail}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState>No recent market activity exists in mock data.</EmptyState>
        )}
      </section>

      <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold">Pending validations</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm" aria-label="Pending marketplace validations">
            <caption className="sr-only">Pending validation states for Marketplace products</caption>
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
      <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold">Delivery telemetry</h2>
        <p className="mt-2 text-sm text-slate-600">
          Preview-only delivery events for entitlement checks, access attempts, revocations and signed URL issuance. No production Greenfield delivery is executed.
        </p>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {deliveryEvents.slice(0, 8).map((event) => (
            <div key={event.id} className="rounded border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">{event.type}</p>
                <span className="rounded bg-white px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                  {event.severity}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{event.message}</p>
              <p className="mt-1 font-mono text-xs text-slate-500">{event.productId}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-slate-950">
          <Gavel size={20} />
          <h2 className="text-xl font-semibold">Integration boundaries</h2>
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {data.boundaries.map((boundary) => (
            <div key={boundary.id} className="rounded border border-slate-200 bg-slate-50 p-3">
              <p className="font-semibold">{boundary.label}</p>
              <p className="text-sm text-slate-600">{boundary.description}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-teal-700">{boundary.status}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function AnalyticsPanel({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-slate-950">
        {icon}
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded border border-slate-200 bg-slate-50 p-3 text-sm">
      <span className="text-slate-600">{label}</span>
      <span className="font-semibold text-slate-950">{value}</span>
    </div>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 rounded border border-dashed border-slate-300 bg-slate-50 p-3 text-sm text-slate-500">{children}</p>;
}

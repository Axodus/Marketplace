import { Link, useParams } from "react-router-dom";
import { FileText, Layers, Trophy, Users } from "lucide-react";
import { CollectionCard } from "../components/CollectionCard";
import { ProductCard } from "../components/ProductCard";
import { NeutralBadge, ProductStandingBadge } from "../components/StatusBadge";
import { useCollection, useCollections } from "../hooks/useMarketplace";
import { useMarketplaceTelemetry } from "../hooks/useMarketplaceTelemetry";
import { getSellerById } from "../services/marketplaceService";

export function CollectionDetailPage() {
  const { slug } = useParams();
  const { data, error, isLoading } = useCollection(slug);
  const { data: ranking } = useCollections();
  useMarketplaceTelemetry("collection-detail-page", { slug: slug ?? null, itemCount: data?.products.length ?? 0 });

  if (isLoading) {
    return (
      <section className="rounded border border-slate-200 bg-white p-6 shadow-sm" role="status" aria-live="polite">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Collection detail</p>
        <h1 className="mt-2 text-2xl font-semibold">Loading collection preview</h1>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="rounded border border-amber-200 bg-amber-50 p-6 text-amber-900 shadow-sm" role="status">
        <h1 className="text-xl font-semibold">Collection not found in mock registry</h1>
        <p className="mt-2 text-sm">
          The collection route is active, but it only resolves local mock collection records. No external provider, indexer or on-chain lookup
          was attempted.
        </p>
        <Link to="/marketplace/collections" className="mt-4 inline-flex text-sm font-semibold text-teal-800">
          Back to collections
        </Link>
      </section>
    );
  }

  const { collection, products, metrics } = data;
  const isExternal = collection.isExternal || collection.isFederated || collection.origin !== "native";
  const relatedRanking = ranking?.filter((view) => view.collection.id !== collection.id).slice(0, 2) ?? [];

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[0.85fr_1fr]">
        <img src={collection.image} alt="" className="h-full min-h-96 rounded border border-slate-200 object-cover shadow-sm" />
        <div className="rounded border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap gap-2">
            <ProductStandingBadge status={collection.governanceStatus} />
            <NeutralBadge>{collection.assetType}</NeutralBadge>
            <NeutralBadge>{collection.origin}</NeutralBadge>
            <NeutralBadge>{collection.chain}</NeutralBadge>
            {isExternal && <NeutralBadge>Federated Collection</NeutralBadge>}
            {isExternal && <NeutralBadge>{collection.federationValidationStatus ?? "provider-reported"}</NeutralBadge>}
            {isExternal && <NeutralBadge>{collection.riskClassification ?? "unknown-external"}</NeutralBadge>}
          </div>
          <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Rank #{metrics.ranking}</p>
          <h1 className="mt-2 text-4xl font-semibold">{collection.name}</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">{collection.description}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Metric label={isExternal ? "Volume provider-reported" : "Volume mock"} value={`${metrics.volume} USDC`} />
            <Metric label={isExternal ? "Floor provider-reported" : "Floor mock"} value={`${metrics.floorPrice} USDC`} />
            <Metric label="Items" value={metrics.itemCount} />
            <Metric label={isExternal ? "Holders provider-reported" : "Holders mock"} value={metrics.holders} />
            <Metric label="Listings" value={metrics.listings} />
            <Metric label="Bids" value={metrics.bids} />
          </div>
          <div className="mt-5 rounded border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-semibold">Collection boundary</p>
            <p className="mt-2 break-all">Contract: {collection.contractAddress}</p>
            <p>Origin: {data.boundaries.origin}</p>
            <p>Provider: {data.boundaries.provider}</p>
            <p>Validation status: {data.boundaries.validationStatus}</p>
            <p>Risk classification: {data.boundaries.riskClassification}</p>
            <p>Provenance: {data.boundaries.provenance}</p>
            <p>Execution: {data.boundaries.executionState}; trade {data.boundaries.canTrade ? "enabled" : "disabled"}, settlement {data.boundaries.canSettle ? "enabled" : "disabled"}, bridge {data.boundaries.canBridge ? "enabled" : "disabled"}.</p>
            {metrics.lastSyncedAt && <p>Last synced/imported reference: {metrics.lastSyncedAt}</p>}
            <p className="mt-2 font-medium">
              {isExternal
                ? "External Collection display is read-only and non-executing; no provider API, metadata fetch, indexer, floor-price service, wallet signature, contract write or settlement is active."
                : "Native collection display is mock-first; no settlement, contract write, wallet signature, bridge execution or on-chain read is active."}
            </p>
          </div>
          {isExternal && (
            <div className="mt-5 rounded border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              <p className="font-semibold">External Metadata and Statistics</p>
              <p>Metadata source: {collection.externalMetadata?.source ?? "provider-reported-mock"}</p>
              <p className="break-all">Metadata URL: {collection.externalMetadata?.metadataUrl ?? "not provided"}</p>
              <p>Statistics source: {collection.externalStatistics?.source ?? "provider-reported-mock"}</p>
              <p>Provider-reported metrics are not official market metrics, verified floor price, verified holder count or Axodus custody proof.</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {data.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <Summary icon={<Trophy />} label="Ranking score" value={metrics.rankScore} />
        <Summary icon={<Users />} label="Recent activity" value={metrics.recentActivity} />
        <Summary icon={<Layers />} label="Asset type" value={collection.assetType} />
        <Summary icon={<FileText />} label="Governance" value={collection.governanceStatus} />
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Collection assets</p>
            <h2 className="mt-1 text-2xl font-semibold">Items in this collection</h2>
          </div>
          <Link to="/marketplace/explore" className="text-sm font-semibold text-teal-700">
            Back to Explorer
          </Link>
        </div>
        {products.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} seller={getSellerById(product.sellerId)} />
            ))}
          </div>
        ) : (
          <section className="rounded border border-slate-200 bg-white p-6 shadow-sm" role="status">
            <h3 className="text-xl font-semibold">No assets in this mock collection</h3>
            <p className="mt-2 text-sm text-slate-600">
              {isExternal
                ? "External collection item discovery remains mock-first/read-only and does not imply custody, ownership guarantee, trading, settlement or provider sync."
                : "Collection asset ingestion remains mock-first and local to the NFT Marketplace foundation."}
            </p>
          </section>
        )}
      </section>

      {relatedRanking.length > 0 && (
        <section className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Ranking context</p>
          <div className="grid gap-4 md:grid-cols-2">
            {relatedRanking.map((view) => (
              <CollectionCard key={view.collection.id} view={view} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

function Summary({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="rounded border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-slate-950">
        {icon}
        <p className="text-sm font-semibold">{label}</p>
      </div>
      <p className="mt-2 text-lg font-semibold">{value}</p>
    </div>
  );
}

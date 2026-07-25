import { CollectionCard } from "../components/CollectionCard";
import { RevenueTrustRiskIntelligencePanel } from "../components/RevenueTrustRiskIntelligencePanel";
import { useCollections, useFederationIntelligenceContext } from "../hooks/useMarketplace";
import { useMarketplaceTelemetry } from "../hooks/useMarketplaceTelemetry";

export function CollectionsPage() {
  const { data, error, isLoading } = useCollections();
  const collections = data ?? [];
  const primaryFederatedCollection = collections.find((view) => view.collection.isFederated)?.collection;
  const federationIntelligenceQuery = useFederationIntelligenceContext(primaryFederatedCollection?.id);
  useMarketplaceTelemetry("collections-page", { collectionCount: collections.length });

  if (isLoading) {
    return (
      <section className="rounded border border-slate-200 bg-white p-6 shadow-sm" role="status" aria-live="polite">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Collections</p>
        <h1 className="mt-2 text-2xl font-semibold">Loading mock collection ranking</h1>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded border border-red-200 bg-red-50 p-6 text-red-800 shadow-sm" role="alert">
        <h1 className="text-xl font-semibold">Collection runtime unavailable</h1>
        <p className="mt-2 text-sm">No indexer, provider, chain read or external marketplace integration was attempted.</p>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Collections</p>
        <h1 className="mt-2 text-3xl font-semibold">NFT collection ranking</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Native and External Collection mock records for the Phase 02 Federation Layer. External metadata and statistics are
          provider-reported mock data only and do not use live providers, indexers, floor-price APIs or on-chain reads.
        </p>
      </div>

      <RevenueTrustRiskIntelligencePanel
        title="Federation Intelligence Context"
        description="Federation Intelligence Context preserves origin, provider, validation status, provenance, risk classification and trust boundaries for federated collections. It does not score risk, score trust, approve, block, settle, payout or monetize automatically."
        view={federationIntelligenceQuery.data}
      />

      {collections.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {collections.map((view) => (
            <CollectionCard key={view.collection.id} view={view} />
          ))}
        </div>
      ) : (
        <section className="rounded border border-slate-200 bg-white p-6 shadow-sm" role="status">
          <h2 className="text-xl font-semibold">No mock collections available</h2>
          <p className="mt-2 text-sm text-slate-600">
            No displayable native or federated mock collection records are available. No provider, indexer, chain read or settlement was attempted.
          </p>
        </section>
      )}
    </div>
  );
}

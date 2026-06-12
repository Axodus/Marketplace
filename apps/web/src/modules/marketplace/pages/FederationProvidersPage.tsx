import { Link } from "react-router-dom";
import { DatabaseZap, RadioTower, ShieldAlert } from "lucide-react";
import { NeutralBadge } from "../components/StatusBadge";
import { useFederationProviders } from "../hooks/useMarketplace";
import { useMarketplaceTelemetry } from "../hooks/useMarketplaceTelemetry";
import type { FederationProviderView } from "../services/marketplaceService";

export function FederationProvidersPage() {
  const { data, isLoading, error } = useFederationProviders();
  const providers = data ?? [];
  useMarketplaceTelemetry("federation-providers-page", { providerCount: providers.length });

  if (isLoading) {
    return (
      <section className="rounded border border-slate-200 bg-white p-6 shadow-sm" role="status" aria-live="polite">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Federation Providers</p>
        <h1 className="mt-2 text-2xl font-semibold">Loading mock provider descriptors</h1>
        <p className="mt-2 text-sm text-slate-600">No external calls, SDKs, API keys, scraping or provider health checks are executing.</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded border border-red-200 bg-red-50 p-6 text-red-800 shadow-sm" role="alert">
        <h1 className="text-xl font-semibold">Federation Provider descriptors unavailable</h1>
        <p className="mt-2 text-sm">No provider API, indexer, subgraph or external marketplace integration was attempted.</p>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Federation Providers</p>
        <h1 className="mt-2 text-3xl font-semibold">Mock-first provider boundaries</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Provider descriptors prepare OpenSea, Rarible, Magic Eden and Harmony Ecosystem as future federation boundaries. They are
          read-only/non-executing records and are not absolute sources of truth.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <NeutralBadge>read-only</NeutralBadge>
          <NeutralBadge>non-executing</NeutralBadge>
          <NeutralBadge>no external calls</NeutralBadge>
          <NeutralBadge>no API keys</NeutralBadge>
          <NeutralBadge>no SDK</NeutralBadge>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {providers.map((providerView) => (
          <ProviderCard key={providerView.provider.id} view={providerView} />
        ))}
      </section>
    </div>
  );
}

function ProviderCard({ view }: { view: FederationProviderView }) {
  const { provider, references, boundaryNotes } = view;

  return (
    <article className="rounded border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-950">
            <RadioTower size={20} />
            <h2 className="text-xl font-semibold">{provider.name}</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{provider.description}</p>
        </div>
        <NeutralBadge>{provider.health.status}</NeutralBadge>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <NeutralBadge>{provider.id}</NeutralBadge>
        <NeutralBadge>{provider.type}</NeutralBadge>
        <NeutralBadge>{provider.trustLevel}</NeutralBadge>
        <NeutralBadge>{provider.executionEnabled ? "execution enabled" : "execution disabled"}</NeutralBadge>
      </div>

      <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
        <Fact label="Supported chains" value={provider.supportedChains.join(", ")} />
        <Fact label="Supported standards" value={provider.supportedStandards.join(", ")} />
        <Fact label="Supported operations" value={provider.supportedOperations.join(", ")} />
        <Fact label="Last checked" value={provider.health.lastCheckedAt} />
        <Fact label="Referenced collections" value={String(references.collections.length)} />
        <Fact label="Wallet discovery records" value={String(references.walletDiscoveryRecords.length)} />
      </div>

      <Panel title="Provider capabilities" icon={<DatabaseZap size={18} />}>
        <TagList items={provider.capabilities} />
      </Panel>

      <Panel title="Data scope" icon={<DatabaseZap size={18} />}>
        <ul className="list-disc space-y-1 pl-5">
          {provider.dataScope.map((scope) => (
            <li key={scope}>{scope}</li>
          ))}
        </ul>
      </Panel>

      <Panel title="Provider limitations" icon={<ShieldAlert size={18} />}>
        <ul className="list-disc space-y-1 pl-5">
          {provider.limitations.map((limit) => (
            <li key={limit}>{limit}</li>
          ))}
        </ul>
      </Panel>

      <Panel title="Trust boundary" icon={<ShieldAlert size={18} />}>
        <p>Validation: {provider.trustBoundary.validationStatus}</p>
        <p>Risk: {provider.trustBoundary.riskClassification}</p>
        <p>Execution: {provider.trustBoundary.executionState}</p>
        <p>
          Trade {provider.trustBoundary.canTrade ? "enabled" : "disabled"} / settlement {provider.trustBoundary.canSettle ? "enabled" : "disabled"} / bridge{" "}
          {provider.trustBoundary.canBridge ? "enabled" : "disabled"}
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {boundaryNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </Panel>

      {references.collections.length > 0 && (
        <div className="mt-4 rounded border border-slate-200 bg-slate-50 p-4 text-sm">
          <p className="font-semibold text-slate-950">Current mock references</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {references.collections.map((collection) => (
              <Link key={collection.id} to={`/marketplace/collections/${collection.slug}`} className="font-semibold text-teal-700">
                {collection.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 break-words font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
      <div className="flex items-center gap-2 font-semibold text-slate-950">
        {icon}
        <h3>{title}</h3>
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function TagList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <NeutralBadge key={item}>{item}</NeutralBadge>
      ))}
    </div>
  );
}

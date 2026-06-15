import { Link, useParams } from "react-router-dom";
import type { ReactNode } from "react";
import { BadgeCheck, FileText, Megaphone, MousePointerClick, ShieldAlert } from "lucide-react";
import { NeutralBadge } from "../components/StatusBadge";
import { useAttributionContext, useAttributionSource, useAttributionSources } from "../hooks/useMarketplace";
import { useMarketplaceTelemetry } from "../hooks/useMarketplaceTelemetry";
import type { AttributionSourceView } from "../services/marketplaceService";

const sourceLabels: Record<string, string> = {
  "referral-mock": "Referral Source mock",
  "campaign-mock": "Campaign Source mock",
  "placement-mock": "Placement Source mock",
  "distribution-channel": "Distribution Source",
  "partner-profile": "Partner Profile source",
  "affiliate-profile": "Affiliate Profile source",
  "tenant-route": "Tenant route source",
  "curated-catalog": "Curated Catalog source",
  "catalog-segment": "Catalog Segment source",
  "community-marketplace": "Community Marketplace source",
  "manual-source-mock": "Manual Source mock",
  demo: "Demo source"
};

export function AttributionSourcesPage() {
  const { sourceSlug } = useParams();
  const sourcesQuery = useAttributionSources();
  const detailQuery = useAttributionSource(sourceSlug);
  const contextQuery = useAttributionContext(sourceSlug);
  const sources = sourcesQuery.data ?? [];
  const selected = sourceSlug ? detailQuery.data : contextQuery.data?.source;

  useMarketplaceTelemetry("attribution-sources-page", {
    sourceSlug: sourceSlug ?? null,
    sourceCount: sources.length
  });

  if (sourcesQuery.isLoading) {
    return (
      <section className="rounded border border-slate-200 bg-white p-6 shadow-sm" role="status" aria-live="polite">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Attribution Source</p>
        <h1 className="mt-2 text-2xl font-semibold">Loading mock attribution</h1>
        <p className="mt-2 text-sm text-slate-600">No tracking real, cookies, commission, payout, billing or settlement is executing.</p>
      </section>
    );
  }

  if (sourceSlug && detailQuery.error) {
    return (
      <section className="rounded border border-amber-200 bg-amber-50 p-6 text-amber-950 shadow-sm" role="status">
        <h1 className="text-xl font-semibold">Attribution Source not found</h1>
        <p className="mt-2 text-sm">
          Attribution Context resolution uses local mock/config-first records only. No tracking real, cookies, analytics tracking,
          commission, payout, billing, settlement or revenue sharing was attempted.
        </p>
        <Link to="/marketplace/distribution/attribution" className="mt-4 inline-flex text-sm font-semibold text-teal-800">
          Back to Attribution Sources
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Attribution Source</p>
        <h1 className="mt-2 text-3xl font-semibold">Mock/config-first attribution and distribution sources</h1>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600">
          Attribution Sources represent referral mock, campaign mock, placement source, Distribution Source and Commercial Origin
          descriptors. They are transparent display records only and do not activate tracking real, cookies, analytics tracking,
          commission tracking, payout, settlement, billing, revenue sharing, Marketplace Intelligence or BI.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <NeutralBadge>mock attribution</NeutralBadge>
          <NeutralBadge>config-first attribution</NeutralBadge>
          <NeutralBadge>no tracking real</NeutralBadge>
          <NeutralBadge>no cookies</NeutralBadge>
          <NeutralBadge>no commission</NeutralBadge>
          <NeutralBadge>no payout</NeutralBadge>
          <NeutralBadge>no revenue sharing</NeutralBadge>
          <NeutralBadge>no settlement</NeutralBadge>
          <NeutralBadge>no billing</NeutralBadge>
        </div>
      </section>

      {selected ? <AttributionSourceDetail view={selected} /> : null}

      <section className="grid gap-4 lg:grid-cols-2">
        {sources.map((view) => (
          <AttributionSourceCard key={view.source.id} view={view} selected={view.source.id === selected?.source.id} />
        ))}
      </section>
    </div>
  );
}

function AttributionSourceCard({ view, selected }: { view: AttributionSourceView; selected?: boolean }) {
  const { source } = view;
  return (
    <article className={`rounded border bg-white p-5 shadow-sm ${selected ? "border-teal-400" : "border-slate-200"}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MousePointerClick size={20} />
            <h2 className="text-xl font-semibold">{source.displayName}</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{source.description}</p>
        </div>
        <NeutralBadge>{sourceLabels[source.sourceType] ?? source.sourceType}</NeutralBadge>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <NeutralBadge>{source.status}</NeutralBadge>
        <NeutralBadge>{source.scope}</NeutralBadge>
        <NeutralBadge>{source.trackingMode}</NeutralBadge>
      </div>
      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <Metric label="Channel" value={view.channel?.channel.displayName ?? "none"} />
        <Metric label="Profile" value={view.profile?.profile.displayName ?? "none"} />
        <Metric label="Can track" value={String(source.canTrack)} />
      </div>
      <p className="mt-4 rounded border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
        {source.disclaimers[0]}
      </p>
      <Link to={`/marketplace/distribution/attribution/${source.slug}`} className="mt-4 inline-flex text-sm font-semibold text-teal-700">
        Open Attribution Source
      </Link>
    </article>
  );
}

function AttributionSourceDetail({ view }: { view: AttributionSourceView }) {
  const { source, context } = view;
  return (
    <section className="space-y-5 rounded border border-teal-200 bg-teal-50 p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">Attribution Source detail</p>
          <h2 className="mt-1 text-2xl font-semibold">{source.displayName}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-teal-950">{source.description}</p>
        </div>
        <NeutralBadge>{source.slug}</NeutralBadge>
      </div>

      <div className="grid gap-3 text-sm md:grid-cols-4">
        <Metric label="Source type" value={sourceLabels[source.sourceType] ?? source.sourceType} />
        <Metric label="Tracking mode" value={source.trackingMode} />
        <Metric label="Commercial origin" value={source.commercialOrigin.originLabel} />
        <Metric label="Source label" value={source.sourceLabel} />
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        <InfoPanel title="Attribution Context" icon={<BadgeCheck size={18} />} rows={[
          ["Resolved source", context.sourceId],
          ["Simulated", String(context.isSimulated)],
          ["Can track", String(context.canTrack)],
          ["Can attribute revenue", String(context.canAttributeRevenue)],
          ["Can trigger payout", String(context.canTriggerPayout)],
          ["Can settle", String(context.canSettle)]
        ]} />
        <InfoPanel title="Commercial Origin" icon={<Megaphone size={18} />} rows={[
          ["Origin", source.commercialOrigin.originLabel],
          ["Type", source.commercialOrigin.originType],
          ["Source", source.commercialOrigin.sourceLabel],
          ["Simulated", String(source.commercialOrigin.isSimulated)]
        ]} />
        <InfoPanel title="Distribution Source" icon={<FileText size={18} />} rows={[
          ["Source", source.distributionSource.sourceLabel],
          ["Type", source.distributionSource.sourceType],
          ["Status", source.distributionSource.status],
          ["Simulated", String(source.distributionSource.isSimulated)]
        ]} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <ReferencePanel title="Associated channel" items={view.channel ? [view.channel.channel.displayName] : []} />
        <ReferencePanel title="Associated profile" items={view.profile ? [view.profile.profile.displayName] : []} />
        <ReferencePanel title="Associated tenant" items={view.tenant ? [view.tenant.displayName] : []} />
        <ReferencePanel title="Associated curated catalog" items={view.curatedCatalog ? [view.curatedCatalog.catalog.displayName] : []} />
        <ReferencePanel title="Associated segment" items={view.segment ? [view.segment.displayName] : []} />
        <ReferencePanel title="Associated placement" items={view.placement ? [view.placement.placement.placementLabel] : []} />
      </section>

      <section className="rounded border border-slate-200 bg-white p-4">
        <h3 className="font-semibold">Attribution Note</h3>
        <div className="mt-3 grid gap-3">
          {source.attributionNotes.length ? source.attributionNotes.map((note) => (
            <article key={note.id} className="rounded border border-slate-200 bg-slate-50 p-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h4 className="font-semibold">{note.title}</h4>
                  <p className="mt-1 text-sm text-slate-600">{note.description}</p>
                </div>
                <NeutralBadge>{note.severity}</NeutralBadge>
              </div>
              <p className="mt-3 rounded border border-amber-200 bg-amber-50 p-2 text-xs leading-5 text-amber-900">{note.disclaimers[0]}</p>
            </article>
          )) : <NeutralBadge>No Attribution Note</NeutralBadge>}
        </div>
      </section>

      <BoundaryNotes notes={view.boundaryNotes} />
    </section>
  );
}

function InfoPanel({ title, icon, rows }: { title: string; icon: ReactNode; rows: Array<[string, string]> }) {
  return (
    <article className="rounded border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>
      <dl className="mt-3 space-y-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 border-b border-slate-100 pb-2 last:border-b-0">
            <dt className="text-slate-500">{label}</dt>
            <dd className="text-right font-medium text-slate-900">{value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

function ReferencePanel({ title, items, emptyLabel = "No references" }: { title: string; items: string[]; emptyLabel?: string }) {
  return (
    <article className="rounded border border-slate-200 bg-white p-4">
      <h3 className="font-semibold">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.length ? items.map((item) => <NeutralBadge key={item}>{item}</NeutralBadge>) : <NeutralBadge>{emptyLabel}</NeutralBadge>}
      </div>
    </article>
  );
}

function BoundaryNotes({ notes }: { notes: string[] }) {
  return (
    <section className="rounded border border-amber-200 bg-amber-50 p-4 text-amber-950">
      <div className="flex items-center gap-2">
        <ShieldAlert size={18} />
        <h3 className="font-semibold">Attribution boundaries</h3>
      </div>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6">
        {Array.from(new Set(notes)).slice(0, 9).map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded border border-slate-200 bg-white p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-950">{value}</p>
    </div>
  );
}

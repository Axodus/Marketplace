import { Link, useParams } from "react-router-dom";
import { BarChart3, Brain, FileSearch, ShieldCheck } from "lucide-react";
import { NeutralBadge } from "../components/StatusBadge";
import { useIntelligenceSnapshots, useMarketplaceInsight, useMarketplaceInsightValidation, useMarketplaceInsights } from "../hooks/useMarketplace";
import { useMarketplaceTelemetry } from "../hooks/useMarketplaceTelemetry";
import type { IntelligenceSnapshotView, MarketplaceInsightView } from "../services/marketplaceService";

const boundaryBadges = ["mock-only", "static-only", "no-tracking", "no-BI", "no-ML", "no-automated-decisioning"];

export function MarketplaceIntelligencePage() {
  const { insightSlug } = useParams();
  const insightsQuery = useMarketplaceInsights();
  const snapshotsQuery = useIntelligenceSnapshots();
  const detailQuery = useMarketplaceInsight(insightSlug);
  const insights = insightsQuery.data ?? [];
  const snapshots = snapshotsQuery.data ?? [];
  const selected = insightSlug ? detailQuery.data : insights[0];
  const selectedSnapshot = selected?.snapshot ? snapshots.find((view) => view.snapshot.id === selected.snapshot?.id) : null;

  useMarketplaceTelemetry("marketplace-intelligence-page", {
    insightSlug: insightSlug ?? null,
    insightCount: insights.length
  });

  if (insightsQuery.isLoading) {
    return (
      <section className="rounded border border-slate-200 bg-white p-6 shadow-sm" role="status" aria-live="polite">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Marketplace Intelligence</p>
        <h1 className="mt-2 text-2xl font-semibold">Loading mock intelligence</h1>
        <p className="mt-2 text-sm text-slate-600">No tracking real, analytics real, BI, scoring real or automated decisioning is executing.</p>
      </section>
    );
  }

  if (insightSlug && detailQuery.error) {
    return (
      <section className="rounded border border-amber-200 bg-amber-50 p-6 text-amber-950 shadow-sm" role="status">
        <h1 className="text-xl font-semibold">Marketplace Insight not found</h1>
        <p className="mt-2 text-sm">
          Insight resolution uses local mock/config-first records only. No tracking real, analytics real, BI, scoring real, recommendation engine,
          automated decisioning, personalization, profiling, wallet tracking, API or database was attempted.
        </p>
        <Link to="/marketplace/intelligence" className="mt-4 inline-flex text-sm font-semibold text-teal-800">
          Back to Marketplace Intelligence
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Marketplace Intelligence</p>
        <h1 className="mt-2 text-3xl font-semibold">Mock/config-first intelligence model</h1>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600">
          Marketplace Insights model static, source-bound summaries with explicit Data Boundaries. They do not activate tracking real, analytics
          real, BI, scoring real, recommendation engine, ranking algorithm, automated decisioning, personalization, profiling, wallet tracking,
          behavioral tracking, ML model, AI runtime, backend, API or database.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {boundaryBadges.map((badge) => (
            <NeutralBadge key={badge}>{badge}</NeutralBadge>
          ))}
          <NeutralBadge>mock intelligence</NeutralBadge>
          <NeutralBadge>config-first intelligence</NeutralBadge>
        </div>
      </section>

      {selected ? <MarketplaceInsightDetail view={selected} snapshotView={selectedSnapshot ?? undefined} /> : null}

      <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Intelligence Snapshots</p>
            <h2 className="mt-1 text-2xl font-semibold">Static mock snapshots by scope</h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
              Snapshots are derived from mock data and local configuration only. They do not use event tracking, analytics pipelines, data
              warehouses, BI, ML, scoring, recommendation engines or automated decisioning.
            </p>
          </div>
          <NeutralBadge>{snapshots.length} snapshots</NeutralBadge>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {snapshots.map((snapshot) => (
            <IntelligenceSnapshotCard key={snapshot.snapshot.id} view={snapshot} />
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {insights.map((view) => (
          <MarketplaceInsightCard key={view.insight.id} view={view} selected={view.insight.id === selected?.insight.id} />
        ))}
      </section>
    </div>
  );
}

function MarketplaceInsightCard({ view, selected }: { view: MarketplaceInsightView; selected?: boolean }) {
  const { insight, dataBoundary } = view;

  return (
    <article className={`rounded border bg-white p-5 shadow-sm ${selected ? "border-teal-400" : "border-slate-200"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Brain size={20} />
            <h2 className="text-xl font-semibold">{insight.title}</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{insight.description}</p>
        </div>
        <NeutralBadge>{insight.status}</NeutralBadge>
      </div>
      <div className="mt-4 grid gap-3 text-sm">
        <Metric label="Insight type" value={insight.insightType} />
        <Metric label="Scope" value={insight.scope} />
        <Metric label="Confidence" value={insight.confidenceLabel} />
        <Metric label="Data Boundary" value={dataBoundary?.status ?? "missing"} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <NeutralBadge>no tracking real</NeutralBadge>
        <NeutralBadge>no BI</NeutralBadge>
        <NeutralBadge>no scoring real</NeutralBadge>
      </div>
      <Link to={`/marketplace/intelligence/${insight.slug}`} className="mt-4 inline-flex text-sm font-semibold text-teal-700">
        Open Marketplace Insight
      </Link>
    </article>
  );
}

function MarketplaceInsightDetail({ view, snapshotView }: { view: MarketplaceInsightView; snapshotView?: IntelligenceSnapshotView }) {
  const { insight, dataBoundary, snapshot } = view;
  const validationQuery = useMarketplaceInsightValidation(insight.slug);
  const validation = validationQuery.data;

  return (
    <section className="space-y-5 rounded border border-teal-200 bg-teal-50 p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">Marketplace Insight detail</p>
          <h2 className="mt-1 text-2xl font-semibold">{insight.title}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-teal-950">{insight.description}</p>
        </div>
        <NeutralBadge>{insight.slug}</NeutralBadge>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <Metric label="Status" value={insight.status} />
        <Metric label="Scope" value={insight.scope} />
        <Metric label="Source" value={view.sourceLabel} />
        <Metric label="Mock-only valid" value={String(validation?.isMockOnly ?? false)} />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <InfoPanel
          title="Insight Boundary"
          rows={[
            ["Is simulated", String(insight.isSimulated)],
            ["Uses real tracking", String(insight.usesRealTracking)],
            ["Uses personal data", String(insight.usesPersonalData)],
            ["Uses behavioral data", String(insight.usesBehavioralData)],
            ["Uses wallet profiling", String(insight.usesWalletProfiling)],
            ["Uses automated decisioning", String(insight.usesAutomatedDecisioning)]
          ]}
        />
        <InfoPanel
          title="Automation Boundary"
          rows={[
            ["Can recommend automatically", String(insight.canRecommendAutomatically)],
            ["Can rank automatically", String(insight.canRankAutomatically)],
            ["Can trigger commercial action", String(insight.canTriggerCommercialAction)],
            ["No personalization", String(validation?.isNoTracking ?? true)],
            ["No profiling", String(validation?.isNoScoring ?? true)],
            ["No wallet tracking", String(validation?.isNoTracking ?? true)]
          ]}
        />
        <InfoPanel
          title="Data Boundary"
          rows={[
            ["Boundary", dataBoundary?.boundaryLabel ?? "missing"],
            ["Status", dataBoundary?.status ?? "missing"],
            ["Uses analytics pipeline", String(dataBoundary?.usesAnalyticsPipeline ?? false)],
            ["Uses BI", String(dataBoundary?.usesBI ?? false)],
            ["Uses ML model", String(dataBoundary?.usesMLModel ?? false)],
            ["Can export data", String(dataBoundary?.canExportData ?? false)]
          ]}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <ReferencePanel title="Allowed data sources" items={dataBoundary?.allowedDataSources ?? []} />
        <ReferencePanel title="Blocked data sources" items={dataBoundary?.blockedDataSources ?? []} />
      </section>

      {snapshotView ? <IntelligenceSnapshotPanel view={snapshotView} /> : snapshot ? <SnapshotSummary snapshot={snapshot} /> : null}

      <section className="rounded border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-2">
          <FileSearch size={18} />
          <h3 className="font-semibold">Insight Signal mock</h3>
        </div>
        <div className="mt-3 grid gap-3">
          {view.signals.map((signal) => (
            <article key={signal.id} className="rounded border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h4 className="font-semibold">{signal.name}</h4>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{signal.description}</p>
                </div>
                <NeutralBadge>{signal.signalType}</NeutralBadge>
              </div>
              <div className="mt-3 grid gap-2 text-sm sm:grid-cols-4">
                <Metric label="Weight mock" value={signal.weightMock} />
                <Metric label="Confidence" value={signal.confidenceLabel} />
                <Metric label="Uses real events" value={String(signal.usesRealEvents)} />
                <Metric label="Uses tracking" value={String(signal.usesRealTracking)} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded border border-slate-200 bg-white p-4">
        <h3 className="font-semibold">Intelligence Audit Notes</h3>
        <div className="mt-3 grid gap-3">
          {view.auditNotes.length ? (
            view.auditNotes.map((note) => (
              <article key={note.id} className="rounded border border-slate-200 bg-slate-50 p-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{note.label}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{note.description}</p>
                  </div>
                  <NeutralBadge>{note.severity}</NeutralBadge>
                </div>
              </article>
            ))
          ) : (
            <p className="text-sm text-slate-500">No audit notes for this mock insight.</p>
          )}
        </div>
      </section>

      <BoundaryNotes notes={view.boundaryNotes} />
    </section>
  );
}

function IntelligenceSnapshotCard({ view }: { view: IntelligenceSnapshotView }) {
  const { snapshot, dataBoundary } = view;

  return (
    <article className="rounded border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 size={18} />
            <h3 className="font-semibold">{snapshot.title}</h3>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{snapshot.summary}</p>
        </div>
        <NeutralBadge>{snapshot.status}</NeutralBadge>
      </div>
      <div className="mt-3 grid gap-3 text-sm md:grid-cols-4">
        <Metric label="Scope" value={snapshot.scope} />
        <Metric label="Source" value={view.sourceLabel} />
        <Metric label="Signals" value={view.signals.length} />
        <Metric label="Data Boundary" value={dataBoundary?.status ?? "missing"} />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <NeutralBadge>static mock</NeutralBadge>
        <NeutralBadge>derived from mock data</NeutralBadge>
        <NeutralBadge>no tracking real</NeutralBadge>
        <NeutralBadge>no BI</NeutralBadge>
        <NeutralBadge>no ML</NeutralBadge>
        <NeutralBadge>no automated decisioning</NeutralBadge>
      </div>
    </article>
  );
}

function IntelligenceSnapshotPanel({ view }: { view: IntelligenceSnapshotView }) {
  const { snapshot, dataBoundary } = view;

  return (
    <section className="rounded border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 size={18} />
            <h3 className="font-semibold">{snapshot.title}</h3>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{snapshot.summary}</p>
        </div>
        <NeutralBadge>{snapshot.slug}</NeutralBadge>
      </div>
      <div className="mt-4 grid gap-3 text-sm md:grid-cols-4">
        <Metric label="Generated" value={snapshot.generatedAt} />
        <Metric label="Static mock" value={String(snapshot.isStaticMock)} />
        <Metric label="Derived mock" value={String(snapshot.isDerivedFromMockData)} />
        <Metric label="Boundary" value={dataBoundary?.status ?? "missing"} />
        <Metric label="Uses tracking" value={String(snapshot.usesRealTracking)} />
        <Metric label="Uses BI" value={String(snapshot.usesBI)} />
        <Metric label="Uses ML" value={String(snapshot.usesMLModel)} />
        <Metric label="Automated decisioning" value={String(snapshot.usesAutomatedDecisioning)} />
      </div>
      <section className="mt-4 grid gap-4 lg:grid-cols-2">
        <ReferencePanel title="Snapshot Signals" items={view.signals.map((signal) => signal.name)} />
        <ReferencePanel title="Snapshot Insights" items={view.insights.map((insight) => insight.title)} />
      </section>
      <BoundaryNotes notes={view.boundaryNotes} />
    </section>
  );
}

function SnapshotSummary({ snapshot }: { snapshot: NonNullable<MarketplaceInsightView["snapshot"]> }) {
  return (
    <section className="rounded border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 size={18} />
            <h3 className="font-semibold">{snapshot.title}</h3>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{snapshot.summary}</p>
        </div>
        <NeutralBadge>{snapshot.status}</NeutralBadge>
      </div>
    </section>
  );
}

function InfoPanel({ title, rows }: { title: string; rows: Array<[string, string]> }) {
  return (
    <section className="rounded border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2">
        <ShieldCheck size={18} />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <dl className="mt-4 space-y-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex gap-3">
            <dt className="min-w-40 text-slate-500">{label}</dt>
            <dd className="font-medium text-slate-800">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function ReferencePanel({ title, items, emptyLabel = "No references" }: { title: string; items: string[]; emptyLabel?: string }) {
  return (
    <section className="rounded border border-slate-200 bg-white p-4">
      <h3 className="font-semibold">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.length ? items.map((item) => <NeutralBadge key={item}>{item}</NeutralBadge>) : <span className="text-sm text-slate-500">{emptyLabel}</span>}
      </div>
    </section>
  );
}

function BoundaryNotes({ notes }: { notes: string[] }) {
  return (
    <section className="rounded border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-center gap-2">
        <ShieldCheck size={18} />
        <h3 className="font-semibold text-amber-950">Boundary notes</h3>
      </div>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-amber-950">
        {Array.from(new Set(notes)).map((note) => (
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
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

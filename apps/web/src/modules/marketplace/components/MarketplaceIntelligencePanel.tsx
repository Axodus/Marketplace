import { BarChart3, FileSearch, ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";
import type { IntelligenceSnapshotView } from "../services/marketplaceService";
import { NeutralBadge } from "./StatusBadge";

interface MarketplaceIntelligencePanelProps {
  title: string;
  description: string;
  snapshot?: IntelligenceSnapshotView | null;
}

const intelligenceBadges = ["mock-only", "no-tracking", "no-BI", "no-scoring", "no-recommendation-engine", "no-automated-decisioning"];

export function MarketplaceIntelligencePanel({ title, description, snapshot }: MarketplaceIntelligencePanelProps) {
  if (!snapshot) {
    return (
      <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <BarChart3 size={20} />
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        <p className="mt-4 rounded border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
          No Intelligence Snapshot is configured for this mock context. No analytics real, tracking real, BI real, scoring real,
          recommendation engine or automated decisioning was attempted.
        </p>
      </section>
    );
  }

  const { snapshot: record, dataBoundary } = snapshot;

  return (
    <section className="rounded border border-teal-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-teal-700">
            <BarChart3 size={16} /> {title}
          </p>
          <h2 className="mt-1 text-2xl font-semibold">{record.title}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{description}</p>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{record.summary}</p>
        </div>
        <NeutralBadge>{record.status}</NeutralBadge>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {intelligenceBadges.map((badge) => (
          <NeutralBadge key={badge}>{badge}</NeutralBadge>
        ))}
        <NeutralBadge>{record.scope}</NeutralBadge>
        <NeutralBadge>{record.isStaticMock ? "static mock" : "dynamic disabled"}</NeutralBadge>
      </div>

      <div className="mt-4 grid gap-3 text-sm md:grid-cols-4">
        <Metric label="Confidence" value={snapshot.signals[0]?.confidenceLabel ?? "informational-mock"} />
        <Metric label="Signals" value={snapshot.signals.length} />
        <Metric label="Insights" value={snapshot.insights.length} />
        <Metric label="Data Boundary" value={dataBoundary?.status ?? "missing"} />
      </div>

      <section className="mt-4 grid gap-4 lg:grid-cols-3">
        <InfoList title="Insight Summary Card" icon={<FileSearch size={18} />} items={snapshot.insights.map((insight) => `${insight.title} / ${insight.confidenceLabel}`)} />
        <InfoList title="Snapshot Summary Card" icon={<BarChart3 size={18} />} items={[
          `Scope: ${record.scope}`,
          `Source: ${snapshot.sourceLabel}`,
          `Generated: ${record.generatedAt}`,
          `Derived from mock data: ${String(record.isDerivedFromMockData)}`
        ]} />
        <InfoList
          title="Boundary Warning Card"
          icon={<ShieldAlert size={18} />}
          items={[
            dataBoundary?.boundaryLabel ?? "Data Boundary missing",
            "No tracking real",
            "No BI real",
            "No scoring real",
            "No recommendation engine",
            "No automated decisioning",
            "No behavioral collection"
          ]}
        />
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-2">
        <InfoList title="Signals mock principais" items={snapshot.signals.map((signal) => `${signal.name} / ${signal.signalType}`)} />
        <InfoList title="Warnings and disclaimers" items={Array.from(new Set([...record.warnings, ...record.disclaimers, ...snapshot.boundaryNotes])).slice(0, 8)} />
      </section>
    </section>
  );
}

function InfoList({ title, items, icon }: { title: string; items: string[]; icon?: ReactNode }) {
  return (
    <section className="rounded border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
        {items.length ? items.map((item) => <li key={item}>- {item}</li>) : <li>- No mock records configured.</li>}
      </ul>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

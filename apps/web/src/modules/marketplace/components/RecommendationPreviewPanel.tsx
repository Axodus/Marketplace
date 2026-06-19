import { Compass, ListChecks, ShieldCheck } from "lucide-react";
import { NeutralBadge } from "./StatusBadge";
import type { RecommendationPreviewView } from "../services/marketplaceService";

const boundaryBadges = [
  "preview-only",
  "editorial mock",
  "no recommendation engine",
  "no automated ranking",
  "no personalization",
  "no profiling",
  "no behavioral tracking",
  "no wallet profiling",
  "no automated decisioning",
  "no commercial action"
];

export function RecommendationPreviewPanel({
  title,
  description,
  previews
}: {
  title: string;
  description: string;
  previews?: RecommendationPreviewView[] | null;
}) {
  const items = previews ?? [];

  return (
    <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Recommendation Preview</p>
          <h2 className="mt-1 text-2xl font-semibold">{title}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{description}</p>
        </div>
        <NeutralBadge>{items.length} previews</NeutralBadge>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {boundaryBadges.map((badge) => (
          <NeutralBadge key={badge}>{badge}</NeutralBadge>
        ))}
      </div>

      <div className="mt-4 grid gap-4">
        {items.length ? (
          items.map((view) => <RecommendationPreviewCard key={view.preview.id} view={view} />)
        ) : (
          <p className="rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
            No Recommendation Preview mock is configured for this context.
          </p>
        )}
      </div>
    </section>
  );
}

function RecommendationPreviewCard({ view }: { view: RecommendationPreviewView }) {
  const { preview, rankingExplanation, dataBoundary, mockSignals } = view;

  return (
    <article className="rounded border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Compass size={18} />
            <h3 className="font-semibold">{preview.title}</h3>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{preview.reason}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{preview.discoveryNote}</p>
        </div>
        <NeutralBadge>{preview.status}</NeutralBadge>
      </div>

      <div className="mt-3 grid gap-3 text-sm md:grid-cols-4">
        <Metric label="Target" value={view.targetLabel} />
        <Metric label="Mock Fit Label" value={preview.fitLabel} />
        <Metric label="Mock Opportunity" value={preview.opportunityLabel} />
        <Metric label="Confidence" value={preview.confidenceLabel} />
      </div>

      <section className="mt-4 rounded border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-2">
          <ListChecks size={18} />
          <h4 className="font-semibold">Ranking Explanation</h4>
        </div>
        {rankingExplanation ? (
          <div className="mt-3 space-y-3 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">{rankingExplanation.title}</p>
            <p>{rankingExplanation.reason}</p>
            <p>{rankingExplanation.editorialReason}</p>
            <p>{rankingExplanation.editorialRankingNote}</p>
            <div className="flex flex-wrap gap-2">
              <NeutralBadge>{rankingExplanation.rankingType}</NeutralBadge>
              <NeutralBadge>{rankingExplanation.status}</NeutralBadge>
              <NeutralBadge>isAlgorithmic={String(rankingExplanation.isAlgorithmic)}</NeutralBadge>
              <NeutralBadge>usesAutomatedDecisioning={String(rankingExplanation.usesAutomatedDecisioning)}</NeutralBadge>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">No Ranking Explanation mock configured.</p>
        )}
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-2">
        <ReferencePanel title="Mock signals" items={mockSignals.map((signal) => signal.name)} />
        <ReferencePanel title="Data Boundary" items={[dataBoundary?.boundaryLabel ?? "missing", dataBoundary?.status ?? "missing"]} />
      </section>

      <div className="mt-4 grid gap-2 text-sm md:grid-cols-4">
        <Metric label="Uses engine" value={String(preview.usesRecommendationEngine)} />
        <Metric label="Automated ranking" value={String(preview.usesAutomatedRanking)} />
        <Metric label="Personalized" value={String(preview.isPersonalized)} />
        <Metric label="Can trigger action" value={String(preview.canTriggerAction)} />
      </div>

      <section className="mt-4 rounded border border-amber-200 bg-amber-50 p-4 text-amber-950">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} />
          <h4 className="font-semibold">Recommendation Boundary Notes</h4>
        </div>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6">
          {Array.from(new Set(view.boundaryNotes)).slice(0, 8).map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>
    </article>
  );
}

function ReferencePanel({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded border border-slate-200 bg-white p-4">
      <h4 className="font-semibold">{title}</h4>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.length ? items.map((item) => <NeutralBadge key={item}>{item}</NeutralBadge>) : <NeutralBadge>none</NeutralBadge>}
      </div>
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

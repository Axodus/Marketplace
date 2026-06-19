import { CircleDollarSign, FileWarning, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { NeutralBadge } from "./StatusBadge";
import type { RevenueTrustRiskIntelligenceView } from "../services/marketplaceService";

const boundaryBadges = [
  "mock/config-first",
  "no risk scoring",
  "no trust scoring",
  "no financial BI",
  "no accounting",
  "no tax",
  "no settlement",
  "no payout",
  "no automated decisioning",
  "no automated blocking",
  "no automated approval",
  "no automated monetization"
];

export function RevenueTrustRiskIntelligencePanel({
  title,
  description,
  view
}: {
  title: string;
  description: string;
  view?: RevenueTrustRiskIntelligenceView | null;
}) {
  if (!view) {
    return (
      <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <ShieldCheck size={20} />
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        <p className="mt-4 rounded border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
          No Revenue, Trust or Risk Intelligence mock context is configured for this surface. No risk scoring, trust scoring,
          financial BI, accounting, tax, settlement, payout or automated decisioning was attempted.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded border border-indigo-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-indigo-700">
            <ShieldCheck size={16} /> Revenue, Trust and Risk Intelligence
          </p>
          <h2 className="mt-1 text-2xl font-semibold">{title}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{description}</p>
        </div>
        <NeutralBadge>{view.dataBoundary?.status ?? "mock-boundary"}</NeutralBadge>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {boundaryBadges.map((badge) => (
          <NeutralBadge key={badge}>{badge}</NeutralBadge>
        ))}
      </div>

      <section className="mt-4 grid gap-4 lg:grid-cols-3">
        <InfoList
          title="Revenue Intelligence Summary"
          icon={<CircleDollarSign size={18} />}
          items={[
            view.revenueSummary?.title ?? "No Revenue Intelligence Summary configured",
            view.revenueSummary?.summary ?? "Revenue insight is not financial BI.",
            `usesFinancialBI=${String(view.revenueSummary?.usesFinancialBI ?? false)}`,
            `usesAccounting=${String(view.revenueSummary?.usesAccounting ?? false)}`,
            `usesTax=${String(view.revenueSummary?.usesTax ?? false)}`,
            `canSettle=${String(view.revenueSummary?.canSettle ?? false)}`
          ]}
        />
        <InfoList
          title="Settlement Boundary Insight"
          icon={<FileWarning size={18} />}
          items={[
            view.settlementBoundaryInsight?.title ?? "No Settlement Boundary Insight configured",
            view.settlementBoundaryInsight?.description ?? "Settlement insight is explanatory only.",
            `Boundary: ${view.settlementBoundary?.boundaryLabel ?? "none"}`,
            `canTriggerPayout=${String(view.settlementBoundaryInsight?.canTriggerPayout ?? false)}`,
            `canRouteTreasury=${String(view.settlementBoundaryInsight?.canRouteTreasury ?? false)}`,
            `canInvoice=${String(view.settlementBoundaryInsight?.canInvoice ?? false)}`
          ]}
        />
        <InfoList
          title="Federation Intelligence Context"
          icon={<ShieldCheck size={18} />}
          items={[
            view.federationContext?.trustBoundaryLabel ?? "No Federation Intelligence Context configured",
            `Origin: ${view.federationContext?.origin ?? view.collection?.origin ?? "none"}`,
            `Provider: ${view.federationContext?.provider ?? view.provider?.name ?? "none"}`,
            `Validation: ${view.federationContext?.validationStatus ?? view.collection?.federationValidationStatus ?? "none"}`,
            `Risk: ${view.federationContext?.riskClassification ?? view.collection?.riskClassification ?? "none"}`,
            `canApproveAutomatically=${String(view.federationContext?.canApproveAutomatically ?? false)}`
          ]}
        />
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-2">
        <InfoList
          title="Risk Trust Insight mock"
          items={view.riskTrustInsights.flatMap((insight) => [
            `${insight.title} / ${insight.riskLabelMock} / ${insight.trustLabelMock}`,
            `usesRiskScoring=${String(insight.usesRiskScoring)} / usesTrustScoring=${String(insight.usesTrustScoring)} / usesAutomatedDecisioning=${String(insight.usesAutomatedDecisioning)}`,
            `canBlockAutomatically=${String(insight.canBlockAutomatically)} / canApproveAutomatically=${String(insight.canApproveAutomatically)} / canTriggerCommercialAction=${String(insight.canTriggerCommercialAction)}`
          ])}
        />
        <InfoList
          title="Provider Validation and Provenance"
          items={[
            view.providerValidationInsight?.validationLabel ?? "No Provider Validation Insight configured",
            view.provenanceInsight?.provenanceLabel ?? "No Provenance Insight configured",
            `providerUsesTrustScoring=${String(view.providerValidationInsight?.usesTrustScoring ?? false)}`,
            `provenanceUsesRiskScoring=${String(view.provenanceInsight?.usesRiskScoring ?? false)}`
          ]}
        />
      </section>

      <section className="mt-4 rounded border border-amber-200 bg-amber-50 p-4 text-amber-950">
        <h3 className="font-semibold">Boundary notes</h3>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6">
          {Array.from(new Set(view.boundaryNotes)).slice(0, 10).map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
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

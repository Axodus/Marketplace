import { Link, useParams } from "react-router-dom";
import type { ReactNode } from "react";
import { CircleDollarSign, FileSearch, History, ShieldCheck, Split } from "lucide-react";
import { RevenueTrustRiskIntelligencePanel } from "../components/RevenueTrustRiskIntelligencePanel";
import { NeutralBadge } from "../components/StatusBadge";
import { useRevenueSharingPolicies, useRevenueSharingPolicy, useRevenueSharingPreview, useRevenueTrustRiskIntelligence } from "../hooks/useMarketplace";
import { useMarketplaceTelemetry } from "../hooks/useMarketplaceTelemetry";
import type { CommissionModelView, RevenueSharingPolicyView, RevenueSharingPreviewView } from "../services/marketplaceService";

export function RevenueSharingPage() {
  const { policySlug } = useParams();
  const policiesQuery = useRevenueSharingPolicies();
  const detailQuery = useRevenueSharingPolicy(policySlug);
  const policies = policiesQuery.data ?? [];
  const selected = policySlug ? detailQuery.data : policies[0];
  const previewQuery = useRevenueSharingPreview(selected?.policy.slug);
  const revenueTrustRiskQuery = useRevenueTrustRiskIntelligence(selected?.policy.slug);
  const preview = previewQuery.data ?? null;

  useMarketplaceTelemetry("revenue-sharing-page", {
    policySlug: policySlug ?? null,
    policyCount: policies.length
  });

  if (policiesQuery.isLoading) {
    return (
      <section className="rounded border border-slate-200 bg-white p-6 shadow-sm" role="status" aria-live="polite">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Revenue Sharing</p>
        <h1 className="mt-2 text-2xl font-semibold">Loading mock policies</h1>
        <p className="mt-2 text-sm text-slate-600">No payout, settlement, billing, invoice, accounting, tax or treasury routing is executing.</p>
      </section>
    );
  }

  if (policySlug && detailQuery.error) {
    return (
      <section className="rounded border border-amber-200 bg-amber-50 p-6 text-amber-950 shadow-sm" role="status">
        <h1 className="text-xl font-semibold">Revenue Sharing Policy not found</h1>
        <p className="mt-2 text-sm">
          Policy resolution uses local mock/config-first records only. No payout, settlement, billing, invoice, accounting, tax, treasury routing,
          wallet signature, API, database, analytics tracking, BI or Marketplace Intelligence was attempted.
        </p>
        <Link to="/marketplace/revenue-sharing" className="mt-4 inline-flex text-sm font-semibold text-teal-800">
          Back to Revenue Sharing
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Revenue Sharing</p>
        <h1 className="mt-2 text-3xl font-semibold">Mock/config-first revenue participation policies</h1>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600">
          Revenue Sharing Policies model participants, split rules, participant shares and settlement boundaries for preview-only explanation.
          They do not activate payout, settlement, billing, invoice, accounting, tax, treasury routing, payment gateway, wallet signature,
          backend, API, database, analytics tracking, BI or Marketplace Intelligence.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <NeutralBadge>mock/config-first</NeutralBadge>
          <NeutralBadge>preview-only</NeutralBadge>
          <NeutralBadge>Revenue Sharing Preview</NeutralBadge>
          <NeutralBadge>Payout Preview mock</NeutralBadge>
          <NeutralBadge>Settlement Preview mock</NeutralBadge>
          <NeutralBadge>canCalculatePreview simulation</NeutralBadge>
          <NeutralBadge>no commission real</NeutralBadge>
          <NeutralBadge>no payout</NeutralBadge>
          <NeutralBadge>no settlement</NeutralBadge>
          <NeutralBadge>no billing</NeutralBadge>
          <NeutralBadge>no treasury routing</NeutralBadge>
          <NeutralBadge>no wallet signature</NeutralBadge>
        </div>
      </section>

      {selected ? <RevenueSharingPolicyDetail view={selected} preview={preview} revenueTrustRisk={revenueTrustRiskQuery.data} /> : null}

      <section className="grid gap-4 lg:grid-cols-3">
        {policies.map((view) => (
          <RevenueSharingPolicyCard key={view.policy.id} view={view} selected={view.policy.id === selected?.policy.id} />
        ))}
      </section>
    </div>
  );
}

function RevenueSharingPolicyCard({ view, selected }: { view: RevenueSharingPolicyView; selected?: boolean }) {
  const { policy } = view;

  return (
    <article className={`rounded border bg-white p-5 shadow-sm ${selected ? "border-teal-400" : "border-slate-200"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CircleDollarSign size={20} />
            <h2 className="text-xl font-semibold">{policy.displayName}</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{policy.description}</p>
        </div>
        <NeutralBadge>{policy.status}</NeutralBadge>
      </div>
      <div className="mt-4 grid gap-3 text-sm">
        <Metric label="Scope" value={policy.scope} />
        <Metric label="Participants" value={view.participants.length} />
        <Metric label="Rules" value={view.rules.length} />
        <Metric label="Commission Models" value={view.commissionModels.length} />
        <Metric label="Share total" value={`${view.shareTotal}% mock`} />
      </div>
      <p className="mt-4 rounded border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
        {policy.disclaimers[0]}
      </p>
      <Link to={`/marketplace/revenue-sharing/${policy.slug}`} className="mt-4 inline-flex text-sm font-semibold text-teal-700">
        Open Revenue Sharing Policy
      </Link>
    </article>
  );
}

function RevenueSharingPolicyDetail({
  view,
  preview,
  revenueTrustRisk
}: {
  view: RevenueSharingPolicyView;
  preview: RevenueSharingPreviewView | null;
  revenueTrustRisk: ReturnType<typeof useRevenueTrustRiskIntelligence>["data"];
}) {
  const { policy, settlementBoundary } = view;

  return (
    <section className="space-y-5 rounded border border-teal-200 bg-teal-50 p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">Revenue Sharing Policy detail</p>
          <h2 className="mt-1 text-2xl font-semibold">{policy.displayName}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-teal-950">{policy.description}</p>
        </div>
        <NeutralBadge>{policy.slug}</NeutralBadge>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <Metric label="Status" value={policy.status} />
        <Metric label="Governance" value={policy.governanceStatus} />
        <Metric label="Preview" value={String(policy.canCalculatePreview)} />
        <Metric label="Can settle" value={String(policy.canSettle)} />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <InfoPanel
          title="Scope references"
          icon={<FileSearch size={18} />}
          rows={[
            ["Scope", policy.scope],
            ["Tenant", view.tenant?.displayName ?? "none"],
            ["Channel", view.distributionChannel?.channel.displayName ?? "none"],
            ["Profile", view.distributionProfile?.profile.displayName ?? "none"],
            ["Community", view.communityDistribution?.distribution.displayName ?? "none"],
            ["Curated catalog", view.curatedCatalog?.catalog.displayName ?? "none"],
            ["Product", view.product?.title ?? "none"],
            ["Collection", view.collection?.name ?? "none"]
          ]}
        />
        <InfoPanel
          title="Execution boundary"
          icon={<ShieldCheck size={18} />}
          rows={[
            ["Can calculate preview", String(policy.canCalculatePreview)],
            ["Can trigger payout", String(policy.canTriggerPayout)],
            ["Can route treasury", String(policy.canRouteTreasury)],
            ["Can settle", String(policy.canSettle)],
            ["Allows federated assets", String(policy.allowsFederatedAssets)]
          ]}
        />
        <InfoPanel
          title="Settlement Boundary"
          icon={<Split size={18} />}
          rows={[
            ["Boundary", settlementBoundary?.boundaryLabel ?? "missing"],
            ["Status", settlementBoundary?.status ?? "missing"],
            ["Can settle", String(settlementBoundary?.canSettle ?? false)],
            ["Can trigger payout", String(settlementBoundary?.canTriggerPayout ?? false)],
            ["Can route treasury", String(settlementBoundary?.canRouteTreasury ?? false)],
            ["Can invoice", String(settlementBoundary?.canInvoice ?? false)],
            ["Can account", String(settlementBoundary?.canAccount ?? false)]
          ]}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <ReferencePanel title="Revenue Participants" items={view.participants.map((participant) => `${participant.displayName} - ${participant.participantType} - payout ${participant.canReceivePayout}`)} />
        <ReferencePanel title="Attribution Sources" items={view.attributionSources.map((source) => `${source.source.displayName} - ${source.source.trackingMode}`)} />
      </section>

      <RevenueTrustRiskIntelligencePanel
        title="Revenue Intelligence Summary"
        description="Revenue Intelligence Summary links preview, settlement boundary and trust/risk context without financial BI, accounting, tax, settlement, payout, automated monetization or commercial action."
        view={revenueTrustRisk}
      />

      {preview ? <RevenueSharingPreviewPanel view={preview} /> : null}

      <section className="rounded border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Commission Model</p>
            <h3 className="mt-1 text-lg font-semibold">Simulated commission validation</h3>
          </div>
          <NeutralBadge>no commission real</NeutralBadge>
        </div>
        <div className="mt-4 grid gap-3">
          {view.commissionModels.length ? (
            view.commissionModels.map((modelView) => <CommissionModelPanel key={modelView.model.id} view={modelView} />)
          ) : (
            <p className="rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
              No Commission Model is active for this restricted or boundary-only policy. No commission real, payout, settlement or billing is enabled.
            </p>
          )}
        </div>
      </section>

      <section className="rounded border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Revenue Split Rule</p>
            <h3 className="mt-1 text-lg font-semibold">Mock participant shares</h3>
          </div>
          <NeutralBadge>{view.shareTotal}% mock total</NeutralBadge>
        </div>
        <div className="mt-4 grid gap-3">
          {view.participantShares.length ? (
            view.participantShares.map((share) => {
              const rule = view.rules.find((entry) => entry.id === share.sourceRuleId);
              const participant = view.participants.find((entry) => entry.id === share.participantId);
              return (
                <article key={share.id} className="rounded border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h4 className="font-semibold">{participant?.displayName ?? share.participantId}</h4>
                      <p className="mt-1 text-sm text-slate-600">{rule?.ruleType ?? "source rule missing"}</p>
                    </div>
                    <NeutralBadge>{share.shareValue}% mock</NeutralBadge>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm sm:grid-cols-4">
                    <Metric label="Participant type" value={share.participantType} />
                    <Metric label="Share type" value={share.shareType} />
                    <Metric label="Cap mock" value={share.capValueMock ?? 0} />
                    <Metric label="Floor mock" value={share.floorValueMock ?? 0} />
                    <Metric label="Can settle" value={String(share.canSettle)} />
                    <Metric label="Can payout" value={String(share.canTriggerPayout)} />
                    <Metric label="Can receive payout" value={String(share.canReceivePayout)} />
                    <Metric label="Conflict policy" value={rule?.conflictPolicy ?? "review-required"} />
                  </div>
                  <p className="mt-3 rounded border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">{share.disclaimers[0]}</p>
                </article>
              );
            })
          ) : (
            <p className="rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
              No Participant Shares are configured for this restricted or boundary-only policy. No payout, settlement, billing or treasury routing is enabled.
            </p>
          )}
        </div>
      </section>

      <BoundaryNotes notes={view.boundaryNotes} />
    </section>
  );
}

function RevenueSharingPreviewPanel({ view }: { view: RevenueSharingPreviewView }) {
  const { preview, payoutPreview, settlementPreview } = view;

  return (
    <section className="space-y-4 rounded border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Revenue Sharing Preview</p>
          <h3 className="mt-1 text-lg font-semibold">Preview and Revenue Sharing Audit Trail</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Preview, Payout Preview mock and Settlement Preview mock are non-executing explanations only.
          </p>
        </div>
        <NeutralBadge>{preview.previewStatus}</NeutralBadge>
      </div>

      <div className="grid gap-3 text-sm md:grid-cols-4">
        <Metric label="Generated" value={preview.generatedAt} />
        <Metric label="Total share mock" value={`${preview.totalShareValueMock}%`} />
        <Metric label="Applied rules" value={preview.appliedRuleIds.length} />
        <Metric label="Blocked rules" value={preview.blockedRuleIds.length} />
        <Metric label="Can settle" value={String(preview.canSettle)} />
        <Metric label="Can payout" value={String(preview.canTriggerPayout)} />
        <Metric label="Can invoice" value={String(preview.canInvoice)} />
        <Metric label="Can account" value={String(preview.canAccount)} />
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        <InfoPanel
          title="Payout Preview mock"
          icon={<CircleDollarSign size={18} />}
          rows={[
            ["Status", payoutPreview?.status ?? "missing"],
            ["Label", payoutPreview?.payoutLabelMock ?? "missing"],
            ["Can trigger payout", String(payoutPreview?.canTriggerPayout ?? false)],
            ["Can receive payout", String(payoutPreview?.canReceivePayout ?? false)]
          ]}
        />
        <InfoPanel
          title="Settlement Preview mock"
          icon={<ShieldCheck size={18} />}
          rows={[
            ["Status", settlementPreview?.status ?? "missing"],
            ["Label", settlementPreview?.settlementLabelMock ?? "missing"],
            ["Can settle", String(settlementPreview?.canSettle ?? false)],
            ["Can route treasury", String(settlementPreview?.canRouteTreasury ?? false)],
            ["Can invoice", String(settlementPreview?.canInvoice ?? false)],
            ["Can account", String(settlementPreview?.canAccount ?? false)]
          ]}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <ReferencePanel title="Rule application explanation" items={view.ruleApplicationExplanations.map((entry) => `${entry.ruleName} - ${entry.status} - ${entry.suggestedShareLabel}`)} />
        <ReferencePanel title="Conflict warnings" items={view.conflictWarnings} emptyLabel="No conflict warnings" />
      </section>

      <section className="rounded border border-slate-200 bg-slate-50 p-4">
        <h4 className="font-semibold">Participant split explanation</h4>
        <div className="mt-3 grid gap-3">
          {view.participantSplitExplanations.map((entry) => (
            <article key={entry.participantShareId} className="rounded border border-slate-200 bg-white p-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{entry.participantLabel}</p>
                  <p className="mt-1 text-sm text-slate-600">{entry.sourceRuleId}</p>
                </div>
                <NeutralBadge>{entry.shareLabel}</NeutralBadge>
              </div>
              <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
                <Metric label="Can settle" value={String(entry.canSettle)} />
                <Metric label="Can payout" value={String(entry.canTriggerPayout)} />
                <Metric label="Can receive payout" value={String(entry.canReceivePayout)} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center gap-2">
          <History size={18} />
          <h4 className="font-semibold">Revenue Sharing Audit Trail</h4>
        </div>
        <div className="mt-3 grid gap-3">
          {view.auditEntries.map((entry) => (
            <article key={entry.id} className="rounded border border-slate-200 bg-white p-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{entry.eventLabel}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{entry.reason}</p>
                </div>
                <NeutralBadge>{entry.severity}</NeutralBadge>
              </div>
              <div className="mt-3 grid gap-2 text-sm sm:grid-cols-4">
                <Metric label="Event" value={entry.eventType} />
                <Metric label="Target" value={`${entry.targetType}: ${entry.targetId}`} />
                <Metric label="Rule" value={entry.ruleId ?? "none"} />
                <Metric label="Timestamp" value={entry.createdAt} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <p className="rounded border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
        Revenue Sharing Preview is not payment, payout, settlement, invoice, accounting, tax, treasury routing, payment gateway or wallet signature.
      </p>
    </section>
  );
}

function CommissionModelPanel({ view }: { view: CommissionModelView }) {
  const { model, validation } = view;

  return (
    <article className="rounded border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold">{model.displayName}</h4>
          <p className="mt-1 text-sm leading-6 text-slate-600">{model.description}</p>
        </div>
        <NeutralBadge>{model.status}</NeutralBadge>
      </div>
      <div className="mt-3 grid gap-2 text-sm sm:grid-cols-4">
        <Metric label="Scope" value={model.scope} />
        <Metric label="Share type" value={model.shareType} />
        <Metric label="Total share mock" value={`${validation.totalShareValueMock}%`} />
        <Metric label="Validation" value={validation.validationStatus} />
        <Metric label="Conflict" value={validation.conflictStatus} />
        <Metric label="Shares" value={view.participantShares.length} />
        <Metric label="Cap warnings" value={validation.capWarnings.length} />
        <Metric label="Floor warnings" value={validation.floorWarnings.length} />
      </div>
      <p className="mt-3 rounded border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
        Commission Model mock is not commission due, not a payable record and cannot trigger payout, settlement or billing.
      </p>
      {validation.conflicts.length ? (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-xs leading-5 text-amber-950">
          {validation.conflicts.map((conflict) => (
            <li key={conflict.id}>{conflict.message}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

function InfoPanel({ title, icon, rows }: { title: string; icon: ReactNode; rows: Array<[string, string]> }) {
  return (
    <section className="rounded border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>
      <dl className="mt-4 space-y-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex gap-3">
            <dt className="min-w-32 text-slate-500">{label}</dt>
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

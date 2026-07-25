import { Coins, ReceiptText, ShieldAlert } from "lucide-react";
import { NeutralBadge } from "./StatusBadge";
import type { RevenueSharingIntegrationView } from "../services/marketplaceService";

export function RevenueSharingIntegrationPanel({
  title,
  description,
  view
}: {
  title: string;
  description: string;
  view: RevenueSharingIntegrationView;
}) {
  return (
    <section className="rounded border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-teal-700">
            <Coins size={16} /> {title}
          </p>
          <h3 className="mt-1 text-lg font-semibold">Preview-only revenue sharing integration</h3>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">{description}</p>
        </div>
        <NeutralBadge>{view.integratedContext.policyId ?? "not-configured"}</NeutralBadge>
      </div>

      <div className="mt-4 grid gap-3 text-sm md:grid-cols-4">
        <Metric label="Policies" value={view.policies.length} />
        <Metric label="Commission models" value={view.commissionModels.length} />
        <Metric label="Previews" value={view.previews.length} />
        <Metric label="Audit entries" value={view.auditEntries.length} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <NamesPanel title="Revenue Sharing Policies" items={view.policies.map((entry) => `${entry.policy.displayName} (${entry.policy.status})`)} />
        <NamesPanel title="Commission Models" items={view.commissionModels.map((entry) => `${entry.model.displayName} (${entry.validation.validationStatus})`)} />
        <NamesPanel title="Participant Shares" items={view.policies.flatMap((entry) => entry.participantShares.map((share) => `${share.participantType} ${share.shareValue}${share.shareType === "flat-amount-mock" ? "" : "%"}`))} />
        <NamesPanel title="Attribution Sources" items={view.attributionSources.map((entry) => `${entry.source.displayName} (${entry.source.status})`)} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <NamesPanel title="Applied Attribution-to-Split Rules" items={view.resolution.appliedAttributionRuleIds} emptyLabel="No applied rules" />
        <NamesPanel title="Blocked Attribution-to-Split Rules" items={view.resolution.blockedAttributionRuleIds} emptyLabel="No blocked rules" />
      </div>

      <div className="mt-4 rounded border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-600">
        <p className="flex items-center gap-2 font-semibold text-slate-800">
          <ReceiptText size={14} /> Revenue Sharing Integrated Context
        </p>
        <p>policyId={view.integratedContext.policyId ?? "none"} / commissionModelId={view.integratedContext.commissionModelId ?? "none"}</p>
        <p>previewId={view.integratedContext.previewId ?? "none"} / settlementBoundaryId={view.integratedContext.settlementBoundaryId ?? "none"}</p>
        <p>
          canCalculatePreview={String(view.integratedContext.canCalculatePreview)} / canSettle={String(view.integratedContext.canSettle)} /
          canTriggerPayout={String(view.integratedContext.canTriggerPayout)} / canRouteTreasury={String(view.integratedContext.canRouteTreasury)}
        </p>
      </div>

      <BoundaryNotes notes={view.boundaryNotes} />
    </section>
  );
}

function NamesPanel({ title, items, emptyLabel = "No records" }: { title: string; items: string[]; emptyLabel?: string }) {
  return (
    <div className="rounded border border-slate-200 bg-slate-50 p-3">
      <p className="text-sm font-semibold">{title}</p>
      {items.length ? (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-5 text-slate-600">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-xs text-slate-600">{emptyLabel}</p>
      )}
    </div>
  );
}

function BoundaryNotes({ notes }: { notes: string[] }) {
  return (
    <section className="mt-4 rounded border border-amber-200 bg-amber-50 p-4 text-amber-950">
      <div className="flex items-center gap-2">
        <ShieldAlert size={18} />
        <h3 className="font-semibold">Revenue Sharing boundaries</h3>
      </div>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6">
        {Array.from(new Set(notes)).slice(0, 10).map((note) => (
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

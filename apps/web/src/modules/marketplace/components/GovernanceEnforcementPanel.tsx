import { EyeOff, ShieldAlert } from "lucide-react";
import type { GovernanceEnforcementRecord } from "../../../services/apiClient";

export function GovernanceEnforcementPanel({
  enforcement,
  compact = false
}: {
  enforcement?: GovernanceEnforcementRecord;
  compact?: boolean;
}) {
  if (!enforcement) {
    return (
      <section className="rounded border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="flex items-center gap-2 font-semibold">
          <ShieldAlert size={18} /> Governance enforcement
        </h2>
        <p className="mt-2 text-sm text-slate-600">Enforcement preview unavailable. No blocking was executed.</p>
      </section>
    );
  }

  return (
    <section className="rounded border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 font-semibold">
            <EyeOff size={18} /> Governance enforcement
          </h2>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {enforcement.enforcementMode} / no destructive action
          </p>
        </div>
        <span className="rounded border border-slate-300 bg-slate-50 px-2 py-1 text-xs font-semibold uppercase tracking-wide">
          {enforcement.severity}
        </span>
      </div>

      <dl className={`mt-4 grid gap-3 text-sm ${compact ? "" : "sm:grid-cols-2"}`}>
        <Row label="Effective visibility" value={enforcement.visibility.effectiveState} />
        <Row label="Explorer visible" value={enforcement.visibility.publicExplorerVisible ? "yes" : "hidden preview"} />
        <Row label="Purchase preview" value={enforcement.commerce.purchasePreviewAllowed ? "allowed" : "restricted preview"} />
        <Row label="Bid preview" value={enforcement.commerce.bidPreviewAllowed ? "allowed" : "restricted preview"} />
        <Row label="Review queue" value={enforcement.reviewQueue.queue} />
        <Row label="Hard blocking" value={enforcement.hardBlockingEnabled ? "enabled" : "disabled"} />
      </dl>

      {(enforcement.visibility.reasonCodes.length > 0 || enforcement.entitlementImpact.reasonCodes.length > 0) && (
        <div className="mt-4 rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <p className="font-semibold">Runtime impact preview</p>
          <p className="mt-1">
            {[...enforcement.visibility.reasonCodes, ...enforcement.entitlementImpact.reasonCodes].join(", ")}
          </p>
        </div>
      )}
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

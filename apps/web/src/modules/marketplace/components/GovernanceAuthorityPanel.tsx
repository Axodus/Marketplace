import { ShieldAlert, ShieldCheck } from "lucide-react";
import type { GovernanceAuthorityRecord } from "../../../services/apiClient";

export function GovernanceAuthorityPanel({ authority, compact = false }: { authority?: GovernanceAuthorityRecord; compact?: boolean }) {
  if (!authority) {
    return (
      <section className="rounded border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="flex items-center gap-2 font-semibold">
          <ShieldCheck size={18} /> Governance authority
        </h2>
        <p className="mt-2 text-sm text-slate-600">Runtime authority context is not hydrated for this entity yet.</p>
      </section>
    );
  }

  const flagged = authority.restrictionState !== "none" || authority.emergencyState === "active";

  return (
    <section className={`rounded border bg-white shadow-sm ${flagged ? "border-amber-300" : "border-slate-200"} ${compact ? "p-4" : "p-5"}`}>
      <h2 className="flex items-center gap-2 font-semibold">
        {flagged ? <ShieldAlert size={18} /> : <ShieldCheck size={18} />} Governance authority
      </h2>
      <dl className="mt-4 space-y-2 text-sm">
        <Row label="Constitutional" value={authority.constitutionalStanding} />
        <Row label="Governance" value={authority.governanceStatus} />
        <Row label="Federation tier" value={authority.federationTier} />
        <Row label="Approval" value={authority.operationalApproval} />
        <Row label="Restriction" value={authority.restrictionState} />
        <Row label="Emergency" value={authority.emergencyState} />
      </dl>
      {(authority.warnings.length > 0 || authority.sanctions.length > 0) && (
        <div className="mt-4 rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <p className="font-semibold">Authority flags</p>
          <p className="mt-1">{[...authority.warnings, ...authority.sanctions].join(", ")}</p>
        </div>
      )}
      {!compact && (
        <dl className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm">
          <Row label="Constitutional authority" value={authority.authority.constitutional} />
          <Row label="Federal authority" value={authority.authority.federal} />
          <Row label="Technical authority" value={authority.authority.technical} />
          <Row label="Operational authority" value={authority.authority.operational} />
        </dl>
      )}
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Read-only / no governance write execution
      </p>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-600">{label}</dt>
      <dd className="text-right font-medium text-slate-900">{value}</dd>
    </div>
  );
}

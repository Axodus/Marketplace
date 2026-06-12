import { AlertTriangle, Eye, RadioTower, ShieldAlert } from "lucide-react";
import { MetricCard } from "../components/MetricCard";
import { useGovernanceOperatorConsole } from "../hooks/useMarketplace";
import { useMarketplaceTelemetry } from "../hooks/useMarketplaceTelemetry";

export function GovernanceOperatorConsolePage() {
  const { data } = useGovernanceOperatorConsole();
  useMarketplaceTelemetry("governance-operator-console-page");

  if (!data) return null;

  const { observability } = data;
  const latestTelemetry = observability.telemetry.records.slice(0, 8);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Operator console</p>
        <h1 className="mt-2 text-3xl font-semibold">Governance observability and emergency controls</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          Emergency restriction, freeze, suspension and visibility controls are prepared as preview-only runtime. No live governance
          write, destructive freeze, entitlement revocation or settlement action is enabled.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Emergency restrictions" value={observability.emergencyRuntime.emergencyRestrictions} detail="Preview controls only" />
        <MetricCard label="Emergency freezes" value={observability.emergencyRuntime.emergencyFreezes} detail="Execution disabled" />
        <MetricCard label="Telemetry records" value={observability.telemetry.records.length} detail="Governance/operator events" />
        <MetricCard label="Live controls" value={observability.operatorConsole.liveControlsEnabled ? "On" : "Off"} detail="No destructive action" />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <ShieldAlert size={20} /> Emergency controls
          </h2>
          <div className="mt-4 space-y-3">
            {observability.emergencyRuntime.controls.length ? (
              observability.emergencyRuntime.controls.map((control) => (
                <div key={control.id} className="rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold">{control.entityId}</p>
                    <span className="rounded border border-amber-300 bg-white px-2 py-1 text-xs font-semibold uppercase tracking-wide">
                      {control.control} / {control.severity}
                    </span>
                  </div>
                  <p className="mt-2">{control.reasonCodes.join(", ") || control.trigger}</p>
                  <p className="mt-1 text-xs">Execution enabled: {control.executionEnabled ? "yes" : "no"}</p>
                </div>
              ))
            ) : (
              <p className="rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">No emergency controls prepared.</p>
            )}
          </div>
        </div>

        <div className="rounded border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Eye size={20} /> Operator visibility
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Row label="Governance" value={observability.operatorConsole.governanceVisibility} />
            <Row label="Moderation" value={observability.operatorConsole.moderationVisibility} />
            <Row label="Restrictions" value={observability.operatorConsole.restrictionVisibility} />
            <Row label="Federation" value={observability.operatorConsole.federationVisibility} />
            <Row label="Federation health" value={observability.federation.health} />
            <Row label="Tenants" value={observability.federation.tenants} />
          </dl>
        </div>
      </section>

      <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <RadioTower size={20} /> Governance telemetry
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm" aria-label="Governance emergency and moderation telemetry">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="py-2">Category</th>
                <th>Entity</th>
                <th>Tenant</th>
                <th>Severity</th>
                <th>Message</th>
                <th>Reason codes</th>
              </tr>
            </thead>
            <tbody>
              {latestTelemetry.map((record) => (
                <tr key={record.id} className="border-b border-slate-100">
                  <td className="py-3 font-medium">{record.category}</td>
                  <td>{record.entityId}</td>
                  <td>{record.tenantId}</td>
                  <td>{record.severity}</td>
                  <td>{record.message}</td>
                  <td>{record.reasonCodes.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {observability.telemetry.emergencyEvents > 0 && (
        <section className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          <p className="flex items-center gap-2 font-semibold">
            <AlertTriangle size={18} /> Emergency event telemetry present
          </p>
          <p className="mt-1">Events are preview-only and do not execute live controls.</p>
        </section>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

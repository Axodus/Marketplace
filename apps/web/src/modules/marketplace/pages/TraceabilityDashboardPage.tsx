import { Activity, FileSearch, GitBranch, ShieldCheck } from "lucide-react";
import { MetricCard } from "../components/MetricCard";
import { useOperationalTraceability } from "../hooks/useMarketplace";
import { useMarketplaceTelemetry } from "../hooks/useMarketplaceTelemetry";

export function TraceabilityDashboardPage() {
  const { data } = useOperationalTraceability();
  useMarketplaceTelemetry("traceability-dashboard-page");

  if (!data) return null;

  const categoryCounts = data.events.reduce<Record<string, number>>((acc, event) => {
    const category = event.category ?? "uncategorized";
    acc[category] = (acc[category] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Audit / Traceability</p>
        <h1 className="mt-2 text-3xl font-semibold">Operational traceability dashboard</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          Audit logs, replay-safe runtime events, reconciliation readiness and indexer integration shape. No live blockchain
          reconciliation, ownership read, treasury verification or queue publishing is enabled.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Audit records" value={data.auditLogs.length} detail="Actor/entity/action metadata" />
        <MetricCard label="Runtime events" value={data.events.length} detail="Replay-safe event store" />
        <MetricCard label="Pending ownership checks" value={data.reconciliation.ownershipVerification.pendingProductIds.length} detail="Prepared only" />
        <MetricCard label="Indexer contracts" value={data.indexer.contracts.length} detail="NFT ingestion readiness" />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <FileSearch size={20} /> Audit log
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm" aria-label="Marketplace audit log records">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-2">Action</th>
                  <th>Actor</th>
                  <th>Entity</th>
                  <th>Tenant</th>
                  <th>Governance</th>
                  <th>Correlation</th>
                </tr>
              </thead>
              <tbody>
                {data.auditLogs.slice(0, 10).map((record) => (
                  <tr key={record.id} className="border-b border-slate-100">
                    <td className="py-3 font-medium">{record.action}</td>
                    <td>{record.actor}</td>
                    <td>
                      {record.entity.type} / {record.entity.id}
                    </td>
                    <td>{record.tenant}</td>
                    <td>{record.governanceContext.standing}</td>
                    <td className="font-mono text-xs">{record.runtimeMetadata.correlationId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Activity size={20} /> Event categories
          </h2>
          <div className="mt-4 space-y-3">
            {Object.entries(categoryCounts).map(([category, count]) => (
              <div key={category}>
                <div className="flex justify-between text-sm">
                  <span>{category}</span>
                  <span>{count}</span>
                </div>
                <div className="mt-1 h-2 rounded bg-slate-100">
                  <div className="h-2 rounded bg-teal-700" style={{ width: `${Math.max(count * 12, 10)}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-2">
            {data.events.slice(0, 6).map((event) => (
              <div key={event.id} className="rounded border border-slate-200 bg-slate-50 p-3 text-sm">
                <div className="flex justify-between gap-3">
                  <p className="font-semibold">{event.type}</p>
                  <span className="text-xs uppercase tracking-wide text-slate-500">{event.category}</span>
                </div>
                <p className="mt-1 font-mono text-xs text-slate-500">{event.correlationId}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <ShieldCheck size={20} /> Reconciliation preview
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Row label="Blockchain reads" value={data.reconciliation.blockchainReads.enabled ? "enabled" : "disabled"} />
            <Row label="Ownership pending" value={String(data.reconciliation.ownershipVerification.pendingProductIds.length)} />
            <Row label="Treasury pending" value={String(data.reconciliation.treasuryVerification.pendingInvoiceIds.length)} />
            <Row label="Settlement pending" value={String(data.reconciliation.settlementVerification.pendingPurchaseIds.length)} />
            <Row label="License pending" value={String(data.reconciliation.licenseVerification.pendingLicenseIds.length)} />
          </dl>
        </div>

        <div className="rounded border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <GitBranch size={20} /> Indexer readiness
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Row label="Products" value={String(data.indexer.entitySync.products)} />
            <Row label="Licenses" value={String(data.indexer.entitySync.licenses)} />
            <Row label="Invoices" value={String(data.indexer.entitySync.invoices)} />
            <Row label="Ownership merge" value={data.indexer.runtimeSnapshot.ownershipMergeReady ? "prepared" : "deferred"} />
            <Row label="NFT ingestion" value={data.indexer.runtimeSnapshot.nftEventIngestionReady ? "prepared" : "deferred"} />
          </dl>
        </div>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-600">{label}</dt>
      <dd className="font-medium text-slate-900">{value}</dd>
    </div>
  );
}

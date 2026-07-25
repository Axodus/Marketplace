import { useParams } from "react-router-dom";
import { useEnterpriseProduct } from "../hooks/useMarketplace";
import { EnterpriseNotFound, EnterprisePageShell, ListBlock, Metric } from "./EnterpriseMarketplacePage";

export function EnterpriseTelemetryPage() {
  const { slug } = useParams();
  const query = useEnterpriseProduct(slug);
  const view = query.data;
  const telemetry = view?.telemetrySnapshot;

  if (query.isLoading) {
    return <section className="rounded border border-slate-200 bg-white p-6 shadow-sm">Loading telemetry snapshot without live analytics.</section>;
  }

  if (!view) return <EnterpriseNotFound slug={slug} />;

  return (
    <EnterprisePageShell view={view} title="Enterprise Telemetry Snapshot">
      <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-4">
          <Metric label="Provisioning" value={telemetry?.provisioningStatus ?? "missing"} />
          <Metric label="Access" value={telemetry?.accessStatus ?? "missing"} />
          <Metric label="Billing" value={telemetry?.billingStatus ?? "missing"} />
          <Metric label="License" value={telemetry?.licenseStatus ?? "missing"} />
          <Metric label="Governance" value={telemetry?.governanceStatus ?? "missing"} />
          <Metric label="Last updated" value={telemetry?.lastUpdatedAt ?? "missing"} />
          <Metric label="Live telemetry" value={String(telemetry?.usesLiveTelemetry ?? false)} />
          <Metric label="Automation" value={String(telemetry?.canTriggerAutomation ?? false)} />
        </div>
        <ListBlock title="Signals" items={telemetry?.signals ?? ["Telemetry missing."]} />
        <ListBlock title="Blocking issues" items={telemetry?.blockingIssues.length ? telemetry.blockingIssues : ["No blocking issues for this mock record."]} />
        <ListBlock title="Warnings" items={telemetry?.warnings ?? ["Telemetry missing."]} />
      </section>
    </EnterprisePageShell>
  );
}

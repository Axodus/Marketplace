import { Link } from "react-router-dom";
import { useEnterpriseMarketplaceValidation, useEnterpriseOperationsSummary, useEnterpriseProducts } from "../hooks/useMarketplace";
import { EnterpriseHero, ListBlock, Metric } from "./EnterpriseMarketplacePage";

export function EnterpriseOperationsPage() {
  const summaryQuery = useEnterpriseOperationsSummary();
  const productsQuery = useEnterpriseProducts();
  const validationQuery = useEnterpriseMarketplaceValidation();
  const summary = summaryQuery.data;
  const products = productsQuery.data ?? [];
  const validation = validationQuery.data;

  return (
    <div className="space-y-8">
      <EnterpriseHero />
      <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Enterprise Operations Dashboard</h2>
        <p className="mt-2 text-sm text-slate-700">Visibility-only operator dashboard. It grants no hidden operational authority and cannot activate subscriptions, billing, treasury routing, ACS deployment or tenant provisioning.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <Metric label="Products" value={summary?.totalProducts ?? 0} />
          <Metric label="Mock only" value={String(validation?.isMockOnly ?? false)} />
          <Metric label="Billing preview only" value={String(validation?.isBillingPreviewOnly ?? false)} />
          <Metric label="ACS bounded" value={String(validation?.isACSProvisioningBounded ?? false)} />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <SummaryCard title="Governance states" counts={summary?.governanceCounts ?? {}} />
        <SummaryCard title="Plan statuses" counts={summary?.planStatusCounts ?? {}} />
        <SummaryCard title="Provisioning statuses" counts={summary?.provisioningStatusCounts ?? {}} />
        <SummaryCard title="Billing preview statuses" counts={summary?.billingPreviewCounts ?? {}} />
      </section>

      <section className="rounded border border-amber-200 bg-amber-50 p-5">
        <h2 className="text-lg font-semibold">Review queue and blocking issues</h2>
        <ListBlock title="Blocking issues" items={summary?.blockingIssues.length ? summary.blockingIssues.map((item) => `${item.label}: ${item.issue}`) : ["No blocking issues."]} />
        <ListBlock title="Review queue" items={summary?.reviewQueue.length ? summary.reviewQueue.map((item) => `${item.label}: ${item.reason}`) : ["No review queue items."]} />
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        {products.map((view) => (
          <article key={view.product.id} className="rounded border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{view.product.governanceStatus}</p>
            <h3 className="mt-1 font-semibold">{view.product.displayName}</h3>
            <p className="mt-2 text-sm text-slate-600">{view.guardrail.statusLabel}</p>
            <Link to={`/marketplace/enterprise/${view.product.slug}`} className="mt-3 inline-flex text-sm font-semibold text-teal-800">Open detail</Link>
          </article>
        ))}
      </section>
    </div>
  );
}

function SummaryCard({ title, counts }: { title: string; counts: Record<string, number> }) {
  const entries = Object.entries(counts);
  return (
    <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {entries.length ? entries.map(([label, value]) => <Metric key={label} label={label} value={value} />) : <Metric label="none" value={0} />}
      </div>
    </section>
  );
}

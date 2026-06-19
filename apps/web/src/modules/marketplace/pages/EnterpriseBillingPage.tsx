import { useParams } from "react-router-dom";
import { useEnterprisePreviewAdapters, useEnterpriseProduct } from "../hooks/useMarketplace";
import { EnterpriseNotFound, EnterprisePageShell, ListBlock, Metric } from "./EnterpriseMarketplacePage";

export function EnterpriseBillingPage() {
  const { slug } = useParams();
  const productQuery = useEnterpriseProduct(slug);
  const previewQuery = useEnterprisePreviewAdapters(slug);
  const view = productQuery.data;
  const billing = previewQuery.data?.billing.target ?? view?.billingPreviews[0];

  if (productQuery.isLoading) {
    return <section className="rounded border border-slate-200 bg-white p-6 shadow-sm">Loading billing preview without payment execution.</section>;
  }

  if (!view) return <EnterpriseNotFound slug={slug} />;

  return (
    <EnterprisePageShell view={view} title="Enterprise Billing Preview">
      <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-4">
          <Metric label="Currency" value={billing?.currency ?? "missing"} />
          <Metric label="Recurring mock" value={billing ? `${billing.currency} ${billing.recurringAmountMock}` : "missing"} />
          <Metric label="Setup mock" value={billing ? `${billing.currency} ${billing.setupAmountMock}` : "missing"} />
          <Metric label="Settlement mode" value={billing?.settlementMode ?? "missing"} />
          <Metric label="Invoice preview" value={billing?.invoicePreviewStatus ?? "missing"} />
          <Metric label="Reconciliation" value={billing?.reconciliationStatus ?? "missing"} />
          <Metric label="Can route treasury" value={String(billing?.canRouteTreasury ?? false)} />
          <Metric label="Can settle" value={String(billing?.canSettle ?? false)} />
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-900">{billing?.treasuryDestinationPreview ?? "Treasury preview missing"}</p>
        <ListBlock title="Accounting notes" items={billing?.accountingNotes ?? ["Billing preview missing."]} />
        <ListBlock title="Settlement warnings" items={billing?.warnings ?? ["No warning available."]} />
      </section>
    </EnterprisePageShell>
  );
}

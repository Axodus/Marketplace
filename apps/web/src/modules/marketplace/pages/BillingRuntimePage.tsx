import { ReceiptText, SplitSquareHorizontal } from "lucide-react";
import { MetricCard } from "../components/MetricCard";
import { GovernanceAuthorityPanel } from "../components/GovernanceAuthorityPanel";
import { GovernanceEnforcementPanel } from "../components/GovernanceEnforcementPanel";
import { useBillingRuntime } from "../hooks/useMarketplace";
import { useMarketplaceTelemetry } from "../hooks/useMarketplaceTelemetry";

export function BillingRuntimePage() {
  const { data } = useBillingRuntime();
  useMarketplaceTelemetry("billing-runtime-page");

  if (!data) return null;

  const latestInvoice = data.invoices[0];
  const totals = data.invoices.reduce(
    (acc, invoice) => ({
      subtotal: acc.subtotal + invoice.subtotal,
      royalties: acc.royalties + invoice.royaltyPreview,
      treasury: acc.treasury + invoice.treasurySplitPreview,
      creator: acc.creator + invoice.creatorSplitPreview
    }),
    { subtotal: 0, royalties: 0, treasury: 0, creator: 0 }
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Orders / Billing</p>
        <h1 className="mt-2 text-3xl font-semibold">Invoice and treasury preview runtime</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          Persistent invoice previews, royalty accounting, treasury routing previews and reconciliation state. No payment, settlement,
          royalty distribution or treasury execution is enabled.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Invoices" value={data.invoices.length} detail="Persisted preview records" />
        <MetricCard label="Gross preview" value={`${totals.subtotal.toFixed(2)} USDC`} detail="No payment execution" />
        <MetricCard label="Royalty preview" value={`${totals.royalties.toFixed(2)} USDC`} detail="EIP-2981/custom accounting" />
        <MetricCard label="Treasury preview" value={`${totals.treasury.toFixed(2)} USDC`} detail="No treasury movement" />
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.8fr_0.8fr_1.2fr]">
        <GovernanceAuthorityPanel
          authority={latestInvoice ? data.governanceAuthority.records.find((record) => latestInvoice.productReferences.includes(record.entityId)) : undefined}
          compact
        />
        <GovernanceEnforcementPanel
          enforcement={latestInvoice ? data.governanceEnforcement.records.find((record) => latestInvoice.productReferences.includes(record.entityId)) : undefined}
          compact
        />
        <div className="rounded border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <ReceiptText size={20} /> Invoice previews
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm" aria-label="Marketplace invoice previews">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-2">Invoice</th>
                  <th>Buyer</th>
                  <th>State</th>
                  <th>Total</th>
                  <th>Royalty</th>
                  <th>Treasury</th>
                  <th>Reconciliation</th>
                </tr>
              </thead>
              <tbody>
                {data.invoices.length ? (
                  data.invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-slate-100">
                      <td className="py-3 font-medium">{invoice.id}</td>
                      <td>{invoice.buyer}</td>
                      <td>{invoice.state}</td>
                      <td>
                        {invoice.totalPreview} {invoice.currency}
                      </td>
                      <td>{invoice.royaltyPreview}</td>
                      <td>{invoice.treasurySplitPreview}</td>
                      <td>{invoice.reconciliation.state}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-4 text-slate-600">
                      No invoice previews persisted yet. Generate billing previews from purchase or invoice API flows.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded border border-slate-200 bg-white p-5 shadow-sm lg:col-span-3">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <SplitSquareHorizontal size={20} /> Treasury and split preview
          </h2>
          {latestInvoice ? (
            <dl className="mt-4 space-y-3 text-sm">
              <Row label="Subtotal" value={`${latestInvoice.subtotal} ${latestInvoice.currency}`} />
              <Row label="Creator split" value={`${latestInvoice.creatorSplitPreview} ${latestInvoice.currency}`} />
              <Row label="Royalty preview" value={`${latestInvoice.royaltyPreview} ${latestInvoice.currency}`} />
              <Row label="Platform fee" value={`${latestInvoice.platformFeePreview} ${latestInvoice.currency}`} />
              <Row label="Ecosystem fee" value={`${latestInvoice.ecosystemFeePreview} ${latestInvoice.currency}`} />
              <Row label="Tax placeholder" value={`${latestInvoice.taxPlaceholder.amount} ${latestInvoice.currency}`} />
              <Row label="Treasury execution" value={latestInvoice.treasuryExecutionEnabled ? "enabled" : "disabled"} />
              <Row label="Settlement" value={latestInvoice.settlementEnabled ? "enabled" : "disabled"} />
            </dl>
          ) : (
            <p className="mt-4 rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
              Treasury split details appear after an invoice preview exists.
            </p>
          )}
        </div>
      </section>

      <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold">Accounting telemetry</h2>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {data.telemetry.slice(0, 8).map((event) => (
            <div key={event.id} className="rounded border border-slate-200 bg-slate-50 p-3 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold">{event.type}</p>
                <span className="rounded bg-white px-2 py-1 text-xs font-semibold uppercase tracking-wide">{event.reconciliationState}</span>
              </div>
              <p className="mt-2 text-slate-600">
                {event.amount} {event.currency}
              </p>
              <p className="mt-1 font-mono text-xs text-slate-500">{event.settlementPreviewTrace}</p>
            </div>
          ))}
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

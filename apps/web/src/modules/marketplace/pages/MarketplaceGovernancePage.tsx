import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { useMarketplaceDashboard } from "../hooks/useMarketplace";
import { useMarketplaceTelemetry } from "../hooks/useMarketplaceTelemetry";
import { getSellerById } from "../services/marketplaceService";

export function MarketplaceGovernancePage() {
  const { data } = useMarketplaceDashboard();
  useMarketplaceTelemetry("marketplace-governance-page");

  if (!data) {
    return (
      <section className="rounded border border-slate-200 bg-white p-6 shadow-sm" role="status" aria-live="polite">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Governance validation</p>
        <h1 className="mt-2 text-2xl font-semibold">Loading governance runtime</h1>
      </section>
    );
  }

  const reviewProducts = data.products.filter((product) => product.governanceStatus !== "compliant");
  const workflow = data.governanceWorkflow;
  const productQueue = workflow.queues.find((queue) => queue.queue === "product");

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Governance validation</p>
        <h1 className="mt-2 text-3xl font-semibold">Product and seller standing</h1>
      </div>
      <section className="grid gap-4 md:grid-cols-3">
        <GovernanceTile icon={<CheckCircle2 />} label="Compliant products" value={data.products.length - reviewProducts.length} />
        <GovernanceTile icon={<AlertTriangle />} label="Pending review" value={workflow.moderationRuntime.pendingApproval} />
        <GovernanceTile icon={<ShieldAlert />} label="Restricted items" value={workflow.moderationRuntime.restricted} />
      </section>
      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Governance review queues</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm" aria-label="Marketplace governance review queues">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-2">Queue</th>
                  <th>Items</th>
                  <th>Pending</th>
                  <th>Escalated</th>
                  <th>Emergency</th>
                  <th>Restricted</th>
                </tr>
              </thead>
              <tbody>
                {workflow.queues.map((queue) => (
                  <tr key={queue.queue} className="border-b border-slate-100">
                    <td className="py-3 font-semibold capitalize">{queue.queue}</td>
                    <td>{queue.items.length}</td>
                    <td>{queue.metrics.pending}</td>
                    <td>{queue.metrics.escalated}</td>
                    <td>{queue.metrics.emergency}</td>
                    <td>{queue.metrics.restricted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="rounded border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Constitutional reason codes</h2>
          <div className="mt-4 space-y-3">
            {workflow.constitutionalReasonCodes.slice(0, 5).map((reason) => (
              <div key={reason.code} className="rounded border border-slate-200 bg-slate-50 p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{reason.code}</p>
                  <span className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold uppercase tracking-wide">
                    {reason.category} / {reason.severity}
                  </span>
                </div>
                <p className="mt-2 text-slate-600">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {productQueue && productQueue.items.length > 0 && (
        <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Product approval lifecycle</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {productQueue.items.map((item) => (
              <div key={item.id} className="rounded border border-slate-200 bg-slate-50 p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{item.entityId}</p>
                  <span className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold uppercase tracking-wide">
                    {workflow.approvalLifecycle.currentByEntity[item.entityId] ?? item.lifecycle}
                  </span>
                </div>
                <p className="mt-2 text-slate-600">{item.reasonCodes.join(", ")}</p>
                <p className="mt-1 text-xs text-slate-500">Tenant: {item.tenantId} / Source: {item.source}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold">ACS moderation workflows</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-5" role="list" aria-label="ACS moderation workflow previews">
          {["Product Validation", "Seller Review", "DAO Plugin Audit", "Risk Escalation", "License Conflict Review"].map((workflow) => (
            <div key={workflow} className="rounded border border-slate-200 bg-slate-50 p-3 text-sm font-medium" role="listitem">
              {workflow}
            </div>
          ))}
        </div>
      </section>
      {reviewProducts.length ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Products requiring governance review">
          {reviewProducts.map((product) => (
            <ProductCard key={product.id} product={product} seller={getSellerById(product.sellerId)} />
          ))}
        </section>
      ) : (
        <section className="rounded border border-slate-200 bg-white p-6 shadow-sm" role="status">
          <h2 className="text-xl font-semibold">No governance review queue</h2>
          <p className="mt-2 text-sm text-slate-600">All current Marketplace products are compliant in the mock runtime.</p>
        </section>
      )}
    </div>
  );
}

function GovernanceTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-slate-600">{icon}</div>
      <p className="mt-4 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}

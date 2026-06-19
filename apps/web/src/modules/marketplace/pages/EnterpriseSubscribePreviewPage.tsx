import { useState } from "react";
import { useParams } from "react-router-dom";
import { useEnterprisePreviewAdapters, useEnterpriseProduct } from "../hooks/useMarketplace";
import { EnterpriseNotFound, EnterprisePageShell, ListBlock, Metric } from "./EnterpriseMarketplacePage";

export function EnterpriseSubscribePreviewPage() {
  const { slug } = useParams();
  const [confirmed, setConfirmed] = useState(false);
  const productQuery = useEnterpriseProduct(slug);
  const previewQuery = useEnterprisePreviewAdapters(slug);
  const view = productQuery.data;
  const preview = previewQuery.data?.subscription;

  if (productQuery.isLoading) {
    return <section className="rounded border border-slate-200 bg-white p-6 shadow-sm">Loading subscribe preview without live activation.</section>;
  }

  if (!view) return <EnterpriseNotFound slug={slug} />;

  const blocked = !view.guardrail.canRunSubscribePreview;

  return (
    <EnterprisePageShell view={view} title="Subscribe Preview">
      <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-4">
          <Metric label="Selected plan" value={preview?.target?.name ?? "missing"} />
          <Metric label="Billing cadence" value={preview?.target?.billingCadence ?? "missing"} />
          <Metric label="Adapter status" value={preview?.status ?? "loading"} />
          <Metric label="Can execute" value="false" />
        </div>
        <ListBlock title="Access rules" items={view.license?.rightsGranted ?? ["License missing; review required."]} />
        <ListBlock title="Required approvals" items={view.guardrail.requiredReviews.length ? view.guardrail.requiredReviews : ["No approval required for mock preview visibility."]} />
        <ListBlock title="Treasury compatibility notes" items={preview?.warnings ?? ["Preview loading."]} />
        <button
          type="button"
          disabled={blocked}
          onClick={() => setConfirmed(true)}
          className="mt-4 rounded border border-slate-300 bg-slate-950 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
        >
          Run mock confirmation
        </button>
        <p className="mt-3 text-sm text-slate-700">
          {blocked ? "Governance guardrail blocks subscribe preview confirmation." : confirmed ? "Mock confirmation recorded locally; no subscription, billing, wallet, contract, treasury or ACS action executed." : "Mock confirmation is local and preview-only."}
        </p>
      </section>
    </EnterprisePageShell>
  );
}

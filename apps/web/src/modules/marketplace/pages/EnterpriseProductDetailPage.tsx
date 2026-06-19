import { useParams } from "react-router-dom";
import { useEnterpriseProduct } from "../hooks/useMarketplace";
import { EnterpriseNotFound, EnterprisePageShell, ListBlock, Metric } from "./EnterpriseMarketplacePage";

export function EnterpriseProductDetailPage() {
  const { slug } = useParams();
  const query = useEnterpriseProduct(slug);
  const view = query.data;

  if (query.isLoading) {
    return <section className="rounded border border-slate-200 bg-white p-6 shadow-sm">Loading enterprise detail preview without execution.</section>;
  }

  if (!view) return <EnterpriseNotFound slug={slug} />;

  return (
    <EnterprisePageShell view={view} title={view.product.displayName}>
      <section className="grid gap-4 md:grid-cols-3">
        <Metric label="Tier" value={view.product.tier} />
        <Metric label="Category" value={view.product.category} />
        <Metric label="Lifecycle" value={view.product.lifecycleStatus} />
        <Metric label="Tenant" value={view.tenant?.displayName ?? "none"} />
        <Metric label="Catalog" value={view.curatedCatalog?.displayName ?? "none"} />
        <Metric label="Distribution" value={view.distributionChannel?.displayName ?? "none"} />
        <Metric label="Billing preview count" value={view.billingPreviews.length} />
        <Metric label="Can route treasury" value={String(view.product.canRouteTreasury)} />
        <Metric label="Can deploy ACS" value={String(view.product.canDeployACS)} />
      </section>

      <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
        <ListBlock title="Operational scope" items={view.product.operationalScope} />
        <ListBlock title="Security warnings" items={view.boundaryNotes.slice(0, 8)} />
      </section>
    </EnterprisePageShell>
  );
}

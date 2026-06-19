import { useParams } from "react-router-dom";
import { useEnterprisePreviewAdapters, useEnterpriseProduct } from "../hooks/useMarketplace";
import { EnterpriseNotFound, EnterprisePageShell, ListBlock, Metric } from "./EnterpriseMarketplacePage";

export function EnterpriseLicensePage() {
  const { slug } = useParams();
  const productQuery = useEnterpriseProduct(slug);
  const previewQuery = useEnterprisePreviewAdapters(slug);
  const view = productQuery.data;
  const license = previewQuery.data?.license.target ?? view?.license;

  if (productQuery.isLoading) {
    return <section className="rounded border border-slate-200 bg-white p-6 shadow-sm">Loading license preview without issuance.</section>;
  }

  if (!view) return <EnterpriseNotFound slug={slug} />;

  return (
    <EnterprisePageShell view={view} title="Enterprise License">
      <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-4">
          <Metric label="License" value={license?.name ?? "missing"} />
          <Metric label="Status" value={license?.status ?? "missing"} />
          <Metric label="Governance" value={license?.governanceCompatibility ?? "missing"} />
          <Metric label="Can issue live license" value={String(license?.canIssueLiveLicense ?? false)} />
        </div>
        <ListBlock title="Rights granted" items={license?.rightsGranted ?? ["License missing."]} />
        <ListBlock title="Restrictions" items={license?.restrictions ?? ["License missing."]} />
        <ListBlock title="Permitted operators" items={license?.permittedOperators.length ? license.permittedOperators : ["No operators permitted."]} />
        <ListBlock title="Audit requirements" items={license?.auditRequirements ?? ["Review required."]} />
      </section>
    </EnterprisePageShell>
  );
}

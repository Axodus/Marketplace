import { useParams } from "react-router-dom";
import { useEnterprisePreviewAdapters, useEnterpriseProduct } from "../hooks/useMarketplace";
import { EnterpriseNotFound, EnterprisePageShell, ListBlock, Metric } from "./EnterpriseMarketplacePage";

export function EnterpriseProvisioningPage() {
  const { slug } = useParams();
  const productQuery = useEnterpriseProduct(slug);
  const previewQuery = useEnterprisePreviewAdapters(slug);
  const view = productQuery.data;
  const profile = previewQuery.data?.provisioning.target ?? view?.provisioningProfile;

  if (productQuery.isLoading) {
    return <section className="rounded border border-slate-200 bg-white p-6 shadow-sm">Loading provisioning preview without deployment.</section>;
  }

  if (!view) return <EnterpriseNotFound slug={slug} />;

  return (
    <EnterprisePageShell view={view} title="Enterprise Provisioning">
      <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-4">
          <Metric label="Provisioning type" value={profile?.provisioningType ?? "missing"} />
          <Metric label="Mock status" value={profile?.mockProvisioningStatus ?? "missing"} />
          <Metric label="Can deploy ACS" value={String(profile?.canDeployACS ?? false)} />
          <Metric label="Can allocate compute" value={String(profile?.canAllocateCompute ?? false)} />
        </div>
        <ListBlock title="ACS components" items={profile?.acsComponentIds.length ? profile.acsComponentIds : ["No ACS components deployable."]} />
        <ListBlock title="Orchestration components" items={profile?.orchestrationComponentIds.length ? profile.orchestrationComponentIds : ["No orchestration components deployable."]} />
        <ListBlock title="Required approvals" items={profile?.requiredApprovals ?? ["Review required."]} />
        <ListBlock title="Telemetry hooks" items={profile?.telemetryHooks ?? ["Telemetry preview missing."]} />
        <p className="mt-4 text-sm text-slate-700">{profile?.deploymentIsolation}</p>
      </section>
    </EnterprisePageShell>
  );
}

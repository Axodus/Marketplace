import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { useSovereignCommerceNetwork, useSovereignCommerceValidation } from "../hooks/useMarketplace";
import type { SovereignCommerceNodeView } from "../services/marketplaceService";

const boundaryBadges = ["mock/config-first", "read-only network", "no settlement", "no treasury routing", "no billing execution", "no cross-tenant write", "no governance execution", "no ACS provisioning", "no external onboarding"];

export function SovereignCommercePage() {
  const { nodeSlug } = useParams();
  const networkQuery = useSovereignCommerceNetwork();
  const validationQuery = useSovereignCommerceValidation();
  const network = networkQuery.data;
  const validation = validationQuery.data;
  const selectedNode = nodeSlug ? network?.nodes.find((view) => view.node.slug === nodeSlug || view.node.id === nodeSlug) : null;

  if (networkQuery.isLoading || !network) {
    return (
      <section className="rounded border border-slate-200 bg-white p-6 shadow-sm" role="status" aria-live="polite">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Sovereign Commerce Network</p>
        <h1 className="mt-2 text-2xl font-semibold">Loading sovereign commerce mock network</h1>
        <p className="mt-2 text-sm text-slate-600">No settlement, treasury routing, billing execution, governance execution, cross-tenant write or ACS provisioning is executing.</p>
      </section>
    );
  }

  if (nodeSlug && !selectedNode) {
    return (
      <section className="rounded border border-amber-200 bg-amber-50 p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">Sovereign Commerce Network</p>
        <h1 className="mt-2 text-2xl font-semibold">Sovereign node not found</h1>
        <p className="mt-2 text-sm text-amber-900">No commerce execution, settlement, billing, treasury, governance, ACS or external onboarding action was attempted.</p>
        <Link to="/marketplace/sovereign" className="mt-4 inline-flex text-sm font-semibold text-teal-800">Back to Sovereign Commerce</Link>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Sovereign Commerce Network</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">{network.summary.name}</h1>
        <p className="mt-3 max-w-4xl text-sm text-slate-700">
          A unified mock/config-first commerce layer for cross-tenant distribution, marketplace federation, DAO commercial participation,
          ecosystem intelligence, revenue visibility, attribution traceability, federated governance, operational isolation and commercial observability.
          It composes prior Marketplace phases without activating settlement, billing, treasury routing, governance execution, cross-tenant writes or ACS provisioning.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {boundaryBadges.map((badge) => <Badge key={badge}>{badge}</Badge>)}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-5">
        <Metric label="Nodes" value={network.nodes.length} />
        <Metric label="Links" value={network.links.length} />
        <Metric label="Mock only" value={String(validation?.isMockOnly ?? false)} />
        <Metric label="Isolation" value={String(validation?.hasOperationalIsolation ?? false)} />
        <Metric label="Observability" value={String(validation?.hasCommercialObservability ?? false)} />
      </section>

      {selectedNode ? <NodeDetail view={selectedNode} /> : (
        <>
          <section className="grid gap-4 lg:grid-cols-3">
            {network.nodes.map((view) => <NodeCard key={view.node.id} view={view} />)}
          </section>

          <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Network Links</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {network.links.map((link) => (
                <article key={link.id} className="rounded border border-slate-200 p-4">
                  <p className="text-sm font-semibold">{link.label}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{link.linkType} / {link.status}</p>
                  <p className="mt-2 text-sm text-slate-600">{link.disclaimers.join(" ")}</p>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function NodeCard({ view }: { view: SovereignCommerceNodeView }) {
  return (
    <article className="rounded border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">{view.node.nodeType}</p>
      <h2 className="mt-2 text-lg font-semibold">{view.node.name}</h2>
      <p className="mt-2 text-sm text-slate-600">{view.node.description}</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Metric label="Tenants" value={view.tenants.length} />
        <Metric label="Channels" value={view.distributionChannels.length} />
        <Metric label="Revenue" value={view.revenuePolicies.length} />
        <Metric label="Attribution" value={view.attributionSources.length} />
      </div>
      <p className="mt-3 text-xs text-slate-500">{view.boundaryNotes[0]}</p>
      <Link to={`/marketplace/sovereign/${view.node.slug}`} className="mt-4 inline-flex text-sm font-semibold text-teal-800">Open node</Link>
    </article>
  );
}

function NodeDetail({ view }: { view: SovereignCommerceNodeView }) {
  return (
    <div className="space-y-6">
      <section className="rounded border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Sovereign Node</p>
        <h2 className="mt-2 text-2xl font-semibold">{view.node.name}</h2>
        <p className="mt-2 text-sm text-slate-700">{view.node.description}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <Metric label="Status" value={view.node.status} />
          <Metric label="Can settle" value={String(view.node.canSettle)} />
          <Metric label="Can write cross-tenant" value={String(view.node.canWriteCrossTenant)} />
          <Metric label="Can provision ACS" value={String(view.node.canProvisionACS)} />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <ContextBlock title="Cross-Domain Context" items={[
          `Tenants: ${view.tenants.map((tenant) => tenant.displayName).join(", ") || "none"}`,
          `Curated catalogs: ${view.curatedCatalogs.map((catalog) => catalog.displayName).join(", ") || "none"}`,
          `Distribution channels: ${view.distributionChannels.map((channel) => channel.displayName).join(", ") || "none"}`,
          `Community distributions: ${view.communityDistributions.map((distribution) => distribution.distribution.displayName).join(", ") || "none"}`
        ]} />
        <ContextBlock title="Commercial Visibility" items={[
          `Revenue policies: ${view.revenuePolicies.map((policy) => policy.policy.displayName).join(", ") || "none"}`,
          `Attribution sources: ${view.attributionSources.map((source) => source.source.displayName).join(", ") || "none"}`,
          `Enterprise products: ${view.enterpriseProducts.map((product) => product.product.displayName).join(", ") || "none"}`,
          `Intelligence snapshots: ${view.intelligenceSnapshots.map((snapshot) => snapshot.snapshot.title).join(", ") || "none"}`
        ]} />
        <ContextBlock title="Boundaries" items={[
          view.governanceBoundary?.boundaryLabel ?? "Governance boundary missing",
          view.isolationBoundary?.boundaryLabel ?? "Isolation boundary missing",
          view.observabilitySnapshot?.title ?? "Observability snapshot missing",
          ...view.boundaryNotes.slice(0, 3)
        ]} />
      </section>

      <Link to="/marketplace/sovereign" className="inline-flex text-sm font-semibold text-teal-800">Back to network</Link>
    </div>
  );
}

function ContextBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm text-slate-700">
        {items.map((item) => <li key={item}>- {item}</li>)}
      </ul>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded border border-slate-200 bg-white p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return <span className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-700">{children}</span>;
}

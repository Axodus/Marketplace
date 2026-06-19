import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { useACSDistributionOverview } from "../hooks/useMarketplace";
import type { AIAgentView, ComputeAccessView, MCPPackageView, WorkflowSystemView } from "../services/marketplaceService";

const badges = ["mock ACS", "config-first ACS", "no agent execution", "no MCP deployment", "no workflow run", "no compute allocation", "no provisioning", "no secret access", "no billing"];

export function ACSDistributionPage() {
  const { acsSlug } = useParams();
  const query = useACSDistributionOverview();

  if (query.isLoading || !query.data) {
    return (
      <section className="rounded border border-slate-200 bg-white p-6 shadow-sm" role="status" aria-live="polite">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">ACS Distribution</p>
        <h1 className="mt-2 text-2xl font-semibold">Loading ACS mock context</h1>
        <p className="mt-2 text-sm text-slate-600">No agent execution, MCP deployment, workflow run, compute allocation or provisioning is executing.</p>
      </section>
    );
  }

  const selectedAgent = query.data.agents.find((entry) => entry.agent.slug === acsSlug || entry.agent.id === acsSlug);
  const selectedPackage = query.data.mcpPackages.find((entry) => entry.package.slug === acsSlug || entry.package.id === acsSlug);
  const selectedWorkflow = query.data.workflowSystems.find((entry) => entry.system.slug === acsSlug || entry.system.id === acsSlug);
  const selectedCompute = query.data.computeAccess.find((entry) => entry.computeAccess.slug === acsSlug || entry.computeAccess.id === acsSlug);

  if (acsSlug && !selectedAgent && !selectedPackage && !selectedWorkflow && !selectedCompute) {
    return (
      <section className="rounded border border-amber-200 bg-amber-50 p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">ACS Distribution</p>
        <h1 className="mt-2 text-2xl font-semibold">ACS preview not found</h1>
        <p className="mt-2 text-sm text-amber-900">No ACS runtime, MCP deployment, compute allocation, billing or provisioning was attempted.</p>
        <Link to="/marketplace/acs" className="mt-4 inline-flex text-sm font-semibold text-teal-800">
          Back to ACS Distribution
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded border border-indigo-200 bg-indigo-50 p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">ACS Distribution</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">Mock/config-first cognitive infrastructure previews</h1>
        <p className="mt-3 max-w-4xl text-sm text-slate-700">
          AI Agents, Agent Capabilities, MCP Packages, Workflow Systems, Workflow Bundles and Compute Access are static Marketplace records.
          They preserve tenant, curated catalog, distribution, revenue sharing and intelligence context without activating ACS runtime, MCP deployment,
          workflow execution, compute allocation, provisioning, secret access or billing.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {badges.map((badge) => <NeutralBadge key={badge}>{badge}</NeutralBadge>)}
        </div>
      </section>

      {selectedAgent ? <AgentDetail view={selectedAgent} /> : null}
      {selectedPackage ? <PackageDetail view={selectedPackage} /> : null}
      {selectedWorkflow ? <WorkflowDetail view={selectedWorkflow} /> : null}
      {selectedCompute ? <ComputeDetail view={selectedCompute} /> : null}

      {!acsSlug ? (
        <>
          <section className="grid gap-4 md:grid-cols-5">
            <Metric label="AI Agents" value={query.data.agents.length} />
            <Metric label="MCP Packages" value={query.data.mcpPackages.length} />
            <Metric label="Workflow Systems" value={query.data.workflowSystems.length} />
            <Metric label="Compute Access" value={query.data.computeAccess.length} />
            <Metric label="Boundaries" value={query.data.executionBoundaries.length + query.data.provisioningBoundaries.length + query.data.capabilityDataBoundaries.length} />
          </section>

          <section className="grid gap-4 lg:grid-cols-4">
            {query.data.agents.map((view) => <AgentCard key={view.agent.id} view={view} />)}
            {query.data.mcpPackages.map((view) => <PackageCard key={view.package.id} view={view} />)}
            {query.data.workflowSystems.map((view) => <WorkflowCard key={view.system.id} view={view} />)}
            {query.data.computeAccess.map((view) => <ComputeCard key={view.computeAccess.id} view={view} />)}
          </section>

          <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">ACS Capability Data Boundaries</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {query.data.capabilityDataBoundaries.map((boundary) => (
                <div key={boundary.id} className="rounded border border-slate-200 p-4">
                  <p className="text-sm font-semibold text-slate-900">{boundary.boundaryLabel}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{boundary.status}</p>
                  <p className="mt-2 text-sm text-slate-600">{boundary.disclaimers.join(" ")}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}

function AgentCard({ view }: { view: AIAgentView }) {
  return (
    <article className="rounded border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">AI Agent</p>
      <h2 className="mt-2 text-lg font-semibold">{view.agent.name}</h2>
      <p className="mt-2 text-sm text-slate-600">{view.agent.description}</p>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <Metric label="Capabilities" value={view.capabilities.length} />
        <Metric label="Can execute" value={String(view.agent.canExecute)} />
      </div>
      <BoundaryLine notes={view.boundaryNotes} />
      <Link to={`/marketplace/acs/${view.agent.slug}`} className="mt-4 inline-flex text-sm font-semibold text-teal-700">
        Open Agent Detail
      </Link>
    </article>
  );
}

function PackageCard({ view }: { view: MCPPackageView }) {
  return (
    <article className="rounded border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">MCP Package</p>
      <h2 className="mt-2 text-lg font-semibold">{view.package.name}</h2>
      <p className="mt-2 text-sm text-slate-600">{view.package.description}</p>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <Metric label="Versions" value={view.versions.length} />
        <Metric label="Can deploy" value={String(view.package.canDeploy)} />
      </div>
      <BoundaryLine notes={view.boundaryNotes} />
      <Link to={`/marketplace/acs/${view.package.slug}`} className="mt-4 inline-flex text-sm font-semibold text-teal-700">
        Open MCP Detail
      </Link>
    </article>
  );
}

function WorkflowCard({ view }: { view: WorkflowSystemView }) {
  return (
    <article className="rounded border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">Workflow System</p>
      <h2 className="mt-2 text-lg font-semibold">{view.system.name}</h2>
      <p className="mt-2 text-sm text-slate-600">{view.system.description}</p>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <Metric label="Templates" value={view.templates.length} />
        <Metric label="Can run" value={String(view.system.canRunWorkflow)} />
      </div>
      <BoundaryLine notes={view.boundaryNotes} />
      <Link to={`/marketplace/acs/${view.system.slug}`} className="mt-4 inline-flex text-sm font-semibold text-teal-700">
        Open Workflow Detail
      </Link>
    </article>
  );
}

function ComputeCard({ view }: { view: ComputeAccessView }) {
  return (
    <article className="rounded border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Compute Access</p>
      <h2 className="mt-2 text-lg font-semibold">{view.computeAccess.name}</h2>
      <p className="mt-2 text-sm text-slate-600">{view.computeAccess.description}</p>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <Metric label="Tiers" value={view.tiers.length} />
        <Metric label="Can allocate" value={String(view.computeAccess.canAllocateCompute)} />
      </div>
      <BoundaryLine notes={view.boundaryNotes} />
      <Link to={`/marketplace/acs/${view.computeAccess.slug}`} className="mt-4 inline-flex text-sm font-semibold text-teal-700">
        Open Compute Detail
      </Link>
    </article>
  );
}

function AgentDetail({ view }: { view: AIAgentView }) {
  return (
    <section className="rounded border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">AI Agent Detail</p>
      <h2 className="mt-2 text-2xl font-semibold">{view.agent.name}</h2>
      <ContextGrid items={[
        ["Tenant", view.tenant?.displayName ?? "none"],
        ["Curated catalog", view.curatedCatalog?.displayName ?? "none"],
        ["Distribution", view.distributionChannel?.displayName ?? "none"],
        ["Revenue policy", view.revenuePolicy?.policy.slug ?? "none"],
        ["Intelligence snapshot", view.intelligenceSnapshot?.snapshot.title ?? "none"],
        ["Execution boundary", view.executionBoundary?.status ?? "missing"]
      ]} />
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {view.capabilities.map((capability) => (
          <div key={capability.id} className="rounded border border-slate-200 p-4">
            <p className="font-semibold">{capability.name}</p>
            <p className="mt-1 text-sm text-slate-600">{capability.description}</p>
            <p className="mt-2 text-xs text-slate-500">{capability.disclaimers.join(" ")}</p>
          </div>
        ))}
      </div>
      <BoundaryLine notes={view.boundaryNotes} />
    </section>
  );
}

function PackageDetail({ view }: { view: MCPPackageView }) {
  return (
    <section className="rounded border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">MCP Package Detail</p>
      <h2 className="mt-2 text-2xl font-semibold">{view.package.name}</h2>
      <ContextGrid items={[
        ["Tenant", view.tenant?.displayName ?? "none"],
        ["Curated catalog", view.curatedCatalog?.displayName ?? "none"],
        ["Distribution", view.distributionChannel?.displayName ?? "none"],
        ["Provisioning boundary", view.provisioningBoundary?.status ?? "missing"],
        ["Data boundary", view.capabilityDataBoundary?.status ?? "missing"],
        ["Can deploy", String(view.package.canDeploy)]
      ]} />
      <BoundaryLine notes={view.boundaryNotes} />
    </section>
  );
}

function WorkflowDetail({ view }: { view: WorkflowSystemView }) {
  return (
    <section className="rounded border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-violet-700">Workflow Detail</p>
      <h2 className="mt-2 text-2xl font-semibold">{view.system.name}</h2>
      <ContextGrid items={[
        ["Templates", String(view.templates.length)],
        ["Bundles", String(view.bundles.length)],
        ["Execution boundary", view.executionBoundary?.status ?? "missing"],
        ["Can run workflow", String(view.system.canRunWorkflow)],
        ["Can schedule", String(view.system.canScheduleWorkflow)],
        ["Can call agents", String(view.system.canCallAgents)]
      ]} />
      <BoundaryLine notes={view.boundaryNotes} />
    </section>
  );
}

function ComputeDetail({ view }: { view: ComputeAccessView }) {
  return (
    <section className="rounded border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Compute Detail</p>
      <h2 className="mt-2 text-2xl font-semibold">{view.computeAccess.name}</h2>
      <ContextGrid items={[
        ["Tenant", view.tenant?.displayName ?? "none"],
        ["Tiers", String(view.tiers.length)],
        ["Provisioning boundary", view.provisioningBoundary?.status ?? "missing"],
        ["Can allocate compute", String(view.computeAccess.canAllocateCompute)],
        ["Can start runtime", String(view.computeAccess.canStartRuntime)],
        ["Can bill", String(view.computeAccess.canBill)]
      ]} />
      <BoundaryLine notes={view.boundaryNotes} />
    </section>
  );
}

function ContextGrid({ items }: { items: Array<[string, string]> }) {
  return (
    <dl className="mt-5 grid gap-3 md:grid-cols-3">
      {items.map(([label, value]) => (
        <div key={label} className="rounded border border-slate-200 bg-slate-50 p-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-900">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function BoundaryLine({ notes }: { notes: string[] }) {
  return <p className="mt-4 text-xs text-slate-500">{notes.join(" ")}</p>;
}

function NeutralBadge({ children }: { children: ReactNode }) {
  return <span className="rounded border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700">{children}</span>;
}

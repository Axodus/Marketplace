import { Link, useParams } from "react-router-dom";
import { Building2, Globe2, ShieldAlert, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import type { Tenant } from "../types/marketplace";
import { useTenant, useTenants } from "../hooks/useMarketplace";
import { useMarketplaceTelemetry } from "../hooks/useMarketplaceTelemetry";

export function TenantStorefrontPage() {
  const { tenantId } = useParams();
  useMarketplaceTelemetry("tenant-foundation-page", { tenantId: tenantId ?? "registry" });

  if (!tenantId) return <TenantRegistrySurface />;

  return <TenantDetailSurface tenantIdOrSlug={tenantId} />;
}

function TenantRegistrySurface() {
  const { data: tenants = [] } = useTenants();

  return (
    <div className="space-y-6">
      <section className="rounded border border-slate-200 bg-white p-6 shadow-sm">
        <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
          <Building2 size={16} /> Tenant Registry
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Marketplace-as-a-Service foundation</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          Tenants are mock/config-first Marketplace contexts inside Axodus governance. This registry does not activate billing, settlement,
          custom DNS, RBAC, isolated databases or revenue sharing.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {tenants.map((tenant) => (
          <TenantCard key={tenant.id} tenant={tenant} />
        ))}
      </section>
    </div>
  );
}

function TenantDetailSurface({ tenantIdOrSlug }: { tenantIdOrSlug: string }) {
  const { data } = useTenant(tenantIdOrSlug);

  if (!data) return null;

  const { tenant, isGlobalMarketplace, referencedProducts, referencedCollections, enabledSections, executionBoundaries } = data;

  return (
    <div className="space-y-6">
      <section className="rounded border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
              {isGlobalMarketplace ? <Globe2 size={16} /> : <Building2 size={16} />}{" "}
              {isGlobalMarketplace ? "Global Marketplace fallback" : "Tenant Marketplace"}
            </p>
            <h1 className="mt-2 text-3xl font-semibold">{tenant.identity.displayName}</h1>
            <p className="mt-3 max-w-3xl text-slate-600">{tenant.identity.description}</p>
          </div>
          <div className="rounded border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-900">
            {tenant.status} / {tenant.visibility}
          </div>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-4">
          <Stat label="Tenant type" value={tenant.tenantType} />
          <Stat label="Governance status" value={tenant.governanceStatus} />
          <Stat label="Tenant visibility" value={tenant.visibility} />
          <Stat label="Tenant slug" value={tenant.slug} />
          <Stat label="Default route" value={tenant.configuration.defaultRoute} />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <ShieldCheck size={20} /> Tenant Identity
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Row label="Display name" value={tenant.identity.displayName} />
            <Row label="Short name" value={tenant.identity.shortName} />
            <Row label="Handle" value={tenant.identity.handle} />
            <Row label="Operator" value={`${tenant.identity.operatorName} / ${tenant.identity.operatorType}`} />
            <Row label="Support" value={tenant.identity.supportLabel} />
            <Row label="Trust" value={tenant.identity.trustLabel} />
            <Row label="Governance" value={tenant.identity.governanceLabel} />
          </dl>
        </div>

        <div className="rounded border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <SlidersHorizontal size={20} /> Tenant Configuration
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Flag label="Display" enabled={tenant.configuration.canDisplay} />
            <Flag label="Trade execution" enabled={tenant.configuration.canTrade} />
            <Flag label="Settlement" enabled={tenant.configuration.canSettle} />
            <Flag label="Custom DNS routing" enabled={tenant.configuration.canRouteCustomDomain} />
            <Flag label="White label" enabled={tenant.configuration.isWhiteLabel} />
            <Flag label="Community marketplace" enabled={tenant.configuration.isCommunityMarketplace} />
            <Flag label="Tenant catalog" enabled={tenant.configuration.isTenantCatalogEnabled} />
            <Flag label="Federated catalog" enabled={tenant.configuration.isFederatedCatalogEnabled} />
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Enabled sections</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {enabledSections.map((section) => (
                <span key={section} className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700">
                  {section}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <BoundaryPanel title="Warnings" tone="amber" items={tenant.warnings} />
        <BoundaryPanel title="Disclaimers" tone="slate" items={tenant.disclaimers} />
      </section>

      <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold">Execution boundaries</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          {executionBoundaries.map((boundary) => (
            <li key={boundary}>- {boundary}</li>
          ))}
        </ul>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Referenced collections</h2>
          <div className="mt-4 space-y-3">
            {referencedCollections.length ? (
              referencedCollections.map((view) => (
                <Link
                  key={view.collection.id}
                  to={`/marketplace/collections/${view.collection.slug}`}
                  className="block rounded border border-slate-200 bg-slate-50 p-3 hover:border-teal-300 hover:bg-teal-50"
                >
                  <p className="font-semibold text-slate-900">{view.collection.name}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {view.collection.origin} / {view.metrics.source}
                  </p>
                </Link>
              ))
            ) : (
              <p className="rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">No referenced collections in this mock tenant configuration.</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold">Referenced products</h2>
          {referencedProducts.length ? (
            <div className="grid gap-4 xl:grid-cols-2">
              {referencedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="rounded border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">No referenced products in this mock tenant configuration.</p>
          )}
        </div>
      </section>

      <Link to="/marketplace/tenants" className="inline-flex rounded border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100">
        Back to Tenant Registry
      </Link>
    </div>
  );
}

function TenantCard({ tenant }: { tenant: Tenant }) {
  return (
    <Link to={`/marketplace/tenants/${tenant.slug}`} className="rounded border border-slate-200 bg-white p-5 shadow-sm hover:border-teal-300 hover:bg-teal-50">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{tenant.tenantType}</p>
      <h2 className="mt-2 text-lg font-semibold text-slate-950">{tenant.identity.displayName}</h2>
      <p className="mt-2 min-h-12 text-sm text-slate-600">{tenant.description}</p>
      <div className="mt-4 space-y-2 text-sm">
        <Row label="Status" value={tenant.status} />
        <Row label="Visibility" value={tenant.visibility} />
        <Row label="Governance status" value={tenant.governanceStatus} />
      </div>
      <p className="mt-4 rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
        mock-first / config-first / no settlement
      </p>
    </Link>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 break-words font-semibold">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 break-words font-medium text-slate-800">{value}</dd>
    </div>
  );
}

function Flag({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div className={`rounded border p-3 ${enabled ? "border-teal-200 bg-teal-50 text-teal-900" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
      <p className="text-xs font-semibold uppercase tracking-wide">{label}</p>
      <p className="mt-1 font-semibold">{enabled ? "enabled mock display" : "disabled"}</p>
    </div>
  );
}

function BoundaryPanel({ title, tone, items }: { title: string; tone: "amber" | "slate"; items: string[] }) {
  const className =
    tone === "amber"
      ? "rounded border border-amber-200 bg-amber-50 p-5 text-amber-900 shadow-sm"
      : "rounded border border-slate-200 bg-white p-5 text-slate-700 shadow-sm";

  return (
    <div className={className}>
      <h2 className="flex items-center gap-2 text-xl font-semibold">
        <ShieldAlert size={20} /> {title}
      </h2>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    </div>
  );
}

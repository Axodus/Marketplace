import { Link, useParams } from "react-router-dom";
import { Building2, ShieldAlert, ShieldCheck } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { GovernanceAuthorityPanel } from "../components/GovernanceAuthorityPanel";
import { GovernanceEnforcementPanel } from "../components/GovernanceEnforcementPanel";
import { useTenantStorefront } from "../hooks/useMarketplace";
import { useMarketplaceTelemetry } from "../hooks/useMarketplaceTelemetry";

export function TenantStorefrontPage() {
  const { tenantId } = useParams();
  const { data, error } = useTenantStorefront(tenantId);
  useMarketplaceTelemetry("tenant-storefront-page", { tenantId: tenantId ?? null });

  if (error) {
    return (
      <section className="rounded border border-red-200 bg-red-50 p-6 text-red-800" role="alert">
        <h1 className="text-xl font-semibold">Tenant storefront not found</h1>
        <p className="mt-2 text-sm">The DAO storefront registry did not return a preview for this tenant.</p>
      </section>
    );
  }

  if (!data) return null;

  const {
    storefront,
    tenant,
    products,
    sellers,
    productRegistry,
    authority,
    enforcement,
    governanceEnforcement,
    daoFederation,
    storefrontRuntime,
    tenantRuntime,
    constitutionalInheritance
  } = data;

  return (
    <div className="space-y-6">
      <section className="rounded border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
              <Building2 size={16} /> DAO storefront preview
            </p>
            <h1 className="mt-2 text-3xl font-semibold">{storefront.title}</h1>
            <p className="mt-3 max-w-3xl text-slate-600">{storefront.description}</p>
          </div>
          <div className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900">
            {storefrontRuntime?.activationState ?? "Public activation disabled"}
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-5">
          <Stat label="Products" value={storefront.metrics.products} />
          <Stat label="Active" value={storefront.metrics.activeProducts} />
          <Stat label="Restricted" value={storefront.metrics.restrictedProducts} />
          <Stat label="NFT-bound" value={storefront.metrics.nftBoundProducts} />
          <Stat label="Sellers" value={storefront.metrics.sellers} />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-5">
        <Stat label="Federation health" value={daoFederation.federationMetrics.federationHealth} />
        <Stat label="Activation" value={storefrontRuntime?.activationState ?? "preview-unavailable"} />
        <Stat label="Operational" value={storefrontRuntime?.operationalStatus ?? "preview-unavailable"} />
        <Stat label="Governance activity" value={daoFederation.federationMetrics.governanceActivity} />
        <Stat label="Settlement" value={daoFederation.settlementEnabled ? "enabled" : "disabled"} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.75fr_0.8fr_1.2fr]">
        <GovernanceAuthorityPanel authority={authority} compact />
        <GovernanceEnforcementPanel enforcement={enforcement} compact />
        <div className="rounded border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <ShieldCheck size={20} /> Governance read model
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Row label="Federation tier" value={storefront.governance.federationTier} />
            <Row label="Standing" value={storefront.governance.standing} />
            <Row label="Constitutional standing" value={storefront.governance.constitutionalStanding} />
            <Row label="Authority" value={tenant?.constitutionalMetadata.authority ?? "Governance Review"} />
            <Row label="DAO entity" value={tenant?.daoEntityId ?? storefront.ownerId} />
          </dl>
          {(storefront.governance.warnings.length > 0 || storefront.governance.restrictions.length > 0) && (
            <div className="mt-4 rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              <p className="flex items-center gap-2 font-semibold">
                <ShieldAlert size={16} /> Governance visibility
              </p>
              <p className="mt-1">{[...storefront.governance.warnings, ...storefront.governance.restrictions].join(", ")}</p>
            </div>
          )}
        </div>

        <div className="rounded border border-slate-200 bg-white p-5 shadow-sm lg:col-span-3">
          <h2 className="text-xl font-semibold">Ownership hierarchy</h2>
          <div className="mt-4 grid gap-3 lg:grid-cols-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Registered sellers</p>
              <ul className="mt-2 space-y-2 text-sm">
                {sellers.map((seller) => (
                  <li key={seller.id}>
                    <Link to={`/marketplace/sellers/${seller.id}`} className="font-medium text-teal-700">
                      {seller.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Product registry segments</p>
              <ul className="mt-2 space-y-2 text-sm text-slate-600">
                {productRegistry.map((record) => (
                  <li key={record.canonicalEntityId}>
                    {record.lifecycleState} / {record.licenseModel} / {record.nftMetadata.tokenStandard}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tenant isolation</p>
              <ul className="mt-2 space-y-2 text-sm text-slate-600">
                <li>Products: {tenantRuntime?.boundary.productIds.length ?? 0}</li>
                <li>Invoices: {tenantRuntime?.boundary.invoiceIds.length ?? 0}</li>
                <li>Licenses: {tenantRuntime?.boundary.licenseIds.length ?? 0}</li>
                <li>Cross-tenant settlement: {tenantRuntime?.scopedRuntime.crossTenantSettlementEnabled ? "enabled" : "disabled"}</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Constitutional inheritance</p>
              <ul className="mt-2 space-y-2 text-sm text-slate-600">
                <li>Tier: {constitutionalInheritance?.federationTier ?? "unavailable"}</li>
                <li>Parent: {constitutionalInheritance?.parentTenantId ?? "root"}</li>
                <li>Standing: {constitutionalInheritance?.inheritedGovernanceStanding ?? "unavailable"}</li>
                <li>Mode: {constitutionalInheritance?.inheritedFederationMetadata.inheritanceMode ?? "preview-only"}</li>
              </ul>
            </div>
          </div>
          {(storefrontRuntime?.governanceVisibility.inheritedRestrictions.length ?? 0) > 0 && (
            <div className="mt-4 rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              <p className="font-semibold">Inherited restrictions</p>
              <p className="mt-1">{storefrontRuntime?.governanceVisibility.inheritedRestrictions.join(", ")}</p>
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            seller={sellers.find((seller) => seller.id === product.sellerId)}
            enforcement={governanceEnforcement.records.find((record) => record.entityId === product.id)}
          />
        ))}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 font-medium text-slate-800">{value}</dd>
    </div>
  );
}

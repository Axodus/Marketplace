import { Link, useParams } from "react-router-dom";
import { BookMarked, Building2, Globe2, ShieldAlert, ShieldCheck, SlidersHorizontal } from "lucide-react";
import type { CSSProperties } from "react";
import { ProductCard } from "../components/ProductCard";
import type { Tenant, TenantBranding, TenantCatalog, TenantCatalogResolution, TenantDomain, TenantDomainAlias } from "../types/marketplace";
import type { TenantCuratedCatalogView } from "../services/marketplaceService";
import { useTenant, useTenants } from "../hooks/useMarketplace";
import { useMarketplaceTelemetry } from "../hooks/useMarketplaceTelemetry";

export function TenantStorefrontPage() {
  const { tenantId, tenantSlug } = useParams();
  const tenantRouteInput = tenantSlug ? `/marketplace/t/${tenantSlug}` : tenantId;
  useMarketplaceTelemetry("tenant-foundation-page", { tenantId: tenantRouteInput ?? "registry" });

  if (!tenantRouteInput) return <TenantRegistrySurface />;

  return <TenantDetailSurface tenantIdOrSlug={tenantRouteInput} />;
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

  const {
    tenant,
    routingContext,
    catalog,
    catalogResolution,
    curatedCatalogResolution,
    tenantCuratedCatalogs,
    isGlobalMarketplace,
    branding,
    theme,
    usesGlobalBrandingFallback,
    referencedProducts,
    referencedCollections,
    enabledSections,
    executionBoundaries
  } = data;

  return (
    <div className="space-y-6">
      <section className="rounded border border-slate-200 bg-white p-6 shadow-sm" style={tenantBrandingStyle(branding)}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex max-w-3xl gap-4">
            <TenantLogo branding={branding} />
            <div>
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
              {isGlobalMarketplace ? <Globe2 size={16} /> : <Building2 size={16} />}{" "}
              {isGlobalMarketplace ? "Global Marketplace fallback" : branding.visualIdentity.badgeLabel}
            </p>
            <h1 className="mt-2 text-3xl font-semibold">{branding.visualIdentity.headline}</h1>
            <p className="mt-3 text-slate-600">{branding.visualIdentity.subheadline}</p>
            <p className="mt-2 text-sm font-semibold text-slate-700">{branding.tagline}</p>
            </div>
          </div>
          <div className="rounded border px-3 py-2 text-sm font-semibold" style={tenantBadgeStyle(branding)}>
            {branding.brandStatus} / {usesGlobalBrandingFallback ? "global branding fallback" : "tenant colors"}
          </div>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-5">
          <Stat label="Tenant type" value={tenant.tenantType} />
          <Stat label="Governance status" value={tenant.governanceStatus} />
          <Stat label="Tenant visibility" value={tenant.visibility} />
          <Stat label="Tenant slug" value={tenant.slug} />
          <Stat label="Theme mode" value={theme.themeMode} />
          <Stat label="Routing mode" value={routingContext.resolution.routingMode} />
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
            <Building2 size={20} /> Tenant Branding
          </h2>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <Row label="Tenant display name" value={branding.displayName} />
            <Row label="Short name" value={branding.shortName} />
            <Row label="Theme status" value={branding.brandStatus} />
            <Row label="Theme mode" value={branding.themeMode} />
            <Row label="Primary color" value={branding.primaryColor} />
            <Row label="Secondary color" value={branding.secondaryColor} />
            <Row label="Accent color" value={branding.accentColor} />
            <Row label="Visual style" value={branding.visualStyle} />
          </dl>
          <div className="mt-4 flex gap-2" aria-label="Tenant colors">
            <Swatch label="primary color" color={branding.primaryColor} />
            <Swatch label="secondary color" color={branding.secondaryColor} />
            <Swatch label="accent color" color={branding.accentColor} />
          </div>
          <p className="mt-4 rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
            Marketplace Branding is mock/config-first. Theme tokens are local display hints and do not activate white-label production,
            custom DNS, billing, settlement, RBAC or tenant isolation.
          </p>
        </div>
      </section>

      <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
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
      </section>

      <TenantDomainsPanel tenant={tenant} activeDomain={routingContext.domain} />

      <TenantCatalogPanel catalog={catalog} resolution={catalogResolution} />

      <TenantCuratedCatalogPanel catalogs={tenantCuratedCatalogs} included={curatedCatalogResolution.includedCatalogIds.length} excluded={curatedCatalogResolution.excludedCatalogIds.length} />

      <section className="grid gap-4 lg:grid-cols-2">
        <BoundaryPanel title="Warnings" tone="amber" items={[...tenant.warnings, ...branding.warnings]} />
        <BoundaryPanel title="Disclaimers" tone="slate" items={[...tenant.disclaimers, ...branding.disclaimers]} />
      </section>

      <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold">Execution boundaries</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          {[...executionBoundaries, ...routingContext.disclaimers].map((boundary) => (
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
  const branding = tenant.branding;

  return (
    <Link
      to={`/marketplace/tenants/${tenant.slug}`}
      className="rounded border border-slate-200 bg-white p-5 shadow-sm hover:border-teal-300 hover:bg-teal-50"
      style={branding ? tenantBrandingStyle(branding) : undefined}
    >
      <div className="flex items-start gap-3">
        {branding ? <TenantLogo branding={branding} compact /> : null}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{tenant.tenantType}</p>
          <h2 className="mt-2 text-lg font-semibold text-slate-950">{branding?.displayName ?? tenant.identity.displayName}</h2>
        </div>
      </div>
      <p className="mt-2 min-h-12 text-sm text-slate-600">{tenant.description}</p>
      <div className="mt-4 space-y-2 text-sm">
        <Row label="Status" value={tenant.status} />
        <Row label="Visibility" value={tenant.visibility} />
        <Row label="Governance status" value={tenant.governanceStatus} />
        <Row label="Branding" value={branding?.brandStatus ?? "global branding fallback"} />
      </div>
      <p className="mt-4 rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
        mock routing / read-only routing / no DNS real
      </p>
    </Link>
  );
}

function TenantDomainsPanel({ tenant, activeDomain }: { tenant: Tenant; activeDomain: TenantDomain | null }) {
  const domains = tenant.domains ?? [];
  const aliases = tenant.domainAliases ?? [];

  return (
    <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Tenant Domains</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Tenant Domains are simulated domain and tenant alias records for mock routing only. Domain verification mock never means DNS real,
            TLS certificate, proxy, edge routing, backend routing or production tenant routing.
          </p>
        </div>
        <Link to={`/marketplace/t/${tenant.slug}`} className="rounded border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100">
          Open mock tenant route
        </Link>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.75fr]">
        <div className="space-y-3">
          {domains.map((domain) => (
            <DomainCard key={domain.id} domain={domain} active={activeDomain?.id === domain.id} />
          ))}
        </div>
        <div className="rounded border border-slate-200 bg-slate-50 p-4">
          <h3 className="font-semibold">Tenant aliases</h3>
          <div className="mt-3 space-y-3">
            {aliases.length ? (
              aliases.map((alias) => <AliasRow key={alias.id} alias={alias} />)
            ) : (
              <p className="text-sm text-slate-600">No tenant alias records configured.</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        <p className="font-semibold">Domain boundary</p>
        <p className="mt-1">
          custom domain simulated and subdomain simulated records are read-only routing descriptors. No DNS real, no custom DNS, no TLS
          certificate, no proxy routing, no edge routing, no backend routing and no separate tenant deploy is active.
        </p>
      </div>
    </section>
  );
}

function TenantCatalogPanel({ catalog, resolution }: { catalog: TenantCatalog; resolution: TenantCatalogResolution }) {
  return (
    <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Tenant Catalog</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Tenant Isolation is mock/config-first isolation. This catalog is derived by Tenant Catalog Rule and Tenant Exposure Rule records,
            without duplicating product truth or creating financial isolation, settlement isolation, RBAC enforcement or isolated database.
          </p>
        </div>
        <span className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
          {catalog.status} / {catalog.scope}
        </span>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <Stat label="tenant visible products" value={resolution.includedProductIds.length} />
        <Stat label="tenant visible collections" value={resolution.includedCollectionIds.length + resolution.includedExternalCollectionIds.length} />
        <Stat label="applied rules" value={resolution.appliedRules.length} />
        <Stat label="blocked rules" value={resolution.blockedRules.length} />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded border border-slate-200 bg-slate-50 p-4">
          <h3 className="font-semibold">Catalog resolution</h3>
          <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
            <Row label="isolated configuration" value={catalog.name} />
            <Row label="isolated catalog" value={catalog.scope} />
            <Row label="global catalog inheritance" value={catalog.inheritsGlobalCatalog ? "enabled mock" : "disabled"} />
            <Row label="federated catalog rule" value={catalog.allowsFederatedAssets ? "allowed mock" : "blocked"} />
            <Row label="external collections" value={catalog.allowsExternalCollections ? "allowed mock" : "blocked"} />
            <Row label="native products" value={catalog.allowsNativeProducts ? "allowed mock" : "blocked"} />
          </dl>
        </div>

        <div className="rounded border border-slate-200 bg-slate-50 p-4">
          <h3 className="font-semibold">Featured catalog</h3>
          <p className="mt-2 text-sm text-slate-600">Featured products: {resolution.featuredProductIds.join(", ") || "none"}</p>
          <p className="mt-2 text-sm text-slate-600">Featured collections: {resolution.featuredCollectionIds.join(", ") || "none"}</p>
          <p className="mt-3 rounded border border-slate-200 bg-white p-3 text-xs font-semibold text-slate-600">
            no financial isolation / no settlement isolation / no RBAC enforcement / no isolated database
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <RuleList title="Applied rules" rules={resolution.appliedRules} />
        <RuleList title="Blocked or restrictive rules" rules={resolution.blockedRules} />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <CatalogItems title="Product catalog items" items={resolution.productItems} />
        <CatalogItems title="Collection catalog items" items={resolution.collectionItems} />
      </div>

      <div className="mt-4 rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        <p className="font-semibold">Isolation boundary</p>
        <p className="mt-1">
          mock isolation and config-first isolation only. No tenant settlement enabled, no tenant billing enabled, no tenant treasury routing
          enabled, no tenant revenue sharing enabled, no RBAC enabled, no isolated database enabled, no production data isolation enabled and
          no real tenant permissions enabled.
        </p>
      </div>
    </section>
  );
}

function TenantCuratedCatalogPanel({
  catalogs,
  included,
  excluded
}: {
  catalogs: TenantCuratedCatalogView[];
  included: number;
  excluded: number;
}) {
  return (
    <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <BookMarked size={20} /> Tenant Curated Catalogs
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Tenant Curated Catalog resolution layers Curated Catalogs over Tenant Catalog isolation. It can inherit global curated catalogs,
            feature tenant curated catalogs, block curated catalogs and filter items through tenant catalog isolation.
          </p>
        </div>
        <span className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
          {included} included / {excluded} excluded
        </span>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {catalogs.length ? (
          catalogs.map((view) => (
            <article key={view.catalog.catalog.id} className="rounded border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {view.isTenantOwned ? "Tenant curated catalog" : view.isInherited ? "inherits global curated catalogs" : "tenant curated catalog resolution"}
                  </p>
                  <Link to={`/marketplace/curated/${view.catalog.catalog.slug}`} className="mt-1 block text-lg font-semibold text-slate-950 hover:text-teal-700">
                    {view.catalog.catalog.displayName}
                  </Link>
                  <p className="mt-2 text-sm text-slate-600">{view.inclusionReason}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {view.isFeatured ? <span className="rounded border border-teal-200 bg-teal-50 px-2 py-1 text-xs font-semibold text-teal-800">featured curated catalogs</span> : null}
                  {view.catalog.catalog.allowsFederatedAssets ? <span className="rounded border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800">federated boundary</span> : null}
                </div>
              </div>
              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                <Stat label="visible items" value={view.visibleItems.length} />
                <Stat label="excluded items" value={view.excludedItems.length} />
                <Stat label="applied rules" value={view.appliedRules.length} />
              </div>
              <div className="mt-4 grid gap-3">
                {view.visibleItems.map((item) => (
                  <div key={item.itemId} className="rounded border border-slate-200 bg-white p-3 text-sm">
                    <p className="font-semibold">{item.productId ?? item.collectionId ?? item.externalCollectionId ?? item.itemId}</p>
                    <p className="mt-1 text-slate-600">{item.inclusionReason}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      tenant catalog isolation / {item.isFederated ? "federated" : "native"} / canDisplay={String(item.canDisplay)}
                    </p>
                  </div>
                ))}
                {view.excludedItems.length ? (
                  <div className="rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                    <p className="font-semibold">Excluded by tenant curated catalog resolution</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
                      {view.excludedItems.map((item) => (
                        <li key={item.itemId}>
                          {item.productId ?? item.collectionId ?? item.externalCollectionId ?? item.itemId}: {item.exclusionReason}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
              <p className="mt-4 rounded border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
                {view.boundaryNotes[view.boundaryNotes.length - 1]}
              </p>
            </article>
          ))
        ) : (
          <p className="rounded border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            No Tenant Curated Catalogs are visible for this tenant. The tenant may be restricted, may block curated catalogs or may have no
            curated catalog config.
          </p>
        )}
      </div>

      <div className="mt-4 rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        <p className="font-semibold">Tenant curated boundary</p>
        <p className="mt-1">
          mock curation and config-first curation only. no revenue sharing, no settlement, no billing, no marketplace intelligence, no
          distribution network, no ranking real and no recommendation engine are active.
        </p>
      </div>
    </section>
  );
}

function RuleList({ title, rules }: { title: string; rules: TenantCatalog["rules"] }) {
  return (
    <div className="rounded border border-slate-200 bg-white p-4">
      <h3 className="font-semibold">{title}</h3>
      <div className="mt-3 space-y-3">
        {rules.length ? (
          rules.map((rule) => (
            <div key={rule.id} className="rounded border border-slate-200 bg-slate-50 p-3 text-sm">
              <p className="font-semibold">{rule.ruleType}</p>
              <p className="mt-1 text-slate-600">
                {rule.effect} {rule.targetType} {rule.targetId}
              </p>
              <p className="mt-1 text-xs text-slate-500">{rule.source} / {rule.reason}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-600">No rules in this group.</p>
        )}
      </div>
    </div>
  );
}

function CatalogItems({ title, items }: { title: string; items: TenantCatalogResolution["productItems"] }) {
  return (
    <div className="rounded border border-slate-200 bg-white p-4">
      <h3 className="font-semibold">{title}</h3>
      <div className="mt-3 space-y-3">
        {items.length ? (
          items.map((item) => (
            <div key={item.productId ?? item.collectionId} className="rounded border border-slate-200 bg-slate-50 p-3 text-sm">
              <p className="font-semibold">{item.productId ?? item.collectionId}</p>
              <p className="mt-1 text-slate-600">{item.inclusionReason}</p>
              <p className="mt-1 text-xs text-slate-500">
                {item.source} / {item.isExternal ? "external" : "native"} / canSettle={String(item.canSettle)}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-600">No visible items for this tenant catalog.</p>
        )}
      </div>
    </div>
  );
}

function DomainCard({ domain, active }: { domain: TenantDomain; active: boolean }) {
  return (
    <div className={`rounded border p-4 ${active ? "border-teal-300 bg-teal-50" : "border-slate-200 bg-white"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{domain.domainType}</p>
          <h3 className="mt-1 font-semibold text-slate-950">{domain.displayLabel}</h3>
          <p className="mt-1 text-sm text-slate-600">{domain.hostname ?? domain.slug ?? domain.alias ?? "global fallback"}</p>
        </div>
        <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700">
          {domain.status} / {domain.verificationStatus}
        </span>
      </div>
      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
        <Row label="Routing mode" value={domain.routingMode} />
        <Row label="Primary" value={domain.isPrimary ? "yes" : "no"} />
        <Row label="Can route" value={domain.canRoute ? "mock route only" : "disabled"} />
      </dl>
      <p className="mt-3 text-xs text-slate-500">{domain.disclaimers.join(" ")}</p>
    </div>
  );
}

function AliasRow({ alias }: { alias: TenantDomainAlias }) {
  return (
    <div className="rounded border border-slate-200 bg-white p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-semibold">{alias.alias}</p>
        <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700">{alias.status}</span>
      </div>
      <p className="mt-1 text-sm text-slate-600">
        {alias.aliasType} to {alias.targetTenantSlug}
      </p>
      <p className="mt-2 text-xs text-slate-500">{alias.disclaimers.join(" ")}</p>
    </div>
  );
}

function TenantLogo({ branding, compact = false }: { branding: TenantBranding; compact?: boolean }) {
  const initials = branding.shortName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
  const size = compact ? "h-10 w-10 text-sm" : "h-16 w-16 text-lg";

  if (branding.logoUrl) {
    return <img src={branding.logoUrl} alt={branding.logoAlt} className={`${size} rounded border border-slate-200 object-cover`} />;
  }

  return (
    <span
      aria-label={branding.logoAlt}
      className={`${size} flex shrink-0 items-center justify-center rounded border font-semibold text-white`}
      style={{ backgroundColor: branding.primaryColor, borderColor: branding.secondaryColor }}
    >
      {initials}
    </span>
  );
}

function Swatch({ label, color }: { label: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700">
      <span className="h-4 w-4 rounded border border-slate-300" style={{ backgroundColor: color }} />
      {label}
    </span>
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

function tenantBrandingStyle(branding: TenantBranding): CSSProperties {
  return {
    borderColor: branding.secondaryColor,
    background: `linear-gradient(180deg, ${branding.backgroundHint} 0%, ${branding.surfaceHint} 42%)`
  };
}

function tenantBadgeStyle(branding: TenantBranding): CSSProperties {
  return {
    borderColor: branding.accentColor,
    backgroundColor: branding.backgroundHint,
    color: branding.primaryColor
  };
}

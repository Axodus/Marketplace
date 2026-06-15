import { Link, useParams } from "react-router-dom";
import type { ReactNode } from "react";
import { Globe2, Layers3, ShieldAlert, UsersRound } from "lucide-react";
import { NeutralBadge } from "../components/StatusBadge";
import { useCommunityDistributionContext, useCommunityMarketplaceDistribution, useCommunityMarketplaceDistributions } from "../hooks/useMarketplace";
import { useMarketplaceTelemetry } from "../hooks/useMarketplaceTelemetry";
import type { CommunityDistributionItemView, CommunityDistributionView } from "../services/marketplaceService";

export function CommunityDistributionsPage() {
  const { communitySlug } = useParams();
  const distributionsQuery = useCommunityMarketplaceDistributions();
  const detailQuery = useCommunityMarketplaceDistribution(communitySlug);
  const contextQuery = useCommunityDistributionContext(communitySlug);
  const distributions = distributionsQuery.data ?? [];
  const selected = communitySlug ? detailQuery.data : contextQuery.data?.distribution;

  useMarketplaceTelemetry("community-distributions-page", {
    communitySlug: communitySlug ?? null,
    distributionCount: distributions.length
  });

  if (distributionsQuery.isLoading) {
    return (
      <section className="rounded border border-slate-200 bg-white p-6 shadow-sm" role="status" aria-live="polite">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Community Marketplace Distribution</p>
        <h1 className="mt-2 text-2xl font-semibold">Loading mock community distribution</h1>
        <p className="mt-2 text-sm text-slate-600">No governance delegation, payout, billing, settlement or tracking real is executing.</p>
      </section>
    );
  }

  if (communitySlug && detailQuery.error) {
    return (
      <section className="rounded border border-amber-200 bg-amber-50 p-6 text-amber-950 shadow-sm" role="status">
        <h1 className="text-xl font-semibold">Community Marketplace Distribution not found</h1>
        <p className="mt-2 text-sm">
          Community Distribution Context resolution uses mock/config-first records only. No governance delegation real, commission, payout,
          settlement, billing, tracking real, revenue sharing or Marketplace Intelligence was attempted.
        </p>
        <Link to="/marketplace/distribution/communities" className="mt-4 inline-flex text-sm font-semibold text-teal-800">
          Back to Community Distributions
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Community Marketplace Distribution</p>
        <h1 className="mt-2 text-3xl font-semibold">Mock/config-first community distribution</h1>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600">
          Community Marketplace Distribution lets a community expose tenants, curated catalogs, featured catalogs, segments, products
          and collections through a community channel with attribution context and commercial origin labels. It is distinct from Tenant
          Marketplace, Community Marketplace Profile, Distribution Channel, Curated Catalog, Catalog Segment, Seller Profile and Federation Provider.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <NeutralBadge>mock community distribution</NeutralBadge>
          <NeutralBadge>config-first community distribution</NeutralBadge>
          <NeutralBadge>no governance delegation</NeutralBadge>
          <NeutralBadge>no revenue sharing</NeutralBadge>
          <NeutralBadge>no commission</NeutralBadge>
          <NeutralBadge>no payout</NeutralBadge>
          <NeutralBadge>no settlement</NeutralBadge>
          <NeutralBadge>no billing</NeutralBadge>
          <NeutralBadge>no tracking real</NeutralBadge>
          <NeutralBadge>no marketplace intelligence</NeutralBadge>
        </div>
      </section>

      {selected ? <CommunityDistributionDetail view={selected} /> : null}

      <section className="grid gap-4 lg:grid-cols-2">
        {distributions.map((view) => (
          <CommunityDistributionCard key={view.distribution.id} view={view} selected={view.distribution.id === selected?.distribution.id} />
        ))}
      </section>
    </div>
  );
}

function CommunityDistributionCard({ view, selected }: { view: CommunityDistributionView; selected?: boolean }) {
  const { distribution } = view;
  return (
    <article className={`rounded border bg-white p-5 shadow-sm ${selected ? "border-teal-400" : "border-slate-200"}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UsersRound size={20} />
            <h2 className="text-xl font-semibold">{distribution.displayName}</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{distribution.description}</p>
        </div>
        <NeutralBadge>{distribution.communityType}</NeutralBadge>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <NeutralBadge>{distribution.status}</NeutralBadge>
        <NeutralBadge>{distribution.visibility}</NeutralBadge>
        <NeutralBadge>{distribution.governanceStatus}</NeutralBadge>
      </div>
      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <Metric label="Tenants" value={view.tenants.length} />
        <Metric label="Curated catalogs" value={view.curatedCatalogs.length} />
        <Metric label="Visible items" value={view.visibleItems.length} />
      </div>
      <p className="mt-4 rounded border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
        {distribution.disclaimers[0]}
      </p>
      <Link to={`/marketplace/distribution/communities/${distribution.slug}`} className="mt-4 inline-flex text-sm font-semibold text-teal-700">
        Open Community Distribution
      </Link>
    </article>
  );
}

function CommunityDistributionDetail({ view }: { view: CommunityDistributionView }) {
  const { distribution, context } = view;
  return (
    <section className="space-y-5 rounded border border-teal-200 bg-teal-50 p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">Community Distribution detail</p>
          <h2 className="mt-1 text-2xl font-semibold">{distribution.displayName}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-teal-950">{distribution.description}</p>
        </div>
        <NeutralBadge>{distribution.slug}</NeutralBadge>
      </div>

      <div className="grid gap-3 text-sm md:grid-cols-4">
        <Metric label="Profile" value={view.profile?.profile.displayName ?? "none"} />
        <Metric label="Channel" value={view.channel?.channel.displayName ?? "none"} />
        <Metric label="Attribution" value={view.attributionSource?.source.displayName ?? "none"} />
        <Metric label="Commercial origin" value={context.commercialOriginLabel} />
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        <ReferencePanel title="Tenants exposed" items={view.tenants.map((tenant) => tenant.displayName)} />
        <ReferencePanel title="Curated catalogs exposed" items={view.curatedCatalogs.map((catalog) => catalog.catalog.displayName)} />
        <ReferencePanel title="Featured catalogs" items={view.featuredCatalogs.map((catalog) => catalog.featured.featuredReason)} />
        <ReferencePanel title="Catalog segments" items={view.segments.map((segment) => segment.displayName)} />
        <ReferencePanel title="Products" items={view.products.map((product) => product.title)} />
        <ReferencePanel title="Collections" items={view.collections.map((collection) => collection.name)} />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <InfoPanel title="Community Distribution Context" icon={<Globe2 size={18} />} rows={[
          ["Simulated", String(context.isSimulated)],
          ["Can display", String(context.canDisplay)],
          ["Can track", String(context.canTrack)],
          ["Can attribute revenue", String(context.canAttributeRevenue)],
          ["Can trigger payout", String(context.canTriggerPayout)],
          ["Can settle", String(context.canSettle)]
        ]} />
        <InfoPanel title="Attribution Source mock" icon={<Layers3 size={18} />} rows={[
          ["Source", view.attributionSource?.source.displayName ?? "none"],
          ["Tracking mode", view.attributionSource?.source.trackingMode ?? "none"],
          ["Distribution source", view.attributionSource?.source.distributionSource.sourceLabel ?? "none"],
          ["Commercial origin", view.attributionSource?.source.commercialOrigin.originLabel ?? "none"]
        ]} />
        <InfoPanel title="Execution Boundary" icon={<ShieldAlert size={18} />} rows={[
          ["No governance delegation", "true"],
          ["No revenue sharing", "true"],
          ["No payout", "true"],
          ["No marketplace intelligence", "true"]
        ]} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <ItemsPanel title="Visible Community Distribution Items" items={view.visibleItems} />
        <ItemsPanel title="Excluded Community Distribution Items" items={view.excludedItems} emptyLabel="No excluded items" />
      </section>

      <section className="rounded border border-slate-200 bg-white p-4">
        <h3 className="font-semibold">Community Distribution Rule</h3>
        <div className="mt-3 grid gap-3">
          {distribution.rules.map((rule) => (
            <article key={rule.id} className="rounded border border-slate-200 bg-slate-50 p-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h4 className="font-semibold">{rule.ruleType}</h4>
                  <p className="mt-1 text-sm text-slate-600">{rule.reason}</p>
                </div>
                <NeutralBadge>{rule.effect}</NeutralBadge>
              </div>
              <p className="mt-3 rounded border border-amber-200 bg-amber-50 p-2 text-xs leading-5 text-amber-900">{rule.disclaimers[0]}</p>
            </article>
          ))}
        </div>
      </section>

      <BoundaryNotes notes={view.boundaryNotes} />
    </section>
  );
}

function ItemsPanel({ title, items, emptyLabel = "No visible items" }: { title: string; items: CommunityDistributionItemView[]; emptyLabel?: string }) {
  return (
    <section className="rounded border border-slate-200 bg-white p-4">
      <h3 className="font-semibold">{title}</h3>
      <div className="mt-3 grid gap-3">
        {items.length ? items.map((entry) => (
          <article key={entry.item.id} className="rounded border border-slate-200 bg-slate-50 p-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h4 className="font-semibold">{entry.targetLabel}</h4>
                <p className="mt-1 text-sm text-slate-600">{entry.item.exclusionReason ?? entry.item.inclusionReason}</p>
              </div>
              <NeutralBadge>{entry.item.itemType}</NeutralBadge>
            </div>
            {entry.trustBoundary ? (
              <p className="mt-3 rounded border border-amber-200 bg-amber-50 p-2 text-xs leading-5 text-amber-900">
                {entry.trustBoundary.provider} - {entry.trustBoundary.validationStatus} - {entry.trustBoundary.riskClassification}
              </p>
            ) : null}
          </article>
        )) : <NeutralBadge>{emptyLabel}</NeutralBadge>}
      </div>
    </section>
  );
}

function InfoPanel({ title, icon, rows }: { title: string; icon: ReactNode; rows: Array<[string, string]> }) {
  return (
    <article className="rounded border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>
      <dl className="mt-3 space-y-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 border-b border-slate-100 pb-2 last:border-b-0">
            <dt className="text-slate-500">{label}</dt>
            <dd className="text-right font-medium text-slate-900">{value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

function ReferencePanel({ title, items, emptyLabel = "No references" }: { title: string; items: string[]; emptyLabel?: string }) {
  return (
    <article className="rounded border border-slate-200 bg-white p-4">
      <h3 className="font-semibold">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.length ? items.map((item) => <NeutralBadge key={item}>{item}</NeutralBadge>) : <NeutralBadge>{emptyLabel}</NeutralBadge>}
      </div>
    </article>
  );
}

function BoundaryNotes({ notes }: { notes: string[] }) {
  return (
    <section className="rounded border border-amber-200 bg-amber-50 p-4 text-amber-950">
      <div className="flex items-center gap-2">
        <ShieldAlert size={18} />
        <h3 className="font-semibold">Community Distribution boundaries</h3>
      </div>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6">
        {Array.from(new Set(notes)).slice(0, 10).map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded border border-slate-200 bg-white p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-950">{value}</p>
    </div>
  );
}

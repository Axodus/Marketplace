import { Link, useParams } from "react-router-dom";
import { BookMarked, Share2, ShieldAlert, Sparkles } from "lucide-react";
import { RevenueSharingIntegrationPanel } from "../components/RevenueSharingIntegrationPanel";
import { NeutralBadge } from "../components/StatusBadge";
import {
  useCatalogSegments,
  useCuratedCatalog,
  useCuratedCatalogDistribution,
  useCuratedCatalogRevenueSharing,
  useCuratedCatalogs,
  useEditorialRules,
  useFeaturedCatalogs
} from "../hooks/useMarketplace";
import { useMarketplaceTelemetry } from "../hooks/useMarketplaceTelemetry";
import type {
  CatalogSegmentView,
  CuratedCatalogDistributionView,
  CuratedCatalogResolvedItem,
  CuratedCatalogSectionView,
  CuratedCatalogView,
  FeaturedCatalogView
} from "../services/marketplaceService";

export function CuratedCatalogsPage() {
  const { catalogId } = useParams();
  const listQuery = useCuratedCatalogs();
  const detailQuery = useCuratedCatalog(catalogId);
  const distributionQuery = useCuratedCatalogDistribution(catalogId);
  const revenueSharingQuery = useCuratedCatalogRevenueSharing(catalogId);
  const editorialRulesQuery = useEditorialRules(catalogId);
  const featuredQuery = useFeaturedCatalogs();
  const segmentsQuery = useCatalogSegments();
  const catalogs = listQuery.data ?? [];
  const featuredCatalogs = featuredQuery.data ?? [];
  const segments = segmentsQuery.data ?? [];
  const selected = catalogId ? detailQuery.data : null;
  useMarketplaceTelemetry("curated-catalogs-page", {
    catalogCount: catalogs.length,
    featuredCount: featuredCatalogs.length,
    segmentCount: segments.length,
    catalogId: catalogId ?? null
  });

  if (listQuery.isLoading) {
    return (
      <section className="rounded border border-slate-200 bg-white p-6 shadow-sm" role="status" aria-live="polite">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Curated Catalogs</p>
        <h1 className="mt-2 text-2xl font-semibold">Loading mock curation</h1>
        <p className="mt-2 text-sm text-slate-600">No ranking real, marketplace intelligence, billing or settlement is executing.</p>
      </section>
    );
  }

  if (catalogId && detailQuery.error) {
    return (
      <section className="rounded border border-amber-200 bg-amber-50 p-6 text-amber-900 shadow-sm" role="status">
        <h1 className="text-xl font-semibold">Curated Catalog not found</h1>
        <p className="mt-2 text-sm">
          Curated Catalog resolution uses local mock/config-first records only. No recommendation engine, marketplace intelligence, approval
          workflow, billing or settlement was attempted.
        </p>
        <Link to="/marketplace/curated" className="mt-4 inline-flex text-sm font-semibold text-teal-800">
          Back to Curated Catalogs
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Curated Catalogs</p>
        <h1 className="mt-2 text-3xl font-semibold">Mock/config-first curation</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Curated Catalogs group existing products, collections and federated records into manual editorial surfaces. They do not create
          ranking real, recommendation engine, marketplace intelligence, approval workflow, revenue sharing, billing or settlement.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <NeutralBadge>mock curation</NeutralBadge>
          <NeutralBadge>config-first curation</NeutralBadge>
          <NeutralBadge>featured is editorial mock</NeutralBadge>
          <NeutralBadge>catalog segments</NeutralBadge>
          <NeutralBadge>no ranking real</NeutralBadge>
          <NeutralBadge>no recommendation engine</NeutralBadge>
          <NeutralBadge>no marketplace intelligence</NeutralBadge>
          <NeutralBadge>no revenue sharing</NeutralBadge>
          <NeutralBadge>no settlement</NeutralBadge>
          <NeutralBadge>no billing</NeutralBadge>
        </div>
      </section>

      <FeaturedCatalogsSection featuredCatalogs={featuredCatalogs} />
      <CatalogSegmentsSection segments={segments} />

      {selected && <CuratedCatalogDetail view={selected} distribution={distributionQuery.data ?? null} revenueSharing={revenueSharingQuery.data ?? null} editorialRules={editorialRulesQuery.data ?? selected.editorialRules.map((rule) => ({
        rule,
        inclusionReason: rule.effect === "include" || rule.effect === "feature" ? rule.reason : undefined,
        exclusionReason: rule.effect === "exclude" || rule.effect === "restrict" ? rule.reason : undefined,
        reviewStatus: rule.reviewStatus,
        governanceLabel: rule.governanceLabel,
        boundaryNote: "Editorial Rule is mock/config-first; no productive approval workflow, no compliance real, no certification real, no ranking real and no marketplace intelligence are active."
      }))} />}

      <section className="grid gap-4 lg:grid-cols-2">
        {catalogs.map((catalog) => (
          <CuratedCatalogCard key={catalog.catalog.id} view={catalog} selected={catalog.catalog.id === selected?.catalog.id} />
        ))}
      </section>
    </div>
  );
}

function FeaturedCatalogsSection({ featuredCatalogs }: { featuredCatalogs: FeaturedCatalogView[] }) {
  return (
    <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Featured Catalogs</p>
          <h2 className="mt-1 text-2xl font-semibold">Manual featured catalog placements</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Featured Catalogs highlight curated catalogs by editorial placement and segment. Featured does not mean ranking real,
            performance real, recommendation engine, Marketplace Intelligence, analytics real, revenue sharing, billing or settlement.
          </p>
        </div>
        <NeutralBadge>{featuredCatalogs.length} featured</NeutralBadge>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {featuredCatalogs.map((view) => (
          <article key={view.featured.id} className="rounded border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{view.segment?.displayName ?? "Unsegmented"}</p>
                <Link to={`/marketplace/curated/${view.catalog?.catalog.slug ?? view.featured.catalogId}`} className="mt-1 block font-semibold text-slate-950 hover:text-teal-700">
                  {view.catalog?.catalog.displayName ?? view.featured.catalogId}
                </Link>
              </div>
              <NeutralBadge>{view.featured.placement}</NeutralBadge>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">Featured reason: {view.featured.featuredReason}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <NeutralBadge>{view.featured.editorialStatus}</NeutralBadge>
              <NeutralBadge>{view.featured.governanceStatus}</NeutralBadge>
              <NeutralBadge>{view.featured.visibility}</NeutralBadge>
            </div>
            <p className="mt-3 rounded border border-amber-200 bg-amber-50 p-2 text-xs leading-5 text-amber-900">
              {view.boundaryNotes[view.boundaryNotes.length - 1]}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function CatalogSegmentsSection({ segments }: { segments: CatalogSegmentView[] }) {
  return (
    <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Catalog Segments</p>
          <h2 className="mt-1 text-2xl font-semibold">Vertical and community grouping</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Catalog Segments group featured catalogs by Academy, ACS, Community, Federated and other vertical contexts in mock/config-first
            mode. They do not create automatic segmentation or analytics real.
          </p>
        </div>
        <NeutralBadge>{segments.length} segments</NeutralBadge>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {segments.map((view) => (
          <article key={view.segment.id} className="rounded border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">{view.segment.displayName}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{view.segment.description}</p>
              </div>
              <NeutralBadge>{view.segment.segmentType}</NeutralBadge>
            </div>
            <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
              <Metric label="Featured" value={view.featuredCatalogs.length} />
              <Metric label="Catalogs" value={view.catalogs.length} />
              <Metric label="Status" value={view.segment.status} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <NeutralBadge>{view.segment.visibility}</NeutralBadge>
              {view.featuredCatalogs.some((featured) => featured.featured.placement === "federated-feature") ? <NeutralBadge>federated featured catalog</NeutralBadge> : null}
              {view.segment.segmentType === "academy" ? <NeutralBadge>academy catalog</NeutralBadge> : null}
              {view.segment.segmentType === "acs" ? <NeutralBadge>acs catalog</NeutralBadge> : null}
              {view.segment.segmentType === "community" ? <NeutralBadge>community catalog</NeutralBadge> : null}
            </div>
            <p className="mt-3 rounded border border-amber-200 bg-amber-50 p-2 text-xs leading-5 text-amber-900">
              {view.boundaryNotes[view.boundaryNotes.length - 1]}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function CuratedCatalogCard({ view, selected }: { view: CuratedCatalogView; selected?: boolean }) {
  const { catalog } = view;

  return (
    <article className={`rounded border bg-white p-5 shadow-sm ${selected ? "border-teal-400" : "border-slate-200"}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookMarked size={20} />
            <h2 className="text-xl font-semibold">{catalog.displayName}</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{catalog.description}</p>
        </div>
        <NeutralBadge>{catalog.status}</NeutralBadge>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <NeutralBadge>{catalog.catalogType}</NeutralBadge>
        <NeutralBadge>{catalog.visibility}</NeutralBadge>
        <NeutralBadge>{catalog.governanceStatus}</NeutralBadge>
        <NeutralBadge>{catalog.ownerScope}</NeutralBadge>
      </div>
      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <Metric label="Sections" value={catalog.sections.length} />
        <Metric label="Items" value={catalog.items.length} />
        <Metric label="Rules" value={catalog.rules.length} />
      </div>
      <div className="mt-4 rounded border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
        {catalog.disclaimers[0]}
      </div>
      <Link to={`/marketplace/curated/${catalog.slug}`} className="mt-4 inline-flex text-sm font-semibold text-teal-700">
        Open Curated Catalog
      </Link>
    </article>
  );
}

function CuratedCatalogDetail({
  view,
  distribution,
  revenueSharing,
  editorialRules
}: {
  view: CuratedCatalogView;
  distribution: CuratedCatalogDistributionView | null;
  revenueSharing: import("../services/marketplaceService").RevenueSharingIntegrationView | null;
  editorialRules: Array<{
    rule: CuratedCatalogView["editorialRules"][number];
    inclusionReason?: string;
    exclusionReason?: string;
    reviewStatus: string;
    governanceLabel: string;
    boundaryNote: string;
  }>;
}) {
  const { catalog } = view;

  return (
    <section className="space-y-5 rounded border border-teal-200 bg-teal-50 p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">Curated Catalog detail</p>
          <h2 className="mt-1 text-2xl font-semibold">{catalog.displayName}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-teal-950">{catalog.description}</p>
        </div>
        <NeutralBadge>{catalog.slug}</NeutralBadge>
      </div>
      <div className="grid gap-3 text-sm md:grid-cols-4">
        <Metric label="Featured products" value={view.featuredProducts.length} />
        <Metric label="Featured collections" value={view.featuredCollections.length} />
        <Metric label="Federated assets" value={view.items.filter((item) => item.item.isFederated).length} />
        <Metric label="Can settle" value={view.items.some((item) => item.item.canSettle) ? "unexpected" : "false"} />
      </div>
      <BoundaryNotes notes={view.boundaryNotes} />
      {distribution ? <CuratedDistributionSection view={distribution} /> : null}
      {revenueSharing ? (
        <RevenueSharingIntegrationPanel
          title="Curated Catalog Revenue Sharing Config"
          description="Curated Catalog Revenue Sharing Config binds this editorial surface to preview-only policies, commission models, attribution-to-split mappings, preview and audit trail while preserving curated catalog editorial rules."
          view={revenueSharing}
        />
      ) : null}
      <section className="rounded border border-indigo-200 bg-white p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">Curation Workflow</p>
            <h3 className="mt-1 text-lg font-semibold">{view.workflowSummary.governanceLabel}</h3>
            <p className="mt-2 text-sm text-slate-600">
              State: {view.workflowSummary.state} / Review status: {view.workflowSummary.reviewStatus}. This workflow is mock/config-first
              and read-only.
            </p>
          </div>
          <NeutralBadge>{catalog.governanceStatus}</NeutralBadge>
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <div className="rounded border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm font-semibold">Curation notes</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-5 text-slate-600">
              {view.workflowSummary.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
          <div className="rounded border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
            {view.workflowSummary.disclaimers.map((note) => (
              <p key={note}>{note}</p>
            ))}
            <p>approved-mock is not productive approval, compliance real, certification real or recommendation financial/commercial.</p>
          </div>
        </div>
      </section>
      <section className="rounded border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Editorial Rules</p>
            <h3 className="text-lg font-semibold">Inclusion, exclusion and review reasons</h3>
          </div>
          <NeutralBadge>{editorialRules.length} rules</NeutralBadge>
        </div>
        <div className="mt-4 grid gap-3">
          {editorialRules.map(({ rule, inclusionReason, exclusionReason, reviewStatus, governanceLabel, boundaryNote }) => (
            <article key={rule.id} className="rounded border border-slate-200 bg-slate-50 p-3 text-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{rule.ruleType} / {rule.effect}</p>
                  <p className="mt-1 text-slate-600">{rule.editorialNote}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <NeutralBadge>{reviewStatus}</NeutralBadge>
                  <NeutralBadge>{governanceLabel}</NeutralBadge>
                </div>
              </div>
              {inclusionReason ? <p className="mt-2 text-xs text-slate-600">Inclusion reason: {inclusionReason}</p> : null}
              {exclusionReason ? <p className="mt-2 text-xs text-slate-600">Exclusion reason: {exclusionReason}</p> : null}
              <p className="mt-2 text-xs text-amber-800">{boundaryNote}</p>
            </article>
          ))}
        </div>
      </section>
      <div className="grid gap-5">
        {view.sections.map((section) => (
          <CuratedSection key={section.section.id} view={section} />
        ))}
      </div>
    </section>
  );
}

function CuratedDistributionSection({ view }: { view: CuratedCatalogDistributionView }) {
  const { config, resolution, context } = view;

  return (
    <section className="rounded border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-teal-700">
            <Share2 size={16} /> Curated Catalog Distribution Config
          </p>
          <h3 className="mt-1 text-lg font-semibold">Distribution-aware curated catalog view</h3>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Curated Catalog Distribution Config exposes this catalog to selected channels, profiles, community distributions and attribution
            sources while preserving editorial rules, featured/segment context and federation boundaries.
          </p>
        </div>
        <NeutralBadge>{config.status} / {config.scope}</NeutralBadge>
      </div>

      <div className="mt-4 grid gap-3 text-sm md:grid-cols-4">
        <Metric label="Included channels" value={resolution.includedChannelIds.length} />
        <Metric label="Featured channels" value={resolution.featuredChannelIds.length} />
        <Metric label="Blocked channels" value={resolution.excludedChannelIds.length} />
        <Metric label="Attribution sources" value={resolution.includedAttributionSourceIds.length} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <DistributionNames title="Included channels" items={view.channels.map((item) => item.channel.displayName)} />
        <DistributionNames title="Blocked channels" items={view.excludedChannels.map((item) => item.channel.displayName)} />
        <DistributionNames title="Associated profiles" items={view.profiles.map((item) => item.profile.displayName)} />
        <DistributionNames title="Community distributions" items={view.communityDistributions.map((item) => item.distribution.displayName)} />
        <DistributionNames title="Associated tenants" items={view.tenants.map((item) => item.displayName)} />
        <DistributionNames title="Attribution sources" items={view.attributionSources.map((item) => item.source.displayName)} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <CuratedDistributionRules title="Applied rules" rules={resolution.appliedRules} />
        <CuratedDistributionRules title="Blocked rules" rules={resolution.blockedRules} />
      </div>

      <div className="mt-4 rounded border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-600">
        <p className="font-semibold">Distribution Integrated Context</p>
        <p>Commercial origin: {context.commercialOriginLabel}</p>
        <p>Distribution source: {context.distributionSourceLabel}</p>
        <p>
          canTrack={String(context.canTrack)} / canAttributeRevenue={String(context.canAttributeRevenue)} / canTriggerPayout=
          {String(context.canTriggerPayout)} / canSettle={String(context.canSettle)}
        </p>
      </div>

      <p className="mt-4 rounded border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
        mock distribution integration / config-first distribution integration / curated catalog editorial rules preserved / no revenue sharing
        / no commission / no payout / no settlement / no billing / no tracking real / no marketplace intelligence
      </p>
    </section>
  );
}

function DistributionNames({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded border border-slate-200 bg-slate-50 p-3">
      <p className="text-sm font-semibold">{title}</p>
      {items.length ? (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-5 text-slate-600">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-xs text-slate-600">No records in this group.</p>
      )}
    </div>
  );
}

function CuratedDistributionRules({ title, rules }: { title: string; rules: CuratedCatalogDistributionView["resolution"]["appliedRules"] }) {
  return (
    <div className="rounded border border-slate-200 bg-slate-50 p-3">
      <p className="text-sm font-semibold">{title}</p>
      <div className="mt-2 space-y-2">
        {rules.length ? (
          rules.map((rule) => (
            <div key={rule.id} className="rounded border border-slate-200 bg-white p-2 text-xs leading-5 text-slate-600">
              <p className="font-semibold text-slate-800">{rule.ruleType}</p>
              <p>
                {rule.effect} {rule.targetType} {rule.targetId}
              </p>
              <p>{rule.reason}</p>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-600">No rules in this group.</p>
        )}
      </div>
    </div>
  );
}

function CuratedSection({ view }: { view: CuratedCatalogSectionView }) {
  const { section, items } = view;

  return (
    <section className="rounded border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles size={18} />
            <h3 className="text-lg font-semibold">{section.title}</h3>
          </div>
          <p className="mt-2 text-sm text-slate-600">{section.description}</p>
        </div>
        <NeutralBadge>{section.sectionType}</NeutralBadge>
      </div>
      <div className="mt-4 grid gap-3">
        {items.length ? items.map((item) => <CuratedItem key={item.item.id} view={item} />) : <p className="text-sm text-slate-600">No curated items in this section.</p>}
      </div>
    </section>
  );
}

function CuratedItem({ view }: { view: CuratedCatalogResolvedItem }) {
  const { item, product, collection, trustBoundary } = view;
  const title = product?.title ?? collection?.collection.name ?? item.id;
  const href = product ? `/marketplace/products/${product.slug}` : collection ? `/marketplace/collections/${collection.collection.slug}` : "/marketplace/curated";

  return (
    <article className={`rounded border p-4 ${item.isExternal ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-slate-50"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link to={href} className="font-semibold text-slate-950 hover:text-teal-700">
            {title}
          </Link>
          <p className="mt-1 text-sm text-slate-600">{item.inclusionReason}</p>
          {item.exclusionReason ? <p className="mt-1 text-sm text-amber-700">Exclusion reason: {item.exclusionReason}</p> : null}
          <p className="mt-1 text-xs text-slate-500">{item.editorialNote}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <NeutralBadge>{item.itemType}</NeutralBadge>
          <NeutralBadge>{item.source}</NeutralBadge>
          <NeutralBadge>{item.editorialStatus}</NeutralBadge>
          <NeutralBadge>{item.governanceLabel}</NeutralBadge>
          {item.isFeatured ? <NeutralBadge>featured</NeutralBadge> : null}
          {item.isExternal ? <NeutralBadge>federated</NeutralBadge> : <NeutralBadge>native</NeutralBadge>}
        </div>
      </div>
      {item.isExternal && trustBoundary ? (
        <div className="mt-3 rounded border border-amber-200 bg-white p-3 text-xs leading-5 text-amber-900">
          <p className="font-semibold">Federated trust boundary</p>
          <p>Origin: {trustBoundary.origin}</p>
          <p>Provider: {trustBoundary.provider}</p>
          <p>Validation status: {trustBoundary.validationStatus}</p>
          <p>Provenance: {trustBoundary.provenance}</p>
          <p>Risk classification: {trustBoundary.riskClassification}</p>
          <p>Execution: {trustBoundary.executionState}; no settlement, no contract writes and no wallet signatures.</p>
        </div>
      ) : null}
      <div className="mt-3 text-xs text-slate-600">
        canDisplay={String(item.canDisplay)} / canTrade={String(item.canTrade)} / canSettle={String(item.canSettle)}
      </div>
      <div className="mt-2 rounded border border-slate-200 bg-white p-3 text-xs leading-5 text-slate-600">
        <p>Review state: {item.reviewState}</p>
        <p>Review status: {view.curationReasons.reviewStatus}</p>
        <p>Governance label: {view.curationReasons.governanceLabel}</p>
        <p>approved-mock does not mean productive approval, compliance real, certification real or recommendation financial/commercial.</p>
      </div>
    </article>
  );
}

function BoundaryNotes({ notes }: { notes: string[] }) {
  return (
    <div className="rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <div className="flex items-center gap-2 font-semibold">
        <ShieldAlert size={18} />
        Boundary notes
      </div>
      <ul className="mt-3 list-disc space-y-1 pl-5">
        {notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded border border-slate-200 bg-white p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

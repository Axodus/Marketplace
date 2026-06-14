import { Link, useParams } from "react-router-dom";
import { BookMarked, ShieldAlert, Sparkles } from "lucide-react";
import { NeutralBadge } from "../components/StatusBadge";
import { useCuratedCatalog, useCuratedCatalogs } from "../hooks/useMarketplace";
import { useMarketplaceTelemetry } from "../hooks/useMarketplaceTelemetry";
import type { CuratedCatalogResolvedItem, CuratedCatalogSectionView, CuratedCatalogView } from "../services/marketplaceService";

export function CuratedCatalogsPage() {
  const { catalogId } = useParams();
  const listQuery = useCuratedCatalogs();
  const detailQuery = useCuratedCatalog(catalogId);
  const catalogs = listQuery.data ?? [];
  const selected = catalogId ? detailQuery.data : null;
  useMarketplaceTelemetry("curated-catalogs-page", { catalogCount: catalogs.length, catalogId: catalogId ?? null });

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
          <NeutralBadge>no ranking real</NeutralBadge>
          <NeutralBadge>no marketplace intelligence</NeutralBadge>
          <NeutralBadge>no revenue sharing</NeutralBadge>
          <NeutralBadge>no settlement</NeutralBadge>
          <NeutralBadge>no billing</NeutralBadge>
        </div>
      </section>

      {selected && <CuratedCatalogDetail view={selected} />}

      <section className="grid gap-4 lg:grid-cols-2">
        {catalogs.map((catalog) => (
          <CuratedCatalogCard key={catalog.catalog.id} view={catalog} selected={catalog.catalog.id === selected?.catalog.id} />
        ))}
      </section>
    </div>
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

function CuratedCatalogDetail({ view }: { view: CuratedCatalogView }) {
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
      <div className="grid gap-5">
        {view.sections.map((section) => (
          <CuratedSection key={section.section.id} view={section} />
        ))}
      </div>
    </section>
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
          <p className="mt-1 text-xs text-slate-500">{item.editorialNote}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <NeutralBadge>{item.itemType}</NeutralBadge>
          <NeutralBadge>{item.source}</NeutralBadge>
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

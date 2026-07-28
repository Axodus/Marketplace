import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MarketplaceProductCard, type ProductCardViewModel } from "../components/ProductCard";
import { useEnterpriseProducts } from "../hooks/useMarketplace";
import type { EnterpriseProductFilters, EnterpriseProductView } from "../services/marketplaceService";

const boundaryBadges = ["mock-first", "preview-only billing", "no settlement", "no treasury routing", "no ACS deployment", "no wallet signature", "no contract write"];

export function EnterpriseMarketplacePage() {
  const [filters, setFilters] = useState<EnterpriseProductFilters>({});
  const query = useEnterpriseProducts(filters);
  const products = query.data ?? [];

  return (
    <div className="space-y-8">
      <EnterpriseHero />
      <EnterpriseFilterBar filters={filters} onChange={setFilters} />

      {query.isLoading ? (
        <section className="rounded border border-slate-200 bg-white p-6 shadow-sm" role="status" aria-live="polite">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Enterprise Marketplace</p>
          <h1 className="mt-2 text-2xl font-semibold">Loading enterprise previews</h1>
          <p className="mt-2 text-sm text-slate-600">No billing, settlement, treasury route or ACS deployment is executing.</p>
        </section>
      ) : null}

      {!query.isLoading && products.length === 0 ? (
        <section className="rounded border border-amber-200 bg-amber-50 p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">Filtered state</p>
          <h2 className="mt-2 text-xl font-semibold">No enterprise mock products match these filters</h2>
          <p className="mt-2 text-sm text-amber-900">The filter state is local and does not call billing, wallet, treasury, ACS or backend execution.</p>
        </section>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-3">
        {products.map((view) => <EnterpriseProductCard key={view.product.id} view={view} />)}
      </section>
    </div>
  );
}

export function EnterpriseHero() {
  return (
    <section className="rounded border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Enterprise Marketplace</p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-950">Enterprise plans, licenses, provisioning and billing previews</h1>
      <p className="mt-3 max-w-4xl text-sm text-slate-700">
        Enterprise Marketplace records are centralized mock data for operational subscriptions, DAO packages, ACS enterprise provisioning,
        dedicated orchestration, licenses, billing previews and telemetry snapshots. Governance guardrails are visible, while billing,
        treasury behavior and ACS provisioning remain preview-only and non-executing.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {boundaryBadges.map((badge) => <NeutralBadge key={badge}>{badge}</NeutralBadge>)}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link to="/marketplace/enterprise/operations" className="rounded border border-slate-300 bg-slate-950 px-3 py-2 text-sm font-semibold text-white">
          Operations
        </Link>
        <Link to="/marketplace/explore" className="rounded border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800">
          NFT Marketplace
        </Link>
      </div>
    </section>
  );
}

function EnterpriseFilterBar({ filters, onChange }: { filters: EnterpriseProductFilters; onChange: (filters: EnterpriseProductFilters) => void }) {
  const options = useMemo(
    () => ({
      tier: ["all", "starter", "growth", "institutional", "sovereign", "restricted"],
      category: ["all", "enterprise-subscription", "dao-operations", "acs-provisioning", "dedicated-orchestration", "restricted-package"],
      governanceStatus: ["all", "allowed-mock", "pending-review", "treasury-review-required", "restricted", "blocked"],
      supportedChain: ["all", "Ethereum", "BNB", "Arbitrum", "Harmony", "Polygon"],
      provisioningType: ["all", "manual-review", "operator-assisted", "mock-automated", "acs-review-required", "blocked"],
      billingCadence: ["all", "monthly", "quarterly", "annual", "usage-preview", "manual-review"]
    }),
    []
  );

  return (
    <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
        {Object.entries(options).map(([key, values]) => (
          <label key={key} className="text-sm font-medium text-slate-700">
            <span className="block capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
            <select
              value={String(filters[key as keyof EnterpriseProductFilters] ?? "all")}
              onChange={(event) => onChange({ ...filters, [key]: event.target.value === "all" ? "all" : event.target.value } as EnterpriseProductFilters)}
              className="mt-1 w-full rounded border border-slate-300 bg-white px-2 py-2 text-sm"
            >
              {values.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
        ))}
      </div>
    </section>
  );
}

function EnterpriseProductCard({ view }: { view: EnterpriseProductView }) {
  return <MarketplaceProductCard view={buildEnterpriseProductCardViewModel(view)} />;
}

export function buildEnterpriseProductCardViewModel(view: EnterpriseProductView): ProductCardViewModel {
  const plan = view.plans[0];
  const governanceRequiresReview = view.product.governanceStatus !== "allowed-mock";
  return {
    slug: view.product.slug,
    detailPath: `/marketplace/enterprise/${view.product.slug}`,
    title: view.product.displayName,
    category: `Enterprise · ${view.product.tier}`,
    imageAlt: `${view.product.displayName} enterprise product preview`,
    identityLabel: view.tenant?.identity.displayName ?? "Axodus Enterprise",
    price: plan ? `${plan.recurringAmountMock.toLocaleString("en-US")} ${plan.currency}` : "Preview only",
    network: view.product.supportedChains[0] ?? "Off-chain",
    listingMeta: plan ? `${plan.billingCadence} subscription preview` : view.product.provisioningType,
    indicators: [
      governanceRequiresReview
        ? { label: view.product.governanceStatus.replaceAll("-", " "), tone: "warning" as const }
        : { label: "Enterprise access", tone: "neutral" as const },
      { label: "Subscription", tone: "neutral" as const }
    ]
  };
}

export function EnterpriseNotFound({ slug }: { slug?: string }) {
  return (
    <section className="rounded border border-amber-200 bg-amber-50 p-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">Enterprise Marketplace</p>
      <h1 className="mt-2 text-2xl font-semibold">Enterprise preview not found</h1>
      <p className="mt-2 text-sm text-amber-900">No enterprise route executed billing, treasury, subscription, ACS provisioning, wallet or contract behavior for {slug ?? "the requested record"}.</p>
      <Link to="/marketplace/enterprise" className="mt-4 inline-flex text-sm font-semibold text-teal-800">Back to Enterprise Marketplace</Link>
    </section>
  );
}

export function EnterprisePageShell({ view, title, children }: { view: EnterpriseProductView; title: string; children: ReactNode }) {
  return (
    <div className="space-y-6">
      <section className="rounded border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Enterprise Marketplace</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">{title}</h1>
        <p className="mt-2 text-sm text-slate-700">{view.product.displayName} / {view.product.governanceStatus} / {view.product.settlementMode}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {boundaryBadges.map((badge) => <NeutralBadge key={badge}>{badge}</NeutralBadge>)}
        </div>
      </section>
      <EnterpriseGuardrailPanel view={view} />
      {children}
      <EnterpriseRouteLinks slug={view.product.slug} />
    </div>
  );
}

export function EnterpriseGuardrailPanel({ view }: { view: EnterpriseProductView }) {
  return (
    <section className="rounded border border-amber-200 bg-amber-50 p-5">
      <h2 className="text-lg font-semibold text-slate-950">Governance guardrails</h2>
      <div className="mt-3 grid gap-3 md:grid-cols-4">
        <Metric label="Status" value={view.guardrail.statusLabel} />
        <Metric label="Subscribe preview" value={String(view.guardrail.canRunSubscribePreview)} />
        <Metric label="Provisioning preview" value={String(view.guardrail.canRunProvisioningPreview)} />
        <Metric label="Billing preview" value={String(view.guardrail.canPreviewBilling)} />
      </div>
      <ListBlock title="Warnings" items={view.guardrail.warnings} />
      <ListBlock title="Required reviews" items={view.guardrail.requiredReviews.length ? view.guardrail.requiredReviews : ["No review required for mock visibility."]} />
    </section>
  );
}

export function EnterpriseRouteLinks({ slug }: { slug: string }) {
  const links = [
    ["Detail", `/marketplace/enterprise/${slug}`],
    ["Subscribe preview", `/marketplace/enterprise/${slug}/subscribe-preview`],
    ["License", `/marketplace/enterprise/${slug}/license`],
    ["Provisioning", `/marketplace/enterprise/${slug}/provisioning`],
    ["Billing", `/marketplace/enterprise/${slug}/billing`],
    ["Telemetry", `/marketplace/enterprise/${slug}/telemetry`]
  ];
  return (
    <nav className="flex flex-wrap gap-3 rounded border border-slate-200 bg-white p-4 text-sm font-semibold shadow-sm" aria-label="Enterprise product views">
      {links.map(([label, href]) => <Link key={href} to={href} className="text-teal-800">{label}</Link>)}
    </nav>
  );
}

export function Metric({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded border border-slate-200 bg-white p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}

export function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      <ul className="mt-2 space-y-1 text-sm text-slate-700">
        {items.map((item) => <li key={item}>- {item}</li>)}
      </ul>
    </div>
  );
}

function NeutralBadge({ children }: { children: ReactNode }) {
  return <span className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-700">{children}</span>;
}

function WarningBadge({ children }: { children: ReactNode }) {
  return <span className="rounded border border-amber-300 bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-900">{children}</span>;
}

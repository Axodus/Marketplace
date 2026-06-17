import { Link, useParams } from "react-router-dom";
import type { ReactNode } from "react";
import { Network, RadioTower, Share2, ShieldAlert } from "lucide-react";
import { RevenueSharingIntegrationPanel } from "../components/RevenueSharingIntegrationPanel";
import { NeutralBadge } from "../components/StatusBadge";
import { useDistributionChannel, useDistributionChannelRevenueSharing, useDistributionChannels, useDistributionContext, useDistributionNetworks } from "../hooks/useMarketplace";
import { useMarketplaceTelemetry } from "../hooks/useMarketplaceTelemetry";
import type { DistributionChannelView, DistributionNetworkView, DistributionPlacementView } from "../services/marketplaceService";

const channelLabels: Record<string, string> = {
  tenant: "Tenant Marketplace",
  partner: "Partner Channel",
  distributor: "Distributor Channel",
  agency: "Agency Channel",
  affiliate: "Affiliate Channel",
  community: "Community Channel",
  demo: "Demo Channel",
  academy: "Academy Channel",
  acs: "ACS Channel",
  enterprise: "Enterprise Channel",
  creator: "Creator Channel",
  dao: "DAO Channel"
};

export function DistributionNetworkPage() {
  const { channelId } = useParams();
  const networksQuery = useDistributionNetworks();
  const channelsQuery = useDistributionChannels();
  const detailQuery = useDistributionChannel(channelId);
  const contextQuery = useDistributionContext(channelId);
  const networks = networksQuery.data ?? [];
  const channels = channelsQuery.data ?? [];
  const selected = channelId ? detailQuery.data : contextQuery.data?.channel;

  useMarketplaceTelemetry("distribution-network-page", {
    channelId: channelId ?? null,
    networkCount: networks.length,
    channelCount: channels.length
  });

  if (channelsQuery.isLoading || networksQuery.isLoading) {
    return (
      <section className="rounded border border-slate-200 bg-white p-6 shadow-sm" role="status" aria-live="polite">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Distribution Network</p>
        <h1 className="mt-2 text-2xl font-semibold">Loading mock distribution</h1>
        <p className="mt-2 text-sm text-slate-600">No tracking real, commission, payout, billing or settlement is executing.</p>
      </section>
    );
  }

  if (channelId && detailQuery.error) {
    return (
      <section className="rounded border border-amber-200 bg-amber-50 p-6 text-amber-950 shadow-sm" role="status">
        <h1 className="text-xl font-semibold">Distribution Channel not found</h1>
        <p className="mt-2 text-sm">
          Distribution Channel resolution uses local mock/config-first records only. No partner onboarding, affiliate tracking, commission,
          payout, billing, settlement or revenue sharing was attempted.
        </p>
        <Link to="/marketplace/distribution" className="mt-4 inline-flex text-sm font-semibold text-teal-800">
          Back to Distribution Network
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Distribution Network</p>
        <h1 className="mt-2 text-3xl font-semibold">Mock/config-first commercial exposure channels</h1>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600">
          Distribution Network represents channel, placement, commercial origin and attribution source descriptors. It does not activate
          revenue sharing, settlement, billing, payout, commission, affiliate tracking real, analytics tracking real, Marketplace
          Intelligence, backend, API, database, analytics or BI.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <NeutralBadge>mock distribution</NeutralBadge>
          <NeutralBadge>config-first distribution</NeutralBadge>
          <NeutralBadge>commercial origin simulated</NeutralBadge>
          <NeutralBadge>attribution source no tracking real</NeutralBadge>
          <NeutralBadge>no revenue sharing</NeutralBadge>
          <NeutralBadge>no settlement</NeutralBadge>
          <NeutralBadge>no billing</NeutralBadge>
          <NeutralBadge>no payout</NeutralBadge>
          <NeutralBadge>no commission</NeutralBadge>
        </div>
      </section>

      {networks.map((network) => (
        <DistributionNetworkSummary key={network.network.id} view={network} />
      ))}

      {selected ? <DistributionChannelDetail view={selected} /> : null}

      <section className="grid gap-4 lg:grid-cols-2">
        {channels.map((view) => (
          <DistributionChannelCard key={view.channel.id} view={view} selected={view.channel.id === selected?.channel.id} />
        ))}
      </section>
    </div>
  );
}

function DistributionNetworkSummary({ view }: { view: DistributionNetworkView }) {
  return (
    <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Network size={22} />
            <h2 className="text-2xl font-semibold">{view.network.displayName}</h2>
          </div>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{view.network.description}</p>
        </div>
        <NeutralBadge>{view.network.status}</NeutralBadge>
      </div>
      <div className="mt-4 grid gap-3 text-sm md:grid-cols-4">
        <Metric label="Channels" value={view.channels.length} />
        <Metric label="Default" value={view.defaultChannel?.channel.displayName ?? "none"} />
        <Metric label="Visibility" value={view.network.visibility} />
        <Metric label="Governance" value={view.network.governanceStatus} />
      </div>
      <BoundaryNotes notes={view.boundaryNotes} />
    </section>
  );
}

function DistributionChannelCard({ view, selected }: { view: DistributionChannelView; selected?: boolean }) {
  const { channel } = view;

  return (
    <article className={`rounded border bg-white p-5 shadow-sm ${selected ? "border-teal-400" : "border-slate-200"}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Share2 size={20} />
            <h2 className="text-xl font-semibold">{channel.displayName}</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{channel.description}</p>
        </div>
        <NeutralBadge>{channelLabels[channel.channelType] ?? channel.channelType}</NeutralBadge>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <NeutralBadge>{channel.status}</NeutralBadge>
        <NeutralBadge>{channel.visibility}</NeutralBadge>
        <NeutralBadge>{channel.governanceStatus}</NeutralBadge>
        <NeutralBadge>{channel.scope}</NeutralBadge>
      </div>
      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <Metric label="Placements" value={view.placements.length} />
        <Metric label="Allowed catalogs" value={channel.allowedCuratedCatalogIds.length} />
        <Metric label="Can settle" value={String(channel.canSettle)} />
      </div>
      <p className="mt-4 rounded border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
        {channel.disclaimers[0]}
      </p>
      <Link to={`/marketplace/distribution/${channel.slug}`} className="mt-4 inline-flex text-sm font-semibold text-teal-700">
        Open Distribution Channel
      </Link>
    </article>
  );
}

function DistributionChannelDetail({ view }: { view: DistributionChannelView }) {
  const { channel } = view;
  const revenueSharingQuery = useDistributionChannelRevenueSharing(channel.slug);
  const revenueSharing = revenueSharingQuery.data;

  return (
    <section className="space-y-5 rounded border border-teal-200 bg-teal-50 p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">Distribution Channel detail</p>
          <h2 className="mt-1 text-2xl font-semibold">{channel.displayName}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-teal-950">{channel.description}</p>
        </div>
        <NeutralBadge>{channel.slug}</NeutralBadge>
      </div>

      <div className="grid gap-3 text-sm md:grid-cols-4">
        <Metric label="Type" value={channelLabels[channel.channelType] ?? channel.channelType} />
        <Metric label="Scope" value={channel.scope} />
        <Metric label="Tenant" value={view.tenant?.displayName ?? "none"} />
        <Metric label="Federated assets" value={channel.allowsFederatedAssets ? "allowed with boundaries" : "blocked"} />
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        <InfoPanel
          title="Commercial Origin"
          icon={<RadioTower size={18} />}
          rows={[
            ["Origin", channel.commercialOrigin.originLabel],
            ["Type", channel.commercialOrigin.originType],
            ["Source", channel.commercialOrigin.sourceLabel],
            ["Simulated", String(channel.commercialOrigin.isSimulated)]
          ]}
        />
        <InfoPanel
          title="Attribution Source"
          icon={<Share2 size={18} />}
          rows={[
            ["Source", channel.attributionSource.sourceLabel],
            ["Tracking mode", channel.attributionSource.trackingMode],
            ["Status", channel.attributionSource.status],
            ["Can track", String(channel.attributionSource.canTrack)],
            ["Can attribute revenue", String(channel.attributionSource.canAttributeRevenue)]
          ]}
        />
        <InfoPanel
          title="Distribution Source"
          icon={<Network size={18} />}
          rows={[
            ["Source", channel.distributionSource.sourceLabel],
            ["Type", channel.distributionSource.sourceType],
            ["Status", channel.distributionSource.status],
            ["Simulated", String(channel.distributionSource.isSimulated)]
          ]}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <ReferencePanel title="Allowed Curated Catalogs" items={view.allowedCuratedCatalogs.map((catalog) => catalog.catalog.displayName)} />
        <ReferencePanel title="Allowed Segments" items={view.allowedSegments.map((segment) => segment.displayName)} />
        <ReferencePanel title="Allowed Products" items={view.allowedProducts.map((product) => product.title)} />
        <ReferencePanel title="Allowed Collections" items={view.allowedCollections.map((collection) => collection.name)} />
        <ReferencePanel title="Blocked Products" items={view.blockedProducts.map((product) => product.title)} emptyLabel="No blocked products" />
        <ReferencePanel title="Blocked Collections" items={view.blockedCollections.map((collection) => collection.name)} emptyLabel="No blocked collections" />
      </section>

      <section className="rounded border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Distribution Placement</p>
            <h3 className="mt-1 text-lg font-semibold">Placement references</h3>
          </div>
          <NeutralBadge>{view.placements.length} placements</NeutralBadge>
        </div>
        <div className="mt-4 grid gap-3">
          {view.placements.length ? view.placements.map((placement) => <PlacementCard key={placement.placement.id} view={placement} />) : (
            <p className="rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">No placement references configured for this mock channel.</p>
          )}
        </div>
      </section>

      {revenueSharing ? (
        <RevenueSharingIntegrationPanel
          title="Distribution Revenue Sharing Config"
          description="Distribution Revenue Sharing Config connects channel attribution, commercial origin, split rules, previews and audit trail in preview-only mode without activating payout, settlement, billing or treasury routing."
          view={revenueSharing}
        />
      ) : null}

      <BoundaryNotes notes={view.boundaryNotes} />
    </section>
  );
}

function PlacementCard({ view }: { view: DistributionPlacementView }) {
  return (
    <article className="rounded border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold">{view.placement.placementLabel}</h4>
          <p className="mt-1 text-sm text-slate-600">{view.targetLabel}</p>
        </div>
        <NeutralBadge>{view.placement.targetType}</NeutralBadge>
      </div>
      <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
        <Metric label="Type" value={view.placement.placementType} />
        <Metric label="Status" value={view.placement.status} />
        <Metric label="Position" value={view.placement.position} />
      </div>
      <p className="mt-3 rounded border border-amber-200 bg-amber-50 p-2 text-xs leading-5 text-amber-900">
        {view.boundaryNotes[view.boundaryNotes.length - 1]}
      </p>
    </article>
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
        <h3 className="font-semibold">Distribution boundaries</h3>
      </div>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6">
        {Array.from(new Set(notes)).slice(0, 8).map((note) => (
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

import { Link, useParams } from "react-router-dom";
import type { ReactNode } from "react";
import { Handshake, Network, ShieldAlert, UsersRound } from "lucide-react";
import { MarketplaceIntelligencePanel } from "../components/MarketplaceIntelligencePanel";
import { RevenueSharingIntegrationPanel } from "../components/RevenueSharingIntegrationPanel";
import { NeutralBadge } from "../components/StatusBadge";
import { useDistributionIntelligenceSnapshot, useDistributionProfile, useDistributionProfileContext, useDistributionProfileRevenueSharing, useDistributionProfiles } from "../hooks/useMarketplace";
import { useMarketplaceTelemetry } from "../hooks/useMarketplaceTelemetry";
import type { DistributionProfileView } from "../services/marketplaceService";

const profileLabels: Record<string, string> = {
  distributor: "Distributor Profile",
  partner: "Partner Profile",
  agency: "Agency Profile",
  affiliate: "Affiliate Profile",
  "community-marketplace": "Community Marketplace Profile",
  "tenant-operator": "Tenant Operator Profile",
  "creator-network": "Creator Network Profile",
  "academy-network": "Academy Network Profile",
  "acs-network": "ACS Network Profile",
  "enterprise-network": "Enterprise Network Profile",
  "dao-network": "DAO Network Profile",
  demo: "Demo Profile"
};

export function DistributionProfilesPage() {
  const { profileSlug } = useParams();
  const profilesQuery = useDistributionProfiles();
  const detailQuery = useDistributionProfile(profileSlug);
  const contextQuery = useDistributionProfileContext(profileSlug);
  const profiles = profilesQuery.data ?? [];
  const selected = profileSlug ? detailQuery.data : contextQuery.data?.profile;

  useMarketplaceTelemetry("distribution-profiles-page", {
    profileSlug: profileSlug ?? null,
    profileCount: profiles.length
  });

  if (profilesQuery.isLoading) {
    return (
      <section className="rounded border border-slate-200 bg-white p-6 shadow-sm" role="status" aria-live="polite">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Distribution Profile</p>
        <h1 className="mt-2 text-2xl font-semibold">Loading mock distribution profiles</h1>
        <p className="mt-2 text-sm text-slate-600">No KYC real, contract real, payout, commission, revenue sharing or tracking real is executing.</p>
      </section>
    );
  }

  if (profileSlug && detailQuery.error) {
    return (
      <section className="rounded border border-amber-200 bg-amber-50 p-6 text-amber-950 shadow-sm" role="status">
        <h1 className="text-xl font-semibold">Distribution Profile not found</h1>
        <p className="mt-2 text-sm">
          Distribution Profile resolution uses mock/config-first records only. No onboarding real, KYC real, contract real, commission,
          payout, billing, settlement, revenue sharing or tracking real was attempted.
        </p>
        <Link to="/marketplace/distribution/profiles" className="mt-4 inline-flex text-sm font-semibold text-teal-800">
          Back to Distribution Profiles
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Distribution Profile</p>
        <h1 className="mt-2 text-3xl font-semibold">Mock/config-first distribution operators</h1>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600">
          Distribution Profiles identify distributors, partners, agencies, affiliates and community marketplaces that can operate or
          represent Distribution Channels. They are not Seller Profiles, Tenant Identities or Federation Providers, and they do not
          activate KYC real, onboarding real, contract real, commission, payout, settlement, billing, revenue sharing, tracking real,
          Marketplace Intelligence or BI.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <NeutralBadge>mock distribution profile</NeutralBadge>
          <NeutralBadge>config-first distribution profile</NeutralBadge>
          <NeutralBadge>no KYC real</NeutralBadge>
          <NeutralBadge>no contract real</NeutralBadge>
          <NeutralBadge>no revenue sharing</NeutralBadge>
          <NeutralBadge>no payout</NeutralBadge>
          <NeutralBadge>no commission</NeutralBadge>
          <NeutralBadge>no tracking real</NeutralBadge>
        </div>
      </section>

      {selected ? <DistributionProfileDetail view={selected} /> : null}

      <section className="grid gap-4 lg:grid-cols-2">
        {profiles.map((view) => (
          <DistributionProfileCard key={view.profile.id} view={view} selected={view.profile.id === selected?.profile.id} />
        ))}
      </section>
    </div>
  );
}

function DistributionProfileCard({ view, selected }: { view: DistributionProfileView; selected?: boolean }) {
  const { profile } = view;

  return (
    <article className={`rounded border bg-white p-5 shadow-sm ${selected ? "border-teal-400" : "border-slate-200"}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UsersRound size={20} />
            <h2 className="text-xl font-semibold">{profile.displayName}</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{profile.description}</p>
        </div>
        <NeutralBadge>{profileLabels[profile.profileType] ?? profile.profileType}</NeutralBadge>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <NeutralBadge>{profile.status}</NeutralBadge>
        <NeutralBadge>{profile.visibility}</NeutralBadge>
        <NeutralBadge>{profile.governanceStatus}</NeutralBadge>
      </div>
      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <Metric label="Associated channels" value={view.channels.length} />
        <Metric label="Tenants" value={view.tenants.length} />
        <Metric label="Curated catalogs" value={view.curatedCatalogs.length} />
      </div>
      <p className="mt-4 rounded border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
        {profile.disclaimers[0]}
      </p>
      <Link to={`/marketplace/distribution/profiles/${profile.slug}`} className="mt-4 inline-flex text-sm font-semibold text-teal-700">
        Open Distribution Profile
      </Link>
    </article>
  );
}

function DistributionProfileDetail({ view }: { view: DistributionProfileView }) {
  const { profile } = view;
  const revenueSharingQuery = useDistributionProfileRevenueSharing(profile.slug);
  const intelligenceQuery = useDistributionIntelligenceSnapshot(profile.id);
  const revenueSharing = revenueSharingQuery.data;

  return (
    <section className="space-y-5 rounded border border-teal-200 bg-teal-50 p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">Distribution Profile detail</p>
          <h2 className="mt-1 text-2xl font-semibold">{profile.displayName}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-teal-950">{profile.description}</p>
        </div>
        <NeutralBadge>{profile.slug}</NeutralBadge>
      </div>

      <div className="grid gap-3 text-sm md:grid-cols-4">
        <Metric label="Profile type" value={profileLabels[profile.profileType] ?? profile.profileType} />
        <Metric label="Operator type" value={profile.operatorType} />
        <Metric label="Trust label" value={profile.trustLabel} />
        <Metric label="Commercial label" value={profile.commercialLabel} />
      </div>

      <MarketplaceIntelligencePanel
        title="Distribution Intelligence Panel"
        description="Distribution Intelligence Panel summarizes profile relationships, associated channels and distribution boundaries from static mock data only. It does not enable partner analytics, tracking real, BI real, scoring or automated commercial action."
        snapshot={intelligenceQuery.data}
      />

      <section className="grid gap-4 lg:grid-cols-2">
        <ReferencePanel title="Associated channels" items={view.channels.map((channel) => channel.channel.displayName)} />
        <ReferencePanel title="Associated tenants" items={view.tenants.map((tenant) => tenant.displayName)} />
        <ReferencePanel title="Associated curated catalogs" items={view.curatedCatalogs.map((catalog) => catalog.catalog.displayName)} />
        <ReferencePanel title="Associated catalog segments" items={view.segments.map((segment) => segment.displayName)} />
        <ReferencePanel title="Capabilities" items={profile.capabilityLabels} />
        <ReferencePanel title="Limitations" items={profile.limitationLabels} />
      </section>

      <section className="rounded border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Profile relationships</p>
            <h3 className="mt-1 text-lg font-semibold">Reference-only associations</h3>
          </div>
          <NeutralBadge>{profile.relationships.length} relationships</NeutralBadge>
        </div>
        <div className="mt-4 grid gap-3">
          {profile.relationships.map((relationship, index) => (
            <article key={relationship.id} className="rounded border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h4 className="font-semibold">{view.relationshipLabels[index]}</h4>
                  <p className="mt-1 text-sm text-slate-600">{relationship.targetType}</p>
                </div>
                <NeutralBadge>{relationship.relationshipType}</NeutralBadge>
              </div>
              <p className="mt-3 rounded border border-amber-200 bg-amber-50 p-2 text-xs leading-5 text-amber-900">
                {relationship.disclaimers[0]}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <InfoPanel title="Identity Boundary" icon={<Handshake size={18} />} rows={[
          ["Profile", "Distribution Profile"],
          ["Not seller", "true"],
          ["Not tenant identity", "true"],
          ["Not federation provider", "true"]
        ]} />
        <InfoPanel title="Commercial Boundary" icon={<Network size={18} />} rows={[
          ["No KYC real", "true"],
          ["No contract real", "true"],
          ["No commission", "true"],
          ["No payout", "true"]
        ]} />
        <InfoPanel title="Execution Boundary" icon={<ShieldAlert size={18} />} rows={[
          ["No settlement", "true"],
          ["No billing", "true"],
          ["No revenue sharing", "true"],
          ["No tracking real", "true"]
        ]} />
      </section>

      {revenueSharing ? (
        <RevenueSharingIntegrationPanel
          title="Distribution Revenue Sharing Config"
          description="Distribution Revenue Sharing Config can bind a profile to preview-only policies, commission models and attribution-to-split rules while preserving no payout, no settlement, no billing and no treasury routing boundaries."
          view={revenueSharing}
        />
      ) : null}

      <BoundaryNotes notes={view.boundaryNotes} />
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
        <h3 className="font-semibold">Distribution Profile boundaries</h3>
      </div>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6">
        {Array.from(new Set(notes)).slice(0, 9).map((note) => (
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

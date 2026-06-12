import { Link, useParams } from "react-router-dom";
import { Activity, BadgeCheck, BarChart3, ShieldCheck, WalletCards } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { GovernanceAuthorityPanel } from "../components/GovernanceAuthorityPanel";
import { GovernanceEnforcementPanel } from "../components/GovernanceEnforcementPanel";
import { NeutralBadge, SellerStandingBadge } from "../components/StatusBadge";
import { useSeller } from "../hooks/useMarketplace";

export function SellerProfilePage() {
  const { sellerId } = useParams();
  const { data, error, isLoading } = useSeller(sellerId);

  if (isLoading) {
    return (
      <section className="rounded border border-slate-200 bg-white p-6 shadow-sm" role="status" aria-live="polite">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Seller profile</p>
        <h1 className="mt-2 text-2xl font-semibold">Loading seller profile preview</h1>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="rounded border border-amber-200 bg-amber-50 p-6 text-amber-900 shadow-sm" role="status">
        <h1 className="text-xl font-semibold">Seller not found in mock registry</h1>
        <p className="mt-2 text-sm">
          The seller route is active, but Phase 01 only resolves mock Marketplace sellers. No identity provider, KYC, permission system or
          governance write was executed.
        </p>
        <Link to="/marketplace/explore" className="mt-4 inline-flex text-sm font-semibold text-teal-800">
          Back to Explorer
        </Link>
      </section>
    );
  }

  const { seller, metrics, reputation, activity, collections, products } = data;

  return (
    <div className="space-y-6">
      <section className="rounded border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-5 lg:grid-cols-[auto_1fr_auto]">
          <img src={seller.avatar} alt="" className="h-24 w-24 rounded border border-slate-200 object-cover" />
          <div>
            <div className="flex flex-wrap gap-2">
              <NeutralBadge>{seller.type}</NeutralBadge>
              <NeutralBadge>{seller.verificationStatus}</NeutralBadge>
              <SellerStandingBadge status={seller.governanceStanding} />
            </div>
            <h1 className="mt-3 text-3xl font-semibold">{seller.name}</h1>
            <p className="mt-1 text-sm font-semibold text-teal-700">{seller.handle ?? seller.id}</p>
            <p className="mt-3 max-w-3xl text-slate-600">{seller.description}</p>
          </div>
          <div className="rounded border border-slate-200 bg-slate-50 p-4 text-sm">
            <p className="font-semibold text-slate-950">Mock identity</p>
            <p className="mt-2 break-all text-slate-600">{seller.mockAccount ?? seller.id}</p>
            <p className="mt-2 text-xs text-slate-500">Informational mock account only. No wallet signature or KYC validation is active.</p>
            {seller.mockAccount && (
              <Link to={`/marketplace/wallet-discovery/${seller.mockAccount}`} className="mt-3 inline-flex text-xs font-semibold text-teal-700">
                Open Wallet Discovery
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Stat icon={<BadgeCheck />} label="Reputation mock" value={`${reputation.score}/100`} detail={reputation.label} />
        <Stat icon={<ShieldCheck />} label="Risk indicator" value={reputation.riskLabel} detail={`${seller.riskScore}/100 mock risk`} />
        <Stat icon={<BarChart3 />} label="Mock volume" value={`${metrics.mockVolume} USDC`} detail={`${metrics.mockSales} mock sales/bids`} />
        <Stat icon={<WalletCards />} label="Listings" value={metrics.listings} detail={`${metrics.nftBoundListings} NFT-bound`} />
      </section>

      <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-slate-950">
          <ShieldCheck size={20} />
          <h2 className="text-xl font-semibold">Governance validation</h2>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Seller validation is mock-first and informational. It reflects Marketplace governance standing, verification state and risk
          indicators without executing governance writes, KYC, RBAC, onboarding, permission grants or settlement.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Mini label="Verification" value={seller.verificationStatus} />
          <Mini label="Governance" value={seller.governanceStanding} />
          <Mini label="Treasury linked" value={seller.treasuryLinked ? "preview linked" : "not linked"} />
        </div>
        {seller.verificationNote && <p className="mt-4 rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">{seller.verificationNote}</p>}
      </section>

      {seller.registeredDAOs.length > 0 && (
        <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
          <p className="font-semibold text-slate-950">DAO relationship</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {seller.registeredDAOs.map((dao) => (
              <span key={dao} className="rounded border border-slate-300 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700">
                {dao}
              </span>
            ))}
          </div>
          <p className="mt-3 text-sm text-slate-600">DAO relationship is visibility-only and does not activate tenant, distributor or revenue-sharing behavior.</p>
        </section>
      )}

      <section className="grid gap-4 lg:grid-cols-2">
        <GovernanceAuthorityPanel authority={data.authority} />
        <GovernanceEnforcementPanel enforcement={data.enforcement} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-950">
            <Activity size={20} />
            <h2 className="text-xl font-semibold">Recent activity mock</h2>
          </div>
          <div className="mt-4 space-y-3">
            {activity.map((event) => (
              <div key={event.id} className="rounded border border-slate-200 bg-slate-50 p-3 text-sm">
                <p className="font-semibold text-slate-950">{event.label}</p>
                <p className="mt-1 text-slate-600">{event.detail}</p>
                <p className="mt-1 text-xs text-slate-500">{event.timestamp}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Associated collections</h2>
          {collections.length ? (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {collections.map((view) => (
                <Link key={view.collection.id} to={`/marketplace/collections/${view.collection.slug}`} className="rounded border border-slate-200 bg-slate-50 p-3 hover:border-teal-700">
                  <p className="text-sm font-semibold text-slate-950">{view.collection.name}</p>
                  <p className="mt-1 text-xs text-slate-600">
                    Rank #{view.metrics.ranking} | {view.collection.assetType} | {view.metrics.itemCount} items
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
              No NFT collections are associated with this mock seller yet.
            </p>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Seller listings</p>
          <h2 className="mt-1 text-2xl font-semibold">Items listed by {seller.name}</h2>
        </div>
        {products.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                seller={seller}
                enforcement={data.governanceEnforcement.records.find((record) => record.entityId === product.id)}
              />
            ))}
          </div>
        ) : (
          <section className="rounded border border-slate-200 bg-white p-6 shadow-sm" role="status">
            <h3 className="text-xl font-semibold">No seller listings available</h3>
            <p className="mt-2 text-sm text-slate-600">Seller onboarding and listing creation remain mock-first Phase 01 surfaces.</p>
          </section>
        )}
      </section>
    </div>
  );
}

function Stat({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string | number; detail: string }) {
  return (
    <div className="rounded border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-slate-950">
        {icon}
        <p className="text-sm font-semibold">{label}</p>
      </div>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

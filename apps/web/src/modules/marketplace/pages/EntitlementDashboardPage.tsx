import { ShieldCheck, WalletCards } from "lucide-react";
import { MetricCard } from "../components/MetricCard";
import { GovernanceAuthorityPanel } from "../components/GovernanceAuthorityPanel";
import { GovernanceEnforcementPanel } from "../components/GovernanceEnforcementPanel";
import { useEntitlements } from "../hooks/useMarketplace";
import { useMarketplaceTelemetry } from "../hooks/useMarketplaceTelemetry";

const mockHolder = "0xMockBuyer...A11C";

export function EntitlementDashboardPage() {
  const { data } = useEntitlements(mockHolder);
  useMarketplaceTelemetry("entitlement-dashboard-page", { holder: mockHolder });

  if (!data) return null;

  const { snapshot, products, licenseRuntimes, subscriptions } = data;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Entitlements</p>
        <h1 className="mt-2 text-3xl font-semibold">Access lifecycle dashboard</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          Backend-backed visibility for license, subscription and delivery permission lifecycle. This is runtime preparation only:
          no real blocking, wallet ownership merge, NFT settlement or payment execution is enabled.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Owned products" value={snapshot.ownedProducts.length} detail="Aggregated from license/subscription runtime" />
        <MetricCard label="Active licenses" value={snapshot.activeLicenses.length} detail="Issued or active lifecycle records" />
        <MetricCard label="Active subscriptions" value={snapshot.activeSubscriptions.length} detail="Active or renewal due plans" />
        <MetricCard label="Real blocking" value={snapshot.accessEnforcement.realBlockingEnabled ? "On" : "Off"} detail="Prepared boundary only" />
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.85fr_0.85fr_1.15fr]">
        <GovernanceAuthorityPanel
          authority={data.governanceAuthority.records.find((record) => snapshot.ownedProducts.includes(record.entityId))}
          compact
        />
        <GovernanceEnforcementPanel
          enforcement={data.governanceEnforcement.records.find((record) => snapshot.ownedProducts.includes(record.entityId))}
          compact
        />
        <div className="rounded border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <ShieldCheck size={20} /> Enforcement readiness
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Row label="License-gated assets" value={snapshot.accessEnforcement.licenseGatedAssetsReady ? "ready" : "deferred"} />
            <Row label="Subscription-gated products" value={snapshot.accessEnforcement.subscriptionGatedProductsReady ? "ready" : "deferred"} />
            <Row label="DAO-restricted access" value={snapshot.accessEnforcement.daoRestrictedAccessReady ? "ready" : "deferred"} />
            <Row label="Governance restrictions" value={snapshot.accessEnforcement.governanceRestrictedAccessReady ? "ready" : "deferred"} />
            <Row label="NFT ownership merge" value={snapshot.futureMerges.nftOwnershipMergeReady ? "prepared" : "deferred"} />
            <Row label="Wallet ownership merge" value={snapshot.futureMerges.walletOwnershipMergeReady ? "prepared" : "deferred"} />
          </dl>
        </div>

        <div className="rounded border border-slate-200 bg-white p-5 shadow-sm lg:col-span-3">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <WalletCards size={20} /> Delivery permissions
          </h2>
          <div className="mt-4 space-y-3">
            {snapshot.deliveryPermissions.length ? (
              snapshot.deliveryPermissions.map((permission) => (
                <div key={permission.productId} className="rounded border border-slate-200 bg-slate-50 p-3 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold">{products.find((product) => product.id === permission.productId)?.title ?? permission.productId}</p>
                    <span className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold uppercase tracking-wide">
                      {permission.permission}
                    </span>
                  </div>
                  <p className="mt-2 text-slate-600">{permission.deliveryType}</p>
                  <p className="mt-1 text-xs text-slate-500">{permission.reasons.join(", ")}</p>
                </div>
              ))
            ) : (
              <p className="rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                No active access records yet. Create a purchase or subscription preview to populate this holder.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <HistoryCard
          title="License history"
          rows={licenseRuntimes.map((license) => ({
            id: license.id,
            primary: products.find((product) => product.id === license.productId)?.title ?? license.productId,
            secondary: `${license.state} / expires ${license.expiresAt ?? "none"}`,
            detail: license.governanceRestrictions.length ? license.governanceRestrictions.join(", ") : "no active restrictions"
          }))}
        />
        <HistoryCard
          title="Subscription history"
          rows={subscriptions.map((subscription) => ({
            id: subscription.id,
            primary: products.find((product) => product.id === subscription.productId)?.title ?? subscription.productId,
            secondary: `${subscription.status} / renewal ${subscription.renewalPreviewAt ?? "none"}`,
            detail: subscription.governanceRestrictions.length ? subscription.governanceRestrictions.join(", ") : "no active restrictions"
          }))}
        />
      </section>
    </div>
  );
}

function HistoryCard({ title, rows }: { title: string; rows: Array<{ id: string; primary: string; secondary: string; detail: string }> }) {
  return (
    <div className="rounded border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-4 space-y-3">
        {rows.length ? (
          rows.map((row) => (
            <div key={row.id} className="rounded border border-slate-200 bg-slate-50 p-3 text-sm">
              <p className="font-semibold">{row.primary}</p>
              <p className="mt-1 text-slate-600">{row.secondary}</p>
              <p className="mt-1 text-xs text-slate-500">{row.detail}</p>
            </div>
          ))
        ) : (
          <p className="rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">No records persisted for this holder yet.</p>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-600">{label}</dt>
      <dd className="font-medium text-slate-900">{value}</dd>
    </div>
  );
}

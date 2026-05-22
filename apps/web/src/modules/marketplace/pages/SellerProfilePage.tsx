import { Link, useParams } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { GovernanceAuthorityPanel } from "../components/GovernanceAuthorityPanel";
import { GovernanceEnforcementPanel } from "../components/GovernanceEnforcementPanel";
import { SellerStandingBadge } from "../components/StatusBadge";
import { useSeller } from "../hooks/useMarketplace";

export function SellerProfilePage() {
  const { sellerId } = useParams();
  const { data, error } = useSeller(sellerId);

  if (error) return <p className="rounded border border-red-200 bg-red-50 p-4 text-red-800">Seller not found.</p>;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <section className="rounded border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{data.seller.type}</p>
            <h1 className="mt-2 text-3xl font-semibold">{data.seller.name}</h1>
            <p className="mt-3 max-w-3xl text-slate-600">{data.seller.description}</p>
          </div>
          <SellerStandingBadge status={data.seller.governanceStanding} />
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          <Stat label="Reputation" value={`${data.seller.reputation}/100`} />
          <Stat label="Risk score" value={`${data.seller.riskScore}/100`} />
          <Stat label="Products" value={data.seller.productsPublished} />
          <Stat label="Treasury linked" value={data.seller.treasuryLinked ? "yes" : "no"} />
        </div>
        {data.seller.registeredDAOs.length > 0 && (
          <div className="mt-5 rounded border border-slate-200 bg-slate-50 p-4 text-sm">
            <p className="font-semibold text-slate-700">Tenant relationship</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {data.seller.registeredDAOs.map((dao) => (
                <span key={dao} className="rounded border border-slate-300 bg-white px-3 py-1 font-medium text-slate-700">
                  {dao}
                </span>
              ))}
            </div>
            <Link to="/marketplace/tenants/tenant-axodus-dao" className="mt-3 inline-flex text-sm font-semibold text-teal-700">
              Open DAO storefront preview
            </Link>
          </div>
        )}
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <GovernanceAuthorityPanel authority={data.authority} />
        <GovernanceEnforcementPanel enforcement={data.enforcement} />
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            seller={data.seller}
            enforcement={data.governanceEnforcement.records.find((record) => record.entityId === product.id)}
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

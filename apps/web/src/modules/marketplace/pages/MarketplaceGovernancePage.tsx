import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { useMarketplaceDashboard } from "../hooks/useMarketplace";
import { getSellerById } from "../services/marketplaceService";

export function MarketplaceGovernancePage() {
  const { data } = useMarketplaceDashboard();
  if (!data) return null;

  const reviewProducts = data.products.filter((product) => product.governanceStatus !== "compliant");

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Governance validation</p>
        <h1 className="mt-2 text-3xl font-semibold">Product and seller standing</h1>
      </div>
      <section className="grid gap-4 md:grid-cols-3">
        <GovernanceTile icon={<CheckCircle2 />} label="Compliant products" value={data.products.length - reviewProducts.length} />
        <GovernanceTile icon={<AlertTriangle />} label="Pending review" value={data.metrics.pendingGovernance} />
        <GovernanceTile icon={<ShieldAlert />} label="Restricted products" value={data.metrics.restrictedProducts} />
      </section>
      <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold">ACS moderation workflows</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          {["Product Validation", "Seller Review", "DAO Plugin Audit", "Risk Escalation", "License Conflict Review"].map((workflow) => (
            <div key={workflow} className="rounded border border-slate-200 bg-slate-50 p-3 text-sm font-medium">
              {workflow}
            </div>
          ))}
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reviewProducts.map((product) => (
          <ProductCard key={product.id} product={product} seller={getSellerById(product.sellerId)} />
        ))}
      </section>
    </div>
  );
}

function GovernanceTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-slate-600">{icon}</div>
      <p className="mt-4 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}

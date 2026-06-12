import { Link } from "react-router-dom";
import { useMarketplaceHome } from "../hooks/useMarketplace";

export function ProductCategoriesPage() {
  const { data } = useMarketplaceHome();
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Categories</p>
        <h1 className="mt-2 text-3xl font-semibold">Marketplace product standards</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Object.entries(data.metrics.categories).map(([category, count]) => (
          <Link key={category} to={`/marketplace/explore`} className="rounded border border-slate-200 bg-white p-5 shadow-sm hover:border-teal-700">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{count} listings</p>
            <h2 className="mt-2 text-xl font-semibold">{category}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              NFT-bound and license-ready assets with governance standing, seller accountability and delivery boundaries.
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { Layers, Trophy } from "lucide-react";
import type { CollectionView } from "../services/marketplaceService";
import { ProductStandingBadge } from "./StatusBadge";

export function CollectionCard({ view }: { view: CollectionView }) {
  const { collection, metrics } = view;

  return (
    <article className="overflow-hidden rounded border border-slate-200 bg-white shadow-sm">
      <img src={collection.image} alt="" className="h-44 w-full object-cover" />
      <div className="space-y-4 p-4">
        <div className="flex flex-wrap gap-2">
          <ProductStandingBadge status={collection.governanceStatus} />
          <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700">
            {collection.assetType}
          </span>
          <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700">
            {collection.origin}
          </span>
        </div>
        <div>
          <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <Trophy size={14} /> Rank #{metrics.ranking}
          </p>
          <Link
            to={`/marketplace/collections/${collection.slug}`}
            className="mt-1 block text-lg font-semibold hover:text-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            {collection.name}
          </Link>
          <p className="mt-2 text-sm leading-6 text-slate-600">{collection.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Metric label="Items" value={metrics.itemCount} />
          <Metric label="Floor" value={`${metrics.floorPrice} USDC`} />
          <Metric label="Volume" value={`${metrics.volume} USDC`} />
          <Metric label="Bids" value={metrics.bids} />
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-slate-600">
          <span className="flex items-center gap-1">
            <Layers size={14} /> {collection.chain}
          </span>
          <span className="break-all">{collection.contractAddress}</span>
        </div>
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

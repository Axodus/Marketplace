import { Link } from "react-router-dom";
import { Clock, Layers, ShieldCheck } from "lucide-react";
import type { Product, Seller } from "../types/marketplace";
import { ProductStandingBadge, SellerStandingBadge } from "./StatusBadge";

export function ProductCard({ product, seller }: { product: Product; seller?: Seller }) {
  return (
    <article className="overflow-hidden rounded border border-slate-200 bg-white shadow-sm">
      <img src={product.images[0]} alt="" className="h-44 w-full object-cover" />
      <div className="space-y-4 p-4">
        <div className="flex flex-wrap gap-2">
          <ProductStandingBadge status={product.governanceStatus} />
          <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700">
            {product.tokenStandard}
          </span>
          <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700">
            {product.listingType}
          </span>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{product.category}</p>
          <Link to={`/marketplace/products/${product.slug}`} className="mt-1 block text-lg font-semibold hover:text-teal-700">
            {product.title}
          </Link>
          <p className="mt-2 text-sm leading-6 text-slate-600">{product.shortDescription}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Price</p>
            <p className="font-semibold">
              {product.pricing.amount} {product.pricing.currency}
            </p>
          </div>
          <div className="rounded border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Royalty</p>
            <p className="font-semibold">{product.royaltyModel.bps / 100}%</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-slate-600">
          <span className="flex items-center gap-1">
            <Layers size={14} /> {product.supportedChains.join(", ")}
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck size={14} /> {product.constitutionalStanding}
          </span>
          {product.auction && (
            <span className="flex items-center gap-1">
              <Clock size={14} /> {product.auction.bidCount} bids
            </span>
          )}
        </div>
        {seller && (
          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
            <Link to={`/marketplace/sellers/${seller.id}`} className="text-sm font-medium text-slate-700 hover:text-teal-700">
              {seller.name}
            </Link>
            <SellerStandingBadge status={seller.governanceStanding} />
          </div>
        )}
      </div>
    </article>
  );
}

import type { ProductStanding, SellerStanding } from "../types/marketplace";

const productStyles: Record<ProductStanding, string> = {
  compliant: "border-emerald-200 bg-emerald-50 text-emerald-800",
  "under-review": "border-amber-200 bg-amber-50 text-amber-800",
  restricted: "border-red-200 bg-red-50 text-red-800",
  suspended: "border-slate-300 bg-slate-200 text-slate-700",
  deprecated: "border-slate-300 bg-slate-100 text-slate-600"
};

const sellerStyles: Record<SellerStanding, string> = {
  verified: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  sanctioned: "border-red-200 bg-red-50 text-red-800",
  restricted: "border-red-200 bg-red-50 text-red-800",
  suspended: "border-slate-300 bg-slate-200 text-slate-700"
};

export function ProductStandingBadge({ status }: { status: ProductStanding }) {
  return <span className={`rounded border px-2 py-1 text-xs font-semibold ${productStyles[status]}`}>{status}</span>;
}

export function SellerStandingBadge({ status }: { status: SellerStanding }) {
  return <span className={`rounded border px-2 py-1 text-xs font-semibold ${sellerStyles[status]}`}>{status}</span>;
}

export function NeutralBadge({ children }: { children: React.ReactNode }) {
  return <span className="rounded border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-600">{children}</span>;
}

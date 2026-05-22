import { Gavel } from "lucide-react";
import type { ListingRuntimeSnapshot } from "../services/listingRuntime";
import { NeutralBadge } from "./StatusBadge";

const statusLabels: Record<ListingRuntimeSnapshot["status"], string> = {
  not_live_configured: "Readiness only",
  disconnected_wallet: "Disconnected wallet",
  unsupported_chain: "Unsupported chain",
  hydrated_active: "Hydrated active",
  hydrated_expired: "Hydrated expired",
  hydrated_sold: "Hydrated sold",
  hydrated_cancelled: "Hydrated cancelled",
  read_error: "Read error"
};

const statusStyles: Record<ListingRuntimeSnapshot["status"], string> = {
  not_live_configured: "border-slate-200 bg-slate-50 text-slate-700",
  disconnected_wallet: "border-amber-200 bg-amber-50 text-amber-900",
  unsupported_chain: "border-amber-200 bg-amber-50 text-amber-900",
  hydrated_active: "border-emerald-200 bg-emerald-50 text-emerald-800",
  hydrated_expired: "border-slate-300 bg-slate-100 text-slate-700",
  hydrated_sold: "border-slate-300 bg-slate-100 text-slate-700",
  hydrated_cancelled: "border-red-200 bg-red-50 text-red-800",
  read_error: "border-red-200 bg-red-50 text-red-800"
};

export function ListingRuntimePanel({ snapshot, loading }: { snapshot?: ListingRuntimeSnapshot; loading?: boolean }) {
  if (loading || !snapshot) {
    return (
      <div className="rounded border border-slate-200 bg-white p-4 shadow-sm" role="status" aria-live="polite">
        <div className="flex items-center gap-2 text-slate-950">
          <Gavel size={20} />
          <h2 className="font-semibold">Listing runtime</h2>
        </div>
        <p className="mt-3 text-sm text-slate-600">Hydrating readonly listing state. No buy, bid, cancel or settlement write is executed.</p>
      </div>
    );
  }

  return (
    <div className="rounded border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-slate-950">
          <Gavel size={20} />
          <h2 className="font-semibold">Listing runtime</h2>
        </div>
        <span className={`rounded border px-2 py-1 text-xs font-semibold ${statusStyles[snapshot.status]}`}>{statusLabels[snapshot.status]}</span>
      </div>

      <div className="mt-3 space-y-1 text-sm leading-6 text-slate-600">
        <p>Type: {snapshot.listingType}</p>
        <p>Wallet: {snapshot.walletAddress ?? "not connected"}</p>
        <p>Chain: {snapshot.chainName}</p>
        <p>Marketplace contract: {snapshot.marketplaceContractAddress ?? "not configured"}</p>
        <p>Listing ID: {snapshot.listingId ?? "not configured"}</p>
        <p>Listing status: {snapshot.fixedListing.status}</p>
        <p>Price: {snapshot.fixedListing.price ?? "not hydrated"}</p>
        <p>Expiration: {snapshot.fixedListing.expiration ?? "not hydrated"}</p>
        {snapshot.auction.type !== "none" && (
          <>
            <p>Auction status: {snapshot.auction.status}</p>
            <p>Highest bid: {snapshot.auction.highestBid ?? "not hydrated"}</p>
            <p>Bid count: {snapshot.auction.bidCount ?? "not hydrated"}</p>
            <p>Current price: {snapshot.auction.currentPrice ?? "not hydrated"}</p>
          </>
        )}
        <p>Royalty recipient: {snapshot.royalty.recipient ?? "not hydrated"}</p>
        <p>Royalty amount: {snapshot.royalty.amount ?? "not hydrated"}</p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <NeutralBadge>{snapshot.contractReadEnabled ? "Readonly contract read" : "No contract read"}</NeutralBadge>
        <NeutralBadge>{snapshot.readMethods.length ? snapshot.readMethods.join(" / ") : "No read method"}</NeutralBadge>
        <NeutralBadge>No buy write</NeutralBadge>
        <NeutralBadge>No bid write</NeutralBadge>
        <NeutralBadge>No settlement</NeutralBadge>
      </div>

      {snapshot.reasons.length > 0 && (
        <div className="mt-3 rounded border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-700">
          {snapshot.reasons.join(" / ")}
        </div>
      )}
    </div>
  );
}

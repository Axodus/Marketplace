import { WalletCards } from "lucide-react";
import type { NftOwnershipSnapshot } from "../services/nftOwnershipRuntime";
import { NeutralBadge } from "./StatusBadge";

const statusLabels: Record<NftOwnershipSnapshot["status"], string> = {
  not_nft_bound: "Not NFT-bound",
  offchain_license: "Offchain license",
  disconnected_wallet: "Disconnected wallet",
  unsupported_chain: "Unsupported chain",
  unreadable_contract: "Readiness only",
  verified_owner: "Verified ownership",
  ownership_mismatch: "Ownership mismatch",
  read_error: "Read error"
};

const statusStyles: Record<NftOwnershipSnapshot["status"], string> = {
  not_nft_bound: "border-slate-200 bg-slate-50 text-slate-700",
  offchain_license: "border-slate-200 bg-slate-50 text-slate-700",
  disconnected_wallet: "border-amber-200 bg-amber-50 text-amber-900",
  unsupported_chain: "border-amber-200 bg-amber-50 text-amber-900",
  unreadable_contract: "border-slate-200 bg-slate-50 text-slate-700",
  verified_owner: "border-emerald-200 bg-emerald-50 text-emerald-800",
  ownership_mismatch: "border-red-200 bg-red-50 text-red-800",
  read_error: "border-red-200 bg-red-50 text-red-800"
};

export function NftOwnershipPanel({ snapshot, loading }: { snapshot?: NftOwnershipSnapshot; loading?: boolean }) {
  if (loading || !snapshot) {
    return (
      <div className="rounded border border-slate-200 bg-white p-4 shadow-sm" role="status" aria-live="polite">
        <div className="flex items-center gap-2 text-slate-950">
          <WalletCards size={20} />
          <h2 className="font-semibold">NFT ownership</h2>
        </div>
        <p className="mt-3 text-sm text-slate-600">Reading readonly ownership state. No mint, transfer, approval or contract write is executed.</p>
      </div>
    );
  }

  return (
    <div className="rounded border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-slate-950">
          <WalletCards size={20} />
          <h2 className="font-semibold">NFT ownership</h2>
        </div>
        <span className={`rounded border px-2 py-1 text-xs font-semibold ${statusStyles[snapshot.status]}`}>
          {statusLabels[snapshot.status]}
        </span>
      </div>

      <div className="mt-3 space-y-1 text-sm leading-6 text-slate-600">
        <p>Kind: {snapshot.kind}</p>
        <p>Wallet: {snapshot.walletAddress ?? "not connected"}</p>
        <p>Chain: {snapshot.chainName}</p>
        <p>Required chains: {snapshot.requiredChains.join(", ")}</p>
        <p>Read method: {snapshot.readMethod}</p>
        <p>Contract: {snapshot.contractAddress ?? "not available"}</p>
        <p>Token ID: {snapshot.tokenId ?? "not available"}</p>
        {snapshot.ownerAddress && <p>Owner: {snapshot.ownerAddress}</p>}
        {snapshot.balance && <p>Balance: {snapshot.balance}</p>}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <NeutralBadge>{snapshot.contractReadEnabled ? "Readonly contract read" : "No contract read"}</NeutralBadge>
        <NeutralBadge>No mint</NeutralBadge>
        <NeutralBadge>No transfer</NeutralBadge>
        <NeutralBadge>No wallet signature</NeutralBadge>
      </div>

      {snapshot.reasons.length > 0 && (
        <div className="mt-3 rounded border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-700">
          {snapshot.reasons.join(" / ")}
        </div>
      )}
    </div>
  );
}

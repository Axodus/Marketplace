import { ShieldAlert } from "lucide-react";
import type { WalletSecuritySnapshot } from "../services/walletSecurityRuntime";
import { NeutralBadge } from "./StatusBadge";

const statusLabels: Record<WalletSecuritySnapshot["status"], string> = {
  secure_preview: "Security preview clear",
  warning: "Security warning",
  danger: "Security danger",
  not_ready: "Not ready"
};

const statusStyles: Record<WalletSecuritySnapshot["status"], string> = {
  secure_preview: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  danger: "border-red-200 bg-red-50 text-red-800",
  not_ready: "border-slate-200 bg-slate-50 text-slate-700"
};

export function WalletSecurityPanel({ snapshot, loading }: { snapshot?: WalletSecuritySnapshot; loading?: boolean }) {
  if (loading || !snapshot) {
    return (
      <div className="rounded border border-slate-200 bg-white p-4 shadow-sm" role="status" aria-live="polite">
        <div className="flex items-center gap-2 text-slate-950">
          <ShieldAlert size={20} />
          <h2 className="font-semibold">Wallet security</h2>
        </div>
        <p className="mt-3 text-sm text-slate-600">Evaluating wallet, approval and ownership security. No revocation, signature or transaction is executed.</p>
      </div>
    );
  }

  return (
    <div className="rounded border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-slate-950">
          <ShieldAlert size={20} />
          <h2 className="font-semibold">Wallet security</h2>
        </div>
        <span className={`rounded border px-2 py-1 text-xs font-semibold ${statusStyles[snapshot.status]}`}>{statusLabels[snapshot.status]}</span>
      </div>

      <div className="mt-3 space-y-1 text-sm leading-6 text-slate-600">
        <p>Wallet: {snapshot.walletAddress ?? "not connected"}</p>
        <p>Chain: {snapshot.chainName}</p>
        <p>Chain mismatch: {snapshot.chainProtection.mismatch ? "yes" : "no"}</p>
        <p>Contract valid: {snapshot.assetProtection.contractValid ? "yes" : "no"}</p>
        <p>Token ID valid: {snapshot.assetProtection.tokenIdValid ? "yes" : "no"}</p>
        <p>Approval status: {snapshot.approvalVisibility.status}</p>
        <p>Approval operator: {snapshot.approvalVisibility.operatorAddress ?? "not configured"}</p>
        <p>Ownership status: {snapshot.ownershipSecurity.ownershipStatus}</p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <NeutralBadge>{snapshot.permissionVisibility.canPreviewPurchase ? "Purchase preview allowed" : "Purchase preview guarded"}</NeutralBadge>
        <NeutralBadge>{snapshot.approvalVisibility.dangerousPermissionWarning ? "Dangerous approval visible" : "No dangerous approval read"}</NeutralBadge>
        <NeutralBadge>No approval revocation</NeutralBadge>
        <NeutralBadge>No sendTransaction</NeutralBadge>
      </div>

      {snapshot.warnings.length > 0 && (
        <div className="mt-3 rounded border border-amber-200 bg-amber-50 p-3 text-xs font-medium text-amber-900">
          {snapshot.warnings.join(" / ")}
        </div>
      )}
    </div>
  );
}

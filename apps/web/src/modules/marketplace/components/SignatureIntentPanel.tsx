import { FileSignature } from "lucide-react";
import type { SignatureIntentSnapshot } from "../services/signatureRuntime";
import { NeutralBadge } from "./StatusBadge";

const statusLabels: Record<SignatureIntentSnapshot["status"], string> = {
  preview_ready: "Preview ready",
  wallet_disconnected: "Wallet disconnected",
  unsupported_chain: "Unsupported chain",
  missing_contract: "Missing contract",
  gas_preview_unavailable: "Gas unavailable"
};

const statusStyles: Record<SignatureIntentSnapshot["status"], string> = {
  preview_ready: "border-emerald-200 bg-emerald-50 text-emerald-800",
  wallet_disconnected: "border-amber-200 bg-amber-50 text-amber-900",
  unsupported_chain: "border-amber-200 bg-amber-50 text-amber-900",
  missing_contract: "border-slate-200 bg-slate-50 text-slate-700",
  gas_preview_unavailable: "border-amber-200 bg-amber-50 text-amber-900"
};

export function SignatureIntentPanel({ snapshot, loading }: { snapshot?: SignatureIntentSnapshot; loading?: boolean }) {
  if (loading || !snapshot) {
    return (
      <div className="rounded border border-slate-200 bg-white p-4 shadow-sm" role="status" aria-live="polite">
        <div className="flex items-center gap-2 text-slate-950">
          <FileSignature size={20} />
          <h2 className="font-semibold">Signature intent</h2>
        </div>
        <p className="mt-3 text-sm text-slate-600">Preparing transaction preview. No signature or sendTransaction call is executed.</p>
      </div>
    );
  }

  return (
    <div className="rounded border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-slate-950">
          <FileSignature size={20} />
          <h2 className="font-semibold">Signature intent</h2>
        </div>
        <span className={`rounded border px-2 py-1 text-xs font-semibold ${statusStyles[snapshot.status]}`}>{statusLabels[snapshot.status]}</span>
      </div>

      <div className="mt-3 space-y-1 text-sm leading-6 text-slate-600">
        <p>Action: {snapshot.action}</p>
        <p>Wallet: {snapshot.walletAddress ?? "not connected"}</p>
        <p>Chain: {snapshot.chainName}</p>
        <p>Contract: {snapshot.contractAddress ?? "not configured"}</p>
        <p>Value: {snapshot.value}</p>
        <p>Gas preview: {snapshot.gasLimitPreview ?? "not available"}</p>
        <p className="break-all">Calldata: {snapshot.calldata}</p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <NeutralBadge>No signature</NeutralBadge>
        <NeutralBadge>No sendTransaction</NeutralBadge>
        <NeutralBadge>No contract write</NeutralBadge>
        <NeutralBadge>{snapshot.risk.level} risk preview</NeutralBadge>
      </div>

      <div className="mt-3 rounded border border-amber-200 bg-amber-50 p-3 text-xs font-medium text-amber-900">
        {snapshot.risk.warnings.join(" / ")}
      </div>
    </div>
  );
}

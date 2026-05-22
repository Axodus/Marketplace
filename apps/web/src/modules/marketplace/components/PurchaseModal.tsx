import { useEffect, useRef, useState } from "react";
import { Gavel, ShoppingCart, X } from "lucide-react";
import { apiClient } from "../../../services/apiClient";
import type { Product, PurchaseRecord } from "../types/marketplace";
import { AuctionService, MarketplaceContractAdapter, StorageAccessService } from "../services/boundaryAdapters";
import { instrumentMarketplaceError, traceMarketplaceLifecycle } from "../services/runtimeTelemetry";

export function PurchaseModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [record, setRecord] = useState<PurchaseRecord | null>(null);
  const [bidAmount, setBidAmount] = useState(AuctionService.minimumBid(product) ?? product.pricing.amount);
  const [adapterError, setAdapterError] = useState<string | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const signedUrl = StorageAccessService.previewSignedUrl(product);

  useEffect(() => {
    closeButtonRef.current?.focus();
    traceMarketplaceLifecycle("purchase-modal", "observed", { productId: product.id });

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, product.id]);

  async function buyNow() {
    try {
      setAdapterError(null);
      await MarketplaceContractAdapter.buyNow(product);
      setRecord(await apiClient.createPurchasePreview(product));
    } catch (error) {
      instrumentMarketplaceError("MarketplaceContractAdapter.buyNow", error, { productId: product.id });
      setAdapterError("Buy-now preview failed. No settlement or wallet action was executed.");
    }
  }

  async function placeBid() {
    try {
      setAdapterError(null);
      await MarketplaceContractAdapter.placeBid(product, bidAmount);
      setRecord({
        id: `bid-${Date.now()}`,
        buyer: "0xMockBuyer...A11C",
        productId: product.id,
        sellerId: product.sellerId,
        timestamp: new Date().toISOString(),
        amount: bidAmount,
        currency: product.pricing.currency,
        licenseIssued: "pending-auction-settlement",
        status: "pending-governance-review",
        governanceReviewRequired: product.governanceRequired,
        signedUrlPreview: signedUrl ?? undefined
      });
    } catch (error) {
      instrumentMarketplaceError("MarketplaceContractAdapter.placeBid", error, { productId: product.id, bidAmount });
      setAdapterError("Bid preview failed. No contract write or wallet action was executed.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" role="presentation">
      <div className="w-full max-w-xl rounded border border-slate-200 bg-white shadow-panel" role="dialog" aria-modal="true" aria-labelledby="purchase-preview-title" aria-describedby="purchase-preview-description">
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Mock settlement</p>
            <h2 id="purchase-preview-title" className="text-xl font-semibold">{product.title}</h2>
          </div>
          <button ref={closeButtonRef} type="button" onClick={onClose} className="rounded border border-slate-300 p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700" aria-label="Close purchase preview">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-4 p-4">
          <p id="purchase-preview-description" className="text-sm leading-6 text-slate-600">
            This MVP does not execute payment, wallet signing, bridge transfer or contract settlement. It previews the contract adapter,
            EIP-2981 royalty, license issuance and Greenfield signed URL boundary.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={buyNow}
              className="flex items-center justify-center gap-2 rounded bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            >
              <ShoppingCart size={18} /> Buy now preview
            </button>
            <div className="flex gap-2">
              <input
                type="number"
                value={bidAmount}
                onChange={(event) => setBidAmount(Number(event.target.value))}
                className="min-w-0 flex-1 rounded border border-slate-300 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                aria-label="Bid amount preview"
              />
              <button
                type="button"
                onClick={placeBid}
                disabled={!AuctionService.canBid(product)}
                className="flex items-center gap-2 rounded border border-slate-300 px-4 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:opacity-50"
              >
                <Gavel size={18} /> Bid
              </button>
            </div>
          </div>
          {adapterError && (
            <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
              {adapterError}
            </div>
          )}
          {record && (
            <div className="rounded border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900" role="status" aria-live="polite">
              <p className="font-semibold">Mock record created: {record.status}</p>
              <p>
                {record.amount} {record.currency} | license {record.licenseIssued}
              </p>
              {record.signedUrlPreview && <p className="mt-2 break-all">Signed URL preview: {record.signedUrlPreview}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

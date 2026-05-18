import { useState } from "react";
import { Gavel, ShoppingCart, X } from "lucide-react";
import type { Product, PurchaseRecord } from "../types/marketplace";
import { AuctionService, MarketplaceContractAdapter, StorageAccessService } from "../services/boundaryAdapters";

export function PurchaseModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [record, setRecord] = useState<PurchaseRecord | null>(null);
  const [bidAmount, setBidAmount] = useState(AuctionService.minimumBid(product) ?? product.pricing.amount);
  const signedUrl = StorageAccessService.previewSignedUrl(product);

  async function buyNow() {
    const result = await MarketplaceContractAdapter.buyNow(product);
    setRecord(result.purchase);
  }

  async function placeBid() {
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
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-xl rounded border border-slate-200 bg-white shadow-panel">
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Mock settlement</p>
            <h2 className="text-xl font-semibold">{product.title}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded border border-slate-300 p-2 text-slate-600 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-4 p-4">
          <p className="text-sm leading-6 text-slate-600">
            This MVP does not execute payment, wallet signing, bridge transfer or contract settlement. It previews the contract adapter,
            EIP-2981 royalty, license issuance and Greenfield signed URL boundary.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={buyNow}
              className="flex items-center justify-center gap-2 rounded bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              <ShoppingCart size={18} /> Buy now preview
            </button>
            <div className="flex gap-2">
              <input
                type="number"
                value={bidAmount}
                onChange={(event) => setBidAmount(Number(event.target.value))}
                className="min-w-0 flex-1 rounded border border-slate-300 px-3 py-2"
              />
              <button
                type="button"
                onClick={placeBid}
                disabled={!AuctionService.canBid(product)}
                className="flex items-center gap-2 rounded border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-50"
              >
                <Gavel size={18} /> Bid
              </button>
            </div>
          </div>
          {record && (
            <div className="rounded border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
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

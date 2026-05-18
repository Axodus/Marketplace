import type { Product } from "../modules/marketplace/types/marketplace";
import { MarketplaceContractAdapter } from "../modules/marketplace/services/boundaryAdapters";

export function BuyNow({ product, onIssued }: { product: Product; onIssued?: (id: string) => void }) {
  async function handleBuyNow() {
    const result = await MarketplaceContractAdapter.buyNow(product);
    onIssued?.(result.purchase.id);
  }

  return (
    <button type="button" onClick={handleBuyNow} className="rounded bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
      Buy now preview
    </button>
  );
}

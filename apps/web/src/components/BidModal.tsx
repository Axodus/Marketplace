import { PurchaseModal } from "../modules/marketplace/components/PurchaseModal";
import type { Product } from "../modules/marketplace/types/marketplace";

export function BidModal({ product, onClose }: { product: Product; onClose: () => void }) {
  return <PurchaseModal product={product} onClose={onClose} />;
}

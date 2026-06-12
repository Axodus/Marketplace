import { Navigate, useParams } from "react-router-dom";
import { useProductByItemRef } from "../hooks/useMarketplace";

export function LegacyItemPage() {
  const { chain, contract, id } = useParams();
  const { data, error } = useProductByItemRef(chain, contract, id);

  if (error) {
    return (
      <div className="rounded border border-amber-200 bg-amber-50 p-5 text-amber-900">
        <p className="font-semibold">NFT item reference not found in mock registry.</p>
        <p className="mt-2 text-sm">
          The legacy route is active, but this mock dataset only resolves registered contract/token references.
        </p>
      </div>
    );
  }

  if (!data) return null;

  return <Navigate to={`/marketplace/products/${data.product.slug}`} replace />;
}

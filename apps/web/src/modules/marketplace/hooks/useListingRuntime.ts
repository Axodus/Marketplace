import { useQuery } from "@tanstack/react-query";
import { useWallet } from "../../../hooks/useWallet";
import { hydrateListingRuntime } from "../services/listingRuntime";
import type { Product } from "../types/marketplace";

export function useListingRuntime(product?: Product) {
  const wallet = useWallet();

  return useQuery({
    queryKey: ["marketplace-listing-runtime", product?.id, product?.listingId, wallet.address, wallet.chainId, wallet.status],
    enabled: Boolean(product),
    queryFn: () => hydrateListingRuntime(product!, wallet),
    staleTime: 20_000,
    retry: 1
  });
}

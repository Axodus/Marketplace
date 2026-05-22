import { useQuery } from "@tanstack/react-query";
import { useWallet } from "../../../hooks/useWallet";
import type { Product } from "../types/marketplace";
import { verifyNftOwnership } from "../services/nftOwnershipRuntime";

export function useNftOwnership(product?: Product) {
  const wallet = useWallet();

  return useQuery({
    queryKey: ["marketplace-nft-ownership", product?.id, wallet.address, wallet.chainId, wallet.status],
    enabled: Boolean(product),
    queryFn: () => verifyNftOwnership(product!, wallet),
    staleTime: 20_000,
    retry: 1
  });
}

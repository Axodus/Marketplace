import { useQuery } from "@tanstack/react-query";
import { useWallet } from "../../../hooks/useWallet";
import { evaluateWalletSecurity } from "../services/walletSecurityRuntime";
import type { NftOwnershipSnapshot } from "../services/nftOwnershipRuntime";
import type { Product } from "../types/marketplace";

export function useWalletSecurity(product?: Product, ownership?: NftOwnershipSnapshot) {
  const wallet = useWallet();

  return useQuery({
    queryKey: ["marketplace-wallet-security", product?.id, ownership?.status, wallet.address, wallet.chainId, wallet.status],
    enabled: Boolean(product),
    queryFn: () => evaluateWalletSecurity(product!, wallet, ownership),
    staleTime: 20_000,
    retry: 1
  });
}

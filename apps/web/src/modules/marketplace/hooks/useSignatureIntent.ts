import { useQuery } from "@tanstack/react-query";
import { useWallet } from "../../../hooks/useWallet";
import { prepareSignatureIntent, type SignatureIntentAction } from "../services/signatureRuntime";
import type { Product } from "../types/marketplace";

export function useSignatureIntent(product: Product | undefined, action: SignatureIntentAction, bidAmount?: number) {
  const wallet = useWallet();

  return useQuery({
    queryKey: ["marketplace-signature-intent", product?.id, action, bidAmount, wallet.address, wallet.chainId, wallet.status],
    enabled: Boolean(product),
    queryFn: () => prepareSignatureIntent(product!, wallet, action, { bidAmount }),
    staleTime: 20_000,
    retry: 1
  });
}

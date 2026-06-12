import type { MarketplaceStore, ProductEntity, SettlementRuntime, SettlementRuntimeSnapshot } from "../dto/contracts.js";

function getPricing(product?: ProductEntity) {
  const pricing = product?.pricing as { amount?: number; currency?: string } | undefined;
  return {
    amount: Number(pricing?.amount ?? 0),
    currency: typeof pricing?.currency === "string" ? pricing.currency : "USDC"
  };
}

function isBlocked(product?: ProductEntity, controlledRollout?: boolean) {
  if (!controlledRollout) return "controlled-rollout-required";
  if (!product) return "product-not-found";
  if (product.governanceStatus === "restricted" || product.governanceStatus === "suspended") return `governance-${product.governanceStatus}`;
  return null;
}

export function buildSettlementRuntime(input: {
  store: MarketplaceStore;
  product: ProductEntity | undefined;
  buyer: string;
  purchaseId: string | null;
  controlledRollout?: boolean;
}): SettlementRuntime {
  const reason = isBlocked(input.product, input.controlledRollout);
  const pricing = getPricing(input.product);
  const now = new Date().toISOString();
  const transactionId = `settlement-tx-${crypto.randomUUID()}`;
  return {
    id: `settlement-${crypto.randomUUID()}`,
    purchaseId: reason ? null : input.purchaseId,
    productId: input.product?.id ?? "unknown",
    buyer: input.buyer,
    sellerId: input.product?.sellerId ?? null,
    amount: pricing.amount,
    currency: pricing.currency,
    status: reason ? "blocked" : "confirmed",
    transaction: {
      id: transactionId,
      lifecycle: reason ? "blocked" : "confirmed",
      confirmationId: reason ? null : `confirmation-${transactionId}`,
      reasonCodes: reason ? [reason] : ["controlled-settlement-confirmed", "no-wallet-execution", "no-chain-write"],
      executedAt: now
    },
    controlledRollout: true,
    settlementRuntimeEnabled: true,
    walletExecutionEnabled: false,
    blockchainWritesEnabled: false,
    externalPaymentEnabled: false,
    treasuryMovementEnabled: false
  };
}

export function buildSettlementRuntimeSnapshot(records: SettlementRuntime[]): SettlementRuntimeSnapshot {
  return {
    id: `settlement-snapshot-${crypto.randomUUID()}`,
    records,
    metrics: {
      confirmed: records.filter((record) => record.status === "confirmed").length,
      blocked: records.filter((record) => record.status === "blocked").length,
      totalVolume: records.filter((record) => record.status === "confirmed").reduce((sum, record) => sum + record.amount, 0)
    },
    controlledRollout: true,
    walletExecutionEnabled: false,
    blockchainWritesEnabled: false,
    generatedAt: new Date().toISOString()
  };
}

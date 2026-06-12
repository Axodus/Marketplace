import type {
  MarketplaceStore,
  ProductEntity,
  RoyaltyDistributionRequest,
  RoyaltyDistributionRuntime,
  RoyaltyDistributionSnapshot,
  SettlementRuntime
} from "../dto/contracts.js";

export function buildRoyaltyDistributionRuntime(store: MarketplaceStore, input: RoyaltyDistributionRequest): RoyaltyDistributionRuntime {
  const settlement = (store.settlements ?? []).find((item) => item.id === input.settlementId);
  const product = settlement ? store.products.find((item) => item.id === settlement.productId) : undefined;
  const reasonCodes = getReasonCodes(input, settlement, product);
  const status = reasonCodes.length > 0 ? "blocked" : "allocated";
  const grossAmount = settlement?.amount ?? 0;
  const currency = settlement?.currency ?? "USDC";
  const royalty = getRoyalty(product);
  const royaltyAmount = round((grossAmount * royalty.bps) / 10_000);
  const platformFee = round(grossAmount * 0.025);
  const ecosystemFee = round(grossAmount * 0.01);
  const treasuryAmount = round(platformFee + ecosystemFee);
  const creatorPayout = round(Math.max(grossAmount - royaltyAmount - treasuryAmount, 0));

  return {
    id: `royalty-distribution-${crypto.randomUUID()}`,
    settlementId: input.settlementId,
    productId: settlement?.productId ?? "unknown",
    sellerId: settlement?.sellerId ?? null,
    currency,
    grossAmount,
    status,
    reasonCodes,
    eip2981: {
      standard: "EIP-2981",
      bps: royalty.bps,
      recipient: royalty.recipient,
      royaltyAmount,
      settlementReady: status === "allocated"
    },
    creatorPayout: {
      recipient: settlement?.sellerId ?? "unknown-seller",
      amount: status === "allocated" ? creatorPayout : 0,
      status,
      payoutExecutionEnabled: false
    },
    treasuryAllocation: {
      recipient: "Axodus Treasury",
      platformFee: status === "allocated" ? platformFee : 0,
      ecosystemFee: status === "allocated" ? ecosystemFee : 0,
      treasuryAmount: status === "allocated" ? treasuryAmount : 0,
      status,
      treasuryMovementEnabled: false
    },
    accounting: {
      royaltyAccountingReady: true,
      creatorPayoutReady: true,
      treasuryAllocationReady: true,
      externalAccountingEnabled: false
    },
    controlledRollout: true,
    royaltyRuntimeEnabled: true,
    externalPayoutEnabled: false,
    contractExecutionEnabled: false,
    treasuryMovementEnabled: false,
    createdAt: new Date().toISOString()
  };
}

export function buildRoyaltyDistributionSnapshot(records: RoyaltyDistributionRuntime[]): RoyaltyDistributionSnapshot {
  const allocated = records.filter((record) => record.status === "allocated");
  return {
    id: `royalty-distribution-snapshot-${crypto.randomUUID()}`,
    records,
    metrics: {
      allocated: allocated.length,
      blocked: records.filter((record) => record.status === "blocked").length,
      grossVolume: round(allocated.reduce((sum, record) => sum + record.grossAmount, 0)),
      royaltyTotal: round(allocated.reduce((sum, record) => sum + record.eip2981.royaltyAmount, 0)),
      creatorPayoutTotal: round(allocated.reduce((sum, record) => sum + record.creatorPayout.amount, 0)),
      treasuryTotal: round(allocated.reduce((sum, record) => sum + record.treasuryAllocation.treasuryAmount, 0))
    },
    eip2981SettlementReady: true,
    creatorPayoutRuntimeReady: true,
    treasuryAllocationRuntimeReady: true,
    externalPayoutEnabled: false,
    contractExecutionEnabled: false,
    treasuryMovementEnabled: false,
    generatedAt: new Date().toISOString()
  };
}

function getReasonCodes(input: RoyaltyDistributionRequest, settlement?: SettlementRuntime, product?: ProductEntity) {
  const reasons: string[] = [];
  if (input.controlledRollout !== true) reasons.push("controlled-rollout-required");
  if (!settlement) reasons.push("settlement-not-found");
  if (settlement && settlement.status !== "confirmed") reasons.push("settlement-not-confirmed");
  if (product && product.governanceStatus !== "compliant") reasons.push(`governance-${product.governanceStatus}`);
  return reasons;
}

function getRoyalty(product?: ProductEntity) {
  const model = product?.royaltyModel as { bps?: number; recipient?: string; standard?: string } | undefined;
  return {
    bps: Number(model?.bps ?? 0),
    recipient: typeof model?.recipient === "string" && model.recipient ? model.recipient : "unknown-royalty-recipient"
  };
}

function round(value: number) {
  return Number(value.toFixed(4));
}

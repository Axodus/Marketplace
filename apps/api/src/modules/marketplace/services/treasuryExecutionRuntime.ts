import type {
  MarketplaceStore,
  ProductEntity,
  RoyaltyDistributionRuntime,
  TreasuryExecutionRequest,
  TreasuryExecutionRoute,
  TreasuryExecutionRuntime,
  TreasuryExecutionSnapshot
} from "../dto/contracts.js";

export function executeTreasuryRuntime(store: MarketplaceStore, input: TreasuryExecutionRequest): TreasuryExecutionRuntime {
  const distribution = (store.royaltyDistributions ?? []).find((item) => item.id === input.royaltyDistributionId);
  const product = distribution ? store.products.find((item) => item.id === distribution.productId) : undefined;
  const tenantId = getTenantId(product);
  const governanceReasons = getGovernanceReasonCodes(input, distribution, product);
  const status: TreasuryExecutionRuntime["status"] = governanceReasons.length > 0 ? "blocked" : "executed";
  const routes = buildRoutes(distribution, product, status);
  const reconciliation = buildReconciliation(distribution, routes, status);

  return {
    id: `treasury-execution-${crypto.randomUUID()}`,
    royaltyDistributionId: input.royaltyDistributionId,
    settlementId: distribution?.settlementId ?? "unknown",
    productId: distribution?.productId ?? "unknown",
    tenantId,
    currency: distribution?.currency ?? "USDC",
    status,
    governance: {
      standing: product?.governanceStatus ?? "unknown",
      authority: tenantId,
      executionAllowed: status === "executed",
      reasonCodes: governanceReasons
    },
    routes,
    reconciliation,
    treasuryExecutionEnabled: true,
    governanceAwareExecution: true,
    externalTreasuryMovementEnabled: false,
    walletExecutionEnabled: false,
    blockchainWritesEnabled: false,
    createdAt: new Date().toISOString()
  };
}

export function buildTreasuryExecutionSnapshot(records: TreasuryExecutionRuntime[]): TreasuryExecutionSnapshot {
  const executed = records.filter((record) => record.status === "executed");
  const executedRoutes = records.flatMap((record) => record.routes).filter((route) => route.status === "executed");
  return {
    id: `treasury-execution-snapshot-${crypto.randomUUID()}`,
    records,
    metrics: {
      executed: executed.length,
      blocked: records.filter((record) => record.status === "blocked").length,
      routesExecuted: executedRoutes.length,
      royaltyRoutedTotal: round(
        executedRoutes.filter((route) => route.type === "creator_royalty").reduce((sum, route) => sum + route.amount, 0)
      ),
      treasuryRoutedTotal: round(
        executedRoutes.filter((route) => route.type !== "creator_royalty").reduce((sum, route) => sum + route.amount, 0)
      ),
      mismatchTotal: round(records.reduce((sum, record) => sum + record.reconciliation.mismatchAmount, 0))
    },
    treasuryExecutionEnabled: true,
    governanceAwareExecution: true,
    externalTreasuryMovementEnabled: false,
    walletExecutionEnabled: false,
    blockchainWritesEnabled: false,
    generatedAt: new Date().toISOString()
  };
}

function buildRoutes(
  distribution: RoyaltyDistributionRuntime | undefined,
  product: ProductEntity | undefined,
  status: TreasuryExecutionRuntime["status"]
): TreasuryExecutionRoute[] {
  const currency = distribution?.currency ?? "USDC";
  const routeStatus = status === "executed" ? "executed" : "blocked";
  const blockedReasons = status === "executed" ? [] : ["treasury-execution-blocked"];
  const platformFee = distribution?.treasuryAllocation.platformFee ?? 0;
  const ecosystemFee = distribution?.treasuryAllocation.ecosystemFee ?? 0;
  const daoTreasuryAmount = round(platformFee * 0.4);
  const protocolPlatformAmount = round(platformFee - daoTreasuryAmount);

  return [
    {
      id: `treasury-route-${crypto.randomUUID()}`,
      type: "creator_royalty",
      recipient: distribution?.eip2981.recipient ?? "unknown-royalty-recipient",
      amount: status === "executed" ? distribution?.eip2981.royaltyAmount ?? 0 : 0,
      currency,
      status: routeStatus,
      reasonCodes: blockedReasons
    },
    {
      id: `treasury-route-${crypto.randomUUID()}`,
      type: "dao_treasury",
      recipient: getTenantId(product),
      amount: status === "executed" ? daoTreasuryAmount : 0,
      currency,
      status: routeStatus,
      reasonCodes: blockedReasons
    },
    {
      id: `treasury-route-${crypto.randomUUID()}`,
      type: "platform_fee",
      recipient: "Axodus Protocol Treasury",
      amount: status === "executed" ? protocolPlatformAmount : 0,
      currency,
      status: routeStatus,
      reasonCodes: blockedReasons
    },
    {
      id: `treasury-route-${crypto.randomUUID()}`,
      type: "ecosystem_fee",
      recipient: "Axodus Ecosystem Treasury",
      amount: status === "executed" ? ecosystemFee : 0,
      currency,
      status: routeStatus,
      reasonCodes: blockedReasons
    }
  ];
}

function buildReconciliation(
  distribution: RoyaltyDistributionRuntime | undefined,
  routes: TreasuryExecutionRoute[],
  status: TreasuryExecutionRuntime["status"]
): TreasuryExecutionRuntime["reconciliation"] {
  const expectedRoyaltyAmount = distribution?.eip2981.royaltyAmount ?? 0;
  const expectedTreasuryAmount = distribution?.treasuryAllocation.treasuryAmount ?? 0;
  const routedRoyaltyAmount = round(routes.filter((route) => route.type === "creator_royalty").reduce((sum, route) => sum + route.amount, 0));
  const routedTreasuryAmount = round(routes.filter((route) => route.type !== "creator_royalty").reduce((sum, route) => sum + route.amount, 0));
  const mismatchAmount = round(Math.abs(expectedRoyaltyAmount - routedRoyaltyAmount) + Math.abs(expectedTreasuryAmount - routedTreasuryAmount));
  const reasonCodes: string[] = [];
  if (status === "blocked") reasonCodes.push("treasury-execution-blocked");
  if (mismatchAmount > 0) reasonCodes.push("treasury-route-mismatch");
  if (status === "executed" && mismatchAmount === 0) reasonCodes.push("treasury-routes-reconciled");

  return {
    status: status === "blocked" ? "blocked" : mismatchAmount > 0 ? "mismatch" : "reconciled",
    expectedRoyaltyAmount,
    routedRoyaltyAmount,
    expectedTreasuryAmount,
    routedTreasuryAmount,
    mismatchAmount,
    reasonCodes
  };
}

function getGovernanceReasonCodes(input: TreasuryExecutionRequest, distribution?: RoyaltyDistributionRuntime, product?: ProductEntity) {
  const reasons: string[] = [];
  if (input.controlledRollout !== true) reasons.push("controlled-rollout-required");
  if (!distribution) reasons.push("royalty-distribution-not-found");
  if (distribution && distribution.status !== "allocated") reasons.push("royalty-distribution-not-allocated");
  if (!product) reasons.push("product-not-found");
  if (product && product.governanceStatus !== "compliant") reasons.push(`governance-${product.governanceStatus}`);
  return reasons;
}

function getTenantId(product?: ProductEntity) {
  return typeof product?.tenantId === "string" ? product.tenantId : "tenant-axodus-dao";
}

function round(value: number) {
  return Number(value.toFixed(4));
}

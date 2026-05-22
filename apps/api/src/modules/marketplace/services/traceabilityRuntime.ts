import type {
  AuditLogEntity,
  IndexerSnapshotEntity,
  MarketplaceRuntimeEventEntity,
  MarketplaceStore,
  ReconciliationSnapshotEntity,
  RuntimeEventCategory
} from "../dto/contracts.js";

export function buildAuditLog(input: {
  actor?: string;
  entityId: string;
  entityType: string;
  action: string;
  tenant?: string;
  governanceStanding?: string;
  restrictions?: string[];
  reviewRequired?: boolean;
  correlationId?: string;
}): AuditLogEntity {
  const correlationId = input.correlationId ?? `correlation-${crypto.randomUUID()}`;
  return {
    id: `audit-${crypto.randomUUID()}`,
    actor: input.actor ?? "marketplace-runtime",
    entity: {
      id: input.entityId,
      type: input.entityType
    },
    action: input.action,
    timestamp: new Date().toISOString(),
    tenant: input.tenant ?? "tenant-axodus-dao",
    governanceContext: {
      standing: input.governanceStanding ?? "preview",
      restrictions: input.restrictions ?? [],
      reviewRequired: Boolean(input.reviewRequired)
    },
    runtimeMetadata: {
      source: "marketplace-api",
      mode: "mock-persistent",
      settlementEnabled: false,
      walletExecutionEnabled: false,
      blockchainWritesEnabled: false,
      replaySafe: true,
      correlationId
    }
  };
}

export function categorizeEvent(type: MarketplaceRuntimeEventEntity["type"], entityType: string): RuntimeEventCategory {
  if (type.includes("auction") || type.includes("bid")) return "product";
  if (type.includes("royalty")) return "treasury_preview";
  if (type.includes("treasury")) return "treasury_preview";
  if (type.includes("realtime") || type.includes("resilience")) return "telemetry";
  if (type.includes("greenfield")) return "delivery";
  if (type.includes("signed_url")) return "delivery";
  if (type.includes("secure_delivery")) return "delivery";
  if (type.includes("delivery.telemetry")) return "delivery";
  if (type.includes("indexer") || entityType.includes("chain") || entityType.includes("Snapshot")) return "indexer";
  if (type.includes("invoice") || type.includes("billing") || type.includes("accounting")) return "billing";
  if (type.includes("settlement")) return "billing";
  if (type.includes("subscription")) return "subscription";
  if (type.includes("license")) return "license";
  if (type.includes("entitlement")) return "entitlement";
  if (type.includes("delivery")) return "delivery";
  if (type.includes("reconciliation")) return "indexer";
  if (type.includes("validation") || entityType.includes("governance")) return "governance";
  if (entityType.includes("storefront")) return "storefront";
  return "product";
}

export function buildReconciliationSnapshot(store: MarketplaceStore): ReconciliationSnapshotEntity {
  return {
    id: `reconciliation-${crypto.randomUUID()}`,
    scope: "marketplace",
    status: "preview_ready",
    blockchainReads: {
      prepared: true,
      enabled: false,
      supportedChecks: ["erc721-ownerOf", "erc1155-balanceOf", "eip2981-royaltyInfo", "marketplace-listing-read"]
    },
    ownershipVerification: {
      prepared: true,
      enabled: false,
      pendingProductIds: store.products.filter((product) => Boolean(product.nftBound)).map((product) => product.id)
    },
    treasuryVerification: {
      prepared: true,
      enabled: false,
      pendingInvoiceIds: (store.invoices ?? []).map((invoice) => invoice.id)
    },
    settlementVerification: {
      prepared: true,
      enabled: false,
      pendingPurchaseIds: store.purchases.map((purchase) => purchase.id)
    },
    licenseVerification: {
      prepared: true,
      enabled: false,
      pendingLicenseIds: (store.licenseRuntimes ?? []).map((license) => license.id)
    },
    generatedAt: new Date().toISOString()
  };
}

export function buildIndexerSnapshot(store: MarketplaceStore): IndexerSnapshotEntity {
  return {
    id: `indexer-${crypto.randomUUID()}`,
    entitySync: {
      products: store.products.length,
      sellers: store.sellers.length,
      tenants: store.tenants.length,
      licenses: (store.licenseRuntimes ?? []).length,
      invoices: (store.invoices ?? []).length
    },
    contracts: store.products
      .filter((product) => typeof product.contractAddress === "string")
      .map((product) => ({
        chain: Array.isArray(product.supportedChains) && typeof product.supportedChains[0] === "string" ? product.supportedChains[0] : "unknown",
        contractAddress: String(product.contractAddress),
        tokenStandard: typeof product.tokenStandard === "string" ? product.tokenStandard : "OffchainLicense",
        ingestionReady: true,
        liveIngestionEnabled: false
      })),
    runtimeSnapshot: {
      eventCount: store.events.length,
      auditCount: (store.auditLogs ?? []).length,
      ownershipMergeReady: true,
      nftEventIngestionReady: true
    },
    generatedAt: new Date().toISOString()
  };
}

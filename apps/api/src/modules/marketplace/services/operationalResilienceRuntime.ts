import type { MarketplaceOperationalResilienceSnapshot, MarketplaceRetryQueueItem, MarketplaceStore } from "../dto/contracts.js";

const STALE_REALTIME_MS = 5 * 60 * 1000;
const STALE_CHAIN_BLOCK_LAG = 250;

function nextRetryAt(now: Date, offsetMs: number) {
  return new Date(now.getTime() + offsetMs).toISOString();
}

function retryItem(input: Omit<MarketplaceRetryQueueItem, "id" | "attempts" | "nextRetryAt" | "executionEnabled">, now: Date): MarketplaceRetryQueueItem {
  return {
    id: `retry-${crypto.randomUUID()}`,
    attempts: 0,
    nextRetryAt: nextRetryAt(now, 60_000),
    executionEnabled: false,
    ...input
  };
}

function buildReconciliationRetries(store: MarketplaceStore, now: Date) {
  return (store.ownershipReconciliationSnapshots ?? [])
    .flatMap((snapshot) =>
      snapshot.records
        .filter((record) => record.status === "mismatch" || record.status === "stale" || record.status === "missing_snapshot")
        .map((record) =>
          retryItem(
            {
              source: "ownership_reconciliation",
              entityId: record.productId,
              action: record.status === "stale" || record.status === "missing_snapshot" ? "recover_stale_snapshot" : "retry_reconciliation",
              reasonCode: record.reasonCodes[0] ?? "ownership-reconciliation-retry",
              status: record.status === "missing_snapshot" ? "blocked_preview" : "ready_for_retry"
            },
            now
          )
        )
    )
    .slice(0, 20);
}

function buildTreasuryRetries(store: MarketplaceStore, now: Date) {
  return (store.treasuryReconciliationSnapshots ?? [])
    .flatMap((snapshot) =>
      snapshot.records
        .filter((record) => record.status === "mismatch" || record.status === "pending_preview")
        .map((record) =>
          retryItem(
            {
              source: "treasury_reconciliation",
              entityId: record.invoiceId,
              action: "retry_reconciliation",
              reasonCode: record.reasonCodes[0] ?? "treasury-reconciliation-retry",
              status: record.status === "mismatch" ? "ready_for_retry" : "queued_preview"
            },
            now
          )
        )
    )
    .slice(0, 20);
}

function buildRealtimeRetries(store: MarketplaceStore, now: Date) {
  return (store.realtimeSnapshots ?? [])
    .filter((snapshot) => now.getTime() - Date.parse(snapshot.generatedAt) > STALE_REALTIME_MS)
    .map((snapshot) =>
      retryItem(
        {
          source: "realtime_stream",
          entityId: snapshot.id,
          action: "retry_stream_publish",
          reasonCode: "realtime-snapshot-stale",
          status: "ready_for_retry"
        },
        now
      )
    )
    .slice(0, 20);
}

function buildIndexerRetries(store: MarketplaceStore, now: Date) {
  return (store.ownershipSnapshots ?? [])
    .filter((snapshot) => {
      const latest = store.chainSnapshots?.find((chain) => chain.chain === snapshot.chain)?.latestBlockNumber ?? snapshot.blockNumber;
      return latest - snapshot.blockNumber > STALE_CHAIN_BLOCK_LAG || snapshot.stale;
    })
    .map((snapshot) =>
      retryItem(
        {
          source: "indexer_snapshot",
          entityId: snapshot.id,
          action: "recover_stale_snapshot",
          reasonCode: "indexer-snapshot-stale",
          status: "ready_for_retry"
        },
        now
      )
    )
    .slice(0, 20);
}

export function buildOperationalResilienceSnapshot(store: MarketplaceStore, now = new Date()): MarketplaceOperationalResilienceSnapshot {
  const reconciliation = buildReconciliationRetries(store, now);
  const treasury = buildTreasuryRetries(store, now);
  const realtime = buildRealtimeRetries(store, now);
  const indexer = buildIndexerRetries(store, now);
  const staleOwnershipSnapshots = reconciliation.filter((item) => item.action === "recover_stale_snapshot").length + indexer.length;
  const staleRealtimeSnapshots = realtime.length;
  const staleChainSnapshots = (store.chainSnapshots ?? []).filter((snapshot) => snapshot.eventsIngested === 0).length;
  const queuedRetries = reconciliation.length + treasury.length + realtime.length + indexer.length;
  const staleSnapshots = staleOwnershipSnapshots + staleRealtimeSnapshots + staleChainSnapshots;
  const reasons = [
    ...(queuedRetries > 0 ? ["retry-queue-not-empty"] : []),
    ...(staleSnapshots > 0 ? ["stale-snapshot-recovery-required"] : []),
    ...(store.events.length === 0 ? ["runtime-events-empty"] : [])
  ];
  const mode = staleSnapshots > 0 ? "recovery_required" : queuedRetries > 0 ? "degraded" : "healthy";

  return {
    id: `resilience-${crypto.randomUUID()}`,
    mode,
    degradedMode: {
      enabled: mode !== "healthy",
      reasons,
      readOnlyFallbackEnabled: true,
      writeSuppressionRecommended: mode === "recovery_required"
    },
    retryQueues: {
      reconciliation,
      treasury,
      realtime,
      indexer
    },
    failover: {
      localStoreAvailable: true,
      mockFallbackAvailable: true,
      externalBrokerAvailable: false,
      databaseFailoverPrepared: true,
      indexerFailoverPrepared: true
    },
    staleRecovery: {
      staleOwnershipSnapshots,
      staleRealtimeSnapshots,
      staleChainSnapshots,
      recoveryActions: reasons.includes("stale-snapshot-recovery-required")
        ? ["refresh-reconciliation-preview", "refresh-indexer-snapshot-preview", "republish-realtime-snapshot-preview"]
        : [],
      automaticRecoveryEnabled: false
    },
    metrics: {
      queuedRetries,
      reconciliationRetries: reconciliation.length,
      treasuryRetries: treasury.length,
      realtimeRetries: realtime.length,
      indexerRetries: indexer.length,
      staleSnapshots
    },
    retryExecutionEnabled: false,
    failoverExecutionEnabled: false,
    generatedAt: now.toISOString()
  };
}

import type { MarketplaceRealtimeSnapshot, MarketplaceRuntimeEventEntity, MarketplaceStore } from "../dto/contracts.js";

function newestFirst<T extends { createdAt?: string; blockNumber?: number }>(items: T[]) {
  return [...items].sort((left, right) => {
    const leftTime = left.createdAt ? Date.parse(left.createdAt) : left.blockNumber ?? 0;
    const rightTime = right.createdAt ? Date.parse(right.createdAt) : right.blockNumber ?? 0;
    return rightTime - leftTime;
  });
}

function isListingUpdate(event: MarketplaceRuntimeEventEntity) {
  return event.type === "listing.created" || event.type === "indexer.chain_snapshot_persisted" || event.entityType.includes("listing");
}

function isGovernanceUpdate(event: MarketplaceRuntimeEventEntity) {
  return event.category === "governance" || event.type === "validation.requested" || event.entityType.includes("governance");
}

function isTelemetryUpdate(event: MarketplaceRuntimeEventEntity) {
  return ["billing", "treasury_preview", "delivery", "entitlement", "indexer"].includes(event.category ?? "");
}

export function buildMarketplaceRealtimeSnapshot(store: MarketplaceStore): MarketplaceRealtimeSnapshot {
  const events = newestFirst(store.events ?? []);
  const bidUpdates = newestFirst((store.chainIngestionEvents ?? []).filter((event) => event.eventKind.startsWith("bid."))).slice(0, 10);
  const listingUpdates = events.filter(isListingUpdate).slice(0, 10);
  const governanceUpdates = events.filter(isGovernanceUpdate).slice(0, 10);
  const telemetryUpdates = events.filter(isTelemetryUpdate).slice(0, 10);
  const streamableEvents = listingUpdates.length + bidUpdates.length + governanceUpdates.length + telemetryUpdates.length;

  return {
    id: `realtime-${crypto.randomUUID()}`,
    channels: ["listings", "bids", "governance", "telemetry"],
    transport: {
      websocketPrepared: true,
      ssePrepared: true,
      pollingFallbackPrepared: true,
      endpoint: "/api/marketplace/live",
      streamEndpoint: "/api/marketplace/live/stream",
      websocketEndpoint: "/api/marketplace/live/ws"
    },
    liveUpdates: {
      listingUpdates,
      bidUpdates,
      governanceUpdates,
      telemetryUpdates
    },
    metrics: {
      listingUpdates: listingUpdates.length,
      bidUpdates: bidUpdates.length,
      governanceUpdates: governanceUpdates.length,
      telemetryUpdates: telemetryUpdates.length,
      streamableEvents
    },
    realtimeExecutionEnabled: false,
    externalBrokerEnabled: false,
    generatedAt: new Date().toISOString()
  };
}

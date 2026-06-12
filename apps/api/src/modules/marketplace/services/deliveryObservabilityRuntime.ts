import type {
  DeliveryObservabilitySnapshot,
  DeliveryTelemetryRecord,
  DeliveryTelemetryRequest,
  EntitlementEnforcementRecord,
  MarketplaceStore,
  SecureDeliveryRuntime
} from "../dto/contracts.js";

function findDelivery(store: MarketplaceStore, deliveryId: string) {
  return (store.secureDeliveryRuntimes ?? []).find((delivery) => delivery.id === deliveryId);
}

function findEnforcement(store: MarketplaceStore, delivery?: SecureDeliveryRuntime) {
  return (store.entitlementEnforcements ?? []).find((record) => record.id === delivery?.enforcementId);
}

function reasonCodes(delivery: SecureDeliveryRuntime | undefined, enforcement: EntitlementEnforcementRecord | undefined) {
  if (!delivery) return ["secure-delivery-not-found"];
  if (delivery.status === "blocked") return delivery.access.reasonCodes;
  if (!enforcement) return ["entitlement-enforcement-allowed"];
  return Object.values(enforcement.checks).flatMap((check) => check.reasonCodes);
}

function outcome(event: DeliveryTelemetryRequest["event"], delivery?: SecureDeliveryRuntime) {
  if (!delivery || delivery.status === "blocked" || event === "access_denied") return "denied";
  if (event === "delivery_completed") return "observed";
  return "allowed";
}

export function buildDeliveryTelemetryRecord(store: MarketplaceStore, input: DeliveryTelemetryRequest): DeliveryTelemetryRecord {
  const delivery = findDelivery(store, input.deliveryId);
  const enforcement = findEnforcement(store, delivery);
  const eventOutcome = outcome(input.event, delivery);
  return {
    id: `delivery-telemetry-${crypto.randomUUID()}`,
    deliveryId: input.deliveryId,
    productId: delivery?.productId ?? "unknown",
    holder: delivery?.holder ?? "unknown",
    actor: input.actor?.trim() || delivery?.holder || "delivery-observer",
    mode: delivery?.mode ?? "encrypted_download",
    event: input.event,
    outcome: eventOutcome,
    entitlementTrace: {
      enforcementId: delivery?.enforcementId ?? "unknown",
      decision: enforcement?.decision ?? (delivery?.status === "prepared" ? "allowed" : delivery?.status === "blocked" ? "denied" : "unknown"),
      reasonCodes: reasonCodes(delivery, enforcement)
    },
    deliveryAudit: {
      encryptedDownloadObserved: Boolean(delivery?.encryptedDownload.enabled),
      secureStreamObserved: Boolean(delivery?.secureStream.enabled),
      acsPackageObserved: Boolean(delivery?.acsPackage.enabled),
      productionDeliveryEnabled: false,
      externalObjectStoreEnabled: false
    },
    recordedAt: new Date().toISOString()
  };
}

export function buildDeliveryObservabilitySnapshot(records: DeliveryTelemetryRecord[]): DeliveryObservabilitySnapshot {
  return {
    id: `delivery-observability-${crypto.randomUUID()}`,
    telemetry: records,
    analytics: {
      totalEvents: records.length,
      downloadEvents: records.filter((record) => record.event === "download_requested").length,
      streamEvents: records.filter((record) => record.event === "stream_started").length,
      acsPackageEvents: records.filter((record) => record.event === "acs_package_requested").length,
      deniedEvents: records.filter((record) => record.outcome === "denied").length,
      uniqueHolders: new Set(records.map((record) => record.holder)).size,
      uniqueProducts: new Set(records.map((record) => record.productId)).size
    },
    audit: {
      deliveryAuditRecords: records.length,
      entitlementTraceRecords: records.filter((record) => record.entitlementTrace.enforcementId !== "unknown").length,
      productionDeliveryEnabled: false
    },
    generatedAt: new Date().toISOString()
  };
}

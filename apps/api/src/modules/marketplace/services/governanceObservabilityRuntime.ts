import type {
  EmergencyGovernanceControl,
  GovernanceOperatorConsoleSnapshot,
  GovernanceTelemetryRecord,
  MarketplaceStore
} from "../dto/contracts.js";

export function withGovernanceObservability(store: MarketplaceStore): MarketplaceStore {
  return {
    ...store,
    governanceObservability: buildGovernanceObservabilitySnapshot(store)
  };
}

export function buildGovernanceObservabilitySnapshot(
  store: MarketplaceStore,
  now = new Date().toISOString()
): GovernanceOperatorConsoleSnapshot {
  const controls = buildEmergencyControls(store);
  const records = buildTelemetry(store, controls, now);
  const federation = store.daoFederationRuntime?.federationMetrics;
  return {
    id: `governance-observability-${now}`,
    emergencyRuntime: {
      controls,
      emergencyRestrictions: controls.filter((control) => control.control === "emergency_restriction").length,
      emergencyFreezes: controls.filter((control) => control.control === "emergency_freeze").length,
      emergencySuspensions: controls.filter((control) => control.control === "emergency_suspension").length,
      emergencyVisibilityControls: controls.filter((control) => control.control === "emergency_visibility").length,
      executionEnabled: false
    },
    telemetry: {
      records,
      governanceActions: records.filter((record) => record.category === "governance_action").length,
      restrictions: records.filter((record) => record.category === "restriction").length,
      moderationEvents: records.filter((record) => record.category === "moderation").length,
      emergencyEvents: records.filter((record) => record.category === "emergency_event").length
    },
    operatorConsole: {
      governanceVisibility: "available",
      moderationVisibility: "available",
      restrictionVisibility: "available",
      federationVisibility: "available",
      liveControlsEnabled: false
    },
    federation: {
      health: federation?.federationHealth ?? "warning-preview",
      tenants: federation?.tenants ?? store.tenants.length,
      restrictedStorefronts: federation?.restrictedStorefronts ?? 0,
      reviewRequiredStorefronts: federation?.reviewRequiredStorefronts ?? 0
    },
    generatedAt: now
  };
}

function buildEmergencyControls(store: MarketplaceStore): EmergencyGovernanceControl[] {
  const enforcementControls = (store.governanceEnforcement?.records ?? [])
    .filter((record) => record.severity === "restricted" || record.severity === "suspended" || record.severity === "emergency")
    .flatMap((record) => {
      const tenantId = getTenantId(store, record.entityId);
      const controls: EmergencyGovernanceControl[] = [
        {
          id: `emergency-restriction-${record.entityId}`,
          entityId: record.entityId,
          entityType: record.entityType,
          tenantId,
          control: "emergency_restriction",
          trigger: record.severity,
          severity: record.severity === "emergency" || record.severity === "suspended" ? "critical" : "restricted",
          previewState: "active-preview",
          executionEnabled: false,
          reasonCodes: [...record.visibility.reasonCodes, ...record.commerce.reasonCodes]
        }
      ];
      if (record.severity === "suspended" || record.severity === "emergency") {
        controls.push({
          id: `emergency-freeze-${record.entityId}`,
          entityId: record.entityId,
          entityType: record.entityType,
          tenantId,
          control: "emergency_freeze",
          trigger: record.severity,
          severity: "critical",
          previewState: "prepared",
          executionEnabled: false,
          reasonCodes: record.reviewQueue.reasonCodes
        });
      }
      if (record.visibility.effectiveState !== "visible") {
        controls.push({
          id: `emergency-visibility-${record.entityId}`,
          entityId: record.entityId,
          entityType: record.entityType,
          tenantId,
          control: "emergency_visibility",
          trigger: record.visibility.effectiveState,
          severity: record.severity === "warning" ? "warning" : "restricted",
          previewState: "prepared",
          executionEnabled: false,
          reasonCodes: record.visibility.reasonCodes
        });
      }
      return controls;
    });

  const workflowControls = (store.governanceWorkflow?.queues ?? [])
    .flatMap((queue) => queue.items)
    .filter((item) => item.lifecycle === "emergency_review")
    .map((item): EmergencyGovernanceControl => ({
      id: `emergency-suspension-${item.entityId}`,
      entityId: item.entityId,
      entityType: item.entityType,
      tenantId: item.tenantId,
      control: "emergency_suspension",
      trigger: item.lifecycle,
      severity: "critical",
      previewState: "prepared",
      executionEnabled: false,
      reasonCodes: item.reasonCodes
    }));

  return [...enforcementControls, ...workflowControls];
}

function buildTelemetry(store: MarketplaceStore, controls: EmergencyGovernanceControl[], now: string): GovernanceTelemetryRecord[] {
  const workflowRecords = (store.governanceWorkflow?.governanceAudit ?? []).map((action): GovernanceTelemetryRecord => ({
    id: `telemetry-action-${action.id}`,
    category: "governance_action",
    entityId: action.entityId,
    entityType: action.entityType,
    tenantId: getTenantId(store, action.entityId),
    severity: action.action === "emergency_review" ? "critical" : action.action === "restricted" ? "warning" : "info",
    message: `${action.queue} moderation action: ${action.action}`,
    reasonCodes: [action.reasonCode],
    createdAt: action.timestamp
  }));

  const moderationRecords = (store.governanceWorkflow?.queues ?? []).flatMap((queue) =>
    queue.items.map((item): GovernanceTelemetryRecord => ({
      id: `telemetry-moderation-${item.id}`,
      category: "moderation",
      entityId: item.entityId,
      entityType: item.entityType,
      tenantId: item.tenantId,
      severity: item.severity === "critical" ? "critical" : item.severity === "high" ? "warning" : "info",
      message: `${queue.queue} queue item in ${item.lifecycle}`,
      reasonCodes: item.reasonCodes,
      createdAt: item.createdAt
    }))
  );

  const controlRecords = controls.map((control): GovernanceTelemetryRecord => ({
    id: `telemetry-${control.id}`,
    category: control.control === "emergency_restriction" ? "restriction" : "emergency_event",
    entityId: control.entityId,
    entityType: control.entityType,
    tenantId: control.tenantId,
    severity: control.severity === "critical" ? "critical" : "warning",
    message: `${control.control} ${control.previewState}`,
    reasonCodes: control.reasonCodes,
    createdAt: now
  }));

  return [...workflowRecords, ...moderationRecords, ...controlRecords];
}

function getTenantId(store: MarketplaceStore, entityId: string) {
  const product = store.products.find((item) => item.id === entityId);
  if (typeof product?.tenantId === "string") return product.tenantId;
  const sellerProduct = store.products.find((item) => item.sellerId === entityId);
  if (typeof sellerProduct?.tenantId === "string") return sellerProduct.tenantId;
  if (store.tenants.some((tenant) => tenant.id === entityId)) return entityId;
  return "tenant-axodus-dao";
}

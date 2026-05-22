export type MarketplaceTraceType = "lifecycle" | "adapter" | "route-error" | "runtime-error";

export interface MarketplaceTraceEvent {
  id: string;
  type: MarketplaceTraceType;
  scope: string;
  status: "started" | "completed" | "failed" | "blocked" | "observed";
  message: string;
  createdAt: string;
  metadata?: Record<string, string | number | boolean | null>;
}

const traceBuffer: MarketplaceTraceEvent[] = [];
const maxTraceEvents = 100;

export function traceMarketplaceEvent(event: Omit<MarketplaceTraceEvent, "id" | "createdAt">) {
  const trace: MarketplaceTraceEvent = {
    ...event,
    id: `trace-${event.type}-${event.scope}-${Date.now()}-${traceBuffer.length}`,
    createdAt: new Date().toISOString()
  };

  traceBuffer.unshift(trace);
  if (traceBuffer.length > maxTraceEvents) traceBuffer.length = maxTraceEvents;

  return trace;
}

export function traceMarketplaceLifecycle(scope: string, status: MarketplaceTraceEvent["status"], metadata: MarketplaceTraceEvent["metadata"] = {}) {
  return traceMarketplaceEvent({
    type: "lifecycle",
    scope,
    status,
    message: `Marketplace lifecycle ${scope}: ${status}`,
    metadata
  });
}

export function traceAdapterCall(scope: string, status: MarketplaceTraceEvent["status"], metadata: MarketplaceTraceEvent["metadata"] = {}) {
  return traceMarketplaceEvent({
    type: "adapter",
    scope,
    status,
    message: `Marketplace adapter ${scope}: ${status}`,
    metadata
  });
}

export function instrumentMarketplaceError(scope: string, error: unknown, metadata: MarketplaceTraceEvent["metadata"] = {}) {
  const message = error instanceof Error ? error.message : String(error ?? "unknown error");
  return traceMarketplaceEvent({
    type: "runtime-error",
    scope,
    status: "failed",
    message,
    metadata
  });
}

export function listMarketplaceTraceEvents() {
  return [...traceBuffer];
}

export function clearMarketplaceTraceEvents() {
  traceBuffer.length = 0;
}

export function getMarketplaceRuntimeMetrics() {
  return {
    service: "MarketplaceRuntimeTelemetry",
    mode: "in-memory-preview",
    traceCount: traceBuffer.length,
    lifecycleEvents: traceBuffer.filter((event) => event.type === "lifecycle").length,
    adapterEvents: traceBuffer.filter((event) => event.type === "adapter").length,
    routeErrors: traceBuffer.filter((event) => event.type === "route-error").length,
    runtimeErrors: traceBuffer.filter((event) => event.type === "runtime-error").length,
    failedEvents: traceBuffer.filter((event) => event.status === "failed").length,
    observabilityExportEnabled: false
  };
}

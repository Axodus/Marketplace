import { describe, expect, it, beforeEach } from "vitest";
import {
  clearMarketplaceTraceEvents,
  getMarketplaceRuntimeMetrics,
  instrumentMarketplaceError,
  listMarketplaceTraceEvents,
  traceAdapterCall,
  traceMarketplaceLifecycle
} from "./runtimeTelemetry";

describe("runtimeTelemetry", () => {
  beforeEach(() => {
    clearMarketplaceTraceEvents();
  });

  it("records lifecycle and adapter traces for Marketplace observability", () => {
    traceMarketplaceLifecycle("route:/marketplace/dashboard", "observed", { route: "/marketplace/dashboard" });
    traceAdapterCall("StorageAccessService.previewSignedUrl", "completed", { productId: "product-governance-dashboard-nft" });

    const metrics = getMarketplaceRuntimeMetrics();
    const events = listMarketplaceTraceEvents();

    expect(events).toHaveLength(2);
    expect(metrics.lifecycleEvents).toBe(1);
    expect(metrics.adapterEvents).toBe(1);
    expect(metrics.observabilityExportEnabled).toBe(false);
  });

  it("instruments adapter/runtime failures without throwing", () => {
    instrumentMarketplaceError("MarketplaceContractAdapter.buyNow", new Error("mock adapter failure"), {
      productId: "product-restricted"
    });

    const metrics = getMarketplaceRuntimeMetrics();
    const [event] = listMarketplaceTraceEvents();

    expect(event.status).toBe("failed");
    expect(event.message).toBe("mock adapter failure");
    expect(metrics.runtimeErrors).toBe(1);
    expect(metrics.failedEvents).toBe(1);
  });
});

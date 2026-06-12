import { describe, expect, it } from "vitest";
import { getProductBySlug, issueMockPurchase, listProducts, calculateDashboardMetrics } from "./marketplaceService";
import {
  buildDeliveryTelemetry,
  createSignedUrlPreview,
  getDeliveryRuntime,
  getDeliveryTelemetrySummary,
  getEntitlementEnforcementPreview,
  getPurchaseDeliveryPreview
} from "./deliveryRuntime";

describe("deliveryRuntime", () => {
  it("models protected Greenfield and signed URL assets without production delivery", () => {
    const product = getProductBySlug("academy-certification-erc1155-bundle");
    expect(product).toBeDefined();

    const runtime = getDeliveryRuntime(product!);
    const signedUrl = createSignedUrlPreview(product!);

    expect(runtime.assetKind).toBe("educational-asset");
    expect(runtime.protectedAsset).toBe(true);
    expect(runtime.entitlementRequired).toBe(true);
    expect(runtime.deliveryExecutionEnabled).toBe(false);
    expect(runtime.productionGreenfieldEnabled).toBe(false);
    expect(runtime.labels).toEqual(expect.arrayContaining(["Protected asset", "Entitlement required"]));
    expect(signedUrl.lifecycle).toBe("preview");
    expect(signedUrl.signedUrl).toContain("greenfield.mock.axodus.local");
    expect(signedUrl.productionGreenfieldEnabled).toBe(false);
  });

  it("blocks governance-restricted ACS package delivery and exposes revocation telemetry", () => {
    const product = getProductBySlug("mcp-agent-template-license");
    expect(product).toBeDefined();

    const runtime = getDeliveryRuntime(product!);
    const signedUrl = createSignedUrlPreview(product!);
    const telemetry = buildDeliveryTelemetry([product!]);

    expect(runtime.assetKind).toBe("acs-package");
    expect(runtime.authorizationState).toBe("governance-restricted");
    expect(runtime.reasonCodes).toEqual(expect.arrayContaining(["governance-restricted", "no-production-greenfield-execution"]));
    expect(signedUrl.lifecycle).toBe("not-required");
    expect(telemetry.some((event) => event.type === "revocation" && event.severity === "blocked")).toBe(true);
  });

  it("prepares entitlement enforcement boundaries for license, DAO, subscription and ownership checks", () => {
    const product = getProductBySlug("academy-certification-erc1155-bundle");
    expect(product).toBeDefined();

    const entitlement = getEntitlementEnforcementPreview(product!, {
      ownsNft: false,
      hasActiveLicense: false,
      hasActiveSubscription: false,
      daoApproved: false
    });

    expect(entitlement.enforcementEnabled).toBe(false);
    expect(entitlement.ownershipValidationEnabled).toBe(false);
    expect(entitlement.subscriptionValidationEnabled).toBe(false);
    expect(entitlement.licenseValidationEnabled).toBe(false);
    expect(entitlement.daoValidationEnabled).toBe(false);
    expect(entitlement.eligible).toBe(false);
    expect(entitlement.checks.map((check) => check.id)).toEqual(
      expect.arrayContaining(["ownership", "subscription", "license", "dao", "governance"])
    );
  });

  it("builds purchase delivery previews without issuing production signed URLs", () => {
    const product = getProductBySlug("governance-dashboard-nft-access");
    expect(product).toBeDefined();
    const purchase = issueMockPurchase(product!);

    const preview = getPurchaseDeliveryPreview(product!, purchase);

    expect(preview.runtime.deliveryExecutionEnabled).toBe(false);
    expect(preview.entitlement.enforcementEnabled).toBe(false);
    expect(preview.signedUrl.deliveryExecutionEnabled).toBe(false);
    expect(preview.signedUrl.signedUrl).toContain("signature=preview");
  });

  it("summarizes delivery telemetry for dashboard rendering", () => {
    const products = listProducts();
    const summary = getDeliveryTelemetrySummary(products);
    const metrics = calculateDashboardMetrics();

    expect(summary.entitlementChecks).toBe(products.length);
    expect(summary.accessAttempts).toBe(products.length);
    expect(summary.previewIssuance).toBeGreaterThan(0);
    expect(summary.blockedEvents).toBeGreaterThan(0);
    expect(summary.telemetryExecutionEnabled).toBe(false);
    expect(metrics.protectedAssets).toBeGreaterThan(0);
    expect(metrics.entitlementChecks).toBe(summary.entitlementChecks);
    expect(metrics.deliveryPreviewIssuance).toBe(summary.previewIssuance);
  });
});

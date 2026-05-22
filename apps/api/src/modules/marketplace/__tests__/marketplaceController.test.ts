import { mkdtemp, rm } from "node:fs/promises";
import type { AddressInfo } from "node:net";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createApiServer } from "../../../main.js";

let tempDir: string;
let server: Awaited<ReturnType<typeof createApiServer>>;
let baseUrl: string;

beforeEach(async () => {
  tempDir = await mkdtemp(path.join(os.tmpdir(), "axodus-marketplace-api-"));
  server = await createApiServer({ storePath: path.join(tempDir, "store.json") });
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${address.port}`;
});

afterEach(async () => {
  await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  await rm(tempDir, { recursive: true, force: true });
});

describe("MarketplaceController", () => {
  it("serves products through the API envelope", async () => {
    const response = await fetch(`${baseUrl}/api/marketplace/products`);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.mode).toBe("mock-persistent");
    expect(payload.runtime.settlementEnabled).toBe(false);
    expect(payload.data).toHaveLength(4);
  });

  it("persists purchase previews through the API route", async () => {
    const createResponse = await fetch(`${baseUrl}/api/marketplace/purchases/preview`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ productId: "product-governance-dashboard-nft", buyer: "0xBuyer" })
    });
    const createPayload = await createResponse.json();

    expect(createResponse.status).toBe(201);
    expect(createPayload.data.buyer).toBe("0xBuyer");
    expect(createPayload.data.walletExecutionEnabled).toBe(false);

    const listResponse = await fetch(`${baseUrl}/api/marketplace/purchases`);
    const listPayload = await listResponse.json();
    expect(listPayload.data[0].id).toBe(createPayload.data.id);
  });

  it("serves canonical registries and storefront read models", async () => {
    const registryResponse = await fetch(`${baseUrl}/api/marketplace/registry/products`);
    const registryPayload = await registryResponse.json();
    const storefrontResponse = await fetch(`${baseUrl}/api/marketplace/tenants/tenant-axodus-dao/storefront`);
    const storefrontPayload = await storefrontResponse.json();

    expect(registryResponse.status).toBe(200);
    expect(registryPayload.data[0].canonicalEntityId).toContain("marketplace:product:");
    expect(registryPayload.data[0].ownership.ownerType).toBe("tenant");
    expect(storefrontResponse.status).toBe(200);
    expect(storefrontPayload.data.type).toBe("tenant");
    expect(storefrontPayload.data.activationEnabled).toBe(false);
    expect(storefrontPayload.data.metrics.products).toBeGreaterThan(0);
  });

  it("serves license runtime and entitlement aggregation endpoints", async () => {
    await fetch(`${baseUrl}/api/marketplace/purchases/preview`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ productId: "product-governance-dashboard-nft", buyer: "0xEntitled" })
    });
    const runtimeResponse = await fetch(`${baseUrl}/api/marketplace/licenses/runtime`);
    const runtimePayload = await runtimeResponse.json();
    const licenseId = runtimePayload.data[0].id;
    const lifecycleResponse = await fetch(`${baseUrl}/api/marketplace/licenses/lifecycle`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ licenseId, state: "active", reason: "route-test-activation" })
    });
    const entitlementResponse = await fetch(`${baseUrl}/api/marketplace/entitlements/0xEntitled`);
    const entitlementPayload = await entitlementResponse.json();

    expect(runtimeResponse.status).toBe(200);
    expect(lifecycleResponse.status).toBe(201);
    expect(entitlementPayload.data.activeLicenses).toContain(licenseId);
    expect(entitlementPayload.data.accessEnforcement.realBlockingEnabled).toBe(false);
  });

  it("serves invoice preview and accounting telemetry endpoints", async () => {
    const invoiceResponse = await fetch(`${baseUrl}/api/marketplace/invoices/preview`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ buyer: "0xInvoice", productIds: ["product-governance-dashboard-nft"] })
    });
    const invoicePayload = await invoiceResponse.json();
    const lifecycleResponse = await fetch(`${baseUrl}/api/marketplace/invoices/lifecycle`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ invoiceId: invoicePayload.data.id, state: "mock_paid", reason: "route-preview" })
    });
    const telemetryResponse = await fetch(`${baseUrl}/api/marketplace/accounting-telemetry`);
    const telemetryPayload = await telemetryResponse.json();

    expect(invoiceResponse.status).toBe(201);
    expect(invoicePayload.data.royaltyPreview).toBe(6);
    expect(invoicePayload.data.treasuryExecutionEnabled).toBe(false);
    expect(lifecycleResponse.status).toBe(201);
    expect(telemetryPayload.data[0].type).toBe("invoice.lifecycle_updated");
  });

  it("serves audit logs, runtime events and reconciliation readiness endpoints", async () => {
    await fetch(`${baseUrl}/api/marketplace/purchases/preview`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ productId: "product-governance-dashboard-nft", buyer: "0xTrace" })
    });
    const auditResponse = await fetch(`${baseUrl}/api/marketplace/audit-logs`);
    const auditPayload = await auditResponse.json();
    const eventsResponse = await fetch(`${baseUrl}/api/marketplace/events`);
    const eventsPayload = await eventsResponse.json();
    const reconciliationResponse = await fetch(`${baseUrl}/api/marketplace/reconciliation/snapshot`, { method: "POST" });
    const reconciliationPayload = await reconciliationResponse.json();
    const indexerResponse = await fetch(`${baseUrl}/api/marketplace/indexer-snapshots`, { method: "POST" });
    const indexerPayload = await indexerResponse.json();

    expect(auditResponse.status).toBe(200);
    expect(auditPayload.data[0].runtimeMetadata.replaySafe).toBe(true);
    expect(eventsPayload.data[0].category).toBeTruthy();
    expect(reconciliationPayload.data.blockchainReads.enabled).toBe(false);
    expect(indexerPayload.data.runtimeSnapshot.nftEventIngestionReady).toBe(true);
  });

  it("serves governance runtime authority read models", async () => {
    const snapshotResponse = await fetch(`${baseUrl}/api/marketplace/governance-authority`);
    const snapshotPayload = await snapshotResponse.json();
    const productResponse = await fetch(`${baseUrl}/api/marketplace/governance-authority/product-mcp-agent-template`);
    const productPayload = await productResponse.json();

    expect(snapshotResponse.status).toBe(200);
    expect(snapshotPayload.data.governanceWritesEnabled).toBe(false);
    expect(snapshotPayload.data.records.length).toBeGreaterThan(0);
    expect(productResponse.status).toBe(200);
    expect(productPayload.data.restrictionState).toBe("restricted");
    expect(productPayload.data.readOnly).toBe(true);
  });

  it("serves governance enforcement boundaries as preview-only runtime", async () => {
    const snapshotResponse = await fetch(`${baseUrl}/api/marketplace/governance-enforcement`);
    const snapshotPayload = await snapshotResponse.json();
    const productResponse = await fetch(`${baseUrl}/api/marketplace/governance-enforcement/product-mcp-agent-template`);
    const productPayload = await productResponse.json();

    expect(snapshotResponse.status).toBe(200);
    expect(snapshotPayload.data.hardBlockingEnabled).toBe(false);
    expect(snapshotPayload.data.restrictedProductIds).toContain("product-mcp-agent-template");
    expect(productResponse.status).toBe(200);
    expect(productPayload.data.visibility.effectiveState).toBe("limited-preview");
    expect(productPayload.data.entitlementImpact.governanceOverrideVisible).toBe(true);
    expect(productPayload.data.destructiveActionsEnabled).toBe(false);
  });

  it("serves DAO federation and tenant runtime boundaries", async () => {
    const federationResponse = await fetch(`${baseUrl}/api/marketplace/dao-federation`);
    const federationPayload = await federationResponse.json();
    const tenantResponse = await fetch(`${baseUrl}/api/marketplace/dao-federation/tenants/tenant-axodus-dao`);
    const tenantPayload = await tenantResponse.json();

    expect(federationResponse.status).toBe(200);
    expect(federationPayload.data.publicActivationEnabled).toBe(false);
    expect(federationPayload.data.federationMetrics.tenants).toBe(3);
    expect(federationPayload.data.storefronts[0].governanceVisibility.publicActivationEnabled).toBe(false);
    expect(tenantResponse.status).toBe(200);
    expect(tenantPayload.data.scopedRuntime.productsScoped).toBe(true);
    expect(tenantPayload.data.scopedRuntime.crossTenantSettlementEnabled).toBe(false);
  });

  it("serves governance workflow queues and persists moderation audit actions", async () => {
    const workflowResponse = await fetch(`${baseUrl}/api/marketplace/governance-workflow`);
    const workflowPayload = await workflowResponse.json();
    const actionResponse = await fetch(`${baseUrl}/api/marketplace/governance-workflow/actions`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        actor: "governance-moderator",
        queue: "product",
        entityId: "product-mcp-agent-template",
        entityType: "product",
        action: "restricted",
        reasonCode: "RESTRICT_PRODUCT_COMMERCE"
      })
    });
    const actionPayload = await actionResponse.json();
    const updatedResponse = await fetch(`${baseUrl}/api/marketplace/governance-workflow`);
    const updatedPayload = await updatedResponse.json();

    expect(workflowResponse.status).toBe(200);
    expect(workflowPayload.data.moderationRuntime.governanceWritesEnabled).toBe(false);
    expect(workflowPayload.data.queues.find((queue: { queue: string }) => queue.queue === "product").items.length).toBeGreaterThan(0);
    expect(actionResponse.status).toBe(201);
    expect(actionPayload.data.moderationOnly).toBe(true);
    expect(actionPayload.data.governanceWritesEnabled).toBe(false);
    expect(updatedPayload.data.governanceAudit[0].reasonCode).toBe("RESTRICT_PRODUCT_COMMERCE");
  });
});

import { mkdtemp, rm } from "node:fs/promises";
import { createConnection, type AddressInfo } from "node:net";
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

  it("serves Marketplace indexer ingestion runtime and persisted snapshots", async () => {
    const ingestResponse = await fetch(`${baseUrl}/api/marketplace/indexer/events`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chain: "Polygon",
        blockNumber: 333,
        blockHash: "0xblock",
        transactionHash: "0xindexer",
        logIndex: 7,
        eventKind: "bid.placed",
        contractAddress: "mock:governance-dashboard-access",
        tokenStandard: "ERC721",
        tokenId: "AXD-GOV-001",
        listingId: "listing-route-1",
        bidder: "0xBidder",
        amount: "130000000"
      })
    });
    const ingestPayload = await ingestResponse.json();
    const runtimeResponse = await fetch(`${baseUrl}/api/marketplace/indexer/runtime`);
    const runtimePayload = await runtimeResponse.json();
    const chainResponse = await fetch(`${baseUrl}/api/marketplace/indexer/chain-snapshots`);
    const chainPayload = await chainResponse.json();
    const listingResponse = await fetch(`${baseUrl}/api/marketplace/indexer/listing-snapshots`);
    const listingPayload = await listingResponse.json();

    expect(ingestResponse.status).toBe(201);
    expect(ingestPayload.data.chainWriteEnabled).toBe(false);
    expect(runtimeResponse.status).toBe(200);
    expect(runtimePayload.data.ingestionEnabled).toBe(true);
    expect(runtimePayload.data.settlementEnabled).toBe(false);
    expect(runtimePayload.data.metrics.bidEvents).toBe(1);
    expect(chainPayload.data[0].latestBlockNumber).toBe(333);
    expect(listingPayload.data[0].highestBid).toBe("130000000");
  });

  it("serves ownership reconciliation snapshots with stale and mismatch visibility", async () => {
    await fetch(`${baseUrl}/api/marketplace/purchases/preview`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ productId: "product-governance-dashboard-nft", buyer: "0xExpectedOwner" })
    });
    await fetch(`${baseUrl}/api/marketplace/indexer/events`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chain: "Polygon",
        blockNumber: 10,
        blockHash: "0xblock10",
        transactionHash: "0xowner",
        logIndex: 1,
        eventKind: "nft.transfer",
        contractAddress: "mock:governance-dashboard-access",
        tokenStandard: "ERC721",
        tokenId: "AXD-GOV-001",
        owner: "0xDifferentOwner"
      })
    });
    await fetch(`${baseUrl}/api/marketplace/indexer/events`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chain: "Polygon",
        blockNumber: 150,
        blockHash: "0xblock150",
        transactionHash: "0xadvance",
        logIndex: 2,
        eventKind: "listing.updated",
        contractAddress: "mock:governance-dashboard-access",
        tokenStandard: "ERC721",
        tokenId: "AXD-GOV-001",
        listingId: "listing-route-2"
      })
    });

    const createResponse = await fetch(`${baseUrl}/api/marketplace/reconciliation/ownership`, { method: "POST" });
    const createPayload = await createResponse.json();
    const listResponse = await fetch(`${baseUrl}/api/marketplace/reconciliation/ownership`);
    const listPayload = await listResponse.json();

    expect(createResponse.status).toBe(201);
    expect(createPayload.data.metrics.mismatches).toBeGreaterThan(0);
    expect(createPayload.data.metrics.stale).toBeGreaterThan(0);
    expect(createPayload.data.records.find((record: { productId: string }) => record.productId === "product-governance-dashboard-nft").status).toBe("mismatch");
    expect(createPayload.data.enforcementEnabled).toBe(false);
    expect(createPayload.data.chainReadsEnabled).toBe(false);
    expect(listResponse.status).toBe(200);
    expect(listPayload.data[0].id).toBe(createPayload.data.id);
  });

  it("serves treasury reconciliation previews without treasury execution", async () => {
    const invoiceResponse = await fetch(`${baseUrl}/api/marketplace/invoices/preview`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ buyer: "0xTreasury", productIds: ["product-governance-dashboard-nft"] })
    });
    const invoicePayload = await invoiceResponse.json();
    await fetch(`${baseUrl}/api/marketplace/invoices/lifecycle`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ invoiceId: invoicePayload.data.id, state: "mock_paid", reason: "route-treasury-preview" })
    });

    const createResponse = await fetch(`${baseUrl}/api/marketplace/reconciliation/treasury`, { method: "POST" });
    const createPayload = await createResponse.json();
    const listResponse = await fetch(`${baseUrl}/api/marketplace/reconciliation/treasury`);
    const listPayload = await listResponse.json();

    expect(createResponse.status).toBe(201);
    expect(createPayload.data.records[0].expectedRoyalty).toBe(6);
    expect(createPayload.data.records[0].expectedTreasurySplit).toBe(4.2);
    expect(createPayload.data.records[0].status).toBe("reconciled");
    expect(createPayload.data.treasuryExecutionEnabled).toBe(false);
    expect(createPayload.data.settlementEnabled).toBe(false);
    expect(listResponse.status).toBe(200);
    expect(listPayload.data[0].id).toBe(createPayload.data.id);
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

  it("serves governance observability and emergency operator console", async () => {
    await fetch(`${baseUrl}/api/marketplace/governance-workflow/actions`, {
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
    const response = await fetch(`${baseUrl}/api/marketplace/governance-observability`);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.data.emergencyRuntime.executionEnabled).toBe(false);
    expect(payload.data.operatorConsole.governanceVisibility).toBe("available");
    expect(payload.data.operatorConsole.liveControlsEnabled).toBe(false);
    expect(payload.data.telemetry.governanceActions).toBeGreaterThan(0);
    expect(payload.data.telemetry.restrictions).toBeGreaterThan(0);
  });

  it("serves realtime snapshot and SSE stream previews", async () => {
    await fetch(`${baseUrl}/api/marketplace/draft-listings`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title: "Route realtime preview",
        category: "Digital Assets",
        tokenStandard: "ERC721",
        listingType: "fixed",
        chain: "Polygon",
        price: 100,
        currency: "USDC",
        royaltyBps: 500,
        deliveryType: "Signed URL",
        governanceReviewRequired: true,
        description: "Route realtime listing"
      })
    });

    const liveResponse = await fetch(`${baseUrl}/api/marketplace/live`);
    const livePayload = await liveResponse.json();
    const streamResponse = await fetch(`${baseUrl}/api/marketplace/live/stream`);
    const streamPayload = await streamResponse.text();

    expect(liveResponse.status).toBe(200);
    expect(livePayload.data.transport.websocketPrepared).toBe(true);
    expect(livePayload.data.transport.ssePrepared).toBe(true);
    expect(livePayload.data.metrics.listingUpdates).toBeGreaterThan(0);
    expect(livePayload.data.realtimeExecutionEnabled).toBe(false);
    expect(streamResponse.headers.get("content-type")).toContain("text/event-stream");
    expect(streamPayload).toContain("event: marketplace.snapshot");
    expect(streamPayload).toContain("\"websocketPrepared\":true");
  });

  it("performs readonly websocket handshake for realtime previews", async () => {
    const address = server.address() as AddressInfo;
    const payload = await new Promise<string>((resolve, reject) => {
      const socket = createConnection(address.port, "127.0.0.1");
      const chunks: Buffer[] = [];
      socket.on("connect", () => {
        socket.write(
          [
            "GET /api/marketplace/live/ws HTTP/1.1",
            `Host: 127.0.0.1:${address.port}`,
            "Upgrade: websocket",
            "Connection: Upgrade",
            "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==",
            "Sec-WebSocket-Version: 13",
            "",
            ""
          ].join("\r\n")
        );
      });
      socket.on("data", (chunk) => chunks.push(chunk));
      socket.on("error", reject);
      socket.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    });

    expect(payload).toContain("101 Switching Protocols");
    expect(payload).toContain("websocketPrepared");
    expect(payload).toContain("realtimeExecutionEnabled");
  });

  it("serves operational resilience degraded mode and retry queues", async () => {
    await fetch(`${baseUrl}/api/marketplace/invoices/preview`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ buyer: "0xPending", productIds: ["product-governance-dashboard-nft"] })
    });
    await fetch(`${baseUrl}/api/marketplace/reconciliation/treasury`, { method: "POST" });

    const response = await fetch(`${baseUrl}/api/marketplace/resilience`);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.data.mode).toBe("degraded");
    expect(payload.data.degradedMode.enabled).toBe(true);
    expect(payload.data.retryQueues.treasury.length).toBeGreaterThan(0);
    expect(payload.data.failover.mockFallbackAvailable).toBe(true);
    expect(payload.data.retryExecutionEnabled).toBe(false);
    expect(payload.data.failoverExecutionEnabled).toBe(false);
  });

  it("serves Greenfield authentication previews with bucket and access verification", async () => {
    await fetch(`${baseUrl}/api/marketplace/purchases/preview`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ productId: "product-governance-dashboard-nft", buyer: "0xGreenfieldRoute" })
    });
    const licensesResponse = await fetch(`${baseUrl}/api/marketplace/licenses/runtime`);
    const licensesPayload = await licensesResponse.json();
    const license = licensesPayload.data.find((item: { holder: string }) => item.holder === "0xGreenfieldRoute");
    await fetch(`${baseUrl}/api/marketplace/licenses/lifecycle`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ licenseId: license.id, state: "active", reason: "route-greenfield-auth" })
    });

    const authResponse = await fetch(`${baseUrl}/api/marketplace/greenfield/auth`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ productId: "product-governance-dashboard-nft", holder: "0xGreenfieldRoute" })
    });
    const authPayload = await authResponse.json();
    const snapshotResponse = await fetch(`${baseUrl}/api/marketplace/greenfield/auth`);
    const snapshotPayload = await snapshotResponse.json();

    expect(authResponse.status).toBe(201);
    expect(authPayload.data.bucket.bucketAuthReady).toBe(true);
    expect(authPayload.data.accessVerification.status).toBe("verified-preview");
    expect(authPayload.data.authExecutionEnabled).toBe(false);
    expect(authPayload.data.externalGreenfieldCallEnabled).toBe(false);
    expect(snapshotResponse.status).toBe(200);
    expect(snapshotPayload.data.metrics.verifiedAccess).toBeGreaterThan(0);
    expect(snapshotPayload.data.productionGreenfieldEnabled).toBe(false);
  });

  it("serves signed URL issuance, expiration visibility and revocation runtime", async () => {
    await fetch(`${baseUrl}/api/marketplace/purchases/preview`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ productId: "product-governance-dashboard-nft", buyer: "0xSignedUrlRoute" })
    });
    const licensesResponse = await fetch(`${baseUrl}/api/marketplace/licenses/runtime`);
    const licensesPayload = await licensesResponse.json();
    const license = licensesPayload.data.find((item: { holder: string }) => item.holder === "0xSignedUrlRoute");
    await fetch(`${baseUrl}/api/marketplace/licenses/lifecycle`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ licenseId: license.id, state: "active", reason: "route-signed-url-runtime" })
    });

    const issueResponse = await fetch(`${baseUrl}/api/marketplace/greenfield/signed-urls`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ productId: "product-governance-dashboard-nft", holder: "0xSignedUrlRoute", ttlSeconds: 120 })
    });
    const issuePayload = await issueResponse.json();
    const revokeResponse = await fetch(`${baseUrl}/api/marketplace/greenfield/signed-urls/revoke`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ signedUrlId: issuePayload.data.id, reason: "route-revocation" })
    });
    const revokePayload = await revokeResponse.json();
    const snapshotResponse = await fetch(`${baseUrl}/api/marketplace/greenfield/signed-urls`);
    const snapshotPayload = await snapshotResponse.json();

    expect(issueResponse.status).toBe(201);
    expect(issuePayload.data.status).toBe("issued");
    expect(issuePayload.data.url).toContain("signature=");
    expect(issuePayload.data.expirationVisible).toBe(true);
    expect(issuePayload.data.revocationVisible).toBe(true);
    expect(issuePayload.data.signing.algorithm).toBe("HMAC-SHA256");
    expect(issuePayload.data.externalSignedUrlEnabled).toBe(false);
    expect(revokeResponse.status).toBe(201);
    expect(revokePayload.data.status).toBe("revoked");
    expect(snapshotResponse.status).toBe(200);
    expect(snapshotPayload.data.metrics.revoked).toBe(1);
    expect(snapshotPayload.data.productionGreenfieldEnabled).toBe(false);
  });

  it("serves operational entitlement enforcement decisions", async () => {
    const deniedResponse = await fetch(`${baseUrl}/api/marketplace/entitlements/enforce`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ productId: "product-governance-dashboard-nft", holder: "0xRouteEnforcement" })
    });
    const deniedPayload = await deniedResponse.json();

    await fetch(`${baseUrl}/api/marketplace/purchases/preview`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ productId: "product-governance-dashboard-nft", buyer: "0xRouteEnforcement" })
    });
    const licensesResponse = await fetch(`${baseUrl}/api/marketplace/licenses/runtime`);
    const licensesPayload = await licensesResponse.json();
    const license = licensesPayload.data.find((item: { holder: string }) => item.holder === "0xRouteEnforcement");
    await fetch(`${baseUrl}/api/marketplace/licenses/lifecycle`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ licenseId: license.id, state: "active", reason: "route-entitlement-enforcement" })
    });
    const allowedResponse = await fetch(`${baseUrl}/api/marketplace/entitlements/enforce`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ productId: "product-governance-dashboard-nft", holder: "0xRouteEnforcement" })
    });
    const allowedPayload = await allowedResponse.json();
    const snapshotResponse = await fetch(`${baseUrl}/api/marketplace/entitlements/enforcement`);
    const snapshotPayload = await snapshotResponse.json();

    expect(deniedResponse.status).toBe(201);
    expect(deniedPayload.data.decision).toBe("denied");
    expect(deniedPayload.data.checks.license.valid).toBe(false);
    expect(allowedResponse.status).toBe(201);
    expect(allowedPayload.data.decision).toBe("allowed");
    expect(allowedPayload.data.deliveryAllowed).toBe(true);
    expect(allowedPayload.data.signedUrlAllowed).toBe(true);
    expect(allowedPayload.data.settlementEnabled).toBe(false);
    expect(snapshotResponse.status).toBe(200);
    expect(snapshotPayload.data.enforcementOperational).toBe(true);
    expect(snapshotPayload.data.metrics.allowed).toBeGreaterThan(0);
  });

  it("serves secure delivery manifests for encrypted download and streaming", async () => {
    await fetch(`${baseUrl}/api/marketplace/purchases/preview`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ productId: "product-governance-dashboard-nft", buyer: "0xSecureDeliveryRoute" })
    });
    const licensesResponse = await fetch(`${baseUrl}/api/marketplace/licenses/runtime`);
    const licensesPayload = await licensesResponse.json();
    const license = licensesPayload.data.find((item: { holder: string }) => item.holder === "0xSecureDeliveryRoute");
    await fetch(`${baseUrl}/api/marketplace/licenses/lifecycle`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ licenseId: license.id, state: "active", reason: "route-secure-delivery" })
    });

    const encryptedResponse = await fetch(`${baseUrl}/api/marketplace/delivery/secure`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ productId: "product-governance-dashboard-nft", holder: "0xSecureDeliveryRoute", mode: "encrypted_download" })
    });
    const encryptedPayload = await encryptedResponse.json();
    const streamResponse = await fetch(`${baseUrl}/api/marketplace/delivery/secure`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ productId: "product-governance-dashboard-nft", holder: "0xSecureDeliveryRoute", mode: "secure_stream" })
    });
    const streamPayload = await streamResponse.json();
    const snapshotResponse = await fetch(`${baseUrl}/api/marketplace/delivery/secure`);
    const snapshotPayload = await snapshotResponse.json();

    expect(encryptedResponse.status).toBe(201);
    expect(encryptedPayload.data.status).toBe("prepared");
    expect(encryptedPayload.data.encryptedDownload.algorithm).toBe("AES-256-GCM");
    expect(encryptedPayload.data.encryptedDownload.downloadToken).toContain("dl_");
    expect(encryptedPayload.data.productionDeliveryEnabled).toBe(false);
    expect(streamResponse.status).toBe(201);
    expect(streamPayload.data.secureStream.streamToken).toContain("stream_");
    expect(streamPayload.data.secureStream.protocol).toBe("HLS-preview");
    expect(snapshotResponse.status).toBe(200);
    expect(snapshotPayload.data.metrics.encryptedDownloads).toBeGreaterThan(0);
    expect(snapshotPayload.data.metrics.secureStreams).toBeGreaterThan(0);
    expect(snapshotPayload.data.productionDeliveryEnabled).toBe(false);
  });

  it("serves delivery telemetry and observability analytics", async () => {
    await fetch(`${baseUrl}/api/marketplace/purchases/preview`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ productId: "product-governance-dashboard-nft", buyer: "0xDeliveryTelemetryRoute" })
    });
    const licensesResponse = await fetch(`${baseUrl}/api/marketplace/licenses/runtime`);
    const licensesPayload = await licensesResponse.json();
    const license = licensesPayload.data.find((item: { holder: string }) => item.holder === "0xDeliveryTelemetryRoute");
    await fetch(`${baseUrl}/api/marketplace/licenses/lifecycle`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ licenseId: license.id, state: "active", reason: "route-delivery-observability" })
    });
    const deliveryResponse = await fetch(`${baseUrl}/api/marketplace/delivery/secure`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ productId: "product-governance-dashboard-nft", holder: "0xDeliveryTelemetryRoute", mode: "encrypted_download" })
    });
    const deliveryPayload = await deliveryResponse.json();

    const telemetryResponse = await fetch(`${baseUrl}/api/marketplace/delivery/telemetry`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ deliveryId: deliveryPayload.data.id, event: "download_requested", actor: "route-observer" })
    });
    const telemetryPayload = await telemetryResponse.json();
    const observabilityResponse = await fetch(`${baseUrl}/api/marketplace/delivery/observability`);
    const observabilityPayload = await observabilityResponse.json();

    expect(telemetryResponse.status).toBe(201);
    expect(telemetryPayload.data.outcome).toBe("allowed");
    expect(telemetryPayload.data.actor).toBe("route-observer");
    expect(telemetryPayload.data.entitlementTrace.decision).toBe("allowed");
    expect(telemetryPayload.data.deliveryAudit.encryptedDownloadObserved).toBe(true);
    expect(telemetryPayload.data.deliveryAudit.productionDeliveryEnabled).toBe(false);
    expect(observabilityResponse.status).toBe(200);
    expect(observabilityPayload.data.analytics.downloadEvents).toBe(1);
    expect(observabilityPayload.data.audit.entitlementTraceRecords).toBe(1);
    expect(observabilityPayload.data.audit.productionDeliveryEnabled).toBe(false);
  });

  it("serves controlled settlement execution and transaction lifecycle", async () => {
    const blockedResponse = await fetch(`${baseUrl}/api/marketplace/settlements/execute`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ productId: "product-governance-dashboard-nft", buyer: "0xRouteSettlement" })
    });
    const blockedPayload = await blockedResponse.json();
    const confirmedResponse = await fetch(`${baseUrl}/api/marketplace/settlements/execute`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ productId: "product-governance-dashboard-nft", buyer: "0xRouteSettlement", controlledRollout: true })
    });
    const confirmedPayload = await confirmedResponse.json();
    const snapshotResponse = await fetch(`${baseUrl}/api/marketplace/settlements`);
    const snapshotPayload = await snapshotResponse.json();

    expect(blockedResponse.status).toBe(201);
    expect(blockedPayload.data.status).toBe("blocked");
    expect(blockedPayload.data.transaction.reasonCodes).toContain("controlled-rollout-required");
    expect(confirmedResponse.status).toBe(201);
    expect(confirmedPayload.data.status).toBe("confirmed");
    expect(confirmedPayload.data.transaction.lifecycle).toBe("confirmed");
    expect(confirmedPayload.data.transaction.confirmationId).toContain("confirmation-");
    expect(confirmedPayload.data.walletExecutionEnabled).toBe(false);
    expect(confirmedPayload.data.blockchainWritesEnabled).toBe(false);
    expect(snapshotResponse.status).toBe(200);
    expect(snapshotPayload.data.metrics.confirmed).toBe(1);
    expect(snapshotPayload.data.metrics.blocked).toBe(1);
    expect(snapshotPayload.data.controlledRollout).toBe(true);
  });

  it("serves royalty distribution runtime for confirmed settlements", async () => {
    const settlementResponse = await fetch(`${baseUrl}/api/marketplace/settlements/execute`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ productId: "product-governance-dashboard-nft", buyer: "0xRouteRoyalty", controlledRollout: true })
    });
    const settlementPayload = await settlementResponse.json();
    const blockedResponse = await fetch(`${baseUrl}/api/marketplace/royalties/distributions`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ settlementId: settlementPayload.data.id })
    });
    const blockedPayload = await blockedResponse.json();
    const allocatedResponse = await fetch(`${baseUrl}/api/marketplace/royalties/distributions`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ settlementId: settlementPayload.data.id, controlledRollout: true })
    });
    const allocatedPayload = await allocatedResponse.json();
    const snapshotResponse = await fetch(`${baseUrl}/api/marketplace/royalties/distributions`);
    const snapshotPayload = await snapshotResponse.json();

    expect(blockedResponse.status).toBe(201);
    expect(blockedPayload.data.status).toBe("blocked");
    expect(blockedPayload.data.reasonCodes).toContain("controlled-rollout-required");
    expect(allocatedResponse.status).toBe(201);
    expect(allocatedPayload.data.status).toBe("allocated");
    expect(allocatedPayload.data.eip2981.royaltyAmount).toBe(6);
    expect(allocatedPayload.data.creatorPayout.amount).toBe(109.8);
    expect(allocatedPayload.data.treasuryAllocation.treasuryAmount).toBe(4.2);
    expect(allocatedPayload.data.externalPayoutEnabled).toBe(false);
    expect(allocatedPayload.data.contractExecutionEnabled).toBe(false);
    expect(snapshotResponse.status).toBe(200);
    expect(snapshotPayload.data.metrics.allocated).toBe(1);
    expect(snapshotPayload.data.metrics.blocked).toBe(1);
    expect(snapshotPayload.data.externalPayoutEnabled).toBe(false);
  });

  it("serves auction bid placement, settlement and expiration runtime", async () => {
    const bidResponse = await fetch(`${baseUrl}/api/marketplace/auctions/bids`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ productId: "product-academy-cert-bundle", bidder: "0xRouteBidder", amount: 96 })
    });
    const bidPayload = await bidResponse.json();
    const rejectedResponse = await fetch(`${baseUrl}/api/marketplace/auctions/bids`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ productId: "product-academy-cert-bundle", bidder: "0xRouteSecondBidder", amount: 91 })
    });
    const rejectedPayload = await rejectedResponse.json();
    const blockedSettleResponse = await fetch(`${baseUrl}/api/marketplace/auctions/settle`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ auctionId: bidPayload.data.auctionId })
    });
    const blockedSettlePayload = await blockedSettleResponse.json();
    const settleResponse = await fetch(`${baseUrl}/api/marketplace/auctions/settle`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ auctionId: bidPayload.data.auctionId, controlledRollout: true })
    });
    const settlePayload = await settleResponse.json();
    const expirationBidResponse = await fetch(`${baseUrl}/api/marketplace/auctions/bids`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ productId: "product-trading-strategy-pass", bidder: "0xRouteExpiry", amount: 225 })
    });
    const expirationBidPayload = await expirationBidResponse.json();
    const expireResponse = await fetch(`${baseUrl}/api/marketplace/auctions/expire`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ auctionId: expirationBidPayload.data.auctionId, controlledRollout: true })
    });
    const expirePayload = await expireResponse.json();
    const snapshotResponse = await fetch(`${baseUrl}/api/marketplace/auctions`);
    const snapshotPayload = await snapshotResponse.json();

    expect(bidResponse.status).toBe(201);
    expect(bidPayload.data.status).toBe("accepted");
    expect(bidPayload.data.liveBidRuntimeEnabled).toBe(true);
    expect(bidPayload.data.walletExecutionEnabled).toBe(false);
    expect(rejectedResponse.status).toBe(201);
    expect(rejectedPayload.data.status).toBe("rejected");
    expect(rejectedPayload.data.reasonCodes).toContain("bid-not-higher-than-current");
    expect(blockedSettleResponse.status).toBe(201);
    expect(blockedSettlePayload.data.status).toBe("blocked");
    expect(blockedSettlePayload.data.reasonCodes).toContain("controlled-rollout-required");
    expect(settleResponse.status).toBe(201);
    expect(settlePayload.data.status).toBe("settled");
    expect(settlePayload.data.settlement.buyer).toBe("0xRouteBidder");
    expect(settlePayload.data.contractSettlementEnabled).toBe(false);
    expect(expireResponse.status).toBe(201);
    expect(expirePayload.data.status).toBe("expired");
    expect(snapshotResponse.status).toBe(200);
    expect(snapshotPayload.data.metrics.settled).toBe(1);
    expect(snapshotPayload.data.metrics.expired).toBe(1);
    expect(snapshotPayload.data.metrics.acceptedBids).toBe(2);
    expect(snapshotPayload.data.contractSettlementEnabled).toBe(false);
  });

  it("serves treasury-aware operational execution and routing reconciliation", async () => {
    const settlementResponse = await fetch(`${baseUrl}/api/marketplace/settlements/execute`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ productId: "product-governance-dashboard-nft", buyer: "0xRouteTreasury", controlledRollout: true })
    });
    const settlementPayload = await settlementResponse.json();
    const distributionResponse = await fetch(`${baseUrl}/api/marketplace/royalties/distributions`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ settlementId: settlementPayload.data.id, controlledRollout: true })
    });
    const distributionPayload = await distributionResponse.json();
    const blockedResponse = await fetch(`${baseUrl}/api/marketplace/treasury/execute`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ royaltyDistributionId: distributionPayload.data.id })
    });
    const blockedPayload = await blockedResponse.json();
    const executedResponse = await fetch(`${baseUrl}/api/marketplace/treasury/execute`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ royaltyDistributionId: distributionPayload.data.id, controlledRollout: true })
    });
    const executedPayload = await executedResponse.json();
    const snapshotResponse = await fetch(`${baseUrl}/api/marketplace/treasury/executions`);
    const snapshotPayload = await snapshotResponse.json();

    expect(blockedResponse.status).toBe(201);
    expect(blockedPayload.data.status).toBe("blocked");
    expect(blockedPayload.data.governance.reasonCodes).toContain("controlled-rollout-required");
    expect(executedResponse.status).toBe(201);
    expect(executedPayload.data.status).toBe("executed");
    expect(executedPayload.data.governance.executionAllowed).toBe(true);
    expect(executedPayload.data.routes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "dao_treasury", amount: 1.2 }),
        expect.objectContaining({ type: "ecosystem_fee", amount: 1.2 })
      ])
    );
    expect(executedPayload.data.reconciliation.status).toBe("reconciled");
    expect(executedPayload.data.reconciliation.routedTreasuryAmount).toBe(4.2);
    expect(executedPayload.data.treasuryExecutionEnabled).toBe(true);
    expect(executedPayload.data.externalTreasuryMovementEnabled).toBe(false);
    expect(snapshotResponse.status).toBe(200);
    expect(snapshotPayload.data.metrics.executed).toBe(1);
    expect(snapshotPayload.data.metrics.blocked).toBe(1);
    expect(snapshotPayload.data.metrics.treasuryRoutedTotal).toBe(4.2);
  });

  it("serves crosschain LayerZero messaging, bridge runtime and inventory synchronization", async () => {
    const blockedMessageResponse = await fetch(`${baseUrl}/api/marketplace/crosschain/messages`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ productId: "product-governance-dashboard-nft", sourceChain: "Polygon", targetChain: "Polygon" })
    });
    const blockedMessagePayload = await blockedMessageResponse.json();
    const messageResponse = await fetch(`${baseUrl}/api/marketplace/crosschain/messages`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        productId: "product-governance-dashboard-nft",
        sourceChain: "Polygon",
        targetChain: "Ethereum",
        payload: { action: "route-sync" }
      })
    });
    const messagePayload = await messageResponse.json();
    const blockedBridgeResponse = await fetch(`${baseUrl}/api/marketplace/crosschain/bridge`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messageId: messagePayload.data.id, holder: "0xRouteCrosschain" })
    });
    const blockedBridgePayload = await blockedBridgeResponse.json();
    const bridgeResponse = await fetch(`${baseUrl}/api/marketplace/crosschain/bridge`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messageId: messagePayload.data.id, holder: "0xRouteCrosschain", controlledRollout: true })
    });
    const bridgePayload = await bridgeResponse.json();
    const syncResponse = await fetch(`${baseUrl}/api/marketplace/crosschain/sync`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ productId: "product-governance-dashboard-nft" })
    });
    const syncPayload = await syncResponse.json();
    const snapshotResponse = await fetch(`${baseUrl}/api/marketplace/crosschain`);
    const snapshotPayload = await snapshotResponse.json();

    expect(blockedMessageResponse.status).toBe(201);
    expect(blockedMessagePayload.data.status).toBe("blocked");
    expect(blockedMessagePayload.data.reasonCodes).toContain("same-chain-message-not-required");
    expect(messageResponse.status).toBe(201);
    expect(messagePayload.data.status).toBe("prepared");
    expect(messagePayload.data.protocol).toBe("LayerZero");
    expect(messagePayload.data.externalMessagingEnabled).toBe(false);
    expect(blockedBridgeResponse.status).toBe(201);
    expect(blockedBridgePayload.data.status).toBe("blocked");
    expect(blockedBridgePayload.data.reasonCodes).toContain("controlled-rollout-required");
    expect(bridgeResponse.status).toBe(201);
    expect(bridgePayload.data.status).toBe("bridged");
    expect(bridgePayload.data.ownership.verificationStatus).toBe("synchronized");
    expect(bridgePayload.data.externalBridgeEnabled).toBe(false);
    expect(syncResponse.status).toBe(201);
    expect(syncPayload.data[0].status).toBe("synchronized");
    expect(snapshotResponse.status).toBe(200);
    expect(snapshotPayload.data.metrics.bridgesExecuted).toBe(1);
    expect(snapshotPayload.data.metrics.messagesPrepared).toBe(1);
    expect(snapshotPayload.data.externalBridgeEnabled).toBe(false);
  });
});

import type { IncomingMessage, ServerResponse } from "node:http";
import type { Duplex } from "node:stream";
import { createHash } from "node:crypto";
import { envelope, type ApiErrorEnvelope } from "../../../common/types.js";
import { ValidationError } from "../validation/marketplaceValidation.js";
import type { MarketplaceApiService } from "../services/marketplaceApiService.js";

const apiRoot = "/api/marketplace";

export class MarketplaceController {
  constructor(private readonly service: MarketplaceApiService) {}

  canHandle(url: URL) {
    return url.pathname === apiRoot || url.pathname.startsWith(`${apiRoot}/`);
  }

  async handle(req: IncomingMessage, res: ServerResponse, url: URL) {
    const route = stripRoot(url.pathname);
    if (req.method === "GET" && route === "/live/stream") {
      return sendEventStream(res, await this.service.getRealtimeSnapshot());
    }

    setJsonHeaders(res);

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    try {
      if (req.method === "GET" && route === "") return send(res, await this.service.snapshot());
      if (req.method === "GET" && route === "/products") return send(res, await this.service.listProducts());
      if (req.method === "GET" && route.startsWith("/products/")) {
        const product = await this.service.getProduct(decodeURIComponent(route.replace("/products/", "")));
        if (!product) return sendError(res, 404, "MARKETPLACE_PRODUCT_NOT_FOUND", "Marketplace product was not found.");
        return send(res, product);
      }
      if (req.method === "GET" && route === "/sellers") return send(res, await this.service.listSellers());
      if (req.method === "GET" && route === "/tenants") return send(res, await this.service.listTenants());
      if (req.method === "GET" && route === "/registry/products") return send(res, await this.service.listProductRegistry());
      if (req.method === "GET" && route === "/registry/sellers") return send(res, await this.service.listSellerRegistry());
      if (req.method === "GET" && route === "/registry/tenants") return send(res, await this.service.listTenantRegistry());
      if (req.method === "GET" && route === "/storefronts") return send(res, await this.service.listStorefronts());
      if (req.method === "GET" && route.startsWith("/storefronts/")) {
        const storefront = await this.service.getStorefront(decodeURIComponent(route.replace("/storefronts/", "")));
        if (!storefront) return sendError(res, 404, "MARKETPLACE_STOREFRONT_NOT_FOUND", "Marketplace storefront was not found.");
        return send(res, storefront);
      }
      if (req.method === "GET" && route.startsWith("/tenants/") && route.endsWith("/storefront")) {
        const tenantRef = decodeURIComponent(route.replace("/tenants/", "").replace("/storefront", ""));
        const storefront = await this.service.getTenantStorefront(tenantRef);
        if (!storefront) return sendError(res, 404, "MARKETPLACE_TENANT_STOREFRONT_NOT_FOUND", "Tenant storefront was not found.");
        return send(res, storefront);
      }
      if (req.method === "GET" && route.startsWith("/sellers/") && route.endsWith("/storefront")) {
        const sellerRef = decodeURIComponent(route.replace("/sellers/", "").replace("/storefront", ""));
        const storefront = await this.service.getSellerStorefront(sellerRef);
        if (!storefront) return sendError(res, 404, "MARKETPLACE_SELLER_STOREFRONT_NOT_FOUND", "Seller storefront was not found.");
        return send(res, storefront);
      }
      if (req.method === "GET" && route === "/licenses") return send(res, await this.service.listLicenses());
      if (req.method === "GET" && route === "/licenses/runtime") return send(res, await this.service.listLicenseRuntimes());
      if (req.method === "GET" && route === "/entitlements") return send(res, await this.service.listEntitlementSnapshots());
      if (req.method === "GET" && route === "/entitlements/enforcement") return send(res, await this.service.getEntitlementEnforcementSnapshot());
      if (req.method === "GET" && route.startsWith("/entitlements/")) {
        return send(res, await this.service.getEntitlementSnapshot(decodeURIComponent(route.replace("/entitlements/", ""))));
      }
      if (req.method === "GET" && route === "/purchases") return send(res, await this.service.listPurchases());
      if (req.method === "GET" && route === "/settlements") return send(res, await this.service.getSettlementSnapshot());
      if (req.method === "GET" && route === "/royalties/distributions") return send(res, await this.service.getRoyaltyDistributionSnapshot());
      if (req.method === "GET" && route === "/auctions") return send(res, await this.service.getAuctionRuntimeSnapshot());
      if (req.method === "GET" && route === "/subscriptions") return send(res, await this.service.listSubscriptions());
      if (req.method === "GET" && route === "/billing-previews") return send(res, await this.service.listBillingPreviews());
      if (req.method === "GET" && route === "/invoices") return send(res, await this.service.listInvoices());
      if (req.method === "GET" && route === "/accounting-telemetry") return send(res, await this.service.listAccountingTelemetry());
      if (req.method === "GET" && route === "/governance-workflow") return send(res, await this.service.getGovernanceWorkflowSnapshot());
      if (req.method === "GET" && route === "/governance-observability") return send(res, await this.service.getGovernanceObservabilitySnapshot());
      if (req.method === "GET" && route === "/governance-validations") return send(res, await this.service.listGovernanceValidations());
      if (req.method === "GET" && route === "/governance-authority") return send(res, await this.service.getGovernanceAuthoritySnapshot());
      if (req.method === "GET" && route.startsWith("/governance-authority/")) {
        const authority = await this.service.getGovernanceAuthority(decodeURIComponent(route.replace("/governance-authority/", "")));
        if (!authority) return sendError(res, 404, "MARKETPLACE_GOVERNANCE_AUTHORITY_NOT_FOUND", "Governance authority context was not found.");
        return send(res, authority);
      }
      if (req.method === "GET" && route === "/governance-enforcement") return send(res, await this.service.getGovernanceEnforcementSnapshot());
      if (req.method === "GET" && route.startsWith("/governance-enforcement/")) {
        const enforcement = await this.service.getGovernanceEnforcement(decodeURIComponent(route.replace("/governance-enforcement/", "")));
        if (!enforcement) return sendError(res, 404, "MARKETPLACE_GOVERNANCE_ENFORCEMENT_NOT_FOUND", "Governance enforcement context was not found.");
        return send(res, enforcement);
      }
      if (req.method === "GET" && route === "/dao-federation") return send(res, await this.service.getDAOFederationRuntime());
      if (req.method === "GET" && route.startsWith("/dao-federation/tenants/")) {
        const tenantRuntime = await this.service.getTenantRuntime(decodeURIComponent(route.replace("/dao-federation/tenants/", "")));
        if (!tenantRuntime) return sendError(res, 404, "MARKETPLACE_TENANT_RUNTIME_NOT_FOUND", "Tenant federation runtime was not found.");
        return send(res, tenantRuntime);
      }
      if (req.method === "GET" && route === "/delivery-previews") return send(res, await this.service.listDeliveryPreviews());
      if (req.method === "GET" && route === "/greenfield/auth") return send(res, await this.service.getGreenfieldAuthSnapshot());
      if (req.method === "GET" && route === "/greenfield/signed-urls") return send(res, await this.service.getSignedUrlSnapshot());
      if (req.method === "GET" && route === "/delivery/secure") return send(res, await this.service.getSecureDeliverySnapshot());
      if (req.method === "GET" && route === "/delivery/observability") return send(res, await this.service.getDeliveryObservabilitySnapshot());
      if (req.method === "GET" && route === "/events") return send(res, await this.service.listEvents());
      if (req.method === "GET" && route === "/live") return send(res, await this.service.getRealtimeSnapshot());
      if (req.method === "GET" && route === "/resilience") return send(res, await this.service.getOperationalResilienceSnapshot());
      if (req.method === "GET" && route === "/audit-logs") return send(res, await this.service.listAuditLogs());
      if (req.method === "GET" && route === "/reconciliation") return send(res, await this.service.listReconciliationSnapshots());
      if (req.method === "GET" && route === "/reconciliation/ownership") return send(res, await this.service.listOwnershipReconciliationSnapshots());
      if (req.method === "GET" && route === "/reconciliation/treasury") return send(res, await this.service.listTreasuryReconciliationSnapshots());
      if (req.method === "GET" && route === "/indexer-snapshots") return send(res, await this.service.listIndexerSnapshots());
      if (req.method === "GET" && route === "/indexer/runtime") return send(res, await this.service.getMarketplaceIndexerRuntime());
      if (req.method === "GET" && route === "/indexer/events") return send(res, await this.service.listChainIngestionEvents());
      if (req.method === "GET" && route === "/indexer/chain-snapshots") return send(res, await this.service.listChainSnapshots());
      if (req.method === "GET" && route === "/indexer/ownership-snapshots") return send(res, await this.service.listOwnershipSnapshots());
      if (req.method === "GET" && route === "/indexer/listing-snapshots") return send(res, await this.service.listListingSnapshots());

      if (req.method === "POST" && route === "/draft-listings") return send(res, await this.service.createDraftListing(await readJson(req)), 201);
      if (req.method === "POST" && route === "/purchases/preview") return send(res, await this.service.createPurchasePreview(await readJson(req)), 201);
      if (req.method === "POST" && route === "/settlements/execute") return send(res, await this.service.executeSettlement(await readJson(req)), 201);
      if (req.method === "POST" && route === "/royalties/distributions") {
        return send(res, await this.service.allocateRoyaltyDistribution(await readJson(req)), 201);
      }
      if (req.method === "POST" && route === "/auctions/bids") return send(res, await this.service.placeAuctionBid(await readJson(req)), 201);
      if (req.method === "POST" && route === "/auctions/settle") return send(res, await this.service.settleAuction(await readJson(req)), 201);
      if (req.method === "POST" && route === "/auctions/expire") return send(res, await this.service.expireAuction(await readJson(req)), 201);
      if (req.method === "POST" && route === "/entitlements/enforce") return send(res, await this.service.evaluateEntitlementEnforcement(await readJson(req)), 201);
      if (req.method === "POST" && route === "/billing-previews") return send(res, await this.service.createBillingPreview(await readJson(req)), 201);
      if (req.method === "POST" && route === "/invoices/preview") return send(res, await this.service.createInvoicePreview(await readJson(req)), 201);
      if (req.method === "POST" && route === "/invoices/lifecycle") return send(res, await this.service.updateInvoiceLifecycle(await readJson(req)), 201);
      if (req.method === "POST" && route === "/subscriptions/preview") return send(res, await this.service.createSubscriptionPreview(await readJson(req)), 201);
      if (req.method === "POST" && route === "/licenses/lifecycle") return send(res, await this.service.updateLicenseLifecycle(await readJson(req)), 201);
      if (req.method === "POST" && route === "/subscriptions/lifecycle") {
        return send(res, await this.service.updateSubscriptionLifecycle(await readJson(req)), 201);
      }
      if (req.method === "POST" && route === "/governance-workflow/actions") {
        return send(res, await this.service.createGovernanceWorkflowAction(await readJson(req)), 201);
      }
      if (req.method === "POST" && route === "/delivery-previews") return send(res, await this.service.createDeliveryPreview(await readJson(req)), 201);
      if (req.method === "POST" && route === "/greenfield/auth") return send(res, await this.service.createGreenfieldAuthRuntime(await readJson(req)), 201);
      if (req.method === "POST" && route === "/greenfield/signed-urls") return send(res, await this.service.issueSignedUrl(await readJson(req)), 201);
      if (req.method === "POST" && route === "/greenfield/signed-urls/revoke") return send(res, await this.service.revokeSignedUrl(await readJson(req)), 201);
      if (req.method === "POST" && route === "/delivery/secure") return send(res, await this.service.createSecureDelivery(await readJson(req)), 201);
      if (req.method === "POST" && route === "/delivery/telemetry") return send(res, await this.service.recordDeliveryTelemetry(await readJson(req)), 201);
      if (req.method === "POST" && route === "/reconciliation/snapshot") return send(res, await this.service.createReconciliationSnapshot(), 201);
      if (req.method === "POST" && route === "/reconciliation/ownership") return send(res, await this.service.createOwnershipReconciliationSnapshot(), 201);
      if (req.method === "POST" && route === "/reconciliation/treasury") return send(res, await this.service.createTreasuryReconciliationSnapshot(), 201);
      if (req.method === "POST" && route === "/indexer-snapshots") return send(res, await this.service.createIndexerSnapshot(), 201);
      if (req.method === "POST" && route === "/indexer/events") return send(res, await this.service.ingestChainEvent(await readJson(req)), 201);

      return sendError(res, 404, "MARKETPLACE_ROUTE_NOT_FOUND", "Marketplace API route was not found.");
    } catch (error) {
      if (error instanceof ValidationError) {
        return sendError(res, 400, "MARKETPLACE_VALIDATION_ERROR", error.message);
      }
      return sendError(res, 500, "MARKETPLACE_RUNTIME_ERROR", error instanceof Error ? error.message : "Unknown Marketplace API error.");
    }
  }

  async handleUpgrade(req: IncomingMessage, socket: Duplex, url: URL) {
    const route = stripRoot(url.pathname);
    if (route !== "/live/ws") {
      socket.destroy();
      return;
    }

    const key = req.headers["sec-websocket-key"];
    if (!key || Array.isArray(key)) {
      socket.destroy();
      return;
    }

    const accept = createHash("sha1")
      .update(`${key}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`)
      .digest("base64");
    socket.write(
      [
        "HTTP/1.1 101 Switching Protocols",
        "Upgrade: websocket",
        "Connection: Upgrade",
        `Sec-WebSocket-Accept: ${accept}`,
        "",
        ""
      ].join("\r\n")
    );
    const snapshot = await this.service.getRealtimeSnapshot();
    socket.write(encodeWebSocketTextFrame(JSON.stringify(envelope(snapshot))));
    socket.end();
  }
}

async function readJson(req: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
}

function send<T>(res: ServerResponse, data: T, status = 200) {
  res.writeHead(status);
  res.end(JSON.stringify(envelope(data)));
}

function sendEventStream<T>(res: ServerResponse, data: T) {
  res.writeHead(200, {
    "content-type": "text/event-stream; charset=utf-8",
    "cache-control": "no-cache, no-transform",
    connection: "keep-alive",
    "x-accel-buffering": "no"
  });
  res.write("retry: 5000\n");
  res.write(`event: marketplace.snapshot\n`);
  res.write(`data: ${JSON.stringify(envelope(data))}\n\n`);
  res.write(`event: marketplace.heartbeat\n`);
  res.write(`data: ${JSON.stringify(envelope({ ok: true, realtimeExecutionEnabled: false }))}\n\n`);
  res.end();
}

function encodeWebSocketTextFrame(message: string) {
  const payload = Buffer.from(message, "utf8");
  if (payload.length < 126) return Buffer.concat([Buffer.from([0x81, payload.length]), payload]);
  if (payload.length <= 65535) {
    const header = Buffer.alloc(4);
    header[0] = 0x81;
    header[1] = 126;
    header.writeUInt16BE(payload.length, 2);
    return Buffer.concat([header, payload]);
  }
  const header = Buffer.alloc(10);
  header[0] = 0x81;
  header[1] = 127;
  header.writeBigUInt64BE(BigInt(payload.length), 2);
  return Buffer.concat([header, payload]);
}

function sendError(res: ServerResponse, status: number, code: string, message: string) {
  const payload: ApiErrorEnvelope = {
    error: { code, message, status },
    mode: "mock-persistent",
    runtime: {
      source: "marketplace-api",
      persisted: true,
      settlementEnabled: false,
      walletExecutionEnabled: false,
      blockchainWritesEnabled: false
    }
  };
  res.writeHead(status);
  res.end(JSON.stringify(payload));
}

function setJsonHeaders(res: ServerResponse) {
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-methods", "GET,POST,OPTIONS");
  res.setHeader("access-control-allow-headers", "content-type");
}

function stripRoot(pathname: string) {
  return pathname.slice(apiRoot.length);
}

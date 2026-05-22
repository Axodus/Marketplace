import type { IncomingMessage, ServerResponse } from "node:http";
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
    setJsonHeaders(res);

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    try {
      const route = stripRoot(url.pathname);

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
      if (req.method === "GET" && route.startsWith("/entitlements/")) {
        return send(res, await this.service.getEntitlementSnapshot(decodeURIComponent(route.replace("/entitlements/", ""))));
      }
      if (req.method === "GET" && route === "/purchases") return send(res, await this.service.listPurchases());
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
      if (req.method === "GET" && route === "/events") return send(res, await this.service.listEvents());
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

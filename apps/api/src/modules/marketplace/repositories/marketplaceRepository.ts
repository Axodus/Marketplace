import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createMarketplaceSeed } from "../adapters/mockMarketplaceSeed.js";
import type {
  AssetDeliveryPreviewEntity,
  DAOFederationRuntimeSnapshot,
  AccountingTelemetryEntity,
  AuditLogEntity,
  BillingPreviewEntity,
  BillingPreviewRequest,
  DraftListingEntity,
  DraftListingRequest,
  EntitlementSnapshotEntity,
  GovernanceValidationEntity,
  GovernanceAuthorityRecord,
  GovernanceAuthoritySnapshot,
  GovernanceEnforcementRecord,
  GovernanceEnforcementSnapshot,
  GovernanceOperatorConsoleSnapshot,
  GovernanceWorkflowActionRecord,
  GovernanceWorkflowActionRequest,
  GovernanceWorkflowSnapshot,
  InvoiceLifecycleRequest,
  InvoicePreviewEntity,
  InvoicePreviewRequest,
  IndexerSnapshotEntity,
  LicenseLifecycleRequest,
  LicenseEntity,
  LicenseRuntimeEntity,
  MarketplaceRuntimeEventEntity,
  MarketplaceStore,
  ProductEntity,
  ProductRegistryRecord,
  PurchaseEntity,
  PurchasePreviewRequest,
  ReconciliationSnapshotEntity,
  SellerEntity,
  SellerRegistryRecord,
  StorefrontViewEntity,
  SubscriptionEntity,
  SubscriptionLifecycleRequest,
  SubscriptionPreviewRequest,
  TenantRegistryRecord,
  TenantEntity
} from "../dto/contracts.js";
import { withRegistryReadModels } from "../services/registryReadModels.js";
import { buildEntitlementSnapshot } from "../services/entitlementRuntime.js";
import { buildAccountingTelemetry, buildInvoicePreview } from "../services/accountingRuntime.js";
import { buildAuditLog, buildIndexerSnapshot, buildReconciliationSnapshot, categorizeEvent } from "../services/traceabilityRuntime.js";
import { withGovernanceAuthority } from "../services/governanceAuthorityAdapter.js";
import { withGovernanceEnforcement } from "../services/governanceEnforcementRuntime.js";
import { withDAOFederationRuntime } from "../services/daoFederationRuntime.js";
import { createGovernanceWorkflowAction, withGovernanceWorkflow } from "../services/governanceWorkflowRuntime.js";
import { withGovernanceObservability } from "../services/governanceObservabilityRuntime.js";

export function getDefaultMarketplaceStorePath() {
  return process.env.MARKETPLACE_STORE_PATH ?? path.resolve(process.cwd(), ".runtime/marketplace-store.json");
}

export interface MarketplaceRepository {
  init(): Promise<void>;
  snapshot(): Promise<MarketplaceStore>;
  listProducts(): Promise<ProductEntity[]>;
  getProduct(idOrSlug: string): Promise<ProductEntity | undefined>;
  listSellers(): Promise<SellerEntity[]>;
  listTenants(): Promise<TenantEntity[]>;
  listProductRegistry(): Promise<ProductRegistryRecord[]>;
  listSellerRegistry(): Promise<SellerRegistryRecord[]>;
  listTenantRegistry(): Promise<TenantRegistryRecord[]>;
  listStorefronts(): Promise<StorefrontViewEntity[]>;
  getStorefront(idOrSlug: string): Promise<StorefrontViewEntity | undefined>;
  getTenantStorefront(tenantIdOrSlug: string): Promise<StorefrontViewEntity | undefined>;
  getSellerStorefront(sellerIdOrSlug: string): Promise<StorefrontViewEntity | undefined>;
  listLicenses(): Promise<LicenseEntity[]>;
  listLicenseRuntimes(): Promise<LicenseRuntimeEntity[]>;
  listEntitlementSnapshots(): Promise<EntitlementSnapshotEntity[]>;
  getEntitlementSnapshot(holder: string): Promise<EntitlementSnapshotEntity>;
  updateLicenseLifecycle(input: LicenseLifecycleRequest): Promise<LicenseRuntimeEntity>;
  listPurchases(): Promise<PurchaseEntity[]>;
  listSubscriptions(): Promise<SubscriptionEntity[]>;
  updateSubscriptionLifecycle(input: SubscriptionLifecycleRequest): Promise<SubscriptionEntity>;
  listBillingPreviews(): Promise<BillingPreviewEntity[]>;
  listInvoices(): Promise<InvoicePreviewEntity[]>;
  listAccountingTelemetry(): Promise<AccountingTelemetryEntity[]>;
  createInvoicePreview(input: InvoicePreviewRequest): Promise<InvoicePreviewEntity>;
  updateInvoiceLifecycle(input: InvoiceLifecycleRequest): Promise<InvoicePreviewEntity>;
  listGovernanceValidations(): Promise<GovernanceValidationEntity[]>;
  getGovernanceAuthoritySnapshot(): Promise<GovernanceAuthoritySnapshot>;
  getGovernanceAuthority(entityId: string): Promise<GovernanceAuthorityRecord | undefined>;
  getGovernanceEnforcementSnapshot(): Promise<GovernanceEnforcementSnapshot>;
  getGovernanceEnforcement(entityId: string): Promise<GovernanceEnforcementRecord | undefined>;
  getDAOFederationRuntime(): Promise<DAOFederationRuntimeSnapshot>;
  getTenantRuntime(tenantId: string): Promise<DAOFederationRuntimeSnapshot["tenantIsolation"][number] | undefined>;
  getGovernanceWorkflowSnapshot(): Promise<GovernanceWorkflowSnapshot>;
  createGovernanceWorkflowAction(input: GovernanceWorkflowActionRequest): Promise<GovernanceWorkflowActionRecord>;
  getGovernanceObservabilitySnapshot(): Promise<GovernanceOperatorConsoleSnapshot>;
  listDeliveryPreviews(): Promise<AssetDeliveryPreviewEntity[]>;
  listEvents(): Promise<MarketplaceRuntimeEventEntity[]>;
  listAuditLogs(): Promise<AuditLogEntity[]>;
  createReconciliationSnapshot(): Promise<ReconciliationSnapshotEntity>;
  listReconciliationSnapshots(): Promise<ReconciliationSnapshotEntity[]>;
  createIndexerSnapshot(): Promise<IndexerSnapshotEntity>;
  listIndexerSnapshots(): Promise<IndexerSnapshotEntity[]>;
  createDraftListing(input: DraftListingRequest): Promise<DraftListingEntity>;
  createPurchasePreview(input: PurchasePreviewRequest): Promise<PurchaseEntity>;
  createBillingPreview(input: BillingPreviewRequest): Promise<BillingPreviewEntity>;
  createSubscriptionPreview(input: SubscriptionPreviewRequest): Promise<SubscriptionEntity>;
  createDeliveryPreview(productId: string): Promise<AssetDeliveryPreviewEntity>;
}

export class FileMarketplaceRepository implements MarketplaceRepository {
  constructor(private readonly storePath = getDefaultMarketplaceStorePath()) {}

  async init() {
    await mkdir(path.dirname(this.storePath), { recursive: true });
    try {
      await readFile(this.storePath, "utf8");
    } catch {
      await this.writeStore(createMarketplaceSeed());
    }
  }

  async snapshot() {
    return this.readStore();
  }

  async listProducts() {
    return (await this.readStore()).products;
  }

  async getProduct(idOrSlug: string) {
    const products = await this.listProducts();
    return products.find((product) => product.id === idOrSlug || product.slug === idOrSlug);
  }

  async listSellers() {
    return (await this.readStore()).sellers;
  }

  async listTenants() {
    return (await this.readStore()).tenants;
  }

  async listProductRegistry() {
    return (await this.readStore()).productRegistry ?? [];
  }

  async listSellerRegistry() {
    return (await this.readStore()).sellerRegistry ?? [];
  }

  async listTenantRegistry() {
    return (await this.readStore()).tenantRegistry ?? [];
  }

  async listStorefronts() {
    return (await this.readStore()).storefronts ?? [];
  }

  async getStorefront(idOrSlug: string) {
    const storefronts = await this.listStorefronts();
    return storefronts.find((storefront) => storefront.id === idOrSlug || storefront.slug === idOrSlug);
  }

  async getTenantStorefront(tenantIdOrSlug: string) {
    const storefronts = await this.listStorefronts();
    return storefronts.find((storefront) => {
      return storefront.type === "tenant" && (storefront.ownerId === tenantIdOrSlug || storefront.slug === tenantIdOrSlug);
    });
  }

  async getSellerStorefront(sellerIdOrSlug: string) {
    const storefronts = await this.listStorefronts();
    return storefronts.find((storefront) => {
      return storefront.type === "seller" && (storefront.ownerId === sellerIdOrSlug || storefront.slug === sellerIdOrSlug);
    });
  }

  async listLicenses() {
    return (await this.readStore()).licenses;
  }

  async listLicenseRuntimes() {
    return (await this.readStore()).licenseRuntimes ?? [];
  }

  async listEntitlementSnapshots() {
    return (await this.readStore()).entitlementSnapshots ?? [];
  }

  async getEntitlementSnapshot(holder: string) {
    const store = await this.readStore();
    const snapshot = buildEntitlementSnapshot(store, holder);
    store.entitlementSnapshots = [snapshot, ...(store.entitlementSnapshots ?? [])];
    recordTrace(store, createEvent("entitlement.snapshot_generated", snapshot.id, "entitlementSnapshot", snapshot), {
      actor: holder,
      tenant: "tenant-axodus-dao",
      action: "entitlement.snapshot_generated",
      governanceStanding: "preview",
      restrictions: [...snapshot.governanceRestrictions, ...snapshot.tenantRestrictions]
    });
    await this.writeStore(store);
    return snapshot;
  }

  async listPurchases() {
    return (await this.readStore()).purchases;
  }

  async listSubscriptions() {
    return (await this.readStore()).subscriptions;
  }

  async listBillingPreviews() {
    return (await this.readStore()).billingPreviews;
  }

  async listInvoices() {
    return (await this.readStore()).invoices ?? [];
  }

  async listAccountingTelemetry() {
    return (await this.readStore()).accountingTelemetry ?? [];
  }

  async listGovernanceValidations() {
    return (await this.readStore()).governanceValidations;
  }

  async getGovernanceAuthoritySnapshot() {
    return (await this.readStore()).governanceAuthority!;
  }

  async getGovernanceAuthority(entityId: string) {
    return (await this.readStore()).governanceAuthority?.records.find((record) => record.entityId === entityId);
  }

  async getGovernanceEnforcementSnapshot() {
    return (await this.readStore()).governanceEnforcement!;
  }

  async getGovernanceEnforcement(entityId: string) {
    return (await this.readStore()).governanceEnforcement?.records.find((record) => record.entityId === entityId);
  }

  async getDAOFederationRuntime() {
    return (await this.readStore()).daoFederationRuntime!;
  }

  async getTenantRuntime(tenantId: string) {
    return (await this.readStore()).daoFederationRuntime?.tenantIsolation.find((record) => record.tenantId === tenantId);
  }

  async getGovernanceWorkflowSnapshot() {
    return (await this.readStore()).governanceWorkflow!;
  }

  async createGovernanceWorkflowAction(input: GovernanceWorkflowActionRequest) {
    const store = await this.readStore();
    const action = createGovernanceWorkflowAction(input);
    store.governanceWorkflowActions = [action, ...(store.governanceWorkflowActions ?? [])];
    await this.writeStore(store);
    return action;
  }

  async getGovernanceObservabilitySnapshot() {
    return (await this.readStore()).governanceObservability!;
  }

  async listDeliveryPreviews() {
    return (await this.readStore()).deliveryPreviews;
  }

  async listEvents() {
    return (await this.readStore()).events;
  }

  async listAuditLogs() {
    return (await this.readStore()).auditLogs ?? [];
  }

  async createReconciliationSnapshot() {
    const store = await this.readStore();
    const snapshot = buildReconciliationSnapshot(store);
    store.reconciliationSnapshots = [snapshot, ...(store.reconciliationSnapshots ?? [])];
    recordTrace(store, createEvent("reconciliation.snapshot_generated", snapshot.id, "reconciliationSnapshot", snapshot), {
      actor: "marketplace-runtime",
      tenant: "tenant-axodus-dao",
      action: "reconciliation.snapshot_generated",
      governanceStanding: "preview"
    });
    await this.writeStore(store);
    return snapshot;
  }

  async listReconciliationSnapshots() {
    return (await this.readStore()).reconciliationSnapshots ?? [];
  }

  async createIndexerSnapshot() {
    const store = await this.readStore();
    const snapshot = buildIndexerSnapshot(store);
    store.indexerSnapshots = [snapshot, ...(store.indexerSnapshots ?? [])];
    recordTrace(store, createEvent("indexer.snapshot_generated", snapshot.id, "indexerSnapshot", snapshot), {
      actor: "marketplace-runtime",
      tenant: "tenant-axodus-dao",
      action: "indexer.snapshot_generated",
      governanceStanding: "preview"
    });
    await this.writeStore(store);
    return snapshot;
  }

  async listIndexerSnapshots() {
    return (await this.readStore()).indexerSnapshots ?? [];
  }

  async createDraftListing(input: DraftListingRequest) {
    const store = await this.readStore();
    const now = new Date().toISOString();
    const listing: DraftListingEntity = {
      id: newRuntimeId("listing"),
      ...input,
      status: input.governanceReviewRequired ? "requires-governance-review" : "draft-created",
      settlementEnabled: false,
      contractWriteEnabled: false,
      createdAt: now
    };

    store.draftListings.unshift(listing);
    recordTrace(store, createEvent("listing.created", listing.id, "draftListing", listing), {
      actor: "publisher-preview",
      tenant: "tenant-axodus-dao",
      action: "listing.created",
      governanceStanding: listing.status,
      reviewRequired: listing.governanceReviewRequired
    });

    if (input.governanceReviewRequired) {
      const validation: GovernanceValidationEntity = {
        id: `validation-${listing.id}`,
        productId: listing.id,
        standing: "submitted",
        requiredReviews: ["constitutional-review", "risk-review", "listing-activation-review"],
        blockers: [],
        activationEnabled: false,
        settlementAllowed: false,
        createdAt: now
      };
      store.governanceValidations.unshift(validation);
      recordTrace(store, createEvent("validation.requested", validation.id, "governanceValidation", validation), {
        actor: "governance-runtime",
        tenant: "tenant-axodus-dao",
        action: "validation.requested",
        governanceStanding: validation.standing,
        reviewRequired: true
      });
    }

    await this.writeStore(store);
    return listing;
  }

  async createPurchasePreview(input: PurchasePreviewRequest) {
    const store = await this.readStore();
    const product = findProductOrThrow(store, input.productId);
    const license = findLicenseForProduct(store, product);
    const now = new Date().toISOString();
    const blocked = product.governanceStatus === "suspended" || product.governanceStatus === "restricted";
    const pricing = getPricing(product);
    const purchase: PurchaseEntity = {
      id: newRuntimeId("purchase"),
      buyer: input.buyer ?? "0xMockBuyer...A11C",
      productId: product.id,
      sellerId: product.sellerId,
      timestamp: now,
      amount: pricing.amount,
      currency: pricing.currency,
      licenseIssued: license.id,
      status: blocked ? "blocked" : product.governanceRequired ? "pending-governance-review" : "mock-issued",
      governanceReviewRequired: Boolean(product.governanceRequired),
      signedUrlPreview: product.signedUrlPreviewAvailable
        ? `https://greenfield.mock.axodus.local/access/${product.slug}?signature=preview`
        : undefined,
      settlementEnabled: false,
      walletExecutionEnabled: false,
      blockchainWritesEnabled: false
    };

    store.purchases.unshift(purchase);
    const licenseRuntime = createLicenseRuntime({
      product,
      license,
      holder: purchase.buyer,
      purchaseId: purchase.id,
      state: purchase.status === "blocked" ? "suspended" : purchase.status === "mock-issued" ? "issued" : "preview"
    });
    store.licenseRuntimes = [licenseRuntime, ...(store.licenseRuntimes ?? [])];
    recordTrace(store, createEvent("purchase.preview_issued", purchase.id, "purchase", purchase), {
      actor: purchase.buyer,
      tenant: typeof product.tenantId === "string" ? product.tenantId : "tenant-axodus-dao",
      action: "purchase.preview_issued",
      governanceStanding: product.governanceStatus,
      reviewRequired: purchase.governanceReviewRequired
    });
    recordTrace(store, createEvent("license.preview_issued", licenseRuntime.id, "licenseRuntime", licenseRuntime), {
      actor: purchase.buyer,
      tenant: licenseRuntime.tenantId,
      action: "license.preview_issued",
      governanceStanding: product.governanceStatus,
      restrictions: licenseRuntime.governanceRestrictions
    });
    await this.writeStore(store);
    return purchase;
  }

  async createBillingPreview(input: BillingPreviewRequest) {
    const store = await this.readStore();
    const product = findProductOrThrow(store, input.productId);
    const pricing = getPricing(product);
    const royaltyBps = getRoyaltyBps(product);
    const royaltyPreview = roundCurrency((pricing.amount * royaltyBps) / 10_000);
    const platformFee = roundCurrency(pricing.amount * 0.025);
    const billingPreview: BillingPreviewEntity = {
      id: newRuntimeId("billing"),
      productId: product.id,
      buyer: input.buyer ?? "0xMockBuyer...A11C",
      amount: pricing.amount,
      currency: pricing.currency,
      platformFee,
      royaltyPreview,
      sellerNetPreview: roundCurrency(pricing.amount - platformFee - royaltyPreview),
      status: "invoice-preview",
      settlementEnabled: false,
      createdAt: new Date().toISOString()
    };

    store.billingPreviews.unshift(billingPreview);
    recordTrace(store, createEvent("billing.preview_generated", billingPreview.id, "billingPreview", billingPreview), {
      actor: billingPreview.buyer,
      tenant: typeof product.tenantId === "string" ? product.tenantId : "tenant-axodus-dao",
      action: "billing.preview_generated",
      governanceStanding: product.governanceStatus,
      reviewRequired: Boolean(product.governanceRequired)
    });
    await this.writeStore(store);
    return billingPreview;
  }

  async createInvoicePreview(input: InvoicePreviewRequest) {
    const store = await this.readStore();
    const invoice = buildInvoicePreview(store, input);
    const telemetry = buildAccountingTelemetry(invoice, "invoice.created");
    store.invoices = [invoice, ...(store.invoices ?? [])];
    store.accountingTelemetry = [telemetry, buildAccountingTelemetry(invoice, "accounting.preview_generated"), ...(store.accountingTelemetry ?? [])];
    recordTrace(store, createEvent("invoice.preview_created", invoice.id, "invoice", invoice), {
      actor: invoice.buyer,
      tenant: "tenant-axodus-dao",
      action: "invoice.preview_created",
      governanceStanding: "preview"
    });
    recordTrace(store, createEvent("accounting.preview_generated", telemetry.id, "accountingTelemetry", telemetry), {
      actor: "accounting-runtime",
      tenant: "tenant-axodus-dao",
      action: "accounting.preview_generated",
      governanceStanding: "preview"
    });
    await this.writeStore(store);
    return invoice;
  }

  async updateInvoiceLifecycle(input: InvoiceLifecycleRequest) {
    const store = await this.readStore();
    const invoice = (store.invoices ?? []).find((item) => item.id === input.invoiceId);
    if (!invoice) throw new Error(`Invoice not found: ${input.invoiceId}`);
    invoice.state = input.state;
    invoice.updatedAt = new Date().toISOString();
    if (input.state === "mock_paid") invoice.reconciliation.state = "preview_reconciled";
    const telemetry = buildAccountingTelemetry(invoice, "invoice.lifecycle_updated");
    store.accountingTelemetry = [telemetry, ...(store.accountingTelemetry ?? [])];
    recordTrace(store, createEvent("invoice.lifecycle_updated", invoice.id, "invoice", { ...invoice, reason: input.reason ?? null }), {
      actor: "billing-runtime",
      tenant: "tenant-axodus-dao",
      action: "invoice.lifecycle_updated",
      governanceStanding: invoice.state
    });
    await this.writeStore(store);
    return invoice;
  }

  async createSubscriptionPreview(input: SubscriptionPreviewRequest) {
    const store = await this.readStore();
    const product = findProductOrThrow(store, input.productId);
    const subscription: SubscriptionEntity = {
      id: newRuntimeId("subscription"),
      productId: product.id,
      holder: input.holder ?? "0xMockBuyer...A11C",
      plan: `${product.licenseType ?? "Marketplace"} Preview`,
      status: product.governanceStatus === "restricted" ? "paused" : product.governanceRequired ? "pending" : "active",
      billingLifecycle: "invoice-preview",
      licenseLifecycle: product.governanceStatus === "restricted" ? "suspended" : "preview",
      renewalPreviewAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      cancellationPreviewAt: null,
      governanceRestrictions: product.governanceStatus === "restricted" ? ["governance-restricted-product"] : [],
      settlementEnabled: false
    };

    store.subscriptions.unshift(subscription);
    recordTrace(store, createEvent("subscription.preview_updated", subscription.id, "subscription", subscription), {
      actor: subscription.holder,
      tenant: typeof product.tenantId === "string" ? product.tenantId : "tenant-axodus-dao",
      action: "subscription.preview_updated",
      governanceStanding: product.governanceStatus,
      restrictions: subscription.governanceRestrictions
    });
    await this.writeStore(store);
    return subscription;
  }

  async updateLicenseLifecycle(input: LicenseLifecycleRequest) {
    const store = await this.readStore();
    const licenseRuntime = (store.licenseRuntimes ?? []).find((license) => license.id === input.licenseId);
    if (!licenseRuntime) throw new Error(`License runtime not found: ${input.licenseId}`);
    const now = new Date().toISOString();
    licenseRuntime.state = input.state;
    if (input.state === "suspended") licenseRuntime.suspendedAt = now;
    if (input.state === "revoked") licenseRuntime.revokedAt = now;
    if (input.reason) licenseRuntime.governanceRestrictions = [...new Set([...licenseRuntime.governanceRestrictions, input.reason])];
    recordTrace(store, createEvent("license.lifecycle_updated", licenseRuntime.id, "licenseRuntime", licenseRuntime), {
      actor: licenseRuntime.holder,
      tenant: licenseRuntime.tenantId,
      action: "license.lifecycle_updated",
      governanceStanding: licenseRuntime.state,
      restrictions: licenseRuntime.governanceRestrictions
    });
    await this.writeStore(store);
    return licenseRuntime;
  }

  async updateSubscriptionLifecycle(input: SubscriptionLifecycleRequest) {
    const store = await this.readStore();
    const subscription = store.subscriptions.find((item) => item.id === input.subscriptionId);
    if (!subscription) throw new Error(`Subscription not found: ${input.subscriptionId}`);
    subscription.status = input.state;
    if (input.state === "cancelled") subscription.cancellationPreviewAt = new Date().toISOString();
    if (input.reason) subscription.governanceRestrictions = [...new Set([...subscription.governanceRestrictions, input.reason])];
    recordTrace(store, createEvent("subscription.lifecycle_updated", subscription.id, "subscription", subscription), {
      actor: subscription.holder,
      tenant: "tenant-axodus-dao",
      action: "subscription.lifecycle_updated",
      governanceStanding: subscription.status,
      restrictions: subscription.governanceRestrictions
    });
    await this.writeStore(store);
    return subscription;
  }

  async createDeliveryPreview(productId: string) {
    const store = await this.readStore();
    const product = findProductOrThrow(store, productId);
    const blocked = product.governanceStatus === "restricted" || product.governanceStatus === "suspended";
    const signedUrlEnabled = Boolean(product.signedUrlPreviewAvailable) && !blocked;
    const deliveryPreview: AssetDeliveryPreviewEntity = {
      id: newRuntimeId("delivery"),
      productId: product.id,
      lifecycle: blocked ? "blocked" : signedUrlEnabled ? "preview" : "not-required",
      signedUrl: signedUrlEnabled ? `https://greenfield.mock.axodus.local/access/${product.slug}?signature=preview` : null,
      expiresAt: signedUrlEnabled ? new Date(Date.now() + 30 * 60 * 1000).toISOString() : null,
      deliveryExecutionEnabled: false,
      productionGreenfieldEnabled: false,
      createdAt: new Date().toISOString()
    };

    store.deliveryPreviews.unshift(deliveryPreview);
    recordTrace(store, createEvent("delivery.preview_issued", deliveryPreview.id, "deliveryPreview", deliveryPreview), {
      actor: "delivery-runtime",
      tenant: typeof product.tenantId === "string" ? product.tenantId : "tenant-axodus-dao",
      action: "delivery.preview_issued",
      governanceStanding: product.governanceStatus,
      restrictions: deliveryPreview.lifecycle === "blocked" ? ["delivery-blocked-preview"] : []
    });
    await this.writeStore(store);
    return deliveryPreview;
  }

  private async readStore(): Promise<MarketplaceStore> {
    await this.initIfMissing();
    return withGovernanceObservability(
      withGovernanceWorkflow(
        withDAOFederationRuntime(
          withRegistryReadModels(withGovernanceEnforcement(withGovernanceAuthority(JSON.parse(await readFile(this.storePath, "utf8")) as MarketplaceStore)))
        )
      )
    );
  }

  private async writeStore(store: MarketplaceStore) {
    await mkdir(path.dirname(this.storePath), { recursive: true });
    await writeFile(this.storePath, `${JSON.stringify(store, null, 2)}\n`, "utf8");
  }

  private async initIfMissing() {
    try {
      await readFile(this.storePath, "utf8");
    } catch {
      await this.init();
    }
  }
}

function createEvent(
  type: MarketplaceRuntimeEventEntity["type"],
  entityId: string,
  entityType: string,
  payload: object
): MarketplaceRuntimeEventEntity {
  const correlationId = `correlation-${crypto.randomUUID()}`;
  return {
    id: newRuntimeId("event"),
    category: categorizeEvent(type, entityType),
    type,
    entityId,
    entityType,
    createdAt: new Date().toISOString(),
    replaySafe: true,
    correlationId,
    payload: payload as Record<string, unknown>
  };
}

function recordTrace(
  store: MarketplaceStore,
  event: MarketplaceRuntimeEventEntity,
  audit: {
    actor?: string;
    tenant?: string;
    action: string;
    governanceStanding?: string;
    restrictions?: string[];
    reviewRequired?: boolean;
  }
) {
  store.events.unshift(event);
  store.auditLogs = [
    buildAuditLog({
      actor: audit.actor,
      entityId: event.entityId,
      entityType: event.entityType,
      action: audit.action,
      tenant: audit.tenant,
      governanceStanding: audit.governanceStanding,
      restrictions: audit.restrictions,
      reviewRequired: audit.reviewRequired,
      correlationId: event.correlationId
    }),
    ...(store.auditLogs ?? [])
  ];
}

function findProductOrThrow(store: MarketplaceStore, idOrSlug: string) {
  const product = store.products.find((item) => item.id === idOrSlug || item.slug === idOrSlug);
  if (!product) throw new Error(`Marketplace product not found: ${idOrSlug}`);
  return product;
}

function findLicenseForProduct(store: MarketplaceStore, product: ProductEntity) {
  return store.licenses.find((license) => license.type === product.licenseType) ?? store.licenses[0];
}

function createLicenseRuntime(input: {
  product: ProductEntity;
  license: LicenseEntity;
  holder: string;
  purchaseId: string;
  state: LicenseRuntimeEntity["state"];
}): LicenseRuntimeEntity {
  const permissions = Array.isArray(input.license.permissions)
    ? input.license.permissions.filter((permission): permission is string => typeof permission === "string")
    : [];
  const expiration = typeof input.license.expiration === "string" ? input.license.expiration : null;
  return {
    id: newRuntimeId("license"),
    licenseDefinitionId: input.license.id,
    productId: input.product.id,
    holder: input.holder,
    sellerId: input.product.sellerId,
    tenantId: typeof input.product.tenantId === "string" ? input.product.tenantId : "tenant-axodus-dao",
    state: input.state,
    issuedFromPurchaseId: input.purchaseId,
    issuedAt: new Date().toISOString(),
    expiresAt: expiration,
    suspendedAt: input.state === "suspended" ? new Date().toISOString() : null,
    revokedAt: null,
    governanceRestrictions: input.product.governanceStatus === "restricted" ? ["governance-restricted-product"] : [],
    permissions,
    nftOwnershipMergeReady: true,
    walletOwnershipMergeReady: true,
    settlementEnabled: false,
    nftExecutionEnabled: false
  };
}

function getPricing(product: ProductEntity) {
  const pricing = product.pricing as { amount?: number; currency?: string } | undefined;
  return {
    amount: Number(pricing?.amount ?? 0),
    currency: pricing?.currency ?? "USDC"
  };
}

function getRoyaltyBps(product: ProductEntity) {
  const royalty = product.royaltyModel as { bps?: number } | undefined;
  return Number(royalty?.bps ?? 0);
}

function newRuntimeId(prefix: string) {
  return `marketplace-${prefix}-${crypto.randomUUID()}`;
}

function roundCurrency(value: number) {
  return Number(value.toFixed(4));
}

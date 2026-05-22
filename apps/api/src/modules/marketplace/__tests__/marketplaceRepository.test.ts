import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { FileMarketplaceRepository } from "../repositories/marketplaceRepository.js";
import { buildSignedUrlSnapshot } from "../services/signedUrlRuntime.js";

let tempDir: string;

beforeEach(async () => {
  tempDir = await mkdtemp(path.join(os.tmpdir(), "axodus-marketplace-api-"));
});

afterEach(async () => {
  await rm(tempDir, { recursive: true, force: true });
});

describe("FileMarketplaceRepository", () => {
  it("seeds and reads marketplace entities from local persistence", async () => {
    const repository = new FileMarketplaceRepository(path.join(tempDir, "store.json"));
    await repository.init();

    expect(await repository.listProducts()).toHaveLength(4);
    expect(await repository.listSellers()).toHaveLength(3);
    expect(await repository.listTenants()).toHaveLength(3);
    expect(await repository.listGovernanceValidations()).toHaveLength(4);
  });

  it("builds canonical product, seller and tenant registries", async () => {
    const repository = new FileMarketplaceRepository(path.join(tempDir, "store.json"));
    await repository.init();

    const productRegistry = await repository.listProductRegistry();
    const sellerRegistry = await repository.listSellerRegistry();
    const tenantRegistry = await repository.listTenantRegistry();

    expect(productRegistry[0]).toMatchObject({
      canonicalEntityId: "marketplace:product:product-governance-dashboard-nft",
      tenantId: "tenant-axodus-dao",
      lifecycleState: "active",
      licenseModel: "NFT Access License"
    });
    expect(productRegistry[0].nftMetadata.tokenStandard).toBe("ERC721");
    expect(productRegistry[0].royaltyMetadata.standard).toBe("EIP-2981");
    expect(sellerRegistry.find((seller) => seller.sellerId === "seller-mcp-labs")?.governanceRelationship.warnings).toContain(
      "governance-warning-active"
    );
    expect(tenantRegistry.find((tenant) => tenant.tenantId === "tenant-academy-dao")?.ownershipHierarchy.productIds).toContain(
      "product-academy-cert-bundle"
    );
  });

  it("builds tenant and seller storefront read models with activation disabled", async () => {
    const repository = new FileMarketplaceRepository(path.join(tempDir, "store.json"));
    await repository.init();

    const tenantStorefront = await repository.getTenantStorefront("tenant-axodus-dao");
    const sellerStorefront = await repository.getSellerStorefront("seller-axodus-core");

    expect(tenantStorefront?.activationEnabled).toBe(false);
    expect(tenantStorefront?.metrics.products).toBe(2);
    expect(tenantStorefront?.sellerIds).toContain("seller-axodus-core");
    expect(sellerStorefront?.type).toBe("seller");
    expect(sellerStorefront?.productIds).toEqual(expect.arrayContaining(["product-governance-dashboard-nft", "product-trading-strategy-pass"]));
  });

  it("persists draft listings and validation events without contract writes", async () => {
    const repository = new FileMarketplaceRepository(path.join(tempDir, "store.json"));
    await repository.init();

    const listing = await repository.createDraftListing({
      title: "Runtime listing preview",
      category: "Digital Assets",
      tokenStandard: "ERC721",
      listingType: "fixed",
      chain: "Polygon",
      price: 100,
      currency: "USDC",
      royaltyBps: 500,
      deliveryType: "Signed URL",
      governanceReviewRequired: true,
      description: "Preview-only listing persisted by the API runtime."
    });

    const snapshot = await repository.snapshot();
    expect(listing.contractWriteEnabled).toBe(false);
    expect(snapshot.draftListings[0].id).toBe(listing.id);
    expect(snapshot.events.some((event) => event.type === "listing.created")).toBe(true);
    expect(snapshot.events.some((event) => event.type === "validation.requested")).toBe(true);
  });

  it("persists purchase, billing, subscription and delivery previews as non-settlement records", async () => {
    const repository = new FileMarketplaceRepository(path.join(tempDir, "store.json"));
    await repository.init();

    const purchase = await repository.createPurchasePreview({ productId: "product-governance-dashboard-nft" });
    const billing = await repository.createBillingPreview({ productId: "product-governance-dashboard-nft" });
    const subscription = await repository.createSubscriptionPreview({ productId: "product-governance-dashboard-nft" });
    const delivery = await repository.createDeliveryPreview("product-governance-dashboard-nft");

    expect(purchase.settlementEnabled).toBe(false);
    expect(purchase.blockchainWritesEnabled).toBe(false);
    expect(billing.settlementEnabled).toBe(false);
    expect(subscription.settlementEnabled).toBe(false);
    expect(delivery.productionGreenfieldEnabled).toBe(false);
    expect((await repository.listEvents()).map((event) => event.type)).toEqual(
      expect.arrayContaining([
        "purchase.preview_issued",
        "license.preview_issued",
        "billing.preview_generated",
        "subscription.preview_updated",
        "delivery.preview_issued"
      ])
    );
  });

  it("persists license lifecycle and entitlement aggregation", async () => {
    const repository = new FileMarketplaceRepository(path.join(tempDir, "store.json"));
    await repository.init();

    const purchase = await repository.createPurchasePreview({ productId: "product-governance-dashboard-nft", buyer: "0xHolder" });
    const license = (await repository.listLicenseRuntimes()).find((item) => item.issuedFromPurchaseId === purchase.id);
    expect(license).toBeDefined();
    expect(license?.settlementEnabled).toBe(false);
    expect(license?.nftExecutionEnabled).toBe(false);

    const activeLicense = await repository.updateLicenseLifecycle({
      licenseId: license!.id,
      state: "active",
      reason: "mock-activation-preview"
    });
    const entitlement = await repository.getEntitlementSnapshot("0xHolder");

    expect(activeLicense.state).toBe("active");
    expect(entitlement.activeLicenses).toContain(activeLicense.id);
    expect(entitlement.ownedProducts).toContain("product-governance-dashboard-nft");
    expect(entitlement.accessEnforcement.realBlockingEnabled).toBe(false);
    expect(entitlement.futureMerges.nftOwnershipMergeReady).toBe(true);
  });

  it("persists subscription lifecycle and exposes subscription entitlements", async () => {
    const repository = new FileMarketplaceRepository(path.join(tempDir, "store.json"));
    await repository.init();

    const subscription = await repository.createSubscriptionPreview({ productId: "product-governance-dashboard-nft", holder: "0xSub" });
    expect(subscription.status).toBe("pending");
    expect(subscription.renewalPreviewAt).toBeTruthy();

    const activeSubscription = await repository.updateSubscriptionLifecycle({
      subscriptionId: subscription.id,
      state: "active",
      reason: "mock-subscription-activation"
    });
    const entitlement = await repository.getEntitlementSnapshot("0xSub");

    expect(activeSubscription.status).toBe("active");
    expect(entitlement.activeSubscriptions).toContain(subscription.id);
    expect(entitlement.accessEnforcement.subscriptionGatedProductsReady).toBe(true);
  });

  it("persists invoice previews with treasury and royalty accounting", async () => {
    const repository = new FileMarketplaceRepository(path.join(tempDir, "store.json"));
    await repository.init();

    const invoice = await repository.createInvoicePreview({
      buyer: "0xAccounting",
      productIds: ["product-governance-dashboard-nft"]
    });

    expect(invoice.state).toBe("preview");
    expect(invoice.lineItems).toHaveLength(1);
    expect(invoice.royaltyPreview).toBe(6);
    expect(invoice.platformFeePreview).toBe(3);
    expect(invoice.ecosystemFeePreview).toBe(1.2);
    expect(invoice.treasurySplitPreview).toBe(4.2);
    expect(invoice.creatorSplitPreview).toBe(109.8);
    expect(invoice.reconciliation.state).toBe("preview_unreconciled");
    expect(invoice.settlementEnabled).toBe(false);
    expect(invoice.treasuryExecutionEnabled).toBe(false);

    const paidPreview = await repository.updateInvoiceLifecycle({ invoiceId: invoice.id, state: "mock_paid" });
    expect(paidPreview.reconciliation.state).toBe("preview_reconciled");
    expect((await repository.listAccountingTelemetry()).map((event) => event.type)).toContain("invoice.lifecycle_updated");
  });

  it("persists audit logs and replay-safe categorized runtime events", async () => {
    const repository = new FileMarketplaceRepository(path.join(tempDir, "store.json"));
    await repository.init();

    await repository.createPurchasePreview({ productId: "product-governance-dashboard-nft", buyer: "0xAudit" });
    const events = await repository.listEvents();
    const auditLogs = await repository.listAuditLogs();

    expect(events[0].replaySafe).toBe(true);
    expect(events.map((event) => event.category)).toEqual(expect.arrayContaining(["license", "product"]));
    expect(auditLogs.length).toBeGreaterThan(0);
    expect(auditLogs[0].runtimeMetadata.blockchainWritesEnabled).toBe(false);
    expect(auditLogs[0].runtimeMetadata.correlationId).toBeTruthy();
  });

  it("creates reconciliation and indexer readiness snapshots without live ingestion", async () => {
    const repository = new FileMarketplaceRepository(path.join(tempDir, "store.json"));
    await repository.init();
    await repository.createPurchasePreview({ productId: "product-governance-dashboard-nft", buyer: "0xRecon" });
    const license = (await repository.listLicenseRuntimes())[0];
    await repository.createInvoicePreview({ buyer: "0xRecon", productIds: ["product-governance-dashboard-nft"] });

    const reconciliation = await repository.createReconciliationSnapshot();
    const indexer = await repository.createIndexerSnapshot();

    expect(reconciliation.blockchainReads.prepared).toBe(true);
    expect(reconciliation.blockchainReads.enabled).toBe(false);
    expect(reconciliation.licenseVerification.pendingLicenseIds).toContain(license.id);
    expect(indexer.runtimeSnapshot.nftEventIngestionReady).toBe(true);
    expect(indexer.contracts[0].liveIngestionEnabled).toBe(false);
  });

  it("persists chain ingestion events and runtime snapshots", async () => {
    const repository = new FileMarketplaceRepository(path.join(tempDir, "store.json"));
    await repository.init();

    const event = await repository.ingestChainEvent({
      chain: "Polygon",
      blockNumber: 12345,
      blockHash: "0xblock",
      transactionHash: "0xtx",
      logIndex: 1,
      eventKind: "nft.transfer",
      contractAddress: "mock:governance-dashboard-access",
      tokenStandard: "ERC721",
      tokenId: "AXD-GOV-001",
      owner: "0xOwner"
    });
    await repository.ingestChainEvent({
      chain: "Polygon",
      blockNumber: 12346,
      blockHash: "0xblock2",
      transactionHash: "0xtx2",
      logIndex: 2,
      eventKind: "listing.created",
      contractAddress: "mock:governance-dashboard-access",
      tokenStandard: "ERC721",
      tokenId: "AXD-GOV-001",
      listingId: "listing-1",
      seller: "0xSeller",
      price: "120000000",
      expiration: "2026-06-01T00:00:00.000Z"
    });
    await repository.ingestChainEvent({
      chain: "Polygon",
      blockNumber: 12347,
      blockHash: "0xblock3",
      transactionHash: "0xtx3",
      logIndex: 3,
      eventKind: "bid.placed",
      contractAddress: "mock:governance-dashboard-access",
      tokenStandard: "ERC721",
      tokenId: "AXD-GOV-001",
      listingId: "listing-1",
      bidder: "0xBidder",
      amount: "125000000"
    });

    const chainSnapshots = await repository.listChainSnapshots();
    const ownershipSnapshots = await repository.listOwnershipSnapshots();
    const listingSnapshots = await repository.listListingSnapshots();
    const runtime = await repository.getMarketplaceIndexerRuntime();
    const events = await repository.listEvents();

    expect(event.productId).toBe("product-governance-dashboard-nft");
    expect(event.liveSettlementEnabled).toBe(false);
    expect(chainSnapshots[0].latestBlockNumber).toBe(12347);
    expect(chainSnapshots[0].eventsIngested).toBe(3);
    expect(ownershipSnapshots[0]).toMatchObject({ owner: "0xOwner", stale: false });
    expect(listingSnapshots[0]).toMatchObject({ listingId: "listing-1", highestBid: "125000000", bidCount: 1 });
    expect(runtime.metrics).toMatchObject({ events: 3, nftEvents: 1, listingEvents: 1, bidEvents: 1, chains: 1 });
    expect(runtime.settlementEnabled).toBe(false);
    expect(events.map((item) => item.type)).toEqual(expect.arrayContaining(["indexer.event_ingested", "indexer.chain_snapshot_persisted"]));
  });

  it("builds realtime listing, bid, governance and telemetry snapshots", async () => {
    const repository = new FileMarketplaceRepository(path.join(tempDir, "store.json"));
    await repository.init();

    await repository.createDraftListing({
      title: "Realtime listing preview",
      category: "Digital Assets",
      tokenStandard: "ERC721",
      listingType: "fixed",
      chain: "Polygon",
      price: 100,
      currency: "USDC",
      royaltyBps: 500,
      deliveryType: "Signed URL",
      governanceReviewRequired: true,
      description: "Realtime preview listing"
    });
    await repository.createInvoicePreview({ buyer: "0xRealtime", productIds: ["product-governance-dashboard-nft"] });
    await repository.ingestChainEvent({
      chain: "Polygon",
      blockNumber: 12348,
      blockHash: "0xblock4",
      transactionHash: "0xtx4",
      logIndex: 4,
      eventKind: "bid.placed",
      contractAddress: "mock:governance-dashboard-access",
      tokenStandard: "ERC721",
      tokenId: "AXD-GOV-001",
      listingId: "listing-1",
      bidder: "0xBidder",
      amount: "126000000"
    });

    const snapshot = await repository.getRealtimeSnapshot();
    const events = await repository.listEvents();

    expect(snapshot.transport.websocketPrepared).toBe(true);
    expect(snapshot.transport.ssePrepared).toBe(true);
    expect(snapshot.metrics.listingUpdates).toBeGreaterThan(0);
    expect(snapshot.metrics.bidUpdates).toBe(1);
    expect(snapshot.metrics.governanceUpdates).toBeGreaterThan(0);
    expect(snapshot.metrics.telemetryUpdates).toBeGreaterThan(0);
    expect(snapshot.realtimeExecutionEnabled).toBe(false);
    expect(snapshot.externalBrokerEnabled).toBe(false);
    expect(events[0]).toMatchObject({ type: "realtime.snapshot_generated", category: "telemetry" });
  });

  it("builds operational resilience retry queues and degraded recovery mode", async () => {
    const repository = new FileMarketplaceRepository(path.join(tempDir, "store.json"));
    await repository.init();
    await repository.createPurchasePreview({ productId: "product-governance-dashboard-nft", buyer: "0xExpectedOwner" });
    await repository.createInvoicePreview({ buyer: "0xPending", productIds: ["product-governance-dashboard-nft"] });
    await repository.ingestChainEvent({
      chain: "Polygon",
      blockNumber: 1,
      blockHash: "0xold",
      transactionHash: "0xoldtx",
      logIndex: 1,
      eventKind: "nft.transfer",
      contractAddress: "mock:governance-dashboard-access",
      tokenStandard: "ERC721",
      tokenId: "AXD-GOV-001",
      owner: "0xDifferentOwner"
    });
    await repository.ingestChainEvent({
      chain: "Polygon",
      blockNumber: 400,
      blockHash: "0xlatest",
      transactionHash: "0xlatesttx",
      logIndex: 2,
      eventKind: "listing.created",
      contractAddress: "mock:governance-dashboard-access",
      tokenStandard: "ERC721",
      tokenId: "AXD-GOV-001",
      listingId: "listing-stale",
      seller: "0xSeller",
      price: "120000000"
    });
    await repository.createOwnershipReconciliationSnapshot();
    await repository.createTreasuryReconciliationSnapshot();

    const resilience = await repository.getOperationalResilienceSnapshot();
    const events = await repository.listEvents();

    expect(resilience.mode).toBe("recovery_required");
    expect(resilience.degradedMode.enabled).toBe(true);
    expect(resilience.retryQueues.reconciliation.length).toBeGreaterThan(0);
    expect(resilience.retryQueues.treasury.length).toBeGreaterThan(0);
    expect(resilience.retryQueues.indexer.length).toBeGreaterThan(0);
    expect(resilience.metrics.queuedRetries).toBeGreaterThan(0);
    expect(resilience.staleRecovery.automaticRecoveryEnabled).toBe(false);
    expect(resilience.retryExecutionEnabled).toBe(false);
    expect(resilience.failoverExecutionEnabled).toBe(false);
    expect(events[0]).toMatchObject({ type: "resilience.snapshot_generated", category: "telemetry" });
  });

  it("verifies Greenfield bucket auth through entitlement and blocks restricted access", async () => {
    const repository = new FileMarketplaceRepository(path.join(tempDir, "store.json"));
    await repository.init();
    await repository.createPurchasePreview({ productId: "product-governance-dashboard-nft", buyer: "0xGreenfieldHolder" });
    const license = (await repository.listLicenseRuntimes()).find((item) => item.holder === "0xGreenfieldHolder");
    await repository.updateLicenseLifecycle({ licenseId: license?.id ?? "", state: "active", reason: "greenfield-auth-test" });

    const verified = await repository.createGreenfieldAuthRuntime({
      productId: "product-governance-dashboard-nft",
      holder: "0xGreenfieldHolder"
    });
    const blocked = await repository.createGreenfieldAuthRuntime({
      productId: "product-academy-cert-bundle",
      holder: "0xGreenfieldHolder"
    });
    const snapshot = await repository.getGreenfieldAuthSnapshot();
    const events = await repository.listEvents();

    expect(verified.bucket).toMatchObject({ name: "mock-greenfield-governance-access", bucketAuthReady: true });
    expect(verified.ownership.verified).toBe(true);
    expect(verified.accessVerification.status).toBe("verified-preview");
    expect(verified.delivery.signedUrlPreview).toContain("signature=auth-preview");
    expect(verified.externalGreenfieldCallEnabled).toBe(false);
    expect(blocked.accessVerification.status).toBe("blocked-preview");
    expect(blocked.accessVerification.reasons).toEqual(expect.arrayContaining(["greenfield-nft-ownership-not-verified"]));
    expect(snapshot.metrics.verifiedAccess).toBeGreaterThan(0);
    expect(snapshot.productionGreenfieldEnabled).toBe(false);
    expect(events[0]).toMatchObject({ type: "greenfield.auth_verified", category: "delivery" });
  });

  it("issues, expires and revokes signed URL runtimes", async () => {
    const repository = new FileMarketplaceRepository(path.join(tempDir, "store.json"));
    await repository.init();
    await repository.createPurchasePreview({ productId: "product-governance-dashboard-nft", buyer: "0xSignedUrlHolder" });
    const license = (await repository.listLicenseRuntimes()).find((item) => item.holder === "0xSignedUrlHolder");
    await repository.updateLicenseLifecycle({ licenseId: license?.id ?? "", state: "active", reason: "signed-url-runtime-test" });

    const issued = await repository.issueSignedUrl({
      productId: "product-governance-dashboard-nft",
      holder: "0xSignedUrlHolder",
      ttlSeconds: 120
    });
    const expiredSnapshot = buildSignedUrlSnapshot(
      [{ ...issued, expiresAt: new Date(Date.now() - 1_000).toISOString() }],
      new Date()
    );
    const revoked = await repository.revokeSignedUrl({ signedUrlId: issued.id, reason: "operator-preview-revocation" });
    const snapshot = await repository.getSignedUrlSnapshot();
    const events = await repository.listEvents();

    expect(issued.status).toBe("issued");
    expect(issued.url).toContain("signature=");
    expect(issued.signature).toHaveLength(64);
    expect(issued.expirationVisible).toBe(true);
    expect(issued.revocationVisible).toBe(true);
    expect(issued.signing.algorithm).toBe("HMAC-SHA256");
    expect(issued.externalSignedUrlEnabled).toBe(false);
    expect(expiredSnapshot.records[0].status).toBe("expired");
    expect(revoked).toMatchObject({ status: "revoked", revocationReason: "operator-preview-revocation" });
    expect(snapshot.metrics.revoked).toBe(1);
    expect(snapshot.productionGreenfieldEnabled).toBe(false);
    expect(events.map((event) => event.type)).toEqual(expect.arrayContaining(["signed_url.issued", "signed_url.revoked"]));
  });

  it("enforces license, subscription and DAO access operationally", async () => {
    const repository = new FileMarketplaceRepository(path.join(tempDir, "store.json"));
    await repository.init();

    const deniedLicense = await repository.evaluateEntitlementEnforcement({
      productId: "product-governance-dashboard-nft",
      holder: "0xEnforcement"
    });

    await repository.createPurchasePreview({ productId: "product-governance-dashboard-nft", buyer: "0xEnforcement" });
    const license = (await repository.listLicenseRuntimes()).find((item) => item.holder === "0xEnforcement");
    await repository.updateLicenseLifecycle({ licenseId: license?.id ?? "", state: "active", reason: "enforcement-license-active" });
    const allowedLicense = await repository.evaluateEntitlementEnforcement({
      productId: "product-governance-dashboard-nft",
      holder: "0xEnforcement"
    });

    const deniedDao = await repository.evaluateEntitlementEnforcement({
      productId: "product-academy-cert-bundle",
      holder: "0xAcademyMember"
    });
    const subscription = await repository.createSubscriptionPreview({ productId: "product-academy-cert-bundle", holder: "0xAcademyMember" });
    await repository.updateSubscriptionLifecycle({ subscriptionId: subscription.id, state: "active", reason: "enforcement-subscription-active" });
    const allowedDaoSubscription = await repository.evaluateEntitlementEnforcement({
      productId: "product-academy-cert-bundle",
      holder: "0xAcademyMember",
      daoId: "tenant-academy-dao"
    });
    const snapshot = await repository.getEntitlementEnforcementSnapshot();
    const events = await repository.listEvents();

    expect(deniedLicense).toMatchObject({ decision: "denied", deliveryAllowed: false, signedUrlAllowed: false, enforcementApplied: true });
    expect(deniedLicense.checks.license.reasonCodes).toContain("license-required");
    expect(allowedLicense).toMatchObject({ decision: "allowed", deliveryAllowed: true, signedUrlAllowed: true });
    expect(allowedLicense.checks.license.valid).toBe(true);
    expect(deniedDao.checks.dao.reasonCodes).toContain("dao-access-required");
    expect(deniedDao.checks.subscription.reasonCodes).toContain("subscription-required");
    expect(allowedDaoSubscription.decision).toBe("review_required");
    expect(allowedDaoSubscription.checks.subscription.valid).toBe(true);
    expect(allowedDaoSubscription.checks.dao.valid).toBe(true);
    expect(allowedDaoSubscription.checks.governance.reasonCodes).toContain("governance-review-required");
    expect(snapshot.enforcementOperational).toBe(true);
    expect(snapshot.metrics.denied).toBeGreaterThan(0);
    expect(events[0]).toMatchObject({ type: "entitlement.enforcement_evaluated", category: "entitlement" });
  });

  it("prepares encrypted downloads, secure streams and ACS package delivery", async () => {
    const repository = new FileMarketplaceRepository(path.join(tempDir, "store.json"));
    await repository.init();
    await repository.createPurchasePreview({ productId: "product-governance-dashboard-nft", buyer: "0xDeliveryHolder" });
    const license = (await repository.listLicenseRuntimes()).find((item) => item.holder === "0xDeliveryHolder");
    await repository.updateLicenseLifecycle({ licenseId: license?.id ?? "", state: "active", reason: "secure-delivery-license-active" });

    const encrypted = await repository.createSecureDelivery({
      productId: "product-governance-dashboard-nft",
      holder: "0xDeliveryHolder",
      mode: "encrypted_download"
    });
    const stream = await repository.createSecureDelivery({
      productId: "product-governance-dashboard-nft",
      holder: "0xDeliveryHolder",
      mode: "secure_stream"
    });
    const blockedAcs = await repository.createSecureDelivery({
      productId: "product-mcp-agent-template",
      holder: "0xDeliveryHolder",
      mode: "acs_package"
    });
    const snapshot = await repository.getSecureDeliverySnapshot();
    const events = await repository.listEvents();

    expect(encrypted.status).toBe("prepared");
    expect(encrypted.encryptedDownload).toMatchObject({ enabled: true, algorithm: "AES-256-GCM", keyWrap: "HMAC-SHA256" });
    expect(encrypted.encryptedDownload.downloadToken).toContain("dl_");
    expect(encrypted.productionDeliveryEnabled).toBe(false);
    expect(stream.status).toBe("prepared");
    expect(stream.secureStream).toMatchObject({ enabled: true, protocol: "HLS-preview", segmentTtlSeconds: 90 });
    expect(stream.secureStream.streamToken).toContain("stream_");
    expect(blockedAcs.status).toBe("blocked");
    expect(blockedAcs.acsPackage.provisioningEnabled).toBe(false);
    expect(snapshot.metrics.encryptedDownloads).toBe(1);
    expect(snapshot.metrics.secureStreams).toBe(1);
    expect(snapshot.metrics.blocked).toBeGreaterThan(0);
    expect(events[0]).toMatchObject({ type: "secure_delivery.prepared", category: "delivery" });
  });

  it("persists delivery telemetry, entitlement traces and access analytics", async () => {
    const repository = new FileMarketplaceRepository(path.join(tempDir, "store.json"));
    await repository.init();
    await repository.createPurchasePreview({ productId: "product-governance-dashboard-nft", buyer: "0xTelemetryHolder" });
    const license = (await repository.listLicenseRuntimes()).find((item) => item.holder === "0xTelemetryHolder");
    await repository.updateLicenseLifecycle({ licenseId: license?.id ?? "", state: "active", reason: "delivery-telemetry-license-active" });
    const encrypted = await repository.createSecureDelivery({
      productId: "product-governance-dashboard-nft",
      holder: "0xTelemetryHolder",
      mode: "encrypted_download"
    });
    const stream = await repository.createSecureDelivery({
      productId: "product-governance-dashboard-nft",
      holder: "0xTelemetryHolder",
      mode: "secure_stream"
    });
    const blocked = await repository.createSecureDelivery({
      productId: "product-mcp-agent-template",
      holder: "0xTelemetryHolder",
      mode: "acs_package"
    });

    const downloadTelemetry = await repository.recordDeliveryTelemetry({ deliveryId: encrypted.id, event: "download_requested" });
    const streamTelemetry = await repository.recordDeliveryTelemetry({ deliveryId: stream.id, event: "stream_started" });
    const deniedTelemetry = await repository.recordDeliveryTelemetry({ deliveryId: blocked.id, event: "access_denied", actor: "delivery-auditor" });
    const observability = await repository.getDeliveryObservabilitySnapshot();
    const auditLogs = await repository.listAuditLogs();
    const events = await repository.listEvents();

    expect(downloadTelemetry.outcome).toBe("allowed");
    expect(downloadTelemetry.deliveryAudit.encryptedDownloadObserved).toBe(true);
    expect(downloadTelemetry.entitlementTrace.decision).toBe("allowed");
    expect(streamTelemetry.deliveryAudit.secureStreamObserved).toBe(true);
    expect(deniedTelemetry.outcome).toBe("denied");
    expect(deniedTelemetry.actor).toBe("delivery-auditor");
    expect(observability.analytics).toMatchObject({ totalEvents: 3, downloadEvents: 1, streamEvents: 1, deniedEvents: 1 });
    expect(observability.audit.entitlementTraceRecords).toBe(3);
    expect(observability.audit.productionDeliveryEnabled).toBe(false);
    expect(auditLogs[0].action).toBe("delivery.telemetry_recorded");
    expect(events[0]).toMatchObject({ type: "delivery.telemetry_recorded", category: "delivery" });
  });

  it("executes controlled settlement runtime and transaction lifecycle without wallet writes", async () => {
    const repository = new FileMarketplaceRepository(path.join(tempDir, "store.json"));
    await repository.init();

    const blocked = await repository.executeSettlement({
      productId: "product-governance-dashboard-nft",
      buyer: "0xSettlementBuyer"
    });
    const confirmed = await repository.executeSettlement({
      productId: "product-governance-dashboard-nft",
      buyer: "0xSettlementBuyer",
      controlledRollout: true
    });
    const snapshot = await repository.getSettlementSnapshot();
    const purchases = await repository.listPurchases();
    const licenses = await repository.listLicenseRuntimes();
    const events = await repository.listEvents();

    expect(blocked.status).toBe("blocked");
    expect(blocked.transaction.reasonCodes).toContain("controlled-rollout-required");
    expect(confirmed.status).toBe("confirmed");
    expect(confirmed.transaction.lifecycle).toBe("confirmed");
    expect(confirmed.transaction.confirmationId).toContain("confirmation-");
    expect(confirmed.settlementRuntimeEnabled).toBe(true);
    expect(confirmed.walletExecutionEnabled).toBe(false);
    expect(confirmed.blockchainWritesEnabled).toBe(false);
    expect(confirmed.externalPaymentEnabled).toBe(false);
    expect(confirmed.treasuryMovementEnabled).toBe(false);
    expect(purchases.some((purchase) => purchase.id === confirmed.purchaseId)).toBe(true);
    expect(licenses.some((license) => license.issuedFromPurchaseId === confirmed.purchaseId)).toBe(true);
    expect(snapshot.metrics.confirmed).toBe(1);
    expect(snapshot.metrics.blocked).toBe(1);
    expect(snapshot.metrics.totalVolume).toBe(120);
    expect(events.map((event) => event.type)).toEqual(expect.arrayContaining(["settlement.executed", "settlement.blocked"]));
  });

  it("reconciles ownership snapshots with mismatch and stale visibility", async () => {
    const repository = new FileMarketplaceRepository(path.join(tempDir, "store.json"));
    await repository.init();
    await repository.createPurchasePreview({ productId: "product-governance-dashboard-nft", buyer: "0xExpectedOwner" });

    await repository.ingestChainEvent({
      chain: "Polygon",
      blockNumber: 100,
      blockHash: "0xblock100",
      transactionHash: "0xowner-mismatch",
      logIndex: 1,
      eventKind: "nft.transfer",
      contractAddress: "mock:governance-dashboard-access",
      tokenStandard: "ERC721",
      tokenId: "AXD-GOV-001",
      owner: "0xDifferentOwner"
    });
    await repository.ingestChainEvent({
      chain: "Polygon",
      blockNumber: 250,
      blockHash: "0xblock250",
      transactionHash: "0xlisting-advance-block",
      logIndex: 2,
      eventKind: "listing.updated",
      contractAddress: "mock:governance-dashboard-access",
      tokenStandard: "ERC721",
      tokenId: "AXD-GOV-001",
      listingId: "listing-1",
      price: "120000000"
    });

    const reconciliation = await repository.createOwnershipReconciliationSnapshot();
    const persisted = await repository.listOwnershipReconciliationSnapshots();
    const record = reconciliation.records.find((item) => item.productId === "product-governance-dashboard-nft");

    expect(record?.status).toBe("mismatch");
    expect(record?.stale).toBe(true);
    expect(record?.blockLag).toBe(150);
    expect(record?.expectedHolders).toContain("0xExpectedOwner");
    expect(record?.observedOwner).toBe("0xDifferentOwner");
    expect(reconciliation.metrics.stale).toBeGreaterThan(0);
    expect(reconciliation.metrics.mismatches).toBeGreaterThan(0);
    expect(reconciliation.enforcementEnabled).toBe(false);
    expect(reconciliation.chainReadsEnabled).toBe(false);
    expect(persisted[0].id).toBe(reconciliation.id);
  });

  it("reconciles royalty, treasury split and accounting previews", async () => {
    const repository = new FileMarketplaceRepository(path.join(tempDir, "store.json"));
    await repository.init();
    const invoice = await repository.createInvoicePreview({ buyer: "0xTreasury", productIds: ["product-governance-dashboard-nft"] });

    const pending = await repository.createTreasuryReconciliationSnapshot();
    await repository.updateInvoiceLifecycle({ invoiceId: invoice.id, state: "mock_paid", reason: "treasury-preview-paid" });
    const reconciled = await repository.createTreasuryReconciliationSnapshot();
    const persisted = await repository.listTreasuryReconciliationSnapshots();

    expect(pending.records[0]).toMatchObject({
      expectedRoyalty: 6,
      observedRoyalty: 6,
      expectedTreasurySplit: 4.2,
      observedTreasurySplit: 4.2,
      status: "pending_preview",
      mismatchAmount: 0
    });
    expect(reconciled.records[0].status).toBe("reconciled");
    expect(reconciled.metrics.reconciled).toBe(1);
    expect(reconciled.metrics.totalMismatchAmount).toBe(0);
    expect(reconciled.accountingConsistency.invoiceTelemetryLinked).toBe(true);
    expect(reconciled.treasuryExecutionEnabled).toBe(false);
    expect(reconciled.settlementEnabled).toBe(false);
    expect(persisted[0].id).toBe(reconciled.id);
  });

  it("hydrates governance runtime authority for products, sellers and tenants", async () => {
    const repository = new FileMarketplaceRepository(path.join(tempDir, "store.json"));
    await repository.init();

    const snapshot = await repository.getGovernanceAuthoritySnapshot();
    const restrictedProduct = await repository.getGovernanceAuthority("product-mcp-agent-template");
    const warningSeller = await repository.getGovernanceAuthority("seller-mcp-labs");
    const tenant = await repository.getGovernanceAuthority("tenant-axodus-dao");

    expect(snapshot.writeExecutionEnabled).toBe(false);
    expect(snapshot.governanceWritesEnabled).toBe(false);
    expect(restrictedProduct?.restrictionState).toBe("restricted");
    expect(restrictedProduct?.operationalApproval).toBe("emergency_review");
    expect(warningSeller?.warnings).toContain("seller-governance-warning");
    expect(tenant?.federationTier).toBe("core");
  });

  it("builds governance enforcement boundaries without destructive blocking", async () => {
    const repository = new FileMarketplaceRepository(path.join(tempDir, "store.json"));
    await repository.init();

    const snapshot = await repository.getGovernanceEnforcementSnapshot();
    const restrictedProduct = await repository.getGovernanceEnforcement("product-mcp-agent-template");
    const warningSeller = await repository.getGovernanceEnforcement("seller-mcp-labs");
    const academyTenant = await repository.getGovernanceEnforcement("tenant-academy-dao");

    expect(snapshot.hardBlockingEnabled).toBe(false);
    expect(snapshot.destructiveActionsEnabled).toBe(false);
    expect(snapshot.restrictedProductIds).toContain("product-mcp-agent-template");
    expect(restrictedProduct?.visibility.effectiveState).toBe("limited-preview");
    expect(restrictedProduct?.commerce.purchasePreviewAllowed).toBe(false);
    expect(restrictedProduct?.entitlementImpact.entitlementInvalidationPreview).toBe(true);
    expect(warningSeller?.reviewQueue.queue).toBe("seller");
    expect(academyTenant?.visibility.effectiveState).toBe("review-required-preview");
  });

  it("builds DAO federation runtime with tenant isolation and constitutional inheritance", async () => {
    const repository = new FileMarketplaceRepository(path.join(tempDir, "store.json"));
    await repository.init();

    const federation = await repository.getDAOFederationRuntime();
    const axodusTenantRuntime = await repository.getTenantRuntime("tenant-axodus-dao");
    const academyInheritance = federation.constitutionalInheritance.find((record) => record.tenantId === "tenant-academy-dao");
    const mcpStorefront = federation.storefronts.find((storefront) => storefront.tenantId === "tenant-mcp-working-group");

    expect(federation.publicActivationEnabled).toBe(false);
    expect(federation.settlementEnabled).toBe(false);
    expect(federation.federationMetrics.tenants).toBe(3);
    expect(axodusTenantRuntime?.scopedRuntime.productsScoped).toBe(true);
    expect(axodusTenantRuntime?.scopedRuntime.crossTenantSettlementEnabled).toBe(false);
    expect(axodusTenantRuntime?.boundary.productIds).toEqual(
      expect.arrayContaining(["product-governance-dashboard-nft", "product-trading-strategy-pass"])
    );
    expect(academyInheritance?.inheritedRestrictions).toContain("constitutional-review-inherited-preview");
    expect(mcpStorefront?.activationState).toBe("review-required-preview");
  });

  it("builds governance workflow queues and persists moderation audit actions", async () => {
    const repository = new FileMarketplaceRepository(path.join(tempDir, "store.json"));
    await repository.init();

    const workflow = await repository.getGovernanceWorkflowSnapshot();
    const productQueue = workflow.queues.find((queue) => queue.queue === "product");
    const entitlementQueue = workflow.queues.find((queue) => queue.queue === "entitlement");
    const action = await repository.createGovernanceWorkflowAction({
      actor: "governance-moderator",
      queue: "product",
      entityId: "product-mcp-agent-template",
      entityType: "product",
      action: "restricted",
      reasonCode: "RESTRICT_PRODUCT_COMMERCE",
      notes: "Sprint 14 moderation preview"
    });
    const updatedWorkflow = await repository.getGovernanceWorkflowSnapshot();

    expect(workflow.moderationRuntime.governanceWritesEnabled).toBe(false);
    expect(workflow.constitutionalReasonCodes.map((code) => code.code)).toContain("RESTRICT_PRODUCT_COMMERCE");
    expect(productQueue?.items.some((item) => item.entityId === "product-mcp-agent-template")).toBe(true);
    expect(entitlementQueue?.items.some((item) => item.reasonCodes.includes("RESTRICT_ENTITLEMENT_REVIEW"))).toBe(true);
    expect(action.moderationOnly).toBe(true);
    expect(action.governanceWritesEnabled).toBe(false);
    expect(updatedWorkflow.governanceAudit[0].entityId).toBe("product-mcp-agent-template");
    expect(updatedWorkflow.approvalLifecycle.currentByEntity["product-mcp-agent-template"]).toBe("restricted");
  });

  it("builds governance emergency controls and operator telemetry", async () => {
    const repository = new FileMarketplaceRepository(path.join(tempDir, "store.json"));
    await repository.init();

    await repository.createGovernanceWorkflowAction({
      actor: "governance-moderator",
      queue: "product",
      entityId: "product-mcp-agent-template",
      entityType: "product",
      action: "restricted",
      reasonCode: "RESTRICT_PRODUCT_COMMERCE"
    });
    const observability = await repository.getGovernanceObservabilitySnapshot();

    expect(observability.emergencyRuntime.executionEnabled).toBe(false);
    expect(observability.operatorConsole.liveControlsEnabled).toBe(false);
    expect(observability.emergencyRuntime.controls.some((control) => control.entityId === "product-mcp-agent-template")).toBe(true);
    expect(observability.telemetry.governanceActions).toBeGreaterThan(0);
    expect(observability.telemetry.restrictions).toBeGreaterThan(0);
    expect(observability.federation.tenants).toBe(3);
  });
});

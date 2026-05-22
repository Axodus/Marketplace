import type { MarketplaceRepository } from "../repositories/marketplaceRepository.js";
import {
  validateAuctionBidRequest,
  validateAuctionExpirationRequest,
  validateAuctionSettlementRequest,
  validateBillingPreviewRequest,
  validateChainIngestionEventRequest,
  validateDeliveryTelemetryRequest,
  validateDraftListingRequest,
  validateEntitlementEnforcementRequest,
  validateGreenfieldAuthRequest,
  validateGovernanceWorkflowActionRequest,
  validateInvoiceLifecycleRequest,
  validateInvoicePreviewRequest,
  validateLicenseLifecycleRequest,
  validateProductActionRequest,
  validateRoyaltyDistributionRequest,
  validateSecureDeliveryRequest,
  validateSettlementExecutionRequest,
  validateSignedUrlIssueRequest,
  validateSignedUrlRevokeRequest,
  validateSubscriptionLifecycleRequest,
  validateSubscriptionPreviewRequest
} from "../validation/marketplaceValidation.js";

export class MarketplaceApiService {
  constructor(private readonly repository: MarketplaceRepository) {}

  init() {
    return this.repository.init();
  }

  snapshot() {
    return this.repository.snapshot();
  }

  listProducts() {
    return this.repository.listProducts();
  }

  getProduct(idOrSlug: string) {
    return this.repository.getProduct(idOrSlug);
  }

  listSellers() {
    return this.repository.listSellers();
  }

  listTenants() {
    return this.repository.listTenants();
  }

  listProductRegistry() {
    return this.repository.listProductRegistry();
  }

  listSellerRegistry() {
    return this.repository.listSellerRegistry();
  }

  listTenantRegistry() {
    return this.repository.listTenantRegistry();
  }

  listStorefronts() {
    return this.repository.listStorefronts();
  }

  getStorefront(idOrSlug: string) {
    return this.repository.getStorefront(idOrSlug);
  }

  getTenantStorefront(tenantIdOrSlug: string) {
    return this.repository.getTenantStorefront(tenantIdOrSlug);
  }

  getSellerStorefront(sellerIdOrSlug: string) {
    return this.repository.getSellerStorefront(sellerIdOrSlug);
  }

  listLicenses() {
    return this.repository.listLicenses();
  }

  listLicenseRuntimes() {
    return this.repository.listLicenseRuntimes();
  }

  listEntitlementSnapshots() {
    return this.repository.listEntitlementSnapshots();
  }

  getEntitlementSnapshot(holder: string) {
    return this.repository.getEntitlementSnapshot(holder);
  }

  evaluateEntitlementEnforcement(input: Record<string, unknown>) {
    return this.repository.evaluateEntitlementEnforcement(validateEntitlementEnforcementRequest(input));
  }

  getEntitlementEnforcementSnapshot() {
    return this.repository.getEntitlementEnforcementSnapshot();
  }

  listPurchases() {
    return this.repository.listPurchases();
  }

  executeSettlement(input: Record<string, unknown>) {
    return this.repository.executeSettlement(validateSettlementExecutionRequest(input));
  }

  getSettlementSnapshot() {
    return this.repository.getSettlementSnapshot();
  }

  allocateRoyaltyDistribution(input: Record<string, unknown>) {
    return this.repository.allocateRoyaltyDistribution(validateRoyaltyDistributionRequest(input));
  }

  getRoyaltyDistributionSnapshot() {
    return this.repository.getRoyaltyDistributionSnapshot();
  }

  placeAuctionBid(input: Record<string, unknown>) {
    return this.repository.placeAuctionBid(validateAuctionBidRequest(input));
  }

  settleAuction(input: Record<string, unknown>) {
    return this.repository.settleAuction(validateAuctionSettlementRequest(input));
  }

  expireAuction(input: Record<string, unknown>) {
    return this.repository.expireAuction(validateAuctionExpirationRequest(input));
  }

  getAuctionRuntimeSnapshot() {
    return this.repository.getAuctionRuntimeSnapshot();
  }

  listSubscriptions() {
    return this.repository.listSubscriptions();
  }

  listBillingPreviews() {
    return this.repository.listBillingPreviews();
  }

  listInvoices() {
    return this.repository.listInvoices();
  }

  listAccountingTelemetry() {
    return this.repository.listAccountingTelemetry();
  }

  listGovernanceValidations() {
    return this.repository.listGovernanceValidations();
  }

  getGovernanceAuthoritySnapshot() {
    return this.repository.getGovernanceAuthoritySnapshot();
  }

  getGovernanceAuthority(entityId: string) {
    return this.repository.getGovernanceAuthority(entityId);
  }

  getGovernanceEnforcementSnapshot() {
    return this.repository.getGovernanceEnforcementSnapshot();
  }

  getGovernanceEnforcement(entityId: string) {
    return this.repository.getGovernanceEnforcement(entityId);
  }

  getDAOFederationRuntime() {
    return this.repository.getDAOFederationRuntime();
  }

  getTenantRuntime(tenantId: string) {
    return this.repository.getTenantRuntime(tenantId);
  }

  getGovernanceWorkflowSnapshot() {
    return this.repository.getGovernanceWorkflowSnapshot();
  }

  createGovernanceWorkflowAction(input: Record<string, unknown>) {
    return this.repository.createGovernanceWorkflowAction(validateGovernanceWorkflowActionRequest(input));
  }

  getGovernanceObservabilitySnapshot() {
    return this.repository.getGovernanceObservabilitySnapshot();
  }

  listDeliveryPreviews() {
    return this.repository.listDeliveryPreviews();
  }

  createGreenfieldAuthRuntime(input: Record<string, unknown>) {
    return this.repository.createGreenfieldAuthRuntime(validateGreenfieldAuthRequest(input));
  }

  getGreenfieldAuthSnapshot() {
    return this.repository.getGreenfieldAuthSnapshot();
  }

  issueSignedUrl(input: Record<string, unknown>) {
    return this.repository.issueSignedUrl(validateSignedUrlIssueRequest(input));
  }

  revokeSignedUrl(input: Record<string, unknown>) {
    return this.repository.revokeSignedUrl(validateSignedUrlRevokeRequest(input));
  }

  getSignedUrlSnapshot() {
    return this.repository.getSignedUrlSnapshot();
  }

  createSecureDelivery(input: Record<string, unknown>) {
    return this.repository.createSecureDelivery(validateSecureDeliveryRequest(input));
  }

  getSecureDeliverySnapshot() {
    return this.repository.getSecureDeliverySnapshot();
  }

  recordDeliveryTelemetry(input: Record<string, unknown>) {
    return this.repository.recordDeliveryTelemetry(validateDeliveryTelemetryRequest(input));
  }

  getDeliveryObservabilitySnapshot() {
    return this.repository.getDeliveryObservabilitySnapshot();
  }

  listEvents() {
    return this.repository.listEvents();
  }

  getRealtimeSnapshot() {
    return this.repository.getRealtimeSnapshot();
  }

  getOperationalResilienceSnapshot() {
    return this.repository.getOperationalResilienceSnapshot();
  }

  listAuditLogs() {
    return this.repository.listAuditLogs();
  }

  createReconciliationSnapshot() {
    return this.repository.createReconciliationSnapshot();
  }

  listReconciliationSnapshots() {
    return this.repository.listReconciliationSnapshots();
  }

  createOwnershipReconciliationSnapshot() {
    return this.repository.createOwnershipReconciliationSnapshot();
  }

  listOwnershipReconciliationSnapshots() {
    return this.repository.listOwnershipReconciliationSnapshots();
  }

  createTreasuryReconciliationSnapshot() {
    return this.repository.createTreasuryReconciliationSnapshot();
  }

  listTreasuryReconciliationSnapshots() {
    return this.repository.listTreasuryReconciliationSnapshots();
  }

  createIndexerSnapshot() {
    return this.repository.createIndexerSnapshot();
  }

  listIndexerSnapshots() {
    return this.repository.listIndexerSnapshots();
  }

  ingestChainEvent(input: Record<string, unknown>) {
    return this.repository.ingestChainEvent(validateChainIngestionEventRequest(input));
  }

  listChainIngestionEvents() {
    return this.repository.listChainIngestionEvents();
  }

  listChainSnapshots() {
    return this.repository.listChainSnapshots();
  }

  listOwnershipSnapshots() {
    return this.repository.listOwnershipSnapshots();
  }

  listListingSnapshots() {
    return this.repository.listListingSnapshots();
  }

  getMarketplaceIndexerRuntime() {
    return this.repository.getMarketplaceIndexerRuntime();
  }

  createDraftListing(input: Record<string, unknown>) {
    return this.repository.createDraftListing(validateDraftListingRequest(input));
  }

  createPurchasePreview(input: Record<string, unknown>) {
    return this.repository.createPurchasePreview(validateProductActionRequest(input));
  }

  createBillingPreview(input: Record<string, unknown>) {
    return this.repository.createBillingPreview(validateBillingPreviewRequest(input));
  }

  createInvoicePreview(input: Record<string, unknown>) {
    return this.repository.createInvoicePreview(validateInvoicePreviewRequest(input));
  }

  updateInvoiceLifecycle(input: Record<string, unknown>) {
    return this.repository.updateInvoiceLifecycle(validateInvoiceLifecycleRequest(input));
  }

  createSubscriptionPreview(input: Record<string, unknown>) {
    return this.repository.createSubscriptionPreview(validateSubscriptionPreviewRequest(input));
  }

  updateLicenseLifecycle(input: Record<string, unknown>) {
    return this.repository.updateLicenseLifecycle(validateLicenseLifecycleRequest(input));
  }

  updateSubscriptionLifecycle(input: Record<string, unknown>) {
    return this.repository.updateSubscriptionLifecycle(validateSubscriptionLifecycleRequest(input));
  }

  createDeliveryPreview(input: Record<string, unknown>) {
    const payload = validateProductActionRequest(input);
    return this.repository.createDeliveryPreview(payload.productId);
  }
}

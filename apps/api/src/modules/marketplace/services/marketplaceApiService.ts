import type { MarketplaceRepository } from "../repositories/marketplaceRepository.js";
import {
  validateBillingPreviewRequest,
  validateDraftListingRequest,
  validateGovernanceWorkflowActionRequest,
  validateInvoiceLifecycleRequest,
  validateInvoicePreviewRequest,
  validateLicenseLifecycleRequest,
  validateProductActionRequest,
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

  listPurchases() {
    return this.repository.listPurchases();
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

  listEvents() {
    return this.repository.listEvents();
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

  createIndexerSnapshot() {
    return this.repository.createIndexerSnapshot();
  }

  listIndexerSnapshots() {
    return this.repository.listIndexerSnapshots();
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

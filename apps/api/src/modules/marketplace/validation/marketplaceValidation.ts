import type {
  BillingPreviewRequest,
  ChainIngestionEventKind,
  ChainIngestionEventRequest,
  DeliveryTelemetryRequest,
  DraftListingRequest,
  GovernanceApprovalLifecycleState,
  GovernanceReviewQueueName,
  GovernanceWorkflowActionRequest,
  GreenfieldAuthRequest,
  InvoiceLifecycleRequest,
  InvoicePreviewRequest,
  InvoiceState,
  LicenseLifecycleRequest,
  LicenseLifecycleState,
  PurchasePreviewRequest,
  SecureDeliveryRequest,
  SettlementExecutionRequest,
  SignedUrlIssueRequest,
  SignedUrlRevokeRequest,
  SubscriptionLifecycleRequest,
  SubscriptionLifecycleState,
  SubscriptionPreviewRequest
} from "../dto/contracts.js";

export class ValidationError extends Error {
  status = 400;
  code = "VALIDATION_ERROR";
}

export function validateInvoicePreviewRequest(input: Record<string, unknown>): InvoicePreviewRequest {
  const productIds = Array.isArray(input.productIds) ? input.productIds.filter((item): item is string => typeof item === "string") : [];
  const subscriptionIds = Array.isArray(input.subscriptionIds)
    ? input.subscriptionIds.filter((item): item is string => typeof item === "string")
    : [];
  if (productIds.length === 0 && subscriptionIds.length === 0) {
    throw new ValidationError("productIds or subscriptionIds is required");
  }
  return {
    buyer: typeof input.buyer === "string" && input.buyer.trim() ? input.buyer.trim() : undefined,
    productIds,
    subscriptionIds
  };
}

export function validateInvoiceLifecycleRequest(input: Record<string, unknown>): InvoiceLifecycleRequest {
  const state = assertString(input.state, "state");
  if (!["draft", "preview", "pending", "mock_paid", "failed", "cancelled", "refunded_preview"].includes(state)) {
    throw new ValidationError("state is not a valid invoice state");
  }
  return {
    invoiceId: assertString(input.invoiceId, "invoiceId"),
    state: state as InvoiceState,
    reason: typeof input.reason === "string" && input.reason.trim() ? input.reason.trim() : undefined
  };
}

export function assertString(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new ValidationError(`${field} is required`);
  }
  return value.trim();
}

export function assertNumber(value: unknown, field: string): number {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    throw new ValidationError(`${field} must be numeric`);
  }
  return numeric;
}

export function validateDraftListingRequest(input: Record<string, unknown>): DraftListingRequest {
  return {
    title: assertString(input.title, "title"),
    category: assertString(input.category, "category"),
    tokenStandard: assertString(input.tokenStandard, "tokenStandard"),
    listingType: assertString(input.listingType, "listingType"),
    chain: assertString(input.chain, "chain"),
    price: assertNumber(input.price, "price"),
    currency: assertString(input.currency, "currency"),
    royaltyBps: assertNumber(input.royaltyBps, "royaltyBps"),
    deliveryType: assertString(input.deliveryType, "deliveryType"),
    governanceReviewRequired: Boolean(input.governanceReviewRequired),
    description: assertString(input.description, "description")
  };
}

export function validateProductActionRequest(input: Record<string, unknown>): PurchasePreviewRequest {
  return {
    productId: assertString(input.productId, "productId"),
    buyer: typeof input.buyer === "string" && input.buyer.trim() ? input.buyer.trim() : undefined
  };
}

export function validateBillingPreviewRequest(input: Record<string, unknown>): BillingPreviewRequest {
  return validateProductActionRequest(input);
}

export function validateSettlementExecutionRequest(input: Record<string, unknown>): SettlementExecutionRequest {
  return {
    productId: assertString(input.productId, "productId"),
    buyer: typeof input.buyer === "string" && input.buyer.trim() ? input.buyer.trim() : undefined,
    controlledRollout: input.controlledRollout === true
  };
}

export function validateSubscriptionPreviewRequest(input: Record<string, unknown>): SubscriptionPreviewRequest {
  return {
    productId: assertString(input.productId, "productId"),
    holder: typeof input.holder === "string" && input.holder.trim() ? input.holder.trim() : undefined
  };
}

export function validateGreenfieldAuthRequest(input: Record<string, unknown>): GreenfieldAuthRequest {
  return {
    productId: assertString(input.productId, "productId"),
    holder: typeof input.holder === "string" && input.holder.trim() ? input.holder.trim() : undefined,
    daoId: typeof input.daoId === "string" && input.daoId.trim() ? input.daoId.trim() : undefined
  };
}

export function validateSignedUrlIssueRequest(input: Record<string, unknown>): SignedUrlIssueRequest {
  const ttlSeconds = input.ttlSeconds === undefined ? undefined : assertNumber(input.ttlSeconds, "ttlSeconds");
  return {
    productId: assertString(input.productId, "productId"),
    holder: typeof input.holder === "string" && input.holder.trim() ? input.holder.trim() : undefined,
    daoId: typeof input.daoId === "string" && input.daoId.trim() ? input.daoId.trim() : undefined,
    ttlSeconds
  };
}

export function validateEntitlementEnforcementRequest(input: Record<string, unknown>) {
  return {
    productId: assertString(input.productId, "productId"),
    holder: typeof input.holder === "string" && input.holder.trim() ? input.holder.trim() : undefined,
    daoId: typeof input.daoId === "string" && input.daoId.trim() ? input.daoId.trim() : undefined
  };
}

export function validateSecureDeliveryRequest(input: Record<string, unknown>): SecureDeliveryRequest {
  const mode = typeof input.mode === "string" && input.mode.trim() ? input.mode.trim() : undefined;
  if (mode && !["encrypted_download", "secure_stream", "acs_package"].includes(mode)) {
    throw new ValidationError("mode is not a valid secure delivery mode");
  }
  return {
    productId: assertString(input.productId, "productId"),
    holder: typeof input.holder === "string" && input.holder.trim() ? input.holder.trim() : undefined,
    daoId: typeof input.daoId === "string" && input.daoId.trim() ? input.daoId.trim() : undefined,
    mode: mode as SecureDeliveryRequest["mode"]
  };
}

export function validateDeliveryTelemetryRequest(input: Record<string, unknown>): DeliveryTelemetryRequest {
  const event = assertString(input.event, "event");
  if (!["download_requested", "stream_started", "acs_package_requested", "access_denied", "delivery_completed"].includes(event)) {
    throw new ValidationError("event is not a valid delivery telemetry event");
  }
  return {
    deliveryId: assertString(input.deliveryId, "deliveryId"),
    event: event as DeliveryTelemetryRequest["event"],
    actor: typeof input.actor === "string" && input.actor.trim() ? input.actor.trim() : undefined
  };
}

export function validateSignedUrlRevokeRequest(input: Record<string, unknown>): SignedUrlRevokeRequest {
  return {
    signedUrlId: assertString(input.signedUrlId, "signedUrlId"),
    reason: typeof input.reason === "string" && input.reason.trim() ? input.reason.trim() : undefined
  };
}

export function validateLicenseLifecycleRequest(input: Record<string, unknown>): LicenseLifecycleRequest {
  const state = assertString(input.state, "state");
  if (!["preview", "issued", "active", "suspended", "expired", "revoked"].includes(state)) {
    throw new ValidationError("state is not a valid license lifecycle state");
  }
  return {
    licenseId: assertString(input.licenseId, "licenseId"),
    state: state as LicenseLifecycleState,
    reason: typeof input.reason === "string" && input.reason.trim() ? input.reason.trim() : undefined
  };
}

export function validateSubscriptionLifecycleRequest(input: Record<string, unknown>): SubscriptionLifecycleRequest {
  const state = assertString(input.state, "state");
  if (!["active", "paused", "renewal_due", "pending", "cancelled", "expired"].includes(state)) {
    throw new ValidationError("state is not a valid subscription lifecycle state");
  }
  return {
    subscriptionId: assertString(input.subscriptionId, "subscriptionId"),
    state: state as SubscriptionLifecycleState,
    reason: typeof input.reason === "string" && input.reason.trim() ? input.reason.trim() : undefined
  };
}

export function validateGovernanceWorkflowActionRequest(input: Record<string, unknown>): GovernanceWorkflowActionRequest {
  const queue = assertString(input.queue, "queue");
  if (!["product", "seller", "storefront", "entitlement", "billing"].includes(queue)) {
    throw new ValidationError("queue is not a valid governance review queue");
  }
  const action = assertString(input.action, "action");
  if (!["pending_approval", "approved", "rejected", "restricted", "escalated", "emergency_review"].includes(action)) {
    throw new ValidationError("action is not a valid governance approval lifecycle state");
  }
  return {
    actor: assertString(input.actor, "actor"),
    queue: queue as GovernanceReviewQueueName,
    entityId: assertString(input.entityId, "entityId"),
    entityType: assertString(input.entityType, "entityType"),
    action: action as GovernanceApprovalLifecycleState,
    reasonCode: assertString(input.reasonCode, "reasonCode"),
    notes: typeof input.notes === "string" && input.notes.trim() ? input.notes.trim() : undefined
  };
}

export function validateChainIngestionEventRequest(input: Record<string, unknown>): ChainIngestionEventRequest {
  const eventKind = assertString(input.eventKind, "eventKind");
  if (
    ![
      "nft.transfer",
      "nft.approval",
      "listing.created",
      "listing.updated",
      "listing.cancelled",
      "auction.created",
      "auction.settled",
      "bid.placed",
      "ownership.verified"
    ].includes(eventKind)
  ) {
    throw new ValidationError("eventKind is not a valid Marketplace chain ingestion event");
  }

  const raw = input.raw && typeof input.raw === "object" && !Array.isArray(input.raw) ? (input.raw as Record<string, unknown>) : undefined;
  return {
    chain: assertString(input.chain, "chain"),
    blockNumber: assertNumber(input.blockNumber, "blockNumber"),
    blockHash: assertString(input.blockHash, "blockHash"),
    transactionHash: assertString(input.transactionHash, "transactionHash"),
    logIndex: assertNumber(input.logIndex, "logIndex"),
    eventKind: eventKind as ChainIngestionEventKind,
    contractAddress: assertString(input.contractAddress, "contractAddress"),
    tokenStandard: typeof input.tokenStandard === "string" && input.tokenStandard.trim() ? input.tokenStandard.trim() : undefined,
    tokenId: typeof input.tokenId === "string" && input.tokenId.trim() ? input.tokenId.trim() : undefined,
    listingId: typeof input.listingId === "string" && input.listingId.trim() ? input.listingId.trim() : undefined,
    seller: typeof input.seller === "string" && input.seller.trim() ? input.seller.trim() : undefined,
    buyer: typeof input.buyer === "string" && input.buyer.trim() ? input.buyer.trim() : undefined,
    bidder: typeof input.bidder === "string" && input.bidder.trim() ? input.bidder.trim() : undefined,
    owner: typeof input.owner === "string" && input.owner.trim() ? input.owner.trim() : undefined,
    amount: typeof input.amount === "string" && input.amount.trim() ? input.amount.trim() : undefined,
    price: typeof input.price === "string" && input.price.trim() ? input.price.trim() : undefined,
    expiration: typeof input.expiration === "string" && input.expiration.trim() ? input.expiration.trim() : undefined,
    raw
  };
}

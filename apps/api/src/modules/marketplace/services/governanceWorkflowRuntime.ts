import { randomUUID } from "node:crypto";
import type {
  ConstitutionalReasonCode,
  GovernanceApprovalLifecycleState,
  GovernanceReviewQueue,
  GovernanceReviewQueueName,
  GovernanceWorkflowActionRecord,
  GovernanceWorkflowQueueItem,
  GovernanceWorkflowSnapshot,
  MarketplaceStore
} from "../dto/contracts.js";

const supportedStates: GovernanceApprovalLifecycleState[] = [
  "pending_approval",
  "approved",
  "rejected",
  "restricted",
  "escalated",
  "emergency_review"
];

export const constitutionalReasonCodes: ConstitutionalReasonCode[] = [
  {
    code: "WARN_REVIEW_REQUIRED",
    category: "warning",
    severity: "medium",
    description: "Entity requires constitutional or operational review before live execution.",
    constitutionalReference: "Marketplace constitutional review boundary"
  },
  {
    code: "WARN_SELLER_STANDING",
    category: "warning",
    severity: "medium",
    description: "Seller standing requires marketplace moderation review.",
    constitutionalReference: "Seller authority and accountability clause"
  },
  {
    code: "SANCTION_PUBLISHER_LIMITED",
    category: "sanction",
    severity: "high",
    description: "Publisher or tenant has active sanction visibility.",
    constitutionalReference: "Governance sanctions and operational constraints"
  },
  {
    code: "RESTRICT_PRODUCT_COMMERCE",
    category: "restriction",
    severity: "high",
    description: "Product commerce preview is restricted by governance enforcement.",
    constitutionalReference: "Marketplace commerce restriction boundary"
  },
  {
    code: "RESTRICT_ENTITLEMENT_REVIEW",
    category: "restriction",
    severity: "high",
    description: "Active entitlement, license or subscription requires review preview.",
    constitutionalReference: "Entitlement and access governance clause"
  },
  {
    code: "ESCALATE_EMERGENCY_REVIEW",
    category: "escalation",
    severity: "critical",
    description: "Entity requires emergency governance review before any live action.",
    constitutionalReference: "Emergency governance authority clause"
  }
];

export function withGovernanceWorkflow(store: MarketplaceStore): MarketplaceStore {
  return {
    ...store,
    governanceWorkflow: buildGovernanceWorkflowSnapshot(store)
  };
}

export function buildGovernanceWorkflowSnapshot(store: MarketplaceStore, now = new Date().toISOString()): GovernanceWorkflowSnapshot {
  const items = [
    ...buildProductQueueItems(store, now),
    ...buildSellerQueueItems(store, now),
    ...buildStorefrontQueueItems(store, now),
    ...buildEntitlementQueueItems(store, now),
    ...buildBillingQueueItems(store, now)
  ];
  const queueNames: GovernanceReviewQueueName[] = ["product", "seller", "storefront", "entitlement", "billing"];
  const queues: GovernanceReviewQueue[] = queueNames.map((queue) => {
    const queueItems = items.filter((item) => item.queue === queue);
    return {
      queue,
      items: queueItems,
      metrics: {
        pending: queueItems.filter((item) => item.lifecycle === "pending_approval").length,
        escalated: queueItems.filter((item) => item.lifecycle === "escalated").length,
        emergency: queueItems.filter((item) => item.lifecycle === "emergency_review").length,
        restricted: queueItems.filter((item) => item.lifecycle === "restricted").length
      }
    };
  });
  const actionState = Object.fromEntries((store.governanceWorkflowActions ?? []).map((action) => [action.entityId, action.action]));
  const derivedState = Object.fromEntries(items.map((item) => [item.entityId, item.lifecycle]));
  const currentByEntity = { ...derivedState, ...actionState };
  return {
    id: `governance-workflow-${now}`,
    queues,
    approvalLifecycle: {
      supportedStates,
      currentByEntity
    },
    constitutionalReasonCodes,
    moderationRuntime: {
      queuedItems: items.length,
      pendingApproval: items.filter((item) => item.lifecycle === "pending_approval").length,
      escalated: items.filter((item) => item.lifecycle === "escalated").length,
      emergencyReview: items.filter((item) => item.lifecycle === "emergency_review").length,
      restricted: items.filter((item) => item.lifecycle === "restricted").length,
      moderationWritesEnabled: false,
      governanceWritesEnabled: false
    },
    governanceAudit: store.governanceWorkflowActions ?? [],
    generatedAt: now
  };
}

export function createGovernanceWorkflowAction(
  input: Omit<GovernanceWorkflowActionRecord, "id" | "timestamp" | "governanceWritesEnabled" | "moderationOnly">,
  now = new Date().toISOString()
): GovernanceWorkflowActionRecord {
  return {
    id: `governance-action-${randomUUID()}`,
    ...input,
    timestamp: now,
    governanceWritesEnabled: false,
    moderationOnly: true
  };
}

function buildProductQueueItems(store: MarketplaceStore, now: string): GovernanceWorkflowQueueItem[] {
  return store.products
    .filter((product) => product.governanceStatus !== "compliant" || Boolean(product.governanceRequired))
    .map((product) => {
      const enforcement = store.governanceEnforcement?.records.find((record) => record.entityId === product.id);
      const restricted = product.governanceStatus === "restricted" || enforcement?.severity === "restricted";
      return queueItem({
        queue: "product",
        entityId: product.id,
        entityType: "product",
        tenantId: getString(product.tenantId, "tenant-axodus-dao"),
        lifecycle: restricted ? "restricted" : product.governanceStatus === "suspended" ? "emergency_review" : "pending_approval",
        severity: restricted ? "high" : product.governanceStatus === "suspended" ? "critical" : "medium",
        reasonCodes: [restricted ? "RESTRICT_PRODUCT_COMMERCE" : "WARN_REVIEW_REQUIRED"],
        source: "enforcement",
        now
      });
    });
}

function buildSellerQueueItems(store: MarketplaceStore, now: string): GovernanceWorkflowQueueItem[] {
  return store.sellers
    .filter((seller) => seller.governanceStanding !== "verified")
    .map((seller) => {
      const enforcement = store.governanceEnforcement?.records.find((record) => record.entityId === seller.id);
      return queueItem({
        queue: "seller",
        entityId: seller.id,
        entityType: "seller",
        tenantId: getSellerTenantId(store, seller.id),
        lifecycle: enforcement?.severity === "restricted" ? "restricted" : enforcement?.severity === "suspended" ? "emergency_review" : "pending_approval",
        severity: enforcement?.severity === "suspended" ? "critical" : enforcement?.severity === "restricted" ? "high" : "medium",
        reasonCodes: [enforcement?.severity === "restricted" ? "SANCTION_PUBLISHER_LIMITED" : "WARN_SELLER_STANDING"],
        source: "authority",
        now
      });
    });
}

function buildStorefrontQueueItems(store: MarketplaceStore, now: string): GovernanceWorkflowQueueItem[] {
  return (store.daoFederationRuntime?.storefronts ?? [])
    .filter((storefront) => storefront.activationState !== "active-preview")
    .map((storefront) =>
      queueItem({
        queue: "storefront",
        entityId: storefront.storefrontId,
        entityType: "storefront",
        tenantId: storefront.tenantId,
        lifecycle: storefront.activationState === "frozen-preview" ? "emergency_review" : storefront.activationState === "restricted-preview" ? "restricted" : "pending_approval",
        severity: storefront.activationState === "frozen-preview" ? "critical" : storefront.activationState === "restricted-preview" ? "high" : "medium",
        reasonCodes: storefront.governanceVisibility.inheritedRestrictions.length ? ["WARN_REVIEW_REQUIRED"] : ["WARN_REVIEW_REQUIRED"],
        source: "federation",
        now
      })
    );
}

function buildEntitlementQueueItems(store: MarketplaceStore, now: string): GovernanceWorkflowQueueItem[] {
  return (store.governanceEnforcement?.entitlementInvalidationPreviews ?? []).map((preview) =>
    queueItem({
      queue: "entitlement",
      entityId: preview.productId,
      entityType: "entitlement-preview",
      tenantId: getProductTenantId(store, preview.productId),
      lifecycle: "escalated",
      severity: "high",
      reasonCodes: ["RESTRICT_ENTITLEMENT_REVIEW"],
      source: "entitlement",
      now
    })
  );
}

function buildBillingQueueItems(store: MarketplaceStore, now: string): GovernanceWorkflowQueueItem[] {
  return (store.invoices ?? [])
    .filter((invoice) => invoice.productReferences.some((productId) => store.governanceEnforcement?.restrictedProductIds.includes(productId)))
    .map((invoice) =>
      queueItem({
        queue: "billing",
        entityId: invoice.id,
        entityType: "invoice",
        tenantId: getProductTenantId(store, invoice.productReferences[0] ?? ""),
        lifecycle: "pending_approval",
        severity: "medium",
        reasonCodes: ["RESTRICT_PRODUCT_COMMERCE"],
        source: "billing",
        now
      })
    );
}

function queueItem(input: {
  queue: GovernanceReviewQueueName;
  entityId: string;
  entityType: string;
  tenantId: string;
  lifecycle: GovernanceApprovalLifecycleState;
  severity: "low" | "medium" | "high" | "critical";
  reasonCodes: string[];
  source: GovernanceWorkflowQueueItem["source"];
  now: string;
}): GovernanceWorkflowQueueItem {
  return {
    id: `review-${input.queue}-${input.entityId}`,
    queue: input.queue,
    entityId: input.entityId,
    entityType: input.entityType,
    tenantId: input.tenantId,
    lifecycle: input.lifecycle,
    severity: input.severity,
    reasonCodes: input.reasonCodes,
    source: input.source,
    createdAt: input.now
  };
}

function getProductTenantId(store: MarketplaceStore, productId: string) {
  return getString(store.products.find((product) => product.id === productId)?.tenantId, "tenant-axodus-dao");
}

function getSellerTenantId(store: MarketplaceStore, sellerId: string) {
  return getString(store.products.find((product) => product.sellerId === sellerId)?.tenantId, "tenant-axodus-dao");
}

function getString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

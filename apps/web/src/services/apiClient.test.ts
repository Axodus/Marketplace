import { afterEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "./apiClient";
import { getProductBySlug } from "../modules/marketplace/services/marketplaceService";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("apiClient", () => {
  it("hydrates products from the Marketplace API envelope", async () => {
    const product = getProductBySlug("governance-dashboard-nft-access");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          data: [product],
          mode: "mock-persistent",
          runtime: {
            source: "marketplace-api",
            persisted: true,
            settlementEnabled: false,
            walletExecutionEnabled: false,
            blockchainWritesEnabled: false
          }
        })
      })
    );

    const products = await apiClient.listProducts();

    expect(products).toHaveLength(1);
    expect(products[0].slug).toBe("governance-dashboard-nft-access");
  });

  it("falls back to local mock products when the API runtime is unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    const products = await apiClient.listProducts({ chain: "Polygon" });

    expect(products.length).toBeGreaterThan(0);
    expect(products.every((product) => product.supportedChains.includes("Polygon"))).toBe(true);
  });

  it("creates purchase previews through the API without wallet execution", async () => {
    const product = getProductBySlug("governance-dashboard-nft-access");
    expect(product).toBeDefined();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          data: {
            id: "marketplace-purchase-test",
            buyer: "0xBuyer",
            productId: product!.id,
            sellerId: product!.sellerId,
            timestamp: "2026-05-21T00:00:00.000Z",
            amount: 120,
            currency: "USDC",
            licenseIssued: "license-personal-nft",
            status: "pending-governance-review",
            governanceReviewRequired: true,
            settlementEnabled: false,
            walletExecutionEnabled: false,
            blockchainWritesEnabled: false
          }
        })
      })
    );

    const purchase = await apiClient.createPurchasePreview(product!, "0xBuyer");

    expect(purchase.id).toBe("marketplace-purchase-test");
    expect((purchase as unknown as { walletExecutionEnabled: boolean }).walletExecutionEnabled).toBe(false);
  });

  it("hydrates product registry and tenant storefront read models", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((url: string) => {
        const data = url.endsWith("/registry/products")
          ? [
              {
                canonicalEntityId: "marketplace:product:product-governance-dashboard-nft",
                productId: "product-governance-dashboard-nft",
                slug: "governance-dashboard-nft-access",
                title: "Governance Dashboard NFT Access",
                sellerId: "seller-axodus-core",
                tenantId: "tenant-axodus-dao",
                ownership: {
                  ownerType: "tenant",
                  ownerId: "tenant-axodus-dao",
                  publisherId: "seller-axodus-core",
                  governanceAuthority: "Axodus Governance"
                },
                visibilityState: "public",
                lifecycleState: "active",
                governanceStanding: "compliant",
                supportedChains: ["Polygon"],
                licenseModel: "NFT Access License",
                nftMetadata: { tokenStandard: "ERC721", contractAddress: "mock:contract", tokenId: "1", nftBound: true },
                royaltyMetadata: { standard: "EIP-2981", bps: 500, recipient: "Axodus Treasury" },
                deliveryMetadata: { deliveryType: "Signed URL", greenfieldBucket: "mock-bucket", signedUrlPreviewAvailable: true },
                versioning: { currentVersion: "0.1.0", previousVersions: [], archived: false, deprecated: false, updatedAt: null }
              }
            ]
          : {
              id: "storefront-tenant-tenant-axodus-dao",
              type: "tenant",
              ownerId: "tenant-axodus-dao",
              slug: "axodus-dao",
              title: "Axodus DAO Storefront",
              description: "DAO storefront preview",
              governance: {
                standing: "verified",
                constitutionalStanding: "aligned",
                federationTier: "core",
                warnings: [],
                restrictions: []
              },
              metrics: { products: 1, activeProducts: 1, restrictedProducts: 0, nftBoundProducts: 1, sellers: 1 },
              productIds: ["product-governance-dashboard-nft"],
              sellerIds: ["seller-axodus-core"],
              activationEnabled: false
            };

        return Promise.resolve({
          ok: true,
          json: async () => ({
            data,
            mode: "mock-persistent",
            runtime: {
              source: "marketplace-api",
              persisted: true,
              settlementEnabled: false,
              walletExecutionEnabled: false,
              blockchainWritesEnabled: false
            }
          })
        });
      })
    );

    const registry = await apiClient.listProductRegistry();
    const storefront = await apiClient.getTenantStorefront("tenant-axodus-dao");

    expect(registry[0].ownership.ownerType).toBe("tenant");
    expect(registry[0].nftMetadata.tokenStandard).toBe("ERC721");
    expect(storefront?.activationEnabled).toBe(false);
    expect(storefront?.metrics.products).toBe(1);
  });

  it("hydrates entitlement snapshots without real blocking", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          data: {
            id: "entitlement-0xHolder",
            holder: "0xHolder",
            ownedProducts: ["product-governance-dashboard-nft"],
            activeLicenses: ["license-runtime-1"],
            activeSubscriptions: [],
            governanceRestrictions: [],
            tenantRestrictions: [],
            deliveryPermissions: [
              {
                productId: "product-governance-dashboard-nft",
                deliveryType: "Signed URL",
                permission: "allowed-preview",
                reasons: ["preview-entitlement-satisfied"]
              }
            ],
            accessEnforcement: {
              licenseGatedAssetsReady: true,
              subscriptionGatedProductsReady: true,
              daoRestrictedAccessReady: true,
              governanceRestrictedAccessReady: true,
              entitlementDeliveryReady: true,
              realBlockingEnabled: false
            },
            futureMerges: {
              nftOwnershipMergeReady: true,
              walletOwnershipMergeReady: true
            },
            generatedAt: "2026-05-21T00:00:00.000Z"
          }
        })
      })
    );

    const snapshot = await apiClient.getEntitlementSnapshot("0xHolder");

    expect(snapshot.activeLicenses).toContain("license-runtime-1");
    expect(snapshot.accessEnforcement.realBlockingEnabled).toBe(false);
  });

  it("creates invoice previews without settlement or treasury execution", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          data: {
            id: "invoice-1",
            buyer: "0xInvoice",
            state: "preview",
            productReferences: ["product-governance-dashboard-nft"],
            subscriptionReferences: [],
            lineItems: [],
            subtotal: 120,
            currency: "USDC",
            royaltyPreview: 6,
            platformFeePreview: 3,
            treasurySplitPreview: 4.2,
            creatorSplitPreview: 109.8,
            ecosystemFeePreview: 1.2,
            taxPlaceholder: { enabled: false, jurisdiction: "preview-unset", amount: 0 },
            totalPreview: 120,
            reconciliation: {
              state: "preview_unreconciled",
              externalPaymentId: null,
              settlementTxHash: null,
              treasuryExecutionEnabled: false
            },
            settlementEnabled: false,
            treasuryExecutionEnabled: false,
            createdAt: "2026-05-21T00:00:00.000Z",
            updatedAt: "2026-05-21T00:00:00.000Z"
          }
        })
      })
    );

    const invoice = await apiClient.createInvoicePreview(["product-governance-dashboard-nft"], "0xInvoice");

    expect(invoice.royaltyPreview).toBe(6);
    expect(invoice.treasurySplitPreview).toBe(4.2);
    expect(invoice.settlementEnabled).toBe(false);
    expect(invoice.treasuryExecutionEnabled).toBe(false);
  });

  it("hydrates audit and reconciliation readiness without live chain reads", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((url: string) => {
        const data = url.endsWith("/audit-logs")
          ? [
              {
                id: "audit-1",
                actor: "0xActor",
                entity: { id: "purchase-1", type: "purchase" },
                action: "purchase.preview_issued",
                timestamp: "2026-05-21T00:00:00.000Z",
                tenant: "tenant-axodus-dao",
                governanceContext: { standing: "compliant", restrictions: [], reviewRequired: true },
                runtimeMetadata: {
                  source: "marketplace-api",
                  mode: "mock-persistent",
                  settlementEnabled: false,
                  walletExecutionEnabled: false,
                  blockchainWritesEnabled: false,
                  replaySafe: true,
                  correlationId: "correlation-1"
                }
              }
            ]
          : {
              id: "reconciliation-1",
              scope: "marketplace",
              status: "preview_ready",
              blockchainReads: { prepared: true, enabled: false, supportedChecks: ["ownerOf"] },
              ownershipVerification: { prepared: true, enabled: false, pendingProductIds: ["product-1"] },
              treasuryVerification: { prepared: true, enabled: false, pendingInvoiceIds: [] },
              settlementVerification: { prepared: true, enabled: false, pendingPurchaseIds: [] },
              licenseVerification: { prepared: true, enabled: false, pendingLicenseIds: [] },
              generatedAt: "2026-05-21T00:00:00.000Z"
            };

        return Promise.resolve({
          ok: true,
          json: async () => ({ data })
        });
      })
    );

    const auditLogs = await apiClient.listAuditLogs();
    const reconciliation = await apiClient.createReconciliationSnapshot();

    expect(auditLogs[0].runtimeMetadata.replaySafe).toBe(true);
    expect(auditLogs[0].runtimeMetadata.blockchainWritesEnabled).toBe(false);
    expect(reconciliation.blockchainReads.enabled).toBe(false);
  });

  it("hydrates governance authority as read-only runtime state", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          data: {
            entityId: "product-mcp-agent-template",
            entityType: "product",
            constitutionalStanding: "requires-review",
            governanceStatus: "restricted",
            federationTier: "provisional",
            warnings: ["approval-required-asset"],
            sanctions: ["product-restricted"],
            operationalApproval: "emergency_review",
            restrictionState: "restricted",
            emergencyState: "none",
            authority: {
              constitutional: "Axodus Constitutional Governance",
              federal: "Axodus Federal Governance",
              technical: "Protocol Council License Review",
              operational: "ACS Review Queue"
            },
            readOnly: true,
            hydratedFrom: "governance-runtime-adapter",
            generatedAt: "2026-05-21T00:00:00.000Z"
          }
        })
      })
    );

    const authority = await apiClient.getGovernanceAuthority("product-mcp-agent-template");

    expect(authority?.restrictionState).toBe("restricted");
    expect(authority?.operationalApproval).toBe("emergency_review");
    expect(authority?.readOnly).toBe(true);
  });

  it("hydrates governance enforcement boundaries without hard blocking", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          data: {
            entityId: "product-mcp-agent-template",
            entityType: "product",
            authorityRef: "product-mcp-agent-template",
            severity: "restricted",
            visibility: {
              requestedState: "private-preview",
              effectiveState: "limited-preview",
              publicExplorerVisible: true,
              detailPageVisible: true,
              storefrontVisible: true,
              reasonCodes: ["product-restricted-by-governance-preview"]
            },
            commerce: {
              purchasePreviewAllowed: false,
              bidPreviewAllowed: false,
              listingPreviewAllowed: true,
              reasonCodes: ["purchase-preview-restricted-by-governance", "no-settlement-no-contract-write"]
            },
            entitlementImpact: {
              entitlementInvalidationPreview: true,
              subscriptionRestrictionPreview: true,
              licenseRestrictionPreview: true,
              governanceOverrideVisible: true,
              reasonCodes: ["active-entitlements-require-review-preview", "preview-only-no-access-revocation"]
            },
            reviewQueue: {
              required: true,
              queue: "constitutional",
              reasonCodes: ["product-restricted-by-governance-preview"]
            },
            enforcementMode: "preview-only",
            hardBlockingEnabled: false,
            destructiveActionsEnabled: false,
            generatedAt: "2026-05-21T00:00:00.000Z"
          }
        })
      })
    );

    const enforcement = await apiClient.getGovernanceEnforcement("product-mcp-agent-template");

    expect(enforcement?.visibility.effectiveState).toBe("limited-preview");
    expect(enforcement?.commerce.purchasePreviewAllowed).toBe(false);
    expect(enforcement?.entitlementImpact.entitlementInvalidationPreview).toBe(true);
    expect(enforcement?.hardBlockingEnabled).toBe(false);
  });

  it("hydrates DAO federation runtime with tenant isolation", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          data: {
            id: "dao-federation-1",
            storefronts: [
              {
                tenantId: "tenant-axodus-dao",
                storefrontId: "storefront-tenant-tenant-axodus-dao",
                slug: "axodus-dao",
                activationState: "active-preview",
                operationalStatus: "operational-preview",
                governanceVisibility: {
                  authorityState: "verified",
                  enforcementState: "visible",
                  inheritedRestrictions: [],
                  publicActivationEnabled: false
                },
                daoOwnedProductIds: ["product-governance-dashboard-nft"],
                metrics: {
                  products: 1,
                  activeProducts: 1,
                  restrictedProducts: 0,
                  sellers: 1,
                  invoices: 0,
                  activeLicenses: 0,
                  activeSubscriptions: 0
                }
              }
            ],
            tenantIsolation: [
              {
                tenantId: "tenant-axodus-dao",
                boundary: {
                  productIds: ["product-governance-dashboard-nft"],
                  sellerIds: ["seller-axodus-core"],
                  invoiceIds: [],
                  licenseIds: [],
                  subscriptionIds: [],
                  entitlementSnapshotIds: [],
                  governanceRecordIds: ["tenant-axodus-dao"]
                },
                scopedRuntime: {
                  productsScoped: true,
                  billingScoped: true,
                  entitlementsScoped: true,
                  governanceScoped: true,
                  crossTenantSettlementEnabled: false
                }
              }
            ],
            constitutionalInheritance: [
              {
                tenantId: "tenant-axodus-dao",
                parentTenantId: null,
                federationTier: "core",
                inheritedRestrictions: [],
                inheritedVisibilityRules: [],
                inheritedGovernanceStanding: "verified",
                inheritedFederationMetadata: {
                  rootAuthority: "Axodus Constitutional Governance",
                  operationalAuthority: "Axodus Governance",
                  inheritanceMode: "preview-only"
                }
              }
            ],
            federationMetrics: {
              tenants: 1,
              activeStorefronts: 1,
              reviewRequiredStorefronts: 0,
              restrictedStorefronts: 0,
              federationHealth: "healthy-preview",
              governanceActivity: 0,
              operationalVisibility: "preview-only"
            },
            publicActivationEnabled: false,
            settlementEnabled: false,
            generatedAt: "2026-05-21T00:00:00.000Z"
          }
        })
      })
    );

    const federation = await apiClient.getDAOFederationRuntime();

    expect(federation.publicActivationEnabled).toBe(false);
    expect(federation.storefronts[0].activationState).toBe("active-preview");
    expect(federation.tenantIsolation[0].scopedRuntime.productsScoped).toBe(true);
    expect(federation.tenantIsolation[0].scopedRuntime.crossTenantSettlementEnabled).toBe(false);
  });

  it("hydrates governance workflow queues and reason codes", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          data: {
            id: "governance-workflow-1",
            queues: [
              {
                queue: "product",
                items: [
                  {
                    id: "review-product-product-mcp-agent-template",
                    queue: "product",
                    entityId: "product-mcp-agent-template",
                    entityType: "product",
                    tenantId: "tenant-mcp-working-group",
                    lifecycle: "restricted",
                    severity: "high",
                    reasonCodes: ["RESTRICT_PRODUCT_COMMERCE"],
                    source: "enforcement",
                    createdAt: "2026-05-21T00:00:00.000Z"
                  }
                ],
                metrics: { pending: 0, escalated: 0, emergency: 0, restricted: 1 }
              }
            ],
            approvalLifecycle: {
              supportedStates: ["pending_approval", "approved", "rejected", "restricted", "escalated", "emergency_review"],
              currentByEntity: { "product-mcp-agent-template": "restricted" }
            },
            constitutionalReasonCodes: [
              {
                code: "RESTRICT_PRODUCT_COMMERCE",
                category: "restriction",
                severity: "high",
                description: "Product commerce preview is restricted by governance enforcement.",
                constitutionalReference: "Marketplace commerce restriction boundary"
              }
            ],
            moderationRuntime: {
              queuedItems: 1,
              pendingApproval: 0,
              escalated: 0,
              emergencyReview: 0,
              restricted: 1,
              moderationWritesEnabled: false,
              governanceWritesEnabled: false
            },
            governanceAudit: [],
            generatedAt: "2026-05-21T00:00:00.000Z"
          }
        })
      })
    );

    const workflow = await apiClient.getGovernanceWorkflow();

    expect(workflow.moderationRuntime.governanceWritesEnabled).toBe(false);
    expect(workflow.queues[0].items[0].reasonCodes).toContain("RESTRICT_PRODUCT_COMMERCE");
    expect(workflow.approvalLifecycle.currentByEntity["product-mcp-agent-template"]).toBe("restricted");
    expect(workflow.constitutionalReasonCodes[0].category).toBe("restriction");
  });

  it("hydrates governance observability and emergency controls", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          data: {
            id: "governance-observability-1",
            emergencyRuntime: {
              controls: [
                {
                  id: "emergency-restriction-product-mcp-agent-template",
                  entityId: "product-mcp-agent-template",
                  entityType: "product",
                  tenantId: "tenant-mcp-working-group",
                  control: "emergency_restriction",
                  trigger: "restricted",
                  severity: "restricted",
                  previewState: "active-preview",
                  executionEnabled: false,
                  reasonCodes: ["RESTRICT_PRODUCT_COMMERCE"]
                }
              ],
              emergencyRestrictions: 1,
              emergencyFreezes: 0,
              emergencySuspensions: 0,
              emergencyVisibilityControls: 0,
              executionEnabled: false
            },
            telemetry: {
              records: [
                {
                  id: "telemetry-emergency-restriction-product-mcp-agent-template",
                  category: "restriction",
                  entityId: "product-mcp-agent-template",
                  entityType: "product",
                  tenantId: "tenant-mcp-working-group",
                  severity: "warning",
                  message: "emergency_restriction active-preview",
                  reasonCodes: ["RESTRICT_PRODUCT_COMMERCE"],
                  createdAt: "2026-05-22T00:00:00.000Z"
                }
              ],
              governanceActions: 0,
              restrictions: 1,
              moderationEvents: 0,
              emergencyEvents: 0
            },
            operatorConsole: {
              governanceVisibility: "available",
              moderationVisibility: "available",
              restrictionVisibility: "available",
              federationVisibility: "available",
              liveControlsEnabled: false
            },
            federation: {
              health: "warning-preview",
              tenants: 3,
              restrictedStorefronts: 0,
              reviewRequiredStorefronts: 2
            },
            generatedAt: "2026-05-22T00:00:00.000Z"
          }
        })
      })
    );

    const observability = await apiClient.getGovernanceObservability();

    expect(observability.emergencyRuntime.executionEnabled).toBe(false);
    expect(observability.operatorConsole.liveControlsEnabled).toBe(false);
    expect(observability.telemetry.restrictions).toBe(1);
    expect(observability.emergencyRuntime.controls[0].entityId).toBe("product-mcp-agent-template");
  });
});

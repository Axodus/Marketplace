import type {
  GovernanceAuthorityRecord,
  GovernanceAuthoritySnapshot,
  MarketplaceStore,
  ProductEntity,
  SellerEntity,
  TenantEntity
} from "../dto/contracts.js";

export class GovernanceRuntimeAuthorityAdapter {
  hydrate(store: MarketplaceStore, now = new Date().toISOString()): GovernanceAuthoritySnapshot {
    return {
      id: `governance-authority-${now}`,
      source: process.env.GOVERNANCE_RUNTIME_URL ? "governance-runtime-api" : "governance-runtime-local-read-model",
      records: [
        ...store.products.map((product) => this.productAuthority(product, store, now)),
        ...store.sellers.map((seller) => this.sellerAuthority(seller, store, now)),
        ...store.tenants.map((tenant) => this.tenantAuthority(tenant, now))
      ],
      writeExecutionEnabled: false,
      governanceWritesEnabled: false,
      generatedAt: now
    };
  }

  private productAuthority(product: ProductEntity, store: MarketplaceStore, now: string): GovernanceAuthorityRecord {
    const tenant = store.tenants.find((item) => item.id === product.tenantId);
    const restrictionState = getRestrictionState(product.governanceStatus);
    const approvalRequired = Boolean(product.governanceRequired) || product.governanceStatus === "under-review";
    return {
      entityId: product.id,
      entityType: "product",
      constitutionalStanding: getString(product.constitutionalStanding, approvalRequired ? "requires-review" : "aligned"),
      governanceStatus: product.governanceStatus,
      federationTier: getString(tenant?.federationTier, "local"),
      warnings: approvalRequired ? ["approval-required-asset"] : [],
      sanctions: restrictionState === "suspended" ? ["product-suspended"] : restrictionState === "restricted" ? ["product-restricted"] : [],
      operationalApproval: getOperationalApproval(restrictionState, approvalRequired),
      restrictionState,
      emergencyState: product.governanceStatus === "suspended" ? "active" : "none",
      authority: {
        constitutional: "Axodus Constitutional Governance",
        federal: "Axodus Federal Governance",
        technical: product.nftBound ? "Protocol Council NFT Review" : "Protocol Council License Review",
        operational: getString(tenant?.operationalAuthority, "Marketplace Operations")
      },
      readOnly: true,
      hydratedFrom: "governance-runtime-adapter",
      generatedAt: now
    };
  }

  private sellerAuthority(seller: SellerEntity, store: MarketplaceStore, now: string): GovernanceAuthorityRecord {
    const product = store.products.find((item) => item.sellerId === seller.id);
    const tenant = store.tenants.find((item) => item.id === product?.tenantId);
    const restrictionState = getRestrictionState(seller.governanceStanding);
    return {
      entityId: seller.id,
      entityType: "seller",
      constitutionalStanding: seller.constitutionalBound ? "aligned" : "requires-review",
      governanceStatus: seller.governanceStanding,
      federationTier: getString(tenant?.federationTier, "seller"),
      warnings: seller.governanceStanding === "warning" ? ["seller-governance-warning"] : [],
      sanctions: ["sanctioned", "suspended"].includes(seller.governanceStanding) ? [`seller-${seller.governanceStanding}`] : [],
      operationalApproval: getOperationalApproval(restrictionState, seller.verificationStatus !== "verified" && seller.verificationStatus !== "internal"),
      restrictionState,
      emergencyState: seller.governanceStanding === "suspended" ? "active" : "none",
      authority: {
        constitutional: "Axodus Constitutional Governance",
        federal: "Federation Membership Review",
        technical: "Seller Registry Authority",
        operational: getString(tenant?.operationalAuthority, "Seller Operations")
      },
      readOnly: true,
      hydratedFrom: "governance-runtime-adapter",
      generatedAt: now
    };
  }

  private tenantAuthority(tenant: TenantEntity, now: string): GovernanceAuthorityRecord {
    const restrictionState = getRestrictionState(tenant.governanceStanding);
    return {
      entityId: tenant.id,
      entityType: "tenant",
      constitutionalStanding: getString(tenant.constitutionalStanding, "requires-review"),
      governanceStatus: tenant.governanceStanding,
      federationTier: getString(tenant.federationTier, "provisional"),
      warnings: tenant.governanceStanding === "warning" ? ["federation-warning-active"] : [],
      sanctions: ["restricted", "suspended", "sanctioned"].includes(tenant.governanceStanding) ? [`tenant-${tenant.governanceStanding}`] : [],
      operationalApproval: getOperationalApproval(restrictionState, tenant.governanceStanding === "warning"),
      restrictionState,
      emergencyState: tenant.governanceStanding === "suspended" ? "active" : "none",
      authority: {
        constitutional: "Axodus Constitutional Governance",
        federal: "Axodus Federal Governance",
        technical: "Federation Registry Authority",
        operational: getString(tenant.operationalAuthority, "Local DAO Operations")
      },
      readOnly: true,
      hydratedFrom: "governance-runtime-adapter",
      generatedAt: now
    };
  }
}

export function withGovernanceAuthority(store: MarketplaceStore): MarketplaceStore {
  const adapter = new GovernanceRuntimeAuthorityAdapter();
  const governanceAuthority = adapter.hydrate(store);
  return {
    ...store,
    governanceAuthority,
    products: store.products.map((product) => ({
      ...product,
      governanceAuthority: governanceAuthority.records.find((record) => record.entityId === product.id)
    })),
    sellers: store.sellers.map((seller) => ({
      ...seller,
      governanceAuthority: governanceAuthority.records.find((record) => record.entityId === seller.id)
    })),
    tenants: store.tenants.map((tenant) => ({
      ...tenant,
      governanceAuthority: governanceAuthority.records.find((record) => record.entityId === tenant.id)
    }))
  };
}

function getRestrictionState(value: unknown): GovernanceAuthorityRecord["restrictionState"] {
  if (value === "suspended" || value === "sanctioned") return "suspended";
  if (value === "restricted") return "restricted";
  if (value === "warning" || value === "under-review") return "warning";
  return "none";
}

function getOperationalApproval(
  restrictionState: GovernanceAuthorityRecord["restrictionState"],
  approvalRequired: boolean
): GovernanceAuthorityRecord["operationalApproval"] {
  if (restrictionState === "suspended") return "suspended";
  if (restrictionState === "restricted") return "emergency_review";
  if (approvalRequired || restrictionState === "warning") return "approval_required";
  return "approved";
}

function getString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

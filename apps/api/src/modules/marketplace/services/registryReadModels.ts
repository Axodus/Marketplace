import type {
  MarketplaceStore,
  ProductEntity,
  ProductRegistryRecord,
  SellerEntity,
  SellerRegistryRecord,
  StorefrontViewEntity,
  TenantEntity,
  TenantRegistryRecord
} from "../dto/contracts.js";

const defaultTenantId = "tenant-axodus-dao";

export function withRegistryReadModels(store: MarketplaceStore): MarketplaceStore {
  const productRegistry = buildProductRegistry(store);
  const sellerRegistry = buildSellerRegistry(store);
  const tenantRegistry = buildTenantRegistry(store);
  const storefronts = buildStorefronts(store, tenantRegistry, sellerRegistry);

  return {
    ...store,
    productRegistry,
    sellerRegistry,
    tenantRegistry,
    storefronts
  };
}

export function buildProductRegistry(store: MarketplaceStore): ProductRegistryRecord[] {
  return store.products.map((product) => {
    const tenantId = getTenantId(product);
    const lifecycleState = getProductLifecycleState(product);
    const royalty = getRecord(product, "royaltyModel");
    return {
      canonicalEntityId: getString(product.canonicalEntityId, `marketplace:product:${product.id}`),
      productId: product.id,
      slug: product.slug,
      title: product.title,
      sellerId: product.sellerId,
      tenantId,
      ownership: {
        ownerType: tenantId ? "tenant" : "seller",
        ownerId: tenantId || product.sellerId,
        publisherId: product.sellerId,
        governanceAuthority: getGovernanceAuthority(store, tenantId)
      },
      visibilityState: getString(product.visibility, "public"),
      lifecycleState,
      governanceStanding: product.governanceStatus,
      supportedChains: getStringArray(product.supportedChains),
      licenseModel: getString(product.licenseType, "Personal Use"),
      nftMetadata: {
        tokenStandard: getString(product.tokenStandard, "OffchainLicense"),
        contractAddress: getNullableString(product.contractAddress),
        tokenId: getNullableString(product.tokenId),
        nftBound: Boolean(product.nftBound)
      },
      royaltyMetadata: {
        standard: getString(royalty.standard, "None"),
        bps: getNumber(royalty.bps),
        recipient: getString(royalty.recipient, "Unassigned")
      },
      deliveryMetadata: {
        deliveryType: getString(product.deliveryType, "Manual Service"),
        greenfieldBucket: getNullableString(product.greenfieldBucket),
        signedUrlPreviewAvailable: Boolean(product.signedUrlPreviewAvailable)
      },
      versioning: {
        currentVersion: getString(product.version, "0.1.0"),
        previousVersions: getStringArray(product.previousVersions),
        archived: lifecycleState === "archived",
        deprecated: lifecycleState === "deprecated",
        updatedAt: getNullableString(product.updatedAt)
      }
    };
  });
}

export function buildSellerRegistry(store: MarketplaceStore): SellerRegistryRecord[] {
  return store.sellers.map((seller) => {
    const tenantIds = getSellerTenantIds(store, seller);
    const standing = getString(seller.governanceStanding, "warning");
    return {
      sellerId: seller.id,
      publisherIdentity: {
        name: seller.name,
        type: getString(seller.type, "Individual"),
        verificationState: getString(seller.verificationStatus, "pending")
      },
      standing,
      governanceRelationship: {
        constitutionalBound: Boolean(seller.constitutionalBound),
        riskScore: getNumber(seller.riskScore),
        sanctions: standing === "sanctioned" || standing === "suspended" ? [`seller-standing:${standing}`] : [],
        warnings: standing === "warning" ? ["governance-warning-active"] : []
      },
      tenantRelationship: {
        tenantIds,
        registeredDAOs: getStringArray(seller.registeredDAOs),
        primaryTenantId: tenantIds[0] ?? null
      },
      storefront: {
        storefrontId: `storefront-seller-${seller.id}`,
        slug: seller.id.replace(/^seller-/, ""),
        title: `${seller.name} Storefront`,
        operationalStatus: getSellerOperationalStatus(standing)
      },
      futureReputationReady: true,
      futureSanctionsReady: true
    };
  });
}

export function buildTenantRegistry(store: MarketplaceStore): TenantRegistryRecord[] {
  return store.tenants.map((tenant) => {
    const productIds = store.products.filter((product) => getTenantId(product) === tenant.id).map((product) => product.id);
    const sellerIds = store.sellers
      .filter((seller) => getSellerTenantIds(store, seller).includes(tenant.id))
      .map((seller) => seller.id);

    return {
      tenantId: tenant.id,
      name: tenant.name,
      daoEntityId: `dao:${tenant.id}`,
      federationTier: getString(tenant.federationTier, "provisional"),
      governanceStanding: tenant.governanceStanding,
      constitutionalMetadata: {
        standing: getString(tenant.constitutionalStanding, "requires-review"),
        restrictions: tenant.governanceStanding === "warning" ? ["federation-warning-active"] : [],
        authority: getString(tenant.operationalAuthority, "Governance Review")
      },
      ownershipHierarchy: {
        parentTenantId: getNullableString(tenant.parentTenantId),
        sellerIds,
        productIds
      },
      storefrontOwnership: {
        storefrontId: `storefront-tenant-${tenant.id}`,
        slug: tenant.id.replace(/^tenant-/, ""),
        publicActivationEnabled: false
      },
      tenantScopedAccessReady: true
    };
  });
}

export function buildStorefronts(
  store: MarketplaceStore,
  tenantRegistry = buildTenantRegistry(store),
  sellerRegistry = buildSellerRegistry(store)
): StorefrontViewEntity[] {
  const tenantStorefronts = tenantRegistry.map((tenant) => {
    const products = store.products.filter((product) => tenant.ownershipHierarchy.productIds.includes(product.id));
    return createStorefront({
      id: tenant.storefrontOwnership.storefrontId,
      type: "tenant",
      ownerId: tenant.tenantId,
      slug: tenant.storefrontOwnership.slug,
      title: `${tenant.name} Storefront`,
      description: "DAO-scoped Marketplace storefront preview. Public activation is disabled.",
      standing: tenant.governanceStanding,
      constitutionalStanding: tenant.constitutionalMetadata.standing,
      federationTier: tenant.federationTier,
      restrictions: tenant.constitutionalMetadata.restrictions,
      warnings: tenant.governanceStanding === "warning" ? ["tenant-governance-warning"] : [],
      products,
      sellerIds: tenant.ownershipHierarchy.sellerIds
    });
  });

  const sellerStorefronts = sellerRegistry.map((seller) => {
    const products = store.products.filter((product) => product.sellerId === seller.sellerId);
    return createStorefront({
      id: seller.storefront.storefrontId,
      type: "seller",
      ownerId: seller.sellerId,
      slug: seller.storefront.slug,
      title: seller.storefront.title,
      description: "Seller Marketplace storefront preview. Public activation is disabled.",
      standing: seller.standing,
      constitutionalStanding: seller.governanceRelationship.constitutionalBound ? "aligned" : "requires-review",
      federationTier: "seller",
      restrictions: seller.governanceRelationship.sanctions,
      warnings: seller.governanceRelationship.warnings,
      products,
      sellerIds: [seller.sellerId]
    });
  });

  return [...tenantStorefronts, ...sellerStorefronts];
}

function createStorefront(input: {
  id: string;
  type: StorefrontViewEntity["type"];
  ownerId: string;
  slug: string;
  title: string;
  description: string;
  standing: string;
  constitutionalStanding: string;
  federationTier: string;
  warnings: string[];
  restrictions: string[];
  products: ProductEntity[];
  sellerIds: string[];
}): StorefrontViewEntity {
  return {
    id: input.id,
    type: input.type,
    ownerId: input.ownerId,
    slug: input.slug,
    title: input.title,
    description: input.description,
    governance: {
      standing: input.standing,
      constitutionalStanding: input.constitutionalStanding,
      federationTier: input.federationTier,
      warnings: input.warnings,
      restrictions: input.restrictions
    },
    metrics: {
      products: input.products.length,
      activeProducts: input.products.filter((product) => getProductLifecycleState(product) === "active").length,
      restrictedProducts: input.products.filter((product) => product.governanceStatus === "restricted").length,
      nftBoundProducts: input.products.filter((product) => Boolean(product.nftBound)).length,
      sellers: input.sellerIds.length
    },
    productIds: input.products.map((product) => product.id),
    sellerIds: input.sellerIds,
    activationEnabled: false
  };
}

function getTenantId(product: ProductEntity) {
  return getString(product.tenantId, defaultTenantId);
}

function getGovernanceAuthority(store: MarketplaceStore, tenantId: string) {
  const tenant = store.tenants.find((item) => item.id === tenantId);
  return getString(tenant?.operationalAuthority, "Marketplace Governance");
}

function getSellerTenantIds(store: MarketplaceStore, seller: SellerEntity) {
  const productTenantIds = store.products
    .filter((product) => product.sellerId === seller.id)
    .map((product) => getTenantId(product));
  const daoTenantIds = getStringArray(seller.registeredDAOs)
    .map((dao) => store.tenants.find((tenant) => tenant.name === dao)?.id)
    .filter((id): id is string => Boolean(id));
  return [...new Set([...daoTenantIds, ...productTenantIds])];
}

function getProductLifecycleState(product: ProductEntity): ProductRegistryRecord["lifecycleState"] {
  if (product.status === "draft") return "draft";
  if (product.status === "archived") return "archived";
  if (product.status === "retired" || product.governanceStatus === "deprecated") return "deprecated";
  if (product.governanceStatus === "restricted") return "restricted";
  if (product.governanceStatus === "suspended") return "suspended";
  return "active";
}

function getSellerOperationalStatus(standing: string): SellerRegistryRecord["storefront"]["operationalStatus"] {
  if (standing === "restricted") return "restricted-preview";
  if (standing === "suspended" || standing === "sanctioned") return "suspended-preview";
  if (standing === "warning") return "warning-preview";
  return "active-preview";
}

function getRecord(source: Record<string, unknown>, key: string) {
  const value = source[key];
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function getString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function getNullableString(value: unknown) {
  return typeof value === "string" && value.trim() ? value : null;
}

function getNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function getStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

import { describe, expect, it } from "vitest";
import {
  buildSellerProfileView,
  buildMarketplaceAnalytics,
  createDraftListingPreview,
  discoverWalletAssets,
  applyCommunityDistributionRules,
  explainAttributionBoundary,
  explainCommunityDistributionExclusion,
  explainCommunityDistributionInclusion,
  explainEditorialRules,
  getAttributionSourceById,
  getAttributionSourceBySlug,
  getAttributionSourcesByChannel,
  getAttributionSourcesByCuratedCatalog,
  getAttributionSourcesByPlacement,
  getAttributionSourcesByProfile,
  getAttributionSourcesBySegment,
  getAttributionSourcesByTenant,
  getAssetRegistryByProductSlug,
  getCollectionBySlug,
  getCollectionForProduct,
  getCollectionSourceLabel,
  getCommunityDistributionAttributionSource,
  getCommunityDistributionCommercialOrigin,
  getCommunityDistributionCuratedCatalogs,
  getCommunityDistributionItems,
  getCommunityDistributionSegments,
  getCommunityDistributionTenants,
  getCommunityMarketplaceDistributionById,
  getCommunityMarketplaceDistributionBySlug,
  getCuratedCatalogById,
  getCuratedCatalogBySlug,
  getDistributionChannelById,
  getDistributionNetworkById,
  getDistributionProfileById,
  getDistributionProfileBySlug,
  getDistributionProfilesByChannel,
  getDistributionProfilesByType,
  getCommercialOriginForAttribution,
  getDistributionSourceForAttribution,
  getExternalContractById,
  getFederationProviderById,
  getFederationProviderReference,
  getGlobalBranding,
  getGlobalTenant,
  getProductByItemRef,
  getProductBySlug,
  getSellerById,
  getSellerProfileById,
  getTenantById,
  getTenantBySlug,
  getTenantDomains,
  getPrimaryTenantDomain,
  getTenantCatalog,
  getTenantCuratedCatalogConfig,
  isExternalCollection,
  isCollectionVisibleForTenant,
  isProductVisibleForTenant,
  isValidSimulatedHostname,
  isValidTenantAlias,
  isValidTenantSlug,
  isValidMockWalletAddress,
  issueMockPurchase,
  listAttributionSources,
  listCommunityMarketplaceDistributions,
  listCuratedCatalogs,
  listDistributionChannels,
  listDistributionNetworks,
  listDistributionProfiles,
  listEditorialRules,
  listExternalContracts,
  listCatalogSegments,
  listCatalogsBySegment,
  listFeaturedCatalogs,
  listWalletDiscoveryRecords,
  listFederationProviders,
  listCollections,
  listProducts,
  listTenants,
  getTenantDisplayName,
  getTenantFeaturedCollections,
  getTenantFeaturedProducts,
  getTenantLogo,
  getTenantVisibleCollections,
  getTenantVisibleProducts,
  explainTenantCatalogExclusion,
  explainTenantCatalogInclusion,
  resolveTenantByAlias,
  resolveTenantBySimulatedDomain,
  resolveTenantBySlug,
  resolveTenantBranding,
  resolveCuratedCatalog,
  resolveCuratedCatalogItems,
  resolveAttributionContext,
  resolveCommunityDistributionContext,
  resolveDistributionContext,
  resolveDistributionProfileContext,
  resolveTenantCatalog,
  resolveTenantContext,
  resolveTenantCuratedCatalogs,
  resolveTenantRoutingContext
} from "./marketplaceService";
import { StorageAccessService, GreenfieldAccessAdapter } from "./boundaryAdapters";

describe("marketplaceService", () => {
  it("filters products by chain and governance standing", () => {
    const products = listProducts({ chain: "Polygon", governanceStatus: "compliant" });

    expect(products.length).toBeGreaterThan(0);
    expect(products.every((product) => product.supportedChains.includes("Polygon"))).toBe(true);
    expect(products.every((product) => product.governanceStatus === "compliant")).toBe(true);
  });

  it("searches products across seller, category, token and description fields", () => {
    const bySeller = listProducts({ search: "Academy Tutor" });
    const byToken = listProducts({ search: "erc1155" });

    expect(bySeller.map((product) => product.slug)).toContain("academy-certification-erc1155-bundle");
    expect(byToken.map((product) => product.slug)).toContain("academy-certification-erc1155-bundle");
  });

  it("filters explorer products by asset type, listing status, listing type and seller", () => {
    const erc721Products = listProducts({ assetType: "erc721" });
    const activeAuctions = listProducts({ listingStatus: "auction-active" });
    const sellerProducts = listProducts({ sellerId: "seller-axodus-core", listingType: "dutch-auction" });

    expect(erc721Products.length).toBeGreaterThan(0);
    expect(erc721Products.every((product) => product.tokenStandard === "ERC721")).toBe(true);
    expect(activeAuctions.length).toBeGreaterThan(0);
    expect(activeAuctions.every((product) => product.auction?.status === "active")).toBe(true);
    expect(sellerProducts).toHaveLength(1);
    expect(sellerProducts[0].slug).toBe("strategy-license-dutch-auction");
  });

  it("sorts explorer products by price and activity without mutating mock data", () => {
    const originalOrder = listProducts().map((product) => product.id);
    const priceAscending = listProducts({ sortBy: "price-asc" });
    const activity = listProducts({ sortBy: "activity" });

    expect(priceAscending.map((product) => product.pricing.amount)).toEqual([80, 120, 250, 300]);
    expect(activity[0].slug).toBe("academy-certification-erc1155-bundle");
    expect(listProducts().map((product) => product.id)).toEqual(originalOrder);
  });

  it("lists ranked native and external mock collections with derived metrics", () => {
    const collections = listCollections();

    expect(collections).toHaveLength(5);
    expect(collections.map((view) => view.metrics.ranking)).toEqual([1, 2, 3, 4, 5]);
    expect(collections[0].collection.slug).toBe("axodus-governance-access");
    expect(collections[0].metrics.itemCount).toBe(1);
    expect(collections[0].metrics.listings).toBe(1);
    expect(collections[0].metrics.source).toBe("native-mock");
  });

  it("resolves collection detail and product collection relationship", () => {
    const collection = getCollectionBySlug("academy-certification-packs");
    const product = getProductBySlug("academy-certification-erc1155-bundle");

    expect(collection?.collection.assetType).toBe("ERC1155");
    expect(collection?.products.map((item) => item.slug)).toContain("academy-certification-erc1155-bundle");
    expect(getCollectionForProduct(product!)?.collection.slug).toBe("academy-certification-packs");
  });

  it("represents external collections with provider-reported metadata and non-executing trust boundaries", () => {
    const collection = getCollectionBySlug("harmony-creator-keys");

    expect(collection).toBeDefined();
    expect(collection?.collection.origin).toBe("external");
    expect(collection?.collection.provider?.name).toBe("Harmony Ecosystem Mock Provider");
    expect(collection?.collection.externalMetadata?.source).toBe("provider-reported-mock");
    expect(collection?.collection.externalStatistics?.source).toBe("provider-reported-mock");
    expect(collection?.collection.federationValidationStatus).toBe("provider-reported");
    expect(collection?.collection.riskClassification).toBe("unknown-external");
    expect(collection?.metrics.source).toBe("provider-reported-mock");
    expect(collection?.metrics.itemCount).toBe(128);
    expect(collection?.metrics.floorPrice).toBe(14);
    expect(collection?.boundaries.canDisplay).toBe(true);
    expect(collection?.boundaries.canTrade).toBe(false);
    expect(collection?.boundaries.canSettle).toBe(false);
    expect(collection?.boundaries.canBridge).toBe(false);
    expect(collection?.warnings.join(" ")).toContain("provider-reported");
    expect(collection && isExternalCollection(collection.collection)).toBe(true);
    expect(collection && getCollectionSourceLabel(collection.collection)).toContain("Federated Collection");
  });

  it("represents external ERC721 and ERC1155 contract references without execution", () => {
    const erc721 = getCollectionBySlug("harmony-creator-keys");
    const erc1155 = getCollectionBySlug("opensea-academy-badge-set");

    expect(erc721?.collection.externalContract?.tokenStandard).toBe("ERC721");
    expect(erc1155?.collection.externalContract?.tokenStandard).toBe("ERC1155");
    expect(erc1155?.collection.provider?.name).toBe("OpenSea Mock Provider");
    expect(erc1155?.collection.externalContract?.validationStatus).toBe("contract-referenced");
    expect(erc1155?.collection.externalContract?.riskClassification).toBe("contract-risk");
    expect(erc1155?.collection.externalContract?.provenance).toContain("no OpenSea call");
    expect(erc1155?.boundaries.canTrade).toBe(false);
    expect(erc1155?.boundaries.canSettle).toBe(false);
    expect(erc1155?.boundaries.canBridge).toBe(false);
  });

  it("lists External Contract import previews by id, address and collection slug", () => {
    const contracts = listExternalContracts();
    const erc721 = getExternalContractById("harmony-creator-keys");
    const erc1155 = getExternalContractById("0xExternalMockOpenSeaAcademyBadges");

    expect(contracts.map((view) => view.contract.tokenStandard)).toEqual(["ERC721", "ERC1155"]);
    expect(erc721?.contract.validationStatus).toBe("contract-referenced");
    expect(erc721?.provider?.name).toBe("Harmony Ecosystem");
    expect(erc1155?.collection.slug).toBe("opensea-academy-badge-set");
    expect(erc1155?.importPreview.displayEligible).toBe(true);
    expect(erc1155?.importPreview.importStatus).toBe("preview-ready");
    expect(erc1155?.importPreview.dataSource).toBe("local-mock");
    expect(erc1155?.importPreview.supportedCapabilities).toContain("read-only-boundary");
    expect(erc1155?.importPreview.disclaimers.join(" ")).toContain("does not enable trading");
    expect(getExternalContractById("missing-contract")).toBeNull();
  });

  it("builds seller profile metrics, activity and collection relationships from mock data", () => {
    const seller = getSellerById("seller-axodus-core");
    expect(seller).toBeDefined();

    const profile = buildSellerProfileView(seller!);

    expect(profile.metrics.listings).toBe(2);
    expect(profile.metrics.nftBoundListings).toBe(2);
    expect(profile.metrics.collections).toBe(2);
    expect(profile.metrics.totalBids).toBe(6);
    expect(profile.reputation.label).toBe("excellent-mock");
    expect(profile.reputation.riskLabel).toBe("low");
    expect(profile.activity.length).toBeGreaterThan(0);
    expect(profile.collections.map((view) => view.collection.slug)).toContain("axodus-governance-access");
  });

  it("returns null for unknown seller profiles", () => {
    expect(getSellerProfileById("seller-missing")).toBeNull();
  });

  it("discovers NFT assets for a mock wallet without ownership verification", () => {
    const discovery = discoverWalletAssets("0xMockOwnerGovernance001");

    expect(discovery.status).toBe("ready");
    expect(discovery.summary.nfts).toBe(1);
    expect(discovery.assets[0].kind).toBe("nft");
    expect(discovery.assets[0].ownershipState).toBe("owned-mock");
    expect(discovery.assets[0].product?.slug).toBe("governance-dashboard-nft-access");
    expect(discovery.assets[0].trustBoundary.canTrade).toBe(false);
    expect(discovery.assets[0].trustBoundary.canSettle).toBe(false);
    expect(discovery.assets[0].trustBoundary.canBridge).toBe(false);
    expect(discovery.boundaries.join(" ")).toContain("No wallet signatures");
  });

  it("discovers certificate and license records as read-only mock assets", () => {
    const certificateDiscovery = discoverWalletAssets("0xMockAcademyHolder1155");
    const licenseDiscovery = discoverWalletAssets("0xMockMcpLicenseHolder");

    expect(certificateDiscovery.summary.certificates).toBe(1);
    expect(certificateDiscovery.assets[0].kind).toBe("certificate");
    expect(certificateDiscovery.assets[0].validationStatus).toBe("collection-reviewed");
    expect(licenseDiscovery.summary.licenses).toBe(1);
    expect(licenseDiscovery.assets[0].kind).toBe("license");
    expect(licenseDiscovery.assets[0].ownershipState).toBe("verified-ownership-unavailable");
    expect(licenseDiscovery.assets[0].disclaimers.join(" ")).toContain("No custody");
  });

  it("handles empty, unknown and invalid mock wallets without external reads", () => {
    expect(listWalletDiscoveryRecords().length).toBeGreaterThan(0);
    expect(isValidMockWalletAddress("0xMockEmptyWallet")).toBe(true);
    expect(isValidMockWalletAddress("not-a-wallet")).toBe(false);

    const empty = discoverWalletAssets("0xMockEmptyWallet");
    const unknown = discoverWalletAssets("0xMockUnknownWallet");
    const invalid = discoverWalletAssets("not-a-wallet");

    expect(empty.status).toBe("empty");
    expect(empty.assets).toHaveLength(0);
    expect(unknown.status).toBe("wallet-not-found");
    expect(unknown.boundaries.join(" ")).toContain("external API");
    expect(invalid.status).toBe("invalid-wallet");
    expect(invalid.boundaries.join(" ")).toContain("No wallet signature");
  });

  it("lists mock Federation Providers with capabilities, limitations and disabled execution", () => {
    const providers = listFederationProviders();

    expect(providers.map((view) => view.provider.name)).toEqual(["OpenSea", "Rarible", "Magic Eden", "Harmony Ecosystem"]);
    expect(providers.every((view) => view.provider.readOnly)).toBe(true);
    expect(providers.every((view) => view.provider.executionEnabled === false)).toBe(true);
    expect(providers.every((view) => view.provider.trustBoundary.canTrade === false)).toBe(true);
    expect(providers.every((view) => view.provider.trustBoundary.canSettle === false)).toBe(true);
    expect(providers.every((view) => view.provider.trustBoundary.canBridge === false)).toBe(true);
    expect(providers.flatMap((view) => view.provider.supportedStandards)).toContain("ERC721");
    expect(providers.flatMap((view) => view.provider.supportedStandards)).toContain("ERC1155");
    expect(providers[0].boundaryNotes.join(" ")).toContain("No external calls");
    expect(providers[0].provider.limitations.join(" ")).toContain("No API key");
  });

  it("resolves Federation Providers by id or slug and exposes mock references", () => {
    const harmonyById = getFederationProviderById("provider-harmony-ecosystem-mock");
    const openseaById = getFederationProviderById("provider-opensea-mock");
    const magicEdenBySlug = getFederationProviderById("magic-eden");

    expect(harmonyById?.provider.name).toBe("Harmony Ecosystem");
    expect(harmonyById?.references.collections.map((collection) => collection.slug)).toContain("harmony-creator-keys");
    expect(openseaById?.references.collections.map((collection) => collection.slug)).toContain("opensea-academy-badge-set");
    expect(magicEdenBySlug?.provider.name).toBe("Magic Eden");
    expect(getFederationProviderReference("provider-opensea-mock")?.name).toBe("OpenSea");
    expect(getFederationProviderById("missing-provider")).toBeNull();
  });

  it("lists tenants and resolves Tenant Registry records by id and slug", () => {
    const tenants = listTenants();
    const globalTenant = getGlobalTenant();
    const academyById = getTenantById("tenant-academy-marketplace");
    const academyBySlug = getTenantBySlug("academy");

    expect(tenants.map((tenant) => tenant.slug)).toEqual(["global", "academy", "acs-services", "community-demo"]);
    expect(globalTenant.slug).toBe("global");
    expect(academyById?.identity.displayName).toBe("Axodus Academy Marketplace");
    expect(academyBySlug?.tenantType).toBe("academy");
    expect(academyBySlug?.configuration.canDisplay).toBe(true);
    expect(academyBySlug?.configuration.canTrade).toBe(false);
    expect(academyBySlug?.configuration.canSettle).toBe(false);
    expect(academyBySlug?.configuration.canRouteCustomDomain).toBe(false);
  });

  it("resolves Tenant Context with global fallback and non-executing boundaries", () => {
    const academy = resolveTenantContext("academy");
    const fallback = resolveTenantContext("missing-tenant");

    expect(academy.isGlobalMarketplace).toBe(false);
    expect(academy.tenant.identity.operatorName).toBe("Academy Tutor Guild");
    expect(academy.referencedProducts.map((product) => product.slug)).toContain("academy-certification-erc1155-bundle");
    expect(academy.referencedCollections.map((view) => view.collection.slug)).toContain("opensea-academy-badge-set");
    expect(academy.executionBoundaries.join(" ")).toContain("No settlement");
    expect(academy.executionBoundaries.join(" ")).toContain("No custom DNS");
    expect(fallback.isGlobalMarketplace).toBe(true);
    expect(fallback.tenant.slug).toBe("global");
    expect(fallback.executionBoundaries.join(" ")).toContain("does not create production tenant routing");
  });

  it("resolves Tenant Branding, Tenant Theme and Tenant Visual Identity with global fallback", () => {
    const academyBranding = resolveTenantBranding("academy");
    const fallbackBranding = resolveTenantBranding("missing-tenant");
    const globalBranding = getGlobalBranding();
    const academyLogo = getTenantLogo("academy");

    expect(academyBranding.branding.displayName).toBe("Axodus Academy Marketplace");
    expect(academyBranding.branding.brandStatus).toBe("tenant-custom-mock");
    expect(academyBranding.theme.themeName).toBe("Academy Blue Mock");
    expect(academyBranding.branding.visualIdentity.badgeLabel).toBe("Tenant Marketplace");
    expect(academyBranding.branding.primaryColor).toBe("#1d4ed8");
    expect(academyBranding.branding.secondaryColor).toBe("#0f766e");
    expect(academyBranding.branding.accentColor).toBe("#f97316");
    expect(academyBranding.usesGlobalBrandingFallback).toBe(false);
    expect(academyLogo.placeholder).toBe("A");
    expect(getTenantDisplayName("academy")).toBe("Axodus Academy Marketplace");
    expect(fallbackBranding.branding.displayName).toBe(globalBranding.displayName);
    expect(fallbackBranding.usesGlobalBrandingFallback).toBe(true);
    expect(globalBranding.disclaimers.join(" ")).toContain("custom DNS");
  });

  it("resolves Tenant Domains through slug, alias, simulated hostname and global fallback", () => {
    const slugContext = resolveTenantRoutingContext("/marketplace/t/academy");
    const aliasContext = resolveTenantRoutingContext("learning");
    const subdomainContext = resolveTenantRoutingContext("academy.marketplace.mock.axodus.local");
    const customDomainContext = resolveTenantRoutingContext("academy.example.mock");
    const disabledDomainContext = resolveTenantRoutingContext("community.example.mock");
    const conflictContext = resolveTenantRoutingContext("community");
    const missingContext = resolveTenantRoutingContext("missing-tenant");

    expect(isValidTenantSlug("academy")).toBe(true);
    expect(isValidTenantAlias("learning")).toBe(true);
    expect(isValidSimulatedHostname("academy.example.mock")).toBe(true);
    expect(resolveTenantBySlug("academy")?.id).toBe("tenant-academy-marketplace");
    expect(resolveTenantByAlias("learning")?.slug).toBe("academy");
    expect(resolveTenantBySimulatedDomain("academy.marketplace.mock.axodus.local")?.slug).toBe("academy");
    expect(getTenantDomains("academy").map((domain) => domain.domainType)).toContain("custom-domain-simulated");
    expect(getPrimaryTenantDomain("academy")?.domainType).toBe("slug");
    expect(slugContext.tenant.slug).toBe("academy");
    expect(slugContext.canRoute).toBe(true);
    expect(aliasContext.tenant.slug).toBe("academy");
    expect(aliasContext.domain?.domainType).toBe("alias");
    expect(subdomainContext.domain?.domainType).toBe("subdomain-simulated");
    expect(subdomainContext.resolution.disclaimers.join(" ")).toContain("No DNS real");
    expect(customDomainContext.resolution.resolutionStatus).toBe("conflict");
    expect(customDomainContext.resolution.isFallback).toBe(true);
    expect(disabledDomainContext.resolution.resolutionStatus).toBe("disabled");
    expect(disabledDomainContext.tenant.slug).toBe("global");
    expect(conflictContext.resolution.resolutionStatus).toBe("conflict");
    expect(missingContext.resolution.resolutionStatus).toBe("not-found");
    expect(missingContext.tenant.slug).toBe("global");
  });

  it("resolves Tenant Catalog and Tenant Isolation rules without duplicating products", () => {
    const global = resolveTenantCatalog("global");
    const academy = resolveTenantCatalog("academy");
    const acs = resolveTenantCatalog("acs-services");
    const community = resolveTenantCatalog("community-demo");

    expect(getTenantCatalog("academy").scope).toBe("mixed");
    expect(global.catalog.inheritsGlobalCatalog).toBe(true);
    expect(global.resolution.includedProductIds).toContain("product-trading-strategy-pass");
    expect(academy.resolution.includedProductIds).toEqual(["product-academy-cert-bundle"]);
    expect(academy.resolution.includedExternalCollectionIds).toContain("external-collection-opensea-academy-badges");
    expect(academy.resolution.excludedProductIds).toContain("product-trading-strategy-pass");
    expect(academy.resolution.appliedRules.map((rule) => rule.ruleType)).toContain("allow-external-collection");
    expect(acs.catalog.allowsFederatedAssets).toBe(false);
    expect(acs.resolution.includedProductIds).toEqual(["product-mcp-agent-template"]);
    expect(acs.resolution.excludedExternalCollectionIds).toContain("external-collection-harmony-creator-keys");
    expect(community.resolution.includedProductIds).toEqual(["product-governance-dashboard-nft"]);
    expect(community.resolution.excludedProductIds).toContain("product-trading-strategy-pass");
    expect(community.resolution.blockedRules.map((rule) => rule.ruleType)).toContain("block-product");
    expect(getTenantFeaturedProducts("community-demo").map((product) => product.id)).toContain("product-governance-dashboard-nft");
    expect(getTenantFeaturedCollections("community-demo").map((view) => view.collection.id)).toContain("external-collection-harmony-creator-keys");
    expect(getTenantVisibleProducts("academy").map((product) => product.id)).toEqual(["product-academy-cert-bundle"]);
    expect(getTenantVisibleCollections("academy").map((view) => view.collection.id)).toContain("external-collection-opensea-academy-badges");
    expect(isProductVisibleForTenant("community-demo", "product-trading-strategy-pass")).toBe(false);
    expect(isCollectionVisibleForTenant("community-demo", "external-collection-harmony-creator-keys")).toBe(true);
    expect(explainTenantCatalogInclusion("academy", "product-academy-cert-bundle")).toBe("Tenant featured rule");
    expect(explainTenantCatalogExclusion("community-demo", "product-trading-strategy-pass")).toBe("Product block rule");
    expect(academy.resolution.productItems.every((item) => item.canSettle === false && item.canTrade === false)).toBe(true);
    expect(community.resolution.collectionItems.find((item) => item.collectionId === "external-collection-harmony-creator-keys")?.warnings.join(" ")).toContain("origin");
    expect(academy.resolution.disclaimers.join(" ")).toContain("No financial isolation");
  });

  it("resolves Tenant Curated Catalog Integration with tenant isolation and boundaries", () => {
    const global = resolveTenantCuratedCatalogs("global");
    const academy = resolveTenantCuratedCatalogs("academy");
    const acs = resolveTenantCuratedCatalogs("acs-services");
    const community = resolveTenantCuratedCatalogs("community-demo");
    const academyContext = resolveTenantContext("academy");

    expect(getTenantCuratedCatalogConfig("academy").inheritsGlobalCuratedCatalogs).toBe(true);
    expect(global.resolution.includedCatalogIds).toContain("curated-catalog-foundational-nft");
    expect(academy.resolution.includedCatalogIds).toContain("curated-catalog-foundational-nft");
    expect(academy.resolution.includedCatalogIds).toContain("curated-catalog-academy-onboarding");
    expect(academy.resolution.featuredCatalogIds).toEqual(["curated-catalog-academy-onboarding"]);
    expect(academy.tenantCuratedCatalogs.find((view) => view.catalog.catalog.id === "curated-catalog-academy-onboarding")?.isTenantOwned).toBe(true);
    expect(academy.tenantCuratedCatalogs.find((view) => view.catalog.catalog.id === "curated-catalog-foundational-nft")?.isInherited).toBe(true);
    expect(academy.resolution.excludedItems.some((item) => item.productId === "product-governance-dashboard-nft")).toBe(true);
    expect(academy.resolution.includedItems.some((item) => item.productId === "product-academy-cert-bundle")).toBe(true);
    expect(academyContext.tenantCuratedCatalogs).toHaveLength(2);
    expect(academyContext.branding.displayName).toBe("Axodus Academy Marketplace");
    expect(academyContext.routingContext.resolution.routingMode).toBe("mock-read-only");
    expect(community.resolution.includedCatalogIds).toContain("curated-catalog-foundational-nft");
    expect(community.resolution.excludedCatalogIds).toContain("curated-catalog-academy-onboarding");
    expect(community.resolution.excludedItems.some((item) => item.catalogId === "curated-catalog-academy-onboarding" && item.exclusionReason === "blocked curated catalogs")).toBe(true);
    expect(acs.resolution.includedCatalogIds).toEqual([]);
    expect(acs.resolution.excludedItems.some((item) => item.exclusionReason === "blocked curated catalogs" || item.exclusionReason === "federated curated catalog blocked")).toBe(true);
    expect(academy.resolution.disclaimers.join(" ")).toContain("Tenant Catalog isolation");
    expect(academy.resolution.disclaimers.join(" ")).toContain("No revenue sharing");
    expect(academy.tenantCuratedCatalogs.flatMap((view) => view.boundaryNotes).join(" ")).toContain("no marketplace intelligence");
  });

  it("resolves Curated Catalog model with sections, items and federated boundaries", () => {
    const catalogs = listCuratedCatalogs();
    const foundational = resolveCuratedCatalog("foundational-nft-access");
    const academy = resolveCuratedCatalog("curated-catalog-academy-onboarding");

    expect(catalogs.map((view) => view.catalog.slug)).toContain("foundational-nft-access");
    expect(getCuratedCatalogById("curated-catalog-foundational-nft")?.catalogType).toBe("curated");
    expect(getCuratedCatalogBySlug("academy-onboarding")?.inheritsTenantCatalog).toBe(true);
    expect(foundational?.catalog.sections.length).toBeGreaterThan(0);
    expect(foundational?.catalog.rules.map((rule) => rule.ruleType)).toContain("preserve-federation-boundary");
    expect(foundational?.editorialRules.map((rule) => rule.ruleType)).toContain("governance-review");
    expect(foundational?.workflowSummary.reviewStatus).toBe("governance-review-mock");
    expect(foundational?.featuredProducts.map((product) => product.id)).toContain("product-governance-dashboard-nft");
    expect(foundational?.featuredCollections.map((view) => view.collection.id)).toContain("external-collection-harmony-creator-keys");
    expect(foundational?.items.every((entry) => entry.item.canSettle === false && entry.item.canTrade === false)).toBe(true);
    expect(foundational?.boundaryNotes.join(" ")).toMatch(/no ranking real/i);
    expect(foundational?.boundaryNotes.join(" ")).toMatch(/no marketplace intelligence/i);
    expect(foundational?.boundaryNotes.join(" ")).toMatch(/no settlement/i);

    const federatedItem = foundational?.items.find((entry) => entry.item.externalCollectionId === "external-collection-harmony-creator-keys");
    expect(federatedItem?.item.isExternal).toBe(true);
    expect(federatedItem?.trustBoundary?.provider).toContain("Harmony");
    expect(federatedItem?.trustBoundary?.validationStatus).toBe("provider-reported");
    expect(federatedItem?.trustBoundary?.riskClassification).toBe("unknown-external");
    expect(federatedItem?.trustBoundary?.provenance).toContain("Provider-reported");
    expect(federatedItem?.boundaryNotes.join(" ")).toContain("trust boundaries");
    expect(resolveCuratedCatalogItems("academy-onboarding").map((entry) => entry.item.id)).toContain("item-academy-external-badges");
    expect(academy?.catalog.tenantId).toBe("tenant-academy-marketplace");
    expect(resolveCuratedCatalog("missing-catalog")).toBeNull();
  });

  it("explains Editorial Rules and mock Curation Workflow boundaries", () => {
    const rules = listEditorialRules("foundational-nft-access");
    const explanations = explainEditorialRules("foundational-nft-access");
    const academyExplanations = explainEditorialRules("academy-onboarding");
    const foundational = resolveCuratedCatalog("foundational-nft-access");

    expect(rules.map((rule) => rule.reviewStatus)).toContain("approved-mock");
    expect(rules.map((rule) => rule.reviewStatus)).toContain("governance-review-mock");
    expect(explanations.find((entry) => entry.rule.id === "editorial-rule-foundational-governance-include")?.inclusionReason).toContain("Native governance product");
    expect(explanations.find((entry) => entry.rule.id === "editorial-rule-foundational-trading-exclude")?.exclusionReason).toContain("Trading category");
    expect(explanations.every((entry) => entry.boundaryNote.includes("no productive approval workflow"))).toBe(true);
    expect(explanations.every((entry) => entry.boundaryNote.includes("no compliance real"))).toBe(true);
    expect(explanations.every((entry) => entry.boundaryNote.includes("no certification real"))).toBe(true);
    expect(explanations.every((entry) => entry.boundaryNote.includes("no ranking real"))).toBe(true);
    expect(explanations.every((entry) => entry.boundaryNote.includes("no marketplace intelligence"))).toBe(true);
    expect(foundational?.items.find((entry) => entry.item.id === "item-foundational-harmony-external-collection")?.curationReasons.reviewStatus).toBe("governance-review-mock");
    expect(foundational?.workflowSummary.disclaimers.join(" ")).toContain("No productive approval workflow");
    expect(academyExplanations.map((entry) => entry.rule.reviewStatus)).toContain("governance-review-mock");
    expect(explainEditorialRules("missing-catalog")).toEqual([]);
  });

  it("groups Curated Catalogs into Featured Catalogs and Catalog Segments without ranking", () => {
    const featured = listFeaturedCatalogs();
    const segments = listCatalogSegments();
    const academyCatalogs = listCatalogsBySegment("academy");
    const federatedSegment = segments.find((view) => view.segment.slug === "federated");
    const acsSegment = segments.find((view) => view.segment.slug === "acs");

    expect(featured.map((view) => view.featured.id)).toContain("featured-catalog-foundational-nft");
    expect(featured.map((view) => view.featured.id)).toContain("featured-catalog-academy-onboarding");
    expect(featured.map((view) => view.featured.position)).toEqual([1, 2, 3]);
    expect(featured.every((view) => view.boundaryNotes.join(" ").includes("Featured does not mean ranking real"))).toBe(true);
    expect(featured.every((view) => view.boundaryNotes.join(" ").includes("recommendation engine"))).toBe(true);
    expect(featured.every((view) => view.boundaryNotes.join(" ").includes("marketplace intelligence"))).toBe(true);
    expect(segments.map((view) => view.segment.segmentType)).toEqual(["academy", "acs", "community", "enterprise", "creator", "dao", "federated", "demo"]);
    expect(segments.every((view) => view.boundaryNotes.join(" ").includes("Catalog Segment is mock/config-first"))).toBe(true);
    expect(academyCatalogs.map((view) => view.catalog.slug)).toContain("academy-onboarding");
    expect(acsSegment?.catalogs).toHaveLength(0);
    expect(segments.find((view) => view.segment.slug === "enterprise")?.segment.displayName).toBe("Enterprise Catalogs");
    expect(segments.find((view) => view.segment.slug === "creator")?.catalogs).toHaveLength(0);
    expect(segments.find((view) => view.segment.slug === "dao")?.catalogs).toHaveLength(0);
    expect(segments.find((view) => view.segment.slug === "demo")?.catalogs).toHaveLength(0);
    expect(federatedSegment?.featuredCatalogs[0].featured.placement).toBe("federated-feature");
    expect(federatedSegment?.catalogs[0].items.some((entry) => entry.item.isFederated && entry.trustBoundary?.provider.includes("Harmony"))).toBe(true);
    expect(listCatalogsBySegment("missing-segment")).toEqual([]);
  });

  it("finds products by slug", () => {
    const product = getProductBySlug("academy-certification-erc1155-bundle");

    expect(product?.tokenStandard).toBe("ERC1155");
    expect(product?.listingType).toBe("english-auction");
  });

  it("represents Distribution Network channels as mock/config-first non-executing read models", () => {
    const networks = listDistributionNetworks();
    const channels = listDistributionChannels();
    const globalNetwork = getDistributionNetworkById("axodus-distribution-network");
    const partnerChannel = getDistributionChannelById("academy-partner-channel");
    const affiliateChannel = getDistributionChannelById("distribution-channel-affiliate-demo");
    const communityChannel = getDistributionChannelById("community-marketplace-channel");
    const context = resolveDistributionContext("affiliate-demo-channel");
    const fallback = resolveDistributionContext("missing-channel");

    expect(networks).toHaveLength(1);
    expect(globalNetwork?.channels).toHaveLength(7);
    expect(channels.map((view) => view.channel.channelType)).toEqual([
      "tenant",
      "partner",
      "distributor",
      "community",
      "affiliate",
      "agency",
      "demo"
    ]);
    expect(partnerChannel?.channel.commercialOrigin.originType).toBe("partner");
    expect(partnerChannel?.allowedCuratedCatalogs.map((catalog) => catalog.catalog.slug)).toContain("academy-onboarding");
    expect(partnerChannel?.placements[0].targetLabel).toBe("Academy Onboarding");
    expect(affiliateChannel?.channel.attributionSource.sourceType).toBe("referral-mock");
    expect(affiliateChannel?.channel.attributionSource.trackingMode).toBe("referral-code-mock");
    expect(affiliateChannel?.channel.canTrack).toBe(false);
    expect(affiliateChannel?.channel.canAttributeRevenue).toBe(false);
    expect(affiliateChannel?.channel.canSettle).toBe(false);
    expect(communityChannel?.allowedCollections.some((collection) => collection.id === "external-collection-harmony-creator-keys")).toBe(true);
    expect(communityChannel?.boundaryNotes.join(" ")).toContain("Federated Collection display is read-only");
    expect(context.channel.channel.id).toBe("distribution-channel-affiliate-demo");
    expect(context.boundaryNotes.join(" ")).toContain("No affiliate tracking real");
    expect(fallback.isFallback).toBe(true);
    expect(fallback.channel.channel.id).toBe("distribution-channel-global-tenant");
    expect(networks[0].boundaryNotes.join(" ")).toContain("no tracking real");
    expect(channels.every((view) => view.channel.canSettle === false)).toBe(true);
    expect(channels.every((view) => view.channel.canTrack === false)).toBe(true);
    expect(channels.every((view) => view.channel.canAttributeRevenue === false)).toBe(true);
  });

  it("represents Distribution Profiles as mock/config-first identities without onboarding or tracking", () => {
    const profiles = listDistributionProfiles();
    const distributor = getDistributionProfileById("distribution-profile-acs-distributor");
    const partner = getDistributionProfileBySlug("academy-partner-profile");
    const agency = getDistributionProfileById("agency-preview-profile");
    const affiliate = getDistributionProfileById("affiliate-demo-profile");
    const community = getDistributionProfileById("community-marketplace-profile");
    const disabled = getDistributionProfileById("demo-sandbox-profile");
    const partnerProfiles = getDistributionProfilesByType("partner");
    const channelProfiles = getDistributionProfilesByChannel("academy-partner-channel");
    const context = resolveDistributionProfileContext("affiliate-demo-profile");
    const fallback = resolveDistributionProfileContext("missing-profile");

    expect(profiles.map((view) => view.profile.profileType)).toEqual([
      "distributor",
      "partner",
      "agency",
      "affiliate",
      "community-marketplace",
      "demo"
    ]);
    expect(distributor?.channels[0].channel.id).toBe("distribution-channel-acs-distributor");
    expect(distributor?.segments.map((segment) => segment.slug)).toContain("acs");
    expect(partner?.curatedCatalogs.map((catalog) => catalog.catalog.slug)).toContain("academy-onboarding");
    expect(partner?.tenants.map((tenant) => tenant.slug)).toContain("academy");
    expect(agency?.profile.governanceStatus).toBe("review-required");
    expect(affiliate?.profile.commercialLabel).toContain("no tracking real");
    expect(community?.profile.profileType).toBe("community-marketplace");
    expect(community?.boundaryNotes.join(" ")).toContain("not a Seller Profile, Tenant Identity or Federation Provider");
    expect(disabled?.profile.status).toBe("disabled");
    expect(partnerProfiles).toHaveLength(1);
    expect(channelProfiles[0].profile.id).toBe("distribution-profile-academy-partner");
    expect(context.profile.profile.id).toBe("distribution-profile-affiliate-demo");
    expect(context.boundaryNotes.join(" ")).toContain("KYC real");
    expect(context.boundaryNotes.join(" ")).toContain("commercial contract real");
    expect(context.boundaryNotes.join(" ")).toContain("no revenue sharing");
    expect(fallback.isFallback).toBe(true);
    expect(fallback.profile.profile.status).not.toBe("disabled");
    expect(profiles.every((view) => view.boundaryNotes.join(" ").includes("tracking real"))).toBe(true);
    expect(profiles.every((view) => view.boundaryNotes.join(" ").includes("commission"))).toBe(true);
    expect(profiles.every((view) => view.boundaryNotes.join(" ").includes("payout"))).toBe(true);
  });

  it("represents Attribution and Distribution Sources without tracking or financial attribution", () => {
    const sources = listAttributionSources();
    const referral = getAttributionSourceBySlug("affiliate-referral-source");
    const campaign = getAttributionSourceById("attribution-record-academy-campaign");
    const placement = getAttributionSourceById("global-placement-source");
    const community = getAttributionSourceById("community-marketplace-source");
    const disabled = getAttributionSourceById("demo-disabled-source");
    const byChannel = getAttributionSourcesByChannel("affiliate-demo-channel");
    const byProfile = getAttributionSourcesByProfile("affiliate-demo-profile");
    const byTenant = getAttributionSourcesByTenant("academy");
    const byCatalog = getAttributionSourcesByCuratedCatalog("academy-onboarding");
    const bySegment = getAttributionSourcesBySegment("academy");
    const byPlacement = getAttributionSourcesByPlacement("distribution-placement-affiliate-product");
    const origin = getCommercialOriginForAttribution("affiliate-referral-source");
    const distributionSource = getDistributionSourceForAttribution("affiliate-referral-source");
    const boundary = explainAttributionBoundary("affiliate-referral-source").join(" ");
    const context = resolveAttributionContext("affiliate-referral-source");
    const fallback = resolveAttributionContext("missing-source");

    expect(sources.map((view) => view.source.sourceType)).toEqual([
      "placement-mock",
      "campaign-mock",
      "referral-mock",
      "community-marketplace",
      "manual-source-mock",
      "demo"
    ]);
    expect(referral?.source.referralCodeMock).toBe("AFFILIATE-MOCK-NO-TRACK");
    expect(referral?.source.trackingMode).toBe("referral-code-mock");
    expect(campaign?.source.campaignLabel).toBe("academy-onboarding-campaign-mock");
    expect(campaign?.source.trackingMode).toBe("campaign-label-mock");
    expect(placement?.source.sourceType).toBe("placement-mock");
    expect(community?.profile?.profile.profileType).toBe("community-marketplace");
    expect(disabled?.source.status).toBe("disabled");
    expect(byChannel.map((view) => view.source.id)).toContain("attribution-record-affiliate-referral");
    expect(byProfile.map((view) => view.source.id)).toContain("attribution-record-affiliate-referral");
    expect(byTenant.map((view) => view.source.id)).toContain("attribution-record-academy-campaign");
    expect(byCatalog.map((view) => view.source.id)).toContain("attribution-record-academy-campaign");
    expect(bySegment.map((view) => view.source.id)).toContain("attribution-record-academy-campaign");
    expect(byPlacement.map((view) => view.source.id)).toContain("attribution-record-affiliate-referral");
    expect(origin?.originType).toBe("affiliate");
    expect(distributionSource?.sourceType).toBe("referral-mock");
    expect(context.source.source.id).toBe("attribution-record-affiliate-referral");
    expect(context.context.canTrack).toBe(false);
    expect(context.context.canAttributeRevenue).toBe(false);
    expect(context.context.canTriggerPayout).toBe(false);
    expect(context.context.canSettle).toBe(false);
    expect(boundary).toContain("no cookies");
    expect(boundary).toContain("no commission");
    expect(boundary).toContain("no payout");
    expect(boundary).toContain("no revenue sharing");
    expect(boundary).toContain("no settlement");
    expect(fallback.isFallback).toBe(true);
    expect(fallback.source.source.status).not.toBe("disabled");
    expect(sources.every((view) => view.source.canTrack === false)).toBe(true);
    expect(sources.every((view) => view.source.canAttributeRevenue === false)).toBe(true);
    expect(sources.every((view) => view.source.canTriggerPayout === false)).toBe(true);
    expect(sources.every((view) => view.source.canSettle === false)).toBe(true);
  });

  it("represents Community Marketplace Distribution with mock rules, attribution and federation boundaries", () => {
    const distributions = listCommunityMarketplaceDistributions();
    const community = getCommunityMarketplaceDistributionById("community-distribution-creator-federated");
    const bySlug = getCommunityMarketplaceDistributionBySlug("creator-federated-community");
    const empty = getCommunityMarketplaceDistributionById("empty-demo-community");
    const context = resolveCommunityDistributionContext("creator-federated-community");
    const fallback = resolveCommunityDistributionContext("missing-community");
    const tenants = getCommunityDistributionTenants("creator-federated-community");
    const catalogs = getCommunityDistributionCuratedCatalogs("creator-federated-community");
    const segments = getCommunityDistributionSegments("creator-federated-community");
    const items = getCommunityDistributionItems("creator-federated-community");
    const attribution = getCommunityDistributionAttributionSource("creator-federated-community");
    const origin = getCommunityDistributionCommercialOrigin("creator-federated-community");
    const rules = applyCommunityDistributionRules("creator-federated-community");
    const inclusions = explainCommunityDistributionInclusion("creator-federated-community");
    const exclusions = explainCommunityDistributionExclusion("creator-federated-community");
    const federatedItem = community?.visibleItems.find((item) => item.item.collectionId === "external-collection-harmony-creator-keys");

    expect(distributions.map((view) => view.distribution.slug)).toEqual(["creator-federated-community", "empty-demo-community"]);
    expect(community?.profile?.profile.profileType).toBe("community-marketplace");
    expect(community?.channel?.channel.id).toBe("distribution-channel-community-marketplace");
    expect(bySlug?.distribution.id).toBe("community-distribution-creator-federated");
    expect(empty?.distribution.status).toBe("empty");
    expect(empty?.visibleItems).toHaveLength(0);
    expect(context.context.canTrack).toBe(false);
    expect(context.context.canAttributeRevenue).toBe(false);
    expect(context.context.canTriggerPayout).toBe(false);
    expect(context.context.canSettle).toBe(false);
    expect(fallback.isFallback).toBe(true);
    expect(tenants.map((tenant) => tenant.slug)).toContain("community-demo");
    expect(catalogs.map((catalog) => catalog.catalog.slug)).toContain("foundational-nft-access");
    expect(segments.map((segment) => segment.slug)).toContain("federated");
    expect(items.some((item) => item.item.exclusionReason === "Blocked by community distribution rule.")).toBe(true);
    expect(attribution?.source.id).toBe("attribution-record-community-source");
    expect(origin?.originType).toBe("community");
    expect(rules.map((rule) => rule.ruleType)).toContain("allow-federated-assets");
    expect(rules.map((rule) => rule.ruleType)).toContain("block-product");
    expect(inclusions.map((entry) => entry.targetId)).toContain("external-collection-harmony-creator-keys");
    expect(exclusions.map((entry) => entry.targetId)).toContain("product-mcp-agent-template");
    expect(federatedItem?.trustBoundary?.provider).toContain("Harmony");
    expect(federatedItem?.trustBoundary?.validationStatus).toBeDefined();
    expect(federatedItem?.trustBoundary?.riskClassification).toBeDefined();
    expect(community?.boundaryNotes.join(" ")).toContain("origin, provider, validation status, provenance, risk classification and trust boundaries");
    expect(community?.boundaryNotes.join(" ")).toContain("governance delegation real");
    expect(community?.boundaryNotes.join(" ")).toContain("revenue sharing");
    expect(community?.boundaryNotes.join(" ")).toContain("tracking real");
  });

  it("issues mock purchase records without settlement", () => {
    const product = getProductBySlug("governance-dashboard-nft-access");
    expect(product).toBeDefined();

    const purchase = issueMockPurchase(product!);

    expect(purchase.currency).toBe("USDC");
    expect(purchase.licenseIssued).toBe("license-personal-nft");
    expect(purchase.signedUrlPreview).toContain("greenfield.mock.axodus.local");
  });

  it("previews Greenfield access lifecycle without production delivery", () => {
    const product = getProductBySlug("governance-dashboard-nft-access");
    expect(product).toBeDefined();

    const access = StorageAccessService.getAccessModel(product!);
    const signedUrl = GreenfieldAccessAdapter.requestSignedUrlPreview(product!);

    expect(access.signedUrlLifecycle).toBe("preview");
    expect(access.productionGreenfieldEnabled).toBe(false);
    expect(access.deliveryExecutionEnabled).toBe(false);
    expect(signedUrl.signedUrl).toContain("greenfield.mock.axodus.local");
    expect(signedUrl.deliveryExecutionEnabled).toBe(false);
  });

  it("resolves legacy NFT item references", () => {
    const product = getProductByItemRef("polygon", "mock:governance-dashboard-access", "AXD-GOV-001");

    expect(product?.slug).toBe("governance-dashboard-nft-access");
  });

  it("builds asset registry views with ownership, transfer, license and validation history", () => {
    const registry = getAssetRegistryByProductSlug("governance-dashboard-nft-access");

    expect(registry?.registry.currentOwner).toBe("0xMockOwnerGovernance001");
    expect(registry?.registry.ownershipHistory).toHaveLength(1);
    expect(registry?.registry.transferHistory).toHaveLength(1);
    expect(registry?.registry.licenseHistory).toHaveLength(1);
    expect(registry?.registry.validation.metadata).toBe("compliant");
    expect(registry?.metadataAttributes.map((attribute) => attribute.traitType)).toContain("Access");
    expect(registry?.boundaries.map((boundary) => boundary.label)).toContain("Settlement boundary");
  });

  it("keeps empty asset registry histories explicit for mock assets", () => {
    const registry = getAssetRegistryByProductSlug("academy-certification-erc1155-bundle");

    expect(registry?.registry.transferHistory).toHaveLength(0);
    expect(registry?.registry.licenseHistory[0].status).toBe("mock-pending");
    expect(registry?.registry.validation.collection).toBe("under-review");
  });

  it("returns null for unknown asset registry slugs", () => {
    expect(getAssetRegistryByProductSlug("missing-asset")).toBeNull();
  });

  it("builds mock-first marketplace analytics for volume, activity and market metrics", () => {
    const analytics = buildMarketplaceAnalytics();

    expect(analytics.volume.totalVolume).toBe(750);
    expect(analytics.volume.averagePrice).toBe(187.5);
    expect(analytics.volume.floorPrice).toBe(80);
    expect(analytics.activity.activeListings).toBe(4);
    expect(analytics.activity.activeAuctions).toBe(2);
    expect(analytics.activity.totalBids).toBe(23);
    expect(analytics.market.erc721Products).toBe(2);
    expect(analytics.market.erc1155Products).toBe(1);
    expect(analytics.market.marketStatus).toBe("restricted-mock");
  });

  it("builds collection, seller and recent activity summaries for analytics", () => {
    const analytics = buildMarketplaceAnalytics();

    expect(analytics.collections.map((collection) => collection.slug)).toContain("axodus-governance-access");
    expect(analytics.sellers[0].id).toBe("seller-axodus-core");
    expect(analytics.activity.recentActivity.length).toBeGreaterThan(0);
    expect(analytics.notes.join(" ")).toContain("No tracking events");
  });

  it("creates draft listing previews without mutating products", () => {
    const before = listProducts().length;
    const preview = createDraftListingPreview({
      title: "Mock ERC721 Listing",
      category: "Digital Assets",
      tokenStandard: "ERC721",
      listingType: "fixed",
      chain: "Polygon",
      price: 100,
      currency: "USDC",
      royaltyBps: 500,
      deliveryType: "Signed URL",
      governanceReviewRequired: true,
      description: "Mock listing preview"
    });

    expect(preview.status).toBe("requires-governance-review");
    expect(preview.royaltyPreviewAmount).toBe(5);
    expect(listProducts()).toHaveLength(before);
  });
});

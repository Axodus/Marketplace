import { describe, expect, it } from "vitest";
import {
  buildSellerProfileView,
  buildMarketplaceAnalytics,
  createDraftListingPreview,
  discoverWalletAssets,
  getAssetRegistryByProductSlug,
  getCollectionBySlug,
  getCollectionForProduct,
  getCollectionSourceLabel,
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
  isExternalCollection,
  isValidSimulatedHostname,
  isValidTenantAlias,
  isValidTenantSlug,
  isValidMockWalletAddress,
  issueMockPurchase,
  listExternalContracts,
  listWalletDiscoveryRecords,
  listFederationProviders,
  listCollections,
  listProducts,
  listTenants,
  getTenantDisplayName,
  getTenantLogo,
  resolveTenantByAlias,
  resolveTenantBySimulatedDomain,
  resolveTenantBySlug,
  resolveTenantBranding,
  resolveTenantContext,
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

  it("finds products by slug", () => {
    const product = getProductBySlug("academy-certification-erc1155-bundle");

    expect(product?.tokenStandard).toBe("ERC1155");
    expect(product?.listingType).toBe("english-auction");
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

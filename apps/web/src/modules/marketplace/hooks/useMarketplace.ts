import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../services/apiClient";
import type { ProductFilters } from "../services/marketplaceService";
import {
  DEFAULT_PRODUCT_EXPLORER_FILTERS,
  buildMarketplaceAnalytics,
  buildSellerProfileView,
  calculateCommissionModelShareTotalMock,
  calculateDashboardMetrics,
  detectParticipantShareConflicts,
  discoverWalletAssets,
  explainParticipantSplitsByPolicy,
  explainEditorialRules,
  explainRevenueSharingRuleApplication,
  explainAttributionToSplit,
  explainRevenueSharingBoundary,
  getAttributionSourceById,
  getAttributionSplitMapping,
  getAttributionSourcesByChannel,
  getAttributionSourcesByProfile,
  getCommercialOriginSplitMapping,
  getCommunityDistributionItems,
  getCommunityMarketplaceDistributionById,
  getDistributionContextForCuratedCatalog,
  getDistributionContextForTenant,
  getDistributionChannelById,
  getDistributionSourceSplitMapping,
  getDistributionNetworkById,
  getDistributionProfileById,
  getDistributionProfilesByType,
  getCommissionModelById,
  getRevenueSharingPoliciesByCuratedCatalog,
  getRevenueSharingPoliciesByDistributionChannel,
  getRevenueSharingPoliciesByTenant,
  listCuratedCatalogs,
  getExternalContractById,
  getFederationProviderById,
  getProductByItemRef,
  resolveCuratedCatalog,
  resolveCuratedCatalogItems,
  resolveTenantCuratedCatalogs,
  getCollectionBySlug,
  getSellerById,
  listExternalContracts,
  listFederationProviders,
  listBoundaries,
  listCollections,
  listCommissionModels,
  listCommissionModelsByPolicy,
  listDistributionChannels,
  listDistributionNetworks,
  listDistributionProfiles,
  listProducts,
  listRevenueSharingPolicies,
  listRevenueSharingPreviews,
  listParticipantSharesByCommissionModel,
  listParticipantSharesByPolicy,
  listRevenueParticipantsByPolicy,
  listRevenueSplitRulesByPolicy,
  getTenantDomains,
  getTenantVisibleCollections,
  getTenantVisibleProducts,
  listCatalogSegments,
  listTenants,
  listFeaturedCatalogs,
  listCatalogsBySegment,
  listMarketplaceInsights,
  listIntelligenceSnapshots,
  listIntelligenceSnapshotsByScope,
  getIntelligenceSnapshotById,
  listAttributionSources,
  listAcademyCourses,
  listAcademyCertifications,
  listAcademyLearningSubscriptions,
  listAttributionToSplitRules,
  listAttributionToSplitRulesByAttributionSource,
  listAttributionToSplitRulesByCommunityDistribution,
  listAttributionToSplitRulesByDistributionChannel,
  listAttributionToSplitRulesByDistributionProfile,
  listCommunityMarketplaceDistributions,
  resolveAttributionContext,
  resolveAttributionSplit,
  resolveCommunityDistributionContext,
  resolveCuratedCatalogDistribution,
  resolveDataBoundary,
  resolveDistributionContext,
  resolveDistributionProfileContext,
  resolveMarketplaceIntelligenceSnapshot,
  resolveTenantIntelligenceSnapshot,
  resolveCatalogIntelligenceSnapshot,
  resolveDistributionIntelligenceSnapshot,
  resolveRevenueIntelligenceSnapshot,
  resolveCommunityIntelligenceSnapshot,
  resolveFederationIntelligenceSnapshot,
  resolveMarketplaceIntelligencePanel,
  resolveTenantIntelligencePanel,
  resolveCatalogIntelligencePanel,
  resolveDistributionIntelligencePanel,
  resolveCommunityIntelligencePanel,
  resolveAttributionIntelligencePanel,
  resolveSettlementBoundary,
  getMarketplaceInsightById,
  getInsightSignalById,
  getRevenueIntelligenceSummaryByPolicy,
  getRevenuePreviewInsightByPolicy,
  getRiskTrustInsightById,
  getRiskTrustInsightsByDistributionAttribution,
  getRiskTrustInsightsByRevenuePolicy,
  getSettlementBoundaryInsightByPolicy,
  getRecommendationPreviewById,
  getRankingExplanationById,
  getRevenueSharingPolicyById,
  listInsightSignals,
  listInsightSignalsByInsight,
  listInsightSignalsByScope,
  listRecommendationPreviews,
  listRecommendationPreviewsByScope,
  listRankingExplanations,
  listRankingExplanationsByScope,
  listRevenueIntelligenceSummaries,
  listRiskTrustInsights,
  listRiskTrustInsightsByScope,
  explainRecommendationRanking,
  resolveFederationIntelligenceContext,
  resolveRevenueTrustRiskIntelligence,
  resolveRiskTrustContext,
  validateRevenuePreviewInsightMockOnly,
  validateRiskTrustInsightMockOnly,
  validateRecommendationPreviewMockOnly,
  validateIntelligenceSnapshotMockOnly,
  validateMarketplaceInsightMockOnly,
  getAcademyCourseById,
  getAcademyCertificationById,
  getAcademyLearningSubscriptionById,
  resolveAcademyDistributionContext,
  resolveAcademyDistributionOverview,
  validateAcademyDistributionMockOnly,
  getAIAgentById,
  getComputeAccessById,
  getMCPPackageById,
  getWorkflowSystemById,
  resolveACSDistributionContext,
  resolveACSDistributionOverview,
  validateACSDistributionMockOnly,
  listRevenueSharingAuditEntriesByPolicy,
  listRevenueSharingPreviewConflicts,
  resolvePayoutPreviewMock,
  resolveDistributionChannelRevenueSharing,
  resolveDistributionProfileRevenueSharing,
  resolveCuratedCatalogRevenueSharing,
  resolveCommunityRevenueSharing,
  resolveRevenueSharingPreview,
  resolveSettlementPreviewMock,
  resolveTenantRevenueSharing,
  validateParticipantSharesByCommissionModel,
  resolveTenantCatalog,
  resolveTenantBranding,
  resolveTenantContext,
  resolveTenantDistribution,
  resolveTenantRoutingContext,
  resolveTenantTheme
} from "../services/marketplaceService";
import { instrumentMarketplaceError, traceMarketplaceLifecycle } from "../services/runtimeTelemetry";

export function useProductFilters() {
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_PRODUCT_EXPLORER_FILTERS);
  const fallbackProducts = useMemo(() => listProducts(filters), [filters]);
  const productsQuery = useQuery({
    queryKey: ["marketplace-products", filters],
    queryFn: async () => {
      const [items, enforcement] = await Promise.all([apiClient.listProducts(filters), apiClient.getGovernanceEnforcementSnapshot()]);
      return { items, enforcement };
    }
  });
  const products = productsQuery.data?.items ?? fallbackProducts;

  return { filters, setFilters, products, governanceEnforcement: productsQuery.data?.enforcement, isLoading: productsQuery.isLoading, error: productsQuery.error };
}

export function useMarketplaceHome() {
  return useQuery({
    queryKey: ["marketplace-home"],
    queryFn: async () => {
      traceMarketplaceLifecycle("marketplace-home-query", "started");
      const [products, sellers] = await Promise.all([apiClient.listProducts(), apiClient.listSellers()]);
      return {
        products,
        sellers,
        metrics: calculateDashboardMetrics(),
        boundaries: listBoundaries()
      };
    }
  });
}

export function useMarketplaceDashboard() {
  return useQuery({
    queryKey: ["marketplace-dashboard"],
    queryFn: async () => {
      traceMarketplaceLifecycle("marketplace-dashboard-query", "started");
      const [runtime, governanceWorkflow] = await Promise.all([apiClient.getMarketplaceRuntime(), apiClient.getGovernanceWorkflow()]);
      return {
        metrics: calculateDashboardMetrics(),
        products: runtime.products,
        sellers: runtime.sellers,
        analytics: buildMarketplaceAnalytics(runtime.products, runtime.sellers),
        runtime,
        governanceWorkflow,
        boundaries: listBoundaries()
      };
    }
  });
}

export function useCollections() {
  return useQuery({
    queryKey: ["marketplace-collections"],
    queryFn: () => {
      traceMarketplaceLifecycle("marketplace-collections-query", "completed");
      return listCollections();
    }
  });
}

export function useCuratedCatalogs() {
  return useQuery({
    queryKey: ["marketplace-curated-catalogs"],
    queryFn: () => {
      const catalogs = listCuratedCatalogs();
      traceMarketplaceLifecycle("marketplace-curated-catalogs-query", "completed", { catalogCount: catalogs.length });
      return catalogs;
    }
  });
}

export function useCuratedCatalog(catalogIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-curated-catalog", catalogIdOrSlug],
    enabled: Boolean(catalogIdOrSlug),
    queryFn: () => {
      const catalog = resolveCuratedCatalog(catalogIdOrSlug ?? "");
      if (!catalog) {
        const error = new Error("Curated Catalog not found");
        instrumentMarketplaceError("marketplace-curated-catalog-query", error, { catalogIdOrSlug: catalogIdOrSlug ?? null });
        throw error;
      }
      traceMarketplaceLifecycle("marketplace-curated-catalog-query", "completed", { catalogId: catalog.catalog.id });
      return catalog;
    }
  });
}

export function useCuratedCatalogItems(catalogIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-curated-catalog-items", catalogIdOrSlug],
    enabled: Boolean(catalogIdOrSlug),
    queryFn: () => {
      const items = resolveCuratedCatalogItems(catalogIdOrSlug ?? "");
      traceMarketplaceLifecycle("marketplace-curated-catalog-items-query", "completed", {
        catalogIdOrSlug: catalogIdOrSlug ?? null,
        itemCount: items.length
      });
      return items;
    }
  });
}

export function useEditorialRules(catalogIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-editorial-rules", catalogIdOrSlug],
    enabled: Boolean(catalogIdOrSlug),
    queryFn: () => {
      const rules = explainEditorialRules(catalogIdOrSlug ?? "");
      traceMarketplaceLifecycle("marketplace-editorial-rules-query", "completed", {
        catalogIdOrSlug: catalogIdOrSlug ?? null,
        ruleCount: rules.length
      });
      return rules;
    }
  });
}

export function useFeaturedCatalogs() {
  return useQuery({
    queryKey: ["marketplace-featured-catalogs"],
    queryFn: () => {
      const featured = listFeaturedCatalogs();
      traceMarketplaceLifecycle("marketplace-featured-catalogs-query", "completed", { featuredCount: featured.length });
      return featured;
    }
  });
}

export function useCatalogSegments() {
  return useQuery({
    queryKey: ["marketplace-catalog-segments"],
    queryFn: () => {
      const segments = listCatalogSegments();
      traceMarketplaceLifecycle("marketplace-catalog-segments-query", "completed", { segmentCount: segments.length });
      return segments;
    }
  });
}

export function useCatalogsBySegment(segmentIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-catalogs-by-segment", segmentIdOrSlug],
    enabled: Boolean(segmentIdOrSlug),
    queryFn: () => {
      const catalogs = listCatalogsBySegment(segmentIdOrSlug ?? "");
      traceMarketplaceLifecycle("marketplace-catalogs-by-segment-query", "completed", {
        segmentIdOrSlug: segmentIdOrSlug ?? null,
        catalogCount: catalogs.length
      });
      return catalogs;
    }
  });
}

export function useDistributionNetworks() {
  return useQuery({
    queryKey: ["marketplace-distribution-networks"],
    queryFn: () => {
      const networks = listDistributionNetworks();
      traceMarketplaceLifecycle("marketplace-distribution-networks-query", "completed", { networkCount: networks.length });
      return networks;
    }
  });
}

export function useDistributionNetwork(networkIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-distribution-network", networkIdOrSlug],
    enabled: Boolean(networkIdOrSlug),
    queryFn: () => {
      const network = getDistributionNetworkById(networkIdOrSlug ?? "");
      if (!network) {
        const error = new Error("Distribution Network not found");
        instrumentMarketplaceError("marketplace-distribution-network-query", error, { networkIdOrSlug: networkIdOrSlug ?? null });
        throw error;
      }
      traceMarketplaceLifecycle("marketplace-distribution-network-query", "completed", { networkId: network.network.id });
      return network;
    }
  });
}

export function useDistributionChannels() {
  return useQuery({
    queryKey: ["marketplace-distribution-channels"],
    queryFn: () => {
      const channels = listDistributionChannels();
      traceMarketplaceLifecycle("marketplace-distribution-channels-query", "completed", { channelCount: channels.length });
      return channels;
    }
  });
}

export function useDistributionChannel(channelIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-distribution-channel", channelIdOrSlug],
    enabled: Boolean(channelIdOrSlug),
    queryFn: () => {
      const channel = getDistributionChannelById(channelIdOrSlug ?? "");
      if (!channel) {
        const error = new Error("Distribution Channel not found");
        instrumentMarketplaceError("marketplace-distribution-channel-query", error, { channelIdOrSlug: channelIdOrSlug ?? null });
        throw error;
      }
      traceMarketplaceLifecycle("marketplace-distribution-channel-query", "completed", { channelId: channel.channel.id });
      return channel;
    }
  });
}

export function useDistributionContext(channelIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-distribution-context", channelIdOrSlug],
    queryFn: () => {
      const context = resolveDistributionContext(channelIdOrSlug);
      traceMarketplaceLifecycle("marketplace-distribution-context-query", "completed", {
        channelId: context.channel.channel.id,
        fallback: context.isFallback
      });
      return context;
    }
  });
}

export function useDistributionProfiles() {
  return useQuery({
    queryKey: ["marketplace-distribution-profiles"],
    queryFn: () => {
      const profiles = listDistributionProfiles();
      traceMarketplaceLifecycle("marketplace-distribution-profiles-query", "completed", { profileCount: profiles.length });
      return profiles;
    }
  });
}

export function useDistributionProfile(profileIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-distribution-profile", profileIdOrSlug],
    enabled: Boolean(profileIdOrSlug),
    queryFn: () => {
      const profile = getDistributionProfileById(profileIdOrSlug ?? "");
      if (!profile) {
        const error = new Error("Distribution Profile not found");
        instrumentMarketplaceError("marketplace-distribution-profile-query", error, { profileIdOrSlug: profileIdOrSlug ?? null });
        throw error;
      }
      traceMarketplaceLifecycle("marketplace-distribution-profile-query", "completed", { profileId: profile.profile.id });
      return profile;
    }
  });
}

export function useDistributionProfilesByType(profileType?: Parameters<typeof getDistributionProfilesByType>[0]) {
  return useQuery({
    queryKey: ["marketplace-distribution-profiles-by-type", profileType],
    enabled: Boolean(profileType),
    queryFn: () => {
      const profiles = getDistributionProfilesByType(profileType as Parameters<typeof getDistributionProfilesByType>[0]);
      traceMarketplaceLifecycle("marketplace-distribution-profiles-by-type-query", "completed", {
        profileType: profileType ?? null,
        profileCount: profiles.length
      });
      return profiles;
    }
  });
}

export function useDistributionProfileContext(profileIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-distribution-profile-context", profileIdOrSlug],
    queryFn: () => {
      const context = resolveDistributionProfileContext(profileIdOrSlug);
      traceMarketplaceLifecycle("marketplace-distribution-profile-context-query", "completed", {
        profileId: context.profile.profile.id,
        fallback: context.isFallback
      });
      return context;
    }
  });
}

export function useAttributionSources() {
  return useQuery({
    queryKey: ["marketplace-attribution-sources"],
    queryFn: () => {
      const sources = listAttributionSources();
      traceMarketplaceLifecycle("marketplace-attribution-sources-query", "completed", { sourceCount: sources.length });
      return sources;
    }
  });
}

export function useAttributionSource(sourceIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-attribution-source", sourceIdOrSlug],
    enabled: Boolean(sourceIdOrSlug),
    queryFn: () => {
      const source = getAttributionSourceById(sourceIdOrSlug ?? "");
      if (!source) {
        const error = new Error("Attribution Source not found");
        instrumentMarketplaceError("marketplace-attribution-source-query", error, { sourceIdOrSlug: sourceIdOrSlug ?? null });
        throw error;
      }
      traceMarketplaceLifecycle("marketplace-attribution-source-query", "completed", { sourceId: source.source.id });
      return source;
    }
  });
}

export function useAttributionSourcesByChannel(channelIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-attribution-sources-by-channel", channelIdOrSlug],
    enabled: Boolean(channelIdOrSlug),
    queryFn: () => {
      const sources = getAttributionSourcesByChannel(channelIdOrSlug ?? "");
      traceMarketplaceLifecycle("marketplace-attribution-sources-by-channel-query", "completed", {
        channelIdOrSlug: channelIdOrSlug ?? null,
        sourceCount: sources.length
      });
      return sources;
    }
  });
}

export function useAttributionSourcesByProfile(profileIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-attribution-sources-by-profile", profileIdOrSlug],
    enabled: Boolean(profileIdOrSlug),
    queryFn: () => {
      const sources = getAttributionSourcesByProfile(profileIdOrSlug ?? "");
      traceMarketplaceLifecycle("marketplace-attribution-sources-by-profile-query", "completed", {
        profileIdOrSlug: profileIdOrSlug ?? null,
        sourceCount: sources.length
      });
      return sources;
    }
  });
}

export function useAttributionContext(sourceIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-attribution-context", sourceIdOrSlug],
    queryFn: () => {
      const context = resolveAttributionContext(sourceIdOrSlug);
      traceMarketplaceLifecycle("marketplace-attribution-context-query", "completed", {
        sourceId: context.source.source.id,
        fallback: context.isFallback
      });
      return context;
    }
  });
}

export function useAttributionToSplitRules() {
  return useQuery({
    queryKey: ["marketplace-attribution-to-split-rules"],
    queryFn: () => {
      const rules = listAttributionToSplitRules();
      traceMarketplaceLifecycle("marketplace-attribution-to-split-rules-query", "completed", { ruleCount: rules.length });
      return rules;
    }
  });
}

export function useAttributionToSplitRulesBySource(sourceIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-attribution-to-split-rules-by-source", sourceIdOrSlug],
    enabled: Boolean(sourceIdOrSlug),
    queryFn: () => listAttributionToSplitRulesByAttributionSource(sourceIdOrSlug ?? "")
  });
}

export function useAttributionToSplitRulesByDistributionChannel(channelIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-attribution-to-split-rules-by-channel", channelIdOrSlug],
    enabled: Boolean(channelIdOrSlug),
    queryFn: () => listAttributionToSplitRulesByDistributionChannel(channelIdOrSlug ?? "")
  });
}

export function useAttributionToSplitRulesByDistributionProfile(profileIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-attribution-to-split-rules-by-profile", profileIdOrSlug],
    enabled: Boolean(profileIdOrSlug),
    queryFn: () => listAttributionToSplitRulesByDistributionProfile(profileIdOrSlug ?? "")
  });
}

export function useAttributionToSplitRulesByCommunityDistribution(distributionIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-attribution-to-split-rules-by-community", distributionIdOrSlug],
    enabled: Boolean(distributionIdOrSlug),
    queryFn: () => listAttributionToSplitRulesByCommunityDistribution(distributionIdOrSlug ?? "")
  });
}

export function useAttributionSplit(sourceIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-attribution-split-resolution", sourceIdOrSlug],
    enabled: Boolean(sourceIdOrSlug),
    queryFn: () => resolveAttributionSplit(sourceIdOrSlug ?? "")
  });
}

export function useAttributionSplitExplanation(sourceIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-attribution-split-explanation", sourceIdOrSlug],
    enabled: Boolean(sourceIdOrSlug),
    queryFn: () => explainAttributionToSplit(sourceIdOrSlug ?? "")
  });
}

export function useAttributionSplitMapping(sourceIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-attribution-split-mapping", sourceIdOrSlug],
    enabled: Boolean(sourceIdOrSlug),
    queryFn: () => getAttributionSplitMapping(sourceIdOrSlug ?? "")
  });
}

export function useCommercialOriginSplitMapping(commercialOriginId?: string) {
  return useQuery({
    queryKey: ["marketplace-commercial-origin-split-mapping", commercialOriginId],
    enabled: Boolean(commercialOriginId),
    queryFn: () => getCommercialOriginSplitMapping(commercialOriginId ?? "")
  });
}

export function useDistributionSourceSplitMapping(distributionSourceId?: string) {
  return useQuery({
    queryKey: ["marketplace-distribution-source-split-mapping", distributionSourceId],
    enabled: Boolean(distributionSourceId),
    queryFn: () => getDistributionSourceSplitMapping(distributionSourceId ?? "")
  });
}

export function useCommunityMarketplaceDistributions() {
  return useQuery({
    queryKey: ["marketplace-community-distributions"],
    queryFn: () => {
      const distributions = listCommunityMarketplaceDistributions();
      traceMarketplaceLifecycle("marketplace-community-distributions-query", "completed", { distributionCount: distributions.length });
      return distributions;
    }
  });
}

export function useCommunityMarketplaceDistribution(distributionIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-community-distribution", distributionIdOrSlug],
    enabled: Boolean(distributionIdOrSlug),
    queryFn: () => {
      const distribution = getCommunityMarketplaceDistributionById(distributionIdOrSlug ?? "");
      if (!distribution) {
        const error = new Error("Community Marketplace Distribution not found");
        instrumentMarketplaceError("marketplace-community-distribution-query", error, { distributionIdOrSlug: distributionIdOrSlug ?? null });
        throw error;
      }
      traceMarketplaceLifecycle("marketplace-community-distribution-query", "completed", { distributionId: distribution.distribution.id });
      return distribution;
    }
  });
}

export function useCommunityDistributionContext(distributionIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-community-distribution-context", distributionIdOrSlug],
    queryFn: () => {
      const context = resolveCommunityDistributionContext(distributionIdOrSlug);
      traceMarketplaceLifecycle("marketplace-community-distribution-context-query", "completed", {
        distributionId: context.distribution.distribution.id,
        fallback: context.isFallback
      });
      return context;
    }
  });
}

export function useCommunityDistributionItems(distributionIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-community-distribution-items", distributionIdOrSlug],
    enabled: Boolean(distributionIdOrSlug),
    queryFn: () => {
      const items = getCommunityDistributionItems(distributionIdOrSlug ?? "");
      traceMarketplaceLifecycle("marketplace-community-distribution-items-query", "completed", {
        distributionIdOrSlug: distributionIdOrSlug ?? null,
        itemCount: items.length
      });
      return items;
    }
  });
}

export function useTenantDistribution(tenantIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-tenant-distribution", tenantIdOrSlug],
    enabled: Boolean(tenantIdOrSlug),
    queryFn: () => {
      const distribution = resolveTenantDistribution(tenantIdOrSlug);
      traceMarketplaceLifecycle("marketplace-tenant-distribution-query", "completed", {
        tenantId: distribution.tenant.id,
        channelCount: distribution.channels.length
      });
      return distribution;
    }
  });
}

export function useCuratedCatalogDistribution(catalogIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-curated-catalog-distribution", catalogIdOrSlug],
    enabled: Boolean(catalogIdOrSlug),
    queryFn: () => {
      const distribution = resolveCuratedCatalogDistribution(catalogIdOrSlug ?? "");
      if (!distribution) {
        const error = new Error("Curated Catalog Distribution Config not found");
        instrumentMarketplaceError("marketplace-curated-catalog-distribution-query", error, { catalogIdOrSlug: catalogIdOrSlug ?? null });
        throw error;
      }
      traceMarketplaceLifecycle("marketplace-curated-catalog-distribution-query", "completed", {
        curatedCatalogId: distribution.catalog.catalog.id,
        channelCount: distribution.channels.length
      });
      return distribution;
    }
  });
}

export function useDistributionContextForTenant(tenantIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-distribution-context-for-tenant", tenantIdOrSlug],
    enabled: Boolean(tenantIdOrSlug),
    queryFn: () => {
      const context = getDistributionContextForTenant(tenantIdOrSlug);
      traceMarketplaceLifecycle("marketplace-distribution-context-for-tenant-query", "completed", {
        tenantId: context.tenantId ?? null,
        canTrack: context.canTrack
      });
      return context;
    }
  });
}

export function useDistributionContextForCuratedCatalog(catalogIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-distribution-context-for-curated-catalog", catalogIdOrSlug],
    enabled: Boolean(catalogIdOrSlug),
    queryFn: () => {
      const context = getDistributionContextForCuratedCatalog(catalogIdOrSlug ?? "");
      traceMarketplaceLifecycle("marketplace-distribution-context-for-curated-catalog-query", "completed", {
        curatedCatalogId: context.curatedCatalogId ?? null,
        canTrack: context.canTrack
      });
      return context;
    }
  });
}

export function useMarketplaceInsights() {
  return useQuery({
    queryKey: ["marketplace-intelligence-insights"],
    queryFn: () => {
      const insights = listMarketplaceInsights();
      traceMarketplaceLifecycle("marketplace-intelligence-insights-query", "completed", { insightCount: insights.length });
      return insights;
    }
  });
}

export function useMarketplaceInsight(insightIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-intelligence-insight", insightIdOrSlug],
    enabled: Boolean(insightIdOrSlug),
    queryFn: () => {
      const insight = getMarketplaceInsightById(insightIdOrSlug ?? "");
      if (!insight) {
        const error = new Error("Marketplace Insight not found");
        instrumentMarketplaceError("marketplace-intelligence-insight-query", error, { insightIdOrSlug: insightIdOrSlug ?? null });
        throw error;
      }
      traceMarketplaceLifecycle("marketplace-intelligence-insight-query", "completed", { insightId: insight.insight.id });
      return insight;
    }
  });
}

export function useInsightSignals(insightIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-intelligence-signals", insightIdOrSlug],
    enabled: Boolean(insightIdOrSlug),
    queryFn: () => listInsightSignalsByInsight(insightIdOrSlug ?? "")
  });
}

export function useAllInsightSignals() {
  return useQuery({
    queryKey: ["marketplace-intelligence-all-signals"],
    queryFn: () => listInsightSignals()
  });
}

export function useInsightSignal(signalIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-intelligence-signal", signalIdOrSlug],
    enabled: Boolean(signalIdOrSlug),
    queryFn: () => getInsightSignalById(signalIdOrSlug ?? "")
  });
}

export function useInsightSignalsByScope(scope?: Parameters<typeof listInsightSignalsByScope>[0], scopeId?: string) {
  return useQuery({
    queryKey: ["marketplace-intelligence-signals-by-scope", scope, scopeId],
    enabled: Boolean(scope),
    queryFn: () => listInsightSignalsByScope(scope as Parameters<typeof listInsightSignalsByScope>[0], scopeId)
  });
}

export function useIntelligenceSnapshots() {
  return useQuery({
    queryKey: ["marketplace-intelligence-snapshots"],
    queryFn: () => listIntelligenceSnapshots()
  });
}

export function useIntelligenceSnapshot(snapshotIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-intelligence-snapshot", snapshotIdOrSlug],
    enabled: Boolean(snapshotIdOrSlug),
    queryFn: () => getIntelligenceSnapshotById(snapshotIdOrSlug ?? "")
  });
}

export function useIntelligenceSnapshotsByScope(scope?: Parameters<typeof listIntelligenceSnapshotsByScope>[0], scopeId?: string) {
  return useQuery({
    queryKey: ["marketplace-intelligence-snapshots-by-scope", scope, scopeId],
    enabled: Boolean(scope),
    queryFn: () => listIntelligenceSnapshotsByScope(scope as Parameters<typeof listIntelligenceSnapshotsByScope>[0], scopeId)
  });
}

export function useMarketplaceIntelligenceSnapshot() {
  return useQuery({
    queryKey: ["marketplace-intelligence-snapshot-global"],
    queryFn: () => resolveMarketplaceIntelligenceSnapshot()
  });
}

export function useTenantIntelligenceSnapshot(tenantId?: string) {
  return useQuery({
    queryKey: ["marketplace-intelligence-snapshot-tenant", tenantId],
    enabled: Boolean(tenantId),
    queryFn: () => resolveTenantIntelligenceSnapshot(tenantId ?? "")
  });
}

export function useCatalogIntelligenceSnapshot(curatedCatalogId?: string) {
  return useQuery({
    queryKey: ["marketplace-intelligence-snapshot-catalog", curatedCatalogId],
    enabled: Boolean(curatedCatalogId),
    queryFn: () => resolveCatalogIntelligenceSnapshot(curatedCatalogId ?? "")
  });
}

export function useDistributionIntelligenceSnapshot(distributionId?: string) {
  return useQuery({
    queryKey: ["marketplace-intelligence-snapshot-distribution", distributionId],
    enabled: Boolean(distributionId),
    queryFn: () => resolveDistributionIntelligenceSnapshot(distributionId ?? "")
  });
}

export function useRevenueIntelligenceSnapshot(policyId?: string) {
  return useQuery({
    queryKey: ["marketplace-intelligence-snapshot-revenue", policyId],
    enabled: Boolean(policyId),
    queryFn: () => resolveRevenueIntelligenceSnapshot(policyId ?? "")
  });
}

export function useCommunityIntelligenceSnapshot(communityDistributionId?: string) {
  return useQuery({
    queryKey: ["marketplace-intelligence-snapshot-community", communityDistributionId],
    enabled: Boolean(communityDistributionId),
    queryFn: () => resolveCommunityIntelligenceSnapshot(communityDistributionId ?? "")
  });
}

export function useFederationIntelligenceSnapshot(collectionId?: string) {
  return useQuery({
    queryKey: ["marketplace-intelligence-snapshot-federation", collectionId],
    enabled: Boolean(collectionId),
    queryFn: () => resolveFederationIntelligenceSnapshot(collectionId ?? "")
  });
}

export function useMarketplaceIntelligencePanel() {
  return useQuery({
    queryKey: ["marketplace-intelligence-panel"],
    queryFn: () => resolveMarketplaceIntelligencePanel()
  });
}

export function useTenantIntelligencePanel(tenantId?: string) {
  return useQuery({
    queryKey: ["marketplace-intelligence-panel-tenant", tenantId],
    enabled: Boolean(tenantId),
    queryFn: () => resolveTenantIntelligencePanel(tenantId ?? "")
  });
}

export function useCatalogIntelligencePanel(curatedCatalogId?: string) {
  return useQuery({
    queryKey: ["marketplace-intelligence-panel-catalog", curatedCatalogId],
    enabled: Boolean(curatedCatalogId),
    queryFn: () => resolveCatalogIntelligencePanel(curatedCatalogId ?? "")
  });
}

export function useDistributionIntelligencePanel(distributionId?: string) {
  return useQuery({
    queryKey: ["marketplace-intelligence-panel-distribution", distributionId],
    enabled: Boolean(distributionId),
    queryFn: () => resolveDistributionIntelligencePanel(distributionId ?? "")
  });
}

export function useCommunityIntelligencePanel(communityDistributionId?: string) {
  return useQuery({
    queryKey: ["marketplace-intelligence-panel-community", communityDistributionId],
    enabled: Boolean(communityDistributionId),
    queryFn: () => resolveCommunityIntelligencePanel(communityDistributionId ?? "")
  });
}

export function useAttributionIntelligencePanel(attributionSourceIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-intelligence-panel-attribution", attributionSourceIdOrSlug],
    enabled: Boolean(attributionSourceIdOrSlug),
    queryFn: () => resolveAttributionIntelligencePanel(attributionSourceIdOrSlug ?? "")
  });
}

export function useRecommendationPreviews() {
  return useQuery({
    queryKey: ["marketplace-intelligence-recommendation-previews"],
    queryFn: () => listRecommendationPreviews()
  });
}

export function useRecommendationPreview(previewIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-intelligence-recommendation-preview", previewIdOrSlug],
    enabled: Boolean(previewIdOrSlug),
    queryFn: () => getRecommendationPreviewById(previewIdOrSlug ?? "")
  });
}

export function useRecommendationPreviewsByScope(scope?: Parameters<typeof listRecommendationPreviewsByScope>[0], scopeId?: string) {
  return useQuery({
    queryKey: ["marketplace-intelligence-recommendation-previews-by-scope", scope, scopeId],
    enabled: Boolean(scope),
    queryFn: () => listRecommendationPreviewsByScope(scope as Parameters<typeof listRecommendationPreviewsByScope>[0], scopeId)
  });
}

export function useRankingExplanations() {
  return useQuery({
    queryKey: ["marketplace-intelligence-ranking-explanations"],
    queryFn: () => listRankingExplanations()
  });
}

export function useRankingExplanation(explanationIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-intelligence-ranking-explanation", explanationIdOrSlug],
    enabled: Boolean(explanationIdOrSlug),
    queryFn: () => getRankingExplanationById(explanationIdOrSlug ?? "")
  });
}

export function useRankingExplanationsByScope(scope?: Parameters<typeof listRankingExplanationsByScope>[0], scopeId?: string) {
  return useQuery({
    queryKey: ["marketplace-intelligence-ranking-explanations-by-scope", scope, scopeId],
    enabled: Boolean(scope),
    queryFn: () => listRankingExplanationsByScope(scope as Parameters<typeof listRankingExplanationsByScope>[0], scopeId)
  });
}

export function useRecommendationRankingExplanation(previewIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-intelligence-recommendation-ranking-explanation", previewIdOrSlug],
    enabled: Boolean(previewIdOrSlug),
    queryFn: () => explainRecommendationRanking(previewIdOrSlug ?? "")
  });
}

export function useRecommendationPreviewValidation(previewIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-intelligence-recommendation-preview-validation", previewIdOrSlug],
    enabled: Boolean(previewIdOrSlug),
    queryFn: () => validateRecommendationPreviewMockOnly(previewIdOrSlug ?? "")
  });
}

export function useRevenueIntelligenceSummaries() {
  return useQuery({
    queryKey: ["marketplace-intelligence-revenue-summaries"],
    queryFn: () => listRevenueIntelligenceSummaries()
  });
}

export function useRevenueTrustRiskIntelligence(policyIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-intelligence-revenue-trust-risk", policyIdOrSlug],
    enabled: Boolean(policyIdOrSlug),
    queryFn: () => resolveRevenueTrustRiskIntelligence(policyIdOrSlug ?? "")
  });
}

export function useRevenueIntelligenceSummary(policyIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-intelligence-revenue-summary", policyIdOrSlug],
    enabled: Boolean(policyIdOrSlug),
    queryFn: () => getRevenueIntelligenceSummaryByPolicy(policyIdOrSlug ?? "")
  });
}

export function useRevenuePreviewInsight(policyIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-intelligence-revenue-preview-insight", policyIdOrSlug],
    enabled: Boolean(policyIdOrSlug),
    queryFn: () => getRevenuePreviewInsightByPolicy(policyIdOrSlug ?? "")
  });
}

export function useSettlementBoundaryInsight(policyIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-intelligence-settlement-boundary-insight", policyIdOrSlug],
    enabled: Boolean(policyIdOrSlug),
    queryFn: () => getSettlementBoundaryInsightByPolicy(policyIdOrSlug ?? "")
  });
}

export function useRiskTrustInsights() {
  return useQuery({
    queryKey: ["marketplace-intelligence-risk-trust-insights"],
    queryFn: () => listRiskTrustInsights()
  });
}

export function useRiskTrustInsight(insightIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-intelligence-risk-trust-insight", insightIdOrSlug],
    enabled: Boolean(insightIdOrSlug),
    queryFn: () => getRiskTrustInsightById(insightIdOrSlug ?? "")
  });
}

export function useRiskTrustInsightsByScope(scope?: Parameters<typeof listRiskTrustInsightsByScope>[0], scopeId?: string) {
  return useQuery({
    queryKey: ["marketplace-intelligence-risk-trust-insights-by-scope", scope, scopeId],
    enabled: Boolean(scope),
    queryFn: () => listRiskTrustInsightsByScope(scope as Parameters<typeof listRiskTrustInsightsByScope>[0], scopeId)
  });
}

export function useRiskTrustInsightsByRevenuePolicy(policyIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-intelligence-risk-trust-by-revenue-policy", policyIdOrSlug],
    enabled: Boolean(policyIdOrSlug),
    queryFn: () => getRiskTrustInsightsByRevenuePolicy(policyIdOrSlug ?? "")
  });
}

export function useRiskTrustInsightsByDistributionAttribution(attributionSourceIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-intelligence-risk-trust-by-attribution", attributionSourceIdOrSlug],
    enabled: Boolean(attributionSourceIdOrSlug),
    queryFn: () => getRiskTrustInsightsByDistributionAttribution(attributionSourceIdOrSlug ?? "")
  });
}

export function useFederationIntelligenceContext(collectionIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-intelligence-federation-context", collectionIdOrSlug],
    enabled: Boolean(collectionIdOrSlug),
    queryFn: () => resolveFederationIntelligenceContext(collectionIdOrSlug ?? "")
  });
}

export function useRiskTrustContext(scope?: Parameters<typeof resolveRiskTrustContext>[0], scopeId?: string) {
  return useQuery({
    queryKey: ["marketplace-intelligence-risk-trust-context", scope, scopeId],
    enabled: Boolean(scope && scopeId),
    queryFn: () => resolveRiskTrustContext(scope as Parameters<typeof resolveRiskTrustContext>[0], scopeId ?? "")
  });
}

export function useRevenuePreviewInsightValidation(policyIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-intelligence-revenue-preview-insight-validation", policyIdOrSlug],
    enabled: Boolean(policyIdOrSlug),
    queryFn: () => validateRevenuePreviewInsightMockOnly(policyIdOrSlug ?? "")
  });
}

export function useRiskTrustInsightValidation(insightIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-intelligence-risk-trust-insight-validation", insightIdOrSlug],
    enabled: Boolean(insightIdOrSlug),
    queryFn: () => validateRiskTrustInsightMockOnly(insightIdOrSlug ?? "")
  });
}

export function useDataBoundary(scopeOrBoundaryId?: string, scopeId?: string) {
  return useQuery({
    queryKey: ["marketplace-intelligence-data-boundary", scopeOrBoundaryId, scopeId],
    enabled: Boolean(scopeOrBoundaryId),
    queryFn: () => resolveDataBoundary(scopeOrBoundaryId ?? "", scopeId)
  });
}

export function useMarketplaceInsightValidation(insightIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-intelligence-validation", insightIdOrSlug],
    enabled: Boolean(insightIdOrSlug),
    queryFn: () => validateMarketplaceInsightMockOnly(insightIdOrSlug ?? "")
  });
}

export function useIntelligenceSnapshotValidation(snapshotIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-intelligence-snapshot-validation", snapshotIdOrSlug],
    enabled: Boolean(snapshotIdOrSlug),
    queryFn: () => validateIntelligenceSnapshotMockOnly(snapshotIdOrSlug ?? "")
  });
}

export function useAcademyDistributionOverview() {
  return useQuery({
    queryKey: ["marketplace-academy-distribution-overview"],
    queryFn: () => {
      const overview = resolveAcademyDistributionOverview();
      traceMarketplaceLifecycle("marketplace-academy-distribution-overview-query", "completed", {
        courseCount: overview.courses.length,
        certificationCount: overview.certifications.length,
        subscriptionCount: overview.subscriptions.length
      });
      return overview;
    }
  });
}

export function useAcademyCourses() {
  return useQuery({
    queryKey: ["marketplace-academy-courses"],
    queryFn: () => listAcademyCourses()
  });
}

export function useAcademyCourse(courseIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-academy-course", courseIdOrSlug],
    enabled: Boolean(courseIdOrSlug),
    queryFn: () => getAcademyCourseById(courseIdOrSlug ?? "")
  });
}

export function useAcademyCertifications() {
  return useQuery({
    queryKey: ["marketplace-academy-certifications"],
    queryFn: () => listAcademyCertifications()
  });
}

export function useAcademyCertification(certificationIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-academy-certification", certificationIdOrSlug],
    enabled: Boolean(certificationIdOrSlug),
    queryFn: () => getAcademyCertificationById(certificationIdOrSlug ?? "")
  });
}

export function useAcademyLearningSubscriptions() {
  return useQuery({
    queryKey: ["marketplace-academy-learning-subscriptions"],
    queryFn: () => listAcademyLearningSubscriptions()
  });
}

export function useAcademyLearningSubscription(subscriptionIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-academy-learning-subscription", subscriptionIdOrSlug],
    enabled: Boolean(subscriptionIdOrSlug),
    queryFn: () => getAcademyLearningSubscriptionById(subscriptionIdOrSlug ?? "")
  });
}

export function useAcademyDistributionContext(targetId?: string) {
  return useQuery({
    queryKey: ["marketplace-academy-distribution-context", targetId],
    enabled: Boolean(targetId),
    queryFn: () => resolveAcademyDistributionContext(targetId ?? "")
  });
}

export function useAcademyDistributionValidation(targetId?: string) {
  return useQuery({
    queryKey: ["marketplace-academy-distribution-validation", targetId],
    queryFn: () => validateAcademyDistributionMockOnly(targetId)
  });
}

export function useACSDistributionOverview() {
  return useQuery({
    queryKey: ["marketplace-acs-distribution-overview"],
    queryFn: () => {
      const overview = resolveACSDistributionOverview();
      traceMarketplaceLifecycle("marketplace-acs-distribution-overview-query", "completed", {
        agentCount: overview.agents.length,
        mcpPackageCount: overview.mcpPackages.length,
        workflowSystemCount: overview.workflowSystems.length,
        computeAccessCount: overview.computeAccess.length
      });
      return overview;
    }
  });
}

export function useAIAgent(agentIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-acs-ai-agent", agentIdOrSlug],
    enabled: Boolean(agentIdOrSlug),
    queryFn: () => getAIAgentById(agentIdOrSlug ?? "")
  });
}

export function useMCPPackage(packageIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-acs-mcp-package", packageIdOrSlug],
    enabled: Boolean(packageIdOrSlug),
    queryFn: () => getMCPPackageById(packageIdOrSlug ?? "")
  });
}

export function useWorkflowSystem(systemIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-acs-workflow-system", systemIdOrSlug],
    enabled: Boolean(systemIdOrSlug),
    queryFn: () => getWorkflowSystemById(systemIdOrSlug ?? "")
  });
}

export function useComputeAccess(computeAccessIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-acs-compute-access", computeAccessIdOrSlug],
    enabled: Boolean(computeAccessIdOrSlug),
    queryFn: () => getComputeAccessById(computeAccessIdOrSlug ?? "")
  });
}

export function useACSDistributionContext(targetId?: string) {
  return useQuery({
    queryKey: ["marketplace-acs-distribution-context", targetId],
    enabled: Boolean(targetId),
    queryFn: () => resolveACSDistributionContext(targetId ?? "")
  });
}

export function useACSDistributionValidation(targetId?: string) {
  return useQuery({
    queryKey: ["marketplace-acs-distribution-validation", targetId],
    queryFn: () => validateACSDistributionMockOnly(targetId)
  });
}

export function useRevenueSharingPolicies() {
  return useQuery({
    queryKey: ["marketplace-revenue-sharing-policies"],
    queryFn: () => {
      const policies = listRevenueSharingPolicies();
      traceMarketplaceLifecycle("marketplace-revenue-sharing-policies-query", "completed", { policyCount: policies.length });
      return policies;
    }
  });
}

export function useRevenueSharingPolicy(policyIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-revenue-sharing-policy", policyIdOrSlug],
    enabled: Boolean(policyIdOrSlug),
    queryFn: () => {
      const policy = getRevenueSharingPolicyById(policyIdOrSlug ?? "");
      if (!policy) {
        const error = new Error("Revenue Sharing Policy not found");
        instrumentMarketplaceError("marketplace-revenue-sharing-policy-query", error, { policyIdOrSlug: policyIdOrSlug ?? null });
        throw error;
      }
      traceMarketplaceLifecycle("marketplace-revenue-sharing-policy-query", "completed", { policyId: policy.policy.id });
      return policy;
    }
  });
}

export function useRevenueSharingPoliciesByTenant(tenantIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-revenue-sharing-policies-by-tenant", tenantIdOrSlug],
    enabled: Boolean(tenantIdOrSlug),
    queryFn: () => getRevenueSharingPoliciesByTenant(tenantIdOrSlug ?? "")
  });
}

export function useRevenueSharingPoliciesByDistributionChannel(channelIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-revenue-sharing-policies-by-channel", channelIdOrSlug],
    enabled: Boolean(channelIdOrSlug),
    queryFn: () => getRevenueSharingPoliciesByDistributionChannel(channelIdOrSlug ?? "")
  });
}

export function useRevenueSharingPoliciesByCuratedCatalog(catalogIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-revenue-sharing-policies-by-catalog", catalogIdOrSlug],
    enabled: Boolean(catalogIdOrSlug),
    queryFn: () => getRevenueSharingPoliciesByCuratedCatalog(catalogIdOrSlug ?? "")
  });
}

export function useRevenueSharingParticipants(policyIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-revenue-sharing-participants", policyIdOrSlug],
    enabled: Boolean(policyIdOrSlug),
    queryFn: () => listRevenueParticipantsByPolicy(policyIdOrSlug ?? "")
  });
}

export function useRevenueSharingSplitRules(policyIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-revenue-sharing-split-rules", policyIdOrSlug],
    enabled: Boolean(policyIdOrSlug),
    queryFn: () => listRevenueSplitRulesByPolicy(policyIdOrSlug ?? "")
  });
}

export function useRevenueSharingParticipantShares(policyIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-revenue-sharing-participant-shares", policyIdOrSlug],
    enabled: Boolean(policyIdOrSlug),
    queryFn: () => listParticipantSharesByPolicy(policyIdOrSlug ?? "")
  });
}

export function useRevenueSharingPreviews() {
  return useQuery({
    queryKey: ["marketplace-revenue-sharing-previews"],
    queryFn: () => {
      const previews = listRevenueSharingPreviews();
      traceMarketplaceLifecycle("marketplace-revenue-sharing-previews-query", "completed", { previewCount: previews.length });
      return previews;
    }
  });
}

export function useRevenueSharingPreview(policyIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-revenue-sharing-preview", policyIdOrSlug],
    enabled: Boolean(policyIdOrSlug),
    queryFn: () => resolveRevenueSharingPreview(policyIdOrSlug ?? "")
  });
}

export function useRevenueSharingAuditEntries(policyIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-revenue-sharing-audit-entries", policyIdOrSlug],
    enabled: Boolean(policyIdOrSlug),
    queryFn: () => listRevenueSharingAuditEntriesByPolicy(policyIdOrSlug ?? "")
  });
}

export function useParticipantSplitExplanation(policyIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-revenue-sharing-participant-split-explanation", policyIdOrSlug],
    enabled: Boolean(policyIdOrSlug),
    queryFn: () => explainParticipantSplitsByPolicy(policyIdOrSlug ?? "")
  });
}

export function useRevenueSharingRuleApplication(policyIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-revenue-sharing-rule-application", policyIdOrSlug],
    enabled: Boolean(policyIdOrSlug),
    queryFn: () => explainRevenueSharingRuleApplication(policyIdOrSlug ?? "")
  });
}

export function useRevenueSharingPreviewConflicts(policyIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-revenue-sharing-preview-conflicts", policyIdOrSlug],
    enabled: Boolean(policyIdOrSlug),
    queryFn: () => listRevenueSharingPreviewConflicts(policyIdOrSlug ?? "")
  });
}

export function usePayoutPreviewMock(policyIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-revenue-sharing-payout-preview-mock", policyIdOrSlug],
    enabled: Boolean(policyIdOrSlug),
    queryFn: () => resolvePayoutPreviewMock(policyIdOrSlug ?? "")
  });
}

export function useSettlementPreviewMock(policyIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-revenue-sharing-settlement-preview-mock", policyIdOrSlug],
    enabled: Boolean(policyIdOrSlug),
    queryFn: () => resolveSettlementPreviewMock(policyIdOrSlug ?? "")
  });
}

export function useTenantRevenueSharing(tenantIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-tenant-revenue-sharing", tenantIdOrSlug],
    enabled: Boolean(tenantIdOrSlug),
    queryFn: () => resolveTenantRevenueSharing(tenantIdOrSlug ?? "")
  });
}

export function useDistributionChannelRevenueSharing(channelIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-distribution-channel-revenue-sharing", channelIdOrSlug],
    enabled: Boolean(channelIdOrSlug),
    queryFn: () => resolveDistributionChannelRevenueSharing(channelIdOrSlug ?? "")
  });
}

export function useDistributionProfileRevenueSharing(profileIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-distribution-profile-revenue-sharing", profileIdOrSlug],
    enabled: Boolean(profileIdOrSlug),
    queryFn: () => resolveDistributionProfileRevenueSharing(profileIdOrSlug ?? "")
  });
}

export function useCuratedCatalogRevenueSharing(catalogIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-curated-catalog-revenue-sharing", catalogIdOrSlug],
    enabled: Boolean(catalogIdOrSlug),
    queryFn: () => resolveCuratedCatalogRevenueSharing(catalogIdOrSlug ?? "")
  });
}

export function useCommunityRevenueSharing(distributionIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-community-revenue-sharing", distributionIdOrSlug],
    enabled: Boolean(distributionIdOrSlug),
    queryFn: () => resolveCommunityRevenueSharing(distributionIdOrSlug ?? "")
  });
}

export function useCommissionModels() {
  return useQuery({
    queryKey: ["marketplace-commission-models"],
    queryFn: () => {
      const models = listCommissionModels();
      traceMarketplaceLifecycle("marketplace-commission-models-query", "completed", { modelCount: models.length });
      return models;
    }
  });
}

export function useCommissionModel(modelIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-commission-model", modelIdOrSlug],
    enabled: Boolean(modelIdOrSlug),
    queryFn: () => {
      const model = getCommissionModelById(modelIdOrSlug ?? "");
      if (!model) {
        const error = new Error("Commission Model not found");
        instrumentMarketplaceError("marketplace-commission-model-query", error, { modelIdOrSlug: modelIdOrSlug ?? null });
        throw error;
      }
      traceMarketplaceLifecycle("marketplace-commission-model-query", "completed", { commissionModelId: model.model.id });
      return model;
    }
  });
}

export function useCommissionModelsByPolicy(policyIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-commission-models-by-policy", policyIdOrSlug],
    enabled: Boolean(policyIdOrSlug),
    queryFn: () => listCommissionModelsByPolicy(policyIdOrSlug ?? "")
  });
}

export function useCommissionModelParticipantShares(modelIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-commission-model-participant-shares", modelIdOrSlug],
    enabled: Boolean(modelIdOrSlug),
    queryFn: () => listParticipantSharesByCommissionModel(modelIdOrSlug ?? "")
  });
}

export function useCommissionModelValidation(modelIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-commission-model-validation", modelIdOrSlug],
    enabled: Boolean(modelIdOrSlug),
    queryFn: () => validateParticipantSharesByCommissionModel(modelIdOrSlug ?? "")
  });
}

export function useCommissionModelShareTotalMock(modelIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-commission-model-share-total-mock", modelIdOrSlug],
    enabled: Boolean(modelIdOrSlug),
    queryFn: () => calculateCommissionModelShareTotalMock(modelIdOrSlug ?? "")
  });
}

export function useParticipantShareConflicts(modelIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-participant-share-conflicts", modelIdOrSlug],
    enabled: Boolean(modelIdOrSlug),
    queryFn: () => detectParticipantShareConflicts(modelIdOrSlug ?? "")
  });
}

export function useSettlementBoundary(policyIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-revenue-sharing-settlement-boundary", policyIdOrSlug],
    enabled: Boolean(policyIdOrSlug),
    queryFn: () => resolveSettlementBoundary(policyIdOrSlug ?? "")
  });
}

export function useRevenueSharingBoundary(policyIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-revenue-sharing-boundary", policyIdOrSlug],
    enabled: Boolean(policyIdOrSlug),
    queryFn: () => explainRevenueSharingBoundary(policyIdOrSlug ?? "")
  });
}

export function useCollection(slug?: string) {
  return useQuery({
    queryKey: ["marketplace-collection", slug],
    enabled: Boolean(slug),
    queryFn: () => {
      const collection = getCollectionBySlug(slug ?? "");
      if (!collection) {
        const error = new Error("Collection not found");
        instrumentMarketplaceError("marketplace-collection-query", error, { slug: slug ?? null });
        throw error;
      }
      traceMarketplaceLifecycle("marketplace-collection-query", "completed", { collectionId: collection.collection.id });
      return collection;
    }
  });
}

export function useWalletDiscovery(walletAddress?: string) {
  return useQuery({
    queryKey: ["marketplace-wallet-discovery", walletAddress],
    queryFn: () => {
      const discovery = discoverWalletAssets(walletAddress);
      traceMarketplaceLifecycle("marketplace-wallet-discovery-query", "completed", {
        walletAddress: discovery.walletAddress || null,
        status: discovery.status,
        discoveredAssets: discovery.summary.total
      });
      return discovery;
    }
  });
}

export function useFederationProviders() {
  return useQuery({
    queryKey: ["marketplace-federation-providers"],
    queryFn: () => {
      const providers = listFederationProviders();
      traceMarketplaceLifecycle("marketplace-federation-providers-query", "completed", { providerCount: providers.length });
      return providers;
    }
  });
}

export function useFederationProvider(providerId?: string) {
  return useQuery({
    queryKey: ["marketplace-federation-provider", providerId],
    enabled: Boolean(providerId),
    queryFn: () => {
      const provider = getFederationProviderById(providerId ?? "");
      if (!provider) {
        const error = new Error("Federation Provider not found");
        instrumentMarketplaceError("marketplace-federation-provider-query", error, { providerId: providerId ?? null });
        throw error;
      }
      traceMarketplaceLifecycle("marketplace-federation-provider-query", "completed", { providerId: provider.provider.id });
      return provider;
    }
  });
}

export function useExternalContracts() {
  return useQuery({
    queryKey: ["marketplace-external-contracts"],
    queryFn: () => {
      const contracts = listExternalContracts();
      traceMarketplaceLifecycle("marketplace-external-contracts-query", "completed", { contractCount: contracts.length });
      return contracts;
    }
  });
}

export function useExternalContract(contractId?: string) {
  return useQuery({
    queryKey: ["marketplace-external-contract", contractId],
    enabled: Boolean(contractId),
    queryFn: () => {
      const contract = getExternalContractById(contractId ?? "");
      if (!contract) {
        const error = new Error("External Contract not found");
        instrumentMarketplaceError("marketplace-external-contract-query", error, { contractId: contractId ?? null });
        throw error;
      }
      traceMarketplaceLifecycle("marketplace-external-contract-query", "completed", { contractId: contract.id });
      return contract;
    }
  });
}

export function useTenants() {
  return useQuery({
    queryKey: ["marketplace-tenants"],
    queryFn: () => {
      const tenants = listTenants();
      traceMarketplaceLifecycle("marketplace-tenants-query", "completed", { tenantCount: tenants.length });
      return tenants;
    }
  });
}

export function useTenant(tenantIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-tenant", tenantIdOrSlug],
    queryFn: () => {
      const context = resolveTenantContext(tenantIdOrSlug);
      traceMarketplaceLifecycle("marketplace-tenant-query", "completed", {
        tenantId: context.tenant.id,
        tenantSlug: context.tenant.slug,
        fallbackGlobal: !tenantIdOrSlug || context.isGlobalMarketplace
      });
      return context;
    }
  });
}

export function useTenantContext(tenantIdOrSlug?: string) {
  return useTenant(tenantIdOrSlug);
}

export function useTenantDomains(tenantIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-tenant-domains", tenantIdOrSlug],
    queryFn: () => {
      const domains = tenantIdOrSlug ? getTenantDomains(tenantIdOrSlug) : [];
      traceMarketplaceLifecycle("marketplace-tenant-domains-query", "completed", {
        tenantIdOrSlug: tenantIdOrSlug ?? null,
        domainCount: domains.length
      });
      return domains;
    }
  });
}

export function useTenantRoutingContext(input?: string) {
  return useQuery({
    queryKey: ["marketplace-tenant-routing-context", input],
    queryFn: () => {
      const context = resolveTenantRoutingContext(input);
      traceMarketplaceLifecycle("marketplace-tenant-routing-query", "completed", {
        input: input ?? null,
        tenantId: context.tenant.id,
        resolutionStatus: context.resolution.resolutionStatus,
        fallback: context.resolution.isFallback
      });
      return context;
    }
  });
}

export function useResolvedTenant(input?: string) {
  return useTenantRoutingContext(input);
}

export function useTenantCatalog(tenantIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-tenant-catalog", tenantIdOrSlug],
    queryFn: () => {
      const catalog = resolveTenantCatalog(tenantIdOrSlug);
      traceMarketplaceLifecycle("marketplace-tenant-catalog-query", "completed", {
        tenantId: catalog.tenant.id,
        catalogStatus: catalog.catalog.status,
        includedProducts: catalog.resolution.includedProductIds.length
      });
      return catalog;
    }
  });
}

export function useTenantCatalogResolution(tenantIdOrSlug?: string) {
  return useTenantCatalog(tenantIdOrSlug);
}

export function useTenantCuratedCatalogs(tenantIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-tenant-curated-catalogs", tenantIdOrSlug],
    queryFn: () => {
      const curated = resolveTenantCuratedCatalogs(tenantIdOrSlug);
      traceMarketplaceLifecycle("marketplace-tenant-curated-catalogs-query", "completed", {
        tenantId: curated.tenant.id,
        includedCatalogs: curated.resolution.includedCatalogIds.length,
        excludedCatalogs: curated.resolution.excludedCatalogIds.length
      });
      return curated;
    }
  });
}

export function useTenantVisibleProducts(tenantIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-tenant-visible-products", tenantIdOrSlug],
    queryFn: () => {
      const products = getTenantVisibleProducts(tenantIdOrSlug);
      traceMarketplaceLifecycle("marketplace-tenant-visible-products-query", "completed", {
        tenantIdOrSlug: tenantIdOrSlug ?? null,
        productCount: products.length
      });
      return products;
    }
  });
}

export function useTenantVisibleCollections(tenantIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-tenant-visible-collections", tenantIdOrSlug],
    queryFn: () => {
      const collections = getTenantVisibleCollections(tenantIdOrSlug);
      traceMarketplaceLifecycle("marketplace-tenant-visible-collections-query", "completed", {
        tenantIdOrSlug: tenantIdOrSlug ?? null,
        collectionCount: collections.length
      });
      return collections;
    }
  });
}

export function useTenantBranding(tenantIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-tenant-branding", tenantIdOrSlug],
    queryFn: () => {
      const branding = resolveTenantBranding(tenantIdOrSlug);
      traceMarketplaceLifecycle("marketplace-tenant-branding-query", "completed", {
        tenantId: branding.tenant.id,
        brandStatus: branding.branding.brandStatus,
        fallback: branding.usesGlobalBrandingFallback
      });
      return branding;
    }
  });
}

export function useTenantTheme(tenantIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-tenant-theme", tenantIdOrSlug],
    queryFn: () => {
      const theme = resolveTenantTheme(tenantIdOrSlug);
      traceMarketplaceLifecycle("marketplace-tenant-theme-query", "completed", {
        themeId: theme.themeId,
        themeMode: theme.themeMode
      });
      return theme;
    }
  });
}

export function useProduct(slug?: string) {
  return useQuery({
    queryKey: ["marketplace-product", slug],
    enabled: Boolean(slug),
    queryFn: async () => {
      const product = await apiClient.getProduct(slug ?? "");
      if (!product) {
        const error = new Error("Product not found");
        instrumentMarketplaceError("marketplace-product-query", error, { slug: slug ?? null });
        throw error;
      }
      traceMarketplaceLifecycle("marketplace-product-query", "completed", { productId: product.id });
      const [authority, enforcement] = await Promise.all([
        apiClient.getGovernanceAuthority(product.id),
        apiClient.getGovernanceEnforcement(product.id)
      ]);
      return { product, seller: getSellerById(product.sellerId), authority, enforcement };
    }
  });
}

export function useProductByItemRef(chain?: string, contract?: string, tokenId?: string) {
  return useQuery({
    queryKey: ["marketplace-item-ref", chain, contract, tokenId],
    enabled: Boolean(chain && contract && tokenId),
    queryFn: () => {
      const product = getProductByItemRef(chain ?? "", contract ?? "", tokenId ?? "");
      if (!product) {
        const error = new Error("Item not found");
        instrumentMarketplaceError("marketplace-item-ref-query", error, { chain: chain ?? null, contract: contract ?? null, tokenId: tokenId ?? null });
        throw error;
      }
      return { product, seller: getSellerById(product.sellerId) };
    }
  });
}

export function useSeller(sellerId?: string) {
  return useQuery({
    queryKey: ["marketplace-seller", sellerId],
    enabled: Boolean(sellerId),
    queryFn: async () => {
      const sellers = await apiClient.listSellers();
      const seller = sellers.find((item) => item.id === sellerId);
      if (!seller) {
        const error = new Error("Seller not found");
        instrumentMarketplaceError("marketplace-seller-query", error, { sellerId: sellerId ?? null });
        throw error;
      }
      const [products, authority, enforcement, governanceEnforcement] = await Promise.all([
        apiClient.listProducts(),
        apiClient.getGovernanceAuthority(seller.id),
        apiClient.getGovernanceEnforcement(seller.id),
        apiClient.getGovernanceEnforcementSnapshot()
      ]);
      return {
        ...buildSellerProfileView(seller, products),
        authority,
        enforcement,
        governanceEnforcement
      };
    }
  });
}

export function useLicenses() {
  return useQuery({
    queryKey: ["marketplace-licenses"],
    queryFn: async () => {
      traceMarketplaceLifecycle("marketplace-license-query", "started");
      const [licenses, products, licenseRuntimes, subscriptions] = await Promise.all([
        apiClient.listLicenses(),
        apiClient.listProducts(),
        apiClient.listLicenseRuntimes(),
        apiClient.listSubscriptions()
      ]);
      return { licenses, products, licenseRuntimes, subscriptions };
    }
  });
}

export function useEntitlements(holder = "0xMockBuyer...A11C") {
  return useQuery({
    queryKey: ["marketplace-entitlements", holder],
    queryFn: async () => {
      traceMarketplaceLifecycle("marketplace-entitlement-query", "started", { holder });
      const [snapshot, products, licenseRuntimes, subscriptions] = await Promise.all([
        apiClient.getEntitlementSnapshot(holder),
        apiClient.listProducts(),
        apiClient.listLicenseRuntimes(),
        apiClient.listSubscriptions()
      ]);
      const [governanceAuthority, governanceEnforcement] = await Promise.all([
        apiClient.getGovernanceAuthoritySnapshot(),
        apiClient.getGovernanceEnforcementSnapshot()
      ]);
      return {
        snapshot,
        products,
        governanceAuthority,
        governanceEnforcement,
        licenseRuntimes: licenseRuntimes.filter((license) => license.holder === holder),
        subscriptions: subscriptions.filter((subscription) => subscription.holder === holder)
      };
    }
  });
}

export function useBillingRuntime() {
  return useQuery({
    queryKey: ["marketplace-billing-runtime"],
    queryFn: async () => {
      traceMarketplaceLifecycle("marketplace-billing-runtime-query", "started");
      const [invoices, telemetry, products] = await Promise.all([
        apiClient.listInvoices(),
        apiClient.listAccountingTelemetry(),
        apiClient.listProducts()
      ]);
      const [governanceAuthority, governanceEnforcement] = await Promise.all([
        apiClient.getGovernanceAuthoritySnapshot(),
        apiClient.getGovernanceEnforcementSnapshot()
      ]);
      return { invoices, telemetry, products, governanceAuthority, governanceEnforcement };
    }
  });
}

export function useOperationalTraceability() {
  return useQuery({
    queryKey: ["marketplace-operational-traceability"],
    queryFn: async () => {
      traceMarketplaceLifecycle("marketplace-traceability-query", "started");
      const [auditLogs, events, reconciliation, indexer, telemetry] = await Promise.all([
        apiClient.listAuditLogs(),
        apiClient.listRuntimeEvents(),
        apiClient.createReconciliationSnapshot(),
        apiClient.createIndexerSnapshot(),
        apiClient.listAccountingTelemetry()
      ]);
      return { auditLogs, events, reconciliation, indexer, telemetry };
    }
  });
}

export function useGovernanceOperatorConsole() {
  return useQuery({
    queryKey: ["marketplace-governance-operator-console"],
    queryFn: async () => {
      traceMarketplaceLifecycle("marketplace-governance-operator-console-query", "started");
      const [observability, workflow, federation] = await Promise.all([
        apiClient.getGovernanceObservability(),
        apiClient.getGovernanceWorkflow(),
        apiClient.getDAOFederationRuntime()
      ]);
      return { observability, workflow, federation };
    }
  });
}

export function useTenantStorefront(tenantIdOrSlug?: string) {
  return useQuery({
    queryKey: ["marketplace-tenant-storefront", tenantIdOrSlug],
    enabled: Boolean(tenantIdOrSlug),
    queryFn: async () => {
      const storefront = await apiClient.getTenantStorefront(tenantIdOrSlug ?? "");
      if (!storefront) {
        const error = new Error("Tenant storefront not found");
        instrumentMarketplaceError("marketplace-tenant-storefront-query", error, { tenantIdOrSlug: tenantIdOrSlug ?? null });
        throw error;
      }
      const [products, sellers, tenantRegistry, productRegistry, daoFederation] = await Promise.all([
        apiClient.listProducts(),
        apiClient.listSellers(),
        apiClient.listTenantRegistry(),
        apiClient.listProductRegistry(),
        apiClient.getDAOFederationRuntime()
      ]);
      const [authority, enforcement, governanceEnforcement] = await Promise.all([
        apiClient.getGovernanceAuthority(storefront.ownerId),
        apiClient.getGovernanceEnforcement(storefront.ownerId),
        apiClient.getGovernanceEnforcementSnapshot()
      ]);
      return {
        storefront,
        products: products.filter((product) => storefront.productIds.includes(product.id)),
        sellers: sellers.filter((seller) => storefront.sellerIds.includes(seller.id)),
        tenant: tenantRegistry.find((tenant) => tenant.tenantId === storefront.ownerId || tenant.storefrontOwnership.slug === storefront.slug),
        authority,
        enforcement,
        governanceEnforcement,
        daoFederation,
        storefrontRuntime: daoFederation.storefronts.find((record) => record.tenantId === storefront.ownerId),
        tenantRuntime: daoFederation.tenantIsolation.find((record) => record.tenantId === storefront.ownerId),
        constitutionalInheritance: daoFederation.constitutionalInheritance.find((record) => record.tenantId === storefront.ownerId),
        productRegistry: productRegistry.filter((record) => storefront.productIds.includes(record.productId))
      };
    }
  });
}

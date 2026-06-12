import type { DraftListingInput, Product } from "../types/marketplace";
import { createDraftListingPreview, issueMockPurchase } from "./marketplaceService";
import { createSignedUrlPreview, getDeliveryRuntime } from "./deliveryRuntime";
import { traceAdapterCall } from "./runtimeTelemetry";

export const MarketplaceContractAdapter = {
  async buyNow(product: Product) {
    traceAdapterCall("MarketplaceContractAdapter.buyNow", "started", { productId: product.id, settlementEnabled: false });
    return {
      mode: "mock-contract-call",
      action: "buyNow",
      tokenStandard: product.tokenStandard,
      listingType: product.listingType,
      txPreview: `mock-tx:${product.id}:buy-now`,
      purchase: issueMockPurchase(product)
    };
  },
  async placeBid(product: Product, amount: number) {
    traceAdapterCall("MarketplaceContractAdapter.placeBid", "started", { productId: product.id, amount, settlementEnabled: false });
    return {
      mode: "mock-contract-call",
      action: "placeBid",
      amount,
      auctionType: product.auction?.type,
      txPreview: `mock-tx:${product.id}:bid:${amount}`
    };
  },
  async createListing(product: Product) {
    traceAdapterCall("MarketplaceContractAdapter.createListing", "started", { productId: product.id, contractWriteEnabled: false });
    return {
      mode: "mock-contract-call",
      action: "createListing",
      tokenStandard: product.tokenStandard,
      txPreview: `mock-tx:${product.id}:create-listing`
    };
  },
  async createDraftListing(input: DraftListingInput) {
    traceAdapterCall("MarketplaceContractAdapter.createDraftListing", "started", { listingType: input.listingType, contractWriteEnabled: false });
    return {
      mode: "mock-contract-call",
      action: "createListing",
      preview: createDraftListingPreview(input)
    };
  }
};

export const RoyaltyService = {
  preview(product: Product) {
    traceAdapterCall("RoyaltyService.preview", "observed", { productId: product.id, settlementEnabled: false });
    return {
      standard: product.royaltyModel.standard,
      bps: product.royaltyModel.bps,
      recipient: product.royaltyModel.recipient,
      amount: product.royaltyModel.previewAmount,
      currency: product.pricing.currency
    };
  }
};

export const AuctionService = {
  canBid(product: Product) {
    return Boolean(product.auction && product.auction.status === "active" && product.governanceStatus !== "suspended");
  },
  minimumBid(product: Product) {
    if (!product.auction) return null;
    return Math.max(product.auction.reservePrice, (product.auction.highestBid ?? 0) + 1);
  }
};

export const StorageAccessService = {
  previewSignedUrl(product: Product) {
    traceAdapterCall("StorageAccessService.previewSignedUrl", "observed", { productId: product.id, productionGreenfieldEnabled: false });
    return createSignedUrlPreview(product).signedUrl;
  },
  getAccessModel(product: Product) {
    traceAdapterCall("StorageAccessService.getAccessModel", "observed", { productId: product.id, deliveryExecutionEnabled: false });
    const runtime = getDeliveryRuntime(product);
    const signedUrl = createSignedUrlPreview(product);

    return {
      service: "StorageAccessService",
      deliveryType: product.deliveryType,
      bucket: product.greenfieldBucket ?? null,
      signedUrlLifecycle: signedUrl.lifecycle,
      signedUrlPreviewAvailable: Boolean(signedUrl.signedUrl),
      authorizationState: runtime.authorizationState,
      protectedAsset: runtime.protectedAsset,
      entitlementRequired: runtime.entitlementRequired,
      productionGreenfieldEnabled: false,
      deliveryExecutionEnabled: false
    };
  }
};

export const GreenfieldAccessAdapter = {
  requestSignedUrlPreview(product: Product) {
    traceAdapterCall("GreenfieldAccessAdapter.requestSignedUrlPreview", "observed", { productId: product.id, productionGreenfieldEnabled: false });
    return createSignedUrlPreview(product);
  }
};

export const LayerZeroBridgeService = {
  readiness(product: Product) {
    traceAdapterCall("LayerZeroBridgeService.readiness", "observed", { productId: product.id, bridgeExecutionEnabled: false });
    return product.bridgeReadiness;
  }
};

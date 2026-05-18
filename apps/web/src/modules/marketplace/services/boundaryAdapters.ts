import type { Product } from "../types/marketplace";
import { issueMockPurchase } from "./marketplaceService";

export const ReownWalletStateMock = {
  connected: true,
  address: "0xAxoD...Mock",
  chain: "Polygon",
  networkMode: "mock"
};

export const MarketplaceContractAdapter = {
  async buyNow(product: Product) {
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
    return {
      mode: "mock-contract-call",
      action: "placeBid",
      amount,
      auctionType: product.auction?.type,
      txPreview: `mock-tx:${product.id}:bid:${amount}`
    };
  },
  async createListing(product: Product) {
    return {
      mode: "mock-contract-call",
      action: "createListing",
      tokenStandard: product.tokenStandard,
      txPreview: `mock-tx:${product.id}:create-listing`
    };
  }
};

export const RoyaltyService = {
  preview(product: Product) {
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
    if (!product.signedUrlPreviewAvailable) return null;
    return `https://greenfield.mock.axodus.local/access/${product.slug}?signature=preview`;
  }
};

export const LayerZeroBridgeService = {
  readiness(product: Product) {
    return product.bridgeReadiness;
  }
};

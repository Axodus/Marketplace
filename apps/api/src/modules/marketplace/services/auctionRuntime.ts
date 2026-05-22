import type {
  AuctionBidRequest,
  AuctionBidRuntime,
  AuctionExpirationRequest,
  AuctionRuntime,
  AuctionRuntimeSnapshot,
  AuctionSettlementRequest,
  MarketplaceStore,
  ProductEntity
} from "../dto/contracts.js";

export function placeAuctionBidRuntime(store: MarketplaceStore, input: AuctionBidRequest) {
  const product = findProduct(store, input.productId);
  const auction = getOrCreateAuction(store, product);
  const reasonCodes = getBidReasonCodes(product, auction, input.amount);
  const status: AuctionBidRuntime["status"] = reasonCodes.length > 0 ? "rejected" : "accepted";
  const bid: AuctionBidRuntime = {
    id: `auction-bid-${crypto.randomUUID()}`,
    auctionId: auction.id,
    productId: product?.id ?? input.productId,
    bidder: input.bidder ?? "0xAuctionBidder...A11C",
    amount: round(input.amount),
    currency: auction.currency,
    status,
    reasonCodes,
    placedAt: new Date().toISOString(),
    liveBidRuntimeEnabled: true,
    walletExecutionEnabled: false,
    blockchainWritesEnabled: false
  };

  if (status === "accepted") {
    auction.highestBidId = bid.id;
    auction.highestBidder = bid.bidder;
    auction.highestBidAmount = bid.amount;
    auction.bidCount += 1;
    auction.status = "active";
    auction.updatedAt = bid.placedAt;
  }

  return { auction, bid };
}

export function settleAuctionRuntime(store: MarketplaceStore, input: AuctionSettlementRequest): AuctionRuntime {
  const auction = findAuction(store, input.auctionId);
  const bid = findBid(store, auction?.highestBidId ?? null);
  const reasonCodes = getSettlementReasonCodes(input, auction, bid);
  const now = new Date().toISOString();
  if (!auction) {
    return createBlockedAuction(input.auctionId, "auction-not-found", now);
  }

  if (reasonCodes.length > 0) {
    return {
      ...auction,
      status: "blocked",
      reasonCodes,
      settlement: {
        status: "blocked",
        buyer: bid?.bidder ?? null,
        amount: bid?.amount ?? 0,
        purchaseId: null,
        confirmationId: null,
        settledAt: null
      },
      updatedAt: now
    };
  }

  auction.status = "settled";
  auction.reasonCodes = [];
  auction.settlement = {
    status: "settled",
    buyer: bid?.bidder ?? null,
    amount: bid?.amount ?? 0,
    purchaseId: null,
    confirmationId: `auction-confirmation-${crypto.randomUUID()}`,
    settledAt: now
  };
  auction.updatedAt = now;
  return auction;
}

export function expireAuctionRuntime(store: MarketplaceStore, input: AuctionExpirationRequest): AuctionRuntime {
  const auction = findAuction(store, input.auctionId);
  const reasonCodes = getExpirationReasonCodes(input, auction);
  const now = new Date().toISOString();
  if (!auction) {
    return createBlockedAuction(input.auctionId, "auction-not-found", now);
  }

  if (reasonCodes.length > 0) {
    return {
      ...auction,
      status: "blocked",
      reasonCodes,
      expiration: {
        status: "blocked",
        expiredAt: null,
        reasonCodes
      },
      updatedAt: now
    };
  }

  auction.status = "expired";
  auction.reasonCodes = [];
  auction.expiration = {
    status: "executed",
    expiredAt: now,
    reasonCodes: []
  };
  auction.updatedAt = now;
  return auction;
}

export function buildAuctionRuntimeSnapshot(store: MarketplaceStore): AuctionRuntimeSnapshot {
  const auctions = store.auctionRuntimes ?? [];
  const bids = store.auctionBids ?? [];
  return {
    id: `auction-snapshot-${crypto.randomUUID()}`,
    auctions,
    bids,
    metrics: {
      active: auctions.filter((auction) => auction.status === "active").length,
      settled: auctions.filter((auction) => auction.status === "settled").length,
      expired: auctions.filter((auction) => auction.status === "expired").length,
      blocked: auctions.filter((auction) => auction.status === "blocked").length,
      bids: bids.length,
      acceptedBids: bids.filter((bid) => bid.status === "accepted").length,
      rejectedBids: bids.filter((bid) => bid.status === "rejected").length,
      totalBidVolume: round(bids.filter((bid) => bid.status === "accepted").reduce((sum, bid) => sum + bid.amount, 0))
    },
    liveBidRuntimeEnabled: true,
    auctionSettlementEnabled: true,
    expirationExecutionEnabled: true,
    walletExecutionEnabled: false,
    blockchainWritesEnabled: false,
    contractSettlementEnabled: false,
    generatedAt: new Date().toISOString()
  };
}

function getOrCreateAuction(store: MarketplaceStore, product?: ProductEntity): AuctionRuntime {
  const productId = product?.id ?? "unknown";
  const existing = (store.auctionRuntimes ?? []).find((auction) => auction.productId === productId && auction.status === "active");
  if (existing) return existing;

  const metadata = getAuctionMetadata(product);
  const now = new Date().toISOString();
  const auction: AuctionRuntime = {
    id: `auction-${crypto.randomUUID()}`,
    productId,
    sellerId: product?.sellerId ?? "unknown-seller",
    tenantId: getTenantId(product),
    type: metadata.type,
    status: product ? "active" : "blocked",
    currency: getCurrency(product),
    reservePrice: metadata.reservePrice,
    highestBidId: null,
    highestBidder: null,
    highestBidAmount: 0,
    bidCount: 0,
    expiresAt: metadata.endsAt,
    reasonCodes: product ? [] : ["product-not-found"],
    settlement: {
      status: "not-settled",
      buyer: null,
      amount: 0,
      purchaseId: null,
      confirmationId: null,
      settledAt: null
    },
    expiration: {
      status: "pending",
      expiredAt: null,
      reasonCodes: []
    },
    liveBidRuntimeEnabled: true,
    auctionSettlementEnabled: true,
    expirationExecutionEnabled: true,
    walletExecutionEnabled: false,
    blockchainWritesEnabled: false,
    contractSettlementEnabled: false,
    createdAt: now,
    updatedAt: now
  };
  store.auctionRuntimes = [auction, ...(store.auctionRuntimes ?? [])].slice(0, 100);
  return auction;
}

function getBidReasonCodes(product: ProductEntity | undefined, auction: AuctionRuntime, amount: number) {
  const reasons: string[] = [];
  if (!product) reasons.push("product-not-found");
  if (product && !String(product.listingType ?? "").includes("auction")) reasons.push("product-not-auction");
  if (product && (product.governanceStatus === "restricted" || product.governanceStatus === "suspended")) reasons.push(`governance-${product.governanceStatus}`);
  if (auction.status !== "active") reasons.push(`auction-${auction.status}`);
  if (!Number.isFinite(amount) || amount <= 0) reasons.push("bid-amount-invalid");
  if (amount < auction.reservePrice) reasons.push("bid-below-reserve");
  if (auction.highestBidAmount > 0 && amount <= auction.highestBidAmount) reasons.push("bid-not-higher-than-current");
  return reasons;
}

function getSettlementReasonCodes(input: AuctionSettlementRequest, auction?: AuctionRuntime, bid?: AuctionBidRuntime) {
  const reasons: string[] = [];
  if (input.controlledRollout !== true) reasons.push("controlled-rollout-required");
  if (!auction) reasons.push("auction-not-found");
  if (auction && auction.status !== "active") reasons.push(`auction-${auction.status}`);
  if (!bid || bid.status !== "accepted") reasons.push("accepted-bid-required");
  return reasons;
}

function getExpirationReasonCodes(input: AuctionExpirationRequest, auction?: AuctionRuntime) {
  const reasons: string[] = [];
  if (input.controlledRollout !== true) reasons.push("controlled-rollout-required");
  if (!auction) reasons.push("auction-not-found");
  if (auction && auction.status !== "active") reasons.push(`auction-${auction.status}`);
  return reasons;
}

function createBlockedAuction(auctionId: string, reason: string, now: string): AuctionRuntime {
  return {
    id: auctionId,
    productId: "unknown",
    sellerId: "unknown-seller",
    tenantId: "tenant-axodus-dao",
    type: "reserve-auction",
    status: "blocked",
    currency: "USDC",
    reservePrice: 0,
    highestBidId: null,
    highestBidder: null,
    highestBidAmount: 0,
    bidCount: 0,
    expiresAt: null,
    reasonCodes: [reason],
    settlement: { status: "blocked", buyer: null, amount: 0, purchaseId: null, confirmationId: null, settledAt: null },
    expiration: { status: "blocked", expiredAt: null, reasonCodes: [reason] },
    liveBidRuntimeEnabled: true,
    auctionSettlementEnabled: true,
    expirationExecutionEnabled: true,
    walletExecutionEnabled: false,
    blockchainWritesEnabled: false,
    contractSettlementEnabled: false,
    createdAt: now,
    updatedAt: now
  };
}

function findProduct(store: MarketplaceStore, productId: string) {
  return store.products.find((product) => product.id === productId || product.slug === productId);
}

function findAuction(store: MarketplaceStore, auctionId: string) {
  return (store.auctionRuntimes ?? []).find((auction) => auction.id === auctionId || auction.productId === auctionId);
}

function findBid(store: MarketplaceStore, bidId: string | null) {
  return bidId ? (store.auctionBids ?? []).find((bid) => bid.id === bidId) : undefined;
}

function getAuctionMetadata(product?: ProductEntity) {
  const auction = product?.auction as { type?: string; reservePrice?: number; endsAt?: string } | undefined;
  const type: AuctionRuntime["type"] =
    auction?.type === "dutch-auction" || auction?.type === "reserve-auction" ? auction.type : "english-auction";
  return {
    type,
    reservePrice: Number(auction?.reservePrice ?? 0),
    endsAt: typeof auction?.endsAt === "string" ? auction.endsAt : null
  };
}

function getCurrency(product?: ProductEntity) {
  const pricing = product?.pricing as { currency?: string } | undefined;
  return typeof pricing?.currency === "string" ? pricing.currency : "USDC";
}

function getTenantId(product?: ProductEntity) {
  return typeof product?.tenantId === "string" ? product.tenantId : "tenant-axodus-dao";
}

function round(value: number) {
  return Number(value.toFixed(4));
}

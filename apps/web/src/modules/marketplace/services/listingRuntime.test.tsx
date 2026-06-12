import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ListingRuntimePanel } from "../components/ListingRuntimePanel";
import type { Product } from "../types/marketplace";
import type { Eip1193Provider, WalletRuntimeState } from "../../../services/walletRuntime";
import {
  encodeAuctionStateCall,
  encodeListingStateCall,
  encodeRoyaltyInfoCall,
  encodeRuntimeWords,
  hydrateListingRuntime
} from "./listingRuntime";

const wallet: WalletRuntimeState = {
  status: "connected",
  address: "0x1234567890abcdef1234567890abcdef12345678",
  shortAddress: "0x1234...5678",
  chainId: 137,
  chainName: "Polygon",
  supportedChain: true,
  restrictedChain: false,
  disconnected: false,
  persisted: true,
  providerSource: "eip1193",
  walletExecutionEnabled: false,
  transactionExecutionEnabled: false,
  signatureExecutionEnabled: false,
  lastError: null
};

const product: Product = {
  id: "product-live-listing",
  title: "Live Listing Read",
  slug: "live-listing-read",
  category: "Digital Assets",
  subcategory: "Access",
  sellerId: "seller-test",
  description: "Readonly listing test",
  shortDescription: "Readonly listing test",
  tags: ["listing"],
  images: [],
  media: [],
  version: "1.0.0",
  status: "listed",
  governanceStatus: "compliant",
  constitutionalStanding: "aligned",
  visibility: "public",
  pricing: { amount: 1, currency: "USDC", settlementMode: "mock-only" },
  acceptedCurrencies: ["USDC"],
  royaltyModel: { standard: "EIP-2981", bps: 500, recipient: "creator", previewAmount: 0.05 },
  accessModel: "wallet-gated",
  deliveryType: "Signed URL",
  licenseType: "NFT Access License",
  supportedChains: ["Polygon"],
  nftBound: true,
  governanceRequired: false,
  maturity: "production",
  createdAt: "2026-05-01T00:00:00.000Z",
  updatedAt: "2026-05-01T00:00:00.000Z",
  tokenStandard: "ERC721",
  contractAddress: "0x0000000000000000000000000000000000000abc",
  tokenId: "7",
  marketplaceContractAddress: "0x0000000000000000000000000000000000000def",
  auctionContractAddress: "0x0000000000000000000000000000000000000aaa",
  royaltyContractAddress: "0x0000000000000000000000000000000000000abc",
  listingId: "9",
  listingType: "fixed",
  bridgeReadiness: {
    layerZeroReady: false,
    sourceChain: "Polygon",
    destinationChains: [],
    notes: "test"
  },
  signedUrlPreviewAvailable: false
};

function createProvider(results: string[]) {
  const calls: Array<{ method: string; params?: unknown[] | Record<string, unknown> }> = [];
  const provider: Eip1193Provider = {
    async request(args) {
      calls.push(args);
      if (args.method === "eth_call") return results.shift() ?? "0x";
      throw new Error(`Unexpected method ${args.method}`);
    }
  };
  return { provider, calls };
}

function encodedAddressWord(address: string) {
  return BigInt(address).toString();
}

describe("listingRuntime", () => {
  it("hydrates fixed listing and EIP-2981 royalty through readonly eth_call", async () => {
    const futureSeconds = Math.floor(Date.now() / 1000) + 3600;
    const { provider, calls } = createProvider([
      encodeRuntimeWords([1, 120000000n, futureSeconds]),
      encodeRuntimeWords([encodedAddressWord("0x0000000000000000000000000000000000000123"), 6000000])
    ]);

    const snapshot = await hydrateListingRuntime(product, wallet, { ethereum: provider });

    expect(snapshot.status).toBe("hydrated_active");
    expect(snapshot.fixedListing.price).toBe("120000000");
    expect(snapshot.fixedListing.expired).toBe(false);
    expect(snapshot.royalty.recipient).toBe("0x0000000000000000000000000000000000000123");
    expect(snapshot.royalty.amount).toBe("6000000");
    expect(snapshot.contractWriteEnabled).toBe(false);
    expect(snapshot.settlementEnabled).toBe(false);
    expect(calls).toEqual([
      {
        method: "eth_call",
        params: [{ to: product.marketplaceContractAddress, data: encodeListingStateCall("9") }, "latest"]
      },
      {
        method: "eth_call",
        params: [{ to: product.royaltyContractAddress, data: encodeRoyaltyInfoCall("7", 120000000n) }, "latest"]
      }
    ]);
  });

  it("hydrates english auction bid and expiration state", async () => {
    const auctionProduct = { ...product, listingType: "english-auction" as const };
    const futureSeconds = Math.floor(Date.now() / 1000) + 7200;
    const { provider, calls } = createProvider([
      encodeRuntimeWords([1, 100000000n, futureSeconds]),
      encodeRuntimeWords([1, 80000000n, 125000000n, 4, futureSeconds, 125000000n]),
      encodeRuntimeWords([encodedAddressWord("0x0000000000000000000000000000000000000123"), 6250000])
    ]);

    const snapshot = await hydrateListingRuntime(auctionProduct, wallet, { ethereum: provider });

    expect(snapshot.status).toBe("hydrated_active");
    expect(snapshot.auction.type).toBe("english-auction");
    expect(snapshot.auction.highestBid).toBe("125000000");
    expect(snapshot.auction.bidCount).toBe(4);
    expect(snapshot.auction.expired).toBe(false);
    expect(calls[1]).toEqual({
      method: "eth_call",
      params: [{ to: product.auctionContractAddress, data: encodeAuctionStateCall("9") }, "latest"]
    });
  });

  it("handles disconnected wallet, unsupported chain and missing live contract configuration without reads", async () => {
    const { provider, calls } = createProvider([encodeRuntimeWords([1, 1, 1])]);

    const disconnected = await hydrateListingRuntime(product, { ...wallet, address: null, disconnected: true, status: "disconnected" }, { ethereum: provider });
    const unsupported = await hydrateListingRuntime(product, { ...wallet, chainId: 1, chainName: "Ethereum" }, { ethereum: provider });
    const unconfigured = await hydrateListingRuntime({ ...product, marketplaceContractAddress: undefined, listingId: undefined }, wallet, { ethereum: provider });

    expect(disconnected.status).toBe("disconnected_wallet");
    expect(unsupported.status).toBe("unsupported_chain");
    expect(unconfigured.status).toBe("not_live_configured");
    expect(calls).toHaveLength(0);
  });

  it("renders hydrated and readiness-only listing states", async () => {
    const futureSeconds = Math.floor(Date.now() / 1000) + 3600;
    const hydrated = await hydrateListingRuntime(product, wallet, {
      ethereum: createProvider([encodeRuntimeWords([1, 120000000n, futureSeconds]), encodeRuntimeWords([0, 0])]).provider
    });
    const readinessOnly = await hydrateListingRuntime({ ...product, marketplaceContractAddress: undefined, listingId: undefined }, wallet);

    const hydratedHtml = renderToStaticMarkup(<ListingRuntimePanel snapshot={hydrated} />);
    const readinessHtml = renderToStaticMarkup(<ListingRuntimePanel snapshot={readinessOnly} />);

    expect(hydratedHtml).toContain("Hydrated active");
    expect(hydratedHtml).toContain("No settlement");
    expect(readinessHtml).toContain("Readiness only");
  });
});

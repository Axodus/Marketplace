import type { Eip1193Provider, WalletRuntimeEnvironment, WalletRuntimeState } from "../../../services/walletRuntime";
import type { Product } from "../types/marketplace";
import { isValidEvmAddress } from "./nftOwnershipRuntime";

export type ListingRuntimeStatus =
  | "not_live_configured"
  | "disconnected_wallet"
  | "unsupported_chain"
  | "hydrated_active"
  | "hydrated_expired"
  | "hydrated_sold"
  | "hydrated_cancelled"
  | "read_error";

export type ListingContractReadMethod = "listingState" | "auctionState" | "royaltyInfo" | "none";

export type ListingRuntimeSnapshot = {
  productId: string;
  status: ListingRuntimeStatus;
  listingType: Product["listingType"];
  walletAddress: string | null;
  chainId: number | null;
  chainName: string;
  supportedChain: boolean;
  marketplaceContractAddress: string | null;
  auctionContractAddress: string | null;
  royaltyContractAddress: string | null;
  listingId: string | null;
  fixedListing: {
    status: "active" | "sold" | "expired" | "cancelled" | "unknown";
    price: string | null;
    expiration: string | null;
    expired: boolean;
  };
  auction: {
    type: "english-auction" | "dutch-auction" | "none";
    status: "active" | "sold" | "expired" | "cancelled" | "unknown";
    reservePrice: string | null;
    highestBid: string | null;
    bidCount: number | null;
    currentPrice: string | null;
    expiration: string | null;
    expired: boolean;
  };
  royalty: {
    recipient: string | null;
    amount: string | null;
    eip2981ReadEnabled: boolean;
  };
  contractReadEnabled: boolean;
  contractWriteEnabled: false;
  settlementEnabled: false;
  readMethods: ListingContractReadMethod[];
  reasons: string[];
};

const CHAIN_NAMES_BY_ID: Record<number, string> = {
  1: "Ethereum",
  56: "BNB",
  137: "Polygon",
  1666600000: "Harmony",
  42161: "Arbitrum"
};

const AXODUS_LISTING_STATE_SELECTOR = "0x8e539e8c";
const AXODUS_AUCTION_STATE_SELECTOR = "0xa36f4d52";
const EIP2981_ROYALTY_INFO_SELECTOR = "0x2a55205a";

function getBrowserEnvironment(): WalletRuntimeEnvironment {
  if (typeof window === "undefined") return {};
  const candidate = window as Window &
    typeof globalThis & {
      ethereum?: Eip1193Provider;
      reownAppKit?: WalletRuntimeEnvironment["reownAppKit"];
      appKit?: WalletRuntimeEnvironment["reownAppKit"];
    };
  return {
    ethereum: candidate.ethereum,
    reownAppKit: candidate.reownAppKit ?? candidate.appKit,
    storage: candidate.localStorage
  };
}

async function resolveReadonlyProvider(env: WalletRuntimeEnvironment): Promise<Eip1193Provider | undefined> {
  if (env.reownAppKit?.getWalletProvider) return env.reownAppKit.getWalletProvider();
  if (env.ethereum) return env.ethereum;
  return undefined;
}

function productSupportsWalletChain(product: Product, wallet: WalletRuntimeState) {
  const chainName = wallet.chainId ? CHAIN_NAMES_BY_ID[wallet.chainId] : null;
  return Boolean(chainName && product.supportedChains.includes(chainName as Product["supportedChains"][number]));
}

function padUint256(value: string | number | bigint) {
  return BigInt(value).toString(16).padStart(64, "0");
}

function padBytes32(value: string) {
  if (/^0x[a-fA-F0-9]{64}$/.test(value)) return value.slice(2);
  return BigInt(value).toString(16).padStart(64, "0");
}

function decodeWords(result: unknown): bigint[] {
  if (typeof result !== "string" || !/^0x[a-fA-F0-9]*$/.test(result)) return [];
  const body = result.slice(2);
  const words: bigint[] = [];
  for (let index = 0; index + 64 <= body.length; index += 64) {
    words.push(BigInt(`0x${body.slice(index, index + 64)}`));
  }
  return words;
}

function decodeAddressWord(word?: bigint): string | null {
  if (word === undefined) return null;
  return `0x${word.toString(16).padStart(64, "0").slice(-40)}`;
}

function statusFromCode(code?: bigint): ListingRuntimeSnapshot["fixedListing"]["status"] {
  if (code === 1n) return "active";
  if (code === 2n) return "sold";
  if (code === 3n) return "expired";
  if (code === 4n) return "cancelled";
  return "unknown";
}

function runtimeStatus(status: ListingRuntimeSnapshot["fixedListing"]["status"], expired: boolean): ListingRuntimeStatus {
  if (status === "sold") return "hydrated_sold";
  if (status === "cancelled") return "hydrated_cancelled";
  if (status === "expired" || expired) return "hydrated_expired";
  return "hydrated_active";
}

function expirationFromSeconds(seconds?: bigint): { expiration: string | null; expired: boolean } {
  if (!seconds) return { expiration: null, expired: false };
  const timestamp = Number(seconds) * 1000;
  return {
    expiration: new Date(timestamp).toISOString(),
    expired: timestamp <= Date.now()
  };
}

export function encodeListingStateCall(listingId: string) {
  return `${AXODUS_LISTING_STATE_SELECTOR}${padBytes32(listingId)}`;
}

export function encodeAuctionStateCall(listingId: string) {
  return `${AXODUS_AUCTION_STATE_SELECTOR}${padBytes32(listingId)}`;
}

export function encodeRoyaltyInfoCall(tokenId: string, salePrice: string | number | bigint) {
  return `${EIP2981_ROYALTY_INFO_SELECTOR}${padUint256(tokenId)}${padUint256(salePrice)}`;
}

export function encodeRuntimeWords(words: Array<string | number | bigint>) {
  return `0x${words.map((word) => padUint256(word)).join("")}`;
}

function baseSnapshot(product: Product, wallet: WalletRuntimeState, status: ListingRuntimeStatus, reasons: string[]): ListingRuntimeSnapshot {
  return {
    productId: product.id,
    status,
    listingType: product.listingType,
    walletAddress: wallet.address,
    chainId: wallet.chainId,
    chainName: wallet.chainName,
    supportedChain: false,
    marketplaceContractAddress: product.marketplaceContractAddress ?? null,
    auctionContractAddress: product.auctionContractAddress ?? null,
    royaltyContractAddress: product.royaltyContractAddress ?? product.contractAddress ?? null,
    listingId: product.listingId ?? null,
    fixedListing: {
      status: "unknown",
      price: null,
      expiration: null,
      expired: false
    },
    auction: {
      type: product.listingType === "english-auction" || product.listingType === "dutch-auction" ? product.listingType : "none",
      status: "unknown",
      reservePrice: null,
      highestBid: null,
      bidCount: null,
      currentPrice: null,
      expiration: null,
      expired: false
    },
    royalty: {
      recipient: null,
      amount: null,
      eip2981ReadEnabled: false
    },
    contractReadEnabled: false,
    contractWriteEnabled: false,
    settlementEnabled: false,
    readMethods: [],
    reasons
  };
}

function hasLiveListingConfig(product: Product) {
  return Boolean(product.listingId && isValidEvmAddress(product.marketplaceContractAddress));
}

export async function hydrateListingRuntime(
  product: Product,
  wallet: WalletRuntimeState,
  env: WalletRuntimeEnvironment = getBrowserEnvironment()
): Promise<ListingRuntimeSnapshot> {
  if (wallet.disconnected || !wallet.address) {
    return baseSnapshot(product, wallet, "disconnected_wallet", ["wallet-disconnected"]);
  }

  if (!wallet.supportedChain || wallet.restrictedChain || !productSupportsWalletChain(product, wallet)) {
    return { ...baseSnapshot(product, wallet, "unsupported_chain", ["wallet-chain-not-supported-for-listing"]), supportedChain: false };
  }

  if (!hasLiveListingConfig(product)) {
    return { ...baseSnapshot(product, wallet, "not_live_configured", ["marketplace-contract-or-listing-id-not-configured"]), supportedChain: true };
  }

  const provider = await resolveReadonlyProvider(env);
  if (!provider) {
    return { ...baseSnapshot(product, wallet, "read_error", ["readonly-provider-unavailable"]), supportedChain: true };
  }

  try {
    const marketplaceAddress = product.marketplaceContractAddress!;
    const listingId = product.listingId!;
    const readMethods: ListingContractReadMethod[] = [];
    const listingWords = decodeWords(
      await provider.request({
        method: "eth_call",
        params: [{ to: marketplaceAddress, data: encodeListingStateCall(listingId) }, "latest"]
      })
    );
    readMethods.push("listingState");

    const listingStatus = statusFromCode(listingWords[0]);
    const listingExpiration = expirationFromSeconds(listingWords[2]);
    let snapshot: ListingRuntimeSnapshot = {
      ...baseSnapshot(product, wallet, runtimeStatus(listingStatus, listingExpiration.expired), ["listing-runtime-hydrated-readonly"]),
      supportedChain: true,
      contractReadEnabled: true,
      readMethods,
      fixedListing: {
        status: listingStatus,
        price: listingWords[1]?.toString() ?? null,
        expiration: listingExpiration.expiration,
        expired: listingExpiration.expired
      }
    };

    if ((product.listingType === "english-auction" || product.listingType === "dutch-auction") && isValidEvmAddress(product.auctionContractAddress ?? marketplaceAddress)) {
      const auctionAddress = product.auctionContractAddress ?? marketplaceAddress;
      const auctionWords = decodeWords(
        await provider.request({
          method: "eth_call",
          params: [{ to: auctionAddress, data: encodeAuctionStateCall(listingId) }, "latest"]
        })
      );
      readMethods.push("auctionState");
      const auctionStatus = statusFromCode(auctionWords[0]);
      const auctionExpiration = expirationFromSeconds(auctionWords[4]);
      snapshot = {
        ...snapshot,
        status: runtimeStatus(auctionStatus, auctionExpiration.expired),
        auctionContractAddress: auctionAddress,
        auction: {
          type: product.listingType,
          status: auctionStatus,
          reservePrice: auctionWords[1]?.toString() ?? null,
          highestBid: auctionWords[2]?.toString() ?? null,
          bidCount: auctionWords[3] === undefined ? null : Number(auctionWords[3]),
          currentPrice: auctionWords[5]?.toString() ?? auctionWords[2]?.toString() ?? null,
          expiration: auctionExpiration.expiration,
          expired: auctionExpiration.expired
        }
      };
    }

    if (isValidEvmAddress(product.royaltyContractAddress ?? product.contractAddress) && product.tokenId && /^\d+$/.test(product.tokenId)) {
      const royaltyAddress = product.royaltyContractAddress ?? product.contractAddress!;
      const royaltyWords = decodeWords(
        await provider.request({
          method: "eth_call",
          params: [{ to: royaltyAddress, data: encodeRoyaltyInfoCall(product.tokenId, listingWords[1] ?? 0n) }, "latest"]
        })
      );
      readMethods.push("royaltyInfo");
      snapshot = {
        ...snapshot,
        royaltyContractAddress: royaltyAddress,
        royalty: {
          recipient: decodeAddressWord(royaltyWords[0]),
          amount: royaltyWords[1]?.toString() ?? null,
          eip2981ReadEnabled: true
        }
      };
    }

    return snapshot;
  } catch (error) {
    return {
      ...baseSnapshot(product, wallet, "read_error", [error instanceof Error ? error.message : "listing-runtime-read-failed"]),
      supportedChain: true,
      contractReadEnabled: true
    };
  }
}

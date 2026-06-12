import type { Product } from "../types/marketplace";
import type { Eip1193Provider, WalletRuntimeEnvironment, WalletRuntimeState } from "../../../services/walletRuntime";

export type NftOwnershipStatus =
  | "not_nft_bound"
  | "offchain_license"
  | "disconnected_wallet"
  | "unsupported_chain"
  | "unreadable_contract"
  | "verified_owner"
  | "ownership_mismatch"
  | "read_error";

export type NftOwnershipKind = "erc721" | "erc1155" | "governance-nft" | "license-nft" | "access-nft" | "offchain";

export type NftOwnershipSnapshot = {
  productId: string;
  status: NftOwnershipStatus;
  kind: NftOwnershipKind;
  verified: boolean;
  walletAddress: string | null;
  chainId: number | null;
  chainName: string;
  supportedChain: boolean;
  requiredChains: string[];
  tokenStandard: Product["tokenStandard"];
  contractAddress: string | null;
  tokenId: string | null;
  readMethod: "ownerOf" | "balanceOf" | "none";
  ownerAddress: string | null;
  balance: string | null;
  contractReadEnabled: boolean;
  contractWriteEnabled: false;
  mintTransferEnabled: false;
  reasons: string[];
};

const CHAIN_NAMES_BY_ID: Record<number, string> = {
  1: "Ethereum",
  56: "BNB",
  137: "Polygon",
  1666600000: "Harmony",
  42161: "Arbitrum"
};

const OWNER_OF_SELECTOR = "0x6352211e";
const ERC1155_BALANCE_OF_SELECTOR = "0x00fdd58e";

export function classifyOwnershipKind(product: Product): NftOwnershipKind {
  if (product.tokenStandard === "OffchainLicense") return "offchain";
  if (product.category === "Governance") return "governance-nft";
  if (product.licenseType === "NFT Access License") return "access-nft";
  if (product.licenseType.includes("License")) return "license-nft";
  return product.tokenStandard.toLowerCase() as "erc721" | "erc1155";
}

export function isValidEvmAddress(address?: string | null): address is `0x${string}` {
  return typeof address === "string" && /^0x[a-fA-F0-9]{40}$/.test(address);
}

function isNumericTokenId(tokenId?: string | null): tokenId is string {
  return typeof tokenId === "string" && /^\d+$/.test(tokenId);
}

function padUint256(value: string | bigint) {
  return BigInt(value).toString(16).padStart(64, "0");
}

function padAddress(address: string) {
  return address.toLowerCase().replace(/^0x/, "").padStart(64, "0");
}

export function encodeOwnerOfCall(tokenId: string) {
  return `${OWNER_OF_SELECTOR}${padUint256(tokenId)}`;
}

export function encodeErc1155BalanceOfCall(address: string, tokenId: string) {
  return `${ERC1155_BALANCE_OF_SELECTOR}${padAddress(address)}${padUint256(tokenId)}`;
}

function decodeOwnerAddress(result: unknown): string | null {
  if (typeof result !== "string" || !/^0x[a-fA-F0-9]{64}$/.test(result)) return null;
  return `0x${result.slice(-40)}`;
}

function decodeUint256(result: unknown): bigint | null {
  if (typeof result !== "string" || !/^0x[a-fA-F0-9]+$/.test(result)) return null;
  return BigInt(result);
}

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

function baseSnapshot(product: Product, wallet: WalletRuntimeState, status: NftOwnershipStatus, reasons: string[]): NftOwnershipSnapshot {
  return {
    productId: product.id,
    status,
    kind: classifyOwnershipKind(product),
    verified: false,
    walletAddress: wallet.address,
    chainId: wallet.chainId,
    chainName: wallet.chainName,
    supportedChain: false,
    requiredChains: product.supportedChains,
    tokenStandard: product.tokenStandard,
    contractAddress: product.contractAddress ?? null,
    tokenId: product.tokenId ?? null,
    readMethod: "none",
    ownerAddress: null,
    balance: null,
    contractReadEnabled: false,
    contractWriteEnabled: false,
    mintTransferEnabled: false,
    reasons
  };
}

export async function verifyNftOwnership(
  product: Product,
  wallet: WalletRuntimeState,
  env: WalletRuntimeEnvironment = getBrowserEnvironment()
): Promise<NftOwnershipSnapshot> {
  if (!product.nftBound) {
    return baseSnapshot(product, wallet, "not_nft_bound", ["product-not-nft-bound"]);
  }

  if (product.tokenStandard === "OffchainLicense") {
    return baseSnapshot(product, wallet, "offchain_license", ["offchain-license-no-nft-read"]);
  }

  if (wallet.disconnected || !wallet.address) {
    return baseSnapshot(product, wallet, "disconnected_wallet", ["wallet-disconnected"]);
  }

  if (!wallet.supportedChain || wallet.restrictedChain || !productSupportsWalletChain(product, wallet)) {
    return {
      ...baseSnapshot(product, wallet, "unsupported_chain", ["wallet-chain-not-supported-for-product"]),
      supportedChain: false
    };
  }

  if (!isValidEvmAddress(product.contractAddress) || !isNumericTokenId(product.tokenId)) {
    return {
      ...baseSnapshot(product, wallet, "unreadable_contract", ["contract-or-token-id-not-production-readable"]),
      supportedChain: true
    };
  }

  const provider = await resolveReadonlyProvider(env);
  if (!provider) {
    return {
      ...baseSnapshot(product, wallet, "read_error", ["readonly-provider-unavailable"]),
      supportedChain: true
    };
  }

  try {
    if (product.tokenStandard === "ERC721") {
      const result = await provider.request({
        method: "eth_call",
        params: [{ to: product.contractAddress, data: encodeOwnerOfCall(product.tokenId) }, "latest"]
      });
      const ownerAddress = decodeOwnerAddress(result);
      const verified = Boolean(ownerAddress && ownerAddress.toLowerCase() === wallet.address.toLowerCase());
      return {
        ...baseSnapshot(product, wallet, verified ? "verified_owner" : "ownership_mismatch", verified ? ["erc721-owner-verified"] : ["erc721-owner-mismatch"]),
        verified,
        supportedChain: true,
        readMethod: "ownerOf",
        ownerAddress,
        contractReadEnabled: true
      };
    }

    const result = await provider.request({
      method: "eth_call",
      params: [{ to: product.contractAddress, data: encodeErc1155BalanceOfCall(wallet.address, product.tokenId) }, "latest"]
    });
    const balance = decodeUint256(result);
    const verified = Boolean(balance && balance > 0n);
    return {
      ...baseSnapshot(product, wallet, verified ? "verified_owner" : "ownership_mismatch", verified ? ["erc1155-balance-verified"] : ["erc1155-zero-balance"]),
      verified,
      supportedChain: true,
      readMethod: "balanceOf",
      balance: balance?.toString() ?? null,
      contractReadEnabled: true
    };
  } catch (error) {
    return {
      ...baseSnapshot(product, wallet, "read_error", [error instanceof Error ? error.message : "ownership-read-failed"]),
      supportedChain: true,
      contractReadEnabled: true
    };
  }
}

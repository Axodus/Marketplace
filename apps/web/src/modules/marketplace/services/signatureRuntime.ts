import type { Eip1193Provider, WalletRuntimeEnvironment, WalletRuntimeState } from "../../../services/walletRuntime";
import type { Product } from "../types/marketplace";
import { isValidEvmAddress } from "./nftOwnershipRuntime";

export type SignatureIntentAction = "buy-now" | "place-bid" | "create-listing";
export type SignatureIntentStatus = "preview_ready" | "wallet_disconnected" | "unsupported_chain" | "missing_contract" | "gas_preview_unavailable";
export type SignatureRiskLevel = "low" | "medium" | "high";

export type SignatureIntentSnapshot = {
  productId: string;
  action: SignatureIntentAction;
  status: SignatureIntentStatus;
  walletAddress: string | null;
  chainId: number | null;
  chainName: string;
  contractAddress: string | null;
  value: string;
  calldata: string;
  gasLimitPreview: string | null;
  permissionVisibility: {
    requiresWalletConnection: boolean;
    requiresSupportedChain: boolean;
    requiresContractAddress: boolean;
    requiresSignature: false;
    requiresTransactionSend: false;
  };
  risk: {
    level: SignatureRiskLevel;
    warnings: string[];
  };
  previewOnly: true;
  signatureExecutionEnabled: false;
  transactionExecutionEnabled: false;
  contractWriteEnabled: false;
  sendTransactionEnabled: false;
  reasons: string[];
};

const CHAIN_NAMES_BY_ID: Record<number, string> = {
  1: "Ethereum",
  56: "BNB",
  137: "Polygon",
  1666600000: "Harmony",
  42161: "Arbitrum"
};

const BUY_NOW_SELECTOR = "0xd0e30db0";
const PLACE_BID_SELECTOR = "0x454a2ab3";
const CREATE_LISTING_SELECTOR = "0x3d13f874";

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

function padAddress(address: string) {
  return address.toLowerCase().replace(/^0x/, "").padStart(64, "0");
}

function padBytes32(value?: string) {
  if (!value) return "0".repeat(64);
  if (/^0x[a-fA-F0-9]{64}$/.test(value)) return value.slice(2);
  if (/^\d+$/.test(value)) return padUint256(value);
  const encoded = Array.from(value)
    .map((char) => char.charCodeAt(0).toString(16).padStart(2, "0"))
    .join("");
  return encoded.slice(0, 64).padEnd(64, "0");
}

export function encodeBuyNowCalldata(listingId?: string) {
  return `${BUY_NOW_SELECTOR}${padBytes32(listingId)}`;
}

export function encodePlaceBidCalldata(listingId: string | undefined, bidAmount: string | number | bigint) {
  return `${PLACE_BID_SELECTOR}${padBytes32(listingId)}${padUint256(bidAmount)}`;
}

export function encodeCreateListingCalldata(product: Product) {
  const tokenAddress = isValidEvmAddress(product.contractAddress) ? product.contractAddress : "0x0000000000000000000000000000000000000000";
  const tokenId = product.tokenId && /^\d+$/.test(product.tokenId) ? product.tokenId : "0";
  return `${CREATE_LISTING_SELECTOR}${padAddress(tokenAddress)}${padUint256(tokenId)}${padUint256(Math.round(product.pricing.amount * 1_000_000))}`;
}

function getContractAddress(product: Product, action: SignatureIntentAction) {
  if (action === "create-listing") return product.marketplaceContractAddress ?? null;
  if (action === "place-bid") return product.auctionContractAddress ?? product.marketplaceContractAddress ?? null;
  return product.marketplaceContractAddress ?? null;
}

function getCalldata(product: Product, action: SignatureIntentAction, bidAmount?: number) {
  if (action === "buy-now") return encodeBuyNowCalldata(product.listingId);
  if (action === "place-bid") return encodePlaceBidCalldata(product.listingId, Math.round((bidAmount ?? product.pricing.amount) * 1_000_000));
  return encodeCreateListingCalldata(product);
}

function getValue(product: Product, action: SignatureIntentAction, bidAmount?: number) {
  if (product.pricing.currency !== "ETH") return "0";
  const amount = action === "place-bid" ? bidAmount ?? product.pricing.amount : product.pricing.amount;
  return BigInt(Math.round(amount * 1_000_000_000_000_000_000)).toString();
}

function baseSnapshot(product: Product, wallet: WalletRuntimeState, action: SignatureIntentAction, status: SignatureIntentStatus, bidAmount?: number): SignatureIntentSnapshot {
  const contractAddress = getContractAddress(product, action);
  const warnings = [
    "Preview only. No wallet signature is requested.",
    "No transaction is sent.",
    "Review calldata, contract and chain before future execution."
  ];

  if (status === "unsupported_chain") warnings.push("Wallet chain does not match this product listing.");
  if (status === "missing_contract") warnings.push("Production marketplace contract metadata is missing.");

  return {
    productId: product.id,
    action,
    status,
    walletAddress: wallet.address,
    chainId: wallet.chainId,
    chainName: wallet.chainName,
    contractAddress,
    value: getValue(product, action, bidAmount),
    calldata: getCalldata(product, action, bidAmount),
    gasLimitPreview: null,
    permissionVisibility: {
      requiresWalletConnection: true,
      requiresSupportedChain: true,
      requiresContractAddress: true,
      requiresSignature: false,
      requiresTransactionSend: false
    },
    risk: {
      level: status === "preview_ready" ? "medium" : "high",
      warnings
    },
    previewOnly: true,
    signatureExecutionEnabled: false,
    transactionExecutionEnabled: false,
    contractWriteEnabled: false,
    sendTransactionEnabled: false,
    reasons: []
  };
}

export async function prepareSignatureIntent(
  product: Product,
  wallet: WalletRuntimeState,
  action: SignatureIntentAction,
  options: { bidAmount?: number } = {},
  env: WalletRuntimeEnvironment = getBrowserEnvironment()
): Promise<SignatureIntentSnapshot> {
  if (wallet.disconnected || !wallet.address) {
    return {
      ...baseSnapshot(product, wallet, action, "wallet_disconnected", options.bidAmount),
      reasons: ["wallet-disconnected"]
    };
  }

  if (!wallet.supportedChain || wallet.restrictedChain || !productSupportsWalletChain(product, wallet)) {
    return {
      ...baseSnapshot(product, wallet, action, "unsupported_chain", options.bidAmount),
      reasons: ["wallet-chain-not-supported-for-intent"]
    };
  }

  const contractAddress = getContractAddress(product, action);
  if (!isValidEvmAddress(contractAddress)) {
    return {
      ...baseSnapshot(product, wallet, action, "missing_contract", options.bidAmount),
      reasons: ["contract-address-not-production-readable"]
    };
  }

  const snapshot = {
    ...baseSnapshot(product, wallet, action, "preview_ready", options.bidAmount),
    reasons: ["signature-intent-preview-ready"]
  };

  const provider = await resolveReadonlyProvider(env);
  if (!provider) return snapshot;

  try {
    const gas = await provider.request({
      method: "eth_estimateGas",
      params: [{ from: wallet.address, to: contractAddress, value: `0x${BigInt(snapshot.value).toString(16)}`, data: snapshot.calldata }]
    });
    return {
      ...snapshot,
      gasLimitPreview: typeof gas === "string" ? BigInt(gas).toString() : null
    };
  } catch {
    return {
      ...snapshot,
      status: "gas_preview_unavailable",
      risk: {
        level: "medium",
        warnings: [...snapshot.risk.warnings, "Gas preview unavailable from readonly provider."]
      },
      reasons: [...snapshot.reasons, "gas-preview-unavailable"]
    };
  }
}

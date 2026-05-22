import type { Eip1193Provider, WalletRuntimeEnvironment, WalletRuntimeState } from "../../../services/walletRuntime";
import type { Product } from "../types/marketplace";
import { isValidEvmAddress, type NftOwnershipSnapshot } from "./nftOwnershipRuntime";

export type WalletSecurityStatus = "secure_preview" | "warning" | "danger" | "not_ready";
export type ApprovalVisibilityStatus = "not_applicable" | "not_checked" | "approved_for_all" | "not_approved" | "read_error";

export type WalletSecuritySnapshot = {
  productId: string;
  status: WalletSecurityStatus;
  walletAddress: string | null;
  chainId: number | null;
  chainName: string;
  checkedAt: string;
  chainProtection: {
    supported: boolean;
    mismatch: boolean;
    restricted: boolean;
    reason: string | null;
  };
  assetProtection: {
    contractAddress: string | null;
    contractValid: boolean;
    tokenIdValid: boolean;
    maliciousContractWarning: boolean;
    invalidNftRuntime: boolean;
    warnings: string[];
  };
  approvalVisibility: {
    operatorAddress: string | null;
    approvalReadEnabled: boolean;
    approvedForAll: boolean | null;
    status: ApprovalVisibilityStatus;
    dangerousPermissionWarning: boolean;
    warnings: string[];
  };
  ownershipSecurity: {
    fakeOwnershipSuspected: boolean;
    staleOwnershipVisible: boolean;
    invalidOwnershipRuntime: boolean;
    ownershipStatus: NftOwnershipSnapshot["status"] | "not_available";
    warnings: string[];
  };
  permissionVisibility: {
    canPreviewPurchase: boolean;
    canPreviewBid: boolean;
    canRequestSignature: false;
    canSendTransaction: false;
    canWriteContract: false;
  };
  readonlyProtection: {
    approvalRevocationEnabled: false;
    transactionBlockingEnabled: false;
    ownershipMutationEnabled: false;
  };
  warnings: string[];
};

const CHAIN_NAMES_BY_ID: Record<number, string> = {
  1: "Ethereum",
  56: "BNB",
  137: "Polygon",
  1666600000: "Harmony",
  42161: "Arbitrum"
};

const APPROVAL_FOR_ALL_SELECTOR = "0xe985e9c5";
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

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

function padAddress(address: string) {
  return address.toLowerCase().replace(/^0x/, "").padStart(64, "0");
}

export function encodeIsApprovedForAllCall(owner: string, operator: string) {
  return `${APPROVAL_FOR_ALL_SELECTOR}${padAddress(owner)}${padAddress(operator)}`;
}

function decodeBool(result: unknown): boolean | null {
  if (typeof result !== "string" || !/^0x[a-fA-F0-9]+$/.test(result)) return null;
  return BigInt(result) !== 0n;
}

function productSupportsWalletChain(product: Product, wallet: WalletRuntimeState) {
  const chainName = wallet.chainId ? CHAIN_NAMES_BY_ID[wallet.chainId] : null;
  return Boolean(chainName && product.supportedChains.includes(chainName as Product["supportedChains"][number]));
}

function getOperatorAddress(product: Product) {
  return product.auctionContractAddress ?? product.marketplaceContractAddress ?? null;
}

function getAssetWarnings(product: Product) {
  const warnings: string[] = [];
  const contractValid = isValidEvmAddress(product.contractAddress);
  const tokenIdValid = Boolean(product.tokenId && /^\d+$/.test(product.tokenId));

  if (product.contractAddress?.startsWith("mock:")) warnings.push("Symbolic mock contract cannot be used for production ownership security.");
  if (product.contractAddress?.toLowerCase() === ZERO_ADDRESS) warnings.push("Zero-address NFT contract is invalid.");
  if (product.nftBound && !contractValid) warnings.push("NFT-bound product is missing a production-shaped EVM contract.");
  if (product.nftBound && !tokenIdValid) warnings.push("NFT-bound product is missing a numeric token ID.");
  if (product.governanceStatus === "restricted" || product.governanceStatus === "suspended") warnings.push("Governance standing restricts this asset.");

  return {
    contractAddress: product.contractAddress ?? null,
    contractValid,
    tokenIdValid,
    warnings,
    maliciousContractWarning: warnings.some((warning) => warning.includes("Zero-address") || warning.includes("restricts")),
    invalidNftRuntime: product.nftBound && (!contractValid || !tokenIdValid)
  };
}

function getOwnershipWarnings(ownership?: NftOwnershipSnapshot) {
  const ownershipStatus: NftOwnershipSnapshot["status"] | "not_available" = ownership?.status ?? "not_available";
  const fakeOwnershipSuspected = ownershipStatus === "ownership_mismatch";
  const staleOwnershipVisible =
    ownershipStatus === "not_available" ||
    ownershipStatus === "read_error" ||
    ownershipStatus === "unreadable_contract" ||
    ownershipStatus === "disconnected_wallet" ||
    ownershipStatus === "unsupported_chain";
  const invalidOwnershipRuntime = ownershipStatus === "unreadable_contract" || ownershipStatus === "offchain_license";
  const warnings: string[] = [];

  if (fakeOwnershipSuspected) warnings.push("Connected wallet does not match readonly ownership result.");
  if (staleOwnershipVisible) warnings.push("Ownership state is unavailable, stale or not contract-verifiable.");
  if (invalidOwnershipRuntime) warnings.push("NFT runtime cannot verify this asset as a production NFT.");

  return {
    fakeOwnershipSuspected,
    staleOwnershipVisible,
    invalidOwnershipRuntime,
    ownershipStatus,
    warnings
  };
}

function statusFromWarnings(warnings: string[], approvedForAll: boolean | null): WalletSecurityStatus {
  if (warnings.some((warning) => warning.includes("Zero-address") || warning.includes("does not match") || warning.includes("restricts"))) return "danger";
  if (approvedForAll) return "warning";
  if (warnings.length > 0) return "warning";
  return "secure_preview";
}

export async function evaluateWalletSecurity(
  product: Product,
  wallet: WalletRuntimeState,
  ownership?: NftOwnershipSnapshot,
  env: WalletRuntimeEnvironment = getBrowserEnvironment()
): Promise<WalletSecuritySnapshot> {
  const supported = !wallet.disconnected && Boolean(wallet.supportedChain) && productSupportsWalletChain(product, wallet);
  const chainProtection = {
    supported,
    mismatch: !wallet.disconnected && !supported,
    restricted: Boolean(wallet.restrictedChain),
    reason: wallet.disconnected ? "wallet-disconnected" : supported ? null : "wallet-chain-does-not-match-product"
  };
  const assetProtection = getAssetWarnings(product);
  const ownershipSecurity = getOwnershipWarnings(ownership);
  const operatorAddress = getOperatorAddress(product);
  let approvedForAll: boolean | null = null;
  let approvalStatus: ApprovalVisibilityStatus = "not_applicable";
  let approvalReadEnabled = false;
  const approvalWarnings: string[] = [];

  if (product.nftBound && wallet.address && isValidEvmAddress(product.contractAddress) && isValidEvmAddress(operatorAddress) && supported) {
    const provider = await resolveReadonlyProvider(env);
    if (provider) {
      approvalReadEnabled = true;
      try {
        const result = await provider.request({
          method: "eth_call",
          params: [{ to: product.contractAddress, data: encodeIsApprovedForAllCall(wallet.address, operatorAddress) }, "latest"]
        });
        approvedForAll = decodeBool(result);
        approvalStatus = approvedForAll ? "approved_for_all" : "not_approved";
        if (approvedForAll) approvalWarnings.push("Operator has approval-for-all over this NFT collection. Review this permission before future execution.");
      } catch {
        approvalStatus = "read_error";
        approvalWarnings.push("Approval visibility read failed.");
      }
    } else {
      approvalStatus = "not_checked";
      approvalWarnings.push("Approval visibility requires a readonly provider.");
    }
  } else if (product.nftBound) {
    approvalStatus = "not_checked";
    approvalWarnings.push("Approval visibility requires wallet, supported chain, NFT contract and operator contract.");
  }

  const warnings = [
    ...(chainProtection.reason ? [chainProtection.reason] : []),
    ...assetProtection.warnings,
    ...approvalWarnings,
    ...ownershipSecurity.warnings
  ];

  return {
    productId: product.id,
    status: statusFromWarnings(warnings, approvedForAll),
    walletAddress: wallet.address,
    chainId: wallet.chainId,
    chainName: wallet.chainName,
    checkedAt: new Date().toISOString(),
    chainProtection,
    assetProtection,
    approvalVisibility: {
      operatorAddress,
      approvalReadEnabled,
      approvedForAll,
      status: approvalStatus,
      dangerousPermissionWarning: Boolean(approvedForAll),
      warnings: approvalWarnings
    },
    ownershipSecurity,
    permissionVisibility: {
      canPreviewPurchase: supported && !assetProtection.invalidNftRuntime,
      canPreviewBid: supported && !assetProtection.invalidNftRuntime && product.listingType !== "license-preview",
      canRequestSignature: false,
      canSendTransaction: false,
      canWriteContract: false
    },
    readonlyProtection: {
      approvalRevocationEnabled: false,
      transactionBlockingEnabled: false,
      ownershipMutationEnabled: false
    },
    warnings
  };
}

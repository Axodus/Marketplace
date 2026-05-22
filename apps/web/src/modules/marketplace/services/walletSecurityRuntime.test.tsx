import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { WalletSecurityPanel } from "../components/WalletSecurityPanel";
import type { Product } from "../types/marketplace";
import type { NftOwnershipSnapshot } from "./nftOwnershipRuntime";
import type { Eip1193Provider, WalletRuntimeState } from "../../../services/walletRuntime";
import { encodeIsApprovedForAllCall, evaluateWalletSecurity } from "./walletSecurityRuntime";

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
  id: "product-wallet-security",
  title: "Wallet Security",
  slug: "wallet-security",
  category: "Digital Assets",
  subcategory: "Access",
  sellerId: "seller-test",
  description: "Wallet security test",
  shortDescription: "Wallet security test",
  tags: ["security"],
  images: [],
  media: [],
  version: "1.0.0",
  status: "listed",
  governanceStatus: "compliant",
  constitutionalStanding: "aligned",
  visibility: "public",
  pricing: { amount: 1, currency: "ETH", settlementMode: "future-on-chain" },
  acceptedCurrencies: ["ETH"],
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

const ownership: NftOwnershipSnapshot = {
  productId: product.id,
  status: "verified_owner",
  kind: "access-nft",
  verified: true,
  walletAddress: wallet.address,
  chainId: wallet.chainId,
  chainName: wallet.chainName,
  supportedChain: true,
  requiredChains: product.supportedChains,
  tokenStandard: product.tokenStandard,
  contractAddress: product.contractAddress!,
  tokenId: product.tokenId!,
  readMethod: "ownerOf",
  ownerAddress: wallet.address,
  balance: null,
  contractReadEnabled: true,
  contractWriteEnabled: false,
  mintTransferEnabled: false,
  reasons: ["erc721-owner-verified"]
};

function createProvider(result = "0x0") {
  const calls: Array<{ method: string; params?: unknown[] | Record<string, unknown> }> = [];
  const provider: Eip1193Provider = {
    async request(args) {
      calls.push(args);
      if (args.method === "eth_call") return result;
      throw new Error(`Unexpected method ${args.method}`);
    }
  };
  return { provider, calls };
}

describe("walletSecurityRuntime", () => {
  it("reads approval visibility and warns on approval-for-all without revoking or sending transactions", async () => {
    const { provider, calls } = createProvider("0x1");

    const snapshot = await evaluateWalletSecurity(product, wallet, ownership, { ethereum: provider });

    expect(snapshot.approvalVisibility.status).toBe("approved_for_all");
    expect(snapshot.approvalVisibility.dangerousPermissionWarning).toBe(true);
    expect(snapshot.status).toBe("warning");
    expect(snapshot.readonlyProtection.approvalRevocationEnabled).toBe(false);
    expect(snapshot.permissionVisibility.canSendTransaction).toBe(false);
    expect(calls).toEqual([
      {
        method: "eth_call",
        params: [{ to: product.contractAddress, data: encodeIsApprovedForAllCall(wallet.address!, product.marketplaceContractAddress!) }, "latest"]
      }
    ]);
    expect(calls.some((call) => call.method === "eth_sendTransaction")).toBe(false);
  });

  it("protects against chain mismatch and invalid mock NFT runtime without approval reads", async () => {
    const { provider, calls } = createProvider("0x1");
    const insecureProduct = { ...product, contractAddress: "mock:asset", tokenId: "AXD-1" };

    const snapshot = await evaluateWalletSecurity(insecureProduct, { ...wallet, chainId: 1, chainName: "Ethereum" }, { ...ownership, status: "unreadable_contract" }, { ethereum: provider });

    expect(snapshot.chainProtection.mismatch).toBe(true);
    expect(snapshot.assetProtection.invalidNftRuntime).toBe(true);
    expect(snapshot.ownershipSecurity.invalidOwnershipRuntime).toBe(true);
    expect(snapshot.permissionVisibility.canPreviewPurchase).toBe(false);
    expect(calls).toHaveLength(0);
  });

  it("detects fake ownership from mismatch state", async () => {
    const snapshot = await evaluateWalletSecurity(product, wallet, { ...ownership, status: "ownership_mismatch", verified: false }, { ethereum: createProvider("0x0").provider });

    expect(snapshot.status).toBe("danger");
    expect(snapshot.ownershipSecurity.fakeOwnershipSuspected).toBe(true);
    expect(snapshot.warnings.join(" ")).toContain("does not match");
  });

  it("renders approval and warning visibility", async () => {
    const snapshot = await evaluateWalletSecurity(product, wallet, ownership, { ethereum: createProvider("0x1").provider });
    const html = renderToStaticMarkup(<WalletSecurityPanel snapshot={snapshot} />);

    expect(html).toContain("Security warning");
    expect(html).toContain("Dangerous approval visible");
    expect(html).toContain("No approval revocation");
    expect(html).toContain("No sendTransaction");
  });
});

import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { NftOwnershipPanel } from "../components/NftOwnershipPanel";
import type { Product } from "../types/marketplace";
import type { Eip1193Provider, WalletRuntimeState } from "../../../services/walletRuntime";
import { encodeErc1155BalanceOfCall, encodeOwnerOfCall, verifyNftOwnership } from "./nftOwnershipRuntime";

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
  id: "product-real-erc721",
  title: "Real ERC721 Read",
  slug: "real-erc721-read",
  category: "Digital Assets",
  subcategory: "Access",
  sellerId: "seller-test",
  description: "Readonly ownership test",
  shortDescription: "Readonly ownership test",
  tags: ["erc721"],
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
  listingType: "fixed",
  bridgeReadiness: {
    layerZeroReady: false,
    sourceChain: "Polygon",
    destinationChains: [],
    notes: "test"
  },
  signedUrlPreviewAvailable: false
};

function createProvider(result: string) {
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

function encodedAddress(address: string) {
  return `0x${address.toLowerCase().replace(/^0x/, "").padStart(64, "0")}`;
}

describe("nftOwnershipRuntime", () => {
  it("reads ERC721 ownerOf without requesting writes or signatures", async () => {
    const { provider, calls } = createProvider(encodedAddress(wallet.address!));

    const snapshot = await verifyNftOwnership(product, wallet, { ethereum: provider });

    expect(snapshot.status).toBe("verified_owner");
    expect(snapshot.verified).toBe(true);
    expect(snapshot.readMethod).toBe("ownerOf");
    expect(snapshot.contractReadEnabled).toBe(true);
    expect(snapshot.contractWriteEnabled).toBe(false);
    expect(snapshot.mintTransferEnabled).toBe(false);
    expect(calls).toEqual([
      {
        method: "eth_call",
        params: [{ to: product.contractAddress, data: encodeOwnerOfCall("7") }, "latest"]
      }
    ]);
  });

  it("reads ERC1155 balanceOf and detects ownership mismatch", async () => {
    const erc1155 = { ...product, id: "product-real-erc1155", tokenStandard: "ERC1155" as const };
    const { provider, calls } = createProvider("0x0");

    const snapshot = await verifyNftOwnership(erc1155, wallet, { ethereum: provider });

    expect(snapshot.status).toBe("ownership_mismatch");
    expect(snapshot.verified).toBe(false);
    expect(snapshot.readMethod).toBe("balanceOf");
    expect(snapshot.balance).toBe("0");
    expect(calls[0]).toEqual({
      method: "eth_call",
      params: [{ to: product.contractAddress, data: encodeErc1155BalanceOfCall(wallet.address!, "7") }, "latest"]
    });
  });

  it("handles disconnected wallet and unsupported chain without contract reads", async () => {
    const { provider, calls } = createProvider("0x1");

    const disconnected = await verifyNftOwnership(product, { ...wallet, address: null, disconnected: true, status: "disconnected" }, { ethereum: provider });
    const unsupported = await verifyNftOwnership(product, { ...wallet, chainId: 1, chainName: "Ethereum" }, { ethereum: provider });

    expect(disconnected.status).toBe("disconnected_wallet");
    expect(unsupported.status).toBe("unsupported_chain");
    expect(calls).toHaveLength(0);
  });

  it("renders verified ownership and mismatch states", async () => {
    const verified = await verifyNftOwnership(product, wallet, { ethereum: createProvider(encodedAddress(wallet.address!)).provider });
    const mismatch = await verifyNftOwnership(product, wallet, { ethereum: createProvider(encodedAddress("0x9999999999999999999999999999999999999999")).provider });

    const verifiedHtml = renderToStaticMarkup(<NftOwnershipPanel snapshot={verified} />);
    const mismatchHtml = renderToStaticMarkup(<NftOwnershipPanel snapshot={mismatch} />);

    expect(verifiedHtml).toContain("Verified ownership");
    expect(verifiedHtml).toContain("No transfer");
    expect(mismatchHtml).toContain("Ownership mismatch");
  });
});

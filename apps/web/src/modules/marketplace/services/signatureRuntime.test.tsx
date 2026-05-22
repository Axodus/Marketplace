import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { SignatureIntentPanel } from "../components/SignatureIntentPanel";
import type { Product } from "../types/marketplace";
import type { Eip1193Provider, WalletRuntimeState } from "../../../services/walletRuntime";
import { encodeBuyNowCalldata, encodePlaceBidCalldata, prepareSignatureIntent } from "./signatureRuntime";

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
  id: "product-signature-intent",
  title: "Signature Intent",
  slug: "signature-intent",
  category: "Digital Assets",
  subcategory: "Access",
  sellerId: "seller-test",
  description: "Signature preview test",
  shortDescription: "Signature preview test",
  tags: ["signature"],
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
  auctionContractAddress: "0x0000000000000000000000000000000000000aaa",
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

function createProvider(result = "0x5208") {
  const calls: Array<{ method: string; params?: unknown[] | Record<string, unknown> }> = [];
  const provider: Eip1193Provider = {
    async request(args) {
      calls.push(args);
      if (args.method === "eth_estimateGas") return result;
      throw new Error(`Unexpected method ${args.method}`);
    }
  };
  return { provider, calls };
}

describe("signatureRuntime", () => {
  it("prepares buy-now transaction payload, calldata and gas preview without sending transactions", async () => {
    const { provider, calls } = createProvider("0x5208");

    const snapshot = await prepareSignatureIntent(product, wallet, "buy-now", {}, { ethereum: provider });

    expect(snapshot.status).toBe("preview_ready");
    expect(snapshot.calldata).toBe(encodeBuyNowCalldata("9"));
    expect(snapshot.gasLimitPreview).toBe("21000");
    expect(snapshot.value).toBe("1000000000000000000");
    expect(snapshot.signatureExecutionEnabled).toBe(false);
    expect(snapshot.transactionExecutionEnabled).toBe(false);
    expect(snapshot.sendTransactionEnabled).toBe(false);
    expect(calls.map((call) => call.method)).toEqual(["eth_estimateGas"]);
    expect(calls.some((call) => call.method === "eth_sendTransaction" || call.method === "personal_sign")).toBe(false);
  });

  it("prepares bid calldata and permission visibility without signature requirements", async () => {
    const auctionProduct = { ...product, listingType: "english-auction" as const };
    const snapshot = await prepareSignatureIntent(auctionProduct, wallet, "place-bid", { bidAmount: 2 }, { ethereum: createProvider().provider });

    expect(snapshot.calldata).toBe(encodePlaceBidCalldata("9", 2_000_000));
    expect(snapshot.contractAddress).toBe(product.auctionContractAddress);
    expect(snapshot.permissionVisibility.requiresSignature).toBe(false);
    expect(snapshot.permissionVisibility.requiresTransactionSend).toBe(false);
  });

  it("surfaces disconnected, unsupported chain and missing contract risks without gas calls", async () => {
    const { provider, calls } = createProvider();

    const disconnected = await prepareSignatureIntent(product, { ...wallet, address: null, disconnected: true, status: "disconnected" }, "buy-now", {}, { ethereum: provider });
    const unsupported = await prepareSignatureIntent(product, { ...wallet, chainId: 1, chainName: "Ethereum" }, "buy-now", {}, { ethereum: provider });
    const missing = await prepareSignatureIntent({ ...product, marketplaceContractAddress: undefined }, wallet, "buy-now", {}, { ethereum: provider });

    expect(disconnected.status).toBe("wallet_disconnected");
    expect(unsupported.status).toBe("unsupported_chain");
    expect(missing.status).toBe("missing_contract");
    expect(calls).toHaveLength(0);
  });

  it("renders confirmation preview warnings and calldata", async () => {
    const snapshot = await prepareSignatureIntent(product, wallet, "buy-now", {}, { ethereum: createProvider().provider });
    const html = renderToStaticMarkup(<SignatureIntentPanel snapshot={snapshot} />);

    expect(html).toContain("Preview ready");
    expect(html).toContain("Calldata");
    expect(html).toContain("No sendTransaction");
    expect(html).toContain("No wallet signature is requested");
  });
});

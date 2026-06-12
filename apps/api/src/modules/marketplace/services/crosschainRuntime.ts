import { createHash } from "node:crypto";
import type {
  BridgeExecutionRequest,
  BridgeRuntime,
  CrosschainInventoryRecord,
  CrosschainInventorySyncRequest,
  CrosschainMessageRequest,
  CrosschainMessageRuntime,
  CrosschainRuntimeSnapshot,
  MarketplaceStore,
  ProductEntity
} from "../dto/contracts.js";

export function prepareCrosschainMessage(store: MarketplaceStore, input: CrosschainMessageRequest): CrosschainMessageRuntime {
  const product = findProduct(store, input.productId);
  const reasonCodes = getMessageReasonCodes(product, input.sourceChain, input.targetChain);
  const status: CrosschainMessageRuntime["status"] = reasonCodes.length > 0 ? "blocked" : "prepared";
  return {
    id: `crosschain-message-${crypto.randomUUID()}`,
    productId: product?.id ?? input.productId,
    tenantId: getTenantId(product),
    protocol: "LayerZero",
    sourceChain: input.sourceChain,
    targetChain: input.targetChain,
    payloadHash: hashPayload({
      productId: product?.id ?? input.productId,
      sourceChain: input.sourceChain,
      targetChain: input.targetChain,
      payload: input.payload ?? {}
    }),
    status,
    reasonCodes,
    bridgeReady: status === "prepared",
    layerZeroMessagingEnabled: true,
    externalMessagingEnabled: false,
    walletExecutionEnabled: false,
    blockchainWritesEnabled: false,
    createdAt: new Date().toISOString()
  };
}

export function executeBridgeRuntime(store: MarketplaceStore, input: BridgeExecutionRequest): BridgeRuntime {
  const message = (store.crosschainMessages ?? []).find((item) => item.id === input.messageId);
  const product = message ? findProduct(store, message.productId) : undefined;
  const reasonCodes = getBridgeReasonCodes(input, message, product);
  const status: BridgeRuntime["status"] = reasonCodes.length > 0 ? "blocked" : "bridged";
  const holder = input.holder ?? latestHolder(store, product?.id) ?? "0xCrosschainHolder...A11C";
  return {
    id: `bridge-runtime-${crypto.randomUUID()}`,
    messageId: input.messageId,
    productId: message?.productId ?? "unknown",
    tenantId: message?.tenantId ?? getTenantId(product),
    holder,
    sourceChain: message?.sourceChain ?? "unknown",
    targetChain: message?.targetChain ?? "unknown",
    status,
    reasonCodes,
    ownership: {
      sourceOwner: status === "bridged" ? holder : null,
      targetOwner: status === "bridged" ? holder : null,
      verificationStatus: status === "bridged" ? "synchronized" : "blocked"
    },
    inventory: {
      sourceChainAvailable: Boolean(product && isSupportedChain(product, message?.sourceChain ?? "")),
      targetChainAvailable: Boolean(product && isSupportedChain(product, message?.targetChain ?? "")),
      synchronized: status === "bridged"
    },
    layerZeroMessageId: status === "bridged" ? `lz-${message?.payloadHash.slice(0, 16)}` : null,
    bridgeRuntimeEnabled: true,
    externalBridgeEnabled: false,
    walletExecutionEnabled: false,
    blockchainWritesEnabled: false,
    createdAt: new Date().toISOString()
  };
}

export function synchronizeCrosschainInventory(store: MarketplaceStore, input: CrosschainInventorySyncRequest = {}): CrosschainInventoryRecord[] {
  const products = store.products.filter((product) => {
    if (input.productId && product.id !== input.productId && product.slug !== input.productId) return false;
    return getSupportedChains(product).length > 1;
  });

  const records = products.map((product) => buildInventoryRecord(store, product, input));
  store.crosschainInventory = [
    ...records,
    ...(store.crosschainInventory ?? []).filter((record) => !records.some((item) => item.productId === record.productId))
  ].slice(0, 100);
  return records;
}

export function buildCrosschainRuntimeSnapshot(store: MarketplaceStore): CrosschainRuntimeSnapshot {
  return {
    id: `crosschain-snapshot-${crypto.randomUUID()}`,
    messages: store.crosschainMessages ?? [],
    bridges: store.bridgeRuntimes ?? [],
    inventory: store.crosschainInventory ?? [],
    metrics: {
      messagesPrepared: (store.crosschainMessages ?? []).filter((message) => message.status === "prepared").length,
      messagesBlocked: (store.crosschainMessages ?? []).filter((message) => message.status === "blocked").length,
      bridgesExecuted: (store.bridgeRuntimes ?? []).filter((bridge) => bridge.status === "bridged").length,
      bridgesBlocked: (store.bridgeRuntimes ?? []).filter((bridge) => bridge.status === "blocked").length,
      synchronizedInventory: (store.crosschainInventory ?? []).filter((record) => record.status === "synchronized").length,
      partialInventory: (store.crosschainInventory ?? []).filter((record) => record.status === "partial").length
    },
    layerZeroRuntimeEnabled: true,
    bridgeRuntimeEnabled: true,
    inventorySynchronizationEnabled: true,
    externalMessagingEnabled: false,
    externalBridgeEnabled: false,
    walletExecutionEnabled: false,
    blockchainWritesEnabled: false,
    generatedAt: new Date().toISOString()
  };
}

function buildInventoryRecord(store: MarketplaceStore, product: ProductEntity, input: CrosschainInventorySyncRequest): CrosschainInventoryRecord {
  const chains = getSupportedChains(product).filter((chain) => {
    if (input.sourceChain && chain !== input.sourceChain && chain !== input.targetChain) return false;
    return true;
  });
  const productBridges = (store.bridgeRuntimes ?? []).filter((bridge) => bridge.productId === product.id && bridge.status === "bridged");
  const synchronizedChains = [...new Set(productBridges.flatMap((bridge) => [bridge.sourceChain, bridge.targetChain]).filter((chain) => chains.includes(chain)))];
  const bridgeReadyChains = getBridgeReadyChains(product).filter((chain) => chains.includes(chain));
  const reasonCodes: string[] = [];
  if (bridgeReadyChains.length < 2) reasonCodes.push("layerzero-bridge-readiness-incomplete");
  if (product.governanceStatus === "restricted" || product.governanceStatus === "suspended") reasonCodes.push(`governance-${product.governanceStatus}`);
  const status: CrosschainInventoryRecord["status"] =
    reasonCodes.length > 0 ? "blocked" : synchronizedChains.length >= 2 ? "synchronized" : "partial";

  return {
    id: `crosschain-inventory-${crypto.randomUUID()}`,
    productId: product.id,
    tenantId: getTenantId(product),
    chains,
    synchronizedChains,
    bridgeReadyChains,
    ownershipHolders: [...new Set(productBridges.map((bridge) => bridge.holder))],
    status,
    reasonCodes,
    updatedAt: new Date().toISOString()
  };
}

function getMessageReasonCodes(product: ProductEntity | undefined, sourceChain: string, targetChain: string) {
  const reasons: string[] = [];
  if (!product) reasons.push("product-not-found");
  if (product && !isLayerZeroReady(product)) reasons.push("layerzero-not-ready");
  if (product && !isSupportedChain(product, sourceChain)) reasons.push("unsupported-source-chain");
  if (product && !isSupportedChain(product, targetChain)) reasons.push("unsupported-target-chain");
  if (sourceChain === targetChain) reasons.push("same-chain-message-not-required");
  if (product && (product.governanceStatus === "restricted" || product.governanceStatus === "suspended")) reasons.push(`governance-${product.governanceStatus}`);
  return reasons;
}

function getBridgeReasonCodes(input: BridgeExecutionRequest, message?: CrosschainMessageRuntime, product?: ProductEntity) {
  const reasons: string[] = [];
  if (input.controlledRollout !== true) reasons.push("controlled-rollout-required");
  if (!message) reasons.push("crosschain-message-not-found");
  if (message && message.status !== "prepared") reasons.push("crosschain-message-not-prepared");
  if (!product) reasons.push("product-not-found");
  if (product && (product.governanceStatus === "restricted" || product.governanceStatus === "suspended")) reasons.push(`governance-${product.governanceStatus}`);
  return reasons;
}

function latestHolder(store: MarketplaceStore, productId?: string) {
  return (store.licenseRuntimes ?? []).find((license) => license.productId === productId)?.holder;
}

function findProduct(store: MarketplaceStore, productId: string) {
  return store.products.find((product) => product.id === productId || product.slug === productId);
}

function getTenantId(product?: ProductEntity) {
  return typeof product?.tenantId === "string" ? product.tenantId : "tenant-axodus-dao";
}

function getSupportedChains(product: ProductEntity) {
  return Array.isArray(product.supportedChains) ? product.supportedChains.filter((chain): chain is string => typeof chain === "string") : [];
}

function getBridgeReadyChains(product: ProductEntity) {
  const readiness = product.bridgeReadiness as { sourceChain?: string; destinationChains?: string[]; layerZeroReady?: boolean } | undefined;
  if (!readiness?.layerZeroReady) return [];
  return [
    typeof readiness.sourceChain === "string" ? readiness.sourceChain : null,
    ...(Array.isArray(readiness.destinationChains) ? readiness.destinationChains : [])
  ].filter((chain): chain is string => Boolean(chain));
}

function isSupportedChain(product: ProductEntity, chain: string) {
  return getSupportedChains(product).includes(chain);
}

function isLayerZeroReady(product: ProductEntity) {
  const readiness = product.bridgeReadiness as { layerZeroReady?: boolean } | undefined;
  return readiness?.layerZeroReady === true;
}

function hashPayload(payload: Record<string, unknown>) {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

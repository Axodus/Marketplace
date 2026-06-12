import { createHmac, randomBytes } from "node:crypto";
import type { EntitlementEnforcementRecord, MarketplaceStore, ProductEntity, SecureDeliveryRuntime, SecureDeliverySnapshot } from "../dto/contracts.js";
import { evaluateEntitlementEnforcement } from "./entitlementEnforcementRuntime.js";

const ephemeralDeliveryKey = randomBytes(32).toString("hex");
const ACCESS_TTL_SECONDS = 20 * 60;

function deliveryKey() {
  const envKey = process.env.MARKETPLACE_DELIVERY_SECRET;
  return envKey && envKey.trim() ? envKey.trim() : ephemeralDeliveryKey;
}

function valueAsString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function findProduct(store: MarketplaceStore, productId: string) {
  return store.products.find((product) => product.id === productId || product.slug === productId);
}

function defaultMode(product?: ProductEntity): SecureDeliveryRuntime["mode"] {
  const deliveryType = valueAsString(product?.deliveryType).toLowerCase();
  const category = valueAsString(product?.category).toLowerCase();
  if (deliveryType.includes("mcp") || category.includes("mcp")) return "acs_package";
  if (deliveryType.includes("stream")) return "secure_stream";
  return "encrypted_download";
}

function digest(parts: string[]) {
  return createHmac("sha256", deliveryKey()).update(parts.join(":")).digest("hex");
}

function token(prefix: string, enforcement: EntitlementEnforcementRecord, mode: SecureDeliveryRuntime["mode"], expiresAt: string) {
  return `${prefix}_${digest([enforcement.id, enforcement.productId, enforcement.holder, mode, expiresAt]).slice(0, 48)}`;
}

export function buildSecureDeliveryRuntime(
  store: MarketplaceStore,
  input: { productId: string; holder?: string; daoId?: string; mode?: SecureDeliveryRuntime["mode"] }
): SecureDeliveryRuntime {
  const product = findProduct(store, input.productId);
  const enforcement = evaluateEntitlementEnforcement(store, input);
  const mode = input.mode ?? defaultMode(product);
  const allowed = enforcement.deliveryAllowed;
  const now = new Date();
  const expiresAt = allowed ? new Date(now.getTime() + ACCESS_TTL_SECONDS * 1000).toISOString() : null;
  const base = [enforcement.productId, enforcement.holder, mode, expiresAt ?? "blocked"];
  const contentDigest = allowed ? digest([...base, "content"]) : null;
  const manifestDigest = allowed ? digest([...base, "manifest"]) : null;

  return {
    id: `secure-delivery-${crypto.randomUUID()}`,
    productId: enforcement.productId,
    holder: enforcement.holder,
    mode,
    enforcementId: enforcement.id,
    status: allowed ? "prepared" : "blocked",
    encryptedDownload: {
      enabled: allowed && mode === "encrypted_download",
      algorithm: "AES-256-GCM",
      contentDigest: mode === "encrypted_download" ? contentDigest : null,
      keyWrap: "HMAC-SHA256",
      downloadToken: allowed && mode === "encrypted_download" && expiresAt ? token("dl", enforcement, mode, expiresAt) : null
    },
    secureStream: {
      enabled: allowed && mode === "secure_stream",
      protocol: "HLS-preview",
      streamToken: allowed && mode === "secure_stream" && expiresAt ? token("stream", enforcement, mode, expiresAt) : null,
      segmentTtlSeconds: 90
    },
    acsPackage: {
      enabled: allowed && mode === "acs_package",
      packageId: allowed && mode === "acs_package" ? `acs-package-${enforcement.productId}` : null,
      manifestDigest: mode === "acs_package" ? manifestDigest : null,
      provisioningEnabled: false
    },
    access: {
      expiresAt,
      reasonCodes: allowed ? ["secure-delivery-prepared", "entitlement-enforcement-allowed"] : Object.values(enforcement.checks).flatMap((check) => check.reasonCodes)
    },
    productionDeliveryEnabled: false,
    externalObjectStoreEnabled: false,
    createdAt: now.toISOString()
  };
}

export function buildSecureDeliverySnapshot(records: SecureDeliveryRuntime[]): SecureDeliverySnapshot {
  return {
    id: `secure-delivery-snapshot-${crypto.randomUUID()}`,
    records,
    metrics: {
      prepared: records.filter((record) => record.status === "prepared").length,
      blocked: records.filter((record) => record.status === "blocked").length,
      encryptedDownloads: records.filter((record) => record.encryptedDownload.enabled).length,
      secureStreams: records.filter((record) => record.secureStream.enabled).length,
      acsPackages: records.filter((record) => record.acsPackage.enabled).length
    },
    productionDeliveryEnabled: false,
    generatedAt: new Date().toISOString()
  };
}

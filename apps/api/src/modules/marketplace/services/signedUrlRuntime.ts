import { createHmac, randomBytes } from "node:crypto";
import type { GreenfieldAuthRuntime, MarketplaceStore, SignedUrlRuntime, SignedUrlRuntimeSnapshot } from "../dto/contracts.js";
import { buildGreenfieldAuthRuntime } from "./greenfieldAuthRuntime.js";

const ephemeralSigningKey = randomBytes(32).toString("hex");
const DEFAULT_TTL_SECONDS = 30 * 60;
const MAX_TTL_SECONDS = 60 * 60;

function signingKey() {
  const envKey = process.env.MARKETPLACE_SIGNED_URL_SECRET;
  return {
    key: envKey && envKey.trim() ? envKey.trim() : ephemeralSigningKey,
    source: envKey && envKey.trim() ? "env" : "runtime-ephemeral"
  } as const;
}

function normalizeTtl(ttlSeconds?: number) {
  const ttl = Number(ttlSeconds ?? DEFAULT_TTL_SECONDS);
  if (!Number.isFinite(ttl) || ttl <= 0) return DEFAULT_TTL_SECONDS;
  return Math.min(Math.floor(ttl), MAX_TTL_SECONDS);
}

function signPayload(input: { productId: string; holder: string; bucket: string | null; expiresAt: string; nonce: string }) {
  const { key, source } = signingKey();
  const payload = [input.productId, input.holder, input.bucket ?? "no-bucket", input.expiresAt, input.nonce].join(":");
  return {
    signature: createHmac("sha256", key).update(payload).digest("hex"),
    keySource: source
  };
}

function signedUrl(auth: GreenfieldAuthRuntime, signature: string, expiresAt: string, nonce: string) {
  const base = auth.delivery.signedUrlPreview ?? `https://greenfield.mock.axodus.local/access/${auth.productId}`;
  const url = new URL(base);
  url.searchParams.set("signature", signature);
  url.searchParams.set("expires", expiresAt);
  url.searchParams.set("nonce", nonce);
  return url.toString();
}

function resolveStatus(record: SignedUrlRuntime, now = new Date()) {
  if (record.revokedAt) return "revoked";
  if (record.expiresAt && Date.parse(record.expiresAt) <= now.getTime()) return "expired";
  return record.status;
}

export function issueSignedUrlRuntime(store: MarketplaceStore, productId: string, holder = "0xMockBuyer...A11C", ttlSeconds?: number, daoId?: string): SignedUrlRuntime {
  const auth = buildGreenfieldAuthRuntime(store, productId, holder, daoId);
  const issuedAt = new Date();
  const ttl = normalizeTtl(ttlSeconds);
  const expiresAt = new Date(issuedAt.getTime() + ttl * 1000).toISOString();
  const nonce = randomBytes(12).toString("hex");
  const allowed = auth.accessVerification.status === "verified-preview";
  const { signature, keySource } = signPayload({ productId: auth.productId, holder: auth.holder, bucket: auth.bucket.name, expiresAt, nonce });

  return {
    id: `signed-url-${crypto.randomUUID()}`,
    productId: auth.productId,
    holder: auth.holder,
    greenfieldAuthId: auth.id,
    bucket: auth.bucket.name,
    url: allowed ? signedUrl(auth, signature, expiresAt, nonce) : null,
    signature: allowed ? signature : null,
    nonce,
    status: allowed ? "issued" : "blocked",
    issuedAt: issuedAt.toISOString(),
    expiresAt: allowed ? expiresAt : null,
    revokedAt: null,
    revocationReason: null,
    expirationVisible: true,
    revocationVisible: true,
    signing: {
      algorithm: "HMAC-SHA256",
      keySource,
      productionSignerEnabled: false
    },
    productionGreenfieldEnabled: false,
    externalSignedUrlEnabled: false
  };
}

export function revokeSignedUrlRuntime(record: SignedUrlRuntime, reason?: string): SignedUrlRuntime {
  return {
    ...record,
    status: "revoked",
    revokedAt: new Date().toISOString(),
    revocationReason: reason?.trim() || "manual-preview-revocation"
  };
}

export function buildSignedUrlSnapshot(records: SignedUrlRuntime[], now = new Date()): SignedUrlRuntimeSnapshot {
  const resolved = records.map((record) => ({ ...record, status: resolveStatus(record, now) }));
  return {
    id: `signed-url-snapshot-${crypto.randomUUID()}`,
    records: resolved,
    metrics: {
      issued: resolved.filter((record) => record.status === "issued").length,
      blocked: resolved.filter((record) => record.status === "blocked").length,
      expired: resolved.filter((record) => record.status === "expired").length,
      revoked: resolved.filter((record) => record.status === "revoked").length
    },
    productionGreenfieldEnabled: false,
    generatedAt: now.toISOString()
  };
}

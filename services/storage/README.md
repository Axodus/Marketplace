# Storage Service (BNB Greenfield)

## Mission
Provide programmatic access control to large assets (courses/videos/IP) using Greenfield buckets, Groups/ACL, and **signed URLs**. Mirror permissions on BSC when needed.

## Flow
1) Seller lists item → API holds metadata canonical on IPFS/Arweave.
2) Buyer purchases → API validates tx → Storage service issues **short-TTL signed URL** for the asset.
3) (Optional) Mirror ACL to BSC contract for on-chain auditability.

## Endpoints (internal)
- `POST /signed-url` { itemRef, buyer, expiresIn } → { url, expiry }
- `POST /mirror/permit` { objectId, grantee, ttl }

## Environment
`.env-storage`:

```
GREENFIELD_GATEWAY=https://...
GREENFIELD_BUCKET=axodus-market
GREENFIELD_ACCESS_KEY=...
GREENFIELD_SECRET_KEY=...
BSC_MIRROR_CONTRACT=0x...
```

## Definition of Done
- Signed URLs validated by owner-of NFT (on API).
- TTL defaults (e.g., 15m) + renewable token.
- Audit log for all grants & mirrors.

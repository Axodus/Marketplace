# API Core (NestJS — GraphQL/REST)

## Mission
Expose a single endpoint (GraphQL) for listings, bids, sales, profiles. Orchestrate storage (Greenfield), contracts (ethers v6), and indexer (subgraphs/workers). Provide WS subscriptions for live auctions.

## Tech
- NestJS (modules, DI), TypeScript
- Apollo GraphQL (queries, mutations, subscriptions)
- REST helpers (healthz, metrics)
- PostgreSQL (or MongoDB) via Prisma/TypeORM
- Redis (cache + pub/sub for WS fan-out)
- Ethers v6 RPC providers per chain

## Modules

```
src/modules/
	listings/  # CRUD list/listings; fixed sale logic
	auctions/  # english/dutch; bid placement; close logic
	users/     # SIWE-like auth: nonce -> wallet signature -> JWT
	storage/   # Greenfield signed URL, ACL orchestration
	payments/  # placeholder – integrate later
	common/    # dto/guards/filters/interceptors
```

## GraphQL (examples)
```graphql
type Query {
	listings(filter: ListingFilter!): [Listing!]!
	item(ref: ItemRef!): Item!
	bids(item: ItemRef!): [Bid!]!
}
type Mutation {
	listItem(input: ListInput!): TxRef!
	buyNow(input: BuyInput!): TxRef!
	placeBid(input: BidInput!): TxRef!
	requestSignedUrl(input: SignedUrlInput!): SignedUrl!
}
type Subscription {
	bidStream(item: ItemRef!): Bid!
	saleStream(item: ItemRef!): Sale!
}
```

## Environment
Create `.env-api`:

```
API_PORT=4000
DB_URL=postgresql://user:pass@localhost:5432/axodus
REDIS_URL=redis://localhost:6379
RPC_ETHEREUM=https://...
RPC_BNB=https://...
RPC_ARBITRUM=https://...
RPC_HARMONY=https://api.harmony.one
RPC_POLYGON=https://...
LAYERZERO_ENDPOINTS_JSON={}
GREENFIELD_GATEWAY=https://...
JWT_SECRET=change-me
```

## Responsibilities
- Validate payloads; anti-replay for bids; auth (nonce -> sign -> jwt).
- Call indexer for reads; fall back to RPC when needed.
- Orchestrate Greenfield signed URLs after sale; TTL & scope checks.
- Publish WS events (bidStream, saleStream) with Redis pub/sub.

## Definition of Done (API)
- 100% DTO validation; strong zod/class-validator.
- Idempotency keys for buy/bid.
- Rate limits per IP/key; audit logs.
- Observability: /healthz, /metrics, structured logs.

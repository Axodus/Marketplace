# Marketplace API Runtime

## Mission

Expose backend-owned Marketplace runtime persistence without enabling settlement, wallet execution or blockchain writes.

Sprint 06 implements a TypeScript HTTP API with local JSON persistence. It is a backend-ready boundary for products, sellers, tenants, licenses, purchases, subscriptions, billing previews, governance validations, draft listings, delivery previews and runtime events.

## Tech

- Node HTTP server
- TypeScript
- Vitest
- File-backed local repository
- Mock-first execution

## Runtime

Default command:

```bash
pnpm --filter @axodus/marketplace-api dev
```

Default port:

```bash
API_PORT=4000
```

Default persistence file:

```bash
MARKETPLACE_STORE_PATH=.runtime/marketplace-store.json
```

## Routes

- `GET /healthz`
- `GET /api/marketplace`
- `GET /api/marketplace/products`
- `GET /api/marketplace/products/:idOrSlug`
- `GET /api/marketplace/sellers`
- `GET /api/marketplace/tenants`
- `GET /api/marketplace/registry/products`
- `GET /api/marketplace/registry/sellers`
- `GET /api/marketplace/registry/tenants`
- `GET /api/marketplace/storefronts`
- `GET /api/marketplace/storefronts/:idOrSlug`
- `GET /api/marketplace/tenants/:tenantIdOrSlug/storefront`
- `GET /api/marketplace/sellers/:sellerIdOrSlug/storefront`
- `GET /api/marketplace/licenses`
- `GET /api/marketplace/licenses/runtime`
- `GET /api/marketplace/entitlements`
- `GET /api/marketplace/entitlements/:holder`
- `GET /api/marketplace/entitlements/enforcement`
- `GET /api/marketplace/purchases`
- `GET /api/marketplace/settlements`
- `GET /api/marketplace/subscriptions`
- `GET /api/marketplace/billing-previews`
- `GET /api/marketplace/invoices`
- `GET /api/marketplace/accounting-telemetry`
- `GET /api/marketplace/audit-logs`
- `GET /api/marketplace/reconciliation`
- `GET /api/marketplace/reconciliation/ownership`
- `GET /api/marketplace/reconciliation/treasury`
- `GET /api/marketplace/indexer-snapshots`
- `GET /api/marketplace/indexer/runtime`
- `GET /api/marketplace/indexer/events`
- `GET /api/marketplace/indexer/chain-snapshots`
- `GET /api/marketplace/indexer/ownership-snapshots`
- `GET /api/marketplace/indexer/listing-snapshots`
- `GET /api/marketplace/governance-authority`
- `GET /api/marketplace/governance-authority/:entityId`
- `GET /api/marketplace/governance-enforcement`
- `GET /api/marketplace/governance-enforcement/:entityId`
- `GET /api/marketplace/dao-federation`
- `GET /api/marketplace/dao-federation/tenants/:tenantId`
- `GET /api/marketplace/governance-workflow`
- `GET /api/marketplace/governance-observability`
- `GET /api/marketplace/governance-validations`
- `GET /api/marketplace/delivery-previews`
- `GET /api/marketplace/greenfield/auth`
- `GET /api/marketplace/greenfield/signed-urls`
- `GET /api/marketplace/delivery/secure`
- `GET /api/marketplace/delivery/observability`
- `GET /api/marketplace/events`
- `GET /api/marketplace/live`
- `GET /api/marketplace/live/stream`
- `GET /api/marketplace/live/ws`
- `GET /api/marketplace/resilience`
- `POST /api/marketplace/draft-listings`
- `POST /api/marketplace/purchases/preview`
- `POST /api/marketplace/settlements/execute`
- `POST /api/marketplace/entitlements/enforce`
- `POST /api/marketplace/billing-previews`
- `POST /api/marketplace/invoices/preview`
- `POST /api/marketplace/invoices/lifecycle`
- `POST /api/marketplace/subscriptions/preview`
- `POST /api/marketplace/licenses/lifecycle`
- `POST /api/marketplace/subscriptions/lifecycle`
- `POST /api/marketplace/governance-workflow/actions`
- `POST /api/marketplace/delivery-previews`
- `POST /api/marketplace/greenfield/auth`
- `POST /api/marketplace/greenfield/signed-urls`
- `POST /api/marketplace/greenfield/signed-urls/revoke`
- `POST /api/marketplace/delivery/secure`
- `POST /api/marketplace/delivery/telemetry`
- `POST /api/marketplace/reconciliation/snapshot`
- `POST /api/marketplace/reconciliation/ownership`
- `POST /api/marketplace/reconciliation/treasury`
- `POST /api/marketplace/indexer-snapshots`
- `POST /api/marketplace/indexer/events`

## Boundaries

The current repository writes local JSON only. It is intentionally replaceable by future SQLite, Postgres or indexer-backed repositories.

Sprint 07 registries are derived read models:

- product registry
- seller registry
- tenant/DAO registry
- storefront views

They normalize ownership, governance standing, federation tier, lifecycle state, NFT metadata, royalty metadata and delivery metadata without enabling public storefront activation.

Sprint 08 entitlement runtime persists:

- issued license runtime records
- license lifecycle transitions
- subscription lifecycle transitions
- renewal and cancellation previews
- entitlement snapshots by holder
- delivery permission previews
- access enforcement readiness metadata

Access enforcement is not active. Entitlement responses declare `realBlockingEnabled: false`.

Sprint 09 accounting runtime persists:

- invoice previews
- line items
- royalty accounting previews
- creator split previews
- treasury split previews
- fee previews
- accounting telemetry
- reconciliation preview state

Accounting is non-settlement. Invoice responses declare `settlementEnabled: false` and `treasuryExecutionEnabled: false`.

Sprint 10 traceability runtime persists:

- audit logs
- replay-safe runtime events
- event categories
- reconciliation preview snapshots
- indexer readiness snapshots

Reconciliation and indexer flows are shape-only. Responses keep blockchain reads, queue publishing, ownership verification, treasury verification and settlement verification disabled.

Sprint 11 governance authority runtime hydrates read-only authority records for:

- products
- sellers
- tenants/DAOs

Authority records include constitutional standing, governance status, federation tier, warnings, sanctions, operational approval, restriction state, emergency state and authority layers.

The `GovernanceRuntimeAuthorityAdapter` currently uses a local Governance-compatible read model and is prepared for a future `GOVERNANCE_RUNTIME_URL` integration. It does not execute governance writes, sanctions, approvals or emergency actions.

Sprint 12 governance enforcement runtime derives preview-only enforcement boundaries from authority records:

- product visibility preview
- seller and tenant storefront visibility preview
- purchase, bid and listing preview allowance
- entitlement invalidation preview
- subscription restriction preview
- license restriction preview
- governance override visibility
- review queue metadata

Enforcement is non-destructive. Responses declare `hardBlockingEnabled: false` and `destructiveActionsEnabled: false`.

Sprint 13 DAO federation runtime derives tenant-aware infrastructure views:

- DAO storefront activation state
- storefront operational status
- storefront governance visibility
- DAO-owned product runtime
- tenant-scoped products, sellers, invoices, licenses, subscriptions and entitlements
- constitutional inheritance
- inherited restrictions and visibility rules
- federation health metrics

Federation runtime is preview-only. Responses declare `publicActivationEnabled: false` and `settlementEnabled: false`.

Sprint 14 governance workflow runtime persists moderation-only action records and exposes:

- product, seller, storefront, entitlement and billing review queues
- approval lifecycle state
- constitutional reason codes
- moderation metrics
- governance workflow audit records

Workflow actions are audit records only. They declare `governanceWritesEnabled: false` and `moderationOnly: true`.

Sprint 15 governance observability runtime exposes:

- emergency restriction, freeze, suspension and visibility controls
- governance action telemetry
- restriction telemetry
- moderation telemetry
- emergency event telemetry
- operator console readiness
- federation visibility

Emergency controls are preview-only. Responses declare `executionEnabled: false` and `liveControlsEnabled: false`.

Sprint 21 indexer runtime persists Marketplace chain ingestion state:

- NFT event ingestion
- listing event ingestion
- auction event ingestion
- bid event ingestion
- ownership event ingestion
- chain snapshots
- ownership snapshots
- listing snapshots
- aggregate indexer runtime snapshot

Indexer ingestion records are replay-safe and deduplicated by chain, transaction hash, log index and event kind. The runtime persists local snapshots only. It does not run live node subscriptions, production queues, settlement reconciliation, treasury verification or ownership enforcement mutation.

Sprint 22 ownership reconciliation persists:

- ownership verification records
- stale ownership state by block lag
- runtime consistency checks
- holder mismatch visibility
- missing ownership snapshot visibility
- invalid NFT asset visibility

Ownership reconciliation compares NFT-bound products against persisted ownership snapshots and expected holders from purchase/license runtime. It does not execute live chain reads, mutate ownership, enforce entitlements or perform settlement reconciliation.

Sprint 23 billing/treasury reconciliation persists:

- royalty reconciliation previews
- treasury split verification
- creator split verification
- platform/ecosystem fee consistency checks
- accounting telemetry readiness flags
- settlement preview readiness flags

Treasury reconciliation compares persisted invoice previews against deterministic product pricing, EIP-2981 royalty metadata and Axodus fee policy previews. It records mismatch reason codes and metrics, but does not execute treasury movement, royalty distribution, payment settlement or external reconciliation.

Sprint 24 realtime runtime exposes:

- realtime Marketplace snapshot endpoint
- Server-Sent Events preview stream
- readonly WebSocket handshake endpoint
- live listing update aggregation
- live bid update aggregation
- governance update aggregation
- telemetry update aggregation

Realtime runtime is infrastructure-only. It does not connect to an external broker, does not subscribe to live chain nodes, does not perform settlement and does not enable contract or wallet execution.

Sprint 25 operational resilience exposes:

- retry queue previews
- reconciliation retry readiness
- treasury retry readiness
- realtime stream retry readiness
- stale snapshot recovery previews
- degraded mode visibility
- failover readiness flags

Operational resilience is preview-only. It does not execute retries, switch databases, publish to production queues, recover live indexer state, move funds or perform wallet/contract execution.

Sprint 26 Greenfield authentication runtime exposes:

- bucket access runtime
- Greenfield auth preview records
- holder access verification
- license/subscription entitlement checks
- NFT ownership snapshot verification readiness
- signed URL preview lifecycle under auth checks

Greenfield authentication remains production-disabled. It does not call BNB Greenfield, issue production signed URLs, mutate bucket policy, enforce live ownership, move assets or execute wallet/contract actions.

Sprint 27 signed URL runtime exposes:

- HMAC-SHA256 signed URL issuance
- TTL and expiration visibility
- revocation runtime
- signed URL snapshot metrics
- signed URL delivery telemetry

Signed URL runtime is backend-real but Greenfield-production-disabled. It signs local runtime URLs with `MARKETPLACE_SIGNED_URL_SECRET` when configured, otherwise an ephemeral runtime key is used. It does not call BNB Greenfield, mutate bucket policy, execute asset transfer, or perform wallet/contract actions.

Sprint 28 entitlement enforcement runtime exposes:

- operational access validation
- license enforcement
- subscription enforcement
- DAO/tenant access enforcement
- governance review/blocking decisions
- enforcement snapshot metrics

Greenfield auth and signed URL issuance now depend on entitlement enforcement decisions. Enforcement is operational for Marketplace access decisions, but it still does not execute settlement, wallet actions, contract writes, production asset delivery, or treasury movement.

Sprint 29 secure asset delivery runtime exposes:

- encrypted download manifests
- secure stream manifests
- ACS package delivery manifests
- entitlement-gated delivery preparation
- delivery snapshot metrics
- secure delivery telemetry

Secure delivery is operational at manifest/token level only. It does not transfer files, stream media, provision ACS runtimes, call production object storage, execute contracts, or move assets.

Sprint 30 delivery observability exposes:

- download telemetry
- stream telemetry
- ACS package access telemetry
- entitlement traceability
- delivery audit records
- access analytics

Delivery observability persists audit and analytics records only. It does not execute file transfer, live streaming, ACS provisioning, object-store reads, settlement, wallet actions, or contract writes.

Sprint 31 settlement runtime exposes controlled economic activation:

- controlled purchase execution
- settlement runtime confirmation
- transaction lifecycle records
- purchase/license issuance from settlement runtime
- settlement snapshot metrics

Settlement execution requires `controlledRollout: true`. The runtime confirms Marketplace-internal settlement records only. It does not execute wallet transactions, chain writes, external payment gateway calls, treasury movement, fiat checkout, or contract settlement.

Every response is wrapped in an envelope that declares:

- `mode: mock-persistent`
- `settlementEnabled: false`
- `walletExecutionEnabled: false`
- `blockchainWritesEnabled: false`

## Explicitly Out Of Scope

- real payment execution
- real wallet signatures
- contract writes
- NFT minting or transfer
- auction settlement
- treasury settlement
- production Greenfield signed URL issuance
- LayerZero messaging

## Validation

```bash
pnpm --filter @axodus/marketplace-api lint
pnpm --filter @axodus/marketplace-api test
pnpm --filter @axodus/marketplace-api build
```

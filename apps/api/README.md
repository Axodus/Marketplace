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
- `GET /api/marketplace/purchases`
- `GET /api/marketplace/subscriptions`
- `GET /api/marketplace/billing-previews`
- `GET /api/marketplace/invoices`
- `GET /api/marketplace/accounting-telemetry`
- `GET /api/marketplace/audit-logs`
- `GET /api/marketplace/reconciliation`
- `GET /api/marketplace/indexer-snapshots`
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
- `GET /api/marketplace/events`
- `POST /api/marketplace/draft-listings`
- `POST /api/marketplace/purchases/preview`
- `POST /api/marketplace/billing-previews`
- `POST /api/marketplace/invoices/preview`
- `POST /api/marketplace/invoices/lifecycle`
- `POST /api/marketplace/subscriptions/preview`
- `POST /api/marketplace/licenses/lifecycle`
- `POST /api/marketplace/subscriptions/lifecycle`
- `POST /api/marketplace/governance-workflow/actions`
- `POST /api/marketplace/delivery-previews`
- `POST /api/marketplace/reconciliation/snapshot`
- `POST /api/marketplace/indexer-snapshots`

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

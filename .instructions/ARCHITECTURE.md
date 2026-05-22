# Marketplace Architecture

# Architectural Mission

The Marketplace workspace coordinates ecosystem-wide product distribution and operational commerce infrastructure.

Marketplace coordinates:
- product access
- service distribution
- ACS infrastructure access
- educational commerce
- subscriptions
- licensing
- operational settlements

while remaining:
- governance-compatible
- treasury-aware
- operationally transparent
- modular

---

# Marketplace Topology

Core marketplace layers:
- product layer
- subscription layer
- ACS services layer
- educational layer
- licensing layer
- billing layer
- operational telemetry layer

---

# Product Layer

The product layer coordinates:
- ecosystem products
- operational services
- digital assets
- infrastructure access
- capability distribution

Products must remain observable and accountable.

---

# Subscription Layer

Subscriptions coordinate:
- recurring access
- operational plans
- enterprise access
- premium services
- ecosystem memberships

Subscription systems must expose accounting visibility.

---

# ACS Services Layer

ACS service distribution includes:
- MCP access
- orchestration systems
- workflow systems
- AI agents
- compute access

ACS systems remain bounded and governance-aware.

---

# Educational Layer

Educational commerce coordinates:
- course access
- certification access
- governance education
- specialization tracks
- Academy subscriptions

Educational systems remain capability-oriented.

---

# Licensing Layer

Licensing coordinates:
- enterprise access
- DAO access
- ACS provisioning rights
- operational usage rights

Licensing systems must remain transparent and auditable.

---

# Billing Layer

Billing coordinates:
- settlements
- subscription accounting
- ACS usage accounting
- operational payments
- treasury integration

Billing systems must expose telemetry and accounting consistency.

---

# Telemetry Layer

Telemetry coordinates:
- commerce visibility
- operational analytics
- subscription telemetry
- ACS usage telemetry
- billing telemetry

Telemetry is mandatory infrastructure.

---

# Backend Architecture

Backend responsibilities:
- product aggregation
- subscription coordination
- billing aggregation
- operational telemetry
- ACS service tracking

Backends must not become hidden commercial authorities.

---

# Frontend Architecture

Frontend responsibilities:
- marketplace visibility
- subscription management
- product discovery
- ACS service access
- billing visibility

Business logic should remain outside frontend state whenever possible.

## Phase 1 Web App Architecture

The MVP web app is React + Vite and mock-first.

The Marketplace web module lives under `src/modules/marketplace` and owns:
- product, seller, license and purchase types
- marketplace service/query helpers
- mock contract, royalty, auction, storage and bridge adapters
- marketplace pages and components

Centralized mock data lives in `src/data/mock/marketplace.mock.js`.

The frontend must keep NFT marketplace primitives explicit:
- ERC721/1155
- EIP-2981 royalties
- fixed listings
- english/dutch auctions
- bids
- buy-now
- item detail pages
- create/sell adapter boundaries

No Phase 1 UI flow may execute live payments, wallet signatures, contract writes, bridge transfers or treasury routing.

## Phase 1 Delivery & Entitlement Runtime

Sprint 04 adds mock-first delivery infrastructure under `apps/web/src/modules/marketplace/services/deliveryRuntime.ts`.

Delivery runtime prepares:
- downloadable assets
- protected assets
- streamed assets
- ACS packages
- educational assets
- enterprise bundles

Greenfield delivery remains adapter-shaped through `StorageAccessService` and `GreenfieldAccessAdapter`.

Signed URL previews expose:
- lifecycle state
- authorization state
- expiration preview
- revocation preview
- blocked delivery state

Entitlement enforcement prepares boundaries for:
- ownership validation
- subscription-gated delivery
- license-gated delivery
- DAO-gated delivery
- governance-restricted delivery

Delivery telemetry exposes:
- entitlement checks
- access attempts
- revocations
- signed URL preview issuance
- blocked delivery events

No production Greenfield call, production signed URL, live ownership validation, real entitlement enforcement, file download, stream delivery, ACS provisioning or access revocation execution is implemented in Sprint 04.

## Phase 1 Runtime Hardening

Sprint 05 hardens the web runtime before any real settlement phase.

Runtime hardening includes:
- route-level code splitting through `React.lazy` and `Suspense`
- isolated dashboard and product detail chunks
- wallet runtime isolation from the global layout chunk
- QueryClient defaults for bounded retry and stable refetch behavior
- route loading fallback states
- in-memory Marketplace runtime telemetry
- lifecycle tracing
- adapter tracing
- route and runtime error instrumentation
- dialog, badge, table and form accessibility improvements
- empty states for product discovery and governance review queues

The production build must avoid large chunk warnings where practical. Sprint 05 reduces the initial web bundle by splitting Marketplace pages and services into lazy chunks.

Observability remains preview-only. No external telemetry export, settlement monitoring, wallet execution, contract tracing, production adapter invocation or live Greenfield tracing is enabled.

## Sprint 06 API Runtime & Persistence Layer

Sprint 06 introduces a backend-owned Marketplace runtime while preserving mock-first execution.

The API module lives under `apps/api/src/modules/marketplace` and owns:
- HTTP controllers for Marketplace runtime routes
- service orchestration and validation boundaries
- repository abstractions for products, sellers, tenants, licenses, purchases, subscriptions, billing previews, governance validations, draft listings, delivery previews and runtime events
- a file-backed local persistence adapter at `.runtime/marketplace-store.json`
- deterministic seed data shaped after the web Marketplace mock model

The web app now consumes `apps/web/src/services/apiClient.ts` for Marketplace hydration and preview mutations. If the API runtime is unavailable, the client falls back to the centralized frontend mock services.

Persisted Sprint 06 previews include:
- draft listings
- purchase previews
- billing previews
- subscription previews
- delivery previews
- governance validation requests
- runtime events

Every persisted runtime record remains explicitly preview-only:
- no settlement
- no wallet execution
- no blockchain writes
- no contract write
- no production Greenfield delivery
- no treasury movement

The file repository is a development persistence boundary, not a production database strategy. Future phases may replace it with SQLite/Postgres/indexer adapters behind the same repository contract.

## Sprint 07 Registry Infrastructure

Sprint 07 establishes canonical registry read models for products, sellers, tenants and storefronts.

Registry infrastructure lives in `apps/api/src/modules/marketplace/services/registryReadModels.ts` and derives:
- `ProductRegistryRecord`
- `SellerRegistryRecord`
- `TenantRegistryRecord`
- `StorefrontViewEntity`

The registry layer normalizes:
- canonical product IDs
- seller/publisher identity
- DAO/tenant ownership
- tenant-scoped product relationships
- storefront ownership
- governance standing
- constitutional metadata
- federation tier
- lifecycle, archival and deprecation state
- NFT metadata compatibility
- royalty metadata
- delivery metadata

Storefront routes are preview-only and read-only. They expose DAO and seller storefront readiness without enabling public activation, settlement, minting, publishing or governance execution.

Frontend storefront infrastructure is available at `/marketplace/tenants/:tenantId` and consumes the API registry/storefront read models through `apiClient`.

## Sprint 08 License, Entitlement & Subscription Runtime

Sprint 08 moves entitlement visibility into backend-backed lifecycle state.

The API now persists:
- issued license runtime records
- license lifecycle transitions
- subscription lifecycle records
- renewal previews
- cancellation previews
- entitlement aggregation snapshots
- access enforcement readiness metadata

Entitlement aggregation lives in `apps/api/src/modules/marketplace/services/entitlementRuntime.ts`.

The aggregation runtime resolves:
- owned products
- active licenses
- active subscriptions
- governance restrictions
- tenant restrictions
- delivery permissions
- future NFT ownership merge readiness
- future wallet ownership merge readiness

Access enforcement remains preparation only. The runtime exposes license-gated, subscription-gated, DAO-restricted, governance-restricted and entitlement-based delivery boundaries with `realBlockingEnabled: false`.

Frontend user access visibility is available at `/marketplace/entitlements`.

## Sprint 09 Billing, Invoice & Treasury Preview Runtime

Sprint 09 establishes backend-backed accounting preview infrastructure.

The API now persists:
- invoice previews
- invoice line items
- invoice lifecycle state
- royalty preview accounting
- platform fee previews
- ecosystem fee previews
- treasury split previews
- creator split previews
- accounting telemetry
- reconciliation preview state

Accounting runtime lives in `apps/api/src/modules/marketplace/services/accountingRuntime.ts`.

Invoice state supports:
- draft
- preview
- pending
- mock_paid
- failed
- cancelled
- refunded_preview

All accounting remains non-settlement:
- no payment execution
- no treasury movement
- no royalty distribution
- no tax calculation execution
- no external reconciliation

Frontend billing visibility is available at `/marketplace/orders`.

## Sprint 10 Audit, Events & Reconciliation Readiness

Sprint 10 makes Marketplace operationally traceable and reconciliation-ready.

The API now persists:
- audit logs
- replay-safe runtime events
- event categories
- reconciliation preview snapshots
- indexer readiness snapshots

Audit records include:
- actor
- entity
- action
- timestamp
- tenant
- governance context
- runtime metadata
- correlation id

Reconciliation snapshots prepare future:
- blockchain reads
- ownership verification
- treasury verification
- settlement verification
- license verification

Indexer snapshots prepare future:
- entity sync counts
- contract ingestion readiness
- runtime snapshot metadata
- ownership merge readiness
- NFT event ingestion readiness

All reconciliation and indexer flows remain preview-only. No chain read, queue publish, treasury verification, ownership verification or live ingestion is enabled.

Frontend operational traceability is available at `/marketplace/audit`.

## Sprint 11 Governance Runtime Authority

Sprint 11 makes governance authority first-class runtime data for Marketplace.

The API now hydrates a read-only governance authority snapshot for:
- products
- sellers
- tenants/DAOs

Authority records include:
- constitutional standing
- governance status
- federation tier
- warnings
- sanctions
- operational approval
- restriction state
- emergency state
- authority layers
- read-only execution metadata

The authority boundary is implemented by `GovernanceRuntimeAuthorityAdapter`. It currently derives a local Governance-compatible read model and can be pointed at a future Governance runtime API through `GOVERNANCE_RUNTIME_URL`.

Endpoints:
- `GET /api/marketplace/governance-authority`
- `GET /api/marketplace/governance-authority/:entityId`

Frontend governance authority panels are visible in:
- product detail
- seller profile
- tenant storefront
- entitlement dashboard
- billing dashboard

This layer is strictly read-only:
- no governance write execution
- no sanctions mutation
- no approval mutation
- no emergency action execution
- no Marketplace bypass of Governance authority

## Sprint 12 Governance Enforcement Boundaries

Sprint 12 introduces runtime governance enforcement boundaries without destructive enforcement.

The API now derives a governance enforcement snapshot from Governance authority for:
- product visibility behavior
- seller storefront behavior
- tenant/DAO storefront behavior
- commerce preview allowance
- bid preview allowance
- listing preview allowance
- entitlement invalidation previews
- subscription restriction previews
- license restriction previews
- governance override visibility
- review queue routing

Endpoints:
- `GET /api/marketplace/governance-enforcement`
- `GET /api/marketplace/governance-enforcement/:entityId`

Enforcement records expose:
- effective visibility state
- public explorer visibility
- detail page visibility
- storefront visibility
- purchase/bid/listing preview allowance
- entitlement impact preview
- review queue metadata
- reason codes
- hard blocking status
- destructive action status

Current mode remains preview-only:
- no product deletion
- no entitlement revocation
- no subscription cancellation
- no license suspension execution
- no seller or tenant freeze execution
- no live Governance mutation

## Sprint 13 DAO Federation Runtime

Sprint 13 makes Marketplace a DAO federation runtime instead of only a set of isolated storefronts.

The API now derives a DAO federation snapshot from:
- tenant registry
- seller registry
- product registry
- governance authority
- governance enforcement
- billing previews/invoices
- license runtime
- subscription runtime
- entitlement snapshots

Endpoints:
- `GET /api/marketplace/dao-federation`
- `GET /api/marketplace/dao-federation/tenants/:tenantId`

Federation runtime exposes:
- DAO storefront activation state
- storefront operational status
- storefront governance visibility
- DAO-owned product IDs
- tenant-scoped products
- tenant-scoped billing
- tenant-scoped entitlements
- tenant-scoped governance records
- constitutional inheritance records
- inherited restrictions
- inherited visibility rules
- federation health metrics
- tenant and storefront telemetry

Current mode remains preview-only:
- no public storefront activation
- no cross-tenant settlement
- no live tenant isolation enforcement
- no constitutional write execution
- no destructive freeze of tenant operations

## Sprint 14 Governance Workflow Runtime

Sprint 14 adds operational governance workflow infrastructure.

The API now exposes:
- review queues for products, sellers, storefronts, entitlements and billing
- approval lifecycle state
- constitutional reason codes
- moderation runtime metrics
- persisted governance workflow actions
- governance workflow audit records

Endpoints:
- `GET /api/marketplace/governance-workflow`
- `POST /api/marketplace/governance-workflow/actions`

Approval lifecycle states:
- pending_approval
- approved
- rejected
- restricted
- escalated
- emergency_review

Constitutional reason code categories:
- warning
- sanction
- restriction
- escalation

Workflow actions are persisted as moderation/audit records only. They do not execute Governance writes, sanctions, settlements, entitlement revocations, product removals or tenant freezes.

## Sprint 15 Governance Observability & Emergency Controls

Sprint 15 adds governance emergency runtime and operator observability.

The API now exposes:
- emergency restriction controls
- emergency freeze controls
- emergency suspension controls
- emergency visibility controls
- governance action telemetry
- restriction telemetry
- moderation telemetry
- emergency event telemetry
- operator console readiness

Endpoint:
- `GET /api/marketplace/governance-observability`

The operator console reports:
- governance visibility
- moderation visibility
- restriction visibility
- federation visibility
- federation health
- emergency controls
- telemetry counters and records

Emergency controls are preview-only. They do not execute live Governance writes, product removals, seller/tenant freezes, license suspensions, entitlement revocations or settlement actions.

## Sprint 16 Reown/AppKit Readonly Wallet Runtime

Sprint 16 replaces the Marketplace wallet mock with a real readonly wallet runtime.

The web runtime now owns:
- Reown/AppKit provider discovery through an isolated adapter boundary
- EIP-1193 browser provider fallback
- wallet session hydration with `eth_accounts`
- account connection with `eth_requestAccounts`
- chain hydration with `eth_chainId`
- chain switching with `wallet_switchEthereumChain`
- disconnect handling
- local wallet session persistence
- provider event handling for account, chain and disconnect changes

Wallet visibility exposes:
- connected and disconnected state
- active account
- active chain
- supported chain state
- restricted or unsupported chain state
- provider source
- readonly execution flags

This layer is strictly readonly for Marketplace commerce:
- no transaction execution
- no contract write
- no wallet signature request
- no NFT transfer
- no settlement
- no treasury movement

If a Reown/AppKit package/runtime is available, Marketplace uses its wallet provider. If not, Marketplace falls back to the injected EIP-1193 wallet provider while preserving the same readonly state contract.

---

# Governance Integration

Marketplace remains subordinate to governance sovereignty.

Governance may:
- restrict products
- restrict subscriptions
- restrict operational access
- restrict licensing

Marketplace systems must never bypass governance authority.

---

# Architecture Constraints

- no opaque settlements
- no hidden subscriptions
- no governance bypass
- no centralized operational authority
- no hidden billing systems

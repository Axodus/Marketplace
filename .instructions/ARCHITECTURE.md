# Marketplace Architecture

# Architectural Mission

The Marketplace workspace is the official federated digital distribution infrastructure for the Axodus ecosystem.

Marketplace is no longer limited to a mock-first NFT marketplace. The NFT marketplace remains the first commercial vertical and the foundational asset primitive, but the architecture now extends to ecosystem-wide distribution of:
- digital assets
- NFT collections
- products
- licenses
- subscriptions
- ACS capabilities
- Academy courses
- enterprise offers
- tenant catalogs
- white-label marketplaces
- partner and affiliate offers
- revenue sharing models
- commercial intelligence

Marketplace coordinates:
- product access
- service distribution
- ACS infrastructure access
- educational commerce
- subscriptions
- licensing
- operational settlements
- commercial discovery
- tenant and partner distribution

while remaining:
- governance-compatible
- treasury-aware
- operationally transparent
- modular

Phase 00 is documentation-only. It does not implement runtime code, API surfaces, contracts, indexers, React components, persistence, GraphQL, billing execution, external integrations or on-chain execution.

---

# Foundational NFT Vertical

The NFT marketplace nucleus remains the first vertical of Marketplace.

The following primitives remain foundational:
- ERC721 assets
- ERC1155 assets
- EIP-2981 royalty metadata and royalty previews
- fixed listings
- bids
- english auctions
- dutch auctions
- buy-now previews
- seller profiles
- collections
- asset registry records

Federation, tenants, distribution, revenue sharing and intelligence extend this nucleus. They do not replace it.

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
- federation layer
- marketplace-as-a-service layer
- distribution network layer
- revenue sharing layer
- intelligence layer

---

# Phase 00 Federated Architecture Domains

Phase 00 introduces five architecture domains that prepare future implementation without activating runtime behavior.

## Marketplace Federation Domain

The Marketplace Federation Domain coordinates how internal Axodus assets and external assets are represented as governed, traceable and searchable distribution surfaces.

Federation allows Marketplace to consume, represent, organize and display assets, collections, contracts and metadata that originate outside native Axodus infrastructure. Federation is a visibility, interoperability, discovery, import and progressive validation capability.

Federation does not imply automatic custody, automatic liquidation, automatic execution, automatic validation, automatic trust, automatic settlement, wallet signature authorization, bridge execution or on-chain execution.

Responsibilities:
- define tenant and storefront boundaries
- preserve DAO and governance context per storefront
- model cross-tenant catalog visibility
- prepare constitutional inheritance and restriction visibility
- preserve the NFT vertical as a federation participant
- represent external collections
- represent external assets
- reference external contracts
- normalize external metadata
- classify federation providers
- expose origin, provider, validation status, provenance and trust boundaries for every federated asset

Core concepts:

### External Collections

External Collections represent collections originated outside native Axodus infrastructure that may be visible, searchable, referencable, classified or displayed inside Axodus Marketplace.

External Collections must expose:
- origin
- provider
- source chain or source system
- collection identifier
- validation status
- provenance
- metadata quality
- risk classification
- trust boundaries

### External Assets

External Assets represent NFTs, certificates, licenses or digital assets originated from external contracts, external wallets, external collections or Federation Providers.

External Assets may be discovered or imported for visibility, interoperability and progressive validation. They are not native Axodus assets unless a future approved process explicitly issues, controls, licenses or operates them inside Axodus infrastructure.

External Assets must expose:
- origin
- provider
- asset identifier
- source collection or source contract
- validation status
- provenance
- risk classification
- authenticity signals
- trust boundaries

### External Contracts

External Contracts represent ERC721, ERC1155 or other compatible contracts that may be indexed, imported, referenced, analyzed or displayed by Marketplace.

External Contract visibility does not authorize contract writes, wallet signatures, execution, settlement, custody, bridge execution, treasury routing or automatic trust.

External Contracts must expose:
- contract address or external contract identifier
- chain origin or source system
- contract source classification
- provider
- validation status
- compatibility notes
- risk classification
- trust boundaries

### External Metadata

External Metadata represents metadata obtained outside Axodus infrastructure, including images, attributes, descriptions, statistics, declared royalties, provenance, origin, validation state and risk information.

External Metadata must be treated as untrusted until validation status and provenance are explicit. Metadata quality, source reliability, image or media origin, declared royalty source, contract source, chain origin and validation state are architecturally relevant.

### Federation Providers

Federation Providers represent external providers, connectors, data sources or integration systems responsible for discovery, import, enrichment, classification or validation of external assets and external collections.

Federation Providers may include future external data systems, ecosystem partner systems, chain data sources, wallet discovery sources or collection discovery sources. Phase 00 does not implement real providers, SDKs, endpoints, HTTP calls, schemas, credentials or integrations.

Federation Providers must expose:
- provider identity
- source type
- origin scope
- supported asset types
- validation role
- reliability classification
- risk notes
- trust boundaries

Internal and external asset boundaries:
- internal assets are originated, issued, controlled, licensed or operated inside Axodus infrastructure
- external assets are originated outside Axodus infrastructure but may be visible or referencable through federation
- federated assets are external or mixed-origin assets represented by Marketplace with explicit origin, provider, validation status, provenance and trust boundaries
- external assets must not be displayed as native Axodus assets
- external metadata must not be treated as authoritative by default
- validation state must be visible before a federated asset is presented as validated

External Asset Validation must account for:
- origin
- provider
- validation status
- provenance
- risk classification
- authenticity signals
- metadata quality
- contract source
- chain origin
- trust boundaries

Boundaries:
- no public storefront activation
- no live tenant isolation enforcement
- no cross-tenant settlement
- no governance write execution
- no external marketplace integration
- no real federation provider integration
- no connector implementation
- no external HTTP calls
- no indexer activation
- no automatic custody
- no automatic liquidation
- no automatic execution
- no automatic validation
- no automatic trust
- no on-chain execution

## Marketplace-as-a-Service Domain

The Marketplace-as-a-Service Domain prepares packaged marketplace capability for Axodus tenants, partners and enterprise operators.

Responsibilities:
- define white-label marketplace capability boundaries
- model tenant-scoped product catalogs
- prepare configurable commercial policies
- separate platform services from tenant authority
- prepare operational dashboards and access packages

Boundaries:
- no tenant provisioning runtime
- no production billing
- no external customer onboarding
- no managed marketplace deployment
- no hardcoded commercial policy

## Distribution Network Domain

The Distribution Network Domain models how Axodus capabilities are discovered and distributed across ecosystem channels.

Responsibilities:
- model distribution channels for NFTs, ACS, Academy, enterprise offers and DAO services
- prepare partner, affiliate and referral distribution concepts
- separate discovery, offer routing and entitlement activation
- define commercial catalog propagation boundaries
- preserve auditability across distribution paths

Boundaries:
- no affiliate payout execution
- no partner integration
- no external catalog sync
- no real campaign routing
- no entitlement mutation

## Revenue Sharing Domain

The Revenue Sharing Domain prepares deterministic allocation models for creators, sellers, tenants, partners, affiliates, platform fees, ecosystem fees and treasury-compatible splits.

Responsibilities:
- model revenue share participants
- preserve EIP-2981 royalty compatibility
- define split preview boundaries
- separate allocation previews from payout execution
- expose treasury-compatible accounting visibility

Boundaries:
- no payment settlement
- no treasury movement
- no royalty distribution execution
- no partner payout execution
- no tax or fiat reconciliation execution

## Marketplace Intelligence Domain

The Marketplace Intelligence Domain prepares governance-compatible commercial intelligence for product discovery, catalog health, tenant performance, distribution effectiveness and operational risk visibility.

Responsibilities:
- define intelligence read models
- support catalog, tenant, seller and distribution analytics
- prepare recommendation and ranking boundaries
- expose telemetry without hidden commercial authority
- separate insights from automated execution

Boundaries:
- no automated pricing
- no autonomous promotion
- no hidden ranking authority
- no external analytics export
- no user profiling beyond approved future policy

---

# Official Distribution Scope

Marketplace is the official Axodus infrastructure for:
- distribution
- commercialization
- licensing
- subscription access
- commercial discovery
- tenant catalog exposure
- ecosystem capability packaging

This scope includes NFTs and extends to ACS, Academy, enterprise, DAO and partner products. All future implementation must preserve governance awareness, treasury compatibility, operational transparency and modular boundaries.

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

## Sprint 17 Readonly NFT Ownership Runtime

Sprint 17 adds readonly NFT ownership verification on top of the wallet runtime.

The web runtime now supports:
- ERC721 `ownerOf` reads through `eth_call`
- ERC1155 `balanceOf` reads through `eth_call`
- governance NFT classification
- license/access NFT classification
- disconnected wallet visibility
- unsupported or restricted chain visibility
- ownership mismatch visibility
- unreadable mock/offchain contract visibility

Ownership reads are implemented under `apps/web/src/modules/marketplace/services/nftOwnershipRuntime.ts`.

Product detail pages expose ownership state through a dedicated NFT ownership panel. The panel reports read method, wallet, chain, contract, token, owner/balance when available and explicit no-write labels.

Current boundaries:
- no mint
- no transfer
- no approval
- no wallet signature
- no contract write
- no settlement
- no entitlement mutation

## Sprint 18 Readonly Listing Runtime

Sprint 18 adds live-read listing hydration boundaries for Marketplace contracts.

The web runtime now supports:
- fixed listing readonly state hydration
- english auction readonly state hydration
- dutch auction readonly state hydration
- bid count and highest bid hydration
- expiration state hydration
- EIP-2981 `royaltyInfo` readonly hydration
- marketplace contract read adapter boundaries
- auction contract read adapter boundaries
- royalty/NFT contract read adapter boundaries

Listing runtime lives in `apps/web/src/modules/marketplace/services/listingRuntime.ts` and is surfaced on product detail pages through a dedicated listing runtime panel.

The current model requires production-shaped contract metadata before live reads execute:
- `marketplaceContractAddress`
- `listingId`
- optional `auctionContractAddress`
- optional `royaltyContractAddress`
- numeric `tokenId` for EIP-2981 reads

Mock products without those fields remain visible as readiness-only.

Current boundaries:
- no buy execution
- no bid placement
- no auction settlement
- no listing cancellation
- no contract write
- no wallet signature
- no treasury movement

## Sprint 19 Signature Preparation Runtime

Sprint 19 adds safe transaction/signature preparation infrastructure without enabling signing or sending.

The web runtime now supports:
- transaction payload preview
- calldata preview for buy-now, bid and create-listing intents
- optional gas estimation preview through `eth_estimateGas`
- contract visibility
- wallet and chain visibility
- permission visibility
- risk and warning visibility
- confirmation preview UI

Signature intent runtime lives in `apps/web/src/modules/marketplace/services/signatureRuntime.ts` and is surfaced through a product detail signature intent panel.

Current boundaries:
- no `eth_sendTransaction`
- no `personal_sign`
- no `eth_signTypedData`
- no wallet signature request
- no transaction submission
- no contract write
- no settlement
- no treasury movement

## Sprint 20 Wallet Security Hardening

Sprint 20 adds wallet and ownership security awareness on top of readonly wallet, ownership, listing and signature runtimes.

The web runtime now supports:
- chain mismatch protection visibility
- restricted/unsupported chain protection visibility
- suspicious or malformed asset metadata warnings
- symbolic mock contract warnings
- invalid NFT runtime visibility
- readonly `isApprovedForAll` approval visibility
- dangerous operator permission warnings
- fake ownership suspicion from ownership mismatch state
- stale ownership visibility when ownership cannot be verified
- permission visibility for purchase/bid previews

Wallet security runtime lives in `apps/web/src/modules/marketplace/services/walletSecurityRuntime.ts` and is surfaced on product detail pages through a dedicated wallet security panel.

Current boundaries:
- no approval revocation
- no transaction blocking execution
- no ownership mutation
- no wallet signature request
- no transaction submission
- no contract write

## Sprint 21 Marketplace Indexer Runtime

Sprint 21 adds backend-owned Marketplace chain ingestion runtime.

The API now supports persistent ingestion for:
- NFT events
- listing events
- auction events
- bid events
- ownership events

The runtime persists:
- chain ingestion events
- chain snapshots
- ownership snapshots
- listing snapshots
- aggregate Marketplace indexer runtime snapshots

Endpoints:
- `POST /api/marketplace/indexer/events`
- `GET /api/marketplace/indexer/events`
- `GET /api/marketplace/indexer/runtime`
- `GET /api/marketplace/indexer/chain-snapshots`
- `GET /api/marketplace/indexer/ownership-snapshots`
- `GET /api/marketplace/indexer/listing-snapshots`

Ingestion records are replay-safe and deduplicated by chain, transaction hash, log index and event kind.

Current boundaries:
- no live node subscription
- no production queue
- no contract write
- no settlement reconciliation
- no treasury execution
- no ownership enforcement mutation

## Sprint 22 Ownership Reconciliation Runtime

Sprint 22 adds backend-owned ownership reconciliation over persisted indexer snapshots.

The API now supports:
- ownership verification against runtime holders
- stale ownership detection by block lag
- runtime consistency checks across ownership snapshots, purchases and license runtime
- mismatch visibility
- missing snapshot visibility
- invalid asset visibility

Endpoints:
- `POST /api/marketplace/reconciliation/ownership`
- `GET /api/marketplace/reconciliation/ownership`

Ownership reconciliation compares NFT-bound products against the latest ownership snapshots and expected holders derived from purchase/license runtime. It persists reconciliation snapshots and records audit/runtime events.

Current boundaries:
- no live chain reads
- no ownership mutation
- no entitlement enforcement mutation
- no settlement reconciliation execution
- no wallet execution

## Sprint 23 Billing/Treasury Reconciliation Runtime

Sprint 23 adds backend-owned treasury and accounting reconciliation previews over persisted invoice runtime.

The API now supports:
- royalty reconciliation against product royalty metadata
- treasury split verification
- platform fee consistency checks
- ecosystem fee consistency checks
- creator split verification
- invoice accounting consistency visibility
- mismatch reason codes and aggregate metrics

Endpoints:
- `POST /api/marketplace/reconciliation/treasury`
- `GET /api/marketplace/reconciliation/treasury`

Treasury reconciliation compares persisted invoice previews with deterministic product pricing, EIP-2981 royalty metadata and Axodus fee policy previews. It persists reconciliation snapshots and records audit/runtime events categorized as treasury preview.

Current boundaries:
- no real treasury movement
- no royalty distribution
- no payment settlement
- no external accounting reconciliation
- no contract write
- no wallet execution

## Sprint 24 Event Streaming Runtime

Sprint 24 adds realtime Marketplace infrastructure over persisted runtime state.

The API now supports:
- realtime snapshot aggregation
- Server-Sent Events preview streaming
- readonly WebSocket handshake
- live listing update aggregation
- live bid update aggregation
- governance update aggregation
- telemetry update aggregation

Endpoints:
- `GET /api/marketplace/live`
- `GET /api/marketplace/live/stream`
- `GET /api/marketplace/live/ws`

Realtime runtime is derived from persisted Marketplace events, indexer ingestion previews, governance events and telemetry records. It records a realtime snapshot event for auditability.

Current boundaries:
- no external broker
- no production queue
- no live chain node subscription
- no settlement execution
- no contract write
- no wallet execution

## Sprint 25 Operational Resilience Runtime

Sprint 25 adds operational resilience read models over persisted Marketplace runtime state.

The API now supports:
- retry queue previews
- reconciliation retry readiness
- treasury retry readiness
- realtime stream retry readiness
- degraded mode visibility
- failover readiness flags
- stale snapshot recovery previews

Endpoint:
- `GET /api/marketplace/resilience`

Operational resilience derives retry queues from ownership reconciliation, treasury reconciliation, realtime snapshots and indexer snapshots. It exposes degraded/recovery modes and recovery recommendations while keeping all retry and failover execution disabled.

Current boundaries:
- no automatic retry execution
- no production failover switch
- no external queue publish
- no live indexer recovery
- no settlement execution
- no contract write
- no wallet execution

## Sprint 26 Greenfield Authentication Runtime

Sprint 26 starts Block D by adding Greenfield authentication runtime boundaries over Marketplace delivery and entitlement state.

The API now supports:
- bucket access runtime
- auth runtime records
- holder access verification
- license and subscription entitlement checks
- NFT ownership snapshot readiness
- signed URL preview lifecycle under auth checks

Endpoints:
- `POST /api/marketplace/greenfield/auth`
- `GET /api/marketplace/greenfield/auth`

Greenfield auth derives access from product bucket metadata, entitlement snapshots, active license/subscription runtime and persisted ownership snapshots. It records auth events as delivery telemetry.

Current boundaries:
- no production Greenfield call
- no production signed URL issuance
- no bucket policy mutation
- no live ownership enforcement
- no asset movement
- no contract write
- no wallet execution

## Sprint 27 Signed URL Runtime

Sprint 27 adds backend-real signed URL issuance over the Greenfield auth runtime.

The API now supports:
- HMAC-SHA256 signed URL generation
- TTL and expiration visibility
- revocation visibility
- signed URL runtime snapshots
- signed URL delivery telemetry

Endpoints:
- `POST /api/marketplace/greenfield/signed-urls`
- `POST /api/marketplace/greenfield/signed-urls/revoke`
- `GET /api/marketplace/greenfield/signed-urls`

Signed URL issuance requires Greenfield auth preview verification. The signer uses `MARKETPLACE_SIGNED_URL_SECRET` when configured and falls back to an ephemeral runtime key for local mock-persistent operation.

Current boundaries:
- no production Greenfield call
- no bucket policy mutation
- no production CDN/object-store integration
- no asset movement
- no contract write
- no wallet execution

## Sprint 28 Entitlement Enforcement Runtime

Sprint 28 makes Marketplace entitlement enforcement operational for backend access decisions.

The API now supports:
- license access validation
- subscription access validation
- DAO/tenant access validation
- governance review/blocking decisions
- delivery and signed URL allow/deny flags
- enforcement snapshot metrics

Endpoints:
- `POST /api/marketplace/entitlements/enforce`
- `GET /api/marketplace/entitlements/enforcement`

Greenfield auth and signed URL issuance now consume entitlement enforcement decisions before exposing access or issuing signed URLs.

Current boundaries:
- no payment execution
- no treasury movement
- no contract write
- no wallet execution
- no production object-store asset movement

## Sprint 29 Secure Asset Delivery Runtime

Sprint 29 adds secure delivery preparation for protected Marketplace assets.

The API now supports:
- encrypted download manifests
- secure stream manifests
- ACS package delivery manifests
- entitlement-gated delivery preparation
- delivery snapshot metrics
- secure delivery telemetry

Endpoints:
- `POST /api/marketplace/delivery/secure`
- `GET /api/marketplace/delivery/secure`

Secure delivery depends on entitlement enforcement decisions. Prepared delivery records include AES-256-GCM metadata, HMAC-wrapped access tokens, HLS preview stream tokens, and ACS package manifests.

Current boundaries:
- no file transfer
- no live media streaming
- no ACS runtime provisioning
- no production object-store call
- no asset movement
- no contract write
- no wallet execution

## Sprint 30 Delivery Observability Runtime

Sprint 30 makes secure delivery observable and auditable.

The API now supports:
- download telemetry
- secure stream telemetry
- ACS package access telemetry
- entitlement traceability
- delivery audit records
- access analytics

Endpoints:
- `POST /api/marketplace/delivery/telemetry`
- `GET /api/marketplace/delivery/observability`

Delivery observability correlates secure delivery records, entitlement enforcement ids, holder/product context, delivery mode, telemetry outcome and audit metadata.

Current boundaries:
- no file transfer
- no live media streaming
- no ACS runtime provisioning
- no production object-store reads
- no settlement execution
- no contract write
- no wallet execution

## Sprint 31 Settlement Runtime Activation

Sprint 31 starts Block E by enabling controlled Marketplace-internal settlement runtime.

The API now supports:
- controlled purchase execution
- settlement confirmation records
- transaction lifecycle records
- purchase and license issuance from settlement runtime
- settlement snapshot metrics

Endpoints:
- `POST /api/marketplace/settlements/execute`
- `GET /api/marketplace/settlements`

Settlement execution requires `controlledRollout: true`. The runtime creates Marketplace-owned purchase and license records and confirms an internal transaction lifecycle.

Current boundaries:
- no wallet transaction
- no blockchain write
- no external payment gateway
- no treasury movement
- no fiat checkout
- no contract settlement

## Sprint 32 Royalty Distribution Runtime

Sprint 32 makes royalty distribution operational inside Marketplace accounting after controlled settlement confirmation.

The API now supports:
- EIP-2981 royalty allocation
- creator payout allocation
- platform fee allocation
- ecosystem fee allocation
- treasury split allocation
- royalty distribution snapshot metrics

Endpoints:
- `POST /api/marketplace/royalties/distributions`
- `GET /api/marketplace/royalties/distributions`

Royalty distribution requires `controlledRollout: true` and a confirmed Marketplace settlement. The runtime allocates internal accounting records from product royalty metadata and Axodus fee policy.

Current boundaries:
- no external creator payout
- no treasury movement
- no contract royalty settlement
- no wallet transaction
- no blockchain write

## Sprint 33 Auction & Bid Runtime

Sprint 33 activates operational auction runtime inside the Marketplace API.

The API now supports:
- live bid placement
- accepted and rejected bid records
- controlled auction settlement
- auction expiration execution
- auction runtime snapshot metrics

Endpoints:
- `POST /api/marketplace/auctions/bids`
- `POST /api/marketplace/auctions/settle`
- `POST /api/marketplace/auctions/expire`
- `GET /api/marketplace/auctions`

Auction settlement and expiration require `controlledRollout: true`. Settlement can issue Marketplace-owned purchase and license records from the winning bid.

Current boundaries:
- no contract auction settlement
- no wallet transaction
- no blockchain write
- no external treasury movement

## Sprint 34 Treasury Execution Runtime

Sprint 34 activates governance-aware operational treasury routing inside the Marketplace API.

The API now supports:
- DAO treasury routing
- ecosystem fee routing
- platform fee routing
- creator royalty routing
- treasury execution reconciliation
- governance-aware execution gates

Endpoints:
- `POST /api/marketplace/treasury/execute`
- `GET /api/marketplace/treasury/executions`

Treasury execution requires `controlledRollout: true` and an allocated royalty distribution. The runtime executes Marketplace-internal routing records and reconciliation only.

Current boundaries:
- no external treasury movement
- no wallet transaction
- no blockchain write

## Sprint 35 Crosschain & LayerZero Runtime

Sprint 35 activates crosschain Marketplace infrastructure inside the API runtime.

The API now supports:
- LayerZero message preparation
- bridge runtime execution
- crosschain ownership synchronization
- crosschain inventory synchronization
- crosschain runtime snapshot metrics

Endpoints:
- `POST /api/marketplace/crosschain/messages`
- `POST /api/marketplace/crosschain/bridge`
- `POST /api/marketplace/crosschain/sync`
- `GET /api/marketplace/crosschain`

Bridge execution requires `controlledRollout: true` and a prepared crosschain message. The runtime persists bridge and inventory state only.

Current boundaries:
- no production LayerZero message
- no external bridge execution
- no wallet transaction
- no blockchain write

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

# Marketplace Roadmap

# Phase 0 — Marketplace Architecture

Status: IN PROGRESS

Objectives:
- define marketplace architecture
- define product systems
- define subscription systems
- define ACS service distribution
- define billing infrastructure

Deliverables:
- marketplace architecture specification
- subscription framework
- ACS distribution framework
- educational commerce framework
- billing architecture

---

# Phase 1 — Core Marketplace Infrastructure

Status: PLANNED

Objectives:
- implement product systems
- implement subscription systems
- implement billing infrastructure
- implement operational telemetry

Deliverables:
- marketplace platform
- subscription systems
- billing systems
- telemetry systems
- operational dashboards

---

# Phase 2 — ACS Marketplace Infrastructure

Status: PLANNED

Objectives:
- distribute ACS services and cognitive infrastructure

Deliverables:
- MCP marketplace
- orchestration packages
- AI agents
- compute access
- ACS operational telemetry

---

# Phase 3 — Educational Marketplace

Status: PLANNED

Objectives:
- integrate Academy into marketplace systems

Deliverables:
- course access
- certification commerce
- governance education systems
- learning subscriptions

---

# Phase 4 — Enterprise Marketplace

Status: PLANNED

Objectives:
- distribute enterprise infrastructure

Deliverables:
- enterprise subscriptions
- DAO operational packages
- ACS enterprise provisioning
- operational licensing

---

# Phase 5 — Ecosystem Commerce Network

Status: FUTURE

Objectives:
- decentralized ecosystem commerce

Deliverables:
- DAO marketplaces
- ACS provider markets
- educational federation
- ecosystem distribution networks

---

# Phase 6 — Sovereign Distribution Economy

Status: FUTURE

Objectives:
- create sustainable ecosystem-wide commerce infrastructure

Deliverables:
- decentralized operational commerce
- cognitive economy access
- ecosystem-wide licensing
- sovereign distribution systems

Marketplace systems must remain:
- governance-aware
- treasury-compatible
- operationally transparent

---

# Current Implementation Task — Mock-First NFT Marketplace MVP

Status: IN PROGRESS

Objectives:
- implement React/Vite Marketplace web app
- preserve NFT marketplace core semantics
- expose governance-aware product and seller standing
- consume centralized mock data from `src/data/mock/marketplace.mock.js`
- prepare Phase 2 boundaries without executing settlement

Deliverables:
- marketplace routes and layout
- product explorer and detail pages
- seller profile page
- governance validation page
- license viewer
- operational dashboard
- mock buy-now and bid modal
- mock create/sell listing preview
- legacy NFT item route compatibility
- adapters for MarketplaceContractAdapter, RoyaltyService, AuctionService, StorageAccessService and LayerZeroBridgeService
- readonly Reown/AppKit wallet runtime boundary

Constraints:
- no real payment execution
- no production contract addresses
- no live blockchain settlement
- no wallet signatures
- no transaction execution
- no treasury routing
- no bridge execution

---

# Sprint 04 — Greenfield Delivery & Entitlement Infrastructure

Status: IMPLEMENTED MOCK-FIRST

Delivered:
- delivery runtime service for downloadable, protected, streamed, ACS, educational and enterprise assets
- signed URL preview lifecycle with preview, expiration, revocation and blocked states
- Greenfield adapter preparation through `StorageAccessService` and `GreenfieldAccessAdapter`
- entitlement enforcement preview for ownership, subscription, license, DAO and governance restrictions
- delivery telemetry summary for entitlement checks, access attempts, revocations and preview issuance
- protected asset, entitlement-required and governance restriction labels in product detail
- dashboard telemetry metrics and delivery event rendering
- focused delivery runtime and adapter tests

Still deferred:
- production Greenfield delivery
- production signed URL issuance
- real entitlement enforcement
- live ownership validation
- ACS provisioning
- file or stream delivery execution

---

# Sprint 05 — Marketplace Runtime Hardening & Performance

Status: IMPLEMENTED MOCK-FIRST

Delivered:
- route-level code splitting with lazy Marketplace pages
- dashboard, product detail and marketplace service chunk isolation
- reduced initial build bundle without chunk size warnings
- runtime telemetry service for lifecycle, adapter and error traces
- telemetry hook for page/runtime observation
- adapter tracing across contract, royalty, storage and bridge boundaries
- route error instrumentation
- QueryClient retry/refetch hardening
- loading states for lazy routes, dashboard, product detail and governance
- empty states for explorer and governance queues
- accessible purchase dialog with ARIA, focus target, Escape handling and error alerts
- improved badges, filters, navigation focus states and dashboard table semantics

Still deferred:
- external telemetry export
- production monitoring integration
- real adapter execution tracing
- wallet execution
- settlement execution
- production delivery execution

---

# Sprint 06 — Marketplace API Runtime & Persistence Layer

Status: IMPLEMENTED MOCK-FIRST

Delivered:
- Marketplace API package with TypeScript build, lint and tests
- HTTP runtime under `/api/marketplace`
- local file persistence repository at `.runtime/marketplace-store.json`
- backend seed for products, sellers, tenants, licenses and governance validations
- persisted draft listing previews
- persisted purchase previews
- persisted billing previews
- persisted subscription previews
- persisted delivery previews
- runtime event records for listing, validation, purchase, license, billing, subscription and delivery previews
- frontend `apiClient` hydration with fallback to local mock services
- Create/Sell preview persistence
- Buy-now preview persistence
- focused API repository, API route and frontend API client tests

Still deferred:
- production database migrations
- indexer reconciliation
- real wallet signatures
- contract writes
- NFT minting or transfer
- real bid/auction settlement
- real Greenfield signed URL issuance
- treasury settlement

---

# Sprint 07 — Product, Seller & Tenant Registry Infrastructure

Status: IMPLEMENTED MOCK-FIRST

Delivered:
- canonical product registry read model
- seller/publisher registry read model
- tenant/DAO registry read model
- DAO and seller storefront read models
- tenant-scoped ownership normalization
- seller-to-tenant relationship normalization
- governance standing, warnings, restrictions and federation tier visibility
- archival/deprecation lifecycle fields in product registry versioning
- API endpoints for registries and storefronts
- frontend DAO storefront page at `/marketplace/tenants/:tenantId`
- sidebar entry for DAO storefront preview
- registry and storefront API/repository tests
- frontend API client registry/storefront test coverage

Still deferred:
- public storefront activation
- storefront publishing workflow
- real governance writes
- real sanctions enforcement
- reputation scoring engine
- production registry persistence/indexer reconciliation

---

# Sprint 08 — License, Entitlement & Subscription Backend Runtime

Status: IMPLEMENTED MOCK-FIRST

Delivered:
- persistent issued license runtime records
- license lifecycle states: preview, issued, active, suspended, expired, revoked
- subscription lifecycle states: active, paused, renewal_due, pending, cancelled, expired
- renewal preview metadata
- cancellation preview metadata
- entitlement aggregation snapshots by holder
- governance restriction visibility
- tenant restriction visibility
- delivery permission previews
- access enforcement readiness metadata
- future NFT and wallet ownership merge readiness
- API endpoints for license runtime, lifecycle updates and entitlements
- frontend entitlement dashboard at `/marketplace/entitlements`
- license registry runtime table
- entitlement, license lifecycle, subscription lifecycle and aggregation tests

Still deferred:
- real payment execution
- NFT ownership validation
- NFT minting or settlement
- production access blocking
- real subscription billing
- production revocation enforcement

---

# Sprint 09 — Billing, Invoice & Treasury Preview Infrastructure

Status: IMPLEMENTED MOCK-FIRST

Delivered:
- persistent invoice previews
- invoice line items
- product and subscription invoice references
- invoice states: draft, preview, pending, mock_paid, failed, cancelled, refunded_preview
- pricing aggregation
- royalty preview aggregation
- platform fee preview
- ecosystem fee preview
- treasury split preview
- creator split preview
- tax placeholder boundary
- accounting telemetry
- reconciliation preview state
- API endpoints for invoices, invoice lifecycle and accounting telemetry
- frontend billing page at `/marketplace/orders`
- invoice, accounting, treasury and royalty tests

Still deferred:
- real payment execution
- real treasury movement
- royalty distribution
- production tax calculation
- external reconciliation
- accounting export integration

---

# Sprint 10 — Audit Logs, Runtime Events & Reconciliation Preparation

Status: IMPLEMENTED MOCK-FIRST

Delivered:
- audit log persistence
- actor/entity/action audit metadata
- tenant and governance context in audit records
- replay-safe runtime event metadata
- event categories for product, governance, billing, subscription, license, entitlement, delivery, storefront and treasury preview
- correlation IDs
- reconciliation preview snapshots
- indexer readiness snapshots
- future blockchain read shape
- future ownership, treasury, settlement and license verification shape
- NFT event ingestion readiness
- frontend traceability dashboard at `/marketplace/audit`
- audit, event, reconciliation and indexer tests

Still deferred:
- live blockchain reads
- production indexer ingestion
- queue publishing
- live ownership verification
- treasury verification
- settlement verification

---

# Sprint 11 — Governance Runtime Authority

Status: IMPLEMENTED READ-ONLY

Delivered:
- Governance-compatible runtime authority adapter
- authority snapshot for products, sellers and tenants/DAOs
- entity-level authority lookup
- constitutional standing hydration
- governance status hydration
- federation tier hydration
- warnings, sanctions and restriction visibility
- operational approval and emergency state visibility
- read-only authority metadata
- API endpoints for governance authority snapshot and entity lookup
- frontend authority panels on product detail, seller profile, tenant storefront, entitlements and billing
- API repository, controller and web client tests for authority hydration

Still deferred:
- governance writes
- sanctions mutation
- approval execution
- emergency authority execution
- hard dependency on live Governance runtime API
- Marketplace-side authority override

---

# Sprint 12 — Governance Enforcement Boundaries

Status: IMPLEMENTED PREVIEW-ONLY

Delivered:
- governance enforcement runtime read model
- enforcement snapshot endpoint
- entity-level enforcement lookup endpoint
- product visibility enforcement preview
- seller storefront enforcement preview
- tenant/DAO storefront enforcement preview
- purchase, bid and listing preview allowance flags
- entitlement invalidation previews
- subscription restriction previews
- license restriction previews
- governance override visibility
- review queue metadata
- reason codes for restricted, hidden and review-required states
- frontend enforcement panels on product detail, seller profile, tenant storefront, entitlements and billing
- product explorer visibility summary and product card enforcement labels
- API and web tests for enforcement hydration and preview-only blocking state

Still deferred:
- hard product blocking
- destructive listing removal
- live entitlement revocation
- live subscription cancellation
- live license suspension
- seller or tenant freeze execution
- governance write execution

---

# Sprint 13 — DAO Federation Runtime

Status: IMPLEMENTED PREVIEW-ONLY

Delivered:
- DAO federation runtime read model
- DAO federation snapshot endpoint
- tenant runtime lookup endpoint
- DAO storefront activation state
- storefront operational status
- storefront governance visibility
- DAO-owned product runtime metadata
- tenant-scoped product, seller, invoice, license, subscription and entitlement boundaries
- tenant-scoped governance record boundaries
- constitutional inheritance records
- inherited restrictions
- inherited visibility rules
- federation health metrics
- storefront telemetry
- tenant storefront UI for activation, operational status, tenant isolation and inheritance
- API and web tests for federation runtime hydration

Still deferred:
- public storefront activation
- production tenant isolation enforcement
- cross-tenant settlement
- constitutional write execution
- destructive tenant freeze
- public DAO storefront publishing workflow

---

# Sprint 14 — Governance Workflow Runtime

Status: IMPLEMENTED MOCK-PERSISTENT

Delivered:
- governance workflow runtime read model
- product review queue
- seller review queue
- storefront review queue
- entitlement review queue
- billing review queue
- approval lifecycle states: pending_approval, approved, rejected, restricted, escalated, emergency_review
- constitutional reason codes for warnings, sanctions, restrictions and escalations
- moderation runtime metrics
- persisted governance workflow actions
- governance workflow audit records
- API endpoints for workflow snapshot and moderation action persistence
- Marketplace Governance page workflow queue and reason-code visibility
- API and web tests for workflow hydration, moderation actions and audit persistence

Still deferred:
- live Governance writes
- live sanctions
- destructive product removal
- live entitlement revocation
- production moderation assignment engine
- real approval mutation in Governance nucleus

---

# Sprint 15 — Governance Observability & Emergency Controls

Status: IMPLEMENTED PREVIEW-ONLY

Delivered:
- governance observability runtime read model
- emergency restriction preview controls
- emergency freeze preview controls
- emergency suspension preview controls
- emergency visibility preview controls
- governance action telemetry
- restriction telemetry
- moderation telemetry
- emergency event telemetry
- operator console API endpoint
- frontend operator console route at `/marketplace/operator`
- operator console navigation entry
- operator visibility for governance, moderation, restrictions and federation
- API and web tests for emergency runtime and observability hydration

Still deferred:
- live Governance emergency writes
- live product removal
- live seller or tenant freeze
- live license suspension
- live entitlement revocation
- live settlement intervention

---

# Sprint 16 — Reown/AppKit Runtime Real

Status: IMPLEMENTED READONLY

Delivered:
- real readonly wallet runtime service
- Reown/AppKit provider discovery boundary
- EIP-1193 injected wallet fallback
- wallet session hydration through `eth_accounts`
- active chain hydration through `eth_chainId`
- wallet connection through `eth_requestAccounts`
- chain switching through `wallet_switchEthereumChain`
- disconnect handling
- local wallet session persistence
- provider event handling for account, chain and disconnect changes
- supported chain and restricted chain visibility
- Marketplace layout wallet status and connect/disconnect controls
- wallet runtime tests for hydration, connection, chain switching and disconnect

Still deferred:
- wallet signatures
- transaction execution
- NFT transfer
- contract writes
- settlement execution
- production Reown project configuration hard dependency

---

# Sprint 17 — NFT Ownership Reads

Status: IMPLEMENTED READONLY

Delivered:
- readonly NFT ownership runtime service
- ERC721 `ownerOf` read encoding and verification
- ERC1155 `balanceOf` read encoding and verification
- governance NFT classification
- license/access NFT classification
- disconnected wallet ownership state
- unsupported/restricted chain ownership state
- ownership mismatch state
- unreadable mock contract state for non-production contract references
- product detail NFT ownership panel
- ownership read and rendering tests

Still deferred:
- mint execution
- transfer execution
- approval execution
- wallet signatures
- contract writes
- production ownership-to-entitlement enforcement

---

# Sprint 18 — Marketplace Listing Runtime Real

Status: IMPLEMENTED READONLY

Delivered:
- readonly listing runtime service
- fixed listing state hydration through `eth_call`
- english auction state hydration through `eth_call`
- dutch auction state hydration through `eth_call`
- bid count and highest bid hydration
- expiration state hydration
- EIP-2981 royalty info hydration
- marketplace contract read boundary
- auction contract read boundary
- royalty/NFT contract read boundary
- product detail listing runtime panel
- listing, auction, royalty and hydration tests

Still deferred:
- buy execution
- bid placement
- auction settlement
- listing cancellation
- contract writes
- wallet signatures
- production marketplace ABI hard dependency

---

# Sprint 19 — Signature Preparation Runtime

Status: IMPLEMENTED PREVIEW-ONLY

Delivered:
- signature intent runtime service
- transaction payload preview
- calldata preview for buy-now intents
- calldata preview for bid intents
- calldata preview for create-listing intents
- optional gas estimation preview through `eth_estimateGas`
- contract visibility
- wallet and chain visibility
- permission visibility
- warning and risk visibility
- product detail signature intent panel
- signature runtime, calldata and UX tests

Still deferred:
- `eth_sendTransaction`
- `personal_sign`
- `eth_signTypedData`
- wallet signature requests
- transaction submission
- contract writes
- settlement execution

---

# Sprint 20 — Wallet Security Hardening

Status: IMPLEMENTED READONLY

Delivered:
- wallet security runtime service
- unsupported chain protection visibility
- chain mismatch warning state
- malicious/suspicious contract warning state
- symbolic mock contract warning state
- invalid NFT runtime visibility
- readonly `isApprovedForAll` approval visibility
- dangerous operator permission warnings
- fake ownership detection from mismatch state
- stale ownership visibility
- purchase and bid permission visibility
- product detail wallet security panel
- security runtime, approval visibility and warning tests

Still deferred:
- approval revocation execution
- transaction blocking execution
- ownership mutation
- wallet signatures
- transaction submission
- contract writes

---

# Sprint 21 — Marketplace Indexer Runtime

Status: IMPLEMENTED PERSISTENT RUNTIME

Delivered:
- Marketplace chain ingestion runtime service
- NFT event ingestion records
- listing event ingestion records
- auction event ingestion records
- bid event ingestion records
- ownership event ingestion records
- chain snapshot persistence
- ownership snapshot persistence
- listing snapshot persistence
- aggregate indexer runtime snapshot
- API endpoints for ingesting and reading indexer runtime data
- replay-safe dedupe key by chain, transaction hash, log index and event kind
- repository and controller tests for ingestion and snapshots

Still deferred:
- live node subscriptions
- production queue publishing
- production indexer workers
- settlement reconciliation execution
- treasury verification execution
- ownership enforcement mutation

---

# Sprint 22 — Ownership Reconciliation

Status: IMPLEMENTED PERSISTENT RUNTIME

Delivered:
- ownership reconciliation runtime service
- ownership verification against runtime holders
- stale ownership detection by block lag
- mismatch visibility
- missing ownership snapshot visibility
- invalid NFT asset visibility
- consistency checks across ownership snapshots, purchases and license runtime
- persisted ownership reconciliation snapshots
- API endpoints for creating and listing ownership reconciliation snapshots
- repository and controller tests for mismatch and stale detection

Still deferred:
- live chain reads during reconciliation
- ownership mutation
- entitlement enforcement mutation
- settlement reconciliation execution
- wallet execution

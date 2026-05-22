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
- Reown AppKit wallet state mock

Constraints:
- no real payment execution
- no production contract addresses
- no live blockchain settlement
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

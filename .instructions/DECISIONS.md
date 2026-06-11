# Marketplace Decisions

# Active Decisions

## Marketplace Direction

Decision:
Marketplace acts as the sovereign distribution and ecosystem commerce infrastructure of Axodus.

Marketplace is the official infrastructure for distribution, commercialization, licensing, subscription access and discovery of Axodus digital capabilities.

Status:
CONFIRMED

---

## Phase 00 Marketplace Architecture Revision

Decision:
Phase 00 revises Marketplace from a product framed primarily as a mock-first NFT marketplace into a federated digital distribution infrastructure for the Axodus ecosystem.

The NFT marketplace nucleus remains the first commercial vertical and foundational asset primitive. It is not deprecated or replaced.

Preserved NFT foundations:
- ERC721
- ERC1155
- EIP-2981 royalties
- listings
- bids
- english and dutch auctions
- buy-now
- seller profiles
- collections
- asset registry

New architectural domains:
- Marketplace Federation Domain
- Marketplace-as-a-Service Domain
- Distribution Network Domain
- Revenue Sharing Domain
- Marketplace Intelligence Domain

Phase 00 is documentation-only.

Deferred:
- runtime implementation
- API implementation
- contract implementation
- indexer implementation
- React implementation
- persistence implementation
- GraphQL implementation
- real billing
- external integrations
- wallet signatures
- bridge execution
- treasury routing
- on-chain execution

Status:
CONFIRMED

---

## Marketplace Federation Domain

Decision:
Marketplace must support federation of external assets as a future visibility, interoperability, discovery, import and progressive validation capability.

Federation allows Marketplace to represent:
- External Collections
- External Assets
- External Contracts
- External Metadata
- Federation Providers

Federation must preserve:
- tenant boundaries
- governance context
- constitutional inheritance visibility
- catalog ownership
- operational telemetry
- restriction visibility
- origin visibility
- provider visibility
- validation status
- provenance
- risk classification
- trust boundaries

External assets must not be treated as trusted by default. Every external or federated asset must carry explicit origin, provider, validation status, provenance and trust boundaries before it is presented as a federated asset.

Federation does not imply:
- native Axodus issuance
- automatic custody
- automatic liquidation
- automatic execution
- automatic validation
- automatic trust
- on-chain execution
- wallet signatures
- settlement
- bridge execution
- treasury routing
- governance bypass
- public storefront activation
- live tenant isolation enforcement
- cross-tenant settlement
- external marketplace integration in Phase 00

Status:
CONFIRMED

---

## MEP-REQ-001 External Asset Federation

Decision:
Marketplace supports architectural federation of external assets, collections, contracts and metadata.

External Collections are collections originated outside native Axodus infrastructure that may be visible, searchable, referencable, classified or displayed in Marketplace.

External Assets are NFTs, certificates, licenses or digital assets originated from external contracts, wallets, collections or providers.

External Contracts are ERC721, ERC1155 or other compatible contracts that may be indexed, imported, referenced, analyzed or displayed by Marketplace in a future approved implementation phase.

External Metadata is metadata obtained outside Axodus infrastructure, including images, attributes, descriptions, statistics, declared royalties, provenance, origin, validation state and risk information.

Federation Providers are external providers, connectors, data sources or integration systems responsible for future discovery, import, enrichment, classification or validation of external assets and collections.

Phase 00 records the architecture only. It does not create real connectors, provider integrations, SDKs, endpoints, schemas, HTTP calls, indexers, contracts, custody, settlement or on-chain execution.

Status:
CONFIRMED

---

## Marketplace-as-a-Service Domain

Decision:
Marketplace may evolve into a Marketplace-as-a-Service capability for Axodus tenants, partners and enterprise operators.

This domain prepares:
- white-label marketplace boundaries
- tenant-scoped catalogs
- configurable commercial policies
- tenant operational dashboards
- platform service separation from tenant authority

Phase 00 does not provision tenants, deploy managed marketplaces, activate production billing or onboard external customers.

Status:
CONFIRMED

---

## Distribution Network Domain

Decision:
Marketplace must model distribution networks for NFTs, ACS capabilities, Academy products, DAO services, enterprise offers, partner offers and affiliate channels.

Distribution architecture must separate:
- discovery
- catalog propagation
- offer routing
- entitlement activation
- commercial telemetry

Phase 00 does not activate affiliate payouts, partner integrations, external catalog synchronization or entitlement mutation.

Status:
CONFIRMED

---

## Revenue Sharing Domain

Decision:
Marketplace must prepare revenue sharing models for creators, sellers, tenants, partners, affiliates, platform fees, ecosystem fees and treasury-compatible splits.

Revenue sharing must preserve EIP-2981 royalty compatibility and deterministic accounting visibility.

All Phase 00 revenue sharing is architectural. It does not execute payment settlement, treasury movement, royalty distribution, partner payout, tax calculation or fiat reconciliation.

Status:
CONFIRMED

---

## Marketplace Intelligence Domain

Decision:
Marketplace must prepare governance-compatible commercial intelligence for catalog health, product discovery, tenant performance, seller visibility, distribution effectiveness and operational risk visibility.

Intelligence must be transparent and auditable. It must not create hidden ranking authority, automated pricing, autonomous promotion or user profiling outside a future approved policy.

Status:
CONFIRMED

---

## Distribution Philosophy

Decision:
Marketplace distributes ecosystem capabilities, not speculative products.

Status:
CONFIRMED

---

## ACS Marketplace Integration

Decision:
ACS services may be distributed through Marketplace.

This includes:
- MCP systems
- orchestration packages
- AI agents
- compute access
- workflow systems

Status:
CONFIRMED

---

## Educational Commerce

Decision:
Academy systems may be distributed through Marketplace.

This includes:
- certifications
- governance education
- learning subscriptions
- educational products

Status:
CONFIRMED

---

## Subscription Philosophy

Decision:
Subscriptions act as operational access infrastructure.

Subscriptions must expose:
- lifecycle visibility
- settlement visibility
- operational telemetry

Status:
CONFIRMED

---

## Billing Philosophy

Decision:
Billing acts as treasury-aware commerce accounting infrastructure.

Billing systems must remain:
- deterministic
- transparent
- auditable

Status:
CONFIRMED

---

## Governance Integration

Decision:
Marketplace remains governance-aware and governance-constrained.

Marketplace systems must never bypass:
- governance permissions
- treasury boundaries
- constitutional restrictions

Status:
CONFIRMED

---

## Marketplace MVP Execution Model

Decision:
Phase 1 Marketplace is a governance-aware NFT marketplace MVP using React, Vite, Tailwind, React Router and TanStack Query.

The original NFT marketplace nucleus remains explicit:
- ERC721/1155 assets
- EIP-2981 royalty previews
- fixed listings
- english/dutch auctions
- bids
- buy-now previews
- item pages
- create/sell contract boundaries

Products, licenses, Academy assets, MCP services and DAO utilities extend the NFT marketplace model.

No real settlement, production contract addresses, wallet signatures, bridge execution or treasury routing are enabled in Phase 1.

Status:
CONFIRMED

---

## Operational Transparency

Decision:
Marketplace systems must expose:
- settlement visibility
- operational telemetry
- access visibility
- ACS provisioning visibility

Opaque operational authority is forbidden.

Status:
CONFIRMED

---

## Sprint 04 Delivery Runtime Execution Model

Decision:
Marketplace may expose delivery runtime, entitlement checks, signed URL lifecycle, revocation state and telemetry before production delivery exists.

Approved:
- delivery runtime models for downloadable, protected, streamed, ACS, educational and enterprise assets
- Greenfield signed URL preview lifecycle
- entitlement enforcement preview for ownership, subscription, license, DAO and governance restrictions
- delivery telemetry preview for checks, attempts, revocations and preview issuance
- protected asset and entitlement-required UX labels

Deferred:
- production Greenfield execution
- production signed URL issuance
- real file download authorization
- live stream delivery
- ACS runtime provisioning
- live ownership validation
- real subscription/license/DAO entitlement enforcement
- access revocation execution

Status:
CONFIRMED

---

## Sprint 05 Runtime Hardening Before Settlement

Decision:
Marketplace runtime must be performance-hardened, observable, accessible and route-stable before real execution or settlement is introduced.

Approved:
- route-level lazy loading
- dashboard chunk isolation
- product detail chunk isolation
- wallet runtime isolation from the global layout
- in-memory lifecycle and adapter tracing
- route/runtime error instrumentation
- bounded query retry defaults
- loading and empty state improvements
- accessible dialog, badge, table, filter and navigation affordances

Deferred:
- external telemetry export
- production monitoring backend
- live contract tracing
- live settlement observability
- wallet execution
- production Greenfield execution

Status:
CONFIRMED

---

## Sprint 06 Backend-Owned Mock Persistence

Decision:
Marketplace runtime state may move from frontend-only snapshots into a backend-owned mock persistence layer before production settlement exists.

Approved:
- HTTP API routes under `/api/marketplace`
- file-backed repository persistence in `.runtime/marketplace-store.json`
- repository boundaries for products, sellers, tenants, licenses, purchases, subscriptions, billing previews, governance validations, draft listings, delivery previews and events
- frontend API hydration through `apiClient`
- fallback to frontend mock services when the API runtime is offline
- preview-only persistence for listings, purchases, invoices, subscriptions and delivery access

Deferred:
- production DB migration strategy
- indexer reconciliation
- real wallet execution
- contract writes
- NFT minting or settlement
- real Greenfield signed URL issuance
- treasury settlement

Status:
CONFIRMED

---

## Sprint 07 Canonical Registry Read Models

Decision:
Marketplace product, seller and tenant ownership must be represented as canonical registry read models before public storefront activation or real settlement is introduced.

Approved:
- derived product registry records
- derived seller registry records
- derived tenant/DAO registry records
- DAO and seller storefront preview records
- tenant-scoped product ownership
- seller-to-tenant relationship normalization
- read-only governance standing, warnings, restrictions and federation tier visibility
- archival and deprecation state in product registry versioning

Deferred:
- public storefront activation
- storefront publishing workflow
- real sanctions enforcement
- reputation scoring engine
- governance write actions
- production registry database/indexer reconciliation

Status:
CONFIRMED

---

## Sprint 08 Backend Entitlement Lifecycle

Decision:
Marketplace entitlement, license and subscription lifecycle state must be persisted in the backend runtime before real payment, NFT settlement or production access enforcement is introduced.

Approved:
- issued license runtime records
- license lifecycle transitions for preview, issued, active, suspended, expired and revoked
- subscription lifecycle transitions for active, paused, renewal due, pending, cancelled and expired
- entitlement aggregation snapshots by holder
- governance and tenant restriction visibility
- delivery permission previews
- access enforcement readiness metadata with real blocking disabled
- future NFT and wallet ownership merge readiness

Deferred:
- real payment execution
- NFT minting, transfer or settlement
- production ownership validation
- production access blocking
- real subscription billing
- production revocation enforcement

Status:
CONFIRMED

---

## Sprint 09 Non-Settlement Accounting Runtime

Decision:
Marketplace may persist invoice, billing, royalty and treasury preview accounting before any real payment or treasury execution exists.

Approved:
- invoice preview persistence
- invoice lifecycle states
- line item accounting
- EIP-2981 royalty preview accounting
- creator split preview
- platform fee preview
- ecosystem fee preview
- treasury routing preview
- tax placeholder boundaries
- accounting telemetry
- reconciliation preview state

Deferred:
- payment execution
- real treasury movement
- royalty distribution
- production tax calculation
- external payment reconciliation
- accounting export integration

Status:
CONFIRMED

---

## Sprint 10 Audit And Reconciliation Readiness

Decision:
Marketplace must persist operational audit logs and replay-safe runtime events before live indexer, blockchain reconciliation or production settlement is introduced.

Approved:
- audit log persistence
- runtime event categorization
- replay-safe event metadata
- correlation IDs
- reconciliation preview snapshots
- indexer readiness snapshots
- ownership merge readiness metadata
- NFT event ingestion readiness metadata
- operational traceability dashboard

Deferred:
- live blockchain reads
- queue publishing
- production indexer ingestion
- treasury verification
- settlement verification
- ownership verification

Status:
CONFIRMED

---

## Sprint 11 Governance Runtime Authority

Decision:
Marketplace must consume Governance-compatible runtime authority as read-only first-class data before any governance write, settlement or public enforcement phase is introduced.

Approved:
- GovernanceRuntimeAuthorityAdapter boundary
- governance authority snapshot endpoint
- entity authority lookup endpoint
- product, seller and tenant authority hydration
- constitutional standing hydration
- federation tier hydration
- warning and sanction visibility
- operational approval visibility
- emergency and restriction state visibility
- product, seller, tenant, entitlement and billing context panels

Deferred:
- governance writes
- sanctions mutation
- approval execution
- emergency action execution
- live Governance API dependency as a hard requirement
- Marketplace-side authority override

Status:
CONFIRMED

---

## Sprint 12 Governance Enforcement Boundaries

Decision:
Marketplace visibility, storefront, commerce preview and entitlement preview flows must react to Governance authority through explicit enforcement boundaries before hard blocking is introduced.

Approved:
- governance enforcement snapshot
- entity-level enforcement lookup
- product visibility preview
- seller storefront restriction preview
- tenant storefront restriction preview
- purchase, bid and listing preview allowance flags
- entitlement invalidation preview
- subscription restriction preview
- license restriction preview
- governance override visibility
- review queue routing metadata
- reason codes for restricted, hidden, warning and review-required states

Deferred:
- destructive product hiding
- live entitlement revocation
- live subscription cancellation
- live license suspension
- seller or tenant freeze execution
- governance write execution
- hard blocking of runtime access

Status:
CONFIRMED

---

## Sprint 13 DAO Federation Runtime

Decision:
Marketplace must expose DAO storefront runtime, tenant-scoped boundaries and constitutional inheritance as first-class read models before public storefront activation or real tenant enforcement is introduced.

Approved:
- DAO federation runtime snapshot
- tenant runtime lookup
- DAO storefront activation state
- storefront operational status
- storefront governance visibility
- tenant-scoped product, seller, invoice, license, subscription and entitlement boundaries
- constitutional inheritance records
- inherited restrictions and visibility rules
- federation health metrics
- storefront telemetry and operational visibility

Deferred:
- public storefront activation
- production tenant isolation enforcement
- cross-tenant settlement
- constitutional write execution
- destructive tenant freeze
- public DAO storefront publishing workflow

Status:
CONFIRMED

---

## Sprint 14 Governance Workflow Runtime

Decision:
Marketplace must persist governance workflow actions and expose operational review queues before live moderation or Governance write execution is introduced.

Approved:
- product, seller, storefront, entitlement and billing review queues
- approval lifecycle states
- constitutional warning, sanction, restriction and escalation reason codes
- moderation runtime metrics
- persisted governance workflow action records
- governance workflow audit visibility
- Marketplace Governance page workflow rendering

Deferred:
- live Governance writes
- live sanction execution
- live approval mutation in Governance nucleus
- destructive product removal
- live entitlement revocation
- production moderation assignment engine

Status:
CONFIRMED

---

## Sprint 15 Governance Observability And Emergency Controls

Decision:
Marketplace must expose emergency governance readiness and operator observability before any live emergency control is enabled.

Approved:
- emergency restriction preview controls
- emergency freeze preview controls
- emergency suspension preview controls
- emergency visibility preview controls
- governance action telemetry
- restriction telemetry
- moderation telemetry
- emergency event telemetry
- operator console route
- federation and restriction visibility in operator console

Deferred:
- live Governance emergency writes
- live product removal
- live seller or tenant freeze
- live license suspension
- live entitlement revocation
- live settlement intervention

Status:
CONFIRMED

---

## Sprint 16 Reown/AppKit Readonly Wallet Runtime

Decision:
Marketplace may replace wallet mock state with a real readonly wallet session runtime before settlement or ownership execution is enabled.

Approved:
- Reown/AppKit provider discovery boundary
- injected EIP-1193 provider fallback
- account session hydration with `eth_accounts`
- user connection with `eth_requestAccounts`
- chain state hydration with `eth_chainId`
- chain switching with `wallet_switchEthereumChain`
- local session persistence
- account, chain and disconnect event handling
- supported and restricted chain visibility
- Marketplace layout wallet visibility

Deferred:
- wallet signatures
- transaction execution
- NFT transfer
- contract writes
- settlement execution
- production Reown project enforcement

Status:
CONFIRMED

---

## Sprint 17 Readonly NFT Ownership Reads

Decision:
Marketplace may perform readonly NFT ownership verification through wallet/provider reads before ownership enforcement, minting, transfer or settlement is enabled.

Approved:
- ERC721 `ownerOf` readonly reads
- ERC1155 `balanceOf` readonly reads
- governance NFT ownership classification
- license/access NFT ownership classification
- disconnected wallet state rendering
- unsupported chain state rendering
- ownership mismatch rendering
- unreadable mock contract rendering
- product detail ownership visibility

Deferred:
- NFT minting
- NFT transfer
- approval execution
- wallet signatures
- contract writes
- production entitlement enforcement from ownership reads

Status:
CONFIRMED

---

## Sprint 18 Readonly Marketplace Listing Runtime

Decision:
Marketplace may hydrate listing, auction, bid, expiration and royalty state through readonly contract calls before settlement or listing writes are enabled.

Approved:
- fixed listing readonly hydration
- english auction readonly hydration
- dutch auction readonly hydration
- bid count and highest bid hydration
- expiration state hydration
- EIP-2981 royalty info hydration
- marketplace contract read adapter boundary
- auction contract read adapter boundary
- royalty/NFT contract read adapter boundary
- product detail listing runtime visibility

Deferred:
- buy execution
- bid placement
- auction settlement
- listing cancellation
- contract writes
- wallet signatures
- production marketplace ABI hard dependency

Status:
CONFIRMED

---

## Sprint 19 Signature Preparation Runtime

Decision:
Marketplace may expose transaction payload, calldata, gas estimate and signature intent previews before any wallet signature or transaction execution is enabled.

Approved:
- transaction payload preview
- buy-now calldata preview
- bid calldata preview
- create-listing calldata preview
- optional `eth_estimateGas` preview
- contract visibility
- wallet and chain visibility
- permission visibility
- risk and warning visibility
- confirmation preview UI

Deferred:
- `eth_sendTransaction`
- `personal_sign`
- `eth_signTypedData`
- wallet signature request
- transaction submission
- contract writes
- settlement execution

Status:
CONFIRMED

---

## Sprint 20 Wallet Security Hardening

Decision:
Marketplace wallet and ownership runtime must expose security warnings and permission visibility before any approval revocation, transaction blocking or settlement execution exists.

Approved:
- unsupported chain protection visibility
- chain mismatch warnings
- suspicious contract warnings
- symbolic mock contract warnings
- invalid NFT runtime visibility
- readonly `isApprovedForAll` approval visibility
- dangerous operator permission warnings
- fake ownership suspicion from mismatch state
- stale ownership visibility
- purchase and bid permission visibility
- product detail wallet security panel

Deferred:
- approval revocation execution
- transaction blocking execution
- ownership mutation
- wallet signatures
- transaction submission
- contract writes

Status:
CONFIRMED

---

## Sprint 21 Marketplace Indexer Runtime

Decision:
Marketplace may persist chain ingestion events and derived snapshots before live node subscriptions or production reconciliation are enabled.

Approved:
- NFT event ingestion records
- listing event ingestion records
- auction event ingestion records
- bid event ingestion records
- ownership event ingestion records
- chain snapshot persistence
- ownership snapshot persistence
- listing snapshot persistence
- aggregate indexer runtime snapshot
- replay-safe ingestion dedupe keys
- indexer API endpoints

Deferred:
- live node subscriptions
- production queue publishing
- production indexer workers
- settlement reconciliation execution
- treasury verification execution
- ownership enforcement mutation

Status:
CONFIRMED

---

## Sprint 22 Ownership Reconciliation Runtime

Decision:
Marketplace may reconcile ownership using persisted indexer snapshots and runtime holder records before live chain reads or enforcement mutation are enabled.

Approved:
- ownership verification against purchase/license holders
- stale ownership detection by block lag
- mismatch visibility
- missing snapshot visibility
- invalid asset visibility
- consistency checks across ownership snapshots, purchases and license runtime
- persisted ownership reconciliation snapshots
- reconciliation API endpoints

Deferred:
- live chain reads during reconciliation
- ownership mutation
- entitlement enforcement mutation
- settlement reconciliation execution
- wallet execution

Status:
CONFIRMED

---

# Sprint 23 Billing/Treasury Reconciliation Runtime

Decision:
Marketplace may persist treasury and accounting reconciliation preview snapshots before any real treasury movement, royalty distribution or payment settlement exists.

Approved:
- royalty reconciliation against persisted invoice previews
- treasury split verification
- creator split verification
- platform and ecosystem fee consistency checks
- accounting consistency readiness flags
- settlement preview readiness flags
- persisted treasury reconciliation snapshots
- reconciliation API endpoints
- treasury preview runtime/audit event category

Deferred:
- real treasury movement
- royalty distribution
- payment settlement
- external accounting reconciliation
- contract writes
- wallet execution

Status:
CONFIRMED

---

# Sprint 24 Event Streaming Runtime

Decision:
Marketplace may expose realtime infrastructure over persisted mock-first runtime state before external brokers, production queues or live node subscriptions exist.

Approved:
- realtime snapshot endpoint
- Server-Sent Events preview stream
- readonly WebSocket handshake endpoint
- listing update aggregation
- bid update aggregation
- governance update aggregation
- telemetry update aggregation
- persisted realtime snapshot audit/runtime event

Deferred:
- external websocket broker
- production queue fanout
- live chain node subscriptions
- realtime settlement events
- contract writes
- wallet execution

Status:
CONFIRMED

---

# Sprint 25 Operational Resilience Runtime

Decision:
Marketplace may expose operational resilience previews over persisted runtime state before automatic retries, production failover or live indexer recovery exist.

Approved:
- retry queue previews
- reconciliation retry readiness
- treasury retry readiness
- realtime stream retry readiness
- indexer stale snapshot recovery readiness
- degraded mode visibility
- failover readiness flags
- stale recovery recommendations
- persisted resilience snapshot audit/runtime event

Deferred:
- automatic retry execution
- production failover switching
- external queue publishing
- live indexer recovery
- settlement execution
- contract writes
- wallet execution

Status:
CONFIRMED

---

# Sprint 26 Greenfield Authentication Runtime

Decision:
Marketplace may expose Greenfield authentication runtime over persisted delivery, entitlement and ownership snapshot state before production Greenfield calls or live access enforcement are enabled.

Approved:
- bucket access runtime model
- Greenfield auth preview records
- holder access verification
- license and subscription entitlement checks
- NFT ownership snapshot readiness
- signed URL auth preview lifecycle
- Greenfield auth snapshot metrics
- delivery telemetry event for auth verification

Deferred:
- production Greenfield API calls
- production signed URL issuance
- bucket policy mutation
- live ownership enforcement
- asset movement
- contract writes
- wallet execution

Status:
CONFIRMED

---

# Sprint 27 Signed URL Runtime

Decision:
Marketplace may issue backend-real HMAC signed URL runtime records after Greenfield auth preview verification, while production Greenfield delivery and asset movement remain disabled.

Approved:
- signed URL issuance endpoint
- signed URL revocation endpoint
- signed URL snapshot endpoint
- HMAC-SHA256 signatures
- TTL and expiration visibility
- revocation visibility
- signed URL delivery telemetry events
- `MARKETPLACE_SIGNED_URL_SECRET` support with ephemeral local fallback

Deferred:
- production Greenfield API calls
- bucket policy mutation
- production CDN/object-store integration
- asset movement
- contract writes
- wallet execution

Status:
CONFIRMED

---

# Sprint 28 Entitlement Enforcement Runtime

Decision:
Marketplace may enforce license, subscription and DAO/tenant access operationally for backend access decisions before production asset delivery, settlement or chain writes are enabled.

Approved:
- operational access validation
- license enforcement
- subscription enforcement
- DAO/tenant access enforcement
- governance review/blocking decisions
- delivery and signed URL allow/deny flags
- enforcement snapshot metrics
- Greenfield auth and signed URL integration with enforcement decisions

Deferred:
- payment execution
- treasury movement
- contract writes
- wallet execution
- production object-store asset movement

Status:
CONFIRMED

---

# Sprint 29 Secure Asset Delivery Runtime

Decision:
Marketplace may prepare secure delivery manifests for encrypted downloads, secure streams and ACS packages after entitlement enforcement, while production file transfer and provisioning remain disabled.

Approved:
- encrypted download manifest preparation
- secure stream manifest preparation
- ACS package delivery manifest preparation
- entitlement-gated delivery preparation
- HMAC-wrapped delivery tokens
- delivery snapshot metrics
- secure delivery telemetry event

Deferred:
- file transfer
- live media streaming
- ACS runtime provisioning
- production object-store calls
- asset movement
- contract writes
- wallet execution

Status:
CONFIRMED

---

# Sprint 30 Delivery Observability Runtime

Decision:
Marketplace may persist delivery telemetry, entitlement traceability, delivery audit records and access analytics for secure delivery runtime before production delivery execution exists.

Approved:
- download telemetry persistence
- secure stream telemetry persistence
- ACS package access telemetry persistence
- entitlement traceability
- delivery audit records
- access analytics snapshot
- delivery telemetry API endpoints

Deferred:
- file transfer
- live media streaming
- ACS runtime provisioning
- production object-store reads
- settlement execution
- contract writes
- wallet execution

Status:
CONFIRMED

---

# Sprint 31 Settlement Runtime Activation

Decision:
Marketplace may execute controlled internal settlement runtime records when `controlledRollout: true` is provided, while wallet transactions, chain writes, external payment gateways and treasury movement remain disabled.

Approved:
- controlled purchase execution
- settlement confirmation records
- transaction lifecycle records
- purchase and license issuance from settlement runtime
- settlement snapshot metrics
- settlement runtime audit/event records

Deferred:
- wallet transaction execution
- blockchain writes
- external payment gateway execution
- treasury movement
- fiat checkout
- contract settlement

Status:
CONFIRMED

---

# Sprint 32 Royalty Distribution Runtime

Decision:
Marketplace may allocate operational royalty distribution records from confirmed controlled settlements when `controlledRollout: true` is provided, while external payouts, contract royalty settlement and treasury movement remain disabled.

Approved:
- EIP-2981 royalty allocation
- creator payout allocation records
- platform fee allocation records
- ecosystem fee allocation records
- treasury split allocation records
- royalty distribution snapshot metrics
- royalty distribution audit/event records

Deferred:
- external creator payout execution
- treasury movement
- contract royalty settlement
- wallet transaction execution
- blockchain writes

Status:
CONFIRMED

---

# Sprint 33 Auction & Bid Runtime

Decision:
Marketplace may run operational auction bid placement, controlled auction settlement and auction expiration inside the backend runtime, while contract settlement, wallet transactions, chain writes and external treasury movement remain disabled.

Approved:
- live bid placement records
- bid acceptance/rejection rules
- controlled auction settlement records
- auction expiration execution records
- purchase and license issuance from winning bid settlement
- auction runtime snapshot metrics
- auction runtime audit/event records

Deferred:
- contract auction settlement
- wallet transaction execution
- blockchain writes
- external treasury movement

Status:
CONFIRMED

---

# Sprint 34 Treasury Execution Runtime

Decision:
Marketplace may execute governance-aware internal treasury routing records for allocated royalty distributions when `controlledRollout: true` is provided, while external treasury movement, wallet transactions and chain writes remain disabled.

Approved:
- DAO treasury routing records
- ecosystem fee routing records
- platform fee routing records
- creator royalty routing records
- governance-aware execution gates
- treasury execution reconciliation
- treasury execution snapshot metrics
- treasury runtime audit/event records

Deferred:
- external treasury movement
- wallet transaction execution
- blockchain writes

Status:
CONFIRMED

---

# Sprint 35 Crosschain & LayerZero Runtime

Decision:
Marketplace may prepare LayerZero messages, execute controlled internal bridge runtime records and synchronize crosschain inventory state, while production LayerZero messaging, external bridge execution, wallet transactions and chain writes remain disabled.

Approved:
- LayerZero message preparation records
- bridge messaging records
- controlled bridge execution records
- crosschain ownership synchronization records
- crosschain inventory synchronization records
- crosschain runtime snapshot metrics
- crosschain runtime audit/event records

Deferred:
- production LayerZero messaging
- external bridge execution
- wallet transaction execution
- blockchain writes

Status:
CONFIRMED

---

# Pending Decisions

## DAO Marketplace Federation

Status:
PENDING

---

## ACS Provider Monetization

Status:
PENDING

---

## Enterprise Licensing Model

Status:
PENDING

---

## Subscription Identity Infrastructure

Status:
PENDING

---

## Decentralized Commerce Coordination

Status:
PENDING

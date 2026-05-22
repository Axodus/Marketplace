# Marketplace Decisions

# Active Decisions

## Marketplace Direction

Decision:
Marketplace acts as the sovereign distribution and ecosystem commerce infrastructure of Axodus.

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

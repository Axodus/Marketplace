# Marketplace Roadmap

# Phase 00 — Marketplace Architecture Revision

Status: IN PROGRESS

Objectives:
- revise Marketplace from NFT-only framing into federated Axodus digital distribution infrastructure
- preserve NFT marketplace primitives as the first commercial vertical
- define Marketplace Federation Domain
- define Marketplace-as-a-Service Domain
- define Distribution Network Domain
- define Revenue Sharing Domain
- define Marketplace Intelligence Domain
- prepare Phase 01 NFT Marketplace Consolidation, Phase 02 Federation Layer and Phase 03 Tenant Infrastructure

Deliverables:
- revised architecture specification
- revised product taxonomy
- revised workflow and planning boundaries
- decision record for federated Marketplace scope
- non-execution boundaries for runtime, payment, wallet, treasury, billing and external integrations

Non-goals:
- no runtime code
- no API implementation
- no contract implementation
- no indexer implementation
- no React implementation
- no persistence or GraphQL implementation
- no real billing, settlement, wallet signature, bridge, treasury routing or on-chain execution

---

# Phase 01 — NFT Marketplace Consolidation

Status: PLANNED

Objectives:
- consolidate the NFT marketplace vertical as the first Marketplace commercial product surface
- preserve ERC721, ERC1155, EIP-2981, listings, bids, auctions, buy-now, seller profiles, collections and asset registry
- align NFT products with licensing, entitlement, billing preview, governance and telemetry boundaries
- keep execution mode explicitly controlled by the approved implementation phase

Deliverables:
- consolidated NFT marketplace domain model
- NFT collection and asset registry readiness
- seller profile and storefront readiness
- listing, bid, auction and buy-now preview readiness
- royalty and settlement preview alignment

---

# Phase 02 — Federation Layer

Status: PLANNED

Objectives:
- introduce Marketplace Federation Domain implementation boundaries
- model DAO storefronts, tenant catalogs, seller catalogs, partner catalogs and white-label marketplaces
- preserve governance and constitutional visibility across federated surfaces
- display and organize internal and external assets without implying automatic trust, custody, liquidation, settlement or execution
- define External Collections, External Assets, External Contracts, External Metadata and Federation Providers as implementation-ready concepts
- carry origin, provider, validation status, provenance, risk and trust boundaries into every federated asset surface

Deliverables:
- federation read models
- tenant and storefront federation boundaries
- catalog visibility rules
- governance inheritance visibility
- federation telemetry readiness
- external collection import readiness
- external asset validation readiness
- external contract reference readiness
- external metadata normalization readiness
- federation provider registry readiness

Linked requirements:
- MEP-REQ-020 — Contract Import
- MEP-REQ-021 — Collection Import
- MEP-REQ-022 — Wallet Discovery
- MEP-REQ-023 — Federation Providers

Dependencies:
- PHASE 00 — Marketplace Architecture Revision
- Phase 01 — NFT Marketplace Consolidation

Implementation boundary:
- Phase 02 implementation is future work
- MEP-REQ-001 is documentation-only
- no real provider integration, connector, SDK, endpoint, indexer, GraphQL schema, HTTP call, contract change, custody, settlement, bridge execution, treasury routing or on-chain execution is introduced by Phase 00

---

# Phase 03 — Tenant Infrastructure

Status: PLANNED

Objectives:
- introduce Marketplace-as-a-Service tenant infrastructure
- prepare tenant-scoped catalog, offer, entitlement, licensing and subscription boundaries
- separate platform authority from tenant commercial configuration

Deliverables:
- tenant catalog model
- white-label marketplace capability boundaries
- tenant policy and configuration model
- tenant operational telemetry
- tenant access and entitlement readiness

---

# Phase 04 — Distribution Network

Status: PLANNED

Objectives:
- model Axodus distribution channels for NFTs, ACS, Academy, DAO, enterprise, partner and affiliate products
- prepare discovery, offer routing and catalog propagation without external activation

Deliverables:
- distribution channel model
- partner and affiliate boundary model
- catalog propagation readiness
- distribution telemetry readiness
- offer routing preview model

---

# Phase 05 — Revenue Sharing Infrastructure

Status: PLANNED

Objectives:
- introduce revenue sharing models for sellers, creators, tenants, partners, affiliates, platform fees, ecosystem fees and treasury-compatible splits
- preserve EIP-2981 royalty compatibility
- separate allocation previews from payout execution

Deliverables:
- revenue share participant model
- deterministic split preview model
- royalty compatibility model
- tenant and partner allocation previews
- treasury-compatible accounting visibility

---

# Phase 06 — Marketplace Intelligence

Status: FUTURE

Objectives:
- introduce governance-compatible commercial intelligence for discovery, catalog health, tenant performance, distribution effectiveness and operational risk visibility
- separate insight generation from automated execution

Deliverables:
- catalog intelligence read models
- tenant and seller performance visibility
- distribution effectiveness telemetry
- risk and governance visibility
- recommendation and ranking boundaries with no hidden authority

---

# Phase 07 — Sovereign Distribution Economy

Status: FUTURE

Objectives:
- create sustainable ecosystem-wide commerce infrastructure
- federate Axodus capabilities through governed, transparent and treasury-compatible commercial systems

Deliverables:
- decentralized operational commerce
- cognitive economy access
- ecosystem-wide licensing
- marketplace-as-a-service offerings
- federated distribution systems

Marketplace systems must remain:
- governance-aware
- treasury-compatible
- operationally transparent

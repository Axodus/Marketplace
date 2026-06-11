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
- support Tenant Marketplace, White Label Marketplace, Marketplace Branding, Marketplace Domains and Marketplace Themes as future implementation concepts
- prepare tenant configuration, tenant identity, tenant branding, domain/subdomain/slug identity and catalog isolation boundaries
- preserve Axodus governance, observability, product policy, licensing policy and treasury boundaries for every tenant

Deliverables:
- Multi-Tenant Foundation readiness
- tenant catalog model
- Curated Catalog readiness
- white-label marketplace capability boundaries
- Marketplace Branding model
- Marketplace Domains model
- Marketplace Themes model
- Tenant Isolation boundary model
- tenant policy and configuration model
- tenant operational telemetry
- tenant access and entitlement readiness

Linked requirements:
- MEP-REQ-030 — Multi-Tenant Foundation
- MEP-REQ-031 — Marketplace Branding
- MEP-REQ-032 — Tenant Domains
- MEP-REQ-033 — Tenant Isolation

Dependencies:
- PHASE 00 — Marketplace Architecture Revision
- Phase 01 — NFT Marketplace Consolidation
- Phase 02 — Federation Layer

Relationship to Phase 04:
- Phase 03 prepares tenant identity, configuration and isolation boundaries
- Phase 04 — Curated Catalogs depends on Tenant Infrastructure for tenant-specific catalog selection, product exposure and curation rules

Implementation boundary:
- Phase 03 implementation is future work
- MEP-REQ-002 is documentation-only
- no real multi-tenancy, tenant registry, domain routing, custom domain, subdomain, frontend route, database schema, API, GraphQL schema, persistence, tenant billing, tenant settlement, tenant revenue sharing, financial isolation, complete data isolation, tenant authentication, RBAC or tenant dashboard is introduced by Phase 00

---

# Phase 04 — Curated Catalogs

Status: PLANNED

Objectives:
- model tenant, partner, community, DAO, Academy, ACS and enterprise curated catalogs
- define editorial, commercial, strategic and community curation rules
- prepare product exposure, eligibility and governance validation for tenant-specific catalogs
- preserve relationship to future Distribution Network capabilities

Deliverables:
- curated catalog model
- tenant product selection rules
- catalog eligibility boundaries
- product exposure policy readiness
- governance validation readiness

---

# Phase 05 — Distribution Network

Status: PLANNED

Objectives:
- model Axodus distribution channels for NFTs, ACS, Academy, DAO, enterprise, partner and affiliate products
- prepare discovery, offer routing and catalog propagation without external activation
- recognize commercial channels, distributors, partners, agencies, affiliates, referrals and Community Marketplaces
- preserve Commercial Origin, Distribution Channel, Distribution Eligibility and Traceability for future Attribution Engine, Revenue Sharing and Marketplace Intelligence
- keep commercial distribution compatible with governance, product policies, licensing restrictions, observability and treasury boundaries

Deliverables:
- distribution channel model
- distributor model
- partner and affiliate boundary model
- agency boundary model
- Community Marketplace boundary model
- Distribution Eligibility model
- Commercial Origin model
- catalog propagation readiness
- distribution telemetry readiness
- offer routing preview model

Linked requirements:
- MEP-REQ-050 — Attribution Engine
- MEP-REQ-051 — Referral System
- MEP-REQ-052 — Partner Network

Dependencies:
- Phase 03 — Tenant Infrastructure
- Phase 04 — Curated Catalogs

Implementation boundary:
- Phase 05 implementation is future work
- MEP-REQ-003 is documentation-only
- no real attribution, referral, partner network, tracking, commission engine, partner dashboard, affiliate links, payment, payout, API, GraphQL schema, database, persistence, frontend component, route, integration, settlement, treasury routing or revenue sharing is introduced by Phase 00

---

# Phase 06 — Revenue Sharing Infrastructure

Status: PLANNED

Objectives:
- introduce revenue sharing models for sellers, creators, tenants, partners, affiliates, platform fees, ecosystem fees and treasury-compatible splits
- preserve EIP-2981 royalty compatibility
- separate allocation previews from payout execution
- define Attribution Model, Commission Model, Revenue Split Rules and Tenant Participation implementation boundaries
- prepare Commission Engine, Split Rules and Revenue Dashboard as future capabilities
- depend on Distribution Network commercial origin, distribution eligibility and traceability
- depend on Attribution Engine or equivalent commercial attribution capability before activation

Deliverables:
- revenue share participant model
- deterministic split preview model
- royalty compatibility model
- tenant and partner allocation previews
- treasury-compatible accounting visibility
- Attribution Model readiness
- Commission Model readiness
- Revenue Split Rules readiness
- Tenant Participation readiness
- Billing Visibility boundary
- Settlement Visibility boundary
- Treasury Validation boundary
- Revenue Dashboard readiness

Linked requirements:
- MEP-REQ-060 — Commission Engine
- MEP-REQ-061 — Split Rules
- MEP-REQ-062 — Revenue Dashboard

Dependencies:
- Phase 05 — Distribution Network
- Attribution Engine or equivalent commercial attribution capability
- Billing Visibility and Settlement Visibility boundaries
- Treasury Validation boundary

Implementation boundary:
- Phase 06 implementation is future work
- MEP-REQ-004 is documentation-only
- no real Commission Engine, split engine, Revenue Dashboard, payment, payout, billing, settlement, treasury routing, definitive financial calculation, pricing model, API, GraphQL schema, database, persistence, frontend component, route, contract, adapter or integration is introduced by Phase 00

---

# Phase 07 — Marketplace Intelligence

Status: FUTURE

Objectives:
- introduce governance-compatible commercial intelligence for discovery, catalog health, tenant performance, distribution effectiveness and operational risk visibility
- separate insight generation from automated execution
- transform catalog, collection, tenant, product, distribution, revenue, activity and telemetry data into commercial and operational intelligence
- define Commercial Analytics, Collection Analytics, Tenant Analytics and Distribution Analytics implementation boundaries
- preserve interpretability, traceability, auditability, transparency and governance compatibility for metrics and indicators

Deliverables:
- Commercial Analytics readiness
- Collection Analytics readiness
- Tenant Analytics readiness
- Product Analytics readiness
- Distribution Analytics readiness
- catalog intelligence read models
- tenant and seller performance visibility
- distribution effectiveness telemetry
- risk and governance visibility
- recommendation and ranking boundaries with no hidden authority
- Interpretability and Traceability criteria
- Auditability requirements
- Operational Intelligence boundaries

Linked requirements:
- MEP-REQ-070 — Commercial Analytics
- MEP-REQ-071 — Collection Analytics
- MEP-REQ-072 — Tenant Analytics
- MEP-REQ-073 — Distribution Analytics

Dependencies:
- Phase 01 — NFT Marketplace Consolidation
- Phase 02 — Federation Layer
- Phase 03 — Tenant Infrastructure
- Phase 04 — Curated Catalogs
- Phase 05 — Distribution Network
- Phase 06 — Revenue Sharing

Implementation boundary:
- Phase 07 implementation is future work
- MEP-REQ-005 is documentation-only
- no dashboard, tracking, analytics event, BI integration, telemetry pipeline, analytics schema, analytics database, sensitive data collection, API, GraphQL schema, database, persistence, frontend component, route, automated ranking or automated decision is introduced by Phase 00

---

# Phase 08 — Sovereign Distribution Economy

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

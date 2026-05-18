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
- adapters for MarketplaceContractAdapter, RoyaltyService, AuctionService, StorageAccessService and LayerZeroBridgeService
- Reown AppKit wallet state mock

Constraints:
- no real payment execution
- no production contract addresses
- no live blockchain settlement
- no treasury routing
- no bridge execution

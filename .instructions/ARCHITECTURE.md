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

# Web App (React + Vite)

## Mission

Deliver the Axodus Marketplace MVP as a governance-aware NFT marketplace. The MVP keeps the original NFT core visible: ERC721/1155, EIP-2981 royalties, fixed listings, auctions, bids, item pages, create/sell boundaries, buy-now previews, and bid modal flows.

Products, licenses, Academy assets, MCP services and DAO utilities extend the marketplace model without replacing the NFT marketplace nucleus.

## Tech

- React 18 + Vite + TypeScript
- React Router
- TanStack Query
- Tailwind CSS
- Lucide React
- Mock-first services for Phase 1

## MVP Boundaries

- `MarketplaceContractAdapter`: mock fixed listing, buy-now, create listing and bid calls.
- `RoyaltyService`: mock EIP-2981/custom royalty previews.
- `AuctionService`: mock english/dutch auction state.
- `StorageAccessService`: mock Greenfield signed URL previews.
- `GreenfieldAccessAdapter`: mock signed URL lifecycle, authorization, expiration and revocation previews.
- `DeliveryRuntime`: mock protected asset, entitlement and delivery telemetry runtime.
- `LayerZeroBridgeService`: chain/bridge readiness metadata only.
- `WalletRuntime`: readonly Reown/AppKit provider discovery, injected EIP-1193 fallback, account session hydration and chain state.

No real payment, contract settlement, wallet signature, transaction, bridge action or treasury routing is executed in Phase 1.

## Wallet Runtime

Sprint 16 replaces the wallet mock with a readonly wallet runtime.

Implemented:

- Reown/AppKit provider discovery boundary
- injected EIP-1193 wallet fallback
- session hydration through `eth_accounts`
- account connection through `eth_requestAccounts`
- active chain hydration through `eth_chainId`
- chain switching through `wallet_switchEthereumChain`
- disconnect handling
- local wallet session persistence
- supported chain and restricted chain visibility
- Marketplace layout wallet status and connect/disconnect controls

Still disabled:

- wallet signatures
- transaction execution
- contract writes
- NFT transfer
- settlement execution
- treasury movement

The runtime uses Reown/AppKit when an AppKit provider is available. Without a configured Reown package/runtime, it falls back to the browser-injected EIP-1193 provider while preserving the same readonly state contract.

## NFT Ownership Runtime

Sprint 17 adds readonly NFT ownership verification.

Implemented:

- ERC721 `ownerOf` readonly reads through `eth_call`
- ERC1155 `balanceOf` readonly reads through `eth_call`
- governance NFT classification
- license/access NFT classification
- disconnected wallet state
- unsupported/restricted chain state
- ownership mismatch state
- unreadable mock/offchain contract state
- product detail ownership panel

Still disabled:

- minting
- transfers
- approvals
- wallet signatures
- contract writes
- settlement
- production entitlement mutation from ownership reads

Current mock products still use symbolic `mock:` contract references, so the UI reports readiness/unreadable contract for those items. Production-shaped EVM addresses and numeric token IDs are required before `ownerOf` or `balanceOf` reads execute.

## Listing Runtime

Sprint 18 adds readonly listing runtime hydration.

Implemented:

- fixed listing state reads through `eth_call`
- english auction state reads through `eth_call`
- dutch auction state reads through `eth_call`
- bid count and highest bid hydration
- expiration state hydration
- EIP-2981 `royaltyInfo` hydration
- marketplace contract read boundary
- auction contract read boundary
- royalty/NFT contract read boundary
- product detail listing runtime panel

Still disabled:

- buy execution
- bid placement
- listing cancellation
- auction settlement
- contract writes
- wallet signatures
- treasury movement

Live listing reads require production-shaped `marketplaceContractAddress` and `listingId`. Mock products without those fields render readiness-only listing state.

## Signature Preparation Runtime

Sprint 19 adds safe transaction/signature preview infrastructure.

Implemented:

- transaction payload preview
- calldata preview for buy-now, bid and create-listing intents
- optional gas estimate preview through `eth_estimateGas`
- contract visibility
- wallet and chain visibility
- permission visibility
- risk and warning visibility
- product detail signature intent panel

Still disabled:

- `eth_sendTransaction`
- `personal_sign`
- `eth_signTypedData`
- wallet signature request
- transaction submission
- contract writes
- settlement execution

The runtime may call `eth_estimateGas` when a provider and production-shaped contract metadata are available. It never calls send/sign methods.

## Delivery Runtime

Sprint 04 prepares entitlement-aware delivery without production execution.

Implemented preview boundaries:

- protected asset runtime
- signed URL lifecycle previews
- Greenfield adapter readiness
- ownership, subscription, license, DAO and governance entitlement checks
- access revocation and expiration visibility
- delivery telemetry for checks, attempts, revocations and preview issuance

Not implemented:

- production Greenfield calls
- production signed URL issuance
- real file or stream delivery
- live entitlement enforcement
- ACS provisioning

## Runtime Hardening

Sprint 05 prepares the Marketplace web runtime for later real execution phases.

Implemented:

- route-level code splitting with lazy Marketplace pages
- isolated dashboard and product detail chunks
- bounded TanStack Query retry/refetch defaults
- route loading fallbacks
- in-memory lifecycle, adapter and error telemetry
- route error instrumentation
- accessible purchase dialog behavior
- improved focus states, badges, filters and table semantics
- empty states for explorer and governance queues

Current build output has no large chunk warning after route splitting. Observability remains local/in-memory only; no external telemetry backend is called.

## API Runtime Hydration

Sprint 06 adds backend-ready Marketplace hydration through `src/services/apiClient.ts`.

The client attempts to read and persist Marketplace runtime state through `VITE_MARKETPLACE_API_URL` or `/api/marketplace` by default. If the API is unavailable, it falls back to the local mock services so the web MVP remains usable offline.

API-backed preview flows now include:

- product and seller hydration
- license hydration
- runtime snapshot hydration
- draft listing preview persistence
- buy-now purchase preview persistence
- billing preview calculation

All API-backed mutations remain preview-only. They do not request wallet signatures, execute payments, write contracts, issue production Greenfield URLs, bridge assets or move treasury funds.

## Registry & Storefront Infrastructure

Sprint 07 adds registry-backed storefront readiness.

The web client can consume:

- product registry records
- tenant/DAO registry records
- DAO storefront read models
- seller storefront read models

The first DAO storefront page is available at `/marketplace/tenants/:tenantId`. It renders tenant metrics, governance standing, constitutional metadata, seller relationships and product segmentation from the API read model.

Storefront activation remains disabled. The page is read-only and preview-only.

## Entitlement Runtime

Sprint 08 adds backend-backed entitlement visibility.

The web client can consume:

- issued license runtime records
- subscription runtime records
- entitlement snapshots
- delivery permission previews
- governance and tenant restriction visibility
- enforcement readiness metadata

The entitlement dashboard is available at `/marketplace/entitlements`.

Access enforcement remains disabled. The dashboard shows lifecycle and readiness state only; it does not block access, validate NFT ownership, charge payments or execute wallet actions.

## Billing Runtime

Sprint 09 adds backend-backed accounting visibility.

The web client can consume:

- invoice previews
- invoice lifecycle state
- line items
- royalty preview accounting
- treasury split previews
- creator split previews
- accounting telemetry
- reconciliation preview state

The billing dashboard is available at `/marketplace/orders`.

Billing remains non-settlement. The dashboard does not execute payment, distribute royalties, move treasury funds, calculate production taxes or reconcile external processors.

## Operational Traceability

Sprint 10 adds audit and reconciliation visibility.

The web client can consume:

- audit logs
- replay-safe runtime events
- event categories
- reconciliation preview snapshots
- indexer readiness snapshots
- ownership merge readiness
- NFT event ingestion readiness

The traceability dashboard is available at `/marketplace/audit`.

Traceability remains preview-only. The dashboard does not execute blockchain reads, publish queues, ingest live NFT events, verify treasury movement, verify settlement or validate live ownership.

## Governance Runtime Authority

Sprint 11 adds read-only Governance authority hydration.

The web client can consume:

- governance authority snapshots
- entity-level authority records
- constitutional standing
- governance status
- federation tier
- warnings and sanctions
- operational approval state
- restriction and emergency state

Authority context panels are rendered on product detail, seller profile, tenant storefront, entitlement and billing views.

Governance authority remains read-only. The UI does not execute governance writes, mutate sanctions, approve listings, trigger emergency actions or override Governance runtime authority.

## Governance Enforcement Boundaries

Sprint 12 adds preview-only Governance enforcement visibility.

The web client can consume:

- governance enforcement snapshots
- entity-level enforcement records
- effective visibility state
- purchase, bid and listing preview allowance
- entitlement invalidation preview
- subscription and license restriction preview
- governance override visibility
- review queue metadata

Enforcement context is shown in the explorer, product cards, product detail, seller profile, tenant storefront, entitlement and billing views.

No hard blocking is enabled. The UI does not remove products destructively, revoke entitlements, cancel subscriptions, suspend licenses, freeze sellers or tenants, or execute Governance writes.

## DAO Federation Runtime

Sprint 13 adds DAO federation visibility.

The web client can consume:

- DAO federation runtime snapshots
- tenant runtime isolation records
- DAO storefront activation state
- storefront operational status
- storefront governance visibility
- DAO-owned product runtime metadata
- tenant-scoped billing, entitlement, license and subscription boundaries
- constitutional inheritance records
- inherited restrictions and visibility rules
- federation health metrics

The DAO storefront view renders activation status, operational status, tenant isolation and constitutional inheritance.

Federation remains preview-only. The UI does not publicly activate storefronts, enforce tenant isolation destructively, execute cross-tenant settlement, mutate constitutional state or freeze tenants.

## Governance Workflow Runtime

Sprint 14 adds operational governance workflow visibility.

The web client can consume:

- product, seller, storefront, entitlement and billing review queues
- approval lifecycle state
- constitutional reason codes
- moderation runtime metrics
- governance workflow audit records

The Governance page renders queue metrics, product approval lifecycle and constitutional reason codes.

Workflow remains moderation-only. The UI does not execute Governance writes, sanctions, destructive removals, entitlement revocations or live approval mutations.

## Governance Observability & Emergency Controls

Sprint 15 adds operator console visibility.

The web client can consume:

- emergency restriction controls
- emergency freeze controls
- emergency suspension controls
- emergency visibility controls
- governance action telemetry
- restriction telemetry
- moderation telemetry
- emergency event telemetry
- federation health visibility

The operator console is available at `/marketplace/operator`.

Emergency controls remain preview-only. The UI does not execute live Governance writes, product removals, seller or tenant freezes, license suspensions, entitlement revocations or settlement intervention.

## Folders

```
src/
  data/mock/marketplace.mock.js
  modules/marketplace/
    components/
    hooks/
    pages/
    services/
    types/
    utils/
  components/
  hooks/
  services/
  styles/
```

## Routes

- `/marketplace`
- `/marketplace/explore`
- `/marketplace/create`
- `/marketplace/sell`
- `/marketplace/products/:slug`
- `/marketplace/sellers/:sellerId`
- `/marketplace/tenants/:tenantId`
- `/marketplace/categories`
- `/marketplace/governance`
- `/marketplace/licenses`
- `/marketplace/entitlements`
- `/marketplace/orders`
- `/marketplace/audit`
- `/marketplace/operator`
- `/marketplace/dashboard`
- `/item/:chain/:contract/:id` redirects legacy NFT item references to registered product pages when present in mock data.

## Testing

- Unit tests cover product filtering, slug lookup and mock purchase/license issuance.
- API client tests cover API envelope hydration, fallback mock runtime and purchase preview persistence.
- API client tests cover registry and tenant storefront hydration.
- API client tests cover entitlement snapshot hydration.
- API client tests cover invoice preview hydration.
- API client tests cover audit and reconciliation readiness hydration.
- API client tests cover read-only governance authority hydration.
- API client tests cover preview-only governance enforcement hydration.
- API client tests cover DAO federation runtime hydration.
- API client tests cover governance workflow runtime hydration.
- API client tests cover governance observability and emergency controls.
- Wallet runtime tests cover readonly session hydration, connection, chain switching and disconnect handling.
- NFT ownership tests cover ERC721 reads, ERC1155 reads, disconnected wallet rendering, unsupported chain handling and ownership mismatch rendering.
- Listing runtime tests cover fixed listing reads, auction reads, bid state, expiration state, royalty hydration and readiness-only rendering.
- Signature runtime tests cover transaction payload previews, calldata previews, gas preview, permission visibility, risk UX and absence of send/sign calls.
- Future visual/E2E tests should cover wallet connect UI, buy-now preview, bid preview, and signed URL preview after mock purchase.

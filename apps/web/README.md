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
- `LayerZeroBridgeService`: chain/bridge readiness metadata only.
- `ReownWalletStateMock`: wallet connection and chain state mock.

No real payment, contract settlement, wallet signature, bridge action or treasury routing is executed in Phase 1.

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
- `/marketplace/products/:slug`
- `/marketplace/sellers/:sellerId`
- `/marketplace/categories`
- `/marketplace/governance`
- `/marketplace/licenses`
- `/marketplace/dashboard`

## Testing

- Unit tests cover product filtering, slug lookup and mock purchase/license issuance.
- Future visual/E2E tests should cover wallet mock state, buy-now preview, bid preview, and signed URL preview after mock purchase.

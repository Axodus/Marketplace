# Web App (Next.js + Reown AppKit)

## Mission
Deliver a responsive PWA for browsing, minting, listing and buying NFTs with **Web2-like auth** via **Reown AppKit** and multiwallet. Chains: ETH, BNB, Arbitrum, Harmony, Polygon.

## Tech
- Next.js (App Router), React 18, TypeScript
- Reown AppKit (+ Ethers v6 adapter)
- Wagmi (optional)/ethers v6 for contract reads
- GraphQL client (Apollo) to talk to `apps/api`
- State: lightweight (React Query or Zustand)
- Styling: Tailwind CSS (or Chakra) + CSS Modules

## Folders

```
src/
	pages/        # routes: index, explore, item, sell, create
	components/   # UI atoms/molecules (Card, Grid, BidModal)
	hooks/        # useWallet, useNetwork, useListing, useAuction
	services/     # apiClient.ts, appkit.ts, rpcProvider.ts
	styles/       # globals.css, tokens.css
public/         # icons, manifest, images
```

## Environment
Create `.env-web` (never commit secrets):

```
NEXT_PUBLIC_API_URL=http://localhost:4000/graphql

NEXT_PUBLIC_SUPPORTED_CHAINS=ethereum,bnb,arbitrum,harmony,polygon
NEXT_PUBLIC_DEFAULT_CHAIN=polygon
NEXT_PUBLIC_RPC_ETHEREUM=https://...
NEXT_PUBLIC_RPC_BNB=https://...
NEXT_PUBLIC_RPC_ARBITRUM=https://...
NEXT_PUBLIC_RPC_HARMONY=https://api.harmony.one
NEXT_PUBLIC_RPC_POLYGON=https://...
NEXT_PUBLIC_LAYERZERO_ENDPOINTS_JSON={}
NEXT_PUBLIC_GREENFIELD_GATEWAY=https://...
```

## Must-Have UX
- **Connect** (Reown AppKit modal) → profile badge w/ chain pill & switch.
- **Explore** grid (filters: chain, collection, price, attributes).
- **Item page** `/item/[chain]/[contract]/[id]`
	- read metadata via API; live bids via WS; **BuyNow**/**PlaceBid** modals.
	- show **royalty badge** (EIP-2981) and **network pill**.
- **Sell** (fixed price / english / dutch), **Create** (mint flow).
- **Token-gated content**: call API to request **signed URL** after proof of ownership.

## Data Flow
- **Reads**: prefer API GraphQL (indexed, cheap). Direct RPC only for light reads (balance, allowance).
- **Writes**: always via wallet (AppKit). After tx mined, UI waits for **indexer event** to reflect changes.

## Testing
- Unit: React Testing Library.
- E2E: Playwright/Cypress (connect wallet mock, buy flow, auction countdown).
- Visual: per critical pages.

## Definition of Done (Web)
- Responsive, WCAG AA basics, SSR where helpful.
- Error boundaries & retry for RPC/API failures.
- Loading skeletons for lists & item page.
- Telemetry events (page view, search, list, bid, buy).

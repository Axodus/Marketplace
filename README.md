# Axodus Marketplace

Axodus Marketplace is the federated digital distribution infrastructure for the Axodus ecosystem.

The NFT marketplace remains the first commercial vertical and preserves:
- ERC721 and ERC1155 assets
- EIP-2981 royalty compatibility
- listings, bids, auctions and buy-now
- seller profiles, collections and asset registry records

Phase 00 expands the architecture toward:
- Marketplace Federation Domain
- Marketplace-as-a-Service Domain
- Distribution Network Domain
- Revenue Sharing Domain
- Marketplace Intelligence Domain

Phase 00 is documentation-only. It does not activate runtime code, APIs, contracts, indexers, React components, persistence, GraphQL, real billing, external integrations, wallet signatures, bridge execution, treasury routing or on-chain execution.

> Conventions: code in **English**, comments in **English**, env files named `.env-*` (e.g., `.env-web`).  
> Do not commit secrets. Use `.env-*` only locally; CI reads from encrypted secrets.

## Workspaces
- `apps/web` – user-facing app.
- `apps/api` – Marketplace API runtime boundary.
- `apps/indexer` – Marketplace indexer boundary.
- `services/storage` – storage and delivery boundary.
- `services/payments` – future payment gateway boundary.
- `infra` – infrastructure docs and deployment boundary.
- `docs` – architecture & playbooks for each nucleus.

## Quick Start
```bash
./bootstrap_scaffold.sh
# fill .env files as per each README, then:
pnpm -w install
pnpm -w build
```

See also: `docs/ARCHITECTURE.md` for a system-wide overview.

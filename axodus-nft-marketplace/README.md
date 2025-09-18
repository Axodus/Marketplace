# Axodus NFT Marketplace — Monorepo

This monorepo hosts a multichain NFT marketplace (ETH/BNB/Arbitrum/Harmony/Polygon) using:
- **Frontend**: Next.js + Reown AppKit (Web2-like auth & multiwallet).
- **API**: NestJS (GraphQL/REST) as single entrypoint.
- **Indexer**: Subgraphs + WS workers for near-real-time listings/bids/sales.
- **Smart Contracts**: ERC721/1155, Marketplace (fixed/english/dutch), EIP-2981 royalties, LayerZero bridge.
- **Storage**: BNB Greenfield (ACL/Groups) + signed URLs; metadata canonical on IPFS/Arweave.
- **DevOps**: GitHub Actions, IaC, observability.

> Conventions: code in **English**, comments in **English**, env files named `.env-*` (e.g., `.env-web`).  
> Do not commit secrets. Use `.env-*` only locally; CI reads from encrypted secrets.

## Workspaces
- `apps/web` – user-facing app.
- `apps/api` – GraphQL/REST.
- `apps/indexer` – subgraphs + workers.
- `contracts` – Solidity sources, tests, scripts.
- `services/storage` – Greenfield SDK integration.
- `services/payments` – (placeholder) future gateway.
- `infra` – k8s manifests, terraform, CI/CD docs.
- `docs` – architecture & playbooks for each nucleus.

## Quick Start
```bash
./bootstrap_scaffold.sh
# fill .env files as per each README, then:
pnpm -w install
pnpm -w build
```

See also: `docs/ARCHITECTURE.md` for a system-wide overview.

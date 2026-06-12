# Axodus Marketplace

Axodus Marketplace is the federated digital distribution infrastructure for the Axodus ecosystem.

Phase 00 — Marketplace Architecture Revision is complete as a documentation and architecture phase. Phase 01 — NFT Marketplace Consolidation is complete as a mock-first runtime phase with `docs/PHASE_01_RUNTIME_AUDIT.md` as the planning artifact and `docs/PHASE_01_CLOSURE_REPORT.md` as the closure artifact. Phase 02 — Federation Layer is in planning with `docs/PHASE_02_FEDERATION_AUDIT.md` as the boundary audit artifact; it does not activate real external integration.

The NFT marketplace remains the first commercial vertical and preserves:
- ERC721 and ERC1155 assets
- EIP-2981 royalty compatibility
- listings, bids, auctions and buy-now
- seller profiles, collections and asset registry records
- mock-first marketplace analytics for NFT volume, activity and market metrics

Phase 00 expands the architecture toward:
- Marketplace Federation Domain
- Marketplace-as-a-Service Domain
- Distribution Network Domain
- Revenue Sharing Domain
- Marketplace Intelligence Domain

Marketplace Federation Domain prepares representation of External Collections, External Assets, External Contracts, External Metadata and Federation Providers with explicit origin, provider, validation status, provenance and trust boundaries. Federated Assets are not native Axodus assets by default.

Marketplace-as-a-Service Domain prepares Tenant Marketplaces, White Label Marketplaces, Marketplace Branding, Marketplace Domains and Marketplace Themes as logical configuration concepts inside Axodus governance, observability and treasury boundaries.

Distribution Network Domain prepares Distributors, Partners, Agencies, Affiliates and Community Marketplaces as traceable commercial distribution roles for future Attribution Engine, Referral System, Partner Network, Revenue Sharing and Marketplace Intelligence.

Revenue Sharing Domain prepares Attribution Model, Commission Model, Revenue Split Rules and Tenant Participation as auditable commercial rule concepts for future Commission Engine, Split Rules and Revenue Dashboard work.

Marketplace Intelligence Domain prepares Commercial Analytics, Tenant Analytics, Product Analytics and Collection Analytics as interpretable, traceable and auditable intelligence concepts for future dashboards, telemetry pipelines and BI integration.

Phase 00 is documentation-only. Phase 01 activates only mock-first NFT Marketplace runtime surfaces. Phase 02 planning remains audit-only and does not activate Contract Import, Collection Import, Wallet Discovery, Federation Providers, new backend APIs, contracts, indexers, persistence, GraphQL, real billing, external integrations, tracking, BI, wallet signatures, bridge execution, treasury routing, settlement or on-chain execution.

Marketplace architecture remains governance-aware, treasury-compatible, operationally transparent, modular, security-first and NFT-foundation preserving.

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

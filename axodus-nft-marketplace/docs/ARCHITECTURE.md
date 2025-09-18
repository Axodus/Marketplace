# Architecture Overview

This document summarizes the high-level architecture of the Axodus NFT Marketplace monorepo and how each workspace interacts.

## Components
- Web (Next.js + Reown AppKit): user-facing PWA with multiwallet and Web2-like auth.
- API (NestJS GraphQL/REST): single entrypoint for reads/writes; orchestrates storage and contracts; provides WS.
- Indexer (Subgraphs + WS Workers): near-real-time events for listings/bids/sales per chain.
- Contracts (Solidity): ERC721/1155, marketplace (fixed/english/dutch), royalties, LayerZero bridge.
- Services (Storage/Payments): storage integrates BNB Greenfield; payments is a placeholder.
- Infra (k8s/Terraform/CI): manifests, pipelines, and infra-as-code.

## Data Flow
1. User connects wallet via AppKit; JWT issued by API (nonce->sign flow).
2. Reads go through API (GraphQL), backed by subgraphs and cache; direct RPC for light reads.
3. Writes (list/buy/bid) go to contracts; after tx mined, workers push events to API for live updates.
4. After purchase, API validates ownership and requests Storage service to issue a signed URL.

## Multichain Strategy
- Supported: Ethereum, BNB, Arbitrum, Harmony, Polygon.
- RPC and WS endpoints configured per chain; indexer keeps block lag low.
- LayerZero used for bridging when applicable (OFT adapters).

## Observability & Reliability
- Health endpoints on API and workers; metrics exported.
- Redis used for pub/sub to fan-out subscriptions.
- Idempotency keys on critical writes; rate limiting.

## Repository Structure
```
apps/
  web/
  api/
  indexer/
contracts/
services/
  storage/
  payments/
infra/
docs/
```

## Environments
- Local: Dockerized DB/Redis optional; .env-* files per workspace.
- CI: GitHub Actions runs lint, tests, builds; secrets stored encrypted.
- Staging/Prod: Deployed via Terraform+k8s with manual approvals.

## Security Notes
- No secrets committed; use .env-* locally and secret stores in CI/prod.
- EIP-2981 royalties enforced; marketplace safe math and guards.
- Bucket ACLs on Greenfield; signed URLs with TTL and audit logs.

# Marketplace Architecture Overview

This document summarizes the high-level Marketplace architecture. The operational source of truth for execution remains `.instructions/ARCHITECTURE.md`.

## Strategic Scope

Axodus Marketplace is the official federated digital distribution infrastructure for the Axodus ecosystem.

Marketplace distributes and commercializes:
- NFT assets and collections
- digital products
- licenses
- subscriptions
- ACS capabilities
- Academy courses
- enterprise offers
- tenant catalogs
- white-label marketplace surfaces
- partner and affiliate offers
- revenue sharing models
- commercial intelligence

The NFT marketplace remains the first commercial vertical. It is not replaced by the federated architecture.

## Foundational NFT Vertical

The NFT foundation remains explicit:
- ERC721 assets
- ERC1155 assets
- EIP-2981 royalty compatibility
- fixed listings
- bids
- english and dutch auctions
- buy-now
- seller profiles
- collections
- asset registry records

Future federation, tenant, distribution, revenue sharing and intelligence work must extend this foundation without obscuring it.

## Phase 00 Architecture Domains

Phase 00 introduces five architecture domains:
- Marketplace Federation Domain
- Marketplace-as-a-Service Domain
- Distribution Network Domain
- Revenue Sharing Domain
- Marketplace Intelligence Domain

These domains prepare future implementation. They do not activate runtime behavior in Phase 00.

## Non-Execution Boundary

Phase 00 is documentation-only.

It does not implement:
- runtime code
- API surfaces
- contracts
- indexers
- React components
- persistence
- GraphQL
- real billing
- external integrations
- wallet signatures
- bridge execution
- treasury routing
- on-chain execution

## Architecture Principles

Marketplace must remain:
- governance-aware
- treasury-compatible
- operationally transparent
- modular
- tenant-aware
- federation-ready
- revenue-share explicit
- intelligence-transparent

No future implementation should create hidden execution paths, hidden ranking authority, untraceable commercial policy or governance bypass.

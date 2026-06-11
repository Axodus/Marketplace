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

## Marketplace Federation Domain

The Marketplace Federation Domain allows Marketplace to represent internal and external assets through explicit origin, provider, validation status, provenance, risk and trust boundaries.

Federation is a visibility, interoperability, discovery, import and progressive validation capability. It does not imply automatic custody, automatic liquidation, automatic execution, automatic validation, automatic trust, settlement, wallet signatures, bridge execution, treasury routing or on-chain execution.

Core federation concepts:
- External Collections: collections originated outside native Axodus infrastructure that may be visible, searchable, referencable, classified or displayed in Marketplace.
- External Assets: NFTs, certificates, licenses or digital assets originated from external contracts, wallets, collections or providers.
- External Contracts: ERC721, ERC1155 or other compatible contracts that may be indexed, imported, referenced, analyzed or displayed in a future approved implementation phase.
- External Metadata: metadata obtained outside Axodus infrastructure, including images, attributes, descriptions, statistics, declared royalties, provenance, origin, validation state and risk information.
- Federation Providers: external providers, connectors, data sources or integration systems responsible for future discovery, import, enrichment, classification or validation.

Internal assets are originated, issued, controlled, licensed or operated inside Axodus infrastructure. External assets originate outside Axodus infrastructure but may be visible or referencable through federation. Federated Assets must not be displayed as native Axodus assets.

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

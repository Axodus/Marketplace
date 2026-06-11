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

## Marketplace-as-a-Service Domain

The Marketplace-as-a-Service Domain prepares Marketplace to support multiple specialized commercial experiences over the same sovereign Axodus infrastructure.

The global Marketplace remains the ecosystem distribution infrastructure. Tenant Marketplaces are configurable logical instances inside that infrastructure, not necessarily separate applications.

Core Marketplace-as-a-Service concepts:
- Tenant Marketplace: a logical marketplace operated by a tenant, community, partner, DAO, enterprise, product, ACS initiative, Academy front or authorized channel.
- White Label Marketplace: a tenant marketplace with its own brand, positioning, catalog and user-facing experience, still governed by Axodus rules.
- Marketplace Branding: tenant identity and presentation configuration, including name, logo, description, visual identity, trust elements and commercial messaging.
- Marketplace Domains: future domain, subdomain, slug, alias and routing concepts; Phase 00 does not implement DNS, custom domains or route handling.
- Marketplace Themes: tenant visual experience configuration, including colors, typography, layout, navigation, section order and exposure preferences.

Catalog model:
- Global Catalog: broad product and asset availability inside Axodus Marketplace infrastructure.
- Tenant Catalog: subset exposed, enabled or configured inside a Tenant Marketplace.
- Curated Catalog: editorial, commercial, strategic or community selection.
- Federated Catalog: externally originated products, assets or collections referenced through federation.

Tenant Isolation covers configuration, catalog scope, branding, domain identity, theme, analytics and exposure rules. Financial isolation, tenant billing, tenant settlement, tenant revenue sharing and tenant treasury routing are deferred to later phases.

## Distribution Network Domain

The Distribution Network Domain prepares Marketplace to operate as a distributed commercial network for commercialization, discovery, curation and ecosystem expansion.

Core distribution concepts:
- Distributor: participant, operator, channel or authorized entity that can distribute Axodus products or digital capabilities.
- Partner: organization, entity, community, company, DAO, institution or participant with a commercial, institutional, strategic or operational relationship with Marketplace.
- Agency: entity that may operate distribution channels, campaigns, onboarding, curation or delegated commercial operations for multiple clients, communities or fronts.
- Affiliate: originator of traffic, leads, referrals, conversions, registrations, sales or opportunities for future attribution.
- Community Marketplace: marketplace associated with a community, vertical, DAO, creator group, project, network, Academy, ACS, partner or distribution group.

Tenant, Partner, Distributor, Agency, Affiliate and Community Marketplace are distinct roles. Community Marketplaces may operate as Tenant Marketplaces, Distribution Channels or Curated Catalogs depending on configuration and governance.

Commercial distribution must preserve Commercial Origin, Distribution Channel, Distribution Eligibility, Traceability and Commercial Governance. Future Attribution Engine, Referral System, Partner Network, Revenue Sharing and Marketplace Intelligence may consume those records after approved implementation phases.

Distribution Network does not activate real tracking, referral links, commission engines, partner dashboards, payments, payouts, settlement, revenue sharing or treasury routing in Phase 00.

## Revenue Sharing Domain

The Revenue Sharing Domain prepares Marketplace to model future economic participation without activating financial execution in Phase 00.

Core revenue concepts:
- Attribution Model: identifies the commercial origin or economic contribution of a sale, subscription, license, conversion, lead, bid, purchase, renewal or transaction.
- Commission Model: defines conceptual remuneration rules for authorized participants.
- Revenue Split Rules: define how future revenue may be divided among eligible creators, sellers, tenants, marketplace, distributors, affiliates, partners, agencies, communities, treasury or other authorized participants.
- Tenant Participation: identifies future economic participation of a tenant in sales, distribution, curation, exposure, operation or support of a catalog, product, collection, subscription, license or offer.

Revenue Sharing connects Attribution, Commission, Revenue Split, Billing, Treasury, Governance, Telemetry and Marketplace Intelligence. Billing remains responsible for accounting, Billing Visibility, Settlement Visibility, reconciliation and future treasury integration. Treasury routing, payouts, settlement, real billing, Commission Engine, Split Rules and Revenue Dashboard are deferred to future approved phases.

No revenue division may occur without Audit Trail, traceable Commercial Origin, identified participants, explicit Commercial Rules, governance validation, Treasury Validation, Billing Visibility and Settlement Visibility.

## Marketplace Intelligence Domain

The Marketplace Intelligence Domain prepares Marketplace to transform future product, collection, tenant, channel, distribution, revenue, activity and telemetry data into commercial and operational intelligence.

Core intelligence concepts:
- Commercial Analytics: aggregated operational and commercial metrics for Marketplace volume, conversion, activity, distribution, sales, channels, funnel behavior, Commercial Origin and network health.
- Tenant Analytics: Tenant Marketplace metrics for catalog activity, traffic, conversion, curation, channels, performance, product exposure and ecosystem contribution.
- Product Analytics: product metrics for views, conversions, sales, subscriptions, licenses, renewals, future revenue visibility, retention, channel performance, tenant performance, eligibility and validation status.
- Collection Analytics: NFT or digital collection metrics for volume, holders, activity, floor price, listings, bids, sales, transfers, ranking, validation, origin, provenance, metadata quality and channel or tenant performance.

Marketplace Intelligence connects Product Domain, Marketplace Federation Domain, Marketplace-as-a-Service Domain, Distribution Network Domain, Revenue Sharing Domain, Billing Layer, Telemetry Layer and Governance Integration.

Analytics must preserve Interpretability, Traceability, Auditability, transparency and governance compatibility. Analytics do not replace governance, audit, accounting, billing, product validation, licensing validation or treasury validation.

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

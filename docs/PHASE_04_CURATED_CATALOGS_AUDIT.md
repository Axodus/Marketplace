# Phase 04 Curated Catalogs Audit

Request ID: MEP-04A

Date: 2026-06-14

## Executive Summary

PHASE 04 - CURATED CATALOGS should evolve the Marketplace from tenant catalog isolation into curated, editorial and segmented catalog experiences.

The current runtime already supports Tenant Catalog, Tenant Catalog Rule, Tenant Exposure Rule, catalog resolution, tenant visible products, tenant visible collections, featured products and featured collections in mock/config-first mode. Phase 04 should build on that foundation by introducing Curated Catalog concepts without creating production approval workflows, automated recommendations, ranking authority, Marketplace Intelligence, Distribution Network, Revenue Sharing, billing or settlement.

This audit is planning-only. It does not implement Curated Catalog runtime, schema, API, database, dashboard, tracking, BI, AI curation, approval workflow, billing, settlement, revenue sharing or commercial distribution.

## Current State After Phase 03

Phase 03 is closed and validated as mock/config-first Marketplace-as-a-Service.

Current tenant infrastructure includes:

- Tenant Registry
- Tenant Identity
- Tenant Configuration
- Marketplace Branding
- Tenant Themes
- Tenant Domains and aliases
- simulated tenant route `/marketplace/t/:tenantSlug`
- Tenant Catalog
- Tenant Catalog Rule
- Tenant Exposure Rule
- Tenant Catalog Resolution
- tenant visible products and collections
- global fallback
- explicit no-execution boundaries

The primary implementation references are:

- `apps/web/src/data/mock/marketplace.mock.js`
- `apps/web/src/modules/marketplace/types/marketplace.ts`
- `apps/web/src/modules/marketplace/services/marketplaceService.ts`
- `apps/web/src/modules/marketplace/services/marketplaceService.test.ts`
- `apps/web/src/modules/marketplace/hooks/useMarketplace.ts`
- `apps/web/src/modules/marketplace/pages/TenantStorefrontPage.tsx`
- `docs/PHASE_03_TENANT_INFRASTRUCTURE_AUDIT.md`
- `docs/PHASE_03_CLOSURE_REPORT.md`

No separate Curated Catalog entity exists yet. Current curation-like behavior is represented through Tenant Catalog scope values, allowed/blocked references, featured references and exposure rules.

## Current Catalog Model Map

Current catalog-related models:

- `TenantCatalog`
- `TenantCatalogRule`
- `TenantExposureRule`
- `TenantCatalogResolution`
- `TenantCatalogItem`
- `TenantCatalogStatus`
- `TenantCatalogScope`
- `TenantCatalogRuleType`
- `TenantCatalogRuleEffect`
- `TenantCatalogSource`

Current catalog rule capabilities:

- allow product
- block product
- allow collection
- block collection
- allow category
- block category
- allow external collection
- block external collection
- feature product
- feature collection
- inherit global
- allow federated assets
- block federated assets
- allow native products
- block native products

Current resolution helpers:

- `getTenantCatalog`
- `listTenantCatalogRules`
- `applyTenantCatalogRules`
- `resolveTenantCatalog`
- `getTenantVisibleProducts`
- `getTenantVisibleCollections`
- `getTenantFeaturedProducts`
- `getTenantFeaturedCollections`
- `isProductVisibleForTenant`
- `isCollectionVisibleForTenant`
- `explainTenantCatalogInclusion`
- `explainTenantCatalogExclusion`

## Products, Collections, Federated Assets And Providers

The current Marketplace contains:

- native products across Education, Governance, Trading, Business, MCPs and Digital Assets categories
- NFT-bound products using ERC721, ERC1155 and OffchainLicense presentation primitives
- native collections with collection metrics and governance status
- external/federated collections with provider, origin, external metadata and provider-reported statistics
- external contract descriptors for ERC721 and ERC1155 collections
- federation provider descriptors for OpenSea, Rarible, Magic Eden and Harmony Ecosystem
- wallet discovery mock/read-only assets for NFTs, certificates and licenses

Federated records already carry:

- origin
- provider
- validation status
- provenance
- risk classification
- trust boundary
- read-only/non-executing flags

Phase 04 curated catalogs must preserve these fields when external collections or federated assets are included in curated sections.

## Catalog Taxonomy

### Global Catalog

The Global Catalog is the complete Marketplace baseline exposed by Axodus in mock/config-first mode. It is the fallback and inheritance source for tenant catalogs and future curated catalogs.

Global Catalog does not mean every item is eligible for every tenant, segment, vertical or curated section.

### Tenant Catalog

The Tenant Catalog is a tenant-scoped catalog resolved from Tenant Configuration, Tenant Catalog Rules and Tenant Exposure Rules.

Tenant Catalog controls what a tenant can display in mock/config-first mode. It does not create product ownership, licensing changes, billing by tenant, settlement by tenant, revenue sharing, production authorization or isolated databases.

### Curated Catalog

A Curated Catalog should represent an intentional grouping of products, collections, external collections or federated assets for a purpose, vertical, campaign, audience, tenant, community, Academy track, ACS capability, DAO context or enterprise scenario.

Curated Catalog should be layered on top of Global Catalog and Tenant Catalog instead of replacing them.

### Editorial Catalog

An Editorial Catalog should represent a curated catalog whose inclusion is driven by editorial rationale, product positioning, narrative, learning path, operational focus or ecosystem priority.

Editorial Catalog does not mean governance approval, commercial authorization, automated recommendation or quality guarantee.

### Federated Catalog

A Federated Catalog is a curated or tenant catalog section that includes external collections, external assets, external contracts or provider-reported metadata.

Federated Catalog must always preserve origin, provider, validation status, provenance, risk classification, trust boundary and non-executing status.

## Conceptual Model: Curated Catalog

Curated Catalog should represent the top-level curated container.

Recommended minimum fields:

- `id`
- `slug`
- `name`
- `description`
- `catalogType`
- `status`
- `editorialStatus`
- `scope`
- `tenantId`
- `segmentIds`
- `sectionIds`
- `featuredProductIds`
- `featuredCollectionIds`
- `featuredExternalCollectionIds`
- `allowedProductIds`
- `blockedProductIds`
- `allowedCollectionIds`
- `blockedCollectionIds`
- `allowedExternalCollectionIds`
- `blockedExternalCollectionIds`
- `allowedCategoryIds`
- `blockedCategoryIds`
- `rules`
- `editorialRules`
- `governanceStatus`
- `visibility`
- `displayStatus`
- `canDisplay`
- `canTrade`
- `canSettle`
- `canRankAutomatically`
- `canRecommendAutomatically`
- `warnings`
- `disclaimers`
- `createdAt`
- `updatedAt`

During Phase 04, `canTrade`, `canSettle`, `canRankAutomatically` and `canRecommendAutomatically` should remain false or explicitly simulated/non-executing.

## Conceptual Model: Curated Catalog Section

Curated Catalog Section should represent a named subdivision inside a Curated Catalog.

Recommended minimum fields:

- `id`
- `catalogId`
- `slug`
- `title`
- `description`
- `sectionType`
- `position`
- `status`
- `editorialStatus`
- `productIds`
- `collectionIds`
- `externalCollectionIds`
- `assetIds`
- `federatedAssetIds`
- `displayMode`
- `sortMode`
- `isFeatured`
- `isEditorial`
- `isFederated`
- `warnings`
- `disclaimers`

Sections can support future examples such as:

- Featured Learning Credentials
- Governance Access
- ACS Capabilities
- Creator Collections
- Provider-Reported External Collections
- Enterprise Readiness

## Conceptual Model: Curated Catalog Rule

Curated Catalog Rule should represent rule-based inclusion, exclusion, featuring or warning within a Curated Catalog.

Recommended minimum fields:

- `id`
- `catalogId`
- `sectionId`
- `ruleType`
- `targetType`
- `targetId`
- `effect`
- `priority`
- `reason`
- `status`
- `source`
- `governanceStatus`
- `warnings`
- `disclaimers`

Curated Catalog Rule should reuse the current Tenant Catalog Rule concepts where possible, but it should not be tenant-only.

## Conceptual Model: Editorial Rule

Editorial Rule should represent non-automated editorial reasoning for why an item appears in a curated surface.

Recommended minimum fields:

- `id`
- `catalogId`
- `sectionId`
- `targetType`
- `targetId`
- `editorialStatus`
- `editorialReason`
- `editorialOwner`
- `reviewRequired`
- `governanceReviewRequired`
- `sensitivity`
- `source`
- `warnings`
- `disclaimers`

Editorial Rule must not be treated as product validation, legal approval, licensing approval, governance approval or commercial authorization.

## Conceptual Model: Featured Catalog

Featured Catalog should be a curated catalog or section optimized for visibility.

It may define:

- featured products
- featured collections
- featured external collections
- featured tenants
- headline section
- priority labels
- manual order

Featured Catalog should not mean paid placement, ranking authority, recommendation engine, revenue sharing eligibility or commercial entitlement unless future phases explicitly implement those domains.

## Conceptual Model: Catalog Segment

Catalog Segment should represent audience, vertical, purpose or context.

Recommended minimum fields:

- `id`
- `slug`
- `name`
- `description`
- `segmentType`
- `tenantTypes`
- `categoryIds`
- `governanceStatus`
- `visibility`
- `warnings`
- `disclaimers`

Suggested segment types:

- `academy`
- `acs`
- `dao`
- `enterprise`
- `community`
- `creator`
- `nft`
- `federated`
- `governance`
- `demo`

## Initial Catalog Types

Recommended taxonomy:

- `global`
- `tenant`
- `curated`
- `editorial`
- `featured`
- `segment`
- `federated`
- `mixed`

## Initial Catalog Statuses

Recommended taxonomy:

- `draft`
- `configured-mock`
- `active-mock`
- `review-required`
- `governance-review`
- `restricted`
- `disabled`
- `archived`
- `empty`
- `conflict`

## Initial Editorial Statuses

Recommended taxonomy:

- `not-editorial`
- `editorial-draft`
- `editorial-configured-mock`
- `editorial-review-required`
- `governance-review-required`
- `approved-mock`
- `restricted`
- `disabled`

Any `approved-mock` status must be clearly labeled as mock/editorial only and not governance enforcement.

## Governance Boundaries

Curated Catalogs should be governance-aware but not governance-executing.

Required boundaries:

- curated inclusion does not equal governance approval
- editorial inclusion does not equal license validation
- featured placement does not equal commercial authorization
- catalog publication does not enable trading, settlement, billing or revenue sharing
- sensitive products may require future governance review before curated exposure
- external/federated records must preserve provider and trust metadata
- blocked or restricted products must not be made visible by curation alone

## Editorial Boundaries

Editorial rules should be manual/config-first.

Phase 04 should not introduce:

- AI curation
- automated recommendation
- algorithmic ranking
- dynamic scoring
- automated approval workflow
- opaque editorial authority
- hidden product promotion
- paid placement logic

Every editorial inclusion should have an explicit reason, source and boundary note.

## Trust Boundaries

Curated Catalogs that include external or federated items must show or preserve:

- origin
- provider
- chain/network
- contract address, if applicable
- token standard, if applicable
- validation status
- provenance
- risk classification
- trust boundary
- metadata source
- provider-reported statistics label
- read-only/non-executing state

Curated Catalogs must not create:

- custody
- ownership guarantee
- authenticity guarantee
- metadata guarantee
- royalty guarantee
- floor price guarantee
- settlement
- contract write
- wallet signature
- bridge execution

## Impacted Pages

### Layout / Navigation

Current state: global navigation already links Marketplace runtime surfaces and tenant surfaces.

Future Phase 04 need: add Curated Catalog entry point only when implementation is approved. It should not replace global marketplace or tenant navigation.

### Marketplace Home / Explorer

Current state: Explorer lists products and supports filters/sorting over mock data.

Future Phase 04 need: curated entry points and section labels, while preserving search/filter/sorting boundaries and no real ranking.

### Collections List And Detail

Current state: native and external collections are displayed with metrics and federation badges.

Future Phase 04 need: curated collection sections, featured collection explanations and provider-reported labels for external collections.

### Product Detail / Asset Registry

Current state: product detail and Asset Registry expose NFT, listing, validation, royalty, ownership, transfer and license mock data.

Future Phase 04 need: show curated inclusion context without altering product origin, ownership, license, billing, settlement or validation status.

### Tenant Detail / Tenant Route

Current state: Tenant Detail displays tenant identity, branding, domains, catalog resolution and rules.

Future Phase 04 need: tenant-specific curated catalogs layered on top of tenant catalog resolution.

### Dashboard

Current state: dashboard shows mock-first marketplace analytics.

Future Phase 04 need: avoid turning curated catalog visibility into Marketplace Intelligence. Catalog metrics, if any, should remain mock/config-first until Phase 07.

### Federation Providers / External Contracts / Wallet Discovery

Current state: these pages are mock/read-only and preserve provider boundaries.

Future Phase 04 need: curated catalogs may reference federated records but must not activate provider calls or dynamic imports.

### Create/Sell Preview, Buy-now Modal And Bid Modal

Current state: preview/non-executing boundaries exist.

Future Phase 04 need: curation must not turn preview flows into execution, settlement, wallet signatures or contract writes.

## Impacted Services, Hooks And Helpers

Current service and hook entry points that Phase 04 can build on:

- `resolveTenantCatalog`
- `applyTenantCatalogRules`
- `getTenantVisibleProducts`
- `getTenantVisibleCollections`
- `getTenantFeaturedProducts`
- `getTenantFeaturedCollections`
- `explainTenantCatalogInclusion`
- `explainTenantCatalogExclusion`
- `useTenantCatalog`
- `useTenantCatalogResolution`
- `useTenantVisibleProducts`
- `useTenantVisibleCollections`

Recommended future helpers:

- `listCuratedCatalogs`
- `getCuratedCatalogBySlug`
- `resolveCuratedCatalog`
- `listCuratedCatalogSections`
- `applyCuratedCatalogRules`
- `getCuratedCatalogVisibleProducts`
- `getCuratedCatalogVisibleCollections`
- `getCuratedCatalogFeaturedProducts`
- `getCuratedCatalogFeaturedCollections`
- `explainCuratedCatalogInclusion`
- `explainCuratedCatalogExclusion`
- `resolveTenantCuratedCatalogs`
- `assertCuratedFederationBoundaries`

Recommended future hooks:

- `useCuratedCatalogs`
- `useCuratedCatalog`
- `useCuratedCatalogSections`
- `useCuratedCatalogResolution`
- `useTenantCuratedCatalogs`

## Gaps By Requirement

### MEP-REQ-040 - Curated Catalog Model

Objective: define runtime model and mock/config data for Curated Catalogs.

Gaps:

- no `CuratedCatalog` type
- no curated catalog mock dataset
- no curated catalog resolver
- no curated catalog route or page
- no curated catalog tests

Likely files:

- `apps/web/src/data/mock/marketplace.mock.js`
- `apps/web/src/modules/marketplace/types/marketplace.ts`
- `apps/web/src/modules/marketplace/services/marketplaceService.ts`
- `apps/web/src/modules/marketplace/services/marketplaceService.test.ts`
- `apps/web/src/modules/marketplace/hooks/useMarketplace.ts`
- `apps/web/src/modules/marketplace/pages`

Do not implement yet:

- production curation workflow
- database
- API
- GraphQL schema
- tracking
- recommendation engine
- automated approval

### MEP-REQ-041 - Editorial Rules

Objective: add manual/config-first editorial rules and inclusion reasoning.

Gaps:

- no `EditorialRule` model
- no editorial owner/reason/review fields
- no editorial status taxonomy
- no UI for editorial explanations
- no tests for editorial non-authority boundaries

Do not implement yet:

- governance enforcement
- legal approval workflow
- AI editorial scoring
- paid placement
- automatic ranking

### MEP-REQ-042 - Featured Catalogs

Objective: add featured catalog and featured section concepts.

Gaps:

- featured products/collections exist in Tenant Catalog, but not at Curated Catalog Section level
- no featured external collection resolver separate from tenant catalog
- no featured catalog route or section components
- no manual order model

Do not implement yet:

- commercial promotion engine
- performance ranking
- revenue sharing
- distribution attribution

### MEP-REQ-043 - Catalog Segments And Eligibility

Objective: organize curated catalogs by segment, vertical or purpose with eligibility boundaries.

Gaps:

- no `CatalogSegment` model
- no segment-to-tenant mapping
- no segment-to-category mapping
- no curated eligibility resolver
- no governance-sensitive product gating for curated exposure beyond current product standing fields

Do not implement yet:

- Distribution Network
- partner/affiliate channel logic
- Marketplace Intelligence
- real analytics
- dynamic eligibility service

## UI/UX Risks

- curated sections can be mistaken for official ranking
- featured placement can be mistaken for paid promotion or governance approval
- external collections can appear native if provider labels are not visible
- tenants can appear to own products if curated/tenant labels are unclear
- too many badges can reduce scanability
- segment labels may be confused with distribution channels

Mitigations:

- always show catalog source and inclusion reason
- use explicit "mock/config-first" or "editorial mock" labels
- preserve native vs external badges
- preserve tenant/global context
- keep empty states and restricted states explicit

## Governance Risks

- editorial inclusion could be interpreted as governance approval
- sensitive products could become visible without review
- blocked products could be reintroduced through curated rules
- tenant catalog restrictions could be bypassed by curated sections

Mitigations:

- curated resolution must respect product standing and tenant restrictions
- editorial status must be separate from governance status
- inclusion/exclusion reasons must be auditable
- restricted or blocked records must remain blocked unless future governance explicitly allows visibility

## Commercial Exposure Risks

- curated catalogs can be interpreted as distribution authorization
- featured catalogs can imply commercial endorsement
- curated placement can be confused with revenue sharing eligibility
- tenant curated catalogs can appear to enable tenant settlement

Mitigations:

- explicit no billing, no settlement, no revenue sharing and no distribution network boundary notes
- no partner, affiliate, referral or commission terminology in Phase 04 runtime
- no automatic product monetization changes from curated inclusion

## Federated Asset Risks

- provider-reported data can look authoritative
- floor price or volume can be mistaken for official metrics
- external metadata can be malicious or stale
- external collection inclusion can imply custody or authenticity guarantee

Mitigations:

- preserve provider-reported labels
- preserve origin/provider/provenance/risk/trust fields
- do not fetch metadata dynamically in Phase 04
- do not enable external trading, bids, settlement, bridge or wallet signatures

## Scope Risks

Phase 04 must not drift into:

- Phase 05 Distribution Network
- Phase 06 Revenue Sharing
- Phase 07 Marketplace Intelligence
- billing by tenant
- settlement by tenant
- partner or affiliate workflows
- tracking pipelines
- BI dashboards
- AI curation
- production approval workflows

## Recommended Implementation Sequence

1. MEP-REQ-040 - Curated Catalog Model
   - Objective: add Curated Catalog, Curated Catalog Section and Curated Catalog Resolution in mock/config-first mode.
   - Scope: types, mock data, service helpers, hooks, route/page if approved.
   - Dependencies: Phase 03 Tenant Catalog and catalog resolution.
   - Risks: duplicating Tenant Catalog logic or bypassing tenant restrictions.
   - Tests: catalog lookup, section resolution, global fallback, external boundary preservation.
   - Acceptance: curated catalogs are visible as mock/config-first and do not alter product truth.
   - Do not implement: API, database, approval workflow, ranking engine.

2. MEP-REQ-041 - Editorial Rules
   - Objective: add Editorial Rule and editorial status reasoning.
   - Scope: manual editorial reasons, review labels, no-authority disclaimers.
   - Dependencies: Curated Catalog Model.
   - Risks: editorial status interpreted as governance approval.
   - Tests: inclusion explanation, editorial disclaimers, restricted item handling.
   - Acceptance: editorial reasons are visible and non-executing.
   - Do not implement: AI curation, paid placement, governance enforcement.

3. MEP-REQ-042 - Featured Catalogs
   - Objective: add featured catalog and featured section behavior.
   - Scope: featured products, featured collections, featured external collections, manual order.
   - Dependencies: Curated Catalog Sections and Editorial Rules.
   - Risks: featured means ranking, recommendation or commercial endorsement.
   - Tests: featured ordering, empty featured state, federated boundary preservation.
   - Acceptance: featured placement is mock/editorial display only.
   - Do not implement: real ranking, revenue sharing, commercial promotion engine.

4. MEP-REQ-043 - Catalog Segments And Eligibility
   - Objective: organize catalogs by segment, vertical or purpose.
   - Scope: segment model, eligibility labels, tenant/segment mapping.
   - Dependencies: Curated Catalog Model and Featured Catalogs.
   - Risks: segment eligibility interpreted as permissions or distribution authorization.
   - Tests: segment filtering, tenant compatibility, restricted product blocking.
   - Acceptance: segments classify curated views without changing product permissions.
   - Do not implement: Distribution Network, partner channels, analytics, dynamic eligibility service.

5. MEP-PHASE-04-CLOSURE - QA, Governance And No-Execution Validation
   - Objective: validate curated catalogs end to end.
   - Scope: routes, UI states, boundary notes, tests, documentation.
   - Dependencies: MEP-REQ-040 through MEP-REQ-043.
   - Risks: ambiguous language suggesting approval, ranking or intelligence.
   - Tests: lint, test, build, diff checks, required-term searches, risk-term searches.
   - Acceptance: Phase 04 closes as mock/config-first curated catalog layer.
   - Do not implement: Phase 05, Phase 06 or Phase 07 capabilities.

## Definition Of Done For Phase 04

Phase 04 should be considered complete only when:

- Curated Catalog model exists in mock/config-first mode
- Curated Catalog Sections exist
- Curated Catalog Rules exist
- Editorial Rules exist with explicit non-authority boundaries
- Featured Catalog concepts exist
- Catalog Segments exist
- tenant restrictions and catalog resolution boundaries are respected
- external/federated records preserve origin, provider, validation status, provenance, risk classification and trust boundaries
- UI labels prevent confusion with real ranking, AI recommendation, governance approval, commercial authorization or Marketplace Intelligence
- no runtime beyond Phase 04 scope is introduced
- lint, tests, build and diff checks pass

## Future QA Checklist

Use this checklist during Phase 04 closure:

- open global curated catalog list
- open a curated catalog detail
- open a curated catalog section
- verify featured products
- verify featured collections
- verify featured external collections
- verify editorial reason and editorial status
- verify inclusion and exclusion explanations
- verify tenant-compatible curated catalog view
- verify native product and collection labels
- verify external collection labels
- verify provider-reported statistics labels
- verify origin, provider, validation status, provenance, risk classification and trust boundary
- verify restricted/blocked product behavior
- verify empty catalog state
- verify no ranking authority language
- verify no recommendation engine language
- verify no AI curation language
- verify no governance approval implication
- verify no billing, settlement, revenue sharing, distribution, tracking, BI or Marketplace Intelligence runtime

## Validation Notes For MEP-04A

This audit reviewed the current Phase 03 code and documentation surfaces and created no runtime implementation.

Recommended validation for this request:

- repository search for curated catalog and tenant catalog terms
- repository search for risk terms related to automated recommendation, real ranking, approval workflow, billing, settlement, revenue sharing, tracking and BI
- `git diff --check`

Build/test execution is not required for this documentation-only audit unless repository policy requires it, but future Phase 04 implementation requests should run `pnpm --dir apps/web lint`, `pnpm --dir apps/web test` and `pnpm --dir apps/web build`.

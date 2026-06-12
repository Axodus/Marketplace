# Phase 03 Tenant Infrastructure Audit

Date: 2026-06-12

## Executive Summary

PHASE 03 - TENANT INFRASTRUCTURE is ready for controlled implementation planning, but not for productive multi-tenancy activation.

The Marketplace already contains useful tenant-adjacent foundations: mock-persistent API tenant records, product tenant ids, tenant registry read models, storefront previews, DAO federation runtime previews, governance authority/enforcement for tenants and a frontend `TenantStorefrontPage`. These surfaces are preview/read-model oriented and do not provide Marketplace-as-a-Service tenant infrastructure yet.

Phase 03 should introduce tenant infrastructure as logical configuration over the global Axodus Marketplace. A Tenant Marketplace must be a configurable instance inside Axodus governance, observability and treasury-compatible boundaries, not a sovereign application, not a custom DNS deployment, not separate billing, not tenant settlement, not RBAC production and not isolated database infrastructure.

## Current State After Phase 02

Validated Phase 02 surfaces:
- External Contracts for ERC721 and ERC1155 mock import previews
- External Collections with provider-reported metadata/statistics
- Wallet Discovery mock/read-only records
- Federation Provider descriptors for OpenSea, Rarible, Magic Eden and Harmony Ecosystem
- origin, provider, validation status, provenance, risk classification and trust boundaries for federated records

Tenant-adjacent surfaces already present:
- `/marketplace/tenants/:tenantId`
- `TenantStorefrontPage.tsx`
- `useTenantStorefront`
- `apiClient.listTenantRegistry`
- `apiClient.getTenantStorefront`
- `apiClient.getDAOFederationRuntime`
- `apps/api` tenant registry and storefront read models
- DAO federation runtime preview with tenant isolation records
- governance authority/enforcement records for tenants

Current execution posture:
- mock-persistent/read-model oriented
- storefront activation disabled
- cross-tenant settlement disabled
- no real custom domain
- no subdomain routing
- no tenant billing
- no tenant settlement
- no tenant revenue sharing
- no production RBAC
- no isolated tenant database
- no white-label production deployment

## Repository Map Reviewed

- `apps/web/src/data/mock/marketplace.mock.js`
- `apps/web/src/modules/marketplace/types/marketplace.ts`
- `apps/web/src/modules/marketplace/services/marketplaceService.ts`
- `apps/web/src/modules/marketplace/hooks/useMarketplace.ts`
- `apps/web/src/modules/marketplace/components`
- `apps/web/src/modules/marketplace/pages`
- `apps/web/src/modules/marketplace/services/boundaryAdapters.ts`
- `apps/web/src/services/apiClient.ts`
- `apps/web/src/main.tsx`
- `apps/web/src/components/Layout.tsx`
- `apps/api/src/modules/marketplace`
- `docs/PHASE_01_RUNTIME_AUDIT.md`
- `docs/PHASE_02_FEDERATION_AUDIT.md`
- `docs/PHASE_02_CLOSURE_REPORT.md`
- `.instructions/ARCHITECTURE.md`
- `.instructions/ROADMAP.md`
- `.instructions/DECISIONS.md`
- `.instructions/PRODUCTS.md`
- `.instructions/WORKFLOW.md`
- `.instructions/TASKS.md`
- `README.md`

Structure notes:
- `apps/web/src/modules/marketplace/adapters` does not exist.
- Adapter-like frontend boundaries currently live in `apps/web/src/modules/marketplace/services/boundaryAdapters.ts`.
- `apps/api` already has mock-persistent tenant read models, but Phase 03 planning must not treat them as production multi-tenancy.

## Current Model And Type Map

Frontend Marketplace types currently focus on:
- `Product`
- `MarketplaceCollection`
- `AssetRegistryRecord`
- `Seller`
- `License`
- federation descriptors and trust boundaries

API/client tenant-facing types already include:
- `TenantRegistryRecord`
- `StorefrontView`
- `DAOStorefrontRuntimeRecord`
- `TenantRuntimeIsolationRecord`
- `ConstitutionalInheritanceRecord`
- `DAOFederationRuntimeSnapshot`

Current tenant gaps:
- no frontend `Tenant` domain model in `marketplace.ts`
- no `TenantIdentity`
- no `TenantConfiguration`
- no `TenantBranding`
- no `TenantTheme`
- no `TenantDomain`
- no `TenantCatalog`
- no `TenantCatalogRule`
- no tenant-aware product query helper in the web Marketplace service
- no route-level tenant context provider
- no global-vs-tenant marketplace context abstraction
- no branding/theme application boundary
- no domain/subdomain simulation boundary
- no catalog isolation policy model in web runtime

## Current Mock Data Map

Frontend local mock data includes products, sellers, licenses, collections, wallet discovery and federation providers. It does not include tenant configuration mock data in `apps/web/src/data/mock/marketplace.mock.js`.

API mock-persistent seed includes:
- products with `tenantId`
- tenant records
- tenant storefront read models
- tenant registry read models
- DAO federation runtime previews
- tenant isolation previews
- governance authority/enforcement projections

Implication:
- Phase 03 should decide whether tenant configuration lives in frontend local mock data, API mock-persistent read models, or both.
- Product/collection/catalog filtering should not duplicate products. It should reference global product ids, collection ids, external collection ids and rules.

## Routes And Navigation Impact

Current tenant-adjacent route:
- `/marketplace/tenants/:tenantId`

Routes likely impacted by tenant context:
- `/marketplace`
- `/marketplace/explore`
- `/marketplace/collections`
- `/marketplace/collections/:slug`
- `/marketplace/products/:slug`
- `/marketplace/sellers/:sellerId`
- `/marketplace/dashboard`
- `/marketplace/contracts`
- `/marketplace/providers`
- `/marketplace/wallet-discovery`
- `/marketplace/licenses`
- `/marketplace/create`

Future domain simulation options:
- `/marketplace/t/:tenantSlug`
- `/marketplace/t/:tenantSlug/explore`
- `/marketplace/t/:tenantSlug/collections`
- `/marketplace/t/:tenantSlug/products/:slug`

Boundary:
- domain aliases and subdomain aliases should be data fields only in Phase 03.
- no real DNS, reverse proxy, deployment routing or custom domain provisioning should be introduced.

## Conceptual Model: Global Marketplace

The global Marketplace is the ecosystem-level Axodus distribution infrastructure.

It owns:
- global product catalog
- global collection visibility
- NFT foundation
- federation descriptors
- governance-aware boundaries
- mock-first runtime surfaces
- operational transparency

It does not become a tenant. It can expose tenant marketplace entry points, but remains the sovereign infrastructure layer.

## Conceptual Model: Tenant Marketplace

A Tenant Marketplace is a logical configurable instance inside the Axodus Marketplace.

It may define:
- identity
- status
- operator metadata
- branding
- theme
- route slug
- simulated domain aliases
- catalog rules
- featured products/collections
- governance visibility
- exposure rules

It must not imply:
- separate application
- independent sovereignty
- bypass of Axodus governance
- separate treasury routing
- tenant billing
- tenant settlement
- production RBAC
- isolated database
- real custom DNS

## Conceptual Model: Tenant Registry

Tenant Registry should be the canonical mock/read-model list of tenants for Phase 03.

It should provide:
- tenant lookup by id and slug
- status
- type
- governance standing
- operator identity
- visibility
- default route
- linkage to configuration, branding, domains and catalog rules

Existing API read models can seed this, but they need explicit Phase 03 tenant configuration fields before being treated as Marketplace-as-a-Service infrastructure.

## Conceptual Model: Tenant Identity

Tenant Identity represents who/what the tenant is.

It differs from:
- Seller: commercial publisher or account presenting listings
- Collection: grouped NFT/digital assets
- Provider: external data source
- Partner: commercial/institutional relationship
- Community Marketplace: possible tenant, channel or curated catalog depending on governance

Tenant Identity should include display name, operator type, description, tenant type, governance status and public visibility. It should not authorize users or create RBAC.

## Conceptual Model: Tenant Configuration

Tenant Configuration should drive logical behavior for the tenant marketplace:
- default route
- navigation preferences
- enabled sections
- catalog mode
- exposure rules
- featured products/collections
- display limits
- read-only commerce flags
- warnings and disclaimers

Configuration must remain mock-first/read-only until later approval. It must not enable settlement, billing, custom domain routing or permissions.

## Conceptual Model: Tenant Branding

Tenant Branding describes presentation:
- logo
- display name
- tagline
- description
- trust text
- hero/media references
- institutional copy

Branding should be applied as data passed into layout/page headers. It must not misrepresent asset origin, provider validation, Axodus responsibility or governance state.

## Conceptual Model: Tenant Themes

Tenant Themes describe visual configuration:
- colors
- typography tokens
- density
- layout preferences
- navigation style
- section ordering

Theme implementation must preserve accessibility, contrast, responsiveness and existing Marketplace usability. Phase 03 should avoid arbitrary CSS injection.

## Conceptual Model: Tenant Domains

Tenant Domains represent simulated route/domain identity:
- slug
- domain aliases
- subdomain aliases
- primary route
- custom domain eligibility flag
- mock DNS status

Tenant Domains in Phase 03 must be simulated only. `canRouteCustomDomain` should remain false unless a future approved infrastructure request enables real routing.

## Conceptual Model: Tenant Catalog

Tenant Catalog is a filtered/curated view of the global Marketplace catalog.

Catalog types:
- Global Catalog: all Marketplace products, collections, licenses, assets and federated records available to the infrastructure.
- Tenant Catalog: subset exposed in a tenant marketplace.
- Curated Catalog: editorial/community/strategic selection inside a tenant or future curation phase.
- Federated Catalog: external collections/assets displayed through federation and carried into a tenant with origin/provider boundaries preserved.

Tenant catalogs should reference ids and rules. They should not duplicate product records or alter product origin, ownership, validation, licensing, billing, settlement or revenue sharing.

## Conceptual Model: Tenant Isolation

Tenant Isolation in Phase 03 should mean logical isolation:
- configuration isolation
- catalog exposure isolation
- branding isolation
- theme isolation
- route/slug simulation
- tenant-specific analytics readiness
- governance visibility

It must not mean:
- financial isolation
- isolated database
- tenant billing
- tenant settlement
- tenant treasury routing
- production RBAC
- data-plane sovereignty

## Minimum Fields Recommended

Tenant:
- `id`
- `slug`
- `name`
- `displayName`
- `description`
- `status`
- `tenantType`
- `operatorType`
- `governanceStatus`
- `createdAt`
- `updatedAt`
- `identity`
- `configuration`
- `branding`
- `theme`
- `domains`
- `catalog`
- `visibility`
- `isPublic`
- `isWhiteLabel`
- `isCommunityMarketplace`
- `canDisplay`
- `canTrade`
- `canSettle`
- `canRouteCustomDomain`
- `warnings`
- `disclaimers`

TenantIdentity:
- `displayName`
- `operatorName`
- `operatorType`
- `description`
- `tenantType`
- `governanceStatus`
- `trustText`
- `contactLabel`

TenantConfiguration:
- `defaultRoute`
- `enabledSections`
- `navigationMode`
- `catalogMode`
- `showFederatedAssets`
- `showProviderWarnings`
- `commercePreviewMode`
- `governanceRequired`

TenantBranding:
- `logoUrl`
- `symbolUrl`
- `displayName`
- `tagline`
- `description`
- `trustMessage`
- `heroImageUrl`

TenantTheme:
- `primaryColor`
- `accentColor`
- `backgroundColor`
- `textColor`
- `density`
- `layout`
- `cornerRadius`
- `fontFamily`

TenantDomain:
- `slug`
- `primaryRoute`
- `domainAliases`
- `subdomainAliases`
- `mockDnsStatus`
- `canRouteCustomDomain`
- `warnings`

TenantCatalog:
- `tenantId`
- `mode`
- `featuredCollectionIds`
- `featuredProductIds`
- `allowedCategoryIds`
- `allowedCollectionIds`
- `allowedProductIds`
- `allowedExternalCollectionIds`
- `blockedProductIds`
- `blockedCollectionIds`
- `rules`

TenantCatalogRule:
- `id`
- `type`
- `targetType`
- `targetId`
- `effect`
- `reason`
- `governanceRequired`
- `priority`

Execution flags:
- `canTrade=false`
- `canSettle=false`
- `canRouteCustomDomain=false`

These flags should remain false or explicitly simulated/non-executing during Phase 03 unless a later approved request changes the boundary.

## Tenant Status Taxonomy Recommended

- `draft`
- `configured-mock`
- `active-mock`
- `review-required`
- `governance-review`
- `restricted`
- `disabled`
- `archived`

## Tenant Type Taxonomy Recommended

- `global`
- `community`
- `creator`
- `academy`
- `acs`
- `enterprise`
- `dao`
- `partner`
- `demo`

## Isolation Boundaries Required

Every tenant must expose:
- identity
- configuration
- branding
- theme
- allowed catalog
- exposure rules
- governance status
- visibility
- execution limits
- disclaimers

Required boundary statements:
- no tenant billing
- no tenant settlement
- no tenant treasury routing
- no tenant revenue sharing
- no custom DNS real
- no subdomain real
- no separate deployment
- no isolated database
- no real multi-tenant auth
- no production RBAC
- no automatic commercial permissions
- no sovereignty outside Axodus governance

## Page Impact Map

Layout/navigation:
- Current: global Marketplace nav plus DAO Storefront link.
- Future: tenant-aware label, logo, theme tokens, route prefix and section visibility.
- Risk: branding can imply independent white-label production.
- Boundary: show simulated tenant context and Axodus governance.

Explorer:
- Current: global product search/filter/sort.
- Future: tenant catalog filters over global products.
- Risk: product duplication or hidden origin changes.
- Boundary: retain original product origin, provider and validation state.

Collections list:
- Current: native and external collection records.
- Future: tenant-allowed collections and external collections.
- Risk: provider-reported stats treated as tenant-verified.
- Boundary: preserve federation warnings.

Collection detail:
- Current: native/federated detail with boundary notes.
- Future: tenant context, tenant curation label, allowed/excluded state.
- Risk: tenant catalog appears to validate collection.
- Boundary: curation is not authenticity validation.

Product detail:
- Current: global product detail and Asset Registry.
- Future: tenant exposure context and tenant catalog membership.
- Risk: tenant exposure appears to change licensing or settlement.
- Boundary: product origin, license and settlement remain unchanged.

Seller profile:
- Current: seller identity, metrics and DAO relationship visibility.
- Future: tenant relationship badges.
- Risk: seller becomes tenant/distributor/partner implicitly.
- Boundary: role separation must remain explicit.

Asset Registry Panel:
- Current: ownership, transfer, license and validation mock data.
- Future: tenant exposure field.
- Risk: tenant exposure appears to alter ownership.
- Boundary: registry truth remains product/asset scoped, not tenant-owned by default.

Marketplace Dashboard:
- Current: mock-first NFT metrics.
- Future: tenant-scoped dashboard preview.
- Risk: Phase 07 Marketplace Intelligence drift.
- Boundary: keep tenant metrics mock/operational, not BI.

External Contracts:
- Current: Contract Import preview.
- Future: tenant can include/exclude external contracts by catalog rules.
- Risk: tenant import appears to verify external contract.
- Boundary: keep provider/provenance/trust boundary visible.

Federation Providers:
- Current: provider descriptors.
- Future: tenant can reference provider eligibility.
- Risk: provider becomes tenant authority.
- Boundary: providers are not absolute truth.

Wallet Discovery:
- Current: mock/read-only wallet asset records.
- Future: tenant context may filter display eligibility.
- Risk: tenant display implies custody or verified ownership.
- Boundary: no wallet signatures, no ownership guarantee.

License Viewer:
- Current: global license previews.
- Future: tenant license exposure context.
- Risk: tenant exposure appears to enforce license.
- Boundary: no license enforcement beyond approved runtime.

Governance Validation:
- Current: governance read/enforcement preview.
- Future: tenant governance standing and review queue.
- Risk: governance preview becomes production permission.
- Boundary: keep read-only unless approved.

Create/Sell Preview:
- Current: listing preview.
- Future: tenant catalog selection or submission target.
- Risk: tenant listing enables commercial permissions.
- Boundary: no automatic product exposure or settlement.

Buy-now modal and Bid modal:
- Current: preview-only/non-settling.
- Future: tenant context label only.
- Risk: tenant storefront implies real checkout.
- Boundary: no real payment, settlement, wallet signature or contract write.

## Gaps By MEP

### MEP-REQ-030 - Multi-Tenant Foundation

Needs:
- Tenant model in Marketplace frontend types or dedicated tenant types
- tenant registry source-of-truth decision
- tenant context resolver
- global marketplace fallback
- route strategy
- helper to resolve tenant by id/slug
- helper to filter catalog by tenant rules
- tests for missing tenant and global fallback

Do not implement yet:
- real tenant registry backend
- tenant authentication
- RBAC
- isolated database
- billing or settlement.

### MEP-REQ-031 - Marketplace Branding

Needs:
- branding model
- theme model
- accessibility constraints
- layout integration plan
- page header integration plan
- default global branding fallback
- tests for tenant branding fallback

Do not implement yet:
- arbitrary CSS injection
- white-label production deployment
- separate app shell
- custom domain branding enforcement.

### MEP-REQ-032 - Tenant Domains

Needs:
- simulated domain model
- slug/alias model
- route prefix plan
- conflict checks with existing routes
- mock DNS status labels
- explicit `canRouteCustomDomain=false`

Do not implement yet:
- real DNS
- subdomain provisioning
- reverse proxy routing
- deployment routing
- production domain ownership verification.

### MEP-REQ-033 - Tenant Isolation

Needs:
- tenant catalog model
- catalog rules
- allowed/blocked product and collection lists
- external collection eligibility
- federated asset boundary propagation
- governance validation on sensitive exposure
- tests for catalog filtering and no duplication

Do not implement yet:
- financial isolation
- tenant settlement
- tenant billing
- revenue sharing
- physical data isolation
- production RBAC.

## Risks

UI/UX risks:
- tenant branding may obscure Axodus governance
- tenant pages may look like independent marketplaces
- route prefixes may confuse global vs tenant context

Isolation risks:
- logical catalog isolation may be mistaken for physical data isolation
- external assets may lose origin/provider warnings inside tenant catalogs
- tenant context can accidentally leak into global pages

Configuration risks:
- theme data can break accessibility
- incomplete fallback can render blank tenant pages
- domain alias conflicts can shadow existing routes

Catalog risks:
- duplicated products can drift from global product truth
- blocked products may remain visible through global links
- federated collections may be treated as verified tenant inventory

Governance risks:
- tenant governance preview can be mistaken for enforcement
- white-label positioning can imply bypass of Axodus rules
- sensitive products may be exposed without governance review

Scope risks:
- Phase 03 can drift into Distribution Network, Revenue Sharing or Marketplace Intelligence
- tenant dashboard work can become BI
- tenant commerce can imply settlement or billing

## Recommended Implementation Sequence

1. MEP-REQ-030 - Multi-Tenant Foundation
   - Objective: define tenant registry, identity and configuration in mock/read-model form.
   - Scope: types, mock data/read-model mapping, tenant resolver, global fallback, route plan.
   - Probable files: `marketplace.ts`, `marketplaceService.ts`, `useMarketplace.ts`, `apiClient.ts`, `TenantStorefrontPage.tsx`, `main.tsx`.
   - Dependencies: Phase 02 closed, existing API tenant registry previews.
   - Risks: accidental production RBAC or backend expansion.
   - Tests: tenant lookup, missing tenant, global fallback, no settlement flags.
   - Acceptance: tenant context is explicit and mock-first.
   - Do not implement: billing, settlement, RBAC, isolated database.

2. MEP-REQ-031 - Marketplace Branding
   - Objective: add tenant branding and theme descriptors.
   - Scope: branding/theme fields, layout/header application, accessibility rules.
   - Probable files: `Layout.tsx`, tenant page components, mock tenant data, tests.
   - Dependencies: tenant context resolver.
   - Risks: white-label production implication.
   - Tests: fallback branding, contrast-safe defaults, no global breakage.
   - Acceptance: tenant branding is data-driven and clearly inside Axodus.
   - Do not implement: arbitrary CSS, separate deployment.

3. MEP-REQ-032 - Tenant Domains
   - Objective: simulate tenant domain/subdomain identity.
   - Scope: domain alias fields, route prefix, conflict checks, mock DNS status.
   - Probable files: router, tenant helpers, tenant docs/tests.
   - Dependencies: tenant registry and slug resolver.
   - Risks: real DNS interpretation.
   - Tests: slug resolution, unknown slug, route conflicts.
   - Acceptance: domains are simulated and non-routing outside SPA.
   - Do not implement: DNS, reverse proxy, production custom domains.

4. MEP-REQ-033 - Tenant Isolation
   - Objective: implement logical catalog isolation.
   - Scope: catalog rules, allowed/blocked references, federated catalog propagation.
   - Probable files: tenant service helpers, explorer/collections/product pages, tests.
   - Dependencies: tenant context and catalog models.
   - Risks: product duplication, hidden global origin changes.
   - Tests: allowed/blocked product filtering, federated boundary preservation, global fallback.
   - Acceptance: tenant catalog is isolated by rules without duplicating products.
   - Do not implement: tenant billing, settlement, revenue sharing, physical isolation.

5. MEP-PHASE-03-CLOSURE - QA, navigation and Marketplace-as-a-Service validation
   - Objective: validate global/tenant navigation, branding, domain simulation and catalog isolation.
   - Scope: QA report, lint/test/build, risk-term search.
   - Dependencies: MEP-REQ-030 through MEP-REQ-033.
   - Risks: hidden runtime authority language.
   - Tests: route walkthrough, tenant/global fallbacks, no-execution checks.
   - Acceptance: Phase 03 closes as mock-first Tenant Infrastructure.
   - Do not implement: Phase 05 Distribution Network, Phase 06 Revenue Sharing, Phase 07 Marketplace Intelligence.

## Definition Of Done Recommended

- Tenant Marketplace is distinct from global Marketplace.
- Tenant Registry, Tenant Identity and Tenant Configuration are modeled.
- Tenant Branding, Tenant Themes and Tenant Domains are modeled.
- Tenant Catalog and Tenant Isolation are modeled as logical catalog/config isolation.
- Tenant status and tenant type taxonomies are present.
- Tenant pages and routes preserve global fallback.
- Federated asset boundaries survive tenant exposure.
- `canTrade`, `canSettle` and `canRouteCustomDomain` are false or simulated/non-executing.
- No real custom DNS, subdomain, billing, settlement, revenue sharing, RBAC, backend, schema, database, tracking or BI is introduced.

## QA Checklist For Future Closure

- open global Marketplace
- open known tenant storefront
- open unknown tenant route
- validate tenant identity
- validate tenant branding fallback
- validate tenant theme fallback
- validate domain/subdomain labels as mock/simulated
- validate tenant catalog allowed products
- validate tenant catalog blocked products
- validate external collection inside tenant keeps origin/provider/validation/risk/trust boundary
- validate buy-now and bid remain non-executing
- validate dashboard remains mock-first and not BI
- run lint
- run tests
- run build
- run `git diff --check`
- search for tenant activation risk language

## Validation Performed For MEP-03A

Repository inspection was performed with `find`, `rg` and direct file reads across:
- web runtime
- API runtime
- mock data
- route config
- layout/navigation
- Phase 01 and Phase 02 docs
- `.instructions`
- README

Terms inspected:
- tenant
- tenant marketplace
- white label
- marketplace branding
- marketplace domains
- marketplace themes
- tenant registry
- tenant identity
- tenant configuration
- tenant catalog
- tenant isolation
- custom domain
- subdomain
- catalog rules
- global catalog
- curated catalog
- federated catalog
- branding
- theme
- mock
- read-only
- no settlement
- no treasury routing
- no custom DNS
- no RBAC

Risk terms to keep in boundary/negative context:
- real custom domain
- production tenant routing
- tenant billing enabled
- tenant settlement enabled
- tenant treasury routing enabled
- tenant revenue sharing enabled
- real multi-tenant auth
- RBAC enabled
- isolated database enabled
- white-label production enabled

No Tenant Infrastructure runtime was implemented by this audit.

# Phase 02 Federation Layer Audit

Date: 2026-06-12

## Executive Summary

PHASE 02 - FEDERATION LAYER is ready for controlled implementation planning, but not for runtime activation.

The Phase 01 Marketplace runtime now has a usable NFT foundation: Explorer, Collections, Seller Profiles, Asset Registry, Marketplace Dashboard, mock data, mock ownership history, mock transfer history, mock license history, collection metrics, seller metrics, and explicit no-execution boundaries.

Federation should enter through a new read-only modeling layer that can represent external contracts, external collections, external assets, external metadata, and federation providers without treating any external source as trusted by default.

This audit recommends that Phase 02 starts by extending the data model and UI labels before any external connector exists. Contract Import, Collection Import, Wallet Discovery, and Federation Providers must remain mock-first/read-only until a later approved request explicitly allows external IO.

## Current State After Phase 01

Runtime surfaces validated in Phase 01:

- `/marketplace/explore`
- `/marketplace/collections`
- `/marketplace/collections/:slug`
- `/marketplace/products/:slug`
- `/marketplace/sellers/:sellerId`
- `/marketplace/dashboard`
- `/item/:chain/:contract/:id`

Current marketplace primitives:

- `Product`
- `MarketplaceCollection`
- `AssetRegistryRecord`
- `Seller`
- `License`
- `ProductFilters`
- `CollectionView`
- `SellerProfileView`
- `AssetRegistryView`
- `MarketplaceAnalyticsView`

Current NFT primitives:

- ERC721
- ERC1155
- EIP-2981 royalty preview
- listings
- bids
- auctions
- buy-now preview
- seller profiles
- collections
- asset registry

Current execution posture:

- mock-first
- preview-only
- read-only where wallet/provider reads exist
- no settlement
- no contract writes
- no wallet signatures
- no treasury routing
- no bridge execution
- no external provider integration

## Repository Map

Reviewed runtime and documentation areas:

- `apps/web/src/data/mock/marketplace.mock.js`
- `apps/web/src/modules/marketplace/types/marketplace.ts`
- `apps/web/src/modules/marketplace/services/marketplaceService.ts`
- `apps/web/src/modules/marketplace/services/boundaryAdapters.ts`
- `apps/web/src/modules/marketplace/services/nftOwnershipRuntime.ts`
- `apps/web/src/modules/marketplace/services/listingRuntime.ts`
- `apps/web/src/modules/marketplace/hooks/useMarketplace.ts`
- `apps/web/src/modules/marketplace/components`
- `apps/web/src/modules/marketplace/pages`
- `apps/web/src/services/apiClient.ts`
- `apps/web/src/main.tsx`
- `apps/web/src/components/Layout.tsx`
- `apps/api/src/modules/marketplace`
- `.instructions/ARCHITECTURE.md`
- `.instructions/ROADMAP.md`
- `.instructions/DECISIONS.md`
- `.instructions/PRODUCTS.md`
- `.instructions/WORKFLOW.md`
- `.instructions/TASKS.md`
- `README.md`
- `docs/PHASE_01_RUNTIME_AUDIT.md`
- `docs/PHASE_01_CLOSURE_REPORT.md`

Structure notes:

- `apps/web/src/modules/marketplace/adapters` does not exist.
- Adapter-like boundaries currently live under `apps/web/src/modules/marketplace/services/boundaryAdapters.ts`.
- `apps/api` exists and has a mock-persistent Marketplace API, but Phase 02 should not add Federation API routes during planning.
- Existing API routes include product, seller, registry, storefront, governance, indexer readiness, reconciliation, settlement preview, bridge preview, and live runtime endpoints. These must not be confused with live federation.

## Current Model And Type Map

`Product` currently carries:

- identity: `id`, `title`, `slug`, `category`, `subcategory`
- marketplace linkage: `collectionId`, `sellerId`
- display metadata: `description`, `shortDescription`, `tags`, `images`, `media`, `metadataAttributes`
- NFT fields: `tokenStandard`, `contractAddress`, `tokenId`
- chain fields: `supportedChains`, `bridgeReadiness`
- commerce fields: `status`, `pricing`, `listingType`, `auction`, `royaltyModel`
- access fields: `accessModel`, `deliveryType`, `licenseType`, `nftBound`
- governance fields: `governanceStatus`, `constitutionalStanding`, `governanceRequired`, `visibility`

`MarketplaceCollection` currently carries:

- `id`
- `name`
- `slug`
- `description`
- `image`
- `chain`
- `contractAddress`
- `assetType`
- `origin`
- `validationStatus`
- `governanceStatus`
- `sellerId`
- `metrics`

`AssetRegistryRecord` currently carries:

- `productId`
- `currentOwner`
- `ownershipHistory`
- `transferHistory`
- `licenseHistory`
- `validation`

Existing gaps for federation:

- no `ExternalAsset` model
- no `ExternalCollection` model
- no `ExternalContract` model
- no `ExternalMetadata` model
- no `FederationProvider` model
- no `providerId`
- no `providerName`
- no external provenance object
- no external risk classification
- no external trust boundary object
- no `isNative`, `isExternal`, `isFederated`
- no explicit `canTrade`, `canSettle`, `canBridge`
- no `lastSyncedAt`, `importedAt`, or provider health state

## Current Mock Data Map

Current mock data:

- `marketplaceProducts`
- `marketplaceCollections`
- `marketplaceSellers`
- `marketplaceLicenses`
- `marketplaceAssetRegistry`
- `marketplaceBoundaries`

Current collection origin support:

- `CollectionOrigin = "native" | "future-external"`
- all current collections are native mock collections
- collection detail already displays `origin`
- collection list copy states that federation remains future Phase 02 work

Current asset validation support:

- `AssetValidationLayer` supports metadata, contract, collection, origin, royalty, and notes
- statuses reuse `ProductStanding`
- this is useful for Phase 02 but too coarse for external validation

Current mock ownership support:

- `currentOwner`
- ownership history
- transfer history
- license history
- empty-state support in Asset Registry

Current provider support:

- no provider model
- no provider registry
- no provider capability map
- no provider health state

## Pages Impacted By Federation

Explorer:

- Already supports search, filters, categories, chain, asset type, seller, listing status, listing type, sorting, and mock fallback.
- Needs future filters for origin, provider, validation status, risk classification, and display status.
- Needs badges for native, external, federated, provider-reported, blocked, or quarantined assets.
- Must keep external items non-tradable unless a later approved phase enables commerce.

Product Detail:

- Already displays product metadata, collection link, seller link, NFT fields, royalty preview, listing status, governance validation, and boundary panels.
- Needs future external origin panel and provider/provenance section.
- Needs visible warnings when product data is provider-reported or unverified.
- Must not imply ownership, authenticity, custody, settlement, bridge readiness, or royalties are guaranteed.

Collection List:

- Already displays native mock collection cards and rankings.
- Needs external/federated collection badges and provider identity.
- Needs clear separation between internal mock metrics and provider-reported statistics.

Collection Detail:

- Already displays collection origin, validation status, contract reference, metrics, ranking, and assets.
- Needs external metadata source, provider, last synced, risk state, and external statistics boundary.
- Must not present provider-reported floor price or holder count as verified market truth.

Seller Profile:

- Already displays seller identity, mock account, reputation, risk indicator, listings, collections, and governance validation.
- Needs future separation between seller, creator, discovered owner, distributor, provider, and tenant.
- Wallet discovery must not turn discovered assets into seller-owned inventory by default.

Asset Registry Panel:

- Best existing entry point for Phase 02 federation labels.
- Already displays current owner, token ID, contract, royalty preview, license, validation layer, metadata attributes, histories, and execution boundaries.
- Needs external origin, provider, provenance, risk classification, trust boundary, last synced, and canDisplay/canTrade/canSettle/canBridge flags.

Marketplace Dashboard:

- Already displays mock-first analytics and boundary notes.
- Needs future federated summary counts, blocked/quarantined counts, provider health, and data quality indicators.
- Must not become Phase 07 Marketplace Intelligence or BI.

License Viewer:

- Already treats license and entitlement as preview/read-only.
- Needs warnings for externally originated licenses or certificates.
- Must not enforce external licenses.

Governance Validation Page:

- Already surfaces governance authority and enforcement context.
- Needs future queues for external asset review, contract review, metadata risk, and provider risk.
- Must remain visibility/review oriented unless a later governance implementation enables writes.

Create/Sell Preview:

- Already prepares draft listings and validates governance metadata.
- Needs to prevent external/imported assets from being listed by default.
- Should require explicit eligibility before any federated asset can appear in sell preview.

Buy-now Modal:

- Already preview-only.
- Must show disabled trading state for external/federated assets unless explicitly enabled later.

Bid Modal:

- Already preview-only.
- Must show disabled external bids unless explicitly enabled later.

Layout/Navigation:

- No new top-level nav is required for MEP-02A.
- Future Phase 02 may add provider/federation review navigation only after runtime scope is approved.

## Services, Hooks, Helpers, And Adapters Impacted

Existing services and helpers:

- `filterAndSortProducts`
- `getProductExplorerFacets`
- `listCollections`
- `getCollectionBySlug`
- `getCollectionForProduct`
- `getProductBySlug`
- `getProductByItemRef`
- `getAssetRegistryForProduct`
- `buildMarketplaceAnalytics`
- `MarketplaceContractAdapter`
- `RoyaltyService`
- `StorageAccessService`
- `LayerZeroBridgeService`
- `verifyNftOwnership`
- `hydrateListingRuntime`

Future Phase 02 helpers should be added only when implementing MEP-REQ-020 through MEP-REQ-023:

- `normalizeExternalContract`
- `normalizeExternalCollection`
- `normalizeExternalAsset`
- `normalizeExternalMetadata`
- `classifyExternalRisk`
- `deriveFederationDisplayStatus`
- `assertExternalAssetDisplayBoundary`
- `getFederatedExplorerFacets`
- `getFederationProviderCapabilities`

Future adapters should be interface-only before any real provider integration:

- `FederationProviderAdapter`
- `OpenSeaProviderAdapter` mock contract only
- `RaribleProviderAdapter` mock contract only
- `MagicEdenProviderAdapter` mock contract only
- `HarmonyEcosystemProviderAdapter` mock contract only
- `WalletDiscoveryAdapter` mock/read-only contract only

Required adapter properties:

- no API keys
- no SDK dependency
- no external HTTP call
- no wallet signature
- no on-chain write
- no settlement
- no custody
- no bridge execution

## Conceptual Model: Internal vs External Asset

Internal asset:

- originated, issued, controlled, licensed, operated, or explicitly stewarded inside Axodus infrastructure
- can reuse current `Product`, `MarketplaceCollection`, and `AssetRegistryRecord`
- may have Axodus governance standing and Axodus-maintained metadata
- still remains mock-first unless a later request activates operational execution

External asset:

- originated outside Axodus infrastructure
- may be discovered through a wallet, external collection, external contract, or federation provider
- must carry origin, provider, provenance, validation status, risk classification, and trust boundary
- must not be displayed as native Axodus
- must not be tradable, settleable, bridgeable, or custody-assumed by default

Federated asset:

- external asset that passed minimum display requirements
- visible or referencable inside Marketplace
- may be searchable or displayed
- still non-executing unless explicitly approved later

## Conceptual Model: Internal vs External Collection

Internal collection:

- native Axodus collection
- currently modeled through `MarketplaceCollection.origin = "native"`
- may be connected to internal products through `collectionId`

External collection:

- collection originated outside Axodus infrastructure
- must carry source provider, origin, chain, contract, validation status, provenance, risk classification, metadata source, metrics source, and trust boundary
- may have provider-reported stats but those stats must be labeled as provider-reported or unverified
- must not inherit native ranking or native validation by default

## Conceptual Model: Internal vs External Contract

Internal contract:

- mock or future Axodus-known contract reference attached to a product or collection
- current fields: `contractAddress`, `tokenStandard`, `tokenId`, `supportedChains`, `marketplaceContractAddress`, `auctionContractAddress`, `royaltyContractAddress`

External contract:

- contract address originated outside Axodus infrastructure
- must carry provider, chain ID/name, token standard, source type, external URL, validation status, risk classification, and contract trust boundary
- can be referenced or displayed before it is reviewed
- must not be treated as verified, safe, tradeable, or custody-compatible by default

## Conceptual Model: Internal vs External Metadata

Internal metadata:

- product or collection metadata curated in Axodus mock/runtime data
- current fields: title, description, images, media, metadata attributes, tags, metrics

External metadata:

- metadata obtained from provider, token URI, contract URI, wallet discovery, external collection, or user-submitted reference
- must be sanitized and normalized before display
- must carry metadata URL, optional metadata hash, source, provider, validation status, quality status, risk classification, and warnings
- must not be trusted as complete, safe, authentic, or permanent

## Minimum Future Fields

ExternalAsset:

- `id`
- `sourceType`
- `origin`
- `providerId`
- `providerName`
- `chainId`
- `chainName`
- `contractAddress`
- `tokenId`
- `tokenStandard`
- `externalUrl`
- `metadataUrl`
- `metadataHash`
- `provenance`
- `validationStatus`
- `riskClassification`
- `trustBoundary`
- `lastSyncedAt`
- `importedAt`
- `displayStatus`
- `isNative`
- `isExternal`
- `isFederated`
- `canDisplay`
- `canTrade`
- `canSettle`
- `canBridge`
- `warnings`
- `disclaimers`

ExternalCollection:

- `id`
- `sourceType`
- `origin`
- `providerId`
- `providerName`
- `chainId`
- `chainName`
- `contractAddress`
- `tokenStandard`
- `externalUrl`
- `metadataUrl`
- `metadataHash`
- `provenance`
- `validationStatus`
- `riskClassification`
- `trustBoundary`
- `lastSyncedAt`
- `importedAt`
- `displayStatus`
- `metricsSource`
- `providerReportedMetrics`
- `canDisplay`
- `canTrade`
- `canSettle`
- `canBridge`
- `warnings`
- `disclaimers`

ExternalContract:

- `id`
- `sourceType`
- `origin`
- `providerId`
- `providerName`
- `chainId`
- `chainName`
- `contractAddress`
- `tokenStandard`
- `externalUrl`
- `provenance`
- `validationStatus`
- `riskClassification`
- `trustBoundary`
- `lastSyncedAt`
- `importedAt`
- `displayStatus`
- `contractSource`
- `reviewStatus`
- `canDisplay`
- `canTrade`
- `canSettle`
- `canBridge`
- `warnings`
- `disclaimers`

ExternalMetadata:

- `id`
- `sourceType`
- `origin`
- `providerId`
- `providerName`
- `externalUrl`
- `metadataUrl`
- `metadataHash`
- `imageUrl`
- `attributes`
- `description`
- `statistics`
- `declaredRoyalties`
- `provenance`
- `validationStatus`
- `riskClassification`
- `trustBoundary`
- `metadataQuality`
- `lastSyncedAt`
- `importedAt`
- `displayStatus`
- `warnings`
- `disclaimers`

FederationProvider:

- `id`
- `name`
- `providerType`
- `trustLevel`
- `supportedChains`
- `capabilities`
- `dataScope`
- `rateLimitNotes`
- `validationLimits`
- `healthStatus`
- `lastCheckedAt`
- `boundaryNotes`
- `canDiscoverContracts`
- `canDiscoverCollections`
- `canDiscoverWalletAssets`
- `canEnrichMetadata`
- `canValidateMetadata`
- `canValidateContracts`
- `canTrade`
- `canSettle`
- `canBridge`
- `warnings`
- `disclaimers`

Phase 02 execution flags:

- `canTrade` must default to false
- `canSettle` must default to false
- `canBridge` must default to false
- `canDisplay` may become true only after minimum origin/provider/validation/risk/trust fields exist

## Recommended Validation Statuses

Initial federation validation statuses:

- `unverified`
- `provider-reported`
- `metadata-validated`
- `contract-referenced`
- `contract-reviewed`
- `collection-reviewed`
- `governance-reviewed`
- `blocked`
- `quarantined`

Mapping to current status style:

- `compliant` can map to `governance-reviewed` only for internal/native assets.
- `under-review` can map to `provider-reported`, `contract-referenced`, or `collection-reviewed`.
- `restricted` can map to `blocked` or `quarantined`.
- Phase 02 should not rely only on `ProductStanding` for external assets because external validation needs more specific states.

## Recommended Risk Classification

Initial federation risk classifications:

- `low-mock`
- `medium-mock`
- `high-mock`
- `unknown-external`
- `metadata-risk`
- `contract-risk`
- `provider-risk`
- `phishing-risk`
- `blocked`

Minimum risk behavior:

- `unknown-external`, `metadata-risk`, `contract-risk`, `provider-risk`, `phishing-risk`, and `blocked` must display warning labels.
- `blocked` assets must not be displayed as available listings.
- `phishing-risk` assets should be quarantined from normal Explorer results unless explicitly requested in an operator/review view.

## Required Trust Boundaries

Every external asset must carry or display:

- origin
- provider
- chain
- contract
- token standard
- validation status
- provenance
- risk classification
- last updated or last synced reference
- limitation warnings
- execution state

Federation does not mean:

- custody
- liquidation
- real purchase
- real sale
- wallet signature
- contract write
- bridge execution
- authenticity guarantee
- metadata guarantee
- ownership guarantee
- royalty guarantee
- availability guarantee

## MEP-REQ-020 - Contract Import Gaps

Objective:

- represent external ERC721 and ERC1155 contracts as referenced, non-executing Marketplace records.

Current support:

- `Product.contractAddress`
- `Product.tokenStandard`
- `Product.tokenId`
- `Product.supportedChains`
- `AssetValidationLayer.contract`
- `AssetRegistryPanel` contract display
- `ListingRuntime` and `NftOwnershipRuntime` readonly provider boundaries
- `MarketplaceContractAdapter` mock contract call boundary

Gaps:

- no external contract descriptor
- no `chainId`
- no provider identity
- no contract source
- no contract review state
- no external contract provenance
- no distinction between native contract and external contract
- no provider-reported contract warning

Future likely files:

- `apps/web/src/modules/marketplace/types/marketplace.ts`
- `apps/web/src/data/mock/marketplace.mock.js`
- `apps/web/src/modules/marketplace/services/marketplaceService.ts`
- `apps/web/src/modules/marketplace/components/AssetRegistryPanel.tsx`
- `apps/web/src/modules/marketplace/pages/ProductDetailPage.tsx`

Do not implement yet:

- chain reads
- contract verification
- ABI fetch
- subgraph
- indexer
- contract writes
- settlement

Acceptance direction:

- external contracts can be displayed as referenced/unverified/provider-reported records with `canTrade=false`, `canSettle=false`, and `canBridge=false`.

## MEP-REQ-021 - Collection Import Gaps

Objective:

- represent external collections without presenting provider data as native Axodus truth.

Current support:

- `MarketplaceCollection`
- `CollectionOrigin = "native" | "future-external"`
- collection list route
- collection detail route
- metrics and ranking
- collection-to-product relationship
- collection origin and validation display

Gaps:

- no external collection object
- no provider source
- no metadata source
- no provider-reported metrics source
- no external stats boundary
- no last sync timestamp
- no collection provenance
- no collection risk classification
- no display/quarantine state

Future likely files:

- `apps/web/src/modules/marketplace/types/marketplace.ts`
- `apps/web/src/data/mock/marketplace.mock.js`
- `apps/web/src/modules/marketplace/services/marketplaceService.ts`
- `apps/web/src/modules/marketplace/components/CollectionCard.tsx`
- `apps/web/src/modules/marketplace/pages/CollectionsPage.tsx`
- `apps/web/src/modules/marketplace/pages/CollectionDetailPage.tsx`
- `apps/web/src/modules/marketplace/components/ProductFilters.tsx`

Do not implement yet:

- provider collection import
- external floor price fetch
- external holder count fetch
- external ranking
- external marketplace validation

Acceptance direction:

- external collections can be displayed only with explicit provider, origin, validation status, risk classification, and metrics boundary.

## MEP-REQ-022 - Wallet Discovery Gaps

Objective:

- prepare read-only/mock-first detection of wallet assets without custody, ownership guarantees, or wallet signatures.

Current support:

- mock accounts on sellers
- readonly wallet state in layout
- `useWallet`
- `NftOwnershipRuntime`
- `WalletSecurityRuntime`
- ownership history and current owner in Asset Registry
- entitlement snapshots by mock holder

Gaps:

- no wallet discovery model
- no discovered asset queue
- no owner confidence state
- no distinction between discovered asset and verified ownership
- no wallet discovery adapter
- no discovery provenance
- no display rules for discovered-but-unverified assets

Future likely files:

- `apps/web/src/modules/marketplace/types/marketplace.ts`
- `apps/web/src/modules/marketplace/services/nftOwnershipRuntime.ts`
- `apps/web/src/modules/marketplace/services/marketplaceService.ts`
- `apps/web/src/modules/marketplace/components/AssetRegistryPanel.tsx`
- `apps/web/src/modules/marketplace/pages/ProductDetailPage.tsx`
- `apps/web/src/modules/marketplace/pages/SellerProfilePage.tsx`
- `apps/web/src/services/apiClient.ts` only after API scope is explicitly approved

Do not implement yet:

- wallet signature
- wallet connection requirement
- ownership guarantee
- custody
- asset claim
- transfer
- external wallet indexing

Acceptance direction:

- discovered wallet assets are visible only as provider/wallet-reported references and must not be treated as owned, custodied, or tradeable by default.

## MEP-REQ-023 - Federation Providers Gaps

Objective:

- define provider capability and trust models before any connector exists.

Target future providers:

- OpenSea
- Rarible
- Magic Eden
- Harmony Ecosystem

Current support:

- no provider registry
- no provider adapter interface
- no `apps/web/src/modules/marketplace/adapters` directory
- adapter-like boundaries exist in `services/boundaryAdapters.ts`
- API runtime envelope has execution-disabled flags
- docs define Federation Providers conceptually

Gaps:

- no provider identity
- no provider type
- no provider trust level
- no provider capability map
- no provider health state
- no supported chain map per provider
- no rate limit notes
- no data scope notes
- no validation limits
- no provider boundary display

Future likely files:

- `apps/web/src/modules/marketplace/types/marketplace.ts`
- `apps/web/src/data/mock/marketplace.mock.js`
- `apps/web/src/modules/marketplace/services/marketplaceService.ts`
- future `apps/web/src/modules/marketplace/services/federationProviders.ts`
- future `apps/web/src/modules/marketplace/components/FederationProviderBadge.tsx`
- future `apps/web/src/modules/marketplace/pages/FederationReviewPage.tsx` only if approved

Do not implement yet:

- real OpenSea connector
- real Rarible connector
- real Magic Eden connector
- real Harmony connector
- SDKs
- HTTP calls
- API keys
- env vars
- sync jobs
- queues
- cache

Acceptance direction:

- provider records can describe capabilities and boundaries without making outbound calls or asserting truth.

## UI/UX Risks

- External badges may be visually too subtle and make external assets look native.
- Provider-reported stats may look equivalent to internal mock metrics.
- Imported collection pages may imply verification if they share native collection styling without labels.
- Product detail price/listing areas may imply that external assets can be bought or bid on.
- Wallet discovery may imply ownership or custody.
- Dashboard metrics may imply external market analytics are real.

Mitigations:

- use persistent origin/provider badges
- show validation status near title and action areas
- keep buy/bid controls disabled for external/federated records by default
- show trust boundary notes in Asset Registry
- keep provider-reported metrics labeled
- quarantine risky assets from default Explorer results

## Security Risks

- malicious metadata images or URLs
- phishing links in external descriptions
- spoofed collection names
- contract addresses that imitate known projects
- provider data drift
- provider outage or partial data
- owner spoofing
- token standard mismatch
- chain mismatch
- royalty spoofing
- unsafe external URLs

Mitigations:

- sanitize metadata before display
- do not auto-link unsafe URLs
- display chain and contract prominently
- require explicit provider and provenance
- default unknown risk to `unknown-external`
- default execution flags to false
- require governance review before broader exposure

## Scope Risks

- Contract Import may drift into contract verification.
- Collection Import may drift into external market indexing.
- Wallet Discovery may drift into wallet connection or signature flows.
- Federation Providers may drift into real API integrations.
- Federation analytics may drift into Phase 07 Marketplace Intelligence.
- External commerce may drift into settlement, custody, or bridge execution.

Phase 02 must remain focused on representation, display, normalization, and trust boundaries.

## Recommended Implementation Sequence

### 1. MEP-REQ-020 - Contract Import

Objective:

- add external contract descriptors and contract display boundaries.

Scope:

- conceptual and mock-first contract import model
- native vs external contract distinction
- provider-reported contract status
- contract trust boundary display

Probable files:

- `types/marketplace.ts`
- `marketplace.mock.js`
- `marketplaceService.ts`
- `AssetRegistryPanel.tsx`
- service tests

Dependencies:

- Phase 01 Asset Registry
- Phase 00 Federation Domain

Risks:

- UI implying contract verification
- external contract appearing tradeable

Tests expected:

- external contract normalization
- `canTrade=false`, `canSettle=false`, `canBridge=false`
- contract warning labels

Acceptance:

- external contracts can be referenced and displayed without verification, settlement, or contract writes.

Do not implement:

- ABI fetch
- chain reads
- verification provider
- contract writes

### 2. MEP-REQ-021 - Collection Import

Objective:

- represent external collections and provider-reported metadata/statistics.

Scope:

- external collection mock data
- origin/provider badges
- collection metrics boundary
- Explorer and collection page display rules

Probable files:

- `types/marketplace.ts`
- `marketplace.mock.js`
- `marketplaceService.ts`
- `CollectionCard.tsx`
- `CollectionsPage.tsx`
- `CollectionDetailPage.tsx`
- `ProductFilters.tsx`
- service tests

Dependencies:

- MEP-REQ-020 contract descriptor boundary

Risks:

- provider metrics treated as verified market data
- external collection appearing native

Tests expected:

- external collection list/detail display
- native vs external origin filtering
- provider-reported metrics labels

Acceptance:

- external collections are visible only with provider, origin, validation status, risk classification, and warnings.

Do not implement:

- external stats fetch
- OpenSea/Rarible/Magic Eden/Harmony calls
- external ranking authority

### 3. MEP-REQ-022 - Wallet Discovery

Objective:

- represent wallet-discovered assets as read-only references.

Scope:

- wallet discovery mock/read-only descriptor
- discovered asset state
- ownership confidence and provenance
- explicit no-custody/no-signature boundary

Probable files:

- `types/marketplace.ts`
- `marketplace.mock.js`
- `marketplaceService.ts`
- `nftOwnershipRuntime.ts`
- `AssetRegistryPanel.tsx`
- `SellerProfilePage.tsx`
- service tests

Dependencies:

- MEP-REQ-020 contract model
- MEP-REQ-021 external collection model

Risks:

- discovered asset interpreted as owned/custodied
- wallet discovery interpreted as wallet signature request

Tests expected:

- discovered asset display state
- ownership truth separation
- no signature/no custody flags

Acceptance:

- wallet-discovered assets remain read-only, non-custodial, non-tradeable references.

Do not implement:

- wallet signatures
- transfer
- custody
- wallet indexing
- live wallet scan

### 4. MEP-REQ-023 - Federation Providers

Objective:

- define provider records and mock capability boundaries.

Scope:

- provider model
- provider capability map
- health and trust state
- provider warnings and limitations
- mock provider registry

Probable files:

- `types/marketplace.ts`
- `marketplace.mock.js`
- `marketplaceService.ts`
- future `federationProviders.ts`
- service tests

Dependencies:

- MEP-REQ-020 through MEP-REQ-022 field requirements

Risks:

- provider treated as source of absolute truth
- accidental external HTTP integration

Tests expected:

- provider registry lists capabilities
- provider execution flags remain false
- provider trust boundaries visible

Acceptance:

- provider records describe capabilities and limits without external network calls.

Do not implement:

- real connectors
- SDKs
- HTTP calls
- env vars
- API keys
- sync jobs

### 5. MEP-PHASE-02-CLOSURE

Objective:

- validate internal/external navigation, labels, warnings, and no-execution boundaries.

Scope:

- QA across Explorer, product detail, collection pages, seller pages, dashboard, asset registry, buy/bid preview, create/sell preview, and legacy item route.

Acceptance:

- internal and external assets are visually distinct
- no external asset is native by implication
- all external assets carry origin, provider, validation, provenance, risk, and trust boundary
- no external trading, settlement, custody, bridge, wallet signature, connector, API key, or external HTTP call exists

## Recommended Phase 02 Definition Of Done

- ExternalAsset model exists in mock-first runtime.
- ExternalCollection model exists in mock-first runtime.
- ExternalContract model exists in mock-first runtime.
- ExternalMetadata model exists in mock-first runtime.
- FederationProvider model exists in mock-first runtime.
- Explorer can distinguish native and federated display records.
- Product Detail displays origin, provider, validation, provenance, risk, and trust boundaries.
- Collection pages distinguish native and external collections.
- Asset Registry displays external contract, metadata, and provider boundaries.
- Wallet-discovered assets are read-only and non-custodial.
- Provider registry is mock-only and has no real connector.
- `canTrade`, `canSettle`, and `canBridge` remain false for federated records.
- No external API, SDK, key, env var, indexer, subgraph, database, queue, cache, bridge, settlement, wallet signature, contract write, or BI pipeline is introduced.

## Phase 02 QA Checklist

- validate native assets still render correctly
- validate external assets render with origin and provider
- validate external collections render with provider-reported metrics label
- validate blocked/quarantined assets do not appear as normal listings
- validate external product detail has no buy/bid execution path
- validate Asset Registry shows trust boundaries
- validate metadata warnings display
- validate provider health and limits display
- validate wallet discovery does not request signature
- validate no new environment variables exist
- validate no external HTTP calls exist
- run lint
- run tests
- run build
- run `git diff --check`
- search for risky activation language

## Validation Performed For MEP-02A

Repository inspection performed with `rg`, `find`, and direct file reads across web runtime, API runtime, instructions, README, and Phase 01 docs.

Terms inspected:

- federation
- external
- provider
- origin
- provenance
- validationStatus
- risk
- trustBoundary
- collection
- contract
- ERC721
- ERC1155
- asset registry
- wallet
- seller
- owner
- license
- OpenSea
- Rarible
- Magic Eden
- Harmony
- adapter
- mock
- read-only
- no settlement
- no contract writes
- no wallet signatures

Risk activation terms inspected:

- real external integration
- production connector
- live OpenSea
- live Rarible
- live Magic Eden
- wallet signature required
- external settlement enabled
- external trading enabled
- bridge execution enabled
- contract write enabled
- custody enabled
- real ownership guarantee

No runtime federation implementation was created by this audit.

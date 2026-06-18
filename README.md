# Axodus Marketplace

Axodus Marketplace is the federated digital distribution infrastructure for the Axodus ecosystem.

Phase 00 â€” Marketplace Architecture Revision is complete as a documentation and architecture phase. Phase 01 â€” NFT Marketplace Consolidation is complete as a mock-first runtime phase with `docs/PHASE_01_RUNTIME_AUDIT.md` as the planning artifact and `docs/PHASE_01_CLOSURE_REPORT.md` as the closure artifact. Phase 02 â€” Federation Layer is complete as a mock-first/read-only federation phase with `docs/PHASE_02_FEDERATION_AUDIT.md` as the boundary audit artifact and `docs/PHASE_02_CLOSURE_REPORT.md` as the closure artifact; it does not activate real external integration. Phase 03 â€” Tenant Infrastructure is complete as a mock/config-first Marketplace-as-a-Service phase with `docs/PHASE_03_TENANT_INFRASTRUCTURE_AUDIT.md` as the isolation audit artifact and `docs/PHASE_03_CLOSURE_REPORT.md` as the closure artifact; it does not activate production multi-tenancy.

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

Phase 00 is documentation-only. Phase 01 activates only mock-first NFT Marketplace runtime surfaces. Phase 02 activates only mock-first/read-only federation representation for External Contracts, External Collections, External Metadata, Wallet Discovery and Federation Providers, including a Contract Import preview at `/marketplace/contracts`. Phase 02 does not activate new backend APIs, contracts, indexers, persistence, GraphQL, real billing, external integrations, tracking, BI, wallet signatures, bridge execution, treasury routing, settlement, custody or on-chain execution.

Phase 03 delivers Tenant Marketplace, Tenant Registry, Tenant Identity, Tenant Configuration, Marketplace Branding, Tenant Domains, Tenant Themes, Tenant Catalog and Tenant Isolation in mock/config-first mode. `MEP-REQ-030` adds the mock/config-first Tenant Registry surface at `/marketplace/tenants` and tenant detail resolution at `/marketplace/tenants/:tenantId`. `MEP-REQ-031` adds mock/config-first Tenant Branding and Tenant Theme display hints for tenant logos, names and colors. `MEP-REQ-032` adds mock/read-only Tenant Domains, tenant aliases and the simulated tenant route `/marketplace/t/:tenantSlug`. `MEP-REQ-033` adds Tenant Catalog, Tenant Catalog Rule, Tenant Exposure Rule and catalog resolution for tenant visible products and collections. Phase 03 does not activate real custom DNS, DNS real, TLS certificates, proxy routing, edge routing, backend routing, subdomain routing, production tenant routing, tenant billing, tenant settlement, tenant treasury routing, tenant revenue sharing, real multi-tenant auth, production RBAC, isolated databases, tracking, BI or separate tenant deploys.

Phase 04 â€” Curated Catalogs is completed and validated with `docs/PHASE_04_CURATED_CATALOGS_AUDIT.md` and `docs/PHASE_04_CLOSURE_REPORT.md` as governance artifacts. `MEP-REQ-040` adds mock/config-first Curated Catalog, Curated Catalog Section, Curated Catalog Item and Curated Catalog Rule surfaces at `/marketplace/curated` and `/marketplace/curated/:catalogId`. `MEP-REQ-041` adds mock/config-first Editorial Rules, Curation Workflow, inclusion/exclusion reasons, review statuses and governance labels. `MEP-REQ-042` adds mock/config-first Featured Catalogs and Catalog Segments for Academy, ACS, Community and Federated catalog grouping. `MEP-REQ-043` integrates Tenant Curated Catalog config, rules and resolution into Tenant Storefront while preserving tenant catalog isolation, branding/theme and mock/read-only routing. Phase 04 does not activate productive approval workflow, compliance real, certification real, AI curation, automated recommendation, real ranking, Marketplace Intelligence, analytics real, automatic segmentation, Distribution Network, Revenue Sharing, billing, settlement, tracking, BI, API, database or provider integrations.

Phase 05 â€” Distribution Network is completed and validated with `docs/PHASE_05_DISTRIBUTION_NETWORK_AUDIT.md` and `docs/PHASE_05_CLOSURE_REPORT.md` as governance artifacts. MEP-05A prepares Distribution Network, Distribution Channel, Distributor, Partner, Agency, Affiliate, Community Marketplace, Attribution Source, Commercial Origin and Distribution Placement concepts. `MEP-REQ-050` adds the mock/config-first Distribution Network and Distribution Channel surfaces at `/marketplace/distribution` and `/marketplace/distribution/:channelId`, including Commercial Origin, Attribution Source, Distribution Source and Placement descriptors. `MEP-REQ-051` adds mock/config-first Distribution Profiles for distributors, partners, agencies, affiliates and community marketplaces at `/marketplace/distribution/profiles` and `/marketplace/distribution/profiles/:profileSlug`. `MEP-REQ-052` adds mock/config-first Attribution Sources, Referral Source mock, Campaign Source mock, Placement Source mock, Attribution Notes and Attribution Context at `/marketplace/distribution/attribution` and `/marketplace/distribution/attribution/:sourceSlug`. `MEP-REQ-053` adds mock/config-first Community Marketplace Distribution at `/marketplace/distribution/communities` and `/marketplace/distribution/communities/:communitySlug`, including community context, rules, items, tenants, curated catalogs, featured catalogs, segments, products, collections and attribution/commercial origin references. `MEP-REQ-054` adds mock/config-first Tenant Distribution Config and Curated Catalog Distribution Config integration in tenant storefront and curated catalog detail surfaces, preserving tenant isolation, branding/theme, simulated domains, editorial rules, featured/segment context and federation boundaries. Phase 05 does not activate governance delegation real, KYC real, partner onboarding real, commercial contract real, tracking real, cookies, analytics tracking, commission tracking, revenue sharing, settlement, billing, payout, commission, Marketplace Intelligence, backend, API, database, analytics or BI. Phase 06 - Revenue Sharing is now completed mock/config-first.

Phase 06 - Revenue Sharing planning is documented in `docs/PHASE_06_REVENUE_SHARING_AUDIT.md`. MEP-06A prepares Revenue Sharing Policy, Revenue Split Rule, Commission Model, Revenue Participant, Participant Share, Revenue Attribution Snapshot, Revenue Sharing Preview, Settlement Boundary, Payout Preview mock, Revenue Sharing Audit Entry and tenant/distribution revenue sharing config concepts. It preserves attribution, commercial origin, tenant isolation, curated catalog rules, distribution context and federation trust boundaries while keeping all revenue sharing mock/config-first. MEP-06A does not activate payout, settlement, billing, invoice, accounting, tax, treasury routing, payment gateway, wallet signature, backend, API, database, analytics tracking, BI or Marketplace Intelligence.

`MEP-REQ-060` adds the mock/config-first Revenue Sharing model and UI surfaces at `/marketplace/revenue-sharing` and `/marketplace/revenue-sharing/:policySlug`. Policies can be listed and opened by id or slug, with participants, split rules, participant shares, settlement boundary, warnings, disclaimers and boundary notes. Revenue Sharing remains preview-only: no payout, settlement, billing, invoice, accounting, tax, treasury routing, payment gateway, wallet signature, backend API, database, analytics tracking, BI or Marketplace Intelligence is activated.

`MEP-REQ-061` adds mock/config-first Commission Models and detailed Participant Shares to the Revenue Sharing surface. Commission models expose simulated Platform Share, Tenant Share, Distributor Share, Partner Share, Affiliate Share, Agency Share, Creator Share and Community Share validation with cap/floor/share-total warnings. Commission Models do not create commission real, obligation financial, payout, settlement, billing, invoice, accounting, tax, treasury routing, split on-chain, payment gateway, backend, database, analytics tracking, BI or Marketplace Intelligence.

`MEP-REQ-062` adds mock/config-first Attribution-to-Split Rules to the Attribution Sources surface. Attribution Split Mapping, Commercial Origin Split Mapping and Distribution Source Split Mapping can suggest simulated participant shares from referral mock, campaign mock, placement mock and community source context. Attribution-to-Split does not activate tracking real, commission tracking, attribution financeira real, payout, settlement, billing, analytics tracking, BI, Marketplace Intelligence, backend, API or database.

`MEP-REQ-063` adds mock/config-first Revenue Sharing Preview, Payout Preview mock, Settlement Preview mock and Revenue Sharing Audit Trail sections to the Revenue Sharing surface. Previews show participant split explanation, rule application explanation and conflict warnings, but do not create payment, payout, settlement, invoice, accounting, tax, treasury routing, payment gateway, wallet signature, backend, database, BI or Marketplace Intelligence.

`MEP-REQ-064` integrates mock/config-first Revenue Sharing into tenant storefront, distribution channel, distribution profile, curated catalog and community distribution surfaces. Tenant Revenue Sharing Config, Distribution Revenue Sharing Config, Curated Catalog Revenue Sharing Config and Community Revenue Sharing Config can resolve policies, commission models, participant shares, attribution-to-split mappings, preview, audit trail and settlement boundaries while preserving tenant isolation, curated catalog editorial rules, distribution boundaries, attribution boundaries and federation trust boundaries. No payout, settlement, billing, invoice, accounting, tax, treasury routing, payment gateway, wallet signature, backend, database, analytics tracking, BI or Marketplace Intelligence is activated.

Phase 06 closure is documented in docs/PHASE_06_CLOSURE_REPORT.md. MEP-PHASE-06-CLOSURE validates Revenue Sharing Policies, Revenue Split Rules, Commission Models, Revenue Participants, Participant Shares, Attribution-to-Split Rules, Revenue Sharing Preview, Payout Preview mock, Settlement Preview mock, Revenue Sharing Audit Trail and tenant/distribution/curated/community revenue sharing integration. Phase 06 remains strictly preview-only and mock/config-first: no payout, no settlement, no billing, no invoice, no accounting, no tax, no treasury routing, no payment gateway, no wallet signature, no backend, no API, no database, no analytics tracking, no BI and no Marketplace Intelligence are activated.

Phase 07 planning is documented in `docs/PHASE_07_MARKETPLACE_INTELLIGENCE_AUDIT.md`. MEP-07A prepares Marketplace Insight, Insight Signal, Intelligence Snapshot, Recommendation Preview, Ranking Explanation, Risk/Trust Insight and Data Boundary concepts over the existing tenant, curated, distribution, attribution, revenue-sharing and federation surfaces. Phase 07 planning remains non-tracking and mock/config-first: no tracking real, no analytics real, no BI, no scoring real, no recommendation engine real, no ranking algorithm real, no personalization, no profiling, no ML/AI runtime, no backend, no API and no database are activated.

Marketplace architecture remains governance-aware, treasury-compatible, operationally transparent, modular, security-first and NFT-foundation preserving.

> Conventions: code in **English**, comments in **English**, env files named `.env-*` (e.g., `.env-web`).  
> Do not commit secrets. Use `.env-*` only locally; CI reads from encrypted secrets.

## Workspaces
- `apps/web` â€“ user-facing app.
- `apps/api` â€“ Marketplace API runtime boundary.
- `apps/indexer` â€“ Marketplace indexer boundary.
- `services/storage` â€“ storage and delivery boundary.
- `services/payments` â€“ future payment gateway boundary.
- `infra` â€“ infrastructure docs and deployment boundary.
- `docs` â€“ architecture & playbooks for each nucleus.

## Quick Start
```bash
./bootstrap_scaffold.sh
# fill .env files as per each README, then:
pnpm -w install
pnpm -w build
```

See also: `docs/ARCHITECTURE.md` for a system-wide overview.

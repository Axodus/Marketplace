# Phase 08 Academy Distribution Audit

Request ID: MEP-08A
Phase: PHASE 08 - ACADEMY DISTRIBUTION
Workspace: Marketplace
Repository: D:\Rede\Github\Axodus\Marketplace
Status: COMPLETED - PLANNING AND LEARNING COMMERCE BOUNDARY AUDIT

## Executive Summary

Phase 08 should introduce Academy Distribution as a mock/config-first planning layer for educational products in the Marketplace. It should represent courses, certifications, learning paths, learning subscriptions, credential previews, certificate/badge mocks and learning access previews without activating LMS real, productive course player, enrollment real, paid access, entitlement productive, progress tracking, learning analytics, credential issuance, credential verification, certificate minting, billing, settlement, payout, payment gateway, backend, API, database or external education platform integration.

MEP-08A is audit and planning only. No Academy Distribution runtime is implemented by this request.

## Current State After Phase 07

Reviewed paths:
- `apps/web/src/data/mock/marketplace.mock.js`
- `apps/web/src/modules/marketplace/types/marketplace.ts`
- `apps/web/src/modules/marketplace/services/marketplaceService.ts`
- `apps/web/src/modules/marketplace/services/marketplaceService.test.ts`
- `apps/web/src/modules/marketplace/hooks/useMarketplace.ts`
- `apps/web/src/modules/marketplace/components`
- `apps/web/src/modules/marketplace/pages`
- `apps/web/src/main.tsx`
- `apps/web/src/components/Layout.tsx`
- `docs/PHASE_07_MARKETPLACE_INTELLIGENCE_AUDIT.md`
- `docs/PHASE_07_CLOSURE_REPORT.md`
- `docs/PHASE_06_CLOSURE_REPORT.md`
- `docs/PHASE_05_CLOSURE_REPORT.md`
- `docs/PHASE_04_CLOSURE_REPORT.md`
- `docs/PHASE_03_CLOSURE_REPORT.md`
- `.instructions/ARCHITECTURE.md`
- `.instructions/ROADMAP.md`
- `.instructions/DECISIONS.md`
- `.instructions/PRODUCTS.md`
- `.instructions/WORKFLOW.md`
- `.instructions/TASKS.md`
- `README.md`

Findings:
- The listed Marketplace source and documentation paths exist.
- `components` and `pages` are directories.
- No dedicated Academy Distribution route, runtime type, mock collection, service helper or hook exists yet.
- Existing Academy references are contextual labels in curated catalogs, catalog segments, distribution channels/profiles, tenant contexts, revenue sharing previews and Marketplace Intelligence.

## Existing Context Maps

Tenants and tenant contexts:
- Existing tenant registry, tenant detail, simulated tenant route and tenant storefront can host future academy context.
- Future use: academy tenant storefronts, provider labels, tenant-visible course previews, tenant learning subscription previews.
- Boundary: tenant context must not imply LMS tenancy, student records, learner RBAC, paid access or education database isolation.

Curated catalogs, featured catalogs and segments:
- Existing curated catalogs, editorial rules, featured catalogs and catalog segments can group education products.
- Future use: courses catalog, certifications catalog, course bundles, certification bundles and academy catalog segment cards.
- Boundary: curated placement must not imply enrollment, completion, certification, compliance, ranking real or recommendation engine.

Distribution channels, profiles and attribution sources:
- Existing distribution channels, profiles, community distribution and attribution sources can label academy discovery context.
- Future use: academy distribution channel, provider/profile labels, community education distribution, referral/campaign/placement mock context.
- Boundary: distribution context must not become education tracking, student tracking, paid enrollment attribution, affiliate tracking or commission tracking.

Revenue sharing policies and preview data:
- Existing Phase 06 revenue sharing previews can be referenced by course, certification or learning subscription previews.
- Boundary: academy revenue sharing must remain preview-only with no payout, no settlement, no billing, no invoice, no accounting, no tax, no treasury routing, no payment gateway and no wallet signature.

Marketplace Intelligence and Data Boundaries:
- Existing Phase 07 intelligence snapshots, panels, recommendation previews, ranking explanations and data boundaries can provide static academy summaries.
- Boundary: academy intelligence must not become learning analytics real, learner profiling, student behavior tracking, educational personalization, scoring, recommendation engine, automated ranking, BI, ML model, AI runtime or automated decisioning.

Federation and trust context:
- Existing federation surfaces preserve origin, provider, validation status, provenance, risk classification and trust boundaries.
- Boundary: external education content is not native Axodus content, not a verified credential and not productive entitlement without future explicit validation.

## Concept Differences

Academy Distribution:
- Marketplace representation of education products, previews and access context.
- Mock/config-first and non-executing during Phase 08.

LMS real:
- Productive learning system with player, learner accounts, progress, completion, assessments and learning records.
- Not part of Phase 08.

Credentialing real:
- Issuance or verification of credentials, certificates, badges, QR checks, on-chain minting, wallet signatures or registry validation.
- Not part of Phase 08.

Subscription billing real:
- Production charging, invoices, tax, accounting, payment gateway, settlement, payout or treasury routing.
- Not part of Phase 08.

Enterprise provisioning:
- Production education procurement, seat provisioning, enterprise access, contractual learning programs or managed customer onboarding.
- Not part of Phase 08.

## Conceptual Models And Minimum Fields

### AcademyProduct

Generic wrapper for course, certification, learning-path, learning-subscription, course-bundle, certification-bundle or academy-pass previews.

Minimum fields: `id`, `slug`, `title`, `description`, `academyProductType`, `status`, `visibility`, `tenantId`, `providerId`, `curatedCatalogId`, `catalogSegmentId`, `distributionChannelId`, `distributionProfileId`, `communityDistributionId`, `revenueSharingPolicyId`, `intelligenceInsightIds`, `dataBoundaryId`, `accessPreviewId`, `isSimulated`, `canEnroll`, `canStartLearning`, `canTrackProgress`, `canIssueCredential`, `canVerifyCredential`, `canBill`, `canSettle`, `canTriggerPayout`, `warnings`, `disclaimers`, `createdAt`, `updatedAt`.

### Course

Mock course descriptor with metadata, level, duration, language, provider, instructor, modules, lessons and learning path references.

Minimum fields: `id`, `slug`, `title`, `description`, `courseType`, `status`, `level`, `durationLabel`, `languageLabel`, `providerLabel`, `instructorLabel`, `moduleIds`, `lessonIds`, `learningPathIds`, `tenantId`, `curatedCatalogId`, `distributionChannelId`, `accessPreviewId`, `revenueSharingPolicyId`, `intelligenceSnapshotId`, `dataBoundaryId`, `isSimulated`, `hasRealPlayer`, `canEnroll`, `canStartLearning`, `canTrackProgress`, `canRecordCompletion`, `warnings`, `disclaimers`.

### CourseModule

Static grouping inside a course preview.

Minimum fields: `id`, `courseId`, `title`, `description`, `order`, `lessonIds`, `durationLabel`, `isSimulated`, `hasRealPlayer`, `canTrackProgress`, `warnings`, `disclaimers`.

### Lesson

Static lesson descriptor without media playback or completion tracking.

Minimum fields: `id`, `courseId`, `moduleId`, `title`, `description`, `lessonType`, `durationLabel`, `order`, `previewLabel`, `isSimulated`, `hasRealPlayer`, `canStartLearning`, `canTrackProgress`, `canRecordCompletion`, `warnings`, `disclaimers`.

### LearningPath

Static sequence of courses and certifications for discovery.

Minimum fields: `id`, `slug`, `title`, `description`, `courseIds`, `certificationIds`, `status`, `level`, `providerLabel`, `tenantId`, `curatedCatalogId`, `accessPreviewId`, `intelligenceSnapshotId`, `dataBoundaryId`, `isSimulated`, `canEnroll`, `canTrackProgress`, `canRecordCompletion`, `warnings`, `disclaimers`.

### Certification

Mock certification descriptor with issuer, requirements, eligibility preview, credential preview and certificate/badge mock references.

Minimum fields: `id`, `slug`, `title`, `description`, `certificationType`, `status`, `issuerLabel`, `validityLabel`, `requirementIds`, `credentialPreviewId`, `certificateBadgeMockId`, `tenantId`, `curatedCatalogId`, `distributionChannelId`, `revenueSharingPolicyId`, `intelligenceSnapshotId`, `dataBoundaryId`, `isSimulated`, `canIssueCredential`, `canVerifyCredential`, `canMintOnChain`, `canSignCredential`, `canRecordAssessment`, `warnings`, `disclaimers`.

### CertificationRequirement

Static requirement descriptor for certification preview.

Minimum fields: `id`, `certificationId`, `requirementType`, `title`, `description`, `status`, `isSimulated`, `canRecordAssessment`, `canVerifyCompletion`, `warnings`, `disclaimers`.

### CredentialPreview

Non-verifiable credential preview.

Minimum fields: `id`, `certificationId`, `credentialLabel`, `issuerLabel`, `validityLabel`, `verificationLabel`, `status`, `isSimulated`, `canIssueCredential`, `canVerifyCredential`, `canMintOnChain`, `canSignCredential`, `externalRegistryId`, `warnings`, `disclaimers`.

### CertificateBadgeMock

Visual or textual certificate/badge placeholder. It is not a real certificate, not a verifiable badge and not a credential.

Minimum fields: `id`, `certificationId`, `badgeLabel`, `certificateLabel`, `displayStatus`, `isSimulated`, `isVerifiable`, `canMintOnChain`, `canSignCredential`, `warnings`, `disclaimers`.

### LearningSubscription

Preview-only learning plan descriptor with included courses and certifications.

Minimum fields: `id`, `slug`, `name`, `description`, `status`, `tierIds`, `tenantId`, `curatedCatalogId`, `distributionChannelId`, `includedCourseIds`, `includedCertificationIds`, `accessPreviewId`, `revenueSharingPolicyId`, `intelligenceSnapshotId`, `dataBoundaryId`, `isSimulated`, `canBill`, `canInvoice`, `canChargePayment`, `canGrantEntitlement`, `canSettle`, `canTriggerPayout`, `warnings`, `disclaimers`.

### LearningSubscriptionTier

Static subscription tier descriptor.

Minimum fields: `id`, `subscriptionId`, `name`, `description`, `tierLevel`, `includedCourseIds`, `includedCertificationIds`, `accessPreviewId`, `isSimulated`, `canBill`, `canGrantEntitlement`, `warnings`, `disclaimers`.

### LearningAccessPreview

Preview-only access descriptor. It must not grant access, start learning, track progress or create entitlement.

Minimum fields: `id`, `scope`, `scopeId`, `status`, `accessLabel`, `includedCourseIds`, `includedCertificationIds`, `includedLearningPathIds`, `isSimulated`, `canGrantAccess`, `canStartLearning`, `canTrackProgress`, `canRecordCompletion`, `canIssueCredential`, `canBill`, `warnings`, `disclaimers`.

### AcademyDistributionContext

Connector between academy products and tenant, curated, distribution, revenue sharing, intelligence and federation boundaries.

Minimum fields: `id`, `contextType`, `academyProductId`, `courseId`, `certificationId`, `learningSubscriptionId`, `tenantId`, `curatedCatalogId`, `catalogSegmentId`, `distributionChannelId`, `distributionProfileId`, `communityDistributionId`, `attributionSourceId`, `revenueSharingPolicyId`, `intelligenceSnapshotId`, `dataBoundaryId`, `federationProviderId`, `isSimulated`, `warnings`, `disclaimers`.

### AcademyDataBoundary

Explicit educational data boundary.

Minimum fields: `id`, `scope`, `scopeId`, `status`, `boundaryLabel`, `isSimulated`, `usesLms`, `usesRealPlayer`, `usesProgressTracking`, `usesLearningAnalytics`, `usesAssessment`, `usesCredentialIssuance`, `usesCredentialVerification`, `usesBilling`, `usesEntitlement`, `usesExternalEducationPlatform`, `warnings`, `disclaimers`.

### AcademyIntelligenceSummary

Static summary over mock/config records only. It cannot become learning analytics.

Minimum fields: `id`, `scope`, `scopeId`, `title`, `summary`, `insightSignalIds`, `intelligenceSnapshotId`, `dataBoundaryId`, `isSimulated`, `usesLearningAnalytics`, `usesPersonalization`, `usesProfiling`, `usesRecommendationEngine`, `usesAutomatedDecisioning`, `warnings`, `disclaimers`.

## Initial Taxonomies

Academy product types: `course`, `certification`, `learning-path`, `learning-subscription`, `course-bundle`, `certification-bundle`, `academy-pass`, `demo`.

Course types: `self-paced-mock`, `cohort-mock`, `workshop-mock`, `masterclass-mock`, `learning-path-mock`, `micro-course-mock`, `demo`.

Course statuses: `draft`, `configured-mock`, `preview-only`, `active-mock`, `review-required`, `restricted`, `disabled`, `archived`.

Certification statuses: `draft`, `configured-mock`, `preview-only`, `eligibility-preview`, `issuer-review`, `restricted`, `disabled`, `archived`.

Learning subscription statuses: `draft`, `configured-mock`, `preview-only`, `active-mock`, `restricted`, `disabled`, `archived`.

Access preview statuses: `preview-only`, `not-enrollable`, `restricted`, `disabled`, `requires-manual-review`, `not-configured`.

Academy data boundary statuses: `mock-only`, `static-only`, `no-lms`, `no-progress-tracking`, `no-learning-analytics`, `no-credential-issuance`, `no-credential-verification`, `no-billing`, `no-entitlement`, `restricted`, `blocked`, `review-required`.

## Mandatory Phase 08 Defaults

During Phase 08:
- `isSimulated` must be true.
- `hasRealPlayer` must remain false.
- `canEnroll` must remain false or preview-only.
- `canStartLearning` must remain false or preview-only.
- `canTrackProgress` must remain false.
- `canRecordCompletion` must remain false.
- `canIssueCredential` must remain false.
- `canVerifyCredential` must remain false.
- `canMintOnChain` must remain false.
- `canSignCredential` must remain false.
- `canRecordAssessment` must remain false.
- `canBill` must remain false.
- `canInvoice` must remain false.
- `canChargePayment` must remain false.
- `canGrantEntitlement` must remain false.
- `canSettle` must remain false.
- `canTriggerPayout` must remain false.

## Boundaries

Learning commerce boundaries:
- Academy products are marketplace representations only.
- Course, certification and learning subscription cards must not imply real purchase, real access, real enrollment, course start, completion, credential eligibility or educational service delivery.

LMS boundaries:
- No LMS real, productive course player, lesson playback, SCORM/xAPI integration, classroom management, student account management or external education platform integration.

Credential boundaries:
- Credential Preview mock and Certificate/Badge mock are non-verifiable.
- No credential issuance, credential verification, QR validation, wallet signature, mint or external registry.

Assessment boundaries:
- Certification requirements are mock only.
- No assessment real, exam real, grade real, completion real, eligibility real or compliance claim real.

Access/entitlement boundaries:
- Learning Access Preview must not grant access, unlock paid content, mutate entitlements, start subscriptions, create licenses or authorize content delivery.

Subscription/billing boundaries:
- Learning subscriptions are preview-only.
- No billing real, invoice real, accounting, tax, payment gateway, settlement, payout or treasury routing.

Tracking/analytics boundaries:
- No progress tracking, learning analytics, learner profiling, student behavior tracking, wallet tracking, personalization, educational recommendation engine, automated ranking, BI, ML model, AI runtime or event pipeline.

Revenue sharing boundaries:
- Academy context can reference Phase 06 revenue sharing previews only.
- Preserve preview-only, no payout, no settlement, no billing, no invoice, no accounting, no tax, no treasury routing, no payment gateway and no wallet signature.

Intelligence boundaries:
- Academy intelligence can be a static summary over mock/config records only.
- No learning analytics real, BI, scoring, recommendation engine, personalization, profiling or automated decisioning.

Trust boundaries:
- Federated or external academy references must preserve origin, provider, validation status, provenance, risk classification, trust boundaries and read-only/non-executing status.

## Impacted Pages And Future Entry Points

Existing pages to evaluate:
- Layout/navigation
- Marketplace home or overview
- Marketplace Explorer
- Tenant storefront
- Tenant detail
- Curated Catalogs
- Featured Catalogs
- Catalog Segments
- Distribution Channels
- Distribution Profiles
- Community Marketplace Distribution
- Attribution Sources
- Revenue Sharing Policies
- Marketplace Intelligence
- Product detail
- Collection detail
- Seller Profile
- Asset Registry Panel
- Create/Sell Preview
- Buy-now modal
- Bid modal
- Marketplace Dashboard

New surfaces to evaluate:
- Academy Home
- Courses Catalog
- Course Detail
- Certifications Catalog
- Certification Detail
- Learning Subscriptions
- Learning Subscription Detail
- Academy Provider/Profile
- Academy Access Preview
- Academy Intelligence Panel

Required badges and labels:
- `mock academy`
- `config-first academy`
- `no LMS`
- `no course player`
- `no enrollment real`
- `no progress tracking`
- `no learning analytics`
- `no credential issuance`
- `no credential verification`
- `no billing`
- `no entitlement`
- `no settlement`

## Gaps For Phase 08 Requests

MEP-REQ-080 - Courses:
- Need Academy Product, Course, Course Module, Lesson, Learning Path, Course Access Preview, Academy Distribution Context and Academy Data Boundary.
- Need route/page decisions for Academy Home, Courses Catalog and Course Detail.
- Need helpers, hooks and tests for course listing/detail and disabled execution flags.

MEP-REQ-081 - Certifications:
- Need Certification, Certification Requirement, Eligibility Preview, Credential Preview mock and Certificate/Badge mock.
- Need route/page decisions for Certification Catalog and Certification Detail.
- Need helpers, hooks and tests proving no credential issuance, verification, mint, wallet signature, QR validation or assessment real.

MEP-REQ-082 - Learning Subscriptions:
- Need Learning Subscription, Learning Subscription Tier and Learning Access Preview.
- Need route/page decisions for Learning Subscriptions and Learning Subscription Detail.
- Need helpers, hooks and tests proving no billing, invoice, payment gateway, productive entitlement, settlement or payout.

Shared gaps:
- No academy-specific service helpers.
- No academy-specific hooks.
- No academy-specific tests.
- No academy-specific navigation.
- No academy-specific restricted/disabled empty states.

## Risks

UI/UX risks:
- Course cards may look enrollable unless badges and copy clearly say preview-only.
- Certification visuals may be mistaken for real credentials.
- Learning subscriptions may be mistaken for paid plans.
- Existing entitlement pages may make learning access look productive.

Access risks:
- Learning Access Preview can be confused with entitlement productive.
- "Start learning" copy can imply a player exists.
- Buy-now surfaces can imply paid course access.

Certification and credentialing risks:
- Badge mock can be mistaken for a verifiable badge.
- Credential Preview can be mistaken for issued certificate.
- Issuer labels can be mistaken for credential authority.
- Validity labels can be mistaken for compliance or accreditation.

Billing and subscription risks:
- Learning Subscription can be mistaken for billing real.
- Revenue sharing preview can be mistaken for payout or settlement.

Tracking and analytics risks:
- Course progress and completion copy can imply learner tracking.
- Academy intelligence can be mistaken for learning analytics or student profiling.
- Recommendation preview can be mistaken for an educational recommendation engine.

Compliance risks:
- Certification and requirement labels can imply regulated education, accreditation or compliance claims.
- External academy providers can imply verified external content unless provenance and trust boundaries are visible.

Scope risks:
- Phase 08 can drift into Enterprise Marketplace, ACS Distribution, Billing runtime, LMS integration or credentialing.
- Keep Phase 09 and Phase 10 future.

## Recommended Implementation Sequence

1. MEP-REQ-080 - Courses
   - Add Academy Product, Course, Course Module, Lesson, Learning Path, Course Access Preview, Academy Distribution Context and Academy Data Boundary in mock/config-first mode.
   - Integrate with tenant, curated, distribution, revenue sharing preview and intelligence context without LMS or progress tracking.

2. MEP-REQ-081 - Certifications
   - Add Certification, Certification Requirement, Eligibility Preview, Credential Preview mock and Certificate/Badge mock.
   - Preserve no credential issuance, no credential verification, no wallet signature, no mint, no QR verification and no assessment real.

3. MEP-REQ-082 - Learning Subscriptions
   - Add Learning Subscription, Learning Subscription Tier and Learning Access Preview.
   - Preserve no billing, no invoice, no payment gateway, no entitlement productive, no settlement and no payout.

4. MEP-PHASE-08-CLOSURE - QA, navigation and Academy Distribution boundary validation
   - Validate all Academy Distribution surfaces, no-LMS/no-credential/no-billing/no-entitlement boundaries, tests, lint, build, diff checks and boundary scans.

## Recommended Definition Of Done

Phase 08 can close when:
- Academy Product exists in mock/config-first mode.
- Courses, modules, lessons and learning paths exist as static/mock previews.
- Certifications, requirements, credential previews and certificate/badge mocks exist without issuance or verification.
- Learning subscriptions and learning access previews exist without billing or entitlement.
- Academy Data Boundaries are visible on all academy surfaces.
- Tenant, curated catalog, distribution, revenue sharing preview, intelligence and federation integrations preserve existing boundaries.
- UI labels make no-LMS, no-progress-tracking, no-learning-analytics, no-credential-real, no-billing and no-entitlement explicit.
- Tests cover helpers, disabled execution flags, empty states and restricted/disabled records.
- `pnpm --dir apps/web lint`, `pnpm --dir apps/web test`, `pnpm --dir apps/web build`, `git diff --check` and boundary scans pass.

## Future QA Checklist

- Confirm Courses Catalog and Course Detail render mock/config-first records.
- Confirm Course Module and Lesson records do not expose player execution.
- Confirm Learning Path is static and does not track progress.
- Confirm Certification Catalog and Detail render mock certification records.
- Confirm Credential Preview and Certificate/Badge mock cannot verify, mint or sign.
- Confirm Learning Subscription pages show preview-only and no billing.
- Confirm Learning Access Preview does not grant entitlement or start learning.
- Confirm tenant, curated, distribution, community, attribution, revenue sharing and intelligence contexts are preserved.
- Confirm federation context preserves origin, provider, validation status, provenance, risk classification and trust boundaries.
- Confirm no LMS real, course player, enrollment real, paid access, entitlement productive, progress tracking, learning analytics, assessment, exam, grade, credential issuance, credential verification, billing, invoice, tax, accounting, payment gateway, settlement, payout, treasury routing, backend, API, database, wallet signature or external integration is introduced.

## Validation Notes

Repository inspection confirmed that MEP-08A is documentation-only. No runtime Academy Distribution files were created.

Relevant future package scripts:
- `pnpm --dir apps/web lint`
- `pnpm --dir apps/web test`
- `pnpm --dir apps/web build`

MEP-08A text validation should search for:
- `Academy Distribution`
- `Academy Product`
- `Course`
- `Course Module`
- `Lesson`
- `Learning Path`
- `Certification`
- `Certification Requirement`
- `Credential Preview`
- `Certificate Badge mock`
- `Learning Subscription`
- `Learning Access Preview`
- `Academy Data Boundary`
- `mock academy`
- `config-first academy`
- `no LMS`
- `no progress tracking`
- `no learning analytics`
- `no credential issuance`
- `no credential verification`
- `no billing`
- `no entitlement`
- `no settlement`

Risk scans should verify that terms such as `LMS enabled`, `course player enabled`, `enrollment enabled`, `paid access enabled`, `entitlement enabled`, `progress tracking enabled`, `learning analytics enabled`, `assessment enabled`, `exam enabled`, `grade enabled`, `credential issuance enabled`, `credential verification enabled`, `certificate mint enabled`, `wallet signature enabled`, `billing enabled`, `payment gateway enabled`, `settlement enabled` and `payout enabled` only appear in validation or boundary contexts.

## Conclusion

Phase 08 is ready for controlled implementation planning. The next request should be MEP-REQ-080 - Courses, and it should remain mock/config-first with no LMS, no course player, no enrollment real, no paid access, no entitlement productive, no progress tracking, no learning analytics, no credential issuance, no credential verification, no billing, no settlement and no external education integration.

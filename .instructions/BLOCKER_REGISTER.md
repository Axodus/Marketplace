# Marketplace Blocker Register

Last updated: 2026-09-06

## MARKETPLACE-BLOCKER-001 — External Payment Execution Not Approved

Severity: HIGH

Status: OPEN

Real payment gateway execution remains outside the approved runtime boundary.

## MARKETPLACE-BLOCKER-002 — External Value Transfer And Settlement Not Approved

Severity: HIGH

Status: OPEN

Wallet transactions, blockchain writes, external treasury movement, external bridge execution and production settlement remain disabled. Local controlled runtime records do not remove this block.

## MARKETPLACE-BLOCKER-003 — Current Validation Refresh Required

Severity: MEDIUM

Status: RESOLVED

The historical validation refresh was completed by PORTFOLIO-REQ-02. Validation was refreshed again on 2026-09-06; the newly observed test failure is tracked separately below.

## MARKETPLACE-BLOCKER-004 — ProductCard Test Suite Not Green

Severity: MEDIUM

Status: OPEN

One web test fails because the missing-seller fallback expectation conflicts with collection-first rendering. Current result: 182 passing, 1 failing test.

Resolution path: decide the intended UI fallback priority and align the component and test.

## MARKETPLACE-BLOCKER-005 — Documentation Lifecycle Is Inconsistent

Severity: MEDIUM

Status: OPEN

Phase closure reports stop at Phase 11, while `TASKS.md` records later runtime sprints with terms such as settlement activation and treasury execution. Those source features are local controlled workflows with external execution disabled, but the documentation does not consistently state that distinction.

Resolution path: consolidate the task register, add closure or readiness artifacts for later sprints, and use one controlled-runtime vocabulary.

## MARKETPLACE-BLOCKER-006 — Validation And CI Scope Is Incomplete

Severity: MEDIUM

Status: OPEN

The root workspace checks do not validate the standalone `public/` Next.js site. The committed GitHub Actions workflow covers contracts only and is not configured for the active `dev` branch.

Resolution path: add application workflows and an independent validation command for `public/`.

## MARKETPLACE-OBSERVATION-001 — Web Entry Bundle Size

Severity: LOW

Status: OPEN

The web production build passes but reports a 782.72 kB minified main JavaScript chunk.

Resolution path: review dynamic imports and Rollup manual chunking during runtime hardening.

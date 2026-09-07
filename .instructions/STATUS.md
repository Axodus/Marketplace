# Marketplace Development Status

Last updated: 2026-09-06

## Current State

**Development maturity: L4 Consolidated, with an open validation regression.**

Production readiness: NO.

Review baseline: local commit `b841419` (2026-07-28). Remote state was not fetched or deployment-verified.

Context: `.instructions/`, `docs/`, phase audit/closure artifacts, `TASKS.md`, `ROADMAP.md` and local source/history. No `.rag/` or separate `plans/` directory was found in this checkout; planning context comes from the roadmap, task register and phase audits.

Marketplace is a hybrid local-development nucleus:

- `apps/web` provides the Marketplace frontend, with 38 Marketplace page modules, 19 component-directory files (including 2 test files), 6 hook modules and centralized mock/config-first domain data.
- `apps/api` provides a TypeScript HTTP runtime with file-backed local persistence at `apps/api/.runtime/marketplace-store.json`.
- The API includes controlled local workflow records for settlement, royalty allocation, auction handling, treasury routing and cross-chain preparation. These records do not execute external transfers.
- `public/` is a separate Next.js institutional website and is not included in the root PNPM workspace validation.

Phase 00 through Phase 11 remain closed as documented. The separately numbered runtime sprints recorded in `TASKS.md` also have corresponding API source, including sprints 31–35. Their numbering does not establish that they occurred after Phase 11. No separate closure reports for those sprints were found in `docs/`; treat them as controlled local runtime work.

July development added the institutional website, branding assets, a frontend navigation/theme/card/filter refactor (`394ff6f`) and build corrections (`b841419`).

## Execution Boundary

The runtime explicitly keeps these capabilities disabled:

- external payment processing
- wallet transaction execution
- blockchain writes
- external treasury movement
- external bridge messaging and execution
- production settlement

The labels `confirmed`, `executed` and `bridged` in local records describe controlled in-process state transitions only. They do not evidence money movement, custody, settlement finality or on-chain execution.

## Validation Evidence — 2026-09-06

| Check | Result | Evidence |
|---|---|---|
| Root lint | PASS | `pnpm -r lint` passed for `apps/api` and `apps/web`. |
| API tests | PASS | 2 files, 57 tests. |
| Web tests | FAIL | 12 files passed; 1 test failed. Total: 125 passed, 1 failed. |
| Root build | PASS | TypeScript API build and Vite web build passed. |
| Build packaging | WARNING | Vite reports a 782.72 kB minified main JavaScript chunk. |

The failing test is `apps/web/src/modules/marketplace/components/ProductCard.test.tsx`: the missing-seller case expects `Marketplace seller unavailable`, but a linked collection name is rendered first. This is a test/behavior mismatch that needs an explicit product-card fallback decision.

## Current Constraints And Risks

- Automated checks do not yet pass completely because of the ProductCard test failure.
- Root validation excludes the standalone Next.js site under `public/`.
- The GitHub Actions workflow currently covers contracts only and targets `main` and `develop`, while this checkout is on `dev`.
- Legacy entries in `TASKS.md` conflict with the phase-closure model and should be normalized before a new implementation cycle.

## Working Tree

Branch: `dev` tracking `origin/dev`.

No tracked source changes were present at review time. `.codex/` is the only untracked local directory.

## Next Recommended Request

`MARKETPLACE-REQ-03 — Runtime Hardening and Status Reconciliation`

1. Resolve the ProductCard fallback expectation and restore a green test suite.
2. Add route smoke coverage for the Marketplace surfaces and validate `public/` independently.
3. Split or manually chunk the large web entry bundle.
4. Reconcile `TASKS.md`, phase closures and runtime terminology so controlled local records cannot be read as production execution.
5. Add CI coverage for the active branch and the application packages.

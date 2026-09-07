# Marketplace Validation

Last updated: 2026-09-06

## Commands

```bash
pnpm -r lint
pnpm -r test
pnpm -r build
```

## Latest Results

| Command | Result | Notes |
|---|---|---|
| `pnpm -r lint` | PASS | `apps/api` TypeScript validation and `apps/web` ESLint passed. |
| `pnpm -r test` | FAIL | API: 57/57 passing. Web: 125/126 passing. |
| `pnpm -r build` | PASS | API TypeScript and Vite builds passed. |

## Open Test Failure

`apps/web/src/modules/marketplace/components/ProductCard.test.tsx` expects the text `Marketplace seller unavailable` when no seller is supplied. The fixture still resolves to a collection, and `ProductCard` renders that collection link first.

Resolve the intended fallback priority, then update either the component or the test. Do not record the suite as fully passing until this check succeeds.

## Build Observation

The Vite build produces a 782.72 kB minified main JavaScript chunk and emits the standard chunk-size warning. The build succeeds, but the bundle should be split before a production-readiness review.

## Scope Gap

The root PNPM workspace includes `apps/api` and `apps/web` as runnable packages. The standalone Next.js application under `public/` has its own `package.json` and must be validated separately.

## Execution Boundary Verification

The API envelope and runtime records retain `settlementEnabled: false`, `walletExecutionEnabled: false` and `blockchainWritesEnabled: false` for external execution. Local runtime transition labels are not evidence of external settlement or value transfer.

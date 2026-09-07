# Repository Guidelines

## Project Structure & Module Organization

This is a pnpm monorepo for Axodus Marketplace. `apps/web` is the Vite/React client; organize marketplace UI under `src/modules/marketplace/`, shared pages in `src/pages/`, and cross-cutting services in `src/services/`. `apps/api` is the Node/TypeScript API boundary, with domain modules in `src/modules/`. `apps/indexer`, `services/storage`, and `services/payments` hold integration boundaries. `infra/` and `docs/` contain deployment and architecture material. `public/` is a separate Next.js site and is not part of the root pnpm workspace.

## Build, Test, and Development Commands

- `pnpm dev` — start workspace development processes in parallel.
- `pnpm build`, `pnpm lint`, `pnpm test` — recursively build, type/lint-check, or run test scripts for all workspaces.
- `pnpm --filter @axodus/marketplace-web dev` — run only the web app; replace `dev` with `test` or `lint` for focused validation.
- `pnpm --filter @axodus/marketplace-api dev` — run the API locally (default port 4000).
- `npm --prefix public run dev` or `npm --prefix public run build` — run or build the standalone Next.js site.

Use Node 18+ and pnpm 8+; the repository pins pnpm 10.15.1.

## Coding Style & Naming Conventions

Write code and comments in English. TypeScript is strict; keep types explicit at module boundaries. Follow the existing two-space indentation, double quotes, and semicolons. Name React components and exported types in `PascalCase`, hooks as `useThing`, and services/functions in `camelCase`. Use `*.test.ts` or `*.test.tsx` beside the code under test. Run ESLint for web changes; API `lint` performs a no-emit TypeScript check.

## Testing Guidelines

Vitest is used by the web and API packages. Add focused tests for changed behavior, including error and boundary cases. Run the relevant package test command before the root suite, then run `pnpm test` when the change crosses workspace boundaries.

## Commits, Pull Requests, and Safety

Recent history commonly uses `marketplace: <imperative summary>` and scoped Conventional Commit forms such as `feat(marketplace): ...`; use one of these concise patterns. PRs should state the user-visible change, link the issue when available, list validation commands, and include screenshots for UI changes.

Do not commit secrets; use local `.env-*` files. Treat payments, wallet actions, blockchain writes, settlement, and external integrations as simulated or disabled unless an approved task explicitly enables them.

## AXODUS_WORKSPACE_COORDINATION

This workspace is part of the federated Axodus portfolio. Read the root
[`AGENTS.md`](../AGENTS.md) and the
[Agent Coordination Protocol](../.instructions/AGENT_COORDINATION_PROTOCOL.md) before starting work.

Keep this file's local rules authoritative for this repository. For every
completed or materially blocked task, provide the required **Global Coordination
Handoff**: workspace, scope, local status, validation, local records changed,
dependencies, blockers or risks, priority impact, requested portfolio action,
and preserved boundaries.

Update this repository's existing local status, roadmap, task, validation,
blocker, or report records when the authorized task requires it. Do not edit
root portfolio records directly; the root Axodus orchestrator consolidates
validated handoffs into global status, priorities, blockers, dependencies, and
reports.

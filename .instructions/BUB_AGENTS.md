# BUB_AGENTS.md

Operational guidance for using bub-agents inside the Marketplace workspace.

## Purpose

Bub-agents are advisory execution-support agents for planning, architecture review, security review, QA, documentation, and implementation analysis. They do not override the latest user instruction, this workspace `.instructions`, repository reality, security constraints, or Axodus architecture principles.

The Coding Execution Agent remains responsible for final decisions, edits, validation, commit, and report.

## Workspace Context

Workspace: `Marketplace`

Repository root: `/mnt/d/Rede/Github/Axodus/Marketplace`

Primary responsibility: product catalog, offers, orders, subscriptions, licenses, entitlements, checkout simulation, billing mock, and product access.

## When To Use Bub-Agents

Use bub-agents for multi-file changes, marketplace architecture, entitlement/access flows, checkout/order/billing changes, API/service behavior, security-sensitive user data, test planning, documentation updates, or sprint-level execution.

Do not use bub-agents for typo fixes, simple text changes, trivial imports, isolated formatting, or obvious one-line fixes.

## Roles

- Planner: task decomposition, affected files, execution order, risks, acceptance criteria.
- Architect: product/order/license/entitlement boundaries.
- Backend: routes, services, validation, persistence, errors.
- Frontend: catalog, checkout, subscription, entitlement UI.
- Web3: payment/wallet boundaries if present.
- Security: access, user data, secrets, unsafe assumptions.
- QA: checkout, entitlement, order, subscription edge cases.
- Documentation: `.instructions`, README, decisions, workflow, readiness notes.

## Delegation Template

```md
# Bub-Agent Task
Role:
Workspace: Marketplace
Repository: /mnt/d/Rede/Github/Axodus/Marketplace
Task:
Relevant context:
Expected output:
- findings
- risks
- affected files
- recommended steps
- acceptance criteria
Constraints:
- Follow workspace `.instructions`.
- Keep product access, billing, and entitlement concepts separated.
- Mark uncertainty clearly.
```

## Workspace-Specific Rules

- Product access must be modeled through licenses, entitlements, subscriptions, or explicit access records.
- Checkout flows must remain mock/simulated unless explicitly instructed.
- Billing, orders, subscriptions, invoices, licenses, and entitlements must be separated.
- Governance standing and ACS access should be considered before enabling restricted product access.
- Core does not own listings, purchases, subscriptions, product access runtime, or marketplace execution.
- Do not hardcode production prices, payment credentials, product rights, or user entitlements.
- Mock commerce data must be clearly marked as mock.

## Conflict Resolution

Resolve conflicts in this order: latest user instruction, workspace `.instructions`, repository architecture, security requirements, smallest safe change, maintainability, bub-agent recommendation.

If unresolved, stop and report the blocker.

## Final Report

State whether bub-agents were used, roles used, key findings, accepted recommendations, rejected recommendations, tests run, and remaining risks.

## Commit Behavior

When a sprint is completed, run practical validation, check `git status`, commit the completed sprint, and report the commit hash.

Recommended commit format: `marketplace: <short description>`


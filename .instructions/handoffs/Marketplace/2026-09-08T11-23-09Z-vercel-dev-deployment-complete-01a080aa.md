# Global Coordination Handoff

- Workspace: `Marketplace`
- Handoff ID / time: `01a080aa-fe51-7313-97bd-473f449c463f / 2026-09-08T11:27:39Z`
- Request / branch / HEAD: `Configure Vercel dev frontend deployment / dev / 0f95969c870b941fd9492cd80de5b6f69be7c202`
- Scope: `COMPLETE: add root-level Vercel configuration that uses PNPM 10.15.1, builds apps/web, publishes apps/web/dist, and preserves client-side routes through index.html.`
- Local status: `LOCAL_VALIDATED`
- Validation: `pnpm install --frozen-lockfile passed; pnpm --filter @axodus/marketplace-web build passed; apps/web/dist/index.html generated. Existing Vite 782.72 kB entry-chunk warning remains.`
- Changed local records: `vercel.json; .instructions/STATUS.md; .instructions/VALIDATION.md; .instructions/handoffs/Marketplace/2026-09-08T11-09-00Z-vercel-dev-deployment-01a080aa.md; this receipt.`
- Dependencies: `Marketplace apps/web -> Vercel static hosting. The local apps/api proxy is unavailable in this deployment; apps/web retains mock fallback behavior.`
- Blockers / risks: `Vercel project settings must leave Build Command and Output Directory un-overridden so the dev branch vercel.json is effective. Domain-to-branch assignment remains a Vercel project setting.`
- Priority impact: `Current priority unchanged.`
- Portfolio action: `None.`
- Boundaries preserved: `No production API, payment, wallet, blockchain, settlement, or external execution is enabled.`

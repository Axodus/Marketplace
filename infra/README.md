# Infrastructure & CI/CD

## CI (GitHub Actions)
Pipelines:
- **PR**: lint, typecheck, unit tests, build (web/api/contracts)
- **Contracts**: compile, test, coverage, slither, size, abi export
- **Index**: subgraph codegen & deploy (testnets)
- **Deploy**: staging/prod with manual approvals

## K8s
- `apps/web`: SSR pods + CDN cache
- `apps/api`: HPA enabled; Redis & DB as managed services
- `apps/indexer`: one deployment per chain
- Ingress w/ TLS; OIDC for dashboards

## Terraform
- Greenfield buckets, IAM/keys
- Secret stores (KMS/SM), per-env
- DNS & CDN

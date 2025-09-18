#!/usr/bin/env bash
set -euo pipefail

ROOT="axodus-nft-marketplace"

# Ensure root dir
mkdir -p "$ROOT"

# Web dirs
mkdir -p "$ROOT"/apps/web/src/pages
mkdir -p "$ROOT"/apps/web/src/pages/item/\[chain]/\[contract]
mkdir -p "$ROOT"/apps/web/src/components
mkdir -p "$ROOT"/apps/web/src/hooks
mkdir -p "$ROOT"/apps/web/src/services
mkdir -p "$ROOT"/apps/web/src/styles
mkdir -p "$ROOT"/apps/web/public

# API dirs
mkdir -p "$ROOT"/apps/api/src
mkdir -p "$ROOT"/apps/api/src/modules/listings
mkdir -p "$ROOT"/apps/api/src/modules/auctions
mkdir -p "$ROOT"/apps/api/src/modules/users
mkdir -p "$ROOT"/apps/api/src/modules/storage
mkdir -p "$ROOT"/apps/api/src/modules/payments
mkdir -p "$ROOT"/apps/api/src/common

# Indexer dirs
mkdir -p "$ROOT"/apps/indexer/subgraphs/ethereum
mkdir -p "$ROOT"/apps/indexer/subgraphs/bnb
mkdir -p "$ROOT"/apps/indexer/subgraphs/arbitrum
mkdir -p "$ROOT"/apps/indexer/subgraphs/harmony
mkdir -p "$ROOT"/apps/indexer/subgraphs/polygon
mkdir -p "$ROOT"/apps/indexer/workers

# Contracts dirs
mkdir -p "$ROOT"/contracts/src/tokens
mkdir -p "$ROOT"/contracts/src/marketplace
mkdir -p "$ROOT"/contracts/src/libs
mkdir -p "$ROOT"/contracts/scripts
mkdir -p "$ROOT"/contracts/test

# Services dirs
mkdir -p "$ROOT"/services/storage/src
mkdir -p "$ROOT"/services/payments

# Infra/docs dirs
mkdir -p "$ROOT"/infra/k8s
mkdir -p "$ROOT"/infra/terraform
mkdir -p "$ROOT"/docs

# Empty files for web
touch "$ROOT"/apps/web/src/pages/index.tsx
touch "$ROOT"/apps/web/src/pages/explore.tsx
touch "$ROOT"/apps/web/src/pages/item/\[chain]/\[contract]/\[id].tsx
touch "$ROOT"/apps/web/src/components/NavBar.tsx
touch "$ROOT"/apps/web/src/components/Footer.tsx
touch "$ROOT"/apps/web/src/components/Card.tsx
touch "$ROOT"/apps/web/src/components/BidModal.tsx
touch "$ROOT"/apps/web/src/components/BuyNow.tsx
touch "$ROOT"/apps/web/src/hooks/useWallet.ts
touch "$ROOT"/apps/web/src/hooks/useListing.ts
touch "$ROOT"/apps/web/src/hooks/useAuction.ts
touch "$ROOT"/apps/web/src/services/apiClient.ts
touch "$ROOT"/apps/web/src/services/appkit.ts
touch "$ROOT"/apps/web/src/services/rpcProvider.ts
touch "$ROOT"/apps/web/src/styles/globals.css
touch "$ROOT"/apps/web/src/styles/tokens.css
touch "$ROOT"/apps/web/public/favicon.ico
touch "$ROOT"/apps/web/public/manifest.json
touch "$ROOT"/apps/web/README.md

# Empty files for API
touch "$ROOT"/apps/api/src/main.ts
touch "$ROOT"/apps/api/src/modules/listings/listings.module.ts
touch "$ROOT"/apps/api/src/modules/listings/listings.resolver.ts
touch "$ROOT"/apps/api/src/modules/listings/listings.service.ts
touch "$ROOT"/apps/api/src/modules/auctions/auctions.module.ts
touch "$ROOT"/apps/api/src/modules/auctions/auctions.resolver.ts
touch "$ROOT"/apps/api/src/modules/auctions/auctions.service.ts
touch "$ROOT"/apps/api/src/modules/users/users.module.ts
touch "$ROOT"/apps/api/src/modules/users/auth.controller.ts
touch "$ROOT"/apps/api/src/modules/users/auth.service.ts
touch "$ROOT"/apps/api/src/modules/storage/storage.module.ts
touch "$ROOT"/apps/api/src/modules/storage/storage.controller.ts
touch "$ROOT"/apps/api/src/modules/storage/storage.service.ts
touch "$ROOT"/apps/api/src/modules/payments/payments.module.ts
touch "$ROOT"/apps/api/src/modules/payments/payments.controller.ts
touch "$ROOT"/apps/api/src/modules/payments/payments.service.ts
touch "$ROOT"/apps/api/src/common/types.ts
touch "$ROOT"/apps/api/src/common/guards.ts
touch "$ROOT"/apps/api/src/common/filters.ts
touch "$ROOT"/apps/api/README.md

# Empty files for indexer
touch "$ROOT"/apps/indexer/subgraphs/ethereum/subgraph.yaml
touch "$ROOT"/apps/indexer/subgraphs/ethereum/schema.graphql
touch "$ROOT"/apps/indexer/subgraphs/bnb/subgraph.yaml
touch "$ROOT"/apps/indexer/subgraphs/bnb/schema.graphql
touch "$ROOT"/apps/indexer/subgraphs/arbitrum/subgraph.yaml
touch "$ROOT"/apps/indexer/subgraphs/arbitrum/schema.graphql
touch "$ROOT"/apps/indexer/subgraphs/harmony/subgraph.yaml
touch "$ROOT"/apps/indexer/subgraphs/harmony/schema.graphql
touch "$ROOT"/apps/indexer/subgraphs/polygon/subgraph.yaml
touch "$ROOT"/apps/indexer/subgraphs/polygon/schema.graphql
touch "$ROOT"/apps/indexer/workers/ws-listener.ts
touch "$ROOT"/apps/indexer/workers/normalizer.ts
touch "$ROOT"/apps/indexer/README.md

# Empty files for contracts
touch "$ROOT"/contracts/src/tokens/ERC721Neurons.sol
touch "$ROOT"/contracts/src/tokens/ERC1155Neurons.sol
touch "$ROOT"/contracts/src/tokens/OFTAdapter.sol
touch "$ROOT"/contracts/src/marketplace/MarketplaceCore.sol
touch "$ROOT"/contracts/src/marketplace/EnglishAuction.sol
touch "$ROOT"/contracts/src/marketplace/DutchAuction.sol
touch "$ROOT"/contracts/src/libs/RoyaltyLib.sol
touch "$ROOT"/contracts/src/libs/SafeMathExt.sol
touch "$ROOT"/contracts/scripts/deploy.ts
touch "$ROOT"/contracts/test/marketplace.spec.ts
touch "$ROOT"/contracts/README.md

# Empty files for services
touch "$ROOT"/services/storage/src/greenfield.ts
touch "$ROOT"/services/storage/src/signedUrl.ts
touch "$ROOT"/services/storage/src/mirror.ts
touch "$ROOT"/services/storage/README.md
touch "$ROOT"/services/payments/README.md

# Empty files for infra
touch "$ROOT"/infra/k8s/README.md
touch "$ROOT"/infra/terraform/README.md
touch "$ROOT"/infra/README.md

# docs + root readme placeholders
cat > "$ROOT"/README.md <<'EOF'
# Axodus NFT Marketplace — Monorepo
(see module READMEs under apps/, contracts/, services/, infra/, docs/)
EOF

cat > "$ROOT"/docs/PROJECT_GUIDE.md <<'EOF'
# Project Guide (Short)
Follow each module's README for setup, env, and DoD. Keep code in English; env files as .env-*
EOF

echo "Scaffold created at: $ROOT"

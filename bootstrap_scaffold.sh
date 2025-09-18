#!/bin/bash

# Bootstrap script for Axodus NFT Marketplace
# Sets up the development environment for all workspaces

set -e

echo "🚀 Bootstrapping Axodus NFT Marketplace..."
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "README.md" ] || [ ! -d "contracts" ]; then
    echo "❌ Error: Please run this script from the repository root"
    exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check required tools
echo "🔍 Checking required tools..."

if ! command_exists node; then
    echo "❌ Node.js is required but not installed"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

if ! command_exists pnpm; then
    echo "⚠️  pnpm not found, installing..."
    npm install -g pnpm
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt "18" ]; then
    echo "❌ Node.js 18+ is required (found v$NODE_VERSION)"
    exit 1
fi

echo "✅ Node.js $(node --version) found"
echo "✅ pnpm $(pnpm --version) found"

# Create environment template files
echo ""
echo "📝 Creating environment template files..."

# Contracts environment
cat > contracts/.env-contracts.template << 'EOF'
# Contracts Environment Variables
# Copy this file to .env-contracts and fill in the values

# RPC URLs for different networks
RPC_ETHEREUM=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
RPC_BNB=https://bsc-dataseed.binance.org
RPC_ARBITRUM=https://arb1.arbitrum.io/rpc
RPC_HARMONY=https://api.harmony.one
RPC_POLYGON=https://polygon-rpc.com

# Private key for deployment (DO NOT COMMIT THIS)
PRIVATE_KEY=

# API keys for contract verification
ETHERSCAN_API_KEY=
BSCSCAN_API_KEY=
ARBISCAN_API_KEY=
POLYGONSCAN_API_KEY=

# Gas reporting
REPORT_GAS=true
COINMARKETCAP_API_KEY=

# LayerZero endpoints (JSON format)
LAYERZERO_ENDPOINTS_JSON={}
EOF

# Web environment
mkdir -p apps/web
cat > apps/web/.env-web.template << 'EOF'
# Web App Environment Variables
# Copy this file to .env-web and fill in the values

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000/graphql

# Supported chains
NEXT_PUBLIC_SUPPORTED_CHAINS=ethereum,bnb,arbitrum,harmony,polygon
NEXT_PUBLIC_DEFAULT_CHAIN=polygon

# RPC endpoints for web app
NEXT_PUBLIC_RPC_ETHEREUM=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
NEXT_PUBLIC_RPC_BNB=https://bsc-dataseed.binance.org
NEXT_PUBLIC_RPC_ARBITRUM=https://arb1.arbitrum.io/rpc
NEXT_PUBLIC_RPC_HARMONY=https://api.harmony.one
NEXT_PUBLIC_RPC_POLYGON=https://polygon-rpc.com

# LayerZero configuration
NEXT_PUBLIC_LAYERZERO_ENDPOINTS_JSON={}

# Greenfield configuration
NEXT_PUBLIC_GREENFIELD_GATEWAY=https://gnfd-testnet-sp1.bnbchain.org
EOF

# API environment
mkdir -p apps/api
cat > apps/api/.env-api.template << 'EOF'
# API Environment Variables
# Copy this file to .env-api and fill in the values

# Server configuration
API_PORT=4000

# Database
DB_URL=postgresql://user:pass@localhost:5432/axodus

# Redis
REDIS_URL=redis://localhost:6379

# RPC endpoints
RPC_ETHEREUM=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
RPC_BNB=https://bsc-dataseed.binance.org
RPC_ARBITRUM=https://arb1.arbitrum.io/rpc
RPC_HARMONY=https://api.harmony.one
RPC_POLYGON=https://polygon-rpc.com

# LayerZero configuration
LAYERZERO_ENDPOINTS_JSON={}

# Greenfield configuration
GREENFIELD_GATEWAY=https://gnfd-testnet-sp1.bnbchain.org

# JWT secret (generate a secure random string)
JWT_SECRET=change-me-to-a-secure-random-string
EOF

# Indexer environment
mkdir -p apps/indexer
cat > apps/indexer/.env-indexer.template << 'EOF'
# Indexer Environment Variables
# Copy this file to .env-indexer and fill in the values

# Graph Protocol
GRAPH_NODE=http://localhost:8020
GRAPH_IPFS=http://localhost:5001

# WebSocket RPC endpoints
RPC_WS_ETHEREUM=wss://mainnet.infura.io/ws/v3/YOUR_INFURA_KEY
RPC_WS_BNB=wss://bsc-ws-node.nariox.org:443
RPC_WS_ARBITRUM=wss://arb1.arbitrum.io/ws
RPC_WS_HARMONY=wss://ws.s0.t.hmny.io
RPC_WS_POLYGON=wss://polygon-rpc.com/ws

# Redis for event publishing
REDIS_URL=redis://localhost:6379

# API endpoint for pushing events
API_PUSH_URL=http://localhost:4000/internal/events
EOF

# Storage service environment
mkdir -p services/storage
cat > services/storage/.env-storage.template << 'EOF'
# Storage Service Environment Variables
# Copy this file to .env-storage and fill in the values

# Greenfield configuration
GREENFIELD_GATEWAY=https://gnfd-testnet-sp1.bnbchain.org
GREENFIELD_BUCKET=axodus-market
GREENFIELD_ACCESS_KEY=
GREENFIELD_SECRET_KEY=

# BSC mirror contract (optional)
BSC_MIRROR_CONTRACT=0x
EOF

echo "✅ Environment template files created"

# Create basic project structure
echo ""
echo "📁 Creating project structure..."

# Create missing directories
directories=(
    "apps/web/src/pages"
    "apps/web/src/components"
    "apps/web/src/hooks"
    "apps/web/src/services"
    "apps/web/src/styles"
    "apps/web/public"
    "apps/api/src/modules/listings"
    "apps/api/src/modules/auctions"
    "apps/api/src/modules/users"
    "apps/api/src/modules/storage"
    "apps/api/src/modules/common"
    "apps/indexer/subgraphs/ethereum"
    "apps/indexer/subgraphs/bnb"
    "apps/indexer/subgraphs/arbitrum"
    "apps/indexer/subgraphs/harmony"
    "apps/indexer/subgraphs/polygon"
    "apps/indexer/workers"
    "services/payments"
    "infra/k8s"
    "infra/terraform"
    "docs"
)

for dir in "${directories[@]}"; do
    mkdir -p "$dir"
done

echo "✅ Project structure created"

# Create basic package.json files for workspaces
echo ""
echo "📦 Creating workspace package.json files..."

# Root package.json for workspace management
if [ ! -f "package.json" ]; then
    cat > package.json << 'EOF'
{
  "name": "axodus-marketplace",
  "version": "1.0.0",
  "description": "Axodus NFT Marketplace - Monorepo",
  "private": true,
  "workspaces": [
    "contracts",
    "apps/*",
    "services/*"
  ],
  "scripts": {
    "build": "pnpm -r build",
    "test": "pnpm -r test",
    "lint": "pnpm -r lint",
    "dev": "pnpm -r --parallel dev",
    "clean": "pnpm -r clean"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  }
}
EOF
fi

echo "✅ Root package.json created"

# Install dependencies if pnpm.lock exists or package.json files exist
echo ""
echo "📥 Installing dependencies..."

if [ -f "pnpm-lock.yaml" ]; then
    echo "Found pnpm-lock.yaml, installing dependencies..."
    pnpm install
else
    echo "No lock file found, running pnpm install..."
    pnpm install
fi

echo "✅ Dependencies installed"

# Contracts setup
echo ""
echo "🔨 Setting up contracts workspace..."
cd contracts

# Try to compile contracts (may fail due to network restrictions)
echo "Attempting to compile contracts..."
if npm run build 2>/dev/null; then
    echo "✅ Contracts compiled successfully"
    
    # Run tests if compilation succeeded
    echo "Running contract tests..."
    if npm test 2>/dev/null; then
        echo "✅ Contract tests passed"
    else
        echo "⚠️  Contract tests failed or skipped"
    fi
    
    # Export ABIs
    echo "Exporting contract ABIs..."
    if npm run export:abi 2>/dev/null; then
        echo "✅ Contract ABIs exported"
    else
        echo "⚠️  ABI export failed or skipped"
    fi
else
    echo "⚠️  Contract compilation failed (likely due to network restrictions)"
    echo "    This is normal in restricted environments"
    echo "    Contracts can be compiled later with: cd contracts && npm run build"
fi

cd ..

# Final instructions
echo ""
echo "🎉 Bootstrap completed!"
echo "===================="
echo ""
echo "Next steps:"
echo "1. Copy .env-*.template files to .env-* files and fill in your values"
echo "2. Set up your database and Redis instances"
echo "3. Deploy contracts to your target networks"
echo "4. Update deployment addresses in apps and services"
echo ""
echo "Development commands:"
echo "- pnpm -w build      # Build all workspaces"
echo "- pnpm -w test       # Test all workspaces"
echo "- pnpm -w dev        # Start development servers"
echo ""
echo "Workspace-specific commands:"
echo "- cd contracts && npm run build    # Compile contracts"
echo "- cd contracts && npm run deploy   # Deploy contracts"
echo "- cd contracts && npm test         # Run contract tests"
echo ""
echo "📚 See docs/ARCHITECTURE.md for detailed setup instructions"
echo ""
echo "Happy building! 🚀"
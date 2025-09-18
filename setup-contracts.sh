#!/bin/bash

# Quick setup script for contracts when network is available
# This script can be run after bootstrap to compile and test contracts

set -e

echo "🔨 Setting up contracts for development..."

cd contracts

# Check if we have network access
echo "Checking network connectivity..."
if curl -s --max-time 5 https://google.com > /dev/null; then
    echo "✅ Network available, proceeding with full setup"
    
    # Clean any previous artifacts
    echo "Cleaning previous builds..."
    rm -rf artifacts cache typechain-types coverage
    
    # Compile contracts
    echo "Compiling contracts..."
    npx hardhat compile
    
    # Run tests
    echo "Running tests..."
    npx hardhat test
    
    # Generate gas report
    echo "Generating gas report..."
    REPORT_GAS=true npx hardhat test > gas-report.txt
    
    # Check contract sizes
    echo "Checking contract sizes..."
    npx hardhat size-contracts > contract-size-report.txt
    
    # Export ABIs
    echo "Exporting ABIs..."
    npm run export:abi
    
    # Run linting
    echo "Running Solidity linting..."
    npm run lint
    
    echo ""
    echo "🎉 Contract setup completed successfully!"
    echo ""
    echo "Generated files:"
    echo "- artifacts/: Compiled contract artifacts"
    echo "- typechain-types/: TypeScript type definitions"
    echo "- abi/: Exported ABIs for frontend/backend"
    echo "- gas-report.txt: Gas usage report"
    echo "- contract-size-report.txt: Contract size analysis"
    echo ""
    echo "Next steps:"
    echo "1. Deploy to testnet: npm run deploy"
    echo "2. Verify contracts: npm run verify"
    echo "3. Update deployment addresses in apps/"
    
else
    echo "⚠️  No network access detected"
    echo "Contracts can be compiled later when network is available"
    echo "Run this script again or use: npm run build"
fi

cd ..
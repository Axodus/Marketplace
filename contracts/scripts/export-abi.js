const fs = require('fs');
const path = require('path');

/**
 * Export contract ABIs for use in frontend and API
 */
async function exportABIs() {
  console.log('Exporting contract ABIs...');
  
  const artifactsPath = path.join(__dirname, '..', 'artifacts', 'contracts');
  const abiOutputPath = path.join(__dirname, '..', 'abi');
  
  // Ensure ABI output directory exists
  if (!fs.existsSync(abiOutputPath)) {
    fs.mkdirSync(abiOutputPath, { recursive: true });
  }
  
  // Contract names to export
  const contracts = [
    'ERC721Neurons',
    'ERC1155Neurons',
    'MarketplaceCore',
    'EnglishAuction',
    'DutchAuction',
    'OFTAdapter'
  ];
  
  // Map of contract names to their artifact paths
  const contractPaths = {
    'ERC721Neurons': 'tokens/ERC721Neurons.sol/ERC721Neurons.json',
    'ERC1155Neurons': 'tokens/ERC1155Neurons.sol/ERC1155Neurons.json',
    'MarketplaceCore': 'marketplace/MarketplaceCore.sol/MarketplaceCore.json',
    'EnglishAuction': 'marketplace/EnglishAuction.sol/EnglishAuction.json',
    'DutchAuction': 'marketplace/DutchAuction.sol/DutchAuction.json',
    'OFTAdapter': 'tokens/OFTAdapter.sol/OFTAdapter.json'
  };
  
  const exportedABIs = {};
  
  for (const contractName of contracts) {
    try {
      const artifactPath = path.join(artifactsPath, contractPaths[contractName]);
      
      if (fs.existsSync(artifactPath)) {
        const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
        const abi = artifact.abi;
        
        // Export individual ABI file
        const abiPath = path.join(abiOutputPath, `${contractName}.json`);
        fs.writeFileSync(abiPath, JSON.stringify(abi, null, 2));
        
        // Add to combined export
        exportedABIs[contractName] = {
          abi: abi,
          bytecode: artifact.bytecode,
          contractName: contractName
        };
        
        console.log(`✅ Exported ABI for ${contractName}`);
      } else {
        console.warn(`⚠️  Artifact not found for ${contractName} at ${artifactPath}`);
      }
    } catch (error) {
      console.error(`❌ Error exporting ABI for ${contractName}:`, error.message);
    }
  }
  
  // Export combined ABI file
  const combinedABIPath = path.join(abiOutputPath, 'index.json');
  fs.writeFileSync(combinedABIPath, JSON.stringify(exportedABIs, null, 2));
  
  // Export TypeScript definitions
  await exportTypeScriptDefinitions(exportedABIs, abiOutputPath);
  
  console.log(`\n📦 ABI export completed!`);
  console.log(`📁 ABIs exported to: ${abiOutputPath}`);
  console.log(`📝 Individual ABI files: ${contracts.length}`);
  console.log(`📄 Combined ABI file: index.json`);
  console.log(`🔧 TypeScript definitions: contracts.d.ts`);
}

async function exportTypeScriptDefinitions(abis, outputPath) {
  console.log('\nGenerating TypeScript definitions...');
  
  let tsDefinitions = `// Auto-generated contract type definitions
// Generated on: ${new Date().toISOString()}

export interface ContractABI {
  abi: any[];
  bytecode: string;
  contractName: string;
}

export interface Contracts {
`;

  // Add contract interfaces
  for (const [contractName, contractData] of Object.entries(abis)) {
    tsDefinitions += `  ${contractName}: ContractABI;\n`;
  }

  tsDefinitions += `}

export declare const contracts: Contracts;

// Individual contract exports
`;

  // Add individual contract exports
  for (const contractName of Object.keys(abis)) {
    tsDefinitions += `export declare const ${contractName}ABI: any[];\n`;
  }

  tsDefinitions += `
// Contract addresses by chain ID
export interface ChainAddresses {
  [contractName: string]: string;
}

export interface DeploymentAddresses {
  [chainId: string]: ChainAddresses;
}

export declare const addresses: DeploymentAddresses;
`;

  const tsPath = path.join(outputPath, 'contracts.d.ts');
  fs.writeFileSync(tsPath, tsDefinitions);
  
  // Export JavaScript module
  let jsModule = `// Auto-generated contract exports
// Generated on: ${new Date().toISOString()}

`;

  for (const [contractName, contractData] of Object.entries(abis)) {
    jsModule += `export const ${contractName}ABI = ${JSON.stringify(contractData.abi, null, 2)};

`;
  }

  jsModule += `export const contracts = ${JSON.stringify(abis, null, 2)};

// Load deployment addresses if available
let addresses = {};
try {
  const deployments = require('../deployments.json');
  addresses = deployments;
} catch (error) {
  console.warn('Deployment addresses not found');
}

export { addresses };
`;

  const jsPath = path.join(outputPath, 'index.js');
  fs.writeFileSync(jsPath, jsModule);
  
  console.log('✅ TypeScript definitions generated');
  console.log('✅ JavaScript module generated');
}

// Create package.json for ABI package
async function createABIPackage(outputPath) {
  const packageJson = {
    name: '@axodus/contracts-abi',
    version: '1.0.0',
    description: 'Contract ABIs and TypeScript definitions for Axodus Marketplace',
    main: 'index.js',
    types: 'contracts.d.ts',
    files: [
      '*.json',
      '*.js',
      '*.d.ts'
    ],
    keywords: ['ethereum', 'smart-contracts', 'nft', 'marketplace', 'abi'],
    license: 'MIT'
  };
  
  const packagePath = path.join(outputPath, 'package.json');
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  console.log('✅ ABI package.json created');
}

// Run the export
if (require.main === module) {
  exportABIs()
    .then(() => {
      return createABIPackage(path.join(__dirname, '..', 'abi'));
    })
    .then(() => {
      console.log('\n🎉 ABI export process completed successfully!');
    })
    .catch((error) => {
      console.error('❌ ABI export failed:', error);
      process.exit(1);
    });
}

module.exports = { exportABIs };
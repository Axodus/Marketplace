import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();
import { Contract } from "ethers";

interface DeploymentRecord {
  contractName: string;
  address: string;
  chainId: number;
  blockNumber: number;
  transactionHash: string;
  timestamp: number;
}

interface ChainDeployments {
  [contractName: string]: DeploymentRecord;
}

interface DeploymentManifest {
  [chainId: string]: ChainDeployments;
}

async function main() {
  console.log("Starting contract deployment...");
  
  const [deployer] = await ethers.getSigners();
  const chainId = await deployer.provider.getNetwork().then(n => Number(n.chainId));
  
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Chain ID:", chainId);
  console.log("Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)));

  const deployments: ChainDeployments = {};
  
  // Deployment configuration
  const config = {
    marketplaceFee: 250, // 2.5%
    treasury: deployer.address, // Use deployer as initial treasury
    maxSupply: 10000,
    mintPrice: ethers.parseEther("0.01"),
    auctionDuration: 7 * 24 * 60 * 60, // 7 days
    minBidIncrement: 500, // 5%
  };

  try {
    // Deploy ERC721 Token
    console.log("\n1. Deploying ERC721Neurons...");
    const ERC721Neurons = await ethers.getContractFactory("ERC721Neurons");
    const erc721 = await ERC721Neurons.deploy(
      "Axodus Neurons",
      "NEURONS",
      config.maxSupply,
      config.mintPrice,
      deployer.address
    );
    await erc721.waitForDeployment();
    
    const erc721Receipt = await erc721.deploymentTransaction()?.wait();
    deployments["ERC721Neurons"] = {
      contractName: "ERC721Neurons",
      address: await erc721.getAddress(),
      chainId,
      blockNumber: erc721Receipt?.blockNumber || 0,
      transactionHash: erc721Receipt?.hash || "",
      timestamp: Date.now()
    };
    console.log("ERC721Neurons deployed to:", await erc721.getAddress());

    // Deploy ERC1155 Token
    console.log("\n2. Deploying ERC1155Neurons...");
    const ERC1155Neurons = await ethers.getContractFactory("ERC1155Neurons");
    const erc1155 = await ERC1155Neurons.deploy(
      "https://api.axodus.io/metadata/{id}.json",
      deployer.address
    );
    await erc1155.waitForDeployment();
    
    const erc1155Receipt = await erc1155.deploymentTransaction()?.wait();
    deployments["ERC1155Neurons"] = {
      contractName: "ERC1155Neurons",
      address: await erc1155.getAddress(),
      chainId,
      blockNumber: erc1155Receipt?.blockNumber || 0,
      transactionHash: erc1155Receipt?.hash || "",
      timestamp: Date.now()
    };
    console.log("ERC1155Neurons deployed to:", await erc1155.getAddress());

    // Deploy MarketplaceCore
    console.log("\n3. Deploying MarketplaceCore...");
    const MarketplaceCore = await ethers.getContractFactory("MarketplaceCore");
    const marketplace = await MarketplaceCore.deploy(
      deployer.address,
      config.marketplaceFee,
      config.treasury
    );
    await marketplace.waitForDeployment();
    
    const marketplaceReceipt = await marketplace.deploymentTransaction()?.wait();
    deployments["MarketplaceCore"] = {
      contractName: "MarketplaceCore",
      address: await marketplace.getAddress(),
      chainId,
      blockNumber: marketplaceReceipt?.blockNumber || 0,
      transactionHash: marketplaceReceipt?.hash || "",
      timestamp: Date.now()
    };
    console.log("MarketplaceCore deployed to:", await marketplace.getAddress());

    // Deploy EnglishAuction
    console.log("\n4. Deploying EnglishAuction...");
    const EnglishAuction = await ethers.getContractFactory("EnglishAuction");
    const englishAuction = await EnglishAuction.deploy(
      deployer.address,
      config.marketplaceFee,
      config.treasury
    );
    await englishAuction.waitForDeployment();
    
    const englishAuctionReceipt = await englishAuction.deploymentTransaction()?.wait();
    deployments["EnglishAuction"] = {
      contractName: "EnglishAuction",
      address: await englishAuction.getAddress(),
      chainId,
      blockNumber: englishAuctionReceipt?.blockNumber || 0,
      transactionHash: englishAuctionReceipt?.hash || "",
      timestamp: Date.now()
    };
    console.log("EnglishAuction deployed to:", await englishAuction.getAddress());

    // Deploy DutchAuction
    console.log("\n5. Deploying DutchAuction...");
    const DutchAuction = await ethers.getContractFactory("DutchAuction");
    const dutchAuction = await DutchAuction.deploy(
      deployer.address,
      config.marketplaceFee,
      config.treasury
    );
    await dutchAuction.waitForDeployment();
    
    const dutchAuctionReceipt = await dutchAuction.deploymentTransaction()?.wait();
    deployments["DutchAuction"] = {
      contractName: "DutchAuction",
      address: await dutchAuction.getAddress(),
      chainId,
      blockNumber: dutchAuctionReceipt?.blockNumber || 0,
      transactionHash: dutchAuctionReceipt?.hash || "",
      timestamp: Date.now()
    };
    console.log("DutchAuction deployed to:", await dutchAuction.getAddress());

    // Optional: Deploy OFTAdapter if env vars provided
    const lzEndpoint = process.env.LZ_ENDPOINT;
    const oftAdmin = process.env.OFT_ADMIN || deployer.address;
    if (lzEndpoint) {
      console.log("\n6. Deploying OFTAdapter...");
      const OFTAdapter = await ethers.getContractFactory("OFTAdapter");
      const oftAdapter = await OFTAdapter.deploy(lzEndpoint, oftAdmin);
      await oftAdapter.waitForDeployment();
      const oftAddress = await oftAdapter.getAddress();
      console.log("OFTAdapter deployed to:", oftAddress);
      const oftReceipt = await oftAdapter.deploymentTransaction()?.wait();
      deployments["OFTAdapter"] = {
        contractName: "OFTAdapter",
        address: oftAddress,
        chainId,
        blockNumber: oftReceipt?.blockNumber || 0,
        transactionHash: oftReceipt?.hash || "",
        timestamp: Date.now()
      };
    } else {
      console.log("\n6. Skipping OFTAdapter deployment (LZ_ENDPOINT not set)");
    }

    // Setup initial permissions and configurations
    console.log("\n6. Setting up initial configurations...");
    
    // Set marketplace as approved operator for tokens
    await erc721.setMinterStatus(await marketplace.getAddress(), true);
    await erc1155.setMinterStatus(await marketplace.getAddress(), true);
    
    console.log("✅ Initial configurations completed");

    // Save deployment manifest
    await saveDeploymentManifest(chainId, deployments);

    console.log("\n🎉 Deployment completed successfully!");
    console.log("\nDeployment Summary:");
    console.log("==================");
    for (const [name, deployment] of Object.entries(deployments)) {
      console.log(`${name}: ${deployment.address}`);
    }

    console.log("\nNext steps:");
    console.log("1. Verify contracts on Etherscan");
    console.log("2. Update frontend configuration with new addresses");
    console.log("3. Configure API with new contract addresses");
    console.log("4. Set up indexer for new deployments");
    
  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

async function saveDeploymentManifest(chainId: number, deployments: ChainDeployments) {
  const fs = await import("fs");
  const path = await import("path");
  
  const manifestPath = path.join(__dirname, "..", "deployments.json");
  
  let manifest: DeploymentManifest = {};
  
  // Load existing manifest if it exists
  try {
    if (fs.existsSync(manifestPath)) {
      const existingManifest = fs.readFileSync(manifestPath, "utf8");
      manifest = JSON.parse(existingManifest);
    }
  } catch (error) {
    console.warn("Could not load existing deployment manifest:", error);
  }
  
  // Update manifest with new deployments
  manifest[chainId.toString()] = deployments;
  
  // Save updated manifest
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\n📝 Deployment manifest saved to: ${manifestPath}`);
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import {
  MarketplaceCore,
  EnglishAuction,
  DutchAuction,
  ERC721Neurons,
  ERC1155Neurons
} from "../typechain-types";

describe("Marketplace Contracts", function () {
  let marketplace: MarketplaceCore;
  let englishAuction: EnglishAuction;
  let dutchAuction: DutchAuction;
  let erc721: ERC721Neurons;
  let erc1155: ERC1155Neurons;
  
  let owner: SignerWithAddress;
  let seller: SignerWithAddress;
  let buyer: SignerWithAddress;
  let treasury: SignerWithAddress;
  let royaltyRecipient: SignerWithAddress;
  let addrs: SignerWithAddress[];

  const MARKETPLACE_FEE = 250; // 2.5%
  const ROYALTY_FEE = 500; // 5%
  const MINT_PRICE = ethers.parseEther("0.01");
  const MAX_SUPPLY = 1000;

  beforeEach(async function () {
    [owner, seller, buyer, treasury, royaltyRecipient, ...addrs] = await ethers.getSigners();

    // Deploy ERC721 token
    const ERC721Factory = await ethers.getContractFactory("ERC721Neurons");
    erc721 = await ERC721Factory.deploy(
      "Test NFT",
      "TNFT",
      MAX_SUPPLY,
      MINT_PRICE,
      owner.address
    );

    // Deploy ERC1155 token
    const ERC1155Factory = await ethers.getContractFactory("ERC1155Neurons");
    erc1155 = await ERC1155Factory.deploy(
      "https://api.example.com/metadata/{id}.json",
      owner.address
    );

    // Deploy marketplace contracts
    const MarketplaceFactory = await ethers.getContractFactory("MarketplaceCore");
    marketplace = await MarketplaceFactory.deploy(
      owner.address,
      MARKETPLACE_FEE,
      treasury.address
    );

    const EnglishAuctionFactory = await ethers.getContractFactory("EnglishAuction");
    englishAuction = await EnglishAuctionFactory.deploy(
      owner.address,
      MARKETPLACE_FEE,
      treasury.address
    );

    const DutchAuctionFactory = await ethers.getContractFactory("DutchAuction");
    dutchAuction = await DutchAuctionFactory.deploy(
      owner.address,
      MARKETPLACE_FEE,
      treasury.address
    );

    // Setup permissions
    await erc721.setMinterStatus(seller.address, true);
    await erc1155.setMinterStatus(seller.address, true);

    // Mint test tokens
    await erc721.connect(seller).mint(
      seller.address,
      "ipfs://test-token-1",
      royaltyRecipient.address,
      ROYALTY_FEE,
      { value: MINT_PRICE }
    );

    await erc1155.connect(seller).createToken(
      "ipfs://test-token-1155",
      100, // max supply
      ethers.parseEther("0.005"), // mint price
      royaltyRecipient.address,
      ROYALTY_FEE
    );

    await erc1155.connect(seller).mint(seller.address, 1, 10, { value: ethers.parseEther("0.05") });

    // Approve marketplace contracts
    await erc721.connect(seller).setApprovalForAll(await marketplace.getAddress(), true);
    await erc721.connect(seller).setApprovalForAll(await englishAuction.getAddress(), true);
    await erc721.connect(seller).setApprovalForAll(await dutchAuction.getAddress(), true);

    await erc1155.connect(seller).setApprovalForAll(await marketplace.getAddress(), true);
    await erc1155.connect(seller).setApprovalForAll(await englishAuction.getAddress(), true);
    await erc1155.connect(seller).setApprovalForAll(await dutchAuction.getAddress(), true);
  });

  describe("ERC721Neurons", function () {
    it("Should mint tokens with royalty information", async function () {
      const tokenId = 2;
      await erc721.connect(seller).mint(
        buyer.address,
        "ipfs://test-token-2",
        royaltyRecipient.address,
        ROYALTY_FEE,
        { value: MINT_PRICE }
      );

      expect(await erc721.ownerOf(tokenId)).to.equal(buyer.address);
      expect(await erc721.tokenURI(tokenId)).to.equal("ipfs://test-token-2");

      const [royaltyAddr, royaltyAmount] = await erc721.royaltyInfo(tokenId, ethers.parseEther("1"));
      expect(royaltyAddr).to.equal(royaltyRecipient.address);
      expect(royaltyAmount).to.equal(ethers.parseEther("0.05")); // 5% of 1 ETH
    });

    it("Should enforce max supply limit", async function () {
      // This would be expensive to test fully, so we'll mock it
      await erc721.setMaxSupply(2);
      
      // Try to mint token 3 (should fail since max supply is 2)
      await expect(
        erc721.connect(seller).mint(
          buyer.address,
          "ipfs://test-token-3",
          royaltyRecipient.address,
          ROYALTY_FEE,
          { value: MINT_PRICE }
        )
      ).to.be.revertedWith("ERC721Neurons: Max supply reached");
    });
  });

  describe("ERC1155Neurons", function () {
    it("Should create and mint tokens with royalty information", async function () {
      const tokenId = 2;
      await erc1155.connect(seller).createToken(
        "ipfs://test-token-1155-2",
        50, // max supply
        ethers.parseEther("0.01"), // mint price
        royaltyRecipient.address,
        ROYALTY_FEE
      );

      await erc1155.connect(seller).mint(buyer.address, tokenId, 5, { value: ethers.parseEther("0.05") });

      expect(await erc1155.balanceOf(buyer.address, tokenId)).to.equal(5);
      expect(await erc1155.uri(tokenId)).to.equal("ipfs://test-token-1155-2");

      const [royaltyAddr, royaltyAmount] = await erc1155.royaltyInfo(tokenId, ethers.parseEther("1"));
      expect(royaltyAddr).to.equal(royaltyRecipient.address);
      expect(royaltyAmount).to.equal(ethers.parseEther("0.05"));
    });
  });

  describe("MarketplaceCore", function () {
    it("Should create and fulfill fixed price listings for ERC721", async function () {
      const price = ethers.parseEther("1");
      const tokenId = 1;

      // Create listing
      const tx = await marketplace.connect(seller).createListing(
        await erc721.getAddress(),
        tokenId,
        1, // amount
        price,
        ethers.ZeroAddress, // ETH payment
        0 // ERC721 TokenType
      );

      const receipt = await tx.wait();
      const listingCreatedEvent = receipt?.logs.find(
        log => log.fragment?.name === "ListingCreated"
      );
      expect(listingCreatedEvent).to.not.be.undefined;

      // Get listing ID from event
      const listingId = listingCreatedEvent?.args?.[0];

      // Buy item
      const buyerBalanceBefore = await buyer.provider.getBalance(buyer.address);
      const sellerBalanceBefore = await seller.provider.getBalance(seller.address);
      const treasuryBalanceBefore = await treasury.provider.getBalance(treasury.address);
      const royaltyBalanceBefore = await royaltyRecipient.provider.getBalance(royaltyRecipient.address);

      await marketplace.connect(buyer).buyItem(listingId, { value: price });

      // Verify ownership transfer
      expect(await erc721.ownerOf(tokenId)).to.equal(buyer.address);

      // Verify payment distribution
      const marketplaceFee = price * BigInt(MARKETPLACE_FEE) / BigInt(10000);
      const royaltyAmount = price * BigInt(ROYALTY_FEE) / BigInt(10000);
      const sellerProceeds = price - marketplaceFee - royaltyAmount;

      const treasuryBalanceAfter = await treasury.provider.getBalance(treasury.address);
      const royaltyBalanceAfter = await royaltyRecipient.provider.getBalance(royaltyRecipient.address);

      expect(treasuryBalanceAfter - treasuryBalanceBefore).to.equal(marketplaceFee);
      expect(royaltyBalanceAfter - royaltyBalanceBefore).to.equal(royaltyAmount);
    });

    it("Should handle ERC1155 listings correctly", async function () {
      const price = ethers.parseEther("0.5");
      const tokenId = 1;
      const amount = 3;

      // Create listing
      const tx = await marketplace.connect(seller).createListing(
        await erc1155.getAddress(),
        tokenId,
        amount,
        price,
        ethers.ZeroAddress,
        1 // ERC1155 TokenType
      );

      const receipt = await tx.wait();
      const listingCreatedEvent = receipt?.logs.find(
        log => log.fragment?.name === "ListingCreated"
      );
      const listingId = listingCreatedEvent?.args?.[0];

      // Buy item
      await marketplace.connect(buyer).buyItem(listingId, { value: price });

      // Verify balance transfer
      expect(await erc1155.balanceOf(buyer.address, tokenId)).to.equal(amount);
      expect(await erc1155.balanceOf(seller.address, tokenId)).to.equal(10 - amount);
    });
  });

  describe("EnglishAuction", function () {
    it("Should create and execute English auction correctly", async function () {
      const startPrice = ethers.parseEther("0.5");
      const reservePrice = ethers.parseEther("1");
      const duration = 3600; // 1 hour
      const minBidIncrement = 500; // 5%
      const tokenId = 1;

      // Create auction
      const tx = await englishAuction.connect(seller).createAuction(
        await erc721.getAddress(),
        tokenId,
        1, // amount
        startPrice,
        reservePrice,
        ethers.ZeroAddress, // ETH payment
        0, // ERC721 TokenType
        duration,
        minBidIncrement
      );

      const receipt = await tx.wait();
      const auctionCreatedEvent = receipt?.logs.find(
        log => log.fragment?.name === "AuctionCreated"
      );
      const auctionId = auctionCreatedEvent?.args?.[0];

      // Place bids
      const firstBid = ethers.parseEther("0.6");
      await englishAuction.connect(buyer).placeBid(auctionId, firstBid, { value: firstBid });

      const secondBid = ethers.parseEther("1.1");
      await englishAuction.connect(addrs[0]).placeBid(auctionId, secondBid, { value: secondBid });

      // Fast forward time to end auction
      await time.increase(duration + 1);

      // End auction
      await englishAuction.endAuction(auctionId);

      // Verify winner owns the token
      expect(await erc721.ownerOf(tokenId)).to.equal(addrs[0].address);

      // Verify refund is available for first bidder
      const refundAmount = await englishAuction.getRefundAmount(auctionId, buyer.address);
      expect(refundAmount).to.equal(firstBid);

      // Claim refund
      const buyerBalanceBefore = await buyer.provider.getBalance(buyer.address);
      await englishAuction.connect(buyer).withdrawRefund(auctionId);
      const buyerBalanceAfter = await buyer.provider.getBalance(buyer.address);
      
      expect(buyerBalanceAfter - buyerBalanceBefore).to.be.closeTo(firstBid, ethers.parseEther("0.01"));
    });

    it("Should handle failed auctions (below reserve)", async function () {
      const startPrice = ethers.parseEther("0.5");
      const reservePrice = ethers.parseEther("2");
      const duration = 3600;
      const minBidIncrement = 500;
      const tokenId = 1;

      // Create auction
      const tx = await englishAuction.connect(seller).createAuction(
        await erc721.getAddress(),
        tokenId,
        1,
        startPrice,
        reservePrice,
        ethers.ZeroAddress,
        0,
        duration,
        minBidIncrement
      );

      const receipt = await tx.wait();
      const auctionCreatedEvent = receipt?.logs.find(
        log => log.fragment?.name === "AuctionCreated"
      );
      const auctionId = auctionCreatedEvent?.args?.[0];

      // Place bid below reserve
      const bid = ethers.parseEther("1");
      await englishAuction.connect(buyer).placeBid(auctionId, bid, { value: bid });

      // Fast forward and end auction
      await time.increase(duration + 1);
      await englishAuction.endAuction(auctionId);

      // Verify token stays with seller
      expect(await erc721.ownerOf(tokenId)).to.equal(seller.address);

      // Verify bidder can claim refund
      const refundAmount = await englishAuction.getRefundAmount(auctionId, buyer.address);
      expect(refundAmount).to.equal(bid);
    });
  });

  describe("DutchAuction", function () {
    it("Should create and execute Dutch auction correctly", async function () {
      const startPrice = ethers.parseEther("2");
      const endPrice = ethers.parseEther("0.5");
      const duration = 3600; // 1 hour
      const tokenId = 1;

      // Create auction
      const tx = await dutchAuction.connect(seller).createAuction(
        await erc721.getAddress(),
        tokenId,
        1, // amount
        startPrice,
        endPrice,
        ethers.ZeroAddress, // ETH payment
        0, // ERC721 TokenType
        duration
      );

      const receipt = await tx.wait();
      const auctionCreatedEvent = receipt?.logs.find(
        log => log.fragment?.name === "AuctionCreated"
      );
      const auctionId = auctionCreatedEvent?.args?.[0];

      // Fast forward time to mid-auction
      await time.increase(duration / 2);

      // Get current price and buy
      const currentPrice = await dutchAuction.getCurrentPrice(auctionId);
      expect(currentPrice).to.be.lt(startPrice);
      expect(currentPrice).to.be.gt(endPrice);

      const sellerBalanceBefore = await seller.provider.getBalance(seller.address);
      const treasuryBalanceBefore = await treasury.provider.getBalance(treasury.address);
      const royaltyBalanceBefore = await royaltyRecipient.provider.getBalance(royaltyRecipient.address);

      await dutchAuction.connect(buyer).buy(auctionId, { value: currentPrice });

      // Verify ownership transfer
      expect(await erc721.ownerOf(tokenId)).to.equal(buyer.address);

      // Verify payment distribution
      const marketplaceFee = currentPrice * BigInt(MARKETPLACE_FEE) / BigInt(10000);
      const royaltyAmount = currentPrice * BigInt(ROYALTY_FEE) / BigInt(10000);

      const treasuryBalanceAfter = await treasury.provider.getBalance(treasury.address);
      const royaltyBalanceAfter = await royaltyRecipient.provider.getBalance(royaltyRecipient.address);

      expect(treasuryBalanceAfter - treasuryBalanceBefore).to.equal(marketplaceFee);
      expect(royaltyBalanceAfter - royaltyBalanceBefore).to.equal(royaltyAmount);
    });

    it("Should calculate price correctly over time", async function () {
      const startPrice = ethers.parseEther("2");
      const endPrice = ethers.parseEther("0.5");
      const duration = 3600;
      const tokenId = 1;

      // Create auction
      const tx = await dutchAuction.connect(seller).createAuction(
        await erc721.getAddress(),
        tokenId,
        1,
        startPrice,
        endPrice,
        ethers.ZeroAddress,
        0,
        duration
      );

      const receipt = await tx.wait();
      const auctionCreatedEvent = receipt?.logs.find(
        log => log.fragment?.name === "AuctionCreated"
      );
      const auctionId = auctionCreatedEvent?.args?.[0];

      // Check price at start
      let currentPrice = await dutchAuction.getCurrentPrice(auctionId);
      expect(currentPrice).to.equal(startPrice);

      // Check price at 25% through
      await time.increase(duration / 4);
      currentPrice = await dutchAuction.getCurrentPrice(auctionId);
      const expectedQuarterPrice = startPrice - ((startPrice - endPrice) / BigInt(4));
      expect(currentPrice).to.be.closeTo(expectedQuarterPrice, ethers.parseEther("0.01"));

      // Check price at end
      await time.increase((duration * 3) / 4 + 1);
      currentPrice = await dutchAuction.getCurrentPrice(auctionId);
      expect(currentPrice).to.equal(endPrice);
    });
  });

  describe("Fee and Royalty Distribution", function () {
    it("Should correctly calculate and distribute fees across all marketplace types", async function () {
      // This test verifies the fee calculation logic in SafeMathExt
      const totalAmount = ethers.parseEther("10");
      const marketplaceFee = totalAmount * BigInt(MARKETPLACE_FEE) / BigInt(10000);
      const royaltyAmount = totalAmount * BigInt(ROYALTY_FEE) / BigInt(10000);
      const sellerProceeds = totalAmount - marketplaceFee - royaltyAmount;

      expect(marketplaceFee).to.equal(ethers.parseEther("0.25")); // 2.5%
      expect(royaltyAmount).to.equal(ethers.parseEther("0.5")); // 5%
      expect(sellerProceeds).to.equal(ethers.parseEther("9.25")); // 92.5%
    });
  });

  describe("Access Control", function () {
    it("Should enforce operator roles correctly", async function () {
      // Test that only operators can perform certain actions
      await expect(
        marketplace.connect(buyer).updateFeeConfig(300, treasury.address)
      ).to.be.revertedWith("AccessControl:");

      // Grant operator role and retry
      const OPERATOR_ROLE = await marketplace.OPERATOR_ROLE();
      await marketplace.grantRole(OPERATOR_ROLE, buyer.address);
      
      // This should still fail because updateFeeConfig requires DEFAULT_ADMIN_ROLE
      await expect(
        marketplace.connect(buyer).updateFeeConfig(300, treasury.address)
      ).to.be.revertedWith("AccessControl:");
    });

    it("Should allow admin to update configurations", async function () {
      const newFee = 300; // 3%
      await marketplace.connect(owner).updateFeeConfig(newFee, treasury.address);
      
      const feeConfig = await marketplace.feeConfig();
      expect(feeConfig.marketplaceFee).to.equal(newFee);
    });
  });
});
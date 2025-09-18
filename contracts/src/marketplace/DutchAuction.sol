// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "../libs/AccessControlLib.sol";
import "../libs/RoyaltyLib.sol";
import "../libs/SafeMathExt.sol";

/**
 * @title DutchAuction
 * @dev Dutch auction implementation with linear price decrease over time
 */
contract DutchAuction is AccessControlLib, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using Address for address payable;
    using SafeMathExt for uint256;
    using RoyaltyLib for address;

    enum TokenType { ERC721, ERC1155 }
    enum AuctionStatus { Active, Sold, Ended, Cancelled }

    struct Auction {
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 amount; // 1 for ERC721, > 1 for ERC1155
        uint256 startPrice;
        uint256 endPrice;
        uint256 duration;
        address paymentToken; // address(0) for ETH
        TokenType tokenType;
        AuctionStatus status;
        uint256 startTime;
        address buyer;
        uint256 soldPrice;
        bool fundsWithdrawn;
    }

    struct FeeConfig {
        uint256 marketplaceFee; // basis points
        address treasuryAddress;
    }

    // Constants
    uint256 public constant MIN_AUCTION_DURATION = 1 hours;
    uint256 public constant MAX_AUCTION_DURATION = 7 days;
    uint256 public constant MIN_PRICE_RATIO = 1000; // 10% minimum (endPrice must be at least 10% of startPrice)

    // State variables
    mapping(bytes32 => Auction) public auctions;
    mapping(address => bool) public supportedPaymentTokens;
    FeeConfig public feeConfig;

    // Events
    event AuctionCreated(
        bytes32 indexed auctionId,
        address indexed seller,
        address indexed nftContract,
        uint256 tokenId,
        uint256 amount,
        uint256 startPrice,
        uint256 endPrice,
        uint256 duration,
        uint256 startTime
    );

    event AuctionSold(
        bytes32 indexed auctionId,
        address indexed buyer,
        uint256 soldPrice
    );

    event AuctionEnded(bytes32 indexed auctionId);
    event AuctionCancelled(bytes32 indexed auctionId);

    modifier validAuction(bytes32 auctionId) {
        require(auctions[auctionId].seller != address(0), "DutchAuction: Auction does not exist");
        _;
    }

    modifier onlySeller(bytes32 auctionId) {
        require(auctions[auctionId].seller == msg.sender, "DutchAuction: Not the seller");
        _;
    }

    modifier auctionActive(bytes32 auctionId) {
        Auction storage auction = auctions[auctionId];
        require(auction.status == AuctionStatus.Active, "DutchAuction: Auction not active");
        require(block.timestamp >= auction.startTime, "DutchAuction: Auction not started");
        _;
    }

    constructor(
        address admin,
        uint256 _marketplaceFee,
        address _treasuryAddress
    ) {
        require(admin != address(0), "DutchAuction: Invalid admin");
        require(_treasuryAddress != address(0), "DutchAuction: Invalid treasury");
        require(_marketplaceFee <= 1000, "DutchAuction: Fee too high");

        _initializeAccessControl(admin);
        _grantRole(PAUSER_ROLE, admin);

        feeConfig = FeeConfig({
            marketplaceFee: _marketplaceFee,
            treasuryAddress: _treasuryAddress
        });

        supportedPaymentTokens[address(0)] = true; // ETH supported by default
    }

    /**
     * @dev Create a Dutch auction
     */
    function createAuction(
        address nftContract,
        uint256 tokenId,
        uint256 amount,
        uint256 startPrice,
        uint256 endPrice,
        address paymentToken,
        TokenType tokenType,
        uint256 duration
    ) external whenNotPaused nonReentrant returns (bytes32 auctionId) {
        require(nftContract != address(0), "DutchAuction: Invalid NFT contract");
        require(amount > 0, "DutchAuction: Invalid amount");
        require(startPrice > endPrice, "DutchAuction: Start price must be higher than end price");
        require(endPrice >= (startPrice * MIN_PRICE_RATIO) / 10000, "DutchAuction: End price too low");
        require(supportedPaymentTokens[paymentToken], "DutchAuction: Unsupported payment token");
        require(duration >= MIN_AUCTION_DURATION && duration <= MAX_AUCTION_DURATION, "DutchAuction: Invalid duration");

        // Validate token ownership and approval
        if (tokenType == TokenType.ERC721) {
            require(amount == 1, "DutchAuction: ERC721 amount must be 1");
            require(IERC721(nftContract).ownerOf(tokenId) == msg.sender, "DutchAuction: Not token owner");
            require(
                IERC721(nftContract).isApprovedForAll(msg.sender, address(this)) ||
                IERC721(nftContract).getApproved(tokenId) == address(this),
                "DutchAuction: Not approved for transfer"
            );
        } else {
            require(IERC1155(nftContract).balanceOf(msg.sender, tokenId) >= amount, "DutchAuction: Insufficient balance");
            require(
                IERC1155(nftContract).isApprovedForAll(msg.sender, address(this)),
                "DutchAuction: Not approved for transfer"
            );
        }

        auctionId = keccak256(abi.encodePacked(nftContract, tokenId, msg.sender, block.timestamp));
        
        uint256 startTime = block.timestamp;

        auctions[auctionId] = Auction({
            seller: msg.sender,
            nftContract: nftContract,
            tokenId: tokenId,
            amount: amount,
            startPrice: startPrice,
            endPrice: endPrice,
            duration: duration,
            paymentToken: paymentToken,
            tokenType: tokenType,
            status: AuctionStatus.Active,
            startTime: startTime,
            buyer: address(0),
            soldPrice: 0,
            fundsWithdrawn: false
        });

        emit AuctionCreated(auctionId, msg.sender, nftContract, tokenId, amount, startPrice, endPrice, duration, startTime);
    }

    /**
     * @dev Buy from a Dutch auction at current price
     */
    function buy(bytes32 auctionId) external payable whenNotPaused nonReentrant validAuction(auctionId) auctionActive(auctionId) {
        Auction storage auction = auctions[auctionId];
        require(msg.sender != auction.seller, "DutchAuction: Seller cannot buy");

        uint256 currentPrice = getCurrentPrice(auctionId);
        require(currentPrice > 0, "DutchAuction: Auction ended");

        // Handle payment
        if (auction.paymentToken == address(0)) {
            require(msg.value >= currentPrice, "DutchAuction: Insufficient ETH");
        } else {
            require(msg.value == 0, "DutchAuction: ETH not expected");
            require(
                IERC20(auction.paymentToken).balanceOf(msg.sender) >= currentPrice,
                "DutchAuction: Insufficient token balance"
            );
        }

        // Update auction state
        auction.status = AuctionStatus.Sold;
        auction.buyer = msg.sender;
        auction.soldPrice = currentPrice;

        // Transfer NFT
        if (auction.tokenType == TokenType.ERC721) {
            IERC721(auction.nftContract).safeTransferFrom(auction.seller, msg.sender, auction.tokenId);
        } else {
            IERC1155(auction.nftContract).safeTransferFrom(
                auction.seller,
                msg.sender,
                auction.tokenId,
                auction.amount,
                ""
            );
        }

        // Process payment
        _processPayment(auctionId, currentPrice);

        emit AuctionSold(auctionId, msg.sender, currentPrice);
    }

    /**
     * @dev End an expired auction
     */
    function endAuction(bytes32 auctionId) external nonReentrant validAuction(auctionId) {
        Auction storage auction = auctions[auctionId];
        require(auction.status == AuctionStatus.Active, "DutchAuction: Auction not active");
        require(block.timestamp >= auction.startTime + auction.duration, "DutchAuction: Auction still active");

        auction.status = AuctionStatus.Ended;
        emit AuctionEnded(auctionId);
    }

    /**
     * @dev Cancel an auction (only seller, only if not sold)
     */
    function cancelAuction(bytes32 auctionId) external nonReentrant validAuction(auctionId) onlySeller(auctionId) {
        Auction storage auction = auctions[auctionId];
        require(auction.status == AuctionStatus.Active, "DutchAuction: Auction not active");

        auction.status = AuctionStatus.Cancelled;
        emit AuctionCancelled(auctionId);
    }

    /**
     * @dev Get current price of a Dutch auction
     */
    function getCurrentPrice(bytes32 auctionId) public view validAuction(auctionId) returns (uint256) {
        Auction storage auction = auctions[auctionId];
        
        if (auction.status != AuctionStatus.Active) {
            return 0;
        }

        uint256 timeElapsed = block.timestamp - auction.startTime;
        
        if (timeElapsed >= auction.duration) {
            return auction.endPrice;
        }

        return auction.startPrice.calculateDutchPrice(
            auction.endPrice,
            auction.duration,
            timeElapsed
        );
    }

    /**
     * @dev Get time remaining in auction
     */
    function getTimeRemaining(bytes32 auctionId) external view validAuction(auctionId) returns (uint256) {
        Auction storage auction = auctions[auctionId];
        
        if (auction.status != AuctionStatus.Active) {
            return 0;
        }

        uint256 endTime = auction.startTime + auction.duration;
        
        if (block.timestamp >= endTime) {
            return 0;
        }

        return endTime - block.timestamp;
    }

    /**
     * @dev Internal function to process payment after purchase
     */
    function _processPayment(bytes32 auctionId, uint256 price) internal {
        Auction storage auction = auctions[auctionId];
        require(!auction.fundsWithdrawn, "DutchAuction: Funds already withdrawn");

        auction.fundsWithdrawn = true;

        // Calculate fees and royalties
        uint256 marketplaceFee = price.calculatePercentage(feeConfig.marketplaceFee);
        (address royaltyRecipient, uint256 royaltyAmount) = auction.nftContract.getRoyaltyInfo(
            auction.tokenId,
            price
        );

        uint256 sellerProceeds = price - marketplaceFee - royaltyAmount;

        // Process payments
        if (auction.paymentToken == address(0)) {
            // ETH payments
            if (royaltyAmount > 0 && royaltyRecipient != address(0)) {
                payable(royaltyRecipient).sendValue(royaltyAmount);
            }

            if (marketplaceFee > 0) {
                payable(feeConfig.treasuryAddress).sendValue(marketplaceFee);
            }

            payable(auction.seller).sendValue(sellerProceeds);

            // Refund excess ETH
            if (msg.value > price) {
                payable(msg.sender).sendValue(msg.value - price);
            }
        } else {
            // ERC20 payments
            IERC20 paymentToken = IERC20(auction.paymentToken);

            if (royaltyAmount > 0 && royaltyRecipient != address(0)) {
                paymentToken.safeTransferFrom(msg.sender, royaltyRecipient, royaltyAmount);
            }

            if (marketplaceFee > 0) {
                paymentToken.safeTransferFrom(msg.sender, feeConfig.treasuryAddress, marketplaceFee);
            }

            paymentToken.safeTransferFrom(msg.sender, auction.seller, sellerProceeds);
        }
    }

    /**
     * @dev Update marketplace fee configuration
     */
    function updateFeeConfig(uint256 newFee, address newTreasury) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newFee <= 1000, "DutchAuction: Fee too high");
        require(newTreasury != address(0), "DutchAuction: Invalid treasury");

        feeConfig.marketplaceFee = newFee;
        feeConfig.treasuryAddress = newTreasury;
    }

    /**
     * @dev Update supported payment token status
     */
    function updatePaymentToken(address token, bool supported) external onlyRole(DEFAULT_ADMIN_ROLE) {
        supportedPaymentTokens[token] = supported;
    }

    /**
     * @dev Get auction details
     */
    function getAuction(bytes32 auctionId) external view returns (Auction memory) {
        return auctions[auctionId];
    }
}
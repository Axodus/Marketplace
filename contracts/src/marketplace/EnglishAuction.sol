// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "../libs/AccessControlLib.sol";
import "../libs/RoyaltyLib.sol";
import "../libs/SafeMathExt.sol";

/**
 * @title EnglishAuction
 * @dev English auction implementation with automatic bid increments and time extensions
 */
contract EnglishAuction is AccessControlLib, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using Address for address payable;
    using SafeMathExt for uint256;
    using RoyaltyLib for address;

    enum TokenType { ERC721, ERC1155 }
    enum AuctionStatus { Active, Ended, Cancelled }

    struct Auction {
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 amount; // 1 for ERC721, > 1 for ERC1155
        uint256 startPrice;
        uint256 reservePrice;
        uint256 currentBid;
        address highestBidder;
        address paymentToken; // address(0) for ETH
        TokenType tokenType;
        AuctionStatus status;
        uint256 startTime;
        uint256 endTime;
        uint256 minBidIncrement; // basis points (100 = 1%)
        bool fundsWithdrawn;
    }

    struct FeeConfig {
        uint256 marketplaceFee; // basis points
        address treasuryAddress;
    }

    // Constants
    uint256 public constant MIN_AUCTION_DURATION = 1 hours;
    uint256 public constant MAX_AUCTION_DURATION = 30 days;
    uint256 public constant TIME_EXTENSION = 10 minutes;
    uint256 public constant TIME_EXTENSION_THRESHOLD = 10 minutes;

    // State variables
    mapping(bytes32 => Auction) public auctions;
    mapping(bytes32 => mapping(address => uint256)) public bidRefunds;
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
        uint256 reservePrice,
        uint256 startTime,
        uint256 endTime
    );

    event BidPlaced(
        bytes32 indexed auctionId,
        address indexed bidder,
        uint256 amount,
        uint256 newEndTime
    );

    event AuctionEnded(
        bytes32 indexed auctionId,
        address indexed winner,
        uint256 winningBid
    );

    event AuctionCancelled(bytes32 indexed auctionId);

    event FundsWithdrawn(
        bytes32 indexed auctionId,
        address indexed recipient,
        uint256 amount
    );

    modifier validAuction(bytes32 auctionId) {
        require(auctions[auctionId].seller != address(0), "EnglishAuction: Auction does not exist");
        _;
    }

    modifier onlySeller(bytes32 auctionId) {
        require(auctions[auctionId].seller == msg.sender, "EnglishAuction: Not the seller");
        _;
    }

    modifier auctionActive(bytes32 auctionId) {
        Auction storage auction = auctions[auctionId];
        require(auction.status == AuctionStatus.Active, "EnglishAuction: Auction not active");
        require(block.timestamp >= auction.startTime, "EnglishAuction: Auction not started");
        require(block.timestamp < auction.endTime, "EnglishAuction: Auction ended");
        _;
    }

    constructor(
        address admin,
        uint256 _marketplaceFee,
        address _treasuryAddress
    ) {
        require(admin != address(0), "EnglishAuction: Invalid admin");
        require(_treasuryAddress != address(0), "EnglishAuction: Invalid treasury");
        require(_marketplaceFee <= 1000, "EnglishAuction: Fee too high");

        _initializeAccessControl(admin);
        _grantRole(PAUSER_ROLE, admin);

        feeConfig = FeeConfig({
            marketplaceFee: _marketplaceFee,
            treasuryAddress: _treasuryAddress
        });

        supportedPaymentTokens[address(0)] = true; // ETH supported by default
    }

    /**
     * @dev Create an English auction
     */
    function createAuction(
        address nftContract,
        uint256 tokenId,
        uint256 amount,
        uint256 startPrice,
        uint256 reservePrice,
        address paymentToken,
        TokenType tokenType,
        uint256 duration,
        uint256 minBidIncrement
    ) external whenNotPaused nonReentrant returns (bytes32 auctionId) {
        require(nftContract != address(0), "EnglishAuction: Invalid NFT contract");
        require(amount > 0, "EnglishAuction: Invalid amount");
        require(startPrice > 0, "EnglishAuction: Invalid start price");
        require(reservePrice >= startPrice, "EnglishAuction: Reserve below start price");
        require(supportedPaymentTokens[paymentToken], "EnglishAuction: Unsupported payment token");
        require(duration >= MIN_AUCTION_DURATION && duration <= MAX_AUCTION_DURATION, "EnglishAuction: Invalid duration");
        require(minBidIncrement >= 100 && minBidIncrement <= 1000, "EnglishAuction: Invalid bid increment"); // 1-10%

        // Validate token ownership and approval
        if (tokenType == TokenType.ERC721) {
            require(amount == 1, "EnglishAuction: ERC721 amount must be 1");
            require(IERC721(nftContract).ownerOf(tokenId) == msg.sender, "EnglishAuction: Not token owner");
            require(
                IERC721(nftContract).isApprovedForAll(msg.sender, address(this)) ||
                IERC721(nftContract).getApproved(tokenId) == address(this),
                "EnglishAuction: Not approved for transfer"
            );
        } else {
            require(IERC1155(nftContract).balanceOf(msg.sender, tokenId) >= amount, "EnglishAuction: Insufficient balance");
            require(
                IERC1155(nftContract).isApprovedForAll(msg.sender, address(this)),
                "EnglishAuction: Not approved for transfer"
            );
        }

        auctionId = keccak256(abi.encodePacked(nftContract, tokenId, msg.sender, block.timestamp));
        
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + duration;

        auctions[auctionId] = Auction({
            seller: msg.sender,
            nftContract: nftContract,
            tokenId: tokenId,
            amount: amount,
            startPrice: startPrice,
            reservePrice: reservePrice,
            currentBid: 0,
            highestBidder: address(0),
            paymentToken: paymentToken,
            tokenType: tokenType,
            status: AuctionStatus.Active,
            startTime: startTime,
            endTime: endTime,
            minBidIncrement: minBidIncrement,
            fundsWithdrawn: false
        });

        emit AuctionCreated(auctionId, msg.sender, nftContract, tokenId, amount, startPrice, reservePrice, startTime, endTime);
    }

    /**
     * @dev Place a bid on an active auction
     */
    function placeBid(bytes32 auctionId, uint256 bidAmount) external payable whenNotPaused nonReentrant validAuction(auctionId) auctionActive(auctionId) {
        Auction storage auction = auctions[auctionId];
        require(msg.sender != auction.seller, "EnglishAuction: Seller cannot bid");

        uint256 minBid = auction.currentBid == 0 ? auction.startPrice : auction.currentBid.calculateMinBidIncrement(auction.minBidIncrement);
        require(bidAmount >= minBid, "EnglishAuction: Bid too low");

        // Handle payment
        if (auction.paymentToken == address(0)) {
            require(msg.value == bidAmount, "EnglishAuction: ETH amount mismatch");
        } else {
            require(msg.value == 0, "EnglishAuction: ETH not expected");
            require(
                IERC20(auction.paymentToken).balanceOf(msg.sender) >= bidAmount,
                "EnglishAuction: Insufficient token balance"
            );
            IERC20(auction.paymentToken).safeTransferFrom(msg.sender, address(this), bidAmount);
        }

        // Refund previous highest bidder
        if (auction.highestBidder != address(0)) {
            bidRefunds[auctionId][auction.highestBidder] += auction.currentBid;
        }

        // Update auction state
        auction.currentBid = bidAmount;
        auction.highestBidder = msg.sender;

        // Extend auction if bid placed near end
        uint256 newEndTime = auction.endTime;
        if (block.timestamp > auction.endTime - TIME_EXTENSION_THRESHOLD) {
            newEndTime = block.timestamp + TIME_EXTENSION;
            auction.endTime = newEndTime;
        }

        emit BidPlaced(auctionId, msg.sender, bidAmount, newEndTime);
    }

    /**
     * @dev End an auction (can be called by anyone after end time)
     */
    function endAuction(bytes32 auctionId) external nonReentrant validAuction(auctionId) {
        Auction storage auction = auctions[auctionId];
        require(auction.status == AuctionStatus.Active, "EnglishAuction: Auction not active");
        require(block.timestamp >= auction.endTime, "EnglishAuction: Auction still active");

        auction.status = AuctionStatus.Ended;

        if (auction.highestBidder != address(0) && auction.currentBid >= auction.reservePrice) {
            // Successful auction
            emit AuctionEnded(auctionId, auction.highestBidder, auction.currentBid);

            // Transfer NFT to winner
            if (auction.tokenType == TokenType.ERC721) {
                IERC721(auction.nftContract).safeTransferFrom(auction.seller, auction.highestBidder, auction.tokenId);
            } else {
                IERC1155(auction.nftContract).safeTransferFrom(
                    auction.seller,
                    auction.highestBidder,
                    auction.tokenId,
                    auction.amount,
                    ""
                );
            }

            // Process payment distribution
            _distributePayment(auctionId);
        } else {
            // Failed auction - refund highest bidder
            if (auction.highestBidder != address(0)) {
                bidRefunds[auctionId][auction.highestBidder] += auction.currentBid;
            }
            emit AuctionEnded(auctionId, address(0), 0);
        }
    }

    /**
     * @dev Cancel an auction (only before first bid or by admin)
     */
    function cancelAuction(bytes32 auctionId) external nonReentrant validAuction(auctionId) {
        Auction storage auction = auctions[auctionId];
        require(auction.status == AuctionStatus.Active, "EnglishAuction: Auction not active");
        require(
            msg.sender == auction.seller && auction.currentBid == 0 ||
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "EnglishAuction: Cannot cancel auction"
        );

        auction.status = AuctionStatus.Cancelled;

        // Refund highest bidder if exists
        if (auction.highestBidder != address(0)) {
            bidRefunds[auctionId][auction.highestBidder] += auction.currentBid;
        }

        emit AuctionCancelled(auctionId);
    }

    /**
     * @dev Withdraw available refunds
     */
    function withdrawRefund(bytes32 auctionId) external nonReentrant {
        uint256 refundAmount = bidRefunds[auctionId][msg.sender];
        require(refundAmount > 0, "EnglishAuction: No refund available");

        bidRefunds[auctionId][msg.sender] = 0;
        Auction storage auction = auctions[auctionId];

        if (auction.paymentToken == address(0)) {
            payable(msg.sender).sendValue(refundAmount);
        } else {
            IERC20(auction.paymentToken).safeTransfer(msg.sender, refundAmount);
        }

        emit FundsWithdrawn(auctionId, msg.sender, refundAmount);
    }

    /**
     * @dev Internal function to distribute payment after successful auction
     */
    function _distributePayment(bytes32 auctionId) internal {
        Auction storage auction = auctions[auctionId];
        require(!auction.fundsWithdrawn, "EnglishAuction: Funds already withdrawn");

        auction.fundsWithdrawn = true;
        uint256 totalAmount = auction.currentBid;

        // Calculate fees and royalties
        uint256 marketplaceFee = totalAmount.calculatePercentage(feeConfig.marketplaceFee);
        (address royaltyRecipient, uint256 royaltyAmount) = auction.nftContract.getRoyaltyInfo(
            auction.tokenId,
            totalAmount
        );

        uint256 sellerProceeds = totalAmount - marketplaceFee - royaltyAmount;

        // Distribute payments
        if (auction.paymentToken == address(0)) {
            // ETH payments
            if (royaltyAmount > 0 && royaltyRecipient != address(0)) {
                payable(royaltyRecipient).sendValue(royaltyAmount);
            }

            if (marketplaceFee > 0) {
                payable(feeConfig.treasuryAddress).sendValue(marketplaceFee);
            }

            payable(auction.seller).sendValue(sellerProceeds);
        } else {
            // ERC20 payments
            IERC20 paymentToken = IERC20(auction.paymentToken);

            if (royaltyAmount > 0 && royaltyRecipient != address(0)) {
                paymentToken.safeTransfer(royaltyRecipient, royaltyAmount);
            }

            if (marketplaceFee > 0) {
                paymentToken.safeTransfer(feeConfig.treasuryAddress, marketplaceFee);
            }

            paymentToken.safeTransfer(auction.seller, sellerProceeds);
        }
    }

    /**
     * @dev Update marketplace fee configuration
     */
    function updateFeeConfig(uint256 newFee, address newTreasury) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newFee <= 1000, "EnglishAuction: Fee too high");
        require(newTreasury != address(0), "EnglishAuction: Invalid treasury");

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

    /**
     * @dev Get refund amount for a bidder
     */
    function getRefundAmount(bytes32 auctionId, address bidder) external view returns (uint256) {
        return bidRefunds[auctionId][bidder];
    }
}
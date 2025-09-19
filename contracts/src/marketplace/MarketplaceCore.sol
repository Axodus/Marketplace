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
 * @title MarketplaceCore
 * @dev Core marketplace functionality for fixed price sales with royalty and fee distribution
 */
contract MarketplaceCore is AccessControlLib, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using Address for address payable;
    using SafeMathExt for uint256;
    using RoyaltyLib for address;

    enum TokenType { ERC721, ERC1155 }
    
    struct Listing {
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 amount; // 1 for ERC721, > 1 for ERC1155
        uint256 price;
        address paymentToken; // address(0) for ETH
        TokenType tokenType;
        bool active;
        uint256 createdAt;
    }

    struct FeeConfig {
        uint256 marketplaceFee; // basis points (100 = 1%)
        address treasuryAddress;
    }

    // State variables
    mapping(bytes32 => Listing) public listings;
    mapping(address => bool) public supportedPaymentTokens;
    FeeConfig public feeConfig;
    
    // Events
    event ListingCreated(
        bytes32 indexed listingId,
        address indexed seller,
        address indexed nftContract,
        uint256 tokenId,
        uint256 amount,
        uint256 price,
        address paymentToken
    );
    
    event ListingCancelled(bytes32 indexed listingId, address indexed seller);
    
    event ItemSold(
        bytes32 indexed listingId,
        address indexed buyer,
        address indexed seller,
        uint256 price,
        uint256 marketplaceFee,
        uint256 royalty
    );
    
    event FeeConfigUpdated(uint256 newFee, address newTreasury);
    event PaymentTokenUpdated(address indexed token, bool supported);

    modifier validListing(bytes32 listingId) {
        require(listings[listingId].active, "MarketplaceCore: Listing not active");
        _;
    }

    modifier onlySeller(bytes32 listingId) {
        require(listings[listingId].seller == msg.sender, "MarketplaceCore: Not the seller");
        _;
    }

    constructor(
        address admin,
        uint256 _marketplaceFee,
        address _treasuryAddress
    ) {
        require(admin != address(0), "MarketplaceCore: Invalid admin");
        require(_treasuryAddress != address(0), "MarketplaceCore: Invalid treasury");
        require(_marketplaceFee <= 1000, "MarketplaceCore: Fee too high"); // Max 10%
        
        _initializeAccessControl(admin);
        _grantRole(PAUSER_ROLE, admin);
        
        feeConfig = FeeConfig({
            marketplaceFee: _marketplaceFee,
            treasuryAddress: _treasuryAddress
        });
        
        // ETH is supported by default
        supportedPaymentTokens[address(0)] = true;
    }

    /**
     * @dev Create a fixed price listing
     * @param nftContract NFT contract address
     * @param tokenId Token ID to sell
     * @param amount Amount to sell (1 for ERC721, > 1 for ERC1155)
     * @param price Sale price
     * @param paymentToken Payment token address (address(0) for ETH)
     * @param tokenType Type of token (ERC721 or ERC1155)
     * @return listingId Unique identifier for the listing
     */
    function createListing(
        address nftContract,
        uint256 tokenId,
        uint256 amount,
        uint256 price,
        address paymentToken,
        TokenType tokenType
    ) external whenNotPaused nonReentrant returns (bytes32 listingId) {
        require(nftContract != address(0), "MarketplaceCore: Invalid NFT contract");
        require(amount > 0, "MarketplaceCore: Invalid amount");
        require(price > 0, "MarketplaceCore: Invalid price");
        require(supportedPaymentTokens[paymentToken], "MarketplaceCore: Unsupported payment token");
        
        // Validate token ownership and approval
        if (tokenType == TokenType.ERC721) {
            require(amount == 1, "MarketplaceCore: ERC721 amount must be 1");
            require(IERC721(nftContract).ownerOf(tokenId) == msg.sender, "MarketplaceCore: Not token owner");
            require(
                IERC721(nftContract).isApprovedForAll(msg.sender, address(this)) ||
                IERC721(nftContract).getApproved(tokenId) == address(this),
                "MarketplaceCore: Not approved for transfer"
            );
        } else {
            require(IERC1155(nftContract).balanceOf(msg.sender, tokenId) >= amount, "MarketplaceCore: Insufficient balance");
            require(
                IERC1155(nftContract).isApprovedForAll(msg.sender, address(this)),
                "MarketplaceCore: Not approved for transfer"
            );
        }
        
        listingId = keccak256(abi.encodePacked(nftContract, tokenId, msg.sender, block.timestamp));
        
        listings[listingId] = Listing({
            seller: msg.sender,
            nftContract: nftContract,
            tokenId: tokenId,
            amount: amount,
            price: price,
            paymentToken: paymentToken,
            tokenType: tokenType,
            active: true,
            createdAt: block.timestamp
        });
        
        emit ListingCreated(listingId, msg.sender, nftContract, tokenId, amount, price, paymentToken);
    }

    /**
     * @dev Buy an item from a fixed price listing
     * @param listingId Listing identifier
     */
    function buyItem(bytes32 listingId) external payable whenNotPaused nonReentrant validListing(listingId) {
        Listing storage listing = listings[listingId];
        require(listing.seller != msg.sender, "MarketplaceCore: Cannot buy own item");
        
        uint256 totalPrice = listing.price;
        
        // Handle payment
        if (listing.paymentToken == address(0)) {
            require(msg.value >= totalPrice, "MarketplaceCore: Insufficient ETH");
        } else {
            require(msg.value == 0, "MarketplaceCore: ETH not expected");
            require(
                IERC20(listing.paymentToken).balanceOf(msg.sender) >= totalPrice,
                "MarketplaceCore: Insufficient token balance"
            );
        }
        
        // Calculate fees and royalties
        uint256 marketplaceFee = totalPrice.calculatePercentage(feeConfig.marketplaceFee);
        (address royaltyRecipient, uint256 royaltyAmount) = listing.nftContract.getRoyaltyInfo(
            listing.tokenId,
            totalPrice
        );
        
        uint256 sellerProceeds = totalPrice - marketplaceFee - royaltyAmount;
        
        // Mark listing as inactive
        listing.active = false;
        
        // Transfer NFT
        if (listing.tokenType == TokenType.ERC721) {
            IERC721(listing.nftContract).safeTransferFrom(listing.seller, msg.sender, listing.tokenId);
        } else {
            IERC1155(listing.nftContract).safeTransferFrom(
                listing.seller,
                msg.sender,
                listing.tokenId,
                listing.amount,
                ""
            );
        }
        
        // Process payments
        if (listing.paymentToken == address(0)) {
            // ETH payments
            if (royaltyAmount > 0 && royaltyRecipient != address(0)) {
                payable(royaltyRecipient).sendValue(royaltyAmount);
            }
            
            if (marketplaceFee > 0) {
                payable(feeConfig.treasuryAddress).sendValue(marketplaceFee);
            }
            
            payable(listing.seller).sendValue(sellerProceeds);
            
            // Refund excess ETH
            if (msg.value > totalPrice) {
                payable(msg.sender).sendValue(msg.value - totalPrice);
            }
        } else {
            // ERC20 payments
            IERC20 paymentToken = IERC20(listing.paymentToken);
            
            if (royaltyAmount > 0 && royaltyRecipient != address(0)) {
                paymentToken.safeTransferFrom(msg.sender, royaltyRecipient, royaltyAmount);
            }
            
            if (marketplaceFee > 0) {
                paymentToken.safeTransferFrom(msg.sender, feeConfig.treasuryAddress, marketplaceFee);
            }
            
            paymentToken.safeTransferFrom(msg.sender, listing.seller, sellerProceeds);
        }
        
        emit ItemSold(listingId, msg.sender, listing.seller, totalPrice, marketplaceFee, royaltyAmount);
    }

    /**
     * @dev Cancel an active listing
     * @param listingId Listing identifier
     */
    function cancelListing(bytes32 listingId) external nonReentrant validListing(listingId) onlySeller(listingId) {
        listings[listingId].active = false;
        emit ListingCancelled(listingId, msg.sender);
    }

    /**
     * @dev Update marketplace fee configuration
     * @param newFee New marketplace fee in basis points
     * @param newTreasury New treasury address
     */
    function updateFeeConfig(uint256 newFee, address newTreasury) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newFee <= 1000, "MarketplaceCore: Fee too high");
        require(newTreasury != address(0), "MarketplaceCore: Invalid treasury");
        
        feeConfig.marketplaceFee = newFee;
        feeConfig.treasuryAddress = newTreasury;
        
        emit FeeConfigUpdated(newFee, newTreasury);
    }

    /**
     * @dev Update supported payment token status
     * @param token Token address
     * @param supported Whether the token is supported
     */
    function updatePaymentToken(address token, bool supported) external onlyRole(DEFAULT_ADMIN_ROLE) {
        supportedPaymentTokens[token] = supported;
        emit PaymentTokenUpdated(token, supported);
    }

    /**
     * @dev Get listing details
     * @param listingId Listing identifier
     * @return listing Listing struct
     */
    function getListing(bytes32 listingId) external view returns (Listing memory) {
        return listings[listingId];
    }
}
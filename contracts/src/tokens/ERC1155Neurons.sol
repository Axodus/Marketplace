// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/extensions/AccessControlEnumerable.sol";
import "../libs/AccessControlLib.sol";
import "../libs/RoyaltyLib.sol";

/**
 * @title ERC1155Neurons
 * @dev ERC1155 multi-token with royalties, supply tracking and access control
 */
contract ERC1155Neurons is 
    ERC1155, 
    ERC1155Pausable, 
    ERC1155Supply,
    AccessControlLib,
    ReentrancyGuard,
    IERC2981
{
    using RoyaltyLib for RoyaltyLib.RoyaltyInfo;

    struct TokenInfo {
        string uri;
        uint256 maxSupply;
        uint256 mintPrice;
        RoyaltyLib.RoyaltyInfo royalty;
        bool exists;
    }

    mapping(uint256 => TokenInfo) public tokenInfo;
    mapping(address => bool) public allowedMinters;
    uint256 private _nextTokenId = 1;

    event TokenCreated(
        uint256 indexed tokenId,
        string uri,
        uint256 maxSupply,
        uint256 mintPrice,
        address royaltyRecipient,
        uint96 royaltyFee
    );
    event TokenMinted(uint256 indexed tokenId, address indexed to, uint256 amount);
    event MinterStatusUpdated(address indexed minter, bool allowed);

    modifier onlyAllowedMinter() {
        require(
            allowedMinters[msg.sender] || hasRole(OPERATOR_ROLE, msg.sender),
            "ERC1155Neurons: Not allowed to mint"
        );
        _;
    }

    modifier tokenExists(uint256 tokenId) {
        require(tokenInfo[tokenId].exists, "ERC1155Neurons: Token does not exist");
        _;
    }

    constructor(
        string memory uri_,
        address admin
    ) ERC1155(uri_) {
        require(admin != address(0), "ERC1155Neurons: Invalid admin");
        
        _initializeAccessControl(admin);
        _grantRole(PAUSER_ROLE, admin);
    }

    /**
     * @dev Create a new token type
     * @param uri_ Metadata URI for the token
     * @param maxSupply Maximum supply for this token (0 = unlimited)
     * @param mintPrice Price to mint one token in wei
     * @param royaltyRecipient Address to receive royalties
     * @param royaltyFee Royalty fee in basis points (max 1000 = 10%)
     * @return tokenId The ID of the created token
     */
    function createToken(
        string memory uri_,
        uint256 maxSupply,
        uint256 mintPrice,
        address royaltyRecipient,
        uint96 royaltyFee
    ) external onlyOperator returns (uint256 tokenId) {
        require(bytes(uri_).length > 0, "ERC1155Neurons: Empty URI");
        RoyaltyLib.validateRoyaltyFee(royaltyFee);
        
        tokenId = _nextTokenId++;
        
        tokenInfo[tokenId] = TokenInfo({
            uri: uri_,
            maxSupply: maxSupply,
            mintPrice: mintPrice,
            royalty: RoyaltyLib.RoyaltyInfo(royaltyRecipient, royaltyFee),
            exists: true
        });
        
        emit TokenCreated(tokenId, uri_, maxSupply, mintPrice, royaltyRecipient, royaltyFee);
    }

    /**
     * @dev Mint tokens to an address
     * @param to Address to mint tokens to
     * @param tokenId Token ID to mint
     * @param amount Amount of tokens to mint
     */
    function mint(
        address to,
        uint256 tokenId,
        uint256 amount
    ) external payable onlyAllowedMinter nonReentrant whenNotPaused tokenExists(tokenId) {
        require(to != address(0), "ERC1155Neurons: Invalid recipient");
        require(amount > 0, "ERC1155Neurons: Invalid amount");
        
        TokenInfo storage token = tokenInfo[tokenId];
        
        // Check supply limits
        if (token.maxSupply > 0) {
            require(
                totalSupply(tokenId) + amount <= token.maxSupply,
                "ERC1155Neurons: Exceeds max supply"
            );
        }
        
        // Check payment
        uint256 totalPrice = token.mintPrice * amount;
        require(msg.value >= totalPrice, "ERC1155Neurons: Insufficient payment");
        
        _mint(to, tokenId, amount, "");
        emit TokenMinted(tokenId, to, amount);
    }

    /**
     * @dev Batch mint multiple token types
     * @param to Address to mint tokens to
     * @param tokenIds Array of token IDs to mint
     * @param amounts Array of amounts to mint for each token ID
     */
    function mintBatch(
        address to,
        uint256[] memory tokenIds,
        uint256[] memory amounts
    ) external payable onlyAllowedMinter nonReentrant whenNotPaused {
        require(to != address(0), "ERC1155Neurons: Invalid recipient");
        require(tokenIds.length == amounts.length, "ERC1155Neurons: Array length mismatch");
        
        uint256 totalPrice = 0;
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(tokenInfo[tokenIds[i]].exists, "ERC1155Neurons: Token does not exist");
            require(amounts[i] > 0, "ERC1155Neurons: Invalid amount");
            
            TokenInfo storage token = tokenInfo[tokenIds[i]];
            
            // Check supply limits
            if (token.maxSupply > 0) {
                require(
                    totalSupply(tokenIds[i]) + amounts[i] <= token.maxSupply,
                    "ERC1155Neurons: Exceeds max supply"
                );
            }
            
            totalPrice += token.mintPrice * amounts[i];
            emit TokenMinted(tokenIds[i], to, amounts[i]);
        }
        
        require(msg.value >= totalPrice, "ERC1155Neurons: Insufficient payment");
        _mintBatch(to, tokenIds, amounts, "");
    }

    /**
     * @dev Set minter status
     * @param minter Address to update minter status for
     * @param allowed Whether the address is allowed to mint
     */
    function setMinterStatus(address minter, bool allowed) external onlyRole(DEFAULT_ADMIN_ROLE) {
        allowedMinters[minter] = allowed;
        emit MinterStatusUpdated(minter, allowed);
    }

    /**
     * @dev Update token URI
     * @param tokenId Token ID to update
     * @param newUri New URI for the token
     */
    function setTokenURI(uint256 tokenId, string memory newUri) external onlyOperator tokenExists(tokenId) {
        tokenInfo[tokenId].uri = newUri;
    }

    /**
     * @dev Update token mint price
     * @param tokenId Token ID to update
     * @param newPrice New mint price
     */
    function setTokenMintPrice(uint256 tokenId, uint256 newPrice) external onlyOperator tokenExists(tokenId) {
        tokenInfo[tokenId].mintPrice = newPrice;
    }

    /**
     * @dev Withdraw contract balance
     */
    function withdraw() external onlyTreasury nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "ERC1155Neurons: No funds to withdraw");
        
        (bool success, ) = payable(msg.sender).call{value: balance}("");
        require(success, "ERC1155Neurons: Withdrawal failed");
    }

    /**
     * @dev Get token URI for a specific token ID
     * @param tokenId Token ID to get URI for
     * @return Token URI
     */
    function uri(uint256 tokenId) public view override tokenExists(tokenId) returns (string memory) {
        return tokenInfo[tokenId].uri;
    }

    /**
     * @dev Get royalty information for a token (EIP-2981)
     * @param tokenId Token ID to get royalty info for
     * @param salePrice Sale price to calculate royalty from
     * @return receiver Royalty recipient address
     * @return royaltyAmount Calculated royalty amount
     */
    function royaltyInfo(
        uint256 tokenId,
        uint256 salePrice
    ) external view override tokenExists(tokenId) returns (address receiver, uint256 royaltyAmount) {
        return tokenInfo[tokenId].royalty.calculateRoyalty(salePrice);
    }

    /**
     * @dev Check if the contract supports an interface
     * @param interfaceId Interface ID to check
     * @return True if the interface is supported
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControlEnumerable, IERC165)
        returns (bool)
    {
        return interfaceId == type(IERC2981).interfaceId || super.supportsInterface(interfaceId);
    }

    // Override functions for multiple inheritance
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal override(ERC1155, ERC1155Pausable, ERC1155Supply) {
        super._update(from, to, ids, values);
    }
}
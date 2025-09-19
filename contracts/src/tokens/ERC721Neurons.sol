// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/extensions/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "../libs/AccessControlLib.sol";

/**
 * @title ERC721Neurons
 * @dev ERC721 token with royalties, pausable functionality and access control
 */
contract ERC721Neurons is 
    ERC721, 
    ERC721URIStorage, 
    ERC721Royalty, 
    ERC721Pausable,
    AccessControlLib,
    ReentrancyGuard 
{
    uint256 private _nextTokenId;
    uint256 public maxSupply;
    uint256 public mintPrice;
    
    mapping(address => bool) public allowedMinters;
    
    event TokenMinted(
        uint256 indexed tokenId, 
        address indexed to, 
        string tokenURI, 
        address royaltyRecipient, 
        uint96 royaltyFee
    );
    event MintPriceUpdated(uint256 oldPrice, uint256 newPrice);
    event MaxSupplyUpdated(uint256 oldSupply, uint256 newSupply);
    event MinterStatusUpdated(address indexed minter, bool allowed);

    modifier onlyAllowedMinter() {
        require(
            allowedMinters[msg.sender] || hasRole(OPERATOR_ROLE, msg.sender),
            "ERC721Neurons: Not allowed to mint"
        );
        _;
    }

    constructor(
        string memory name,
        string memory symbol,
        uint256 _maxSupply,
        uint256 _mintPrice,
        address admin
    ) ERC721(name, symbol) {
        require(_maxSupply > 0, "ERC721Neurons: Invalid max supply");
        require(admin != address(0), "ERC721Neurons: Invalid admin");
        
        maxSupply = _maxSupply;
        mintPrice = _mintPrice;
        _nextTokenId = 1;
        
        _initializeAccessControl(admin);
        _grantRole(PAUSER_ROLE, admin);
    }

    /**
     * @dev Mint a new token with royalty information
     * @param to Address to mint the token to
     * @param tokenURI Metadata URI for the token
     * @param royaltyRecipient Address to receive royalties
     * @param royaltyFee Royalty fee in basis points (max 1000 = 10%)
     */
    function mint(
        address to,
        string memory uri,
        address royaltyRecipient,
        uint96 royaltyFee
    ) external payable onlyAllowedMinter nonReentrant whenNotPaused {
        require(to != address(0), "ERC721Neurons: Invalid recipient");
        require(_nextTokenId <= maxSupply, "ERC721Neurons: Max supply reached");
        require(msg.value >= mintPrice, "ERC721Neurons: Insufficient payment");
        require(royaltyFee <= 1000, "ERC721Neurons: Royalty fee too high");
        
        uint256 tokenId = _nextTokenId++;
        
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, uri);
        
        if (royaltyRecipient != address(0) && royaltyFee > 0) {
            _setTokenRoyalty(tokenId, royaltyRecipient, royaltyFee);
        }
        
    emit TokenMinted(tokenId, to, uri, royaltyRecipient, royaltyFee);
    }

    /**
     * @dev Batch mint tokens
     * @param recipients Array of addresses to mint tokens to
     * @param tokenURIs Array of metadata URIs
     * @param royaltyRecipients Array of royalty recipients
     * @param royaltyFees Array of royalty fees
     */
    function batchMint(
        address[] calldata recipients,
        string[] calldata tokenURIs,
        address[] calldata royaltyRecipients,
        uint96[] calldata royaltyFees
    ) external payable onlyOperator nonReentrant whenNotPaused {
        require(recipients.length == tokenURIs.length, "ERC721Neurons: Array length mismatch");
        require(recipients.length == royaltyRecipients.length, "ERC721Neurons: Array length mismatch");
        require(recipients.length == royaltyFees.length, "ERC721Neurons: Array length mismatch");
        require(_nextTokenId + recipients.length - 1 <= maxSupply, "ERC721Neurons: Exceeds max supply");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "ERC721Neurons: Invalid recipient");
            require(royaltyFees[i] <= 1000, "ERC721Neurons: Royalty fee too high");
            
            uint256 tokenId = _nextTokenId++;
            
            _safeMint(recipients[i], tokenId);
            _setTokenURI(tokenId, tokenURIs[i]);
            
            if (royaltyRecipients[i] != address(0) && royaltyFees[i] > 0) {
                _setTokenRoyalty(tokenId, royaltyRecipients[i], royaltyFees[i]);
            }
            
            emit TokenMinted(tokenId, recipients[i], tokenURIs[i], royaltyRecipients[i], royaltyFees[i]);
        }
    }

    /**
     * @dev Set mint price
     * @param newPrice New mint price in wei
     */
    function setMintPrice(uint256 newPrice) external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 oldPrice = mintPrice;
        mintPrice = newPrice;
        emit MintPriceUpdated(oldPrice, newPrice);
    }

    /**
     * @dev Set maximum supply
     * @param newMaxSupply New maximum supply (can only increase)
     */
    function setMaxSupply(uint256 newMaxSupply) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newMaxSupply >= _nextTokenId - 1, "ERC721Neurons: Cannot decrease below current supply");
        uint256 oldSupply = maxSupply;
        maxSupply = newMaxSupply;
        emit MaxSupplyUpdated(oldSupply, newMaxSupply);
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
     * @dev Withdraw contract balance
     */
    function withdraw() external onlyTreasury nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "ERC721Neurons: No funds to withdraw");
        
        (bool success, ) = payable(msg.sender).call{value: balance}("");
        require(success, "ERC721Neurons: Withdrawal failed");
    }

    /**
     * @dev Get total minted tokens
     */
    function totalSupply() external view returns (uint256) {
        return _nextTokenId - 1;
    }

    // Override functions
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Pausable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, ERC721Royalty, AccessControlEnumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
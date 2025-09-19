// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@layerzerolabs/solidity-examples/contracts/token/oft/v2/OFTCoreV2.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../libs/AccessControlLib.sol";

/**
 * @title OFTAdapter
 * @dev LayerZero OFT adapter for cross-chain NFT bridging
 * Supports both ERC721 and ERC1155 tokens with lock/mint and burn/unlock mechanisms
 */
contract OFTAdapter is OFTCoreV2, AccessControlLib, ReentrancyGuard {
    
    enum TokenType { ERC721, ERC1155 }
    
    struct BridgedToken {
        address originalContract;
        uint256 originalChainId;
        TokenType tokenType;
        bool isOriginal; // true if this is the original chain
    }

    struct CrossChainTransfer {
        address from;
        address to;
        address nftContract;
        uint256 tokenId;
        uint256 amount; // 1 for ERC721, >1 for ERC1155
        uint16 dstChainId;
        TokenType tokenType;
        uint256 timestamp;
    }

    // Mappings
    mapping(address => BridgedToken) public bridgedTokens;
    mapping(bytes32 => CrossChainTransfer) public pendingTransfers;
    mapping(address => mapping(uint256 => bool)) public lockedTokens; // nftContract => tokenId => isLocked
    mapping(address => mapping(uint256 => uint256)) public lockedAmounts; // for ERC1155
    
    // Events
    event TokenRegistered(address indexed nftContract, uint256 originalChainId, TokenType tokenType, bool isOriginal);
    event TokenLocked(address indexed nftContract, uint256 indexed tokenId, uint256 amount, address indexed owner);
    event TokenUnlocked(address indexed nftContract, uint256 indexed tokenId, uint256 amount, address indexed owner);
    event CrossChainTransferInitiated(
        bytes32 indexed transferId,
        address indexed from,
        address indexed to,
        address nftContract,
        uint256 tokenId,
        uint256 amount,
        uint16 dstChainId
    );
    event CrossChainTransferCompleted(bytes32 indexed transferId);

    modifier onlyRegisteredToken(address nftContract) {
        require(bridgedTokens[nftContract].originalContract != address(0), "OFTAdapter: Token not registered");
        _;
    }

    constructor(
        address _lzEndpoint,
        address admin
    ) OFTCoreV2(8, _lzEndpoint) {
        require(admin != address(0), "OFTAdapter: Invalid admin");
        _initializeAccessControl(admin);
        _grantRole(PAUSER_ROLE, admin);
    }

    /**
     * @dev Register a token for cross-chain bridging
     * @param nftContract NFT contract address
     * @param originalChainId Chain ID where the token was originally deployed
     * @param tokenType Type of token (ERC721 or ERC1155)
     * @param isOriginal Whether this is the original deployment chain
     */
    function registerToken(
        address nftContract,
        uint256 originalChainId,
        TokenType tokenType,
        bool isOriginal
    ) external onlyOperator {
        require(nftContract != address(0), "OFTAdapter: Invalid contract address");
        require(bridgedTokens[nftContract].originalContract == address(0), "OFTAdapter: Token already registered");

        bridgedTokens[nftContract] = BridgedToken({
            originalContract: nftContract,
            originalChainId: originalChainId,
            tokenType: tokenType,
            isOriginal: isOriginal
        });

        emit TokenRegistered(nftContract, originalChainId, tokenType, isOriginal);
    }

    /**
     * @dev Bridge NFT to another chain
     * @param nftContract NFT contract address
     * @param tokenId Token ID to bridge
     * @param amount Amount to bridge (1 for ERC721, >1 for ERC1155)
     * @param to Recipient address on destination chain
     * @param dstChainId Destination chain ID
     * @param refundAddress Address to refund excess gas fees
     * @param zroPaymentAddress ZRO payment address (can be address(0))
     * @param adapterParams Adapter parameters for gas settings
     */
    function bridgeNFT(
        address nftContract,
        uint256 tokenId,
        uint256 amount,
        address to,
        uint16 dstChainId,
        address payable refundAddress,
        address zroPaymentAddress,
        bytes calldata adapterParams
    ) external payable whenNotPaused nonReentrant onlyRegisteredToken(nftContract) {
        require(to != address(0), "OFTAdapter: Invalid recipient");
        require(amount > 0, "OFTAdapter: Invalid amount");

        BridgedToken memory token = bridgedTokens[nftContract];
        
        if (token.tokenType == TokenType.ERC721) {
            require(amount == 1, "OFTAdapter: ERC721 amount must be 1");
            require(IERC721(nftContract).ownerOf(tokenId) == msg.sender, "OFTAdapter: Not token owner");
            require(!lockedTokens[nftContract][tokenId], "OFTAdapter: Token already locked");
        } else {
            require(
                IERC1155(nftContract).balanceOf(msg.sender, tokenId) >= amount,
                "OFTAdapter: Insufficient balance"
            );
        }

        bytes32 transferId = keccak256(
            abi.encodePacked(nftContract, tokenId, msg.sender, to, dstChainId, block.timestamp)
        );

        pendingTransfers[transferId] = CrossChainTransfer({
            from: msg.sender,
            to: to,
            nftContract: nftContract,
            tokenId: tokenId,
            amount: amount,
            dstChainId: dstChainId,
            tokenType: token.tokenType,
            timestamp: block.timestamp
        });

        // Lock tokens on original chain or burn on non-original chain
        if (token.isOriginal) {
            _lockToken(nftContract, tokenId, amount, token.tokenType);
        } else {
            _burnToken(nftContract, tokenId, amount, token.tokenType);
        }

        // Prepare cross-chain message
        bytes memory payload = abi.encode(
            transferId,
            msg.sender,
            to,
            nftContract,
            tokenId,
            amount,
            token.tokenType,
            token.originalChainId
        );

        // Send cross-chain message
        _lzSend(
            dstChainId,
            payload,
            refundAddress,
            zroPaymentAddress,
            adapterParams,
            msg.value
        );

        emit CrossChainTransferInitiated(transferId, msg.sender, to, nftContract, tokenId, amount, dstChainId);
    }

    /**
     * @dev Estimate fees for cross-chain transfer
     * @param dstChainId Destination chain ID
     * @param payload Message payload
     * @param useZro Whether to use ZRO token for fees
     * @param adapterParams Adapter parameters
     * @return nativeFee Native token fee amount
     * @return zroFee ZRO token fee amount
     */
    function estimateFees(
        uint16 dstChainId,
        bytes calldata payload,
        bool useZro,
        bytes calldata adapterParams
    ) external view returns (uint256 nativeFee, uint256 zroFee) {
        return lzEndpoint.estimateFees(dstChainId, address(this), payload, useZro, adapterParams);
    }

    /**
     * @dev Handle incoming cross-chain messages
     * @param _srcChainId Source chain ID
     * @param _srcAddress Source address
     * @param _nonce Message nonce
     * @param _payload Message payload
     */
    function _nonblockingLzReceive(
        uint16 _srcChainId,
        bytes memory _srcAddress,
        uint64 _nonce,
        bytes memory _payload
    ) internal override {
        (
            bytes32 transferId,
            address from,
            address to,
            address nftContract,
            uint256 tokenId,
            uint256 amount,
            TokenType tokenType,
            uint256 originalChainId
        ) = abi.decode(_payload, (bytes32, address, address, address, uint256, uint256, TokenType, uint256));

        // Register token if not already registered
        if (bridgedTokens[nftContract].originalContract == address(0)) {
            bool isOriginal = (originalChainId == block.chainid);
            bridgedTokens[nftContract] = BridgedToken({
                originalContract: nftContract,
                originalChainId: originalChainId,
                tokenType: tokenType,
                isOriginal: isOriginal
            });
        }

        BridgedToken memory token = bridgedTokens[nftContract];

        // Unlock tokens on original chain or mint on non-original chain
        if (token.isOriginal) {
            _unlockToken(nftContract, tokenId, amount, to, token.tokenType);
        } else {
            _mintToken(nftContract, tokenId, amount, to, token.tokenType);
        }

        emit CrossChainTransferCompleted(transferId);
    }

    /**
     * @dev Lock token for cross-chain transfer
     */
    function _lockToken(address nftContract, uint256 tokenId, uint256 amount, TokenType tokenType) internal {
        if (tokenType == TokenType.ERC721) {
            IERC721(nftContract).safeTransferFrom(msg.sender, address(this), tokenId);
            lockedTokens[nftContract][tokenId] = true;
        } else {
            IERC1155(nftContract).safeTransferFrom(msg.sender, address(this), tokenId, amount, "");
            lockedAmounts[nftContract][tokenId] += amount;
        }

        emit TokenLocked(nftContract, tokenId, amount, msg.sender);
    }

    /**
     * @dev Unlock token after cross-chain transfer
     */
    function _unlockToken(address nftContract, uint256 tokenId, uint256 amount, address to, TokenType tokenType) internal {
        if (tokenType == TokenType.ERC721) {
            require(lockedTokens[nftContract][tokenId], "OFTAdapter: Token not locked");
            lockedTokens[nftContract][tokenId] = false;
            IERC721(nftContract).safeTransferFrom(address(this), to, tokenId);
        } else {
            require(lockedAmounts[nftContract][tokenId] >= amount, "OFTAdapter: Insufficient locked amount");
            lockedAmounts[nftContract][tokenId] -= amount;
            IERC1155(nftContract).safeTransferFrom(address(this), to, tokenId, amount, "");
        }

        emit TokenUnlocked(nftContract, tokenId, amount, to);
    }

    /**
     * @dev Burn token on non-original chain
     */
    function _burnToken(address nftContract, uint256 tokenId, uint256 amount, TokenType tokenType) internal {
        // This requires the token contract to have burn functionality
        // Implementation depends on the specific token contract interface
        // For simplicity, we'll transfer to a dead address
        if (tokenType == TokenType.ERC721) {
            IERC721(nftContract).safeTransferFrom(msg.sender, address(0xdead), tokenId);
        } else {
            IERC1155(nftContract).safeTransferFrom(msg.sender, address(0xdead), tokenId, amount, "");
        }
    }

    /**
     * @dev Mint token on non-original chain
     */
    function _mintToken(address nftContract, uint256 tokenId, uint256 amount, address to, TokenType tokenType) internal {
        // This requires the token contract to have mint functionality
        // Implementation depends on the specific token contract interface
        // This is a simplified version - actual implementation would need
        // the contracts to have proper mint functions
        revert("OFTAdapter: Minting not implemented - requires custom token contracts");
    }

    /**
     * @dev Emergency function to unlock tokens (admin only)
     */
    function emergencyUnlock(
        address nftContract,
        uint256 tokenId,
        uint256 amount,
        address to
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        BridgedToken memory token = bridgedTokens[nftContract];
        require(token.originalContract != address(0), "OFTAdapter: Token not registered");
        
        _unlockToken(nftContract, tokenId, amount, to, token.tokenType);
    }

    /**
     * @dev Get locked status for ERC721 token
     */
    function isTokenLocked(address nftContract, uint256 tokenId) external view returns (bool) {
        return lockedTokens[nftContract][tokenId];
    }

    /**
     * @dev Get locked amount for ERC1155 token
     */
    function getLockedAmount(address nftContract, uint256 tokenId) external view returns (uint256) {
        return lockedAmounts[nftContract][tokenId];
    }

    /**
     * @dev Get pending transfer details
     */
    function getPendingTransfer(bytes32 transferId) external view returns (CrossChainTransfer memory) {
        return pendingTransfers[transferId];
    }

    // Implementation of abstract functions from OFTCoreV2
    
    /**
     * @dev Debit tokens from source chain
     */
    function _debitFrom(
        address _from,
        uint16 _dstChainId,
        bytes32 _toAddress,
        uint _amount
    ) internal virtual override returns (uint) {
        // This is a simplified implementation for NFT bridging
        // In practice, this would handle the locking/burning logic
        return _amount;
    }

    /**
     * @dev Credit tokens to destination chain
     */
    function _creditTo(
        uint16 _srcChainId,
        address _toAddress,
        uint _amount
    ) internal virtual override returns (uint) {
        // This is a simplified implementation for NFT bridging
        // In practice, this would handle the unlocking/minting logic
        return _amount;
    }

    /**
     * @dev Transfer tokens between addresses
     */
    function _transferFrom(
        address _from,
        address _to,
        uint _amount
    ) internal virtual override returns (uint) {
        // This is a simplified implementation for NFT bridging
        // NFTs don't typically use this pattern, but it's required by the interface
        return _amount;
    }

    /**
     * @dev Get the conversion rate from local decimals to shared decimals
     */
    function _ld2sdRate() internal view virtual override returns (uint) {
        // For NFTs, we typically use 1:1 ratio since NFTs are indivisible
        return 1;
    }
}
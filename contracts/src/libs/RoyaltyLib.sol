// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

/**
 * @title RoyaltyLib
 * @dev Library for handling EIP-2981 royalty calculations and distributions
 */
library RoyaltyLib {
    struct RoyaltyInfo {
        address recipient;
        uint96 feeBasisPoints; // Fee basis points (out of 10,000)
    }

    /**
     * @dev Calculate royalty amount for a given sale price
     * @param royaltyInfo The royalty configuration
     * @param salePrice The sale price of the NFT
     * @return recipient The royalty recipient address
     * @return royaltyAmount The calculated royalty amount
     */
    function calculateRoyalty(
        RoyaltyInfo memory royaltyInfo,
        uint256 salePrice
    ) internal pure returns (address recipient, uint256 royaltyAmount) {
        recipient = royaltyInfo.recipient;
        royaltyAmount = (salePrice * royaltyInfo.feeBasisPoints) / 10000;
    }

    /**
     * @dev Validate royalty fee basis points (max 10%)
     * @param feeBasisPoints Fee basis points to validate
     */
    function validateRoyaltyFee(uint96 feeBasisPoints) internal pure {
        require(feeBasisPoints <= 1000, "RoyaltyLib: Royalty fee too high");
    }

    /**
     * @dev Get royalty info from EIP-2981 compatible contract
     * @param nftContract The NFT contract address
     * @param tokenId The token ID
     * @param salePrice The sale price
     * @return recipient The royalty recipient
     * @return royaltyAmount The royalty amount
     */
    function getRoyaltyInfo(
        address nftContract,
        uint256 tokenId,
        uint256 salePrice
    ) internal view returns (address recipient, uint256 royaltyAmount) {
        if (IERC165(nftContract).supportsInterface(type(IERC2981).interfaceId)) {
            return IERC2981(nftContract).royaltyInfo(tokenId, salePrice);
        }
        return (address(0), 0);
    }
}
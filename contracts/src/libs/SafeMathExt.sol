// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title SafeMathExt
 * @dev Extended safe math utilities for marketplace calculations
 */
library SafeMathExt {
    /**
     * @dev Calculate percentage with basis points (10000 = 100%)
     * @param amount The base amount
     * @param basisPoints The percentage in basis points
     * @return The calculated percentage amount
     */
    function calculatePercentage(
        uint256 amount,
        uint256 basisPoints
    ) internal pure returns (uint256) {
        return (amount * basisPoints) / 10000;
    }

    /**
     * @dev Calculate fee split between multiple recipients
     * @param totalAmount The total amount to split
     * @param percentages Array of percentages in basis points
     * @return splits Array of calculated split amounts
     */
    function calculateSplits(
        uint256 totalAmount,
        uint256[] memory percentages
    ) internal pure returns (uint256[] memory splits) {
        require(percentages.length > 0, "SafeMathExt: Empty percentages");
        
        splits = new uint256[](percentages.length);
        uint256 totalPercentage = 0;
        
        for (uint256 i = 0; i < percentages.length; i++) {
            totalPercentage += percentages[i];
        }
        
        require(totalPercentage <= 10000, "SafeMathExt: Total percentage exceeds 100%");
        
        for (uint256 i = 0; i < percentages.length; i++) {
            splits[i] = calculatePercentage(totalAmount, percentages[i]);
        }
    }

    /**
     * @dev Calculate auction price decrease for Dutch auctions
     * @param startPrice Starting price
     * @param endPrice Ending price
     * @param duration Total auction duration
     * @param timeElapsed Time elapsed since auction start
     * @return currentPrice Current price based on linear decrease
     */
    function calculateDutchPrice(
        uint256 startPrice,
        uint256 endPrice,
        uint256 duration,
        uint256 timeElapsed
    ) internal pure returns (uint256 currentPrice) {
        require(startPrice > endPrice, "SafeMathExt: Invalid price range");
        require(timeElapsed <= duration, "SafeMathExt: Auction ended");
        
        if (timeElapsed >= duration) {
            return endPrice;
        }
        
        uint256 priceDrop = startPrice - endPrice;
        uint256 priceDecreased = (priceDrop * timeElapsed) / duration;
        
        return startPrice - priceDecreased;
    }

    /**
     * @dev Safely calculate minimum bid increment for English auctions
     * @param currentBid Current highest bid
     * @param minIncrementBps Minimum increment in basis points
     * @return minNextBid Minimum next bid amount
     */
    function calculateMinBidIncrement(
        uint256 currentBid,
        uint256 minIncrementBps
    ) internal pure returns (uint256 minNextBid) {
        uint256 increment = calculatePercentage(currentBid, minIncrementBps);
        return currentBid + increment;
    }
}
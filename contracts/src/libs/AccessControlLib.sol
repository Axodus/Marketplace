// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title AccessControlLib
 * @dev Enhanced access control with role-based permissions and emergency controls
 */
abstract contract AccessControlLib is AccessControl, Pausable {
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant TREASURY_ROLE = keccak256("TREASURY_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);
    event OperatorAdded(address indexed operator);
    event OperatorRemoved(address indexed operator);

    modifier onlyOperator() {
        require(hasRole(OPERATOR_ROLE, msg.sender), "AccessControlLib: Not an operator");
        _;
    }

    modifier onlyTreasury() {
        require(hasRole(TREASURY_ROLE, msg.sender), "AccessControlLib: Not treasury");
        _;
    }

    modifier onlyPauser() {
        require(hasRole(PAUSER_ROLE, msg.sender), "AccessControlLib: Not a pauser");
        _;
    }

    /**
     * @dev Initialize access control with admin
     * @param admin The admin address that will have DEFAULT_ADMIN_ROLE
     */
    function _initializeAccessControl(address admin) internal {
        require(admin != address(0), "AccessControlLib: Invalid admin");
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    /**
     * @dev Set treasury address
     * @param treasury New treasury address
     */
    function setTreasury(address treasury) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(treasury != address(0), "AccessControlLib: Invalid treasury");
        
        address[] memory treasuries = _getRoleMembers(TREASURY_ROLE);
        address oldTreasury = treasuries.length > 0 ? treasuries[0] : address(0);
        
        if (oldTreasury != address(0)) {
            _revokeRole(TREASURY_ROLE, oldTreasury);
        }
        
        _grantRole(TREASURY_ROLE, treasury);
        emit TreasuryUpdated(oldTreasury, treasury);
    }

    /**
     * @dev Add operator
     * @param operator Operator address to add
     */
    function addOperator(address operator) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(operator != address(0), "AccessControlLib: Invalid operator");
        _grantRole(OPERATOR_ROLE, operator);
        emit OperatorAdded(operator);
    }

    /**
     * @dev Remove operator
     * @param operator Operator address to remove
     */
    function removeOperator(address operator) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(OPERATOR_ROLE, operator);
        emit OperatorRemoved(operator);
    }

    /**
     * @dev Pause contract
     */
    function pause() external onlyPauser {
        _pause();
    }

    /**
     * @dev Unpause contract
     */
    function unpause() external onlyPauser {
        _unpause();
    }

    /**
     * @dev Get all members of a role
     * @param role Role identifier
     * @return members Array of addresses with the role
     */
    function _getRoleMembers(bytes32 role) internal view returns (address[] memory members) {
        uint256 count = getRoleMemberCount(role);
        members = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            members[i] = getRoleMember(role, i);
        }
    }
}
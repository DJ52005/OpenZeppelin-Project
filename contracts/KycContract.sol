// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Ownable.sol";

contract KycContract is Ownable {
    mapping(address => bool) private allowed;

    constructor(address initialOwner) Ownable(initialOwner) {} // ✅ Pass to base constructor

    function setKycCompleted(address _addr) public onlyOwner {
        allowed[_addr] = true;
    }

    function setKycRevoked(address _addr) public onlyOwner {
        allowed[_addr] = false;
    }

    function isKycCompleted(address _addr) public view returns (bool) {
        return allowed[_addr];
    }
}

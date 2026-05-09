// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Context.sol";
import "./ReentrancyGuard.sol"; // Local ReentrancyGuard
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Crowdsale is Context, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 private _saleToken;
    address payable private _fundWallet;
    uint256 private _conversionRate;
    uint256 private _weiRaised;

    event TokensPurchased(
        address indexed purchaser,
        address indexed beneficiary,
        uint256 value,
        uint256 amount
    );

    constructor(
        uint256 rate_,
        address payable wallet_,
        IERC20 token_
    ) {
        require(rate_ > 0, "Crowdsale: rate is 0");
        require(wallet_ != address(0), "Crowdsale: wallet is zero address");
        require(address(token_) != address(0), "Crowdsale: token is zero address");

        _conversionRate = rate_;
        _fundWallet = wallet_;
        _saleToken = token_;
    }

    receive() external payable {
        buyTokens(_msgSender());
    }

    function token() public view returns (IERC20) {
        return _saleToken;
    }

    function wallet() public view returns (address payable) {
        return _fundWallet;
    }

    function rate() public view returns (uint256) {
        return _conversionRate;
    }

    function weiRaised() public view returns (uint256) {
        return _weiRaised;
    }

    function buyTokens(address beneficiary) public payable nonReentrant {
        uint256 weiAmount = msg.value;
        _preValidatePurchase(beneficiary, weiAmount);

        uint256 tokens = _getTokenAmount(weiAmount);
        _weiRaised += weiAmount;

        _processPurchase(beneficiary, tokens);
        emit TokensPurchased(_msgSender(), beneficiary, weiAmount, tokens);

        _updatePurchasingState(beneficiary, weiAmount);
        _forwardFunds(weiAmount);
        _postValidatePurchase(beneficiary, weiAmount);
    }

    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal view virtual {
        require(beneficiary != address(0), "Crowdsale: zero address beneficiary");
        require(weiAmount > 0, "Crowdsale: zero weiAmount");
    }

    function _postValidatePurchase(address, uint256) internal view virtual {}

    function _deliverTokens(address beneficiary, uint256 tokenAmount) internal virtual {
        _saleToken.safeTransfer(beneficiary, tokenAmount);
    }

    function _processPurchase(address beneficiary, uint256 tokenAmount) internal virtual {
        _deliverTokens(beneficiary, tokenAmount);
    }

    function _updatePurchasingState(address, uint256) internal virtual {}

    function _getTokenAmount(uint256 weiAmount) internal view returns (uint256) {
        return weiAmount * _conversionRate;
    }

    function _forwardFunds(uint256 weiAmount) internal virtual {
        _fundWallet.transfer(weiAmount);
    }
}

const MyToken = artifacts.require("MyToken");
const MyTokenSale = artifacts.require("MyTokenSale");
var MyKycContract = artifacts.require("KycContract");
require("dotenv").config({path: "../.env"});
console.log(process.env);

module.exports = async function (deployer, network, accounts) {
  const initialSupply = web3.utils.toWei("1000000", "ether"); // 1 million tokens

  // Get the deployer address (first account)
  const addr = accounts[0];

  // Deploy token
  await deployer.deploy(MyToken, process.env.INITIAL_TOKENS);
  await deployer.deploy(MyKycContract);

  const tokenInstance = await MyToken.deployed();

  // Deploy token sale with token address
  await deployer.deploy(MyTokenSale, 1, addr[0], MyToken.address, MyKycContract.address);
  let instance = await MyToken.deployed();
  await instance.transfer(MyTokenSale.address, 1000000);
};

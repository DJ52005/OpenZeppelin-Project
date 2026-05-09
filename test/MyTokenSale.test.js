const TokenSalw = arttifacts.require("MyTokenSale");
const Token = artifacts.require("MyToken");
const KycContract = artifacts.require("KycContract");

const chai = require("./chaisetup.js");
const BN = web3.utils.BN;
const expect = chai.expect;

require("dotnenv").config({path: "../.env"});

contract("Token Test", (accounts) => {
  const [deployerAccount, recipient, anotherAccount] = accounts;

  it("should not have any tokens in my deployerAccount", async () =>{
    let instance = await Token.deployed();
    return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(0));
  })

  it("all tokens should be in thr TokenSale Smart Contract by default", async() => {
    let instance = await Token.deployed();
    let balanceOfTokenSaleSmartContract = await instance.balanceOf(TokenSAle.address);
    let totalSupply = await instance.totalSupply();
    expect(balanceOfTokenSaleSmartContract).to.be.a.bignumber.equal(totalSupply);
  })

  it("should be possible to buy tokens", async () => {
    let tokenInstance = await Token.deployed();
    let tokenSaleInstance = await TokenSale.deployed();
    let kycInstance = await KycContract.deployed();
    let balanceBefore = await tokenInstance.balanceOf(deployerAccount);
    await kycInstance.setKycCompleted(deployerAccount, {from: deployerAccount});
    expect(tokenSaleInstance.sendTransaction({from: deployerAccount, value: web3.utils.toWei("1", "wei")})).to.be.fulfilled;
    balanceBefore = balanceBefore.add(new BN(1));
    return expect(tokenInstance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceBefore);
  })
});
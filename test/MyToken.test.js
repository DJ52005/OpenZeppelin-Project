const Token = artifacts.require("MyToken");

const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

require("dotenv").config({path:"../.env"});

contract("Token Test", (accounts) => {
  const [deployerAccount, recipient, anotherAccount] = accounts;

  beforeEach(async () =>{
    this.myToken = await Token.new(process.env.INITIAL_TOKENS);
  })

  it("should assign all tokens to the deployer account", async () => {
    const instance = this.myToken;
    const totalSupply = await instance.totalSupply();
    const balance = await instance.balanceOf(deployerAccount);

    return expect(balance).to.be.a.bignumber.equal(totalSupply); // ✅ no eventually
  });

  it("should be possible to transfer tokens between accounts", async () => {
    const sendTokens = new BN(1);
    const instance = this.myToken;

    const initialDeployerBalance = await instance.balanceOf(deployerAccount);
    const initialRecipientBalance = await instance.balanceOf(recipient);

    // ✅ only this is a promise
    await expect(instance.transfer(recipient, sendTokens)).to.eventually.be.fulfilled;

    const finalDeployerBalance = await instance.balanceOf(deployerAccount);
    const finalRecipientBalance = await instance.balanceOf(recipient);

    expect(finalDeployerBalance).to.be.a.bignumber.equal(initialDeployerBalance.sub(sendTokens));
    return expect(finalRecipientBalance).to.be.a.bignumber.equal(initialRecipientBalance.add(sendTokens));
  });

  it("is not possible to send more oekns than available in total", async () =>{
    let instance = this.myToken;
    let balanceOfDeployer = await instance.balanceOf(deployerAccount);

    expect(instance.transfer(recipient, new BN(balanceOfDeployer+1))).to.eventually.be.rejected;

    return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceOfDeployer);
  })
});

import React, { Component } from "react";
import MyToken from ".//MyToken.json";
import MyTokenSale from "./MyTokenSale.json";
import KycContract from "./KycContract.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = {
    loaded: false,
    kycAddress: "0x123...",
    tokenSaleAddress: null,
    userTokens: 0
  };

  componentDidMount = async () => {
    try {
      this.web3 = await getWeb3();
      this.accounts = await this.web3.eth.getAccounts();
      this.networkId = await this.web3.eth.net.getId();

      this.tokenInstance = new this.web3.eth.Contract(
        MyToken.abi,
        MyToken.networks[this.networkId] && MyToken.networks[this.networkId].address
      );

      this.tokenSaleInstance = new this.web3.eth.Contract(
        MyTokenSale.abi,
        MyTokenSale.networks[this.networkId] && MyTokenSale.networks[this.networkId].address
      );

      this.kycInstance = new this.web3.eth.Contract(
        KycContract.abi,
        KycContract.networks[this.networkId] && KycContract.networks[this.networkId].address
      );

      this.setState({
        loaded: true,
        tokenSaleAddress: MyTokenSale.networks[this.networkId].address
      });

      this.updateUserTokens();
      this.listenToTokenTransfer();
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contracts. Check console for details.`
      );
      console.error(error);
    }
  };

  updateUserTokens = async () => {
    let balance = await this.tokenInstance.methods.balanceOf(this.accounts[0]).call();
    this.setState({ userTokens: balance });
  };

  listenToTokenTransfer = () => {
    this.tokenInstance.events.Transfer({ to: this.accounts[0] }).on("data", this.updateUserTokens);
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value });
  };

  handleKycWhitelisting = async () => {
    await this.kycInstance.methods.setKycCompleted(this.state.kycAddress).send({ from: this.accounts[0] });
    alert("KYC for address " + this.state.kycAddress + " is completed");
  };
 
  handleBuyTokens = async () => {
    await this.tokenSaleInstance.methods.buyTokens(this.accounts[0]).send({ from: this.accounts[0], value: this.web3.utils.toWei("1", "wei") });
  };


  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contracts...</div>;
    }
    return (
      <div className="App">
        <h1>StarDucks Cappucino Token Sale</h1>
        <p>Get your tokens today</p>
        <h2>KYC Whitelisting</h2>
        Address to allow: <input type="text" name="kycAddress" value={this.state.kycAddress} onChange = {this.handleInputChange}/>
        <button type="button" onClick={this.handleKycWhitelisting}>Add to Whitelisting</button>
        <h2>Buy Tokens</h2>
        <p>if you want to buy tokens, send Wei to this address: {this.state.tokenSaleAddress}</p>
        <p>Yiu currentky have : {this.state.userTokens} CAPPU Tokens</p>
        <button type="button" onClick={this.handleBuyTokens}>Buy More Tokens</button>
      </div>
    );
  }
}

export default App;

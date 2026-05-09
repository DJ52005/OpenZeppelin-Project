const path = require("path");
require("dotenv").config({ path: "./.env" });

const HDWalletProvider = require("@truffle/hdwallet-provider");

const AccountIndex = 0;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Ganache local server
      port: 7545,
      network_id: 5777,      // Match with Ganache's network id
    },
    ganache_local: {
      provider: function () {
        if (!process.env.MNEMONIC) {
          throw new Error("MNEMONIC is not defined in .env");
        }
        return new HDWalletProvider(
          process.env.MNEMONIC,
          "http://127.0.0.1:7545",
          AccountIndex
        );
      },
      network_id: 5777
    }
  },

  compilers: {
    solc: {
      version: "0.8.20"
    }
  },

  mocha: {
    // timeout: 100000
  }  // <--- comma was missing here in your version
};

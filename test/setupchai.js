"use strict";
const chai = require("chai");

const BN = web3.utils.BN;
const chaiBN = require("chai-bn")(BN);
chai.use(require("chai-bn")(BN));
chai.use(require("chai-as-promised"));

const expect = chai.expect;
module.exports = chai;
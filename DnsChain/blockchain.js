const SHA256 = require("crypto-js/sha256");
const EC = require("elliptic").ec;

const { Transaction } = require("./transaction");
const { DomainRegistry } = require("./smartContract");
const { DnsCoin } = require("./wallet.js");

const ec = new EC("secp256k1");
class Block {
  constructor(timestamp, transactions, previousHash = "") {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.previousHash +
        this.timestamp +
        JSON.stringify(this.transactions) +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log("Block mined:", this.hash);
  }
}
class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.pendingTransactions = [];
    this.difficulty = 2;
    this.minerReward = 100;
    this.smartContract = new DomainRegistry();
    this.dnsCoin = new DnsCoin();
  }

  createGenesisBlock() {
    const data = {
      from: "",
      to: "",
      data: "Genesis block",
    };
    return new Block(Date.now(), [data], "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(minerAddress) {
    const rewardTx = new Transaction(
      "",
      minerAddress,
      "reward",
      this.minerReward
    );
    this.pendingTransactions.push(rewardTx);
    const block = new Block(
      Date.now(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );
    block.mineBlock(this.difficulty);

    this.dnsCoin.add(minerAddress, this.minerReward);
    console.log("Block successfully mined!");
    this.chain.push(block);

    this.pendingTransactions = [];
  }

  addTransaction(transaction) {
    if (!transaction.from || !transaction.to) {
      throw new Error("Transaction must include from and to address");
    }

    if (!transaction.isValid()) {
      throw new Error("Cannot add invalid transaction to chain");
    }
    if (
      transaction.to === this.smartContract.getPublicKey() &&
      transaction.type === "smartContract"
    ) {
      this.pendingTransactions.push(transaction);
      this.smartContract.processTransaction(transaction);
    }
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }
}

module.exports = { Blockchain, Block };

const SHA256 = require("crypto-js/sha256");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

class Transaction {
  constructor(from, to, data) {
    this.from = from;
    this.to = to;
    this.data = data;
    this.timestamp = Date.now();
    this.nonce = 0;
    this.hash = this.calculateHash();
    this.signature = "";
  }

  calculateHash() {
    return SHA256(
      this.from +
        this.to +
        JSON.stringify(this.data) +
        this.timestamp +
        this.nonce
    ).toString();
  }

  sign(privateKey) {
    if (!privateKey) {
      throw new Error("No private key provided");
    }
    const hash = this.calculateHash();
    const key = ec.keyFromPrivate(privateKey, "hex");
    const signature = key.sign(hash, "base64");
    this.signature = signature.toDER("hex");
  }

  isValid() {
    if (!this.signature) {
      throw new Error("Transaction signature is missing");
    }

    const publicKey = ec.keyFromPublic(this.from, "hex");
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}

module.exports = { Transaction };

const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

class Wallet {
  constructor() {
    this.keyPair = ec.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode("hex", true);
    this.privateKey = this.keyPair.getPrivate().toString(16);
  }

  getPublicKey() {
    return this.publicKey;
  }

  getPrivateKey() {
    return this.privateKey;
  }
}
class DnsCoin {
  constructor() {
    this.balance = {};
  }

  add(publicKey, amount) {
    if (!this.balance[publicKey]) {
      this.balance[publicKey] = 0;
    }
    this.balance[publicKey] += amount;
  }

  subtract(publicKey, amount) {
    if (!this.balance[publicKey]) {
      throw new Error("Insufficient balance");
    }
    this.balance[publicKey] -= amount;
  }

  getBalance(publicKey) {
    return this.balance[publicKey] || 0;
  }
}
module.exports = { Wallet, DnsCoin };

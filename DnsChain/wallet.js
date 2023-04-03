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

  add(wallet, amount) {
    if (!this.balance[wallet.publicKey]) {
      this.balance[wallet.publicKey] = 0;
    }
    this.balance[wallet.publicKey] += amount;
  }

  subtract(wallet, amount) {
    if (!this.balance[wallet.publicKey]) {
      throw new Error("Insufficient balance");
    }
    this.balance[wallet.publicKey] -= amount;
  }

  getBalance(wallet) {
    return this.balance[wallet.publicKey] || 0;
  }
}
module.exports = { Wallet, DnsCoin };

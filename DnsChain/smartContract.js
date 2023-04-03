const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

class DomainRegistry {
  constructor() {
    this.domains = {};
    this.owner = ec.genKeyPair().getPublic().encode("hex");
  }

  registerDomain(from, domain, ip) {
    this.domains[domain] = { ip, owner: from };
    console.log(`Domain ${domain} registered with IP address ${ip}`);
  }

  transferDomain(domain, newOwner) {
    if (this.domains[domain]) {
      this.domains[domain].owner = newOwner;
      console.log(`Domain ${domain} transferred to ${newOwner}`);
    } else {
      console.log(`Domain ${domain} not found`);
    }
  }

  getDomainInfo(domain) {
    if (domain in this.domains) {
      const { ip, owner } = this.domains[domain];
      return { domain, ip, owner };
    } else {
      return { domain };
    }
  }

  getAllDomains() {
    return Object.keys(this.domains).map((domain) =>
      this.getDomainInfo(domain)
    );
  }

  getPublicKey() {
    const key = ec.keyFromPublic(this.owner, "hex");
    return key.getPublic().encode("hex", true);
  }

  processTransaction(transaction) {
    const { method, payload } = transaction.data;
    switch (method) {
      case "registerDomain":
        const { from, registerDomain, ip } = payload;
        this.registerDomain(from, registerDomain, ip);
        break;
      case "transferDomain":
        const { transferDomain, newOwner } = payload;
        this.transferDomain(transferDomain, newOwner);
        break;
      default:
        throw new Error("Invalid transaction type");
    }
  }

  createTransaction(method, payload, privateKey) {
    const transaction = new Transaction(
      this.getPublicKey(),
      this.getPublicKey(),
      "smartContract",
      { method, payload }
    );
    transaction.sign(privateKey);
    return transaction;
  }
}

module.exports = { DomainRegistry };

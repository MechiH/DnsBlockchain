const { Blockchain } = require("./blockchain");
const { Wallet } = require("./wallet");
const { Transaction } = require("./transaction");

const myBlockchain = new Blockchain();
const wallet1 = new Wallet();
const wallet2 = new Wallet();
const wallet3 = new Wallet();
const minerWallet = new Wallet();
const DomainRegistry = myBlockchain.smartContract;
console.log("Wallet 1 Public Key:", wallet1.getPublicKey());
console.log("Wallet 2 Public Key:", wallet2.getPublicKey());
console.log("Wallet 3 Public Key:", wallet3.getPublicKey());
console.log("Miner Wallet Public Key:", minerWallet.getPublicKey());

console.log("\nRegistering domains...");
const transaction1 = new Transaction(
  wallet1.getPublicKey(),
  DomainRegistry.getPublicKey(),
  "smartContract",
  {
    method: "registerDomain",
    payload: {
      from: wallet1.getPublicKey(),
      registerDomain: "example.com",
      ip: "192.0.2.1",
    },
  }
);
transaction1.sign(wallet1.getPrivateKey());
myBlockchain.addTransaction(transaction1);

const transaction2 = new Transaction(
  wallet2.getPublicKey(),
  DomainRegistry.getPublicKey(),
  "smartContract",
  {
    method: "registerDomain",
    payload: {
      from: wallet2.getPublicKey(),
      registerDomain: "example.org",
      ip: "192.0.2.2",
    },
  }
);
transaction2.sign(wallet2.getPrivateKey());
myBlockchain.addTransaction(transaction2);

console.log("Mining block...");
myBlockchain.minePendingTransactions(minerWallet.getPublicKey());
console.log("Blockchain:", JSON.stringify(myBlockchain, null, 2));

console.log("\nTransferring domain...");
const transaction3 = new Transaction(
  wallet1.getPublicKey(),
  DomainRegistry.getPublicKey(),
  "smartContract",
  {
    method: "transferDomain",
    payload: {
      domain: "example.com",
      newOwner: wallet3.getPublicKey(),
    },
  }
);
transaction3.sign(wallet1.getPrivateKey());
myBlockchain.addTransaction(transaction3);

console.log("Mining block...");
myBlockchain.minePendingTransactions(minerWallet.getPublicKey());
console.log("Blockchain:", JSON.stringify(myBlockchain, null, 2));

console.log("\nQuerying domain registry...");
const domainToResolve = "example.com";
const domainInfo = DomainRegistry.getDomainInfo(domainToResolve);
console.log(
  `Domain info for ${domainToResolve}:`,
  JSON.stringify(domainInfo, null, 2)
);

console.log("\nAll domain registry...");
const domains = DomainRegistry.domains;
console.log(`Regsitry Domains ${JSON.stringify(domains, null, 2)}`);

console.log("\nVerifying blockchain integrity...");
const isChainValid = myBlockchain.isChainValid();
console.log("Blockchain is valid:", isChainValid);

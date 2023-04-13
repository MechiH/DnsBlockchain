const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();

app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static("public"));
const { Blockchain } = require("./DnsChain/blockchain");
const { Wallet } = require("./DnsChain/wallet");
const { Transaction } = require("./DnsChain/transaction");

const myBlockchain = new Blockchain();
const wallets = {};

// Create wallets and map public keys to wallets
for (let i = 1; i <= 3; i++) {
  const wallet = new Wallet();
  wallets[wallet.getPublicKey()] = wallet;
}

const minerWallet = new Wallet();
const DomainRegistry = myBlockchain.smartContract;

app.get("/", (req, res) => {
  res.render("index", {
    wallets: wallets,
    minerWalletPublicKey: minerWallet.getPublicKey(),
    domains: DomainRegistry.getAllDomains(),
    myBlockchain: myBlockchain,
  });
});

app.post("/register-domain", (req, res) => {
  console.log("register domain", req.body);
  const publicKey = req.body.publicKey;
  const wallet = wallets[publicKey];
  const { domain, ip } = req.body;

  // Extract private key from wallet using the public key
  const privateKey = wallet.getPrivateKey();

  const transaction = new Transaction(
    publicKey,
    DomainRegistry.getPublicKey(),
    "smartContract",
    {
      method: "registerDomain",
      payload: {
        from: publicKey,
        registerDomain: domain,
        ip,
      },
    }
  );
  transaction.sign(privateKey);
  myBlockchain.addTransaction(transaction);
  myBlockchain.minePendingTransactions(minerWallet.getPublicKey());
  console.info(DomainRegistry.getAllDomains());
  res.redirect("/");
});

app.post("/transfer-domain", (req, res) => {
  const publicKey = req.body.publicKey;
  const wallet = wallets[publicKey];
  const transferDomain = req.body.domain;
  const newOwner = req.body.newOwner;
  console.log(req.body);
  // Extract private key from wallet using the public key
  const privateKey = wallet.getPrivateKey();

  const transaction = new Transaction(
    publicKey,
    DomainRegistry.getPublicKey(),
    "smartContract",
    {
      method: "transferDomain",
      payload: {
        transferDomain,
        newOwner,
      },
    }
  );
  transaction.sign(privateKey);
  myBlockchain.addTransaction(transaction);
  myBlockchain.minePendingTransactions(minerWallet.getPublicKey());

  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

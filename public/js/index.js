// Get form elements
const registerDomainForm = document.getElementById("register-domain-form");
const transferDomainForm = document.getElementById("transfer-domain-form");
const mineBlockForm = document.getElementById("mine-block-form");

// Helper function for making AJAX requests
async function makeRequest(url, method, data) {
  console.log("makeRequest", url, method, JSON.stringify(data));
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.text();
}

// Handle Register Domain form submission
registerDomainForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const publicKey = document.getElementById("public-key").value;
  const domain = document.getElementById("domain").value;
  const ip = document.getElementById("ip").value;

  const formData = new FormData();
  formData.append("publicKey", publicKey);
  formData.append("domain", domain);
  formData.append("ip", ip);
  const data = Object.fromEntries(formData);

  try {
    await makeRequest("/register-domain", "POST", data);
    window.location.reload();
  } catch (error) {
    console.error("Error:", error);
  }
});

// Handle Transfer Domain form submission
transferDomainForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const publicKey = document.getElementById("public-key").value;
  const domain = document.getElementById("domain-transform").value;
  const newOwner = document.getElementById("new-owner").value;

  const formData = new FormData();
  formData.append("publicKey", publicKey);
  formData.append("domain", domain);
  formData.append("newOwner", newOwner);
  const data = Object.fromEntries(formData);

  try {
    await makeRequest("/transfer-domain", "POST", data);
    window.location.reload();
  } catch (error) {
    console.error("Error:", error);
  }
});
// Handle Mine Block form submission
mineBlockForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const publicKey = document.getElementById("public-key").value;

  const formData = new FormData();
  formData.append("publicKey", publicKey);

  try {
    await makeRequest("/mine-block", "POST", formData);
    window.location.reload();
  } catch (error) {
    console.error("Error:", error);
  }
});
// Handle Wallet form submission
const walletForm = document.getElementById("wallet-form");

walletForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const walletName = document.getElementById("wallet-name").value;
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const address = document.getElementById("address").value;

  const formData = new FormData();
  formData.append("walletName", walletName);
  formData.append("name", name);
  formData.append("email", email);
  formData.append("address", address);
  const data = Object.fromEntries(formData);

  try {
    const response = await makeRequest("/create-wallet", "POST", data);
    document.getElementById("public-key").value = response.publicKey;
    document.getElementById("private-key").value = response.privateKey;
  } catch (error) {
    console.error("Error:", error);
  }
});
const searchInput = document.getElementById("search-input");
const domainsTable = document.getElementById("domains-table");

// Handle key press in search input
searchInput.addEventListener("keyup", () => {
  const searchValue = searchInput.value.trim().toLowerCase();
  domainsTable.querySelectorAll("tbody tr").forEach((row) => {
    if (row.textContent.toLowerCase().includes(searchValue)) {
      row.classList.remove("d-none");
    } else {
      row.classList.add("d-none");
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const jsPlumbInstance = jsPlumb.newInstance({
    container: document.querySelector("body"),
  });

  // Set default connector settings
  jsPlumbInstance.importDefaults({
    connector: { type: "Bezier", options: { curviness: 100 } },
    anchor: ["Right", "Left"],
    endpoint: "Blank",
    paintStyle: { strokeWidth: 3, stroke: "#8a2be2" },
  });

  // Connect hash and previous hash elements
  const numOfBlocks = document.querySelectorAll(".card").length;
  for (let i = 1; i < numOfBlocks; i++) {
    const source = document.querySelector("#hash-" + (i - 1));
    const target = document.querySelector("#prev-hash-" + i);
    jsPlumbInstance.connect({
      source: source,
      target: target,
      overlays: [["Arrow", { location: 0.5, width: 15, length: 15 }]],
    });
  }
});

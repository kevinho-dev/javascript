
// 1. Voorbeelddata (hier ga je straks nieuwe transacties aan toevoegen)
const transactions = [
  {
    id: "tx_1",
    date: "2026-01-10",
    amount: 12.5,
    type: "expense",
    category: "food"
  }
];

// 2. Selecteer HTML-elementen
const form = document.getElementById("txForm");
const listEl = document.getElementById("txList");

// 3. Deze functie laat transacties zien in de lijst
function renderTransactions() {

  listEl.innerHTML = "";
  transactions.forEach((tx, index) => {
    const li = document.createElement("li");
    li.className = tx.type === "expense" ? "uitgave" : "inkomst";
    li.innerHTML = `
      <span>${tx.date} – ${tx.category}</span>
      <span class="tx-bedrag">€${tx.amount.toFixed(2)}</span>
      <button onclick="deleteTransaction(${index})">Verwijder</button>
    `;
    listEl.appendChild(li);
  });
}

function deleteTransaction(index) {
  transactions.splice(index, 1);
  renderTransactions();
}

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const newTx = {
    id: "tx_" + (transactions.length + 1),
    date: document.getElementById("date").value,
    amount: parseFloat(document.getElementById("amount").value),
    type: document.getElementById("type").value,
    category: document.getElementById("category").value
  };

  transactions.push(newTx);
  renderTransactions();
  form.reset();
});

// Alle tab-knoppen ophalen
const tabButtons = document.querySelectorAll("nav button");

// Alle tab-secties ophalen
const tabs = document.querySelectorAll(".tab");

// Functie om een tab actief te maken
function showTab(tabName) {
  tabs.forEach(tab => {
    // Toon alleen de gekozen tab
    tab.hidden = tab.id !== tabName;
  });
}

// Event listeners toevoegen aan de knoppen
tabButtons.forEach(button => {
  button.addEventListener("click", () => {
    const tabName = button.dataset.tab;
    showTab(tabName);
  });
});

// Start standaard op transacties
showTab("transactions");

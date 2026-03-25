// ===============================
// Budget Tracker – Week 1 START
// ===============================

// In deze startversie:
// - Er is al HTML aanwezig
// - Er is al voorbeelddata
// - De transacties worden getoond
//
// JIJ moet nog:
// - Het formulier werkend maken
// - Een nieuwe transactie toevoegen aan de array
// - Zorgen dat de pagina niet refresht bij submit
// - Zorgen de transacties worden getoond

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

// Excel slaat datums op als een getal (dagen sinds 1 januari 1900)
// Deze functie zet dat getal om naar een leesbare datum
function excelDatumNaarString(excelGetal) {
  const excelStartDatum = new Date(1899, 11, 30);
  const datum = new Date(excelStartDatum.getTime() + excelGetal * 86400000);
  return datum.toISOString().split("T")[0];
}

// 3. Deze functie laat transacties zien in de lijst
function renderTransactions() {
  listEl.innerHTML = "";
  transactions.forEach((tx, index) => {
    const li = document.createElement("li");
    li.className = tx.type === "expense" ? "uitgave" : "inkomst";
    li.innerHTML = `
      <span class="tx-info">${tx.date} – ${tx.category}</span>
      <span class="tx-bedrag">€${tx.amount.toFixed(2)}</span>
      <div class="knop-groep">
        <button class="bewerk-knop" onclick="openBewerk(${index})">Bewerk</button>
        <button onclick="deleteTransaction(${index})">Verwijder</button>
      </div>
    `;
    listEl.appendChild(li);
  });
}

// Transactie verwijderen
function deleteTransaction(index) {
  transactions.splice(index, 1);
  renderTransactions();
}

// ---- Bewerk modal ----
let bewerkIndex = null;

function openBewerk(index) {
  bewerkIndex = index;
  const tx = transactions[index];
  document.getElementById("bewerkDatum").value = tx.date;
  document.getElementById("bewerkBedrag").value = tx.amount;
  document.getElementById("bewerkType").value = tx.type;
  document.getElementById("bewerkCategorie").value = tx.category;
  document.getElementById("bewerkModal").classList.add("zichtbaar");
}

document.getElementById("annuleerBewerk").addEventListener("click", () => {
  document.getElementById("bewerkModal").classList.remove("zichtbaar");
});

document.getElementById("bewerkForm").addEventListener("submit", function(e) {
  e.preventDefault();
  transactions[bewerkIndex] = {
    id: transactions[bewerkIndex].id,
    date: document.getElementById("bewerkDatum").value,
    amount: parseFloat(document.getElementById("bewerkBedrag").value),
    type: document.getElementById("bewerkType").value,
    category: document.getElementById("bewerkCategorie").value
  };
  document.getElementById("bewerkModal").classList.remove("zichtbaar");
  renderTransactions();
});

// ---- Excel upload ----
document.getElementById("excelUpload").addEventListener("change", function(e) {
  const bestand = e.target.files[0];
  if (!bestand) return;
  document.getElementById("bestandsnaam").textContent = bestand.name;

  const reader = new FileReader();
  reader.onload = function(event) {
    const tekst = event.target.result;
    const regels = tekst.trim().split("\n");
    regels.forEach((regel, i) => {
      if (i === 0) return; // sla koptekst over
      const kolommen = regel.split(/[,;]/);
      if (kolommen.length < 4) return;

      // Controleer of de datum een Excel-getal is of al een tekst-datum
      const datumWaarde = kolommen[0].trim();
      let datum;
      if (!isNaN(datumWaarde) && datumWaarde !== "") {
        // Excel getal → echte datum
        datum = excelDatumNaarString(parseInt(datumWaarde));
      } else {
        datum = datumWaarde;
      }

      transactions.push({
        id: "tx_import_" + i,
        date: datum,
        amount: parseFloat(kolommen[1].trim()) || 0,
        type: kolommen[2].trim().toLowerCase() === "income" ? "income" : "expense",
        category: kolommen[3].trim()
      });
    });
    renderTransactions();
  };
  reader.readAsText(bestand);
});

// Transactie toevoegen via formulier
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

// Toon transacties bij laden
renderTransactions();

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
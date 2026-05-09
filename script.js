const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const list = document.getElementById("list");
const form = document.getElementById("form");

const text = document.getElementById("text");
const amount = document.getElementById("amount");
const date = document.getElementById("date");
const category = document.getElementById("category");

const search = document.getElementById("search");
const filterCategory = document.getElementById("filterCategory");

const toggleTheme = document.getElementById("toggleTheme");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Add transaction
form.addEventListener("submit", e => {
  e.preventDefault();

  const transaction = {
    id: Date.now(),
    text: text.value,
    amount: +amount.value,
    date: date.value,
    category: category.value
  };

  transactions.push(transaction);
  updateLocalStorage();
  displayTransactions();
  form.reset();
});

// Display transactions
function displayTransactions(){
  list.innerHTML = "";

  const filtered = transactions.filter(t => {
    return (
      t.text.toLowerCase().includes(search.value.toLowerCase()) &&
      (filterCategory.value === "all" || t.category === filterCategory.value)
    );
  });

  filtered.forEach(t => {
    const li = document.createElement("li");
    li.classList.add(t.amount > 0 ? "plus" : "minus");

    li.innerHTML = `
      ${t.text} (${t.category})<br>
      ₹${t.amount} <small>${t.date}</small>
      <button onclick="remove(${t.id})">❌</button>
    `;

    list.appendChild(li);
  });

  updateValues();
}

// Remove transaction
function remove(id){
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  displayTransactions();
}

// Update balance
function updateValues(){
  const amounts = transactions.map(t => t.amount);

  const total = amounts.reduce((acc, item) => acc + item, 0);
  const inc = amounts.filter(a => a > 0).reduce((a,b)=>a+b,0);
  const exp = amounts.filter(a => a < 0).reduce((a,b)=>a+b,0);

  balance.innerText = total;
  income.innerText = inc;
  expense.innerText = Math.abs(exp);
}

// Local storage
function updateLocalStorage(){
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Filters
search.addEventListener("input", displayTransactions);
filterCategory.addEventListener("change", displayTransactions);

// Theme toggle
toggleTheme.addEventListener("click", ()=>{
  document.body.classList.toggle("dark");
});

// Init
displayTransactions();
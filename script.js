const balance = document.getElementById('balance');
const money_plus = document.querySelector('.money-plus');
const money_minus = document.querySelector('.money-minus');
const form = document.getElementById('form');
const list = document.querySelector('.container__history-list');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

const localStorageTransactions = JSON.parse(localStorage.getItem('transaction'));
let transactions = localStorage.getItem('transaction') !== null ? localStorageTransactions : [];

function addTransaction(e) {
    e.preventDefault();
    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('PLease add a text and amount');
    } else {
        const transaction = {
            id: generateId(),
            text: text.value,
            amount: +amount.value,
        };
        // console.log(transaction);
        transactions.push(transaction);
        addTransactionDOM(transaction);
        UpdateValues();
        updateLocalStorage();
        text.value = '';
        amount.value = '';
    }
}

//Function generate random Id
function generateId() {
    return Math.floor(Math.random() * 100000000);
}
// Add transaction to dom
function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');
    // Add class based on sign  
    item.classList.add(sign === '+' ? 'plus' : 'minus');
    item.classList.add('container__list-item');
    item.innerHTML = `
        ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span> <button class="btn__delete" onclick="removeTransaction(${transaction.id})">X</button>
    `;
    list.appendChild(item);
}


// Update the balance, income and expense
function UpdateValues() {
    // Creating the amounts array
    const amount = transactions.map(transaction => transaction.amount);
    console.log(amount);

    // Get total
    const total = amount.reduce((acc, item) => acc + item, 0);
    console.log(total);

    // Filter out the income from amount
    const income = amount
        .filter(item => Math.sign(item) === 1)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);
    console.log(income);

    // Filter out the expense from amount
    const expense = (amount
            .filter(item => item < 0)
            .reduce((acc, item) => (acc += item), 0) * -1)
            .toFixed(2);
    console.log(expense);

    // Inserting it to DOM
    balance.innerText = `$${total}`;
    money_plus.innerText = `$${income}`;
    money_minus.innerText = `$${expense}`;
}


// Remove transaction by ID
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
  
    updateLocalStorage();
  
    init();
  }


//Update localstorage
function updateLocalStorage(){
    localStorage.setItem('transactions', JSON.stringify(transactions));
}


// Init app
function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    UpdateValues();
}

init();

form.addEventListener('submit', addTransaction)
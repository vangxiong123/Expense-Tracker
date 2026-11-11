let transactions = [];

let monthlyIncome = 0;
let monthlyExpenses = 0;
let allExpense = 0;

//changes numbers into USD
const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});

let atoday = new Date();
let todayDateS = `${atoday.getFullYear()}-${String(atoday.getMonth() + 1).padStart(2, "0")}-${String(atoday.getDate()).padStart(2, "0")}`;

const today = todayDateS;
document.getElementById('incomeDate').value = today;
document.getElementById('expenseDate').value = today;
document.getElementById("todaydate").textContent = todayDateS;

function openIncomeModel() {
    document.getElementById('incomeModel').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function openExpenseModel() {
    document.getElementById('expenseModel').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

/*function openInitialModel() {
    document.getElementById('initialModel').style.display = 'block';
    document.body.style.overflow = 'hidden';
}*/

function closeModel(modelId) {
    document.getElementById(modelId).style.display = 'none';
    document.body.style.overflow = 'auto';

    if (modelId === 'incomeModel') {
        document.getElementById('incomeForm').reset();
        document.getElementById('incomeDate').value = today;
    } else if (modelId === 'expenseModel'){
        document.getElementById('expenseForm').reset();
        document.getElementById('expenseDate').value = today;
    } else {
        document.getElementById('initialForm').reset();
        document.getElementById('initialDate').value = today;
    }
}

window.onclick = function (event) {
    const incomeModel = document.getElementById('incomeModel');
    const expenseModel = document.getElementById('expenseModel');
    const initialModel = document.getElementById('initialModel');

    if (event.target === incomeModel) {
        closeModel('incomeModel');
    }

    if (event.target === expenseModel) {
        closeModel('expenseModel');
    }

    if (event.target === initialModel) {
        closeModel('initialModel');
    }
}

//updates the individual amounts for each category
function updateAllExpenses(category, amount) {

    function updateCalculator(inputCategory){
        //updates food and health expense
        const counterSpan = document.getElementById(inputCategory);
        let currentValue = parseInt(counterSpan.dataset.value);
        currentValue += amount;
        counterSpan.dataset.value = currentValue;
        counterSpan.innerText = currentValue;
        //makes it so it shows up as USD instead of just numbers
        counterSpan.innerText = currencyFormatter.format(currentValue);
    }

    if (category === "food"){
        updateCalculator("foodUpdate");

    } else if (category === "entertainment"){
        updateCalculator("entertainmentUpdate");

    } else if (category === "shopping"){
        updateCalculator("shoppingUpdate")

    } else if (category === "investment"){
        updateCalculator("investmentUpdate");

    } else if (category === "transport"){
        updateCalculator("transportUpdate");

    } else if (category === "utilities"){
        updateCalculator("utilitiesUpdate");

    } else {
        updateCalculator("otherUpdate");

    }

    //add to total expenses
    const counterSpan = document.getElementById('totalexpensesUpdate');
    let currentValue = parseInt(counterSpan.dataset.value);
    currentValue += amount;
    counterSpan.dataset.value = currentValue;
    counterSpan.innerText = currentValue;
    //makes it so it shows up as USD instead of just numbers
    counterSpan.innerText = currencyFormatter.format(currentValue);
}

function addIncome() {
    const amount = parseFloat(document.getElementById('incomeAmount').value);
    const category = document.getElementById('incomeCategory').value;
    const description = document.getElementById('incomeDescription').value;
    const date = document.getElementById('incomeDate').value;

    if (!amount || !category || !date) {
        alert('Please fill in all fields');
        return;
    }


    const newTransaction = {
        id: transactions.length + 1,
        date: date,
        category: category.charAt(0).toUpperCase() + category.slice(1),
        amount: amount,
        status: 'Success',
        type: 'income',
        description: description,
    }

    transactions.unshift(newTransaction)

    monthlyIncome += amount;

    updateDashboard();
    updateTransactionTable();

    closeModel('incomeModel');
    showNotification('Income added successfully', 'success');
}

function addExpense() {
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const category = document.getElementById('expenseCategory').value;
    const description = document.getElementById('expenseDescription').value;
    const date = document.getElementById('expenseDate').value;

    if (!amount || !category || !date) {
        alert('Please fill in all fields');
        return;
    }

    const newTransaction = {
        id: transactions.length + 1,
        date: date,
        category: category.charAt(0).toUpperCase() + category.slice(1),
        amount: -amount,
        status: 'Success',
        type: 'expense',
        description: description,
    }

    transactions.unshift(newTransaction)

    monthlyExpenses += amount;

    updateAllExpenses(category, amount);

    function updateDWMvalues(){

        //resets amounts so that previous amount isn't added onto the new total
        document.getElementById("dailyAmount").dataset.value = 0;
        document.getElementById("weeklyAmount").dataset.value = 0;
        document.getElementById("monthlyAmount").dataset.value = 0;

        function changeDWMvalues(dwmValue, amount){
                const counterSpan = document.getElementById(dwmValue);
                let currentValue = parseInt(counterSpan.dataset.value);
                currentValue += parseInt(amount);
                counterSpan.dataset.value = currentValue;
                counterSpan.innerText = currentValue;
                //makes it so it shows up as USD instead of just numbers
                counterSpan.innerText = currencyFormatter.format(currentValue);
            }

        for(let transaction of transactions){

            if (transaction.status !== "Success" || transaction.type !== "expense"){
                continue;
            }

            //add to total monthly expenses
            if (parseInt(transaction.date.split("-")[1]) === parseInt(atoday.getMonth() + 1)){
                changeDWMvalues("monthlyAmount", transaction.amount);
            }

            //add to total daily expenses
            if (parseInt(transaction.date.split("-")[2]) === parseInt(atoday.getDate())){
                changeDWMvalues("dailyAmount", transaction.amount);
            }

            //add to total monthly expenses//needs works
            if (parseInt(transaction.date.split("-")[2]) === parseInt(atoday.getDay())){
                changeDWMvalues("weeklyAmount", transaction.amount);
            }
        }
    }

    updateDWMvalues();
    updateDashboard();
    updateTransactionTable();

    closeModel('expenseModel');
    showNotification('Expense added successfully', 'success');
}

//reset all the values
function addInitial() {
  //  const amount = parseFloat(document.getElementById('initialAmount').value);
 //   const category = document.getElementById('initialCategory').value;
 //   const description = document.getElementById('initialDescription').value;
 //   const date = document.getElementById('initialDate').value;


    //resets transactions table to nothing
    transactions = [];

    monthlyIncome = 0;

    //resetting all the values
    function updateCalculator(inputCategory){
        //updates food and health expense
        const counterSpan = document.getElementById(inputCategory);
        let currentValue = parseInt(counterSpan.dataset.value);
        currentValue = 0;
        counterSpan.dataset.value = currentValue;
        counterSpan.innerText = currentValue;
        //makes it so it shows up as USD instead of just numbers
        counterSpan.innerText = currencyFormatter.format(currentValue);
    }

    updateCalculator("totalexpensesUpdate");
    updateCalculator("foodUpdate");
    updateCalculator("entertainmentUpdate");
    updateCalculator("shoppingUpdate")
    updateCalculator("investmentUpdate");
    updateCalculator("transportUpdate");
    updateCalculator("utilitiesUpdate");
    updateCalculator("otherUpdate");
    updateCalculator("dailyAmount");
    updateCalculator("weeklyAmount");
    updateCalculator("monthlyAmount");

    updateDashboard();
    updateTransactionTable();

    closeModel('initialModel');
    showNotification('Successfully Resetted the Values', 'success');
}

function updateDashboard(spendingLimit = 500) {
    document.querySelector('.income-amount').textContent = `${monthlyIncome.toLocaleString()}.00`;
    document.querySelector('.expense-amount').textContent = `${monthlyExpenses.toLocaleString()}.00`;

    //let spendingLimit = 900;
    const usedAmount = monthlyExpenses;
    const percentage = (usedAmount / spendingLimit) * 100;
    document.querySelector('.spending-limit').textContent = `${(spendingLimit - usedAmount).toLocaleString()}.00`;
    document.querySelector('.progress-fill').style.width = `${Math.min(percentage, 100)}%`;
}

function updateTransactionTable() {
    const tbody = document.querySelector('.transactions-table tbody');
    tbody.innerHTML = '';

    const recenTransactions = transactions.slice(0, 10);

    recenTransactions.forEach((transaction) => {
        const row = document.createElement('tr');
        const formattedDate = new Date(transaction.date).toLocaleDateString(
            'en-Us',
            {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            }
        )

        const amountDisplay = transaction > 0 ? `+${transaction.amount.toLocaleString()}.00` : `-${Math.abs(transaction.amount).toLocaleString()}.00`;

        row.innerHTML = `
                <td>${formattedDate}</td>
                <td>${transaction.category}</td>
                <td style="color: ${transaction.amount > 0 ? '#10b981' : '#ef4444'}"> ${amountDisplay}</td>
                <td><span class="status-success">${transaction.status}</span></td>
                <td><button class="action-btn"><i class="fa fa-ellipsis-h"></i></button></td>
        `;
        tbody.appendChild(row);
    });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1001;
        animation: slideInRight 0.3s ease;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
    `

    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease'
        setTimeout(() => {
            document.body.removeChild(notification)
        }, 300);
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {transform: translateX(100%); opacity: 0;}
        to {transform: translateX(0); opacity: 1;}    
    }

    @keyframes slideInLeft {
        from {transform: translateX(0); opacity: 1;}
        to {transform: translateX(100%); opacity: 0;}
    }
`
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', function() {
    updateTransactionTable();
})
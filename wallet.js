class DigitalWallet {
    constructor() {
        this.balance = parseFloat(localStorage.getItem('walletBalance')) || 0;
        this.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        this.initializeWallet();
    }

    initializeWallet() {
        this.updateBalanceDisplay();
        this.setupEventListeners();
        this.displayTransactions();
    }

    updateBalanceDisplay() {
        document.getElementById('walletBalance').textContent = `₹${this.balance.toFixed(2)}`;
    }

    setupEventListeners() {
        // Add Money Button
        const addMoneyBtn = document.getElementById('addMoneyBtn');
        const modal = document.getElementById('addMoneyModal');
        const closeModal = document.querySelector('.close-modal');

        addMoneyBtn.addEventListener('click', () => {
            modal.style.display = 'block';
        });

        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Add Money Form
        const addMoneyForm = document.getElementById('addMoneyForm');
        addMoneyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const amount = parseFloat(document.getElementById('addAmount').value);
            this.addMoney(amount);
            modal.style.display = 'none';
            addMoneyForm.reset();
        });

        // Payment Form
        const paymentForm = document.getElementById('paymentForm');
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const upiId = document.getElementById('receiverUPI').value;
            const amount = parseFloat(document.getElementById('paymentAmount').value);
            const category = document.getElementById('paymentCategory').value;
            this.makePayment(upiId, amount, category);
            paymentForm.reset();
        });
    }

    addMoney(amount) {
        if (amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        this.balance += amount;
        this.addTransaction('credit', amount, 'Added money to wallet');
        this.updateBalanceDisplay();
        this.saveToLocalStorage();
    }

    makePayment(upiId, amount, category) {
        if (amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        if (amount > this.balance) {
            alert('Insufficient balance');
            return;
        }

        this.balance -= amount;
        this.addTransaction('debit', amount, `Paid to ${upiId} (${category})`);
        this.updateBalanceDisplay();
        this.saveToLocalStorage();
    }

    addTransaction(type, amount, description) {
        const transaction = {
            id: Date.now(),
            type,
            amount,
            description,
            timestamp: new Date().toISOString()
        };

        this.transactions.unshift(transaction);
        this.displayTransactions();
    }

    displayTransactions() {
        const transactionsList = document.getElementById('transactionsList');
        transactionsList.innerHTML = this.transactions
            .map(transaction => `
                <div class="transaction-item">
                    <div>
                        <strong>${transaction.description}</strong>
                        <br>
                        <small>${new Date(transaction.timestamp).toLocaleString()}</small>
                    </div>
                    <div style="color: ${transaction.type === 'credit' ? 'green' : 'red'}">
                        ${transaction.type === 'credit' ? '+' : '-'}₹${transaction.amount.toFixed(2)}
                    </div>
                </div>
            `)
            .join('');
    }

    saveToLocalStorage() {
        localStorage.setItem('walletBalance', this.balance.toString());
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
    }
}

// Initialize the wallet when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const wallet = new DigitalWallet();
});
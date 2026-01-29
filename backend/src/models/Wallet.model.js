const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['credit', 'debit'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: [
            'direct_referral',      // First 3 active members
            'rank_bonus',           // Rank achievement
            'team_bonus',           // Future: level income
            'withdrawal',           // Money withdrawn
            'admin_credit',         // Manual credit by admin
            'admin_debit',          // Manual debit by admin
            'refund'               // Refund
        ],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    balanceAfter: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const walletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },

    balance: {
        type: Number,
        default: 0,
        min: 0
    },

    // Lifetime earnings breakdown
    totalEarned: {
        type: Number,
        default: 0
    },

    totalWithdrawn: {
        type: Number,
        default: 0
    },

    // Transaction history
    transactions: [transactionSchema],

    // Pending withdrawals
    pendingWithdrawals: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

// Add transaction method
walletSchema.methods.addTransaction = function (type, amount, category, description) {
    if (type === 'credit') {
        this.balance += amount;
        this.totalEarned += amount;
    } else if (type === 'debit') {
        if (this.balance < amount) {
            throw new Error('Insufficient balance');
        }
        this.balance -= amount;
        if (category === 'withdrawal') {
            this.totalWithdrawn += amount;
        }
    }

    this.transactions.push({
        type,
        amount,
        category,
        description,
        balanceAfter: this.balance,
        date: new Date()
    });
};

module.exports = mongoose.model('Wallet', walletSchema);
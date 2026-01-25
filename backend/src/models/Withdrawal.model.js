const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
    // User reference jo paise nikal raha hai
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userId: {
        type: String,
        required: true
    }, // e.g., KARAN1001

    amount: {
        type: Number,
        required: true,
        min: [500, 'Minimum withdrawal amount is ₹500'] //
    },

    // Status tracking
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },

    // Transaction Details
    transactionId: {
        type: String,
        default: null // Admin approval ke baad fill hoga
    },

    // Bank Details (Snap-shot from KYC at time of request)
    bankDetails: {
        accountNumber: String,
        ifscCode: String,
        bankName: String,
        holderName: String
    },

    remark: {
        type: String,
        default: '' // Agar admin reject kare toh reason likh sake
    }

}, { timestamps: true }); //

module.exports = mongoose.model('Withdrawal', withdrawalSchema);
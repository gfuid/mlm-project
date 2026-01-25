const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    // --- Identity ---
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },

    // 🚩 In dono ko add karna COMPULSORY hai reset password ke liye
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    // isCounter: { type: Boolean, default: false },

    // --- Business IDs ---
    userId: { type: String, required: true, unique: true }, // e.g. KARAN1001
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isActive: { type: Boolean, default: false }, // Active after ₹5100 payment

    // --- MLM Matrix Structure ---
    sponsorId: { type: String, required: false }, // Who referred them (Direct Income)
    uplineId: { type: String, ref: 'User' },  // Who is directly above in Matrix (Level Income)
    level: { type: Number, default: 0 },

    // --- Ranks ---
    rank: {
        type: String,
        enum: ['Promoter', 'City Manager', 'Distt Manager', 'State Manager', 'National Head', 'Boss Medal', 'Karan Medal', 'Arjun Medal', 'Gold Medal', 'Hero No 1'],
        default: 'Promoter'
    },
    // models/User.js
    bankDetails: {
        holderName: { type: String, default: "" }, // ✅ Ye zaroori hai
        bankName: { type: String, default: "" },
        accountNumber: { type: String, default: "" },
        ifscCode: { type: String, default: "" },
        upiId: { type: String, default: "" },
        address: { type: String, default: "" }, // 🏠 Naya address field
        isVerified: { type: Boolean, default: false }
    },
    // --- Wallet ---
    wallet: {
        balance: { type: Number, default: 0 },
        totalEarnings: { type: Number, default: 0 },
        totalWithdrawals: { type: Number, default: 0 }
    }

    ,

}, {
    timestamps: true
});

// 🔥 FIXED: 'next' hata diya hai. Async function apne aap ruk jata hai.
// models/User.model.js (Line 60 ke paas)
// models/User.model.js

// ✅ FIX: Remove 'next' from the arguments. 
// Mongoose handles 'async' hooks by waiting for the Promise to resolve.
userSchema.pre('save', async function () {

    // 1. Agar password change nahi hua, to turant return kar do
    if (!this.isModified('password')) {
        return; // ✅ No 'next()' needed
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        // ✅ No 'next()' needed at the end
    } catch (error) {
        console.error("Model Hashing Error:", error);
        throw error; // ✅ Throw error instead of next(error)
    }
});

// Check password method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Export
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    // Basic Info
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    mobile: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    sponsorId: { type: String, default: "KARAN1001" }, // String format for easy display
    uplineId: { type: String },                       // String format for tree logic
    level: { type: Number, default: 0 },              // Level counting
    // Activation Status
    isActive: { type: Boolean, default: false },
    activatedAt: { type: Date },

    // 🔥 MLM Structure - NEW FIELDS
    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    //Direct Referrals (Unlimited, but only first 3 count for income)
    directReferrals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    // Active Direct Count (Max 3 for direct income)
    activeDirectCount: {
        type: Number,
        default: 0,
        max: 3
    },

    // Level 1 Complete Flag
    level1Complete: {
        type: Boolean,
        default: false
    },

    // Total Team Size (All levels)
    totalTeam: {
        type: Number,
        default: 0
    },

    // Active Team Members
    activeTeam: {
        type: Number,
        default: 0
    },

    // 🎖️ Current Rank
    rank: {
        type: String,
        enum: [
            'Promoter',
            'City Manager',
            'District Manager',
            'State Manager',
            'National Head',
            'Boss Medal',
            'Karan Medal',
            'Arjun Medal',
            'Gold Medal',
            'Hero No. 1'
        ],
        default: 'Promoter'
    },

    // Rank Achievement History
    rankHistory: [{
        rank: String,
        achievedAt: { type: Date, default: Date.now },
        teamSize: Number,
        income: Number
    }],

    // 💰 Income Tracking
    totalEarnings: {
        type: Number,
        default: 0
    },

    directReferralEarnings: {
        type: Number,
        default: 0
    },

    teamBonusEarnings: {
        type: Number,
        default: 0
    },

    // 🎁 Rewards Tracking
    rewards: [{
        rank: String,
        rewardType: String, // 'cash', 'physical', 'fund'
        rewardName: String, // 'Smart LED TV', 'Honda Activa'
        rewardValue: Number,
        status: {
            type: String,
            enum: ['pending', 'approved', 'delivered'],
            default: 'pending'
        },
        achievedAt: { type: Date, default: Date.now }
    }],

    // Bank Details
    bankDetails: {
        bankName: String,
        accountNumber: String,
        ifscCode: String,
        accountHolderName: String,
        holderName: String,
        upiId: String,
        address: String,
        isVerified: { type: Boolean, default: false }
    },

    // Password Reset
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Hash password before saving
// userSchema.pre('save', async function () {
//     if (!this.isModified('password')) return;

//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
// });


// Update rank based on team size
userSchema.methods.updateRank = function () {
    const RANKS = [
        { name: 'Promoter', teamSize: 3, income: 1500, reward: 'Standard ID' },
        { name: 'City Manager', teamSize: 9, income: 3000, reward: 'Digital Badge' },
        { name: 'District Manager', teamSize: 27, income: 9000, reward: 'Official Kit' },
        { name: 'State Manager', teamSize: 81, income: 27000, reward: 'Business Medal' },
        { name: 'National Head', teamSize: 243, income: 81000, reward: 'Corporate Medal' },
        { name: 'Boss Medal', teamSize: 729, income: 243000, reward: 'Smart LED TV' },
        { name: 'Karan Medal', teamSize: 2187, income: 729000, reward: 'Honda Activa' },
        { name: 'Arjun Medal', teamSize: 6561, income: 2187000, reward: 'Royal Enfield Bullet' },
        { name: 'Gold Medal', teamSize: 19684, income: 6561500, reward: 'Pension Plan (10L Fund)' },
        { name: 'Hero No. 1', teamSize: 59049, income: 19684500, reward: 'House + Car (50L Fund)' }
    ];

    // Find highest achieved rank
    for (let i = RANKS.length - 1; i >= 0; i--) {
        if (this.totalTeam >= RANKS[i].teamSize) {
            if (this.rank !== RANKS[i].name) {
                // Rank upgraded!
                const oldRank = this.rank;
                this.rank = RANKS[i].name;

                // Add to rank history
                this.rankHistory.push({
                    rank: RANKS[i].name,
                    achievedAt: new Date(),
                    teamSize: this.totalTeam,
                    income: RANKS[i].income
                });

                return { upgraded: true, oldRank, newRank: RANKS[i].name, bonus: RANKS[i].income };
            }
            break;
        }
    }

    return { upgraded: false };
};

module.exports = mongoose.model('User', userSchema);
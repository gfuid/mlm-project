const User = require('../models/User.model');
const Wallet = require('../models/Wallet.model');

// 💰 Income Configuration
const INCOME_CONFIG = {
    directReferralBonus: 500, // Per active member (first 3 only)

    ranks: [
        { name: 'Promoter', teamSize: 3, bonus: 1500, reward: 'Standard ID' },
        { name: 'City Manager', teamSize: 9, bonus: 3000, reward: 'Digital Badge' },
        { name: 'District Manager', teamSize: 27, bonus: 9000, reward: 'Official Kit' },
        { name: 'State Manager', teamSize: 81, bonus: 27000, reward: 'Business Medal' },
        { name: 'National Head', teamSize: 243, bonus: 81000, reward: 'Corporate Medal' },
        { name: 'Boss Medal', teamSize: 729, bonus: 243000, reward: 'Smart LED TV' },
        { name: 'Karan Medal', teamSize: 2187, bonus: 729000, reward: 'Honda Activa' },
        { name: 'Arjun Medal', teamSize: 6561, bonus: 2187000, reward: 'Royal Enfield Bullet' },
        { name: 'Gold Medal', teamSize: 19684, bonus: 6561500, reward: 'Pension Plan (10L)' },
        { name: 'Hero No. 1', teamSize: 59049, bonus: 19684500, reward: 'House + Car (50L)' }
    ]
};

// 🎯 Handle New Member Activation
const handleMemberActivation = async (newUserId) => {
    try {
        console.log('🔥 MLM Service: Handling activation for', newUserId);

        const newUser = await User.findById(newUserId).populate('referredBy');
        if (!newUser || !newUser.referredBy) {
            console.log('❌ No referrer found');
            return;
        }

        const referrer = newUser.referredBy;

        // 1️⃣ Update Referrer's Direct Referrals
        if (!referrer.directReferrals.includes(newUserId)) {
            referrer.directReferrals.push(newUserId);
        }

        // 2️⃣ Check if this counts toward Level 1 (first 3 active only)
        if (referrer.activeDirectCount < 3) {
            referrer.activeDirectCount += 1;

            // 💰 Give Direct Referral Bonus
            const bonus = INCOME_CONFIG.directReferralBonus;
            referrer.directReferralEarnings += bonus;
            referrer.totalEarnings += bonus;

            // Update wallet
            await updateWallet(referrer._id, bonus, 'direct_referral',
                `Direct referral bonus from ${newUser.userId}`);

            console.log(`✅ Direct bonus ₹${bonus} credited to ${referrer.userId}`);

            // 3️⃣ Check Level 1 Completion
            if (referrer.activeDirectCount === 3) {
                referrer.level1Complete = true;
                console.log(`🎉 Level 1 Complete for ${referrer.userId}`);

                // Send notification (implement later)
                // await sendNotification(referrer._id, 'level1_complete');
            }
        } else {
            console.log(`⚠️ ${referrer.userId} already has 3 active directs - No bonus`);
        }

        await referrer.save();

        // 4️⃣ Update Team Count for Entire Upline
        await updateUplineTeamCount(referrer._id);

        return { success: true };

    } catch (error) {
        console.error('❌ MLM Service Error:', error);
        throw error;
    }
};

// 🌳 Update Team Count for All Upline Members
const updateUplineTeamCount = async (userId) => {
    try {
        let currentUser = await User.findById(userId).populate('referredBy');

        while (currentUser && currentUser.referredBy) {
            const upline = currentUser.referredBy;

            // Increment team count
            upline.totalTeam += 1;

            // Check for rank upgrade
            const rankUpdate = upline.updateRank();

            if (rankUpdate.upgraded) {
                console.log(`🎖️ Rank Upgraded: ${upline.userId} → ${rankUpdate.newRank}`);

                // Give rank bonus
                upline.teamBonusEarnings += rankUpdate.bonus;
                upline.totalEarnings += rankUpdate.bonus;

                await updateWallet(upline._id, rankUpdate.bonus, 'rank_bonus',
                    `${rankUpdate.newRank} Rank Achievement Bonus`);

                // Add reward
                const rankConfig = INCOME_CONFIG.ranks.find(r => r.name === rankUpdate.newRank);
                if (rankConfig) {
                    upline.rewards.push({
                        rank: rankUpdate.newRank,
                        rewardType: rankConfig.reward.includes('Fund') ? 'fund' : 'physical',
                        rewardName: rankConfig.reward,
                        rewardValue: rankUpdate.bonus,
                        status: 'pending'
                    });
                }
            }

            await upline.save();

            // Move to next upline
            currentUser = await User.findById(upline._id).populate('referredBy');
        }

        console.log('✅ Upline team counts updated');

    } catch (error) {
        console.error('❌ Upline update error:', error);
    }
};

// 💳 Update Wallet
const updateWallet = async (userId, amount, type, description) => {
    try {
        let wallet = await Wallet.findOne({ userId });

        if (!wallet) {
            wallet = new Wallet({ userId, balance: 0, transactions: [] });
        }

        wallet.balance += amount;
        wallet.transactions.push({
            type: 'credit',
            amount,
            category: type,
            description,
            date: new Date()
        });

        await wallet.save();

        console.log(`💰 Wallet updated: ${userId} +₹${amount}`);

    } catch (error) {
        console.error('❌ Wallet update error:', error);
    }
};

// 📊 Get User's MLM Stats
const getUserMLMStats = async (userId) => {
    try {
        const user = await User.findById(userId)
            .populate('directReferrals', 'userId name isActive')
            .populate('referredBy', 'userId name');

        if (!user) return null;

        // Get next rank info
        const currentRankIndex = INCOME_CONFIG.ranks.findIndex(r => r.name === user.rank);
        const nextRank = INCOME_CONFIG.ranks[currentRankIndex + 1] || null;

        return {
            userId: user.userId,
            name: user.name,
            currentRank: user.rank,
            nextRank: nextRank ? {
                name: nextRank.name,
                requiredTeam: nextRank.teamSize,
                remaining: nextRank.teamSize - user.totalTeam
            } : null,

            // Team Stats
            totalTeam: user.totalTeam,
            activeTeam: user.activeTeam,

            // Direct Referrals
            totalDirectReferrals: user.directReferrals.length,
            activeDirects: user.activeDirectCount,
            level1Complete: user.level1Complete,
            canEarnFromDirects: user.activeDirectCount < 3,

            // Income
            totalEarnings: user.totalEarnings,
            directReferralEarnings: user.directReferralEarnings,
            teamBonusEarnings: user.teamBonusEarnings,

            // Referrals List
            directReferrals: user.directReferrals.map(ref => ({
                userId: ref.userId,
                name: ref.name,
                isActive: ref.isActive
            })),

            // Referrer
            referrer: user.referredBy ? {
                userId: user.referredBy.userId,
                name: user.referredBy.name
            } : null,

            // Rewards
            rewards: user.rewards,

            // Motivational Message
            message: user.level1Complete
                ? '🚀 Grow Your Team, Not Your List!'
                : `🎯 ${3 - user.activeDirectCount} more to complete Level 1!`
        };

    } catch (error) {
        console.error('❌ Get MLM stats error:', error);
        return null;
    }
};

module.exports = {
    handleMemberActivation,
    updateUplineTeamCount,
    getUserMLMStats,
    INCOME_CONFIG
};
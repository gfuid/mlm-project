const User = require('../models/User.model.js');
const Withdrawal = require('../models/Withdrawal.model.js'); // Ensure this model exists
const mongoose = require('mongoose');


// 1. Get All Users for Admin

// 2. Get All Pending Withdrawals
const getPendingWithdrawals = async (req, res) => {
    try {
        const withdrawals = await Withdrawal.find({ status: 'pending' })
            .populate('userId', 'name userId mobile')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: withdrawals });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Approve or Reject Withdrawal


const updateWithdrawalStatus = async (req, res) => {
    // 🚩 Transaction start karein
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { withdrawalId, status, remark } = req.body;
        const withdrawal = await Withdrawal.findById(withdrawalId).session(session);

        if (!withdrawal || withdrawal.status !== 'pending') {
            throw new Error("Request invalid or already processed");
        }

        if (status === 'rejected') {
            const user = await User.findById(withdrawal.userId).session(session);
            if (user) {
                user.wallet.balance += withdrawal.amount;
                await user.save({ session }); // ✅ Session ke saath save
            }
        }

        // Status update karein
        withdrawal.status = status;
        withdrawal.adminRemark = remark || "Processed by Admin";
        await withdrawal.save({ session });

        // ✅ Sab theek hai toh commit karein
        await session.commitTransaction();
        res.status(200).json({ success: true, message: `Withdrawal ${status}` });

    } catch (error) {
        // ❌ Error aaye toh saare badlav cancel (Rollback)
        await session.abortTransaction();
        res.status(500).json({ success: false, message: error.message });
    } finally {
        session.endSession();
    }
};






// Ad Approve ya Reject karne ke liye
const updateAdStatus = async (req, res) => {
    try {
        const { adId, status } = req.body; // status: 'active' or 'rejected'
        const ad = await Ad.findByIdAndUpdate(adId, { status }, { new: true });
        res.status(200).json({ success: true, message: `Ad is now ${status}` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllWithdrawals = async (req, res) => {
    try {
        const withdrawals = await Withdrawal.find({ status: 'pending' })
            .populate('userId', 'name userId mobile bankDetails') // 👈 Ye line Bank Details fetch karegi
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: withdrawals });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};




// controllers/admin.controller.js
// controllers/admin.controller.js
const getFullStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { range = 'weekly' } = req.query;
        let startDate = new Date();
        let groupFormat = "%Y-%m-%d";

        if (range === 'monthly') startDate.setDate(startDate.getDate() - 30);
        else if (range === 'yearly') {
            startDate.setFullYear(startDate.getFullYear() - 1);
            groupFormat = "%Y-%m";
        } else startDate.setDate(startDate.getDate() - 7);

        // 1. 📊 Network Stats (Active/Inactive)
        const activeIds = await User.countDocuments({ role: 'user', isActive: true });
        const inactiveIds = await User.countDocuments({ role: 'user', isActive: false });

        // 2. ✅ Valuation: ₹5000 per Active ID
        const businessVolume = activeIds * 5000;

        // 3. 📅 Today's Joinings
        const todayJoinings = await User.countDocuments({
            role: 'user',
            createdAt: { $gte: today }
        });

        // 4. 📈 Chart Data Calculation
        const chartStats = await User.aggregate([
            { $match: { isActive: true, role: 'user', updatedAt: { $gte: startDate } } },
            { $group: { _id: { $dateToString: { format: groupFormat, date: "$updatedAt" } }, revenue: { $sum: 5000 } } },
            { $sort: { "_id": 1 } }
        ]);

        // 5. 🔔 Notification & Payout Logic (Badge ke liye)
        const pendingWithdrawalsList = await Withdrawal.find({ status: 'pending' })
            .populate('userId', 'name userId mobile bankDetails')
            .sort({ createdAt: -1 });

        const totalLiability = pendingWithdrawalsList.reduce((sum, item) => sum + item.amount, 0);

        // 6. 🚀 Final Refined Data Construction
        const statsData = {
            totalMembers: activeIds + inactiveIds,
            activeIds,
            inactiveIds,
            businessVolume,
            todayJoinings,
            pendingPayouts: pendingWithdrawalsList.reduce((sum, item) => sum + item.amount, 0),
            pendingWithdrawalsCount: pendingWithdrawalsList.length,
            pendingWithdrawals: pendingWithdrawalsList, // Withdrawal list ke liye
            chartData: chartStats,               // Chart ke liye
            pendingPayouts: totalLiability
        };

        res.status(200).json({ success: true, data: statsData });

    } catch (err) {
        console.error("STATS ERROR:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const total = await User.countDocuments({ role: 'user' });

        const users = await User.find({ role: 'user' })
            .select('name userId email mobile bankDetails isActive createdAt')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: users,
            page,
            pages: Math.ceil(total / limit),
            total
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Example logic for tree structure
const getSystemTree = async (req, res) => {
    try {
        const { userId } = req.params;
        const requester = req.user; // protect middleware se aayega

        // 🛡️ Security: Agar user admin nahi hai, toh wo sirf apni ID ka tree dekh sakta hai
        if (requester.role !== 'admin' && requester.userId !== userId) {
            return res.status(403).json({ success: false, message: "Access Denied" });
        }

        const user = await User.findOne({ userId }).select('name userId isActive role').lean();
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // 🌳 Recursive function jo grandchildren bhi layega
        const buildTree = async (uId, currentDepth = 0) => {
            if (currentDepth > 10) return []; // 🚩 Security: 10 level se niche mat jao
            const children = await User.find({ uplineId: uId }).select('name userId isActive role').lean();
            return await Promise.all(children.map(async (child) => ({
                ...child,
                children: await buildTree(child.userId, currentDepth + 1)
            })));
        };

        user.children = await buildTree(userId);
        res.json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


const toggleUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { isActive } = req.body;

        const user = await User.findOneAndUpdate(
            { userId },
            { isActive },
            { new: true }
        );

        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.status(200).json({
            success: true,
            message: `User ${isActive ? 'Activated' : 'Inactivated'} Successfully`,
            data: user
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const verifyUserKyc = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findOneAndUpdate(
            { userId: userId },
            { "bankDetails.isVerified": true },
            { new: true }
        );
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.status(200).json({ success: true, message: "KYC Verified!", user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// backend/src/controllers/admin.controller.js

module.exports = { getAllWithdrawals, verifyUserKyc, toggleUserStatus, getSystemTree, getAllUsers, getPendingWithdrawals, updateWithdrawalStatus, getFullStats, updateAdStatus };
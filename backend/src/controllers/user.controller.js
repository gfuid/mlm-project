const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// user.controller.js ke top par ye line add karein
const Withdrawal = require('../models/Withdrawal.model');
// ✅ Model Import
const User = require('../models/User.model');
//const commissionService = require('../services/commission.service');
const { getNextUserId } = require("../services/counter.service");
const { findUpline } = require("../services/matrix.service");
// 1. Generate Token
const generateToken = (user) => {
    return jwt.sign(
        { _id: user._id, userId: user.userId, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
    );
};



// controllers/user.controller.js

const updateKycDetails = async (req, res) => {
    try {
        // 1. Destructure address also from req.body
        const { bankName, accountNumber, ifscCode, accountHolderName, upiId, address } = req.body;
        const userId = req.user._id;

        // 2. 🛡️ Validation: Update se PEHLE check karein
        // Address ko bhi mandatory rakhein billing ke liye
        if (!bankName || !accountNumber || !ifscCode || !accountHolderName || !address) {
            return res.status(400).json({
                success: false,
                message: "Please fill all mandatory fields including Address and Holder Name"
            });
        }

        // 3. Database Update
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    bankDetails: {
                        bankName,
                        accountNumber,
                        ifscCode: ifscCode.toUpperCase(), // Best practice
                        holderName: accountHolderName, // Schema mein 'holderName' hai
                        upiId: upiId || "",
                        address: address, // ✅ Ab sahi se save hoga
                        isVerified: false
                    }
                }
            },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "KYC & Address details saved successfully!",
            user: updatedUser
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};






const registerUser = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, email, mobile, password, sponsorId } = req.body;

        const exists = await User.findOne(
            { $or: [{ email }, { mobile }] },
            null,
            { session }
        );

        if (exists) {
            throw new Error("Email or Mobile already registered");
        }

        const userId = await getNextUserId(session);
        const finalSponsor = sponsorId || "KARAN1001";
        const uplineId = await findUpline(finalSponsor, session);

        const user = await User.create([{
            name,
            email: email.toLowerCase(),
            mobile,
            password,
            userId,
            sponsorId: finalSponsor,
            uplineId,
            rank: "Promoter",
            isActive: false
        }], { session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            userId,
            message: "Registered successfully"
        });

    } catch (err) {
        await session.abortTransaction();
        session.endSession();

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// 3. Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                success: true,
                _id: user._id,
                name: user.name,
                userId: user.userId,
                email: user.email,
                role: user.role,
                token: generateToken(user)
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.log("Login Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// 4. Get My Team
const getMyTeam = async (req, res) => {
    try {
        const loggedInUserId = req.user.userId;

        const teamMembers = await User.find({
            sponsorId: loggedInUserId
        })
            .select('userId name mobile createdAt isActive role rank')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: teamMembers.length,
            data: teamMembers
        });
    } catch (error) {
        console.error("❌ Team Fetch Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

// 5. Dashboard Stats (✅ FIXED: Added Email & Mobile)
const getDashboardStats = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.user.userId });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        // Count Direct Team
        const directTeamCount = await User.countDocuments({
            sponsorId: user.userId
        });
        const lastRequest = await Withdrawal.findOne({ userId: user.userId })
        res.status(200).json({
            success: true,
            data: {
                userId: user.userId,
                name: user.name,
                rank: user.rank,
                wallet: user.wallet?.balance || 0,
                totalTeam: directTeamCount,

                // 👇 THESE FIELDS WERE MISSING BEFORE 👇
                email: user.email,
                mobile: user.mobile,
                bankDetails: user.bankDetails,
                isActive: user.isActive,
                createdAt: user.createdAt,
                lastWithdrawStatus: lastRequest ? lastRequest.status : null,
                lastWithdrawAmount: lastRequest ? lastRequest.amount : 0
            }
        });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 6. Full Tree Logic
const getFullTree = async (req, res) => {
    try {
        const rootUserId = req.params.userId;

        const rootUser = await User.findOne({ userId: rootUserId }).select('userId name rank role isActive');

        if (!rootUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const level1 = await User.find({ sponsorId: rootUserId }).select('userId name rank isActive');

        const treeData = {
            ...rootUser._doc,
            children: level1
        };

        res.status(200).json({
            success: true,
            tree: treeData
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 7. Activate User
const activateUser = async (req, res) => {
    try {
        const { userIdToActivate } = req.body;

        const user = await User.findOne({ userId: userIdToActivate });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.isActive) {
            return res.status(400).json({ success: false, message: "User is already Active!" });
        }

        user.isActive = true;
        await user.save();

        if (user.sponsorId) {
            await commissionService.distributeLevelIncome(user.userId, user.sponsorId);
        }

        return res.status(200).json({
            success: true,
            message: `User ${user.userId} Activated & Income Distributed!`
        });

    } catch (error) {
        console.error("❌ Activation Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Jab koi naya user join kare
const distributeCommission = async (sponsorId, amount) => {
    // Level 1 Commission (Direct Referral)
    const sponsor = await User.findById(sponsorId);
    if (sponsor) {
        sponsor.wallet += 500; // Maan lijiye ₹500 commission hai
        await sponsor.save();

        // Level 2 Commission
        const grandSponsor = await User.findById(sponsor.referrerId);
        if (grandSponsor) {
            grandSponsor.wallet += 200;
            await grandSponsor.save();
        }
    }
};

// user.controller.js
const getProfile = async (req, res) => {
    try {
        // 1. Password ko select('-password') karke exclude karna sahi hai
        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // 2. Team count nikalna sahi hai
        const teamCount = await User.countDocuments({ uplineId: user.userId });

        // 🚩 Step 3: toObject() use karein taaki bankDetails.address sahi se jaye
        const userData = user.toObject();

        res.status(200).json({
            success: true,
            data: {
                ...userData, // ✅ Isse saare nested fields (address, bankName) mil jayenge
                teamCount
            }
        });
    } catch (error) {
        console.error("Profile Fetch Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};


const getMe = async (req, res) => {
    try {
        // 🚩 FIX: Ensure karein ki pura user document (including bankDetails) select ho raha hai
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // 🔍 Terminal mein check karein: Kya address yahan print ho raha hai?
        console.log("Database Bank Details:", user.bankDetails);

        res.status(200).json({
            success: true,
            data: user // 🚩 Pura object bhejna hai taaki frontend ko address mile
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// user.controller.js mein naya function add karein
// user.controller.js mein ye naya function add karein
// user.controller.js
const getMyTeamList = async (req, res) => {
    const team = await User.find({ sponsorId: req.user.userId })
        .select('name userId isActive createdAt rank')
        .lean();
    res.json({ success: true, data: team });
};

const getTreeData = async (req, res) => {
    try {
        const { userId } = req.params;
        // 🚩 .limit(3) ko bilkul hata dein taaki saare 10+ members dikhein
        const children = await User.find({ uplineId: userId })
            .select('name userId isActive role')
            .lean();

        // res.json({ success: true, data: { ...user, children } });
        const user = await User.findOne({ userId }).select("name userId role isActive");
        res.json({ success: true, data: { ...user.toObject(), children } });

    } catch (err) { /* error handling */ }
};

// module.exports mein 'getMyTeamList' add karna mat bhulna

// ✅ Export All Functions Correctly
module.exports = {
    registerUser,
    loginUser,
    getMyTeam,
    getDashboardStats,
    getFullTree,
    activateUser,
    distributeCommission,
    getProfile,
    updateKycDetails,
    getMe,
    getMyTeamList,
    getTreeData
};
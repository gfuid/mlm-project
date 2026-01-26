// backend/src/routes/admin.routes.js
const express = require('express');
const router = express.Router();

// 🚩 Sabse Pehle: Saare functions ko controller se extract karein
// Check karein ki koi naam miss toh nahi ho raha
const {
    getAllWithdrawals, verifyUserKyc, toggleUserStatus, getSystemTree, getAllUsers, getPendingWithdrawals, updateWithdrawalStatus, getFullStats, updateAdStatus
} = require('../../controllers/admin.controller');

const { protect, admin } = require('../../middlewares/auth.middleware');

// 🚩 Line 17 ke paas check karein (Handler function undefined nahi hona chahiye)
router.get('/full-stats', protect, admin, getFullStats);
router.get('/users', protect, admin, getAllUsers);
router.get('/tree/:userId', protect, admin, getSystemTree);

// 🚩 Inke naam check karein: controller mein jo export hai wahi yahan hona chahiye
router.patch('/toggle-status/:userId', protect, admin, toggleUserStatus);
router.patch('/verify-kyc/:userId', protect, admin, verifyUserKyc);
router.patch('/withdrawal/status', protect, admin, updateWithdrawalStatus);

module.exports = router;
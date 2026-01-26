// backend/src/routes/admin.routes.js
const express = require('express');
const router = express.Router();

// Import middleware
const { protect, admin } = require('../../middlewares/auth.middleware');

// Import all controller functions
const {
    getFullStats,
    getAllUsers,
    getSystemTree,
    toggleUserStatus,
    verifyUserKyc,
    updateWithdrawalStatus,
    getAllWithdrawals,
    getPendingWithdrawals
} = require('../../controllers/admin.controller');

// ✅ CRITICAL: Check all function imports are defined
console.log('Admin Routes - Checking imports:', {
    getFullStats: typeof getFullStats,
    getAllUsers: typeof getAllUsers,
    getSystemTree: typeof getSystemTree,
    toggleUserStatus: typeof toggleUserStatus,
    verifyUserKyc: typeof verifyUserKyc,
    updateWithdrawalStatus: typeof updateWithdrawalStatus
});

// ==========================================
// ADMIN ROUTES (All protected with admin middleware)
// ==========================================

// Dashboard Stats
router.get('/full-stats', protect, admin, getFullStats);

// Member Management
router.get('/users', protect, admin, getAllUsers);

// Genealogy Tree
router.get('/tree/:userId', protect, admin, getSystemTree);

// User Actions
router.patch('/toggle-status/:userId', protect, admin, toggleUserStatus);
router.patch('/verify-kyc/:userId', protect, admin, verifyUserKyc);

// Withdrawal Management
router.post('/update-withdrawal', protect, admin, updateWithdrawalStatus);
router.get('/withdrawals', protect, admin, getAllWithdrawals);
router.get('/withdrawals/pending', protect, admin, getPendingWithdrawals);

module.exports = router;
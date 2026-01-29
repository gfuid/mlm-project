const express = require('express');
const router = express.Router();

// Import middleware
const { protect, admin } = require('../../middlewares/auth.middleware');

// Import controller
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

// Debug log
console.log('🔍 Admin Routes - Function check:', {
    toggleUserStatus: typeof toggleUserStatus,
    getAllUsers: typeof getAllUsers,
    getFullStats: typeof getFullStats
});

// ✅ ALL ROUTES - Simple and direct
router.get('/full-stats', protect, admin, getFullStats);
router.get('/users', protect, admin, getAllUsers);
router.get('/tree/:userId', protect, admin, getSystemTree);
router.patch('/toggle-status/:userId', protect, admin, toggleUserStatus);  // ⚠️ Direct call, no wrapper
router.patch('/verify-kyc/:userId', protect, admin, verifyUserKyc);
router.post('/update-withdrawal', protect, admin, updateWithdrawalStatus);
router.get('/withdrawals', protect, admin, getAllWithdrawals);
router.get('/withdrawals/pending', protect, admin, getPendingWithdrawals);

module.exports = router;
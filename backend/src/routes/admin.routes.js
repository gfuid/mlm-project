const express = require('express');
const router = express.Router();
const {
    getFullStats,
    getAllUsers,
    getPendingWithdrawals,
    updateWithdrawalStatus,
    getSystemTree,
    toggleUserStatus,
    verifyUserKyc
} = require('../controllers/admin.controller');
const { protect, adminOnly } = require('../middlewares/auth.middleware');


// 🚩 Sabhi routes ko protect karein taaki sirf login user/admin hi dekh sake
router.get('/full-stats', protect, adminOnly, getFullStats);
router.get('/users', protect, getAllUsers);
router.get('/withdrawals/pending', protect, getPendingWithdrawals);
router.post('/withdrawals/update', protect, updateWithdrawalStatus);
router.get('/tree/:userId', protect, getSystemTree);
router.patch('/user/status/:userId', protect, toggleUserStatus);
router.patch('/user/verify-kyc/:userId', protect, verifyUserKyc);

module.exports = router;
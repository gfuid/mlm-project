const express = require('express');
const router = express.Router();
const {
    getMe, getDashboardStats,
    updateKycDetails, getMyTeamList, getTreeData
} = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');

// Public Routes


// Protected Routes (Login Zaroori Hai)
router.get('/me', protect, getMe);
router.get('/dashboard-stats', protect, getDashboardStats);
router.get('/team', protect, getMyTeamList);
router.get('/tree/:userId', protect, getTreeData);
router.put('/update-kyc', protect, updateKycDetails);

module.exports = router;
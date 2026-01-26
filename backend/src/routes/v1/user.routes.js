// backend/src/routes/v1/user.routes.js
const express = require('express');
const router = express.Router();

const {
    getMe,
    getDashboardStats,
    updateKycDetails,
    getMyTeamList,
    getTreeData
} = require('../../controllers/user.controller');

const { protect } = require('../../middlewares/auth.middleware');

// ===== PUBLIC ROUTES =====
// (none for now)

// ===== PROTECTED USER ROUTES =====
router.get('/me', protect, getMe);
router.get('/dashboard-stats', protect, getDashboardStats);
router.get('/team', protect, getMyTeamList);

// ✅ NEW: User's own tree endpoint (no admin middleware needed)
router.get('/tree/:userId', protect, getTreeData);

router.put('/update-kyc', protect, updateKycDetails);

module.exports = router;
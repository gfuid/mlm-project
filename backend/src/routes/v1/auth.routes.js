const express = require('express');
const router = express.Router();
const asyncHandler = require('../../utils/asyncHandler'); // path adjust karein agar zaroorat ho

const {
    adminLogin,
    userLogin,
    register,
    forgotPassword,
    resetPassword,
    checkSponsorLimit
} = require('../../controllers/auth.controller');

// Wrap handlers with asyncHandler so any thrown error is passed to next()
router.post('/admin-login', asyncHandler(adminLogin));
router.post('/login', asyncHandler(userLogin));
router.post('/register', asyncHandler(register));
router.post('/forgot-password', asyncHandler(forgotPassword));
router.post('/reset-password/:token', asyncHandler(resetPassword));
router.get('/check-limit/:userId', asyncHandler(checkSponsorLimit));

module.exports = router;
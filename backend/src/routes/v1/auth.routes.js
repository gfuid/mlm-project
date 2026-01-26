// ❌ Galat: require('.../controllers/user.controller')
// ✅ Sahi: require('../controllers/user.controller')

const express = require('express');
const router = express.Router();
const {
    adminLogin,
    forgotPassword,
    resetPassword,
    userLogin
} = require('../../controllers/auth.controller');
const { registerUser } = require('../../controllers/user.controller'); // 👈 Fixed Path

// Routes logic...
router.post('/admin-login', adminLogin);

// Member App ke liye
router.post('/login', userLogin);
router.post('/register', registerUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
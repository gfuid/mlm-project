// ❌ Galat: require('.../controllers/user.controller')
// ✅ Sahi: require('../controllers/user.controller')

const express = require('express');
const router = express.Router();
const {
    adminLogin,
    forgotPassword,
    resetPassword
} = require('../controllers/auth.controller');
const { registerUser } = require('../controllers/user.controller'); // 👈 Fixed Path

// Routes logic...
router.post('/login', adminLogin);
router.post('/register', registerUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
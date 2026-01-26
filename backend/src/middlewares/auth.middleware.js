const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

// ✅ PROTECT MIDDLEWARE - Verify JWT Token
exports.protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        console.log('🔐 Protect middleware - Token exists:', !!token);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized. No token provided.'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('✅ Token decoded:', {
            userId: decoded.userId,
            role: decoded.role,
            _id: decoded._id
        });

        // ✅ FIXED: Handle both env admin and database users
        if (decoded.userId === 'ADMIN001' && decoded.role === 'admin') {
            // This is the master admin from .env
            req.user = {
                _id: decoded._id,
                userId: decoded.userId,
                role: decoded.role,
                name: 'System Admin',
                email: process.env.ADMIN_EMAIL
            };
            console.log('✅ Master admin authenticated');
            return next();
        }

        // Find user in database
        const user = await User.findById(decoded._id).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found. Token invalid.'
            });
        }

        // Attach user to request
        req.user = user;
        console.log('✅ User authenticated:', user.userId);

        next();

    } catch (error) {
        console.error('❌ Auth middleware error:', error.message);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired. Please login again.'
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. Please login again.'
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Not authorized. Authentication failed.'
        });
    }
};

// ✅ ADMIN MIDDLEWARE - Check if user is admin
exports.admin = (req, res, next) => {
    console.log('🛡️ Admin middleware check:', {
        userId: req.user?.userId,
        role: req.user?.role,
        isAdmin: req.user?.role === 'admin'
    });

    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Admin access required. Unauthorized.'
        });
    }

    console.log('✅ Admin access granted for:', req.user.userId);
    next();
};

// ✅ ACTIVE USER MIDDLEWARE - Check if user account is active
exports.activeUser = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    // Skip active check for admins
    if (req.user.role === 'admin') {
        return next();
    }

    if (!req.user.isActive) {
        return res.status(403).json({
            success: false,
            message: 'Account is not active. Please contact support.'
        });
    }

    next();
};
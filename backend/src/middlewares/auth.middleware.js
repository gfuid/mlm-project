const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const protect = async (req, res, next) => {
    let token;

    // Check if Authorization header exists
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Extract token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find user from database (excluding password)
            req.user = await User.findById(decoded._id).select('-password');

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found in database'
                });
            }

            // Check if user is active
            if (!req.user.isActive) {
                return res.status(403).json({
                    success: false,
                    message: 'Your account has been deactivated'
                });
            }

            // Attach user to request
            console.log('✅ User authenticated:', req.user.userId, req.user.role);
            next();

        } catch (error) {
            console.error('❌ Token verification failed:', error.message);

            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token'
                });
            }

            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token expired, please login again'
                });
            }

            return res.status(401).json({
                success: false,
                message: 'Authentication failed'
            });
        }
    } else {
        console.error('❌ No token provided in request');
        return res.status(401).json({
            success: false,
            message: 'No authentication token provided'
        });
    }
};

const admin = (req, res, next) => {
    try {
        // Check if user exists (protect middleware should run first)
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required before admin check'
            });
        }

        // Check if user has admin role
        if (req.user.role !== 'admin') {
            console.error('❌ Access denied for user:', req.user.userId, 'Role:', req.user.role);
            return res.status(403).json({
                success: false,
                message: 'Admin access required. Your role is: ' + req.user.role
            });
        }

        console.log('✅ Admin access granted for:', req.user.userId);
        next();

    } catch (error) {
        console.error('❌ Admin middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Admin verification failed'
        });
    }
};

module.exports = { protect, admin };
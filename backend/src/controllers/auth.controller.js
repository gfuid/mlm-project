const crypto = require("crypto");
const nodemailer = require('nodemailer');
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ✅ UNIFIED TOKEN GENERATOR
const generateToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
            userId: user.userId,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
    );
};

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('🔐 Admin login attempt for:', email);

        // 🚩 1. Check .env credentials first (Master Access)
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            console.log("🚀 Admin Login via .env (Master Access)");

            // ✅ FIXED: Generate token with SAME structure as user login
            const token = jwt.sign(
                {
                    _id: process.env.ADMIN_DB_ID || 'SYSTEM_ADMIN',
                    userId: 'ADMIN001', // ✅ Added userId (was missing!)
                    role: 'admin'
                },
                process.env.JWT_SECRET,
                { expiresIn: '30d' } // ✅ Changed from 24h to 30d for consistency
            );

            return res.status(200).json({
                success: true,
                token, // ✅ Top level token
                user: {
                    _id: process.env.ADMIN_DB_ID || 'SYSTEM_ADMIN',
                    userId: 'ADMIN001', // ✅ Added userId
                    name: "System Admin",
                    email: process.env.ADMIN_EMAIL,
                    role: "admin"
                },
                message: "Master Access Granted"
            });
        }

        // 🚩 2. Check database for admin user
        const admin = await User.findOne({
            email: email.toLowerCase(),
            role: 'admin'
        });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Identity not found in System or Database"
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Access Key"
            });
        }

        // ✅ Use unified token generator
        const token = generateToken(admin);

        return res.status(200).json({
            success: true,
            token, // ✅ Top level token
            user: {
                _id: admin._id,
                userId: admin.userId, // ✅ Include userId
                name: admin.name,
                email: admin.email,
                role: admin.role
            },
            message: "Database Admin Access Granted"
        });

    } catch (err) {
        console.error('❌ Admin login error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// User Login
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Identity not found in System"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Access Key"
            });
        }

        // ✅ Use unified token generator
        const token = generateToken(user);

        return res.status(200).json({
            success: true,
            token, // ✅ Top level token
            user: {
                _id: user._id,
                name: user.name,
                userId: user.userId,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            },
            message: "Login successful"
        });

    } catch (err) {
        console.error('❌ User login error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// Forgot Password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Network Identity (Email) not found!"
            });
        }

        // Generate secure random token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Save token to database
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Create reset URL
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // Email configuration
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"Karan Ads Security" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Secure Access Recovery - Karan Ads',
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #ea580c;">Access Recovery Requested</h2>
                    <p>You requested a password reset. Click the button below to set a new access key:</p>
                    <a href="${resetUrl}" style="background: #0f172a; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; margin: 20px 0;">Reset Password</a>
                    <p style="font-size: 12px; color: #64748b;">This link is valid for 1 hour only.</p>
                    <p style="font-size: 12px; color: #64748b;">If you didn't request this, please ignore this email.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: "A secure recovery link has been sent to your email!"
        });
    } catch (error) {
        console.error('❌ Forgot password error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Link is invalid or has expired!"
            });
        }

        // Set new password (hashing handled by User model pre-save)
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Security protocol complete. New password has been set!"
        });
    } catch (error) {
        console.error('❌ Reset password error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    forgotPassword,
    resetPassword,
    adminLogin,
    userLogin
};
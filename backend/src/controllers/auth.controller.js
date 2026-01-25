const crypto = require("crypto");
const nodemailer = require('nodemailer');
const User = require('../models/User.model'); // User model ensure karein
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Database se admin user dhundhein
        const admin = await User.findOne({ email, role: 'admin' });

        if (!admin) {
            return res.status(401).json({ success: false, message: "Admin access denied" });
        }


        // 2. Password check (Yahan bcrypt use karna best hai)
        // Agar aapne .env mein password rakha hai toh use bhi compare kar sakte hain
        if (password !== admin.password) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
        // 2. Password check (Hashing support ke saath)
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
        // 3. Token Generate karein
        const token = jwt.sign(
            { _id: admin._id, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            success: true,
            token,
            user: { name: admin.name, email: admin.email, role: admin.role },
            message: "Master Access Granted"
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


// 1. Forgot Password - Unique Link Bhejne ke liye
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({ success: false, message: "Network Identity (Email) not found!" });
        }

        // 🔐 Secure Random Token Generate karein
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Token ko database mein save karein
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 ghante ki validity
        await user.save();

        // 🔗 Reset Link banayein (Frontend URL)
        // Frontend par humne path set kiya hai: /reset-password/:token
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // 📧 Email Configuration
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
                    <p>Bhai, aapne password reset ke liye request ki thi. Niche diye gaye button par click karke naya access key set karein:</p>
                    <a href="${resetUrl}" style="background: #0f172a; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; margin: 20px 0;">Reset Password</a>
                    <p style="font-size: 12px; color: #64748b;">Ye link sirf 1 ghante ke liye valid hai.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: "A secure recovery link has been sent to your email!"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Reset Password - Token se verify karke update karna
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params; // URL se token aayega
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } // Token expired nahi hona chahiye
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Link invalid hai ya expire ho chuka hai!" });
        }

        // Naya password set karein (Hashing User model ka 'pre-save' handle karega)
        user.password = password;
        user.resetPasswordToken = undefined; // Token clear karein
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ success: true, message: "Security protocol complete. Naya password set ho gaya hai!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    forgotPassword,
    resetPassword,
    adminLogin
};
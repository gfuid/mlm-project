const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// 1. Proxy support (Render/Heroku ke liye zaroori)
app.set('trust proxy', 1);

// 2. 🚩 CORS: Routes se PEHLE define karein (ZAROORI HAI)
const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL
];

// Backend mein ye add karein
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:5174', // Aapke Admin Panel ka URL
    credentials: true
}));

// 3. Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 4. Security: Rate Limiters
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { success: false, message: "Too many login attempts, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

const emailLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { success: false, message: "Too many requests. Please wait 15 minutes." }
});

// 5. Apply Limiters to Specific Endpoints
app.use('/api/v1/auth/login', loginLimiter);
app.use('/api/v1/auth/forgot-password', emailLimiter);

// 6. Routes Registration
app.use('/api/v1/auth', require('./routes/v1/auth.routes'));
app.use('/api/v1/user', require('./routes/v1/user.routes'));
app.use('/api/v1/admin', require('./routes/v1/admin.routes'));

module.exports = app;
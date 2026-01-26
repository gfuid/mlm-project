const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

// Proxy (Render / Heroku safe)
app.set('trust proxy', 1);

// ✅ SINGLE CORS CONFIG
app.use(cors({
    origin: [
        'http://localhost:5173', // frontend
        'http://localhost:5174'  // admin panel
    ],
    origin: true,
    credentials: true,

}));

// Body parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiters
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20
});

const emailLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5
});

app.use('/api/v1/auth/login', loginLimiter);
app.use('/api/v1/auth/forgot-password', emailLimiter);

// Routes
app.use('/api/v1/auth', require('./routes/v1/auth.routes'));
app.use('/api/v1/user', require('./routes/v1/user.routes'));
app.use('/api/v1/admin', require('./routes/v1/admin.routes'));

module.exports = app;

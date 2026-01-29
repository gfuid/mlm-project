const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/v1/auth.routes');

const app = express();

// Proxy (Render / Heroku safe)
app.set('trust proxy', 1);

// ✅ FIXED: SINGLE CORS CONFIGURATION (removed duplicate 'origin')
app.use(cors({
    origin: [
        'http://localhost:5173', // frontend
        'http://localhost:5174', // admin panel
        process.env.FRONTEND_URL, // production frontend
        process.env.ADMIN_URL      // production admin
    ].filter(Boolean), // Remove undefined values
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));



// Body parsers

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));


// Global error handler (place after all routes)
app.use((err, req, res, next) => {
    console.error('🔥 Uncaught error:', err.stack || err);
    if (process.env.NODE_ENV === 'development') {
        return res.status(err.status || 500).json({ success: false, message: err.message, stack: err.stack });
    }
    res.status(err.status || 500).json({ success: false, message: 'Internal Server Error' });
});

// Rate limiters
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 attempts
    message: { success: false, message: 'Too many login attempts. Please try again later.' }
});

const emailLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts
    message: { success: false, message: 'Too many email requests. Please try again later.' }
});

// Apply rate limiters
app.use('/api/v1/auth/login', loginLimiter);
app.use('/api/v1/auth/admin-login', loginLimiter);
app.use('/api/v1/auth/forgot-password', emailLimiter);
app.use('/api/v1/auth', authRoutes);
// Routes
app.use('/api/v1/auth', require('./routes/v1/auth.routes'));
app.use('/api/v1/user', require('./routes/v1/user.routes'));
app.use('/api/v1/admin', require('./routes/v1/admin.routes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// ✅ FIXED: 404 handler - Use different syntax for catch-all
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('❌ Server error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

module.exports = app;
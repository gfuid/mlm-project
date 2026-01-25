const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// 1. JSON Middleware (Sabse upar)
app.use(express.json());

// 2. 🛡️ CORS Logic (Routes se PEHLE hona chahiye)
const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            console.log("Blocked by CORS:", origin);
            return callback(new Error('Not allowed by CORS'), false);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
}));

// 3. 🚀 Routes Registration (CORS ke BAAD)
// Auth routes login/forgot password ke liye
app.use('/api/v1/auth', require('./routes/auth.routes'));

// Admin routes full-stats/users ke liye
app.use('/api/v1/admin', require('./routes/admin.routes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
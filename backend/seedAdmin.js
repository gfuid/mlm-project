const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./src/models/User.model'); // Path sahi rakhein

dotenv.config();

const seedAdmin = async () => {
    try {
        // 1. Database Connection
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected for Seeding...");

        // 2. Pehle check karein ki admin pehle se toh nahi hai
        const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
        if (adminExists) {
            console.log("⚠️ Admin already exists in DB. No need to seed.");
            process.exit();
        }

        // 3. Password Hash karein
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

        // 4. Admin Create karein
        await User.create({
            name: "Master Admin",
            email: process.env.ADMIN_EMAIL, // .env se uthayega: master@system.com
            password: hashedPassword,
            mobile: "0000000000",
            userId: "KARAN1001",
            role: "admin", // 👈 Ye compulsory hai
            isActive: true,
            sponsorId: "SYSTEM",
            uplineId: "SYSTEM",
            rank: "Hero No 1"
        });

        console.log("🚀 Admin Seeded Successfully! Email:", process.env.ADMIN_EMAIL);
        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error.message);
        process.exit(1);
    }
};

seedAdmin();
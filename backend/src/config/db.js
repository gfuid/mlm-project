const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Connection string .env se uthayenge
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Failure par process stop kar do
    }
};

module.exports = connectDB;
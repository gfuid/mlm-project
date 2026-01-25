const Counter = require('../models/Counter.model');

const getNextUserId = async (session) => {
    const counter = await Counter.findOneAndUpdate(
        { id: "userId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true, session }
    );
    return `KARAN${counter.seq}`; // Example: KARAN1001
};

module.exports = { getNextUserId }; 
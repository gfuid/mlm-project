const User = require('../models/User.model');

/**
 * findUpline: Yeh function naye member ke liye sahi "Parent" dhoondta hai
 * @param {String} sponsorId - Jisne refer kiya
 * @param {Object} session - Database transaction session
 */
const findUpline = async (sponsorId, session) => {
    // 1. Pehle Sponsor ko dhoondo
    const sponsor = await User.findOne({ userId: sponsorId }).session(session);
    if (!sponsor) throw new Error("Sponsor not found in the network");

    // 2. Queue logic use karke Level-by-Level khali jagah dhoondo (BFS Algorithm)
    let queue = [sponsor.userId];
    let visited = new Set();

    while (queue.length > 0) {
        let currentUplineId = queue.shift();

        // Is upline ke direct children count karo (Matrix limit: 3)
        const children = await User.find({ uplineId: currentUplineId }).session(session);

        if (children.length < 3) {
            // Agar 3 se kam hain, toh yahi sahi Upline hai!
            return currentUplineId;
        }

        // Agar full hai, toh iske bachon ko queue mein daalo taaki unke niche check ho sake
        for (let child of children) {
            if (!visited.has(child.userId)) {
                visited.add(child.userId);
                queue.push(child.userId);
            }
        }
    }

    throw new Error("Matrix is full or system error occurred");
};

module.exports = { findUpline };
const express = require('express');
const db = require('../services/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
    const [dummy, mine] = await Promise.all([
        db.listLeaderboardDummy(),
        db.getLatestHealthScore(req.user.id),
    ]);
    const { data: user } = await db.getUserById(req.user.id);

    const entries = (dummy.data || []).map(d => ({
        rank: d.rank, display_name: d.display_name, score: d.score, is_me: false,
    }));
    const myScore = mine.data?.score || 0;
    // insert current user by score
    const myEntry = { display_name: user?.full_name || user?.username || 'You', score: myScore, is_me: true };
    const merged = [...entries, myEntry].sort((a, b) => b.score - a.score);
    merged.forEach((e, i) => e.rank = i + 1);

    const myRank = merged.find(e => e.is_me)?.rank;
    res.json({ top: merged.slice(0, 11), my_rank: myRank, my_score: myScore });
});

module.exports = router;

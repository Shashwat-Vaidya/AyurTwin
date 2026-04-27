const express = require('express');
const chatbotEngine = require('../engines/chatbotEngine');
const { optional, authenticate } = require('../middleware/auth');
const db = require('../services/db');
const { currentSeason } = require('../engines/common');

const router = express.Router();

// Enhanced chatbot endpoint with personalization
router.post('/', optional, async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'message required' });
    
    // Gather user context for personalized responses
    let userContext = { season: currentSeason() };
    
    if (req.user) {
        try {
            const [prakritiRes] = await Promise.all([
                db.getLatestPrakriti(req.user.id),
            ]);
            if (prakritiRes.data?.prakriti) {
                userContext.prakriti = prakritiRes.data.prakriti;
            }
        } catch (error) {
            console.warn('Error fetching user context:', error.message);
        }
    }
    
    // Get personalized answer
    const answer = chatbotEngine.answer(message, userContext);
    res.json(answer);
});

module.exports = router;

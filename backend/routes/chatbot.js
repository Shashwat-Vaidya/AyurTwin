const express = require('express');
const chatbotEngine = require('../engines/chatbotEngine');
const { optional } = require('../middleware/auth');

const router = express.Router();

router.post('/', optional, (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'message required' });
    res.json(chatbotEngine.answer(message));
});

module.exports = router;

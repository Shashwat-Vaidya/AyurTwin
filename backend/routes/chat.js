/**
 * Chatbot Routes - Ayurvedic health assistant
 */
const express = require('express');
const router = express.Router();
const db = require('../services/db');
const { getCurrentRitu } = require('../engines/ayurvedicEngine');

// POST /api/chat
router.post('/', async (req, res) => {
  try {
    const { user_id, message } = req.body;
    await db.saveChatMessage(user_id, message, 'user');

    // Get user context for personalized responses
    const profile = await db.fetchCompleteUserProfile(user_id);
    const msg = message.toLowerCase();
    const prakriti = profile.prakriti?.prakriti || 'Unknown';

    let response = "I can help with dosha analysis, diet, yoga, stress, sleep, disease prevention, and Ayurvedic remedies. Try asking specifically!";

    if (msg.includes('my dosha') || msg.includes('my prakriti')) {
      response = `Your Prakriti is ${prakriti}. Vata: ${profile.prakriti?.vata_percent || '?'}%, Pitta: ${profile.prakriti?.pitta_percent || '?'}%, Kapha: ${profile.prakriti?.kapha_percent || '?'}%. This is your natural constitution.`;
    } else if (msg.includes('stress') || msg.includes('anxiety')) {
      response = `For stress management per your ${prakriti} constitution: 1) Ashwagandha (300mg before bed) 2) Bhramari pranayama (bee breath) 5 min daily 3) Abhyanga with warm sesame oil 4) Regular sleep schedule 5) Warm milk with nutmeg before sleep. Avoid caffeine and cold foods.`;
    } else if (msg.includes('diet') || msg.includes('food') || msg.includes('eat')) {
      response = `For your ${prakriti} constitution: Focus on fresh, seasonal foods. Eat largest meal at noon when Agni is strongest. Avoid ice-cold drinks. Include all 6 tastes daily. Check the Food Recommendations section for your complete personalized plan.`;
    } else if (msg.includes('yoga') || msg.includes('exercise')) {
      response = `Based on your ${prakriti} constitution, I have curated yoga practices for you. Vata needs grounding slow practice, Pitta needs cooling moderate practice, Kapha needs vigorous stimulating practice. Check the Yoga section for your sessions.`;
    } else if (msg.includes('sleep') || msg.includes('insomnia')) {
      response = `For better sleep: 1) Oil soles of feet with warm sesame oil 2) Nutmeg milk 30 min before bed 3) Bhramari pranayama 4) No screens 1 hour before sleep 5) Sleep by 10 PM (Kapha time promotes deep sleep).`;
    } else if (msg.includes('nadi') || msg.includes('pulse')) {
      response = `Nadi Pariksha is ancient Ayurvedic pulse diagnosis. Vata pulse moves like a snake (thin, irregular), Pitta like a frog (jumping, strong), Kapha like a swan (steady, glides). Check Nadi section for your digital pulse analysis.`;
    } else if (msg.includes('panchakarma') || msg.includes('detox')) {
      response = `Panchakarma is the 5-therapy Ayurvedic detox system: Vamana (emesis), Virechana (purgation), Basti (enema), Nasya (nasal), Raktamokshana (blood cleansing). Take the Panchakarma Readiness assessment in the app.`;
    } else if (msg.includes('season') || msg.includes('ritucharya')) {
      const ritu = getCurrentRitu();
      response = `Current Ayurvedic season: ${ritu.ritu} (${ritu.english}). ${ritu.dominant}. Favor tastes: ${ritu.taste}. Check Ritucharya section for complete seasonal guidance.`;
    } else if (msg.includes('sensor') || msg.includes('heart rate') || msg.includes('temperature') || msg.includes('spo2')) {
      response = `Your sensor data is being monitored every 5 seconds via IoT sensors (DS18B20 for temperature, MAX30102 for heart rate & SpO2, MPU6050 for motion). Check your Dashboard for live readings and health alerts.`;
    } else if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      response = `Namaste! I'm your AyurTwin health assistant. I can help with dosha analysis, personalized diet, yoga, disease prevention, Panchakarma readiness, and more. What would you like to know?`;
    }

    await db.saveChatMessage(user_id, response, 'bot');
    res.json({ success: true, response });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

/**
 * Static Ayurveda education content + Panchakarma info.
 * Read-only, no DB.
 */
const express = require('express');
const router = express.Router();

const PANCHAKARMA = {
    title: 'Panchakarma — Classical Five Purification Therapies',
    overview: 'Panchakarma is the cornerstone Ayurvedic detoxification protocol. It removes deep-seated toxins (ama), restores doshic balance, and rejuvenates tissues. Performed only under qualified vaidya supervision after proper preparation (purva karma).',
    procedures: [
        { name: 'Vamana',        meaning: 'Therapeutic emesis',          indication: 'Kapha disorders - asthma, obesity, chronic skin issues' },
        { name: 'Virechana',     meaning: 'Medicated purgation',         indication: 'Pitta disorders - skin, liver, acidity, migraines' },
        { name: 'Basti',         meaning: 'Medicated enema',             indication: 'Vata disorders - arthritis, constipation, neurological' },
        { name: 'Nasya',         meaning: 'Nasal medication',            indication: 'Head/neck disorders - sinus, migraine, clarity' },
        { name: 'Raktamokshana', meaning: 'Bloodletting (rare/modern)',  indication: 'Blood-borne conditions, skin disorders' },
    ],
    phases: [
        { phase: 'Purva Karma',  desc: 'Preparation - snehapana (internal oleation) + swedana (sudation) for 3-7 days' },
        { phase: 'Pradhana Karma', desc: 'Main procedure - one of the five therapies' },
        { phase: 'Paschat Karma', desc: 'Post-therapy diet + lifestyle for gradual return to normal' },
    ],
    duration: '7-21 days typically',
    caveat: 'Always done under a qualified Ayurvedic physician. Self-administration is unsafe.',
};

const EDUCATION_TOPICS = [
    { id: 'doshas',     title: 'The Three Doshas',       body: 'Vata (air+space), Pitta (fire+water), Kapha (earth+water) - the three biological energies that govern all physiological processes.' },
    { id: 'prakriti',   title: 'Prakriti - Your Constitution', body: 'Birth-determined mix of doshas. Guides lifelong diet, lifestyle, and routine choices.' },
    { id: 'agni',       title: 'Agni - Digestive Fire',   body: 'The transformative fire of digestion and metabolism. Strong agni = health; weak agni = toxins (ama).' },
    { id: 'ojas',       title: 'Ojas - Essence of Immunity', body: 'Refined end-product of perfect digestion. Supports immunity, vitality, and mental clarity.' },
    { id: 'dinacharya', title: 'Dinacharya - Daily Routine', body: 'Wake pre-dawn, warm water, tongue-scrape, oil-pull, abhyanga, yoga, meditation, noon main meal, light dinner, sleep by 10pm.' },
    { id: 'ritucharya', title: 'Ritucharya - Seasonal Regimen', body: 'Adjusting diet and routine to the 6 Ayurvedic seasons for year-round balance.' },
    { id: 'six-tastes', title: 'The Six Tastes',          body: 'Sweet, sour, salty, pungent, bitter, astringent. All six should appear in a balanced meal.' },
    { id: 'abhyanga',   title: 'Abhyanga - Self Massage', body: 'Daily warm-oil massage - nourishes skin, calms nerves, promotes longevity. Sesame for vata, coconut for pitta, mustard for kapha.' },
    { id: 'yoga',       title: 'Yoga and Ayurveda',       body: 'Yoga = spiritual-physical practice; Ayurveda = health science. Together they complete the wellness framework.' },
    { id: 'three-guna', title: 'Sattva, Rajas, Tamas',    body: 'Three mental qualities that shape thoughts, emotions, and food choices. Aim to increase sattva.' },
];

router.get('/', (_req, res) => {
    res.json({ topics: EDUCATION_TOPICS });
});

router.get('/topic/:id', (req, res) => {
    const t = EDUCATION_TOPICS.find(x => x.id === req.params.id);
    if (!t) return res.status(404).json({ error: 'not found' });
    res.json({ topic: t });
});

router.get('/panchakarma', (_req, res) => {
    res.json(PANCHAKARMA);
});

module.exports = router;

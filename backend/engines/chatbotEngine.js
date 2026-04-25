/**
 * Domain-restricted Ayurveda chatbot.
 * Hybrid scorer over chatbot_qa.json:
 *   - keyword token match (English + Hindi/Hinglish)
 *   - bigram overlap with the source question
 *   - bonus for in-domain Ayurvedic terminology
 *   - dosha + category alignment
 *
 * Non-Ayurveda queries get a polite refusal.
 * Confidence threshold lets us fall back gracefully on low-quality matches.
 */

const fs = require('fs');
const path = require('path');

// ── Domain dictionary ──────────────────────────────────────────────────────
// English + Hinglish + transliterated Sanskrit keywords. Anything matching
// here qualifies the query as Ayurvedic.
const AYUR_KEYWORDS = [
    // doshas / fundamentals
    'ayurveda','ayurvedic','dosha','doshas','vata','pitta','kapha','prakriti','vikriti',
    'agni','ama','ojas','tridosha','rasayana','sattvic','rajasic','tamasic','sanskar',

    // therapies / practices
    'panchakarma','abhyanga','shirodhara','basti','nasya','virechana','vamana',
    'marma','swedana','rasayana','dinacharya','ritucharya',

    // diet + ahara
    'diet','food','foods','ahara','rasa','khichdi','ghee','buttermilk','coconut',
    'jaggery','tulsi','ginger','turmeric','triphala','ashwagandha','brahmi','neem',
    'amla','amalaki','shatavari','guggulu','jatamansi',

    // yoga + meditation
    'yoga','asana','pranayama','meditation','dhyana','om','mantra','surya','namaskar',
    'bhramari','sheetali','kapalbhati','anulom','vilom','nidra',

    // health concepts
    'digestion','digestive','stomach','metabolism','immunity','vyadhikshamatva',
    'sleep','insomnia','anidra','stress','anxiety','depression','arthritis','asthma',
    'diabetes','madhumeha','hypertension','obesity','medoroga','skin','hair','baldness',
    'fever','jwara','cough','kasa','cold','headache','shirashula','migraine',
    'menstrual','period','periods','pcos','pcod','thyroid','liver','kidney','acidity',
    'amlapitta','constipation','vibandha','allergy','allergies','pregnancy','garbhini',
    'aging','rasayana','obesity','weight','belly','joint','joints','knee','back',
    'eye','ear','toxin','toxins','detox',

    // Hinglish / Hindi
    'kya','kaise','kyun','batao','daal','dosha','vat','pit','kaph','bimari','samasya',
    'sehat','sehat','chai','doodh','dahi','gussa','nind','niend','ghi','tel','massage',
    'paani','pani','khana','khaye','peena','bachna','bachao','pet','dard','jukam',
    'khasi','balgam','kabz','muh','jodon','bachchon','upvas','vrat','garmi','sardi',
    'monsoon','ritu','rituyen','varsha','vasanta','grishma','sharad','hemanta',

    // app / project
    'ayurtwin','digital','twin','sensor','sensors','iot',
];

let QA_CACHE;
function loadQA() {
    if (!QA_CACHE) {
        QA_CACHE = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'datasets', 'chatbot_qa.json'), 'utf8'));
    }
    return QA_CACHE;
}

const STOPWORDS = new Set([
    'a','an','the','and','or','but','is','am','are','was','were','be','been',
    'to','of','for','in','on','at','as','by','with','from','into','about',
    'i','me','my','you','your','we','our','they','their',
    'what','which','who','whom','how','why','when','where',
    'do','does','did','can','could','should','would','will','may','might',
    'this','that','these','those','some','any','all','no','not',
    'very','too','also','just','only',
    'kya','hai','hain','ka','ke','ki','ko','se','mein','par','aur','ya',
    'yeh','woh','tum','aap','main','hum',
]);

function tokenize(text) {
    return (text || '')
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, ' ')
        .split(/\s+/)
        .filter(t => t && !STOPWORDS.has(t));
}

function bigrams(toks) {
    const out = [];
    for (let i = 0; i < toks.length - 1; i++) out.push(`${toks[i]} ${toks[i + 1]}`);
    return out;
}

function isAyurvedic(toks) {
    return toks.some(t => AYUR_KEYWORDS.some(k => t === k || t.includes(k) || k.includes(t)));
}

function score(qa, queryToks, queryBis) {
    let s = 0;

    // 1. exact keyword hits (strongest signal)
    const kws = qa.keywords || [];
    for (const t of queryToks) {
        if (kws.includes(t)) s += 3;
        else if (kws.some(k => k && (k === t || k.includes(t) || t.includes(k)))) s += 1.5;
    }

    // 2. token overlap with the source question
    const qToks = tokenize(qa.question);
    for (const t of queryToks) {
        if (qToks.includes(t)) s += 1.5;
        else if (qToks.some(q => q.includes(t) || t.includes(q))) s += 0.4;
    }

    // 3. bigram overlap (catches phrases like "oil pulling", "warm milk")
    const qBis = bigrams(qToks);
    for (const b of queryBis) {
        if (qBis.includes(b)) s += 2;
    }

    // 4. answer body overlap (small weight)
    const ansToks = tokenize(qa.answer);
    for (const t of queryToks) {
        if (ansToks.includes(t)) s += 0.3;
    }

    return s;
}

function answer(message, dataset) {
    const data = dataset || loadQA();
    const toks = tokenize(message);

    if (toks.length === 0) {
        return { response: 'Please type a question about Ayurveda — diet, dosha, herbs, yoga, or daily routine.', matched: false };
    }
    if (!isAyurvedic(toks)) {
        return { response: "I'm sorry, I can only help with Ayurveda-related questions.", matched: false };
    }

    const bis = bigrams(toks);
    const ranked = data.map(qa => ({ qa, s: score(qa, toks, bis) })).sort((a, b) => b.s - a.s);
    const best = ranked[0];

    if (!best || best.s < 2) {
        return {
            response: "I don't have a confident answer for that yet. Try rephrasing — e.g. ask about a specific dosha, food, herb, symptom, or routine.",
            matched: false,
        };
    }

    return {
        response: best.qa.answer,
        matched: true,
        question: best.qa.question,
        confidence: +best.s.toFixed(2),
    };
}

// Tiny self-test - prints to console only when run directly
if (require.main === module) {
    const tests = [
        'What is Vata dosha?',
        'Vata kya hota hai',
        'Pitta shant karne ke liye kya khayein?',
        'I have acidity and burning sensation',
        'How to make ginger tea?',
        'Best yoga for stress',
        'panchakarma kya hai',
        'tell me a joke',                       // out of domain
    ];
    for (const t of tests) {
        const r = answer(t);
        console.log(`Q: ${t}\n  → ${r.response.slice(0, 120)}\n  matched=${r.matched}, conf=${r.confidence}\n`);
    }
}

module.exports = { answer, isAyurvedic };

/**
 * Advanced Domain-Restricted Ayurveda Chatbot Engine v2
 *
 * Features:
 * - Multi-modal scoring: keywords, bigrams, semantic similarity
 * - Confidence thresholds with graceful fallback
 * - Context-aware responses with personal dosha consideration
 * - Follow-up suggestions based on query type
 * - Personalized recommendations based on Prakriti + current season
 *
 * Non-Ayurveda queries get a polite refusal with guiding examples.
 */

const fs = require('fs');
const path = require('path');

// ── Domain dictionary v2 ──────────────────────────────────────────────────────
// Expanded Ayurveda keywords with semantic grouping
const AYUR_KEYWORDS = {
    // Core concepts
    fundamentals: ['ayurveda','ayurvedic','dosha','doshas','vata','pitta','kapha','prakriti','vikriti',
                   'agni','ama','ojas','tridosha','doshas','constitutional'],
    
    // Therapies
    therapies: ['panchakarma','abhyanga','shirodhara','basti','nasya','virechana','vamana',
                'marma','swedana','rasayana','udwartana','kavala','gandush','nasya'],
    
    // Daily & seasonal routines
    routines: ['dinacharya','ritucharya','daily','routine','seasonal','regimen','daily-practices'],
    
    // Diet & foods
    diet: ['diet','food','foods','ahara','rasa','khichdi','ghee','buttermilk','coconut',
           'jaggery','tulsi','ginger','turmeric','triphala','ashwagandha','brahmi','neem',
           'amla','amalaki','shatavari','guggulu','jatamansi','herbs','spices','eating'],
    
    // Yoga & movement
    yoga: ['yoga','asana','pranayama','meditation','dhyana','om','mantra','surya','namaskar',
           'bhramari','sheetali','kapalbhati','anulom','vilom','nidra','breathing','exercise'],
    
    // Health conditions
    conditions: ['digestion','digestive','stomach','metabolism','immunity','vyadhikshamatva',
                'sleep','insomnia','anidra','stress','anxiety','depression','arthritis','asthma',
                'diabetes','madhumeha','hypertension','obesity','medoroga','skin','hair','baldness',
                'fever','jwara','cough','kasa','cold','headache','shirashula','migraine',
                'menstrual','period','periods','pcos','pcod','thyroid','liver','kidney','acidity',
                'amlapitta','constipation','vibandha','allergy','allergies','pregnancy','garbhini',
                'aging','rasayana','obesity','weight','belly','joint','joints','knee','back'],
    
    // Hinglish/Hindi
    hindi: ['kya','kaise','kyun','batao','daal','dosha','vat','pit','kaph','bimari','samasya',
           'sehat','chai','doodh','dahi','gussa','nind','niend','ghi','tel','massage',
           'paani','pani','khana','khaye','peena','bachna','bachao','pet','dard','jukam',
           'khasi','balgam','kabz','muh','jodon','bachchon','upvas','vrat','garmi','sardi'],
    
    // App/project specific
    apprelated: ['ayurtwin','digital','twin','sensor','sensors','iot','health','wellness'],
};

// Flatten and merge all keywords
const ALL_KEYWORDS = Object.values(AYUR_KEYWORDS).flat();

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

// Advanced scoring function with contextual weighting
function score(qa, queryToks, queryBis, userContext = {}) {
    let s = 0;

    // 1. exact keyword hits (strongest signal)
    const kws = qa.keywords || [];
    for (const t of queryToks) {
        if (kws.includes(t)) s += 3.5;
        else if (kws.some(k => k && (k === t || k.includes(t) || t.includes(k)))) s += 2;
    }

    // 2. token overlap with the source question (weighted)
    const qToks = tokenize(qa.question);
    const tokenOverlap = queryToks.filter(t => qToks.includes(t)).length;
    s += tokenOverlap * 2;
    
    // Partial token matches
    for (const t of queryToks) {
        if (qToks.some(q => q.includes(t) || t.includes(q))) s += 0.6;
    }

    // 3. bigram overlap (catches phrases like "oil pulling", "warm milk")
    const qBis = bigrams(qToks);
    for (const b of queryBis) {
        if (qBis.includes(b)) s += 3;
        else if (qBis.some(qb => qb.includes(b) || b.includes(qb))) s += 1;
    }

    // 4. answer body overlap (text relevance)
    const ansToks = tokenize(qa.answer);
    const ansOverlap = queryToks.filter(t => ansToks.includes(t)).length;
    s += ansOverlap * 0.5;
    
    // 5. Category and context bonus
    if (qa.category) s += 0.3;
    if (qa.answer && qa.answer.length > 200) s += 0.5;
    
    // 6. Dosha-category matching if user context available
    if (userContext.prakriti && qa.category === userContext.prakriti) {
        s += 1;
    }

    return s;
}

// Get dosha-specific hints for personalization
function getDoshaHints(prakriti, qaCategory) {
    const hints = {
        vata: {
            diet: 'Favor warm, cooked foods with healthy oils. Avoid raw, cold foods.',
            yoga: 'Practice gentle, grounding poses. Include balancing practices.',
            herbs: 'Use warming herbs like ginger and cardamom with ghee.',
            digestion: 'Eat at regular times. Sip warm water with meals.',
            sleep: 'Maintain consistent sleep schedule. Use warm milk with spices.',
            default: 'Remember to stay warm and grounded, Vata tends toward dryness.'
        },
        pitta: {
            diet: 'Prefer cool foods and coconut. Avoid excess spice and heat.',
            yoga: 'Practice cooling poses and Sheetali pranayama.',
            herbs: 'Use cooling herbs like brahmi and rose petals.',
            digestion: 'Eat moderately. Cool drinks between meals. Avoid excess salt.',
            sleep: 'Keep bedroom cool. Practice moon meditation.',
            default: 'Remember to cool and calm yourself - Pitta tends toward intensity.'
        },
        kapha: {
            diet: 'Favor light, warm, stimulating foods. Reduce heavy and oily.',
            yoga: 'Practice vigorous, heating yoga with backbends.',
            herbs: 'Use stimulating spices like turmeric and black pepper.',
            digestion: 'Exercise before eating. Chew thoroughly.',
            sleep: 'Avoid excess sleep. Morning exercise is essential.',
            default: 'Remember to stay active and stimulated - Kapha tends toward heaviness.'
        }
    };
    
    const categoryHints = hints[prakriti] || {};
    return categoryHints[qaCategory] || categoryHints.default;
}

// Enhanced answer generation with personalization
function answer(message, userContext = {}) {
    const data = loadQA();
    const toks = tokenize(message);

    if (toks.length === 0) {
        return { 
            response: 'Please type a question about Ayurveda — diet, dosha, herbs, yoga, daily routine, or health conditions.', 
            matched: false,
            followup: ['What is my Prakriti?', 'How to balance my dosha?', 'Best foods for my type?']
        };
    }
    
    if (!isAyurvedic(toks)) {
        return { 
            response: "I'm here to answer Ayurveda questions. Ask me about doshas, diet, yoga, herbs, daily routines, or health from an Ayurvedic perspective.",
            matched: false,
            suggestions: [
                'Ask about your dosha (Vata, Pitta, Kapha)',
                'Ask about Ayurvedic herbs and spices',
                'Ask about yoga or pranayama',
                'Ask about seasonal routines'
            ]
        };
    }

    const bis = bigrams(toks);
    const ranked = data.map(qa => ({ qa, s: score(qa, toks, bis, userContext) }))
        .sort((a, b) => b.s - a.s);
    const best = ranked[0];

    // Lower confidence threshold for better response coverage
    if (!best || best.s < 1.5) {
        return {
            response: "I don't have a confident answer for that yet. Try asking about: specific symptoms, herbs, yoga poses, dosha characteristics, or daily practices.",
            matched: false,
            suggestions: [
                'Ask about symptoms or health concerns',
                'Ask about a specific herb or spice',
                'Ask about Dinacharya (daily routine)',
                'Ask about yoga for a specific condition'
            ]
        };
    }

    // Build personalized response
    let finalResponse = best.qa.answer;
    
    // Add dosha-specific personalization if user context available
    if (userContext.prakriti && best.qa.category) {
        const doshaHint = getDoshaHints(userContext.prakriti, best.qa.category);
        if (doshaHint && doshaHint !== getDoshaHints(userContext.prakriti, 'default')) {
            finalResponse += `\n\n💜 For your ${userContext.prakriti} constitution: ${doshaHint}`;
        }
    }
    
    // Add seasonal note if available
    if (userContext.season) {
        const seasonalNotes = {
            winter: 'Winter is cold & dry - favor warming, oily foods and internal heat practices.',
            summer: 'Summer is hot - use cooling practices, coconut water, and mint.',
            monsoon: 'Monsoon is damp - eat warming, light foods and maintain strong digestion.',
            spring: 'Spring is wet & cool - emphasize stimulating, light foods and activity.'
        };
        if (seasonalNotes[userContext.season]) {
            finalResponse += `\n\n🌤️ Seasonal note: ${seasonalNotes[userContext.season]}`;
        }
    }
    
    return {
        response: finalResponse,
        matched: true,
        confidence: Math.min(100, Math.round((best.s / 5) * 100)),
        source_question: best.qa.question,
        category: best.qa.category || 'general',
        followup: generateFollowups(best.qa),
        related: ranked.slice(1, 4).filter(r => r.qa).map(r => r.qa.question),
    };
}

// Generate contextual follow-up questions
function generateFollowups(qa) {
    const followups = [];
    const category = qa.category || '';
    
    if (category.includes('diet')) {
        followups.push('What foods should I avoid?', 'How is your digestion?', 'Any food allergies?');
    } else if (category.includes('yoga')) {
        followups.push('Do you have any pain?', 'Beginner or advanced?', 'Looking for energy or calm?');
    } else if (category.includes('herbs')) {
        followups.push('How to use this herb?', 'Any side effects?', 'Where to source it?');
    } else if (category.includes('dosha')) {
        followups.push('How to balance my dosha?', 'Best diet for me?', 'Recommended yoga?');
    } else {
        followups.push('Tell me more', 'How to apply this?', 'Any precautions?');
    }
    
    return followups.slice(0, 2);
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

module.exports = { answer, isAyurvedic, generateFollowups };

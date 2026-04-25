/**
 * AyurTwin User Manual generator.
 * Produces a professional, multi-page PDF for patients + family members.
 *
 *   node scripts/buildUserManual.js
 *
 * Output: docs/AyurTwin_User_Manual.pdf
 */

const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const OUT_DIR  = path.join(__dirname, '..', '..', 'docs');
const OUT_PATH = path.join(OUT_DIR, 'AyurTwin_User_Manual.pdf');
fs.mkdirSync(OUT_DIR, { recursive: true });

// Theme
const PRIMARY = '#D97706';
const ACCENT  = '#16A34A';
const DARK    = '#1F2937';
const GRAY    = '#4B5563';
const LIGHT   = '#9CA3AF';
const SOFT    = '#FFF7ED';

const doc = new PDFDocument({ size: 'A4', margin: 56, bufferPages: true,
    info: {
        Title:    'AyurTwin User Manual',
        Author:   'Shashwat Developers Group (SDG 2.0)',
        Subject:  'AyurTwin: AI and IoT-Based Digital Twin for Dosha-Based Preventive Health Monitoring',
        Keywords: 'ayurveda, dosha, IoT, ESP32, prakriti, prevention, ML, supabase',
    },
});
doc.pipe(fs.createWriteStream(OUT_PATH));

// ── COVER ──────────────────────────────────────────────────────────────────
function cover() {
    // background panel
    doc.rect(0, 0, doc.page.width, doc.page.height).fill(SOFT);
    doc.rect(0, 280, doc.page.width, 4).fill(PRIMARY);

    doc.fillColor(PRIMARY).fontSize(46).font('Helvetica-Bold')
       .text('AyurTwin', 0, 200, { align: 'center' });

    doc.fillColor(DARK).fontSize(16).font('Helvetica-Bold')
       .text('User Manual', 0, 260, { align: 'center' });

    doc.moveDown(2);
    doc.fillColor(GRAY).fontSize(13).font('Helvetica')
       .text('AI and IoT-Based Digital Twin for Dosha-Based\nPreventive Health Monitoring',
             0, 320, { align: 'center', lineGap: 4 });

    // taglines
    doc.fontSize(11).fillColor(DARK).font('Helvetica-Oblique')
       .text('"Knowing your prakriti is the first step to lasting health."',
             0, 420, { align: 'center' });

    // footer block
    doc.fillColor(LIGHT).fontSize(10).font('Helvetica')
       .text('Version 4.0  ·  ' + new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
             0, 720, { align: 'center' });
    doc.fillColor(GRAY).fontSize(11).font('Helvetica-Bold')
       .text('Developed by Shashwat Developers Group  (SDG 2.0)',
             0, 740, { align: 'center' });
    doc.fillColor(LIGHT).fontSize(9).font('Helvetica-Oblique')
       .text('For patients · family members · ESP32 device users',
             0, 760, { align: 'center' });
}
cover();

// ── TABLE OF CONTENTS ──────────────────────────────────────────────────────
doc.addPage();
sectionHeader('Table of Contents');
const TOC = [
    ['1.  About AyurTwin',                       3],
    ['2.  Who this manual is for',               3],
    ['3.  Key features at a glance',             4],
    ['4.  Getting started',                      5],
    ['5.  For Patients — using the app',         7],
    ['     5.1  Registration',                   7],
    ['     5.2  The Prakriti Quiz',              8],
    ['     5.3  Dashboard',                      9],
    ['     5.4  Health Score (1-500)',           10],
    ['     5.5  Disease Risk Prediction',        11],
    ['     5.6  Diet & Calorie Recommendations', 12],
    ['     5.7  Yoga & Meditation',              13],
    ['     5.8  Ritucharya (seasonal foods)',    14],
    ['     5.9  Viruddha Ahar checker',          14],
    ['     5.10 Disease Prevention',             15],
    ['     5.11 Dinacharya checklist',           15],
    ['     5.12 Alerts & Smart Insights',        16],
    ['     5.13 AyurBot chatbot',                16],
    ['     5.14 Reports (PDF download)',         17],
    ['     5.15 Community & Leaderboard',        17],
    ['6.  For Family Members',                   18],
    ['7.  Connecting an ESP32 sensor device',    19],
    ['8.  Frequently Asked Questions',           20],
    ['9.  Troubleshooting',                      22],
    ['10. Privacy & data safety',                23],
    ['11. Glossary of Ayurvedic terms',          24],
    ['12. Support',                              25],
];
TOC.forEach(([title, page]) => {
    const y = doc.y;
    doc.fillColor(DARK).font('Helvetica').fontSize(11).text(title, 56, y, { width: 380 });
    doc.fillColor(LIGHT).text('. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .', 440, y, { width: 60 });
    doc.fillColor(GRAY).font('Helvetica-Bold').text(String(page), 510, y, { width: 30, align: 'right' });
    doc.moveDown(0.4);
});

// ── 1. ABOUT ───────────────────────────────────────────────────────────────
doc.addPage();
sectionHeader('1. About AyurTwin');
para(
    'AyurTwin is a personalized health platform that combines two powerful ideas — ' +
    'classical Ayurveda and modern data science. It builds a private "digital twin" ' +
    'of your body using a few simple inputs (your registration profile and a one-time ' +
    'Prakriti quiz) and, optionally, real-time vitals from a small ESP32 sensor device.'
);
para(
    'Behind the scenes, AyurTwin runs eight specialised engines: a Machine Learning ' +
    'disease-risk predictor (logistic regression trained on a 10,000-row synthetic dataset), ' +
    'a diet recommender, a yoga recommender, a seasonal Ritucharya engine, a Viruddha-Ahar ' +
    '(food incompatibility) checker, a disease prevention engine, a domain-restricted ' +
    'Ayurveda chatbot, and a 1-500 health-score calculator.'
);
para(
    'Together they give you continuously-updated, personalised guidance: what to eat today, ' +
    'what to avoid, which yoga practice will help most this evening, what your dosha balance ' +
    'looks like, and what your top three disease risks are — explained in plain language.'
);

sectionHeader('2. Who this manual is for');
bullet('Patients who want to monitor their own daily wellness.');
bullet('Family members who want to support and watch over a loved one\'s health.');
bullet('Hardware tinkerers who plan to flash an ESP32 and stream live vitals into Supabase.');
para(
    'You do NOT need any medical training. The app explains every Ayurvedic term it uses, ' +
    'and every recommendation comes with a one-line "why".'
);

// ── 3. KEY FEATURES ────────────────────────────────────────────────────────
doc.addPage();
sectionHeader('3. Key features at a glance');
const FEATURES = [
    ['🩺',  'Live vitals',           'Heart rate, SpO₂ and skin temperature stream from your ESP32 (or simulator) every 5 seconds.'],
    ['🧠',  'ML disease prediction', 'Personalised risk percentages for diabetes, heart, hypertension, stress, sleep, asthma, arthritis, obesity, digestive and fever — with a per-disease breakdown of the top contributing factors.'],
    ['🌿',  'Ayurvedic engines',     'Diet, yoga, ritucharya, viruddha ahar, and prevention recommendations — all driven by your prakriti, current dosha balance and live data.'],
    ['🔺',  'Dosha balance',         'Live Vata / Pitta / Kapha percentages computed from your inputs and sensor activity.'],
    ['💯',  'Health score (1-500)',  'Single, easy-to-read number recomputed every refresh. Tap it to see how it was calculated.'],
    ['📋',  'Dinacharya',            'Daily Ayurvedic routine checklist. Higher adherence = higher health score.'],
    ['🤖',  'AyurBot',               'Domain-restricted chatbot trained on 290+ Q&A pairs (English + Hindi/Hinglish).'],
    ['👨‍👩‍👧',  'Family monitoring', 'Approved family members can view a patient\'s dashboard after entering the patient\'s password.'],
    ['📄',  'PDF report',            'Downloadable, doctor-friendly health report with vitals, doshas, risks, recommendations and a doctor\'s notes section.'],
    ['🏆',  'Community',             'Share journeys, see a leaderboard, stay motivated.'],
];
FEATURES.forEach(([icon, title, desc]) => {
    const y = doc.y;
    doc.fillColor(PRIMARY).font('Helvetica-Bold').fontSize(13).text(icon, 56, y, { width: 24 });
    doc.fillColor(DARK).font('Helvetica-Bold').fontSize(11).text(title, 84, y, { width: 140 });
    doc.fillColor(GRAY).font('Helvetica').fontSize(10).text(desc, 232, y, { width: 308, lineGap: 1 });
    doc.moveDown(0.4);
    if (doc.y > 760) doc.addPage();
});

// ── 4. GETTING STARTED ─────────────────────────────────────────────────────
doc.addPage();
sectionHeader('4. Getting started');
para('Before you log in for the first time, make sure of the following:');
bullet('Your phone has the Expo Go app installed (or you have the AyurTwin APK).');
bullet('Your phone is on the same Wi-Fi as the laptop running the AyurTwin server.');
bullet('You know your phone\'s and laptop\'s IP addresses (the laptop\'s LAN IP is what the app needs).');
para('Setup checklist for the demo / first-time admin:');
numbered([
    'In Supabase, run "supabase_schema.sql" once. This creates all tables.',
    'Run "supabase_dummy_user.sql" if you want the pre-built Sham Jadhav demo account.',
    'In the backend folder, run npm install, then npm run seed to push reference data.',
    'Run npm run train to train the ML disease model.',
    'Run npm run dev to start the API.',
    'In the project root, run npx expo start --clear and scan the QR with Expo Go.',
    'Open the app → Register or Sign In.',
]);

infoBox(
    'Demo login',
    'Username: sham\nPassword: Sham@1234\nRole: Patient · Prakriti: Pitta-Kapha\n' +
    'Sham already has a complete profile and 10 minutes of sensor data so all engines work immediately.'
);

// ── 5. FOR PATIENTS ────────────────────────────────────────────────────────
doc.addPage();
sectionHeader('5. For Patients — using the app');

subHeader('5.1  Registration');
para(
    'When you first open the app, tap Sign Up. The flow has eight steps for patients:'
);
numbered([
    'Personal information — name, age, gender, height and weight.',
    'Lifestyle — physical activity, smoking, alcohol, water intake, junk-food frequency.',
    'Sleep & mental — sleep hours, sleep/wake time, stress (1-10), anxiety (1-10).',
    'Family medical history — diabetes, heart disease, hypertension, asthma, arthritis.',
    'Symptoms — frequent thirst, urination, joint pain, breathing issues, digestive issues.',
    'Ayurvedic inputs — digestion strength, appetite, sweating, body-temp tendency, stress response.',
    'Prakriti Quiz — 22 questions (see Section 5.2).',
    'Credentials — username, password, and (most important) your email.',
]);
warningBox(
    'Important — your email',
    'Use a real email address. If a family member tries to invite you (or vice-versa), the email is the only way to ' +
    'find your account in the database. There is no schema-level alternative.'
);

subHeader('5.2  The Prakriti Quiz');
para(
    'The 22-question Prakriti quiz determines your Ayurvedic constitution: Vata, Pitta, ' +
    'Kapha, or a combination. Every question shows a yellow tooltip (💡) that explains ' +
    'what the question is really asking — pick the option that matches you most days, not ' +
    'just today. There are no right or wrong answers.'
);
para(
    'After Question 22 the app calculates three scores (Vata, Pitta, Kapha) and stores them ' +
    'in your profile. You can re-take the quiz anytime from the Dosha Detail screen — your ' +
    'previous attempts are kept as history.'
);

doc.addPage();
subHeader('5.3  Dashboard');
para(
    'Your dashboard is the home screen. From top to bottom you will find:'
);
bullet('Header — greeting, your name, your prakriti badge, profile and logout buttons.');
bullet('Health Score card — your 1-500 score and a Tap-to-see-how-this-was-calculated hint.');
bullet('Live Sensor Data — Heart Rate, Body Temperature, SpO₂ and Body Motion. Updates every 5 seconds.');
bullet('Recent Alerts — only shown when a real condition triggers (high temp, stress > 8, sleep < 5 etc).');
bullet('Feature tiles — quick links to Metrics, Dosha Detail, Lifestyle, Smart Monitoring, Health Journey, Smart Insights, Family Dashboard, Leaderboard and Community.');
bullet('Top 3 disease risks — tap any row to see exactly which inputs pushed it up or down.');
bullet('Smart Insights one-liner — context-aware tip based on your current state.');
bullet('Dosha balance bars — your current Vata/Pitta/Kapha distribution.');
bullet('Footer — disclaimer and "Developed by SDG 2.0".');

subHeader('5.4  Health Score (1-500)');
para(
    'A single number summarising overall wellness. The score is recomputed every time the ' +
    'dashboard refreshes (about every 60 seconds, or when you pull-to-refresh).'
);
para('Components:');
bullet('Base score: 250 points — every user starts here.');
bullet('Vitals: −40 to +90 — based on heart rate, SpO₂ and body temperature.');
bullet('BMI: −25 to +60 — closer to 18.5–24.9 = higher score.');
bullet('Lifestyle: −50 to +120 — sleep, stress, anxiety, exercise, water, junk food, smoking, alcohol, symptoms.');
bullet('Disease penalty: −160 to 0 — predicted risks above 60% subtract points.');
bullet('Dinacharya bonus: 0 to +50 — % of today\'s routine ticked off.');
bullet('Prakriti alignment: −10 to +30 — bonus when overall risks match prakriti balance.');
para('Tap the health score card to see a breakdown of every component for your specific case.');

doc.addPage();
subHeader('5.5  Disease Risk Prediction');
para(
    'AyurTwin runs an ML model (logistic regression trained on 10,000 synthetic patients) ' +
    'over your inputs and sensor readings to estimate risk percentages for ten conditions: ' +
    'Diabetes, Hypertension, Heart Disease, Stress Disorder, Sleep Disorder, Asthma, ' +
    'Arthritis, Obesity, Digestive Disorder and Fever.'
);
para(
    'On the dashboard you see the top 3 risks. Tap any row to open the per-disease breakdown ' +
    'screen, which shows the top six features (e.g. BMI, family history, stress level, sleep ' +
    'hours) and how much each contributed — bars on the right push risk up, bars on the left ' +
    'pull it down. This is honest, transparent ML — nothing is hidden behind a black box.'
);
infoBox(
    'Risk levels',
    '0–30 %  Low\n31–60 %  Moderate\n61–80 %  High\n81–100 %  Critical — please consult a clinician.'
);

subHeader('5.6  Diet & Calorie Recommendations');
para(
    'AyurTwin classifies hundreds of foods into four buckets for you:'
);
bullet('✅ Best — eat freely.');
bullet('👍 Good — daily-appropriate.');
bullet('⚖️  Moderate — sometimes only.');
bullet('❌ Avoid — limit or skip.');
para(
    'The classification is dynamic. It changes if your stress goes up, if your sleep gets ' +
    'shorter, if your BMI shifts, or if the season changes. Your prakriti is the foundation; ' +
    'your current state fine-tunes it.'
);
para(
    'The Calorie Calculator returns your BMR (Mifflin-St Jeor formula), TDEE (with activity ' +
    'multiplier), and a balanced split across breakfast, lunch, snacks and dinner — already ' +
    'adjusted for weight loss if your BMI > 28 or weight gain if BMI < 18.5.'
);

doc.addPage();
subHeader('5.7  Yoga & Meditation');
para(
    'Three tabs: 🌅 Morning, 🌙 Evening, 💊 Therapeutic. Each shows 2-6 practices with name, ' +
    'type (asana / pranayama / meditation), intensity badge, duration, expected benefits, and ' +
    'a match score.'
);
para('The recommendation considers:');
bullet('Your prakriti and current dominant dosha.');
bullet('Stress and anxiety levels — high stress favours pranayama and meditation.');
bullet('Sleep hours — short sleep favours Yoga Nidra in the evening.');
bullet('Activity score — low activity adds Surya Namaskar; high activity adds restorative yoga.');
bullet('Top disease risks — e.g. high arthritis risk surfaces joint-mobility flow.');

subHeader('5.8  Ritucharya (seasonal foods)');
para(
    'Ritucharya means "seasonal regimen". The app auto-detects the current season (Summer, ' +
    'Monsoon, Autumn, Winter, Spring) and recommends foods that suit both the season AND ' +
    'your prakriti. Each food is tagged with properties (cooling, warming, light, heavy, etc.) ' +
    'and falls into Best / Good / Moderate / Avoid for the current season.'
);

subHeader('5.9  Viruddha Ahar checker');
para(
    'Some food combinations are considered incompatible (viruddha) in classical Ayurveda. The ' +
    'checker lets you enter or pick foods you are about to eat together; if any pair is ' +
    'incompatible, the app shows severity (Low / Medium / High), the reason, the typical ' +
    'effects, and safer alternatives. The dataset includes 75+ classical pairs (e.g. milk + fish, ' +
    'honey + ghee in equal parts, fruit + dairy, heated honey).'
);

doc.addPage();
subHeader('5.10  Disease Prevention');
para(
    'For every disease where your risk crosses 30%, AyurTwin compiles a personalized ' +
    'prevention plan with three sections: Prevention tips (concrete actions), Lifestyle ' +
    'changes (sleep, water, exercise targets), and Ayurvedic suggestions (herbs, kriyas, ' +
    'panchakarma references). Critical alerts are highlighted at the top.'
);

subHeader('5.11  Dinacharya checklist');
para(
    'Dinacharya is the Ayurvedic daily routine. Tick the items you complete today: wake before ' +
    '6 AM, warm water, tongue scraping, oil pulling, abhyanga (oil massage), yoga, meditation, ' +
    'noon main meal, light dinner, sleep by 10 PM. Each tick is saved instantly to the database.'
);
para(
    'Your completion percentage feeds directly into the health score (up to +50 points). ' +
    'Skipping the routine for several days = a lower score, exactly as it should.'
);

subHeader('5.12  Alerts & Smart Insights');
para(
    'Alerts are not constantly shown — they only fire when a real condition is detected: ' +
    'body temperature ≥ 37.5°C, SpO₂ < 95%, heart rate above 110 or below 50, stress ≥ 8, ' +
    'sleep deficit, dinacharya adherence below 30%, or any disease risk above 60%. ' +
    'Smart Insights summarises the most actionable next step in one sentence.'
);

subHeader('5.13  AyurBot chatbot');
para(
    'A floating 🤖 button on every screen opens AyurBot. It is restricted to Ayurveda topics — ' +
    'doshas, diet, herbs, lifestyle, dinacharya, ritucharya, panchakarma, common symptoms — ' +
    'and politely refuses anything off-topic. The knowledge base contains 290+ Q&A pairs in ' +
    'English, Hindi and Hinglish. There are no predefined questions; type freely.'
);

doc.addPage();
subHeader('5.14  Reports (PDF download)');
para(
    'More tab → Reports → ⬇︎ Download PDF. The downloaded file is a multi-page, ' +
    'doctor-friendly report with: cover, patient profile + calorie split, vitals, dosha bars, ' +
    'health-score breakdown, disease-risk bars, full diet recommendations (best/good/avoid), ' +
    'ritucharya, yoga plan, prevention plan, ayurvedic suggestions, today\'s dinacharya, and ' +
    'a Doctor\'s Consultation Notes section with ruled lines for the physician to fill.'
);

subHeader('5.15  Community & Leaderboard');
para(
    'The Community feed is a LinkedIn-style space for sharing health journeys. The Leaderboard ' +
    'shows the top-10 health scores plus your own ranking — a small motivational nudge.'
);

// ── 6. FAMILY MEMBERS ──────────────────────────────────────────────────────
doc.addPage();
sectionHeader('6. For Family Members');
para('Family members get a separate, simpler dashboard — they don\'t see live vitals by default.');

para('Step-by-step:');
numbered([
    'In the app, tap Sign Up and choose role = Family Member.',
    'Enter your name, age, relationship, and most importantly your real email address.',
    'Submit the form. You are now in the database with role = "family".',
    'Tell the patient to invite that email from their Family Dashboard.',
    'You will receive an email (delivered via Resend SMTP) with the invitation.',
    'Open the app, log in, go to Family Dashboard. You will see a Pending Invite card.',
    'Tap Approve. The patient now appears under "Patients You Monitor".',
    'To open the patient\'s dashboard, tap See Dashboard. You must enter the patient\'s username and password.',
    'Once verified, you are switched into a read-only patient view that auto-refreshes.',
]);

warningBox(
    'Why we ask for the patient\'s password',
    'AyurTwin treats health data as sensitive. Even an approved family link does not auto-share full data. ' +
    'You must enter the patient\'s password to confirm consent every session — exactly as a hospital ' +
    'consent flow works.'
);

para(
    'A family member can be linked to multiple patients. Just repeat the invite-and-approve ' +
    'flow for each relationship. The Family Dashboard shows them all in a single list.'
);

// ── 7. ESP32 ───────────────────────────────────────────────────────────────
doc.addPage();
sectionHeader('7. Connecting an ESP32 sensor device');
para(
    'AyurTwin works fine without hardware — a built-in simulator generates realistic vitals ' +
    'every 5 seconds. But if you have an ESP32 with MAX30102 (heart rate + SpO₂), MPU6050 ' +
    '(accel + gyro) and DS18B20 (skin temperature), you can stream real data.'
);

para('The Arduino sketch is at arduino/AyurTwinSensor.ino. Steps:');
numbered([
    'Register the patient in the app — copy their UUID from Supabase: SELECT id FROM users WHERE username = \'<your-username>\';',
    'Open AyurTwinSensor.ino and fill in: WIFI_SSID, WIFI_PASSWORD, SUPABASE_URL (must end with /rest/v1/sensor_data), SUPABASE_KEY (anon key), USER_ID (the UUID).',
    'In backend/.env set SENSOR_SIMULATOR_ENABLED=false so you don\'t get duplicate streams.',
    'Restart the backend (npm run dev).',
    'Connect MAX30102 + MPU6050 to I2C (SDA=21, SCL=22 on most ESP32 boards) and DS18B20 to GPIO 4.',
    'Compile and flash via Arduino IDE.',
    'Open Serial Monitor at 115200 baud — you should see Wi-Fi connect and "[upload] OK HR=… SpO2=… T=…" every 5 seconds.',
    'Open the app dashboard — vitals tiles update in real time.',
]);

infoBox(
    'No new tables needed',
    'Every sensor row carries your UUID. Supabase keeps all users\' data in the same sensor_data table; ' +
    'rows are kept apart by the user_id column and indexed by it. Adding a new patient is just one new row in users.'
);

// ── 8. FAQ ─────────────────────────────────────────────────────────────────
doc.addPage();
sectionHeader('8. Frequently Asked Questions');
const FAQ = [
    ['Is AyurTwin a medical device?',
     'No. It provides preventive health insights based on Ayurvedic principles and ML-derived risk estimates. ' +
     'Always consult a qualified physician before making medical decisions. AyurTwin is a wellness companion, not a diagnosis.'],

    ['How accurate is the disease prediction?',
     'The model is trained on synthetic data with rule-derived labels. It is good for prioritising lifestyle ' +
     'changes (you can clearly see what is pushing risk up) but it is not a substitute for clinical tests. ' +
     'Treat percentages as relative signals, not diagnoses.'],

    ['What if I don\'t want to take the Prakriti quiz?',
     'You can skip it during registration. The app will fall back to defaults, but recommendations ' +
     'will be much less personalised. We strongly recommend completing it (~5 minutes).'],

    ['Can I retake the quiz?',
     'Yes. Open Dosha Detail → Retake Prakriti Quiz. Old scores are kept in history.'],

    ['Why is my health score not 500?',
     'A score of 500 would mean perfect inputs across every category. Most healthy adults sit between ' +
     '350-440. The score is designed so that any of: high stress, low sleep, high BMI, smoking, or a ' +
     'high-risk disease will measurably reduce it. Same inputs always produce the same score.'],

    ['Why does the chatbot refuse some questions?',
     'AyurBot is restricted to Ayurveda. Anything outside that domain ("write me a poem", "what is JavaScript") ' +
     'is politely declined to keep answers reliable.'],

    ['Why do alerts come and go?',
     'Alerts only fire when a real condition triggers (e.g. SpO₂ drops below 95%, fever, dinacharya ' +
     'adherence < 30%). They disappear automatically when the underlying condition resolves. ' +
     'This is intentional — there are no decorative alerts.'],

    ['Where is my data stored?',
     'In your private Supabase project, on Postgres tables. The backend uses an anonymous key for development; ' +
     'in production, enable Row Level Security so each user can only see their own rows.'],

    ['Does the app work without the internet?',
     'No. The app needs to reach the backend to compute scores and fetch recommendations.'],

    ['Can two patients share one ESP32?',
     'For a clean demo, dedicate one ESP32 per patient. Sharing is possible by changing USER_ID in the sketch ' +
     'before each session, but you\'d need to re-flash each time.'],
];

FAQ.forEach(([q, a]) => {
    if (doc.y > 720) doc.addPage();
    doc.fillColor(PRIMARY).font('Helvetica-Bold').fontSize(11).text(`Q: ${q}`);
    doc.fillColor(GRAY).font('Helvetica').fontSize(10).text(a, { lineGap: 1 });
    doc.moveDown(0.5);
});

// ── 9. TROUBLESHOOTING ─────────────────────────────────────────────────────
doc.addPage();
sectionHeader('9. Troubleshooting');
const TROUBLES = [
    ['"Network request failed" on login or register',
     'EXPO_PUBLIC_API_URL in AyurTwin/.env is wrong. Use your laptop\'s real Wi-Fi IP (run ipconfig and look ' +
     'under Wireless LAN adapter Wi-Fi). 192.168.56.x is VirtualBox — your phone cannot reach it. After ' +
     'editing, restart Expo with npx expo start --clear.'],

    ['Dashboard shows blank / never loads',
     'The backend is not running, or the sensor table is empty. (1) Check the backend terminal — you must see ' +
     '"AyurTwin v4.0 listening on :4000". (2) Make sure supabase_dummy_user.sql or your own registration ' +
     'inserted at least one row in sensor_data.'],

    ['Yoga / Ritucharya stuck on "Building your session…"',
     'The backend isn\'t reachable, or you\'re still on an older app build. Pull-to-refresh, then ' +
     'force-close and reopen Expo Go. If still stuck, restart Expo with --clear.'],

    ['ESP32 prints "[upload] HTTP 401"',
     'Your SUPABASE_KEY is wrong or the URL doesn\'t include /rest/v1/sensor_data at the end.'],

    ['ESP32 prints "WiFi failed"',
     'Wi-Fi credentials are wrong, or the Wi-Fi is 5 GHz only — the ESP32 only supports 2.4 GHz networks.'],

    ['Family invite email never arrives',
     'On the free Resend tier with onboarding@resend.dev, emails only deliver to the address you signed up ' +
     'with at resend.com. Verify a domain in Resend to deliver to anyone.'],

    ['Health score never changes',
     'Pull-to-refresh on the dashboard. The score is recomputed on every dashboard call — but only if your ' +
     'profile or sensor inputs actually changed.'],
];
TROUBLES.forEach(([sym, fix]) => {
    if (doc.y > 720) doc.addPage();
    doc.fillColor(DARK).font('Helvetica-Bold').fontSize(11).text(`• ${sym}`);
    doc.fillColor(GRAY).font('Helvetica').fontSize(10).text(fix, { lineGap: 1 });
    doc.moveDown(0.5);
});

// ── 10. PRIVACY ────────────────────────────────────────────────────────────
doc.addPage();
sectionHeader('10. Privacy & data safety');
bullet('Your registration data and vitals are stored in your private Supabase project. AyurTwin does not run a shared cloud — every deployment is self-hosted.');
bullet('Passwords are bcrypt-hashed (10 rounds) before they leave the server.');
bullet('Authentication uses JWT tokens (7-day expiry); they live in your phone\'s secure storage.');
bullet('Family members can only see a patient\'s data after the patient has approved the invite AND the family member enters the patient\'s password.');
bullet('Old sensor data can be auto-pruned after 30 days with a Supabase scheduled function — recommended for production.');
bullet('AyurTwin never shares data with third parties. The optional Resend SMTP integration is used only to send family-invite emails.');

// ── 11. GLOSSARY ───────────────────────────────────────────────────────────
sectionHeader('11. Glossary of Ayurvedic terms');
const GLOSSARY = [
    ['Abhyanga',     'Self-massage with warm herbal oil — daily practice for skin and nervous-system health.'],
    ['Agni',         'Digestive fire. Strong agni = good metabolism, immunity, clarity.'],
    ['Ahara',        'Diet — the food you eat.'],
    ['Ama',          'Toxin formed from undigested food. Source of most disease in Ayurveda.'],
    ['Asana',        'Yoga posture.'],
    ['Ayurveda',     'Ancient Indian science of life and longevity (~5,000 years old).'],
    ['Dinacharya',   'Daily routine aligned with the body\'s natural rhythm.'],
    ['Dosha',        'Three biological energies — Vata, Pitta, Kapha — that govern body functions.'],
    ['Kapha',        'Earth + water dosha; structure, lubrication, immunity.'],
    ['Ojas',         'Refined essence of perfect digestion; substance of immunity and vitality.'],
    ['Panchakarma',  'Five-fold detoxification therapy under expert supervision.'],
    ['Pitta',        'Fire + water dosha; digestion, metabolism, transformation.'],
    ['Prakriti',     'Your inborn constitution — the unique ratio of doshas you are born with.'],
    ['Pranayama',    'Yogic breath-control practice.'],
    ['Rasa',         'Taste. Six rasas: sweet, sour, salty, pungent, bitter, astringent.'],
    ['Rasayana',     'Rejuvenative therapy / formulation (e.g. Chyawanprash, Ashwagandha).'],
    ['Ritucharya',   'Seasonal regimen — adjusting diet and lifestyle to the six Ayurvedic seasons.'],
    ['Sattvic',      'Pure, calm, light foods that promote mental clarity.'],
    ['Vata',         'Air + space dosha; movement, circulation, nervous system.'],
    ['Vikriti',      'Current state of doshic imbalance (vs. prakriti, the inborn balance).'],
    ['Viruddha Ahar','Incompatible food combinations (e.g. milk + fish).'],
];
GLOSSARY.forEach(([term, def]) => {
    if (doc.y > 760) doc.addPage();
    doc.fillColor(PRIMARY).font('Helvetica-Bold').fontSize(10).text(term, 56, doc.y, { width: 110, continued: false });
    const yLine = doc.y - 12;
    doc.fillColor(GRAY).font('Helvetica').fontSize(10).text(def, 170, yLine, { width: 380, lineGap: 1 });
    doc.moveDown(0.4);
});

// ── 12. SUPPORT ────────────────────────────────────────────────────────────
doc.addPage();
sectionHeader('12. Support');
para('If you run into something this manual doesn\'t cover:');
bullet('Read backend logs — they print every API call and the engine\'s decisions.');
bullet('Open the Supabase SQL editor and inspect the affected table.');
bullet('Re-run npm run seed if reference data looks empty.');
bullet('Re-run npm run train if disease risks all show 0.');
bullet('Restart Expo with npx expo start --clear after .env changes.');

para(' ');
para(' ');
para(' ');

doc.fillColor(LIGHT).font('Helvetica-Oblique').fontSize(11)
   .text('AyurTwin is a wellness companion. It does not replace professional medical advice, diagnosis, or treatment. Always consult a qualified physician for any clinical concern.', { align: 'center', lineGap: 2 });

doc.moveDown(2);
doc.fillColor(DARK).fontSize(11).font('Helvetica-Bold')
   .text('Developed by', { align: 'center' });
doc.fillColor(PRIMARY).fontSize(15).font('Helvetica-Bold')
   .text('Shashwat Developers Group  (SDG 2.0)', { align: 'center' });
doc.fillColor(LIGHT).fontSize(10).font('Helvetica-Oblique')
   .text('Version 4.0', { align: 'center' });

// ── PAGE NUMBERS ───────────────────────────────────────────────────────────
const range = doc.bufferedPageRange();
for (let i = range.start + 1; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    doc.fontSize(8).fillColor(LIGHT).font('Helvetica')
       .text(`AyurTwin User Manual  ·  Page ${i + 1} / ${range.count}`,
             56, 800, { width: doc.page.width - 112, align: 'center' });
}

doc.end();
console.log(`Wrote ${OUT_PATH}`);

// ── HELPERS ────────────────────────────────────────────────────────────────
function sectionHeader(title) {
    doc.moveDown(0.5);
    doc.fillColor(PRIMARY).fontSize(20).font('Helvetica-Bold').text(title);
    const y = doc.y + 2;
    doc.moveTo(56, y).lineTo(doc.page.width - 56, y).strokeColor(PRIMARY).lineWidth(1.5).stroke();
    doc.moveDown(0.6);
}
function subHeader(title) {
    if (doc.y > 720) doc.addPage();
    doc.moveDown(0.5);
    doc.fillColor(DARK).fontSize(13).font('Helvetica-Bold').text(title);
    doc.moveDown(0.2);
}
function para(txt) {
    if (doc.y > 760) doc.addPage();
    doc.fillColor(GRAY).fontSize(10.5).font('Helvetica').text(txt, { lineGap: 2, align: 'justify' });
    doc.moveDown(0.5);
}
function bullet(txt) {
    if (doc.y > 770) doc.addPage();
    doc.fillColor(GRAY).fontSize(10.5).font('Helvetica').text(`•  ${txt}`, { lineGap: 1, indent: 8 });
    doc.moveDown(0.2);
}
function numbered(items) {
    items.forEach((it, i) => {
        if (doc.y > 770) doc.addPage();
        doc.fillColor(GRAY).fontSize(10.5).font('Helvetica').text(`${i + 1}.  ${it}`, { lineGap: 1, indent: 8 });
        doc.moveDown(0.2);
    });
    doc.moveDown(0.3);
}
function infoBox(title, body) {
    if (doc.y > 700) doc.addPage();
    const startY = doc.y;
    doc.rect(56, startY, doc.page.width - 112, 0).strokeColor(PRIMARY).stroke();
    doc.fillColor(SOFT).rect(56, startY, doc.page.width - 112, 70).fill();
    doc.fillColor(PRIMARY).fontSize(11).font('Helvetica-Bold').text(`ℹ  ${title}`, 70, startY + 8);
    doc.fillColor(DARK).fontSize(10).font('Helvetica').text(body, 70, doc.y + 2, { width: doc.page.width - 142, lineGap: 1 });
    doc.moveDown(2);
}
function warningBox(title, body) {
    if (doc.y > 700) doc.addPage();
    const startY = doc.y;
    doc.fillColor('#FEF3C7').rect(56, startY, doc.page.width - 112, 80).fill();
    doc.fillColor('#B45309').fontSize(11).font('Helvetica-Bold').text(`⚠  ${title}`, 70, startY + 8);
    doc.fillColor('#78350F').fontSize(10).font('Helvetica').text(body, 70, doc.y + 2, { width: doc.page.width - 142, lineGap: 1 });
    doc.moveDown(2);
}

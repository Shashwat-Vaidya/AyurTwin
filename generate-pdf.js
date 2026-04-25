const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Create a PDF document
const doc = new PDFDocument({
  size: 'A4',
  margin: 40,
  lineGap: 2,
});

// Set up the output file
const outputPath = path.join(__dirname, 'AyurTwin_User_Manual.pdf');
const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// Define styles
const colors = {
  primary: '#D4A574',
  secondary: '#8B6F47',
  accent: '#E8D4C0',
  text: '#2C2C2C',
  lightText: '#666666',
  warning: '#D9534F',
  success: '#5CB85C',
};

// Helper functions
function addHeader() {
  doc.fontSize(10).fillColor(colors.lightText);
  doc.text('AyurTwin - Comprehensive Health Management Platform', 50, 20);
  doc.moveTo(50, 35).lineTo(550, 35).stroke(colors.primary);
}

function addFooter(pageNum) {
  doc.fontSize(9).fillColor(colors.lightText);
  doc.text(`Page ${pageNum}`, 50, 750, { align: 'center' });
  doc.text('© 2026 AyurTwin | Version 1.0 | www.ayurtwin.com', 50, 765, { align: 'center' });
}

function addTitle(text, size = 24) {
  doc.fontSize(size).fillColor(colors.primary).font('Helvetica-Bold');
  doc.text(text, { align: 'left' });
  doc.moveDown(0.5);
}

function addSubtitle(text, size = 16) {
  doc.fontSize(size).fillColor(colors.secondary).font('Helvetica-Bold');
  doc.text(text, { align: 'left' });
  doc.moveDown(0.3);
}

function addHeading(text, size = 14) {
  doc.fontSize(size).fillColor(colors.secondary).font('Helvetica-Bold');
  doc.text(text, { align: 'left' });
  doc.moveDown(0.2);
}

function addBody(text, size = 11) {
  doc.fontSize(size).fillColor(colors.text).font('Helvetica');
  doc.text(text, { align: 'left' });
  doc.moveDown(0.3);
}

function addBullet(text, indent = 20) {
  doc.fontSize(11).fillColor(colors.text).font('Helvetica');
  const x = doc.x + indent;
  doc.text('• ' + text, x, doc.y - 12);
  doc.moveDown(0.3);
}

function newPage(pageNum) {
  doc.addPage();
  addHeader();
}

function resetForNewPage(pageNum) {
  addFooter(pageNum);
  newPage(pageNum + 1);
}

// Page 1: Cover Page
doc.fontSize(28).fillColor(colors.primary).font('Helvetica-Bold');
doc.text('AYURTWIN', { align: 'center' });
doc.moveDown(0.2);
doc.fontSize(16).fillColor(colors.secondary);
doc.text('User Manual & Guide', { align: 'center' });
doc.moveDown(2);

doc.fontSize(12).fillColor(colors.text).font('Helvetica');
doc.text('Comprehensive Ayurvedic Health Management Platform', { align: 'center' });
doc.moveDown(0.3);
doc.text('For Patients and Family Members', { align: 'center' });
doc.moveDown(3);

doc.fontSize(11).fillColor(colors.lightText);
doc.text('Version 1.0', { align: 'center' });
doc.text('April 2026', { align: 'center' });
doc.moveDown(4);

doc.fontSize(10).fillColor(colors.text).font('Helvetica');
doc.text('This manual provides comprehensive guidance for using AyurTwin to manage your health through personalized Ayurvedic recommendations, real-time health monitoring, and family wellness tracking.', { align: 'center', width: 450 });

addFooter(1);

// Page 2: Table of Contents
newPage(2);
addTitle('TABLE OF CONTENTS');
doc.moveDown(0.5);

const tocItems = [
  '1. Introduction....................................................................5',
  '2. Getting Started.................................................................6',
  '3. Account Setup...................................................................7',
  '4. Main Features Overview.......................................................9',
  '5. Dashboard & Home Screen.....................................................10',
  '6. Health Metrics & Monitoring.................................................12',
  '7. Lifestyle Recommendations...................................................14',
  '8. Disease Risk Management.....................................................16',
  '9. Food Recommendations & Diet.................................................18',
  '10. Device & Sensor Setup.......................................................20',
  '11. Family Monitoring...........................................................22',
  '12. Troubleshooting & Support...................................................23',
  '13. Frequently Asked Questions..................................................25',
];

doc.fontSize(11).fillColor(colors.text).font('Helvetica');
tocItems.forEach(item => {
  doc.text(item);
  doc.moveDown(0.3);
});

addFooter(2);

// Page 3-4: Introduction
newPage(3);
addTitle('1. INTRODUCTION', 22);
doc.moveDown(0.3);

addHeading('What is AyurTwin?');
addBody('AyurTwin is an intelligent Ayurvedic health management platform that combines traditional Ayurvedic wisdom with modern IoT technology and artificial intelligence. The system provides personalized health recommendations based on your individual constitution (prakriti) and current health status.');

addHeading('Core Features');
doc.moveDown(0.2);
addBullet('Real-time health monitoring through connected smartwatch devices');
addBullet('Personalized Ayurvedic lifestyle recommendations');
addBullet('AI-powered disease risk prediction');
addBullet('Customized food and ritual recommendations based on season');
addBullet('Yoga and meditation guidance');
addBullet('Family health monitoring capabilities');
addBullet('Community engagement and health tracking');
addBullet('Comprehensive health reports and analytics');

addHeading('System Requirements');
doc.moveDown(0.2);
addBullet('Smartphone (iOS or Android)');
addBullet('Internet connection (WiFi or mobile data)');
addBullet('Optional: AyurTwin Band Pro smartwatch for continuous monitoring');
addBullet('Minimum 2GB RAM for smooth app performance');

addFooter(3);

// Page 4: Getting Started
newPage(4);
addTitle('2. GETTING STARTED', 22);
doc.moveDown(0.3);

addHeading('Installation');
addBullet('Download the AyurTwin app from your device\'s app store');
addBullet('Install the application');
addBullet('Allow necessary permissions (location, health data, camera, microphone)');
addBullet('Launch the app');

addHeading('First Launch');
addBody('On first launch, you will be presented with two options:');
doc.moveDown(0.1);
addBullet('New User: Create a new account', 30);
addBullet('Existing User: Login with your credentials', 30);
doc.moveDown(0.2);
addBody('The app will guide you through the onboarding process, which typically takes 5-10 minutes.');

addHeading('Navigation Structure');
addBody('The app uses a five-tab navigation system:');
doc.moveDown(0.1);
addBullet('Dashboard: Quick overview of your health status', 30);
addBullet('Metrics: Detailed health measurements and trends', 30);
addBullet('Alerts: Important notifications about your health', 30);
addBullet('Lifestyle: Yoga, food, and routine recommendations', 30);
addBullet('More: Profile, settings, reports, and support', 30);

addFooter(4);

// Page 5: Account Setup
newPage(5);
addTitle('3. ACCOUNT SETUP', 22);
doc.moveDown(0.3);

addHeading('Registration Process');

addSubtitle('Step 1: Basic Information', 12);
doc.moveDown(0.1);
addBullet('Enter your email address (used for account recovery)');
addBullet('Create a username (appears in community features)');
addBullet('Set a strong password');

addSubtitle('Step 2: Personal Profile', 12);
doc.moveDown(0.1);
addBullet('Full name');
addBullet('Date of birth (for age-appropriate recommendations)');
addBullet('Gender (for gender-specific health considerations)');
addBullet('Contact number and location');

addSubtitle('Step 3: Health Profile', 12);
doc.moveDown(0.1);
addBullet('Height (in cm) and Weight (in kg)');
addBullet('Blood Type');
addBullet('Existing health conditions and medications');
addBullet('Allergies (important for food recommendations)');

addHeading('Prakriti Assessment (Constitutional Type)');
addBody('Complete the traditional Ayurvedic constitution questionnaire with 20-30 questions about your physical characteristics and temperament. The system determines your prakriti (constitutional type) showing Vata, Pitta, and Kapha percentages. This assessment is the foundation for all personalized recommendations.');

addHeading('Account Security');
addBody('Use strong passwords with letters, numbers, and special characters. Enable Two-Factor Authentication for enhanced security by going to Settings > Security. Change your password every 90 days and never share your credentials.');

addFooter(5);

// Page 6: Dashboard
newPage(6);
addTitle('5. DASHBOARD & HOME SCREEN', 22);
doc.moveDown(0.3);

addHeading('Dashboard Overview');
addBody('The Dashboard provides a comprehensive snapshot of your current health status at a glance.');

addSubtitle('Health Score (0-100)', 12);
doc.moveDown(0.1);
addBody('Color-coded indicator:');
addBullet('Green (70+): Good health', 30);
addBullet('Yellow (50-70): Moderate status', 30);
addBullet('Red (below 50): Needs attention', 30);
doc.moveDown(0.2);
addBody('Based on: BMI, stress level, sleep quality, activity level, and sensor readings. Updates daily based on your activities and health data.');

addSubtitle('Live Sensor Data Tiles', 12);
doc.moveDown(0.1);
addBullet('Heart Rate (BPM): Normal 60-100 at rest', 30);
addBullet('Body Temperature: Normal 36.5-37.5°C', 30);
addBullet('SpO2: Normal 95-100% oxygen saturation', 30);
addBullet('Body Motion: Resting, Walking, or High Activity', 30);

addSubtitle('Disease Risk Section', 12);
doc.moveDown(0.1);
addBody('Shows top 3 disease risks based on your profile:');
addBullet('Green (0-30%): Low risk', 30);
addBullet('Yellow (30-70%): Moderate risk', 30);
addBullet('Red (70%+): High risk', 30);

addFooter(6);

// Page 7: Health Metrics
newPage(7);
addTitle('6. HEALTH METRICS & MONITORING', 22);
doc.moveDown(0.3);

addHeading('Metrics Screen Features');

addSubtitle('Time Period Filters', 12);
doc.moveDown(0.1);
addBullet('Day: Last 24 hours with hourly breakdown', 30);
addBullet('Week: Last 7 days with daily averages', 30);
addBullet('Month: Last 30 days', 30);
addBullet('Year: Last 365 days', 30);

addSubtitle('Six Key Vital Signs', 12);
doc.moveDown(0.1);
addBullet('Heart Rate: 60-80 bpm at rest', 30);
addBullet('SpO2: 95-100% blood oxygen saturation', 30);
addBullet('Temperature: 36.5-37.5°C normal range', 30);
addBullet('Stress Index: 0-100 scale (0=relaxed, 100=stressed)', 30);
addBullet('Sleep Duration: Goal 7-9 hours per night', 30);
addBullet('Activity Level: Goal 30+ minutes daily', 30);

addSubtitle('Disease Risk Analysis', 12);
doc.moveDown(0.1);
addBody('Full breakdown of 10 tracked conditions with risk percentages, trends, contributing factors, and prevention recommendations.');

addSubtitle('Connected Device Management', 12);
doc.moveDown(0.1);
addBody('For AyurTwin Band Pro: Ensure Bluetooth is enabled, device is charged (battery shown in %), and all sensors are active (HR, SpO2, Temperature, Accelerometer, Stress Monitor).');

addFooter(7);

// Page 8: Lifestyle Recommendations
newPage(8);
addTitle('7. LIFESTYLE RECOMMENDATIONS', 22);
doc.moveDown(0.3);

addHeading('Daily Routines (Dinacharya)');

addSubtitle('Morning Routine (5:00-8:00 AM)', 12);
doc.moveDown(0.1);
addBullet('Wake: Vata 6-7am, Pitta 5:30-6:30am, Kapha 5-6am', 30);
addBullet('Tongue scraping to remove toxins', 30);
addBullet('Oil massage (Abhyanga) for circulation', 30);
addBullet('Warm bath and hygiene routine', 30);
addBullet('20-30 minutes yoga/exercise', 30);
addBullet('Breakfast 7:30-9:00 AM (warm, easily digestible)', 30);

addSubtitle('Midday Routine (12:00-1:00 PM)', 12);
doc.moveDown(0.1);
addBody('Main meal of the day when digestive fire is strongest. Warm, freshly cooked with all six tastes. Follow with 10-15 minute light walk.');

addSubtitle('Evening Routine (5:00-10:00 PM)', 12);
doc.moveDown(0.1);
addBullet('Dinner 2-3 hours before sleep', 30);
addBullet('Light activities only', 30);
addBullet('Avoid intense work, arguments, stimulating entertainment', 30);
addBullet('Warm milk with relaxing herbs before bed', 30);
addBullet('Ideal bedtime: 10:00 PM', 30);
addBullet('Aim for 7-9 hours sleep', 30);

addHeading('Seasonal Recommendations (Ritucharya)');
addBody('The app adjusts recommendations based on current season and your location to balance seasonal dosha imbalances.');

addFooter(8);

// Page 9: Disease Risk Management
newPage(9);
addTitle('8. DISEASE RISK MANAGEMENT', 22);
doc.moveDown(0.3);

addHeading('Understanding Risk Scores');

addSubtitle('Risk Interpretation', 12);
doc.moveDown(0.1);
addBullet('Green (0-30%): Low risk - maintain healthy habits', 30);
addBullet('Yellow (30-70%): Moderate risk - preventive actions recommended', 30);
addBullet('Red (70%+): High risk - immediate action needed, consult healthcare provider', 30);

addHeading('10 Major Conditions Tracked');
doc.moveDown(0.2);

const conditions = [
  'Diabetes - Obesity, sedentary lifestyle risk',
  'Hypertension - Excess salt, stress, sedentary living',
  'Heart Disease - High cholesterol, smoking, stress',
  'Stress & Anxiety - Work pressure, poor sleep',
  'Sleep Disorders - Irregular schedule, caffeine, blue light',
  'Respiratory Issues - Air quality, allergies, stress',
  'Joint Pain & Arthritis - Aging, cold climate, sedentary',
  'Obesity - High calories, sedentary lifestyle',
  'Digestive Disorders - Irregular eating, food combinations',
  'Infections/Fever - Low immunity, poor sleep',
];

doc.fontSize(10).fillColor(colors.text).font('Helvetica');
conditions.forEach((c, i) => {
  doc.text((i+1) + '. ' + c);
  doc.moveDown(0.25);
});

doc.moveDown(0.3);
addHeading('Prevention Protocol Steps');
addBullet('Assess your risk factors and warning signs', 30);
addBullet('Follow personalized lifestyle modifications', 30);
addBullet('Monitor relevant health metrics regularly', 30);
addBullet('For high-risk conditions, consult healthcare provider', 30);

addFooter(9);

// Page 10: Food Recommendations
newPage(10);
addTitle('9. FOOD RECOMMENDATIONS & DIET', 22);
doc.moveDown(0.3);

addHeading('Personalized Food Guidance');
addBody('Food recommendations are based on your prakriti, dosha imbalances, season, and dietary restrictions.');

addSubtitle('Food Categories', 12);
doc.moveDown(0.1);
addBullet('Best Foods (Green): Consume daily - actively support balance', 30);
addBullet('Good Foods (Blue): 3-4 times per week - support health', 30);
addBullet('OK Foods (Yellow): Moderation - once/twice weekly', 30);
addBullet('Avoid Foods (Red): Avoid if possible - increase imbalance', 30);

addHeading('Understanding Ayurvedic Food Properties');

addSubtitle('Rasa (Taste) - 6 Types', 12);
doc.moveDown(0.1);
addBullet('Sweet: Nourishing, grounding', 30);
addBullet('Sour: Stimulating, warming', 30);
addBullet('Salty: Grounding, stimulating', 30);
addBullet('Bitter: Cooling, cleansing', 30);
addBullet('Pungent: Warming, stimulating', 30);
addBullet('Astringent: Cooling, drying', 30);

addSubtitle('Constitutional Food Guidelines', 12);
doc.moveDown(0.1);
addBody('Vata: Warm foods, grounding, regular meals. Best: sesame oil, warm milk, rice, nuts.');
doc.moveDown(0.15);
addBody('Pitta: Cooling foods, hydrating. Best: coconut oil, cool herbs, sweet fruits, milk.');
doc.moveDown(0.15);
addBody('Kapha: Warm, light, stimulating spices. Best: mustard oil, warming spices, lean proteins.');

addHeading('Food Incompatibilities (Viruddha Ahara)');
addBody('Use the app to check which food combinations to avoid (e.g., milk with sour fruits, meat with milk).');

addFooter(10);

// Page 11: Device Setup
newPage(11);
addTitle('10. DEVICE & SENSOR SETUP', 22);
doc.moveDown(0.3);

addHeading('AyurTwin Band Pro Features');
addBullet('24/7 Heart rate monitoring');
addBullet('Blood oxygen saturation (SpO2)');
addBullet('Skin temperature monitoring');
addBullet('3-axis accelerometer (activity tracking)');
addBullet('7-day battery life');
addBullet('Water-resistant (not waterproof)');
addBullet('Bluetooth 5.0 connectivity');

addHeading('Initial Setup');
addBullet('Charge device until LED turns green (2-3 hours)', 30);
addBullet('Enable Bluetooth on smartphone', 30);
addBullet('In app: Settings > Devices > Add New Device', 30);
addBullet('Select device from scanning list', 30);
addBullet('Confirm pairing', 30);

addHeading('Proper Wearing');
addBullet('Wear on non-dominant wrist');
addBullet('Snug but not tight (one finger fits underneath)');
addBullet('Keep clean and dry');
addBullet('Skin contact essential for accuracy');

addHeading('Data Synchronization');
addBody('Automatic sync occurs every 5 seconds when worn and Bluetooth is connected. For manual sync, go to Device page > "Sync Now" button.');

addHeading('Battery Management');
addBullet('Charge when below 20%', 30);
addBullet('Daily charging recommended', 30);
addBullet('Use only provided charger', 30);
addBullet('Full charge = 7 days use', 30);

addHeading('Device Troubleshooting');
addBullet('Device not found: Charge fully, restart BT, force close app', 30);
addBullet('Data not syncing: Check BT enabled, within range, restart device', 30);
addBullet('Inaccurate readings: Check fit, clean sensor, wait 5+ minutes', 30);
addBullet('Connection drops: Move away from WiFi, reduce distance, restart', 30);

addFooter(11);

// Page 12: Family Monitoring
newPage(12);
addTitle('11. FAMILY MONITORING', 22);
doc.moveDown(0.3);

addHeading('For Primary Users (Patients)');

addSubtitle('Inviting Family Members', 12);
doc.moveDown(0.1);
addBullet('Dashboard > Family > Invite Family Member', 30);
addBullet('Enter their email address', 30);
addBullet('Choose relationship (spouse, parent, child, sibling, guardian)', 30);
addBullet('Send invite - they receive email invitation', 30);

addSubtitle('Privacy Controls', 12);
doc.moveDown(0.1);
addBody('Settings > Privacy: Toggle data categories for each family member. Options include:');
doc.moveDown(0.1);
addBullet('Full Health Data', 30);
addBullet('Vital Signs Only', 30);
addBullet('Risk Alerts Only', 30);
addBullet('Disease Data Only', 30);

addHeading('For Family Members (Caregivers)');

addSubtitle('Accepting an Invitation', 12);
doc.moveDown(0.1);
addBullet('Check email for AyurTwin invitation', 30);
addBullet('Click "Accept Invitation" link', 30);
addBullet('Complete registration if new user', 30);
addBullet('Confirm relationship to patient', 30);
addBullet('Access granted immediately', 30);

addSubtitle('Viewing Family Member Health', 12);
doc.moveDown(0.1);
addBody('More Tab > Family: Select family member to monitor their dashboard. View health score, vital signs, recent alerts, disease risks, and activity/sleep (if shared).');

addHeading('Setting Up Alerts');
addBody('Settings > Alerts: Choose family members, alert sensitivity (high/medium/low), and notification type (push, email, SMS). Get alerts for critical vitals, high disease risk, missed medications, and unusual patterns.');

addFooter(12);

// Page 13: Troubleshooting
newPage(13);
addTitle('12. TROUBLESHOOTING & SUPPORT', 22);
doc.moveDown(0.3);

addHeading('Account Issues');
addBullet('Cannot login: Check spelling, disable caps lock, try "Forgot Password"', 30);
addBullet('Account suspended: Contact support with proof of identity for verification', 30);
addBullet('Password reset issues: Check spam folder, links valid 24 hours', 30);
addBullet('Cannot create account: Email/username may be taken, check password requirements', 30);

addHeading('Data & Syncing Issues');
addBullet('Data not syncing: Check internet, permissions, try manual sync, restart app', 30);
addBullet('Old data shown: Force refresh, check internet, verify BT connected', 30);
addBullet('Missing days: Check device was worn/charged, verify BT connected', 30);

addHeading('Device Issues');
addBullet('Heart rate shows 0: Check skin contact, restart device, clean sensor', 30);
addBullet('SpO2 unavailable: Poor signal, ensure snug fit, wait 30 seconds', 30);
addBullet('Battery drains fast: Check heart rate monitoring enabled, reduce brightness', 30);
addBullet('Cannot pair: Fully charge, disable other BT devices, restart phone', 30);

addHeading('App Performance');
addBullet('Crashes or freezes: Force close, clear cache, restart device', 30);
addBullet('Slow performance: Check storage (need 200MB free), close other apps', 30);
addBullet('Notifications not working: Check enabled in Settings > Notifications', 30);

addHeading('Contact Support');
addBody('More Tab > Help > Contact Support. Describe issue in detail, include device type and app version. Typical response: 24-48 hours.');

addFooter(13);

// Page 14: FAQs
newPage(14);
addTitle('13. FREQUENTLY ASKED QUESTIONS', 22);
doc.moveDown(0.3);

addSubtitle('General Questions', 12);
doc.moveDown(0.1);
addBody('Q: Is my health data private?');
addBody('A: Yes. All data is encrypted and stored securely. Data is never shared without your explicit permission.');
doc.moveDown(0.2);
addBody('Q: Can I use AyurTwin without a smartwatch?');
addBody('A: Yes. You can manually enter health data or use simulated data for demonstration.');
doc.moveDown(0.2);
addBody('Q: How often should I check metrics?');
addBody('A: Daily checks ideal for consistent monitoring. At minimum, check weekly to track trends.');
doc.moveDown(0.2);
addBody('Q: Is doctor consultation necessary?');
addBody('A: AyurTwin provides preventive insights, not medical diagnoses. Consult professionals for symptoms or diagnoses.');

addSubtitle('Account & Privacy', 12);
doc.moveDown(0.1);
addBody('Q: Can I have multiple accounts?');
addBody('A: No. One email = one account. Family members can be monitored separately.');
doc.moveDown(0.2);
addBody('Q: How do I delete my account?');
addBody('A: Settings > Account > Delete Account. This permanently removes all your data.');

addSubtitle('Health & Metrics', 12);
doc.moveDown(0.1);
addBody('Q: Why is my health score lower today?');
addBody('A: Health score updates with new sensor data, reflecting exercise, sleep, stress, and lifestyle factors.');
doc.moveDown(0.2);
addBody('Q: Are recommendations personalized?');
addBody('A: Yes. All based on your prakriti, imbalances, season, age, and health data.');

addSubtitle('Device Questions', 12);
doc.moveDown(0.1);
addBody('Q: How often should I charge?');
addBody('A: Daily charging recommended. Device lasts 7 days on full charge.');
doc.moveDown(0.2);
addBody('Q: Is device waterproof?');
addBody('A: No, water-resistant only. Remove during showers, swimming, water sports.');

addFooter(14);

// Page 15: Glossary and Quick Reference
newPage(15);
addTitle('APPENDIX A: GLOSSARY OF AYURVEDIC TERMS', 22);
doc.moveDown(0.3);

const glossary = [
  ['Agni', 'Digestive fire; metabolic capacity'],
  ['Ama', 'Toxins; undigested food residue'],
  ['Asana', 'Yoga posture or pose'],
  ['Abhyanga', 'Traditional oil massage'],
  ['Dinacharya', 'Daily routine according to Ayurveda'],
  ['Dosha', 'Constitutional type (Vata, Pitta, Kapha)'],
  ['Kapha', 'Constitutional type - earth and water'],
  ['Pitta', 'Constitutional type - fire and water'],
  ['Prakriti', 'Individual constitution at birth'],
  ['Pranayama', 'Breathing exercises'],
  ['Rasa', 'Taste (one of six types)'],
  ['Ritucharya', 'Seasonal routine according to Ayurveda'],
  ['Vata', 'Constitutional type - air and ether'],
  ['Virya', 'Potency of food (heating or cooling)'],
  ['Viruddha Ahara', 'Incompatible food combinations'],
];

doc.fontSize(10).fillColor(colors.text).font('Helvetica-Bold');
glossary.forEach(([term, def]) => {
  doc.text(term + ':', { continued: true });
  doc.font('Helvetica');
  doc.text(' ' + def);
  doc.moveDown(0.25);
});

doc.moveDown(0.5);
addTitle('APPENDIX B: QUICK REFERENCE GUIDE', 22);
doc.moveDown(0.3);

addHeading('Key Numbers to Remember');
addBullet('Ideal Heart Rate: 60-100 bpm (resting)', 30);
addBullet('Ideal SpO2: 95-100%', 30);
addBullet('Ideal Temperature: 36.5-37.5°C', 30);
addBullet('Ideal Sleep: 7-9 hours per night', 30);
addBullet('Ideal Exercise: 30+ minutes daily, 5-6 days/week', 30);
addBullet('Ideal Health Score: 70+', 30);
addBullet('App Login Timeout: 30 minutes inactivity', 30);

addFooter(15);

// Page 16: Conclusion
newPage(16);
addTitle('CONCLUSION', 22);
doc.moveDown(0.5);

addBody('AyurTwin is designed to guide you toward a healthier, more balanced life through the wisdom of Ayurveda combined with modern technology. Remember that this app is a supportive tool and complement to professional medical care, not a replacement.');

doc.moveDown(0.8);
addHeading('Recommendations for Optimal Results:');
doc.moveDown(0.3);
addBullet('Use the app consistently - daily if possible');
addBullet('Follow personalized recommendations carefully');
addBullet('Keep health data accurate and updated');
addBullet('Consult healthcare professionals for diagnosis');
addBullet('Share relevant data with family for support');

doc.moveDown(1);
addHeading('Support & Resources');
doc.moveDown(0.3);
doc.fontSize(10).fillColor(colors.text).font('Helvetica');
doc.text('Support Email: support@ayurtwin.com');
doc.text('Website: www.ayurtwin.com');
doc.text('Documentation: docs.ayurtwin.com');
doc.text('Community Forum: community.ayurtwin.com');

doc.moveDown(1.5);
doc.fontSize(11).fillColor(colors.secondary).font('Helvetica-Bold');
doc.text('AyurTwin combines ancient Ayurvedic wisdom with modern technology to support your health journey.', { align: 'center' });

doc.moveDown(1);
doc.fontSize(10).fillColor(colors.lightText).font('Helvetica');
doc.text('Version 1.0  |  April 2026  |  All Rights Reserved', { align: 'center' });

addFooter(16);

// Finalize PDF
doc.end();

// Handle stream completion
stream.on('finish', () => {
  console.log('PDF generated successfully!');
  console.log('File saved to:', outputPath);
  console.log('File size:', fileSizeInMB(outputPath) + ' MB');
});

function fileSizeInMB(filepath) {
  const stats = fs.statSync(filepath);
  const fileSizeInBytes = stats.size;
  const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
  return fileSizeInMegabytes.toFixed(2);
}

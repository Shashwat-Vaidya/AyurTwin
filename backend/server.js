/**
 * AyurTwin backend v4.0
 * Clean Node/Express server, ML-powered disease prediction, rule-based engines.
 */
const express = require('express');
const cors = require('cors');
const { PORT } = require('./config/env');
const errorHandler = require('./middleware/errorHandler');
const { sanitizeBody } = require('./middleware/validate');
const sensorSimulator = require('./schedulers/sensorSimulator');
const { createLogger } = require('./utils/logger');

const log = createLogger('server');
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(sanitizeBody);

// ── Routes (all under /api) ─────────────────────────────────────────
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/users',       require('./routes/users'));
app.use('/api/sensors',     require('./routes/sensors'));
app.use('/api/dashboard',   require('./routes/dashboard'));
app.use('/api/metrics',     require('./routes/metrics'));
app.use('/api',             require('./routes/predict'));          // /predict-risk, /predict-risk/me
app.use('/api/diet',        require('./routes/diet'));
app.use('/api/yoga',        require('./routes/yoga'));
app.use('/api/prevention',  require('./routes/prevention'));
app.use('/api/chat',        require('./routes/chatbot'));
app.use('/api/family',      require('./routes/family'));
app.use('/api/dinacharya',  require('./routes/dinacharya'));
app.use('/api/alerts',      require('./routes/alerts'));
app.use('/api/social',      require('./routes/social'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/education',   require('./routes/education'));
app.use('/api/reports',     require('./routes/reports'));

app.get('/', (_req, res) => res.json({ name: 'AyurTwin API', version: '4.0.0' }));
app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

app.use(errorHandler);

app.listen(PORT, async () => {
    log.info(`AyurTwin v4.0 listening on :${PORT}`);
    await sensorSimulator.start();
});

module.exports = app;

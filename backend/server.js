/**
 * AyurTwin Backend Server v3.0
 * Production-Ready Modular Architecture
 *
 * Features:
 * - Modular layered architecture (routes, services, engines, middleware)
 * - JWT authentication with bcrypt password hashing
 * - Role-based access control (patient, family_member, doctor)
 * - Family member approval workflow
 * - Automated sensor data generation (5-second intervals)
 * - Disease prediction with ML fusion engine
 * - Complete Ayurvedic health engine (Dosha, Agni, Ama, Ojas)
 * - Food recommendations (Ayurvedic scoring)
 * - Yoga recommendations (Dosha-based sessions)
 * - Nadi Pariksha (Digital Pulse Analysis)
 * - Ritucharya (Seasonal Regimen)
 * - Panchakarma Readiness Assessment
 * - Dosha Clock (Kala Chakra)
 * - Social feed, leaderboard, chatbot
 * - ESP32 IoT sensor integration
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

// ─── Global Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(sanitizeBody);

// ─── Routes ──────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/health', require('./routes/health'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/sensors', require('./routes/sensors'));
app.use('/api/social', require('./routes/social'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/family', require('./routes/family'));
app.use('/api/food', require('./routes/food'));
app.use('/api/yoga', require('./routes/yoga'));
app.use('/api/prevention', require('./routes/prevention'));
app.use('/api/nadi', require('./routes/nadi'));
app.use('/api/ritucharya', require('./routes/ritucharya'));
app.use('/api/panchakarma', require('./routes/panchakarma'));
app.use('/api/dosha-clock', require('./routes/doshaClock'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/dinacharya', require('./routes/dinacharya'));

// Legacy routes (without /api prefix) for backward compatibility
app.use('/register', require('./routes/auth'));
app.use('/login', (req, res, next) => { req.url = '/login'; next(); }, require('./routes/auth'));

// ─── Health Check ────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: 'AyurTwin API Server v3.0',
    version: '3.0.0',
    docs: '/api',
    features: [
      'JWT Authentication + RBAC',
      'Automated Sensor Data (5s interval)',
      'Disease Prediction (Hybrid Fusion)',
      'Ayurvedic Health Engine',
      'Food Recommendations',
      'Yoga Recommendations',
      'Nadi Pariksha',
      'Ritucharya',
      'Panchakarma Assessment',
      'Dosha Clock',
      'Social Feed & Leaderboard',
      'Family Access Control',
    ],
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// ─── Error Handler ───────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start ───────────────────────────────────────────────────────────
app.listen(PORT, async () => {
  log.info('===========================================');
  log.info('  AyurTwin API Server v3.0');
  log.info(`  Running on port ${PORT}`);
  log.info(`  Health check: http://localhost:${PORT}/health`);
  log.info('===========================================');
  log.info('');
  log.info('API Routes (all under /api):');
  log.info('  Auth:        POST /api/auth/register, /api/auth/login');
  log.info('  Health:      POST /api/health/lifestyle, sleep-mental, symptoms, etc.');
  log.info('  Dashboard:   GET  /api/dashboard/:userId');
  log.info('  Sensors:     POST /api/sensors/ingest, GET /api/sensors/latest/:userId');
  log.info('  Social:      GET  /api/social/feed, POST /api/social/post, /api/social/like');
  log.info('  Leaderboard: GET  /api/leaderboard');
  log.info('  Family:      POST /api/family/invite, /api/family/accept, GET /api/family/:userId');
  log.info('  Food:        GET  /api/food/recommendations/:userId, POST /api/food/check-compatibility');
  log.info('  Yoga:        GET  /api/yoga/recommendations/:userId, POST /api/yoga/session');
  log.info('  Prevention:  GET  /api/prevention/:userId');
  log.info('  Nadi:        POST /api/nadi/analyze, GET /api/nadi/history/:userId');
  log.info('  Ritucharya:  GET  /api/ritucharya/:userId');
  log.info('  Panchakarma: GET  /api/panchakarma/:userId');
  log.info('  Dosha Clock: GET  /api/dosha-clock/:userId');
  log.info('  Chat:        POST /api/chat');
  log.info('  Dinacharya:  POST /api/dinacharya, GET /api/dinacharya/:userId');
  log.info('');

  // Start sensor simulator
  await sensorSimulator.start();
});

module.exports = app;

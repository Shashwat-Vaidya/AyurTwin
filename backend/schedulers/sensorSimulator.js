/**
 * Automated Sensor Data Simulator
 * Generates realistic sensor readings every 5 seconds for all registered patients
 * Simulates ESP32 IoT device data (DS18B20 + MAX30102 + MPU6050)
 */
const supabase = require('../config/supabase');
const { SENSOR_INTERVAL_MS, SENSOR_SIMULATOR_ENABLED } = require('../config/env');
const { createLogger } = require('../utils/logger');
const { randomBetween } = require('../utils/helpers');

const log = createLogger('sensor-simulator');

// ─── Sensor profiles (per-patient state) ─────────────────────────────
const patientStates = {};

function getPatientState(userId) {
  if (!patientStates[userId]) {
    // Random baseline per patient
    patientStates[userId] = {
      baseHR: randomBetween(65, 80),
      baseSpo2: randomBetween(96, 99),
      baseTemp: randomBetween(36.3, 37.1),
      activity: 'resting', // resting, light, moderate, active
      lastUpdate: Date.now(),
    };
  }
  return patientStates[userId];
}

/**
 * Generate a realistic sensor reading for a patient
 */
function generateReading(userId) {
  const state = getPatientState(userId);

  // Occasionally change activity state
  if (Math.random() < 0.1) {
    const activities = ['resting', 'light', 'moderate', 'active'];
    state.activity = activities[Math.floor(Math.random() * activities.length)];
  }

  let hr, spo2, temp, accelX, accelY, accelZ;

  switch (state.activity) {
    case 'resting':
      hr = state.baseHR + randomBetween(-3, 3);
      spo2 = state.baseSpo2 + randomBetween(-0.5, 0.5);
      temp = state.baseTemp + randomBetween(-0.1, 0.1);
      accelX = randomBetween(-0.1, 0.1);
      accelY = randomBetween(-0.1, 0.1);
      accelZ = 9.8 + randomBetween(-0.05, 0.05);
      break;

    case 'light':
      hr = state.baseHR + randomBetween(0, 10);
      spo2 = state.baseSpo2 + randomBetween(-1, 0.3);
      temp = state.baseTemp + randomBetween(-0.05, 0.15);
      accelX = randomBetween(-0.5, 0.5);
      accelY = randomBetween(-0.5, 0.5);
      accelZ = 9.8 + randomBetween(-0.2, 0.2);
      break;

    case 'moderate':
      hr = state.baseHR + randomBetween(10, 25);
      spo2 = state.baseSpo2 + randomBetween(-2, 0);
      temp = state.baseTemp + randomBetween(0.1, 0.3);
      accelX = randomBetween(-1.5, 1.5);
      accelY = randomBetween(-1.5, 1.5);
      accelZ = 9.8 + randomBetween(-0.8, 0.8);
      break;

    case 'active':
      hr = state.baseHR + randomBetween(25, 50);
      spo2 = state.baseSpo2 + randomBetween(-3, -0.5);
      temp = state.baseTemp + randomBetween(0.2, 0.5);
      accelX = randomBetween(-3, 3);
      accelY = randomBetween(-3, 3);
      accelZ = 9.8 + randomBetween(-2, 2);
      break;

    default:
      hr = state.baseHR;
      spo2 = state.baseSpo2;
      temp = state.baseTemp;
      accelX = 0;
      accelY = 0;
      accelZ = 9.8;
  }

  // Clamp values to realistic ranges (heart_rate is INT in schema)
  hr = Math.round(Math.max(45, Math.min(150, hr)));
  spo2 = Math.round(Math.max(85, Math.min(100, spo2)) * 10) / 10;
  temp = Math.round(Math.max(35, Math.min(40, temp)) * 100) / 100;
  accelX = Math.round(accelX * 100) / 100;
  accelY = Math.round(accelY * 100) / 100;
  accelZ = Math.round(accelZ * 100) / 100;

  return {
    user_id: userId,
    device_id: 'ATB-SIM',
    heart_rate: hr,
    spo2,
    temperature: temp,
    accel_x: accelX,
    accel_y: accelY,
    accel_z: accelZ,
  };
}

let intervalHandle = null;
let patientIds = [];

/**
 * Fetch all patient user IDs from Supabase
 */
async function refreshPatientList() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('user_type', 'patient');

    if (error) {
      log.warn('Failed to fetch patient list:', error.message);
      return;
    }
    patientIds = (data || []).map((u) => u.id);
    log.info(`Tracking ${patientIds.length} patients for sensor simulation`);
  } catch (err) {
    log.error('Error refreshing patient list:', err.message);
  }
}

/**
 * Generate and insert sensor readings for all patients
 */
async function tick() {
  if (patientIds.length === 0) return;

  const readings = patientIds.map(generateReading);

  try {
    const { error } = await supabase.from('sensor_readings').insert(readings);
    if (error) {
      log.warn('Sensor insert error:', error.message);
    }
  } catch (err) {
    log.error('Sensor tick error:', err.message);
  }
}

/**
 * Start the simulator
 */
async function start() {
  if (!SENSOR_SIMULATOR_ENABLED) {
    log.info('Sensor simulator disabled via config');
    return;
  }

  log.info(`Starting sensor simulator (interval: ${SENSOR_INTERVAL_MS}ms)`);
  await refreshPatientList();

  // Refresh patient list every 5 minutes
  setInterval(refreshPatientList, 5 * 60 * 1000);

  // Generate readings at configured interval
  intervalHandle = setInterval(tick, SENSOR_INTERVAL_MS);

  // Initial tick
  tick();
}

/**
 * Stop the simulator
 */
function stop() {
  if (intervalHandle) {
    clearInterval(intervalHandle);
    intervalHandle = null;
    log.info('Sensor simulator stopped');
  }
}

module.exports = { start, stop, generateReading };

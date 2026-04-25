/**
 * Sensor simulator - writes a synthetic row per patient every 5s
 * into public.sensor_data. Lets the dashboard work with no hardware.
 */
const { supabase } = require('../config/supabase');
const { SENSOR_INTERVAL_MS, SENSOR_SIMULATOR_ENABLED } = require('../config/env');
const { createLogger } = require('../utils/logger');

const log = createLogger('sensor-sim');

function rand(min, max) { return Math.random() * (max - min) + min; }
function round(x, n = 2) { return Math.round(x * (10 ** n)) / (10 ** n); }

const states = Object.create(null);

function state(userId) {
    if (!states[userId]) {
        states[userId] = {
            baseHR: Math.round(rand(65, 80)),
            baseSpo2: Math.round(rand(96, 99)),
            baseTemp: rand(36.3, 37.0),
            phase: 'resting',
        };
    }
    return states[userId];
}

function generate(userId) {
    const s = state(userId);
    if (Math.random() < 0.08) s.phase = ['resting', 'light', 'moderate', 'active'][Math.floor(Math.random() * 4)];

    let hr, spo2, temp, ax, ay, az;
    switch (s.phase) {
        case 'active':   hr = s.baseHR + rand(25, 45); spo2 = s.baseSpo2 + rand(-3, -0.5); temp = s.baseTemp + rand(0.2, 0.5); ax = rand(-3,3); ay = rand(-3,3); az = 9.8 + rand(-2,2); break;
        case 'moderate': hr = s.baseHR + rand(10, 25); spo2 = s.baseSpo2 + rand(-2, 0);    temp = s.baseTemp + rand(0.1, 0.3); ax = rand(-1.5,1.5); ay = rand(-1.5,1.5); az = 9.8 + rand(-0.8,0.8); break;
        case 'light':    hr = s.baseHR + rand(0, 10);  spo2 = s.baseSpo2 + rand(-1, 0.3);  temp = s.baseTemp + rand(-0.05, 0.15); ax = rand(-0.5,0.5); ay = rand(-0.5,0.5); az = 9.8 + rand(-0.2,0.2); break;
        default:         hr = s.baseHR + rand(-3, 3);  spo2 = s.baseSpo2 + rand(-0.5, 0.5); temp = s.baseTemp + rand(-0.1, 0.1); ax = rand(-0.1,0.1); ay = rand(-0.1,0.1); az = 9.8 + rand(-0.05,0.05);
    }

    return {
        user_id: userId,
        heart_rate: Math.round(Math.max(45, Math.min(160, hr))),
        spo2: round(Math.max(85, Math.min(100, spo2)), 1),
        body_temperature: round(Math.max(35, Math.min(40, temp)), 2),
        accel_x: round(ax), accel_y: round(ay), accel_z: round(az),
        gyro_x: round(rand(-0.5, 0.5)), gyro_y: round(rand(-0.5, 0.5)), gyro_z: round(rand(-0.5, 0.5)),
        recorded_at: new Date().toISOString(),
    };
}

let ids = [];
let handle = null;

async function refresh() {
    const { data, error } = await supabase.from('users').select('id').eq('role', 'patient');
    if (error) { log.warn('refresh fail', error.message); return; }
    ids = (data || []).map(u => u.id);
    log.info(`simulating ${ids.length} patients`);
}

async function tick() {
    if (!ids.length) return;
    const rows = ids.map(generate);
    const { error } = await supabase.from('sensor_data').insert(rows);
    if (error) log.warn('insert fail', error.message);
}

async function start() {
    if (!SENSOR_SIMULATOR_ENABLED) { log.info('simulator disabled'); return; }
    log.info(`starting (interval ${SENSOR_INTERVAL_MS}ms)`);
    await refresh();
    setInterval(refresh, 5 * 60 * 1000);
    handle = setInterval(tick, SENSOR_INTERVAL_MS);
    tick();
}

function stop() { if (handle) clearInterval(handle); }

module.exports = { start, stop, generate };

/**
 * Demo helper: pushes a fresh sensor row for Sham Jadhav to Supabase
 * every 5 seconds, overwriting the rolling 10-minute window.
 *
 *   node scripts/loopShamSensors.js
 *
 * (The built-in sensor simulator in schedulers/sensorSimulator.js
 *  already does this automatically for ALL patients when the server
 *  runs - use this script only if you've disabled it.)
 */
const { supabase } = require('../config/supabase');

const USER_ID = '11111111-1111-1111-1111-111111111111';
const INTERVAL_MS = 5000;

function rand(min, max) { return Math.random() * (max - min) + min; }
function r2(x, n = 2) { return Math.round(x * (10 ** n)) / (10 ** n); }

let t = 0;
async function tick() {
    t++;
    const hr = Math.round(75 + 8 * Math.sin(t * 0.15) + (Math.random() * 4 - 2));
    const spo2 = r2(97 + Math.sin(t * 0.1) + (Math.random() * 0.6 - 0.3), 1);
    const temp = r2(36.8 + 0.2 * Math.sin(t * 0.12) + (Math.random() * 0.2 - 0.1), 2);
    const ax = r2(Math.sin(t * 0.3) * 0.8 + (Math.random() * 0.3 - 0.15));
    const ay = r2(Math.cos(t * 0.3) * 0.8 + (Math.random() * 0.3 - 0.15));
    const az = r2(9.8 + Math.sin(t * 0.1) * 0.3 + (Math.random() * 0.2 - 0.1));

    const row = {
        user_id: USER_ID,
        heart_rate: hr, spo2, body_temperature: temp,
        accel_x: ax, accel_y: ay, accel_z: az,
        gyro_x: r2((Math.random() - 0.5) * 0.6),
        gyro_y: r2((Math.random() - 0.5) * 0.6),
        gyro_z: r2((Math.random() - 0.5) * 0.6),
        recorded_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('sensor_data').insert([row]);
    process.stdout.write(error ? `!${error.message}\n` : `✓ HR ${hr} SpO2 ${spo2} T ${temp}\r`);
}

console.log('[sham-loop] writing a sensor row every', INTERVAL_MS / 1000, 'seconds. Ctrl+C to stop.');
tick();
setInterval(tick, INTERVAL_MS);

/**
 * Environment config. Reads from .env (see .env.example for the template).
 * Hard-fails on missing critical secrets so we never accidentally ship defaults.
 */
require('dotenv').config();

function required(name) {
    const v = process.env[name];
    if (!v) {
        console.error(`\n[env] Missing required environment variable: ${name}`);
        console.error(`      Copy .env.example to .env and fill it in.\n`);
        process.exit(1);
    }
    return v;
}

module.exports = {
    PORT: parseInt(process.env.PORT, 10) || 4000,
    NODE_ENV: process.env.NODE_ENV || 'development',

    SUPABASE_URL: required('SUPABASE_URL'),
    SUPABASE_KEY: required('SUPABASE_KEY'),

    JWT_SECRET: required('JWT_SECRET'),
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

    SENSOR_INTERVAL_MS: parseInt(process.env.SENSOR_INTERVAL_MS, 10) || 5000,
    SENSOR_SIMULATOR_ENABLED: (process.env.SENSOR_SIMULATOR_ENABLED || 'true') !== 'false',

    SMTP_HOST: process.env.SMTP_HOST || 'smtp.resend.com',
    SMTP_PORT: parseInt(process.env.SMTP_PORT, 10) || 465,
    SMTP_SECURE: (process.env.SMTP_SECURE || 'true') === 'true',
    SMTP_USER: process.env.SMTP_USER || 'resend',
    SMTP_PASS: process.env.SMTP_PASS || '',
    SMTP_FROM: process.env.SMTP_FROM || 'AyurTwin <onboarding@resend.dev>',

    APP_NAME: process.env.APP_NAME || 'AyurTwin',
    APP_WEB_URL: process.env.APP_WEB_URL || 'http://localhost:19006',
};

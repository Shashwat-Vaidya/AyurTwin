/**
 * Environment Configuration
 * Centralizes all environment variables with defaults
 */
require('dotenv').config();

module.exports = {
  PORT: parseInt(process.env.PORT, 10) || 4000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Supabase - uses same project as frontend
  SUPABASE_URL: process.env.SUPABASE_URL || 'https://fqkoeciocktehmcioaxf.supabase.co',
  SUPABASE_KEY: process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxa29lY2lvY2t0ZWhtY2lvYXhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MTg0NDcsImV4cCI6MjA5MTk5NDQ0N30.Cxe3NScI7YvJsk8icpCTvYaFJfxxZ95DsJX3Uo5sx_k',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'ayurtwin-secret-key-change-in-production-2024',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // Sensor simulator
  SENSOR_INTERVAL_MS: parseInt(process.env.SENSOR_INTERVAL_MS, 10) || 5000,
  SENSOR_SIMULATOR_ENABLED: process.env.SENSOR_SIMULATOR_ENABLED !== 'false',
};

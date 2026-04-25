/**
 * Supabase Client - shared across the backend.
 * Uses the same project as the React Native frontend.
 */
const { createClient } = require('@supabase/supabase-js');
const { SUPABASE_URL, SUPABASE_KEY } = require('./env');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false },
});

module.exports = { supabase };

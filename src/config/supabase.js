import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace these with your Supabase project credentials
const SUPABASE_URL = 'https://fqkoeciocktehmcioaxf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxa29lY2lvY2t0ZWhtY2lvYXhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MTg0NDcsImV4cCI6MjA5MTk5NDQ0N30.Cxe3NScI7YvJsk8icpCTvYaFJfxxZ95DsJX3Uo5sx_k';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

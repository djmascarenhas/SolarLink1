import { createClient } from '@supabase/supabase-js';

// Helper to safely get env vars
const getEnv = (key: string) => {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
        return import.meta.env[key];
    }
    if (typeof process !== 'undefined' && process.env) {
        return process.env[key];
    }
    return undefined;
};

export const supabaseUrl = getEnv('VITE_SUPABASE_URL') || '';
export const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY') || '';

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
);

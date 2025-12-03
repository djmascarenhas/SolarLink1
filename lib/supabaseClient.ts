import { createClient } from '@supabase/supabase-js';

// Safe check for process.env to avoid crashing in pure browser environments
const env = (typeof process !== 'undefined' && process.env) ? process.env : {};

const supabaseUrl = env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = env.SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
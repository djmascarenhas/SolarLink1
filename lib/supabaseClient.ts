import { createClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from './env';

const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

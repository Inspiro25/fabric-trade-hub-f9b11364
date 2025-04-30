
import { createClient } from '@supabase/supabase-js';

// Use hardcoded values from config instead of process.env
import { SUPABASE_CONFIG } from '@/config/supabase';

export const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey); 

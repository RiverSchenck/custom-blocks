import { createClient } from '@supabase/supabase-js';

import { type Database } from '../../types/database.types';

// Get Supabase credentials from environment variables
// In Frontify blocks, these may need to be passed via settings
const supabaseUrl =
    (import.meta as { env?: { VITE_SUPABASE_URL?: string } }).env?.VITE_SUPABASE_URL ||
    (typeof window !== 'undefined' && (window as { __SUPABASE_URL__?: string }).__SUPABASE_URL__) ||
    'https://vpohzqeehkwiwzmegaqn.supabase.co';

const supabaseAnonKey =
    (import.meta as { env?: { VITE_SUPABASE_ANON_KEY?: string } }).env?.VITE_SUPABASE_ANON_KEY ||
    (typeof window !== 'undefined' && (window as { __SUPABASE_ANON_KEY__?: string }).__SUPABASE_ANON_KEY__) ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwb2h6cWVlaGt3aXd6bWVnYXFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxOTkyNjQsImV4cCI6MjA4NDc3NTI2NH0.7eFrU7nxkE1sUsbLEpNkYlopPK9LaKGlCtx7nFNQbxU';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

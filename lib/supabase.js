// ==========================================
// DealDino - Supabase Client Setup
// ==========================================
//
// 🔧 HOW TO SET UP:
// 1. Create a free Supabase project at https://supabase.com
// 2. Go to Settings > API in your Supabase dashboard
// 3. Copy your Project URL and anon key
// 4. Create a .env file in your project root:
//    VITE_SUPABASE_URL=https://your-project.supabase.co
//    VITE_SUPABASE_ANON_KEY=your-anon-key
//
// ⚠️ NEVER commit .env to git! Add it to .gitignore
// ==========================================

import { createClient } from '@supabase/supabase-js';

// Read from environment variables (Vite uses VITE_ prefix)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Flag to check if Supabase is properly configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Create the Supabase client
// This client handles auth, database queries, and storage
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      // Persist auth session in localStorage
      persistSession: true,
      // Auto refresh token before it expires
      autoRefreshToken: true,
      // Detect session from URL (for OAuth redirects)
      detectSessionInUrl: true,
    },
  }
);
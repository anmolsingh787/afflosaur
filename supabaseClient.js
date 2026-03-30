import { createClient } from '@supabase/supabase-js'

// Ye dono cheezein aapko Supabase Dashboard > Settings > API mein milengi
const supabaseUrl = 'https://ymyvimveqnuzgmmmvimr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlteXZpbXZlcW51emdtbW12aW1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MDg2NzAsImV4cCI6MjA4NzE4NDY3MH0.2jA-DTy6IuKaUqaBSXr_C3zq6I56FuH8KgKZ-lhiFgY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
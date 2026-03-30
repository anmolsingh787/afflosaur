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

// ==========================================
// SQL TO CREATE TABLES IN SUPABASE
// ==========================================
// Run this SQL in the Supabase SQL Editor (Dashboard > SQL Editor)
//
// -- Enable UUID extension
// CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
//
// -- 1. PROFILES (linked to auth.users)
// CREATE TABLE profiles (
//   id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
//   username TEXT NOT NULL DEFAULT '',
//   avatar TEXT DEFAULT '🦖',
//   bio TEXT,
//   role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
//   blog_count INTEGER DEFAULT 0,
//   review_count INTEGER DEFAULT 0,
//   reputation INTEGER DEFAULT 0,
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
//   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
// );
//
// -- 2. PRODUCTS
// CREATE TABLE products (
//   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//   title TEXT NOT NULL,
//   slug TEXT UNIQUE NOT NULL,
//   description TEXT NOT NULL DEFAULT '',
//   image TEXT DEFAULT '',
//   category TEXT NOT NULL DEFAULT 'other',
//   tags TEXT[] DEFAULT '{}',
//   product_type TEXT NOT NULL DEFAULT 'affiliate' CHECK (product_type IN ('affiliate', 'direct', 'mixed')),
//   is_trending BOOLEAN DEFAULT FALSE,
//   is_hot BOOLEAN DEFAULT FALSE,
//   is_featured BOOLEAN DEFAULT FALSE,
//   is_sponsored BOOLEAN DEFAULT FALSE,
//   discount INTEGER,
//   rating NUMERIC(2,1) DEFAULT 0,
//   review_count INTEGER DEFAULT 0,
//   views INTEGER DEFAULT 0,
//   clicks INTEGER DEFAULT 0,
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
//   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
// );
//
// -- 3. STORES
// CREATE TABLE stores (
//   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//   name TEXT NOT NULL,
//   logo TEXT DEFAULT '',
//   affiliate_base_url TEXT DEFAULT '',
//   is_active BOOLEAN DEFAULT TRUE,
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
// );
//
// -- 4. PRICES (price comparison data)
// CREATE TABLE prices (
//   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//   product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
//   store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
//   price NUMERIC(10,2) NOT NULL,
//   original_price NUMERIC(10,2),
//   affiliate_url TEXT DEFAULT '',
//   is_best_deal BOOLEAN DEFAULT FALSE,
//   last_checked TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
// );
//
// -- 5. REVIEWS
// CREATE TABLE reviews (
//   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//   product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
//   user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
//   rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
//   title TEXT NOT NULL DEFAULT '',
//   content TEXT NOT NULL DEFAULT '',
//   pros TEXT[] DEFAULT '{}',
//   cons TEXT[] DEFAULT '{}',
//   helpful_count INTEGER DEFAULT 0,
//   is_verified BOOLEAN DEFAULT FALSE,
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
// );
//
// -- 6. BLOG POSTS
// CREATE TABLE blog_posts (
//   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//   title TEXT NOT NULL,
//   slug TEXT UNIQUE NOT NULL,
//   content TEXT NOT NULL DEFAULT '',
//   excerpt TEXT DEFAULT '',
//   cover_image TEXT DEFAULT '',
//   author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
//   category TEXT NOT NULL DEFAULT 'blog' CHECK (category IN ('review', 'top10', 'comparison', 'blog', 'deal')),
//   tags TEXT[] DEFAULT '{}',
//   likes INTEGER DEFAULT 0,
//   published BOOLEAN DEFAULT FALSE,
//   is_approved BOOLEAN DEFAULT FALSE,
//   featured BOOLEAN DEFAULT FALSE,
//   views INTEGER DEFAULT 0,
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
//   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
// );
//
// -- 7. BLOG COMMENTS
// CREATE TABLE blog_comments (
//   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//   blog_post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
//   user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
//   content TEXT NOT NULL,
//   likes INTEGER DEFAULT 0,
//   parent_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE,
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
// );
//
// -- 8. USER DEALS
// CREATE TABLE user_deals (
//   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//   title TEXT NOT NULL,
//   description TEXT NOT NULL DEFAULT '',
//   product_link TEXT NOT NULL DEFAULT '',
//   original_price NUMERIC(10,2),
//   deal_price NUMERIC(10,2),
//   store_name TEXT DEFAULT '',
//   coupon_code TEXT,
//   submitted_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
//   approved BOOLEAN DEFAULT FALSE,
//   expires_at TIMESTAMP WITH TIME ZONE,
//   upvotes INTEGER DEFAULT 0,
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
// );
//
// -- 9. ANALYTICS EVENTS
// CREATE TABLE analytics_events (
//   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//   event_type TEXT NOT NULL CHECK (event_type IN ('page_view', 'product_click', 'affiliate_click', 'search', 'add_to_cart')),
//   product_id UUID REFERENCES products(id) ON DELETE SET NULL,
//   user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
//   metadata JSONB,
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
// );
//
// ==========================================
// ROW LEVEL SECURITY (RLS) POLICIES
// ==========================================
//
// -- Enable RLS on all tables
// ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
// ALTER TABLE products ENABLE ROW LEVEL SECURITY;
// ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
// ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
// ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
// ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
// ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
// ALTER TABLE user_deals ENABLE ROW LEVEL SECURITY;
// ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
//
// -- PUBLIC READ policies (anyone can read)
// CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
// CREATE POLICY "Stores are viewable by everyone" ON stores FOR SELECT USING (true);
// CREATE POLICY "Prices are viewable by everyone" ON prices FOR SELECT USING (true);
// CREATE POLICY "Published blogs are viewable" ON blog_posts FOR SELECT USING (published = true AND is_approved = true);
// CREATE POLICY "Approved deals are viewable" ON user_deals FOR SELECT USING (approved = true);
// CREATE POLICY "Reviews are viewable" ON reviews FOR SELECT USING (true);
// CREATE POLICY "Blog comments are viewable" ON blog_comments FOR SELECT USING (true);
// CREATE POLICY "Profiles are viewable" ON profiles FOR SELECT USING (true);
//
// -- AUTH REQUIRED policies (logged in users)
// CREATE POLICY "Users can insert own review" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
// CREATE POLICY "Users can update own review" ON reviews FOR UPDATE USING (auth.uid() = user_id);
// CREATE POLICY "Users can delete own review" ON reviews FOR DELETE USING (auth.uid() = user_id);
//
// CREATE POLICY "Users can insert own blog" ON blog_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
// CREATE POLICY "Users can update own blog" ON blog_posts FOR UPDATE USING (auth.uid() = author_id);
// CREATE POLICY "Users can delete own blog" ON blog_posts FOR DELETE USING (auth.uid() = author_id);
//
// CREATE POLICY "Users can submit deals" ON user_deals FOR INSERT WITH CHECK (auth.uid() = submitted_by);
// CREATE POLICY "Users can update own deals" ON user_deals FOR UPDATE USING (auth.uid() = submitted_by);
//
// CREATE POLICY "Users can comment" ON blog_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
// CREATE POLICY "Users can delete own comments" ON blog_comments FOR DELETE USING (auth.uid() = user_id);
//
// CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
// CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
//
// CREATE POLICY "Anyone can log analytics" ON analytics_events FOR INSERT WITH CHECK (true);
//
// -- ADMIN policies (check if user role = 'admin' in profiles table)
// CREATE POLICY "Admins can do everything on products" ON products FOR ALL USING (
//   EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
// );
// CREATE POLICY "Admins can manage stores" ON stores FOR ALL USING (
//   EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
// );
// CREATE POLICY "Admins can manage prices" ON prices FOR ALL USING (
//   EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
// );
// CREATE POLICY "Admins can manage all blogs" ON blog_posts FOR ALL USING (
//   EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
// );
// CREATE POLICY "Admins can manage deals" ON user_deals FOR ALL USING (
//   EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
// );
//
// ==========================================
// AUTO-CREATE PROFILE FUNCTION
// ==========================================
//
// -- Function to auto-create a profile when user signs up
// CREATE OR REPLACE FUNCTION public.handle_new_user()
// RETURNS TRIGGER AS $$
// BEGIN
//   INSERT INTO public.profiles (id, username, avatar)
//   VALUES (
//     NEW.id,
//     COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
//     '🦖'
//   );
//   RETURN NEW;
// END;
// $$ LANGUAGE plpgsql SECURITY DEFINER;
//
// -- Trigger to call function on new user
// CREATE TRIGGER on_auth_user_created
//   AFTER INSERT ON auth.users
//   FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
//
// ==========================================
// INSERT DEFAULT STORES
// ==========================================
//
// INSERT INTO stores (name, logo, affiliate_base_url) VALUES
//   ('Amazon', '🟠', 'https://www.amazon.in/dp/'),
//   ('Flipkart', '🔵', 'https://www.flipkart.com/'),
//   ('Meesho', '🩷', 'https://www.meesho.com/'),
//   ('My Store', '🦖', '');

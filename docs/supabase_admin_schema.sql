-- Supabase schema for Afflosaur admin features

-- Admin whitelist configuration (set in auth settings or via RLS policy)
-- Replace emails with your own admins
-- CREATE FUNCTION public.is_admin_email(email text) RETURNS boolean AS $$
--   SELECT email = ANY(ARRAY['admin1@afflosaur.com','admin2@afflosaur.com']);
-- $$ LANGUAGE SQL STABLE;

-- Table to store sponsor banners
CREATE TABLE IF NOT EXISTS sponsor_banners (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text,
  image text NOT NULL,
  link text NOT NULL,
  status text NOT NULL,
  start_at timestamp with time zone,
  end_at timestamp with time zone
);

-- Table to store sponsor popups
CREATE TABLE IF NOT EXISTS sponsor_popups (
  id text PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  image text,
  cta_text text,
  link text,
  status text NOT NULL,
  trigger text NOT NULL,
  trigger_seconds integer,
  start_at timestamp with time zone,
  end_at timestamp with time zone
);

-- Affiliates
CREATE TABLE IF NOT EXISTS affiliates (
  id text PRIMARY KEY,
  platform text NOT NULL,
  link text NOT NULL,
  commission integer NOT NULL,
  status text NOT NULL
);

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id text PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_email text NOT NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL,
  description text,
  image text,
  category text,
  tags text[],
  product_type text,
  status text,
  is_trending boolean DEFAULT false,
  is_hot boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  is_sponsored boolean DEFAULT false,
  discount integer,
  rating numeric DEFAULT 0,
  review_count integer DEFAULT 0,
  views integer DEFAULT 0,
  clicks integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Blog posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id text PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL,
  content text,
  excerpt text,
  cover_image text,
  author_id text,
  category text,
  tags text[],
  likes integer DEFAULT 0,
  published boolean DEFAULT false,
  is_approved boolean DEFAULT false,
  featured boolean DEFAULT false,
  views integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- User coins
CREATE TABLE IF NOT EXISTS user_coins (
  user_id text PRIMARY KEY,
  balance integer NOT NULL DEFAULT 0,
  updated_at timestamp with time zone DEFAULT now()
);

-- Row Level Security policies for admin actions
ALTER TABLE sponsor_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsor_popups ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_coins ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read everything
CREATE POLICY "Allow read to authenticated" ON sponsor_banners FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read to authenticated" ON sponsor_popups FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read to authenticated" ON affiliates FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read to authenticated" ON products FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read to authenticated" ON blog_posts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read to authenticated" ON user_coins FOR SELECT USING (auth.role() = 'authenticated');

-- Admins can insert/update/delete
-- assumes a function is_admin_email(email text) exists
CREATE POLICY "Admin full access" ON sponsor_banners FOR ALL USING (is_admin_email(auth.email())) WITH CHECK (is_admin_email(auth.email()));
CREATE POLICY "Admin full access" ON sponsor_popups FOR ALL USING (is_admin_email(auth.email())) WITH CHECK (is_admin_email(auth.email()));
CREATE POLICY "Admin full access" ON affiliates FOR ALL USING (is_admin_email(auth.email())) WITH CHECK (is_admin_email(auth.email()));
CREATE POLICY "Admin full access" ON audit_logs FOR INSERT WITH CHECK (is_admin_email(auth.email()));
CREATE POLICY "Admin full access" ON products FOR ALL USING (is_admin_email(auth.email())) WITH CHECK (is_admin_email(auth.email()));

-- allow any authenticated user to insert new blog posts (they will require approval)
CREATE POLICY "Users can insert blogs" ON blog_posts FOR INSERT USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access" ON blog_posts FOR ALL USING (is_admin_email(auth.email())) WITH CHECK (is_admin_email(auth.email()));
CREATE POLICY "Admin full access" ON user_coins FOR ALL USING (is_admin_email(auth.email())) WITH CHECK (is_admin_email(auth.email()));

-- You can extend these policies as needed (e.g. allow users to add their own blog posts, etc.)

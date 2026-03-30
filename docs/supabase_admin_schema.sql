-- Admin tables for sponsors, affiliates, and audit logs
-- Run in Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admin email whitelist
CREATE TABLE IF NOT EXISTS admin_emails (
  email TEXT PRIMARY KEY
);

-- Seed three admin emails
INSERT INTO admin_emails (email) VALUES
  ('admin1@afflosaur.com'),
  ('admin2@afflosaur.com'),
  ('admin3@afflosaur.com')
ON CONFLICT DO NOTHING;

-- Sponsor banners
CREATE TABLE IF NOT EXISTS sponsor_banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  image TEXT NOT NULL,
  link TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','scheduled')),
  start_at DATE,
  end_at DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sponsor popups
CREATE TABLE IF NOT EXISTS sponsor_popups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image TEXT,
  cta_text TEXT,
  link TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','scheduled')),
  trigger TEXT NOT NULL DEFAULT 'on_load' CHECK (trigger IN ('on_load','on_scroll','after_seconds','exit_intent')),
  trigger_seconds INTEGER,
  start_at DATE,
  end_at DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Affiliate links
CREATE TABLE IF NOT EXISTS affiliate_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform TEXT NOT NULL,
  link TEXT NOT NULL,
  commission NUMERIC(5,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','hidden')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_email TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table (availability and status included)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'other',
  tags TEXT[] DEFAULT '{}',
  product_type TEXT NOT NULL DEFAULT 'affiliate' CHECK (product_type IN ('affiliate','direct','mixed')),
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available','out_of_stock','coming_soon','hidden')),
  is_trending BOOLEAN DEFAULT FALSE,
  is_hot BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_sponsored BOOLEAN DEFAULT FALSE,
  discount INTEGER,
  rating NUMERIC(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  excerpt TEXT DEFAULT '',
  cover_image TEXT DEFAULT '',
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL DEFAULT 'blog' CHECK (category IN ('review','top10','comparison','blog','deal')),
  tags TEXT[] DEFAULT '{}',
  likes INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User coins table
CREATE TABLE IF NOT EXISTS user_coins (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  balance INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE admin_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsor_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsor_popups ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Public read for sponsor banners/popups
CREATE POLICY "Public read sponsor banners" ON sponsor_banners FOR SELECT USING (true);
CREATE POLICY "Public read sponsor popups" ON sponsor_popups FOR SELECT USING (true);

-- Admin-only policies (whitelist)
CREATE POLICY "Admins manage sponsor banners" ON sponsor_banners
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_emails ae WHERE ae.email = auth.jwt() ->> 'email')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM admin_emails ae WHERE ae.email = auth.jwt() ->> 'email')
  );

CREATE POLICY "Admins manage sponsor popups" ON sponsor_popups
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_emails ae WHERE ae.email = auth.jwt() ->> 'email')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM admin_emails ae WHERE ae.email = auth.jwt() ->> 'email')
  );

CREATE POLICY "Admins manage affiliates" ON affiliate_links
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_emails ae WHERE ae.email = auth.jwt() ->> 'email')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM admin_emails ae WHERE ae.email = auth.jwt() ->> 'email')
  );

CREATE POLICY "Admins write audit logs" ON audit_logs
  FOR INSERT USING (
    EXISTS (SELECT 1 FROM admin_emails ae WHERE ae.email = auth.jwt() ->> 'email')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM admin_emails ae WHERE ae.email = auth.jwt() ->> 'email')
  );

CREATE POLICY "Admins read audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admin_emails ae WHERE ae.email = auth.jwt() ->> 'email')
  );

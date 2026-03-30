-- ==========================================
-- DealDino - Supabase Database Schema
-- Generated from TypeScript types in database.ts
-- Run this in Supabase SQL Editor
-- ==========================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE product_type_enum AS ENUM ('affiliate', 'direct', 'mixed');
CREATE TYPE blog_category_enum AS ENUM ('review', 'top10', 'comparison', 'blog', 'deal');
CREATE TYPE user_role_enum AS ENUM ('user', 'admin');
CREATE TYPE analytics_event_type AS ENUM ('page_view', 'product_click', 'affiliate_click', 'search', 'add_to_cart');

-- ---- PRODUCTS TABLE ----
CREATE TABLE IF NOT EXISTS public.products (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image text,
  category text,
  tags text[] DEFAULT '{}',
  product_type product_type_enum NOT NULL,
  is_trending boolean DEFAULT false,
  is_hot boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  is_sponsored boolean DEFAULT false,
  discount numeric(5,2),
  rating numeric(3,2) DEFAULT 0,
  review_count integer DEFAULT 0,
  views integer DEFAULT 0,
  clicks integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- ---- STORES TABLE ----
CREATE TABLE IF NOT EXISTS public.stores (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  logo text,
  affiliate_base_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- ---- PRICES TABLE ----
CREATE TABLE IF NOT EXISTS public.prices (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  original_price numeric(10,2),
  affiliate_url text,
  is_best_deal boolean DEFAULT false,
  last_checked timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(product_id, store_id)
);

-- ---- REVIEWS TABLE ----
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text NOT NULL,
  content text NOT NULL,
  pros text[] DEFAULT '{}',
  cons text[] DEFAULT '{}',
  helpful_count integer DEFAULT 0,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- ---- BLOG POSTS TABLE ----
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text,
  cover_image text,
  author_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category blog_category_enum NOT NULL,
  tags text[] DEFAULT '{}',
  likes integer DEFAULT 0,
  published boolean DEFAULT false,
  is_approved boolean DEFAULT false,
  featured boolean DEFAULT false,
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- ---- USER DEALS TABLE ----
CREATE TABLE IF NOT EXISTS public.user_deals (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  product_link text NOT NULL,
  original_price numeric(10,2),
  deal_price numeric(10,2),
  store_name text,
  coupon_code text,
  submitted_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  approved boolean DEFAULT false,
  expires_at timestamptz,
  upvotes integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- ---- PROFILES TABLE ----
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  avatar text,
  bio text,
  role user_role_enum DEFAULT 'user',
  blog_count integer DEFAULT 0,
  review_count integer DEFAULT 0,
  reputation integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- ---- BLOG COMMENTS TABLE ----
CREATE TABLE IF NOT EXISTS public.blog_comments (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  blog_post_id uuid NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  likes integer DEFAULT 0,
  parent_id uuid REFERENCES public.blog_comments(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- ---- ANALYTICS TABLE ----
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_type analytics_event_type NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  metadata jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_product_type ON public.products(product_type);
CREATE INDEX IF NOT EXISTS idx_products_trending ON public.products(is_trending) WHERE is_trending = true;
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_hot ON public.products(is_hot) WHERE is_hot = true;

CREATE INDEX IF NOT EXISTS idx_stores_active ON public.stores(is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_prices_product_id ON public.prices(product_id);
CREATE INDEX IF NOT EXISTS idx_prices_store_id ON public.prices(store_id);
CREATE INDEX IF NOT EXISTS idx_prices_best_deal ON public.prices(is_best_deal) WHERE is_best_deal = true;

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON public.blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(published) WHERE published = true;
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON public.blog_posts(featured) WHERE featured = true;

CREATE INDEX IF NOT EXISTS idx_user_deals_submitted_by ON public.user_deals(submitted_by);
CREATE INDEX IF NOT EXISTS idx_user_deals_approved ON public.user_deals(approved) WHERE approved = true;

CREATE INDEX IF NOT EXISTS idx_blog_comments_blog_post_id ON public.blog_comments(blog_post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_user_id ON public.blog_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_parent_id ON public.blog_comments(parent_id);

CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_product_id ON public.analytics_events(product_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER handle_updated_at_products
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_blog_posts
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (allow read for all, authenticated users can insert/update their own data)
-- Products: public read
CREATE POLICY "Products are viewable by everyone" ON public.products
  FOR SELECT USING (true);

-- Stores: public read
CREATE POLICY "Stores are viewable by everyone" ON public.stores
  FOR SELECT USING (true);

-- Prices: public read
CREATE POLICY "Prices are viewable by everyone" ON public.prices
  FOR SELECT USING (true);

-- Reviews: public read, authenticated users can insert/update their own
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Blog posts: public read published posts, authors can manage their own
CREATE POLICY "Published blog posts are viewable by everyone" ON public.blog_posts
  FOR SELECT USING (published = true);

CREATE POLICY "Authors can view their own unpublished posts" ON public.blog_posts
  FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Authors can insert their own blog posts" ON public.blog_posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own blog posts" ON public.blog_posts
  FOR UPDATE USING (auth.uid() = author_id);

-- User deals: public read approved, users can manage their own
CREATE POLICY "Approved user deals are viewable by everyone" ON public.user_deals
  FOR SELECT USING (approved = true);

CREATE POLICY "Users can view their own unapproved deals" ON public.user_deals
  FOR SELECT USING (auth.uid() = submitted_by);

CREATE POLICY "Users can insert their own deals" ON public.user_deals
  FOR INSERT WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Users can update their own deals" ON public.user_deals
  FOR UPDATE USING (auth.uid() = submitted_by);

-- Profiles: public read, users can update their own
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Blog comments: public read, authenticated users can insert/update their own
CREATE POLICY "Blog comments are viewable by everyone" ON public.blog_comments
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own comments" ON public.blog_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON public.blog_comments
  FOR UPDATE USING (auth.uid() = user_id);

-- Analytics: authenticated users can insert, admins can read
CREATE POLICY "Authenticated users can insert analytics" ON public.analytics_events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can view analytics" ON public.analytics_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'username', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
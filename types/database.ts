// ==========================================
// DealDino - Supabase Database Types
// These types map directly to Supabase tables
// ==========================================

// ---- PRODUCTS TABLE ----
// Stores all products (affiliate, direct, mixed)
export interface DBProduct {
  id: string;                    // uuid, primary key
  title: string;                 // Product name
  slug: string;                  // SEO-friendly URL slug (unique)
  description: string;           // Full product description
  image: string;                 // Product image URL
  category: string;              // Category: electronics, fashion, gadgets, etc.
  tags: string[];                // Array of tags for search
  product_type: 'affiliate' | 'direct' | 'mixed'; // How this product is sold
  is_trending: boolean;          // Marked as trending by admin
  is_hot: boolean;               // Marked as hot deal
  is_featured: boolean;          // Show on homepage
  is_sponsored: boolean;         // Paid promotion
  discount: number | null;       // Discount percentage
  rating: number;                // Average rating (calculated)
  review_count: number;          // Total reviews
  views: number;                 // Page view count (for trending score)
  clicks: number;                // Affiliate link clicks
  created_at: string;            // Timestamp
  updated_at: string;            // Last updated
}

// Insert type (without auto-generated fields)
export interface DBProductInsert {
  title: string;
  slug: string;
  description: string;
  image: string;
  category: string;
  tags?: string[];
  product_type: 'affiliate' | 'direct' | 'mixed';
  is_trending?: boolean;
  is_hot?: boolean;
  is_featured?: boolean;
  is_sponsored?: boolean;
  discount?: number | null;
  rating?: number;
  review_count?: number;
  views?: number;
  clicks?: number;
}

// Update type (all fields optional)
export type DBProductUpdate = Partial<DBProductInsert>;


// ---- STORES TABLE ----
// Marketplaces where products are sold (Amazon, Flipkart, etc.)
export interface DBStore {
  id: string;                    // uuid, primary key
  name: string;                  // e.g., "Amazon", "Flipkart", "Meesho"
  logo: string;                  // Store logo URL
  affiliate_base_url: string;    // Base affiliate URL for this store
  is_active: boolean;            // Whether store is currently active
  created_at: string;
}

export interface DBStoreInsert {
  name: string;
  logo?: string;
  affiliate_base_url?: string;
  is_active?: boolean;
}

export type DBStoreUpdate = Partial<DBStoreInsert>;


// ---- PRICES TABLE ----
// Price entries linking products to stores
// This is the core of the price comparison engine
export interface DBPrice {
  id: string;                    // uuid, primary key
  product_id: string;            // FK → products.id
  store_id: string;              // FK → stores.id
  price: number;                 // Current selling price (INR)
  original_price: number | null; // MRP / original price before discount
  affiliate_url: string;         // Full affiliate URL for this product+store
  is_best_deal: boolean;         // Marked as best deal
  last_checked: string;          // When price was last verified
  created_at: string;
}

export interface DBPriceInsert {
  product_id: string;
  store_id: string;
  price: number;
  original_price?: number | null;
  affiliate_url?: string;
  is_best_deal?: boolean;
  last_checked?: string;
}

export type DBPriceUpdate = Partial<DBPriceInsert>;


// ---- REVIEWS TABLE ----
// User reviews for products
export interface DBReview {
  id: string;                    // uuid, primary key
  product_id: string;            // FK → products.id
  user_id: string;               // FK → auth.users.id
  rating: number;                // 1-5 star rating
  title: string;                 // Review title
  content: string;               // Review body text
  pros: string[];                // List of pros
  cons: string[];                // List of cons
  helpful_count: number;         // How many found this helpful
  is_verified: boolean;          // Verified purchase
  created_at: string;
}

export interface DBReviewInsert {
  product_id: string;
  user_id: string;
  rating: number;
  title: string;
  content: string;
  pros?: string[];
  cons?: string[];
}

export type DBReviewUpdate = Partial<Omit<DBReviewInsert, 'product_id' | 'user_id'>>;


// ---- BLOG POSTS TABLE ----
// Community blog posts, reviews, top 10 lists
export interface DBBlogPost {
  id: string;                    // uuid, primary key
  title: string;                 // Post title
  slug: string;                  // SEO-friendly URL (unique)
  content: string;               // Markdown content
  excerpt: string;               // Short preview text
  cover_image: string;           // Cover image URL
  author_id: string;             // FK → profiles.id
  category: 'review' | 'top10' | 'comparison' | 'blog' | 'deal';
  tags: string[];                // Tags for search/filter
  likes: number;                 // Like count
  published: boolean;            // Whether post is visible
  is_approved: boolean;          // Admin approved
  featured: boolean;             // Show on homepage
  views: number;                 // View count
  created_at: string;
  updated_at: string;
}

export interface DBBlogPostInsert {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  author_id: string;
  category: 'review' | 'top10' | 'comparison' | 'blog' | 'deal';
  tags?: string[];
  published?: boolean;
}

export type DBBlogPostUpdate = Partial<Omit<DBBlogPostInsert, 'author_id'>>;


// ---- USER DEALS TABLE ----
// Deals submitted by community members
export interface DBUserDeal {
  id: string;                    // uuid, primary key
  title: string;                 // Deal title
  description: string;           // Deal description
  product_link: string;          // Link to the deal
  original_price: number | null; // Original price
  deal_price: number | null;     // Discounted price
  store_name: string;            // Which store (Amazon, Flipkart, etc.)
  coupon_code: string | null;    // Optional coupon code
  submitted_by: string;          // FK → profiles.id
  approved: boolean;             // Admin approved
  expires_at: string | null;     // Deal expiry date
  upvotes: number;               // Community upvotes
  created_at: string;
}

export interface DBUserDealInsert {
  title: string;
  description: string;
  product_link: string;
  original_price?: number | null;
  deal_price?: number | null;
  store_name?: string;
  coupon_code?: string | null;
  submitted_by: string;
  expires_at?: string | null;
}

export type DBUserDealUpdate = Partial<Omit<DBUserDealInsert, 'submitted_by'>>;


// ---- PROFILES TABLE ----
// User profiles (linked to Supabase Auth)
export interface DBProfile {
  id: string;                    // Same as auth.users.id
  username: string;              // Display name
  avatar: string;                // Avatar URL or emoji
  bio: string | null;            // Short bio
  role: 'user' | 'admin';       // User role
  blog_count: number;            // Number of blogs written
  review_count: number;          // Number of reviews
  reputation: number;            // Reputation score
  created_at: string;
  updated_at: string;
}

export interface DBProfileInsert {
  id: string;                    // Must match auth user id
  username: string;
  avatar?: string;
  bio?: string | null;
  role?: 'user' | 'admin';
}

export type DBProfileUpdate = Partial<Omit<DBProfileInsert, 'id'>>;


// ---- BLOG COMMENTS TABLE ----
// Comments on blog posts
export interface DBBlogComment {
  id: string;
  blog_post_id: string;          // FK → blog_posts.id
  user_id: string;               // FK → profiles.id
  content: string;
  likes: number;
  parent_id: string | null;      // For nested replies
  created_at: string;
}

export interface DBBlogCommentInsert {
  blog_post_id: string;
  user_id: string;
  content: string;
  parent_id?: string | null;
}


// ---- ANALYTICS TABLE ----
// Basic click/view tracking
export interface DBAnalyticsEvent {
  id: string;
  event_type: 'page_view' | 'product_click' | 'affiliate_click' | 'search' | 'add_to_cart';
  product_id: string | null;
  user_id: string | null;
  metadata: Record<string, string | number | boolean> | null;
  created_at: string;
}

export interface DBAnalyticsEventInsert {
  event_type: DBAnalyticsEvent['event_type'];
  product_id?: string | null;
  user_id?: string | null;
  metadata?: Record<string, string | number | boolean> | null;
}


// ---- PRICE COMPARISON RESULT ----
// Used when fetching prices with store info joined
export interface PriceWithStore extends DBPrice {
  store: DBStore;
}

// ---- PRODUCT WITH PRICES ----
// Full product view with all prices
export interface ProductWithPrices extends DBProduct {
  prices: PriceWithStore[];
  best_price: number;
  best_store: string;
}

// ---- BLOG POST WITH AUTHOR ----
// Blog post with author profile
export interface BlogPostWithAuthor extends DBBlogPost {
  author: DBProfile;
  comment_count: number;
}

// ---- API RESPONSE WRAPPER ----
// Standard response format for all API calls
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  count?: number;
}


// ---- AFFILIATE DEALS TABLE ----
// Affiliate deals for the hub
export interface DBAffiliateDeal {
  id: string;
  category: 'Web Hosting' | 'VPNs' | 'AI Tools';
  brand: string;
  logo_url: string;
  rating: number;
  features: string[];
  current_price: number;
  old_price: number;
  affiliate_link: string;
  created_at: string;
}

export interface DBAffiliateDealInsert {
  category: DBAffiliateDeal['category'];
  brand: string;
  logo_url: string;
  rating: number;
  features: string[];
  current_price: number;
  old_price: number;
  affiliate_link: string;
}

export type DBAffiliateDealUpdate = Partial<DBAffiliateDealInsert>;

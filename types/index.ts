// ==========================================
// Afflosaur - Type Definitions
// ==========================================

export type ProductType = 'affiliate' | 'direct' | 'mixed';
export type ProductCategory = 'electronics' | 'fashion' | 'home' | 'gadgets' | 'beauty' | 'fitness' | 'books' | 'prayagraj' | 'other';

export interface PriceEntry {
  platform: string;
  price: number;
  url: string;
  isBestDeal?: boolean;
}

export type ProductStatus = 'available' | 'out_of_stock' | 'coming_soon' | 'hidden';

export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  type: ProductType;
  category: ProductCategory;
  prices: PriceEntry[];
  myPrice?: number;
  affiliateUrl?: string;
  rating: number;
  reviewCount: number;
  isTrending: boolean;
  isHot: boolean;
  isFeatured: boolean;
  isSponsored: boolean;
  tags: string[];
  createdAt: string;
  discount?: number;
  status?: ProductStatus; // new field for availability/status
  isPrayagraj?: boolean; // Local Prayagraj product
  deliveryInfo?: string; // e.g. "Same day delivery in Prayagraj"
  // Local checkout fields (Prayagraj only)
  sellerName?: string;
  upiId?: string;
  qrImage?: string;
  whatsapp?: string;
}

export type SponsorStatus = 'active' | 'inactive' | 'scheduled';
export type SponsorTrigger = 'on_load' | 'on_scroll' | 'after_seconds' | 'exit_intent';

export interface SponsorBanner {
  id: string;
  title: string;
  description?: string;
  image: string;
  link: string;
  status: SponsorStatus;
  startAt?: string; // ISO date
  endAt?: string; // ISO date
}

export interface SponsorPopup {
  id: string;
  title: string;
  content: string;
  image?: string;
  ctaText?: string;
  link?: string;
  status: SponsorStatus;
  trigger: SponsorTrigger;
  triggerSeconds?: number;
  startAt?: string; // ISO date
  endAt?: string; // ISO date
}

export type AffiliateStatus = 'active' | 'inactive' | 'hidden';

export interface AffiliateLink {
  id: string;
  platform: string;
  link: string;
  commission: number;
  status: AffiliateStatus;
}

export interface AuditLog {
  id: string;
  actorEmail: string;
  action: string;
  entityType: string;
  entityId?: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  authorAvatar: string;
  category: 'review' | 'top10' | 'comparison' | 'blog' | 'deal';
  tags: string[];
  likes: number;
  comments: Comment[];
  isApproved: boolean;
  createdAt: string;
  image: string;
  productId?: string;
  isPremium?: boolean;
  views?: number;
  readTime?: string;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'admin';
  joinedAt: string;
  blogCount: number;
  reviewCount: number;
}

export type Page = 'home' | 'store' | 'trending' | 'blog' | 'notes' | 'product' | 'admin' | 'profile' | 'write' | 'blogpost' | 'deals' | 'setup' | 'cart' | 'about' | 'contact' | 'privacy' | 'terms' | 'affiliate-disclosure' | 'deal-alerts' | 'top10' | 'comparisons' | 'prayagraj' | 'search' | 'coins' | 'wallet' | 'missions' | 'giveaways' | 'leaderboard' | 'referral' | 'premium' | 'premium-section' | 'settings' | 'help' | 'auth';
export type Theme = 'light' | 'dark';

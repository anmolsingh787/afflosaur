import { supabase, isSupabaseConfigured } from './supabaseClient';
import type { SponsorBanner, SponsorPopup, AffiliateLink, AuditLog } from '../types';

type SponsorBannerRow = {
  id: string;
  title: string;
  description: string | null;
  image: string;
  link: string;
  status: string;
  start_at: string | null;
  end_at: string | null;
};

type SponsorPopupRow = {
  id: string;
  title: string;
  content: string;
  image: string | null;
  cta_text: string | null;
  link: string | null;
  status: string;
  trigger: string;
  trigger_seconds: number | null;
  start_at: string | null;
  end_at: string | null;
};

type AffiliateRow = {
  id: string;
  platform: string;
  link: string;
  commission: number;
  status: string;
};

type AuditLogRow = {
  id: string;
  actor_email: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  created_at: string;
};

const mapBannerRow = (row: SponsorBannerRow): SponsorBanner => ({
  id: row.id,
  title: row.title,
  description: row.description || undefined,
  image: row.image,
  link: row.link,
  status: row.status as SponsorBanner['status'],
  startAt: row.start_at || undefined,
  endAt: row.end_at || undefined,
});

const mapPopupRow = (row: SponsorPopupRow): SponsorPopup => ({
  id: row.id,
  title: row.title,
  content: row.content,
  image: row.image || undefined,
  ctaText: row.cta_text || undefined,
  link: row.link || undefined,
  status: row.status as SponsorPopup['status'],
  trigger: row.trigger as SponsorPopup['trigger'],
  triggerSeconds: row.trigger_seconds || undefined,
  startAt: row.start_at || undefined,
  endAt: row.end_at || undefined,
});

const mapAffiliateRow = (row: AffiliateRow): AffiliateLink => ({
  id: row.id,
  platform: row.platform,
  link: row.link,
  commission: row.commission,
  status: row.status as AffiliateLink['status'],
});

const mapAuditRow = (row: AuditLogRow): AuditLog => ({
  id: row.id,
  actorEmail: row.actor_email,
  action: row.action,
  entityType: row.entity_type,
  entityId: row.entity_id || undefined,
  createdAt: row.created_at,
});

export async function fetchSponsorBanners(): Promise<SponsorBanner[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('sponsor_banners')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return [];
  return (data as SponsorBannerRow[]).map(mapBannerRow);
}

export async function fetchSponsorPopups(): Promise<SponsorPopup[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('sponsor_popups')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return [];
  return (data as SponsorPopupRow[]).map(mapPopupRow);
}

export async function upsertSponsorBanner(banner: SponsorBanner): Promise<void> {
  const payload = {
    id: banner.id,
    title: banner.title,
    description: banner.description || null,
    image: banner.image,
    link: banner.link,
    status: banner.status,
    start_at: banner.startAt || null,
    end_at: banner.endAt || null,
  };
  const { error } = await supabase.from('sponsor_banners').upsert(payload);
  if (error) throw error;
}

export async function upsertSponsorPopup(popup: SponsorPopup): Promise<void> {
  const payload = {
    id: popup.id,
    title: popup.title,
    content: popup.content,
    image: popup.image || null,
    cta_text: popup.ctaText || null,
    link: popup.link || null,
    status: popup.status,
    trigger: popup.trigger,
    trigger_seconds: popup.triggerSeconds || null,
    start_at: popup.startAt || null,
    end_at: popup.endAt || null,
  };
  const { error } = await supabase.from('sponsor_popups').upsert(payload);
  if (error) throw error;
}

export async function fetchAffiliates(): Promise<AffiliateLink[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('affiliate_links')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return [];
  return (data as AffiliateRow[]).map(mapAffiliateRow);
}

export async function upsertAffiliate(affiliate: AffiliateLink): Promise<void> {
  const payload = {
    id: affiliate.id,
    platform: affiliate.platform,
    link: affiliate.link,
    commission: affiliate.commission,
    status: affiliate.status,
  };
  const { error } = await supabase.from('affiliate_links').upsert(payload);
  if (error) throw error;
}

export async function fetchAuditLogs(): Promise<AuditLog[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) return [];
  return (data as AuditLogRow[]).map(mapAuditRow);
}

// ----- Products -----

type ProductRow = {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  category: string;
  tags: string[];
  product_type: string;
  status: string;
  is_trending: boolean;
  is_hot: boolean;
  is_featured: boolean;
  is_sponsored: boolean;
  discount: number | null;
  rating: number;
  review_count: number;
  views: number;
  clicks: number;
  created_at: string;
  updated_at: string;
};

const mapProductRow = (r: ProductRow): any => ({
  id: r.id,
  title: r.title,
  description: r.description,
  image: r.image,
  category: r.category,
  tags: r.tags,
  type: r.product_type as any,
  status: r.status as any,
  isTrending: r.is_trending,
  isHot: r.is_hot,
  isFeatured: r.is_featured,
  isSponsored: r.is_sponsored,
  discount: r.discount || undefined,
  rating: r.rating,
  reviewCount: r.review_count,
  views: r.views,
  clicks: r.clicks,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

export async function fetchProducts(): Promise<any[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  if (error) return [];
  return (data as ProductRow[]).map(mapProductRow);
}

export async function upsertProduct(product: any): Promise<void> {
  const payload: Partial<ProductRow> = {
    id: product.id,
    title: product.title,
    slug: product.slug,
    description: product.description,
    image: product.image,
    category: product.category,
    tags: product.tags,
    product_type: product.type,
    status: product.status,
    is_trending: product.isTrending,
    is_hot: product.isHot,
    is_featured: product.isFeatured,
    is_sponsored: product.isSponsored,
    discount: product.discount || null,
    rating: product.rating,
    review_count: product.reviewCount,
    views: product.views,
    clicks: product.clicks,
  };
  const { error } = await supabase.from('products').upsert(payload);
  if (error) throw error;
}

// ----- Blog posts -----

type BlogRow = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string;
  author_id: string;
  category: string;
  tags: string[];
  likes: number;
  published: boolean;
  is_approved: boolean;
  featured: boolean;
  views: number;
  created_at: string;
  updated_at: string;
};

export async function fetchBlogPosts(): Promise<BlogRow[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
  if (error) return [];
  return data as BlogRow[];
}

export async function upsertBlogPost(post: Partial<BlogRow>): Promise<void> {
  const { error } = await supabase.from('blog_posts').upsert(post);
  if (error) throw error;
}

// ----- Coins -----

type CoinRow = { user_id: string; balance: number; updated_at: string };
export async function fetchCoinUsers(): Promise<CoinRow[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.from('user_coins').select('*');
  if (error) return [];
  return data as CoinRow[];
}

export async function updateCoinUser(userId: string, balance: number): Promise<void> {
  const { error } = await supabase.from('user_coins').upsert({ user_id: userId, balance });
  if (error) throw error;
}

export async function deleteProduct(productId: string): Promise<void> {
  const { error } = await supabase.from('products').delete().match({ id: productId });
  if (error) throw error;
}

export async function deleteBlogPost(postId: string): Promise<void> {
  const { error } = await supabase.from('blog_posts').delete().match({ id: postId });
  if (error) throw error;
}

export async function deleteCoinUser(userId: string): Promise<void> {
  const { error } = await supabase.from('user_coins').delete().match({ user_id: userId });
  if (error) throw error;
}

export async function createAuditLog(log: Omit<AuditLog, 'id' | 'createdAt'>): Promise<void> {
  const payload = {
    actor_email: log.actorEmail,
    action: log.action,
    entity_type: log.entityType,
    entity_id: log.entityId || null,
  };
  const { error } = await supabase.from('audit_logs').insert(payload);
  if (error) throw error;
}

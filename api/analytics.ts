// ==========================================
// DealDino - Analytics API
// Basic event tracking for clicks, views, etc.
// ==========================================

import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import type { DBAnalyticsEventInsert } from '../types/database';

// ---- TRACK EVENT ----
// Logs an analytics event to the database
// This is fire-and-forget — errors are silently ignored
export async function trackEvent(event: DBAnalyticsEventInsert): Promise<void> {
  if (!isSupabaseConfigured) return;

  try {
    await supabase
      .from('analytics_events')
      .insert(event);
  } catch {
    // Silently fail — analytics should never break the app
    console.warn('Analytics event failed');
  }
}

// ---- TRACK PAGE VIEW ----
export async function trackPageView(pageUrl: string, userId?: string): Promise<void> {
  await trackEvent({
    event_type: 'page_view',
    user_id: userId || null,
    metadata: { page: pageUrl },
  });
}

// ---- TRACK PRODUCT CLICK ----
export async function trackProductClick(productId: string, userId?: string): Promise<void> {
  await trackEvent({
    event_type: 'product_click',
    product_id: productId,
    user_id: userId || null,
  });
}

// ---- TRACK AFFILIATE CLICK ----
// Call this when user clicks an affiliate link (Amazon, Flipkart, etc.)
export async function trackAffiliateClick(
  productId: string,
  storeName: string,
  userId?: string
): Promise<void> {
  await trackEvent({
    event_type: 'affiliate_click',
    product_id: productId,
    user_id: userId || null,
    metadata: { store: storeName },
  });
}

// ---- TRACK SEARCH ----
export async function trackSearch(query: string, userId?: string): Promise<void> {
  await trackEvent({
    event_type: 'search',
    user_id: userId || null,
    metadata: { query },
  });
}

// ---- TRACK ADD TO CART ----
export async function trackAddToCart(productId: string, userId?: string): Promise<void> {
  await trackEvent({
    event_type: 'add_to_cart',
    product_id: productId,
    user_id: userId || null,
  });
}

// ==========================================
// ADMIN ANALYTICS QUERIES
// ==========================================

// ---- GET EVENT COUNTS (for admin dashboard) ----
export async function getEventCounts(
  eventType: string,
  days = 7
): Promise<{ count: number; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { count: 0, error: 'Supabase not configured' };
  }

  try {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const { count, error } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', eventType)
      .gte('created_at', since.toISOString());

    if (error) return { count: 0, error: error.message };
    return { count: count ?? 0, error: null };
  } catch (err) {
    return { count: 0, error: `Failed: ${err}` };
  }
}

// ---- GET TOP CLICKED PRODUCTS ----
export async function getTopClickedProducts(
  limit = 10,
  days = 7
): Promise<{ data: { product_id: string; clicks: number }[]; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { data: [], error: 'Supabase not configured' };
  }

  try {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const { data, error } = await supabase
      .from('analytics_events')
      .select('product_id')
      .eq('event_type', 'affiliate_click')
      .not('product_id', 'is', null)
      .gte('created_at', since.toISOString());

    if (error) return { data: [], error: error.message };

    // Count clicks per product
    const clickCounts: Record<string, number> = {};
    (data || []).forEach((row: { product_id: string | null }) => {
      if (row.product_id) {
        clickCounts[row.product_id] = (clickCounts[row.product_id] || 0) + 1;
      }
    });

    const sorted = Object.entries(clickCounts)
      .map(([product_id, clicks]) => ({ product_id, clicks }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, limit);

    return { data: sorted, error: null };
  } catch (err) {
    return { data: [], error: `Failed: ${err}` };
  }
}

// ---- GET TOP SEARCHES ----
export async function getTopSearches(
  limit = 10,
  days = 7
): Promise<{ data: { query: string; count: number }[]; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { data: [], error: 'Supabase not configured' };
  }

  try {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const { data, error } = await supabase
      .from('analytics_events')
      .select('metadata')
      .eq('event_type', 'search')
      .gte('created_at', since.toISOString());

    if (error) return { data: [], error: error.message };

    // Count search queries
    const queryCounts: Record<string, number> = {};
    (data || []).forEach((row: { metadata: Record<string, unknown> | null }) => {
      const query = (row.metadata?.query as string) || '';
      if (query) {
        queryCounts[query] = (queryCounts[query] || 0) + 1;
      }
    });

    const sorted = Object.entries(queryCounts)
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    return { data: sorted, error: null };
  } catch (err) {
    return { data: [], error: `Failed: ${err}` };
  }
}

// ==========================================
// DealDino - Products API
// CRUD operations for products
// Falls back to mock data if Supabase is not configured
// ==========================================

import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import type { DBProduct, DBProductInsert, DBProductUpdate, ApiResponse } from '../types/database';

// ---- GET ALL PRODUCTS ----
// Fetches all products with optional limit
export async function getAllProducts(limit = 50): Promise<ApiResponse<DBProduct[]>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured — using mock data', count: 0 };
  }

  try {
    const { data, error, count } = await supabase
      .from('products')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) return { data: null, error: error.message };
    return { data: data as DBProduct[], error: null, count: count ?? 0 };
  } catch (err) {
    return { data: null, error: `Failed to fetch products: ${err}` };
  }
}

// ---- GET PRODUCT BY SLUG ----
// Fetches a single product by its URL-friendly slug
export async function getProductBySlug(slug: string): Promise<ApiResponse<DBProduct>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as DBProduct, error: null };
  } catch (err) {
    return { data: null, error: `Failed to fetch product: ${err}` };
  }
}

// ---- GET PRODUCT BY ID ----
export async function getProductById(id: string): Promise<ApiResponse<DBProduct>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as DBProduct, error: null };
  } catch (err) {
    return { data: null, error: `Failed to fetch product: ${err}` };
  }
}

// ---- GET TRENDING PRODUCTS ----
// Fetches products marked as trending, sorted by views + clicks
export async function getTrendingProducts(limit = 20): Promise<ApiResponse<DBProduct[]>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_trending', true)
      .order('views', { ascending: false })
      .limit(limit);

    if (error) return { data: null, error: error.message };
    return { data: data as DBProduct[], error: null };
  } catch (err) {
    return { data: null, error: `Failed to fetch trending: ${err}` };
  }
}

// ---- GET HOT PRODUCTS ----
export async function getHotProducts(limit = 20): Promise<ApiResponse<DBProduct[]>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_hot', true)
      .order('clicks', { ascending: false })
      .limit(limit);

    if (error) return { data: null, error: error.message };
    return { data: data as DBProduct[], error: null };
  } catch (err) {
    return { data: null, error: `Failed to fetch hot products: ${err}` };
  }
}

// ---- GET FEATURED PRODUCTS ----
export async function getFeaturedProducts(limit = 10): Promise<ApiResponse<DBProduct[]>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) return { data: null, error: error.message };
    return { data: data as DBProduct[], error: null };
  } catch (err) {
    return { data: null, error: `Failed to fetch featured: ${err}` };
  }
}

// ---- GET PRODUCTS BY CATEGORY ----
export async function getProductsByCategory(
  category: string,
  limit = 50
): Promise<ApiResponse<DBProduct[]>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) return { data: null, error: error.message };
    return { data: data as DBProduct[], error: null };
  } catch (err) {
    return { data: null, error: `Failed to fetch by category: ${err}` };
  }
}

// ---- SEARCH PRODUCTS ----
// Full-text search across title, description, and tags
export async function searchProducts(query: string, limit = 20): Promise<ApiResponse<DBProduct[]>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('views', { ascending: false })
      .limit(limit);

    if (error) return { data: null, error: error.message };
    return { data: data as DBProduct[], error: null };
  } catch (err) {
    return { data: null, error: `Search failed: ${err}` };
  }
}

// ---- CREATE PRODUCT (Admin only) ----
export async function createProduct(product: DBProductInsert): Promise<ApiResponse<DBProduct>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as DBProduct, error: null };
  } catch (err) {
    return { data: null, error: `Failed to create product: ${err}` };
  }
}

// ---- UPDATE PRODUCT (Admin only) ----
export async function updateProduct(
  id: string,
  updates: DBProductUpdate
): Promise<ApiResponse<DBProduct>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as DBProduct, error: null };
  } catch (err) {
    return { data: null, error: `Failed to update product: ${err}` };
  }
}

// ---- DELETE PRODUCT (Admin only) ----
export async function deleteProduct(id: string): Promise<ApiResponse<null>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) return { data: null, error: error.message };
    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: `Failed to delete product: ${err}` };
  }
}

// ---- TOGGLE TRENDING (Admin) ----
export async function toggleProductTrending(id: string, isTrending: boolean): Promise<ApiResponse<DBProduct>> {
  return updateProduct(id, { is_trending: isTrending });
}

// ---- TOGGLE FEATURED (Admin) ----
export async function toggleProductFeatured(id: string, isFeatured: boolean): Promise<ApiResponse<DBProduct>> {
  return updateProduct(id, { is_featured: isFeatured });
}

// ---- INCREMENT VIEW COUNT ----
// Call this when a product page is viewed
export async function incrementProductViews(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;

  try {
    // Use RPC or raw increment
    await supabase.rpc('increment_product_views', { product_id: id });
  } catch {
    // Silently fail — analytics shouldn't break the app
    console.warn('Failed to increment views');
  }
}

// ---- INCREMENT CLICK COUNT ----
// Call this when an affiliate link is clicked
export async function incrementProductClicks(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;

  try {
    await supabase.rpc('increment_product_clicks', { product_id: id });
  } catch {
    console.warn('Failed to increment clicks');
  }
}

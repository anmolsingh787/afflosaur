// ==========================================
// DealDino - Price Comparison API
// Core of the price comparison engine
// Fetches & manages prices across multiple stores
// ==========================================

import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import type {
  DBPrice,
  DBPriceInsert,
  DBPriceUpdate,
  DBStore,
  DBStoreInsert,
  PriceWithStore,
  ApiResponse,
} from '../types/database';

// ==========================================
// PRICE FUNCTIONS
// ==========================================

// ---- GET PRICES FOR A PRODUCT ----
// Returns all prices for a product, sorted cheapest first
// Joins with stores table to get store name and logo
export async function getPricesForProduct(
  productId: string
): Promise<ApiResponse<PriceWithStore[]>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('prices')
      .select(`
        *,
        store:stores(*)
      `)
      .eq('product_id', productId)
      .order('price', { ascending: true }); // Cheapest first!

    if (error) return { data: null, error: error.message };

    // Transform the nested store data
    const prices = (data || []).map((row: Record<string, unknown>) => ({
      ...row,
      store: row.store as DBStore,
    })) as PriceWithStore[];

    return { data: prices, error: null };
  } catch (err) {
    return { data: null, error: `Failed to fetch prices: ${err}` };
  }
}

// ---- GET BEST PRICE FOR A PRODUCT ----
// Returns just the cheapest price entry
export async function getBestPrice(
  productId: string
): Promise<ApiResponse<PriceWithStore>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('prices')
      .select(`
        *,
        store:stores(*)
      `)
      .eq('product_id', productId)
      .order('price', { ascending: true })
      .limit(1)
      .single();

    if (error) return { data: null, error: error.message };

    return {
      data: { ...data, store: data.store as DBStore } as PriceWithStore,
      error: null,
    };
  } catch (err) {
    return { data: null, error: `Failed to fetch best price: ${err}` };
  }
}

// ---- ADD PRICE ENTRY (Admin only) ----
export async function addPrice(price: DBPriceInsert): Promise<ApiResponse<DBPrice>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('prices')
      .insert(price)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as DBPrice, error: null };
  } catch (err) {
    return { data: null, error: `Failed to add price: ${err}` };
  }
}

// ---- UPDATE PRICE ENTRY (Admin only) ----
export async function updatePrice(
  id: string,
  updates: DBPriceUpdate
): Promise<ApiResponse<DBPrice>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('prices')
      .update({ ...updates, last_checked: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as DBPrice, error: null };
  } catch (err) {
    return { data: null, error: `Failed to update price: ${err}` };
  }
}

// ---- DELETE PRICE ENTRY (Admin only) ----
export async function deletePrice(id: string): Promise<ApiResponse<null>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { error } = await supabase
      .from('prices')
      .delete()
      .eq('id', id);

    if (error) return { data: null, error: error.message };
    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: `Failed to delete price: ${err}` };
  }
}

// ---- MARK BEST DEAL ----
// Automatically marks the cheapest price as "best deal" for a product
export async function markBestDeal(productId: string): Promise<ApiResponse<null>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    // First, unmark all prices for this product
    await supabase
      .from('prices')
      .update({ is_best_deal: false })
      .eq('product_id', productId);

    // Then, mark the cheapest one
    const { data: cheapest } = await supabase
      .from('prices')
      .select('id')
      .eq('product_id', productId)
      .order('price', { ascending: true })
      .limit(1)
      .single();

    if (cheapest) {
      await supabase
        .from('prices')
        .update({ is_best_deal: true })
        .eq('id', cheapest.id);
    }

    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: `Failed to mark best deal: ${err}` };
  }
}

// ---- BULK UPDATE PRICES ----
// For future auto-update feature (scraper/API)
export async function bulkUpdatePrices(
  updates: { id: string; price: number; original_price?: number }[]
): Promise<ApiResponse<null>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const now = new Date().toISOString();
    for (const update of updates) {
      await supabase
        .from('prices')
        .update({
          price: update.price,
          original_price: update.original_price,
          last_checked: now,
        })
        .eq('id', update.id);
    }
    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: `Bulk update failed: ${err}` };
  }
}


// ==========================================
// STORE FUNCTIONS
// ==========================================

// ---- GET ALL STORES ----
export async function getAllStores(): Promise<ApiResponse<DBStore[]>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) return { data: null, error: error.message };
    return { data: data as DBStore[], error: null };
  } catch (err) {
    return { data: null, error: `Failed to fetch stores: ${err}` };
  }
}

// ---- ADD STORE (Admin only) ----
export async function addStore(store: DBStoreInsert): Promise<ApiResponse<DBStore>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('stores')
      .insert(store)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as DBStore, error: null };
  } catch (err) {
    return { data: null, error: `Failed to add store: ${err}` };
  }
}

// ---- UPDATE STORE (Admin only) ----
export async function updateStore(
  id: string,
  updates: Partial<DBStoreInsert>
): Promise<ApiResponse<DBStore>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('stores')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as DBStore, error: null };
  } catch (err) {
    return { data: null, error: `Failed to update store: ${err}` };
  }
}

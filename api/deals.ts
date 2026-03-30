// ==========================================
// DealDino - User Deals API
// Community-submitted deals
// Admin approval required before publishing
// ==========================================

import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import type {
  DBUserDeal,
  DBUserDealInsert,
  DBUserDealUpdate,
  ApiResponse,
} from '../types/database';

// ---- GET APPROVED DEALS ----
// Public view — only approved deals are shown
export async function getApprovedDeals(
  limit = 20,
  offset = 0
): Promise<ApiResponse<DBUserDeal[]>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error, count } = await supabase
      .from('user_deals')
      .select('*', { count: 'exact' })
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) return { data: null, error: error.message };
    return { data: data as DBUserDeal[], error: null, count: count ?? 0 };
  } catch (err) {
    return { data: null, error: `Failed to fetch deals: ${err}` };
  }
}

// ---- GET ACTIVE DEALS (not expired) ----
export async function getActiveDeals(limit = 20): Promise<ApiResponse<DBUserDeal[]>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('user_deals')
      .select('*')
      .eq('approved', true)
      .or(`expires_at.is.null,expires_at.gt.${now}`)
      .order('upvotes', { ascending: false })
      .limit(limit);

    if (error) return { data: null, error: error.message };
    return { data: data as DBUserDeal[], error: null };
  } catch (err) {
    return { data: null, error: `Failed to fetch active deals: ${err}` };
  }
}

// ---- GET DEAL BY ID ----
export async function getDealById(id: string): Promise<ApiResponse<DBUserDeal>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('user_deals')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as DBUserDeal, error: null };
  } catch (err) {
    return { data: null, error: `Failed to fetch deal: ${err}` };
  }
}

// ---- SUBMIT A DEAL ----
// Auth required. Needs admin approval
export async function submitDeal(deal: DBUserDealInsert): Promise<ApiResponse<DBUserDeal>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('user_deals')
      .insert({
        ...deal,
        approved: false,  // Needs admin approval
        upvotes: 0,
      })
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as DBUserDeal, error: null };
  } catch (err) {
    return { data: null, error: `Failed to submit deal: ${err}` };
  }
}

// ---- UPDATE DEAL ----
// User can update their own deal (before approval)
export async function updateDeal(
  id: string,
  updates: DBUserDealUpdate
): Promise<ApiResponse<DBUserDeal>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('user_deals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as DBUserDeal, error: null };
  } catch (err) {
    return { data: null, error: `Failed to update deal: ${err}` };
  }
}

// ---- DELETE DEAL ----
export async function deleteDeal(id: string): Promise<ApiResponse<null>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { error } = await supabase
      .from('deals')
      .delete()
      .eq('id', id);

    if (error) return { data: null, error: error.message };
    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: `Failed to delete deal: ${err}` };
  }
}

// ---- UPVOTE A DEAL ----
export async function upvoteDeal(id: string): Promise<ApiResponse<null>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    await supabase.rpc('increment_deal_upvotes', { deal_id: id });
    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: `Failed to upvote: ${err}` };
  }
}

// ---- APPROVE DEAL (Admin only) ----
export async function approveDeal(
  id: string,
  approved: boolean
): Promise<ApiResponse<DBUserDeal>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('user_deals')
      .update({ approved })
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as DBUserDeal, error: null };
  } catch (err) {
    return { data: null, error: `Failed to approve deal: ${err}` };
  }
}

// ---- GET PENDING DEALS (Admin only) ----
export async function getPendingDeals(): Promise<ApiResponse<DBUserDeal[]>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('user_deals')
      .select('*')
      .eq('approved', false)
      .order('created_at', { ascending: false });

    if (error) return { data: null, error: error.message };
    return { data: data as DBUserDeal[], error: null };
  } catch (err) {
    return { data: null, error: `Failed to fetch pending deals: ${err}` };
  }
}

// ---- GET USER'S SUBMITTED DEALS ----
export async function getUserDeals(
  userId: string,
  limit = 20
): Promise<ApiResponse<DBUserDeal[]>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('user_deals')
      .select('*')
      .eq('submitted_by', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) return { data: null, error: error.message };
    return { data: data as DBUserDeal[], error: null };
  } catch (err) {
    return { data: null, error: `Failed to fetch user deals: ${err}` };
  }
}

// ---- GET DEALS BY STORE ----
export async function getDealsByStore(
  storeName: string,
  limit = 20
): Promise<ApiResponse<DBUserDeal[]>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('user_deals')
      .select('*')
      .eq('store_name', storeName)
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) return { data: null, error: error.message };
    return { data: data as DBUserDeal[], error: null };
  } catch (err) {
    return { data: null, error: `Failed to fetch deals by store: ${err}` };
  }
}

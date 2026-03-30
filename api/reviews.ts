// ==========================================
// DealDino - Reviews API
// User reviews for products
// Includes rating calculation
// ==========================================

import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import type { DBReview, DBReviewInsert, DBReviewUpdate, ApiResponse } from '../types/database';
import { calculateAverageRating } from '../lib/helpers';

// ---- GET REVIEWS FOR A PRODUCT ----
// Returns all reviews for a product, newest first
export async function getReviews(
  productId: string,
  limit = 50
): Promise<ApiResponse<DBReview[]>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error, count } = await supabase
      .from('reviews')
      .select('*', { count: 'exact' })
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) return { data: null, error: error.message };
    return { data: data as DBReview[], error: null, count: count ?? 0 };
  } catch (err) {
    return { data: null, error: `Failed to fetch reviews: ${err}` };
  }
}

// ---- GET AVERAGE RATING FOR A PRODUCT ----
// Calculates the average rating from all reviews
export async function getAverageRating(
  productId: string
): Promise<{ average: number; count: number; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { average: 0, count: 0, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', productId);

    if (error) return { average: 0, count: 0, error: error.message };

    const ratings = (data || []).map((r: { rating: number }) => r.rating);
    return {
      average: calculateAverageRating(ratings),
      count: ratings.length,
      error: null,
    };
  } catch (err) {
    return { average: 0, count: 0, error: `Failed to calculate rating: ${err}` };
  }
}

// ---- GET RATING DISTRIBUTION ----
// Returns count of each star rating (for bar chart)
export async function getRatingDistribution(
  productId: string
): Promise<{ distribution: Record<number, number>; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', productId);

    if (error) return { distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, error: error.message };

    const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    (data || []).forEach((r: { rating: number }) => {
      if (dist[r.rating] !== undefined) {
        dist[r.rating]++;
      }
    });

    return { distribution: dist, error: null };
  } catch (err) {
    return {
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      error: `Failed to get distribution: ${err}`,
    };
  }
}

// ---- ADD REVIEW ----
// Adds a new review (auth required)
// Also updates the product's average rating
export async function addReview(review: DBReviewInsert): Promise<ApiResponse<DBReview>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    // 1. Check if user already reviewed this product
    const { data: existing } = await supabase
      .from('reviews')
      .select('id')
      .eq('product_id', review.product_id)
      .eq('user_id', review.user_id)
      .single();

    if (existing) {
      return { data: null, error: 'You have already reviewed this product' };
    }

    // 2. Insert the review
    const { data, error } = await supabase
      .from('reviews')
      .insert(review)
      .select()
      .single();

    if (error) return { data: null, error: error.message };

    // 3. Update product's average rating and review count
    await updateProductRating(review.product_id);

    // 4. Increment user's review count
    await supabase.rpc('increment_user_review_count', { uid: review.user_id });

    return { data: data as DBReview, error: null };
  } catch (err) {
    return { data: null, error: `Failed to add review: ${err}` };
  }
}

// ---- UPDATE REVIEW ----
// User can edit their own review
export async function updateReview(
  id: string,
  updates: DBReviewUpdate
): Promise<ApiResponse<DBReview>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('reviews')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };

    // Update product rating after edit
    if (data) {
      await updateProductRating((data as DBReview).product_id);
    }

    return { data: data as DBReview, error: null };
  } catch (err) {
    return { data: null, error: `Failed to update review: ${err}` };
  }
}

// ---- DELETE REVIEW ----
export async function deleteReview(id: string, productId: string): Promise<ApiResponse<null>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) return { data: null, error: error.message };

    // Update product rating after deletion
    await updateProductRating(productId);

    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: `Failed to delete review: ${err}` };
  }
}

// ---- MARK REVIEW AS HELPFUL ----
export async function markReviewHelpful(id: string): Promise<ApiResponse<null>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    // Increment helpful_count
    await supabase.rpc('increment_review_helpful', { review_id: id });
    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: `Failed: ${err}` };
  }
}

// ---- GET USER'S REVIEWS ----
// Fetches all reviews by a specific user
export async function getUserReviews(
  userId: string,
  limit = 20
): Promise<ApiResponse<DBReview[]>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) return { data: null, error: error.message };
    return { data: data as DBReview[], error: null };
  } catch (err) {
    return { data: null, error: `Failed to fetch user reviews: ${err}` };
  }
}

// ---- INTERNAL: Update product's average rating ----
// Called automatically after add/update/delete review
async function updateProductRating(productId: string): Promise<void> {
  try {
    const { data } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', productId);

    if (!data) return;

    const ratings = data.map((r: { rating: number }) => r.rating);
    const avg = calculateAverageRating(ratings);

    await supabase
      .from('products')
      .update({
        rating: avg,
        review_count: ratings.length,
      })
      .eq('id', productId);
  } catch {
    console.warn('Failed to update product rating');
  }
}

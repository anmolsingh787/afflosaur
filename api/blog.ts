// ==========================================
// DealDino - Blog API
// Community blog posts, reviews, top 10 lists
// Supports markdown content
// ==========================================

import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import type {
  DBBlogPost,
  DBBlogPostInsert,
  DBBlogPostUpdate,
  DBBlogComment,
  DBBlogCommentInsert,
  ApiResponse,
} from '../types/database';

// ==========================================
// BLOG POST FUNCTIONS
// ==========================================

// ---- GET PUBLISHED BLOG POSTS ----
// Returns approved, published posts (public view)
export async function getPublishedPosts(
  limit = 20,
  offset = 0
): Promise<ApiResponse<DBBlogPost[]>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error, count } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .eq('published', true)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) return { data: null, error: error.message };
    return { data: data as DBBlogPost[], error: null, count: count ?? 0 };
  } catch (err) {
    return { data: null, error: `Failed to fetch posts: ${err}` };
  }
}

// ---- GET BLOG POST BY SLUG ----
// SEO-friendly URL lookup
export async function getBlogBySlug(slug: string): Promise<ApiResponse<DBBlogPost>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .eq('is_approved', true)
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as DBBlogPost, error: null };
  } catch (err) {
    return { data: null, error: `Failed to fetch post: ${err}` };
  }
}

// ---- GET BLOG POST BY ID ----
export async function getBlogById(id: string): Promise<ApiResponse<DBBlogPost>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as DBBlogPost, error: null };
  } catch (err) {
    return { data: null, error: `Failed to fetch post: ${err}` };
  }
}

// ---- GET POSTS BY CATEGORY ----
export async function getPostsByCategory(
  category: string,
  limit = 20
): Promise<ApiResponse<DBBlogPost[]>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('category', category)
      .eq('published', true)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) return { data: null, error: error.message };
    return { data: data as DBBlogPost[], error: null };
  } catch (err) {
    return { data: null, error: `Failed to fetch by category: ${err}` };
  }
}

// ---- GET USER'S BLOG POSTS ----
// Returns ALL posts by a user (including unpublished/unapproved)
export async function getUserPosts(
  userId: string,
  limit = 20
): Promise<ApiResponse<DBBlogPost[]>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('author_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) return { data: null, error: error.message };
    return { data: data as DBBlogPost[], error: null };
  } catch (err) {
    return { data: null, error: `Failed to fetch user posts: ${err}` };
  }
}

// ---- GET FEATURED POSTS ----
export async function getFeaturedPosts(limit = 5): Promise<ApiResponse<DBBlogPost[]>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('featured', true)
      .eq('published', true)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) return { data: null, error: error.message };
    return { data: data as DBBlogPost[], error: null };
  } catch (err) {
    return { data: null, error: `Failed to fetch featured posts: ${err}` };
  }
}

// ---- SEARCH BLOG POSTS ----
export async function searchPosts(query: string, limit = 20): Promise<ApiResponse<DBBlogPost[]>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .eq('is_approved', true)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
      .order('views', { ascending: false })
      .limit(limit);

    if (error) return { data: null, error: error.message };
    return { data: data as DBBlogPost[], error: null };
  } catch (err) {
    return { data: null, error: `Search failed: ${err}` };
  }
}

// ---- CREATE BLOG POST ----
// Auth required. Posts start as unpublished, need admin approval
export async function createBlogPost(post: DBBlogPostInsert): Promise<ApiResponse<DBBlogPost>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        ...post,
        published: true,       // User wants to publish
        is_approved: false,    // Needs admin approval
        likes: 0,
        views: 0,
        featured: false,
      })
      .select()
      .single();

    if (error) return { data: null, error: error.message };

    // Increment user's blog count
    await supabase.rpc('increment_user_blog_count', { uid: post.author_id });

    return { data: data as DBBlogPost, error: null };
  } catch (err) {
    return { data: null, error: `Failed to create post: ${err}` };
  }
}

// ---- UPDATE BLOG POST ----
// Author can edit their own post
export async function updateBlogPost(
  id: string,
  updates: DBBlogPostUpdate
): Promise<ApiResponse<DBBlogPost>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as DBBlogPost, error: null };
  } catch (err) {
    return { data: null, error: `Failed to update post: ${err}` };
  }
}

// ---- DELETE BLOG POST ----
export async function deleteBlogPost(id: string): Promise<ApiResponse<null>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) return { data: null, error: error.message };
    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: `Failed to delete post: ${err}` };
  }
}

// ---- LIKE BLOG POST ----
export async function likeBlogPost(id: string): Promise<ApiResponse<null>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    await supabase.rpc('increment_blog_likes', { blog_id: id });
    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: `Failed to like: ${err}` };
  }
}

// ---- APPROVE BLOG POST (Admin only) ----
export async function approveBlogPost(
  id: string,
  approved: boolean
): Promise<ApiResponse<DBBlogPost>> {
  return updateBlogPost(id, { published: approved });
}

// ---- GET PENDING POSTS (Admin only) ----
// Posts awaiting approval
export async function getPendingPosts(): Promise<ApiResponse<DBBlogPost[]>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_approved', false)
      .order('created_at', { ascending: false });

    if (error) return { data: null, error: error.message };
    return { data: data as DBBlogPost[], error: null };
  } catch (err) {
    return { data: null, error: `Failed to fetch pending: ${err}` };
  }
}

// ---- INCREMENT VIEW COUNT ----
export async function incrementBlogViews(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;

  try {
    await supabase.rpc('increment_blog_views', { blog_id: id });
  } catch {
    console.warn('Failed to increment blog views');
  }
}


// ==========================================
// BLOG COMMENTS
// ==========================================

// ---- GET COMMENTS FOR A BLOG POST ----
export async function getComments(
  blogPostId: string,
  limit = 50
): Promise<ApiResponse<DBBlogComment[]>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('blog_comments')
      .select('*')
      .eq('blog_post_id', blogPostId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) return { data: null, error: error.message };
    return { data: data as DBBlogComment[], error: null };
  } catch (err) {
    return { data: null, error: `Failed to fetch comments: ${err}` };
  }
}

// ---- ADD COMMENT ----
export async function addComment(comment: DBBlogCommentInsert): Promise<ApiResponse<DBBlogComment>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('blog_comments')
      .insert(comment)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as DBBlogComment, error: null };
  } catch (err) {
    return { data: null, error: `Failed to add comment: ${err}` };
  }
}

// ---- DELETE COMMENT ----
export async function deleteComment(id: string): Promise<ApiResponse<null>> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { error } = await supabase
      .from('blog_comments')
      .delete()
      .eq('id', id);

    if (error) return { data: null, error: error.message };
    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: `Failed to delete comment: ${err}` };
  }
}

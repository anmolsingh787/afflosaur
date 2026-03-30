// ==========================================
// DealDino - Authentication API
// Handles login, signup, logout, and session
// Uses Supabase Auth (Email + Google)
// ==========================================

import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import type { DBProfile } from '../types/database';

// ---- SIGN UP WITH EMAIL ----
// Creates a new user account with email and password
export async function signUpWithEmail(email: string, password: string, username: string) {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env' };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: username, // This gets passed to the profile trigger
        },
      },
    });

    if (error) return { data: null, error: error.message };
    return { data: data.user, error: null };
  } catch (err) {
    return { data: null, error: `Signup failed: ${err}` };
  }
}

// ---- SIGN IN WITH EMAIL ----
// Logs in an existing user with email and password
export async function signInWithEmail(email: string, password: string) {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { data: null, error: error.message };
    return { data: data.user, error: null };
  } catch (err) {
    return { data: null, error: `Login failed: ${err}` };
  }
}

// ---- SIGN IN WITH GOOGLE ----
// Opens Google OAuth popup/redirect
export async function signInWithGoogle() {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin, // Redirect back after login
      },
    });

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err) {
    return { data: null, error: `Google login failed: ${err}` };
  }
}

// ---- SIGN OUT ----
export async function signOut() {
  if (!isSupabaseConfigured) {
    return { error: null };
  }

  try {
    const { error } = await supabase.auth.signOut();
    if (error) return { error: error.message };
    return { error: null };
  } catch (err) {
    return { error: `Logout failed: ${err}` };
  }
}

// ---- GET CURRENT USER ----
// Returns the currently logged-in user (from session)
export async function getCurrentUser() {
  if (!isSupabaseConfigured) return null;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

// ---- GET CURRENT SESSION ----
export async function getSession() {
  if (!isSupabaseConfigured) return null;

  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch {
    return null;
  }
}

// ---- GET USER PROFILE ----
// Fetches the profile row from the profiles table
export async function getUserProfile(userId: string): Promise<{ data: DBProfile | null; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as DBProfile, error: null };
  } catch (err) {
    return { data: null, error: `Failed to get profile: ${err}` };
  }
}

// ---- UPDATE USER PROFILE ----
export async function updateUserProfile(userId: string, updates: Partial<DBProfile>) {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as DBProfile, error: null };
  } catch (err) {
    return { data: null, error: `Failed to update profile: ${err}` };
  }
}

// ---- IS ADMIN CHECK ----
// Checks if a user has admin role in the profiles table
export async function isAdmin(userId: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error || !data) return false;
    return data.role === 'admin';
  } catch {
    return false;
  }
}

// ---- AUTH STATE LISTENER ----
// Subscribe to auth state changes (login, logout, token refresh)
// Usage: const unsubscribe = onAuthStateChange((event, session) => { ... })
export function onAuthStateChange(
  callback: (event: string, session: unknown) => void
) {
  if (!isSupabaseConfigured) return { unsubscribe: () => {} };

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      callback(event, session);
    }
  );

  return { unsubscribe: () => subscription.unsubscribe() };
}

// ---- RESET PASSWORD ----
export async function resetPassword(email: string) {
  if (!isSupabaseConfigured) {
    return { error: 'Supabase not configured' };
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) return { error: error.message };
    return { error: null };
  } catch (err) {
    return { error: `Reset failed: ${err}` };
  }
}

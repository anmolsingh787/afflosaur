// ==========================================
// Afflosaur - Search Hook (FIXED)
// Works with AppContext products + blog data
// ==========================================

import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import type { Product, BlogPost } from '../types';

// ---- Search products by query ----
export function useProductSearch(query: string, store?: string): Product[] {
  const { products } = useApp();

  return useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase().trim();

    return products.filter((p) => {
      // Match against title, description, category, tags, platform names
      const searchableText = [
        p.title,
        p.description,
        p.category,
        ...(p.tags || []),
        ...p.prices.map((pr) => pr.platform),
        p.type,
        p.isPrayagraj ? 'prayagraj local' : '',
      ]
        .join(' ')
        .toLowerCase();

      const matchesQuery = searchableText.includes(q);

      // Store filter
      const matchesStore =
        !store ||
        store === 'all' ||
        p.prices.some((pr) => pr.platform.toLowerCase() === store.toLowerCase());

      return matchesQuery && matchesStore;
    });
  }, [query, store, products]);
}

// ---- Search blogs by query ----
export function useBlogSearch(query: string): BlogPost[] {
  const { blogPosts } = useApp();

  return useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase().trim();

    return blogPosts.filter((b) => {
      const searchableText = [
        b.title,
        b.excerpt,
        b.author,
        b.category,
        ...(b.tags || []),
      ]
        .join(' ')
        .toLowerCase();

      return searchableText.includes(q);
    });
  }, [query, blogPosts]);
}

// ---- Combined search ----
export function useFullSearch(query: string, store?: string) {
  const productResults = useProductSearch(query, store);
  const blogResults = useBlogSearch(query);
  return { productResults, blogResults, total: productResults.length + blogResults.length };
}

// ---- Recent searches (localStorage) ----
const RECENT_KEY = 'afflosaur_recent_searches';

export function getRecentSearches(): string[] {
  try {
    const saved = localStorage.getItem(RECENT_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(query: string): void {
  if (!query.trim()) return;
  try {
    const recent = getRecentSearches();
    const filtered = recent.filter((s) => s.toLowerCase() !== query.toLowerCase());
    const updated = [query, ...filtered].slice(0, 8);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

export function clearRecentSearches(): void {
  try {
    localStorage.removeItem(RECENT_KEY);
  } catch {
    // ignore
  }
}

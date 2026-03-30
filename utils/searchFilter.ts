// ==========================================
// Afflosaur - Search Filter Utility
// Smart product filtering logic
// ==========================================

import type { Product } from '../types';

/**
 * Filter products by search query and store
 * Searches across title, description, tags, and category
 */
export function filterProducts(
  products: Product[],
  query: string,
  store: string = 'all'
): Product[] {
  const normalizedQuery = query.toLowerCase().trim();

  return products.filter(product => {
    // Match query across multiple fields
    const matchesQuery =
      !normalizedQuery ||
      product.title.toLowerCase().includes(normalizedQuery) ||
      product.description.toLowerCase().includes(normalizedQuery) ||
      product.tags.some(tag => tag.toLowerCase().includes(normalizedQuery)) ||
      product.category.toLowerCase().includes(normalizedQuery);

    // Match store filter
    const matchesStore =
      store === 'all' ||
      product.prices.some(p => p.platform.toLowerCase() === store.toLowerCase()) ||
      (store === 'afflosaur' && (product.type === 'direct' || product.type === 'mixed'));

    return matchesQuery && matchesStore;
  });
}

/**
 * Sort products by relevance to query
 */
export function sortByRelevance(products: Product[], query: string): Product[] {
  if (!query.trim()) return products;

  const normalizedQuery = query.toLowerCase().trim();

  return [...products].sort((a, b) => {
    // Title exact match gets highest priority
    const aTitle = a.title.toLowerCase().includes(normalizedQuery) ? 3 : 0;
    const bTitle = b.title.toLowerCase().includes(normalizedQuery) ? 3 : 0;

    // Tag match gets medium priority
    const aTags = a.tags.some(t => t.toLowerCase().includes(normalizedQuery)) ? 2 : 0;
    const bTags = b.tags.some(t => t.toLowerCase().includes(normalizedQuery)) ? 2 : 0;

    // Trending/featured gets small boost
    const aBoost = (a.isTrending ? 1 : 0) + (a.isFeatured ? 0.5 : 0);
    const bBoost = (b.isTrending ? 1 : 0) + (b.isFeatured ? 0.5 : 0);

    return (bTitle + bTags + bBoost) - (aTitle + aTags + aBoost);
  });
}

/**
 * Get search suggestions based on partial query
 */
export function getSearchSuggestions(
  products: Product[],
  query: string,
  limit: number = 5
): string[] {
  if (!query.trim() || query.length < 2) return [];

  const normalizedQuery = query.toLowerCase().trim();
  const suggestions = new Set<string>();

  for (const product of products) {
    if (suggestions.size >= limit) break;

    if (product.title.toLowerCase().includes(normalizedQuery)) {
      suggestions.add(product.title);
    }

    for (const tag of product.tags) {
      if (tag.toLowerCase().includes(normalizedQuery) && suggestions.size < limit) {
        suggestions.add(tag);
      }
    }
  }

  return Array.from(suggestions);
}

// Recent searches helpers
const RECENT_SEARCHES_KEY = 'afflosaur_recent_searches';
const MAX_RECENT = 8;

export function getRecentSearches(): string[] {
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(query: string): void {
  if (!query.trim()) return;
  try {
    const recent = getRecentSearches().filter(s => s !== query);
    recent.unshift(query);
    localStorage.setItem(
      RECENT_SEARCHES_KEY,
      JSON.stringify(recent.slice(0, MAX_RECENT))
    );
  } catch {
    // Silent fail
  }
}

export function clearRecentSearches(): void {
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch {
    // Silent fail
  }
}

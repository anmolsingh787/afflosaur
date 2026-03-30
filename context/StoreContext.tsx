/**
 * 🏬 StoreContext — Global Multi-Store Selector
 * 
 * Manages which store the user is browsing.
 * Persists selection in localStorage so it survives page reloads.
 * 
 * Usage:
 *   const { store, setStore, storeInfo, allStores } = useStore();
 */

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

// ── Store Types ──
export type StoreId = 'all' | 'amazon' | 'flipkart' | 'meesho' | 'myntra' | 'ajio' | 'afflosaur' | 'prayagraj';

export interface StoreInfo {
  id: StoreId;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  gradient: string;
  description: string;
}

// ── Store Definitions ──
export const STORE_LIST: StoreInfo[] = [
  {
    id: 'all',
    name: 'All Stores',
    icon: '🛍️',
    color: 'orange',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30',
    textColor: 'text-orange-600 dark:text-orange-400',
    borderColor: 'border-orange-200 dark:border-orange-800',
    gradient: 'from-orange-500 to-amber-500',
    description: 'Browse everything'
  },
  {
    id: 'amazon',
    name: 'Amazon',
    icon: '📦',
    color: 'yellow',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
    textColor: 'text-yellow-700 dark:text-yellow-400',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    gradient: 'from-yellow-500 to-orange-500',
    description: 'Best deals on Amazon India'
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    icon: '🛒',
    color: 'blue',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    textColor: 'text-blue-600 dark:text-blue-400',
    borderColor: 'border-blue-200 dark:border-blue-800',
    gradient: 'from-blue-500 to-indigo-500',
    description: 'Flipkart exclusive deals'
  },
  {
    id: 'meesho',
    name: 'Meesho',
    icon: '🟣',
    color: 'pink',
    bgColor: 'bg-pink-50 dark:bg-pink-950/30',
    textColor: 'text-pink-600 dark:text-pink-400',
    borderColor: 'border-pink-200 dark:border-pink-800',
    gradient: 'from-pink-500 to-purple-500',
    description: 'Budget friendly shopping'
  },
  {
    id: 'myntra',
    name: 'Myntra',
    icon: '👗',
    color: 'rose',
    bgColor: 'bg-rose-50 dark:bg-rose-950/30',
    textColor: 'text-rose-600 dark:text-rose-400',
    borderColor: 'border-rose-200 dark:border-rose-800',
    gradient: 'from-rose-500 to-pink-500',
    description: 'Fashion & lifestyle'
  },
  {
    id: 'ajio',
    name: 'Ajio',
    icon: '✨',
    color: 'purple',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    textColor: 'text-purple-600 dark:text-purple-400',
    borderColor: 'border-purple-200 dark:border-purple-800',
    gradient: 'from-purple-500 to-violet-500',
    description: 'Premium fashion deals'
  },
  {
    id: 'afflosaur',
    name: 'Afflosaur',
    icon: '🦕',
    color: 'emerald',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    gradient: 'from-emerald-500 to-teal-500',
    description: 'Our exclusive products'
  },
  {
    id: 'prayagraj',
    name: 'Prayagraj Local',
    icon: '📍',
    color: 'green',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
    textColor: 'text-green-600 dark:text-green-400',
    borderColor: 'border-green-200 dark:border-green-800',
    gradient: 'from-green-500 to-emerald-500',
    description: 'Local Prayagraj sellers'
  }
];

// ── Context ──
interface StoreContextType {
  store: StoreId;
  setStore: (s: StoreId) => void;
  storeInfo: StoreInfo;
  allStores: StoreInfo[];
  getStoreById: (id: StoreId) => StoreInfo;
}

const StoreContext = createContext<StoreContextType | null>(null);

// ── Provider ──
export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Load from localStorage
  const [store, setStoreState] = useState<StoreId>(() => {
    try {
      const saved = localStorage.getItem('afflosaur_store');
      if (saved && STORE_LIST.some(s => s.id === saved)) {
        return saved as StoreId;
      }
    } catch { /* ignore */ }
    return 'all';
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('afflosaur_store', store);
    } catch { /* ignore */ }
  }, [store]);

  const setStore = useCallback((s: StoreId) => {
    setStoreState(s);
  }, []);

  const storeInfo = useMemo(() => {
    return STORE_LIST.find(s => s.id === store) || STORE_LIST[0];
  }, [store]);

  const getStoreById = useCallback((id: StoreId): StoreInfo => {
    return STORE_LIST.find(s => s.id === id) || STORE_LIST[0];
  }, []);

  return (
    <StoreContext.Provider value={{ store, setStore, storeInfo, allStores: STORE_LIST, getStoreById }}>
      {children}
    </StoreContext.Provider>
  );
}

// ── Hook ──
export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

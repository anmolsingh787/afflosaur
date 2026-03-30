// ==========================================
// Afflosaur - Cart Context 🦕
// Manages shopping cart with localStorage persistence
// Supports both affiliate & direct products
// ==========================================

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

// ---- Cart Item Type ----
export interface CartItem {
  id: string;
  title: string;
  image: string;
  price: number;
  originalPrice?: number;
  store?: string;          // e.g., "Amazon", "Flipkart", "My Store"
  affiliateUrl?: string;   // If present → affiliate product
  quantity: number;
  discount?: number;       // percentage
  isLocal?: boolean;       // Local Prayagraj product flag
  sellerName?: string;
  upiId?: string;
  qrImage?: string;
  whatsapp?: string;
}

interface CartState {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  getTotalSavings: () => number;
  isInCart: (id: string) => boolean;
}

const CART_STORAGE_KEY = 'afflosaur_cart';

const CartContext = createContext<CartState | null>(null);

// ---- Load cart from localStorage ----
function loadCartFromStorage(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // If parse fails, return empty
  }
  return [];
}

// ---- Save cart to localStorage ----
function saveCartToStorage(items: CartItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Silently fail if storage is full
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCartFromStorage);

  // Auto-save to localStorage whenever items change
  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

  // Add item to cart (or increase quantity if exists)
  // Cart is ONLY for Prayagraj local deals
  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
    if (!item.isLocal) {
      return;
    }
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  // Remove item from cart completely
  const removeFromCart = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  // Update quantity (remove if 0)
  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => i.id !== id));
      return;
    }
    setItems(prev => prev.map(i =>
      i.id === id ? { ...i, quantity } : i
    ));
  }, []);

  // Clear entire cart
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Calculate total price
  const getTotalPrice = useCallback(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  // Get total number of items
  const getTotalItems = useCallback(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  // Calculate total savings (if originalPrice exists)
  const getTotalSavings = useCallback(() => {
    return items.reduce((sum, item) => {
      if (item.originalPrice && item.originalPrice > item.price) {
        return sum + (item.originalPrice - item.price) * item.quantity;
      }
      return sum;
    }, 0);
  }, [items]);

  // Check if item is in cart
  const isInCart = useCallback((id: string) => {
    return items.some(i => i.id === id);
  }, [items]);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalPrice,
      getTotalItems,
      getTotalSavings,
      isInCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

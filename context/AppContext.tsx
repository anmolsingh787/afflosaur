// ==========================================
// Afflosaur - Global App Context
// Manages theme, navigation, auth state, etc.
// =============================
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Page, Theme, Product, BlogPost, User, SponsorBanner, SponsorPopup } from '../types';
import { mockProducts, mockBlogPosts, mockUser, mockSponsorBanners, mockSponsorPopups } from '../data/mockData';
import { isAdminEmail } from '../config/adminAccess';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import { supabase } from '../lib/supabaseClient';
import { fetchSponsorBanners, fetchSponsorPopups, fetchProducts, fetchBlogPosts } from '../lib/adminApi';

interface AppState {
  // Navigation
  currentPage: Page;
  setPage: (page: Page) => void;
  
  // Theme
  theme: Theme;
  toggleTheme: () => void;
  
  // Auth
  isLoggedIn: boolean;
  user: User | null;
  login: () => void;
  logout: () => void;
  sessionExpiresAt?: number | null;
  
  // Data
  products: Product[];
  setProducts: (products: Product[]) => void;
  blogPosts: BlogPost[];
  setBlogPosts: (posts: BlogPost[]) => void;
  sponsorBanners: SponsorBanner[];
  setSponsorBanners: (banners: SponsorBanner[]) => void;
  sponsorPopups: SponsorPopup[];
  setSponsorPopups: (popups: SponsorPopup[]) => void;
  
  // Selected items
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedBlogId: string | null;
  setSelectedBlogId: (id: string | null) => void;
  
  // Dino assistant
  isDinoOpen: boolean;
  setDinoOpen: (open: boolean) => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  
  // Mobile menu
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  
  // Cart (simple)
  cartCount: number;
  addToCart: () => void;
  
  // Notifications
  notification: string | null;
  showNotification: (msg: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [theme, setTheme] = useState<Theme>('light');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [sessionExpiresAt, setSessionExpiresAt] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(mockBlogPosts);
  const [sponsorBanners, setSponsorBanners] = useState<SponsorBanner[]>(mockSponsorBanners);
  const [sponsorPopups, setSponsorPopups] = useState<SponsorPopup[]>(mockSponsorPopups);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [isDinoOpen, setDinoOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [notification, setNotification] = useState<string | null>(null);

  // Configuration constants — declared at the top to avoid Temporal Dead Zone errors
  const TWO_FA_REQUIRED = true;
  const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

  const setPage = useCallback((page: Page) => {
    const path = page === 'home' ? '/' : `/${page}`;
    navigate(path);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [navigate]);

  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'light' ? 'dark' : 'light');
  }, []);

  const showNotification = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const loadData = async () => {
      try {
        const [banners, popups, productsData, blogsData] = await Promise.all([
          fetchSponsorBanners(),
          fetchSponsorPopups(),
          fetchProducts(),
          fetchBlogPosts(),
        ]);
        if (banners.length > 0) setSponsorBanners(banners);
        if (popups.length > 0) setSponsorPopups(popups);
        if (productsData.length > 0) setProducts(productsData);
        if (blogsData.length > 0) {
          setBlogPosts(
            blogsData.map((r) => ({
              id: r.id,
              title: r.title,
              slug: r.slug,
              content: r.content,
              excerpt: r.excerpt,
              author: r.author_id,
              authorAvatar: '',
              category: r.category as any,
              tags: r.tags || [],
              likes: r.likes,
              comments: [],
              isApproved: r.is_approved,
              createdAt: r.created_at,
              image: r.cover_image,
              views: r.views || 0,
            }))
          );
        }
      } catch {
        // keep mock data fallback
      }
    };
    loadData();
  }, []);

  const logout = useCallback(async () => {
    setIsLoggedIn(false);
    setUser(null);
    setCurrentPage('home');
    setSessionExpiresAt(null);

    // Sign out from Supabase if configured
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }

    showNotification('Logged out successfully');
  }, [showNotification]);

  // Supabase auth state listener
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          // Fetch user profile with role
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            const userData: User = {
              id: profile.id,
              name: profile.username || session.user.email?.split('@')[0] || 'User',
              email: profile.email || session.user.email || '',
              avatar: `🦖`, // Could be extended to use profile avatar
              role: profile.role,
              joinedAt: profile.created_at,
              blogCount: 0, // Could be calculated from user_stats
              reviewCount: 0
            };

            setIsLoggedIn(true);
            setUser(userData);

            // Start session timer
            const expires = Date.now() + SESSION_DURATION;
            setSessionExpiresAt(expires);
            setTimeout(() => {
              if (Date.now() >= expires) {
                logout();
                showNotification('Session expired. Please log in again.');
              }
            }, SESSION_DURATION + 500);
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setUser(null);
        setSessionExpiresAt(null);
        setCurrentPage('home');
      }
    });

    return () => subscription.unsubscribe();
  }, [showNotification, logout, SESSION_DURATION]);

  // Sync currentPage with router location
  useEffect(() => {
    const path = location.pathname;
    const page = path === '/' ? 'home' : (path.slice(1) as Page);
    setCurrentPage(page);
  }, [location]);

  const login = useCallback(async (userData?: User) => {
    if (userData) {
      // Direct login with provided user data (from AuthPage)
      setIsLoggedIn(true);
      setUser(userData);
      // Start session timer
      const expires = Date.now() + SESSION_DURATION;
      setSessionExpiresAt(expires);
      setTimeout(() => {
        if (Date.now() >= expires) {
          logout();
          showNotification('Session expired. Please log in again.');
        }
      }, SESSION_DURATION + 500);
      return;
    }

    // Legacy mock login (for demo purposes)
    const isAdmin = isAdminEmail(mockUser.email);
    if (isAdmin && TWO_FA_REQUIRED) {
      const code = window.prompt('Enter 2FA code (for demo use 123456)');
      if (code !== '123456') {
        showNotification('Invalid 2FA code.');
        return;
      }
    }
    setIsLoggedIn(true);
    setUser({ ...mockUser, role: isAdmin ? 'admin' : 'user' });
    // start session timer
    const expires = Date.now() + SESSION_DURATION;
    setSessionExpiresAt(expires);
    setTimeout(() => {
      if (Date.now() >= expires) {
        logout();
        showNotification('Session expired. Please log in again.');
      }
    }, SESSION_DURATION + 500);
    showNotification('Welcome back! 🦖');
  }, [showNotification, logout]);

  const addToCart = useCallback(() => {
    setCartCount(c => c + 1);
    showNotification('Added to cart! 🛒');
  }, [showNotification]);

  return (
    <AppContext.Provider value={{
      currentPage, setPage,
      theme, toggleTheme,
      isLoggedIn, user, login, logout,
      sessionExpiresAt,
      products, setProducts,
      blogPosts, setBlogPosts,
      sponsorBanners, setSponsorBanners,
      sponsorPopups, setSponsorPopups,
      selectedProductId, setSelectedProductId,
      selectedBlogId, setSelectedBlogId,
      isDinoOpen, setDinoOpen,
      searchQuery, setSearchQuery,
      isMobileMenuOpen, setMobileMenuOpen,
      cartCount, addToCart,
      notification, showNotification,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

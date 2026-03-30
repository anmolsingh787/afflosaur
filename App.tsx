// ==========================================
// Afflosaur - Main App Component 🦕
// ==========================================

import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { CartProvider, useCart } from './context/CartContext';
import { CoinProvider, useCoin } from './context/CoinContext';
import { StoreProvider } from './context/StoreContext';
import { GamificationProvider } from './context/GamificationContext';
import Header from './components/Header';
import { AdBanner } from './components/AdBanner';
import AdPopup from './components/AdPopup';
import { DinoAssistant } from './components/DinoAssistant';
import { HomePage } from './pages/HomePage';
import { StorePage } from './pages/StorePage';
import { TrendingPage } from './pages/TrendingPage';
import { BlogPage } from './pages/BlogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { WritePage } from './pages/WritePage';
import { AdminPage } from './pages/AdminPage';
import { ProfilePage } from './pages/ProfilePage';
import { DealsPage } from './pages/DealsPage';
import { SetupGuidePage } from './pages/SetupGuidePage';
import { CartPage } from './pages/CartPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { AffiliateHubPage } from './pages/AffiliateHubPage';
import { AffiliateDisclosurePage } from './pages/AffiliateDisclosurePage';
import { DealAlertsPage } from './pages/DealAlertsPage';
import { Top10Page } from './pages/Top10Page';
import { ComparisonsPage } from './pages/ComparisonsPage';
import { PrayagrajPage } from './pages/PrayagrajPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { WalletPage } from './pages/WalletPage';
import { MissionsPage } from './pages/MissionsPage';
import { GiveawaysPage } from './pages/GiveawaysPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ReferralPage } from './pages/ReferralPage';
import { PremiumPage } from './pages/PremiumPage';
import { PremiumSectionPage } from './pages/PremiumSectionPage';
import { SettingsPage } from './pages/SettingsPage';
import { HelpPage } from './pages/HelpPage';
import { AuthPage } from './pages/AuthPage';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import UserLogin from './pages/user/Login';
import UserDashboard from './pages/user/Dashboard';
import { isSupabaseConfigured } from './lib/supabaseClient';

function CoinNotificationToast() {
  const { coinNotification, clearNotification } = useCoin();
  if (!coinNotification) return null;

  const isSpend = coinNotification.amount < 0;
  const isInfo = coinNotification.amount === 0;
  const isError = coinNotification.amount === -1;

  return (
    <button
      onClick={clearNotification}
      className={`fixed top-20 right-4 z-70 px-4 py-3 rounded-2xl shadow-2xl animate-[fadeInDown_0.3s_ease] flex items-center gap-2.5 cursor-pointer active:scale-95 transition-all ${
        isError
          ? 'bg-linear-to-r from-red-500 to-pink-500 text-white'
          : isSpend
            ? 'bg-linear-to-r from-orange-600 to-red-500 text-white'
            : isInfo
              ? 'bg-linear-to-r from-purple-500 to-blue-500 text-white'
              : 'bg-linear-to-r from-green-500 to-emerald-500 text-white'
      }`}
    >
      <span className="text-xl">
        {isError ? '😢' : isSpend ? '💸' : isInfo ? '✨' : '🪙'}
      </span>
      <div className="text-left">
        <p className="text-sm font-black">
          {isError
            ? 'Not enough coins!'
            : isSpend
              ? `−${Math.abs(coinNotification.amount)} coins spent`
              : isInfo
                ? coinNotification.message
                : `+${coinNotification.amount} Afflo Coins!`
          }
        </p>
        <p className="text-[10px] opacity-80">{coinNotification.message}</p>
      </div>
    </button>
  );
}

function AppContent() {
  const { theme, notification, setSelectedProductId, setSelectedBlogId } = useApp();
  const isDark = theme === 'dark';

  // Listen for product/blog selection events from search
  useEffect(() => {
    const handleSelectProduct = (e: Event) => {
      const customEvent = e as CustomEvent;
      setSelectedProductId(customEvent.detail);
    };
    const handleSelectBlog = (e: Event) => {
      const customEvent = e as CustomEvent;
      setSelectedBlogId(customEvent.detail);
    };
    window.addEventListener('selectProduct', handleSelectProduct);
    window.addEventListener('selectBlog', handleSelectBlog);
    return () => {
      window.removeEventListener('selectProduct', handleSelectProduct);
      window.removeEventListener('selectBlog', handleSelectBlog);
    };
  }, [setSelectedProductId, setSelectedBlogId]);

  const renderPage = () => {
    return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/trending" element={<TrendingPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/product" element={<ProductDetailPage />} />
        <Route path="/blogpost" element={<BlogPostPage />} />
        <Route path="/write" element={<WritePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/deals" element={<DealsPage />} />
        <Route path="/setup" element={<SetupGuidePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/affiliate-disclosure" element={<AffiliateDisclosurePage />} />
        <Route path="/affiliate-hub" element={<AffiliateHubPage />} />
        <Route path="/deal-alerts" element={<DealAlertsPage />} />
        <Route path="/top10" element={<Top10Page />} />
        <Route path="/comparisons" element={<ComparisonsPage />} />
        <Route path="/prayagraj" element={<PrayagrajPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/missions" element={<MissionsPage />} />
        <Route path="/giveaways" element={<GiveawaysPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/referral" element={<ReferralPage />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/premium-section" element={<PremiumSectionPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
      </Routes>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <AdBanner />
      <AdPopup />
      <Header />
      
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-6 pb-24">
        {renderPage()}
      </main>

      <AppFooter />
      <MobileBottomNav />
      <DinoAssistant />
      <CoinNotificationToast />

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-60 px-5 py-3 bg-linear-to-r from-gray-900 to-gray-800 text-white text-sm rounded-2xl shadow-2xl animate-[fadeInDown_0.3s_ease] border border-gray-700">
          {notification}
        </div>
      )}
    </div>
  );
}

// ---- Footer ----
function AppFooter() {
  const { theme, setPage } = useApp();
  const isDark = theme === 'dark';

  type FooterLink = { label: string; page: import('./types').Page };

  const shopLinks: FooterLink[] = [
    { label: 'All Products', page: 'store' },
    { label: 'Trending', page: 'trending' },
    { label: 'Under ₹500', page: 'trending' },
    { label: 'Electronics', page: 'store' },
    { label: 'Fashion', page: 'store' },
    { label: 'Prayagraj Local', page: 'prayagraj' },
  ];

  const communityLinks: FooterLink[] = [
    { label: 'Write a Review', page: 'write' },
    { label: 'Blog', page: 'blog' },
    { label: 'Top 10 Lists', page: 'top10' },
    { label: 'Comparisons', page: 'comparisons' },
    { label: 'Deal Alerts', page: 'deal-alerts' },
    { label: '👑 Premium Section', page: 'premium-section' },
  ];

  const supportLinks: FooterLink[] = [
    { label: 'About Us', page: 'about' },
    { label: 'Contact', page: 'contact' },
    { label: 'Privacy Policy', page: 'privacy' },
    { label: 'Terms of Use', page: 'terms' },
    { label: 'Affiliate Disclosure', page: 'affiliate-disclosure' },
  ];

  const renderLinks = (links: FooterLink[]) => (
    <ul className="space-y-2">
      {links.map(link => (
        <li key={link.label}>
          <button
            onClick={() => setPage(link.page)}
            className={`text-xs cursor-pointer hover:text-orange-500 transition-colors text-left ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}
          >
            {link.label}
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <footer className={`border-t py-8 mt-8 ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <button onClick={() => setPage('home')} className="flex items-center gap-2 font-bold text-lg">
              <span className="text-2xl">🦕</span>
              <span className="bg-linear-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent font-black">
                Afflosaur
              </span>
            </button>
            <p className={`text-xs mt-2 max-w-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              India's smartest deal-hunting platform. Compare prices, read reviews, shop Prayagraj local products.
            </p>
            <div className="flex gap-2 mt-3">
              {['📸', '🐦', '📘', '📺'].map((emoji, i) => (
                <span key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm cursor-pointer transition-colors ${
                  isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-orange-50'
                }`}>
                  {emoji}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Shop
            </h4>
            {renderLinks(shopLinks)}
          </div>

          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Community
            </h4>
            {renderLinks(communityLinks)}
          </div>

          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Support
            </h4>
            {renderLinks(supportLinks)}
          </div>
        </div>

        <div className={`mt-8 pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
          isDark ? 'border-gray-800' : 'border-gray-100'
        }`}>
          <p className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            © 2024 Afflosaur. Made with 🦕 in India. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPage('affiliate-disclosure')}
              className={`text-[10px] hover:text-orange-500 transition-colors ${isDark ? 'text-gray-700' : 'text-gray-300'}`}
            >
              Affiliate Disclosure: We may earn commission from qualifying purchases.
            </button>
            <span className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${
              isSupabaseConfigured
                ? 'bg-green-500/10 text-green-500'
                : 'bg-orange-500/10 text-orange-500'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConfigured ? 'bg-green-500' : 'bg-orange-500'}`} />
              {isSupabaseConfigured ? 'Backend Connected' : 'Demo Mode'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ---- Mobile Bottom Nav ----
const MAIN_PAGES = ['home', 'store', 'wallet', 'cart', 'profile'] as const;

function MobileBottomNav() {
  const { currentPage, setPage, theme } = useApp();
  const { getTotalItems } = useCart();
  const { balance: navCoinBalance } = useCoin();
  const isDark = theme === 'dark';
  const cartCount = getTotalItems();
  const isSecondaryPage = !(MAIN_PAGES as readonly string[]).includes(currentPage);

  const items = [
    { page: 'home' as const, label: 'Home', emoji: '🏠' },
    { page: 'store' as const, label: 'Store', emoji: '🏪' },
    { page: 'wallet' as const, label: `${navCoinBalance}`, emoji: '🪙' },
    { page: 'cart' as const, label: 'Cart', emoji: '🛒' },
    { page: 'profile' as const, label: 'Profile', emoji: '👤' },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t ${
      isDark ? 'bg-gray-950/98 border-gray-800' : 'bg-white/98 border-gray-200'
    }`} style={{ backdropFilter: 'blur(20px)' }}>
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto px-2">
        {/* Back button — shown on secondary pages */}
        {isSecondaryPage && (
          <button
            onClick={() => setPage('home')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all active:scale-90 ${
              isDark ? 'text-orange-400 hover:bg-gray-800' : 'text-orange-500 hover:bg-orange-50'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-[10px] font-bold">Back</span>
          </button>
        )}
        {items.map(item => (
          <button
            key={item.page}
            onClick={() => setPage(item.page)}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all active:scale-90 relative ${
              currentPage === item.page
                ? 'text-orange-500'
                : isDark ? 'text-gray-500' : 'text-gray-400'
            } ${isSecondaryPage ? 'scale-90 opacity-60' : ''}`}
          >
            <span className={`text-lg ${currentPage === item.page ? 'scale-110' : ''} transition-transform`}>{item.emoji}</span>
            <span className={`text-[10px] font-bold ${currentPage === item.page ? 'text-orange-500' : ''}`}>{item.label}</span>
            {item.page === 'cart' && cartCount > 0 && (
              <span className="absolute -top-0.5 right-0 min-w-4 h-4 bg-linear-to-r from-red-500 to-pink-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold px-1">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
            {currentPage === item.page && (
              <span className="absolute -bottom-1 w-5 h-0.5 bg-linear-to-r from-orange-500 to-amber-500 rounded-full" />
            )}
          </button>
        ))}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}

export function App() {
  return (
    <AppProvider>
      <StoreProvider>
        <CartProvider>
          <CoinProvider>
            <GamificationProvider>
              <AppContent />
            </GamificationProvider>
          </CoinProvider>
        </CartProvider>
      </StoreProvider>
    </AppProvider>
  );
}

export default App;

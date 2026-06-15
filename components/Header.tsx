// ==========================================
// Afflosaur - Header with Working Search
// ==========================================

import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useCart } from '../context/CartContext';
import { useCoin } from '../context/CoinContext';
import { addRecentSearch } from '../hooks/useSearch';
import SearchDropdown from './SearchDropdown';
import {
  Search, Menu, X, ShoppingCart, Sun, Moon,
  LogIn, Mic, ChevronDown
} from 'lucide-react';

export default function Header() {
  const {
    theme, toggleTheme, currentPage, setPage,
    isLoggedIn, login, logout, user,
    isMobileMenuOpen, setMobileMenuOpen,
    cartCount, searchQuery, setSearchQuery,
  } = useApp();

  const { getTotalItems } = useCart();
  const actualCartCount = getTotalItems();

  const isDark = theme === 'dark';
  const { balance: coinBalance, currentRank, isPremium: isPremiumUser } = useCoin();
  const [showSearch, setShowSearch] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync searchQuery from context
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleSearch = (query?: string) => {
    const q = query || localQuery;
    if (!q.trim()) return;
    addRecentSearch(q);
    setSearchQuery(q);
    setPage('search');
    setIsDropdownOpen(false);
    setShowSearch(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
    if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalQuery(val);
    setIsDropdownOpen(true);
  };

  const handleFocus = () => {
    setIsDropdownOpen(true);
  };

  const handleSelectProduct = (productId: string) => {
    window.dispatchEvent(new CustomEvent('selectProduct', { detail: productId }));
    setPage('product');
    setIsDropdownOpen(false);
    setShowSearch(false);
  };

  const handleSelectBlog = (blogId: string) => {
    window.dispatchEvent(new CustomEvent('selectBlog', { detail: blogId }));
    setPage('blogpost');
    setIsDropdownOpen(false);
    setShowSearch(false);
  };

  const navItems = [
    { id: 'home' as const, label: 'Home', emoji: '🏠' },
    { id: 'store' as const, label: 'Store', emoji: '🛍️' },
    { id: 'trending' as const, label: 'Trending', emoji: '🔥' },
    { id: 'prayagraj' as const, label: 'Prayagraj', emoji: '📍' },
    { id: 'premium-section' as const, label: 'Premium', emoji: '👑' },
    { id: 'blog' as const, label: 'Blog', emoji: '📝' },
    { id: 'notes' as const, label: 'Notes', emoji: '🗒️' },
    { id: 'deals' as const, label: 'Deals', emoji: '⚡' },
    { id: 'leaderboard' as const, label: 'Leaderboard', emoji: '🏆' },
  ];

  return (
    <>
      {/* ===== MAIN HEADER ===== */}
      <header className={`sticky top-0 z-50 ${
        isDark
          ? 'bg-gray-900/95 border-gray-800'
          : 'bg-white/95 border-gray-200'
      } backdrop-blur-xl border-b shadow-sm`}>

        {/* Top bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex items-center h-14 sm:h-16 gap-2 sm:gap-4">

            {/* Logo */}
            <button
              onClick={() => setPage('home')}
              className="flex items-center gap-1.5 shrink-0"
            >
              <span className="text-2xl">🦕</span>
              <span className="font-extrabold text-lg sm:text-xl bg-linear-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent hidden sm:block">
                Afflosaur
              </span>
            </button>

            {/* Desktop Search Bar */}
            <div ref={searchRef} className="relative flex-1 max-w-2xl hidden md:block">
              <div className={`flex items-center rounded-2xl border-2 overflow-hidden transition-all ${
                isDropdownOpen
                  ? 'border-orange-400 shadow-lg shadow-orange-100'
                  : isDark
                    ? 'border-gray-700 hover:border-gray-600'
                    : 'border-gray-200 hover:border-gray-300'
              }`}>
                <div className={`pl-4 pr-2 ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>
                  <Search className="w-5 h-5" />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  id="search-input"
                  name="search"
                  value={localQuery}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  onKeyDown={handleKeyDown}
                  placeholder="Search products, deals, blogs..."
                  className={`flex-1 py-2.5 px-2 text-sm outline-none bg-transparent ${
                    isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                  }`}
                />
                {localQuery && (
                  <button
                    onClick={() => {
                      setLocalQuery('');
                      setIsDropdownOpen(false);
                      inputRef.current?.focus();
                    }}
                    className={`p-1.5 mr-1 rounded-full ${
                      isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-400'
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  className="p-2 mr-1 text-gray-400 hover:text-orange-500 transition"
                  title="Voice search (coming soon)"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleSearch()}
                  className="px-5 py-2.5 bg-linear-to-r from-orange-500 to-amber-500 text-white font-semibold text-sm hover:from-orange-600 hover:to-amber-600 transition-all"
                >
                  Search
                </button>
              </div>

              {/* Desktop Search Dropdown */}
              <SearchDropdown
                query={localQuery}
                isOpen={isDropdownOpen}
                onClose={() => setIsDropdownOpen(false)}
                onSelectProduct={handleSelectProduct}
                onSelectBlog={handleSelectBlog}
                onSearch={(q) => {
                  setLocalQuery(q);
                  handleSearch(q);
                }}
              />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2 ml-auto">
              {/* Mobile search toggle */}
              <button
                onClick={() => {
                  setShowSearch(!showSearch);
                  setTimeout(() => {
                    const mobileInput = document.getElementById('mobile-search-input');
                    if (mobileInput) mobileInput.focus();
                  }, 100);
                }}
                className={`p-2 rounded-xl md:hidden ${
                  isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wallet / Coins - SHOWS ACTUAL BALANCE + RANK + PREMIUM */}
              <button
                onClick={() => setPage('wallet')}
                className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl text-sm font-bold transition active:scale-95 ${
                  isPremiumUser
                    ? 'bg-linear-to-r from-purple-500/20 to-amber-500/20 text-amber-400 hover:from-purple-500/30 hover:to-amber-500/30 border border-purple-500/30'
                    : isDark
                      ? 'bg-linear-to-r from-amber-900/40 to-orange-900/40 text-amber-400 hover:from-amber-900/60 hover:to-orange-900/60 border border-amber-700/30'
                      : 'bg-linear-to-r from-amber-50 to-orange-50 text-amber-700 hover:from-amber-100 hover:to-orange-100 border border-amber-200'
                }`}
              >
                {isPremiumUser && <span className="text-xs">👑</span>}
                <span className="text-sm">{currentRank.icon}</span>
                <span className="font-black tabular-nums">{coinBalance.toLocaleString()}</span>
                <span className="text-base">🪙</span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-xl transition ${
                  isDark ? 'hover:bg-gray-800 text-yellow-400' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Cart */}
              <button
                onClick={() => setPage('cart')}
                className={`relative p-2 rounded-xl transition ${
                  isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {actualCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {actualCartCount}
                  </span>
                )}
              </button>

              {/* User */}
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`flex items-center gap-1 p-1.5 rounded-xl transition ${
                      isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="w-7 h-7 rounded-full bg-linear-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-sm font-bold">
                      {user?.avatar || '🦕'}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 hidden sm:block ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  </button>

                  {showUserMenu && (
                    <div className={`absolute right-0 top-full mt-2 w-48 rounded-xl shadow-xl border overflow-hidden ${
                      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                      <button onClick={() => { setPage('profile'); setShowUserMenu(false); }}
                        className={`w-full px-4 py-2.5 text-left text-sm ${isDark ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-50 text-gray-700'}`}>
                        👤 Profile
                      </button>
                      <button onClick={() => { setPage('wallet'); setShowUserMenu(false); }}
                        className={`w-full px-4 py-2.5 text-left text-sm ${isDark ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-50 text-gray-700'}`}>
                        🪙 My Coins
                      </button>
                      <button onClick={() => { setPage('missions'); setShowUserMenu(false); }}
                        className={`w-full px-4 py-2.5 text-left text-sm ${isDark ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-50 text-gray-700'}`}>
                        🎯 Missions
                      </button>
                      {user?.role === 'admin' && (
                        <button onClick={() => { setPage('admin'); setShowUserMenu(false); }}
                          className={`w-full px-4 py-2.5 text-left text-sm ${isDark ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-50 text-gray-700'}`}>
                          ⚙️ Admin Panel
                        </button>
                      )}
                      <hr className={isDark ? 'border-gray-700' : 'border-gray-100'} />
                      <button onClick={() => { logout(); setShowUserMenu(false); }}
                        className="w-full px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-50">
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setPage('auth')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-linear-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold hover:shadow-lg transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Login</span>
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-xl md:hidden ${
                  isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 pb-2 overflow-x-auto no-scrollbar">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  currentPage === item.id
                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                    : isDark
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="text-sm">{item.emoji}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ===== MOBILE SEARCH BAR ===== */}
      {showSearch && (
        <div className={`fixed inset-x-0 top-14 z-60 p-3 md:hidden ${
          isDark ? 'bg-gray-900' : 'bg-white'
        } border-b ${isDark ? 'border-gray-800' : 'border-gray-200'} shadow-lg`}>
          <div ref={searchRef} className="relative">
            <div className={`flex items-center rounded-2xl border-2 overflow-hidden ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="pl-3">
                <Search className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
              </div>
              <input
                id="mobile-search-input"
                name="search"
                type="text"
                value={localQuery}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onKeyDown={handleKeyDown}
                placeholder="Search products, deals..."
                className={`flex-1 py-3 px-3 text-sm outline-none bg-transparent ${
                  isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                }`}
              />
              {localQuery && (
                <button
                  onClick={() => {
                    setLocalQuery('');
                    setIsDropdownOpen(false);
                  }}
                  className="p-2"
                >
                  <X className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                </button>
              )}
              <button
                onClick={() => handleSearch()}
                className="px-4 py-3 bg-linear-to-r from-orange-500 to-amber-500 text-white font-semibold text-sm"
              >
                Search
              </button>
            </div>

            {/* Mobile Search Dropdown */}
            <SearchDropdown
              query={localQuery}
              isOpen={isDropdownOpen}
              onClose={() => {
                setIsDropdownOpen(false);
                setShowSearch(false);
              }}
              onSelectProduct={handleSelectProduct}
              onSelectBlog={handleSelectBlog}
              onSearch={(q) => {
                setLocalQuery(q);
                handleSearch(q);
              }}
            />
          </div>
        </div>
      )}

      {/* ===== MOBILE MENU ===== */}
      {isMobileMenuOpen && (
        <div className={`fixed inset-0 top-14 z-40 md:hidden ${
          isDark ? 'bg-gray-900/98' : 'bg-white/98'
        } backdrop-blur-xl overflow-y-auto`}>
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left text-base font-medium transition ${
                  currentPage === item.id
                    ? 'bg-orange-100 text-orange-700'
                    : isDark
                      ? 'text-gray-300 hover:bg-gray-800'
                      : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{item.emoji}</span>
                {item.label}
              </button>
            ))}

            <hr className={`my-3 ${isDark ? 'border-gray-800' : 'border-gray-200'}`} />

            <button onClick={() => setPage('wallet')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left font-medium ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}>
              <span>🪙</span>
              <span className="flex-1">Afflo Coins</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-black ${isDark ? 'bg-amber-900/40 text-amber-400' : 'bg-amber-100 text-amber-700'}`}>
                {coinBalance.toLocaleString()}
              </span>
            </button>
            <button onClick={() => setPage('missions')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left font-medium ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}>
              🎯 Daily Missions
            </button>
            <button onClick={() => setPage('giveaways')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left font-medium ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}>
              🎁 Giveaways
            </button>
            <button onClick={() => setPage('leaderboard')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left font-medium ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}>
              🏆 Leaderboard
            </button>
            <button onClick={() => setPage('referral')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left font-medium ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}>
              🤝 Refer & Earn
            </button>
            <button onClick={() => setPage('premium-section')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left font-medium ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}>
              👑 Premium Section
            </button>
            <button onClick={() => setPage('premium')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left font-medium ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}>
              💎 Upgrade Plans
            </button>
          </nav>
        </div>
      )}

      {/* Mobile bottom nav is rendered in App.tsx */}
    </>
  );
}

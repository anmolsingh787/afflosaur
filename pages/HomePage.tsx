// ==========================================
// Afflosaur - Home Page
// Featured products TOP, minimal scroll needed
// ==========================================

import { ArrowRight, TrendingUp, Zap, Star, MapPin, Sparkles } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { BlogCard } from '../components/BlogCard';
import CategorySlider from '../components/CategorySlider';
import { MysteryDealBox } from '../components/MysteryDealBox';
import { SmartBuyerScore } from '../components/SmartBuyerScore';
import { SavingsLeaderboard } from '../components/SavingsLeaderboard';
import { PricePredictionCard } from '../components/PricePredictionCard';
import { DailyStreakCard } from '../components/DailyStreakCard';
import { PredictiveShoppingGame } from '../components/PredictiveShoppingGame';
import { MysteryAffiliateRoulette } from '../components/MysteryAffiliateRoulette';

export function HomePage() {
  const { theme, setPage, products, blogPosts, setDinoOpen, isLoading } = useApp();
  const { store } = useStore();
  const isDark = theme === 'dark';
  const [activeCategory, setActiveCategory] = useState('All');

  // Filter by selected store first
  const storeProducts = useMemo(() => {
    if (store === 'all') return products;
    if (store === 'prayagraj') return products.filter(p => p.isPrayagraj);
    return products.filter(p =>
      p.prices.some(pr => pr.platform.toLowerCase().includes(store))
    );
  }, [products, store]);

  const featuredProducts = storeProducts.filter(p => p.isFeatured);
  const trendingProducts = storeProducts.filter(p => p.isTrending);
  const prayagrajProducts = storeProducts.filter(p => p.isPrayagraj);
  const budgetDeals = storeProducts.filter(p => Math.min(...p.prices.map(pr => pr.price)) < 500);
  const recentBlogs = blogPosts.slice(0, 3);

  // Filter products by selected category
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return featuredProducts.length > 0 ? featuredProducts : storeProducts.slice(0, 8);
    if (activeCategory === 'Trending') return trendingProducts;
    if (activeCategory === 'Under ₹500') return budgetDeals;
    if (activeCategory === 'Prayagraj Local') return prayagrajProducts;
    if (activeCategory === 'Best Deals') return storeProducts.filter(p => p.discount && p.discount > 0);
    if (activeCategory === 'Top Rated') return [...storeProducts].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 8);
    if (activeCategory === 'New Arrivals') return [...storeProducts].reverse().slice(0, 8);
    return storeProducts.filter(p =>
      p.category.toLowerCase() === activeCategory.toLowerCase() ||
      p.tags?.some(t => t.toLowerCase().includes(activeCategory.toLowerCase()))
    );
  }, [activeCategory, storeProducts, featuredProducts, trendingProducts, budgetDeals, prayagrajProducts]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading amazing deals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* ===== HERO - Compact, impactful ===== */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl">
        <div className={`px-4 py-6 sm:px-8 sm:py-10 ${
          isDark 
            ? 'bg-linear-to-br from-gray-800 via-orange-900/20 to-gray-800' 
            : 'bg-linear-to-br from-orange-50 via-amber-50 to-yellow-50'
        }`}>
          {/* Floating Dino Mascot */}
          <div className="absolute right-4 top-4 sm:right-8 sm:top-6 text-5xl sm:text-7xl opacity-90 animate-float-slow select-none pointer-events-none">
            🦕
          </div>
          <div className="max-w-xl relative z-10">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold mb-3 ${
              isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-700'
            }`}>
              <Sparkles className="w-3 h-3" />
              India's Smartest Deal Platform
            </div>
            
            <h1 className={`text-2xl sm:text-4xl font-black leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Smart Shopping
              <br />
              <span className="bg-linear-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent">
                Starts Here 🦕
              </span>
            </h1>
            
            <p className={`mt-2 text-xs sm:text-sm max-w-md ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Compare prices across Amazon, Flipkart & more. Prayagraj local delivery available!
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setPage('store')}
                className="px-5 py-2.5 bg-linear-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-orange-500/30 transition-all active:scale-95 flex items-center gap-1.5"
              >
                Explore Store <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage('prayagraj')}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center gap-1.5 ${
                  isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-700 shadow-md hover:shadow-lg'
                }`}
              >
                <MapPin className="w-4 h-4 text-orange-500" /> Prayagraj Shop
              </button>
              <button
                onClick={() => setDinoOpen(true)}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center gap-1.5 border ${
                  isDark ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                🦕 Ask Saur AI
              </button>
            </div>
          </div>

          <div className="absolute -right-4 -bottom-4 text-[100px] sm:text-[150px] opacity-10 select-none pointer-events-none">
            🦕
          </div>
        </div>
      </section>

      {/* ===== CATEGORY SLIDER - Browse by category ===== */}
      <section className={`-mx-4 sm:mx-0 rounded-none sm:rounded-2xl ${isDark ? 'bg-gray-800/30' : 'bg-white'} shadow-sm`}>
        <CategorySlider
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          variant="default"
          showIcons={true}
        />
      </section>

      {/* ===== FILTERED / FEATURED PRODUCTS - Immediately visible ===== */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{activeCategory === 'All' ? '⭐' : activeCategory === 'Trending' ? '🔥' : activeCategory === 'Prayagraj Local' ? '📍' : activeCategory === 'Under ₹500' ? '💰' : '🛍️'}</span>
            <h2 className={`text-lg sm:text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {activeCategory === 'All' ? 'Featured Products' : activeCategory}
            </h2>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-700'}`}>
              {filteredProducts.length} items
            </span>
          </div>
          <button
            onClick={() => setPage('store')}
            className="text-orange-500 text-xs sm:text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className={`col-span-full text-center py-10 rounded-2xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <p className="text-4xl mb-2">🦕</p>
              <p className={`font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No products in this category yet</p>
              <button onClick={() => setActiveCategory('All')} className="mt-2 text-orange-500 text-sm font-bold">
                Browse All →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ===== Quick Stats Bar ===== */}
      <section className={`grid grid-cols-4 gap-2 sm:gap-3 rounded-2xl p-3 sm:p-4 ${
        isDark ? 'bg-gray-800/50' : 'bg-linear-to-r from-orange-50 to-amber-50'
      }`}>
        {[
          { icon: <Star className="w-4 h-4" />, val: '500+', label: 'Products' },
          { icon: <TrendingUp className="w-4 h-4" />, val: '2.4K', label: 'Reviews' },
          { icon: <Zap className="w-4 h-4" />, val: '10K+', label: 'Users' },
          { icon: <MapPin className="w-4 h-4" />, val: 'Live', label: 'Prayagraj' },
        ].map((s, i) => (
          <div key={i} className="text-center">
            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-xl mb-1 ${
              isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'
            }`}>
              {s.icon}
            </div>
            <div className={`text-sm sm:text-base font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{s.val}</div>
            <div className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* ===== PRAYAGRAJ LOCAL - Special Section ===== */}
      {prayagrajProducts.length > 0 && (
        <section className={`rounded-2xl p-4 sm:p-5 ${
          isDark 
            ? 'bg-linear-to-r from-orange-900/30 to-amber-900/30 border border-orange-500/20' 
            : 'bg-linear-to-r from-orange-50 to-amber-50 border border-orange-200'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">📍</span>
              <div>
                <h2 className={`text-lg sm:text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Prayagraj Local
                </h2>
                <p className={`text-[10px] sm:text-xs ${isDark ? 'text-orange-300/70' : 'text-orange-600'}`}>
                  Direct purchase • Same day delivery • Support local 🙏
                </p>
              </div>
            </div>
            <button onClick={() => setPage('prayagraj')} className="text-orange-500 text-xs font-bold flex items-center gap-1">
              See All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {prayagrajProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ===== TRENDING ===== */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <h2 className={`text-lg sm:text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Trending Now
            </h2>
          </div>
          <button onClick={() => setPage('trending')} className="text-orange-500 text-xs sm:text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
            Trending Lab <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {trendingProducts.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ===== PREMIUM SECTION TEASER ===== */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl">
        <div className={`p-5 sm:p-6 ${
          isDark 
            ? 'bg-linear-to-br from-amber-900/30 via-orange-900/20 to-red-900/30 border border-amber-500/20' 
            : 'bg-linear-to-br from-amber-50 via-orange-50 to-red-50 border border-amber-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold mb-2 ${
                isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
              }`}>
                👑 PREMIUM ZONE
              </div>
              <h2 className={`text-lg sm:text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Unlock Secret Deals & Hidden Coupons
              </h2>
              <p className={`text-xs mt-1 max-w-md ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Premium members get flash deals up to 80% off, exclusive coupon codes, early access to new products, and VIP giveaway entries.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={() => setPage('premium-section')}
                  className="px-5 py-2.5 bg-linear-to-r from-amber-500 via-orange-500 to-red-500 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-orange-500/30 transition-all active:scale-95 flex items-center gap-1.5"
                >
                  ⚡ Explore Premium <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage('premium')}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 border ${
                    isDark ? 'border-amber-500/30 text-amber-400 hover:bg-amber-900/20' : 'border-amber-300 text-amber-700 hover:bg-amber-50'
                  }`}
                >
                  Plans from ₹49/mo
                </button>
              </div>
            </div>
            <div className="text-5xl sm:text-7xl opacity-30 ml-3 select-none hidden sm:block">👑</div>
          </div>

          {/* Mini preview cards */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { emoji: '⚡', label: 'Secret Deals', desc: 'Up to 80% off' },
              { emoji: '🎫', label: 'Hidden Coupons', desc: '6 active codes' },
              { emoji: '🚀', label: 'Early Access', desc: '3 upcoming drops' },
            ].map((item, i) => (
              <div key={i} className={`p-2.5 rounded-xl text-center ${
                isDark ? 'bg-gray-800/50' : 'bg-white/70'
              }`}>
                <span className="text-xl">{item.emoji}</span>
                <p className={`text-[10px] font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.label}</p>
                <p className={`text-[9px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BUDGET DEALS ===== */}
      {budgetDeals.length > 0 && (
        <section className={`rounded-2xl p-4 sm:p-5 ${
          isDark ? 'bg-linear-to-r from-green-900/20 to-emerald-900/20 border border-green-500/20' : 'bg-linear-to-r from-green-50 to-emerald-50'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">💰</span>
              <h2 className={`text-lg sm:text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Under ₹500 Deals
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {budgetDeals.map(product => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        </section>
      )}

      {/* ===== COMMUNITY BLOGS ===== */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📝</span>
            <h2 className={`text-lg sm:text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Latest from Community
            </h2>
          </div>
          <button onClick={() => setPage('blog')} className="text-orange-500 text-xs sm:text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
            All Blogs <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {recentBlogs.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* ===== GAMIFICATION SECTION ===== */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎮</span>
            <h2 className={`text-lg sm:text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Level Up Your Shopping! 🚀
            </h2>
          </div>
        </div>

        {/* Mystery Deal - Curiosity Hook */}
        <div className="mb-6">
          <MysteryDealBox />
        </div>

        {/* Gamification Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SmartBuyerScore />
          <DailyStreakCard />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SavingsLeaderboard />
          <PricePredictionCard />
        </div>

        {/* Predictive Shopping Game - Competition Hook */}
        <div className="mb-6">
          <PredictiveShoppingGame />
        </div>

        {/* Mystery Affiliate Roulette - Variable Rewards Hook */}
        <div className="mb-6">
          <MysteryAffiliateRoulette />
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="rounded-2xl p-5 sm:p-8 text-center bg-linear-to-r from-orange-500 via-amber-500 to-orange-600 shadow-xl shadow-orange-500/20">
        <h2 className="text-xl sm:text-2xl font-black text-white">
          Got a great deal? Share it! 🌟
        </h2>
        <p className="text-orange-100 mt-2 text-xs sm:text-sm max-w-lg mx-auto">
          Write reviews, create top 10 lists, share deals. Help the community!
        </p>
        <button
          onClick={() => setPage('write')}
          className="mt-4 px-6 py-3 bg-white text-orange-600 rounded-xl font-bold text-sm hover:shadow-lg transition-all active:scale-95"
        >
          ✍️ Start Writing
        </button>
      </section>

      {/* AdSense Placeholder */}
      <div className={`rounded-xl p-3 text-center text-[10px] ${isDark ? 'bg-gray-800/50 text-gray-600' : 'bg-gray-100 text-gray-400'}`}>
        📢 Ad Space — Google AdSense Ready
      </div>
    </div>
  );
}

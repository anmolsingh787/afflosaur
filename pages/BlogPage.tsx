import { useState, useRef, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useCoin, PREMIUM_PLANS } from '../context/CoinContext';
import { BlogCard } from '../components/BlogCard';
import type { BlogPost } from '../types';

const blogCategories = [
  { id: 'all', label: 'All', icon: '📝' },
  { id: 'deals', label: 'Deals', icon: '🔥' },
  { id: 'affiliate-secrets', label: 'Affiliate Secrets', icon: '💰' },
  { id: 'ai-tools', label: 'AI Tools', icon: '🤖' },
  { id: 'tech-reviews', label: 'Tech Reviews', icon: '📱' },
  { id: 'earning-tips', label: 'Earning Tips', icon: '💸' },
  { id: 'local-prayagraj', label: 'Local Prayagraj', icon: '📍' },
  { id: 'money-saving', label: 'Money Saving', icon: '🏦' },
  { id: 'comparison', label: 'Comparisons', icon: '⚖️' },
  { id: 'top-10', label: 'Top 10', icon: '🏆' },
  { id: 'premium-guides', label: 'Premium Guides', icon: '👑', isPremium: true },
];

const trendingTags = ['Best Deals', 'Under ₹500', 'Tech 2024', 'Affiliate Tips', 'Prayagraj Local', 'AI Tools', 'Money Saving'];

const premiumExtras: BlogPost[] = [
  {
    id: 'p-premium-1',
    title: '🔒 Secret Affiliate Strategies That 10x Earnings',
    slug: 'secret-affiliate-strategies-10x',
    content: 'Exclusive premium guide. Hidden affiliate tactics, conversion hacks, and India-first strategies.',
    excerpt: 'Insider strategies used by top Indian affiliate marketers. Hidden Amazon & Flipkart tricks inside.',
    author: 'Afflosaur Pro',
    authorAvatar: '👑',
    category: 'blog',
    tags: ['premium', 'affiliate', 'secrets'],
    likes: 567,
    comments: [],
    isApproved: true,
    createdAt: '2024-01-10',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop',
    isPremium: true,
    views: 8900,
    readTime: '12 min',
  },
  {
    id: 'p-premium-2',
    title: '🔒 AI-Powered Deal Finding: Automate Your Savings',
    slug: 'ai-powered-deal-finding',
    content: 'Premium guide with AI alerts, auto-deal trackers, and Telegram bot setup.',
    excerpt: 'Use AI bots and tools to automatically find the best deals across India. Setup guide included.',
    author: 'Afflosaur Pro',
    authorAvatar: '👑',
    category: 'blog',
    tags: ['premium', 'ai', 'automation'],
    likes: 334,
    comments: [],
    isApproved: true,
    createdAt: '2024-01-03',
    image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=600&h=300&fit=crop',
    isPremium: true,
    views: 5600,
    readTime: '18 min',
  },
  {
    id: 'p-premium-3',
    title: '🔒 Exclusive: Upcoming Sale Calendar 2024',
    slug: 'exclusive-sale-calendar-2024',
    content: 'Premium sale calendar with exact dates, expected discounts, and best time to buy.',
    excerpt: 'Leaked sale calendar with exact dates and biggest discount predictions. Plan your purchases.',
    author: 'Afflosaur Pro',
    authorAvatar: '👑',
    category: 'blog',
    tags: ['premium', 'sales', 'amazon', 'flipkart'],
    likes: 890,
    comments: [],
    isApproved: true,
    createdAt: '2023-12-15',
    image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600&h=300&fit=crop',
    isPremium: true,
    views: 15600,
    readTime: '10 min',
  },
];

const normalizeBlog = (post: BlogPost) => ({
  ...post,
  readTime: post.readTime || `${Math.ceil((post.content?.length || 800) / 900)} min`,
  views: post.views || Math.floor(Math.random() * 10000 + 1000),
  isPremium: post.isPremium || post.tags?.includes('premium') || false,
});

export function BlogPage() {
  const { setPage, theme, blogPosts } = useApp();
  const coinState = useCoin();
  const isDark = theme === 'dark';
  const isPremium = coinState.isPremium;

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);

  const allBlogs = useMemo(() => {
    const merged = [...premiumExtras, ...blogPosts].map(normalizeBlog);
    const unique = new Map<string, BlogPost>();
    merged.forEach((b) => unique.set(b.id, b));
    return Array.from(unique.values());
  }, [blogPosts]);

  useEffect(() => {
    if (!isPremium) {
      const timer = setTimeout(() => setShowPremiumPopup(true), 8000);
      return () => clearTimeout(timer);
    }
  }, [isPremium]);

  const filteredBlogs = allBlogs.filter(blog => {
    const slugCategory = blog.category.toLowerCase().replace(/\s+/g, '-');
    const matchesCategory = activeCategory === 'all' ||
      slugCategory === activeCategory ||
      blog.tags.some(t => t.toLowerCase().replace(/\s+/g, '-') === activeCategory);

    const matchesSearch = !searchQuery ||
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const featuredBlog = allBlogs.find(b => (b.views || 0) > 30000 && !b.isPremium);
  const premiumBlogs = allBlogs.filter(b => b.isPremium);
  const popularBlogs = [...allBlogs].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

  const scrollCategories = (dir: 'left' | 'right') => {
    if (categoryRef.current) {
      categoryRef.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* ===== HERO SECTION ===== */}
      <section className={`relative overflow-hidden ${
        isDark
          ? 'bg-linear-to-br from-gray-900 via-orange-950/30 to-gray-900'
          : 'bg-linear-to-br from-orange-50 via-amber-50 to-white'
      }`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] opacity-5 select-none">
            🦕
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-12 md:py-16">
          <button
            onClick={() => setPage('home')}
            className={`mb-6 flex items-center gap-2 text-sm font-medium transition-colors ${
              isDark ? 'text-gray-400 hover:text-orange-400' : 'text-gray-600 hover:text-orange-600'
            }`}
          >
            ← Back to Home
          </button>

          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
              <span className="text-lg">🦕</span>
              <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">AFFLOSAUR BLOG</span>
            </div>

            <h1 className={`text-3xl md:text-5xl font-black mb-4 leading-tight ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Smart Deals, Tech, Money
              <br />
              <span className="bg-linear-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                & Local Secrets
              </span>
            </h1>

            <p className={`text-lg mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Learn. Save. Earn smarter. 🚀
            </p>

            <div className={`relative max-w-xl mx-auto rounded-2xl overflow-hidden shadow-lg ${
              isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <div className="flex items-center">
                <span className="pl-4 text-xl">🔍</span>
                <input
                  type="text"
                  id="blog-search"
                  name="search"
                  placeholder="Search articles, guides, tips..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`flex-1 px-4 py-4 text-base bg-transparent outline-none ${
                    isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                  }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-3 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {trendingTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 ${
                    isDark
                      ? 'bg-gray-800 text-gray-300 hover:bg-orange-900/30 hover:text-orange-400'
                      : 'bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                  } border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORY CHIPS ===== */}
      <section className={`sticky top-16 z-30 border-b ${
        isDark ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-gray-200'
      } backdrop-blur-xl`}>
        <div className="max-w-6xl mx-auto px-4 relative">
          <button
            onClick={() => scrollCategories('left')}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full shadow-md ${
              isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'
            } hidden md:flex`}
          >
            ‹
          </button>
          <button
            onClick={() => scrollCategories('right')}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full shadow-md ${
              isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'
            } hidden md:flex`}
          >
            ›
          </button>

          <div className={`pointer-events-none absolute left-0 top-0 h-full w-8 z-10 ${
            isDark ? 'bg-linear-to-r from-gray-900 to-transparent' : 'bg-linear-to-r from-white to-transparent'
          }`} />
          <div className={`pointer-events-none absolute right-0 top-0 h-full w-8 z-10 ${
            isDark ? 'bg-linear-to-l from-gray-900 to-transparent' : 'bg-linear-to-l from-white to-transparent'
          }`} />

          <div
            ref={categoryRef}
            className="flex gap-2 overflow-x-auto no-scrollbar py-3 px-4"
          >
            {blogCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat.id
                    ? cat.isPremium
                      ? 'bg-linear-to-r from-amber-500 to-yellow-400 text-white shadow-lg shadow-amber-500/25'
                      : 'bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25'
                    : isDark
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } ${cat.isPremium && activeCategory !== cat.id ? 'border border-amber-400/40' : ''}`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                {cat.isPremium && activeCategory !== cat.id && <span className="text-[10px]">🔒</span>}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeCategory === 'all' && !searchQuery && featuredBlog && (
          <section className="mb-10">
            <BlogCard post={featuredBlog} variant="featured" />
          </section>
        )}

        {activeCategory === 'all' && !searchQuery && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">👑</span>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Premium Guides
                </h2>
                <span className="px-2 py-0.5 bg-linear-to-r from-amber-500 to-yellow-400 text-white text-xs font-bold rounded-full">
                  PRO
                </span>
              </div>
              <button
                onClick={() => setActiveCategory('premium-guides')}
                className="text-sm text-orange-500 hover:text-orange-600 font-medium"
              >
                View all →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {premiumBlogs.slice(0, 3).map(blog => (
                <div key={blog.id} className="relative">
                  {!isPremium && (
                    <div className="absolute inset-0 z-10 rounded-2xl overflow-hidden">
                      <div className="absolute inset-0 backdrop-blur-[2px] bg-linear-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                        <div className="text-2xl mb-1">🔒</div>
                        <p className="text-white text-sm font-semibold">Premium Content</p>
                        <button
                          onClick={(e) => { e.stopPropagation(); setPage('premium'); }}
                          className="mt-2 px-4 py-1.5 bg-linear-to-r from-amber-500 to-yellow-400 text-white text-xs font-bold rounded-full"
                        >
                          Unlock Plans →
                        </button>
                      </div>
                    </div>
                  )}
                  <BlogCard post={blog} />
                </div>
              ))}
            </div>
          </section>
        )}

        {!isPremium && activeCategory === 'all' && !searchQuery && (
          <div className={`mb-8 rounded-2xl overflow-hidden border-2 border-dashed ${
            isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="text-3xl">🦕</span>
                <div>
                  <p className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Join Afflosaur Deals Channel
                  </p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Get instant deal alerts on Telegram & WhatsApp
                  </p>
                </div>
              </div>
              <div className="flex justify-center gap-3">
                <button className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-full hover:bg-blue-600 transition-colors">
                  📱 Telegram
                </button>
                <button className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-full hover:bg-green-600 transition-colors">
                  💬 WhatsApp
                </button>
              </div>
              <p className={`text-[10px] mt-2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                Sponsored
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-8">
          <div className="flex-1">
            {searchQuery && (
              <div className="mb-4 flex items-center justify-between">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Showing {filteredBlogs.length} results for "<span className="font-semibold text-orange-500">{searchQuery}</span>"
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-sm text-orange-500 hover:text-orange-600"
                >
                  Clear search
                </button>
              </div>
            )}

            {activeCategory !== 'all' && !searchQuery && (
              <div className="mb-4 flex items-center gap-2">
                <span className="text-xl">
                  {blogCategories.find(c => c.id === activeCategory)?.icon}
                </span>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {blogCategories.find(c => c.id === activeCategory)?.label}
                </h2>
                <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  ({filteredBlogs.length})
                </span>
              </div>
            )}

            {filteredBlogs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBlogs.map((blog) => {
                  const isPremiumLocked = blog.isPremium && !isPremium;
                  return (
                    <div key={blog.id} className="relative">
                      {isPremiumLocked && (
                        <div className="absolute inset-0 z-10 rounded-2xl overflow-hidden">
                          <div className="absolute inset-0 backdrop-blur-[2px] bg-linear-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                            <div className="text-2xl mb-1">🔒</div>
                            <p className="text-white text-sm font-semibold mb-2">Premium Content</p>
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={(e) => { e.stopPropagation(); setPage('premium'); }}
                                className="px-3 py-1.5 bg-linear-to-r from-amber-500 to-yellow-400 text-white text-xs font-bold rounded-full"
                              >
                                View Plans
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); }}
                                className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full border border-white/30"
                              >
                                🪙 30 Coins
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      <BlogCard post={blog} />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={`text-center py-16 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="text-5xl mb-4">🔍</div>
                <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  No articles found
                </h3>
                <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Try a different search or category
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                  className="px-6 py-2 bg-linear-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-full"
                >
                  Browse All Articles
                </button>
              </div>
            )}

            <div className={`mt-10 rounded-2xl p-8 text-center ${
              isDark
                ? 'bg-linear-to-r from-orange-900/30 to-amber-900/30 border border-orange-800/30'
                : 'bg-linear-to-r from-orange-50 to-amber-50 border border-orange-100'
            }`}>
              <div className="text-4xl mb-3">✍️</div>
              <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Share Your Knowledge
              </h3>
              <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Write reviews, comparisons, or deal alerts. Earn AffloCoins for every published article!
              </p>
              <button
                onClick={() => setPage('write')}
                className="px-6 py-3 bg-linear-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all"
              >
                ✏️ Start Writing — Earn 50 Coins
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0 space-y-6">
            <div className={`rounded-2xl p-4 ${
              isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
            } shadow-sm`}>
              <h3 className={`font-bold text-base mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                🔥 Most Popular
              </h3>
              <div className="space-y-1">
                {popularBlogs.map((blog, i) => (
                  <div
                    key={blog.id}
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('selectBlog', { detail: blog.id }));
                      setPage('blogpost');
                    }}
                    className={`flex items-start gap-3 p-2 rounded-xl cursor-pointer transition-colors ${
                      isDark ? 'hover:bg-gray-700' : 'hover:bg-orange-50'
                    }`}
                  >
                    <span className={`text-lg font-black w-6 text-center shrink-0 ${
                      i < 3 ? 'text-orange-500' : isDark ? 'text-gray-600' : 'text-gray-300'
                    }`}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium line-clamp-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                        {blog.title}
                      </p>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        👁 {Math.round((blog.views || 0) / 100) / 10}K views
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {!isPremium && (
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <div className="bg-linear-to-br from-amber-500 to-orange-600 p-5 text-center text-white">
                  <div className="text-3xl mb-2">👑</div>
                  <h3 className="font-bold text-lg mb-1">Go Premium</h3>
                  <p className="text-sm text-amber-100 mb-3">
                    Unlock exclusive guides, secret deals & earn 1.5x coins
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {PREMIUM_PLANS.map((plan) => (
                      <button
                        key={plan.id}
                        onClick={() => setPage('premium')}
                        className="w-full py-2 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-colors text-xs"
                      >
                        {plan.name} — ₹{plan.priceINR}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-amber-200 mt-2">or use coins to unlock</p>
                </div>
              </div>
            )}

            <div className={`rounded-2xl p-4 ${
              isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
            } shadow-sm`}>
              <h3 className={`font-bold text-sm mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                🪙 Your AffloCoins
              </h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-amber-500/25">
                  🪙
                </div>
                <div>
                  <p className={`text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {coinState.balance.toLocaleString()}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Available coins
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPage('wallet')}
                className={`w-full py-2 rounded-xl text-sm font-medium transition-colors ${
                  isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                }`}
              >
                View Wallet →
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Premium Popup */}
      {showPremiumPopup && !isPremium && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`relative max-w-md w-full rounded-3xl overflow-hidden shadow-2xl ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <button
              onClick={() => setShowPremiumPopup(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 z-10"
            >
              ✕
            </button>

            <div className="bg-linear-to-br from-amber-500 to-orange-600 p-8 text-center text-white">
              <div className="text-5xl mb-3">👑</div>
              <h2 className="text-2xl font-black mb-2">Unlock Premium Content</h2>
              <p className="text-amber-100">
                Get exclusive guides, secret deals & 1.5x coin rewards
              </p>
            </div>

            <div className="p-6 space-y-3">
              <div className="grid grid-cols-1 gap-2">
                {PREMIUM_PLANS.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => { setShowPremiumPopup(false); setPage('premium'); }}
                    className="w-full py-3 bg-linear-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                  >
                    {plan.name} — ₹{plan.priceINR} / {plan.duration}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowPremiumPopup(false)}
                className={`w-full py-3 rounded-xl text-sm font-medium ${
                  isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// Afflosaur - Search Results Page (FIXED)
// Full search results with filters
// ==========================================

import { Search, SlidersHorizontal, X, TrendingUp, ArrowRight } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { BlogCard } from '../components/BlogCard';
import { useProductSearch, useBlogSearch } from '../hooks/useSearch';

// Store filter options
const storeFilters = [
  { id: 'all', name: 'All Stores', icon: '🛍️' },
  { id: 'amazon', name: 'Amazon', icon: '🟡' },
  { id: 'flipkart', name: 'Flipkart', icon: '🔵' },
  { id: 'meesho', name: 'Meesho', icon: '🟣' },
  { id: 'afflosaur', name: 'Afflosaur', icon: '🦕' },
];

export function SearchResultsPage() {
  const { theme, searchQuery, setSearchQuery, setPage } = useApp();
  const isDark = theme === 'dark';

  const [selectedStore, setSelectedStore] = useState('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'price-low' | 'price-high' | 'rating'>('relevance');
  const [activeTab, setActiveTab] = useState<'products' | 'blogs'>('products');

  // Search results using the hooks (they read products/blogs from AppContext internally)
  const productResults = useProductSearch(searchQuery, selectedStore);
  const blogResults = useBlogSearch(searchQuery);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...productResults];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => Math.min(...a.prices.map(p => p.price)) - Math.min(...b.prices.map(p => p.price)));
      case 'price-high':
        return sorted.sort((a, b) => Math.min(...b.prices.map(p => p.price)) - Math.min(...a.prices.map(p => p.price)));
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      default:
        return sorted;
    }
  }, [productResults, sortBy]);

  const totalResults = productResults.length + blogResults.length;

  // Suggestions when no query
  const suggestedSearches = ['earbuds', 'smartwatch', 'prayagraj', 'ring light', 'power bank', 'speaker'];

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className={`rounded-2xl p-4 sm:p-6 ${isDark ? 'bg-gray-800/50' : 'bg-linear-to-r from-orange-50 to-amber-50'}`}>
        {/* Search Input */}
        <div className={`flex items-center rounded-2xl border-2 px-4 py-3 mb-4 transition-all focus-within:border-orange-400 focus-within:shadow-lg focus-within:shadow-orange-500/10 ${
          isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <Search className="w-5 h-5 text-orange-400 shrink-0" />
          <input
            type="text"
            id="search-results-query"
            name="search"
            placeholder="Search products, blogs, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`ml-3 w-full bg-transparent outline-none text-sm sm:text-base font-medium ${
              isDark ? 'placeholder:text-gray-500 text-white' : 'placeholder:text-gray-400'
            }`}
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`p-1.5 rounded-full transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Store Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {storeFilters.map((store) => (
            <button
              key={store.id}
              onClick={() => setSelectedStore(store.id)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                selectedStore === store.id
                  ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                  : isDark
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
              }`}
            >
              <span>{store.icon}</span>
              {store.name}
            </button>
          ))}
        </div>

        {/* Results count */}
        {searchQuery && (
          <div className="mt-3 flex items-center justify-between">
            <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {totalResults > 0 ? (
                <>
                  Showing <span className="font-bold text-orange-500">{totalResults}</span> results for "
                  <span className="font-bold">{searchQuery}</span>"
                  {selectedStore !== 'all' && (
                    <> in <span className="font-bold capitalize">{selectedStore}</span></>
                  )}
                </>
              ) : (
                <>No results found for "<span className="font-bold">{searchQuery}</span>"</>
              )}
            </p>
          </div>
        )}
      </div>

      {/* No query state */}
      {!searchQuery.trim() && (
        <div className={`rounded-2xl p-8 text-center ${isDark ? 'bg-gray-800/50' : 'bg-white shadow-sm'}`}>
          <div className="text-6xl mb-3">🔍</div>
          <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Search for anything
          </h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Products, blogs, deals, categories...
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {suggestedSearches.map((s) => (
              <button
                key={s}
                onClick={() => setSearchQuery(s)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all active:scale-95 ${
                  isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                }`}
              >
                🔥 {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {searchQuery.trim() && totalResults > 0 && (
        <>
          {/* Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'products'
                  ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-md'
                  : isDark ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
            >
              🏪 Products ({productResults.length})
            </button>
            <button
              onClick={() => setActiveTab('blogs')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'blogs'
                  ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-md'
                  : isDark ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
            >
              📝 Blogs ({blogResults.length})
            </button>

            {/* Sort - Products only */}
            {activeTab === 'products' && productResults.length > 1 && (
              <div className="ml-auto flex items-center gap-1.5">
                <SlidersHorizontal className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className={`text-xs font-medium rounded-lg px-2 py-1.5 outline-none border ${
                    isDark ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-600'
                  }`}
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            )}
          </div>

          {/* Product Grid */}
          {activeTab === 'products' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Blog Grid */}
          {activeTab === 'blogs' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {blogResults.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </>
      )}

      {/* No results - show suggestions */}
      {searchQuery.trim() && totalResults === 0 && (
        <div className={`rounded-2xl p-8 text-center ${isDark ? 'bg-gray-800/50' : 'bg-white shadow-sm'}`}>
          <div className="text-6xl mb-3">🦕</div>
          <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Saur couldn't find anything
          </h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Try different keywords or browse our categories
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {suggestedSearches.map((s) => (
              <button
                key={s}
                onClick={() => setSearchQuery(s)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  isDark ? 'bg-gray-700 text-gray-300' : 'bg-orange-50 text-orange-600'
                }`}
              >
                Try: {s}
              </button>
            ))}
          </div>
          <div className="flex justify-center gap-3 mt-5">
            <button
              onClick={() => setPage('store')}
              className="px-5 py-2.5 bg-linear-to-r from-orange-500 to-amber-500 text-white rounded-xl text-sm font-bold flex items-center gap-1.5"
            >
              Browse Store <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage('trending')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1.5 ${
                isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <TrendingUp className="w-4 h-4" /> Trending
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

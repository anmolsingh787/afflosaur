// ==========================================
// Afflosaur - Search Dropdown (FIXED)
// Shows instant search results as user types
// ==========================================

import { useState, useEffect } from 'react';
import { useProductSearch, useBlogSearch, getRecentSearches, clearRecentSearches } from '../hooks/useSearch';
import { useApp } from '../context/AppContext';
import {
  Search, Clock, TrendingUp, X, Star, ShoppingBag,
  FileText, ArrowRight, Trash2
} from 'lucide-react';

interface SearchDropdownProps {
  query: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (productId: string) => void;
  onSelectBlog: (blogId: string) => void;
  onSearch: (query: string) => void;
}

const trendingSearches = [
  'earbuds under 1000',
  'smartwatch',
  'bluetooth speaker',
  'power bank',
  'prayagraj local',
  'oversized tshirt',
];

export default function SearchDropdown({
  query,
  isOpen,
  onClose,
  onSelectProduct,
  onSelectBlog,
  onSearch,
}: SearchDropdownProps) {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const productResults = useProductSearch(query);
  const blogResults = useBlogSearch(query);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, [isOpen]);

  if (!isOpen) return null;

  const hasQuery = query.trim().length > 0;
  const hasResults = productResults.length > 0 || blogResults.length > 0;

  // Format price in INR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Get best price for a product
  const getBestPrice = (prices: { price: number }[]) => {
    return Math.min(...prices.map((p) => p.price));
  };

  return (
    <div
      className={`absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-2xl border overflow-hidden z-[100] max-h-[80vh] overflow-y-auto ${
        isDark
          ? 'bg-gray-900 border-gray-700'
          : 'bg-white border-gray-200'
      }`}
    >
      {/* Close button - mobile */}
      <button
        onClick={onClose}
        className={`absolute top-3 right-3 p-1 rounded-full z-10 md:hidden ${
          isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'
        }`}
      >
        <X className="w-4 h-4" />
      </button>

      {/* === NO QUERY STATE: Show recent + trending === */}
      {!hasQuery && (
        <div className="p-4">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className={`text-xs font-semibold uppercase tracking-wider ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <Clock className="w-3 h-3 inline mr-1" />
                  Recent Searches
                </h4>
                <button
                  onClick={() => {
                    clearRecentSearches();
                    setRecentSearches([]);
                  }}
                  className="text-xs text-orange-500 hover:text-orange-600 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => onSearch(s)}
                    className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 transition-all hover:scale-105 ${
                      isDark
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Clock className="w-3 h-3 opacity-50" />
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending Searches */}
          <div>
            <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <TrendingUp className="w-3 h-3 inline mr-1" />
              Trending Searches
            </h4>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((s, i) => (
                <button
                  key={i}
                  onClick={() => onSearch(s)}
                  className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 transition-all hover:scale-105 ${
                    isDark
                      ? 'bg-orange-900/30 text-orange-300 hover:bg-orange-900/50'
                      : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                  }`}
                >
                  🔥 {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* === HAS QUERY BUT NO RESULTS === */}
      {hasQuery && !hasResults && (
        <div className="p-8 text-center">
          <div className="text-4xl mb-3">🦕</div>
          <p className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            No results for "{query}"
          </p>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Try different keywords or browse categories
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {['electronics', 'fashion', 'gadgets', 'prayagraj'].map((cat) => (
              <button
                key={cat}
                onClick={() => onSearch(cat)}
                className="px-3 py-1 rounded-full text-xs bg-orange-100 text-orange-700 hover:bg-orange-200 transition"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* === SEARCH RESULTS === */}
      {hasQuery && hasResults && (
        <div>
          {/* Product Results */}
          {productResults.length > 0 && (
            <div>
              <div className={`px-4 py-2 flex items-center gap-2 border-b ${
                isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-100'
              }`}>
                <ShoppingBag className="w-4 h-4 text-orange-500" />
                <span className={`text-xs font-semibold uppercase tracking-wider ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Products ({productResults.length})
                </span>
              </div>

              {productResults.slice(0, 6).map((product) => {
                const bestPrice = getBestPrice(product.prices);
                return (
                  <button
                    key={product.id}
                    onClick={() => {
                      onSelectProduct(product.id);
                      onClose();
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${
                      isDark
                        ? 'hover:bg-gray-800'
                        : 'hover:bg-orange-50'
                    }`}
                  >
                    {/* Product Image */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {product.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm font-bold text-orange-500">
                          {formatPrice(bestPrice)}
                        </span>
                        {product.discount && product.discount > 0 && (
                          <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">
                            {product.discount}% off
                          </span>
                        )}
                        <span className="flex items-center gap-0.5 text-xs text-yellow-600">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {product.rating}
                        </span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <ArrowRight className={`w-4 h-4 shrink-0 ${
                      isDark ? 'text-gray-600' : 'text-gray-300'
                    }`} />
                  </button>
                );
              })}

              {productResults.length > 6 && (
                <button
                  onClick={() => {
                    onSearch(query);
                    onClose();
                  }}
                  className="w-full px-4 py-3 text-center text-sm text-orange-500 font-semibold hover:bg-orange-50 transition flex items-center justify-center gap-1"
                >
                  View all {productResults.length} products
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Blog Results */}
          {blogResults.length > 0 && (
            <div>
              <div className={`px-4 py-2 flex items-center gap-2 border-y ${
                isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-100'
              }`}>
                <FileText className="w-4 h-4 text-purple-500" />
                <span className={`text-xs font-semibold uppercase tracking-wider ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Articles ({blogResults.length})
                </span>
              </div>

              {blogResults.slice(0, 3).map((blog) => (
                <button
                  key={blog.id}
                  onClick={() => {
                    onSelectBlog(blog.id);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${
                    isDark
                      ? 'hover:bg-gray-800'
                      : 'hover:bg-purple-50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {blog.title}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      by {blog.author} · {blog.category}
                    </p>
                  </div>
                  <ArrowRight className={`w-4 h-4 shrink-0 ${
                    isDark ? 'text-gray-600' : 'text-gray-300'
                  }`} />
                </button>
              ))}
            </div>
          )}

          {/* Search all link */}
          <div className={`px-4 py-3 border-t ${
            isDark ? 'border-gray-700' : 'border-gray-100'
          }`}>
            <button
              onClick={() => {
                onSearch(query);
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-linear-to-r from-orange-500 to-amber-500 text-white font-semibold text-sm hover:shadow-lg transition-all"
            >
              <Search className="w-4 h-4" />
              Search all for "{query}"
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// Afflosaur - Store Page
// Product listing with CategorySlider + filters
// ==========================================

import { useState, useMemo } from 'react';
import { SlidersHorizontal, Grid, List } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import CategorySlider from '../components/CategorySlider';
import type { ProductType } from '../types';

const storeCategories = [
  'All',
  'Electronics',
  'Fashion',
  'Gadgets',
  'Home & Kitchen',
  'Beauty',
  'Fitness',
  'Books',
  'Prayagraj Local',
  'Under ₹500',
  'Trending',
  'Top Rated',
];

export function StorePage() {
  const { theme, products, searchQuery } = useApp();
  const isDark = theme === 'dark';

  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedType, setSelectedType] = useState<ProductType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'rating'>('default');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const types: { value: ProductType | 'all'; label: string }[] = [
    { value: 'all', label: '🛍️ All Types' },
    { value: 'affiliate', label: '🔗 Affiliate' },
    { value: 'direct', label: '🏪 Our Products' },
    { value: 'mixed', label: '⚖️ Compare' },
  ];

  // Map slider categories to product categories
  const categoryMap: Record<string, string> = {
    'Electronics': 'electronics',
    'Fashion': 'fashion',
    'Gadgets': 'gadgets',
    'Home & Kitchen': 'home',
    'Home': 'home',
    'Beauty': 'beauty',
    'Fitness': 'fitness',
    'Books': 'books',
  };

  const filtered = useMemo(() => {
    let result = products.filter(p => {
      // Category filter
      if (activeCategory !== 'All') {
        if (activeCategory === 'Prayagraj Local') {
          if (!p.isPrayagraj) return false;
        } else if (activeCategory === 'Under ₹500') {
          if (Math.min(...p.prices.map(pr => pr.price)) >= 500) return false;
        } else if (activeCategory === 'Trending') {
          if (!p.isTrending) return false;
        } else if (activeCategory === 'Top Rated') {
          // Allow all, will sort later
        } else {
          const mapped = categoryMap[activeCategory];
          if (mapped && p.category !== mapped) return false;
        }
      }
      // Type filter
      if (selectedType !== 'all' && p.type !== selectedType) return false;
      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return p.title.toLowerCase().includes(q) ||
          p.tags.some(t => t.includes(q)) ||
          p.description.toLowerCase().includes(q);
      }
      return true;
    });

    // Sort
    if (activeCategory === 'Top Rated' || sortBy === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price-low') {
      result = [...result].sort((a, b) => Math.min(...a.prices.map(p => p.price)) - Math.min(...b.prices.map(p => p.price)));
    } else if (sortBy === 'price-high') {
      result = [...result].sort((a, b) => Math.min(...b.prices.map(p => p.price)) - Math.min(...a.prices.map(p => p.price)));
    }

    return result;
  }, [products, activeCategory, selectedType, sortBy, searchQuery]);

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Page Header */}
      <div>
        <h1 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
          🏪 Afflosaur Store
        </h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Compare prices across 9+ stores • Save money on every purchase
        </p>
      </div>

      {/* Category Slider */}
      <div className={`-mx-4 sm:-mx-0 sm:rounded-2xl ${isDark ? 'bg-gray-800/30' : 'bg-white'} shadow-sm`}>
        <CategorySlider
          categories={storeCategories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          variant="default"
          showIcons={true}
        />
      </div>

      {/* Filter + Sort Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all active:scale-95 ${
              showFilters
                ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                : isDark
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-600 shadow-sm hover:shadow-md'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
          </button>

          {/* View Mode Toggle */}
          <div className={`flex rounded-xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-orange-500 text-white' : isDark ? 'text-gray-400' : 'text-gray-500'}`}
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-orange-500 text-white' : isDark ? 'text-gray-400' : 'text-gray-500'}`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {filtered.length} items
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm border-none outline-none font-semibold ${
              isDark ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600 shadow-sm'
            }`}
          >
            <option value="default">Sort: Default</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className={`rounded-2xl p-4 space-y-3 border ${
          isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-100 shadow-sm'
        }`}>
          <p className={`text-sm font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Product Type</p>
          <div className="flex flex-wrap gap-2">
            {types.map(type => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 ${
                  selectedType === type.value
                    ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                    : isDark
                      ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Active Filters Summary */}
          {(activeCategory !== 'All' || selectedType !== 'all') && (
            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Active:</span>
              {activeCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 font-bold">
                  {activeCategory}
                  <button onClick={() => setActiveCategory('All')} className="hover:text-red-500">×</button>
                </span>
              )}
              {selectedType !== 'all' && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 font-bold">
                  {types.find(t => t.value === selectedType)?.label}
                  <button onClick={() => setSelectedType('all')} className="hover:text-red-500">×</button>
                </span>
              )}
              <button
                onClick={() => { setActiveCategory('All'); setSelectedType('all'); setSortBy('default'); }}
                className="text-xs text-red-500 font-bold hover:underline"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      )}

      {/* Products Grid */}
      {filtered.length > 0 ? (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4'
            : 'grid grid-cols-1 sm:grid-cols-2 gap-3'
        }>
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} compact={viewMode === 'list'} />
          ))}
        </div>
      ) : (
        <div className={`text-center py-16 rounded-2xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
          <span className="text-5xl block mb-3">🦕</span>
          <p className={`font-bold text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            No products found
          </p>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Try changing your filters or search query
          </p>
          <button
            onClick={() => { setActiveCategory('All'); setSelectedType('all'); }}
            className="mt-3 text-orange-500 text-sm font-bold hover:underline"
          >
            Clear All Filters →
          </button>
        </div>
      )}

      {/* AdSense Placeholder */}
      <div className={`rounded-xl p-3 text-center text-[10px] ${isDark ? 'bg-gray-800/50 text-gray-600' : 'bg-gray-100 text-gray-400'}`}>
        📢 Ad Space — Google AdSense Ready
      </div>
    </div>
  );
}

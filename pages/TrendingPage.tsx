// ==========================================
// Afflosaur - Trending Lab Page
// Daily trending, viral gadgets, budget deals
// ==========================================

import { useState } from 'react';
import { TrendingUp, Zap, Clock, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';

export function TrendingPage() {
  const { theme, products } = useApp();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'trending' | 'hot' | 'budget' | 'new'>('trending');

  const trending = products.filter(p => p.isTrending);
  const hot = products.filter(p => p.isHot);
  const budget = products.filter(p => Math.min(...p.prices.map(pr => pr.price)) < 500);
  const newest = [...products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const tabs = [
    { id: 'trending' as const, label: 'Trending', icon: <TrendingUp className="w-4 h-4" />, count: trending.length },
    { id: 'hot' as const, label: 'Hot 🔥', icon: <Flame className="w-4 h-4" />, count: hot.length },
    { id: 'budget' as const, label: 'Under ₹500', icon: <Zap className="w-4 h-4" />, count: budget.length },
    { id: 'new' as const, label: 'New Arrivals', icon: <Clock className="w-4 h-4" />, count: newest.length },
  ];

  const currentProducts = {
    trending,
    hot,
    budget,
    new: newest,
  }[activeTab];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`rounded-2xl p-5 sm:p-8 ${
        isDark 
          ? 'bg-linear-to-r from-orange-900/30 to-red-900/30 border border-orange-500/20'
          : 'bg-linear-to-r from-orange-50 to-red-50'
      }`}>
        <h1 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          🔬 Trending Lab
        </h1>
        <p className={`text-sm mt-2 max-w-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Discover what India is buzzing about. Daily updated trending products, viral gadgets, 
          and budget-friendly deals curated by our team + community.
        </p>
        <div className={`mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
          isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-700'
        }`}>
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          Live updates • Last refreshed 2 hours ago
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 ${
              activeTab === tab.id
                ? 'bg-linear-to-r from-orange-500 to-red-500 text-white shadow-md shadow-orange-500/20'
                : isDark
                  ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  : 'bg-white text-gray-600 shadow-sm hover:bg-gray-50'
            }`}
          >
            {tab.icon}
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              activeTab === tab.id
                ? 'bg-white/20'
                : isDark ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Daily Highlight */}
      {activeTab === 'trending' && trending[0] && (
        <div className={`rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-center ${
          isDark ? 'bg-gray-800' : 'bg-white shadow-lg'
        }`}>
          <img
            src={trending[0].image}
            alt={trending[0].title}
            className="w-full sm:w-48 h-48 rounded-xl object-cover"
            loading="lazy"
          />
          <div className="flex-1 text-center sm:text-left">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-500 bg-orange-500/10 px-2 py-1 rounded-full">
              🏆 #1 Trending Today
            </span>
            <h2 className={`text-lg sm:text-xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {trending[0].title}
            </h2>
            <p className={`text-sm mt-1 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {trending[0].description}
            </p>
            <div className="mt-3 flex items-center justify-center sm:justify-start gap-3">
              <span className="text-2xl font-bold text-emerald-500">
                ₹{Math.min(...trending[0].prices.map(p => p.price)).toLocaleString()}
              </span>
              {trending[0].discount && (
                <span className="text-sm bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full font-medium">
                  {trending[0].discount}% OFF
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {currentProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {currentProducts.length === 0 && (
        <div className={`text-center py-16 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <span className="text-4xl">🔍</span>
          <p className={`mt-3 font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            No products in this category yet
          </p>
        </div>
      )}
    </div>
  );
}

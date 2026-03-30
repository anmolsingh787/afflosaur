// ==========================================
// Afflosaur - Affiliate Hub Page
// High-converting affiliate deals page
// ==========================================

import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
// @ts-ignore
import { supabase } from '../lib/supabase';
import { DBAffiliateDeal } from '../types/database';
import { Star, ExternalLink } from 'lucide-react';

export function AffiliateHubPage() {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const [deals, setDeals] = useState<DBAffiliateDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'Web Hosting' | 'VPNs' | 'AI Tools'>('Web Hosting');

  const categories = ['Web Hosting', 'VPNs', 'AI Tools'];

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('affiliate_deals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeals(data || []);
    } catch (error) {
      console.error('Error fetching affiliate deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDeals = deals.filter(deal => deal.category === selectedCategory);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const DealCard = ({ deal }: { deal: DBAffiliateDeal }) => (
    <div className={`rounded-lg border p-6 transition-all hover:shadow-lg ${
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center mb-4">
        <img
          src={deal.logo_url}
          alt={deal.brand}
          className="w-12 h-12 rounded-lg mr-4 object-contain"
        />
        <div>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {deal.brand}
          </h3>
          <div className="flex items-center">
            {renderStars(deal.rating)}
            <span className={`ml-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {deal.rating}/5
            </span>
          </div>
        </div>
      </div>

      <ul className="mb-4 space-y-1">
        {deal.features.slice(0, 3).map((feature, index) => (
          <li key={index} className={`text-sm flex items-start ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            <span className="text-green-500 mr-2">•</span>
            {feature}
          </li>
        ))}
      </ul>

      <div className="mb-4">
        <div className="flex items-center">
          <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            ${deal.current_price}
          </span>
          <span className={`ml-2 text-lg line-through ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            ${deal.old_price}
          </span>
        </div>
      </div>

      <a
        href={deal.affiliate_link}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
      >
        Claim Deal
        <ExternalLink className="w-4 h-4 ml-2" />
      </a>
    </div>
  );

  const SkeletonCard = () => (
    <div className={`rounded-lg border p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center mb-4">
        <div className={`w-12 h-12 rounded-lg mr-4 ${isDark ? 'bg-gray-700' : 'bg-gray-300'} animate-pulse`} />
        <div>
          <div className={`h-5 w-24 mb-2 ${isDark ? 'bg-gray-700' : 'bg-gray-300'} animate-pulse rounded`} />
          <div className={`h-4 w-16 ${isDark ? 'bg-gray-700' : 'bg-gray-300'} animate-pulse rounded`} />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className={`h-4 w-full ${isDark ? 'bg-gray-700' : 'bg-gray-300'} animate-pulse rounded`} />
        <div className={`h-4 w-3/4 ${isDark ? 'bg-gray-700' : 'bg-gray-300'} animate-pulse rounded`} />
        <div className={`h-4 w-1/2 ${isDark ? 'bg-gray-700' : 'bg-gray-300'} animate-pulse rounded`} />
      </div>
      <div className={`h-10 w-full ${isDark ? 'bg-gray-700' : 'bg-gray-300'} animate-pulse rounded`} />
    </div>
  );

  return (
    <>
      {/* Header */}
      <header className={`border-b ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-blue-600">Afflosaur</h1>
              <span className={`ml-2 text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Affiliate Hub
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className={`hover:text-blue-600 transition-colors ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Home
              </a>
              <a href="#" className={`hover:text-blue-600 transition-colors ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Deals
              </a>
              <a href="#" className={`hover:text-blue-600 transition-colors ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Reviews
              </a>
              <a href="#" className={`hover:text-blue-600 transition-colors ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Contact
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories Tabs */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Top Affiliate Deals</h2>
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category as any)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Deals Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        )}

        {!loading && filteredDeals.length === 0 && (
          <div className="text-center py-12">
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              No deals found for {selectedCategory}.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
// ==========================================
// Afflosaur - 9-Store Affiliate Price Table
// Premium price comparison with all Indian stores
// ==========================================

import { Award, ExternalLink, TrendingDown, Truck, MapPin, Clock, CheckCircle, AlertTriangle, BarChart3 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useState } from 'react';
import PriceHistory from './PriceHistory';

export interface StorePrice {
  store: string;
  icon: string;
  price: number | null; // null = not available
  originalPrice?: number;
  url: string;
  isBestDeal?: boolean;
  deliveryInfo?: string; // e.g., "Delivery by Tomorrow", "Local Delivery in 2 Hours"
  stockStatus?: 'in-stock' | 'low-stock' | 'out-of-stock'; // Stock availability
  stockCount?: number; // Number of items left
  isLocal?: boolean; // Is this a local Prayagraj store
}

interface Props {
  prices: StorePrice[];
  compact?: boolean;
}

const storeStyles: Record<string, { bg: string; text: string; border: string }> = {
  Amazon:          { bg: 'bg-amber-50 dark:bg-amber-900/10', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800/30' },
  Flipkart:        { bg: 'bg-blue-50 dark:bg-blue-900/10', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800/30' },
  Meesho:          { bg: 'bg-pink-50 dark:bg-pink-900/10', text: 'text-pink-700 dark:text-pink-400', border: 'border-pink-200 dark:border-pink-800/30' },
  Myntra:          { bg: 'bg-rose-50 dark:bg-rose-900/10', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-800/30' },
  Ajio:            { bg: 'bg-purple-50 dark:bg-purple-900/10', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800/30' },
  'Tata Cliq':     { bg: 'bg-indigo-50 dark:bg-indigo-900/10', text: 'text-indigo-700 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800/30' },
  'Reliance Digital': { bg: 'bg-sky-50 dark:bg-sky-900/10', text: 'text-sky-700 dark:text-sky-400', border: 'border-sky-200 dark:border-sky-800/30' },
  Croma:           { bg: 'bg-teal-50 dark:bg-teal-900/10', text: 'text-teal-700 dark:text-teal-400', border: 'border-teal-200 dark:border-teal-800/30' },
  JioMart:         { bg: 'bg-cyan-50 dark:bg-cyan-900/10', text: 'text-cyan-700 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-800/30' },
  Afflosaur:       { bg: 'bg-orange-50 dark:bg-orange-900/10', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800/30' },
};

const defaultStyle = { bg: 'bg-gray-50 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-400', border: 'border-gray-200 dark:border-gray-700' };

export function AffiliatePriceTable({ prices, compact = false }: Props) {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const [showPriceHistory, setShowPriceHistory] = useState<string | null>(null);

  const availablePrices = prices.filter(p => p.price !== null).sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  const cheapest = availablePrices[0]?.price ?? 0;
  const mostExpensive = availablePrices[availablePrices.length - 1]?.price ?? 0;
  const savings = mostExpensive - cheapest;

  const handleBuy = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getStockIndicator = (status?: string, count?: number) => {
    switch (status) {
      case 'in-stock':
        return { icon: CheckCircle, color: 'text-green-500', text: 'In Stock' };
      case 'low-stock':
        return { icon: AlertTriangle, color: 'text-red-500', text: `Only ${count} left` };
      case 'out-of-stock':
        return { icon: AlertTriangle, color: 'text-gray-500', text: 'Out of Stock' };
      default:
        return { icon: CheckCircle, color: 'text-green-500', text: 'In Stock' };
    }
  };

  if (compact) {
    return (
      <div className="space-y-1.5">
        {availablePrices.slice(0, 4).map((sp, i) => {
          const style = storeStyles[sp.store] || defaultStyle;
          return (
            <div key={i} className={`flex items-center justify-between px-3 py-2 rounded-xl border ${style.border} ${style.bg}`}>
              <div className="flex items-center gap-2">
                <span className="text-sm">{sp.icon}</span>
                <span className={`text-xs font-bold ${style.text}`}>{sp.store}</span>
                {sp.isBestDeal && <Award className="w-3 h-3 text-orange-500" />}
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-black ${sp.isBestDeal ? 'text-orange-500' : isDark ? 'text-white' : 'text-gray-900'}`}>
                  ₹{sp.price?.toLocaleString()}
                </span>
                <button
                  onClick={() => handleBuy(sp.url)}
                  className={`text-[10px] px-2 py-1 rounded-lg font-bold ${
                    sp.isBestDeal
                      ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white'
                      : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Buy →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Trust Factor */}
      <div className={`p-4 rounded-2xl ${isDark ? 'bg-gray-800/80 backdrop-blur-sm border border-gray-700' : 'bg-white/80 backdrop-blur-sm border border-gray-200'} shadow-lg`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-lg font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              🛒 Smart Price Comparison
            </h3>
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Prices updated 2 minutes ago • Compare across 9+ stores
            </p>
          </div>
          {savings > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg">
              <TrendingDown className="w-3.5 h-3.5" />
              Save ₹{savings.toLocaleString()}
            </div>
          )}
        </div>
      </div>

      {/* Price Cards */}
      <div className="space-y-3">
        {prices.map((sp, i) => {
          const style = storeStyles[sp.store] || defaultStyle;
          const isAvailable = sp.price !== null;
          const discount = sp.originalPrice && sp.price ? Math.round(((sp.originalPrice - sp.price) / sp.originalPrice) * 100) : 0;
          const stockInfo = getStockIndicator(sp.stockStatus, sp.stockCount);
          const StockIcon = stockInfo.icon;

          return (
            <div
              key={i}
              className={`relative p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                sp.isBestDeal
                  ? `${isDark ? 'bg-orange-500/10 border-2 border-orange-500/50' : 'bg-orange-50/80 border-2 border-orange-500/30'} shadow-xl shadow-orange-500/20`
                  : sp.isLocal
                    ? `${isDark ? 'bg-yellow-500/10 border-2 border-yellow-500/50' : 'bg-yellow-50/80 border-2 border-yellow-500/30'} shadow-lg`
                    : `${isDark ? 'bg-gray-800/60 backdrop-blur-sm border border-gray-700' : 'bg-white/70 backdrop-blur-sm border border-gray-200'} shadow-md hover:shadow-lg`
              }`}
            >
              {/* Best Deal Badge */}
              {sp.isBestDeal && (
                <div className="absolute -top-2 left-4 px-3 py-1 bg-linear-to-r from-orange-500 to-amber-500 text-white text-xs font-black rounded-full shadow-lg">
                  🔥 Lowest Price Found!
                </div>
              )}

              {/* Local Advantage Badge */}
              {sp.isLocal && (
                <div className="absolute -top-2 right-4 px-3 py-1 bg-linear-to-r from-yellow-500 to-orange-500 text-white text-xs font-black rounded-full shadow-lg">
                  🎯 Vocal for Local
                </div>
              )}

              <div className="flex items-center justify-between">
                {/* Store Branding */}
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-md ${style.bg} border-2 ${style.border}`}>
                    {sp.icon}
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {sp.store}
                    </h4>
                    {!isAvailable && (
                      <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        Not available
                      </span>
                    )}
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center gap-4">
                  {isAvailable ? (
                    <>
                      {/* Price Section */}
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          {sp.originalPrice && sp.originalPrice > (sp.price ?? 0) && (
                            <span className={`text-sm line-through ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                              ₹{sp.originalPrice.toLocaleString()}
                            </span>
                          )}
                          <span className={`text-xl font-black ${
                            sp.isBestDeal ? 'text-green-600' : isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            ₹{sp.price?.toLocaleString()}
                          </span>
                        </div>
                        {discount > 0 && (
                          <span className="text-xs text-green-600 dark:text-green-400 font-bold">
                            {discount}% OFF
                          </span>
                        )}
                      </div>

                      {/* CTA Button */}
                      <button
                        onClick={() => handleBuy(sp.url)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 hover:shadow-xl ${
                          sp.isBestDeal
                            ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50'
                            : isDark
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 shadow-md'
                              : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md'
                        }`}
                      >
                        <ExternalLink className="w-4 h-4" />
                        Shop Now →
                      </button>
                    </>
                  ) : (
                    <span className={`text-sm italic ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                      Unavailable
                    </span>
                  )}
                </div>
              </div>

              {/* Additional Info Row */}
              {isAvailable && (
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  {/* Delivery Info */}
                  <div className="flex items-center gap-2">
                    {sp.deliveryInfo?.includes('Local') ? (
                      <MapPin className="w-4 h-4 text-orange-500" />
                    ) : (
                      <Truck className="w-4 h-4 text-blue-500" />
                    )}
                    <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {sp.deliveryInfo || 'Standard delivery'}
                    </span>
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center gap-1.5">
                    <StockIcon className={`w-3.5 h-3.5 ${stockInfo.color}`} />
                    <span className={`text-xs font-medium ${stockInfo.color}`}>
                      {stockInfo.text}
                    </span>
                  </div>

                  {/* Price History Link */}
                  <button
                    onClick={() => setShowPriceHistory(showPriceHistory === sp.store ? null : sp.store)}
                    className={`text-xs flex items-center gap-1 hover:underline ${
                      isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    <BarChart3 className="w-3 h-3" />
                    Price History
                  </button>
                </div>
              )}

              {/* Price History Popup */}
              {showPriceHistory === sp.store && (
                <div className="mt-3">
                  <PriceHistory
                    productId={sp.store} // Using store name as product ID for now
                    currentPrice={sp.price ?? 0}
                    productName={`${sp.store} - ${sp.store}`}
                    isDark={isDark}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Dino Mascot Interaction */}
      <div className={`p-3 rounded-xl text-center ${isDark ? 'bg-gray-800/60' : 'bg-orange-50/60'} border ${isDark ? 'border-gray-700' : 'border-orange-200'}`}>
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl animate-bounce">🦕</span>
          <p className={`text-xs italic ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Psst! {availablePrices[0]?.store} has the best deal today! 💡
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className={`p-3 rounded-xl text-center ${isDark ? 'bg-gray-800/40' : 'bg-gray-50/60'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          🔗 Affiliate links • We may earn commission at no extra cost to you
        </p>
      </div>
    </div>
  );
}

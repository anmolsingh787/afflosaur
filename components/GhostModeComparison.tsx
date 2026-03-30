import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  TrendingDown,
  Eye,
  EyeOff,
  X,
  AlertTriangle,
  Sparkles,
  Timer
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface GhostModeComparisonProps {
  productId: string;
  productName: string;
  currentPrice: number;
  onPriceAlert?: (store: string, price: number, savings: number) => void;
}

interface LivePrice {
  store: string;
  icon: string;
  price: number;
  originalPrice?: number;
  lastUpdated: Date;
  trend: 'up' | 'down' | 'stable';
  isExtremeLow: boolean;
}

const GhostModeComparison: React.FC<GhostModeComparisonProps> = ({
  productId: _productId,
  productName: _productName,
  currentPrice,
  onPriceAlert
}) => {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGhostMode, setIsGhostMode] = useState(true);
  const [livePrices, setLivePrices] = useState<LivePrice[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [extremeLowAlerts, setExtremeLowAlerts] = useState<LivePrice[]>([]);
  const intervalRef = useRef<NodeJS.Timeout>(undefined);

  // Simulate live price updates
  const updateLivePrices = () => {
    const stores = [
      { name: 'Amazon', icon: '🛒', basePrice: currentPrice },
      { name: 'Flipkart', icon: '📦', basePrice: currentPrice },
      { name: 'Croma', icon: '🏪', basePrice: currentPrice },
      { name: 'Reliance Digital', icon: '🛍️', basePrice: currentPrice }
    ];

    const newPrices: LivePrice[] = stores.map(store => {
      // Simulate price fluctuations
      const randomChange = (Math.random() - 0.5) * 0.15; // -7.5% to +7.5%
      const seasonalFactor = Math.sin(Date.now() / (1000 * 60 * 60 * 24)) * 0.05; // Daily cycle
      const newPrice = Math.round(store.basePrice * (1 + randomChange + seasonalFactor));

      // Determine trend
      const previousPrice = livePrices.find(p => p.store === store.name)?.price ?? newPrice;
      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (newPrice < previousPrice * 0.98) trend = 'down';
      else if (newPrice > previousPrice * 1.02) trend = 'up';

      // Check for extreme low (below 85% of current price)
      const isExtremeLow = newPrice < currentPrice * 0.85;

      return {
        store: store.name,
        icon: store.icon,
        price: newPrice,
        originalPrice: Math.round(newPrice * 1.1), // Simulate original price
        lastUpdated: new Date(),
        trend,
        isExtremeLow
      };
    });

    setLivePrices(newPrices);
    setLastUpdate(new Date());

    // Check for extreme low alerts
    const newAlerts = newPrices.filter(price => price.isExtremeLow);
    if (newAlerts.length > 0 && extremeLowAlerts.length === 0) {
      setExtremeLowAlerts(newAlerts);
      setIsVisible(true);
      setIsExpanded(true);

      // Trigger alert callback
      newAlerts.forEach(alert => {
        const savings = currentPrice - alert.price;
        onPriceAlert?.(alert.store, alert.price, savings);
      });
    }
  };

  // Start live monitoring
  useEffect(() => {
    updateLivePrices(); // Initial update

    intervalRef.current = setInterval(updateLivePrices, 30000); // Update every 30 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentPrice]);

  // Demo: Trigger an alert after 10 seconds for testing
  useEffect(() => {
    if (isGhostMode) {
      const demoTimer = setTimeout(() => {
        // Simulate an extreme low price alert
        const demoAlert = {
          store: 'Amazon',
          icon: '🛒',
          price: Math.round(currentPrice * 0.75), // 25% off
          originalPrice: currentPrice,
          lastUpdated: new Date(),
          trend: 'down' as const,
          isExtremeLow: true
        };
        setLivePrices(prev => prev.map(p => p.store === 'Amazon' ? demoAlert : p));
        setExtremeLowAlerts([demoAlert]);
        setIsVisible(true);
        setIsExpanded(true);
      }, 10000); // 10 seconds

      return () => clearTimeout(demoTimer);
    }
  }, [isGhostMode, currentPrice]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'down': return <TrendingDown className="w-3 h-3 text-green-500" />;
      case 'up': return <TrendingDown className="w-3 h-3 text-red-500 rotate-180" />;
      default: return <div className="w-3 h-3 rounded-full bg-gray-400" />;
    }
  };

  const getPriceColor = (price: number, isExtremeLow: boolean) => {
    if (isExtremeLow) return 'text-green-600 dark:text-green-400 font-black animate-pulse';
    if (price < currentPrice) return 'text-green-600 dark:text-green-400';
    if (price > currentPrice) return 'text-red-600 dark:text-red-400';
    return isDark ? 'text-white' : 'text-gray-900';
  };

  if (!isVisible && !isGhostMode) return null;

  return (
    <>
      {/* Ghost Mode Toggle Button */}
      {!isVisible && (
        <button
          onClick={() => setIsGhostMode(!isGhostMode)}
          className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 ${
            isGhostMode
              ? 'bg-linear-to-r from-purple-500 to-pink-500 shadow-purple-500/30'
              : 'bg-gray-600 hover:bg-gray-700'
          } text-white flex items-center justify-center`}
          title={isGhostMode ? 'Disable Ghost Mode' : 'Enable Ghost Mode'}
        >
          {isGhostMode ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
        </button>
      )}

      {/* Main Floating Bubble */}
      {isVisible && (
        <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
          isExpanded ? 'w-80' : 'w-16 h-16'
        }`}>
          {/* Collapsed State */}
          {!isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="w-16 h-16 rounded-full bg-linear-to-r from-orange-500 to-red-500 shadow-2xl shadow-orange-500/30 text-white flex items-center justify-center hover:scale-110 transition-all duration-300 animate-pulse"
            >
              <Zap className="w-6 h-6" />
            </button>
          )}

          {/* Expanded State */}
          {isExpanded && (
            <div className={`rounded-2xl shadow-2xl border backdrop-blur-md ${
              isDark
                ? 'bg-gray-900/90 border-gray-700 shadow-gray-900/50'
                : 'bg-white/90 border-gray-200 shadow-gray-200/50'
            } overflow-hidden`}>

              {/* Header */}
              <div className={`p-4 border-b ${
                isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50/50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-linear-to-r from-orange-500 to-red-500 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        🔥 EXTREME LOW ALERT!
                      </h3>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Price dropped dramatically
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsExpanded(false);
                      setExtremeLowAlerts([]);
                    }}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                      isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Alert Content */}
              <div className="p-4 space-y-3">
                {extremeLowAlerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-xl border-2 ${
                      isDark
                        ? 'bg-green-900/20 border-green-500/50'
                        : 'bg-green-50/80 border-green-500/30'
                    } animate-pulse`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{alert.icon}</span>
                        <div>
                          <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {alert.store}
                          </p>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {alert.trend === 'down' ? 'Price Dropped!' : 'Low Price Alert'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-black ${getPriceColor(alert.price, alert.isExtremeLow)}`}>
                          ₹{alert.price.toLocaleString()}
                        </p>
                        {alert.originalPrice && alert.originalPrice > alert.price && (
                          <p className={`text-xs line-through ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            ₹{alert.originalPrice.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Savings Badge */}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        <span className="text-xs text-orange-600 dark:text-orange-400 font-bold">
                          Save ₹{(currentPrice - alert.price).toLocaleString()}
                        </span>
                      </div>
                      <button className="px-3 py-1 bg-linear-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-lg hover:shadow-lg transition-all">
                        Buy Now →
                      </button>
                    </div>
                  </div>
                ))}

                {/* Live Monitoring Status */}
                <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50/50'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <Timer className="w-3 h-3 text-blue-500" />
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        Live monitoring active
                      </span>
                    </div>
                    <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>
                      {lastUpdate.toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                {/* All Prices Summary */}
                <div className="space-y-2">
                  <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    📊 Live Prices:
                  </p>
                  {livePrices.map((price, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <span className="text-sm">{price.icon}</span>
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{price.store}</span>
                        {getTrendIcon(price.trend)}
                      </div>
                      <span className={`font-bold ${getPriceColor(price.price, price.isExtremeLow)}`}>
                        ₹{price.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Background Ghost Mode Indicator */}
      {isGhostMode && !isVisible && (
        <div className="fixed bottom-6 right-6 z-40 pointer-events-none">
          <div className={`w-3 h-3 rounded-full bg-purple-500/60 animate-ping`} />
          <div className={`w-3 h-3 rounded-full bg-purple-500/40 absolute top-0`} />
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <div className={`px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
              isDark ? 'bg-gray-800/90 text-gray-300' : 'bg-white/90 text-gray-700'
            } border ${isDark ? 'border-gray-700' : 'border-gray-200'} shadow-lg backdrop-blur-sm`}>
              👻 Ghost Mode Active
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GhostModeComparison;
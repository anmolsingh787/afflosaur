import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingDown,
  TrendingUp,
  Minus,
  Bell,
  BellOff,
  BarChart3,
  Calendar,
  Tag,
  IndianRupee,
  AlertTriangle,
  Info
} from 'lucide-react';

interface PriceHistoryEntry {
  date: string;
  store: string;
  offerApplied: string;
  finalPrice: number;
  status: 'dropped' | 'stable' | 'increased';
  storeIcon: string;
}

interface PriceHistoryProps {
  productId: string;
  currentPrice: number;
  productName: string;
  isDark?: boolean;
}

const PriceHistory: React.FC<PriceHistoryProps> = ({
  productId: _productId,
  currentPrice,
  productName: _productName,
  isDark = false
}) => {
  const [showPriceAlert, setShowPriceAlert] = useState(false);
  const [alertPrice, setAlertPrice] = useState(Math.round(currentPrice * 0.95));

  // Sample chart data - in real app, this would come from API
  const chartData = useMemo(() => {
    const data = [];
    const basePrice = currentPrice;
    const today = new Date();

    for (let i = 89; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Simulate price fluctuations
      const randomFactor = (Math.random() - 0.5) * 0.3; // -15% to +15%
      const seasonalFactor = Math.sin(i / 30 * Math.PI * 2) * 0.1; // Monthly cycle
      const price = Math.round(basePrice * (1 + randomFactor + seasonalFactor));

      data.push({
        date: date.toISOString().split('T')[0],
        price: Math.max(price, Math.round(basePrice * 0.7)), // Min 70% of current
        displayDate: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
      });
    }
    return data;
  }, [currentPrice]);

  // Sample history table data
  const historyData: PriceHistoryEntry[] = useMemo(() => [
    {
      date: '2024-02-23',
      store: 'Amazon',
      offerApplied: 'Exchange Offer + Bank Discount',
      finalPrice: currentPrice,
      status: 'stable' as const,
      storeIcon: '🛒'
    },
    {
      date: '2024-02-20',
      store: 'Flipkart',
      offerApplied: 'SuperCoin Redemption',
      finalPrice: Math.round(currentPrice * 1.05),
      status: 'increased' as const,
      storeIcon: '📦'
    },
    {
      date: '2024-02-18',
      store: 'Croma',
      offerApplied: 'Festival Sale',
      finalPrice: Math.round(currentPrice * 0.92),
      status: 'dropped' as const,
      storeIcon: '🏪'
    },
    {
      date: '2024-02-15',
      store: 'Reliance Digital',
      offerApplied: 'Card Discount',
      finalPrice: Math.round(currentPrice * 0.95),
      status: 'dropped' as const,
      storeIcon: '🛍️'
    },
    {
      date: '2024-02-12',
      store: 'Vijay Sales',
      offerApplied: 'No offer',
      finalPrice: Math.round(currentPrice * 1.08),
      status: 'increased' as const,
      storeIcon: '🏬'
    }
  ], [currentPrice]);

  // Calculate summary stats
  const stats = useMemo(() => {
    const prices = chartData.map(d => d.price);
    const lowestEver = Math.min(...prices);
    const averagePrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);

    return {
      lowestEver,
      averagePrice,
      currentPrice,
      savings: averagePrice - currentPrice,
      isLowest: currentPrice === lowestEver,
      isBelowAverage: currentPrice < averagePrice
    };
  }, [chartData, currentPrice]);

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload, label: _label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={`p-3 rounded-lg shadow-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {data.displayDate}
          </p>
          <p className="text-sm text-orange-500 font-bold">
            ₹{data.price.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  // Get status icon and color
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'dropped':
        return { icon: TrendingDown, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20', text: 'Price Dropped 📉' };
      case 'increased':
        return { icon: TrendingUp, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20', text: 'Price Increased 📈' };
      default:
        return { icon: Minus, color: 'text-gray-500', bg: 'bg-gray-50 dark:bg-gray-900/20', text: 'Stable ➖' };
    }
  };

  // Dino recommendation logic
  const getDinoRecommendation = () => {
    if (stats.isLowest) {
      return {
        message: "Buy Now! It's near the lowest price ever! 🦖🔥",
        type: 'success' as const,
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-200 dark:border-green-800'
      };
    } else if (stats.isBelowAverage) {
      return {
        message: "Good time to buy! Price is below average. 🦖👍",
        type: 'info' as const,
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800'
      };
    } else {
      return {
        message: "Wait! Price usually drops by 5th of every month. 🦖⏳",
        type: 'warning' as const,
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        border: 'border-orange-200 dark:border-orange-800'
      };
    }
  };

  const dinoRec = getDinoRecommendation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-4 rounded-2xl ${isDark ? 'bg-gray-800/80 backdrop-blur-sm border border-gray-700' : 'bg-white/80 backdrop-blur-sm border border-gray-200'} shadow-lg`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-lg font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <BarChart3 className="w-5 h-5 text-orange-500" />
              Price History & Insights
            </h3>
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Track price trends for the last 90 days • Updated daily
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">📊</span>
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {chartData.length} data points
            </span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/60 backdrop-blur-sm border border-gray-700' : 'bg-white/70 backdrop-blur-sm border border-gray-200'} shadow-md`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Lowest Ever</p>
              <p className="text-lg font-black text-green-600 dark:text-green-400">₹{stats.lowestEver.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/60 backdrop-blur-sm border border-gray-700' : 'bg-white/70 backdrop-blur-sm border border-gray-200'} shadow-md`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Average Price</p>
              <p className="text-lg font-black text-gray-600 dark:text-gray-300">₹{stats.averagePrice.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/60 backdrop-blur-sm border border-gray-700' : 'bg-white/70 backdrop-blur-sm border border-gray-200'} shadow-md`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Current Price</p>
              <p className="text-lg font-black text-blue-600 dark:text-blue-400">₹{stats.currentPrice.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Price Chart */}
      <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800/80 backdrop-blur-sm border border-gray-700' : 'bg-white/80 backdrop-blur-sm border border-gray-200'} shadow-lg`}>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
              <XAxis
                dataKey="displayDate"
                stroke={isDark ? '#9ca3af' : '#6b7280'}
                fontSize={12}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke={isDark ? '#9ca3af' : '#6b7280'}
                fontSize={12}
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#f97316"
                strokeWidth={2}
                fill="url(#priceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Price Alert Toggle */}
      <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/60 backdrop-blur-sm border border-gray-700' : 'bg-white/70 backdrop-blur-sm border border-gray-200'} shadow-md`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showPriceAlert ? (
              <Bell className="w-5 h-5 text-orange-500" />
            ) : (
              <BellOff className="w-5 h-5 text-gray-400" />
            )}
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Price Drop Alert
              </p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Get notified when price drops below your target
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {showPriceAlert && (
              <div className="flex items-center gap-2">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Below</span>
                <input
                  type="number"
                  value={alertPrice}
                  onChange={(e) => setAlertPrice(Number(e.target.value))}
                  className={`w-20 px-2 py-1 text-sm rounded border ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            )}
            <button
              onClick={() => setShowPriceAlert(!showPriceAlert)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                showPriceAlert ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showPriceAlert ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className={`rounded-2xl overflow-hidden ${isDark ? 'bg-gray-800/80 backdrop-blur-sm border border-gray-700' : 'bg-white/80 backdrop-blur-sm border border-gray-200'} shadow-lg`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <Calendar className="w-4 h-4" />
            Detailed Price History
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`sticky top-0 ${isDark ? 'bg-gray-800/90 backdrop-blur-sm' : 'bg-gray-50/90 backdrop-blur-sm'} border-b border-gray-200 dark:border-gray-700`}>
              <tr>
                <th className={`px-4 py-3 text-left text-xs font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Date</th>
                <th className={`px-4 py-3 text-left text-xs font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Store</th>
                <th className={`px-4 py-3 text-left text-xs font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Offer Applied</th>
                <th className={`px-4 py-3 text-left text-xs font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Final Price</th>
                <th className={`px-4 py-3 text-left text-xs font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Status</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((entry, index) => {
                const statusInfo = getStatusInfo(entry.status);
                const StatusIcon = statusInfo.icon;
                const isHugeDrop = entry.status === 'dropped' && (entry.finalPrice / currentPrice) < 0.9;

                return (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0
                        ? isDark ? 'bg-gray-800/30' : 'bg-gray-50/50'
                        : isDark ? 'bg-gray-800/10' : 'bg-white'
                    } hover:${isDark ? 'bg-gray-700/50' : 'bg-gray-100/50'} transition-colors relative`}
                  >
                    <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {new Date(entry.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className={`px-4 py-3 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{entry.storeIcon}</span>
                        {entry.store}
                      </div>
                    </td>
                    <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <div className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {entry.offerApplied}
                      </div>
                    </td>
                    <td className={`px-4 py-3 text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      ₹{entry.finalPrice.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusInfo.text}
                      </div>
                      {isHugeDrop && (
                        <div className="inline-flex items-center gap-1 px-2 py-1 ml-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-bold animate-pulse">
                          <AlertTriangle className="w-3 h-3" />
                          Huge Drop!
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Saur's Recommendation */}
      <div className={`p-4 rounded-xl ${dinoRec.bg} border ${dinoRec.border} shadow-md`}>
        <div className="flex items-start gap-3">
          <div className="text-2xl animate-bounce">🦕</div>
          <div className="flex-1">
            <h4 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Saur's Recommendation
            </h4>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {dinoRec.message}
            </p>
            {dinoRec.type === 'warning' && (
              <div className="flex items-center gap-1 mt-2 text-xs text-orange-600 dark:text-orange-400">
                <Info className="w-3 h-3" />
                Based on 90-day price pattern analysis
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceHistory;
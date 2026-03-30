// ==========================================
// DealDino - Deal Alerts Page
// Subscribe to deal notifications
// ==========================================

import { useState } from 'react';
import { Bell, Zap, Tag, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function DealAlertsPage() {
  const { theme, showNotification, products } = useApp();
  const isDark = theme === 'dark';
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categories = [
    { id: 'electronics', label: 'Electronics', emoji: '📱' },
    { id: 'fashion', label: 'Fashion', emoji: '👗' },
    { id: 'gadgets', label: 'Gadgets', emoji: '⌚' },
    { id: 'home', label: 'Home & Living', emoji: '🏠' },
    { id: 'beauty', label: 'Beauty', emoji: '💄' },
    { id: 'fitness', label: 'Fitness', emoji: '💪' },
    { id: 'books', label: 'Books', emoji: '📚' },
    { id: 'under500', label: 'Under ₹500', emoji: '🏷️' },
  ];

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleSubscribe = () => {
    if (!email) {
      showNotification('Please enter your email! ⚠️');
      return;
    }
    setSubscribed(true);
    showNotification('Subscribed to deal alerts! 🔔');
  };

  // Sample recent deals
  const recentDeals = products.filter(p => p.discount && p.discount >= 20).slice(0, 6);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 py-6">
        <div className="text-5xl sm:text-6xl">🔔</div>
        <h1 className={`text-3xl sm:text-4xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Deal Alerts
        </h1>
        <p className={`text-sm sm:text-base max-w-xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Never miss a deal again! Get instant notifications when prices drop 
          on products you care about. 100% free, no spam.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: <Zap className="w-5 h-5" />, label: 'Instant Alerts', desc: 'Get notified in seconds' },
          { icon: <Tag className="w-5 h-5" />, label: 'Price Drops', desc: 'Know when prices fall' },
          { icon: <TrendingUp className="w-5 h-5" />, label: 'Trending', desc: 'Hot deals first' },
          { icon: <Clock className="w-5 h-5" />, label: 'Flash Sales', desc: 'Limited time offers' },
        ].map((feat) => (
          <div key={feat.label} className={`p-4 rounded-2xl border text-center ${
            isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${
              isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
            }`}>
              {feat.icon}
            </div>
            <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{feat.label}</p>
            <p className={`text-[10px] sm:text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{feat.desc}</p>
          </div>
        ))}
      </div>

      {/* Subscribe Form */}
      <div className={`p-5 sm:p-8 rounded-2xl border ${
        isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        {subscribed ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              You're subscribed! 🎉
            </h3>
            <p className={`text-sm max-w-md mx-auto ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              We'll send you the best deals based on your preferences. 
              Check your inbox for a welcome email!
            </p>
            <button
              onClick={() => { setSubscribed(false); setEmail(''); setSelectedCategories([]); }}
              className={`text-sm px-4 py-2 rounded-xl border ${
                isDark ? 'border-gray-700 text-gray-400 hover:bg-gray-800' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Update Preferences
            </button>
          </div>
        ) : (
          <>
            <h2 className={`text-lg sm:text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Bell className="w-5 h-5 inline mr-2 text-emerald-500" />
              Subscribe to Deal Alerts
            </h2>
            <p className={`text-sm mb-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Choose your categories and get notified when deals drop!
            </p>

            {/* Category Selection */}
            <div className="mb-5">
              <p className={`text-xs font-semibold mb-2.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Select categories (optional):
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95 ${
                      selectedCategories.includes(cat.id)
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                        : isDark
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat.emoji} {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Email Input */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                id="deal-alerts-email"
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className={`flex-1 px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
                  isDark
                    ? 'bg-gray-900 border-gray-700 text-white focus:border-emerald-500 placeholder:text-gray-600'
                    : 'bg-gray-50 border-gray-200 focus:border-emerald-500 placeholder:text-gray-400'
                }`}
              />
              <button
                onClick={handleSubscribe}
                className="px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all active:scale-95 shrink-0"
              >
                🔔 Subscribe Free
              </button>
            </div>
            <p className={`text-[10px] sm:text-xs mt-2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
              No spam, ever. Unsubscribe anytime. We respect your inbox.
            </p>
          </>
        )}
      </div>

      {/* Recent Deals Preview */}
      <div>
        <h2 className={`text-lg sm:text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          🔥 Recent Deals You Would Have Received
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {recentDeals.map(product => {
            const bestPrice = Math.min(...product.prices.map(p => p.price));
            return (
              <div key={product.id} className={`p-4 rounded-2xl border ${
                isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  <img src={product.image} alt={product.title} className="w-14 h-14 rounded-xl object-cover" loading="lazy" />
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold line-clamp-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {product.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-sm font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        ₹{bestPrice.toLocaleString('en-IN')}
                      </span>
                      {product.discount && (
                        <span className="text-[10px] font-semibold text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded">
                          {product.discount}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Afflosaur - Affiliate Disclosure Page
// ==========================================

import { useApp } from '../context/AppContext';

export function AffiliateDisclosurePage() {
  const { theme, setPage } = useApp();
  const isDark = theme === 'dark';

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 py-6">
        <h1 className={`text-3xl sm:text-4xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          🔗 Affiliate Disclosure
        </h1>
        <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          Last updated: January 2024
        </p>
        <p className={`text-sm sm:text-base max-w-xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Transparency is important to us. Here's how we earn and how it affects you.
        </p>
      </div>

      {/* Quick Summary */}
      <div className={`p-5 rounded-2xl border ${
        isDark ? 'bg-amber-900/20 border-amber-800/30' : 'bg-amber-50 border-amber-200'
      }`}>
        <h3 className={`font-bold text-sm mb-2 ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
          🦖 In Simple Words
        </h3>
        <p className={`text-sm leading-relaxed ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
          When you click on certain product links on Afflosaur and make a purchase on sites like Amazon, 
          Flipkart, or Meesho, we may earn a small commission. This does NOT cost you anything extra — 
          the price you pay remains the same. This is how we keep Afflosaur free for everyone! 💚
        </p>
      </div>

      {/* How It Works */}
      <div className={`p-5 sm:p-6 rounded-2xl border ${
        isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h2 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          ⚙️ How Affiliate Links Work
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <span className="text-3xl">1️⃣</span>
            <p className={`text-sm font-semibold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>You Click</p>
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              You click a product link on DealDino
            </p>
          </div>
          <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <span className="text-3xl">2️⃣</span>
            <p className={`text-sm font-semibold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>You Buy</p>
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              You purchase the product on the partner store
            </p>
          </div>
          <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <span className="text-3xl">3️⃣</span>
            <p className={`text-sm font-semibold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>We Earn</p>
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              We get a small commission (you pay the same price!)
            </p>
          </div>
        </div>
      </div>

      {/* Partner Programs */}
      <div className={`p-5 sm:p-6 rounded-2xl border ${
        isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h2 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          🤝 Our Affiliate Partners
        </h2>
        <div className="space-y-3">
          {[
            { name: 'Amazon Associates', desc: 'Amazon.in affiliate program', badge: '🛒' },
            { name: 'Flipkart Affiliate', desc: 'Flipkart.com affiliate program', badge: '🏪' },
            { name: 'Meesho Partner', desc: 'Meesho affiliate program', badge: '📦' },
            { name: 'Other Partners', desc: 'Various Indian ecommerce programs', badge: '🔗' },
          ].map((partner) => (
            <div key={partner.name} className={`flex items-center gap-3 p-3 rounded-xl ${
              isDark ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
              <span className="text-2xl">{partner.badge}</span>
              <div>
                <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{partner.name}</p>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{partner.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Our Promise */}
      <div className={`p-5 sm:p-6 rounded-2xl border ${
        isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h2 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          💚 Our Promise to You
        </h2>
        <ul className="space-y-3">
          {[
            'Affiliate commissions NEVER influence our product rankings or "Best Deal" badges.',
            'We always show the actual lowest price, even if it means less commission for us.',
            'User reviews and blog posts are NOT influenced by affiliate partnerships.',
            'We clearly label affiliate products vs direct-sale products on every page.',
            'Your trust matters more than any commission. Period.',
          ].map((item, i) => (
            <li key={i} className={`text-sm flex gap-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              <span className="text-emerald-500 font-bold shrink-0">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* How to Identify */}
      <div className={`p-5 sm:p-6 rounded-2xl border ${
        isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h2 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          🏷️ How to Identify Affiliate Products
        </h2>
        <p className={`text-sm mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          On Afflosaur, you'll see clear labels:
        </p>
        <div className="space-y-2.5">
          <div className="flex items-center gap-3">
            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium">
              Affiliate
            </span>
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              = Product sold by partner store
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium">
              My Store
            </span>
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              = Sold directly by Afflosaur
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 font-medium">
              Mixed
            </span>
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              = Available on partner stores AND our store
            </span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-6 space-y-3">
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Questions? Contact us at{' '}
          <span className="text-emerald-500 font-medium">hello@afflosaur.com</span>
        </p>
        <button
          onClick={() => setPage('store')}
          className="px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium text-sm hover:shadow-lg transition-all active:scale-95"
        >
          🏪 Start Shopping
        </button>
      </div>
    </div>
  );
}

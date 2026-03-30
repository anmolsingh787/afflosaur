// ==========================================
// Afflosaur - Prayagraj Local Shop Page
// Direct purchase only for Prayagraj
// ==========================================

import { MapPin, Truck, Clock, Heart, Shield, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';

export function PrayagrajPage() {
  const { theme, products } = useApp();
  const isDark = theme === 'dark';

  const prayagrajProducts = products.filter(p => p.isPrayagraj);
  const allDirectProducts = products.filter(p => p.type === 'direct');

  const features = [
    { icon: <Truck className="w-5 h-5" />, title: 'Same Day Delivery', desc: 'Free delivery in Prayagraj city' },
    { icon: <Clock className="w-5 h-5" />, title: 'Quick Dispatch', desc: 'Orders dispatched within 2 hours' },
    { icon: <Heart className="w-5 h-5" />, title: 'Support Local', desc: 'Buy from Prayagraj artisans' },
    { icon: <Shield className="w-5 h-5" />, title: 'COD Available', desc: 'Cash on delivery for all orders' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <section className={`rounded-2xl sm:rounded-3xl overflow-hidden ${
        isDark ? 'bg-linear-to-br from-orange-900/40 via-amber-900/30 to-gray-800' : 'bg-linear-to-br from-orange-100 via-amber-50 to-yellow-50'
      }`}>
        <div className="px-5 py-6 sm:px-8 sm:py-10">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-6 h-6 text-orange-500" />
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-200 text-orange-800'
            }`}>
              🏛️ PRAYAGRAJ EXCLUSIVE
            </span>
          </div>
          
          <h1 className={`text-2xl sm:text-4xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Prayagraj Local Shop
          </h1>
          <p className={`text-sm mt-2 max-w-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Authentic local products from Sangam City. Direct purchase with same-day delivery in Prayagraj.
            Support local artisans and small businesses! 🙏
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5">
            {features.map((feat, i) => (
              <div key={i} className={`p-3 rounded-xl ${
                isDark ? 'bg-gray-800/60' : 'bg-white/80'
              }`}>
                <div className="text-orange-500 mb-1">{feat.icon}</div>
                <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{feat.title}</p>
                <p className={`text-[10px] mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Info Bar */}
      <div className={`flex items-center gap-3 p-3 rounded-xl text-xs sm:text-sm ${
        isDark ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-orange-50 text-orange-700 border border-orange-200'
      }`}>
        <span className="text-xl">🏍️</span>
        <span className="font-semibold">Delivery available only in Prayagraj city & nearby areas</span>
        <span className="ml-auto flex items-center gap-1 shrink-0">
          <Phone className="w-3 h-3" />
          <span className="font-bold">Contact for bulk orders</span>
        </span>
      </div>

      {/* Prayagraj Exclusive Products */}
      <section>
        <h2 className={`text-lg sm:text-xl font-black mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          📍 Prayagraj Exclusive Products
        </h2>
        {prayagrajProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {prayagrajProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className={`text-center py-12 rounded-2xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
            <p className="text-4xl mb-3">📍</p>
            <p className={`font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Coming soon! More Prayagraj products on the way.</p>
          </div>
        )}
      </section>

      {/* Other Direct Products */}
      <section>
        <h2 className={`text-lg sm:text-xl font-black mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          🛍️ All Direct Purchase Products
        </h2>
        <p className={`text-xs mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          These products ship across India. Prayagraj orders get priority dispatch.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {allDirectProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Seller CTA */}
      <section className={`rounded-2xl p-5 sm:p-8 text-center ${
        isDark ? 'bg-linear-to-r from-orange-900/30 to-amber-900/30 border border-orange-500/20' : 'bg-linear-to-r from-orange-500 to-amber-500'
      }`}>
        <h2 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-white'}`}>
          Prayagraj ka business hai? 🏪
        </h2>
        <p className={`mt-2 text-sm max-w-md mx-auto ${isDark ? 'text-orange-200/70' : 'text-orange-100'}`}>
          List your products on Afflosaur. Reach thousands of local customers. Zero listing fees!
        </p>
        <button className="mt-4 px-6 py-3 bg-white text-orange-600 rounded-xl font-bold text-sm hover:shadow-lg transition-all active:scale-95">
          📞 Contact Us to List
        </button>
      </section>
    </div>
  );
}

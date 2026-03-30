// ==========================================
// DealDino - Comparisons Page
// Product vs Product comparisons
// ==========================================

import { useApp } from '../context/AppContext';

export function ComparisonsPage() {
  const { theme, setPage, setSelectedBlogId } = useApp();
  const isDark = theme === 'dark';

  const comparisons = [
    {
      id: 'cmp-1',
      productA: { name: 'Noise ColorFit Pro 4', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop', price: '₹2,599' },
      productB: { name: 'Fire-Boltt Phoenix', image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=200&h=200&fit=crop', price: '₹2,799' },
      winner: 'A',
      category: 'Smartwatches',
      views: '8.3K',
      date: 'Feb 2024',
    },
    {
      id: 'cmp-2',
      productA: { name: 'boAt Airdopes 141', image: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=200&h=200&fit=crop', price: '₹799' },
      productB: { name: 'Noise Buds VS104', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop', price: '₹899' },
      winner: 'B',
      category: 'Earbuds',
      views: '12.1K',
      date: 'Jan 2024',
    },
    {
      id: 'cmp-3',
      productA: { name: 'Mi Power Bank 3i', image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=200&h=200&fit=crop', price: '₹1,399' },
      productB: { name: 'Ambrane 20000mAh', image: 'https://images.unsplash.com/photo-1586953208270-767889fa9b4b?w=200&h=200&fit=crop', price: '₹1,299' },
      winner: 'A',
      category: 'Power Banks',
      views: '5.7K',
      date: 'Feb 2024',
    },
    {
      id: 'cmp-4',
      productA: { name: 'JBL Go 3', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&h=200&fit=crop', price: '₹2,999' },
      productB: { name: 'boAt Stone 352', image: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=200&h=200&fit=crop', price: '₹1,299' },
      winner: 'A',
      category: 'Speakers',
      views: '9.4K',
      date: 'Jan 2024',
    },
    {
      id: 'cmp-5',
      productA: { name: 'Redmi Note 13', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop', price: '₹14,999' },
      productB: { name: 'Samsung Galaxy M34', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200&h=200&fit=crop', price: '₹15,499' },
      winner: 'A',
      category: 'Smartphones',
      views: '15.2K',
      date: 'Feb 2024',
    },
    {
      id: 'cmp-6',
      productA: { name: 'Nike Revolution 6', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop', price: '₹3,299' },
      productB: { name: 'Adidas Runfalcon 3', image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=200&h=200&fit=crop', price: '₹3,499' },
      winner: 'B',
      category: 'Shoes',
      views: '4.8K',
      date: 'Dec 2023',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 py-6">
        <h1 className={`text-3xl sm:text-4xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          ⚡ Product Comparisons
        </h1>
        <p className={`text-sm sm:text-base max-w-xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Side-by-side product comparisons with detailed specs, pricing, and our expert verdict. 
          Find out which product is truly worth your money!
        </p>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {['All', '📱 Phones', '⌚ Wearables', '🎧 Audio', '🔋 Power', '👟 Shoes', '💻 Laptops'].map(cat => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all active:scale-95 ${
              cat === 'All'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                : isDark
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Comparisons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {comparisons.map(cmp => (
          <button
            key={cmp.id}
            onClick={() => {
              setSelectedBlogId('b2');
              setPage('blogpost');
            }}
            className={`text-left rounded-2xl border overflow-hidden transition-all hover:shadow-lg active:scale-[0.98] ${
              isDark ? 'bg-gray-800/50 border-gray-700 hover:border-emerald-500/50' : 'bg-white border-gray-200 hover:border-emerald-300'
            }`}
          >
            {/* VS Header */}
            <div className={`px-4 py-2.5 flex items-center justify-between ${
              isDark ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
              }`}>
                {cmp.category}
              </span>
              <span className={`text-[10px] ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                👁️ {cmp.views}
              </span>
            </div>

            {/* Products VS */}
            <div className="p-4">
              <div className="flex items-center gap-3">
                {/* Product A */}
                <div className={`flex-1 text-center p-3 rounded-xl ${
                  cmp.winner === 'A'
                    ? isDark ? 'bg-emerald-900/20 ring-1 ring-emerald-500/30' : 'bg-emerald-50 ring-1 ring-emerald-200'
                    : isDark ? 'bg-gray-900' : 'bg-gray-50'
                }`}>
                  <div className="w-14 h-14 mx-auto rounded-xl overflow-hidden mb-2">
                    <img src={cmp.productA.image} alt={cmp.productA.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <p className={`text-xs font-semibold line-clamp-2 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {cmp.productA.name}
                  </p>
                  <p className={`text-xs font-bold mt-1 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    {cmp.productA.price}
                  </p>
                  {cmp.winner === 'A' && (
                    <span className="inline-block mt-1.5 text-[9px] px-2 py-0.5 bg-emerald-500 text-white rounded-full font-semibold">
                      🏆 WINNER
                    </span>
                  )}
                </div>

                {/* VS Badge */}
                <div className="shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-xs ${
                    isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600'
                  }`}>
                    VS
                  </div>
                </div>

                {/* Product B */}
                <div className={`flex-1 text-center p-3 rounded-xl ${
                  cmp.winner === 'B'
                    ? isDark ? 'bg-emerald-900/20 ring-1 ring-emerald-500/30' : 'bg-emerald-50 ring-1 ring-emerald-200'
                    : isDark ? 'bg-gray-900' : 'bg-gray-50'
                }`}>
                  <div className="w-14 h-14 mx-auto rounded-xl overflow-hidden mb-2">
                    <img src={cmp.productB.image} alt={cmp.productB.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <p className={`text-xs font-semibold line-clamp-2 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {cmp.productB.name}
                  </p>
                  <p className={`text-xs font-bold mt-1 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    {cmp.productB.price}
                  </p>
                  {cmp.winner === 'B' && (
                    <span className="inline-block mt-1.5 text-[9px] px-2 py-0.5 bg-emerald-500 text-white rounded-full font-semibold">
                      🏆 WINNER
                    </span>
                  )}
                </div>
              </div>

              {/* Read More */}
              <div className={`mt-3 pt-3 border-t text-center ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                <span className="text-xs font-medium text-emerald-500">
                  Read Full Comparison →
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Request Comparison */}
      <div className={`text-center p-6 rounded-2xl border ${
        isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          🤔 Want us to compare something?
        </h3>
        <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Request a comparison or write your own! Help the community make better purchase decisions.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => setPage('write')}
            className="px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium text-sm hover:shadow-lg transition-all active:scale-95"
          >
            ✍️ Write a Comparison
          </button>
          <button
            onClick={() => setPage('contact')}
            className={`px-6 py-3 rounded-xl font-medium text-sm border transition-all active:scale-95 ${
              isDark ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            📧 Request a Comparison
          </button>
        </div>
      </div>
    </div>
  );
}

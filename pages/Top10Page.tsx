// ==========================================
// DealDino - Top 10 Lists Page
// Curated top 10 product lists
// ==========================================

import { useApp } from '../context/AppContext';

export function Top10Page() {
  const { theme, setPage, setSelectedBlogId } = useApp();
  const isDark = theme === 'dark';

  const top10Lists = [
    {
      id: 'list-1',
      title: 'Top 10 Budget Wireless Earbuds Under ₹1000',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=250&fit=crop',
      category: 'Audio',
      items: 10,
      views: '12.5K',
      date: 'Feb 2024',
      emoji: '🎧',
      tags: ['earbuds', 'budget', 'wireless'],
    },
    {
      id: 'list-2',
      title: 'Top 10 Smartwatches Under ₹3000 in India',
      image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=250&fit=crop',
      category: 'Wearables',
      items: 10,
      views: '8.3K',
      date: 'Jan 2024',
      emoji: '⌚',
      tags: ['smartwatch', 'budget', 'fitness'],
    },
    {
      id: 'list-3',
      title: 'Top 10 Power Banks with Fast Charging',
      image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=250&fit=crop',
      category: 'Accessories',
      items: 10,
      views: '6.1K',
      date: 'Jan 2024',
      emoji: '🔋',
      tags: ['powerbank', 'charging', 'portable'],
    },
    {
      id: 'list-4',
      title: 'Top 10 Laptop Bags Under ₹1500',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=250&fit=crop',
      category: 'Fashion',
      items: 10,
      views: '4.7K',
      date: 'Dec 2023',
      emoji: '🎒',
      tags: ['bags', 'laptop', 'fashion'],
    },
    {
      id: 'list-5',
      title: 'Top 10 Bluetooth Speakers Under ₹2000',
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=250&fit=crop',
      category: 'Audio',
      items: 10,
      views: '9.8K',
      date: 'Feb 2024',
      emoji: '🔊',
      tags: ['speaker', 'bluetooth', 'portable'],
    },
    {
      id: 'list-6',
      title: 'Top 10 Phone Cases for iPhone 15',
      image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=250&fit=crop',
      category: 'Accessories',
      items: 10,
      views: '5.2K',
      date: 'Jan 2024',
      emoji: '📱',
      tags: ['phone', 'case', 'iphone'],
    },
    {
      id: 'list-7',
      title: 'Top 10 Gaming Mice Under ₹1000',
      image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=250&fit=crop',
      category: 'Gaming',
      items: 10,
      views: '7.4K',
      date: 'Feb 2024',
      emoji: '🖱️',
      tags: ['gaming', 'mouse', 'budget'],
    },
    {
      id: 'list-8',
      title: 'Top 10 Yoga Mats for Home Workout',
      image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=400&h=250&fit=crop',
      category: 'Fitness',
      items: 10,
      views: '3.9K',
      date: 'Dec 2023',
      emoji: '🧘',
      tags: ['yoga', 'fitness', 'home'],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 py-6">
        <h1 className={`text-3xl sm:text-4xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          🏆 Top 10 Lists
        </h1>
        <p className={`text-sm sm:text-base max-w-xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Expert-curated and community-voted lists of the best products in every category. 
          Updated regularly with latest deals!
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {['All', '🎧 Audio', '⌚ Wearables', '📱 Accessories', '🎮 Gaming', '💪 Fitness', '👗 Fashion'].map(cat => (
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

      {/* Lists Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {top10Lists.map(list => (
          <button
            key={list.id}
            onClick={() => {
              setSelectedBlogId('b1');
              setPage('blogpost');
            }}
            className={`text-left rounded-2xl border overflow-hidden transition-all hover:shadow-lg active:scale-[0.98] ${
              isDark ? 'bg-gray-800/50 border-gray-700 hover:border-emerald-500/50' : 'bg-white border-gray-200 hover:border-emerald-300'
            }`}
          >
            {/* Image */}
            <div className="relative h-36 sm:h-40 overflow-hidden">
              <img src={list.image} alt={list.title} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500 text-white">
                  TOP 10
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className="text-3xl">{list.emoji}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}>
                  {list.category}
                </span>
                <span className={`text-[10px] ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                  {list.date}
                </span>
              </div>
              <h3 className={`text-sm sm:text-base font-bold leading-tight line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {list.title}
              </h3>
              <div className="flex items-center justify-between mt-3">
                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  📊 {list.items} products compared
                </span>
                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  👁️ {list.views} views
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {list.tags.map(tag => (
                  <span key={tag} className={`text-[10px] px-1.5 py-0.5 rounded ${
                    isDark ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-50 text-gray-500'
                  }`}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* CTA */}
      <div className={`text-center p-6 rounded-2xl border ${
        isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          ✍️ Want to create your own Top 10 list?
        </h3>
        <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Share your expertise with the community! Write a list and help others find the best products.
        </p>
        <button
          onClick={() => setPage('write')}
          className="px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium text-sm hover:shadow-lg transition-all active:scale-95"
        >
          Write a Top 10 List
        </button>
      </div>
    </div>
  );
}

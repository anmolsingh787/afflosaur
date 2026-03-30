// ==========================================
// Afflosaur - About Us Page
// ==========================================

import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export function AboutPage() {
  const { theme, setPage } = useApp();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  // 🔒 Hidden admin trigger — click dino 5 times quickly
  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDinoClick = () => {
    clickCount.current += 1;
    if (clickTimer.current) clearTimeout(clickTimer.current);
    if (clickCount.current >= 5) {
      clickCount.current = 0;
      navigate('/admin/login');
      return;
    }
    clickTimer.current = setTimeout(() => { clickCount.current = 0; }, 1000);
  };

  const stats = [
    { label: 'Products Listed', value: '10,000+', emoji: '📦' },
    { label: 'Happy Users', value: '50,000+', emoji: '😊' },
    { label: 'Deals Found', value: '1,00,000+', emoji: '🏷️' },
    { label: 'Money Saved', value: '₹2Cr+', emoji: '💰' },
  ];

  const team = [
    { name: 'Founder', role: 'CEO & Product', emoji: '🦕', desc: 'Building India\'s best deal platform' },
    { name: 'Tech Team', role: 'Engineering', emoji: '👨‍💻', desc: 'Making things fast & reliable' },
    { name: 'Community', role: 'Content & Reviews', emoji: '✍️', desc: 'Real reviews from real users' },
    { name: 'Saur AI', role: 'Deal Hunter Bot', emoji: '🤖', desc: 'Finding deals 24/7 for you' },
  ];

  const values = [
    { title: 'Honest Deals', desc: 'We never fake prices or inflate MRP. Every deal is verified.', emoji: '✅' },
    { title: 'User First', desc: 'Our platform is built for users, not advertisers.', emoji: '❤️' },
    { title: 'Made in India', desc: 'By Indians, for Indians. Prayagraj se poore Bharat tak.', emoji: '🇮🇳' },
    { title: 'Community Driven', desc: 'Users write reviews, submit deals, and help each other save.', emoji: '🤝' },
  ];

  return (
    <div className="space-y-10 sm:space-y-16 max-w-4xl mx-auto">
      <div className="text-center space-y-4 py-8 sm:py-12">
        <div
          className="text-6xl sm:text-7xl animate-bounce select-none cursor-default"
          onClick={handleDinoClick}
          title=""
        >🦕</div>
        <h1 className={`text-3xl sm:text-5xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
          About{' '}
          <span className="bg-linear-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            Afflosaur
          </span>
        </h1>
        <p className={`text-base sm:text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          India's smartest deal-hunting platform. We compare prices across Amazon, Flipkart, Meesho
          and more — plus Prayagraj local products with same-day delivery!
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`text-center p-4 sm:p-6 rounded-2xl border ${
            isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <span className="text-3xl sm:text-4xl">{stat.emoji}</span>
            <p className={`text-xl sm:text-2xl font-black mt-2 ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
              {stat.value}
            </p>
            <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div className={`p-6 sm:p-8 rounded-2xl border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h2 className={`text-xl sm:text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>📖 Our Story</h2>
        <div className={`space-y-4 text-sm sm:text-base leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          <p>Afflosaur was born in Prayagraj from a simple frustration — comparing prices across Indian ecommerce was too hard.</p>
          <p>We built Afflosaur 🦕 — a single platform where you can compare prices, read real reviews, discover trending products, shop local Prayagraj items, and find the absolute best deals.</p>
          <p>We started as a small project by a solo creator from Prayagraj, and now we're building India's smartest shopping community.</p>
        </div>
      </div>

      <div>
        <h2 className={`text-xl sm:text-2xl font-bold mb-6 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>🌟 What We Stand For</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {values.map((v) => (
            <div key={v.title} className={`p-5 rounded-2xl border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{v.emoji}</span>
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{v.title}</h3>
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className={`text-xl sm:text-2xl font-bold mb-6 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>👥 The Team</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {team.map((t) => (
            <div key={t.name} className={`text-center p-4 sm:p-5 rounded-2xl border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
              <span className="text-4xl sm:text-5xl">{t.emoji}</span>
              <h3 className={`font-bold mt-2 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{t.name}</h3>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>{t.role}</p>
              <p className={`text-[11px] mt-1.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center py-8 space-y-4">
        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Ready to start saving? 🎉</h3>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => setPage('store')} className="px-6 py-3 bg-linear-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold hover:shadow-lg transition-all active:scale-95">
            🏪 Explore Store
          </button>
          <button onClick={() => setPage('contact')} className={`px-6 py-3 rounded-xl font-bold border transition-all active:scale-95 ${isDark ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
            📧 Contact Us
          </button>
        </div>
      </div>
    </div>
  );
}

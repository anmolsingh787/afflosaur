import { useState, useEffect } from 'react';
import { Gift, Sparkles, Clock, Eye } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';
import { useApp } from '../context/AppContext';

export function MysteryDealBox() {
  const { mysteryDeal, revealMysteryDeal } = useGamification();
  const { theme, showNotification, setPage, setSelectedProductId } = useApp();
  const isDark = theme === 'dark';
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (!mysteryDeal) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = mysteryDeal.expiresAt.getTime() - now;

      if (distance < 0) {
        setTimeLeft('EXPIRED');
        clearInterval(timer);
        return;
      }

      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [mysteryDeal]);

  const handleReveal = () => {
    if (!mysteryDeal || mysteryDeal.revealed) return;

    revealMysteryDeal();
    showNotification('🎉 Mystery deal revealed! Check it out!');
  };

  if (!mysteryDeal) return null;

  const savings = mysteryDeal.originalPrice - mysteryDeal.mysteryPrice;
  const savingsPercent = Math.round((savings / mysteryDeal.originalPrice) * 100);

  return (
    <div className={`relative p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
      isDark
        ? 'bg-linear-to-br from-purple-900/80 to-pink-900/80 border border-purple-500/30'
        : 'bg-linear-to-br from-purple-100 to-pink-100 border border-purple-200'
    } shadow-xl backdrop-blur-sm overflow-hidden`}>

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-400/30 rounded-full animate-ping"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '3s'
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-linear-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
              🎁 Daily Mystery Deal
            </h3>
            <p className={`text-sm ${isDark ? 'text-purple-200' : 'text-purple-700'}`}>
              Unlock your surprise savings!
            </p>
          </div>
        </div>

        {/* Timer */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold ${
          timeLeft === 'EXPIRED'
            ? 'bg-red-500/20 text-red-400'
            : 'bg-orange-500/20 text-orange-400'
        }`}>
          <Clock className="w-4 h-4" />
          {timeLeft}
        </div>
      </div>

      {/* Mystery Content */}
      <div className="relative z-10">
        {!mysteryDeal.revealed ? (
          <div className="text-center py-8">
            <div className="mb-6">
              <div className={`w-24 h-24 mx-auto rounded-full ${
                isHovered
                  ? 'bg-linear-to-r from-purple-400 to-pink-400 shadow-2xl shadow-purple-500/30'
                  : 'bg-linear-to-r from-purple-300 to-pink-300'
              } flex items-center justify-center transition-all duration-300 cursor-pointer`}
                   onMouseEnter={() => setIsHovered(true)}
                   onMouseLeave={() => setIsHovered(false)}
                   onClick={handleReveal}>
                <Sparkles className={`w-10 h-10 text-white transition-transform duration-300 ${
                  isHovered ? 'scale-110 rotate-12' : ''
                }`} />
              </div>
            </div>

            <h4 className={`text-xl font-black mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              ???
            </h4>
            <p className={`text-sm mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Tap to reveal today's mystery discount!
            </p>

            <div className="flex items-center justify-center gap-2 text-sm">
              <Eye className="w-4 h-4 text-purple-500" />
              <span className={isDark ? 'text-purple-300' : 'text-purple-600'}>
                Hint: {mysteryDeal.discount}% off on {mysteryDeal.store}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-bold shadow-lg">
                <Sparkles className="w-4 h-4" />
                REVEALED!
              </div>
            </div>

            <h4 className={`text-2xl font-black mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {mysteryDeal.title}
            </h4>

            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-center">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Original</p>
                <p className={`text-lg font-bold line-through ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  ₹{mysteryDeal.originalPrice.toLocaleString()}
                </p>
              </div>

              <div className="w-8 h-8 rounded-full bg-linear-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white animate-spin" />
              </div>

              <div className="text-center">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Mystery Price</p>
                <p className="text-2xl font-black text-green-600 dark:text-green-400">
                  ₹{mysteryDeal.mysteryPrice.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="px-3 py-1 bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-bold">
                Save ₹{savings.toLocaleString()} ({savingsPercent}%)
              </div>
            </div>

            <button
              onClick={() => {
                // navigate to product detail
                if (mysteryDeal?.productId) {
                  setPage('product');
                  setSelectedProductId(mysteryDeal.productId);
                }
              }}
              className="px-6 py-3 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-lg transition-all active:scale-95">
              🛒 Claim This Deal →
            </button>
          </div>
        )}
      </div>

      {/* Bottom hint */}
      <div className="relative z-10 mt-4 pt-4 border-t border-purple-200/30 dark:border-purple-700/30">
        <p className={`text-xs text-center ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>
          💡 New mystery deal every day at midnight!
        </p>
      </div>
    </div>
  );
}
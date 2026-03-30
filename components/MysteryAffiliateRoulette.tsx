import { useState, useEffect, useRef } from 'react';
import { Shuffle, Sparkles } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';
import { useApp } from '../context/AppContext';

interface RouletteItem {
  id: string;
  type: 'coupon' | 'points' | 'premium' | 'mystery';
  value: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  emoji: string;
  description: string;
  color: string;
}

const ROULETTE_ITEMS: RouletteItem[] = [
  // Common (60% chance)
  { id: 'coupon5', type: 'coupon', value: '5%', rarity: 'common', emoji: '🎫', description: '5% off coupon', color: 'from-gray-400 to-gray-500' },
  { id: 'points10', type: 'points', value: '10', rarity: 'common', emoji: '💰', description: '10 coins', color: 'from-gray-400 to-gray-500' },
  { id: 'coupon10', type: 'coupon', value: '10%', rarity: 'common', emoji: '🎫', description: '10% off coupon', color: 'from-gray-400 to-gray-500' },
  { id: 'points25', type: 'points', value: '25', rarity: 'common', emoji: '💰', description: '25 coins', color: 'from-gray-400 to-gray-500' },

  // Rare (30% chance)
  { id: 'coupon20', type: 'coupon', value: '20%', rarity: 'rare', emoji: '🎫', description: '20% off coupon', color: 'from-blue-400 to-blue-500' },
  { id: 'points50', type: 'points', value: '50', rarity: 'rare', emoji: '💰', description: '50 coins', color: 'from-blue-400 to-blue-500' },
  { id: 'premium1', type: 'premium', value: '1', rarity: 'rare', emoji: '👑', description: '1 day premium', color: 'from-blue-400 to-blue-500' },

  // Epic (8% chance)
  { id: 'coupon30', type: 'coupon', value: '30%', rarity: 'epic', emoji: '🎫', description: '30% off coupon', color: 'from-purple-400 to-purple-500' },
  { id: 'points100', type: 'points', value: '100', rarity: 'epic', emoji: '💰', description: '100 coins', color: 'from-purple-400 to-purple-500' },
  { id: 'premium3', type: 'premium', value: '3', rarity: 'epic', emoji: '👑', description: '3 days premium', color: 'from-purple-400 to-purple-500' },

  // Legendary (2% chance)
  { id: 'coupon50', type: 'coupon', value: '50%', rarity: 'legendary', emoji: '🎫', description: '50% off coupon', color: 'from-yellow-400 to-orange-500' },
  { id: 'points500', type: 'points', value: '500', rarity: 'legendary', emoji: '💰', description: '500 coins', color: 'from-yellow-400 to-orange-500' },
  { id: 'premium7', type: 'premium', value: '7', rarity: 'legendary', emoji: '👑', description: '7 days premium', color: 'from-yellow-400 to-orange-500' },
];

export function MysteryAffiliateRoulette() {
  const { earnPoints } = useGamification();
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RouletteItem | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [spinsLeft, setSpinsLeft] = useState(3); // Daily spins
  const [lastSpinTime, setLastSpinTime] = useState<Date | null>(null);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [hasWatchedAd, setHasWatchedAd] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);

  // simulate ad watch
  useEffect(() => {
    if (!isWatchingAd) return;
    const timer = setTimeout(() => {
      setIsWatchingAd(false);
      setHasWatchedAd(true);
    }, 5000); // 5s ad
    return () => clearTimeout(timer);
  }, [isWatchingAd]);

  // Check for daily reset
  useEffect(() => {
    const now = new Date();
    const lastSpin = lastSpinTime || new Date(0);

    // Reset spins if it's a new day
    if (now.toDateString() !== lastSpin.toDateString()) {
      setSpinsLeft(3);
    }
  }, [lastSpinTime]);

  const getWeightedRandomItem = (): RouletteItem => {
    const random = Math.random() * 100;

    if (random < 60) return ROULETTE_ITEMS.filter(i => i.rarity === 'common')[Math.floor(Math.random() * 4)];
    if (random < 90) return ROULETTE_ITEMS.filter(i => i.rarity === 'rare')[Math.floor(Math.random() * 3)];
    if (random < 98) return ROULETTE_ITEMS.filter(i => i.rarity === 'epic')[Math.floor(Math.random() * 3)];
    return ROULETTE_ITEMS.filter(i => i.rarity === 'legendary')[Math.floor(Math.random() * 3)];
  };

  const spinWheel = () => {
    if (isSpinning || spinsLeft <= 0) return;
    if (!hasWatchedAd) {
      // ad must be watched before spinning
      setIsWatchingAd(true);
      return;
    }

    setIsSpinning(true);
    setShowResult(false);
    setSpinsLeft(prev => prev - 1);
    setLastSpinTime(new Date());
    setHasWatchedAd(false);

    // Simulate spinning animation
    setTimeout(() => {
      const winner = getWeightedRandomItem();
      setSelectedItem(winner);
      setIsSpinning(false);

      // Apply reward
      if (winner.type === 'points') {
        earnPoints(parseInt(winner.value), `Roulette win: ${winner.description}!`);
      } else if (winner.type === 'coupon') {
        // For now, convert coupons to points
        earnPoints(parseInt(winner.value) * 2, `Roulette win: ${winner.description} (${winner.value}% coupon = ${parseInt(winner.value) * 2} points)!`);
      } else if (winner.type === 'premium') {
        // For now, convert premium days to points
        earnPoints(parseInt(winner.value) * 50, `Roulette win: ${winner.description} (${winner.value} days = ${parseInt(winner.value) * 50} points)!`);
      }

      setTimeout(() => setShowResult(true), 500);
    }, 3000);
  };

  const resetSpins = () => {
    // For testing - in real app this would be premium feature
    setSpinsLeft(3);
  };

  return (
    <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800/80 backdrop-blur-sm border border-gray-700' : 'bg-white/80 backdrop-blur-sm border border-gray-200'} shadow-lg`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-linear-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <Shuffle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
              🎰 Mystery Affiliate Roulette
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Spin for exclusive rewards!
            </p>
          </div>
        </div>

        {/* Spins Counter */}
        <div className="text-right">
          <p className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {spinsLeft}
          </p>
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Spins left
          </p>
        </div>
      </div>

      {/* Roulette Wheel */}
      <div className="relative mb-6">
        <div
          ref={wheelRef}
          className={`relative w-64 h-64 mx-auto rounded-full border-8 ${isDark ? 'border-gray-600' : 'border-gray-300'} overflow-hidden ${isSpinning ? 'animate-spin' : ''}`}
          style={{
            background: `conic-gradient(${ROULETTE_ITEMS.map((item, index) => {
              const angle = (360 / ROULETTE_ITEMS.length) * index;
              const nextAngle = (360 / ROULETTE_ITEMS.length) * (index + 1);
              return `${item.color.startsWith('from-') ? item.color.replace('from-', '').replace('to-', '') : item.color} ${angle}deg ${nextAngle}deg`;
            }).join(', ')})`
          }}
        >
          {/* Wheel segments */}
          {ROULETTE_ITEMS.map((item, index) => {
            const angle = (360 / ROULETTE_ITEMS.length) * index;
            return (
              <div
                key={item.id}
                className="absolute w-full h-full flex items-center justify-center text-white font-bold text-sm"
                style={{
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: '50% 50%'
                }}
              >
                <div
                  className="absolute text-center"
                  style={{
                    transform: `rotate(${180 / ROULETTE_ITEMS.length}deg)`,
                    top: '20px',
                    left: '50%',
                    transformOrigin: '0 100px'
                  }}
                >
                  <span className="text-lg">{item.emoji}</span>
                  <p className="text-xs font-bold">{item.value}</p>
                </div>
              </div>
            );
          })}

          {/* Center circle */}
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full ${isDark ? 'bg-gray-900' : 'bg-white'} border-4 ${isDark ? 'border-gray-700' : 'border-gray-300'} flex items-center justify-center shadow-lg`}>
            <Shuffle className="w-6 h-6 text-gray-500" />
          </div>
        </div>

        {/* Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
          <div className={`w-0 h-0 border-l-4 border-r-4 border-b-8 ${isDark ? 'border-l-transparent border-r-transparent border-b-red-500' : 'border-l-transparent border-r-transparent border-b-red-600'}`}></div>
        </div>
      </div>

      {/* Spin Button */}
      <div className="text-center mb-6">
        <button
          onClick={spinWheel}
          disabled={isSpinning || spinsLeft <= 0}
          className={`px-8 py-4 rounded-2xl font-black text-lg transition-all transform ${
            isSpinning
              ? 'bg-gray-400 cursor-not-allowed'
              : spinsLeft > 0
                ? 'bg-linear-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/30 active:scale-95'
                : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {isSpinning ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Spinning...
            </div>
          ) : spinsLeft > 0 ? (
            '🎰 SPIN NOW!'
          ) : (
            'No spins left'
          )}
        </button>

        {spinsLeft <= 0 && (
          <button
            onClick={resetSpins}
            className="mt-3 px-4 py-2 bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all active:scale-95"
          >
            🔄 Reset Spins (Test)
          </button>
        )}
      </div>

      {/* Result Display */}
      {showResult && selectedItem && (
        <div className={`p-6 rounded-2xl mb-6 text-center ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} border-2 ${
          selectedItem.rarity === 'legendary' ? 'border-yellow-500 bg-yellow-900/20' :
          selectedItem.rarity === 'epic' ? 'border-purple-500 bg-purple-900/20' :
          selectedItem.rarity === 'rare' ? 'border-blue-500 bg-blue-900/20' :
          'border-gray-500 bg-gray-900/20'
        }`}>
          <div className="text-6xl mb-4 animate-bounce">{selectedItem.emoji}</div>
          <h4 className={`text-xl font-black mb-2 ${
            selectedItem.rarity === 'legendary' ? 'text-yellow-400' :
            selectedItem.rarity === 'epic' ? 'text-purple-400' :
            selectedItem.rarity === 'rare' ? 'text-blue-400' :
            'text-gray-400'
          }`}>
            {selectedItem.rarity.toUpperCase()} WIN!
          </h4>
          <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {selectedItem.description}
          </p>
          <div className={`mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
            selectedItem.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-400' :
            selectedItem.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' :
            selectedItem.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400' :
            'bg-gray-500/20 text-gray-400'
          }`}>
            <Sparkles className="w-4 h-4" />
            {selectedItem.rarity} reward unlocked!
          </div>
        </div>
      )}

      {/* Reward Preview */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className={`p-3 rounded-xl text-center ${isDark ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
          <div className="text-2xl mb-1">🎫</div>
          <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Coupons</p>
          <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>5% to 50% off</p>
        </div>
        <div className={`p-3 rounded-xl text-center ${isDark ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
          <div className="text-2xl mb-1">💰</div>
          <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Coins</p>
          <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>10 to 500 pts</p>
        </div>
        <div className={`p-3 rounded-xl text-center ${isDark ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
          <div className="text-2xl mb-1">👑</div>
          <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Premium</p>
          <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>1 to 7 days</p>
        </div>
        <div className={`p-3 rounded-xl text-center ${isDark ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
          <div className="text-2xl mb-1">🎰</div>
          <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Mystery</p>
          <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Surprise rewards</p>
        </div>
      </div>

      {/* Footer */}
      <div className={`p-3 rounded-xl text-center ${isDark ? 'bg-purple-900/20 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'}`}>
        <p className={`text-xs ${isDark ? 'text-purple-200' : 'text-purple-700'}`}>
          🎲 Spin daily for exclusive affiliate rewards & surprise bonuses
        </p>
      </div>
    </div>
  );
}
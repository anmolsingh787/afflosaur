import React, { useState } from 'react';
import { Heart, Angry, Frown, Meh, Smile, Sparkles, Zap } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';
import { useApp } from '../context/AppContext';

interface MoodDeal {
  id: string;
  productName: string;
  originalPrice: number;
  moodPrice: number;
  discount: number;
  image: string;
  category: string;
  reason: string;
  emoji: string;
}

interface MoodOption {
  emoji: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
}

const moodOptions: MoodOption[] = [
  { emoji: '😎', label: 'Confident', icon: Smile, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
  { emoji: '😡', label: 'Frustrated', icon: Angry, color: 'text-red-500', bgColor: 'bg-red-50 dark:bg-red-900/20' },
  { emoji: '😭', label: 'Sad', icon: Frown, color: 'text-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
  { emoji: '😴', label: 'Tired', icon: Meh, color: 'text-gray-500', bgColor: 'bg-gray-50 dark:bg-gray-900/20' },
  { emoji: '😍', label: 'Excited', icon: Heart, color: 'text-pink-500', bgColor: 'bg-pink-50 dark:bg-pink-900/20' }
];

export function AIMoodDealEngine() {
  const { theme, products } = useApp();
  const { earnPoints } = useGamification();
  const isDark = theme === 'dark';
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodDeals, setMoodDeals] = useState<MoodDeal[]>([]);
  const [isRevealing, setIsRevealing] = useState(false);
  const [currentDealIndex, setCurrentDealIndex] = useState(0);

  // Mock AI mood-based deal generation
  const generateMoodDeals = (mood: string) => {
    const moodMappings = {
      '😎': { categories: ['electronics', 'gadgets'], reason: 'Boost your confidence with premium tech!', emoji: '🚀' },
      '😡': { categories: ['gaming', 'entertainment'], reason: 'Unwind with some gaming therapy!', emoji: '🎮' },
      '😭': { categories: ['books', 'self-care'], reason: 'Comfort yourself with a good read or relaxation!', emoji: '📚' },
      '😴': { categories: ['home', 'kitchen'], reason: 'Make life easier with smart home gadgets!', emoji: '🏠' },
      '😍': { categories: ['fashion', 'beauty'], reason: 'Treat yourself to something special!', emoji: '💄' }
    };

    const moodConfig = moodMappings[mood as keyof typeof moodMappings];
    const relevantProducts = products.filter(p =>
      moodConfig.categories.some(cat => p.category.toLowerCase().includes(cat))
    );

    const deals: MoodDeal[] = relevantProducts.slice(0, 5).map((product, index) => ({
      id: `mood_${mood}_${index}`,
      productName: product.title,
      originalPrice: product.prices[0]?.price || 1000,
      moodPrice: Math.round((product.prices[0]?.price || 1000) * (0.7 + Math.random() * 0.2)), // 70-90% off
      discount: Math.floor(10 + Math.random() * 20), // 10-30% discount
      image: product.image,
      category: product.category,
      reason: moodConfig.reason,
      emoji: moodConfig.emoji
    }));

    return deals;
  };

  const handleMoodSelect = async (mood: string) => {
    setSelectedMood(mood);
    setIsRevealing(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const deals = generateMoodDeals(mood);
      setMoodDeals(deals);
      setIsRevealing(false);
      earnPoints(15, 'Selected mood for personalized deals');
    }, 2000);
  };

  const nextDeal = () => {
    setCurrentDealIndex((prev) => (prev + 1) % moodDeals.length);
  };

  const prevDeal = () => {
    setCurrentDealIndex((prev) => (prev - 1 + moodDeals.length) % moodDeals.length);
  };

  const currentDeal = moodDeals[currentDealIndex];

  return (
    <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800/80 backdrop-blur-sm border border-gray-700' : 'bg-white/80 backdrop-blur-sm border border-gray-200'} shadow-lg`}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-purple-500" />
          <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
            🤖 AI Mood-Based Deals
          </h3>
        </div>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Tell us your mood, get personalized deals just for you!
        </p>
      </div>

      {/* Mood Selection */}
      {!selectedMood && (
        <div className="mb-6">
          <p className={`text-center text-sm font-medium mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            How are you feeling today?
          </p>
          <div className="grid grid-cols-5 gap-3">
            {moodOptions.map((mood) => (
              <button
                key={mood.emoji}
                onClick={() => handleMoodSelect(mood.emoji)}
                className={`p-4 rounded-xl transition-all hover:scale-105 ${mood.bgColor} border-2 ${isDark ? 'border-gray-600' : 'border-gray-200'} hover:border-purple-400`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{mood.emoji}</div>
                  <p className={`text-xs font-medium ${mood.color}`}>{mood.label}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* AI Processing Animation */}
      {isRevealing && (
        <div className="text-center py-12">
          <div className="relative mb-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-linear-to-r from-purple-500 to-blue-500 flex items-center justify-center animate-spin">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-purple-500/30 animate-ping"></div>
          </div>
          <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
            🤖 Analyzing your mood...
          </p>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            AI is crafting personalized deals just for you
          </p>
        </div>
      )}

      {/* Mood Deals Display */}
      {selectedMood && !isRevealing && moodDeals.length > 0 && currentDeal && (
        <div>
          {/* Selected Mood Banner */}
          <div className={`p-3 rounded-xl mb-4 text-center ${isDark ? 'bg-purple-900/20 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'}`}>
            <p className={`text-sm ${isDark ? 'text-purple-200' : 'text-purple-700'}`}>
              🎯 Your {selectedMood} mood deals are ready!
            </p>
          </div>

          {/* Deal Card */}
          <div className="relative">
            <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
              {/* Navigation Arrows */}
              {moodDeals.length > 1 && (
                <>
                  <button
                    onClick={prevDeal}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-lg flex items-center justify-center hover:scale-110 transition-all"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextDeal}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-lg flex items-center justify-center hover:scale-110 transition-all"
                  >
                    ›
                  </button>
                </>
              )}

              <div className="text-center">
                {/* Product Image */}
                <div className="w-32 h-32 mx-auto mb-4 rounded-xl overflow-hidden bg-white/50 dark:bg-gray-600/50 flex items-center justify-center">
                  <img
                    src={currentDeal.image}
                    alt={currentDeal.productName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '🛒';
                      e.currentTarget.className = 'text-6xl';
                    }}
                  />
                </div>

                {/* Deal Info */}
                <div className="mb-4">
                  <h4 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {currentDeal.emoji} {currentDeal.productName}
                  </h4>
                  <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {currentDeal.reason}
                  </p>

                  {/* Price Display */}
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <span className={`text-lg line-through ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      ₹{currentDeal.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-2xl font-black text-green-600 dark:text-green-400">
                      ₹{currentDeal.moodPrice.toLocaleString()}
                    </span>
                    <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                      {currentDeal.discount}% OFF
                    </span>
                  </div>

                  <p className="text-sm text-green-600 dark:text-green-400 font-bold">
                    Save ₹{(currentDeal.originalPrice - currentDeal.moodPrice).toLocaleString()}!
                  </p>
                </div>

                {/* CTA */}
                <button className="w-full px-6 py-3 bg-linear-to-r from-purple-500 to-blue-500 text-white rounded-xl font-bold hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5" />
                  Claim Your Mood Deal →
                </button>
              </div>
            </div>

            {/* Deal Indicators */}
            <div className="flex justify-center gap-2 mt-4">
              {moodDeals.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentDealIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentDealIndex
                      ? 'bg-purple-500 w-6'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={() => {
              setSelectedMood(null);
              setMoodDeals([]);
              setCurrentDealIndex(0);
            }}
            className={`w-full mt-4 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Try Different Mood
          </button>
        </div>
      )}

      {/* Footer */}
      <div className={`mt-4 p-3 rounded-xl text-center ${isDark ? 'bg-blue-900/20 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
        <p className={`text-xs ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>
          🎯 AI analyzes your mood + shopping history for perfect deals
        </p>
      </div>
    </div>
  );
}
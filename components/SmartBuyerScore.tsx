import { useState } from 'react';
import { Trophy, Star, Award, Target, Medal, Crown } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';
import { useApp } from '../context/AppContext';

export function SmartBuyerScore() {
  const { userStats, achievements } = useGamification();
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const [showAchievements, setShowAchievements] = useState(false);

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'Legend': return <Crown className="w-6 h-6 text-yellow-500" />;
      case 'Price Master': return <Medal className="w-6 h-6 text-purple-500" />;
      case 'Deal Hunter': return <Target className="w-6 h-6 text-blue-500" />;
      case 'Smart Shopper': return <Star className="w-6 h-6 text-green-500" />;
      default: return <Trophy className="w-6 h-6 text-gray-500" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Legend': return 'from-yellow-500 to-amber-500';
      case 'Price Master': return 'from-purple-500 to-pink-500';
      case 'Deal Hunter': return 'from-blue-500 to-cyan-500';
      case 'Smart Shopper': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getNextLevel = (currentLevel: string) => {
    const levels = ['Beginner', 'Smart Shopper', 'Deal Hunter', 'Price Master', 'Legend'];
    const currentIndex = levels.indexOf(currentLevel);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;
  };

  const getProgressToNextLevel = (score: number, level: string) => {
    const thresholds = { 'Beginner': 250, 'Smart Shopper': 1000, 'Deal Hunter': 2500, 'Price Master': 5000 };
    const currentThreshold = thresholds[level as keyof typeof thresholds] || 0;
    const nextThreshold = thresholds[getNextLevel(level) as keyof typeof thresholds] || score;
    const progress = ((score - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const nextLevel = getNextLevel(userStats.buyerLevel);
  const progressPercent = nextLevel ? getProgressToNextLevel(userStats.buyerScore, userStats.buyerLevel) : 100;

  const unlockedAchievements = achievements.filter(a => a.unlockedAt);
  const totalAchievements = achievements.length;

  return (
    <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800/80 backdrop-blur-sm border border-gray-700' : 'bg-white/80 backdrop-blur-sm border border-gray-200'} shadow-lg`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full bg-linear-to-r ${getLevelColor(userStats.buyerLevel)} flex items-center justify-center shadow-lg`}>
            {getLevelIcon(userStats.buyerLevel)}
          </div>
          <div>
            <h3 className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
              🧠 Smart Buyer Score
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Level: {userStats.buyerLevel}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className={`text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {userStats.buyerScore.toLocaleString()}
          </p>
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Total Points
          </p>
        </div>
      </div>

      {/* Progress to Next Level */}
      {nextLevel && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Progress to {nextLevel}
            </span>
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div className={`w-full h-3 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div
              className={`h-full rounded-full bg-linear-to-r ${getLevelColor(userStats.buyerLevel)} transition-all duration-500`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} text-center`}>
          <div className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
            ₹{userStats.totalSavings.toLocaleString()}
          </div>
          <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            💰 Total Saved
          </div>
        </div>

        <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} text-center`}>
          <div className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {userStats.itemsPurchased}
          </div>
          <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            🛒 Items Bought
          </div>
        </div>

        <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} text-center`}>
          <div className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {userStats.loginStreak}
          </div>
          <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            🔥 Day Streak
          </div>
        </div>

        <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} text-center`}>
          <div className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {unlockedAchievements.length}/{totalAchievements}
          </div>
          <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            🏆 Achievements
          </div>
        </div>
      </div>

      {/* Achievements Toggle */}
      <button
        onClick={() => setShowAchievements(!showAchievements)}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
          showAchievements
            ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-lg'
            : `${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
        }`}
      >
        <Award className="w-5 h-5" />
        {showAchievements ? 'Hide Achievements' : 'View Achievements'}
      </button>

      {/* Achievements List */}
      {showAchievements && (
        <div className="mt-4 space-y-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-xl transition-all ${
                achievement.unlockedAt
                  ? `${isDark ? 'bg-green-900/20 border-2 border-green-500/50' : 'bg-green-50 border-2 border-green-500/30'}`
                  : `${isDark ? 'bg-gray-700/30 border border-gray-600' : 'bg-gray-100 border border-gray-200'}`
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                  achievement.unlockedAt
                    ? 'bg-linear-to-r from-green-500 to-emerald-500 text-white'
                    : isDark ? 'bg-gray-600 text-gray-400' : 'bg-gray-300 text-gray-500'
                }`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {achievement.title}
                  </h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {achievement.description}
                  </p>
                  {achievement.progress !== undefined && achievement.maxProgress && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                          Progress: {achievement.progress}/{achievement.maxProgress}
                        </span>
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                          {Math.round((achievement.progress / achievement.maxProgress) * 100)}%
                        </span>
                      </div>
                      <div className={`w-full h-2 rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}>
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            achievement.unlockedAt ? 'bg-green-500' : 'bg-orange-500'
                          }`}
                          style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                {achievement.unlockedAt && (
                  <div className="text-green-500">
                    <Trophy className="w-6 h-6" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Motivational Message */}
      <div className={`mt-4 p-3 rounded-xl text-center ${isDark ? 'bg-orange-900/20 border border-orange-500/30' : 'bg-orange-50 border border-orange-200'}`}>
        <p className={`text-sm italic ${isDark ? 'text-orange-200' : 'text-orange-700'}`}>
          {userStats.buyerLevel === 'Legend'
            ? "🏆 You're a shopping legend! Keep dominating the deals!"
            : nextLevel
              ? `🚀 Only ${Math.round(((getProgressToNextLevel(userStats.buyerScore, userStats.buyerLevel) / 100) * userStats.buyerScore))} points to ${nextLevel}!`
              : "🎯 Keep shopping smart to level up!"
          }
        </p>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Flame, Gift, Star, Trophy, Zap } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';
import { useApp } from '../context/AppContext';

export function DailyStreakCard() {
  const { userStats, checkLoginStreak } = useGamification();
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const [streakRewards, setStreakRewards] = useState<any[]>([]);

  // Generate streak rewards
  useEffect(() => {
    const rewards = [];
    for (let i = 1; i <= 30; i++) {
      let reward = null;
      let icon = '🔥';

      if (i % 7 === 0) {
        reward = { type: 'bonus_points', value: 100, description: '100 Bonus Points!' };
        icon = '🎁';
      } else if (i % 5 === 0) {
        reward = { type: 'mystery_coupon', value: 1, description: 'Mystery Coupon!' };
        icon = '🎫';
      } else if (i % 3 === 0) {
        reward = { type: 'points', value: 50, description: '50 Points' };
        icon = '⭐';
      } else {
        reward = { type: 'points', value: 25, description: '25 Points' };
        icon = '🔥';
      }

      rewards.push({
        day: i,
        reward,
        icon,
        claimed: i <= userStats.loginStreak
      });
    }
    setStreakRewards(rewards);
  }, [userStats.loginStreak]);

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'from-purple-500 to-pink-500';
    if (streak >= 20) return 'from-blue-500 to-purple-500';
    if (streak >= 10) return 'from-green-500 to-blue-500';
    if (streak >= 5) return 'from-yellow-500 to-orange-500';
    return 'from-orange-500 to-red-500';
  };

  const getStreakMessage = (streak: number) => {
    if (streak === 0) return "🌅 Start your streak today!";
    if (streak === 1) return "🎯 Great start! Come back tomorrow!";
    if (streak < 5) return `🔥 Building momentum! ${5 - streak} more to unlock rewards!`;
    if (streak < 10) return `🚀 You're on fire! ${10 - streak} days to big rewards!`;
    if (streak < 30) return `⭐ Amazing! ${30 - streak} days to legendary status!`;
    return "👑 LEGENDARY! 30-day streak master!";
  };

  const nextReward = streakRewards.find(reward => !reward.claimed);
  const today = new Date().toISOString().split('T')[0];
  const lastLogin = userStats.lastLoginDate;
  const canClaimToday = lastLogin !== today;

  return (
    <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800/80 backdrop-blur-sm border border-gray-700' : 'bg-white/80 backdrop-blur-sm border border-gray-200'} shadow-lg`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full bg-linear-to-r ${getStreakColor(userStats.loginStreak)} flex items-center justify-center shadow-lg animate-pulse`}>
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
              🔥 Daily Login Streak
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {getStreakMessage(userStats.loginStreak)}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className={`text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {userStats.loginStreak}
          </p>
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Day Streak
          </p>
        </div>
      </div>

      {/* Streak Visual */}
      <div className="mb-6">
        <div className="flex items-center justify-center gap-1 mb-4">
          {Array.from({ length: Math.min(userStats.loginStreak, 30) }, (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full bg-linear-to-r ${getStreakColor(userStats.loginStreak)} animate-pulse`}
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
          {userStats.loginStreak < 30 && (
            <>
              {Array.from({ length: Math.max(0, 30 - userStats.loginStreak) }, (_, i) => (
                <div
                  key={`empty-${i}`}
                  className={`w-3 h-3 rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}
                />
              ))}
            </>
          )}
        </div>

        {/* Progress Bar */}
        <div className={`w-full h-3 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} mb-2`}>
          <div
            className={`h-full rounded-full bg-linear-to-r ${getStreakColor(userStats.loginStreak)} transition-all duration-500`}
            style={{ width: `${Math.min((userStats.loginStreak / 30) * 100, 100)}%` }}
          />
        </div>
        <p className={`text-xs text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {userStats.loginStreak}/30 days to legendary status
        </p>
      </div>

      {/* Today's Reward Preview */}
      {nextReward && (
        <div className={`p-4 rounded-xl mb-6 ${isDark ? 'bg-orange-900/20 border-2 border-orange-500/50' : 'bg-orange-50 border-2 border-orange-500/30'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{nextReward.icon}</span>
              <div>
                <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Next Reward: Day {nextReward.day}
                </p>
                <p className={`text-sm ${isDark ? 'text-orange-200' : 'text-orange-700'}`}>
                  {nextReward.reward.description}
                </p>
              </div>
            </div>

            {canClaimToday && (
              <button
                onClick={checkLoginStreak}
                className="px-4 py-2 bg-linear-to-r from-orange-500 to-red-500 text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all active:scale-95"
              >
                Claim Today!
              </button>
            )}
          </div>
        </div>
      )}

      {/* Recent Rewards Grid */}
      <div className="mb-6">
        <h4 className={`text-sm font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          📅 Recent Rewards
        </h4>
        <div className="grid grid-cols-7 gap-2">
          {streakRewards.slice(Math.max(0, userStats.loginStreak - 6), userStats.loginStreak + 1).map((reward, _index) => (
            <div
              key={reward.day}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs transition-all ${
                reward.claimed
                  ? `bg-linear-to-r ${getStreakColor(userStats.loginStreak)} text-white shadow-md`
                  : `${isDark ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-100 text-gray-500'}`
              }`}
            >
              <span className="text-lg mb-1">{reward.icon}</span>
              <span className="font-bold">{reward.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Streak Benefits */}
      <div className={`p-4 rounded-xl ${isDark ? 'bg-green-900/20 border border-green-500/30' : 'bg-green-50 border border-green-200'}`}>
        <h4 className={`text-sm font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          🎁 Streak Benefits
        </h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <Star className="w-3 h-3 text-yellow-500" />
            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
              Daily points for maintaining streak
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Gift className="w-3 h-3 text-purple-500" />
            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
              Bonus rewards every 3, 5, and 7 days
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-3 h-3 text-blue-500" />
            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
              Exclusive deals for streak masters
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-orange-500" />
            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
              Priority access to flash sales
            </span>
          </div>
        </div>
      </div>

      {/* Warning for streak break */}
      {userStats.loginStreak > 0 && lastLogin !== today && lastLogin === new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0] === false && (
        <div className={`mt-4 p-3 rounded-xl ${isDark ? 'bg-red-900/20 border border-red-500/30' : 'bg-red-50 border border-red-200'}`}>
          <p className={`text-sm text-center ${isDark ? 'text-red-200' : 'text-red-700'}`}>
            ⚠️ Don't break your streak! Log in today to keep it going! 🔥
          </p>
        </div>
      )}
    </div>
  );
}
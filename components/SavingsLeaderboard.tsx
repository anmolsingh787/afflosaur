import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, TrendingUp, Crown } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';
import { useApp } from '../context/AppContext';

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  totalSavings: number;
  monthlySavings: number;
  buyerLevel: string;
  rank: number;
  isCurrentUser?: boolean;
}

export function SavingsLeaderboard() {
  const { userStats } = useGamification();
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const [timeframe, setTimeframe] = useState<'monthly' | 'allTime'>('monthly');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Mock leaderboard data - in real app, this would come from API
  useEffect(() => {
    const mockData: LeaderboardEntry[] = [
      {
        id: 'user1',
        name: 'DealMaster2024',
        avatar: '🦕',
        totalSavings: 45670,
        monthlySavings: 12340,
        buyerLevel: 'Legend',
        rank: 1
      },
      {
        id: 'user2',
        name: 'SmartShopper',
        avatar: '🛒',
        totalSavings: 38950,
        monthlySavings: 9876,
        buyerLevel: 'Price Master',
        rank: 2
      },
      {
        id: 'user3',
        name: 'CouponQueen',
        avatar: '🎫',
        totalSavings: 32450,
        monthlySavings: 8765,
        buyerLevel: 'Price Master',
        rank: 3
      },
      {
        id: 'current',
        name: 'You',
        avatar: '🦕',
        totalSavings: userStats.totalSavings,
        monthlySavings: userStats.monthlySavings,
        buyerLevel: userStats.buyerLevel,
        rank: 4,
        isCurrentUser: true
      },
      {
        id: 'user4',
        name: 'BargainHunter',
        avatar: '🔍',
        totalSavings: 28750,
        monthlySavings: 6543,
        buyerLevel: 'Deal Hunter',
        rank: 5
      },
      {
        id: 'user5',
        name: 'ThriftyTom',
        avatar: '💰',
        totalSavings: 25680,
        monthlySavings: 5432,
        buyerLevel: 'Deal Hunter',
        rank: 6
      }
    ];

    // Sort by selected timeframe
    const sorted = mockData.sort((a, b) => {
      const aValue = timeframe === 'monthly' ? a.monthlySavings : a.totalSavings;
      const bValue = timeframe === 'monthly' ? b.monthlySavings : b.totalSavings;
      return bValue - aValue;
    });

    // Update ranks
    sorted.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    setLeaderboard(sorted);
  }, [timeframe, userStats]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-amber-600" />;
      default: return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-500 to-amber-500';
      case 2: return 'from-gray-400 to-gray-500';
      case 3: return 'from-amber-600 to-orange-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const currentUserRank = leaderboard.find(entry => entry.isCurrentUser)?.rank || 0;
  const percentile = Math.max(0, Math.min(100, 100 - (currentUserRank - 1) * 10));

  return (
    <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800/80 backdrop-blur-sm border border-gray-700' : 'bg-white/80 backdrop-blur-sm border border-gray-200'} shadow-lg`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
              🏆 Savings Leaderboard
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Compete with fellow smart shoppers!
            </p>
          </div>
        </div>

        {/* Timeframe Toggle */}
        <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-3 py-1 text-sm font-medium transition-colors ${
              timeframe === 'monthly'
                ? 'bg-blue-500 text-white'
                : `${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setTimeframe('allTime')}
            className={`px-3 py-1 text-sm font-medium transition-colors ${
              timeframe === 'allTime'
                ? 'bg-blue-500 text-white'
                : `${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Your Rank Card */}
      <div className={`p-4 rounded-xl mb-6 ${isDark ? 'bg-blue-900/20 border-2 border-blue-500/50' : 'bg-blue-50 border-2 border-blue-500/30'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full bg-linear-to-r ${getRankColor(currentUserRank)} flex items-center justify-center text-white font-bold`}>
              {currentUserRank <= 3 ? getRankIcon(currentUserRank) : `#${currentUserRank}`}
            </div>
            <div>
              <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Your Rank: #{currentUserRank}
              </p>
              <p className={`text-sm ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>
                Better than {percentile}% of shoppers
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
              ₹{(timeframe === 'monthly' ? userStats.monthlySavings : userStats.totalSavings).toLocaleString()}
            </p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {timeframe === 'monthly' ? 'This Month' : 'Total Saved'}
            </p>
          </div>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-3">
        {leaderboard.slice(0, 10).map((entry, index) => (
          <div
            key={entry.id}
            className={`p-4 rounded-xl transition-all hover:scale-[1.02] ${
              entry.isCurrentUser
                ? `${isDark ? 'bg-blue-900/30 border-2 border-blue-500/50' : 'bg-blue-50 border-2 border-blue-500/30'} shadow-md`
                : `${isDark ? 'bg-gray-700/30 border border-gray-600' : 'bg-gray-50 border border-gray-200'}`
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  entry.rank <= 3
                    ? `bg-linear-to-r ${getRankColor(entry.rank)} text-white`
                    : isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-300 text-gray-700'
                }`}>
                  {entry.rank <= 3 ? getRankIcon(entry.rank) : entry.rank}
                </div>

                <div className="text-xl">{entry.avatar}</div>

                <div>
                  <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {entry.name} {entry.isCurrentUser && '(You)'}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {entry.buyerLevel}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  ₹{(timeframe === 'monthly' ? entry.monthlySavings : entry.totalSavings).toLocaleString()}
                </p>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {timeframe === 'monthly' ? 'This Month' : 'Total Saved'}
                </p>
              </div>
            </div>

            {/* Progress bar for top 3 */}
            {entry.rank <= 3 && index < leaderboard.length - 1 && (
              <div className="mt-3">
                <div className={`w-full h-2 rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}>
                  <div
                    className={`h-full rounded-full bg-linear-to-r ${getRankColor(entry.rank)} transition-all duration-500`}
                    style={{
                      width: `${((timeframe === 'monthly' ? entry.monthlySavings : entry.totalSavings) /
                              (timeframe === 'monthly' ? leaderboard[0].monthlySavings : leaderboard[0].totalSavings)) * 100}%`
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Motivational Footer */}
      <div className={`mt-6 p-4 rounded-xl text-center ${isDark ? 'bg-green-900/20 border border-green-500/30' : 'bg-green-50 border border-green-200'}`}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          <p className={`text-sm font-bold ${isDark ? 'text-green-200' : 'text-green-700'}`}>
            Keep Shopping Smart!
          </p>
        </div>
        <p className={`text-xs ${isDark ? 'text-green-300' : 'text-green-600'}`}>
          {currentUserRank <= 3
            ? "🎉 You're crushing it! Stay on top of the leaderboard!"
            : `💪 Only ${leaderboard[2] ? (timeframe === 'monthly' ? leaderboard[2].monthlySavings - userStats.monthlySavings : leaderboard[2].totalSavings - userStats.totalSavings) : 0} more to reach top 3!`
          }
        </p>
      </div>
    </div>
  );
}
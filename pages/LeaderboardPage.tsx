/**
 * 🏆 LEADERBOARD PAGE
 * Weekly/Monthly/All-time with glow effects for top 3
 */
import { useState } from 'react';
import { Trophy, Medal, Flame, Crown, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useCoin, RANKS } from '../context/CoinContext';

export function LeaderboardPage() {
  const { theme } = useApp();
  const { leaderboard, balance, currentRank, lifetimeEarned } = useCoin();
  const isDark = theme === 'dark';
  const [tab, setTab] = useState<'weekly' | 'monthly' | 'alltime'>('weekly');

  // Simulate different time periods by shuffling/scaling
  const getLeaderboardData = () => {
    const base = [...leaderboard];
    if (tab === 'weekly') return base.map(e => ({ ...e, coins: Math.floor(e.coins * 0.15) }));
    if (tab === 'monthly') return base.map(e => ({ ...e, coins: Math.floor(e.coins * 0.5) }));
    return base;
  };

  const data = getLeaderboardData();
  const top3 = data.slice(0, 3);
  const rest = data.slice(3);

  const getRankInfo = (rankId: string) => RANKS.find(r => r.id === rankId) || RANKS[0];

  const podiumOrder = [top3[1], top3[0], top3[2]]; // 2nd, 1st, 3rd for podium display
  const podiumHeights = ['h-24 sm:h-28', 'h-32 sm:h-40', 'h-20 sm:h-24'];
  const podiumColors = [
    'from-slate-300 to-slate-500',
    'from-yellow-400 to-orange-500',
    'from-amber-600 to-amber-800'
  ];
  const podiumBorders = ['border-slate-400', 'border-yellow-400', 'border-amber-600'];
  const podiumLabels = ['2nd', '1st', '3rd'];
  const podiumIcons = ['🥈', '🥇', '🥉'];

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
          🏆 Leaderboard
        </h1>
        <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Top earners in the Afflosaur community
        </p>
      </div>

      {/* Your Position */}
      <div className={`rounded-2xl p-4 ${
        isDark
          ? 'bg-linear-to-r from-orange-900/30 to-amber-900/30 border border-orange-500/20'
          : 'bg-linear-to-r from-orange-50 to-amber-50 border border-orange-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-linear-to-r from-orange-500 to-amber-500 flex items-center justify-center text-2xl shadow-lg">
            🦕
          </div>
          <div className="flex-1">
            <p className={`text-sm font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Your Position
            </p>
            <div className="flex items-center gap-2">
              <span className="text-lg">{currentRank.icon}</span>
              <span className={`text-xs font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {currentRank.name}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-black text-orange-500">{balance.toLocaleString()} 🪙</p>
            <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {lifetimeEarned.toLocaleString()} lifetime
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex gap-1 p-1 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
        {[
          { id: 'weekly' as const, label: 'This Week' },
          { id: 'monthly' as const, label: 'This Month' },
          { id: 'alltime' as const, label: 'All Time' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
              tab === t.id
                ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-sm'
                : isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Podium - Top 3 */}
      <div className="flex items-end justify-center gap-3 pt-8 pb-4">
        {podiumOrder.map((entry, i) => {
          if (!entry) return null;
          const rankInfo = getRankInfo(entry.rank);
          return (
            <div key={entry.id} className="flex flex-col items-center" style={{ order: i }}>
              {/* Avatar */}
              <div className={`relative mb-2 ${i === 1 ? 'scale-110' : ''}`}>
                {i === 1 && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                    <Crown className="w-6 h-6 text-yellow-500 animate-bounce" />
                  </div>
                )}
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-3 ${podiumBorders[i]} flex items-center justify-center text-2xl sm:text-3xl ${
                  isDark ? 'bg-gray-700' : 'bg-white'
                } shadow-lg ${i === 1 ? 'ring-4 ring-yellow-400/30' : ''}`}>
                  {entry.avatar}
                </div>
                {entry.badge && (
                  <span className="absolute -top-1 -right-1 text-sm">{entry.badge}</span>
                )}
              </div>

              {/* Name */}
              <p className={`text-xs font-black mb-0.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {entry.name}
              </p>
              <p className="text-[10px] text-orange-500 font-bold">
                {entry.coins.toLocaleString()} 🪙
              </p>
              <span className="text-xs">{rankInfo.icon}</span>

              {/* Podium block */}
              <div className={`w-20 sm:w-24 ${podiumHeights[i]} rounded-t-xl bg-linear-to-b ${podiumColors[i]} mt-2 flex flex-col items-center justify-start pt-2 shadow-lg`}>
                <span className="text-2xl">{podiumIcons[i]}</span>
                <span className="text-white text-[10px] font-bold mt-1">{podiumLabels[i]}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rest of leaderboard */}
      <div className="space-y-2">
        {rest.map((entry, i) => {
          const rankInfo = getRankInfo(entry.rank);
          return (
            <div
              key={entry.id}
              className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
              }`}>
                {i + 4}
              </span>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                isDark ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                {entry.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {entry.name}
                  </p>
                  {entry.badge && <span className="text-xs">{entry.badge}</span>}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs">{rankInfo.icon}</span>
                  <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {rankInfo.name}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-orange-500">{entry.coins.toLocaleString()}</p>
                <p className={`text-[9px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>coins</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Earn More CTA */}
      <div className={`rounded-2xl p-5 text-center ${
        isDark ? 'bg-linear-to-r from-purple-900/30 to-pink-900/30' : 'bg-linear-to-r from-purple-50 to-pink-50'
      }`}>
        <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
        <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Want to climb the leaderboard?
        </h3>
        <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Complete missions, refer friends, and stay active!
        </p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <Medal className="w-4 h-4 text-orange-500" />
          <TrendingUp className="w-4 h-4 text-orange-500" />
          <Trophy className="w-4 h-4 text-orange-500" />
        </div>
      </div>
    </div>
  );
}

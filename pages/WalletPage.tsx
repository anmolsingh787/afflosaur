/**
 * 🪙 AFFLO COIN WALLET PAGE
 * Balance, Rank Progress, Transaction History, Fast Deals, Premium, Spend Options
 * Economy: 10 Coins ≈ ₹1 | ₹100 purchase = 50 coins
 */
import { useState } from 'react';
import { Coins, TrendingUp, ArrowUpRight, ArrowDownLeft, Sparkles, Lock, Zap, Crown, Gift, Star, ChevronRight, Flame, Shield, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useCoin, RANKS, PURCHASE_SLABS } from '../context/CoinContext';

export function WalletPage() {
  const { theme, setPage } = useApp();
  const {
    balance, lifetimeEarned, transactions, currentRank, nextRank, rankProgress,
    fastDeals, unlockFastDeal, isPremium, streak, claimStreakBonus,
    spendOptions, redeemSpendOption, canSpin, calculatePurchaseReward,
  } = useCoin();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'history' | 'deals' | 'spend' | 'economy'>('history');

  const formatPrice = (n: number) => '₹' + n.toLocaleString('en-IN');
  const timeAgo = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
    if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
    return Math.floor(diff / 86400000) + 'd ago';
  };
  const countdown = (ts: number) => {
    const diff = ts - Date.now();
    if (diff <= 0) return 'Expired';
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}h ${m}m left`;
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Back button */}
      <button onClick={() => setPage('home')} className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-xl transition-colors ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      {/* ===== WALLET CARD ===== */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-linear-to-br from-orange-500 via-amber-500 to-yellow-500 text-white shadow-2xl shadow-orange-500/30">
        <div className="absolute -right-8 -top-8 text-[120px] opacity-10 select-none">🪙</div>
        <div className="absolute -left-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Coins className="w-5 h-5" />
            <span className="text-sm font-bold opacity-90">Afflo Coin Wallet</span>
            {isPremium && (
              <span className="ml-auto px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-bold flex items-center gap-1">
                <Crown className="w-3 h-3" /> PREMIUM
              </span>
            )}
          </div>
          
          <div className="flex items-end gap-3 mt-2">
            <span className="text-5xl sm:text-6xl font-black">{balance.toLocaleString()}</span>
            <span className="text-lg font-bold opacity-70 mb-2">coins</span>
          </div>

          <p className="text-[10px] opacity-60 mt-0.5">≈ ₹{Math.floor(balance / 10).toLocaleString('en-IN')} value (10 coins = ₹1)</p>

          <div className="flex items-center gap-3 mt-3 text-sm flex-wrap">
            <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="font-bold">{lifetimeEarned.toLocaleString()}</span>
              <span className="opacity-70 text-xs">lifetime</span>
            </div>
            <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
              <span className="text-lg">{currentRank.icon}</span>
              <span className="font-bold">{currentRank.name}</span>
            </div>
            <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
              <Flame className="w-3.5 h-3.5" />
              <span className="font-bold">{streak.currentStreak}</span>
              <span className="opacity-70 text-xs">day streak</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== DAILY STREAK ===== */}
      <div className={`rounded-2xl p-4 ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-sm font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <Flame className="w-4 h-4 text-orange-500" /> Daily Streak
          </h3>
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Best: {streak.longestStreak} days
          </span>
        </div>

        {/* Streak days */}
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 7 }, (_, i) => (
            <div
              key={i}
              className={`flex-1 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                i < streak.currentStreak
                  ? 'bg-linear-to-b from-orange-500 to-amber-500 text-white shadow-sm'
                  : isDark ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-400'
              }`}
            >
              {i < streak.currentStreak ? '🔥' : i + 1}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {streak.currentStreak >= 7 ? '🎉 7-day streak = 100 bonus coins!' : `${7 - streak.currentStreak} more days for 100 coin bonus`}
          </span>
          {!streak.streakRewardClaimed ? (
            <button
              onClick={claimStreakBonus}
              className="px-3 py-1.5 bg-linear-to-r from-orange-500 to-amber-500 text-white rounded-full text-[10px] font-bold active:scale-95 transition-all animate-pulse"
            >
              Claim +{streak.currentStreak >= 7 ? 100 : streak.currentStreak * 5} 🪙
            </button>
          ) : (
            <span className="text-[10px] text-green-500 font-bold">✅ Claimed</span>
          )}
        </div>
      </div>

      {/* ===== RANK PROGRESS ===== */}
      <div className={`rounded-2xl p-4 sm:p-5 ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-sm font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <Crown className="w-4 h-4 text-orange-500" /> Rank Progress
          </h3>
          <button
            onClick={() => setPage('leaderboard')}
            className="text-orange-500 text-xs font-bold flex items-center gap-1"
          >
            Leaderboard <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center justify-between mb-3">
          {RANKS.map((r) => (
            <div key={r.id} className="flex flex-col items-center">
              <div className={`text-lg sm:text-2xl transition-all ${
                lifetimeEarned >= r.minCoins ? 'scale-100 opacity-100' : 'scale-75 opacity-30 grayscale'
              }`}>
                {r.icon}
              </div>
              <span className={`text-[8px] sm:text-[10px] font-bold mt-0.5 ${
                lifetimeEarned >= r.minCoins
                  ? (isDark ? 'text-white' : 'text-gray-900')
                  : (isDark ? 'text-gray-600' : 'text-gray-300')
              }`}>
                {r.name}
              </span>
              <span className={`text-[7px] ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                {r.coinMultiplier}x
              </span>
            </div>
          ))}
        </div>

        <div className={`h-3 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <div
            className={`h-full rounded-full bg-linear-to-r ${currentRank.gradient} transition-all duration-1000 relative`}
            style={{ width: `${Math.min(rankProgress, 100)}%` }}
          >
            <div className="absolute right-0 top-0 h-full w-4 bg-white/30 rounded-full animate-pulse" />
          </div>
        </div>

        {nextRank ? (
          <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <span className="font-bold text-orange-500">{nextRank.minCoins - lifetimeEarned}</span> more coins to {nextRank.icon} {nextRank.name} ({nextRank.coinMultiplier}x multiplier)
          </p>
        ) : (
          <p className="text-xs mt-2 text-orange-500 font-bold">👑 Legend rank! {currentRank.coinMultiplier}x multiplier active!</p>
        )}
      </div>

      {/* ===== QUICK ACTIONS ===== */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { icon: '🎯', label: 'Missions', page: 'missions' as const },
          { icon: '🎁', label: 'Giveaways', page: 'giveaways' as const },
          { icon: '🤝', label: 'Refer', page: 'referral' as const },
          { icon: '👑', label: 'Premium', page: 'coins' as const },
        ].map(item => (
          <button
            key={item.label}
            onClick={() => item.label === 'Premium' ? setActiveTab('spend') : setPage(item.page)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all active:scale-95 ${
              isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white shadow-sm hover:shadow-md'
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className={`text-[10px] font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{item.label}</span>
          </button>
        ))}
      </div>

      {/* ===== DAILY SPIN ===== */}
      {canSpin && (
        <button
          onClick={() => setPage('missions')}
          className="w-full rounded-2xl p-4 bg-linear-to-r from-purple-500 via-pink-500 to-orange-500 text-white flex items-center gap-3 shadow-lg shadow-purple-500/20 active:scale-[0.98] transition-all"
        >
          <span className="text-3xl animate-bounce">🎰</span>
          <div className="text-left flex-1">
            <p className="font-black text-sm">Daily Spin Available!</p>
            <p className="text-[10px] opacity-80">Win up to 100 Afflo Coins</p>
          </div>
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* ===== TABS ===== */}
      <div className={`flex gap-1 p-1 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
        {[
          { id: 'history' as const, label: 'History', icon: <TrendingUp className="w-3.5 h-3.5" /> },
          { id: 'deals' as const, label: 'Fast Deals', icon: <Zap className="w-3.5 h-3.5" /> },
          { id: 'spend' as const, label: 'Spend', icon: <Gift className="w-3.5 h-3.5" /> },
          { id: 'economy' as const, label: 'Economy', icon: <Shield className="w-3.5 h-3.5" /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-sm'
                : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ===== TAB CONTENT ===== */}
      {activeTab === 'history' && (
        <div className="space-y-2">
          {transactions.length === 0 ? (
            <div className={`text-center py-10 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <p className="text-3xl mb-2">🪙</p>
              <p className={`font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No transactions yet</p>
            </div>
          ) : (
            transactions.map(tx => (
              <div key={tx.id} className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  tx.type === 'earn' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                }`}>
                  {tx.type === 'earn' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{tx.description}</p>
                  <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{tx.category} • {timeAgo(tx.timestamp)}</p>
                </div>
                <span className={`text-sm font-black ${tx.type === 'earn' ? 'text-green-500' : 'text-red-500'}`}>
                  {tx.type === 'earn' ? '+' : '-'}{tx.amount} 🪙
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'deals' && (
        <div className="space-y-3">
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <Zap className="w-3.5 h-3.5 inline text-orange-500" /> {isPremium ? 'Premium: Free unlock on all deals!' : 'Unlock exclusive deals using Afflo Coins'}
          </p>
          {fastDeals.map(deal => (
            <div key={deal.id} className={`rounded-2xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
              <div className="flex gap-3 p-3">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                  <img src={deal.image} alt={deal.title} className="w-full h-full object-cover" />
                  {!deal.unlocked && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{deal.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-orange-500 font-black text-sm">{formatPrice(deal.dealPrice)}</span>
                    <span className={`text-[10px] line-through ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{formatPrice(deal.originalPrice)}</span>
                    <span className="text-[10px] text-green-500 font-bold">
                      {Math.round((1 - deal.dealPrice / deal.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                  <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>⏰ {countdown(deal.expiresAt)}</span>
                </div>
              </div>
              <div className="px-3 pb-3">
                {deal.unlocked ? (
                  <button className="w-full py-2.5 bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Deal Unlocked! View Now
                  </button>
                ) : (
                  <button
                    onClick={() => unlockFastDeal(deal.id)}
                    className="w-full py-2.5 bg-linear-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
                  >
                    <Lock className="w-3.5 h-3.5" /> {isPremium ? 'Unlock Free (Premium) ⚡' : `Unlock for ${deal.coinCost} 🪙`}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'spend' && (
        <div className="space-y-3">
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <Star className="w-3.5 h-3.5 inline text-orange-500" /> {isPremium ? 'Premium: 20% discount on all redemptions!' : 'Spend coins on rewards (not convertible to ₹ directly)'}
          </p>
          
          {/* Premium Upsell */}
          {!isPremium && (
            <button
              onClick={() => setPage('referral')}
              className={`w-full p-4 rounded-2xl text-left transition-all active:scale-[0.98] ${
                isDark ? 'bg-purple-900/30 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">👑</span>
                <div className="flex-1">
                  <p className={`font-black text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Go Premium — Save 20% on all spends</p>
                  <p className={`text-[10px] ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>Starting ₹49/month or 2000 coins</p>
                </div>
                <ChevronRight className="w-5 h-5 text-purple-500" />
              </div>
            </button>
          )}

          {/* Spend Options Grid */}
          <div className="grid grid-cols-2 gap-2">
            {spendOptions.map(option => {
              const cost = isPremium ? Math.floor(option.cost * 0.8) : option.cost;
              const canAfford = balance >= cost;
              return (
                <div key={option.id} className={`rounded-2xl p-3 ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                  <div className="text-2xl mb-1">{option.icon}</div>
                  <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{option.name}</p>
                  <p className={`text-[10px] mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{option.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-orange-500">
                      {cost} 🪙
                      {isPremium && <span className="text-[9px] text-green-500 ml-1">(-20%)</span>}
                    </span>
                    <button
                      onClick={() => redeemSpendOption(option.id)}
                      disabled={!canAfford}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all active:scale-95 ${
                        canAfford
                          ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Redeem
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'economy' && (
        <div className="space-y-3">
          {/* Purchase Slab Table */}
          <div className={`rounded-2xl p-4 ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
            <h3 className={`text-sm font-black flex items-center gap-2 mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              🛒 Purchase → Coins (Slab System)
            </h3>
            <div className="space-y-1.5">
              {[100, 200, 500, 1000, 2000].map(amount => (
                <div key={amount} className={`flex items-center justify-between p-2.5 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <span className={`text-xs font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {formatPrice(amount)} purchase
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-orange-500">
                      {calculatePurchaseReward(amount)} 🪙
                    </span>
                    {isPremium && (
                      <span className="text-[9px] text-purple-500 font-bold bg-purple-500/10 px-1.5 py-0.5 rounded-full">+50%</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className={`text-[10px] mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              💡 Higher orders = higher multiplier. Premium users get 1.5x coins!
            </p>
          </div>

          {/* Referral Rewards */}
          <div className={`rounded-2xl p-4 ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
            <h3 className={`text-sm font-black flex items-center gap-2 mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              🤝 Referral Rewards
            </h3>
            <div className="space-y-1.5">
              {[
                { label: 'Friend Signup', you: '100 🪙', friend: '50 🪙' },
                { label: 'First Purchase', you: '200 🪙', friend: '—' },
                { label: '₹500+ Purchase', you: '500 🪙', friend: '—' },
                { label: '₹1000+ Purchase', you: '1000 🪙', friend: '—' },
              ].map(item => (
                <div key={item.label} className={`flex items-center justify-between p-2.5 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <span className={`text-xs font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{item.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-green-500">You: {item.you}</span>
                    <span className="text-xs text-orange-500">Friend: {item.friend}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coin Value Info */}
          <div className={`rounded-2xl p-4 ${isDark ? 'bg-orange-900/20 border border-orange-500/20' : 'bg-orange-50'}`}>
            <h3 className={`text-sm font-black mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              💡 Coin Economy Rules
            </h3>
            <div className="space-y-1.5 text-xs">
              {[
                '10 Afflo Coins = ₹1 value',
                'Coins CANNOT be converted to cash directly',
                'Use coins for: Coupons, Deals, Premium, Giveaways',
                'Higher rank = higher coin multiplier (up to 3x!)',
                'Premium users earn 1.5x more coins',
                'Daily streak bonus available every day',
              ].map((rule, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>{rule}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Purchase Slab Visual */}
          <div className={`rounded-2xl p-4 ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
            <h3 className={`text-sm font-black flex items-center gap-2 mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              📊 Earning Rate by Purchase Amount
            </h3>
            {PURCHASE_SLABS.slice(0, 5).map((slab, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] w-20 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  ₹{slab.minAmount}-{slab.maxAmount === Infinity ? '∞' : `₹${slab.maxAmount}`}
                </span>
                <div className={`flex-1 h-4 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div
                    className="h-full rounded-full bg-linear-to-r from-orange-500 to-amber-500 transition-all"
                    style={{ width: `${slab.coinsPerHundred}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-orange-500 w-16 text-right">{slab.coinsPerHundred}/₹100</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tagline */}
      <div className="text-center py-4">
        <p className={`text-xs font-bold ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
          🪙 "Earn. Rank. Win. Repeat." — Afflo Coin
        </p>
      </div>
    </div>
  );
}

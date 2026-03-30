/**
 * 🎁 GIVEAWAYS PAGE
 * Enter giveaways using Afflo Coins
 */
import { useState } from 'react';
import { Gift, Clock, Users, CheckCircle, Trophy, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useCoin } from '../context/CoinContext';

export function GiveawaysPage() {
  const { theme } = useApp();
  const { giveaways, enterGiveaway, balance } = useCoin();
  const isDark = theme === 'dark';
  const [tab, setTab] = useState<'active' | 'ended'>('active');
  const [enteredId, setEnteredId] = useState<string | null>(null);

  const activeGiveaways = giveaways.filter(g => g.isActive);
  const endedGiveaways = giveaways.filter(g => !g.isActive);

  const countdown = (ts: number) => {
    const diff = ts - Date.now();
    if (diff <= 0) return 'Ended';
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    if (d > 0) return `${d}d ${h}h`;
    return `${h}h ${m}m`;
  };

  const handleEnter = (id: string) => {
    const success = enterGiveaway(id);
    if (success) setEnteredId(id);
    setTimeout(() => setEnteredId(null), 3000);
  };

  const displayGiveaways = tab === 'active' ? activeGiveaways : endedGiveaways;

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
          🎁 Giveaways
        </h1>
        <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Use Afflo Coins to enter and win amazing prizes!
        </p>
        <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold mt-3 ${
          isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-700'
        }`}>
          🪙 Balance: {balance.toLocaleString()} coins
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex gap-1 p-1 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <button
          onClick={() => setTab('active')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            tab === 'active'
              ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-sm'
              : isDark ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          <Gift className="w-3.5 h-3.5" /> Active ({activeGiveaways.length})
        </button>
        <button
          onClick={() => setTab('ended')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            tab === 'ended'
              ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-sm'
              : isDark ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" /> Ended ({endedGiveaways.length})
        </button>
      </div>

      {/* Giveaway Cards */}
      <div className="space-y-4">
        {displayGiveaways.map(giveaway => (
          <div
            key={giveaway.id}
            className={`rounded-2xl overflow-hidden transition-all ${
              giveaway.entered && enteredId === giveaway.id
                ? 'ring-2 ring-green-500 shadow-lg shadow-green-500/20'
                : isDark ? 'bg-gray-800' : 'bg-white shadow-sm'
            }`}
          >
            {/* Prize Image */}
            <div className="relative h-40 sm:h-48 overflow-hidden">
              <img
                src={giveaway.prizeImage}
                alt={giveaway.prize}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
              
              {/* Status Badge */}
              <div className="absolute top-3 left-3">
                {giveaway.isActive ? (
                  <span className="px-3 py-1 bg-green-500 text-white text-[10px] font-bold rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-gray-500 text-white text-[10px] font-bold rounded-full">
                    ENDED
                  </span>
                )}
              </div>

              {/* Entry Cost Badge */}
              <div className="absolute top-3 right-3">
                <span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-bold rounded-full">
                  {giveaway.entryCost} 🪙 Entry
                </span>
              </div>

              {/* Prize Info */}
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-white font-black text-lg">{giveaway.title}</h3>
                <p className="text-white/80 text-xs">{giveaway.prize}</p>
              </div>
            </div>

            {/* Details */}
            <div className={`p-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <p className={`text-xs mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {giveaway.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className={`text-center p-2 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <Users className={`w-4 h-4 mx-auto mb-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <p className={`text-xs font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {giveaway.totalEntries}
                  </p>
                  <p className={`text-[9px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Entries</p>
                </div>
                <div className={`text-center p-2 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <Gift className={`w-4 h-4 mx-auto mb-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <p className={`text-xs font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {giveaway.maxEntries - giveaway.totalEntries}
                  </p>
                  <p className={`text-[9px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Spots Left</p>
                </div>
                <div className={`text-center p-2 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <Clock className={`w-4 h-4 mx-auto mb-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <p className={`text-xs font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {countdown(giveaway.endTime)}
                  </p>
                  <p className={`text-[9px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Time Left</p>
                </div>
              </div>

              {/* Entry progress bar */}
              <div className={`h-2 rounded-full overflow-hidden mb-3 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div
                  className="h-full rounded-full bg-linear-to-r from-orange-500 to-amber-500 transition-all"
                  style={{ width: `${(giveaway.totalEntries / giveaway.maxEntries) * 100}%` }}
                />
              </div>

              {/* Action Button */}
              {!giveaway.isActive ? (
                giveaway.winner ? (
                  <div className={`text-center p-3 rounded-xl ${isDark ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
                    <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                    <p className={`text-sm font-black ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                      Winner: {giveaway.winner} 🎉
                    </p>
                  </div>
                ) : (
                  <div className={`text-center py-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Giveaway ended
                  </div>
                )
              ) : giveaway.entered ? (
                <div className="w-full py-3 bg-green-500/10 text-green-500 rounded-xl font-bold text-sm text-center flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" /> You're Entered! 🎉
                </div>
              ) : (
                <button
                  onClick={() => handleEnter(giveaway.id)}
                  disabled={balance < giveaway.entryCost}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                    balance >= giveaway.entryCost
                      ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  {balance >= giveaway.entryCost
                    ? `Enter for ${giveaway.entryCost} 🪙`
                    : `Need ${giveaway.entryCost - balance} more coins`
                  }
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className={`rounded-2xl p-4 ${isDark ? 'bg-gray-800' : 'bg-orange-50'}`}>
        <h3 className={`text-sm font-black mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          ❓ How Giveaways Work
        </h3>
        <div className="space-y-2">
          {[
            { step: '1', text: 'Use Afflo Coins to enter a giveaway' },
            { step: '2', text: 'Each giveaway has limited spots' },
            { step: '3', text: 'Winner selected randomly when timer ends' },
            { step: '4', text: 'Prize delivered to your address' },
          ].map(item => (
            <div key={item.step} className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-linear-to-r from-orange-500 to-amber-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                {item.step}
              </span>
              <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

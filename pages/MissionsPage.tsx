/**
 * 🎯 MISSIONS PAGE
 * Daily/Weekly/Special missions + Spin Wheel
 */
import { useState, useRef } from 'react';
import { CheckCircle, Clock, Gift, Sparkles, RotateCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useCoin } from '../context/CoinContext';

const SPIN_PRIZES = [5, 10, 15, 20, 25, 50, 75, 100];
const SPIN_COLORS = [
  'from-red-500 to-red-600', 'from-orange-500 to-orange-600',
  'from-yellow-500 to-yellow-600', 'from-green-500 to-green-600',
  'from-teal-500 to-teal-600', 'from-blue-500 to-blue-600',
  'from-purple-500 to-purple-600', 'from-pink-500 to-pink-600',
];

export function MissionsPage() {
  const { theme } = useApp();
  const { missions, completeMission, claimMission, spinWheel, canSpin, lastSpinTime } = useCoin();
  const isDark = theme === 'dark';
  const [missionTab, setMissionTab] = useState<'daily' | 'weekly' | 'special'>('daily');
  const [spinning, setSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<number | null>(null);
  const [spinAngle, setSpinAngle] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const filteredMissions = missions.filter(m => m.category === missionTab);
  const completedCount = filteredMissions.filter(m => m.completed).length;
  const totalReward = filteredMissions.reduce((s, m) => s + m.reward, 0);
  const earnedReward = filteredMissions.filter(m => m.claimed).reduce((s, m) => s + m.reward, 0);

  const handleSpin = () => {
    if (!canSpin || spinning) return;
    setSpinning(true);
    setSpinResult(null);
    const extraSpins = 5 + Math.random() * 5;
    const newAngle = spinAngle + (360 * extraSpins) + Math.random() * 360;
    setSpinAngle(newAngle);
    setTimeout(() => {
      const prize = spinWheel();
      setSpinResult(prize);
      setSpinning(false);
    }, 4000);
  };

  const nextSpinTime = () => {
    const diff = 86400000 - (Date.now() - lastSpinTime);
    if (diff <= 0) return 'Now!';
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}h ${m}m`;
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* ===== HEADER ===== */}
      <div className="text-center">
        <h1 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
          🎯 Daily Missions
        </h1>
        <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Complete tasks, earn Afflo Coins! 🪙
        </p>
      </div>

      {/* ===== SPIN WHEEL ===== */}
      <div className={`rounded-3xl p-5 sm:p-8 text-center ${
        isDark ? 'bg-linear-to-b from-gray-800 to-gray-900' : 'bg-linear-to-b from-orange-50 to-amber-50'
      }`}>
        <h2 className={`text-lg font-black mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          🎰 Daily Spin Wheel
        </h2>
        <p className={`text-xs mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Spin once every 24 hours for free coins!
        </p>

        {/* Wheel */}
        <div className="relative w-56 h-56 sm:w-72 sm:h-72 mx-auto mb-4">
          {/* Pointer */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 text-2xl">🔻</div>
          
          {/* Wheel body */}
          <div
            ref={wheelRef}
            className="w-full h-full rounded-full border-4 border-orange-500 overflow-hidden relative shadow-xl"
            style={{
              transform: `rotate(${spinAngle}deg)`,
              transition: spinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
            }}
          >
            {SPIN_PRIZES.map((prize, i) => {
              const angle = (360 / SPIN_PRIZES.length) * i;
              const skew = 90 - (360 / SPIN_PRIZES.length);
              return (
                <div
                  key={i}
                  className={`absolute w-1/2 h-1/2 origin-bottom-right bg-linear-to-br ${SPIN_COLORS[i]}`}
                  style={{
                    transform: `rotate(${angle}deg) skewY(-${skew}deg)`,
                    top: 0,
                    right: '50%',
                  }}
                >
                  <span
                    className="absolute text-white font-black text-xs sm:text-sm"
                    style={{
                      transform: `skewY(${skew}deg) rotate(${360 / SPIN_PRIZES.length / 2}deg)`,
                      top: '30%',
                      left: '50%',
                    }}
                  >
                    {prize}🪙
                  </span>
                </div>
              );
            })}
            {/* Center */}
            <div className="absolute inset-0 m-auto w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white shadow-lg flex items-center justify-center z-10">
              <span className="text-xl sm:text-2xl">🦕</span>
            </div>
          </div>
        </div>

        {/* Spin Result */}
        {spinResult !== null && (
          <div className="mb-4 animate-bounce">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-full shadow-lg">
              <Sparkles className="w-4 h-4" />
              <span className="font-black">You won {spinResult} Afflo Coins! 🎉</span>
            </div>
          </div>
        )}

        {/* Spin Button */}
        <button
          onClick={handleSpin}
          disabled={!canSpin || spinning}
          className={`px-8 py-3 rounded-full font-black text-sm transition-all ${
            canSpin && !spinning
              ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 hover:shadow-xl active:scale-95'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {spinning ? (
            <span className="flex items-center gap-2"><RotateCw className="w-4 h-4 animate-spin" /> Spinning...</span>
          ) : canSpin ? (
            <span className="flex items-center gap-2"><Gift className="w-4 h-4" /> SPIN NOW!</span>
          ) : (
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Next spin in {nextSpinTime()}</span>
          )}
        </button>
      </div>

      {/* ===== MISSION PROGRESS ===== */}
      <div className={`rounded-2xl p-4 ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Today's Progress
          </span>
          <span className={`text-xs font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {earnedReward}/{totalReward} 🪙
          </span>
        </div>
        <div className={`h-3 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <div
            className="h-full rounded-full bg-linear-to-r from-orange-500 to-amber-500 transition-all duration-500"
            style={{ width: `${filteredMissions.length > 0 ? (completedCount / filteredMissions.length) * 100 : 0}%` }}
          />
        </div>
        <p className={`text-[10px] mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          {completedCount}/{filteredMissions.length} missions completed
        </p>
      </div>

      {/* ===== MISSION TABS ===== */}
      <div className={`flex gap-1 p-1 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
        {[
          { id: 'daily' as const, label: '📅 Daily' },
          { id: 'weekly' as const, label: '📆 Weekly' },
          { id: 'special' as const, label: '⭐ Special' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setMissionTab(tab.id)}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
              missionTab === tab.id
                ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-sm'
                : isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===== MISSION LIST ===== */}
      <div className="space-y-2">
        {filteredMissions.map(mission => (
          <div
            key={mission.id}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
              mission.claimed
                ? isDark ? 'bg-green-900/20 border border-green-500/20' : 'bg-green-50 border border-green-200'
                : isDark ? 'bg-gray-800' : 'bg-white shadow-sm'
            }`}
          >
            <div className="text-2xl">{mission.icon}</div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-bold ${
                mission.claimed ? 'text-green-500 line-through' : isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {mission.title}
              </p>
              <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {mission.description}
              </p>
              {/* Progress */}
              {!mission.claimed && (
                <div className="flex items-center gap-2 mt-1.5">
                  <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <div
                      className="h-full rounded-full bg-linear-to-r from-orange-500 to-amber-500 transition-all"
                      style={{ width: `${(mission.progress / mission.target) * 100}%` }}
                    />
                  </div>
                  <span className={`text-[9px] font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {mission.progress}/{mission.target}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs font-black text-orange-500">+{mission.reward} 🪙</span>
              {mission.claimed ? (
                <span className="flex items-center gap-1 text-[10px] text-green-500 font-bold">
                  <CheckCircle className="w-3 h-3" /> Claimed
                </span>
              ) : mission.completed ? (
                <button
                  onClick={() => claimMission(mission.id)}
                  className="px-3 py-1 bg-linear-to-r from-orange-500 to-amber-500 text-white rounded-full text-[10px] font-bold active:scale-95 transition-all animate-pulse"
                >
                  Claim!
                </button>
              ) : (
                <button
                  onClick={() => completeMission(mission.id)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${
                    isDark ? 'border-gray-600 text-gray-400' : 'border-gray-200 text-gray-400'
                  }`}
                >
                  Do it →
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ===== INFO ===== */}
      <div className={`text-center py-4 text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
        🎯 Missions reset daily at midnight IST<br />
        🪙 Complete all missions for bonus coins!
      </div>
    </div>
  );
}

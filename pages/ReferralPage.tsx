/**
 * 🤝 REFERRAL PAGE
 * Invite friends → Unlock premium for free
 * "Unlock Premium for FREE 🔥"
 */
import { useState } from 'react';
import { Copy, Share2, CheckCircle, Clock, Users, Crown, Gift, Star, ExternalLink, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useCoin, REFERRAL_TIERS } from '../context/CoinContext';

export function ReferralPage() {
  const { theme } = useApp();
  const { referral, balance } = useCoin();
  const isDark = theme === 'dark';
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const referralLink = `https://afflosaur.com/join?ref=${referral.code}`;

  const copyCode = () => {
    navigator.clipboard.writeText(referralLink).catch(() => {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = referralLink;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=Join%20Afflosaur%20and%20get%2050%20free%20coins!%20${encodeURIComponent(referralLink)}`, '_blank');
  };

  const shareTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=Join%20Afflosaur%20and%20get%2050%20free%20coins!`, '_blank');
  };

  // Current tier progress
  const currentTierIndex = REFERRAL_TIERS.findIndex(t => referral.verifiedReferrals < t.referrals);
  const nextTier = currentTierIndex >= 0 ? REFERRAL_TIERS[currentTierIndex] : null;
  const prevTier = currentTierIndex > 0 ? REFERRAL_TIERS[currentTierIndex - 1] : null;
  const progress = nextTier
    ? ((referral.verifiedReferrals - (prevTier?.referrals || 0)) / (nextTier.referrals - (prevTier?.referrals || 0))) * 100
    : 100;

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
          🎁 Unlock Premium for FREE
        </h1>
        <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Invite friends. Go premium. No payment needed! 🔥
        </p>
      </div>

      {/* Referral Stats Card */}
      <div className="relative overflow-hidden rounded-3xl p-6 bg-linear-to-br from-purple-600 via-pink-500 to-orange-500 text-white shadow-2xl">
        <div className="absolute -right-8 -top-8 text-[100px] opacity-10 select-none">🤝</div>
        
        <div className="relative z-10">
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center">
              <p className="text-3xl font-black">{referral.totalReferrals}</p>
              <p className="text-[10px] opacity-80">Total Invites</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-green-300">{referral.verifiedReferrals}</p>
              <p className="text-[10px] opacity-80">Verified</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-yellow-300">{referral.pendingReferrals}</p>
              <p className="text-[10px] opacity-80">Pending</p>
            </div>
          </div>

          {/* Referral Code */}
          <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-[10px] opacity-70 mb-1">Your Referral Code</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-lg font-black tracking-widest">{referral.code}</code>
              <button
                onClick={copyCode}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all active:scale-95"
              >
                {copied ? <CheckCircle className="w-5 h-5 text-green-300" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={shareWhatsApp}
          className="flex flex-col items-center gap-1.5 p-3 bg-green-500 text-white rounded-xl font-bold text-xs active:scale-95 transition-all shadow-lg shadow-green-500/20"
        >
          <MessageCircle className="w-5 h-5" />
          WhatsApp
        </button>
        <button
          onClick={shareTelegram}
          className="flex flex-col items-center gap-1.5 p-3 bg-blue-500 text-white rounded-xl font-bold text-xs active:scale-95 transition-all shadow-lg shadow-blue-500/20"
        >
          <ExternalLink className="w-5 h-5" />
          Telegram
        </button>
        <button
          onClick={() => { setShowShareMenu(!showShareMenu); copyCode(); }}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl font-bold text-xs active:scale-95 transition-all ${
            isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          <Share2 className="w-5 h-5" />
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>

      {/* Premium Unlock Progress */}
      <div className={`rounded-2xl p-4 sm:p-5 ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
        <h3 className={`text-sm font-black flex items-center gap-2 mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <Crown className="w-4 h-4 text-orange-500" /> Premium Unlock Progress
        </h3>

        {/* Progress bar */}
        {nextTier && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xs font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {referral.verifiedReferrals} / {nextTier.referrals} referrals
              </span>
              <span className="text-xs font-bold text-orange-500">{nextTier.label}</span>
            </div>
            <div className={`h-3 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div
                className="h-full rounded-full bg-linear-to-r from-purple-500 via-pink-500 to-orange-500 transition-all duration-1000 relative"
                style={{ width: `${Math.min(progress, 100)}%` }}
              >
                <div className="absolute right-0 top-0 h-full w-4 bg-white/30 rounded-full animate-pulse" />
              </div>
            </div>
            <p className={`text-[10px] mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {nextTier.referrals - referral.verifiedReferrals} more to unlock {nextTier.label}
            </p>
          </div>
        )}

        {/* Tier Cards */}
        <div className="space-y-2">
          {REFERRAL_TIERS.map((tier, i) => {
            const isUnlocked = referral.verifiedReferrals >= tier.referrals;
            const isCurrent = referral.premiumTier === tier.tier;
            return (
              <div
                key={tier.tier}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  isCurrent
                    ? 'border-orange-500 shadow-lg shadow-orange-500/10'
                    : isUnlocked
                    ? isDark ? 'border-green-500/30 bg-green-900/10' : 'border-green-200 bg-green-50'
                    : isDark ? 'border-gray-700 opacity-50' : 'border-gray-200 opacity-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                  isUnlocked
                    ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white'
                    : isDark ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-400'
                }`}>
                  {isUnlocked ? '✅' : ['🥉', '🥈', '🥇', '💎', '👑'][i]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {tier.label}
                  </p>
                  <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {tier.referrals} referrals • {tier.days > 365 ? 'Lifetime' : `${tier.days} days`}
                  </p>
                </div>
                {isCurrent && (
                  <span className="px-2 py-0.5 bg-orange-500 text-white text-[9px] font-bold rounded-full">
                    ACTIVE
                  </span>
                )}
                {isUnlocked && !isCurrent && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Referral List */}
      <div className={`rounded-2xl p-4 ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
        <h3 className={`text-sm font-black flex items-center gap-2 mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <Users className="w-4 h-4 text-orange-500" /> Your Referrals ({referral.referralList.length})
        </h3>
        <div className="space-y-2">
          {referral.referralList.map(ref => (
            <div
              key={ref.id}
              className={`flex items-center gap-3 p-2.5 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg ${
                isDark ? 'bg-gray-600' : 'bg-white'
              }`}>
                {ref.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{ref.name}</p>
                <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  {new Date(ref.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {ref.coinsEarned > 0 && (
                  <span className="text-[10px] text-green-500 font-bold">+{ref.coinsEarned} 🪙</span>
                )}
                {ref.status === 'verified' ? (
                  <span className="flex items-center gap-0.5 text-[10px] text-green-500 font-bold">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-0.5 text-[10px] text-yellow-500 font-bold">
                    <Clock className="w-3 h-3" /> Pending
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How Referrals Work */}
      <div className={`rounded-2xl p-4 ${isDark ? 'bg-purple-900/20 border border-purple-500/20' : 'bg-purple-50'}`}>
        <h3 className={`text-sm font-black mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          ❓ How It Works
        </h3>
        <div className="space-y-2.5">
          {[
            { icon: '📤', text: 'Share your unique referral link with friends' },
            { icon: '👤', text: 'Friend signs up & completes first action' },
            { icon: '🪙', text: 'Both of you get 50 Afflo Coins!' },
            { icon: '👑', text: 'Reach referral milestones → unlock Premium FREE' },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xl">{step.icon}</span>
              <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{step.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards breakdown */}
      <div className={`rounded-2xl p-4 ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
        <h3 className={`text-sm font-black flex items-center gap-2 mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <Gift className="w-4 h-4 text-orange-500" /> Referral Rewards
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Per Signup', reward: '+50 🪙 both' },
            { label: 'First Purchase', reward: '+200 🪙' },
            { label: '5 Referrals', reward: 'Bonus spin 🎰' },
            { label: '20 Referrals', reward: 'VIP Badge 👑' },
          ].map(item => (
            <div key={item.label} className={`p-3 rounded-xl text-center ${isDark ? 'bg-gray-700' : 'bg-orange-50'}`}>
              <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{item.label}</p>
              <p className={`text-sm font-black mt-0.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.reward}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Wallet balance */}
      <div className={`text-center py-3 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        <Star className="w-4 h-4 inline text-orange-500 mr-1" />
        Current balance: <span className="font-bold text-orange-500">{balance.toLocaleString()} 🪙</span>
      </div>
    </div>
  );
}

/**
 * 👑 PREMIUM PAGE
 * Afflosaur Premium - ₹49/month or 2000 coins
 * Benefits: +50% coins, 1.5x referrals, no ads, VIP deals
 */
import { Crown, Check, Zap, Shield, Star, Gift, ChevronRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useCoin, PREMIUM_PLANS, REFERRAL_TIERS } from '../context/CoinContext';

export function PremiumPage() {
  const { theme, setPage } = useApp();
  const { isPremium, premiumPlan, premiumExpiry, activatePremium, balance } = useCoin();
  const isDark = theme === 'dark';

  const daysLeft = premiumExpiry ? Math.max(0, Math.ceil((premiumExpiry - Date.now()) / 86400000)) : 0;

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-r from-yellow-400 to-orange-500 text-3xl mb-3 shadow-lg shadow-orange-500/30">
          👑
        </div>
        <h1 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Afflosaur Premium
        </h1>
        <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Upgrade your shopping. Save more. Earn faster.
        </p>
      </div>

      {/* Active Premium Card */}
      {isPremium && (
        <div className="rounded-3xl p-5 bg-linear-to-br from-yellow-500 via-orange-500 to-pink-500 text-white shadow-2xl shadow-orange-500/30 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 text-[100px] opacity-10 select-none">👑</div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-5 h-5" />
              <span className="text-sm font-bold">Premium Active</span>
            </div>
            <p className="text-2xl font-black mt-1">
              {premiumPlan ? premiumPlan.charAt(0).toUpperCase() + premiumPlan.slice(1) : 'Premium'} Plan
            </p>
            <p className="text-sm opacity-80 mt-0.5">{daysLeft} days remaining</p>
            <div className="flex items-center gap-2 mt-3">
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold">✅ All Benefits Active</span>
            </div>
          </div>
        </div>
      )}

      {/* First Month Offer */}
      {!isPremium && (
        <div className="rounded-2xl p-4 bg-linear-to-r from-red-500 to-pink-500 text-white text-center relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-6xl opacity-10 select-none">🔥</div>
          <p className="text-lg font-black">🔥 First Month = ₹9 Only!</p>
          <p className="text-xs opacity-80 mt-0.5">Limited time. Cancel anytime.</p>
          <button className="mt-2 px-6 py-2 bg-white text-red-500 rounded-full font-bold text-sm active:scale-95 transition-all shadow-lg">
            Claim ₹9 Offer →
          </button>
        </div>
      )}

      {/* Benefits Grid */}
      <div className={`rounded-2xl p-4 sm:p-5 ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
        <h2 className={`text-sm font-black mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          ⭐ Premium Benefits
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: <Zap className="w-5 h-5 text-yellow-500" />, title: '+50% More Coins', desc: '₹100 purchase = 75 coins instead of 50', tag: 'BEST' },
            { icon: <Gift className="w-5 h-5 text-pink-500" />, title: '1.5x Referral Rewards', desc: 'Get 150 coins per referral instead of 100', tag: '' },
            { icon: <Shield className="w-5 h-5 text-blue-500" />, title: 'No Ads', desc: 'Clean, fast, ad-free experience', tag: '' },
            { icon: <Star className="w-5 h-5 text-purple-500" />, title: 'Premium Deals', desc: 'Exclusive deals only for premium members', tag: 'VIP' },
            { icon: <Sparkles className="w-5 h-5 text-orange-500" />, title: 'Free Deal Unlock', desc: 'Fast deals unlock without spending coins', tag: '' },
            { icon: <Crown className="w-5 h-5 text-amber-500" />, title: '5x Giveaway Entries', desc: '5 entries per giveaway instead of 1', tag: '' },
            { icon: <Check className="w-5 h-5 text-green-500" />, title: '20% Off Redemptions', desc: 'All coin spends cost 20% less', tag: 'SAVE' },
            { icon: <Star className="w-5 h-5 text-teal-500" />, title: 'Prayagraj Priority', desc: 'Early access to local deals', tag: 'LOCAL' },
          ].map((benefit, i) => (
            <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isDark ? 'bg-gray-600' : 'bg-white shadow-sm'}`}>
                {benefit.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{benefit.title}</p>
                  {benefit.tag && (
                    <span className="text-[8px] px-1.5 py-0.5 bg-linear-to-r from-orange-500 to-amber-500 text-white rounded-full font-bold">
                      {benefit.tag}
                    </span>
                  )}
                </div>
                <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className="space-y-3">
        <h2 className={`text-sm font-black px-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          💰 Choose Your Plan
        </h2>
        {PREMIUM_PLANS.map(plan => (
          <div
            key={plan.id}
            className={`rounded-2xl overflow-hidden border-2 transition-all ${
              plan.popular
                ? 'border-orange-500 shadow-lg shadow-orange-500/10'
                : isPremium && premiumPlan === plan.id
                ? 'border-green-500 shadow-lg shadow-green-500/10'
                : isDark ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            {plan.popular && (
              <div className="bg-linear-to-r from-orange-500 to-amber-500 text-white text-center py-1 text-[10px] font-bold">
                ⭐ MOST POPULAR — BEST VALUE
              </div>
            )}
            <div className={`p-4 bg-linear-to-r ${plan.color} text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{plan.icon}</span>
                  <div>
                    <p className="font-black text-lg">{plan.name}</p>
                    <p className="text-[10px] opacity-80">{plan.duration}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-2xl">₹{plan.priceINR}</p>
                  <p className="text-[10px] opacity-80">or {plan.coinCost.toLocaleString()} 🪙</p>
                </div>
              </div>
            </div>
            <div className={`p-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="space-y-1.5 mb-3">
                {plan.benefits.map((b: string, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{b}</span>
                  </div>
                ))}
              </div>
              {isPremium && premiumPlan === plan.id ? (
                <div className="w-full py-2.5 bg-green-500/10 text-green-500 rounded-xl font-bold text-xs text-center">
                  ✅ Active — {daysLeft} days left
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => activatePremium(plan.id, 'money')}
                    className="flex-1 py-2.5 bg-linear-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold text-xs active:scale-[0.98] transition-all"
                  >
                    ₹{plan.priceINR}
                  </button>
                  <button
                    onClick={() => activatePremium(plan.id, 'coins')}
                    disabled={balance < plan.coinCost}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs active:scale-[0.98] transition-all border-2 ${
                      balance >= plan.coinCost
                        ? isDark ? 'border-orange-500 text-orange-400 hover:bg-orange-500/10' : 'border-orange-500 text-orange-600 hover:bg-orange-50'
                        : 'border-gray-300 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {plan.coinCost.toLocaleString()} 🪙
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Or unlock via referral */}
      <div className={`rounded-2xl p-4 ${isDark ? 'bg-purple-900/20 border border-purple-500/20' : 'bg-purple-50 border border-purple-200'}`}>
        <h3 className={`text-sm font-black mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          🎁 Or Unlock Premium for FREE
        </h3>
        <p className={`text-xs mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Invite friends → Go premium. No payment needed!
        </p>
        <div className="space-y-1.5 mb-3">
          {REFERRAL_TIERS.map((tier) => (
            <div key={tier.tier} className={`flex items-center justify-between p-2.5 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <span className={`text-xs font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {tier.referrals} referrals
              </span>
              <span className="text-xs font-bold text-purple-500">
                {tier.label} ({tier.days > 365 ? 'Lifetime' : `${tier.days} days`})
              </span>
            </div>
          ))}
        </div>
        <button
          onClick={() => setPage('referral')}
          className="w-full py-3 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          Start Referring <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Comparison */}
      <div className={`rounded-2xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
        <div className="p-4">
          <h3 className={`text-sm font-black mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            📊 Free vs Premium
          </h3>
          <div className="space-y-0">
            {[
              { feature: 'Purchase Coins', free: '50/₹100', premium: '75/₹100' },
              { feature: 'Referral Reward', free: '100 coins', premium: '150 coins' },
              { feature: 'Giveaway Entries', free: '1 entry', premium: '5 entries' },
              { feature: 'Deal Unlock', free: 'Pay coins', premium: 'Free unlock' },
              { feature: 'Redemption Cost', free: 'Full price', premium: '20% off' },
              { feature: 'Ads', free: 'Yes', premium: 'No ads' },
              { feature: 'Prayagraj Priority', free: 'No', premium: 'Yes' },
              { feature: 'AI Deal Alerts', free: 'No', premium: 'Yes' },
            ].map((row, i) => (
              <div key={i} className={`flex items-center py-2.5 border-b text-xs ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                <span className={`flex-1 font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{row.feature}</span>
                <span className={`w-24 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{row.free}</span>
                <span className="w-24 text-center font-bold text-orange-500">{row.premium}</span>
              </div>
            ))}
          </div>
          <div className={`flex items-center mt-2 pt-1 text-[10px] font-bold ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            <span className="flex-1" />
            <span className="w-24 text-center">Free</span>
            <span className="w-24 text-center text-orange-500">Premium 👑</span>
          </div>
        </div>
      </div>

      {/* Festival Pass */}
      <div className="rounded-2xl p-4 bg-linear-to-r from-green-500 to-emerald-500 text-white text-center relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 text-8xl opacity-10 select-none">🎪</div>
        <p className="text-sm font-black">🎊 Weekend Festival Pass — ₹19 Only!</p>
        <p className="text-[10px] opacity-80 mt-0.5">Full premium benefits for 3 days. Limited availability.</p>
        <button className="mt-2 px-6 py-2 bg-white text-green-600 rounded-full font-bold text-xs active:scale-95 transition-all shadow-lg">
          Get Festival Pass →
        </button>
      </div>
    </div>
  );
}

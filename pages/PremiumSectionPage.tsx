/**
 * 👑 PREMIUM SECTION PAGE
 * Exclusive area only for premium users
 * 
 * Contains:
 * - Secret Flash Deals (coin-unlock or free for premium)
 * - Hidden Coupon Codes
 * - Early Access Products
 * - Premium-Only Deals
 * - AI Deal Alerts setup
 * - VIP Giveaway section
 * - Secret Prayagraj local deals
 */
import { useState } from 'react';
import { 
  Crown, Zap, Tag, Clock, Gift, MapPin, Bell, 
  Copy, Check, Eye, Star, Sparkles,
  ChevronRight, Lock, ShoppingBag, Timer, Flame
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useCoin } from '../context/CoinContext';
import { PremiumGate } from '../components/PremiumGate';

// ---- Types ----
interface SecretDeal {
  id: string;
  title: string;
  image: string;
  originalPrice: number;
  dealPrice: number;
  store: string;
  storeColor: string;
  affiliateUrl: string;
  expiresIn: string;
  category: string;
  badge: string;
  coinCost: number;
  unlocked: boolean;
}

interface HiddenCoupon {
  id: string;
  code: string;
  store: string;
  storeIcon: string;
  discount: string;
  minOrder: string;
  expiresIn: string;
  category: string;
  isRevealed: boolean;
}

interface EarlyAccessProduct {
  id: string;
  title: string;
  image: string;
  price: number;
  launchDate: string;
  store: string;
  description: string;
  tag: string;
}

// ---- Mock Data ----
const SECRET_DEALS: SecretDeal[] = [
  {
    id: 'sd1', title: 'boAt Airdopes 141 TWS', image: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=300',
    originalPrice: 4490, dealPrice: 899, store: 'Amazon', storeColor: 'from-yellow-500 to-orange-500',
    affiliateUrl: '#', expiresIn: '2h 34m', category: 'Electronics', badge: '🔥 80% OFF', coinCost: 0, unlocked: true
  },
  {
    id: 'sd2', title: 'Fire-Boltt Ninja Call Pro', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
    originalPrice: 8999, dealPrice: 1499, store: 'Flipkart', storeColor: 'from-blue-500 to-blue-700',
    affiliateUrl: '#', expiresIn: '5h 12m', category: 'Smartwatch', badge: '⚡ FLASH', coinCost: 0, unlocked: true
  },
  {
    id: 'sd3', title: 'Noise ColorFit Pro 4', image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=300',
    originalPrice: 5999, dealPrice: 1999, store: 'Amazon', storeColor: 'from-yellow-500 to-orange-500',
    affiliateUrl: '#', expiresIn: '1h 45m', category: 'Wearable', badge: '💎 VIP DEAL', coinCost: 0, unlocked: true
  },
  {
    id: 'sd4', title: 'Portronics SoundDrum 1', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300',
    originalPrice: 3999, dealPrice: 799, store: 'Meesho', storeColor: 'from-pink-500 to-purple-500',
    affiliateUrl: '#', expiresIn: '45m', category: 'Speaker', badge: '🎯 LOWEST', coinCost: 0, unlocked: true
  },
  {
    id: 'sd5', title: 'pTron Bassbuds Duo', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
    originalPrice: 1299, dealPrice: 399, store: 'Flipkart', storeColor: 'from-blue-500 to-blue-700',
    affiliateUrl: '#', expiresIn: '3h 20m', category: 'Earbuds', badge: '🔥 69% OFF', coinCost: 0, unlocked: true
  },
  {
    id: 'sd6', title: 'Redmi 10000mAh Power Bank', image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300',
    originalPrice: 1499, dealPrice: 699, store: 'Amazon', storeColor: 'from-yellow-500 to-orange-500',
    affiliateUrl: '#', expiresIn: '6h 10m', category: 'Accessories', badge: '⭐ TOP PICK', coinCost: 0, unlocked: true
  },
];

const HIDDEN_COUPONS: HiddenCoupon[] = [
  { id: 'c1', code: 'AFFLOPRO50', store: 'Amazon', storeIcon: '🟡', discount: '₹50 OFF', minOrder: '₹299+', expiresIn: '2 days', category: 'All', isRevealed: false },
  { id: 'c2', code: 'FKDEAL200', store: 'Flipkart', storeIcon: '🔵', discount: '₹200 OFF', minOrder: '₹999+', expiresIn: '1 day', category: 'Electronics', isRevealed: false },
  { id: 'c3', code: 'MEESHO30', store: 'Meesho', storeIcon: '🟣', discount: '30% OFF', minOrder: '₹499+', expiresIn: '3 days', category: 'Fashion', isRevealed: false },
  { id: 'c4', code: 'NYKAA15', store: 'Nykaa', storeIcon: '💄', discount: '15% OFF', minOrder: '₹599+', expiresIn: '5 days', category: 'Beauty', isRevealed: false },
  { id: 'c5', code: 'AJIO40OFF', store: 'Ajio', storeIcon: '👕', discount: '40% OFF', minOrder: '₹799+', expiresIn: '2 days', category: 'Fashion', isRevealed: false },
  { id: 'c6', code: 'LOCAL100', store: 'Prayagraj', storeIcon: '📍', discount: '₹100 OFF', minOrder: '₹500+', expiresIn: '7 days', category: 'Local', isRevealed: false },
];

const EARLY_ACCESS: EarlyAccessProduct[] = [
  { id: 'ea1', title: 'Nothing Phone (2a) Plus', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300', price: 27999, launchDate: 'Drops in 3 days', store: 'Flipkart', description: 'Latest Nothing Phone with Glyph interface', tag: '📱 Phone' },
  { id: 'ea2', title: 'Samsung Galaxy Buds 3', image: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=300', price: 5999, launchDate: 'Drops in 5 days', store: 'Amazon', description: 'Next-gen TWS with AI noise cancellation', tag: '🎧 Audio' },
  { id: 'ea3', title: 'Amazfit GTR 5', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300', price: 14999, launchDate: 'Drops in 1 week', store: 'Amazon', description: 'Premium smartwatch with AMOLED display', tag: '⌚ Watch' },
];

export function PremiumSectionPage() {
  const { theme, setPage } = useApp();
  const { isPremium, balance, spendCoins, currentRank, premiumPlan, premiumExpiry } = useCoin();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'deals' | 'coupons' | 'early' | 'vip' | 'local'>('deals');
  const [revealedCoupons, setRevealedCoupons] = useState<Set<string>>(new Set());
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const [alertsEnabled, setAlertsEnabled] = useState(false);

  const daysLeft = premiumExpiry ? Math.max(0, Math.ceil((premiumExpiry - Date.now()) / 86400000)) : 0;

  const revealCoupon = (couponId: string) => {
    if (!isPremium) return;
    setRevealedCoupons(prev => new Set(prev).add(couponId));
  };

  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2000);
  };

  const tabs = [
    { id: 'deals' as const, label: 'Secret Deals', icon: <Zap className="w-4 h-4" />, emoji: '⚡', count: SECRET_DEALS.length },
    { id: 'coupons' as const, label: 'Hidden Coupons', icon: <Tag className="w-4 h-4" />, emoji: '🎫', count: HIDDEN_COUPONS.length },
    { id: 'early' as const, label: 'Early Access', icon: <Clock className="w-4 h-4" />, emoji: '🚀', count: EARLY_ACCESS.length },
    { id: 'vip' as const, label: 'VIP Zone', icon: <Gift className="w-4 h-4" />, emoji: '💎' },
    { id: 'local' as const, label: 'Prayagraj+', icon: <MapPin className="w-4 h-4" />, emoji: '📍' },
  ];

  return (
    <div className="space-y-5 max-w-5xl mx-auto">

      {/* ===== PREMIUM HEADER ===== */}
      <div className="relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-linear-to-br from-amber-500 via-orange-500 to-red-500" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySC0yNHYtMmgxMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        
        <div className="relative px-5 py-6 sm:px-8 sm:py-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-white text-[10px] font-bold mb-3">
                <Crown className="w-3.5 h-3.5" />
                {isPremium ? 'PREMIUM ACTIVE' : 'PREMIUM ZONE'}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {isPremium ? 'Welcome Back, VIP! 👑' : 'Premium Section 🔒'}
              </h1>
              <p className="text-white/70 text-xs sm:text-sm mt-1 max-w-md">
                {isPremium 
                  ? `${premiumPlan?.charAt(0).toUpperCase()}${premiumPlan?.slice(1)} plan • ${daysLeft} days left • ${currentRank.icon} ${currentRank.name}`
                  : 'Unlock exclusive deals, hidden coupons, early access & VIP perks.'
                }
              </p>
              {isPremium && (
                <div className="flex items-center gap-3 mt-3">
                  <div className="px-3 py-1.5 bg-white/20 backdrop-blur rounded-xl text-white text-xs font-bold">
                    🪙 {balance.toLocaleString()} Coins
                  </div>
                  <div className="px-3 py-1.5 bg-white/20 backdrop-blur rounded-xl text-white text-xs font-bold">
                    {currentRank.icon} {currentRank.name}
                  </div>
                </div>
              )}
            </div>
            <div className="text-6xl sm:text-8xl opacity-20 select-none">👑</div>
          </div>
        </div>
      </div>

      {/* ===== NON-PREMIUM: Show upgrade prompt ===== */}
      {!isPremium && (
        <div className={`rounded-2xl p-5 border-2 border-dashed ${
          isDark ? 'border-amber-500/30 bg-amber-900/10' : 'border-amber-400/40 bg-amber-50'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className={`font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>Go Premium to Access</h2>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Starting at just ₹49/month or 2000 Afflo Coins
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {['⚡ Secret Deals', '🎫 Hidden Coupons', '🚀 Early Access', '💎 VIP Zone'].map((item, i) => (
              <div key={i} className={`p-2.5 rounded-xl text-center text-xs font-bold ${
                isDark ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700 shadow-sm'
              }`}>
                {item}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage('premium')}
              className="flex-1 py-3 bg-linear-to-r from-amber-500 via-orange-500 to-red-500 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-orange-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4" /> Unlock Premium — ₹49/mo
            </button>
            <button
              onClick={() => setPage('referral')}
              className={`px-4 py-3 rounded-xl font-bold text-xs transition border-2 ${
                isDark ? 'border-gray-700 text-gray-300 hover:border-amber-500' : 'border-gray-200 text-gray-600 hover:border-amber-400'
              }`}
            >
              Free via Referral
            </button>
          </div>
        </div>
      )}

      {/* ===== TAB NAVIGATION ===== */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 ${
              activeTab === tab.id
                ? 'bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/20'
                : isDark
                  ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
            }`}
          >
            <span>{tab.emoji}</span>
            {tab.label}
            {tab.count && (
              <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${
                activeTab === tab.id ? 'bg-white/20' : isDark ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ===== TAB CONTENT ===== */}
      <PremiumGate
        title="Unlock Premium to Access"
        description="Get secret deals, hidden coupons, early product access, and VIP perks."
        showPreview={true}
      >
        {/* SECRET DEALS */}
        {activeTab === 'deals' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <h2 className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Secret Flash Deals ⚡
                </h2>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-600'
              }`}>
                <Flame className="w-3 h-3" />
                Limited Time
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {SECRET_DEALS.map(deal => (
                <div key={deal.id} className={`rounded-2xl overflow-hidden border transition-all hover:shadow-lg ${
                  isDark ? 'bg-gray-800 border-gray-700 hover:border-amber-500/30' : 'bg-white border-gray-200 hover:border-amber-400/50'
                }`}>
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden">
                    <img src={deal.image} alt={deal.title} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 bg-linear-to-r from-red-500 to-pink-500 text-white text-[10px] font-black rounded-lg shadow-lg">
                        {deal.badge}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 bg-linear-to-r ${deal.storeColor} text-white text-[10px] font-bold rounded-lg`}>
                        {deal.store}
                      </span>
                    </div>
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/70 text-white text-[10px] font-bold rounded-lg backdrop-blur">
                      <Timer className="w-3 h-3" />
                      {deal.expiresIn}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{deal.category}</p>
                    <h3 className={`text-sm font-bold mt-0.5 line-clamp-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {deal.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-lg font-black text-orange-500">₹{deal.dealPrice.toLocaleString()}</span>
                      <span className={`text-xs line-through ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        ₹{deal.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded">
                        {Math.round((1 - deal.dealPrice / deal.originalPrice) * 100)}% OFF
                      </span>
                    </div>

                    <button
                      onClick={() => window.open(deal.affiliateUrl, '_blank')}
                      className="w-full mt-3 py-2.5 bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-xs hover:shadow-lg hover:shadow-orange-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Grab Deal on {deal.store}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HIDDEN COUPONS */}
        {activeTab === 'coupons' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-amber-500" />
              <h2 className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Hidden Coupon Codes 🎫
              </h2>
            </div>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Click to reveal exclusive coupon codes. Premium members only!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {HIDDEN_COUPONS.map(coupon => {
                const isRevealed = revealedCoupons.has(coupon.id);
                const isCopied = copiedCoupon === coupon.code;

                return (
                  <div key={coupon.id} className={`rounded-2xl border overflow-hidden transition-all ${
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}>
                    {/* Top bar */}
                    <div className={`px-4 py-2.5 flex items-center justify-between ${
                      isDark ? 'bg-gray-750' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{coupon.storeIcon}</span>
                        <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {coupon.store}
                        </span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {coupon.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl font-black text-orange-500">{coupon.discount}</span>
                        <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          Min: {coupon.minOrder}
                        </span>
                      </div>

                      {/* Coupon code area */}
                      <div className={`relative flex items-center rounded-xl border-2 border-dashed overflow-hidden ${
                        isDark ? 'border-gray-600' : 'border-gray-200'
                      }`}>
                        <div className={`flex-1 px-3 py-2.5 text-center font-mono font-black text-sm tracking-widest ${
                          isRevealed ? (isDark ? 'text-amber-400' : 'text-amber-600') : ''
                        }`}>
                          {isRevealed ? coupon.code : '••••••••••'}
                        </div>
                        
                        {isRevealed ? (
                          <button
                            onClick={() => copyCoupon(coupon.code)}
                            className={`px-3 py-2.5 border-l-2 border-dashed transition ${
                              isCopied 
                                ? 'bg-green-500 text-white' 
                                : isDark 
                                  ? 'border-gray-600 hover:bg-gray-700 text-gray-300' 
                                  : 'border-gray-200 hover:bg-gray-50 text-gray-500'
                            }`}
                          >
                            {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        ) : (
                          <button
                            onClick={() => revealCoupon(coupon.id)}
                            className="px-3 py-2.5 bg-linear-to-r from-amber-500 to-orange-500 text-white"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-[10px] flex items-center gap-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          <Clock className="w-3 h-3" /> Expires in {coupon.expiresIn}
                        </span>
                        {isCopied && (
                          <span className="text-[10px] text-green-500 font-bold">✓ Copied!</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* EARLY ACCESS */}
        {activeTab === 'early' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <h2 className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Early Access Products 🚀
              </h2>
            </div>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Get notified before products go live. Premium members get first access!
            </p>

            <div className="space-y-3">
              {EARLY_ACCESS.map(product => (
                <div key={product.id} className={`rounded-2xl border overflow-hidden flex gap-4 p-4 transition-all hover:shadow-md ${
                  isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <img src={product.image} alt={product.title} className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl object-cover shrink-0" loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {product.tag}
                      </span>
                      <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {product.store}
                      </span>
                    </div>
                    <h3 className={`text-sm sm:text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {product.title}
                    </h3>
                    <p className={`text-[10px] sm:text-xs mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {product.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-lg font-black text-orange-500">₹{product.price.toLocaleString()}</span>
                      <span className={`text-[10px] flex items-center gap-1 px-2 py-0.5 rounded-full font-bold ${
                        isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-50 text-amber-600'
                      }`}>
                        <Clock className="w-3 h-3" />
                        {product.launchDate}
                      </span>
                    </div>
                    <button className="mt-2 px-4 py-2 bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-xs hover:shadow-lg transition-all active:scale-[0.98] flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5" /> Notify Me
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIP ZONE */}
        {activeTab === 'vip' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-500" />
              <h2 className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                VIP Zone 💎
              </h2>
            </div>

            {/* VIP Perks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* AI Deal Alerts */}
              <div className={`rounded-2xl p-4 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>AI Deal Alerts</h3>
                    <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Get notified for price drops</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {['WhatsApp alerts', 'Telegram alerts', 'Email digest'].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{item}</span>
                      <button
                        onClick={() => setAlertsEnabled(!alertsEnabled)}
                        className={`w-10 h-5 rounded-full transition-all ${
                          alertsEnabled ? 'bg-green-500' : isDark ? 'bg-gray-600' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`block w-4 h-4 rounded-full bg-white shadow transition-transform ${
                          alertsEnabled ? 'translate-x-5' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Smart Wishlist */}
              <div className={`rounded-2xl p-4 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-red-500 to-orange-500 flex items-center justify-center text-white">
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Smart Wishlist</h3>
                    <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Track prices automatically</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {['Price history chart', 'Drop alert', 'Stock alert'].map((item, i) => (
                    <div key={i} className={`flex items-center gap-2 text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <Check className="w-3.5 h-3.5 text-green-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Coin Multiplier */}
              <div className={`rounded-2xl p-4 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-500 to-yellow-500 flex items-center justify-center text-white text-lg">
                    🪙
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>1.5x Coin Multiplier</h3>
                    <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Earn 50% more on everything</p>
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-amber-50'}`}>
                  <div className="flex items-center justify-between text-xs">
                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>₹100 purchase</span>
                    <div className="flex items-center gap-2">
                      <span className={`line-through ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>50 coins</span>
                      <span className="font-bold text-amber-500">→ 75 coins</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* VIP Giveaway */}
              <div className={`rounded-2xl p-4 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>5x Giveaway Entries</h3>
                    <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>5 entries per giveaway + 20% off entry</p>
                  </div>
                </div>
                <button
                  onClick={() => setPage('giveaways')}
                  className="w-full py-2 bg-linear-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold text-xs active:scale-[0.98] transition-all"
                >
                  View Active Giveaways →
                </button>
              </div>
            </div>

            {/* No Ads */}
            <div className={`rounded-2xl p-4 text-center border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="text-3xl mb-2">🧹</div>
              <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Ad-Free Experience</h3>
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Premium = Clean, fast, distraction-free shopping. No banners, no popups.
              </p>
            </div>
          </div>
        )}

        {/* PRAYAGRAJ+ */}
        {activeTab === 'local' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-500" />
              <h2 className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Prayagraj Priority 📍
              </h2>
            </div>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Premium members get priority access to local Prayagraj deals, extra discounts at partner stores, and early delivery slots.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Early Local Deals */}
              <div className={`rounded-2xl p-4 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-green-500 to-emerald-500 flex items-center justify-center text-lg">
                    ⚡
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Early Local Deals</h3>
                    <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Access deals 1 hour before everyone</p>
                  </div>
                </div>
                <div className={`p-3 rounded-xl text-xs ${isDark ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-700'}`}>
                  🕐 Next early drop: Today 6 PM
                </div>
              </div>

              {/* Partner Store Discount */}
              <div className={`rounded-2xl p-4 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-orange-500 to-red-500 flex items-center justify-center text-lg">
                    🏪
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Partner Store Extra</h3>
                    <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Extra 10% off at partner shops</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {['Sharma Electronics - 10% extra', 'Fashion Hub Prayagraj - 15% extra', 'Mobile Planet - ₹200 off'].map((s, i) => (
                    <div key={i} className={`flex items-center gap-2 text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              {/* Priority Delivery */}
              <div className={`rounded-2xl p-4 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-lg">
                    🚚
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Priority Delivery</h3>
                    <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Same-day delivery in Prayagraj</p>
                  </div>
                </div>
                <div className={`p-3 rounded-xl text-xs ${isDark ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-700'}`}>
                  📦 Free delivery on all orders (Premium perk)
                </div>
              </div>

              {/* WhatsApp Orders */}
              <div className={`rounded-2xl p-4 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-green-400 to-green-600 flex items-center justify-center text-lg">
                    💬
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>WhatsApp Priority</h3>
                    <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Direct WhatsApp ordering with priority</p>
                  </div>
                </div>
                <button className="w-full py-2 bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold text-xs active:scale-[0.98] transition-all">
                  Order via WhatsApp 💬
                </button>
              </div>
            </div>

            {/* Go to local store */}
            <button
              onClick={() => setPage('prayagraj')}
              className="w-full py-3.5 bg-linear-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-orange-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              Browse Prayagraj Local Store
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </PremiumGate>

      {/* ===== QUICK SPEND COINS (For premium users) ===== */}
      {isPremium && (
        <div className={`rounded-2xl p-4 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-sm'}`}>
          <h3 className={`text-sm font-black mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            ⚡ Quick Coin Actions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: '₹50 Coupon', cost: 500, icon: '🎫', action: () => spendCoins(500, '₹50 coupon redeemed', 'coupon') },
              { label: 'Free Delivery', cost: 200, icon: '🚚', action: () => spendCoins(200, 'Free delivery unlock', 'delivery') },
              { label: 'Giveaway Entry', cost: 80, icon: '🎁', action: () => setPage('giveaways') },
              { label: 'Spin Wheel', cost: 0, icon: '🎰', action: () => setPage('missions') },
            ].map((item, i) => (
              <button
                key={i}
                onClick={item.action}
                disabled={item.cost > 0 && balance < item.cost}
                className={`p-3 rounded-xl text-center transition-all active:scale-95 ${
                  item.cost > 0 && balance < item.cost
                    ? isDark ? 'bg-gray-700 opacity-50 cursor-not-allowed' : 'bg-gray-100 opacity-50 cursor-not-allowed'
                    : isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-orange-50'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <p className={`text-xs font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.label}</p>
                {item.cost > 0 && (
                  <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{item.cost} 🪙</p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

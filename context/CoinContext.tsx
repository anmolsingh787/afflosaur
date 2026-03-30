/**
 * 🪙 AFFLO COIN ECOSYSTEM - FIXED Economy
 * 
 * ECONOMY RULES:
 * - 10 Coins ≈ ₹1 value
 * - ₹100 purchase = 50 coins (base, no multiplier stacking)
 * - Referral signup = 100 coins
 * - Premium users get 1.5x on EARN only
 * - Rank multiplier is DISPLAY only (not stacked with premium)
 * - Coins spent for: Coupons, Unlocks, Giveaways, Premium
 * 
 * "Earn. Rank. Win. Repeat."
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ============= TYPES =============

export type RankId = 'rookie' | 'smart' | 'pro' | 'elite' | 'legend';
export type PremiumTier = 'none' | 'bronze' | 'silver' | 'gold' | 'diamond' | 'lifetime';

export interface Rank {
  id: RankId;
  name: string;
  icon: string;
  minCoins: number;
  color: string;
  gradient: string;
  benefits: string[];
  coinMultiplier: number;
}

export interface Transaction {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  description: string;
  category: string;
  timestamp: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  icon: string;
  reward: number;
  completed: boolean;
  claimed: boolean;
  progress: number;
  target: number;
  category: 'daily' | 'weekly' | 'special';
}

export interface Giveaway {
  id: string;
  title: string;
  prize: string;
  prizeImage: string;
  entryCost: number;
  totalEntries: number;
  maxEntries: number;
  endTime: number;
  isActive: boolean;
  entered: boolean;
  winner?: string;
  description: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  coins: number;
  rank: RankId;
  badge?: string;
  isPremium?: boolean;
}

export interface FastDeal {
  id: string;
  title: string;
  originalPrice: number;
  dealPrice: number;
  coinCost: number;
  image: string;
  unlocked: boolean;
  expiresAt: number;
  category: string;
}

export interface ReferralData {
  code: string;
  link: string;
  totalReferrals: number;
  verifiedReferrals: number;
  pendingReferrals: number;
  premiumTier: PremiumTier;
  premiumExpiry?: number;
  referralList: Array<{
    id: string;
    name: string;
    avatar: string;
    status: 'pending' | 'verified';
    date: number;
    coinsEarned: number;
  }>;
}

export interface PremiumPlan {
  id: string;
  name: string;
  icon: string;
  priceINR: number;
  coinCost: number;
  duration: string;
  durationDays: number;
  benefits: string[];
  color: string;
  popular?: boolean;
}

export interface CoinSpendOption {
  id: string;
  name: string;
  icon: string;
  cost: number;
  description: string;
  category: 'coupon' | 'unlock' | 'delivery' | 'premium' | 'giveaway';
}

export interface DailyStreak {
  currentStreak: number;
  longestStreak: number;
  lastLoginDate: string;
  streakRewardClaimed: boolean;
  loginRewardClaimed: boolean; // NEW: track daily login coin claim
}

// ============= CONSTANTS =============

export const PURCHASE_SLABS = [
  { minAmount: 0, maxAmount: 100, coinsPerHundred: 50 },
  { minAmount: 100, maxAmount: 200, coinsPerHundred: 60 },
  { minAmount: 200, maxAmount: 500, coinsPerHundred: 70 },
  { minAmount: 500, maxAmount: 1000, coinsPerHundred: 80 },
  { minAmount: 1000, maxAmount: 2000, coinsPerHundred: 90 },
  { minAmount: 2000, maxAmount: Infinity, coinsPerHundred: 100 },
];

export const calculatePurchaseCoins = (amountINR: number, isPremium: boolean): number => {
  const slab = PURCHASE_SLABS.find(s => amountINR >= s.minAmount && amountINR < s.maxAmount) || PURCHASE_SLABS[0];
  const baseCoins = Math.floor((amountINR / 100) * slab.coinsPerHundred);
  // Premium gets 1.5x - NO rank multiplier stacking
  return isPremium ? Math.floor(baseCoins * 1.5) : baseCoins;
};

export const REFERRAL_REWARDS = {
  signup: { inviter: 100, invited: 50 },
  firstPurchase: { inviter: 200, invited: 0 },
  purchase500: { inviter: 500, invited: 0 },
  purchase1000: { inviter: 1000, invited: 0 },
  premiumMultiplier: 1.5,
};

export const SPEND_OPTIONS: CoinSpendOption[] = [
  { id: 'coupon50', name: '₹50 Coupon', icon: '🎫', cost: 500, description: 'Get ₹50 off on any purchase', category: 'coupon' },
  { id: 'coupon100', name: '₹100 Coupon', icon: '🎟️', cost: 1000, description: 'Get ₹100 off on ₹500+ purchase', category: 'coupon' },
  { id: 'freedelivery', name: 'Free Delivery', icon: '🚚', cost: 200, description: 'Free delivery on next order', category: 'delivery' },
  { id: 'fastdeal', name: 'Fast Deal Unlock', icon: '⚡', cost: 50, description: 'Unlock a deal 10 mins early', category: 'unlock' },
  { id: 'secretpage', name: 'Secret Deals', icon: '🔐', cost: 200, description: 'Access secret deals page', category: 'unlock' },
  { id: 'giveaway', name: 'Giveaway Entry', icon: '🎁', cost: 100, description: 'Enter a giveaway draw', category: 'giveaway' },
];

export const RANKS: Rank[] = [
  {
    id: 'rookie', name: 'Rookie', icon: '🥉', minCoins: 0,
    color: 'text-amber-700', gradient: 'from-amber-600 to-amber-800',
    benefits: ['Basic deals', 'Daily missions', '1x coin rate'],
    coinMultiplier: 1.0,
  },
  {
    id: 'smart', name: 'Smart Buyer', icon: '🥈', minCoins: 500,
    color: 'text-slate-400', gradient: 'from-slate-400 to-slate-600',
    benefits: ['Early deal access', '1.2x coin multiplier', 'Basic giveaways'],
    coinMultiplier: 1.2,
  },
  {
    id: 'pro', name: 'Pro Shopper', icon: '🥇', minCoins: 2000,
    color: 'text-yellow-500', gradient: 'from-yellow-400 to-yellow-600',
    benefits: ['All giveaways', '1.5x multiplier', 'Priority support'],
    coinMultiplier: 1.5,
  },
  {
    id: 'elite', name: 'Elite', icon: '💎', minCoins: 5000,
    color: 'text-blue-400', gradient: 'from-blue-400 to-purple-600',
    benefits: ['Exclusive drops', '2x multiplier', 'VIP giveaways', 'Secret deals'],
    coinMultiplier: 2.0,
  },
  {
    id: 'legend', name: 'Legend', icon: '👑', minCoins: 10000,
    color: 'text-purple-400', gradient: 'from-purple-400 to-pink-600',
    benefits: ['Private deals', '3x multiplier', 'All access', 'Legend badge', 'Priority everything'],
    coinMultiplier: 3.0,
  },
];

export const PREMIUM_PLANS: PremiumPlan[] = [
  {
    id: 'monthly', name: 'Monthly', icon: '⭐', priceINR: 49, coinCost: 2000,
    duration: '30 days', durationDays: 30,
    benefits: ['+50% more coins on every purchase', '1.5x referral rewards', 'Premium-only deals', 'No ads', 'Fast deal unlock', 'Priority giveaway (5 entries)'],
    color: 'from-orange-500 to-amber-500',
  },
  {
    id: 'quarterly', name: 'Quarterly', icon: '🌟', priceINR: 129, coinCost: 5000,
    duration: '90 days', durationDays: 90, popular: true,
    benefits: ['+50% more coins', '1.5x referral rewards', 'Premium-only deals', 'No ads', 'Fast deal unlock', 'Priority giveaway', 'AI deal alerts', 'Smart wishlist tracking'],
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'yearly', name: 'Yearly', icon: '👑', priceINR: 399, coinCost: 15000,
    duration: '365 days', durationDays: 365,
    benefits: ['All quarterly benefits', '2x coin multiplier', 'Local store priority', 'Exclusive seasonal drops', 'Legend badge', 'Personal deal curator'],
    color: 'from-yellow-500 to-orange-600',
  },
];

export const REFERRAL_TIERS = [
  { referrals: 3, tier: 'bronze' as const, days: 3, label: 'Bronze Premium' },
  { referrals: 10, tier: 'silver' as const, days: 15, label: 'Silver Premium' },
  { referrals: 25, tier: 'gold' as const, days: 60, label: 'Gold Premium' },
  { referrals: 50, tier: 'diamond' as const, days: 365, label: 'Diamond Premium' },
  { referrals: 100, tier: 'lifetime' as const, days: 99999, label: 'Lifetime Premium' },
];

// ============= MOCK DATA =============

const MOCK_MISSIONS: Mission[] = [
  { id: 'm1', title: 'Daily Login', description: 'Visit Afflosaur today', icon: '🌅', reward: 5, completed: false, claimed: false, progress: 0, target: 1, category: 'daily' },
  { id: 'm2', title: 'Browse 5 Products', description: 'View any 5 product pages', icon: '👀', reward: 10, completed: false, claimed: false, progress: 2, target: 5, category: 'daily' },
  { id: 'm3', title: 'Add to Wishlist', description: 'Save a product to wishlist', icon: '❤️', reward: 10, completed: false, claimed: false, progress: 0, target: 1, category: 'daily' },
  { id: 'm4', title: 'Share a Product', description: 'Share any product link', icon: '📤', reward: 20, completed: false, claimed: false, progress: 0, target: 1, category: 'daily' },
  { id: 'm5', title: 'Write a Review', description: 'Review a product you bought', icon: '✍️', reward: 50, completed: false, claimed: false, progress: 0, target: 1, category: 'daily' },
  { id: 'm6', title: 'Compare Prices', description: 'Use price comparison 3 times', icon: '⚖️', reward: 15, completed: false, claimed: false, progress: 1, target: 3, category: 'daily' },
  { id: 'm7', title: 'Weekly Explorer', description: 'Visit 7 days in a row', icon: '🗓️', reward: 100, completed: false, claimed: false, progress: 3, target: 7, category: 'weekly' },
  { id: 'm8', title: 'Review Master', description: 'Write 5 reviews this week', icon: '📝', reward: 200, completed: false, claimed: false, progress: 1, target: 5, category: 'weekly' },
  { id: 'm9', title: 'Social Butterfly', description: 'Share 10 products', icon: '🦋', reward: 150, completed: false, claimed: false, progress: 2, target: 10, category: 'weekly' },
  { id: 'm10', title: 'First Purchase', description: 'Buy your first product', icon: '🎉', reward: 500, completed: false, claimed: false, progress: 0, target: 1, category: 'special' },
  { id: 'm11', title: 'Refer a Friend', description: 'Invite someone to Afflosaur', icon: '🤝', reward: 100, completed: false, claimed: false, progress: 0, target: 1, category: 'special' },
  { id: 'm12', title: 'Blog Writer', description: 'Publish your first blog', icon: '📰', reward: 300, completed: false, claimed: false, progress: 0, target: 1, category: 'special' },
];

const MOCK_GIVEAWAYS: Giveaway[] = [
  {
    id: 'g1', title: 'Win boAt Rockerz 450',
    prize: 'boAt Rockerz 450 Bluetooth Headphone',
    prizeImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    entryCost: 50, totalEntries: 234, maxEntries: 500,
    endTime: Date.now() + 86400000 * 3, isActive: true, entered: false,
    description: 'Enter with 50 Afflo Coins for a chance to win premium headphones!'
  },
  {
    id: 'g2', title: 'Amazon ₹500 Gift Card',
    prize: '₹500 Amazon Gift Card',
    prizeImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
    entryCost: 100, totalEntries: 456, maxEntries: 1000,
    endTime: Date.now() + 86400000 * 7, isActive: true, entered: false,
    description: 'Use 100 coins to enter. Winner gets ₹500 Amazon voucher!'
  },
  {
    id: 'g3', title: 'Realme Buds Air 5',
    prize: 'Realme Buds Air 5 TWS Earbuds',
    prizeImage: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400',
    entryCost: 75, totalEntries: 189, maxEntries: 300,
    endTime: Date.now() + 86400000 * 5, isActive: true, entered: false,
    description: 'Win premium TWS earbuds! Entry: 75 Afflo Coins.'
  },
  {
    id: 'g4', title: 'Mystery Box 🎁',
    prize: 'Surprise Tech Gadget',
    prizeImage: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
    entryCost: 25, totalEntries: 678, maxEntries: 1000,
    endTime: Date.now() + 86400000 * 2, isActive: true, entered: false,
    description: 'Just 25 coins! Could be anything from earphones to smartwatch!'
  },
  {
    id: 'g5', title: 'Last Week Winner',
    prize: 'Fire-Boltt Phoenix Smartwatch',
    prizeImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    entryCost: 100, totalEntries: 500, maxEntries: 500,
    endTime: Date.now() - 86400000, isActive: false, entered: true,
    winner: 'Rahul K.',
    description: 'This giveaway has ended. Winner: Rahul K.'
  },
];

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: 'l1', name: 'Priya S.', avatar: '👩', coins: 12500, rank: 'legend', badge: '🔥', isPremium: true },
  { id: 'l2', name: 'Arjun M.', avatar: '👨', coins: 9800, rank: 'elite', badge: '⚡', isPremium: true },
  { id: 'l3', name: 'Sneha R.', avatar: '👩‍💻', coins: 7200, rank: 'elite', isPremium: true },
  { id: 'l4', name: 'Vikram P.', avatar: '🧑', coins: 5600, rank: 'elite' },
  { id: 'l5', name: 'Anita K.', avatar: '👩‍🎤', coins: 4100, rank: 'pro', isPremium: true },
  { id: 'l6', name: 'Raj B.', avatar: '🧔', coins: 3200, rank: 'pro' },
  { id: 'l7', name: 'Meera D.', avatar: '👩‍🔬', coins: 2800, rank: 'pro' },
  { id: 'l8', name: 'Karan S.', avatar: '🧑‍💼', coins: 1900, rank: 'smart' },
  { id: 'l9', name: 'Pooja T.', avatar: '👩‍🏫', coins: 1200, rank: 'smart' },
  { id: 'l10', name: 'Amit G.', avatar: '🧑‍🎓', coins: 800, rank: 'smart' },
];

const MOCK_FAST_DEALS: FastDeal[] = [
  { id: 'fd1', title: 'Secret Flash Sale - Electronics', originalPrice: 2999, dealPrice: 999, coinCost: 50, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300', unlocked: false, expiresAt: Date.now() + 3600000, category: 'Electronics' },
  { id: 'fd2', title: 'VIP Fashion Drop', originalPrice: 1999, dealPrice: 499, coinCost: 30, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300', unlocked: false, expiresAt: Date.now() + 7200000, category: 'Fashion' },
  { id: 'fd3', title: 'Early Access - New Gadget', originalPrice: 4999, dealPrice: 2499, coinCost: 100, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300', unlocked: false, expiresAt: Date.now() + 5400000, category: 'Gadgets' },
];

// ============= CONTEXT TYPE =============

interface CoinContextType {
  balance: number;
  lifetimeEarned: number;
  transactions: Transaction[];
  currentRank: Rank;
  nextRank: Rank | null;
  rankProgress: number;
  earnCoins: (amount: number, description: string, category?: string) => void;
  spendCoins: (amount: number, description: string, category?: string) => boolean;
  isPremium: boolean;
  premiumPlan: string | null;
  premiumExpiry: number | null;
  activatePremium: (planId: string, method: 'money' | 'coins') => boolean;
  missions: Mission[];
  completeMission: (missionId: string) => void;
  claimMission: (missionId: string) => void;
  streak: DailyStreak;
  claimStreakBonus: () => void;
  giveaways: Giveaway[];
  enterGiveaway: (giveawayId: string) => boolean;
  leaderboard: LeaderboardEntry[];
  fastDeals: FastDeal[];
  unlockFastDeal: (dealId: string) => boolean;
  referral: ReferralData;
  spendOptions: CoinSpendOption[];
  redeemSpendOption: (optionId: string) => boolean;
  spinWheel: () => number;
  lastSpinTime: number;
  canSpin: boolean;
  coinNotification: { amount: number; message: string } | null;
  clearNotification: () => void;
  calculatePurchaseReward: (amountINR: number) => number;
}

const CoinContext = createContext<CoinContextType | null>(null);

// ============= HELPERS =============

const STORAGE_KEY = 'afflosaur_coins_v3';

const loadFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch { /* ignore */ }
  return null;
};

const saveToStorage = (data: Record<string, unknown>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* ignore */ }
};

const getRank = (coins: number): Rank => {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (coins >= RANKS[i].minCoins) return RANKS[i];
  }
  return RANKS[0];
};

const getNextRank = (coins: number): Rank | null => {
  for (const rank of RANKS) {
    if (coins < rank.minCoins) return rank;
  }
  return null;
};

const getTodayStr = () => new Date().toISOString().split('T')[0];

// ============= PROVIDER =============

export const CoinProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const saved = loadFromStorage();

  // ===== CORE STATE =====
  const [balance, setBalance] = useState<number>(saved?.balance ?? 150);
  const [lifetimeEarned, setLifetimeEarned] = useState<number>(saved?.lifetimeEarned ?? 150);
  const [transactions, setTransactions] = useState<Transaction[]>(saved?.transactions ?? [
    { id: 't0', type: 'earn' as const, amount: 100, description: 'Welcome bonus! 🎉', category: 'bonus', timestamp: Date.now() - 86400000 },
    { id: 't1', type: 'earn' as const, amount: 50, description: 'First login reward', category: 'login', timestamp: Date.now() - 3600000 },
  ]);
  const [missions, setMissions] = useState<Mission[]>(saved?.missions ?? MOCK_MISSIONS);
  const [giveaways, setGiveaways] = useState<Giveaway[]>(saved?.giveaways ?? MOCK_GIVEAWAYS);
  const [fastDeals, setFastDeals] = useState<FastDeal[]>(saved?.fastDeals ?? MOCK_FAST_DEALS);
  const [lastSpinTime, setLastSpinTime] = useState<number>(saved?.lastSpinTime ?? 0);
  const [coinNotification, setCoinNotification] = useState<{ amount: number; message: string } | null>(null);

  // Premium
  const [isPremium, setIsPremium] = useState<boolean>(saved?.isPremium ?? false);
  const [premiumPlan, setPremiumPlan] = useState<string | null>(saved?.premiumPlan ?? null);
  const [premiumExpiry, setPremiumExpiry] = useState<number | null>(saved?.premiumExpiry ?? null);

  // Daily streak - with loginRewardClaimed to prevent duplicate daily coins
  const [streak, setStreak] = useState<DailyStreak>(saved?.streak ?? {
    currentStreak: 0,
    longestStreak: 0,
    lastLoginDate: '',
    streakRewardClaimed: false,
    loginRewardClaimed: false,
  });

  const [referral] = useState<ReferralData>(saved?.referral ?? {
    code: 'AFFLO' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    link: '',
    totalReferrals: 7,
    verifiedReferrals: 5,
    pendingReferrals: 2,
    premiumTier: 'silver' as PremiumTier,
    premiumExpiry: Date.now() + 86400000 * 12,
    referralList: [
      { id: 'r1', name: 'Rahul K.', avatar: '🧑', status: 'verified' as const, date: Date.now() - 86400000 * 5, coinsEarned: 100 },
      { id: 'r2', name: 'Sneha M.', avatar: '👩', status: 'verified' as const, date: Date.now() - 86400000 * 3, coinsEarned: 100 },
      { id: 'r3', name: 'Amit P.', avatar: '🧔', status: 'verified' as const, date: Date.now() - 86400000 * 2, coinsEarned: 100 },
      { id: 'r4', name: 'Priya S.', avatar: '👩‍💻', status: 'verified' as const, date: Date.now() - 86400000, coinsEarned: 100 },
      { id: 'r5', name: 'Vikram R.', avatar: '🧑‍💼', status: 'verified' as const, date: Date.now() - 43200000, coinsEarned: 100 },
      { id: 'r6', name: 'Neha D.', avatar: '👩‍🎤', status: 'pending' as const, date: Date.now() - 3600000, coinsEarned: 0 },
      { id: 'r7', name: 'Karan B.', avatar: '🧑‍🎓', status: 'pending' as const, date: Date.now() - 1800000, coinsEarned: 0 },
    ]
  });

  // ===== DERIVED VALUES =====
  const currentRank = getRank(lifetimeEarned);
  const nextRank = getNextRank(lifetimeEarned);
  const rankProgress = nextRank
    ? ((lifetimeEarned - currentRank.minCoins) / (nextRank.minCoins - currentRank.minCoins)) * 100
    : 100;
  const canSpin = Date.now() - lastSpinTime > 86400000;

  // ===== EFFECTS =====

  // Check premium expiry
  useEffect(() => {
    if (isPremium && premiumExpiry && Date.now() > premiumExpiry) {
      setIsPremium(false);
      setPremiumPlan(null);
      setPremiumExpiry(null);
    }
  }, [isPremium, premiumExpiry]);

  // Handle daily streak - ONLY updates streak counter, does NOT auto-give coins
  useEffect(() => {
    const today = getTodayStr();
    if (streak.lastLoginDate === today) return; // Already processed today

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (streak.lastLoginDate === yesterdayStr) {
      // Continue streak
      setStreak(s => ({
        ...s,
        currentStreak: s.currentStreak + 1,
        longestStreak: Math.max(s.longestStreak, s.currentStreak + 1),
        lastLoginDate: today,
        streakRewardClaimed: false,
        loginRewardClaimed: false,
      }));
    } else if (streak.lastLoginDate === '') {
      // First ever visit
      setStreak(s => ({
        ...s,
        currentStreak: 1,
        longestStreak: 1,
        lastLoginDate: today,
        streakRewardClaimed: false,
        loginRewardClaimed: false,
      }));
    } else {
      // Streak broken - reset to 1
      setStreak(s => ({
        ...s,
        currentStreak: 1,
        lastLoginDate: today,
        streakRewardClaimed: false,
        loginRewardClaimed: false,
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run ONCE on mount only

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveToStorage({
      balance, lifetimeEarned, transactions, missions,
      giveaways, fastDeals, lastSpinTime, referral,
      isPremium, premiumPlan, premiumExpiry, streak,
    });
  }, [balance, lifetimeEarned, transactions, missions, giveaways, fastDeals, lastSpinTime, referral, isPremium, premiumPlan, premiumExpiry, streak]);

  // Auto-clear notification after 3 seconds
  useEffect(() => {
    if (coinNotification) {
      const timer = setTimeout(() => setCoinNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [coinNotification]);

  // ===== CORE FUNCTIONS =====

  /**
   * earnCoins - Add coins to balance
   * FIXED: Only applies premium multiplier (1.5x), NOT rank multiplier
   * Rank multiplier is for DISPLAY/future features, not actual earning
   */
  const earnCoins = useCallback((amount: number, description: string, category = 'general') => {
    // Only premium multiplier - no rank stacking
    const finalAmount = isPremium ? Math.floor(amount * 1.5) : amount;

    setBalance(prev => prev + finalAmount);
    setLifetimeEarned(prev => prev + finalAmount);

    const tx: Transaction = {
      id: 'tx_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      type: 'earn',
      amount: finalAmount,
      description: isPremium && finalAmount !== amount ? `${description} (Premium 1.5x)` : description,
      category,
      timestamp: Date.now(),
    };
    setTransactions(prev => [tx, ...prev].slice(0, 100));
    setCoinNotification({ amount: finalAmount, message: description });
  }, [isPremium]);

  /**
   * spendCoins - Deduct coins from balance
   * FIXED: Proper balance check, immediate state update
   */
  const spendCoins = useCallback((amount: number, description: string, category = 'general'): boolean => {
    if (balance < amount) {
      setCoinNotification({ amount: -1, message: 'Not enough Afflo Coins! 😢' });
      return false;
    }

    setBalance(prev => prev - amount);

    const tx: Transaction = {
      id: 'tx_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      type: 'spend',
      amount,
      description,
      category,
      timestamp: Date.now(),
    };
    setTransactions(prev => [tx, ...prev].slice(0, 100));
    setCoinNotification({ amount: -amount, message: description });
    return true;
  }, [balance]);

  const activatePremium = useCallback((planId: string, method: 'money' | 'coins'): boolean => {
    const plan = PREMIUM_PLANS.find(p => p.id === planId);
    if (!plan) return false;

    if (method === 'coins') {
      if (balance < plan.coinCost) {
        setCoinNotification({ amount: -1, message: 'Not enough coins for premium!' });
        return false;
      }
      // Manually deduct - don't use spendCoins to avoid circular notification
      setBalance(prev => prev - plan.coinCost);
      const tx: Transaction = {
        id: 'tx_' + Date.now(),
        type: 'spend',
        amount: plan.coinCost,
        description: `Premium ${plan.name} subscription`,
        category: 'premium',
        timestamp: Date.now(),
      };
      setTransactions(prev => [tx, ...prev].slice(0, 100));
    }

    setIsPremium(true);
    setPremiumPlan(plan.id);
    setPremiumExpiry(Date.now() + plan.durationDays * 86400000);
    setCoinNotification({ amount: 0, message: `👑 ${plan.name} Premium activated!` });
    return true;
  }, [balance]);

  const completeMission = useCallback((missionId: string) => {
    setMissions(ms => ms.map(m =>
      m.id === missionId ? { ...m, completed: true, progress: m.target } : m
    ));
  }, []);

  /**
   * claimMission - FIXED: Awards coins when claiming a completed mission
   */
  const claimMission = useCallback((missionId: string) => {
    const mission = missions.find(m => m.id === missionId);
    if (!mission || !mission.completed || mission.claimed) return;

    // Mark as claimed FIRST
    setMissions(ms => ms.map(m =>
      m.id === missionId ? { ...m, claimed: true } : m
    ));

    // Then award coins
    earnCoins(mission.reward, `Mission: ${mission.title}`, 'mission');
  }, [missions, earnCoins]);

  /**
   * claimStreakBonus - FIXED: Only claimable once per day
   */
  const claimStreakBonus = useCallback(() => {
    if (streak.streakRewardClaimed) return;
    const bonus = streak.currentStreak >= 7 ? 100 : streak.currentStreak * 5;
    earnCoins(bonus, `${streak.currentStreak}-day streak bonus! 🔥`, 'streak');
    setStreak(s => ({ ...s, streakRewardClaimed: true }));
  }, [streak, earnCoins]);

  const enterGiveaway = useCallback((giveawayId: string): boolean => {
    const giveaway = giveaways.find(g => g.id === giveawayId);
    if (!giveaway || giveaway.entered || !giveaway.isActive) return false;
    const cost = isPremium ? Math.floor(giveaway.entryCost * 0.8) : giveaway.entryCost;
    if (!spendCoins(cost, `Giveaway entry: ${giveaway.title}`, 'giveaway')) return false;
    setGiveaways(gs => gs.map(g =>
      g.id === giveawayId ? { ...g, entered: true, totalEntries: g.totalEntries + (isPremium ? 5 : 1) } : g
    ));
    return true;
  }, [giveaways, spendCoins, isPremium]);

  const unlockFastDeal = useCallback((dealId: string): boolean => {
    const deal = fastDeals.find(d => d.id === dealId);
    if (!deal || deal.unlocked) return false;
    if (isPremium) {
      setFastDeals(ds => ds.map(d => d.id === dealId ? { ...d, unlocked: true } : d));
      setCoinNotification({ amount: 0, message: 'Premium perk: Free deal unlock! ⚡' });
      return true;
    }
    if (!spendCoins(deal.coinCost, `Fast Deal: ${deal.title}`, 'fastdeal')) return false;
    setFastDeals(ds => ds.map(d => d.id === dealId ? { ...d, unlocked: true } : d));
    return true;
  }, [fastDeals, spendCoins, isPremium]);

  const redeemSpendOption = useCallback((optionId: string): boolean => {
    const option = SPEND_OPTIONS.find(o => o.id === optionId);
    if (!option) return false;
    const cost = isPremium ? Math.floor(option.cost * 0.8) : option.cost;
    return spendCoins(cost, `Redeemed: ${option.name}`, option.category);
  }, [spendCoins, isPremium]);

  /**
   * spinWheel - FIXED: Proper random prize with weighted distribution
   */
  const spinWheel = useCallback((): number => {
    if (!canSpin) return 0;
    const prizes = [5, 10, 15, 20, 25, 50, 75, 100];
    const weights = [30, 25, 15, 12, 8, 5, 3, 2];
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    let prizeIndex = 0;
    for (let i = 0; i < weights.length; i++) {
      random -= weights[i];
      if (random <= 0) { prizeIndex = i; break; }
    }
    const prize = prizes[prizeIndex];
    setLastSpinTime(Date.now());
    earnCoins(prize, `Spin Wheel win! 🎰`, 'spin');
    return prize;
  }, [canSpin, earnCoins]);

  const calculatePurchaseReward = useCallback((amountINR: number): number => {
    return calculatePurchaseCoins(amountINR, isPremium);
  }, [isPremium]);

  const clearNotification = useCallback(() => setCoinNotification(null), []);

  return (
    <CoinContext.Provider value={{
      balance, lifetimeEarned, transactions, currentRank, nextRank, rankProgress,
      earnCoins, spendCoins,
      isPremium, premiumPlan, premiumExpiry, activatePremium,
      missions, completeMission, claimMission,
      streak, claimStreakBonus,
      giveaways, enterGiveaway,
      leaderboard: MOCK_LEADERBOARD,
      fastDeals, unlockFastDeal,
      referral,
      spendOptions: SPEND_OPTIONS,
      redeemSpendOption,
      spinWheel, lastSpinTime, canSpin,
      coinNotification, clearNotification,
      calculatePurchaseReward,
    }}>
      {children}
    </CoinContext.Provider>
  );
};

export const useCoin = () => {
  const ctx = useContext(CoinContext);
  if (!ctx) throw new Error('useCoin must be used within CoinProvider');
  return ctx;
};

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useApp } from './AppContext'; // to access products for mystery deals

export interface UserAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

export interface UserStats {
  totalSavings: number;
  itemsPurchased: number;
  couponsUsed: number;
  dealsShared: number;
  loginStreak: number;
  lastLoginDate: string;
  buyerScore: number;
  buyerLevel: 'Beginner' | 'Smart Shopper' | 'Deal Hunter' | 'Price Master' | 'Legend';
  points: number;
  monthlySavings: number;
  rankPercentile: number;
}

export interface MysteryDeal {
  id: string;
  productId: string; // link back to real product
  title: string;
  discount: number;
  originalPrice: number;
  mysteryPrice: number;
  store: string;
  expiresAt: Date;
  revealed: boolean;
}

export interface PricePrediction {
  productId: string;
  productName: string;
  currentPrice: number;
  predictedDrop: number;
  confidence: number;
  predictedDate: Date;
  reasoning?: string;
  actualDrop?: number;
}

interface GamificationContextType {
  userStats: UserStats;
  achievements: UserAchievement[];
  mysteryDeal: MysteryDeal | null;
  predictions: PricePrediction[];
  updateSavings: (amount: number) => void;
  addPurchase: (price: number, usedCoupon?: boolean) => void;
  shareDeal: () => void;
  revealMysteryDeal: () => void;
  checkLoginStreak: () => void;
  earnPoints: (points: number, reason: string) => void;
  unlockAchievement: (achievementId: string) => void;
  addPricePrediction: (prediction: PricePrediction) => void;
  updatePredictionAccuracy: (productId: string, actualDrop: number) => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

const initialUserStats: UserStats = {
  totalSavings: 0,
  itemsPurchased: 0,
  couponsUsed: 0,
  dealsShared: 0,
  loginStreak: 0,
  lastLoginDate: new Date().toISOString().split('T')[0],
  buyerScore: 0,
  buyerLevel: 'Beginner',
  points: 0,
  monthlySavings: 0,
  rankPercentile: 0
};

const initialAchievements: UserAchievement[] = [
  {
    id: 'first_purchase',
    title: 'First Purchase',
    description: 'Made your first purchase through Afflosaur',
    icon: '🛒',
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'coupon_master',
    title: 'Coupon Master',
    description: 'Used 10 coupons successfully',
    icon: '🎫',
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'savings_champion',
    title: 'Savings Champion',
    description: 'Saved ₹10,000 total',
    icon: '💰',
    progress: 0,
    maxProgress: 10000
  },
  {
    id: 'streak_master',
    title: 'Streak Master',
    description: 'Maintain a 30-day login streak',
    icon: '🔥',
    progress: 0,
    maxProgress: 30
  },
  {
    id: 'deal_sharer',
    title: 'Deal Sharer',
    description: 'Shared 25 deals with friends',
    icon: '📢',
    progress: 0,
    maxProgress: 25
  },
  {
    id: 'price_predictor',
    title: 'Price Predictor',
    description: 'Made 5 accurate price predictions',
    icon: '🔮',
    progress: 0,
    maxProgress: 5
  }
];

export function GamificationProvider({ children }: { children: ReactNode }) {
  const { products } = useApp();
  const [userStats, setUserStats] = useState<UserStats>(initialUserStats);
  const [achievements, setAchievements] = useState<UserAchievement[]>(initialAchievements);
  const [mysteryDeal, setMysteryDeal] = useState<MysteryDeal | null>(null);
  const [predictions, setPredictions] = useState<PricePrediction[]>([]);

  // Generate daily mystery deal
  useEffect(() => {
    const generateMysteryDeal = () => {
      const today = new Date().toISOString().split('T')[0];
      if (products.length === 0) return;
      const selected = products[Math.floor(Math.random() * products.length)];

      // compute prices
      const originalPrice = Math.min(...selected.prices.map(p => p.price));
      const discount = Math.floor(Math.random() * 40) + 20; // 20-60% off
      const mysteryPrice = Math.round(originalPrice * (1 - discount / 100));
      const store = selected.prices[0]?.platform || 'Unknown';

      const deal: MysteryDeal = {
        id: `mystery_${today}`,
        productId: selected.id,
        title: selected.title,
        discount,
        originalPrice,
        mysteryPrice,
        store,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        revealed: false
      };

      setMysteryDeal(deal);
    };

    generateMysteryDeal();
  }, [products]);

  // Calculate buyer level based on score
  const calculateBuyerLevel = (score: number): UserStats['buyerLevel'] => {
    if (score >= 5000) return 'Legend';
    if (score >= 2500) return 'Price Master';
    if (score >= 1000) return 'Deal Hunter';
    if (score >= 250) return 'Smart Shopper';
    return 'Beginner';
  };

  // Update user stats
  const updateUserStats = (updates: Partial<UserStats>) => {
    setUserStats(prev => {
      const newStats = { ...prev, ...updates };
      newStats.buyerLevel = calculateBuyerLevel(newStats.buyerScore);
      return newStats;
    });
  };

  // Core gamification functions
  const updateSavings = (amount: number) => {
    updateUserStats({
      totalSavings: userStats.totalSavings + amount,
      monthlySavings: userStats.monthlySavings + amount,
      buyerScore: userStats.buyerScore + Math.floor(amount / 10)
    });

    // Check for savings achievement
    const savingsAchievement = achievements.find(a => a.id === 'savings_champion');
    if (savingsAchievement && userStats.totalSavings + amount >= 10000) {
      unlockAchievement('savings_champion');
    }
  };

  const addPurchase = (price: number, usedCoupon = false) => {
    updateUserStats({
      itemsPurchased: userStats.itemsPurchased + 1,
      buyerScore: userStats.buyerScore + Math.floor(price / 100),
      ...(usedCoupon && { couponsUsed: userStats.couponsUsed + 1 })
    });

    earnPoints(Math.floor(price / 50), 'Purchase bonus');

    // Check achievements
    if (userStats.itemsPurchased === 0) {
      unlockAchievement('first_purchase');
    }

    if (usedCoupon && userStats.couponsUsed + 1 >= 10) {
      unlockAchievement('coupon_master');
    }
  };

  const shareDeal = () => {
    updateUserStats({
      dealsShared: userStats.dealsShared + 1,
      buyerScore: userStats.buyerScore + 5
    });

    earnPoints(10, 'Deal shared');

    if (userStats.dealsShared + 1 >= 25) {
      unlockAchievement('deal_sharer');
    }
  };

  const revealMysteryDeal = () => {
    if (mysteryDeal && !mysteryDeal.revealed) {
      setMysteryDeal(prev => prev ? { ...prev, revealed: true } : null);
      earnPoints(25, 'Mystery deal revealed');
    }
  };

  const checkLoginStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    const lastLogin = userStats.lastLoginDate;

    if (lastLogin === today) return; // Already logged in today

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const newStreak = lastLogin === yesterdayStr ? userStats.loginStreak + 1 : 1;

    updateUserStats({
      loginStreak: newStreak,
      lastLoginDate: today,
      buyerScore: userStats.buyerScore + (newStreak * 2)
    });

    earnPoints(newStreak * 5, `Day ${newStreak} login streak`);

    if (newStreak >= 30) {
      unlockAchievement('streak_master');
    }
  };

  const earnPoints = (points: number, reason: string) => {
    updateUserStats({ points: userStats.points + points });
    // Could show notification here
    console.log(`🎉 Earned ${points} points: ${reason}`);
  };

  const unlockAchievement = (achievementId: string) => {
    setAchievements(prev =>
      prev.map(achievement =>
        achievement.id === achievementId
          ? { ...achievement, unlockedAt: new Date() }
          : achievement
      )
    );

    earnPoints(50, 'Achievement unlocked!');
  };

  const addPricePrediction = (prediction: PricePrediction) => {
    setPredictions(prev => [...prev, prediction]);
  };

  const updatePredictionAccuracy = (productId: string, actualDrop: number) => {
    setPredictions(prev =>
      prev.map(pred =>
        pred.productId === productId
          ? { ...pred, actualDrop }
          : pred
      )
    );

    // Check if prediction was accurate (within 10% margin)
    const prediction = predictions.find(p => p.productId === productId);
    if (prediction) {
      const accuracy = Math.abs(prediction.predictedDrop - actualDrop) / prediction.predictedDrop;
      if (accuracy <= 0.1) { // Within 10%
        earnPoints(20, 'Accurate price prediction!');
        const predictorAchievement = achievements.find(a => a.id === 'price_predictor');
        if (predictorAchievement) {
          predictorAchievement.progress = (predictorAchievement.progress || 0) + 1;
          if (predictorAchievement.progress >= 5) {
            unlockAchievement('price_predictor');
          }
        }
      }
    }
  };

  // Check login streak on mount
  useEffect(() => {
    checkLoginStreak();
  }, []);

  const value: GamificationContextType = {
    userStats,
    achievements,
    mysteryDeal,
    predictions,
    updateSavings,
    addPurchase,
    shareDeal,
    revealMysteryDeal,
    checkLoginStreak,
    earnPoints,
    unlockAchievement,
    addPricePrediction,
    updatePredictionAccuracy
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
}
/**
 * 🔒 PREMIUM GATE COMPONENT
 * Shows blur overlay with upgrade prompt for non-premium users
 * Premium users see content normally
 */
import { Crown, Lock, Sparkles, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useCoin } from '../context/CoinContext';

interface PremiumGateProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showPreview?: boolean; // Show blurred preview of content
  compact?: boolean;
}

export function PremiumGate({ children, title, description, showPreview = true, compact = false }: PremiumGateProps) {
  const { theme, setPage } = useApp();
  const { isPremium } = useCoin();
  const isDark = theme === 'dark';

  // Premium users see content directly
  if (isPremium) {
    return <>{children}</>;
  }

  // Non-premium users see locked overlay
  return (
    <div className="relative">
      {/* Blurred preview of content */}
      {showPreview && (
        <div className="filter blur-[6px] pointer-events-none select-none opacity-60" aria-hidden="true">
          {children}
        </div>
      )}

      {/* Lock overlay */}
      <div className={`${showPreview ? 'absolute inset-0' : ''} flex items-center justify-center z-10`}>
        <div className={`${compact ? 'p-4' : 'p-6 sm:p-8'} rounded-3xl text-center max-w-sm mx-auto ${
          isDark 
            ? 'bg-gray-900/95 border border-gray-700/50 shadow-2xl shadow-black/50' 
            : 'bg-white/95 border border-gray-200 shadow-2xl shadow-gray-300/50'
        } backdrop-blur-xl`}>
          {/* Lock icon with glow */}
          <div className="relative inline-flex items-center justify-center mb-3">
            <div className="absolute inset-0 w-16 h-16 bg-linear-to-r from-amber-400 to-orange-500 rounded-full blur-xl opacity-30 animate-pulse" />
            <div className="relative w-14 h-14 bg-linear-to-br from-amber-400 via-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Lock className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Crown badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-linear-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 mb-3">
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Premium Only
            </span>
          </div>

          <h3 className={`${compact ? 'text-base' : 'text-lg'} font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {title || 'Unlock Premium Content'}
          </h3>
          <p className={`${compact ? 'text-[10px]' : 'text-xs'} mt-1 max-w-xs mx-auto ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {description || 'Get exclusive deals, hidden coupons, early access & more with Afflosaur Premium.'}
          </p>

          {/* Benefits mini list */}
          {!compact && (
            <div className="mt-3 space-y-1.5">
              {['Secret Flash Deals', 'Hidden Coupons', 'Early Access', 'No Ads'].map((b, i) => (
                <div key={i} className={`flex items-center gap-2 text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                  {b}
                </div>
              ))}
            </div>
          )}

          {/* CTA Buttons */}
          <div className={`${compact ? 'mt-3' : 'mt-4'} space-y-2`}>
            <button
              onClick={() => setPage('premium')}
              className="w-full py-2.5 bg-linear-to-r from-amber-500 via-orange-500 to-red-500 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-orange-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4" />
              Unlock Premium — ₹49/mo
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage('referral')}
              className={`w-full py-2 rounded-xl text-xs font-medium transition ${
                isDark ? 'text-gray-400 hover:text-amber-400' : 'text-gray-500 hover:text-amber-600'
              }`}
            >
              Or unlock FREE via referrals →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

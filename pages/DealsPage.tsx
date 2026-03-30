// ==========================================
// Afflosaur - Community Deals Page
// Users can view & submit deals
// ==========================================

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useGamification } from '../context/GamificationContext';
import { Tag, ThumbsUp, ExternalLink, Plus, Send, Clock, X } from 'lucide-react';

interface DealItem {
  id: string;
  title: string;
  description: string;
  storeName: string;
  originalPrice: number;
  dealPrice: number;
  couponCode: string | null;
  link: string;
  upvotes: number;
  submittedBy: string;
  createdAt: string;
}

export function DealsPage() {
  const { theme, isLoggedIn, login, showNotification, setPage, setSelectedProductId } = useApp();
  const { mysteryDeal, revealMysteryDeal } = useGamification();
  const isDark = theme === 'dark';
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [upvoted, setUpvoted] = useState<Set<string>>(new Set());

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formStore, setFormStore] = useState('');
  const [formOrigPrice, setFormOrigPrice] = useState('');
  const [formDealPrice, setFormDealPrice] = useState('');
  const [formCoupon, setFormCoupon] = useState('');
  const [formLink, setFormLink] = useState('');

  // If a mystery deal exists, optionally add a link/banner

  // Mock deals data
  const [deals, setDeals] = useState<DealItem[]>([
    {
      id: 'd1',
      title: 'boAt Airdopes 141 at lowest ever price!',
      description: 'Use coupon BOAT100 for extra ₹100 off. Only valid for today!',
      storeName: 'Amazon',
      originalPrice: 1999,
      dealPrice: 799,
      couponCode: 'BOAT100',
      link: '#',
      upvotes: 145,
      submittedBy: 'DealHunter Raj',
      createdAt: '2024-02-28',
    },
    {
      id: 'd2',
      title: 'Realme Buds T100 - Flipkart Flash Sale',
      description: 'Flash sale starts at 12PM. Limited stock. Add to cart now!',
      storeName: 'Flipkart',
      originalPrice: 1499,
      dealPrice: 599,
      couponCode: null,
      link: '#',
      upvotes: 89,
      submittedBy: 'BargainBoss Priya',
      createdAt: '2024-02-27',
    },
    {
      id: 'd3',
      title: 'Mi Power Bank 10000mAh - ₹499 only!',
      description: 'Bank offer: Extra 10% off with HDFC cards. Best price this month.',
      storeName: 'Amazon',
      originalPrice: 1299,
      dealPrice: 499,
      couponCode: null,
      link: '#',
      upvotes: 234,
      submittedBy: 'TechGuru Rahul',
      createdAt: '2024-02-26',
    },
    {
      id: 'd4',
      title: 'pTron Bassbuds Duo - Under ₹300!',
      description: 'Cheapest TWS earbuds with good reviews. Perfect backup pair.',
      storeName: 'Meesho',
      originalPrice: 899,
      dealPrice: 279,
      couponCode: 'PTRON50',
      link: '#',
      upvotes: 67,
      submittedBy: 'BudgetBoss Neha',
      createdAt: '2024-02-25',
    },
  ]);

  const handleUpvote = (dealId: string) => {
    if (!isLoggedIn) { login(); return; }
    const newUpvoted = new Set(upvoted);
    if (newUpvoted.has(dealId)) {
      newUpvoted.delete(dealId);
      setDeals(deals.map(d => d.id === dealId ? { ...d, upvotes: d.upvotes - 1 } : d));
    } else {
      newUpvoted.add(dealId);
      setDeals(deals.map(d => d.id === dealId ? { ...d, upvotes: d.upvotes + 1 } : d));
    }
    setUpvoted(newUpvoted);
  };

  const handleSubmit = () => {
    if (!formTitle || !formDealPrice || !formLink) {
      showNotification('Please fill in required fields');
      return;
    }
    const newDeal: DealItem = {
      id: `d${Date.now()}`,
      title: formTitle,
      description: formDesc,
      storeName: formStore || 'Other',
      originalPrice: Number(formOrigPrice) || 0,
      dealPrice: Number(formDealPrice),
      couponCode: formCoupon || null,
      link: formLink,
      upvotes: 0,
      submittedBy: 'Demo User',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setDeals([newDeal, ...deals]);
    setShowSubmitForm(false);
    setFormTitle(''); setFormDesc(''); setFormStore(''); setFormOrigPrice('');
    setFormDealPrice(''); setFormCoupon(''); setFormLink('');
    showNotification('Deal submitted for review! 🎉');
  };

  const storeColors: Record<string, string> = {
    'Amazon': 'bg-orange-500',
    'Flipkart': 'bg-blue-500',
    'Meesho': 'bg-pink-500',
    'Other': 'bg-gray-500',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            💰 Community Deals
          </h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Best deals found & shared by the Afflosaur community
          </p>
        </div>
        <button
          onClick={() => {
            if (!isLoggedIn) { login(); return; }
            setShowSubmitForm(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-linear-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Submit Deal</span>
        </button>
      </div>

      {/* Mystery deal teaser */}
      {mysteryDeal && (
        <div className={`p-4 rounded-2xl ${isDark ? 'bg-purple-800/50 border border-purple-600' : 'bg-purple-100 border border-purple-200'} flex items-center justify-between`}>            
          <div>
            <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>🎁 Today's Mystery Deal</span>
            <p className={`text-sm ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
              {mysteryDeal.revealed ? mysteryDeal.title : `???: ${mysteryDeal.discount}% off`}
            </p>
          </div>
          <button
            onClick={() => {
              if (mysteryDeal.revealed && mysteryDeal.productId) {
                setPage('product');
                setSelectedProductId(mysteryDeal.productId);
              } else {
                revealMysteryDeal();
                showNotification('Mystery deal revealed! Scroll up to claim');
              }
            }}
            className="px-4 py-2 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all active:scale-95"
          >
            {mysteryDeal.revealed ? 'View Deal' : 'Reveal'}
          </button>
        </div>
      )}

      {/* Submit Form Modal */}
      {showSubmitForm && (
        <div className={`rounded-2xl p-5 sm:p-6 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-lg'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              🎯 Submit a Deal
            </h2>
            <button onClick={() => setShowSubmitForm(false)} className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              id="deal-title"
              name="title"
              placeholder="Deal title *"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-sm outline-none ${
                isDark ? 'bg-gray-700 text-white placeholder:text-gray-500' : 'bg-gray-50 placeholder:text-gray-400'
              }`}
            />
            <textarea
              placeholder="Description (optional)"
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              rows={2}
              className={`w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none ${
                isDark ? 'bg-gray-700 text-white placeholder:text-gray-500' : 'bg-gray-50 placeholder:text-gray-400'
              }`}
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                value={formStore}
                onChange={(e) => setFormStore(e.target.value)}
                className={`px-4 py-2.5 rounded-xl text-sm outline-none ${
                  isDark ? 'bg-gray-700 text-white' : 'bg-gray-50'
                }`}
              >
                <option value="">Store</option>
                <option value="Amazon">Amazon</option>
                <option value="Flipkart">Flipkart</option>
                <option value="Meesho">Meesho</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="text"
                id="deal-coupon"
                name="coupon"
                placeholder="Coupon code"
                value={formCoupon}
                onChange={(e) => setFormCoupon(e.target.value)}
                className={`px-4 py-2.5 rounded-xl text-sm outline-none ${
                  isDark ? 'bg-gray-700 text-white placeholder:text-gray-500' : 'bg-gray-50 placeholder:text-gray-400'
                }`}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                id="deal-original-price"
                name="originalPrice"
                placeholder="Original price ₹"
                value={formOrigPrice}
                onChange={(e) => setFormOrigPrice(e.target.value)}
                className={`px-4 py-2.5 rounded-xl text-sm outline-none ${
                  isDark ? 'bg-gray-700 text-white placeholder:text-gray-500' : 'bg-gray-50 placeholder:text-gray-400'
                }`}
              />
              <input
                type="number"                id="deal-price"
                name="price"                placeholder="Deal price ₹ *"
                value={formDealPrice}
                onChange={(e) => setFormDealPrice(e.target.value)}
                className={`px-4 py-2.5 rounded-xl text-sm outline-none ${
                  isDark ? 'bg-gray-700 text-white placeholder:text-gray-500' : 'bg-gray-50 placeholder:text-gray-400'
                }`}
              />
            </div>
            <input
              type="url"
              id="deal-link"
              name="link"
              placeholder="Deal link * (paste product URL)"
              value={formLink}
              onChange={(e) => setFormLink(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-sm outline-none ${
                isDark ? 'bg-gray-700 text-white placeholder:text-gray-500' : 'bg-gray-50 placeholder:text-gray-400'
              }`}
            />
            <button
              onClick={handleSubmit}
              className="w-full flex items-center justify-center gap-2 py-3 bg-linear-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium text-sm hover:shadow-lg transition-all active:scale-95"
            >
              <Send className="w-4 h-4" /> Submit Deal for Review
            </button>
            <p className={`text-xs text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Deals are reviewed by admin before publishing
            </p>
          </div>
        </div>
      )}

      {/* Deals List */}
      <div className="space-y-3">
        {deals.map(deal => {
          const discount = deal.originalPrice > 0
            ? Math.round(((deal.originalPrice - deal.dealPrice) / deal.originalPrice) * 100)
            : 0;

          return (
            <div
              key={deal.id}
              className={`rounded-2xl p-4 sm:p-5 transition-all hover:shadow-md ${
                isDark ? 'bg-gray-800 hover:shadow-emerald-500/5' : 'bg-white shadow-sm hover:shadow-lg'
              }`}
            >
              <div className="flex gap-3 sm:gap-4">
                {/* Upvote */}
                <button
                  onClick={() => handleUpvote(deal.id)}
                  className={`flex flex-col items-center gap-0.5 shrink-0 p-2 rounded-xl transition-colors ${
                    upvoted.has(deal.id)
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : isDark ? 'bg-gray-750 text-gray-400 hover:text-emerald-400' : 'bg-gray-50 text-gray-400 hover:text-emerald-500'
                  }`}
                >
                  <ThumbsUp className={`w-5 h-5 ${upvoted.has(deal.id) ? 'fill-emerald-500' : ''}`} />
                  <span className="text-xs font-bold">{deal.upvotes}</span>
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full text-white font-medium ${storeColors[deal.storeName] || storeColors['Other']}`}>
                      {deal.storeName}
                    </span>
                    {discount > 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 font-medium">
                        {discount}% OFF
                      </span>
                    )}
                    {deal.couponCode && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-500 font-medium flex items-center gap-0.5">
                        <Tag className="w-3 h-3" /> {deal.couponCode}
                      </span>
                    )}
                  </div>

                  <h3 className={`text-sm sm:text-base font-semibold mt-1.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {deal.title}
                  </h3>

                  {deal.description && (
                    <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {deal.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold text-emerald-500`}>
                        ₹{deal.dealPrice.toLocaleString()}
                      </span>
                      {deal.originalPrice > 0 && (
                        <span className={`text-sm line-through ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          ₹{deal.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] flex items-center gap-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        <Clock className="w-3 h-3" /> {deal.createdAt}
                      </span>
                      <a
                        href={deal.link}
                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-medium hover:bg-emerald-600 transition-colors"
                      >
                        Get Deal <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <p className={`text-[10px] mt-2 ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>
                    Shared by {deal.submittedBy}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

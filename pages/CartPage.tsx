// ==========================================
// Afflosaur - Local Cart + UPI Checkout (Prayagraj Only)
// Cart is ONLY for local Prayagraj deals
// ==========================================

import { useMemo, useState } from 'react';
import { ShoppingCart, Trash2, ArrowLeft, ShoppingBag, Package, Shield, Truck, RotateCcw, Copy, CheckCircle, MessageCircle, QrCode } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useApp } from '../context/AppContext';
import { CartItemCard } from '../components/cart/CartItemCard';

function formatPriceINR(price: number): string {
  return '₹' + price.toLocaleString('en-IN');
}

export function CartPage() {
  const { items, clearCart } = useCart();
  const { theme, setPage, showNotification } = useApp();
  const isDark = theme === 'dark';

  // Local-only cart items
  const localItems = useMemo(() => items.filter(i => i.isLocal), [items]);
  const invalidItems = useMemo(() => items.filter(i => !i.isLocal), [items]);

  const hasInvalid = invalidItems.length > 0;

  const totalItems = localItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = localItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalSavings = localItems.reduce((sum, item) => {
    if (item.originalPrice && item.originalPrice > item.price) {
      return sum + (item.originalPrice - item.price) * item.quantity;
    }
    return sum;
  }, 0);

  const primarySeller = localItems[0];
  const sellerName = primarySeller?.sellerName || 'Prayagraj Local Seller';
  const upiId = primarySeller?.upiId || 'seller@upi';
  const qrImage = primarySeller?.qrImage || '';
  const whatsapp = primarySeller?.whatsapp || '';

  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [payerName, setPayerName] = useState('');
  const [upiRef, setUpiRef] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);

  const handleClearCart = () => {
    clearCart();
    showNotification('Cart cleared! 🗑️');
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId).catch(() => {});
    setCopied(true);
    showNotification('UPI ID copied! 📋');
    setTimeout(() => setCopied(false), 1500);
  };

  const handleWhatsApp = () => {
    if (!whatsapp) {
      showNotification('WhatsApp number not available');
      return;
    }
    const msg = encodeURIComponent(`Hi! I paid for my Afflosaur order of ₹${totalPrice}. Please confirm. Order items: ${localItems.map(i => i.title).join(', ')}`);
    window.open(`https://wa.me/91${whatsapp}?text=${msg}`, '_blank');
  };

  const handlePaid = () => {
    if (!payerName || !upiRef) {
      showNotification('Please add your name and UPI Ref ID');
      return;
    }
    showNotification('Payment submitted! Seller will confirm soon ✅');
    setShowConfirm(false);
    setPayerName('');
    setUpiRef('');
    setScreenshot(null);
  };

  // ---- EMPTY CART STATE ----
  if (items.length === 0 || localItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4">
        <div className="text-7xl sm:text-8xl mb-6 animate-bounce">🛒</div>
        <h2 className={`text-2xl sm:text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Your cart is empty
        </h2>
        <p className={`text-sm sm:text-base text-center max-w-md mb-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Cart is only for Prayagraj local deals (UPI + QR checkout). Explore local products!
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setPage('prayagraj')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all active:scale-95"
          >
            <ShoppingBag className="w-5 h-5" />
            Browse Prayagraj Deals
          </button>
          <button
            onClick={() => setPage('store')}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium border transition-all active:scale-95 ${
              isDark
                ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            🛍️ Explore Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPage('prayagraj')}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className={`text-xl sm:text-2xl font-bold flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <ShoppingCart className="w-6 h-6 text-emerald-500" />
              Local Cart (Prayagraj)
            </h1>
            <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {totalItems} item{totalItems !== 1 ? 's' : ''} • UPI + QR Checkout
            </p>
          </div>
        </div>

        <button
          onClick={handleClearCart}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all active:scale-95 ${
            isDark
              ? 'text-red-400 hover:bg-red-500/10 border border-red-500/20'
              : 'text-red-500 hover:bg-red-50 border border-red-200'
          }`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear Cart
        </button>
      </div>

      {hasInvalid && (
        <div className={`p-3 rounded-xl text-xs ${isDark ? 'bg-orange-900/20 text-orange-300' : 'bg-orange-50 text-orange-700'}`}>
          ⚠️ Affiliate products cannot be added to cart. Only Prayagraj local deals use cart + UPI checkout.
        </div>
      )}

      {/* Main Layout: Cart Items + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-500" />
            <h3 className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Local Products ({localItems.length})
            </h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
            }`}>
              Prayagraj UPI Checkout
            </span>
          </div>
          {localItems.map(item => (
            <CartItemCard key={item.id} item={item} />
          ))}
        </div>

        {/* Order Summary + Checkout */}
        <div className="lg:col-span-1">
          <div className={`sticky top-20 rounded-2xl border p-4 sm:p-5 space-y-4 ${
            isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Local Checkout
            </h3>

            {/* Price Breakdown */}
            <div className="space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                  Subtotal ({totalItems} items)
                </span>
                <span className={isDark ? 'text-white' : 'text-gray-900'}>
                  {formatPriceINR(totalPrice)}
                </span>
              </div>

              {totalSavings > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 dark:text-green-400">Savings</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    - {formatPriceINR(totalSavings)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Delivery</span>
                <span className="text-green-600 dark:text-green-400 font-medium">Same Day (Prayagraj)</span>
              </div>

              <div className={`border-t pt-2.5 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex justify-between">
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Total Payable
                  </span>
                  <span className={`text-lg sm:text-xl font-bold ${
                    isDark ? 'text-emerald-400' : 'text-emerald-600'
                  }`}>
                    {formatPriceINR(totalPrice)}
                  </span>
                </div>
              </div>
            </div>

            {/* Seller Info */}
            <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-700/40' : 'bg-gray-50'}`}>
              <p className={`text-xs font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Seller</p>
              <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{sellerName}</p>
              <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>📍 Prayagraj Local Verified</p>
            </div>

            {/* UPI Payment */}
            <div className={`p-3 rounded-xl border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`text-xs font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Pay via UPI</p>
              <div className="flex items-center justify-between mt-2">
                <div>
                  <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>UPI ID</p>
                  <p className={`text-xs font-mono font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{upiId}</p>
                </div>
                <button
                  onClick={handleCopyUpi}
                  className={`p-2 rounded-lg transition-all ${
                    copied ? 'bg-green-500/20 text-green-500' : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3">
                <button
                  onClick={() => setShowQR(!showQR)}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold ${
                    isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" /> QR Pay
                </button>
                <button
                  onClick={handleWhatsApp}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold bg-green-500/10 text-green-600 dark:text-green-400"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                </button>
              </div>

              {showQR && (
                <div className={`mt-3 p-3 rounded-xl text-center ${isDark ? 'bg-gray-900' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <p className={`text-[10px] mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Scan and pay using PhonePe / GPay / Paytm
                  </p>
                  {qrImage ? (
                    <img src={qrImage} alt="UPI QR" className="w-36 h-36 mx-auto rounded-xl" />
                  ) : (
                    <div className={`w-36 h-36 mx-auto rounded-xl flex items-center justify-center text-4xl ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      📱
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Payment Confirmation */}
            <div className={`p-3 rounded-xl border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                onClick={() => setShowConfirm(!showConfirm)}
                className="w-full py-2.5 bg-linear-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-xs font-bold active:scale-[0.98]"
              >
                ✅ I Have Paid
              </button>

              {showConfirm && (
                <div className="mt-3 space-y-2">
                  <input
                    type="text"
                    id="payer-name"
                    name="payerName"
                    placeholder="Your name"
                    value={payerName}
                    onChange={(e) => setPayerName(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-xs outline-none ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-50'}`}
                  />
                  <input
                    type="text"
                    id="upi-ref"
                    name="upiRef"
                    placeholder="UPI Ref ID (12 digits)"
                    value={upiRef}
                    onChange={(e) => setUpiRef(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-xs outline-none ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-50'}`}
                  />
                  <input
                    type="file"
                    id="payment-screenshot"
                    onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                    className={`w-full text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                  />
                  <button
                    onClick={handlePaid}
                    className="w-full py-2 bg-orange-500 text-white rounded-lg text-xs font-bold"
                  >
                    Submit Confirmation
                  </button>
                  {screenshot && (
                    <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      Screenshot attached: {screenshot.name}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className={`grid grid-cols-3 gap-2 pt-2 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex flex-col items-center text-center gap-1">
                <Shield className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Verified Seller
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <Truck className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Same Day Delivery
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <RotateCcw className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  COD Coming Soon
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className={`mt-8 pt-6 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          💡 You might also like (Local)
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-thin">
          {[
            { emoji: '🍯', title: 'Local Honey', price: '₹249' },
            { emoji: '🧴', title: 'Aloe Gel', price: '₹149' },
            { emoji: '🕯️', title: 'Brass Diya', price: '₹349' },
            { emoji: '🧥', title: 'Handloom Kurta', price: '₹599' },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => setPage('prayagraj')}
              className={`shrink-0 w-28 sm:w-32 p-3 rounded-xl border text-center transition-all hover:shadow-md active:scale-95 ${
                isDark
                  ? 'bg-gray-800/50 border-gray-700 hover:border-emerald-500/50'
                  : 'bg-white border-gray-200 hover:border-emerald-300'
              }`}
            >
              <span className="text-3xl">{item.emoji}</span>
              <p className={`text-xs font-medium mt-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {item.title}
              </p>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                from {item.price}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

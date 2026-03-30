// ==========================================
// Afflosaur - Prayagraj Local Buy Box
// UPI Payment + QR Code + COD for local sellers
// ==========================================

import { useState } from 'react';
import { MapPin, Phone, Copy, Check, Lock, ShoppingBag, MessageCircle, CreditCard } from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface LocalSeller {
  shopName: string;
  phone: string;
  upiId: string;
  qrImage?: string;
  address: string;
  price: number;
  rating?: number;
  deliveryTime?: string;
}

interface Props {
  sellers: LocalSeller[];
  productTitle: string;
  locked?: boolean;
}

export function LocalBuyBox({ sellers, productTitle, locked = false }: Props) {
  const { theme, showNotification } = useApp();
  const isDark = theme === 'dark';
  const [selectedSeller, setSelectedSeller] = useState<number>(0);
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  const payUPI = (upi: string, amount: number) => {
    const encodedName = encodeURIComponent(productTitle);
    window.location.href = `upi://pay?pa=${upi}&pn=Afflosaur&am=${amount}&cu=INR&tn=${encodedName}`;
  };

  const copyUPI = (upi: string) => {
    navigator.clipboard.writeText(upi);
    setCopied(true);
    showNotification('UPI ID copied! 📋');
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsAppOrder = (phone: string, price: number) => {
    const msg = encodeURIComponent(
      `Hi! I want to order "${productTitle}" for ₹${price} from Afflosaur. Please confirm availability.`
    );
    window.open(`https://wa.me/91${phone}?text=${msg}`, '_blank');
  };

  // Locked State
  if (locked) {
    return (
      <div className={`relative rounded-2xl overflow-hidden border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        {/* Blurred content */}
        <div className="filter blur-md pointer-events-none p-6">
          <div className={`h-4 w-48 rounded-full mb-3 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
          <div className={`h-3 w-32 rounded-full mb-6 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className={`h-20 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>

        {/* Lock overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 dark:bg-black/50 backdrop-blur-sm">
          <div className={`p-4 rounded-2xl text-center max-w-xs ${isDark ? 'bg-gray-900/90' : 'bg-white/90'} shadow-2xl`}>
            <Lock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <h3 className={`font-black text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
              📍 Prayagraj Exclusive
            </h3>
            <p className={`text-[11px] mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Local sellers with direct purchase & UPI payment.<br />
              Available only in Prayagraj area.
            </p>
            <button className="mt-3 px-4 py-2 bg-linear-to-r from-orange-500 to-amber-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-orange-500/20">
              🔓 Unlock Local Deals
            </button>
          </div>
        </div>
      </div>
    );
  }

  const seller = sellers[selectedSeller];
  if (!seller) return null;

  return (
    <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-gray-800/50 border-orange-500/20' : 'bg-linear-to-b from-orange-50 to-white border-orange-200'}`}>
      {/* Header */}
      <div className="px-4 py-3 bg-linear-to-r from-orange-500 to-amber-500 text-white">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <h3 className="text-sm font-black">Prayagraj Local Sellers</h3>
        </div>
        <p className="text-[10px] text-orange-100 mt-0.5">Direct purchase • UPI/COD • Same day delivery</p>
      </div>

      {/* Seller tabs */}
      {sellers.length > 1 && (
        <div className="flex gap-1 p-2 overflow-x-auto scrollbar-hide">
          {sellers.map((s, i) => (
            <button
              key={i}
              onClick={() => { setSelectedSeller(i); setShowQR(false); }}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                i === selectedSeller
                  ? 'bg-orange-500 text-white'
                  : isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
              }`}
            >
              🏪 {s.shopName}
            </button>
          ))}
        </div>
      )}

      {/* Seller details */}
      <div className="p-4 space-y-3">
        {/* Shop info */}
        <div className="flex items-start justify-between">
          <div>
            <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
              🏪 {seller.shopName}
            </h4>
            <p className={`text-[11px] mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              📍 {seller.address}
            </p>
            {seller.deliveryTime && (
              <p className="text-[10px] text-orange-500 font-bold mt-0.5">
                🏍️ {seller.deliveryTime}
              </p>
            )}
          </div>
          <div className="text-right">
            <span className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
              ₹{seller.price.toLocaleString()}
            </span>
            {seller.rating && (
              <p className="text-[10px] text-amber-500 font-bold">⭐ {seller.rating}/5</p>
            )}
          </div>
        </div>

        {/* Payment Options */}
        <div className="space-y-2">
          {/* UPI Pay */}
          <button
            onClick={() => payUPI(seller.upiId, seller.price)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-linear-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 hover:shadow-xl transition-all active:scale-[0.98]"
          >
            <CreditCard className="w-4 h-4" />
            Pay ₹{seller.price.toLocaleString()} via UPI
          </button>

          <div className="grid grid-cols-3 gap-2">
            {/* QR Code */}
            <button
              onClick={() => setShowQR(!showQR)}
              className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-[10px] font-bold transition-all ${
                isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="text-lg">📱</span>
              QR Pay
            </button>

            {/* WhatsApp */}
            <button
              onClick={() => whatsAppOrder(seller.phone, seller.price)}
              className="flex flex-col items-center gap-1 py-2.5 rounded-xl text-[10px] font-bold bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </button>

            {/* COD */}
            <button
              onClick={() => {
                whatsAppOrder(seller.phone, seller.price);
                showNotification('Order on WhatsApp for COD! 📦');
              }}
              className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-[10px] font-bold transition-all ${
                isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              COD
            </button>
          </div>

          {/* UPI ID copy */}
          <div className={`flex items-center justify-between px-3 py-2 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            <div>
              <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>UPI ID</span>
              <p className={`text-xs font-mono font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{seller.upiId}</p>
            </div>
            <button
              onClick={() => copyUPI(seller.upiId)}
              className={`p-2 rounded-lg transition-all ${
                copied ? 'bg-green-500/20 text-green-500' : isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Phone */}
          <a
            href={`tel:+91${seller.phone}`}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium ${
              isDark ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-50 text-gray-600'
            }`}
          >
            <Phone className="w-3.5 h-3.5 text-orange-500" />
            +91 {seller.phone}
          </a>
        </div>

        {/* QR Modal */}
        {showQR && (
          <div className={`p-4 rounded-xl text-center border ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
            <p className={`text-xs font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              📱 Scan QR to Pay ₹{seller.price.toLocaleString()}
            </p>
            {seller.qrImage ? (
              <img src={seller.qrImage} alt="QR Code" className="w-40 h-40 mx-auto rounded-xl" />
            ) : (
              <div className={`w-40 h-40 mx-auto rounded-xl flex items-center justify-center text-4xl ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                📱
              </div>
            )}
            <p className={`text-[10px] mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Open any UPI app → Scan → Pay
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={`px-4 py-2 border-t text-center ${isDark ? 'border-gray-700 bg-gray-800' : 'border-orange-100 bg-orange-50/50'}`}>
        <p className={`text-[10px] ${isDark ? 'text-gray-600' : 'text-orange-400'}`}>
          🔒 Secure local purchase • COD & UPI accepted • Prayagraj delivery only
        </p>
      </div>
    </div>
  );
}

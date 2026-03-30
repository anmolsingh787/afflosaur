// ==========================================
// DealDino - Cart Item Card Component
// Displays single item in cart with controls
// ==========================================

import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart, type CartItem } from '../../context/CartContext';
import { useApp } from '../../context/AppContext';

// Format price in INR
function formatPriceINR(price: number): string {
  return '₹' + price.toLocaleString('en-IN');
}

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { removeFromCart, updateQuantity } = useCart();
  const { theme, showNotification } = useApp();
  const isDark = theme === 'dark';

  const itemTotal = item.price * item.quantity;
  const savings = item.originalPrice
    ? (item.originalPrice - item.price) * item.quantity
    : 0;

  const handleRemove = () => {
    removeFromCart(item.id);
    showNotification(`Removed "${item.title}" from cart`);
  };

  return (
    <div className={`flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border transition-all hover:shadow-md ${
      isDark
        ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
        : 'bg-white border-gray-200 hover:border-gray-300'
    }`}>
      {/* Product Image */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-gray-100">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        {/* Title + Store Badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className={`text-sm sm:text-base font-semibold leading-tight line-clamp-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {item.title}
            </h3>
            {item.store && (
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium ${
                  isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  📍 Prayagraj Local
                </span>
              </div>
            )}
          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemove}
            className={`p-1.5 rounded-lg shrink-0 transition-colors ${
              isDark
                ? 'text-gray-500 hover:text-red-400 hover:bg-red-500/10'
                : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
            }`}
            title="Remove"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Price Row */}
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-base sm:text-lg font-bold ${
            isDark ? 'text-emerald-400' : 'text-emerald-600'
          }`}>
            {formatPriceINR(item.price)}
          </span>
          {item.originalPrice && item.originalPrice > item.price && (
            <span className={`text-xs line-through ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}>
              {formatPriceINR(item.originalPrice)}
            </span>
          )}
          {item.discount && item.discount > 0 && (
            <span className="text-xs font-semibold text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded">
              {item.discount}% OFF
            </span>
          )}
        </div>

        {/* Savings */}
        {savings > 0 && (
          <p className="text-[11px] text-green-600 dark:text-green-400 mt-0.5">
            You save {formatPriceINR(savings)} on this item! 🎉
          </p>
        )}

                  {/* Bottom Row: Quantity + Total */}
        <div className="flex items-center justify-between mt-3 gap-2">
          {/* Quantity Stepper (Local only) */}
          <div className={`flex items-center rounded-lg border overflow-hidden ${
            isDark ? 'border-gray-600' : 'border-gray-300'
          }`}>
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className={`p-1.5 sm:p-2 transition-colors ${
                isDark
                  ? 'hover:bg-gray-700 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className={`px-3 sm:px-4 text-sm font-semibold min-w-[2rem] text-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className={`p-1.5 sm:p-2 transition-colors ${
                isDark
                  ? 'hover:bg-gray-700 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Item Total */}
          <span className={`text-sm sm:text-base font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {formatPriceINR(itemTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}

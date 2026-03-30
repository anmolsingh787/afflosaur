// ==========================================
// Afflosaur - Product Card Component 🦕
// Add to Cart + Buy Now buttons
// ==========================================

import { Star, TrendingUp, Zap, ExternalLink, Award, MapPin, Check, ShoppingCart } from 'lucide-react';
import type { Product } from '../types';
import { useApp } from '../context/AppContext';
import { useCart } from '../context/CartContext';
import { useSound } from '../hooks/useSound';

interface Props {
  product: Product;
  compact?: boolean;
}

export function ProductCard({ product, compact = false }: Props) {
  const { theme, setPage, setSelectedProductId, showNotification } = useApp();
  const status: string = product.status || 'available';
  const { addToCart, isInCart } = useCart();
  const { playSound } = useSound();
  const isDark = theme === 'dark';
  
  const bestPrice = Math.min(...product.prices.map(p => p.price));
  const maxPrice = Math.max(...product.prices.map(p => p.price));
  const alreadyInCart = isInCart(product.id);
  
  const handleClick = () => {
    if (status === 'hidden' || status === 'out_of_stock') return;
    setSelectedProductId(product.id);
    setPage('product');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (status !== 'available') {
      showNotification('Cannot add this product');
      playSound('error');
      return;
    }
    if (!product.isPrayagraj) {
      showNotification('Cart is only for Prayagraj local deals 📍');
      playSound('error');
      return;
    }
    const bestPriceEntry = product.prices.find(p => p.isBestDeal) || product.prices[0];
    addToCart({
      id: product.id,
      title: product.title,
      image: product.image,
      price: bestPrice,
      originalPrice: maxPrice > bestPrice ? maxPrice : undefined,
      store: bestPriceEntry?.platform || 'Afflosaur',
      affiliateUrl: product.type === 'affiliate' ? bestPriceEntry?.url : undefined,
      discount: product.discount,
      isLocal: true,
      sellerName: product.sellerName,
      upiId: product.upiId,
      qrImage: product.qrImage,
      whatsapp: product.whatsapp,
    });
    showNotification(`🛒 ${product.title} added to cart!`);
    playSound('cart');
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (status !== 'available') return;
    // Homepage/store cards should always navigate to Product Detail Page for comparison
    setSelectedProductId(product.id);
    setPage('product');
    showNotification('🔍 Compare prices across stores');
    playSound('click');
  };

  const typeBadge = {
    affiliate: { label: 'Affiliate', color: 'bg-blue-500' },
    direct: { label: 'Our Product', color: 'bg-orange-500' },
    mixed: { label: 'Compare & Save', color: 'bg-purple-500' },
  };

  if (status === 'hidden') return null;
  if (compact) {
    return (
      // div instead of button to avoid nested <button> HTML error
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        className={`flex items-center gap-3 p-3 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] w-full text-left cursor-pointer ${
          isDark ? 'bg-gray-800/80 hover:bg-gray-750' : 'bg-white hover:bg-gray-50 shadow-sm'
        }`}
      >
        <img
          src={product.image}
          alt={product.title}
          className="w-16 h-16 rounded-xl object-cover shrink-0"
          loading="lazy"
        />
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {product.title}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-orange-500 font-bold text-sm">₹{bestPrice.toLocaleString()}</span>
            {product.discount && (
              <span className="text-[10px] px-1.5 py-0.5 bg-red-500/10 text-red-500 rounded-full font-bold">
                {product.discount}% OFF
              </span>
            )}
          </div>
          {product.isPrayagraj && (
            <span className="text-[10px] text-orange-500 flex items-center gap-0.5 mt-0.5">
              <MapPin className="w-2.5 h-2.5" /> Prayagraj
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1 shrink-0">
          <button
            onClick={handleBuyNow}
            className="px-2.5 py-1.5 bg-linear-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold rounded-lg active:scale-95 transition-transform"
          >
            Buy
          </button>
          <button
            onClick={handleAddToCart}
            className={`px-2.5 py-1.5 text-[10px] font-bold rounded-lg active:scale-95 transition-transform ${
              alreadyInCart 
                ? 'bg-green-500 text-white' 
                : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {alreadyInCart ? '✓' : '+🛒'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        isDark ? 'bg-gray-800/80 hover:shadow-orange-500/10' : 'bg-white shadow-md hover:shadow-orange-500/15'
      } ${product.isSponsored ? (isDark ? 'ring-1 ring-amber-500/30' : 'ring-1 ring-amber-400/50') : ''}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden cursor-pointer" onClick={handleClick}>
        {status === 'out_of_stock' && (
          <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
            <span className="text-white font-bold">Out of Stock</span>
          </div>
        )}
        {status === 'coming_soon' && (
          <div className="absolute inset-0 bg-yellow-200/60 flex items-center justify-center">
            <span className="text-black font-bold">Coming Soon</span>
          </div>
        )}
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-40 sm:h-48 object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className={`${typeBadge[product.type].color} text-white text-[10px] px-2 py-0.5 rounded-full font-bold`}>
            {typeBadge[product.type].label}
          </span>
          {product.isTrending && (
            <span className="bg-linear-to-r from-orange-500 to-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> Trending
            </span>
          )}
          {product.isHot && (
            <span className="bg-linear-to-r from-red-500 to-pink-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5">
              <Zap className="w-3 h-3" /> Hot 🔥
            </span>
          )}
          {product.isPrayagraj && (
            <span className="bg-linear-to-r from-orange-500 to-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5">
              <MapPin className="w-3 h-3" /> Prayagraj
            </span>
          )}
          {product.isSponsored && (
            <span className="bg-amber-400 text-gray-900 text-[10px] px-2 py-0.5 rounded-full font-bold">
              Sponsored
            </span>
          )}
        </div>

        {/* Discount badge */}
        {product.discount && (
          <div className="absolute top-2 right-2">
            <span className="bg-linear-to-br from-red-500 to-pink-500 text-white text-xs font-black px-2.5 py-1 rounded-xl shadow-lg">
              {product.discount}% OFF
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        <button onClick={handleClick} className="text-left w-full">
          <h3 className={`font-bold text-sm leading-tight line-clamp-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {product.title}
          </h3>
        </button>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex items-center gap-0.5">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className={`text-xs font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {product.rating}
            </span>
          </div>
          <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            ({product.reviewCount.toLocaleString()})
          </span>
        </div>

        {/* Prayagraj delivery info */}
        {product.deliveryInfo && (
          <p className="text-[10px] text-orange-500 font-medium mt-1.5">{product.deliveryInfo}</p>
        )}

        {/* Price */}
        <div className="mt-2.5">
          <div className="flex items-center gap-2">
            <span className={`text-lg sm:text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
              ₹{bestPrice.toLocaleString()}
            </span>
            {bestPrice !== maxPrice && (
              <span className={`text-xs line-through ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                ₹{maxPrice.toLocaleString()}
              </span>
            )}
          </div>
          {product.prices.length > 1 && (
            <div className="flex items-center gap-1 mt-0.5">
              <Award className="w-3 h-3 text-orange-500" />
              <span className="text-[10px] text-orange-500 font-bold">
                Best deal from {product.prices.find(p => p.isBestDeal)?.platform || 'comparison'}
              </span>
            </div>
          )}
        </div>

        {/* ===== ACTION BUTTONS ===== */}
        <div className="mt-3 space-y-2">
          {/* Buy Now Button - Always shown, prominent */}
          <button
            onClick={handleBuyNow}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-xl text-sm font-bold transition-all active:scale-95 hover:shadow-lg hover:shadow-orange-500/30"
          >
            <>
              <ExternalLink className="w-4 h-4" />
              Compare Prices — ₹{bestPrice.toLocaleString()}
            </>
          </button>

          {/* Add to Cart Button - Local only */}
          {product.isPrayagraj && (
            <button
              onClick={handleAddToCart}
              className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                alreadyInCart
                  ? 'bg-green-500/10 text-green-600 border border-green-500/30'
                  : isDark 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {alreadyInCart ? (
                <><Check className="w-3.5 h-3.5" /> Added to Cart</>
              ) : (
                <><ShoppingCart className="w-3.5 h-3.5" /> Add to Cart (Local)</>
              )}
            </button>
          )}

          {/* Compare button for mixed/affiliate */}
          {product.type === 'mixed' && (
            <button
              onClick={(e) => { e.stopPropagation(); handleClick(); }}
              className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                isDark ? 'text-orange-400 hover:bg-orange-500/10' : 'text-orange-500 hover:bg-orange-50'
              }`}
            >
              <Award className="w-3.5 h-3.5" /> Compare Prices
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

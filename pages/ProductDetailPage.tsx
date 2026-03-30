// ==========================================
// Afflosaur - Product Detail Page 🦕
// Buy Now + Add to Cart + 9-store comparison
// ==========================================

import { Star, ExternalLink, ShoppingCart, CreditCard, ArrowLeft, Share2, Heart, TrendingUp, Shield, MapPin, Check, Truck, RotateCcw, Package } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useCart } from '../context/CartContext';
import { useCoin } from '../context/CoinContext';
import { AffiliatePriceTable } from '../components/AffiliatePriceTable';
import type { StorePrice } from '../components/AffiliatePriceTable';
import { LocalBuyBox } from '../components/LocalBuyBox';
import type { LocalSeller } from '../components/LocalBuyBox';
import { useState } from 'react';
import { useSound } from '../hooks/useSound';
import GhostModeComparison from '../components/GhostModeComparison';

export function ProductDetailPage() {
  const { theme, products, selectedProductId, setSelectedProductId, setPage, blogPosts, setSelectedBlogId, showNotification } = useApp();
  const { addToCart, isInCart } = useCart();
  const { earnCoins } = useCoin();
  const { playSound } = useSound();
  const isDark = theme === 'dark';
  const [wishlisted, setWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const product = products.find(p => p.id === selectedProductId);
  const relatedProducts = products.filter(p => p.id !== selectedProductId && p.category === product?.category).slice(0, 4);
  const relatedReviews = blogPosts.filter(b => b.productId === selectedProductId);

  if (!product) {
    return (
      <div className={`text-center py-16 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <span className="text-6xl">🦕</span>
        <p className={`mt-4 text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Product not found</p>
        <button onClick={() => setPage('store')} className="mt-4 px-6 py-2.5 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors">
          ← Back to Store
        </button>
      </div>
    );
  }

  const bestPrice = Math.min(...product.prices.map(p => p.price));
  const maxPrice = Math.max(...product.prices.map(p => p.price));
  const bestPriceEntry = product.prices.find(p => p.isBestDeal) || product.prices[0];
  const alreadyInCart = isInCart(product.id);
  const savings = maxPrice > bestPrice ? maxPrice - bestPrice : 0;

  // Product images (mock multiple views)
  const productImages = [
    product.image,
    product.image,
    product.image,
  ];

  // ---- Handle Add to Cart ----
  const handleAddToCart = () => {
    if (!product.isPrayagraj) {
      showNotification('Cart is only for Prayagraj local deals 📍');
      return;
    }
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
    earnCoins(5, 'Added product to cart');
    playSound('coin');
    showNotification(`🛒 ${product.title} added to cart!`);
  };

  // ---- Handle Buy Now ----
  const handleBuyNow = () => {
    // Always redirect to lowest price affiliate link (no cart)
    const available = product.prices.filter(p => p.url && p.url !== '#');
    if (available.length > 0) {
      const cheapest = [...available].sort((a, b) => a.price - b.price)[0];
      window.open(cheapest.url, '_blank');
      earnCoins(10, `Clicked affiliate link - ${cheapest.platform}`);
      playSound('coin');
      showNotification(`🔗 Redirecting to ${cheapest.platform}...`);
      return;
    }

    // Fallback if no affiliate URLs
    if (product.affiliateUrl) {
      window.open(product.affiliateUrl, '_blank');
      earnCoins(10, 'Clicked affiliate link');
      playSound('coin');
      showNotification('🔗 Redirecting to partner store...');
      return;
    }

    showNotification('No store links available');
  };

  // ---- Handle Wishlist ----
  const handleWishlist = () => {
    setWishlisted(!wishlisted);
    if (!wishlisted) {
      earnCoins(5, 'Added to wishlist');
    playSound('success');
      showNotification('❤️ Added to wishlist!');
    }
  };

  // ---- Handle Share ----
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product.title, text: `Check out ${product.title} on Afflosaur!`, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showNotification('📋 Link copied to clipboard!');
    }
    earnCoins(5, 'Shared product');
    playSound('success');
  };

  // Build 9-store prices
  const allStorePrices: StorePrice[] = [
    ...product.prices.map(p => ({
      store: p.platform,
      icon: p.platform === 'Amazon' ? '📦' : p.platform === 'Flipkart' ? '🛒' : p.platform === 'Meesho' ? '🎀' : p.platform === 'Afflosaur' ? '🦕' : '🏪',
      price: p.price,
      url: p.url,
      isBestDeal: p.isBestDeal,
    })),
  ];

  const existingStores = new Set(allStorePrices.map(p => p.store));
  const additionalStores = [
    { store: 'Amazon', icon: '📦' },
    { store: 'Flipkart', icon: '🛒' },
    { store: 'Meesho', icon: '🎀' },
    { store: 'Myntra', icon: '👗' },
    { store: 'Ajio', icon: '👟' },
    { store: 'Tata Cliq', icon: '🏷️' },
    { store: 'Reliance Digital', icon: '⚡' },
    { store: 'Croma', icon: '🖥️' },
    { store: 'JioMart', icon: '🟢' },
  ].filter(s => !existingStores.has(s.store));

  additionalStores.forEach(s => {
    allStorePrices.push({ store: s.store, icon: s.icon, price: null, url: '#' });
  });

  // Prayagraj local sellers
  const localSellers: LocalSeller[] = product.isPrayagraj ? [
    {
      shopName: 'Sangam City Store',
      phone: '9876543210',
      upiId: 'afflosaur@upi',
      address: 'Civil Lines, Prayagraj',
      price: product.myPrice || bestPrice,
      rating: 4.8,
      deliveryTime: 'Same day delivery',
    },
    {
      shopName: 'Triveni Bazaar',
      phone: '9876543211',
      upiId: 'triveni@upi',
      address: 'Katra, Prayagraj',
      price: (product.myPrice || bestPrice) + 20,
      rating: 4.5,
      deliveryTime: 'Next day delivery',
    },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => setPage('store')}
        className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
      >
        <ArrowLeft className="w-4 h-4" /> Back to Store
      </button>

      {/* ===== PRODUCT MAIN SECTION ===== */}
      <div className={`rounded-2xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Image Gallery */}
          <div className="relative">
            <img 
              src={productImages[selectedImage]} 
              alt={product.title} 
              className="w-full h-64 sm:h-80 md:h-[500px] object-cover" 
            />
            
            {/* Thumbnail strip */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {productImages.map((img, i) => (
                <button 
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === i ? 'border-orange-500 scale-110' : 'border-white/50'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.isTrending && (
                <span className="bg-orange-500 text-white text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Trending
                </span>
              )}
              {product.isPrayagraj && (
                <span className="bg-linear-to-r from-orange-500 to-amber-500 text-white text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Prayagraj
                </span>
              )}
              {product.isSponsored && (
                <span className="bg-yellow-500 text-gray-900 text-xs px-2.5 py-1 rounded-full font-medium">Sponsored</span>
              )}
              {product.discount && (
                <span className="bg-linear-to-r from-red-500 to-pink-500 text-white text-xs px-2.5 py-1 rounded-full font-black">
                  {product.discount}% OFF
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div className="absolute top-3 right-3 flex gap-2">
              <button 
                onClick={handleWishlist}
                className={`p-2.5 rounded-full backdrop-blur-lg transition-all active:scale-90 ${
                  wishlisted 
                    ? 'bg-red-500 text-white' 
                    : isDark ? 'bg-gray-900/50 text-white' : 'bg-white/80 text-gray-700'
                }`}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-white' : ''}`} />
              </button>
              <button 
                onClick={handleShare}
                className={`p-2.5 rounded-full backdrop-blur-lg transition-all active:scale-90 ${isDark ? 'bg-gray-900/50 text-white' : 'bg-white/80 text-gray-700'}`}
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-5 sm:p-6 md:p-8 flex flex-col">
            {/* Type badge */}
            <div className={`text-xs px-3 py-1 rounded-full inline-block font-bold mb-3 w-fit ${
              product.type === 'affiliate' ? 'bg-blue-500/10 text-blue-500' :
              product.type === 'direct' ? 'bg-orange-500/10 text-orange-500' :
              'bg-purple-500/10 text-purple-500'
            }`}>
              {product.type === 'affiliate' ? '🔗 Affiliate Product' :
               product.type === 'direct' ? '🦕 Our Product' : '⚖️ Compare & Save'}
            </div>

            <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white rounded-lg text-sm font-bold">
                <Star className="w-4 h-4 fill-white" /> {product.rating}
              </div>
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {product.reviewCount.toLocaleString()} ratings
              </span>
              {product.isTrending && (
                <span className="text-xs bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded-full font-medium">
                  🔥 Bestseller
                </span>
              )}
            </div>

            {/* Price Section */}
            <div className={`mt-5 p-4 rounded-xl ${isDark ? 'bg-gray-750/50' : 'bg-orange-50'}`}>
              <div className="flex items-end gap-3">
                <span className={`text-3xl sm:text-4xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  ₹{bestPrice.toLocaleString()}
                </span>
                {maxPrice > bestPrice && (
                  <span className={`text-lg line-through mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    ₹{maxPrice.toLocaleString()}
                  </span>
                )}
                {product.discount && (
                  <span className="text-sm bg-green-500 text-white px-2.5 py-1 rounded-lg font-bold mb-1">
                    Save {product.discount}%
                  </span>
                )}
              </div>
              {savings > 0 && (
                <p className="text-green-500 font-bold text-sm mt-1">
                  💰 You save ₹{savings.toLocaleString()}!
                </p>
              )}
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Inclusive of all taxes
              </p>


            </div>

            {/* Description */}
            <p className={`mt-4 text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {product.description}
            </p>

            {/* Tags */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {product.tags.map(tag => (
                <span key={tag} className={`text-xs px-2.5 py-1 rounded-full ${isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                  #{tag}
                </span>
              ))}
            </div>

            {/* Delivery Info */}
            <div className={`mt-4 p-3 rounded-xl border ${isDark ? 'border-gray-700 bg-gray-750/30' : 'border-gray-200 bg-gray-50'}`}>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <Truck className={`w-5 h-5 mx-auto ${isDark ? 'text-orange-400' : 'text-orange-500'}`} />
                  <p className={`text-[10px] mt-1 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {product.isPrayagraj ? 'Same Day' : 'Free Delivery'}
                  </p>
                </div>
                <div>
                  <RotateCcw className={`w-5 h-5 mx-auto ${isDark ? 'text-orange-400' : 'text-orange-500'}`} />
                  <p className={`text-[10px] mt-1 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Easy Returns</p>
                </div>
                <div>
                  <Shield className={`w-5 h-5 mx-auto ${isDark ? 'text-orange-400' : 'text-orange-500'}`} />
                  <p className={`text-[10px] mt-1 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Secure Pay</p>
                </div>
              </div>
            </div>

            {/* ===== BUY NOW + ADD TO CART BUTTONS ===== */}
            <div className="mt-6 space-y-3">
              {/* BUY NOW - Primary Button */}
              <button
                onClick={handleBuyNow}
                className="w-full flex items-center justify-center gap-2.5 py-4 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-2xl text-base font-black transition-all active:scale-[0.97] hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.01]"
              >
                {product.type === 'affiliate' ? (
                  <>
                    <ExternalLink className="w-5 h-5" />
                    Buy on {bestPriceEntry?.platform || 'Store'} — ₹{bestPrice.toLocaleString()}
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Buy Now — ₹{bestPrice.toLocaleString()}
                  </>
                )}
              </button>

              {/* ADD TO CART - Secondary Button */}
              {product.isPrayagraj && (
                <button
                  onClick={handleAddToCart}
                  className={`w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-base font-bold transition-all active:scale-[0.97] border-2 ${
                    alreadyInCart
                      ? 'bg-green-500/10 text-green-600 border-green-500/30 hover:bg-green-500/20'
                      : isDark
                        ? 'bg-transparent text-orange-400 border-orange-500/50 hover:bg-orange-500/10'
                        : 'bg-transparent text-orange-500 border-orange-500/50 hover:bg-orange-50'
                  }`}
                >
                  {alreadyInCart ? (
                    <><Check className="w-5 h-5" /> Added to Cart — Go to Cart</>
                  ) : (
                    <><ShoppingCart className="w-5 h-5" /> Add to Cart (Local)</>
                  )}
                </button>
              )}

              {/* View Cart link if already in cart */}
              {alreadyInCart && (
                <button
                  onClick={() => setPage('cart')}
                  className="w-full text-center text-sm text-orange-500 font-medium hover:underline py-1"
                >
                  🛒 View Cart & Checkout →
                </button>
              )}
            </div>

            {/* Safety badges */}
            <div className="mt-4 flex items-center gap-2 text-xs">
              <Shield className="w-4 h-4 text-green-500 shrink-0" />
              <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                {product.isPrayagraj ? 'COD • UPI Pay • QR Pay • Local Delivery • WhatsApp Order' : 'COD Available • Easy Returns • Secure Payment • Free Delivery'}
              </span>
            </div>

            {/* Coins earned notice */}
            <div className={`mt-3 flex items-center gap-2 text-xs p-2.5 rounded-lg ${isDark ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
              <span className="text-base">🪙</span>
              <span className={`font-medium ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                Earn up to {Math.round(bestPrice * 0.5)} AffloCoins on this purchase!
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== STORE BUY BUTTONS (Quick Access) ===== */}
      <div className={`rounded-2xl p-5 ${isDark ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            🛒 Buy From Your Favorite Store
          </h2>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-700'}`}>
            {product.prices.filter(p => p.url && p.url !== '#').length} stores
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {product.prices.filter(p => p.url && p.url !== '#').map((p, i) => (
            <a
              key={i}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all hover:scale-[1.02] active:scale-95 ${
                p.isBestDeal
                  ? 'border-orange-500 bg-orange-500/5 shadow-lg shadow-orange-500/10'
                  : isDark
                    ? 'border-gray-700 hover:border-gray-600 bg-gray-750'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50'
              }`}
            >
              <span className="text-2xl">
                {p.platform === 'Amazon' ? '📦' : p.platform === 'Flipkart' ? '🛒' : p.platform === 'Meesho' ? '🎀' : '🦕'}
              </span>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {p.platform}
                </p>
                <p className={`text-base font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  ₹{p.price.toLocaleString()}
                </p>
              </div>
              <ExternalLink className={`w-4 h-4 shrink-0 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            </a>
          ))}
        </div>
      </div>

      {/* ===== 9-Store Price Comparison ===== */}
      <div>
        <h2 className={`text-lg font-black mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          ⚖️ Compare Across India
        </h2>
        <AffiliatePriceTable prices={allStorePrices} />
      </div>

      {/* ===== Prayagraj Local Section ===== */}
      {product.isPrayagraj && localSellers.length > 0 && (
        <div>
          <h2 className={`text-lg font-black mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <MapPin className="w-5 h-5 text-orange-500" /> Prayagraj Local Sellers
          </h2>
          <LocalBuyBox sellers={localSellers} productTitle={product.title} />
        </div>
      )}

      {/* Locked Prayagraj for non-local products */}
      {!product.isPrayagraj && (
        <div>
          <h2 className={`text-lg font-black mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            📍 Prayagraj Local
          </h2>
          <LocalBuyBox
            sellers={[{ shopName: 'Local Shop', phone: '', upiId: '', address: 'Prayagraj', price: bestPrice }]}
            productTitle={product.title}
            locked
          />
        </div>
      )}

      {/* ===== Related Products ===== */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className={`text-lg font-black mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <Package className="w-5 h-5 text-orange-500" /> Similar Products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {relatedProducts.map(rp => {
              const rpBestPrice = Math.min(...rp.prices.map(p => p.price));
              return (
                <button
                  key={rp.id}
                  onClick={() => { setSelectedProductId(rp.id); window.scrollTo(0, 0); }}
                  className={`rounded-xl overflow-hidden text-left transition-all hover:scale-[1.02] active:scale-95 ${
                    isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white shadow-sm hover:shadow-md'
                  }`}
                >
                  <img src={rp.image} alt={rp.title} className="w-full h-28 object-cover" loading="lazy" />
                  <div className="p-2.5">
                    <p className={`text-xs font-semibold line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{rp.title}</p>
                    <p className="text-orange-500 font-bold text-sm mt-1">₹{rpBestPrice.toLocaleString()}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{rp.rating}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ===== Community Reviews ===== */}
      {relatedReviews.length > 0 && (
        <div className={`rounded-2xl p-5 sm:p-6 ${isDark ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>📝 Community Reviews</h2>
          <div className="mt-4 space-y-3">
            {relatedReviews.map(review => (
              <button
                key={review.id}
                onClick={() => { setSelectedBlogId(review.id); setPage('blogpost'); }}
                className={`w-full text-left p-4 rounded-xl transition-colors ${isDark ? 'bg-gray-750 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'}`}
              >
                <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{review.title}</p>
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>by {review.author} • ❤️ {review.likes} likes</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ===== Sticky Mobile Buy Bar ===== */}
      <div className={`fixed bottom-16 left-0 right-0 z-40 p-3 md:hidden ${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-lg border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="flex gap-2 max-w-lg mx-auto">
          {/* Add to Cart (mobile) */}
          {product.isPrayagraj && (
            <button
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 border-2 ${
                alreadyInCart
                  ? 'bg-green-500/10 text-green-600 border-green-500/30'
                  : isDark
                    ? 'border-orange-500/50 text-orange-400'
                    : 'border-orange-500/50 text-orange-500'
              }`}
            >
              {alreadyInCart ? <><Check className="w-4 h-4" /> In Cart</> : <><ShoppingCart className="w-4 h-4" /> Cart (Local)</>}
            </button>
          )}

          {/* Buy Now (mobile) */}
          <button
            onClick={handleBuyNow}
            className="flex-[2] flex items-center justify-center gap-2 py-3 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-sm transition-all active:scale-95 hover:shadow-lg"
          >
            {product.type === 'affiliate' ? (
              <><ExternalLink className="w-4 h-4" /> Buy on {bestPriceEntry?.platform}</>
            ) : (
              <><CreditCard className="w-4 h-4" /> Buy Now ₹{bestPrice.toLocaleString()}</>
            )}
          </button>
        </div>
      </div>

      {/* Spacer for sticky bar on mobile */}
      <div className="h-16 md:hidden" />

      {/* AdSense */}
      <div className={`rounded-xl p-3 text-center text-[10px] ${isDark ? 'bg-gray-800/50 text-gray-600' : 'bg-gray-100 text-gray-400'}`}>
        📢 Ad Space — Google AdSense Ready
      </div>

      {/* Ghost Mode Price Comparison */}
      <GhostModeComparison
        productId={product.id}
        productName={product.name}
        currentPrice={bestPrice}
        onPriceAlert={(store, price, savings) => {
          showNotification(`🚨 ${store}: ₹${price.toLocaleString()} (${savings.toLocaleString()} savings!)`, 'success');
          playSound('notification');
        }}
      />
    </div>
  );
}

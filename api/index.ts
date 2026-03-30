// ==========================================
// DealDino - API Index
// Central export for all API functions
//
// Usage:
//   import { getAllProducts, signInWithEmail } from '../api';
// ==========================================

// Authentication
export {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signOut,
  getCurrentUser,
  getSession,
  getUserProfile,
  updateUserProfile,
  isAdmin,
  onAuthStateChange,
  resetPassword,
} from './auth';

// Products
export {
  getAllProducts,
  getProductBySlug,
  getProductById,
  getTrendingProducts,
  getHotProducts,
  getFeaturedProducts,
  getProductsByCategory,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductTrending,
  toggleProductFeatured,
  incrementProductViews,
  incrementProductClicks,
} from './products';

// Prices & Stores
export {
  getPricesForProduct,
  getBestPrice,
  addPrice,
  updatePrice,
  deletePrice,
  markBestDeal,
  bulkUpdatePrices,
  getAllStores,
  addStore,
  updateStore,
} from './prices';

// Reviews
export {
  getReviews,
  getAverageRating,
  getRatingDistribution,
  addReview,
  updateReview,
  deleteReview,
  markReviewHelpful,
  getUserReviews,
} from './reviews';

// Blog
export {
  getPublishedPosts,
  getBlogBySlug,
  getBlogById,
  getPostsByCategory,
  getUserPosts,
  getFeaturedPosts,
  searchPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  likeBlogPost,
  approveBlogPost,
  getPendingPosts,
  incrementBlogViews,
  getComments,
  addComment,
  deleteComment,
} from './blog';

// Deals
export {
  getApprovedDeals,
  getActiveDeals,
  getDealById,
  submitDeal,
  updateDeal,
  deleteDeal,
  upvoteDeal,
  approveDeal,
  getPendingDeals,
  getUserDeals,
  getDealsByStore,
} from './deals';

// Analytics
export {
  trackEvent,
  trackPageView,
  trackProductClick,
  trackAffiliateClick,
  trackSearch,
  trackAddToCart,
  getEventCounts,
  getTopClickedProducts,
  getTopSearches,
} from './analytics';

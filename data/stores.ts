// ==========================================
// Afflosaur - Store Configuration
// List of supported affiliate stores
// ==========================================

export interface Store {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  affiliateBaseUrl: string;
}

export const stores: Store[] = [
  {
    id: 'all',
    name: 'All Stores',
    icon: '🛍️',
    color: 'text-gray-500',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    affiliateBaseUrl: '',
  },
  {
    id: 'amazon',
    name: 'Amazon',
    icon: '📦',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    affiliateBaseUrl: 'https://www.amazon.in/s?k=',
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    icon: '🛒',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    affiliateBaseUrl: 'https://www.flipkart.com/search?q=',
  },
  {
    id: 'meesho',
    name: 'Meesho',
    icon: '🎀',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20',
    affiliateBaseUrl: 'https://www.meesho.com/search?q=',
  },
  {
    id: 'nykaa',
    name: 'Nykaa',
    icon: '💄',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50 dark:bg-rose-900/20',
    affiliateBaseUrl: 'https://www.nykaa.com/search?q=',
  },
  {
    id: 'ajio',
    name: 'Ajio',
    icon: '👟',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    affiliateBaseUrl: 'https://www.ajio.com/search/?text=',
  },
  {
    id: 'afflosaur',
    name: 'Afflosaur',
    icon: '🦕',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    affiliateBaseUrl: '',
  },
];

// Trending search terms for suggestions
export const trendingSearches = [
  'wireless earbuds',
  'smartwatch under 2000',
  'laptop stand',
  'phone case',
  'power bank 20000mah',
  'bluetooth speaker',
  'ring light',
  'oversized tshirt',
  'yoga mat',
  'prayagraj local',
];

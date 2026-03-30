// ==========================================
// DealDino - Utility Helpers
// Reusable functions used across the app
// ==========================================

/**
 * Format a number as Indian Rupee price
 * Example: formatPriceINR(1499) → "₹1,499"
 */
export function formatPriceINR(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Generate a URL-friendly slug from a string
 * Example: generateSlug("Top 10 Budget Phones!") → "top-10-budget-phones"
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')     // Remove special characters
    .replace(/[\s_]+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-')          // Remove consecutive hyphens
    .replace(/^-+|-+$/g, '');     // Remove leading/trailing hyphens
}

/**
 * Calculate trending score based on views and clicks
 * Higher score = more trending
 * Formula: (views * 1) + (clicks * 3) + recency bonus
 */
export function calculateTrendingScore(
  views: number,
  clicks: number,
  createdAt: string
): number {
  const ageInDays = Math.max(1, (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24));
  const recencyBonus = Math.max(0, 100 - ageInDays * 2); // Newer items get bonus
  return (views * 1) + (clicks * 3) + recencyBonus;
}

/**
 * Calculate average rating from an array of ratings
 */
export function calculateAverageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((a, b) => a + b, 0);
  return Math.round((sum / ratings.length) * 10) / 10; // Round to 1 decimal
}

/**
 * Format a date string to a human-readable format
 * Example: formatDate("2024-02-14") → "Feb 14, 2024"
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format relative time
 * Example: timeAgo("2024-02-14") → "3 days ago"
 */
export function timeAgo(dateString: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);

  const intervals: [number, string][] = [
    [31536000, 'year'],
    [2592000, 'month'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
  ];

  for (const [interval, label] of intervals) {
    const count = Math.floor(seconds / interval);
    if (count >= 1) {
      return `${count} ${label}${count > 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
}

/**
 * Truncate text to a maximum length with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Sanitize user input to prevent XSS
 * Strips HTML tags and escapes special characters
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Debounce a function call
 * Useful for search inputs - waits until user stops typing
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Generate excerpt from markdown content
 * Strips markdown syntax and returns plain text
 */
export function generateExcerpt(markdown: string, maxLength = 150): string {
  const plainText = markdown
    .replace(/#{1,6}\s/g, '')       // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1')     // Remove italic
    .replace(/- /g, '')              // Remove list markers
    .replace(/\n+/g, ' ')           // Replace newlines with spaces
    .trim();
  return truncate(plainText, maxLength);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate a random color for avatars
 */
export function getAvatarColor(name: string): string {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
  ];
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(originalPrice: number, currentPrice: number): number {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

/**
 * Format large numbers with K/M suffix
 * Example: formatCount(12400) → "12.4K"
 */
export function formatCount(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

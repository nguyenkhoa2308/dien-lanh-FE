/**
 * Format number to Vietnamese currency format
 */
export function formatPrice(price: number | string): string {
  const priceNum = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('vi-VN').format(priceNum) + '₫';
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(price: string, compareAtPrice: string | null): number {
  if (!compareAtPrice) return 0;

  const priceNum = parseFloat(price);
  const compareNum = parseFloat(compareAtPrice);

  if (compareNum === 0) return 0;

  return Math.round(((compareNum - priceNum) / compareNum) * 100);
}

/**
 * Format number with dot separator
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('vi-VN').format(num);
}

/**
 * Generate star rating display
 */
export function getStarRating(rating: number): { full: number; half: boolean; empty: number } {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return { full, half, empty };
}

/**
 * Combine class names conditionally
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Parse price range string to min/max values
 */
export function parsePriceRange(range: string): { min: number; max: number } {
  const [min, max] = range.split('-').map(Number);
  return { min, max };
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Generate consistent fake product stats based on product ID
 * Uses simple hash to ensure same product always gets same values
 */
export function generateProductStats(productId: string): { rating: number; soldCount: number; soldDisplay: string } {
  // Simple hash function to get consistent number from string
  let hash = 0;
  for (let i = 0; i < productId.length; i++) {
    const char = productId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  hash = Math.abs(hash);

  // Generate rating between 4.0 and 5.0 (one decimal place)
  const rating = 4.0 + ((hash % 11) / 10); // 4.0, 4.1, 4.2, ... 5.0

  // Generate sold count between 0 and 1000
  const soldCount = (hash >> 4) % 1001; // 0 to 1000

  // Format sold display
  const soldDisplay = soldCount >= 1000 ? '1k' : soldCount.toString();

  return { rating, soldCount, soldDisplay };
}

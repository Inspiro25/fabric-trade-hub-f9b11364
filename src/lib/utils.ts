
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a currency into a string with the format "$0.00"
 */
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

/**
 * Format price with configurable options
 */
export function formatPrice(price: number | string, opts: { currency?: string; notation?: Intl.NumberFormatOptions['notation'] } = {}) {
  const { currency = 'INR', notation = 'standard' } = opts;
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    notation,
    minimumFractionDigits: 0,
  }).format(typeof price === 'string' ? parseFloat(price) : price);
}

/**
 * Format a date into a string with the format "MMM DD, YYYY"
 */
export function formatDate(date: Date | string): string {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Convert category name to URL slug
 */
export function categoryToSlug(category: string): string {
  return category.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Convert URL slug back to category name
 */
export function slugToCategory(slug: string): string {
  return slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

/**
 * Truncate long text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

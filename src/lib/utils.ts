import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (
  value: number,
  locale = 'en-IN', // Indian locale
  currency = 'INR' // Indian Rupee
): string => {
  // Handle undefined, null or NaN
  if (value === undefined || value === null || isNaN(value)) {
    value = 0;
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
};

/**
 * Extracts initials from a name
 * @param name The name to extract initials from
 * @returns The first letter of each word in the name, maximum 2 letters
 */
export const getInitials = (name: string): string => {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .filter(char => char.length > 0)
    .slice(0, 2)
    .join('');
};

/**
 * Returns a formatted category name for display
 * @param category The category name to format
 * @returns Formatted category name
 */
export const formatCategoryName = (category: string): string => {
  if (!category) return '';
  
  // Replace hyphens and underscores with spaces
  const formatted = category.replace(/[-_]/g, ' ');
  
  // Capitalize each word
  return formatted
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Converts a category name to a slug for URLs
 * @param category The category name to convert
 * @returns URL-friendly slug
 */
export const categoryToSlug = (category: string): string => {
  if (!category) return '';
  
  return category
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
};

/**
 * Converts a slug back to a category name
 * @param slug The URL slug to convert
 * @returns Original category name format
 */
export const slugToCategory = (slug: string): string => {
  if (!slug) return '';
  
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

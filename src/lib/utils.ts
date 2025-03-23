
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number as currency
 * @param value The number to format
 * @param locale The locale to use for formatting (default: 'en-US')
 * @param currency The currency to use (default: 'USD')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: number,
  locale = 'en-US',
  currency = 'INR'
): string => {
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

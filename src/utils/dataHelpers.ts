
import { UserProfile } from '@/types/auth';

/**
 * Safely parses JSON data with proper type handling
 * @param data The data to parse
 * @param defaultValue Default value to return if parsing fails
 * @returns Parsed data with the correct type or default value
 */
export function safeParseJSON<T>(data: any, defaultValue: T): T {
  if (!data) return defaultValue;
  
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as T;
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return defaultValue;
    }
  }
  
  // If already an object, return as is but cast to the expected type
  return data as T;
}

/**
 * Safely converts Supabase preferences to UserProfile preferences format
 * @param preferences Raw preferences data from Supabase
 * @returns Properly typed preferences object
 */
export function formatPreferences(preferences: any): UserProfile['preferences'] {
  const defaultPreferences = {
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    theme: 'system',
    currency: 'USD',
    language: 'en'
  };
  
  return safeParseJSON(preferences, defaultPreferences);
}

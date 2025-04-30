
import { CartItem } from '@/contexts/CartContext';

// Calculate the total price of all items in the cart
export const getCartTotal = (cart: CartItem[]): number => {
  return cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
};

// Get the total number of items in the cart
export const getCartCount = (cart: CartItem[]): number => {
  return cart.reduce((count, item) => count + item.quantity, 0);
};

// Check if a product is already in the cart
export const isInCart = (
  cart: CartItem[],
  productId: string,
  color?: string,
  size?: string
): boolean => {
  return cart.some(
    item => 
      item.productId === productId && 
      (color === undefined || item.color === color) && 
      (size === undefined || item.size === size)
  );
};

// Format price as currency - ensure we're using the same function signature
export const formatCartPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(price);
};

// Alias for formatCartPrice to help with transition
export const formatPrice = formatCartPrice;


import { CartItem } from '@/contexts/CartContext';
import { Product } from '@/lib/products';

/**
 * Calculates the cart total
 */
export const getCartTotal = (cartItems: CartItem[]): number => {
  return cartItems.reduce(
    (total, item) => total + (item.product.salePrice || item.product.price) * item.quantity, 
    0
  );
};

/**
 * Gets the total number of items in cart
 */
export const getCartCount = (cartItems: CartItem[]): number => {
  return cartItems.reduce((count, item) => count + item.quantity, 0);
};

/**
 * Checks if a product is in the cart
 */
export const isInCart = (
  cartItems: CartItem[],
  productId: string, 
  color?: string, 
  size?: string
): boolean => {
  if (color && size) {
    return cartItems.some(
      item => item.id === productId && item.color === color && item.size === size
    );
  }
  return cartItems.some(item => item.id === productId);
};

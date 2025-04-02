import { CartItem } from '@/contexts/CartContext';

// Calculate the total price of all items in the cart
export const getCartTotal = (cartItems: CartItem[]): number => {
  return cartItems.reduce((total, item) => {
    const itemPrice = item.product.salePrice || item.product.price;
    return total + itemPrice * item.quantity;
  }, 0);
};

// Calculate the total number of items in the cart
export const getCartCount = (cartItems: CartItem[]): number => {
  return cartItems.reduce((count, item) => count + item.quantity, 0);
};

// Check if a product is already in the cart
export const isInCart = (
  cartItems: CartItem[], 
  productId: string, 
  color?: string, 
  size?: string
): boolean => {
  return cartItems.some(item => {
    // If color and size are specified, check for exact match
    if (color && size) {
      return item.product.id === productId && item.color === color && item.size === size;
    }
    // Otherwise, just check if the product is in the cart at all
    return item.product.id === productId;
  });
};

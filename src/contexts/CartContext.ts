
import { createContext, useContext } from 'react';
import { Product } from '@/lib/products/types';

// Define the CartItem type
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (item: {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    color?: string | null;
    size?: string | null;
  }) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getCartTotal: () => number;
  isInCart: (id: string) => boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Re-export the CartProvider from CartContext.tsx for backward compatibility
export { CartProvider } from './CartContext.tsx';

export default CartContext;

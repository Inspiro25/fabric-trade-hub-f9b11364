
import { createContext, useContext } from 'react';
import { Product } from '@/lib/products/types';

// Define the CartItem type
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
  price?: number;
  total?: number;
  created_at?: string;
  updated_at?: string;
}

// Define the CartContext type
export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, color: string, size: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  isInCart: (productId: string, color?: string, size?: string) => boolean;
  isLoading: boolean;
  migrateCartToUser: () => Promise<void>;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create and export the useCart hook
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Export the context and CartProvider
export { CartProvider } from './CartContext.tsx';
export default CartContext;

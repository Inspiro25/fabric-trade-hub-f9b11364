
import { createContext, useContext } from 'react';
import { Product } from '@/types/product';

// Define the CartItem type and export it
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

export default CartContext;

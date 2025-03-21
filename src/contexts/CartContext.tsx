
import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { Product } from '@/lib/products';
import { useCartStorage } from '@/hooks/use-cart-storage';
import { useCartOperations } from '@/lib/cart-operations';
import { getCartTotal, getCartCount, isInCart } from '@/lib/cart-utils';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  color: string;
  size: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, color: string, size: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  isInCart: (productId: string, color?: string, size?: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const { cartItems, setCartItems, isLoading } = useCartStorage(currentUser);
  const { addToCart, removeFromCart, updateQuantity, clearCart } = useCartOperations(cartItems, setCartItems, currentUser);

  // Wrapper functions to provide consistent API
  const getCartTotalWrapper = () => getCartTotal(cartItems);
  const getCartCountWrapper = () => getCartCount(cartItems);
  const isInCartWrapper = (productId: string, color?: string, size?: string) => isInCart(cartItems, productId, color, size);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal: getCartTotalWrapper,
    getCartCount: getCartCountWrapper,
    isInCart: isInCartWrapper
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

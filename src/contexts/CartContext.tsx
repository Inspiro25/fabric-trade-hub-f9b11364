
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { Product } from '@/lib/products';
import { useCartStorage } from '@/hooks/use-cart-storage';
import { useCartOperations } from '@/lib/cart-operations';
import { getCartTotal, getCartCount, isInCart } from '@/lib/cart-utils';
import { toast } from '@/components/ui/use-toast';

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
  isLoading: boolean;
  migrateCartToUser: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Use the cart storage hook to manage cart data
  const { cartItems, setCartItems, isLoading } = useCartStorage(currentUser);
  
  // Use the cart operations hook to handle cart actions
  const { addToCart, removeFromCart, updateQuantity, clearCart, migrateGuestCartToUser } = useCartOperations(cartItems, setCartItems, currentUser);

  // Mark initialization complete after first load
  useEffect(() => {
    if (!isLoading && !isInitialized) {
      setIsInitialized(true);
    }
  }, [isLoading, isInitialized]);

  // Migrate guest cart to user cart when user logs in
  useEffect(() => {
    const migrateCart = async () => {
      if (currentUser && isInitialized && !isLoading) {
        try {
          await migrateGuestCartToUser();
        } catch (error) {
          console.error('Failed to migrate cart:', error);
          // Use shadcn/ui toast
          toast({
            title: "Cart Error",
            description: "Failed to synchronize your cart",
            variant: "destructive",
          });
        }
      }
    };
    
    migrateCart();
  }, [currentUser, isInitialized, isLoading]);

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
    isInCart: isInCartWrapper,
    isLoading,
    migrateCartToUser: migrateGuestCartToUser
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

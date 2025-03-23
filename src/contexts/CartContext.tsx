
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { Product } from '@/lib/products';
import { useCartStorage } from '@/hooks/use-cart-storage';
import { useCartOperations } from '@/lib/cart-operations';
import { getCartTotal, getCartCount, isInCart } from '@/lib/cart-utils';
import { toast } from 'sonner';
import AuthDialog from '@/components/search/AuthDialog';

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
  const [hasPendingMigration, setHasPendingMigration] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  
  // Use the cart storage hook to manage cart data
  const { cartItems, setCartItems, isLoading } = useCartStorage(currentUser);
  
  // Use the cart operations hook to handle cart actions
  const { addToCart: addToCartOp, removeFromCart: removeFromCartOp, updateQuantity: updateQuantityOp, clearCart: clearCartOp, migrateGuestCartToUser } = useCartOperations(cartItems, setCartItems, currentUser);

  // Mark initialization complete after first load
  useEffect(() => {
    if (!isLoading && !isInitialized) {
      setIsInitialized(true);
      
      // Check if there's a guest cart to migrate
      const guestCart = localStorage.getItem('guest_cart');
      if (guestCart && currentUser) {
        try {
          const parsedCart = JSON.parse(guestCart);
          if (parsedCart && parsedCart.length > 0) {
            setHasPendingMigration(true);
          }
        } catch (e) {
          // Invalid cart data, clear it
          localStorage.removeItem('guest_cart');
        }
      }
    }
  }, [isLoading, isInitialized, currentUser]);

  // Migrate guest cart to user cart when user logs in
  useEffect(() => {
    const migrateCart = async () => {
      if (currentUser && isInitialized && !isLoading && hasPendingMigration) {
        try {
          await migrateGuestCartToUser();
          setHasPendingMigration(false);
          toast.success('Your cart has been saved to your account');
        } catch (error) {
          console.error('Failed to migrate cart:', error);
          // Silent fail - don't show error to user
          setHasPendingMigration(false);
        }
      }
    };
    
    migrateCart();
  }, [currentUser, isInitialized, isLoading, hasPendingMigration, migrateGuestCartToUser]);

  // Updated to fix the cart authentication issue - don't block operations for non-authenticated users
  const addToCart = (product: Product, quantity: number, color: string, size: string) => {
    if (!currentUser) {
      // Allow adding to cart for non-authenticated users (will be stored in localStorage)
      addToCartOp(product, quantity, color, size);
      // Just show the auth dialog but don't block the operation
      setShowAuthDialog(true);
      return;
    }
    addToCartOp(product, quantity, color, size);
  };

  const removeFromCart = (itemId: string) => {
    if (!currentUser) {
      // Allow removing from cart for non-authenticated users
      removeFromCartOp(itemId);
      setShowAuthDialog(true);
      return;
    }
    removeFromCartOp(itemId);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (!currentUser) {
      // Allow updating cart for non-authenticated users
      updateQuantityOp(itemId, quantity);
      setShowAuthDialog(true);
      return;
    }
    updateQuantityOp(itemId, quantity);
  };

  const clearCart = () => {
    if (!currentUser) {
      // Allow clearing cart for non-authenticated users
      clearCartOp();
      setShowAuthDialog(true);
      return;
    }
    clearCartOp();
  };

  const handleLogin = () => {
    // Instead of using navigate directly, we'll redirect using window.location
    window.location.href = '/auth';
  };

  // Memoize wrapped functions to prevent unnecessary re-renders
  const getCartTotalWrapper = useCallback(() => getCartTotal(cartItems), [cartItems]);
  const getCartCountWrapper = useCallback(() => getCartCount(cartItems), [cartItems]);
  const isInCartWrapper = useCallback(
    (productId: string, color?: string, size?: string) => isInCart(cartItems, productId, color, size), 
    [cartItems]
  );

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
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
  }), [
    cartItems, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotalWrapper, 
    getCartCountWrapper, 
    isInCartWrapper, 
    isLoading, 
    migrateGuestCartToUser
  ]);

  return (
    <CartContext.Provider value={value}>
      {children}
      {showAuthDialog && (
        <AuthDialog
          open={showAuthDialog}
          onOpenChange={setShowAuthDialog}
          onLogin={handleLogin}
          title="Authentication Required"
          message="You need to be logged in to manage your cart."
        />
      )}
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

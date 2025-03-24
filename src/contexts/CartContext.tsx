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
  isAddingToCart?: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasPendingMigration, setHasPendingMigration] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  
  const { cartItems, setCartItems, isLoading } = useCartStorage(currentUser);
  
  const { addToCart: addToCartOp, removeFromCart: removeFromCartOp, updateQuantity: updateQuantityOp, clearCart: clearCartOp, migrateGuestCartToUser } = useCartOperations(cartItems, setCartItems, currentUser);

  useEffect(() => {
    if (!isLoading && !isInitialized) {
      setIsInitialized(true);
      
      if (currentUser) {
        const guestCart = localStorage.getItem('guest_cart');
        if (guestCart) {
          try {
            const parsedCart = JSON.parse(guestCart);
            if (parsedCart && parsedCart.length > 0) {
              setHasPendingMigration(true);
            }
          } catch (e) {
            localStorage.removeItem('guest_cart');
          }
        }
      }
    }
  }, [isLoading, isInitialized, currentUser]);

  useEffect(() => {
    const migrateCart = async () => {
      if (currentUser && isInitialized && !isLoading && hasPendingMigration) {
        try {
          await migrateGuestCartToUser();
          setHasPendingMigration(false);
          toast.success('Your cart has been saved to your account');
        } catch (error) {
          console.error('Failed to migrate cart:', error);
          setHasPendingMigration(false);
        }
      }
    };
    
    migrateCart();
  }, [currentUser, isInitialized, isLoading, hasPendingMigration, migrateGuestCartToUser]);

  const addToCart = useCallback((product: Product, quantity: number, color: string, size: string) => {
    addToCartOp(product, quantity, color, size);
    
    if (!currentUser) {
      setShowAuthDialog(true);
    }
  }, [addToCartOp, currentUser]);

  const removeFromCart = useCallback((itemId: string) => {
    removeFromCartOp(itemId);
    
    if (!currentUser) {
      setShowAuthDialog(true);
    }
  }, [removeFromCartOp, currentUser]);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    updateQuantityOp(itemId, quantity);
  }, [updateQuantityOp]);

  const clearCart = useCallback(() => {
    clearCartOp();
    
    if (!currentUser) {
      setShowAuthDialog(true);
    }
  }, [clearCartOp, currentUser]);

  const handleLogin = useCallback(() => {
    window.location.href = '/auth';
  }, []);

  const getCartTotalWrapper = useCallback(() => getCartTotal(cartItems), [cartItems]);
  const getCartCountWrapper = useCallback(() => getCartCount(cartItems), [cartItems]);
  const isInCartWrapper = useCallback(
    (productId: string, color?: string, size?: string) => isInCart(cartItems, productId, color, size), 
    [cartItems]
  );

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
    migrateCartToUser: migrateGuestCartToUser,
    isAddingToCart: false
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
          title="Limited Functionality"
          message="Sign in to save your cart items and access more features."
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

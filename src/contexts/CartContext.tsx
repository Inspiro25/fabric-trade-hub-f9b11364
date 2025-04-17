import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { Product } from '@/lib/products/types';
import { useCartStorage } from '@/hooks/use-cart-storage';
import { useCartOperations } from '@/lib/cart-operations';
import { getCartTotal, getCartCount, isInCart } from '@/lib/cart-utils';
import { toast } from 'sonner';
import AuthDialog from '@/components/search/AuthDialog';
import { CartItem } from '@/types/cart';

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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Use the cart storage hook to manage cart data
  const { cartItems: storedCartItems, isLoading: isStorageLoading } = useCartStorage(currentUser);
  
  // Use the cart operations hook to handle cart actions
  const { addToCart: addToCartOp, removeFromCart: removeFromCartOp, updateQuantity: updateQuantityOp, clearCart: clearCartOp, migrateGuestCartToUser } = useCartOperations(cartItems, setCartItems, currentUser);

  // Update cart items when stored items change
  useEffect(() => {
    if (storedCartItems) {
      setCartItems(storedCartItems);
    }
  }, [storedCartItems]);

  // Mark initialization complete after first load
  useEffect(() => {
    if (!isStorageLoading && !isInitialized) {
      setIsInitialized(true);
      
      // Check if there's a guest cart to migrate
      if (currentUser) {
        const guestCart = localStorage.getItem('guest_cart');
        if (guestCart) {
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
    }
  }, [isStorageLoading, isInitialized, currentUser]);

  // Migrate guest cart to user cart when user logs in
  useEffect(() => {
    const migrateCart = async () => {
      if (currentUser && isInitialized && !isStorageLoading && hasPendingMigration) {
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
  }, [currentUser, isInitialized, isStorageLoading, hasPendingMigration, migrateGuestCartToUser]);

  // Allow cart operations for guests, but show auth dialog to prompt login
  const addToCart = useCallback((product: Product, quantity: number, color: string, size: string) => {
    // Allow adding to cart for all users
    addToCartOp(product, quantity, color, size);
    
    // Show auth dialog for guest users to encourage login
    if (!currentUser) {
      setShowAuthDialog(true);
    }
  }, [addToCartOp, currentUser]);

  const removeFromCart = useCallback((itemId: string) => {
    removeFromCartOp(itemId);
    
    // Show auth dialog for guest users to encourage login
    if (!currentUser) {
      setShowAuthDialog(true);
    }
  }, [removeFromCartOp, currentUser]);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    updateQuantityOp(itemId, quantity);
    
    // Don't show auth dialog for quantity updates (less intrusive)
  }, [updateQuantityOp]);

  const clearCart = useCallback(() => {
    clearCartOp();
    
    // Show auth dialog for guest users to encourage login
    if (!currentUser) {
      setShowAuthDialog(true);
    }
  }, [clearCartOp, currentUser]);

  const handleLogin = useCallback(() => {
    window.location.href = '/auth';
  }, []);

  // Memoize wrapper functions to prevent unnecessary re-renders
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
    isLoading: isStorageLoading,
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
    isStorageLoading, 
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


import React, { createContext, useState, useEffect, useContext } from 'react';
import { Product } from '@/lib/products/types';
import { CartItem as CartItemInterface } from './CartContext';

export interface CartItem extends Product {
  quantity: number;
  color?: string;
  size?: string;
  options?: Record<string, any>;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, options?: Record<string, any>) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getCartTotal: () => number;
  increaseQuantity: (itemId: string) => void;
  decreaseQuantity: (itemId: string) => void;
  isInCart: (productId: string, color?: string, size?: string) => boolean;
  isLoading?: boolean;
  cartItems?: CartItem[];
  migrateCartToUser?: () => Promise<void>;
  total?: number;
  isAdding?: boolean;
  isRemoving?: boolean;
  isUpdating?: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number = 1, options: Record<string, any> = {}) => {
    setCart((currentCart) => {
      // Check if the product is already in the cart with the same options
      const existingItemIndex = currentCart.findIndex(
        (item) => 
          item.id === product.id && 
          item.color === options.color && 
          item.size === options.size
      );

      if (existingItemIndex !== -1) {
        // If the product is already in the cart, update the quantity
        const updatedCart = [...currentCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        // If the product is not in the cart, add it
        return [
          ...currentCart,
          {
            ...product,
            quantity,
            color: options.color,
            size: options.size,
            options
          }
        ];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };
  
  const increaseQuantity = (productId: string) => {
    updateQuantity(productId, (cart.find(item => item.id === productId)?.quantity || 0) + 1);
  };
  
  const decreaseQuantity = (productId: string) => {
    const currentQuantity = cart.find(item => item.id === productId)?.quantity || 0;
    if (currentQuantity > 1) {
      updateQuantity(productId, currentQuantity - 1);
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.salePrice || item.price;
      return total + price * item.quantity;
    }, 0);
  };
  
  const isInCart = (productId: string, color?: string, size?: string) => {
    return cart.some(
      item => 
        item.id === productId && 
        (color === undefined || item.color === color) && 
        (size === undefined || item.size === size)
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartCount,
        getCartTotal,
        increaseQuantity,
        decreaseQuantity,
        isInCart,
        cartItems: cart,
        total: getCartTotal(),
        isLoading: false,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Export the useCart hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;

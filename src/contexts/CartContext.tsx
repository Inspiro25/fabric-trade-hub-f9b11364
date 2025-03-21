
import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, doc, updateDoc, getDoc, setDoc, onSnapshot } from '@/lib/firebase';
import { useAuth } from './AuthContext';
import { Product } from '@/lib/products';
import { toast } from 'sonner';

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
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const { currentUser } = useAuth();
  const [unsubscribe, setUnsubscribe] = useState<(() => void) | null>(null);

  // Fetch cart from database when user logs in
  useEffect(() => {
    const setupCart = async () => {
      if (currentUser) {
        // Unsubscribe from previous listener if it exists
        if (unsubscribe) {
          unsubscribe();
        }
        
        // Setup real-time listener to cart changes
        const cartRef = doc(db, 'carts', currentUser.uid);
        
        const listener = onSnapshot(cartRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const cartData = docSnapshot.data();
            setCartItems(cartData.items || []);
          } else {
            // If no cart in database but we have items in localStorage, save them
            if (cartItems.length > 0) {
              setDoc(cartRef, {
                userId: currentUser.uid,
                items: cartItems
              });
            } else {
              // Initialize empty cart for new users
              setDoc(cartRef, {
                userId: currentUser.uid,
                items: []
              });
            }
          }
        }, (error) => {
          console.error("Error setting up cart listener:", error);
        });
        
        setUnsubscribe(() => listener);
      } else {
        // If user logs out, use localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
        
        // Unsubscribe from any existing listener
        if (unsubscribe) {
          unsubscribe();
          setUnsubscribe(null);
        }
      }
    };
    
    setupCart();
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentUser]);

  // Save to localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const updateCartInDatabase = async (items: CartItem[]) => {
    if (!currentUser) return;
    
    try {
      await updateDoc(doc(db, 'carts', currentUser.uid), {
        items
      });
    } catch (error) {
      console.error('Error updating cart in database:', error);
    }
  };

  const addToCart = (product: Product, quantity: number, color: string, size: string) => {
    const existingItemIndex = cartItems.findIndex(
      item => item.id === product.id && item.color === color && item.size === size
    );
    
    let newCart: CartItem[];
    
    if (existingItemIndex > -1) {
      // Update quantity of existing item
      newCart = cartItems.map((item, index) => {
        if (index === existingItemIndex) {
          return { ...item, quantity: item.quantity + quantity };
        }
        return item;
      });
    } else {
      // Add new item
      newCart = [
        ...cartItems,
        { id: product.id, product, quantity, color, size }
      ];
    }
    
    setCartItems(newCart);
    updateCartInDatabase(newCart);
    
    toast.success(`Added to cart: ${product.name}`);
  };

  const removeFromCart = (itemId: string) => {
    const newCart = cartItems.filter(item => `${item.id}-${item.size}-${item.color}` !== itemId);
    setCartItems(newCart);
    updateCartInDatabase(newCart);
    
    toast.success('Item removed from cart');
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    
    const [productId, size, color] = itemId.split('-');
    
    const newCart = cartItems.map(item => {
      if (item.id === productId && item.size === size && item.color === color) {
        return { ...item, quantity };
      }
      return item;
    });
    
    setCartItems(newCart);
    updateCartInDatabase(newCart);
  };

  const clearCart = () => {
    setCartItems([]);
    updateCartInDatabase([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + (item.product.salePrice || item.product.price) * item.quantity, 
      0
    );
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const isInCart = (productId: string, color?: string, size?: string) => {
    if (color && size) {
      return cartItems.some(
        item => item.id === productId && item.color === color && item.size === size
      );
    }
    return cartItems.some(item => item.id === productId);
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      getCartTotal, 
      getCartCount,
      isInCart
    }}>
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


import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Product } from '@/lib/products';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();

  // Fetch cart from database when user logs in or out
  useEffect(() => {
    const fetchCartItems = async () => {
      setIsLoading(true);
      
      try {
        if (currentUser) {
          // If user is logged in, get cart from Supabase
          const { data, error } = await supabase
            .from('cart_items')
            .select(`
              id,
              product_id,
              quantity,
              color,
              size
            `)
            .eq('user_id', currentUser.uid);

          if (error) {
            throw error;
          }

          if (data) {
            // Fetch full product details for each cart item
            const cartWithProducts = await Promise.all(
              data.map(async (item) => {
                const { data: productData } = await supabase
                  .from('products')
                  .select('*')
                  .eq('id', item.product_id)
                  .single();

                return {
                  id: item.product_id,
                  product: productData as Product,
                  quantity: item.quantity,
                  color: item.color,
                  size: item.size
                };
              })
            );

            setCartItems(cartWithProducts);
          }
        } else {
          // If user is not logged in, use localStorage
          const savedCart = localStorage.getItem('cart');
          if (savedCart) {
            setCartItems(JSON.parse(savedCart));
          } else {
            setCartItems([]);
          }
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast.error('Failed to load your cart');
        
        // Fallback to localStorage if there's an error
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, [currentUser]);

  // Save to localStorage whenever cartItems changes if user is not logged in
  useEffect(() => {
    if (!currentUser && !isLoading) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, currentUser, isLoading]);

  // Add item to cart
  const addToCart = async (product: Product, quantity: number, color: string, size: string) => {
    try {
      const existingItemIndex = cartItems.findIndex(
        item => item.id === product.id && item.color === color && item.size === size
      );
      
      let newCart: CartItem[];
      let newQuantity = quantity;
      
      if (existingItemIndex > -1) {
        // Update quantity of existing item
        newQuantity = cartItems[existingItemIndex].quantity + quantity;
        newCart = cartItems.map((item, index) => {
          if (index === existingItemIndex) {
            return { ...item, quantity: newQuantity };
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
      
      if (currentUser) {
        // Save to Supabase
        const cartItemId = `${product.id}-${size}-${color}`;
        
        // Using upsert to either insert new or update existing
        const { error } = await supabase
          .from('cart_items')
          .upsert({
            user_id: currentUser.uid,
            product_id: product.id,
            quantity: newQuantity,
            color,
            size
          }, {
            onConflict: 'user_id, product_id, color, size'
          });

        if (error) throw error;
      }
      
      setCartItems(newCart);
      toast.success(`Added to cart: ${product.name}`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId: string) => {
    try {
      const [productId, size, color] = itemId.split('-');
      
      const newCart = cartItems.filter(item => 
        `${item.id}-${item.size}-${item.color}` !== itemId
      );
      
      if (currentUser) {
        // Remove from Supabase
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', currentUser.uid)
          .eq('product_id', productId)
          .eq('size', size)
          .eq('color', color);

        if (error) throw error;
      }
      
      setCartItems(newCart);
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    
    try {
      const [productId, size, color] = itemId.split('-');
      
      const newCart = cartItems.map(item => {
        if (item.id === productId && item.size === size && item.color === color) {
          return { ...item, quantity };
        }
        return item;
      });
      
      if (currentUser) {
        // Update in Supabase
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('user_id', currentUser.uid)
          .eq('product_id', productId)
          .eq('size', size)
          .eq('color', color);

        if (error) throw error;
      }
      
      setCartItems(newCart);
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update item quantity');
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      if (currentUser) {
        // Clear from Supabase
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', currentUser.uid);

        if (error) throw error;
      }
      
      setCartItems([]);
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  // Calculate cart total
  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + (item.product.salePrice || item.product.price) * item.quantity, 
      0
    );
  };

  // Get total number of items in cart
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  // Check if product is in cart
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

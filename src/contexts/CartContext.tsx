
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Product } from '@/lib/products';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  fetchUserCart, 
  upsertCartItem, 
  removeCartItem, 
  clearUserCart, 
  updateCartItemQuantity 
} from '@/lib/supabase/cart';

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
          const cartData = await fetchUserCart(currentUser.uid);

          if (cartData.length > 0) {
            // Fetch full product details for each cart item
            const cartWithProducts = await Promise.all(
              cartData.map(async (item) => {
                const { data: productData } = await supabase
                  .from('products')
                  .select('*')
                  .eq('id', item.product_id)
                  .single();

                // Convert Supabase product data format to our Product type
                const product: Product = {
                  id: productData.id,
                  name: productData.name,
                  description: productData.description || '',
                  price: productData.price,
                  salePrice: productData.sale_price,
                  images: productData.images || [],
                  category: productData.category_id || '',
                  colors: productData.colors || [],
                  sizes: productData.sizes || [],
                  isNew: productData.is_new || false,
                  isTrending: productData.is_trending || false,
                  rating: productData.rating || 0,
                  reviewCount: productData.review_count || 0,
                  stock: productData.stock || 0,
                  tags: productData.tags || [],
                  shopId: productData.shop_id || '',
                };

                return {
                  id: item.product_id,
                  product,
                  quantity: item.quantity,
                  color: item.color,
                  size: item.size
                };
              })
            );

            setCartItems(cartWithProducts);
          } else {
            setCartItems([]);
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
        // Save to Supabase using the helper function
        await upsertCartItem({
          user_id: currentUser.uid,
          product_id: product.id,
          quantity: newQuantity,
          color,
          size
        });
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
        // Remove from Supabase using the helper function
        await removeCartItem(currentUser.uid, productId, size, color);
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
        // Update in Supabase using the helper function
        await updateCartItemQuantity(currentUser.uid, productId, size, color, quantity);
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
        // Clear from Supabase using the helper function
        await clearUserCart(currentUser.uid);
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

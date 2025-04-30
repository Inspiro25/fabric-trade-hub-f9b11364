import React, { createContext, useContext } from 'react';
import { Product } from '@/lib/products/types';
import useCartStorage from '@/hooks/use-cart-storage';
import { toast } from 'sonner';

// Define the CartItem type
export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  name: string;
  image: string;
  price: number;
  stock: number;
  shopId?: string;
  total: number;
  size?: string;
  color?: string;
  selectedOptions?: Array<{
    name: string;
    value: string;
  }>;
}

// Define the CartContextType
export interface CartContextType {
  cart: CartItem[];
  cartItems: CartItem[];
  addToCart: (productId: string, productName: string, productImage: string, price: number, stock: number, shopId: string, salePrice: number | null) => void;
  removeFromCart: (itemId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getCartCount: () => number;
  getTotalPrice: () => number;
  getCartTotal: () => number;
  total: number;
  isLoading?: boolean;
  isAdding?: boolean;
  isRemoving?: boolean;
  isUpdating?: boolean;
  migrateCartToUser: () => Promise<void>;
}

// Create context with a default value
const CartContext = createContext<CartContextType>({
  cart: [],
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  increaseQuantity: () => {},
  decreaseQuantity: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getItemCount: () => 0,
  getCartCount: () => 0,
  getTotalPrice: () => 0,
  getCartTotal: () => 0,
  total: 0,
  migrateCartToUser: async () => {},
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    cart,
    addToCart: addToCartStorage,
    removeFromCart: removeFromCartStorage,
    increaseQuantity: increaseQuantityStorage,
    decreaseQuantity: decreaseQuantityStorage,
    clearCart: clearCartStorage,
    getItemCount,
    getTotalPrice,
  } = useCartStorage();

  // Wrapper function for addToCart that shows a toast
  const addToCart = (productId: string, productName: string, productImage: string, price: number, stock: number, shopId: string, salePrice: number | null) => {
    if (stock <= 0) {
      toast.error('Sorry, this product is out of stock');
      return;
    }

    addToCartStorage(productId, productName, productImage, price, stock, shopId, salePrice);
    toast.success(`${productName} added to cart`);
  };

  // Wrapper function for removeFromCart
  const removeFromCart = (productId: string) => {
    removeFromCartStorage(productId);
    toast.success('Product removed from cart');
  };

  // Other wrapper functions
  const increaseQuantity = (productId: string) => {
    increaseQuantityStorage(productId);
  };

  const decreaseQuantity = (productId: string) => {
    decreaseQuantityStorage(productId);
  };

  const clearCart = () => {
    clearCartStorage();
    toast.success('Cart cleared');
  };

  // Alias functions to ensure consistency across the app
  const getCartCount = getItemCount;
  const getCartTotal = getTotalPrice;
  
  // Map cart items to expected CartItem format
  const cartItems = cart.map(item => ({
    id: item.productId,
    productId: item.productId,
    quantity: item.quantity,
    name: item.productName,
    image: item.productImage || item.thumbnailUrl,
    price: item.price,
    stock: item.stock,
    shopId: item.shopId,
    total: item.price * item.quantity,
    size: '',
    color: ''
  }));
  
  // Compute the total for direct access
  const total = getTotalPrice();

  // Create the context value
  const contextValue: CartContextType = {
    cart,
    cartItems,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    updateQuantity: (itemId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(itemId);
      } else {
        const item = cart.find(i => i.productId === itemId);
        if (item && quantity <= item.stock) {
          if (quantity > item.quantity) {
            increaseQuantity(itemId);
          } else {
            decreaseQuantity(itemId);
          }
        }
      }
    },
    clearCart,
    getItemCount,
    getCartCount,
    getTotalPrice,
    getCartTotal,
    total,
    isLoading: false,
    isAdding: false,
    isRemoving: false,
    isUpdating: false,
    migrateCartToUser: async () => { /* This is a placeholder function */ }
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;

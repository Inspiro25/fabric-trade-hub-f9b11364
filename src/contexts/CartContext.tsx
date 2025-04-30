import React, { createContext, useContext } from 'react';
import { Product } from '@/lib/products/types';
import useCartStorage from '@/hooks/use-cart-storage';
import { toast } from 'sonner';

// Define the CartItem type
export interface CartItem {
  productId: string;
  quantity: number;
  productName: string;
  productImage: string;
  thumbnailUrl: string;
  price: number;
  stock: number;
  shopId: string;
  salePrice: number | null;
}

// Define the CartContextType
export interface CartContextType {
  cart: CartItem[];
  addToCart: (productId: string, productName: string, productImage: string, price: number, stock: number, shopId: string, salePrice: number | null) => void;
  removeFromCart: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotalPrice: () => number;
}

// Create context with a default value
const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  increaseQuantity: () => {},
  decreaseQuantity: () => {},
  clearCart: () => {},
  getItemCount: () => 0,
  getTotalPrice: () => 0,
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

  // Create the context value
  const contextValue: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    getItemCount,
    getTotalPrice,
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);

export default CartContext;

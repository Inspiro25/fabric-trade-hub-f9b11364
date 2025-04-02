
import { useContext } from 'react';
import { CartContext } from '@/contexts/CartContext';
import { Product } from '@/lib/products/types';
import { toast } from 'sonner';

export const useCart = () => {
  const cartContext = useContext(CartContext);
  
  if (!cartContext) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  const addToCart = (product: Product, quantity = 1, color = product.colors?.[0] || '', size = product.sizes?.[0] || '') => {
    cartContext.addToCart(product, quantity, color, size);
    toast.success(`${product.name} added to cart`);
  };
  
  const removeFromCart = (itemId: string) => {
    cartContext.removeFromCart(itemId);
    toast.info('Item removed from cart');
  };
  
  const updateCartQuantity = (itemId: string, quantity: number) => {
    cartContext.updateQuantity(itemId, quantity);
  };
  
  const isInCart = (productId: string, color?: string, size?: string) => {
    return cartContext.isInCart(productId, color, size);
  };
  
  return {
    ...cartContext,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    isInCart,
  };
};

export default useCart;

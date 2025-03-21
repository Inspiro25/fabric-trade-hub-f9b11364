
import { CartItem } from '@/contexts/CartContext';
import { Product } from '@/lib/products';
import { toast } from 'sonner';
import { 
  upsertCartItem, 
  removeCartItem, 
  clearUserCart, 
  updateCartItemQuantity 
} from '@/lib/supabase/cart';

/**
 * Provides all cart manipulation operations
 */
export const useCartOperations = (
  cartItems: CartItem[], 
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>, 
  currentUser: any | null
) => {
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

  return {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };
};

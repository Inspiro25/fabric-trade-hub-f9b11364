
import { CartItem } from '@/contexts/CartContext';
import { Product } from '@/lib/products';
import { toast } from 'sonner';
import { 
  upsertCartItem, 
  removeCartItem, 
  clearUserCart, 
  updateCartItemQuantity 
} from '@/lib/supabase/cart';

const STORAGE_KEY = 'guest_cart';

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
        // Save to Supabase or Firebase
        await upsertCartItem({
          user_id: currentUser.uid,
          product_id: product.id,
          quantity: newQuantity,
          color,
          size
        });
      } else {
        // Save to localStorage for guest users
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newCart));
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
        // Remove from database
        await removeCartItem(currentUser.uid, productId, size, color);
      } else {
        // Update localStorage for guest users
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newCart));
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
        // Update in database
        await updateCartItemQuantity(currentUser.uid, productId, size, color, quantity);
      } else {
        // Update localStorage for guest users
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newCart));
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
        // Clear from database
        await clearUserCart(currentUser.uid);
      }
      
      // Clear from localStorage in either case
      localStorage.removeItem(STORAGE_KEY);
      
      setCartItems([]);
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  // Migrate guest cart to user cart
  const migrateGuestCartToUser = async () => {
    // Check if we have a guest cart to migrate
    const guestCart = localStorage.getItem(STORAGE_KEY);
    
    if (!currentUser || !guestCart) {
      return;
    }
    
    try {
      const guestCartItems = JSON.parse(guestCart) as CartItem[];
      
      if (guestCartItems.length === 0) {
        return;
      }
      
      // For each item in the guest cart, add it to the user's cart in database
      for (const item of guestCartItems) {
        await upsertCartItem({
          user_id: currentUser.uid,
          product_id: item.id,
          quantity: item.quantity,
          color: item.color,
          size: item.size
        });
      }
      
      // Clear the guest cart
      localStorage.removeItem(STORAGE_KEY);
      
      // Toast notification
      toast.success('Your cart has been synchronized with your account');
    } catch (error) {
      console.error('Error migrating cart:', error);
      toast.error('Failed to synchronize your cart');
    }
  };

  return {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    migrateGuestCartToUser
  };
};

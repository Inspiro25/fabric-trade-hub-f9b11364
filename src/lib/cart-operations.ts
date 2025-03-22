
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
      // Find existing item with same product, color, and size
      const existingItemIndex = cartItems.findIndex(
        item => item.product.id === product.id && item.color === color && item.size === size
      );
      
      let newCart: CartItem[];
      let newQuantity = quantity;
      
      if (existingItemIndex > -1) {
        // Update quantity of existing item
        newQuantity = cartItems[existingItemIndex].quantity + quantity;
        newCart = [...cartItems]; // Create a new array to avoid direct mutation
        newCart[existingItemIndex] = { 
          ...newCart[existingItemIndex], 
          quantity: newQuantity 
        };
      } else {
        // Add new item
        newCart = [
          ...cartItems,
          { id: product.id, product, quantity, color, size }
        ];
      }
      
      // Set cart state immediately to improve UX
      setCartItems(newCart);
      
      // Then persist to storage (async operation)
      if (currentUser) {
        // Save to Supabase
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
      
      // Use sonner toast
      toast.success(`Added ${product.name} to cart`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error("Failed to add item to cart");
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId: string) => {
    try {
      // Parse the composite ID to get product_id, size, and color
      const parts = itemId.split('-');
      const productId = parts[0];
      let size = '', color = '';
      
      if (parts.length > 1) {
        size = parts[1] || '';
        color = parts.length > 2 ? parts[2] : '';
      }
      
      // Optimistically update UI
      const newCart = cartItems.filter(item => 
        `${item.product.id}-${item.size}-${item.color}` !== itemId
      );
      
      // Update state immediately
      setCartItems(newCart);
      
      // Then persist changes
      if (currentUser) {
        // Remove from database
        await removeCartItem(currentUser.uid, productId, size, color);
      } else {
        // Update localStorage for guest users
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newCart));
      }
      
      toast.success("Item removed from cart");
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error("Failed to remove item from cart");
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    
    try {
      const [productId, size, color] = itemId.split('-');
      
      // Optimistically update UI
      const newCart = cartItems.map(item => {
        if (item.id === productId && item.size === size && item.color === color) {
          return { ...item, quantity };
        }
        return item;
      });
      
      // Update state immediately
      setCartItems(newCart);
      
      // Then persist changes
      if (currentUser) {
        // Update in database
        await updateCartItemQuantity(currentUser.uid, productId, size, color, quantity);
      } else {
        // Update localStorage for guest users
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newCart));
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      // Silent error, no toast for quantity updates
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      // Update state immediately
      setCartItems([]);
      
      // Then persist changes
      if (currentUser) {
        // Clear from database
        await clearUserCart(currentUser.uid);
      }
      
      // Clear from localStorage in either case
      localStorage.removeItem(STORAGE_KEY);
      
      toast.success("All items have been removed");
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error("Failed to clear cart");
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
    } catch (error) {
      console.error('Error migrating cart:', error);
      throw error; // Let the caller handle the error
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

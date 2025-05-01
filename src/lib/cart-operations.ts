
import { toast } from 'sonner';
import { CartItem } from '@/types/cart';
import { Product } from '@/lib/products/types';
import { useCart } from '@/contexts/CartContext';
import { 
  addCartItem,
  clearCart as clearCartService,
  fetchUserCart, 
  upsertCartItem,
  removeCartItem
} from '@/services/cartService';

// Function to add a product to the cart
export const addToCart = async (
  userId: string | undefined,
  product: Product,
  quantity: number = 1,
  color?: string,
  size?: string
): Promise<boolean> => {
  try {
    if (!userId) {
      // Handle guest user case - use local storage
      const cartItem: CartItem = {
        id: `guest-${Date.now()}`,
        productId: product.id,
        name: product.name,
        price: product.salePrice || product.price,
        image: product.images[0] || '/placeholder.png',
        quantity,
        color,
        size,
        stock: product.stock,
        total: (product.salePrice || product.price) * quantity
      };
      
      // Use the CartContext to update local storage
      const { addToCart } = useCart();
      addToCart(cartItem);
      
      toast.success('Added to cart');
      return true;
    }
    
    // If logged in, use the service to add to the database
    const success = await addCartItem(
      userId,
      product.id,
      quantity,
      product.salePrice || product.price,
      color,
      size
    );
    
    if (success) {
      return true;
    }
    
    throw new Error('Failed to add to cart');
  } catch (error) {
    console.error('Error adding to cart:', error);
    toast.error('Failed to add to cart');
    return false;
  }
};

// Function to clear the cart
export const clearUserCart = async (userId: string | undefined): Promise<boolean> => {
  try {
    if (!userId) {
      // Handle guest user case - clear local storage
      const { clearCart } = useCart();
      clearCart();
      toast.success('Cart cleared');
      return true;
    }
    
    // If logged in, use the service to clear the database
    const success = await clearCartService(userId);
    
    if (success) {
      toast.success('Cart cleared');
      return true;
    }
    
    throw new Error('Failed to clear cart');
  } catch (error) {
    console.error('Error clearing cart:', error);
    toast.error('Failed to clear cart');
    return false;
  }
};

// Function to fetch the cart items
export const fetchCart = async (userId: string | undefined): Promise<CartItem[]> => {
  try {
    if (!userId) {
      // Handle guest user case - get from local storage
      const { cartItems } = useCart();
      return cartItems;
    }
    
    // If logged in, use the service to fetch from the database
    const cartItems = await fetchUserCart(userId);
    return cartItems;
  } catch (error) {
    console.error('Error fetching cart:', error);
    toast.error('Failed to fetch cart');
    return [];
  }
};

// Function to update the quantity of a cart item
export const updateCartItemQuantity = async (
  userId: string | undefined,
  itemId: string,
  quantity: number
): Promise<boolean> => {
  try {
    if (!userId) {
      // Handle guest user case - update local storage
      const { updateQuantity } = useCart();
      updateQuantity(itemId, quantity);
      toast.success('Cart updated');
      return true;
    }
    
    // If logged in, use the service to update the database
    const success = await upsertCartItem(userId, itemId, quantity);
    
    if (success) {
      toast.success('Cart updated');
      return true;
    }
    
    throw new Error('Failed to update cart');
  } catch (error) {
    console.error('Error updating cart:', error);
    toast.error('Failed to update cart');
    return false;
  }
};

// Function to remove an item from the cart
export const removeFromCart = async (
  userId: string | undefined,
  itemId: string
): Promise<boolean> => {
  try {
    if (!userId) {
      // Handle guest user case - remove from local storage
      const { removeFromCart } = useCart();
      removeFromCart(itemId);
      toast.success('Item removed from cart');
      return true;
    }
    
    // If logged in, use the service to remove from the database
    const success = await removeCartItem(userId, itemId);
    
    if (success) {
      toast.success('Item removed from cart');
      return true;
    }
    
    throw new Error('Failed to remove item from cart');
  } catch (error) {
    console.error('Error removing from cart:', error);
    toast.error('Failed to remove item from cart');
    return false;
  }
};

import { CartItem } from "@/types/cart";
import { Product } from "@/lib/types/product";
import { useState, useCallback } from "react";
import { 
  fetchUserCart, 
  upsertCartItem, 
  removeCartItem as removeCartItemService, 
  updateCartItemQuantity as updateCartItemService,
  clearUserCart
} from "@/services/cartService";

// Add a product to the cart with the given quantity
export const addToCart = (product: Product, quantity: number = 1): CartItem => {
  if (!product) {
    throw new Error("Cannot add undefined product to cart");
  }
  
  // Construct the cart item from the product
  const cartItem: CartItem = {
    id: product.id,
    productId: product.id,
    quantity: quantity,
    name: product.name,
    image: product.images?.[0] || "",
    price: product.price,
    stock: product.stock || 10,
    shopId: product.shop_id,
    total: product.price * quantity,
    selectedOptions: []
  };
  
  return cartItem;
};

// Update an existing cart item's quantity
export const updateCartItemQuantity = (
  cartItem: CartItem,
  quantity: number
): CartItem => {
  if (!cartItem) {
    throw new Error("Cannot update undefined cart item");
  }
  
  if (quantity < 1) {
    throw new Error("Quantity must be at least 1");
  }
  
  if (cartItem.stock && quantity > cartItem.stock) {
    throw new Error(`Only ${cartItem.stock} items available`);
  }
  
  // Create a new cart item with the updated quantity
  return {
    ...cartItem,
    quantity: quantity,
    total: cartItem.price * quantity
  };
};

// Calculate the total price of all items in the cart
export const calculateCartTotal = (cartItems: CartItem[]): number => {
  return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Calculate the number of items in the cart
export const calculateCartItemCount = (cartItems: CartItem[]): number => {
  return cartItems.reduce((count, item) => count + item.quantity, 0);
};

// Group cart items by shop
export const groupCartItemsByShop = (
  cartItems: CartItem[]
): Record<string, CartItem[]> => {
  return cartItems.reduce((shops, item) => {
    const shopId = item.shopId || "unknown";
    
    if (!shops[shopId]) {
      shops[shopId] = [];
    }
    
    shops[shopId].push(item);
    return shops;
  }, {} as Record<string, CartItem[]>);
};

// Calculate shipping cost - this is a placeholder implementation
export const calculateShippingCost = (
  cartItems: CartItem[],
  distance: number = 5
): number => {
  const baseShippingCost = 5;
  const itemCount = calculateCartItemCount(cartItems);
  const distanceFactor = Math.max(1, distance / 5);
  
  return baseShippingCost + (itemCount * 0.5) * distanceFactor;
};

// Validate that all items in the cart are available in the required quantity
export const validateCartItems = (
  cartItems: CartItem[],
  availableProducts: Product[]
): { valid: boolean; invalidItems: CartItem[] } => {
  const invalidItems: CartItem[] = [];
  
  for (const item of cartItems) {
    const product = availableProducts.find(p => p.id === item.productId);
    
    // If the product doesn't exist or is out of stock
    if (!product || product.stock === 0) {
      invalidItems.push(item);
      continue;
    }
    
    // If requested quantity is greater than available stock
    if (product.stock && item.quantity > product.stock) {
      invalidItems.push({
        ...item,
        quantity: product.stock // Suggest the available quantity
      });
    }
  }
  
  return {
    valid: invalidItems.length === 0,
    invalidItems
  };
};

// Format the cart total price as currency
export const formatCartTotal = (
  total: number,
  currency: string = "INR"
): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency
  }).format(total);
};

// Serialize cart for storage
export const serializeCart = (cartItems: CartItem[]): string => {
  return JSON.stringify(cartItems);
};

// Deserialize cart from storage
export const deserializeCart = (serialized: string): CartItem[] => {
  try {
    return JSON.parse(serialized);
  } catch (error) {
    console.error("Failed to parse cart", error);
    return [];
  }
};

// Add the missing useCartOperations hook
export const useCartOperations = (
  cartItems: CartItem[], 
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>,
  currentUser: any
) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Add item to cart
  const addToCart = useCallback(async (product: Product, quantity: number = 1, color: string = '', size: string = '') => {
    if (!product) return;
    setIsAdding(true);
    
    try {
      // Create new cart item
      const newItem: CartItem = {
        id: `${product.id}-${color}-${size}`, // Create unique ID
        productId: product.id,
        quantity,
        color,
        size,
        name: product.name,
        image: product.images?.[0] || '',
        price: product.price,
        stock: product.stock || 10,
        shopId: product.shop_id,
        total: product.price * quantity,
        selectedOptions: []
      };
      
      // If user is logged in, save to database
      if (currentUser?.id) {
        await upsertCartItem({
          user_id: currentUser.id,
          product_id: product.id,
          quantity,
          color,
          size
        });
      }
      
      // Update local state
      setCartItems(prev => {
        // Check if item already exists
        const existingItemIndex = prev.findIndex(item => 
          item.productId === product.id && 
          item.color === color && 
          item.size === size
        );
        
        if (existingItemIndex >= 0) {
          // Update existing item
          const updatedItems = [...prev];
          updatedItems[existingItemIndex].quantity += quantity;
          updatedItems[existingItemIndex].total = 
            updatedItems[existingItemIndex].price * updatedItems[existingItemIndex].quantity;
          return updatedItems;
        } else {
          // Add new item
          return [...prev, newItem];
        }
      });
      
      // Save guest cart to localStorage
      if (!currentUser?.id) {
        localStorage.setItem('guest_cart', serializeCart(cartItems));
      }
      
      return true;
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      return false;
    } finally {
      setIsAdding(false);
    }
  }, [cartItems, currentUser, setCartItems]);
  
  // Remove item from cart
  const removeFromCart = useCallback(async (itemId: string) => {
    setIsRemoving(true);
    
    try {
      const itemToRemove = cartItems.find(item => item.id === itemId);
      if (!itemToRemove) return false;
      
      // If user is logged in, remove from database
      if (currentUser?.id) {
        await removeCartItemService(
          currentUser.id,
          itemToRemove.productId,
          itemToRemove.size || '',
          itemToRemove.color || ''
        );
      }
      
      // Update local state
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      
      // Save guest cart to localStorage
      if (!currentUser?.id) {
        localStorage.setItem('guest_cart', serializeCart(cartItems.filter(item => item.id !== itemId)));
      }
      
      return true;
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      return false;
    } finally {
      setIsRemoving(false);
    }
  }, [cartItems, currentUser, setCartItems]);
  
  // Update item quantity
  const updateQuantity = useCallback(async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return false;
    setIsUpdating(true);
    
    try {
      const itemToUpdate = cartItems.find(item => item.id === itemId);
      if (!itemToUpdate) return false;
      
      if (itemToUpdate.stock && newQuantity > itemToUpdate.stock) {
        console.error(`Only ${itemToUpdate.stock} items available`);
        return false;
      }
      
      // If user is logged in, update in database
      if (currentUser?.id) {
        await updateCartItemService(
          currentUser.id,
          itemToUpdate.productId,
          itemToUpdate.size || '',
          itemToUpdate.color || '',
          newQuantity
        );
      }
      
      // Update local state
      setCartItems(prev => prev.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: newQuantity,
            total: item.price * newQuantity
          };
        }
        return item;
      }));
      
      // Save guest cart to localStorage
      if (!currentUser?.id) {
        const updatedItems = cartItems.map(item => {
          if (item.id === itemId) {
            return {
              ...item,
              quantity: newQuantity,
              total: item.price * newQuantity
            };
          }
          return item;
        });
        localStorage.setItem('guest_cart', serializeCart(updatedItems));
      }
      
      return true;
    } catch (error) {
      console.error('Failed to update item quantity:', error);
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [cartItems, currentUser, setCartItems]);
  
  // Clear cart
  const clearCart = useCallback(async () => {
    try {
      // If user is logged in, clear in database
      if (currentUser?.id) {
        await clearUserCart(currentUser.id);
      }
      
      // Update local state
      setCartItems([]);
      
      // Clear guest cart from localStorage
      if (!currentUser?.id) {
        localStorage.removeItem('guest_cart');
      }
      
      return true;
    } catch (error) {
      console.error('Failed to clear cart:', error);
      return false;
    }
  }, [currentUser, setCartItems]);
  
  // Migrate guest cart to user cart
  const migrateGuestCartToUser = useCallback(async () => {
    if (!currentUser?.id) return false;
    
    try {
      const guestCartStr = localStorage.getItem('guest_cart');
      if (!guestCartStr) return true;
      
      const guestCart = deserializeCart(guestCartStr);
      if (!guestCart.length) return true;
      
      // Add each guest cart item to user cart
      for (const item of guestCart) {
        await upsertCartItem({
          user_id: currentUser.id,
          product_id: item.productId,
          quantity: item.quantity,
          color: item.color || '',
          size: item.size || ''
        });
      }
      
      // Clear guest cart
      localStorage.removeItem('guest_cart');
      
      return true;
    } catch (error) {
      console.error('Failed to migrate guest cart:', error);
      return false;
    }
  }, [currentUser]);
  
  return {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    migrateGuestCartToUser,
    isAdding,
    isRemoving,
    isUpdating
  };
};

// Make sure to export the hook
export { useCartOperations };


import { createContext } from 'react';
import { Product } from '@/lib/products/types';

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
  product?: Product; // Add this for compatibility with Checkout.tsx
  selectedOptions?: Array<{
    name: string;
    value: string;
  }>;
}

// Define the CartContext type
export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, color?: string, size?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  isInCart: (productId: string, color?: string, size?: string) => boolean;
  isLoading: boolean;
  isAdding?: boolean;
  isRemoving?: boolean;
  isUpdating?: boolean;
  migrateCartToUser: () => Promise<void>;
  total: number;
  cart: CartItem[];
  increaseQuantity: (itemId: string) => void;
  decreaseQuantity: (itemId: string) => void;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Export default context
export default CartContext;

// Export the CartProvider from CartContext.tsx
export { CartProvider } from './CartContext.tsx';

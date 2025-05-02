
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
  product?: Product;
  selectedOptions?: Array<{
    name: string;
    value: string;
  }>;
}

// Define and export CartContextType
export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, options?: Record<string, any>) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getCartTotal: () => number;
  increaseQuantity: (itemId: string) => void;
  decreaseQuantity: (itemId: string) => void;
  isInCart: (productId: string, color?: string, size?: string) => boolean;
  isLoading?: boolean;
  cartItems?: CartItem[];
  migrateCartToUser?: () => Promise<void>;
  total?: number;
  isAdding?: boolean;
  isRemoving?: boolean;
  isUpdating?: boolean;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Export default context
export default CartContext;

// Export the CartProvider
export { CartProvider } from './CartContext.tsx';

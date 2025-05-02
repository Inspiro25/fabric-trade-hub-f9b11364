
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

// Export the CartContextType
export type { CartContextType } from './CartContext.tsx';

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Export default context
export default CartContext;

// Export the CartProvider
export { CartProvider } from './CartContext.tsx';

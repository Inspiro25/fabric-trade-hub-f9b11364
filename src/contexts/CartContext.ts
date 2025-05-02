
import { createContext } from 'react';
import { Product } from '@/lib/products/types';
import { CartContextType } from './CartContext.tsx';

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

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Export default context
export default CartContext;

// Export the CartProvider
export { CartProvider, CartContextType } from './CartContext.tsx';

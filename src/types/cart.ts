
import { Product } from '@/lib/products/types';

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
  selectedOptions?: Array<{
    name: string;
    value: string;
  }>;
  // Remove the product property to make it compatible with the CartContext.CartItem
}

export interface SavedItem extends CartItem {
  savedAt: string;
}

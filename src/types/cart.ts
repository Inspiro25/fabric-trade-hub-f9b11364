
import { Product } from '@/lib/products/types';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export interface SavedItem extends CartItem {
  savedAt: string;
}

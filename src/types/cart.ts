import { Product } from '@/lib/products/types';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  color: string;
  size: string;
  price: number;
  total: number;
  created_at: string;
  updated_at: string;
} 

import { useContext } from 'react';
import CartContext, { useCart as useCartFromContext } from '@/contexts/CartContext';

export function useCart() {
  return useCartFromContext();
}

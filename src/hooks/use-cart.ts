
import { useContext } from 'react';
import CartContext, { CartContextType } from '@/contexts/CartContext';

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};

// Re-export CartProvider for easier imports
export { CartProvider } from '@/contexts/CartContext';

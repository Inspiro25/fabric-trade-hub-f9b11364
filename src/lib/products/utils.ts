
import { Product } from './types';

// Helper functions for product operations
export const formatProductPrice = (product: Product): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(product.sale_price || product.price);
};

export const calculateDiscount = (product: Product): number | null => {
  if (!product.sale_price || product.sale_price >= product.price) {
    return null;
  }
  
  const discountAmount = product.price - product.sale_price;
  const discountPercent = (discountAmount / product.price) * 100;
  
  return Math.round(discountPercent);
};

export const isOnSale = (product: Product): boolean => {
  return !!product.sale_price && product.sale_price < product.price;
};

export const isInStock = (product: Product): boolean => {
  return product.stock > 0;
};

export const getProductImages = (product: Product): string[] => {
  if (!product.images || product.images.length === 0) {
    return ['/placeholder.png'];
  }
  return product.images;
};

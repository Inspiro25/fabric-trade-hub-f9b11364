
import { supabase } from '@/integrations/supabase/client';
import { Product, normalizeProductData } from '@/lib/products/types';
import { productStore } from '@/lib/types/product';

export interface DealProduct extends Product {
  discountPercentage: number;
  endTime: Date;
}

/**
 * Fetches the product with the highest discount percentage
 * Returns a product with discount percentage and deal end time
 */
export const getDealOfTheDay = async (): Promise<DealProduct | null> => {
  try {
    // Fetch products with both price and sale_price from Supabase
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .not('sale_price', 'is', null)
      .order('price', { ascending: false }) // Higher original price first for better deals
      .limit(10); // Limit to 10 products for efficiency
    
    if (error) {
      console.error('Error fetching deal products:', error);
      throw error;
    }
    
    if (!products || products.length === 0) {
      // Fallback to local data
      return getFallbackDeal();
    }
    
    // Calculate discount percentage for each product and find the best deal
    const productsWithDiscounts = products.map(product => {
      const normalizedProduct = normalizeProductData(product);
      const price = normalizedProduct.price || 0;
      const salePrice = normalizedProduct.salePrice || 0;
      const discountPercentage = price > 0 ? Math.round(((price - salePrice) / price) * 100) : 0;
      
      return {
        ...normalizedProduct,
        discountPercentage,
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // Deal ends in 24 hours
      };
    });
    
    // Sort by discount percentage (highest first)
    productsWithDiscounts.sort((a, b) => b.discountPercentage - a.discountPercentage);
    
    return productsWithDiscounts[0] || null;
  } catch (error) {
    console.error('Error getting deal of the day:', error);
    
    // Fallback to local data on error
    return getFallbackDeal();
  }
};

/**
 * Fallback to provide a deal from local data when database fetch fails
 */
const getFallbackDeal = (): DealProduct | null => {
  // Get products from local store that have both regular price and sale price
  const productsWithDiscount = productStore.products.filter(p => p.price && p.salePrice);
  
  if (productsWithDiscount.length === 0) return null;
  
  // Calculate discount and find best deal
  const productsWithDiscounts = productsWithDiscount.map(product => {
    const normalizedProduct = normalizeProductData(product);
    const discountPercentage = Math.round(((product.price - (product.salePrice || 0)) / product.price) * 100);
    return {
      ...normalizedProduct,
      discountPercentage,
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // Deal ends in 24 hours
    };
  });
  
  // Sort by discount percentage (highest first)
  productsWithDiscounts.sort((a, b) => b.discountPercentage - a.discountPercentage);
  
  return productsWithDiscounts[0] || null;
};

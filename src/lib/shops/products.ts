import { Product } from '@/lib/products';
import { getShopById } from './crud';
import { getShopProducts as supabaseGetShopProducts } from '@/lib/supabase/products';
import { shops } from './mockData';

// Function to get products for a shop
export const getShopProducts = async (shopId: string, allProducts?: Product[]): Promise<Product[]> => {
  try {
    const shop = await getShopById(shopId);
    if (!shop) return [];
    
    // Get products from Supabase
    const products = await supabaseGetShopProducts(shopId);
    
    if (products && products.length > 0) {
      return products;
    }
    
    // If allProducts was provided, use it for the fallback
    if (allProducts && shop.productIds && shop.productIds.length > 0) {
      return allProducts.filter(product => shop.productIds.includes(product.id));
    }
    
    // Otherwise just return an empty array
    return [];
  } catch (error) {
    console.error(`Error fetching products for shop ${shopId}:`, error);
    
    // Fallback to filtering by productIds if allProducts was provided
    if (allProducts) {
      const shop = shops.find(s => s.id === shopId);
      if (shop && shop.productIds && shop.productIds.length > 0) {
        return allProducts.filter(product => shop.productIds.includes(product.id));
      }
    }
    
    return [];
  }
};

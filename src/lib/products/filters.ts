
import { Product } from '@/lib/products/types';
import { 
  useNewArrivals, 
  useTrendingProducts, 
  useProductsByCategory,
  fetchProductsByCategory as fetchByCategory,
  fetchNewArrivals as fetchNew,
  fetchTrendingProducts as fetchTrending,
  fetchProducts as fetchWithOptions,
  fetchProductsByShop as fetchByShop
} from '@/hooks/use-product-fetching';

// Function to get related products
export const getRelatedProducts = async (currentProductId: string, category: string): Promise<Product[]> => {
  try {
    const { products } = await fetchByCategory(category, 10);
    return products.filter(p => p.id !== currentProductId).slice(0, 4);
  } catch (error) {
    console.error('Error getting related products:', error);
    return [];
  }
};

// Utility functions to get filtered products
export const getNewArrivals = async (): Promise<Product[]> => {
  return fetchNew();
};

export const getTrendingProducts = async (): Promise<Product[]> => {
  return fetchTrending();
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const { products } = await fetchByCategory(category);
    return products;
  } catch (error) {
    console.error(`Error fetching products with category ${category}:`, error);
    return [];
  }
};

export const getProductsByTags = async (tag: string): Promise<Product[]> => {
  try {
    const { products } = await fetchWithOptions({
      tags: [tag],
      limit: 8
    });
    
    return products;
  } catch (error) {
    console.error(`Error fetching products with tag ${tag}:`, error);
    return [];
  }
};

// Add additional filter functions as needed
export const getTopRatedProducts = async (): Promise<Product[]> => {
  try {
    const { products } = await fetchWithOptions({
      minRating: 4,
      sortBy: 'rating',
      limit: 8
    });
    
    return products;
  } catch (error) {
    console.error('Error fetching top rated products:', error);
    return [];
  }
};

export const getDiscountedProducts = async (): Promise<Product[]> => {
  try {
    const { products } = await fetchWithOptions({
      hasDiscount: true,
      limit: 8
    });
    
    return products;
  } catch (error) {
    console.error('Error fetching discounted products:', error);
    return [];
  }
};

export const getBestSellingProducts = async (): Promise<Product[]> => {
  try {
    const { products } = await fetchWithOptions({
      sortBy: 'popularity',
      limit: 8
    });
    
    return products;
  } catch (error) {
    console.error('Error fetching best selling products:', error);
    return [];
  }
};

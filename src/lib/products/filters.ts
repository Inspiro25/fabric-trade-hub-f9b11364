
import { Product } from '@/lib/types/product';
import { fetchProducts, fetchRelatedProducts, fetchNewArrivals, fetchTrendingProducts, fetchProductsByCategory, fetchProductsByShop } from '@/hooks/use-product-fetching';

// Function to get related products
export const getRelatedProducts = async (currentProductId: string, category: string): Promise<Product[]> => {
  return fetchRelatedProducts(currentProductId, category);
};

// Utility functions to get filtered products
export const getNewArrivals = async (): Promise<Product[]> => {
  return fetchNewArrivals();
};

export const getTrendingProducts = async (): Promise<Product[]> => {
  return fetchTrendingProducts();
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const result = await fetchProductsByCategory(category);
  return result.products;
};

export const getProductsByTags = async (tag: string): Promise<Product[]> => {
  try {
    const { products } = await fetchProducts({
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
    const { products } = await fetchProducts({
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
    const { products } = await fetchProducts({
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
    const { products } = await fetchProducts({
      sortBy: 'popularity',
      limit: 8
    });
    
    return products;
  } catch (error) {
    console.error('Error fetching best selling products:', error);
    return [];
  }
};

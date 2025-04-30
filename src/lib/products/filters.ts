
import { Product } from '@/lib/products/types';
import { 
  useNewArrivals, 
  useTrendingProducts, 
  useProductsByCategory
} from '@/hooks/use-product-fetching';

// Function to get related products
export const getRelatedProducts = async (currentProductId: string, category: string): Promise<Product[]> => {
  try {
    const result = await fetch(`/api/products/related?category=${category}&exclude=${currentProductId}`);
    const data = await result.json();
    return data.products.filter((p: Product) => p.id !== currentProductId).slice(0, 4);
  } catch (error) {
    console.error('Error getting related products:', error);
    return [];
  }
};

// Utility functions to get filtered products
export const getNewArrivals = async (): Promise<Product[]> => {
  try {
    const result = await fetch('/api/products/new-arrivals');
    const data = await result.json();
    return data.products;
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    return [];
  }
};

export const getTrendingProducts = async (): Promise<Product[]> => {
  try {
    const result = await fetch('/api/products/trending');
    const data = await result.json();
    return data.products;
  } catch (error) {
    console.error('Error fetching trending products:', error);
    return [];
  }
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const result = await fetch(`/api/products/category/${category}`);
    const data = await result.json();
    return data.products;
  } catch (error) {
    console.error(`Error fetching products with category ${category}:`, error);
    return [];
  }
};

export const getProductsByTags = async (tag: string): Promise<Product[]> => {
  try {
    const result = await fetch(`/api/products/tags/${tag}`);
    const data = await result.json();
    return data.products;
  } catch (error) {
    console.error(`Error fetching products with tag ${tag}:`, error);
    return [];
  }
};

// Add additional filter functions as needed
export const getTopRatedProducts = async (): Promise<Product[]> => {
  try {
    const result = await fetch('/api/products/top-rated');
    const data = await result.json();
    return data.products;
  } catch (error) {
    console.error('Error fetching top rated products:', error);
    return [];
  }
};

export const getDiscountedProducts = async (): Promise<Product[]> => {
  try {
    const result = await fetch('/api/products/discounted');
    const data = await result.json();
    return data.products;
  } catch (error) {
    console.error('Error fetching discounted products:', error);
    return [];
  }
};

export const getBestSellingProducts = async (): Promise<Product[]> => {
  try {
    const result = await fetch('/api/products/best-selling');
    const data = await result.json();
    return data.products;
  } catch (error) {
    console.error('Error fetching best selling products:', error);
    return [];
  }
};

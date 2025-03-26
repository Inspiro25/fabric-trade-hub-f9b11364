
import { Product } from '@/lib/types/product';
import { 
  fetchProducts, 
  fetchRelatedProducts, 
  fetchNewArrivals, 
  fetchTrendingProducts, 
  fetchProductsByCategory as fetchProductsByCategoryApi, 
  fetchProductsByShop 
} from '@/hooks/use-product-fetching';

// Function to get all products
export const getAllProducts = async (): Promise<Product[]> => {
  return await fetchProducts(100); // Limit to 100 products 
};

// Function to get related products
export const getRelatedProducts = async (productId: string, limit = 4): Promise<Product[]> => {
  return await fetchRelatedProducts(productId, limit);
};

// Function to get new arrivals
export const getNewArrivals = async (limit = 8): Promise<Product[]> => {
  return await fetchNewArrivals(limit);
};

// Function to get trending products
export const getTrendingProducts = async (limit = 8): Promise<Product[]> => {
  return await fetchTrendingProducts(limit);
};

// Function to get products by category
export const getProductsByCategory = async (categoryId: string, limit = 8): Promise<Product[]> => {
  return await fetchProductsByCategoryApi(categoryId, limit);
};

// Export fetchProductsByCategory as an alias to maintain compatibility with existing code
export const fetchProductsByCategory = getProductsByCategory;

// Function to get products by tags
export const getProductsByTags = async (tags: string[], limit = 8): Promise<Product[]> => {
  const allProducts = await fetchProducts(50);
  const filteredProducts = allProducts.filter((product) => {
    return product.tags && product.tags.some((tag) => tags.includes(tag));
  });
  
  return filteredProducts.slice(0, limit);
};

// Function to filter products by various criteria
export const filterProducts = (
  products: Product[],
  {
    minPrice,
    maxPrice,
    categories,
    onSale,
    inStock,
    search,
  }: {
    minPrice?: number;
    maxPrice?: number;
    categories?: string[];
    onSale?: boolean;
    inStock?: boolean;
    search?: string;
  }
): Product[] => {
  return products.filter((product) => {
    // Filter by price range
    if (minPrice !== undefined && product.price < minPrice) return false;
    if (maxPrice !== undefined && product.price > maxPrice) return false;
    
    // Filter by categories
    if (categories && categories.length > 0) {
      if (!categories.includes(product.category_id)) return false;
    }
    
    // Filter by sale status
    if (onSale !== undefined && onSale && !product.sale_price) return false;
    
    // Filter by stock status
    if (inStock !== undefined && inStock && product.stock <= 0) return false;
    
    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      const nameMatch = product.name.toLowerCase().includes(searchLower);
      const descMatch = product.description.toLowerCase().includes(searchLower);
      const tagMatch = product.tags && product.tags.some((tag) => tag.toLowerCase().includes(searchLower));
      
      if (!nameMatch && !descMatch && !tagMatch) return false;
    }
    
    return true;
  });
};

export default {
  getAllProducts,
  getRelatedProducts,
  getNewArrivals,
  getTrendingProducts,
  getProductsByCategory,
  getProductsByTags,
  filterProducts,
  fetchProductsByCategory, // Add alias for backwards compatibility
};

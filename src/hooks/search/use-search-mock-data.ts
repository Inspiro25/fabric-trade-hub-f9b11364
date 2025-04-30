
import { useState, useEffect, useCallback } from 'react';
import { SearchPageProduct, Category, Shop } from './types';
import { toast } from '@/components/ui/use-toast';

export const useSearchMockData = (
  query: string,
  category: string | null,
  page: number,
  itemsPerPage: number
) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<SearchPageProduct[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [recommendations, setRecommendations] = useState<SearchPageProduct[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<SearchPageProduct[]>([]);

  // Mock data fetching function
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API fetch with timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock products data
      const mockProducts: SearchPageProduct[] = Array.from({ length: 24 }, (_, i) => ({
        id: `product-${i+1}`,
        name: `Product ${i+1} ${query ? `matching "${query}"` : ''}`,
        price: 29.99 + i,
        salePrice: i % 3 === 0 ? (29.99 + i) * 0.8 : undefined,
        images: [`https://via.placeholder.com/300?text=Product+${i+1}`],
        category: category || 'General',
        rating: 3 + (i % 3),
        reviewCount: 10 + i,
        created_at: new Date().toISOString()
      }));
      
      // Filter by query if provided
      const filtered = query 
        ? mockProducts.filter(p => 
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase())
          )
        : mockProducts;
      
      // Filter by category if provided
      const categoryFiltered = category
        ? filtered.filter(p => p.category.toLowerCase() === category.toLowerCase())
        : filtered;
        
      // Paginate
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const paginatedResults = categoryFiltered.slice(start, end);
      
      setProducts(paginatedResults);
      setTotalProducts(categoryFiltered.length);
      
      // Mock categories
      setCategories([
        { id: 'clothing', name: 'Clothing', image: 'https://via.placeholder.com/100?text=Clothing' },
        { id: 'electronics', name: 'Electronics', image: 'https://via.placeholder.com/100?text=Electronics' },
        { id: 'home', name: 'Home & Garden', image: 'https://via.placeholder.com/100?text=Home' },
        { id: 'sports', name: 'Sports', image: 'https://via.placeholder.com/100?text=Sports' },
      ]);
      
      // Mock shops
      setShops([
        { id: 'shop-1', name: 'FashionStore', logo: 'https://via.placeholder.com/50?text=FS' },
        { id: 'shop-2', name: 'TechWorld', logo: 'https://via.placeholder.com/50?text=TW' },
        { id: 'shop-3', name: 'HomeDecor', logo: 'https://via.placeholder.com/50?text=HD' },
      ]);
      
      // Mock recommendations
      setRecommendations(mockProducts.slice(0, 6));
      
      // Mock recently viewed
      setRecentlyViewed(mockProducts.slice(20, 24));
      
      setInitialLoad(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [query, category, page, itemsPerPage]);
  
  // Handle retry on error
  const handleRetry = () => {
    setError(null);
    fetchData();
  };
  
  return {
    loading,
    error,
    products,
    totalProducts,
    categories,
    shops,
    initialLoad,
    recommendations,
    recentlyViewed,
    fetchData,
    handleRetry
  };
};

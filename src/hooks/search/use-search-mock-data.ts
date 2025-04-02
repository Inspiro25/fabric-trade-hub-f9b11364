
import { useState, useEffect } from 'react';
import { SearchPageProduct, Category, Shop } from './types';

export function useSearchMockData(query: string, categoryId: string | null, page: number, itemsPerPage: number) {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<SearchPageProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [error, setError] = useState<string>('');
  const [totalProducts, setTotalProducts] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);
  const [recommendations, setRecommendations] = useState<SearchPageProduct[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<SearchPageProduct[]>([]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock products data
      const mockProducts: SearchPageProduct[] = Array.from({ length: 24 }, (_, i) => ({
        id: `product-${i + 1}`,
        name: `${query || 'Product'} ${i + 1}`,
        description: `Description for ${query || 'Product'} ${i + 1}`,
        price: 19.99 + i * 10,
        salePrice: i % 3 === 0 ? 14.99 + i * 8 : null,
        images: [`https://placehold.co/600x400?text=Product+${i + 1}`],
        category: categoryId || `category-${Math.floor(i / 4) + 1}`,
        colors: ['red', 'blue', 'black'],
        sizes: ['S', 'M', 'L'],
        isNew: i < 4,
        isTrending: i >= 4 && i < 8,
        rating: 3.5 + (i % 3) * 0.5,
        reviewCount: 10 + i * 5,
        stock: 50 - i,
        tags: ['trending', 'new arrival'],
        shopId: `shop-${Math.floor(i / 4) + 1}`,
        brand: `Brand ${Math.floor(i / 3) + 1}`,
        created_at: new Date().toISOString(),
      }));
      
      // Filter by category if provided
      let filteredProducts = [...mockProducts];
      if (categoryId) {
        filteredProducts = mockProducts.filter(p => p.category === categoryId);
      }
      
      // Filter by search query if provided
      if (query) {
        const searchTerm = query.toLowerCase();
        filteredProducts = filteredProducts.filter(
          p => p.name.toLowerCase().includes(searchTerm) || 
               (p.description && p.description.toLowerCase().includes(searchTerm)) ||
               (p.brand && p.brand.toLowerCase().includes(searchTerm))
        );
      }
      
      // Pagination
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const paginatedProducts = filteredProducts.slice(start, end);
      
      // Mock categories
      const mockCategories: Category[] = Array.from({ length: 8 }, (_, i) => ({
        id: `category-${i + 1}`,
        name: `Category ${i + 1}`,
        productCount: Math.floor(Math.random() * 100) + 10,
      }));
      
      // Mock shops
      const mockShops: Shop[] = Array.from({ length: 5 }, (_, i) => ({
        id: `shop-${i + 1}`,
        name: `Shop ${i + 1}`,
        productCount: Math.floor(Math.random() * 100) + 5,
        rating: 3.5 + Math.random() * 1.5,
      }));
      
      // Mock recommendations
      const mockRecommendations = mockProducts.slice(0, 8).map(p => ({...p, id: `rec-${p.id}`}));
      
      // Mock recently viewed
      const mockRecentlyViewed = mockProducts.slice(8, 12).map(p => ({...p, id: `recent-${p.id}`}));
      
      setProducts(paginatedProducts);
      setCategories(mockCategories);
      setShops(mockShops);
      setTotalProducts(filteredProducts.length);
      setRecommendations(mockRecommendations);
      setRecentlyViewed(mockRecentlyViewed);
      setInitialLoad(false);
    } catch (err) {
      console.error("Error fetching search data:", err);
      setError('Failed to load search results. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRetry = () => {
    fetchData();
  };
  
  useEffect(() => {
    fetchData();
  }, [query, categoryId, page, itemsPerPage]);
  
  return {
    loading,
    products,
    categories,
    shops,
    error,
    totalProducts,
    initialLoad,
    recommendations,
    recentlyViewed,
    fetchData,
    handleRetry
  };
}

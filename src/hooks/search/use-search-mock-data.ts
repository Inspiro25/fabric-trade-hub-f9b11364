import { useState, useEffect } from 'react';
import { SearchPageProduct, Category, Shop } from './types';

export const useSearchMockData = (
  query: string, 
  category: string, 
  page: number, 
  itemsPerPage: number
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<SearchPageProduct[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [recommendations, setRecommendations] = useState<SearchPageProduct[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<SearchPageProduct[]>([]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock categories
      const mockCategories: Category[] = [
        {id: '1', name: 'Electronics', image: '/placeholder.svg', description: 'Electronic devices and gadgets'},
        {id: '2', name: 'Fashion', image: '/placeholder.svg', description: 'Clothing and accessories'},
        {id: '3', name: 'Home', image: '/placeholder.svg', description: 'Home appliances and furniture'},
        {id: '4', name: 'Sports', image: '/placeholder.svg', description: 'Sports equipment and gear'},
        {id: '5', name: 'Books', image: '/placeholder.svg', description: 'Books and reading materials'},
      ];
      
      // Mock shops
      const mockShops: Shop[] = [
        {
          id: '1',
          name: 'Fashion Forward',
          description: 'Trendy clothing for all ages',
          logo: 'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=150&auto=format&fit=crop',
          cover_image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&auto=format&fit=crop',
          rating: 4.8,
          review_count: 532,
          followers_count: 1200
        },
        {
          id: '2',
          name: 'Sportify',
          description: 'Athletic wear for peak performance',
          logo: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=150&auto=format&fit=crop',
          cover_image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop',
          rating: 4.6,
          review_count: 328,
          followers_count: 850
        },
        {
          id: '3',
          name: 'Luxe Living',
          description: 'High-end home accessories',
          logo: 'https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=150&auto=format&fit=crop',
          cover_image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800&auto=format&fit=crop',
          rating: 4.9,
          review_count: 216,
          followers_count: 760
        }
      ];

      // Mock products
      const mockProducts: SearchPageProduct[] = Array.from({ length: itemsPerPage }, (_, i) => ({
        id: `product-${i + (page - 1) * itemsPerPage}`,
        name: `${query || 'Sample'} Product ${i + (page - 1) * itemsPerPage}`,
        description: 'This is a sample product description.',
        price: Math.floor(Math.random() * 100) + 20,
        sale_price: Math.random() > 0.5 ? Math.floor(Math.random() * 50) + 10 : null,
        salePrice: Math.random() > 0.5 ? Math.floor(Math.random() * 50) + 10 : null,
        images: ['/placeholder.svg'],
        category: category || 'All',
        category_id: category || 'All',
        colors: ['red', 'blue', 'green'],
        sizes: ['S', 'M', 'L'],
        is_new: Math.random() > 0.5,
        isNew: Math.random() > 0.5,
        is_trending: Math.random() > 0.5,
        isTrending: Math.random() > 0.5,
        rating: Math.floor(Math.random() * 5) + 1,
        review_count: Math.floor(Math.random() * 100),
        reviewCount: Math.floor(Math.random() * 100),
        stock: Math.floor(Math.random() * 50),
        tags: ['sample', 'product'],
        shop_id: 'shop-123',
        shopId: 'shop-123',
      }));

      setProducts(mockProducts);
      setTotalProducts(100);
      setCategories(mockCategories);
      setShops(mockShops);
      setRecommendations(mockProducts.slice(0, 4));
      setRecentlyViewed(mockProducts.slice(4, 8));
      setInitialLoad(false);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
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

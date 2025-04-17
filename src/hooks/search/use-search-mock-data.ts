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
          name: 'ElectroHub', 
          description: 'Best electronics store',
          logo: '/placeholder.svg',
          coverImage: '/placeholder.svg',
          cover_image: '/placeholder.svg',
          address: '123 Tech Street',
          rating: 4.5,
          reviewCount: 120,
          review_count: 120,
          isVerified: true,
          is_verified: true,
          ownerName: 'John Doe',
          owner_name: 'John Doe',
          ownerEmail: 'john@electrohub.com',
          owner_email: 'john@electrohub.com',
          status: 'active',
          shopId: 'shop-1',
          shop_id: 'shop-1'
        },
        {
          id: '2', 
          name: 'Fashion World', 
          description: 'Trendy fashion items',
          logo: '/placeholder.svg',
          coverImage: '/placeholder.svg',
          cover_image: '/placeholder.svg',
          address: '456 Style Avenue',
          rating: 4.3,
          reviewCount: 98,
          review_count: 98,
          isVerified: true,
          is_verified: true,
          ownerName: 'Jane Smith',
          owner_name: 'Jane Smith',
          ownerEmail: 'jane@fashionworld.com',
          owner_email: 'jane@fashionworld.com',
          status: 'active',
          shopId: 'shop-2',
          shop_id: 'shop-2'
        },
        {
          id: '3', 
          name: 'Home Essentials', 
          description: 'Everything for your home',
          logo: '/placeholder.svg',
          coverImage: '/placeholder.svg',
          cover_image: '/placeholder.svg',
          address: '789 Home Street',
          rating: 4.2,
          reviewCount: 76,
          review_count: 76,
          isVerified: true,
          is_verified: true,
          ownerName: 'Bob Johnson',
          owner_name: 'Bob Johnson',
          ownerEmail: 'bob@homeessentials.com',
          owner_email: 'bob@homeessentials.com',
          status: 'active',
          shopId: 'shop-3',
          shop_id: 'shop-3'
        },
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

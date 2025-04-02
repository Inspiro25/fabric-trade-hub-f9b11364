
// Update the shop mock data to use coverImage instead of cover_image
import { useState, useEffect } from 'react';
import { SearchPageProduct, Category, Shop } from './types';

export const useSearchMockData = () => {
  const [products, setProducts] = useState<SearchPageProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const simulateFetch = async () => {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
      
      // Generate mock products
      const mockProducts = generateMockProducts(50);
      
      // Generate mock categories
      const mockCategories = generateMockCategories();
      
      // Generate mock shops
      const mockShops = generateMockShops();
      
      setProducts(mockProducts);
      setCategories(mockCategories);
      setShops(mockShops);
      setLoading(false);
    };
    
    simulateFetch();
  }, []);
  
  return { products, categories, shops, loading };
};

// Helper function to generate mock products
const generateMockProducts = (count: number): SearchPageProduct[] => {
  return Array.from({ length: count }).map((_, index) => ({
    id: `product-${index + 1}`,
    name: `Product ${index + 1}`,
    price: Math.floor(Math.random() * 100) + 10,
    sale_price: Math.random() > 0.7 ? Math.floor(Math.random() * 50) + 5 : undefined,
    images: [`https://source.unsplash.com/random/300x300/?product=${index}`],
    category_id: `category-${Math.floor(Math.random() * 5) + 1}`,
    shop_id: `shop-${Math.floor(Math.random() * 3) + 1}`,
    rating: Math.random() * 5,
    review_count: Math.floor(Math.random() * 100),
    is_new: Math.random() > 0.8,
    is_trending: Math.random() > 0.9,
    description: `This is a description for Product ${index + 1}.`,
    created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
  }));
};

// Helper function to generate mock categories
const generateMockCategories = (): Category[] => {
  const categoryNames = ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Toys'];
  
  return categoryNames.map((name, index) => ({
    id: `category-${index + 1}`,
    name,
    description: `Category for ${name}`,
    image: `https://source.unsplash.com/random/300x300/?${name.toLowerCase()}`,
    productCount: Math.floor(Math.random() * 100) + 20
  }));
};

// Helper function to generate mock shops
const generateMockShops = (): Shop[] => {
  const shops = [
    {
      id: 'shop-1',
      name: 'TechWorld',
      logo: 'https://source.unsplash.com/random/100x100/?tech',
      coverImage: 'https://source.unsplash.com/random/1200x400/?technology',
      description: 'Your one-stop shop for all tech needs.',
      rating: 4.7,
      followers: 1250,
      isVerified: true,
      productCount: 120
    },
    {
      id: 'shop-2',
      name: 'Fashion Hub',
      logo: 'https://source.unsplash.com/random/100x100/?fashion',
      coverImage: 'https://source.unsplash.com/random/1200x400/?fashion',
      description: 'Latest fashion trends and styles.',
      rating: 4.2,
      followers: 950,
      isVerified: true,
      productCount: 78
    },
    {
      id: 'shop-3',
      name: 'Home Essentials',
      logo: 'https://source.unsplash.com/random/100x100/?home',
      coverImage: 'https://source.unsplash.com/random/1200x400/?interior',
      description: 'Everything you need for your home.',
      rating: 4.5,
      followers: 820,
      isVerified: false,
      productCount: 95
    }
  ];
  
  return shops;
};

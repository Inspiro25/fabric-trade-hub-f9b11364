
import { Product } from './products';

export interface Shop {
  id: string;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  address: string;
  rating: number;
  reviewCount: number;
  productIds: string[];
  isVerified: boolean;
  createdAt: string;
}

// Mock data for shops
export const shops: Shop[] = [
  {
    id: 'shop-1',
    name: 'Electronics Hub',
    description: 'Your one-stop destination for all electronic gadgets and accessories.',
    logo: '/placeholder.svg',
    coverImage: '/placeholder.svg',
    address: '123 Tech Street, Silicon Valley, CA',
    rating: 4.7,
    reviewCount: 342,
    productIds: ['product-1', 'product-2', 'product-5', 'product-9'],
    isVerified: true,
    createdAt: '2023-01-15'
  },
  {
    id: 'shop-2',
    name: 'Fashion Trends',
    description: 'The latest in fashion for every season and occasion.',
    logo: '/placeholder.svg',
    coverImage: '/placeholder.svg',
    address: '456 Style Avenue, New York, NY',
    rating: 4.5,
    reviewCount: 218,
    productIds: ['product-3', 'product-4', 'product-8'],
    isVerified: true,
    createdAt: '2023-03-22'
  },
  {
    id: 'shop-3',
    name: 'Home Essentials',
    description: 'Everything you need to make your house a home.',
    logo: '/placeholder.svg',
    coverImage: '/placeholder.svg',
    address: '789 Comfort Lane, Chicago, IL',
    rating: 4.3,
    reviewCount: 176,
    productIds: ['product-6', 'product-7', 'product-10'],
    isVerified: false,
    createdAt: '2023-05-07'
  }
];

// Function to get products for a shop
export const getShopProducts = (shopId: string, allProducts: Product[]): Product[] => {
  const shop = shops.find(s => s.id === shopId);
  if (!shop) return [];
  
  return allProducts.filter(product => shop.productIds.includes(product.id));
};

// Function to get a shop by ID
export const getShopById = (id: string): Shop | undefined => {
  return shops.find(shop => shop.id === id);
};

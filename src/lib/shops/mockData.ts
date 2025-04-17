
import { Shop } from './types';

// Local mock data for fallback and initial development
export const mockShops: Shop[] = [
  {
    id: 'shop-1',
    name: 'Electronics Hub',
    description: 'Your one-stop destination for all electronic gadgets and accessories.',
    logo: '/placeholder.svg',
    coverImage: '/placeholder.svg',
    address: '123 Tech Street, Silicon Valley, CA',
    ownerName: 'John Doe',
    ownerEmail: 'john@electronicshub.com',
    phoneNumber: '+1-555-123-4567',
    rating: 4.7,
    reviewCount: 342,
    followers: 120,
    productIds: ['product-1', 'product-2', 'product-5', 'product-9'],
    isVerified: true,
    status: 'active',
    createdAt: '2023-01-15',
    shopId: 'electronics-hub',
    followers_count: 120
  },
  {
    id: 'shop-2',
    name: 'Fashion Trends',
    description: 'The latest in fashion for every season and occasion.',
    logo: '/placeholder.svg',
    coverImage: '/placeholder.svg',
    address: '456 Style Avenue, New York, NY',
    ownerName: 'Emma Wilson',
    ownerEmail: 'emma@fashiontrends.com',
    phoneNumber: '+1-555-987-6543',
    rating: 4.5,
    reviewCount: 218,
    followers: 85,
    productIds: ['product-3', 'product-4', 'product-8'],
    isVerified: true,
    status: 'active',
    createdAt: '2023-03-22',
    shopId: 'fashion-trends',
    followers_count: 85
  },
  {
    id: 'shop-3',
    name: 'Home Essentials',
    description: 'Everything you need to make your house a home.',
    logo: '/placeholder.svg',
    coverImage: '/placeholder.svg',
    address: '789 Comfort Lane, Chicago, IL',
    ownerName: 'Robert Smith',
    ownerEmail: 'robert@homeessentials.com',
    phoneNumber: '+1-555-456-7890',
    rating: 4.3,
    reviewCount: 176,
    followers: 62,
    productIds: ['product-6', 'product-7', 'product-10'],
    isVerified: false,
    status: 'pending',
    createdAt: '2023-05-07',
    shopId: 'home-essentials',
    followers_count: 62
  }
];

// Temporary local reference to shops - also export for direct access
export let shops: Shop[] = [...mockShops];

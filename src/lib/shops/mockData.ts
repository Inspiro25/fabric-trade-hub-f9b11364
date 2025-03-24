
import { Shop } from './types';

const mockShops: Shop[] = [
  {
    id: '1',
    name: 'Eternity Clothing',
    description: 'Premium fashion store with the latest trends in clothing and accessories.',
    logo: '/images/shops/shop1-logo.png',
    cover_image: '/images/shops/shop1-cover.png',
    rating: 4.8,
    review_count: 1256,
    followers_count: 5230,
    owner_name: 'Sarah Johnson',
    owner_email: 'sarah@eternityclothing.com',
    phone_number: '+1234567890',
    address: '123 Fashion Ave, New York, NY 10001',
    status: 'active',
    is_verified: true,
    created_at: '2023-01-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'Tech Haven',
    description: 'The ultimate destination for tech enthusiasts with the latest gadgets and accessories.',
    logo: '/images/shops/shop2-logo.png',
    cover_image: '/images/shops/shop2-cover.png',
    rating: 4.6,
    review_count: 983,
    followers_count: 4150,
    owner_name: 'David Chen',
    owner_email: 'david@techhaven.com',
    phone_number: '+1987654321',
    address: '456 Tech Blvd, San Francisco, CA 94105',
    status: 'active',
    is_verified: true,
    created_at: '2023-02-20T00:00:00Z'
  },
  {
    id: '3',
    name: 'Home Essentials',
    description: 'Everything you need to make your house a home, from furniture to decor.',
    logo: '/images/shops/shop3-logo.png',
    cover_image: '/images/shops/shop3-cover.png',
    rating: 4.4,
    review_count: 756,
    followers_count: 2890,
    owner_name: 'Emma Williams',
    owner_email: 'emma@homeessentials.com',
    phone_number: '+1122334455',
    address: '789 Home St, Chicago, IL 60601',
    status: 'active',
    is_verified: false,
    created_at: '2023-03-10T00:00:00Z'
  }
];

export default mockShops;

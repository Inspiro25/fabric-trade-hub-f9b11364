
import { Shop, ShopStatus } from './types';

// Create mock shop data
export const mockShops: Shop[] = [
  {
    id: '1',
    name: 'Fashion Forward',
    description: 'Trendy and affordable fashion for all styles',
    logo: 'https://images.unsplash.com/photo-1565915041439-edd18ef49b8f?q=80&w=200',
    cover_image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600',
    rating: 4.7,
    review_count: 248,
    followers_count: 5624,
    product_count: 432,
    owner_name: 'Sophia Williams',
    owner_email: 'sophia@fashionforward.com',
    address: '123 Fashion St, New York, NY',
    phone: '+1 (555) 123-4567',
    website: 'www.fashionforward.com',
    social_media: {
      facebook: 'fashionforward',
      instagram: 'fashion_forward',
      twitter: 'fashionforward',
      pinterest: 'fashionforwardstore'
    },
    categories: ['women', 'men', 'accessories'],
    tags: ['trendy', 'affordable', 'fashion'],
    is_verified: true,
    status: 'active',
    created_at: '2023-01-15T08:00:00.000Z'
  },
  {
    id: '2',
    name: 'Tech Solutions',
    description: 'Innovative tech gadgets and solutions for modern living',
    logo: 'https://images.unsplash.com/photo-1518770660439-464ef50ce906?q=80&w=200',
    cover_image: 'https://images.unsplash.com/photo-1488590528227-984c35dad8c2?q=80&w=1600',
    rating: 4.9,
    review_count: 386,
    followers_count: 8952,
    product_count: 689,
    owner_name: 'Ethan Johnson',
    owner_email: 'ethan@techsolutions.com',
    address: '456 Innovation Ave, San Francisco, CA',
    phone: '+1 (555) 234-5678',
    website: 'www.techsolutions.com',
    social_media: {
      facebook: 'techsolutions',
      instagram: 'tech_solutions',
      twitter: 'techsolutions',
      pinterest: 'techsolutions'
    },
    categories: ['electronics', 'gadgets', 'home automation'],
    tags: ['tech', 'innovative', 'gadgets'],
    is_verified: true,
    status: 'active',
    created_at: '2023-02-20T10:30:00.000Z'
  },
  {
    id: '3',
    name: 'Gourmet Delights',
    description: 'Exquisite gourmet foods and culinary experiences',
    logo: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?q=80&w=200',
    cover_image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1600',
    rating: 4.6,
    review_count: 195,
    followers_count: 3218,
    product_count: 276,
    owner_name: 'Olivia Davis',
    owner_email: 'olivia@gourmetdelights.com',
    address: '789 Flavor Ln, Paris, France',
    phone: '+33 1 23 45 67 89',
    website: 'www.gourmetdelights.com',
    social_media: {
      facebook: 'gourmetdelights',
      instagram: 'gourmet_delights',
      twitter: 'gourmetdelights',
      pinterest: 'gourmetdelights'
    },
    categories: ['food', 'gourmet', 'international'],
    tags: ['food', 'gourmet', 'international'],
    is_verified: false,
    status: 'active',
    created_at: '2023-03-10T14:15:00.000Z'
  }
];

export const getPopularShops = (): Shop[] => {
  return mockShops.filter(shop => shop.followers_count > 2000);
};

export const getVerifiedShops = (): Shop[] => {
  return mockShops.filter(shop => shop.is_verified);
};

export const getShopById = (id: string): Shop | undefined => {
  return mockShops.find(shop => shop.id === id);
};


import { Shop, ShopStatus } from './types';

const mockShops: Shop[] = [
  {
    id: "shop-1",
    name: "Organic Harvest",
    description: "Fresh organic produce direct from local farms",
    logo: "/images/shops/organic-harvest-logo.png",
    cover_image: "/images/shops/organic-harvest-cover.jpg",
    rating: 4.8,
    review_count: 128,
    followers_count: 1500,
    product_count: 75,
    owner_name: "Sarah Johnson",
    owner_email: "sarah@organicharvest.com",
    phone_number: "+1-555-123-4567",
    address: "123 Green Lane, Farmville, CA 94123",
    status: "active" as ShopStatus,
    is_verified: true,
    created_at: "2023-02-15T00:00:00Z"
  },
  {
    id: "shop-2",
    name: "Tech Universe",
    description: "Latest gadgets and tech accessories at competitive prices",
    logo: "/images/shops/tech-universe-logo.png",
    cover_image: "/images/shops/tech-universe-cover.jpg",
    rating: 4.5,
    review_count: 320,
    followers_count: 2200,
    product_count: 150,
    owner_name: "Michael Chen",
    owner_email: "michael@techuniverse.com",
    phone_number: "+1-555-987-6543",
    address: "456 Innovation Drive, Silicon Valley, CA 95051",
    status: "active" as ShopStatus,
    is_verified: true,
    created_at: "2023-03-21T00:00:00Z"
  },
  {
    id: "shop-3",
    name: "Fashion Forward",
    description: "Trendy clothing and accessories for the style-conscious",
    logo: "/images/shops/fashion-forward-logo.png",
    cover_image: "/images/shops/fashion-forward-cover.jpg",
    rating: 4.2,
    review_count: 95,
    followers_count: 980,
    product_count: 120,
    owner_name: "Emma Rodriguez",
    owner_email: "emma@fashionforward.com",
    phone_number: "+1-555-456-7890",
    address: "789 Style Avenue, Los Angeles, CA 90028",
    status: "active" as ShopStatus,
    is_verified: false,
    created_at: "2023-04-10T00:00:00Z"
  }
];

export default mockShops;

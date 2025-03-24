
import { Product, adaptProduct } from './types';

// Example mock products
export const mockProducts: Product[] = [
  adaptProduct({
    id: '1',
    name: 'Premium Leather Jacket',
    description: 'Genuine leather jacket with stylish design',
    price: 199.99,
    salePrice: 149.99,
    images: ['/images/products/leather-jacket.jpg'],
    category: 'jackets',
    category_id: 'jackets',
    colors: ['Black', 'Brown'],
    sizes: ['S', 'M', 'L', 'XL'],
    is_new: true,
    isTrending: false,
    rating: 4.5,
    review_count: 120,
    stock: 35,
    shop_id: 'shop1',
    tags: ['leather', 'jackets', 'premium']
  }),
  adaptProduct({
    id: '2',
    name: 'Casual Cotton T-Shirt',
    description: 'Comfortable cotton t-shirt for daily wear',
    price: 29.99,
    salePrice: null,
    images: ['/images/products/cotton-tshirt.jpg'],
    category: 't-shirts',
    category_id: 't-shirts',
    colors: ['White', 'Black', 'Gray', 'Navy'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    is_new: false,
    isTrending: true,
    rating: 4.2,
    review_count: 85,
    stock: 150,
    shop_id: 'shop2',
    tags: ['cotton', 't-shirts', 'casual']
  }),
  adaptProduct({
    id: '3',
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 149.99,
    salePrice: 129.99,
    images: ['/images/products/headphones.jpg'],
    category: 'electronics',
    category_id: 'electronics',
    colors: ['Black', 'White', 'Silver'],
    sizes: [],
    is_new: true,
    isTrending: true,
    rating: 4.8,
    review_count: 230,
    stock: 45,
    shop_id: 'shop3',
    tags: ['electronics', 'audio', 'wireless']
  })
];

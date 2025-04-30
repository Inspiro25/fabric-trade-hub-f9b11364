
import { Product } from '@/lib/products/types';

// Demo Categories
export const AllCategories = [
  { id: '1', name: 'Clothing', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xvdGhpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60' },
  { id: '2', name: 'Shoes', image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2hvZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60' },
  { id: '3', name: 'Accessories', image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWNjZXNzb3JpZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60' },
  { id: '4', name: 'Beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YmVhdXR5JTIwcHJvZHVjdHN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60' },
];

// Basic product structure that meets the required type
const createBasicProduct = (id: string, name: string): Product => ({
  id,
  name,
  description: "Product description",
  price: 29.99,
  images: ["https://via.placeholder.com/300"],
  category: "Category",
  rating: 4.5,
  reviewCount: 10,
  created_at: new Date().toISOString(),
  colors: [],
  sizes: [],
  stock: 10,
  tags: []
});

// Demo Featured Products
export const FeaturedProducts: Product[] = Array(6).fill(null).map((_, i) => 
  createBasicProduct(`featured-${i+1}`, `Featured Product ${i+1}`)
);

// Demo Popular Products
export const PopularProducts: Product[] = Array(6).fill(null).map((_, i) => 
  createBasicProduct(`popular-${i+1}`, `Popular Product ${i+1}`)
);

// Demo New Arrivals
export const NewArrivals: Product[] = Array(6).fill(null).map((_, i) => 
  createBasicProduct(`new-${i+1}`, `New Arrival ${i+1}`)
);

// Demo Sale Products
export const SaleProducts: Product[] = Array(6).fill(null).map((_, i) => ({
  ...createBasicProduct(`sale-${i+1}`, `Sale Product ${i+1}`),
  salePrice: 19.99
}));

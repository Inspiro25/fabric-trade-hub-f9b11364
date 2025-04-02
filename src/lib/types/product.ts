
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number | null;
  sale_price?: number | null; // For compatibility with API responses
  images: string[];
  category?: string;
  category_id?: string; // For compatibility with API responses
  colors: string[];
  sizes: string[];
  isNew?: boolean;
  is_new?: boolean; // For compatibility with API responses
  isTrending?: boolean;
  is_trending?: boolean; // For compatibility with API responses
  rating: number;
  reviewCount?: number;
  review_count?: number; // For compatibility with API responses
  stock: number;
  tags: string[];
  shopId?: string;
  shop_id?: string; // For compatibility with API responses
  brand?: string; // For mobile search
  shopName?: string; // Optional for shop details
  categoryId?: string; // Optional for category details
  created_at?: string; // For sorting products
  updated_at?: string; // For tracking updates
}

// Helper function to normalize product data
export function normalizeProduct(rawProduct: any): Product {
  return {
    id: rawProduct.id,
    name: rawProduct.name,
    description: rawProduct.description,
    price: rawProduct.price,
    salePrice: rawProduct.salePrice || rawProduct.sale_price,
    sale_price: rawProduct.sale_price || rawProduct.salePrice,
    images: rawProduct.images || [],
    category: rawProduct.category || (rawProduct.category_id ? String(rawProduct.category_id) : undefined),
    category_id: rawProduct.category_id,
    colors: rawProduct.colors || [],
    sizes: rawProduct.sizes || [],
    isNew: rawProduct.isNew || rawProduct.is_new || false,
    is_new: rawProduct.is_new || rawProduct.isNew || false,
    isTrending: rawProduct.isTrending || rawProduct.is_trending || false,
    is_trending: rawProduct.is_trending || rawProduct.isTrending || false,
    rating: rawProduct.rating || 0,
    reviewCount: rawProduct.reviewCount || rawProduct.review_count || 0,
    review_count: rawProduct.review_count || rawProduct.reviewCount || 0,
    stock: rawProduct.stock || 0,
    tags: rawProduct.tags || [],
    shopId: rawProduct.shopId || rawProduct.shop_id,
    shop_id: rawProduct.shop_id || rawProduct.shopId,
    brand: rawProduct.brand,
    shopName: rawProduct.shopName,
    categoryId: rawProduct.categoryId,
    created_at: rawProduct.created_at,
    updated_at: rawProduct.updated_at
  };
}

// Export type for search results
export type SearchPageProduct = Partial<Product>;

// Type for wishlist context
export interface WishlistContextType {
  wishlist: string[];
  addToWishlist: (product: Product | string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  isLoading: boolean;
}

// Type for cart items
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  color: string;
  size: string;
}

// Type for cart context
export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, color: string, size: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  isInCart: (productId: string, color?: string, size?: string) => boolean;
  isLoading: boolean;
  migrateCartToUser: () => Promise<void>;
}

// Add the productStore with sample products for fallback
export const productStore = {
  products: Array.from({ length: 12 }, (_, i) => ({
    id: `product-${i + 1}`,
    name: `Product ${i + 1}`,
    description: `This is a sample product ${i + 1}`,
    price: 19.99 + i * 10,
    salePrice: i % 3 === 0 ? 14.99 + i * 8 : null,
    images: [`https://placehold.co/600x400?text=Product+${i + 1}`],
    category: 'category-' + Math.floor(i / 2 + 1),
    colors: ['red', 'blue', 'black'],
    sizes: ['S', 'M', 'L'],
    isNew: i < 4,
    isTrending: i >= 4 && i < 8,
    rating: 3.5 + (i % 3) * 0.5,
    reviewCount: 10 + i * 5,
    stock: 50 - i,
    tags: ['trending', 'new arrival'],
    shopId: `shop-${Math.floor(i / 4) + 1}`,
    brand: `Brand ${Math.floor(i / 3) + 1}`,
    shopName: `Shop ${Math.floor(i / 4) + 1}`,
    categoryId: `category-${Math.floor(i / 2) + 1}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }))
};

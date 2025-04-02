
// Define the core Product type
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sale_price?: number | null;
  salePrice?: number | null; // For compatibility with API responses
  images: string[];
  category?: string;
  category_id?: string; // For compatibility with API responses
  colors: string[];
  sizes: string[];
  is_new?: boolean;
  isNew?: boolean; // For compatibility with API responses 
  is_trending?: boolean;
  isTrending?: boolean; // For compatibility with API responses
  rating: number;
  review_count?: number;
  reviewCount?: number; // For compatibility with API responses
  stock: number;
  tags: string[];
  shop_id?: string;
  shopId?: string; // For compatibility with API responses
  created_at?: string; // For sorting products
  updated_at?: string; // For tracking updates
}

// Export SearchPageProduct type for search functionality
export type SearchPageProduct = Partial<Product>;

// Cart Item type
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  color: string;
  size: string;
}

// WishlistContextType for wishlist functionality
export interface WishlistContextType {
  wishlist: string[];
  addToWishlist: (product: Product | string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  isLoading: boolean;
}

// CartContextType for cart functionality
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

// Helper function to normalize product data between API response formats
export function normalizeProduct(rawProduct: any): Product {
  return {
    id: rawProduct.id,
    name: rawProduct.name || '',
    description: rawProduct.description || '',
    price: rawProduct.price || 0,
    salePrice: rawProduct.salePrice || rawProduct.sale_price,
    sale_price: rawProduct.sale_price || rawProduct.salePrice,
    images: rawProduct.images || [],
    category: rawProduct.category || (rawProduct.category_id ? String(rawProduct.category_id) : undefined),
    category_id: rawProduct.category_id,
    colors: rawProduct.colors || [],
    sizes: rawProduct.sizes || [],
    isNew: Boolean(rawProduct.isNew || rawProduct.is_new),
    is_new: Boolean(rawProduct.is_new || rawProduct.isNew),
    isTrending: Boolean(rawProduct.isTrending || rawProduct.is_trending),
    is_trending: Boolean(rawProduct.is_trending || rawProduct.isTrending),
    rating: rawProduct.rating || 0,
    reviewCount: rawProduct.reviewCount || rawProduct.review_count || 0,
    review_count: rawProduct.review_count || rawProduct.reviewCount || 0,
    stock: rawProduct.stock || 0,
    tags: rawProduct.tags || [],
    shopId: rawProduct.shopId || rawProduct.shop_id,
    shop_id: rawProduct.shop_id || rawProduct.shopId,
    created_at: rawProduct.created_at,
    updated_at: rawProduct.updated_at
  };
}

// Sample products for testing
export const productStore = {
  products: Array.from({ length: 12 }, (_, i) => ({
    id: `product-${i + 1}`,
    name: `Product ${i + 1}`,
    description: `This is a sample product ${i + 1}`,
    price: 19.99 + i * 10,
    salePrice: i % 3 === 0 ? 14.99 + i * 8 : null,
    sale_price: i % 3 === 0 ? 14.99 + i * 8 : null,
    images: [`https://placehold.co/600x400?text=Product+${i + 1}`],
    category: 'category-' + Math.floor(i / 2 + 1),
    category_id: 'category-' + Math.floor(i / 2 + 1),
    colors: ['red', 'blue', 'black'],
    sizes: ['S', 'M', 'L'],
    isNew: i < 4,
    is_new: i < 4,
    isTrending: i >= 4 && i < 8,
    is_trending: i >= 4 && i < 8,
    rating: 3.5 + (i % 3) * 0.5,
    reviewCount: 10 + i * 5,
    review_count: 10 + i * 5,
    stock: 50 - i,
    tags: ['trending', 'new arrival'],
    shopId: `shop-${Math.floor(i / 4) + 1}`,
    shop_id: `shop-${Math.floor(i / 4) + 1}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }))
};

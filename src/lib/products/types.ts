
// Define the core Product type that will be used throughout the application
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  sale_price?: number;
  images: string[];
  category: string;
  category_id?: string;
  colors: string[];
  sizes: string[];
  isNew: boolean;
  is_new?: boolean;
  isTrending: boolean;
  is_trending?: boolean;
  rating: number;
  reviewCount: number;
  review_count?: number;
  stock: number;
  tags: string[];
  shopId: string;
  shop_id?: string;
  brand?: string;
  shopName?: string;
  categoryId?: string;
  created_at?: string;
  updated_at?: string;
}

// Define the SearchPageProduct type with optional fields, but ensure stock is included
export interface SearchPageProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  salePrice?: number;
  sale_price?: number;
  images?: string[];
  category?: string;
  category_id?: string;
  colors?: string[];
  sizes?: string[];
  isNew?: boolean;
  is_new?: boolean;
  isTrending?: boolean;
  is_trending?: boolean;
  rating?: number;
  reviewCount?: number;
  review_count?: number;
  stock: number; // Making this required to match usage
  tags?: string[];
  shopId?: string;
  shop_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Helper function to normalize Supabase product data to our Product type
export function normalizeProductData(data: any): Product {
  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    price: data.price,
    salePrice: data.salePrice || data.sale_price,
    sale_price: data.sale_price || data.salePrice,
    images: data.images || [],
    category: data.category || (data.category_id ? String(data.category_id) : ''),
    category_id: data.category_id,
    colors: data.colors || [],
    sizes: data.sizes || [],
    isNew: Boolean(data.isNew || data.is_new),
    is_new: Boolean(data.is_new || data.isNew),
    isTrending: Boolean(data.isTrending || data.is_trending),
    is_trending: Boolean(data.is_trending || data.isTrending),
    rating: data.rating || 0,
    reviewCount: data.reviewCount || data.review_count || 0,
    review_count: data.review_count || data.reviewCount || 0,
    stock: data.stock || 0,
    tags: data.tags || [],
    shopId: data.shopId || data.shop_id || '',
    shop_id: data.shop_id || data.shopId || '',
    brand: data.brand,
    shopName: data.shopName,
    categoryId: data.categoryId,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
}

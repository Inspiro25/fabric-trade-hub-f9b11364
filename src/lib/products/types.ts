
export interface Product {
  id: string;
  name: string;
  price: number;
  sale_price?: number | null;
  salePrice?: number | null;
  images: string[];
  description: string;
  category_id: string;
  category?: string;
  colors: string[];
  sizes: string[];
  stock: number;
  rating: number;
  review_count: number;
  reviewCount?: number;
  shop_id: string | null;
  shopId?: string | null;
  is_new: boolean;
  isNew?: boolean;
  is_trending: boolean;
  isTrending?: boolean;
  tags: string[];
}

export function adaptProduct(product: any): Product {
  return {
    id: product.id || '',
    name: product.name || '',
    price: product.price || 0,
    sale_price: product.sale_price || product.salePrice || null,
    salePrice: product.salePrice || product.sale_price || null,
    images: product.images || [],
    description: product.description || '',
    category_id: product.category_id || product.category || '',
    category: product.category || product.category_id || '',
    colors: product.colors || [],
    sizes: product.sizes || [],
    stock: product.stock || 0,
    rating: product.rating || 0,
    review_count: product.review_count || product.reviewCount || 0,
    reviewCount: product.reviewCount || product.review_count || 0,
    shop_id: product.shop_id || product.shopId || null,
    shopId: product.shopId || product.shop_id || null,
    is_new: Boolean(product.is_new || product.isNew || false),
    isNew: Boolean(product.isNew || product.is_new || false),
    is_trending: Boolean(product.is_trending || product.isTrending || false),
    isTrending: Boolean(product.isTrending || product.is_trending || false),
    tags: product.tags || [],
  };
}


export interface Product {
  id: string;
  name: string;
  price: number;
  sale_price?: number | null;
  images: string[];
  description: string;
  category_id: string;
  category?: string;
  colors: string[];
  sizes: string[];
  stock: number;
  rating: number;
  review_count: number;
  reviewCount?: number; // Compatibility field
  shop_id: string | null;
  is_new: boolean;
  is_trending: boolean;
  tags: string[];
  
  // Add compatibility properties for easier migration
  get salePrice(): number | null | undefined {
    return this.sale_price;
  }
  
  get isNew(): boolean {
    return this.is_new;
  }
  
  get isTrending(): boolean {
    return this.is_trending;
  }
  
  get shopId(): string | null {
    return this.shop_id;
  }
}

// Add adapter function to convert between property naming styles
export function adaptProduct(product: any): Product {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    sale_price: product.sale_price ?? product.salePrice,
    images: product.images || [],
    description: product.description || '',
    category_id: product.category_id ?? product.category,
    category: product.category,
    colors: product.colors || [],
    sizes: product.sizes || [],
    stock: product.stock || 0,
    rating: product.rating || 0,
    review_count: product.review_count ?? product.reviewCount || 0,
    reviewCount: product.reviewCount ?? product.review_count || 0,
    shop_id: product.shop_id ?? product.shopId,
    is_new: product.is_new ?? product.isNew || false,
    is_trending: product.is_trending ?? product.isTrending || false,
    tags: product.tags || [],
  };
}

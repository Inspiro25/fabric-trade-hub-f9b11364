
// Export the Product interface
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sale_price?: number;
  salePrice?: number;
  images: string[];
  category: string;
  category_id?: string;
  categoryId?: string;
  shop_id?: string;
  shopId?: string;
  shopName?: string; 
  rating: number;
  review_count?: number;
  reviewCount: number;
  stock: number;
  colors?: string[];
  sizes?: string[];
  tags?: string[];
  is_new?: boolean;
  isNew?: boolean;
  is_trending?: boolean;
  isTrending?: boolean;
  brand?: string;
  specifications?: Record<string, string>;
  sku?: string;
  created_at?: string;
  updated_at?: string;
  views?: number;
  image?: string; // Adding image field for compatibility
}

// Add any additional product-related types here
export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

export interface ProductReview {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  images?: string[];
}

// Update ProductShowcaseProps definition with subtitle
export interface ProductShowcaseProps {
  title: string;
  subtitle?: string;
  products: Product[];
  linkTo?: string;
  isLoaded?: boolean;
  layout?: string;
  tag?: string;
  showViewAll?: boolean;
  highlight?: boolean;
}

// Update ProductGridProps definition with paginationClassName
export interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  columns?: number;
  showPagination?: boolean;
  itemsPerPage?: number;
  totalItems?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  showFilters?: boolean;
  paginationClassName?: string;
  isLoading?: boolean;
}

export interface ProductReviewsProps {
  productId: string;
  rating?: number;
  reviewCount?: number;
}

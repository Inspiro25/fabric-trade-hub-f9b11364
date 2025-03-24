
export interface SearchPageProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number | null;
  images: string[];
  category?: string;
  categoryId?: string;
  shopId?: string;
  shop?: string;
  isNew?: boolean;
  isTrending?: boolean;
  rating?: number;
  reviewCount?: number;
  colors?: string[];
  sizes?: string[];
  tags?: string[];
}

export type SortOption = 'featured' | 'price-low' | 'price-high' | 'newest' | 'rating';

export interface SearchFiltersState {
  category?: string;
  shop?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  colors?: string[];
  sizes?: string[];
  tags?: string[];
}

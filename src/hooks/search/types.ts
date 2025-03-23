
// Core product types
export interface SearchPageProduct {
  id: string;
  name: string;
  price: number;
  sale_price?: number;
  images: string[];
  category_id?: string;
  shop_id?: string;
  rating?: number;
  review_count?: number;
  is_new?: boolean;
  is_trending?: boolean;
  description?: string;
  colors?: string[];
  sizes?: string[];
  stock?: number;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  count?: number;
}

export interface Shop {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  rating?: number;
  productsCount?: number;
}

export interface ProductCardBaseProps {
  id: string;
  name: string;
  price: number;
  salePrice?: number | null;
  image: string;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  isTrending?: boolean;
}

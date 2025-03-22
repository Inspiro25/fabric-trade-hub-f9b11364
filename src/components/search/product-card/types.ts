
export interface SearchPageProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  sale_price: number | null;
  images: string[];
  category_id: string;
  shop_id: string;
  is_new: boolean;
  is_trending: boolean;
  colors: string[];
  sizes: string[];
  rating: number;
  review_count: number;
  stock?: number;
}

export interface ProductCardBaseProps {
  product: SearchPageProduct;
  isAddingToCart?: boolean | string | null;
  isAddingToWishlist?: boolean | string | null;
  onAddToCart?: (product: SearchPageProduct) => void;
  onAddToWishlist?: (product: SearchPageProduct) => void;
  onShare?: (product: SearchPageProduct) => void;
  onClick?: (product: SearchPageProduct) => void;
}

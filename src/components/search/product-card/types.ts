import { Product } from "@/lib/products/types";

export interface ProductCardBaseProps {
  product: SearchPageProduct | Product;
  isAddingToCart?: boolean | string;
  isAddingToWishlist?: boolean | string;
  onAddToCart?: (product: SearchPageProduct | Product) => void;
  onAddToWishlist?: (product: SearchPageProduct | Product) => void;
  onShare?: (product: SearchPageProduct | Product) => void;
  onClick?: (product: SearchPageProduct | Product) => void;
}

export interface SearchPageProduct {
  id: string;
  name: string;
  price: number;
  sale_price?: number;
  images: string[];
  rating?: number;
  review_count?: number;
  is_new?: boolean;
  is_trending?: boolean;
  brand?: string; // Add the missing brand property
  category?: string;
  available_colors?: string[];
  available_sizes?: string[];
}

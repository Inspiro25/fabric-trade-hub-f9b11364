
import { SearchPageProduct } from '@/lib/products/types';

export interface ProductCardBaseProps {
  product: SearchPageProduct;
  isAddingToCart?: string;
  isAddingToWishlist?: string;
  onAddToCart?: (product: SearchPageProduct) => void;
  onAddToWishlist?: (product: SearchPageProduct) => void;
  onShare?: (product: SearchPageProduct) => void;
  onClick?: (product: SearchPageProduct) => void;
  viewMode?: 'grid' | 'list' | 'compact';
  buttonColor?: string;
  isCompact?: boolean;
}

export { type SearchPageProduct };


import { SearchPageProduct } from '@/lib/products/types';

export interface ProductCardBaseProps {
  product: SearchPageProduct;
  isAddingToCart?: string | boolean;
  isAddingToWishlist?: string | boolean;
  onAddToCart?: (product: SearchPageProduct) => void;
  onAddToWishlist?: (product: SearchPageProduct) => void;
  onShare?: (product: SearchPageProduct) => void;
  onClick?: (product: SearchPageProduct) => void;
  buttonColor?: string;
  viewMode?: 'grid' | 'list';
  isCompact?: boolean;
}

export { type SearchPageProduct };


import { SearchPageProduct as SearchHookProduct } from '@/hooks/use-search';

export interface SearchPageProduct extends SearchHookProduct {}

export interface ProductCardBaseProps {
  product: SearchPageProduct;
  isAddingToCart?: boolean | string;
  isAddingToWishlist?: boolean | string;
  onAddToCart?: (product: SearchPageProduct) => void;
  onAddToWishlist?: (product: SearchPageProduct) => void;
  onShare?: (product: SearchPageProduct) => void;
  onClick?: (product: SearchPageProduct) => void;
  buttonColor?: string;
  viewMode?: 'grid' | 'list';
}


import { Product } from '@/lib/products/types';

export interface ProductShowcaseProps {
  title: string;
  subtitle?: string; // Add subtitle property
  products: Product[];
  linkTo?: string;
  isLoaded?: boolean;
  layout?: string;
  tag?: string;
  showViewAll?: boolean;
  highlight?: boolean;
}

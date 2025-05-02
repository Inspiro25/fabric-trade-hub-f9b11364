
import { Product } from '@/lib/products/types';

export interface ProductShowcaseProps {
  title: string;
  subtitle?: string;
  products: Product[];
  linkTo?: string;
  isLoaded?: boolean;
  layout?: 'grid' | 'carousel' | 'featured';
  highlight?: boolean;
  tag?: string;
  showViewAll?: boolean;
}

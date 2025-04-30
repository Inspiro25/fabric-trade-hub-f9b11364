
import { Product } from '@/lib/products/types';

export interface ProductShowcaseProps {
  products: Product[];
  title: string;
  subtitle?: string; // Make subtitle optional
  linkTo?: string;
  isLoaded?: boolean;
  layout?: string;
  tag?: string;
  showViewAll?: boolean;
  highlight?: boolean;
}

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

export interface DealOfTheDayProps {
  product?: Product;
}

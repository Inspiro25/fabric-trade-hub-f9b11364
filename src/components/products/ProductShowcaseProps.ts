
export interface ProductShowcaseProps {
  title: string;
  subtitle?: string; // Make subtitle optional
  products: any[];
  linkTo?: string;
  isLoaded?: boolean;
  layout?: string;
  tag?: string;
  showViewAll?: boolean;
  highlight?: boolean;
}

export interface ProductGridProps {
  products: any[];
  title?: string;
  subtitle?: string;
  columns?: number;
  showPagination?: boolean;
  itemsPerPage?: number;
  totalItems?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  showFilters?: boolean;
  paginationClassName?: string; // Add missing property
  isLoading?: boolean;
}

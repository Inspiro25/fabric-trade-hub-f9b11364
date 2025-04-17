import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { Product } from '@/lib/types/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Grid, List, SlidersHorizontal, Sparkles, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from '@/components/ui/ProductCard';
import { Pagination, PaginationContent, PaginationItem, PaginationFirst, PaginationPrevious, PaginationNext, PaginationLast, PaginationLink } from '@/components/ui/pagination';

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  columns?: number;
  className?: string;
  showPagination?: boolean;
  itemsPerPage?: number;
  totalItems?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  showFilters?: boolean;
  useAlternateLayout?: boolean;
  highlightType?: 'new' | 'trending' | 'sale' | null;
  isLoading?: boolean;
  isDarkMode?: boolean;
}

export const ProductGrid = ({
  products,
  title,
  subtitle,
  columns = 4,
  className = '',
  showPagination = false,
  itemsPerPage = 12,
  totalItems,
  currentPage = 1,
  onPageChange,
  showFilters = false,
  useAlternateLayout = false,
  highlightType = null,
  isLoading = false,
  isDarkMode = false,
}: ProductGridProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const isMobile = useIsMobile();
  
  // Calculate pagination
  let totalPages = 1;
  let displayedProducts = products;
  
  if (totalItems && itemsPerPage) {
    // External pagination (controlled by parent)
    totalPages = Math.ceil(totalItems / itemsPerPage);
  } else {
    // Internal pagination (self-managed)
    totalPages = Math.ceil(products.length / itemsPerPage);
    const startIdx = (currentPage - 1) * itemsPerPage;
    displayedProducts = products.slice(startIdx, startIdx + itemsPerPage);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      // Internal pagination
      window.scrollTo(0, 0);
    }
  };

  const getGridCols = () => {
    if (viewMode === 'list') return 'grid-cols-1';
    
    if (isMobile) {
      return 'grid-cols-2 sm:grid-cols-3';
    }
    
    switch (columns) {
      case 2:
        return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4';
      case 3:
        return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5';
      case 4:
      default:
        return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6';
    }
  };

  const getHighlightIcon = () => {
    switch (highlightType) {
      case 'new':
        return <Sparkles className="h-4 w-4 mr-2" />;
      case 'trending':
        return <TrendingUp className="h-4 w-4 mr-2" />;
      case 'sale':
        return <Badge variant="destructive" className="mr-2">SALE</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-64 w-full rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <div className={`container mx-auto px-2 md:px-4 ${className}`}>
      {(title || subtitle) && (
        <div className={`${useAlternateLayout ? 'text-left' : 'text-center'} mb-4`}>
          {title && (
            <div className="flex items-center justify-between">
              <h2 className={`${isMobile ? 'text-lg' : 'heading-lg'} mb-1 flex items-center`}>
                {getHighlightIcon()}
                {title}
              </h2>
              {useAlternateLayout && products.length > 0 && (
                <Badge variant="outline" className="font-normal">
                  {totalItems || products.length} products
                </Badge>
              )}
            </div>
          )}
          {subtitle && (
            <p className={`text-muted-foreground text-sm ${useAlternateLayout ? '' : 'max-w-2xl mx-auto'}`}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      {showFilters && (
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <Card className="w-full sm:w-auto">
            <CardContent className="p-2 flex items-center gap-1">
              <SlidersHorizontal className="h-3 w-3" />
              <span className="text-xs font-medium">Filters</span>
            </CardContent>
          </Card>
          
          <div className="flex items-center gap-1 ml-auto">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'outline'}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-3 w-3" />
              <span className="sr-only">Grid view</span>
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'outline'}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewMode('list')}
            >
              <List className="h-3 w-3" />
              <span className="sr-only">List view</span>
            </Button>
          </div>
        </div>
      )}
      
      <div className={`grid ${getGridCols()} gap-2 md:gap-4`}>
        {displayedProducts.map((product, index) => (
          <div 
            key={product.id} 
            className={`transition-all duration-500 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } ${viewMode === 'list' ? 'col-span-full' : ''}`}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <ProductCard
              id={product.id}
              name={product.name}
              price={product.price}
              salePrice={product.salePrice}
              image={product.images[0]}
              category={product.category}
              isNew={product.isNew}
              isTrending={product.isTrending}
              layout={viewMode === 'list' ? 'horizontal' : 'vertical'}
              rating={product.rating}
              reviewCount={product.reviewCount}
            />
          </div>
        ))}
      </div>
      
      {showPagination && totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              {totalPages > 3 && (
                <PaginationItem>
                  <PaginationFirst 
                    onClick={() => handlePageChange(1)}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              )}
              
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              
              {/* Dynamic page numbers */}
              {(() => {
                // Calculate which page numbers to show
                let startPage = Math.max(1, currentPage - 1);
                let endPage = Math.min(totalPages, startPage + 2);
                
                // Adjust if we're near the end
                if (endPage - startPage < 2) {
                  startPage = Math.max(1, endPage - 2);
                }
                
                const pages = [];
                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <PaginationItem key={i}>
                      <PaginationLink 
                        isActive={currentPage === i}
                        onClick={() => handlePageChange(i)}
                      >
                        {i}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                return pages;
              })()}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              
              {totalPages > 3 && (
                <PaginationItem>
                  <PaginationLast 
                    onClick={() => handlePageChange(totalPages)}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;

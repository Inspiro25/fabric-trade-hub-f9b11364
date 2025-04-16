import React, { useCallback } from 'react';
import { SearchProductCard, SearchProductCardSkeleton } from './SearchProductCard';
import { SearchPageProduct } from '@/hooks/search/types';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useSearchDialogs } from '@/hooks/search/use-search-dialogs';
import { Grid, ListFilter, LayoutGrid, LayoutList, ChevronsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchViewMode } from '@/hooks/search/use-search-filters';
import SearchPagination from './SearchPagination';

export interface SearchResultsProps {
  products: SearchPageProduct[];
  loading?: boolean;
  isLoading?: boolean;
  error?: string;
  totalProducts: number;
  isAddingToCart?: string;
  isAddingToWishlist?: string;
  onAddToCart?: (product: SearchPageProduct) => void;
  onAddToWishlist?: (product: SearchPageProduct) => void;
  onShareProduct?: (product: SearchPageProduct) => void;
  onProductClick?: (product: SearchPageProduct) => void;
  onSelectProduct?: (id: string) => void;
  onRetry?: () => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (count: number) => void;
  viewMode: 'grid' | 'list' | 'compact';
  onViewModeChange: (mode: 'grid' | 'list' | 'compact') => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  products, 
  loading = false,
  isLoading = false,
  error = null,
  totalProducts,
  isAddingToCart,
  isAddingToWishlist,
  onAddToCart,
  onAddToWishlist,
  onShareProduct,
  onProductClick,
  onSelectProduct,
  onRetry,
  currentPage,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  viewMode,
  onViewModeChange
}) => {
  const navigate = useNavigate();
  const { setIsDialogOpen, setIsShareDialogOpen, setShareableLink } = useSearchDialogs();
  const { isDarkMode } = useTheme();
  const { currentUser } = useAuth();
  
  const isAuthenticated = !!currentUser;

  // Use either loading or isLoading
  const isLoadingState = loading || isLoading;

  const handleProductClick = (product: SearchPageProduct) => {
    // Navigate to product detail page
    navigate(`/products/${product.id}`);
    
    if (onProductClick) {
      onProductClick(product);
    } else if (onSelectProduct) {
      onSelectProduct(product.id);
    }
  };

  const handleAddToCart = useCallback((product: SearchPageProduct) => {
    if (!isAuthenticated) {
      setIsDialogOpen(true);
      return;
    }
    
    onAddToCart(product);
    
    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
    });
  }, [isAuthenticated, setIsDialogOpen, onAddToCart]);

  const handleAddToWishlist = useCallback((product: SearchPageProduct) => {
    if (!isAuthenticated) {
      setIsDialogOpen(true);
      return;
    }
    
    onAddToWishlist(product);
    
    toast({
      title: "Added to wishlist",
      description: `${product.name} added to your wishlist`,
    });
  }, [isAuthenticated, setIsDialogOpen, onAddToWishlist]);

  const handleShare = useCallback((product: SearchPageProduct) => {
    const shareUrl = `${window.location.origin}/product/${product.id}`;
    setShareableLink(shareUrl);
    setIsShareDialogOpen(true);
  }, [setIsShareDialogOpen, setShareableLink]);

  // Loading state
  if (isLoadingState) {
    return (
      <div className="w-full">
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-2">
            <span className={cn("text-xs", isDarkMode ? "text-gray-400" : "text-gray-500")}>View:</span>
            <div className="flex border rounded-md overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-none",
                  viewMode === 'grid' && (isDarkMode ? "bg-gray-700" : "bg-gray-100")
                )}
                onClick={() => onViewModeChange('grid')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-none",
                  viewMode === 'list' && (isDarkMode ? "bg-gray-700" : "bg-gray-100")
                )}
                onClick={() => onViewModeChange('list')}
              >
                <LayoutList className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-none",
                  viewMode === 'compact' && (isDarkMode ? "bg-gray-700" : "bg-gray-100")
                )}
                onClick={() => onViewModeChange('compact')}
              >
                <ChevronsDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className={cn(
          viewMode === 'grid'
            ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            : viewMode === 'list'
            ? "flex flex-col gap-4"
            : "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2" // Compact view
        )}>
          {Array.from({ length: 8 }).map((_, index) => (
            <SearchProductCardSkeleton key={index} viewMode={viewMode === 'compact' ? 'grid' : viewMode} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-2">
          <span className={cn("text-xs", isDarkMode ? "text-gray-400" : "text-gray-500")}>View:</span>
          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-none",
                viewMode === 'grid' && (isDarkMode ? "bg-gray-700" : "bg-gray-100")
              )}
              onClick={() => onViewModeChange('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-none",
                viewMode === 'list' && (isDarkMode ? "bg-gray-700" : "bg-gray-100")
              )}
              onClick={() => onViewModeChange('list')}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-none",
                viewMode === 'compact' && (isDarkMode ? "bg-gray-700" : "bg-gray-100")
              )}
              onClick={() => onViewModeChange('compact')}
            >
              <ChevronsDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className={cn(
        viewMode === 'grid'
          ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          : viewMode === 'list'
          ? "flex flex-col gap-4"
          : "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2" // Compact view
      )}>
        {products.map(product => (
          <div key={product.id} onClick={() => handleProductClick(product)} style={{ cursor: 'pointer' }}>
            <SearchProductCard
              product={product}
              onAddToCart={() => handleAddToCart(product)}
              onAddToWishlist={() => handleAddToWishlist(product)}
              onShare={() => handleShare(product)}
              onClick={() => handleProductClick(product)}
              viewMode={viewMode}
              buttonColor={isDarkMode ? "bg-orange-600 hover:bg-orange-700" : ""}
              isCompact={viewMode === 'compact'}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;

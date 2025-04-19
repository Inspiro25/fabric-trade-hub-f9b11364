import React, { useCallback } from 'react';
import { SearchProductCard, SearchProductCardSkeleton } from './SearchProductCard';
import { SearchPageProduct } from '@/hooks/search/types';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useSearchDialogs } from '@/hooks/search/use-search-dialogs';
import { Grid, ListFilter, LayoutGrid, LayoutList } from 'lucide-react';
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
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
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
            </div>
          </div>
        </div>
        
        <div className={cn(
          viewMode === 'grid'
            ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            : "flex flex-col gap-4"
        )}>
          {Array.from({ length: 8 }).map((_, index) => (
            <SearchProductCardSkeleton key={index} viewMode={viewMode} />
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
          </div>
        </div>
      </div>
      
      <div className={cn(
        viewMode === 'grid'
          ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          : "flex flex-col gap-4"
      )}>
        {products.map(product => (
          <SearchProductCard
            key={product.id}
            product={product}
            onAddToCart={() => handleAddToCart(product)}
            onAddToWishlist={() => handleAddToWishlist(product)}
            onShare={() => handleShare(product)}
            onClick={() => handleProductClick(product)}
            viewMode={viewMode}
            buttonColor={isDarkMode ? "bg-blue-600 hover:bg-blue-700" : ""}
            isCompact={false}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;

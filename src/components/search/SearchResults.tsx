
import React, { useCallback } from 'react';
import { SearchProductCard, SearchProductCardSkeleton } from './SearchProductCard';
import { SearchPageProduct } from '@/hooks/search/types';
import { useSearchViewMode } from '@/hooks/search/use-search-filters';
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

interface SearchResultsProps {
  products: SearchPageProduct[];
  isLoading: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({ products, isLoading }) => {
  const navigate = useNavigate();
  const { viewMode, setViewMode } = useSearchViewMode();
  const { addToCart, isAddingToCart, isProductInCart } = useCart();
  const { addToWishlist, isAddingToWishlist, isProductInWishlist } = useWishlist();
  const { showShareDialog, showAuthDialog } = useSearchDialogs();
  const { isDarkMode } = useTheme();
  const { isAuthenticated } = useAuth();

  const handleProductClick = useCallback((productId: string) => {
    navigate(`/product/${productId}`);
  }, [navigate]);

  const handleAddToCart = useCallback((product: SearchPageProduct) => {
    if (!isAuthenticated) {
      showAuthDialog();
      return;
    }
    
    if (isProductInCart(product.id)) {
      toast({
        title: "Already in cart",
        description: "This product is already in your cart",
        variant: "default",
      });
      return;
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      image: product.images[0],
      quantity: 1,
      color: product.colors ? product.colors[0] : null,
      size: product.sizes ? product.sizes[0] : null,
    });
  }, [addToCart, isAuthenticated, isProductInCart, showAuthDialog]);

  const handleAddToWishlist = useCallback((product: SearchPageProduct) => {
    if (!isAuthenticated) {
      showAuthDialog();
      return;
    }
    
    if (isProductInWishlist(product.id)) {
      toast({
        title: "Already in wishlist",
        description: "This product is already in your wishlist",
        variant: "default",
      });
      return;
    }
    
    addToWishlist({
      id: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      image: product.images[0],
    });
  }, [addToWishlist, isAuthenticated, isProductInWishlist, showAuthDialog]);

  const handleShare = useCallback((product: SearchPageProduct) => {
    showShareDialog({
      title: product.name,
      image: product.images[0],
      url: `/product/${product.id}`,
    });
  }, [showShareDialog]);

  // Loading state
  if (isLoading) {
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
                onClick={() => setViewMode('grid')}
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
                onClick={() => setViewMode('list')}
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
              onClick={() => setViewMode('grid')}
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
              onClick={() => setViewMode('list')}
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
            onClick={() => handleProductClick(product.id)}
            viewMode={viewMode}
            buttonColor={isDarkMode ? "bg-orange-600 hover:bg-orange-700" : ""}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;

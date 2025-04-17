import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchDialogs } from '@/hooks/search/use-search-dialogs';
import { SearchPageProduct } from '@/hooks/search/types';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { SearchProductCard } from './SearchProductCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

interface SearchRecommendationsProps {
  // Original props
  recommendations?: SearchPageProduct[];
  recentlyViewed?: SearchPageProduct[];
  
  // Compatibility with Search page props
  products?: SearchPageProduct[];
  isAddingToCart?: string;
  isAddingToWishlist?: string;
  onAddToCart?: (product: SearchPageProduct) => void;
  onAddToWishlist?: (product: SearchPageProduct) => void;
  onShareProduct?: (product: SearchPageProduct) => string;
  onSelectProduct?: (id: string) => void;
  
  // Optional display props
  isCompact?: boolean;
  emptyStateIcon?: React.ReactNode;
  emptyStateTitle?: string;
  emptyStateMessage?: string;
  title?: string;
}

const SearchRecommendations: React.FC<SearchRecommendationsProps> = ({ 
  // Handle both prop patterns
  recommendations = [],
  recentlyViewed = [],
  products = [],
  isCompact = false,
  onAddToCart: propAddToCart,
  onAddToWishlist: propAddToWishlist,
  onShareProduct: propShareProduct,
  onSelectProduct,
  emptyStateIcon,
  emptyStateTitle = "No recommendations available",
  emptyStateMessage = "We couldn't find any recommendations for you at this time",
  title = "You may also like"
}) => {
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const { setIsDialogOpen, setIsShareDialogOpen, setShareableLink } = useSearchDialogs();
  const { isDarkMode } = useTheme();
  const { currentUser } = useAuth();
  
  const isAuthenticated = !!currentUser;
  
  // Use products prop if recommendations is empty (for compatibility)
  const recommendationsToShow = recommendations.length > 0 ? recommendations : products;

  const handleAddToCart = (product: SearchPageProduct) => {
    if (propAddToCart) {
      // Use the prop function if provided
      propAddToCart(product);
      return;
    }
    
    if (!isAuthenticated) {
      setIsDialogOpen(true);
      return;
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.sale_price || product.price,
      image: product.images[0],
      quantity: 1,
      color: product.colors ? product.colors[0] : null,
      size: product.sizes ? product.sizes[0] : null,
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  const handleAddToWishlist = (product: SearchPageProduct) => {
    if (propAddToWishlist) {
      // Use the prop function if provided
      propAddToWishlist(product);
      return;
    }
    
    if (!isAuthenticated) {
      setIsDialogOpen(true);
      return;
    }
    
    addToWishlist({
      id: product.id,
      name: product.name,
      price: product.sale_price || product.price,
      image: product.images[0],
    });
    
    toast({
      title: "Added to wishlist",
      description: `${product.name} has been added to your wishlist`,
    });
  };

  const handleShare = (product: SearchPageProduct) => {
    if (propShareProduct) {
      // Use the prop function if provided
      propShareProduct(product);
      return;
    }
    
    const shareUrl = `${window.location.origin}/product/${product.id}`;
    setShareableLink(shareUrl);
    setIsShareDialogOpen(true);
  };
  
  const handleProductClick = (productId: string) => {
    if (onSelectProduct) {
      onSelectProduct(productId);
    }
  };

  const hasNoData = recommendationsToShow.length === 0 && recentlyViewed.length === 0;
  
  if (hasNoData) {
    return (
      <div className="text-center py-8">
        {emptyStateIcon || <div className="text-gray-400 text-4xl mb-2">🔍</div>}
        <h3 className="font-medium text-lg mb-1">{emptyStateTitle}</h3>
        <p className="text-gray-500 dark:text-gray-400">{emptyStateMessage}</p>
      </div>
    );
  }

  // If we only have products (no recommendations/recentlyViewed), render a simpler view
  if (recommendationsToShow.length > 0 && recentlyViewed.length === 0) {
    return (
      <div className={cn("mb-8", isDarkMode ? "text-white" : "")}>
        {title && <h2 className="text-lg font-medium mb-4">{title}</h2>}
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendationsToShow.map(product => (
            <SearchProductCard
              key={product.id}
              product={product}
              onAddToCart={() => handleAddToCart(product)}
              onAddToWishlist={() => handleAddToWishlist(product)}
              onShare={() => handleShare(product)}
              onClick={() => handleProductClick(product.id)}
              viewMode="grid"
              isCompact={isCompact}
              buttonColor={isDarkMode ? "bg-orange-600 hover:bg-orange-700" : ""}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("mb-8", isDarkMode ? "text-white" : "")}>
      {title && <h2 className="text-lg font-medium mb-4">{title}</h2>}
      
      <Tabs defaultValue="recommendations" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="recommendations">Recommended</TabsTrigger>
          {recentlyViewed.length > 0 && (
            <TabsTrigger value="recently-viewed">Recently Viewed</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="recommendations">
          {recommendationsToShow.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {recommendationsToShow.map(product => (
                <SearchProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => handleAddToCart(product)}
                  onAddToWishlist={() => handleAddToWishlist(product)}
                  onShare={() => handleShare(product)}
                  onClick={() => handleProductClick(product.id)}
                  viewMode="grid"
                  isCompact={isCompact}
                  buttonColor={isDarkMode ? "bg-orange-600 hover:bg-orange-700" : ""}
                />
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500 dark:text-gray-400">
              No recommendations available
            </p>
          )}
        </TabsContent>
        
        {recentlyViewed.length > 0 && (
          <TabsContent value="recently-viewed">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {recentlyViewed.map(product => (
                <SearchProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => handleAddToCart(product)}
                  onAddToWishlist={() => handleAddToWishlist(product)}
                  onShare={() => handleShare(product)}
                  onClick={() => handleProductClick(product.id)}
                  viewMode="grid"
                  isCompact={isCompact}
                  buttonColor={isDarkMode ? "bg-orange-600 hover:bg-orange-700" : ""}
                />
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default SearchRecommendations;

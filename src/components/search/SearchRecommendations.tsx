
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
  recommendations: SearchPageProduct[];
  recentlyViewed: SearchPageProduct[];
  isCompact?: boolean;
}

const SearchRecommendations: React.FC<SearchRecommendationsProps> = ({ 
  recommendations, 
  recentlyViewed,
  isCompact = false
}) => {
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const { setIsDialogOpen, setIsShareDialogOpen, setShareableLink } = useSearchDialogs();
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  
  const isAuthenticated = !!user;

  const handleAddToCart = (product: SearchPageProduct) => {
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
    const shareUrl = `${window.location.origin}/product/${product.id}`;
    setShareableLink(shareUrl);
    setIsShareDialogOpen(true);
  };

  const hasNoData = recommendations.length === 0 && recentlyViewed.length === 0;
  
  if (hasNoData) {
    return null;
  }

  return (
    <div className={cn(
      "mb-8",
      isDarkMode ? "text-white" : ""
    )}>
      <h2 className="text-lg font-medium mb-4">You may also like</h2>
      
      <Tabs defaultValue="recommendations" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="recommendations">Recommended</TabsTrigger>
          {recentlyViewed.length > 0 && (
            <TabsTrigger value="recently-viewed">Recently Viewed</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="recommendations">
          {recommendations.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {recommendations.map(product => (
                <SearchProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => handleAddToCart(product)}
                  onAddToWishlist={() => handleAddToWishlist(product)}
                  onShare={() => handleShare(product)}
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

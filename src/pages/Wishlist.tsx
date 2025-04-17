
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Product } from '@/lib/types/product';
import { useWishlist } from '@/contexts/WishlistContext';
import ProductCard from '@/components/ui/ProductCard';
import EmptyWishlist from '@/components/cart/EmptyWishlist';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import AuthDialog from '@/components/search/AuthDialog';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { wishlist, isLoading } = useWishlist();
  const { currentUser, loading: authLoading } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const isMobile = useIsMobile();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    // Set isLoaded after a short delay to trigger animations
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    window.location.href = '/authentication';
  };

  useEffect(() => {
    if (!authLoading && !currentUser) {
      setShowAuthDialog(true);
      return;
    }

    const fetchWishlistItems = async () => {
      if (!currentUser || wishlist.length === 0) {
        setWishlistItems([]);
        setIsLoaded(true);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            shop:shops(id, name),
            category:categories(id, name)
          `)
          .in('id', wishlist);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const mappedProducts = data.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            salePrice: item.sale_price,
            images: item.images || [],
            category: item.category?.name || '',
            categoryId: item.category?.id || '',
            reviewCount: item.review_count || 0,
            isNew: item.is_new || false,
            isTrending: item.is_trending || false,
            shopId: item.shop?.id || null,
            shopName: item.shop?.name || ''
          }));
          
          setWishlistItems(mappedProducts);
        } else {
          setWishlistItems([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to mock data if needed
        const { mockProducts } = await import('@/lib/products');
        const productsInWishlist = mockProducts.filter(product => 
          wishlist.includes(product.id)
        );
        setWishlistItems(productsInWishlist);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchWishlistItems();
  }, [currentUser, wishlist, authLoading]);

  if (isLoading || authLoading) {
    return (
      <div className={cn(
        "container mx-auto px-4 py-12 flex items-center justify-center",
        isDarkMode 
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
          : "bg-gradient-to-br from-orange-50 via-orange-50/80 to-white"
      )}>
        <Loader2 className={cn(
          "h-8 w-8 animate-spin",
          isDarkMode ? "text-orange-500" : "text-primary"
        )} />
        <p className={cn(
          "ml-2",
          isDarkMode ? "text-gray-300" : "text-muted-foreground"
        )}>Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <div className={cn(
      "container mx-auto px-4 py-6 max-w-5xl min-h-screen",
      isDarkMode 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
        : "bg-gradient-to-br from-orange-50 via-orange-50/80 to-white"
    )}>
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          asChild 
          className={cn(
            "mr-2 h-8 w-8",
            isDarkMode && "hover:bg-gray-800 text-gray-300"
          )}
        >
          <Link to="/" aria-label="Back to shopping">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className={cn(
          "text-xl font-semibold",
          isDarkMode && "text-white"
        )}>My Wishlist</h1>
      </div>

      {wishlistItems.length === 0 ? (
        <div className={`transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <EmptyWishlist />
        </div>
      ) : (
        <div className={`transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className={cn(
            "rounded-xl shadow-sm overflow-hidden mb-6",
            isDarkMode ? "bg-gray-800" : "bg-white"
          )}>
            <div className={cn(
              "p-3",
              isDarkMode ? "border-b border-gray-700" : "border-b border-gray-100"
            )}>
              <p className={cn(
                "text-sm font-medium",
                isDarkMode && "text-gray-200"
              )}>
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
            <div className={cn(
              isMobile ? 'grid-cols-2 gap-3 p-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6',
              "grid"
            )}>
              {wishlistItems.map((product) => (
                <ProductCard key={product.id} product={product} variant="compact" />
              ))}
            </div>
          </div>
        </div>
      )}
      
      {showAuthDialog && (
        <AuthDialog
          open={showAuthDialog}
          onOpenChange={setShowAuthDialog}
          onLogin={handleLogin}
          title="Authentication Required"
          message="You need to be logged in to view your wishlist."
        />
      )}
    </div>
  );
};

export default Wishlist;

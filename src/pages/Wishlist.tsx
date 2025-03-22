import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Product } from '@/lib/products';
import { useWishlist } from '@/contexts/WishlistContext';
import ProductCard from '@/components/ui/ProductCard';
import EmptyWishlist from '@/components/cart/EmptyWishlist';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { wishlist, isLoading } = useWishlist();
  const isMobile = useIsMobile();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    const fetchWishlistItems = async () => {
      if (wishlist.length === 0) {
        setWishlistItems([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .in('id', wishlist);
        
        if (error) {
          console.error('Error fetching wishlist products:', error);
          import('@/lib/products').then(({ mockProducts }) => {
            const productsInWishlist = mockProducts.filter(product => 
              wishlist.includes(product.id)
            );
            setWishlistItems(productsInWishlist);
          });
          return;
        }
        
        if (data && data.length > 0) {
          setWishlistItems(data as unknown as Product[]);
        } else {
          setWishlistItems([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        import('@/lib/products').then(({ mockProducts }) => {
          const productsInWishlist = mockProducts.filter(product => 
            wishlist.includes(product.id)
          );
          setWishlistItems(productsInWishlist);
        });
      }
    };

    fetchWishlistItems();
    return () => clearTimeout(timer);
  }, [wishlist]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center bg-gradient-to-br from-orange-50 via-orange-50/80 to-white">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl bg-gradient-to-br from-orange-50 via-orange-50/80 to-white min-h-screen">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          asChild 
          className="mr-2 h-8 w-8"
        >
          <Link to="/" aria-label="Back to shopping">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold">My Wishlist</h1>
      </div>

      {wishlistItems.length === 0 ? (
        <div className={`transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <EmptyWishlist />
        </div>
      ) : (
        <div className={`transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="border-b border-gray-100 p-3">
              <p className="text-sm font-medium">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
            <div className={`grid ${isMobile ? 'grid-cols-2 gap-3 p-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6'}`}>
              {wishlistItems.map((product) => (
                <ProductCard key={product.id} product={product} variant="compact" />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;

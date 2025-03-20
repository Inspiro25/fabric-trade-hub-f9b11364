
import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '@/contexts/WishlistContext';
import ProductGrid from '@/components/features/ProductGrid';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { getAllProducts } from '@/lib/products';

const Wishlist = () => {
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const allProducts = getAllProducts();
  
  // Filter products that are in the wishlist
  const wishlistProducts = allProducts.filter(product => wishlist.includes(product.id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="animate-page-transition pb-16 md:pb-0">
      {/* Mobile Header */}
      {isMobile && (
        <div className="sticky top-0 z-10 bg-background border-b px-4 py-3 flex items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-medium ml-2">My Wishlist</h1>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        {!isMobile && (
          <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
        )}

        {wishlistProducts.length > 0 ? (
          <ProductGrid 
            products={wishlistProducts} 
            title={isMobile ? "" : "Items you've saved"} 
            subtitle={isMobile ? "" : "Products you've added to your wishlist"} 
          />
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-4">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">Save items you like to your wishlist and they will appear here</p>
            <Button onClick={() => navigate('/')}>Continue Shopping</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;

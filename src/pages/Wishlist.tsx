
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Product } from '@/lib/products/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { Skeleton } from '@/components/ui/skeleton';
import { getWishlistItems } from '@/lib/supabase/wishlist';
import { getProductsByIds } from '@/lib/products/base';

const WishlistPage = () => {
  const { currentUser } = useAuth();
  const { removeFromWishlist } = useWishlist();
  const { isDarkMode } = useTheme();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlistProducts = useCallback(async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    
    try {
      const wishlistItems = await getWishlistItems(currentUser.id);
      const productIds = wishlistItems.map(item => item.product_id);
      
      if (productIds.length === 0) {
        setWishlistProducts([]);
        setLoading(false);
        return;
      }
      
      const products = await getProductsByIds(productIds);
      
      if (products && products.length > 0) {
        const formattedProducts = products.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description || '',
          price: product.price,
          salePrice: product.sale_price,
          images: product.images || [],
          category: product.category || product.category_id || '',
          categoryId: product.category_id,
          rating: product.rating || 0,
          reviewCount: product.review_count || 0,
          stock: product.stock || 0,
          isNew: product.is_new || false,
          isTrending: product.is_trending || false,
          shopId: product.shop_id || '',
          shopName: product.shopName || '',
          colors: product.colors || [],
          sizes: product.sizes || [],
          tags: product.tags || []
        }));
        setWishlistProducts(formattedProducts as Product[]);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to load your wishlist",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchWishlistProducts();
  }, [fetchWishlistProducts]);

  const handleRemoveFromWishlist = async (productId: string) => {
    if (!currentUser) {
      toast({
        title: "Not logged in",
        description: "You must be logged in to manage your wishlist.",
        variant: "destructive",
      });
      return;
    }

    try {
      await removeFromWishlist(productId);
      setWishlistProducts(prevProducts =>
        prevProducts.filter(product => product.id !== productId)
      );
      toast({
        title: "Removed",
        description: "Product removed from your wishlist.",
      });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to remove product from wishlist.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className={cn(
        "min-h-screen py-6",
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      )}>
        <div className="container mx-auto px-4">
          <h1 className={cn(
            "text-2xl font-semibold mb-4",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>Wishlist</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-40 w-full rounded-md" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen py-6",
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    )}>
      <div className="container mx-auto px-4">
        <h1 className={cn(
          "text-2xl font-semibold mb-4",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>Wishlist</h1>
        
        {wishlistProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className={cn(
              "text-gray-500 text-lg",
              isDarkMode ? "text-gray-400" : ""
            )}>Your wishlist is empty.</p>
            <Button asChild variant="link" className="mt-4">
              <Link to="/">Explore Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlistProducts.map((product) => (
              <Card key={product.id} className={cn(
                "bg-white shadow-md rounded-md overflow-hidden",
                isDarkMode ? "bg-gray-800 border border-gray-700" : ""
              )}>
                <div className="relative aspect-w-4 aspect-h-3">
                  <img
                    src={product.images?.[0] || '/placeholder.png'}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardContent className="p-4">
                  <CardTitle className={cn(
                    "text-lg font-semibold mb-2 truncate",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}>{product.name}</CardTitle>
                  <CardDescription className={cn(
                    "text-gray-500 truncate",
                    isDarkMode ? "text-gray-400" : ""
                  )}>{product.description}</CardDescription>
                  <div className="mt-4 flex items-center justify-between">
                    <span className={cn(
                      "text-xl font-bold",
                      isDarkMode ? "text-blue-400" : "text-gray-900"
                    )}>₹{product.price}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveFromWishlist(product.id)}
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;

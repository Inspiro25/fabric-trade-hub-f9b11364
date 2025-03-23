
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProductById } from '@/lib/products';
import { recordProductView } from '@/lib/products/trending';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
// Remove the AppHeader import as it's already included in the MobileAppLayout
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingCart, ArrowLeft, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from '@/components/ui/ProductCard';
import ReviewForm from '@/components/reviews/ReviewForm';
import { fetchProductReviews } from '@/lib/supabase/reviews';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { getPersonalizedRecommendations, getSimilarProducts } from '@/services/recommendationService';
import { toast } from '@/hooks/use-toast';
import { Product } from '@/lib/types/product';
import { useTheme } from '@/contexts/ThemeContext';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const { isDarkMode } = useTheme();
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id!),
    enabled: !!id,
  });

  useEffect(() => {
    // Record the product view for trending data
    const recordView = async () => {
      if (id) {
        try {
          // Get Supabase user ID if available
          const { data: { session } } = await supabase.auth.getSession();
          const userId = session?.user?.id;
          
          // Record the view with optional user ID
          await recordProductView(id, userId);
        } catch (error) {
          console.error('Error recording product view:', error);
        }
      }
    };
    
    recordView();
  }, [id]);

  const { addToCart } = useCart();
  const [isAddingToCart, setIsAddingToCart] = React.useState(false);
  const [recommendedProducts, setRecommendedProducts] = React.useState<Product[]>([]);
  const [similarProducts, setSimilarProducts] = React.useState<Product[]>([]);

  React.useEffect(() => {
    const loadRecommendations = async () => {
      if (currentUser && id) {
        try {
          // Use uid, id, or email as fallback for userId
          const userId = currentUser.uid || currentUser.email || '';
          if (userId) {
            try {
              const recommendations = await getPersonalizedRecommendations(userId);
              if (recommendations) {
                setRecommendedProducts(recommendations);
              }
            } catch (error) {
              console.error('Error loading recommendations:', error);
            }
          }
        } catch (error) {
          console.error('Error processing user ID for recommendations:', error);
        }
      }
    };
    
    const loadSimilarProducts = async () => {
      if (id) {
        try {
          const similar = await getSimilarProducts(id);
          if (similar) {
            setSimilarProducts(similar);
          }
        } catch (error) {
          console.error('Error loading similar products:', error);
        }
      }
    };

    loadRecommendations();
    loadSimilarProducts();
  }, [currentUser, id]);

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAddingToCart(true);
    try {
      // Pass color, size, and quantity for the cart item
      // Default to first available color/size if product has them, otherwise empty strings
      const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : '';
      const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : '';
      await addToCart(product, 1, defaultColor, defaultSize);
      
      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to cart. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
      <div className={cn(
        "min-h-screen",
        isDarkMode ? "bg-slate-900" : "bg-slate-50"
      )}>
        {/* Remove AppHeader here */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Skeleton className={cn(
                "w-full aspect-square rounded-lg",
                isDarkMode ? "bg-gray-800" : ""
              )} />
            </div>
            <div>
              <Skeleton className={cn(
                "h-8 w-3/4 mb-4",
                isDarkMode ? "bg-gray-800" : ""
              )} />
              <Skeleton className={cn(
                "h-6 w-1/2 mb-4",
                isDarkMode ? "bg-gray-800" : ""
              )} />
              <Skeleton className={cn(
                "h-4 w-full mb-2",
                isDarkMode ? "bg-gray-800" : ""
              )} />
              <Skeleton className={cn(
                "h-4 w-full mb-2",
                isDarkMode ? "bg-gray-800" : ""
              )} />
              <Skeleton className={cn(
                "h-4 w-full mb-4",
                isDarkMode ? "bg-gray-800" : ""
              )} />
              <Skeleton className={cn(
                "h-10 w-1/2",
                isDarkMode ? "bg-gray-800" : ""
              )} />
            </div>
          </div>
          <Skeleton className={cn(
            "h-12 w-1/4 mt-8 mb-4",
            isDarkMode ? "bg-gray-800" : ""
          )} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className={cn(
                "h-48 w-full rounded-lg",
                isDarkMode ? "bg-gray-800" : ""
              )} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={cn(
        "min-h-screen",
        isDarkMode ? "bg-slate-900" : "bg-slate-50"
      )}>
        {/* Remove AppHeader here */}
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-red-500">Failed to load product. Please try again.</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen",
      isDarkMode ? "bg-slate-900" : "bg-slate-50"
    )}>
      {/* Remove AppHeader here */}
      
      <div className="container mx-auto px-4 py-8">
        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full max-w-md"
            >
              <CarouselContent className="h-80 rounded-lg">
                {product?.images.map((image, index) => (
                  <CarouselItem key={index} className="md:basis-1/1">
                    <div className="p-1">
                      <img
                        src={image}
                        alt={`${product.name} - Image ${index + 1}`}
                        className="aspect-square object-cover rounded-lg"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>

          {/* Product Info */}
          <div>
            <h1 className={cn(
              "text-2xl font-bold mb-2",
              isDarkMode && "text-white"
            )}>{product?.name}</h1>
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(product?.rating || 0) ? 'text-yellow-500 fill-yellow-500' : isDarkMode ? 'text-gray-600' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className={cn(
                "text-sm ml-2",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}>
                {product?.rating} ({product?.reviewCount} reviews)
              </span>
            </div>
            
            {product?.salePrice !== undefined && product.salePrice > 0 ? (
              <div className="flex items-center mb-4">
                <span className={cn(
                  "text-xl font-semibold",
                  isDarkMode ? "text-orange-400" : "text-gray-900"
                )}>{formatCurrency(product.salePrice)}</span>
                <span className={cn(
                  "ml-2 line-through",
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                )}>{formatCurrency(product.price)}</span>
                <Badge className="ml-2">Sale</Badge>
              </div>
            ) : (
              <span className={cn(
                "text-xl font-semibold mb-4",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>{product && formatCurrency(product.price)}</span>
            )}

            <p className={cn(
              "mb-6",
              isDarkMode ? "text-gray-300" : "text-gray-700"
            )}>{product?.description}</p>

            {/* Add to Cart Button */}
            <Button 
              className={cn(
                "w-full text-sm",
                isDarkMode 
                  ? "bg-orange-600 hover:bg-orange-700 text-white" 
                  : "bg-kutuku-primary hover:bg-kutuku-secondary text-white"
              )}
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? 'Adding to Cart...' : 'Add to Cart'}
              <ShoppingCart className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Removed the Reviews Section */}
				
				{/* Recommended Products Section */}
        {recommendedProducts.length > 0 && (
          <section className="mt-12">
            <h2 className={cn(
              "text-xl font-bold mb-4",
              isDarkMode && "text-white"
            )}>Recommended For You</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recommendedProducts.map(product => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  salePrice={product.salePrice}
                  image={product.images[0]}
                  category={product.category}
                  isNew={product.isNew || false}
                  isTrending={product.isTrending || false}
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                />
              ))}
            </div>
          </section>
        )}
				
				{/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <section className="mt-12">
            <h2 className={cn(
              "text-xl font-bold mb-4",
              isDarkMode && "text-white"
            )}>You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {similarProducts.map(product => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  salePrice={product.salePrice}
                  image={product.images[0]}
                  category={product.category}
                  isNew={product.isNew || false}
                  isTrending={product.isTrending || false}
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;

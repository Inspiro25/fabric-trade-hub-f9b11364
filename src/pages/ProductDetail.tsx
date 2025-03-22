
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProductById } from '@/lib/products';
import { recordProductView } from '@/lib/products/trending';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import AppHeader from '@/components/features/AppHeader';
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

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  
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
  const [showAllReviews, setShowAllReviews] = React.useState(false);
  const [reviews, setReviews] = React.useState([]);
  const [isAddingToCart, setIsAddingToCart] = React.useState(false);
  const [recommendedProducts, setRecommendedProducts] = React.useState<Product[]>([]);
  const [similarProducts, setSimilarProducts] = React.useState<Product[]>([]);

  React.useEffect(() => {
    const fetchReviews = async () => {
      if (product?.id) {
        const productReviews = await fetchProductReviews(product.id);
        setReviews(productReviews);
      }
    };
    fetchReviews();
  }, [product?.id]);

  React.useEffect(() => {
    const loadRecommendations = async () => {
      if (currentUser && id) {
        // Check if currentUser has uid/id property
        const userId = currentUser.uid || currentUser.id;
        if (userId) {
          const recommendations = await getPersonalizedRecommendations(userId);
          if (recommendations) {
            setRecommendedProducts(recommendations);
          }
        }
      }
    };
		
    const loadSimilarProducts = async () => {
      if (id) {
        const similar = await getSimilarProducts(id);
        if (similar) {
          setSimilarProducts(similar);
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
      await addToCart(product);
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

  const handleReviewSubmitted = async () => {
    if (product?.id) {
      const productReviews = await fetchProductReviews(product.id);
      setReviews(productReviews);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AppHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Skeleton className="w-full aspect-square rounded-lg" />
            </div>
            <div>
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/2 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-10 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-12 w-1/4 mt-8 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AppHeader />
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
    <div className="min-h-screen bg-slate-50">
      <AppHeader />
      
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
                {product.images.map((image, index) => (
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
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
            
            {product.salePrice !== undefined && product.salePrice > 0 ? (
              <div className="flex items-center mb-4">
                <span className="text-xl font-semibold text-gray-900">{formatCurrency(product.salePrice)}</span>
                <span className="text-gray-500 ml-2 line-through">{formatCurrency(product.price)}</span>
                <Badge className="ml-2">Sale</Badge>
              </div>
            ) : (
              <span className="text-xl font-semibold text-gray-900 mb-4">{formatCurrency(product.price)}</span>
            )}

            <p className="text-gray-700 mb-6">{product.description}</p>

            {/* Add to Cart Button */}
            <Button 
              className="w-full bg-kutuku-primary hover:bg-kutuku-secondary text-sm"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? 'Adding to Cart...' : 'Add to Cart'}
              <ShoppingCart className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4">Reviews</h2>
          
          {/* Review Form */}
          {currentUser && (
            <ReviewForm 
              productId={product.id} 
              onReviewSubmitted={handleReviewSubmitted} 
            />
          )}

          {/* Display Reviews */}
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet. Be the first to write one!</p>
          ) : (
            <div>
              {reviews.slice(0, showAllReviews ? reviews.length : 3).map((review) => (
                <Card key={review.id} className="mb-4">
                  <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{review.userName || 'Anonymous'}</CardTitle>
                    <div className="ml-auto flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}

              {/* Show All Reviews Button */}
              {reviews.length > 3 && !showAllReviews && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAllReviews(true)}
                  className="w-full mt-2 text-sm"
                >
                  Show All Reviews
                </Button>
              )}
            </div>
          )}
        </section>
				
				{/* Recommended Products Section */}
        {recommendedProducts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold mb-4">Recommended For You</h2>
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
            <h2 className="text-xl font-bold mb-4">You might also like</h2>
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

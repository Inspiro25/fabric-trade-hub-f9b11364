import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProductById } from '@/lib/supabase/products';
import { recordProductView } from '@/lib/products/trending';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Star, ShoppingCart, ArrowLeft, ArrowRight, Send, Share2, Package, Truck, RefreshCw, Shield, ChevronDown, ChevronUp, Info, Clock, Tag, Users, ThumbsUp, MessageSquare } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from '@/components/ui/ProductCard';
import { CompactProductCard } from '@/components/ui/CompactProductCard';
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
import { getPersonalizedRecommendations, getSimilarProducts, getProductsByCategory } from '@/services/recommendationService';
import { toast } from '@/hooks/use-toast';
import { Product } from '@/lib/types/product';
import { useTheme } from '@/contexts/ThemeContext';
import { Textarea } from "@/components/ui/textarea";
import { createReview } from '@/lib/supabase/reviews';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const MinimalReviewForm = ({ productId }: { productId: string }) => {
  const [rating, setRating] = React.useState(0);
  const [reviewText, setReviewText] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { session } = useSupabaseAuth();
  const { currentUser } = useAuth();
  const { isDarkMode } = useTheme();

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id && !currentUser?.uid) {
      toast({
        title: "Login required",
        description: "Please log in to submit a review",
        variant: "destructive",
      });
      return;
    }
    
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Use Supabase user ID if available, otherwise use Firebase UID
      const userId = session?.user?.id || currentUser?.uid;
      
      if (!userId) {
        throw new Error("No user ID found");
      }
      
      await createReview({
        rating,
        comment: reviewText,
        userId,
        reviewType: 'product',
        productId,
      });
      
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
      
      setRating(0);
      setReviewText("");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoggedIn = session?.user?.id || currentUser?.uid;

  return (
    <div className={cn(
      "mt-6 p-4 rounded-md",
      isDarkMode ? "bg-gray-800" : "bg-gray-50"
    )}>
      <h3 className={cn(
        "text-sm font-medium mb-2",
        isDarkMode ? "text-white" : "text-gray-900"
      )}>Write a Quick Review</h3>
      
      <div className="flex items-center mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(star)}
            className="mr-1 focus:outline-none"
            aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
          >
            <Star
              className={`h-5 w-5 ${
                star <= rating 
                  ? 'text-yellow-500 fill-yellow-500' 
                  : isDarkMode ? 'text-gray-600' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          placeholder="Share your thoughts (optional)"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className={cn(
            "resize-none text-sm h-20",
            isDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""
          )}
        />
        
        <Button 
          type="submit" 
          size="sm"
          disabled={isSubmitting || rating === 0 || !isLoggedIn}
          className={cn(
            "flex items-center",
            isDarkMode 
              ? "bg-blue-600 hover:bg-blue-700 text-white" 
              : "bg-kutuku-primary hover:bg-kutuku-secondary text-white"
          )}
        >
          {!isLoggedIn ? "Login to Review" : isSubmitting ? "Submitting..." : "Submit Review"}
          <Send className="ml-2 h-3 w-3" />
        </Button>
      </form>
    </div>
  );
};

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const { isDarkMode } = useTheme();
  const isMobile = useIsMobile();
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>('description');
  const [expandedSpecs, setExpandedSpecs] = useState(false);
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState<boolean>(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { data: productData, isLoading: isProductLoading, error: productError } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => getProductById(id!),
    enabled: !!id,
  });

  useEffect(() => {
    const recordView = async () => {
      if (id) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          const userId = session?.user?.id;
          
          await recordProductView(id, userId);
        } catch (error) {
          console.error('Error recording product view:', error);
        }
      }
    };
    
    recordView();
  }, [id]);

  useEffect(() => {
    if (productData) {
      setSelectedColor(productData.colors?.[0] || '');
      setSelectedSize(productData.sizes?.[0] || '');
      
      // Load products from the same category
      const loadCategoryProducts = async () => {
        try {
          if (productData.category) {
            const products = await getProductsByCategory(productData.category, 4);
            // Filter out the current product
            const filteredProducts = products.filter(p => p.id !== productData.id);
            setCategoryProducts(filteredProducts);
          }
        } catch (error) {
          console.error('Error loading category products:', error);
        }
      };
      
      loadCategoryProducts();
    }
  }, [productData]);

  const { addToCart } = useCart();
  const [isAddingToCart, setIsAddingToCart] = React.useState(false);
  const [recommendedProducts, setRecommendedProducts] = React.useState<Product[]>([]);
  const [similarProducts, setSimilarProducts] = React.useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = React.useState<Product[]>([]);

  React.useEffect(() => {
    const loadRecommendations = async () => {
      if (currentUser && id) {
        try {
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

    // Load recently viewed products from localStorage
    const loadRecentlyViewed = () => {
      try {
        const viewed = localStorage.getItem('recentlyViewed');
        if (viewed) {
          const viewedProducts = JSON.parse(viewed);
          // Filter out the current product
          const filteredProducts = viewedProducts.filter((p: Product) => p.id !== id);
          setRecentlyViewed(filteredProducts.slice(0, 4));
        }
      } catch (error) {
        console.error('Error loading recently viewed products:', error);
      }
    };

    loadRecommendations();
    loadSimilarProducts();
    loadRecentlyViewed();
  }, [currentUser, id]);

  // Save product to recently viewed
  useEffect(() => {
    if (productData) {
      try {
        const viewed = localStorage.getItem('recentlyViewed');
        let viewedProducts = [];
        
        if (viewed) {
          viewedProducts = JSON.parse(viewed);
          // Remove the current product if it exists
          viewedProducts = viewedProducts.filter((p: Product) => p.id !== productData.id);
        }
        
        // Add current product to the beginning
        viewedProducts.unshift(productData);
        
        // Keep only the last 10 products
        if (viewedProducts.length > 10) {
          viewedProducts = viewedProducts.slice(0, 10);
        }
        
        localStorage.setItem('recentlyViewed', JSON.stringify(viewedProducts));
      } catch (error) {
        console.error('Error saving recently viewed products:', error);
      }
    }
  }, [productData]);

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= (product?.stock || 1)) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAddingToCart(true);
    try {
      await addToCart(product, quantity, selectedColor, selectedSize);
      
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

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out ${product?.name} on Vyoma!`;
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast({
          title: 'Link copied',
          description: 'Product link has been copied to clipboard.',
        });
        break;
      default:
        break;
    }
    
    setIsShareMenuOpen(false);
  };

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const productData = await getProductById(id);
        
        if (!productData) {
          setError('Product not found');
          return;
        }

        // Ensure consistent data format
        const formattedProduct = {
          ...productData,
          salePrice: productData.sale_price || productData.salePrice,
          isNew: productData.is_new || productData.isNew,
          isTrending: productData.is_trending || productData.isTrending,
          reviewCount: productData.review_count || productData.reviewCount,
          shopId: productData.shop_id || productData.shopId,
          category: productData.category_id || productData.category
        };
        
        setProduct(formattedProduct);
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Failed to load product details');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className={cn(
        "min-h-screen",
        isDarkMode ? "bg-slate-900" : "bg-slate-50"
      )}>
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
      <div className="container mx-auto px-4 pb-24">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center text-sm mb-6">
          <Link to="/" className={cn(
            "hover:underline",
            isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
          )}>Home</Link>
          <span className="mx-2">/</span>
          <span className={cn(
            "text-foreground",
            isDarkMode ? "text-gray-300" : "text-gray-900"
          )}>{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column - Images & Product Highlights */}
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
            
            {/* Thumbnail Navigation */}
            <div className="grid grid-cols-4 gap-2 mt-4">
              {product?.images.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <img
                    src={image}
                    alt={`${product.name} - Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Product Highlights */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <Card className={cn(
                "border",
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
              )}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-full",
                    isDarkMode ? "bg-gray-700" : "bg-gray-100"
                  )}>
                    <Truck className={cn(
                      "h-5 w-5",
                      isDarkMode ? "text-blue-400" : "text-kutuku-primary"
                    )} />
                  </div>
                  <div>
                    <h4 className={cn(
                      "text-sm font-medium",
                      isDarkMode ? "text-white" : "text-gray-900"
                    )}>Free Shipping</h4>
                    <p className={cn(
                      "text-xs",
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}>On orders over ₹999</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className={cn(
                "border",
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
              )}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-full",
                    isDarkMode ? "bg-gray-700" : "bg-gray-100"
                  )}>
                    <RefreshCw className={cn(
                      "h-5 w-5",
                      isDarkMode ? "text-blue-400" : "text-kutuku-primary"
                    )} />
                  </div>
                  <div>
                    <h4 className={cn(
                      "text-sm font-medium",
                      isDarkMode ? "text-white" : "text-gray-900"
                    )}>Easy Returns</h4>
                    <p className={cn(
                      "text-xs",
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}>30-day return policy</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className={cn(
                "border",
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
              )}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-full",
                    isDarkMode ? "bg-gray-700" : "bg-gray-100"
                  )}>
                    <Shield className={cn(
                      "h-5 w-5",
                      isDarkMode ? "text-blue-400" : "text-kutuku-primary"
                    )} />
                  </div>
                  <div>
                    <h4 className={cn(
                      "text-sm font-medium",
                      isDarkMode ? "text-white" : "text-gray-900"
                    )}>Secure Payment</h4>
                    <p className={cn(
                      "text-xs",
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}>100% secure checkout</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className={cn(
                "border",
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
              )}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-full",
                    isDarkMode ? "bg-gray-700" : "bg-gray-100"
                  )}>
                    <Package className={cn(
                      "h-5 w-5",
                      isDarkMode ? "text-blue-400" : "text-kutuku-primary"
                    )} />
                  </div>
                  <div>
                    <h4 className={cn(
                      "text-sm font-medium",
                      isDarkMode ? "text-white" : "text-gray-900"
                    )}>Genuine Products</h4>
                    <p className={cn(
                      "text-xs",
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}>Authentic items only</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right column - Product Information */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{product?.category}</Badge>
              {product?.isNew && <Badge>New</Badge>}
              {product?.isTrending && <Badge variant="secondary">Trending</Badge>}
              {product?.salePrice && product.salePrice > 0 && (
                <Badge variant="destructive">
                  {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                </Badge>
              )}
            </div>
            
            <div className="flex justify-between items-start">
              <h1 className={cn(
                "text-2xl font-bold mb-2",
                isDarkMode && "text-white"
              )}>{product?.name}</h1>
              
              <DropdownMenu open={isShareMenuOpen} onOpenChange={setIsShareMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className={cn(
                    "rounded-full",
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  )}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
                    Share on WhatsApp
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare('facebook')}>
                    Share on Facebook
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare('twitter')}>
                    Share on Twitter
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare('copy')}>
                    Copy Link
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
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
              <span className={cn(
                "text-sm ml-2",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}>
                • SKU: {product?.sku || 'N/A'}
              </span>
            </div>
            
            {product?.salePrice !== undefined && product.salePrice > 0 ? (
              <div className="flex items-center mb-4">
                <span className={cn(
                  "text-2xl font-semibold",
                  isDarkMode ? "text-blue-400" : "text-gray-900"
                )}>₹{product.salePrice.toFixed(2)}</span>
                <span className={cn(
                  "ml-2 line-through",
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                )}>₹{product.price.toFixed(2)}</span>
                <Badge className="ml-2">Sale</Badge>
              </div>
            ) : (
              <span className="text-2xl font-bold text-gray-900">
                ₹{product.price}
              </span>
            )}

            {/* Color Selection */}
            {product?.colors && product.colors.length > 0 && (
              <div className="mb-4">
                <h3 className={cn(
                  "text-sm font-medium mb-2",
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                )}>Color</h3>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-all",
                        selectedColor === color ? "border-primary scale-110" : "border-transparent",
                        isDarkMode ? "hover:border-gray-400" : "hover:border-gray-300"
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product?.sizes && product.sizes.length > 0 && (
              <div className="mb-4">
                <h3 className={cn(
                  "text-sm font-medium mb-2",
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                )}>Size</h3>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={cn(
                        "px-3 py-1 rounded-md border transition-all",
                        selectedSize === size 
                          ? "border-primary bg-primary/10" 
                          : isDarkMode 
                            ? "border-gray-700 hover:border-gray-600" 
                            : "border-gray-200 hover:border-gray-300"
                      )}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div className="mb-4">
              <h3 className={cn(
                "text-sm font-medium mb-2",
                isDarkMode ? "text-gray-300" : "text-gray-700"
              )}>Quantity</h3>
              <div className="flex items-center gap-2">
                <button
                  className={cn(
                    "w-8 h-8 rounded-md border flex items-center justify-center",
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  )}
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className={cn(
                  "w-8 text-center",
                  isDarkMode ? "text-white" : "text-gray-900"
                )}>{quantity}</span>
                <button
                  className={cn(
                    "w-8 h-8 rounded-md border flex items-center justify-center",
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  )}
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= (product?.stock || 1)}
                >
                  +
                </button>
                <span className={cn(
                  "text-sm ml-2",
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                )}>
                  {product?.stock} available
                </span>
              </div>
            </div>

            <div className="flex gap-2 mb-6">
              <Button 
                className={cn(
                  "flex-1",
                  isDarkMode 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : "bg-kutuku-primary hover:bg-kutuku-secondary text-white"
                )}
                onClick={handleAddToCart}
                disabled={isAddingToCart}
              >
                {isAddingToCart ? 'Adding to Cart...' : 'Add to Cart'}
                <ShoppingCart className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => window.location.href = `/checkout?product=${product?.id}`}
              >
                Buy Now
              </Button>
            </div>

            {/* Product Details Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="specs">Specifications</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="pt-4">
                <div className={cn(
                  "prose max-w-none",
                  isDarkMode ? "prose-invert" : ""
                )}>
                  <p>{product.description}</p>
                </div>
                <MinimalReviewForm productId={product.id} />
              </TabsContent>
              
              <TabsContent value="details" className="pt-4">
                <div className={cn(
                  "prose max-w-none",
                  isDarkMode ? "prose-invert" : ""
                )}>
                  <h3>Product Details</h3>
                  <ul>
                    <li>SKU: {product.sku || 'N/A'}</li>
                    <li>Category: {product.category}</li>
                    <li>Available in stock: {product.stock}</li>
                    <li>Tags: {product.tags?.join(', ') || 'N/A'}</li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="specs" className="pt-4">
                <Accordion type="single" collapsible>
                  <AccordionItem value="dimensions">
                    <AccordionTrigger>Dimensions & Weight</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm">Dimensions and weight information not available.</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="materials">
                    <AccordionTrigger>Materials & Composition</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm">Materials information not available.</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="care">
                    <AccordionTrigger>Care Instructions</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm">Care instructions not available.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>
              
              <TabsContent value="reviews" className="pt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className={cn(
                      "text-lg font-medium",
                      isDarkMode ? "text-white" : "text-gray-900"
                    )}>Customer Reviews</h3>
                    <Badge variant="outline">{product.reviewCount} reviews</Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">{product.rating} out of 5</span>
                  </div>
                  
                  <MinimalReviewForm productId={product.id} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Recommended Products */}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <h2 className={cn(
              "text-xl font-semibold mb-6",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>Similar Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similarProducts.slice(0, 4).map(product => (
                <CompactProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
        
        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <div className="mt-16">
            <h2 className={cn(
              "text-xl font-semibold mb-6",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>Recently Viewed</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recentlyViewed.map(product => (
                <CompactProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { toast } from "sonner";
import { Product } from '@/lib/types/product';
import { useTheme } from '@/contexts/ThemeContext';

interface ProductCardProps {
  id?: string;
  name?: string;
  price?: number;
  salePrice?: number;
  image?: string;
  category?: string;
  isNew?: boolean;
  isTrending?: boolean;
  layout?: 'vertical' | 'horizontal';
  rating?: number;
  reviewCount?: number;
  product?: Product;
  variant?: string;
  gridCols?: number;
}

const ProductCard = ({
  id,
  name,
  price,
  salePrice,
  image,
  category,
  isNew = false,
  isTrending = false,
  layout = 'vertical',
  rating = 0,
  reviewCount = 0,
  product,
}: ProductCardProps) => {
  const { isDarkMode } = useTheme();
  const productId = product?.id || id || '';
  const productName = product?.name || name || '';
  const productPrice = product?.price || price || 0;
  const productSalePrice = product?.salePrice || salePrice;
  const productImage = product?.images?.[0] || image || '';
  const productCategory = product?.category || category || '';
  const productIsNew = product?.isNew || isNew;
  const productIsTrending = product?.isTrending || isTrending;
  const productRating = product?.rating || rating;
  const productReviewCount = product?.reviewCount || reviewCount;
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isFavorited = isInWishlist(productId);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product && !productId) {
      console.error('No product or productId provided');
      return;
    }

    const productToAdd: Product = product || {
      id: productId,
      name: productName,
      price: productPrice,
      salePrice: productSalePrice,
      images: [productImage],
      category: productCategory,
      isNew: productIsNew,
      isTrending: productIsTrending,
      rating: productRating,
      reviewCount: productReviewCount,
      colors: ['default'],
      sizes: ['default'],
      description: '',
      stock: 10,
      tags: [],
    };

    if (isFavorited) {
      removeFromWishlist(productToAdd.id);
      toast.info("Removed from wishlist");
    } else {
      addToWishlist(productToAdd);
      toast.success("Added to wishlist");
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product) {
      addToCart(product, 1, product.colors[0] || '', product.sizes[0] || '');
    } else {
      const productObj: Product = {
        id: productId,
        name: productName,
        price: productPrice,
        salePrice: productSalePrice,
        images: [productImage],
        category: productCategory,
        isNew: productIsNew,
        isTrending: productIsTrending,
        rating: productRating,
        reviewCount: productReviewCount,
        colors: ['default'],
        sizes: ['default'],
        description: '',
        stock: 10,
        tags: [],
      };
      addToCart(productObj, 1, 'default', 'default');
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Only navigate if the click wasn't on a button
    if (!(e.target as HTMLElement).closest('button')) {
      navigate(`/product/${productId}`);
    }
  };

  const discountPercentage = productSalePrice ? Math.round(((productPrice - productSalePrice) / productPrice) * 100) : 0;

  if (isMobile) {
    return (
      <div 
        className={cn(
          "product-card-container animate-fade-in border rounded-lg overflow-hidden",
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
        )}
        onClick={handleCardClick}
      >
        <div className="relative">
          <div className={cn("aspect-square w-full", isLoading && "image-loading")}>
            <img
              src={productImage}
              alt={productName}
              className="w-full h-full object-cover"
              onLoad={handleImageLoad}
            />
          </div>
          
          <button
            className={cn(
              "absolute top-1 right-1 h-6 w-6 rounded-full flex items-center justify-center shadow-sm",
              isDarkMode ? "bg-gray-700/90" : "bg-white/90"
            )}
            onClick={toggleWishlist}
          >
            <Heart 
              className={cn(
                "h-3 w-3 transition-colors", 
                isFavorited && "fill-destructive text-destructive"
              )} 
            />
          </button>
          
          {productSalePrice && (
            <div className="absolute bottom-0 left-0 bg-green-500 text-white px-1 py-0.5 text-xs font-bold">
              {discountPercentage}% OFF
            </div>
          )}
        </div>
        
        <div className="p-2">
          <div className="mb-0.5">
            <span className={cn(
              "text-[10px]",
              isDarkMode ? "text-gray-400" : "text-muted-foreground"
            )}>{productCategory}</span>
          </div>
          <div className="block mb-0.5">
            <h3 className={cn(
              "font-medium text-xs line-clamp-1",
              isDarkMode && "text-gray-200"
            )}>{productName}</h3>
          </div>
          
          {productRating > 0 && (
            <div className="flex items-center gap-1 mb-0.5">
              <div className="bg-green-600 text-white text-[10px] px-1 py-0.5 rounded flex items-center">
                {productRating.toFixed(1)} <Star className="h-2 w-2 ml-0.5 fill-white" />
              </div>
              <span className={cn(
                "text-[10px]",
                isDarkMode ? "text-gray-400" : "text-muted-foreground"
              )}>({productReviewCount})</span>
            </div>
          )}
          
          <div className="flex items-center">
            {productSalePrice ? (
              <>
                <span className={cn(
                  "font-bold text-xs",
                  isDarkMode ? "text-orange-400" : ""
                )}>₹{productSalePrice.toFixed(2)}</span>
                <span className={cn(
                  "ml-1 text-[10px] line-through",
                  isDarkMode ? "text-gray-400" : "text-muted-foreground"
                )}>₹{productPrice.toFixed(2)}</span>
              </>
            ) : (
              <span className={cn(
                "font-bold text-xs",
                isDarkMode && "text-gray-200"
              )}>₹{productPrice.toFixed(2)}</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (layout === 'horizontal') {
    return (
      <div 
        className={cn(
          "product-card-container animate-fade-in border rounded-lg overflow-hidden",
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        <div className="flex flex-col sm:flex-row">
          <div className="relative overflow-hidden sm:w-36 md:w-48">
            <div className={cn("aspect-square w-full", isLoading && "image-loading")}>
              <img
                src={productImage}
                alt={productName}
                className="w-full h-full object-cover"
                onLoad={handleImageLoad}
              />
            </div>
            
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {productIsNew && (
                <div className="category-chip bg-primary text-primary-foreground px-1.5 py-0.5 text-xs">
                  New
                </div>
              )}
              {productIsTrending && (
                <div className="category-chip bg-accent text-accent-foreground px-1.5 py-0.5 text-xs">
                  Trending
                </div>
              )}
              {productSalePrice && (
                <div className="category-chip bg-destructive text-destructive-foreground px-1.5 py-0.5 text-xs">
                  {discountPercentage}% Off
                </div>
              )}
            </div>
          </div>
          
          <div className="p-3 flex flex-col justify-between flex-grow">
            <div>
              <div className="mb-0.5">
                <span className={cn(
                  "category-chip text-xs",
                  isDarkMode && "text-gray-400"
                )}>{productCategory}</span>
              </div>
              <div className={cn(
                "block mb-1 transition-colors",
                isDarkMode ? "hover:text-orange-400" : "hover:text-primary"
              )}>
                <h3 className={cn(
                  "font-medium text-sm line-clamp-1",
                  isDarkMode && "text-gray-200"
                )}>{productName}</h3>
              </div>
              
              {productRating > 0 && (
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={cn(
                          "h-3 w-3", 
                          i < Math.floor(productRating) 
                            ? "text-yellow-400 fill-yellow-400" 
                            : i < productRating 
                              ? "text-yellow-400 fill-yellow-400" 
                              : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                  <span className={cn(
                    "text-xs",
                    isDarkMode ? "text-gray-400" : "text-muted-foreground"
                  )}>({productReviewCount})</span>
                </div>
              )}
              
              <div className="flex items-center mb-2">
                {productSalePrice ? (
                  <>
                    <span className={cn(
                      "font-semibold text-sm",
                      isDarkMode ? "text-orange-400" : ""
                    )}>₹{productSalePrice.toFixed(2)}</span>
                    <span className={cn(
                      "ml-2 text-xs line-through",
                      isDarkMode ? "text-gray-400" : "text-muted-foreground"
                    )}>₹{productPrice.toFixed(2)}</span>
                  </>
                ) : (
                  <span className={cn(
                    "font-semibold text-sm",
                    isDarkMode && "text-gray-200"
                  )}>₹{productPrice.toFixed(2)}</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-1">
              <Button 
                className={cn(
                  "flex-grow text-xs py-1 px-2 h-8",
                  isDarkMode && "bg-orange-600 hover:bg-orange-700"
                )}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-3 w-3 mr-1" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "h-8 w-8",
                  isDarkMode && "border-gray-700 hover:border-gray-600 hover:bg-gray-700"
                )}
                onClick={toggleWishlist}
              >
                <Heart 
                  className={cn(
                    "h-3 w-3 transition-colors", 
                    isFavorited && "fill-destructive text-destructive"
                  )} 
                />
                <span className="sr-only">Add to wishlist</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "product-card-container animate-fade-in",
        isDarkMode && "border border-gray-700 rounded-lg overflow-hidden"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden aspect-[3/4]">
        <div className={cn("w-full h-full", isLoading && "image-loading")}>
          <img
            src={productImage}
            alt={productName}
            className={cn(
              "w-full h-full object-cover transition-transform duration-400 ease-apple",
              isHovered && "scale-105"
            )}
            onLoad={handleImageLoad}
          />
        </div>
        
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {productIsNew && (
            <div className="category-chip bg-primary text-primary-foreground px-1.5 py-0.5 text-xs">
              New
            </div>
          )}
          {productIsTrending && (
            <div className="category-chip bg-accent text-accent-foreground px-1.5 py-0.5 text-xs">
              Trending
            </div>
          )}
          {productSalePrice && (
            <div className="category-chip bg-destructive text-destructive-foreground px-1.5 py-0.5 text-xs">
              {discountPercentage}% Off
            </div>
          )}
        </div>
        
        <div 
          className={cn(
            "absolute right-2 top-2 flex flex-col gap-1 transition-all duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        >
          <Button
            variant="secondary"
            size="icon"
            className={cn(
              "h-7 w-7 rounded-full shadow-subtle",
              isDarkMode ? "bg-gray-800/80 backdrop-blur-sm" : "bg-background/80 backdrop-blur-sm"
            )}
            onClick={toggleWishlist}
          >
            <Heart 
              className={cn(
                "h-3 w-3 transition-colors", 
                isFavorited && "fill-destructive text-destructive"
              )} 
            />
            <span className="sr-only">Add to wishlist</span>
          </Button>
        </div>
        
        <div 
          className={cn(
            "absolute inset-x-0 bottom-0 p-2 transition-all duration-300 transform",
            isHovered ? "translate-y-0" : "translate-y-full"
          )}
        >
          <Button 
            className={cn(
              "w-full rounded-md shadow-subtle glass-morphism text-xs h-8 backdrop-blur-sm",
              isDarkMode 
                ? "bg-gray-800/80 text-gray-100" 
                : "bg-background/80 text-foreground"
            )}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-3 w-3 mr-1" />
            Quick Add
          </Button>
        </div>
      </div>
      
      <div className={cn(
        "p-2",
        isDarkMode && "bg-gray-800"
      )}>
        <div className="mb-0.5">
          <span className={cn(
            "category-chip text-[10px]",
            isDarkMode && "text-gray-400"
          )}>{productCategory}</span>
        </div>
        <div className={cn(
          "block mb-1 transition-colors",
          isDarkMode ? "hover:text-orange-400" : "hover:text-primary"
        )}>
          <h3 className={cn(
            "font-medium text-xs line-clamp-1",
            isDarkMode && "text-gray-200"
          )}>{productName}</h3>
        </div>
        
        {productRating > 0 && (
          <div className="flex items-center gap-1 mb-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={cn(
                    "h-2 w-2", 
                    i < Math.floor(productRating) 
                      ? "text-yellow-400 fill-yellow-400" 
                      : i < productRating 
                        ? "text-yellow-400 fill-yellow-400" 
                        : isDarkMode ? "text-gray-600" : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className={cn(
              "text-[10px]",
              isDarkMode ? "text-gray-400" : "text-muted-foreground"
            )}>({productReviewCount})</span>
          </div>
        )}
        
        <div className="flex items-center">
          {productSalePrice ? (
            <>
              <span className={cn(
                "font-semibold text-xs",
                isDarkMode ? "text-orange-400" : ""
              )}>₹{productSalePrice.toFixed(2)}</span>
              <span className={cn(
                "ml-1 text-[10px] line-through",
                isDarkMode ? "text-gray-400" : "text-muted-foreground"
              )}>₹{productPrice.toFixed(2)}</span>
            </>
          ) : (
            <span className={cn(
              "font-semibold text-xs",
              isDarkMode && "text-gray-200"
            )}>₹{productPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { toast } from "sonner";
import { Product } from '@/lib/products';

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

  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isFavorited = isInWishlist(productId);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const toggleWishlist = () => {
    if (isFavorited) {
      removeFromWishlist(productId);
      toast.info("Removed from wishlist");
    } else {
      addToWishlist(productId);
      toast.success("Added to wishlist");
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    
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

  const discountPercentage = productSalePrice ? Math.round(((productPrice - productSalePrice) / productPrice) * 100) : 0;

  if (isMobile) {
    return (
      <div className="product-card-container animate-fade-in border rounded-lg overflow-hidden bg-white">
        <div className="relative">
          <Link to={`/product/${productId}`}>
            <div className={cn("aspect-square w-full", isLoading && "image-loading")}>
              <img
                src={productImage}
                alt={productName}
                className="w-full h-full object-cover"
                onLoad={handleImageLoad}
              />
            </div>
          </Link>
          
          <button
            className="absolute top-1 right-1 h-6 w-6 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
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
            <span className="text-[10px] text-muted-foreground">{productCategory}</span>
          </div>
          <Link to={`/product/${productId}`} className="block mb-0.5">
            <h3 className="font-medium text-xs line-clamp-1">{productName}</h3>
          </Link>
          
          {productRating > 0 && (
            <div className="flex items-center gap-1 mb-0.5">
              <div className="bg-green-600 text-white text-[10px] px-1 py-0.5 rounded flex items-center">
                {productRating.toFixed(1)} <Star className="h-2 w-2 ml-0.5 fill-white" />
              </div>
              <span className="text-[10px] text-muted-foreground">({productReviewCount})</span>
            </div>
          )}
          
          <div className="flex items-center">
            {productSalePrice ? (
              <>
                <span className="font-bold text-xs">₹{productSalePrice.toFixed(2)}</span>
                <span className="ml-1 text-[10px] text-muted-foreground line-through">₹{productPrice.toFixed(2)}</span>
              </>
            ) : (
              <span className="font-bold text-xs">₹{productPrice.toFixed(2)}</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (layout === 'horizontal') {
    return (
      <div 
        className="product-card-container animate-fade-in border rounded-lg overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col sm:flex-row">
          <div className="relative overflow-hidden sm:w-36 md:w-48">
            <Link to={`/product/${productId}`}>
              <div className={cn("aspect-square w-full", isLoading && "image-loading")}>
                <img
                  src={productImage}
                  alt={productName}
                  className="w-full h-full object-cover"
                  onLoad={handleImageLoad}
                />
              </div>
            </Link>
            
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
                <span className="category-chip text-xs">{productCategory}</span>
              </div>
              <Link to={`/product/${productId}`} className="block mb-1 hover:text-primary transition-colors">
                <h3 className="font-medium text-sm line-clamp-1">{productName}</h3>
              </Link>
              
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
                  <span className="text-xs text-muted-foreground">({productReviewCount})</span>
                </div>
              )}
              
              <div className="flex items-center mb-2">
                {productSalePrice ? (
                  <>
                    <span className="font-semibold text-sm">₹{productSalePrice.toFixed(2)}</span>
                    <span className="ml-2 text-xs text-muted-foreground line-through">₹{productPrice.toFixed(2)}</span>
                  </>
                ) : (
                  <span className="font-semibold text-sm">₹{productPrice.toFixed(2)}</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-1">
              <Button 
                className="flex-grow text-xs py-1 px-2 h-8"
                onClick={(e) => {
                  e.preventDefault();
                  console.log(`Added ${productName} to cart`);
                }}
              >
                <ShoppingCart className="h-3 w-3 mr-1" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
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
      className="product-card-container animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden aspect-[3/4]">
        <Link to={`/product/${productId}`}>
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
        </Link>
        
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
            className="h-7 w-7 rounded-full shadow-subtle bg-background/80 backdrop-blur-sm"
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
            className="w-full rounded-md shadow-subtle glass-morphism bg-background/80 backdrop-blur-sm text-xs h-8"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-3 w-3 mr-1" />
            Quick Add
          </Button>
        </div>
      </div>
      
      <div className="p-2">
        <div className="mb-0.5">
          <span className="category-chip text-[10px]">{productCategory}</span>
        </div>
        <Link to={`/product/${productId}`} className="block mb-1 hover:text-primary transition-colors">
          <h3 className="font-medium text-xs line-clamp-1">{productName}</h3>
        </Link>
        
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
                        : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground">({productReviewCount})</span>
          </div>
        )}
        
        <div className="flex items-center">
          {productSalePrice ? (
            <>
              <span className="font-semibold text-xs">₹{productSalePrice.toFixed(2)}</span>
              <span className="ml-1 text-[10px] text-muted-foreground line-through">₹{productPrice.toFixed(2)}</span>
            </>
          ) : (
            <span className="font-semibold text-xs">₹{productPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

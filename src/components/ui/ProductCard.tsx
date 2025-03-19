
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  isTrending?: boolean;
  layout?: 'vertical' | 'horizontal';
  rating?: number;
  reviewCount?: number;
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
}: ProductCardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const discountPercentage = salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;

  // Horizontal layout for list view
  if (layout === 'horizontal') {
    return (
      <div 
        className="product-card-container animate-fade-in border rounded-lg overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col sm:flex-row">
          {/* Product Image & Badges */}
          <div className="relative overflow-hidden sm:w-48 md:w-64">
            <Link to={`/product/${id}`}>
              <div className={cn("aspect-square w-full", isLoading && "image-loading")}>
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover"
                  onLoad={handleImageLoad}
                />
              </div>
            </Link>
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {isNew && (
                <div className="category-chip bg-primary text-primary-foreground px-2 py-1">
                  New
                </div>
              )}
              {isTrending && (
                <div className="category-chip bg-accent text-accent-foreground px-2 py-1">
                  Trending
                </div>
              )}
              {salePrice && (
                <div className="category-chip bg-destructive text-destructive-foreground px-2 py-1">
                  {discountPercentage}% Off
                </div>
              )}
            </div>
          </div>
          
          {/* Product Info */}
          <div className="p-4 flex flex-col justify-between flex-grow">
            <div>
              <div className="mb-1">
                <span className="category-chip">{category}</span>
              </div>
              <Link to={`/product/${id}`} className="block mb-2 hover:text-primary transition-colors">
                <h3 className="font-medium text-lg">{name}</h3>
              </Link>
              
              {/* Rating */}
              {rating > 0 && (
                <div className="flex items-center gap-1 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={cn(
                          "h-4 w-4", 
                          i < Math.floor(rating) 
                            ? "text-yellow-400 fill-yellow-400" 
                            : i < rating 
                              ? "text-yellow-400 fill-yellow-400" 
                              : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">({reviewCount})</span>
                </div>
              )}
              
              <div className="flex items-center mb-3">
                {salePrice ? (
                  <>
                    <span className="font-semibold text-lg">${salePrice.toFixed(2)}</span>
                    <span className="ml-2 text-sm text-muted-foreground line-through">${price.toFixed(2)}</span>
                  </>
                ) : (
                  <span className="font-semibold text-lg">${price.toFixed(2)}</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-2">
              <Button 
                className="flex-grow"
                onClick={(e) => {
                  e.preventDefault();
                  console.log(`Added ${name} to cart`);
                }}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10"
                onClick={() => setIsFavorited(!isFavorited)}
              >
                <Heart 
                  className={cn(
                    "h-4 w-4 transition-colors", 
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

  // Default vertical layout
  return (
    <div 
      className="product-card-container animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image & Badges */}
      <div className="relative overflow-hidden aspect-[3/4]">
        <Link to={`/product/${id}`}>
          <div className={cn("w-full h-full", isLoading && "image-loading")}>
            <img
              src={image}
              alt={name}
              className={cn(
                "w-full h-full object-cover transition-transform duration-400 ease-apple",
                isHovered && "scale-105"
              )}
              onLoad={handleImageLoad}
            />
          </div>
        </Link>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <div className="category-chip bg-primary text-primary-foreground px-2 py-1">
              New
            </div>
          )}
          {isTrending && (
            <div className="category-chip bg-accent text-accent-foreground px-2 py-1">
              Trending
            </div>
          )}
          {salePrice && (
            <div className="category-chip bg-destructive text-destructive-foreground px-2 py-1">
              {discountPercentage}% Off
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div 
          className={cn(
            "absolute right-3 top-3 flex flex-col gap-2 transition-all duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        >
          <Button
            variant="secondary"
            size="icon"
            className="h-9 w-9 rounded-full shadow-subtle bg-background/80 backdrop-blur-sm"
            onClick={() => setIsFavorited(!isFavorited)}
          >
            <Heart 
              className={cn(
                "h-4 w-4 transition-colors", 
                isFavorited && "fill-destructive text-destructive"
              )} 
            />
            <span className="sr-only">Add to wishlist</span>
          </Button>
        </div>
        
        {/* Quick Add Button */}
        <div 
          className={cn(
            "absolute inset-x-0 bottom-0 p-3 transition-all duration-300 transform",
            isHovered ? "translate-y-0" : "translate-y-full"
          )}
        >
          <Button 
            className="w-full rounded-md shadow-subtle glass-morphism bg-background/80 backdrop-blur-sm"
            onClick={(e) => {
              e.preventDefault();
              console.log(`Added ${name} to cart`);
            }}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Quick Add
          </Button>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <div className="mb-1">
          <span className="category-chip">{category}</span>
        </div>
        <Link to={`/product/${id}`} className="block mb-2 hover:text-primary transition-colors">
          <h3 className="font-medium line-clamp-1">{name}</h3>
        </Link>
        
        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={cn(
                    "h-3 w-3", 
                    i < Math.floor(rating) 
                      ? "text-yellow-400 fill-yellow-400" 
                      : i < rating 
                        ? "text-yellow-400 fill-yellow-400" 
                        : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({reviewCount})</span>
          </div>
        )}
        
        <div className="flex items-center">
          {salePrice ? (
            <>
              <span className="font-semibold">${salePrice.toFixed(2)}</span>
              <span className="ml-2 text-sm text-muted-foreground line-through">${price.toFixed(2)}</span>
            </>
          ) : (
            <span className="font-semibold">${price.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

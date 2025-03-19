
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
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
}: ProductCardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const discountPercentage = salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;

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

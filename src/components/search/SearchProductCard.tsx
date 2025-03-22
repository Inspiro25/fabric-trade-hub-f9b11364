
import React from 'react';
import { Heart, ShoppingCart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export interface SearchPageProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  sale_price: number | null;
  images: string[];
  category_id: string;
  shop_id: string;
  is_new?: boolean;
  is_trending?: boolean;
  colors?: string[];
  sizes?: string[];
  rating?: number;
  review_count?: number;
}

interface SearchProductCardProps {
  product: SearchPageProduct;
  isAddingToCart: string | null;
  isAddingToWishlist: string | null;
  onAddToCart: (product: SearchPageProduct) => void;
  onAddToWishlist: (product: SearchPageProduct) => void;
  onShare: (product: SearchPageProduct) => void;
  viewMode?: 'grid' | 'list';
  isCompact?: boolean;
}

const SearchProductCard: React.FC<SearchProductCardProps> = ({
  product,
  isAddingToCart,
  isAddingToWishlist,
  onAddToCart,
  onAddToWishlist,
  onShare,
  viewMode = 'grid',
  isCompact = false
}) => {
  const isAddingThisToCart = isAddingToCart === product.id;
  const isAddingThisToWishlist = isAddingToWishlist === product.id;
  
  if (isCompact) {
    return (
      <div className="group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <AspectRatio ratio={1}>
          <img 
            src={product.images[0] || '/placeholder.svg'}
            alt={product.name}
            className="object-cover w-full h-full transition-transform group-hover:scale-105"
          />
        </AspectRatio>
        
        <div className="p-2">
          <h3 className="text-sm font-medium line-clamp-1">{product.name}</h3>
          <div className="flex justify-between items-center mt-1">
            <div>
              {product.sale_price ? (
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-kutuku-primary">
                    ${product.sale_price}
                  </span>
                  <span className="text-xs text-gray-500 line-through">
                    ${product.price}
                  </span>
                </div>
              ) : (
                <span className="text-sm font-bold">
                  ${product.price}
                </span>
              )}
            </div>
            
            {product.rating && (
              <span className="text-xs text-amber-500">
                ★ {product.rating}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  if (viewMode === 'list') {
    return (
      <div className="group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="flex">
          <div className="w-32 sm:w-48 h-32 flex-shrink-0">
            <img 
              src={product.images[0] || '/placeholder.svg'}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          </div>
          
          <div className="flex-1 p-4">
            <div className="flex flex-col h-full justify-between">
              <div>
                <h3 className="text-lg font-medium line-clamp-1">{product.name}</h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center mt-1">
                  {product.rating && (
                    <span className="text-amber-500 text-sm">
                      ★ {product.rating} ({product.review_count || 0})
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap justify-between items-center mt-2">
                <div>
                  {product.sale_price ? (
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-bold text-kutuku-primary">
                        ${product.sale_price}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ${product.price}
                      </span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold">
                      ${product.price}
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToWishlist(product);
                    }}
                    disabled={isAddingThisToWishlist}
                    className="h-8 w-8 p-0"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                    disabled={isAddingThisToCart}
                    className="h-8"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Grid View (default)
  return (
    <div className="group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <AspectRatio ratio={1}>
        <img 
          src={product.images[0] || '/placeholder.svg'}
          alt={product.name}
          className="object-cover w-full h-full transition-transform group-hover:scale-105"
        />
      </AspectRatio>
      
      {product.is_new && (
        <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600">
          New
        </Badge>
      )}
      
      {product.sale_price && (
        <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
          {Math.round((1 - product.sale_price / product.price) * 100)}% Off
        </Badge>
      )}
      
      <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button 
          size="icon" 
          variant="secondary" 
          className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm shadow-sm"
          onClick={(e) => {
            e.stopPropagation();
            onShare(product);
          }}
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-medium line-clamp-1">{product.name}</h3>
        
        <div className="flex justify-between items-center mt-1">
          <div>
            {product.sale_price ? (
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-kutuku-primary">
                  ${product.sale_price}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ${product.price}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold">
                ${product.price}
              </span>
            )}
          </div>
          
          {product.rating && (
            <span className="text-amber-500">
              ★ {product.rating}
            </span>
          )}
        </div>
        
        <div className="mt-3 flex gap-2">
          <Button 
            size="sm" 
            variant="secondary" 
            onClick={(e) => {
              e.stopPropagation();
              onAddToWishlist(product);
            }}
            disabled={isAddingThisToWishlist}
            className="h-9 w-9 p-0 flex-shrink-0"
          >
            <Heart className="h-4 w-4" />
          </Button>
          
          <Button 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            disabled={isAddingThisToCart}
            className="h-9 flex-1"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchProductCard;

export const SearchProductSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
    <AspectRatio ratio={1}>
      <Skeleton className="w-full h-full" />
    </AspectRatio>
    
    <div className="p-4">
      <Skeleton className="h-6 w-full mb-2" />
      <Skeleton className="h-4 w-1/2 mb-3" />
      <Skeleton className="h-9 w-full" />
    </div>
  </div>
);

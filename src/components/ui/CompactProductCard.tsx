
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/types/product';
import { HeartIcon, ShoppingCart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface CompactProductCardProps {
  product: Product;
  onAddToCart?: () => void;
  onAddToWishlist?: () => void;
  onClick?: () => void;
  isInCart?: boolean;
  isInWishlist?: boolean;
}

export function CompactProductCard({
  product,
  onAddToCart,
  onAddToWishlist,
  onClick,
  isInCart,
  isInWishlist
}: CompactProductCardProps) {
  if (!product) return null;
  
  return (
    <Card className="overflow-hidden" onClick={onClick}>
      <div className="relative h-40 bg-gray-100">
        <img 
          src={product.images?.[0] || "https://via.placeholder.com/150"}
          alt={product.name} 
          className="w-full h-full object-cover"
        />
        {product.salePrice && (
          <Badge className="absolute top-2 left-2 bg-red-500">
            Sale
          </Badge>
        )}
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium line-clamp-1">{product.name}</h3>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-baseline gap-1">
            {product.salePrice ? (
              <>
                <span className="font-medium">{formatPrice(product.salePrice)}</span>
                <span className="text-xs line-through text-gray-500">{formatPrice(product.price)}</span>
              </>
            ) : (
              <span className="font-medium">{formatPrice(product.price)}</span>
            )}
          </div>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation();
                onAddToWishlist?.();
              }}
            >
              <HeartIcon 
                className={`h-4 w-4 ${isInWishlist ? "fill-red-500 text-red-500" : ""}`} 
              />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart?.();
              }}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Add default export to resolve the import issue
export default CompactProductCard;


import React from 'react';
import { formatCurrency, cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { SearchPageProduct } from '@/hooks/search/types';
import { PlusCircle, Heart, Share2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/star-rating';
import { Badge } from '@/components/ui/badge';

// Define the props for the product card
interface ProductCardProps {
  product: SearchPageProduct;
  isAddingToCart?: boolean;
  isAddingToWishlist?: boolean;
  onAddToCart: () => void;
  onAddToWishlist: () => void;
  onShare: () => void;
  onClick?: () => void;
  viewMode: 'list' | 'grid';
  buttonColor?: string;
}

export function SearchProductCard({ 
  product, 
  isAddingToCart = false,
  isAddingToWishlist = false,
  onAddToCart, 
  onAddToWishlist, 
  onShare,
  onClick,
  viewMode,
  buttonColor = 'bg-blue-500 hover:bg-blue-600'
}: ProductCardProps) {
  if (!product) return null;
  
  // Fix: Changed product.image to product.images[0]
  const productImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : '/placeholder.svg';
    
  const discountPercentage = product.salePrice && product.price 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100) 
    : 0;
  
  const handleCardClick = () => {
    if (onClick) onClick();
  };

  // Grid view layout
  if (viewMode === 'grid') {
    return (
      <div 
        className="group relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        onClick={handleCardClick}
      >
        <Link to={`/product/${product.id}`} className="block">
          <div className="relative aspect-square overflow-hidden">
            {/* Fix: Changed product.image to product.images[0] */}
            <img 
              src={productImage} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
            />
            {product.isNew && (
              <Badge className="absolute top-2 left-2 bg-green-500">New</Badge>
            )}
            {discountPercentage > 0 && (
              <Badge className="absolute top-2 right-2 bg-red-500">{discountPercentage}% OFF</Badge>
            )}
          </div>
          
          <div className="p-3">
            <h3 className="text-sm font-medium line-clamp-2 mb-1 dark:text-white">{product.name}</h3>
            <div className="flex items-center gap-1.5 mb-1">
              <StarRating rating={product.rating || 0} size="small" />
              <span className="text-xs text-gray-500 dark:text-gray-400">({product.reviewCount || 0})</span>
            </div>
            <div className="flex items-center gap-1">
              {product.salePrice ? (
                <>
                  <span className="font-bold text-gray-900 dark:text-white">₹{product.salePrice}</span>
                  <span className="text-sm text-gray-500 line-through dark:text-gray-400">₹{product.price}</span>
                </>
              ) : (
                <span className="font-bold text-gray-900 dark:text-white">₹{product.price}</span>
              )}
            </div>
          </div>
        </Link>
        
        <div className="flex p-2 pt-0 gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
            className="flex-1 h-8"
            disabled={isAddingToCart}
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            <span className="text-xs">Add</span>
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onAddToWishlist();
            }}
            className="h-8 w-8"
            disabled={isAddingToWishlist}
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button 
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onShare();
            }}
            className="h-8 w-8"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // List view layout (horizontal card)
  return (
    <div
      className="flex bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      onClick={handleCardClick}
    >
      <Link to={`/product/${product.id}`} className="shrink-0">
        <div className="relative w-24 h-24 sm:w-32 sm:h-32">
          <img 
            src={productImage} 
            alt={product.name} 
            className="w-full h-full object-cover" 
          />
          {product.isNew && (
            <Badge className="absolute top-1 left-1 text-xs bg-green-500">New</Badge>
          )}
          {discountPercentage > 0 && (
            <Badge className="absolute top-1 right-1 text-xs bg-red-500">{discountPercentage}%</Badge>
          )}
        </div>
      </Link>
      
      <div className="flex-1 p-3 min-w-0">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-medium line-clamp-1 mb-1 dark:text-white">{product.name}</h3>
          <div className="flex items-center gap-1 mb-1">
            <StarRating rating={product.rating || 0} size="small" />
            <span className="text-xs text-gray-500 dark:text-gray-400">({product.reviewCount || 0})</span>
          </div>
          <div className="flex items-center gap-1 mb-2">
            {product.salePrice ? (
              <>
                <span className="font-bold text-gray-900 dark:text-white">₹{product.salePrice}</span>
                <span className="text-sm text-gray-500 line-through dark:text-gray-400">₹{product.price}</span>
              </>
            ) : (
              <span className="font-bold text-gray-900 dark:text-white">₹{product.price}</span>
            )}
          </div>
        </Link>
        
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
            className="flex-1 h-7 text-xs"
            disabled={isAddingToCart}
          >
            <PlusCircle className="h-3 w-3 mr-1" />
            Add
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onAddToWishlist();
            }}
            className="h-7 w-7"
            disabled={isAddingToWishlist}
          >
            <Heart className="h-3 w-3" />
          </Button>
          <Button 
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onShare();
            }}
            className="h-7 w-7"
          >
            <Share2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function SearchProductCardSkeleton({ viewMode }: { viewMode: 'list' | 'grid' }) {
  if (viewMode === 'grid') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
        <Skeleton className="aspect-square w-full" />
        <div className="p-3">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-3 w-24 mb-2" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="p-2 pt-0">
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
      <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 shrink-0" />
      <div className="flex-1 p-3">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-3 w-24 mb-2" />
        <Skeleton className="h-5 w-20 mb-2" />
        <Skeleton className="h-7 w-full" />
      </div>
    </div>
  );
}

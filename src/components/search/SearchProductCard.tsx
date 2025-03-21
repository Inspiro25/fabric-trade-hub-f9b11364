
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Heart, Loader2, MoreVertical, Share2, ShoppingCart, Star, StarHalf, Truck, ShieldCheck, ArrowUpRight } from 'lucide-react';

export interface SearchPageProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  rating: number;
  review_count: number;
  is_new: boolean;
  is_trending: boolean;
  sale_price: number | null;
  colors: string[] | null;
  sizes: string[] | null;
  category_id: string | null;
  shop_id: string | null;
}

interface SearchProductCardProps {
  product: SearchPageProduct;
  isAddingToCart: string | null;
  isAddingToWishlist: string | null;
  onAddToCart: (product: SearchPageProduct) => void;
  onAddToWishlist: (product: SearchPageProduct) => void;
  onShare: (product: SearchPageProduct) => void;
  viewMode?: 'grid' | 'list';
}

const SearchProductCard: React.FC<SearchProductCardProps> = ({
  product,
  isAddingToCart,
  isAddingToWishlist,
  onAddToCart,
  onAddToWishlist,
  onShare,
  viewMode = 'grid'
}) => {
  const discountPercentage = product.sale_price 
    ? Math.round(((product.price - product.sale_price) / product.price) * 100) 
    : 0;
  
  // Render star rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf className="w-3 h-3 fill-yellow-400 text-yellow-400" />}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star key={`empty-${i}`} className="w-3 h-3 text-gray-300" />
        ))}
      </div>
    );
  };

  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
        <div className="flex flex-col md:flex-row">
          <div className="relative md:w-48 lg:w-64">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-48 md:h-full object-cover"
            />
            {product.is_new && (
              <Badge className="absolute top-2 left-2 bg-blue-500 text-white">New</Badge>
            )}
            {product.is_trending && (
              <Badge className="absolute top-2 right-2 bg-green-500 text-white">Trending</Badge>
            )}
            {product.sale_price && (
              <Badge className="absolute bottom-2 left-2 bg-red-500 text-white">{discountPercentage}% OFF</Badge>
            )}
          </div>
          
          <CardContent className="flex-1 p-4">
            <div className="flex flex-col h-full justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2 hover:text-blue-600 cursor-pointer">{product.name}</h3>
                <div className="flex items-center mb-2">
                  {renderStars(product.rating)}
                  <span className="ml-2 text-sm text-gray-500">({product.review_count})</span>
                </div>
                <p className="text-gray-600 mb-4">{product.description.substring(0, 150)}...</p>
                
                <div className="flex items-baseline mb-4">
                  {product.sale_price !== null ? (
                    <>
                      <span className="text-2xl font-bold text-red-600">${product.sale_price.toFixed(2)}</span>
                      <span className="ml-2 text-gray-500 line-through">${product.price.toFixed(2)}</span>
                      <span className="ml-2 text-green-600 text-sm">{discountPercentage}% off</span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <div className="flex items-center text-xs text-green-600">
                    <Truck className="mr-1 h-3 w-3" />
                    <span>Free Delivery</span>
                  </div>
                  <div className="flex items-center text-xs text-blue-600">
                    <ShieldCheck className="mr-1 h-3 w-3" />
                    <span>10 Day Replacement</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <Button
                  className="flex-grow md:flex-grow-0"
                  onClick={() => onAddToCart(product)}
                  disabled={isAddingToCart === product.id}
                >
                  {isAddingToCart === product.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </>
                  )}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => onAddToWishlist(product)}
                  disabled={isAddingToWishlist === product.id}
                >
                  {isAddingToWishlist === product.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Heart className="mr-2 h-4 w-4" />
                      Save
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => onShare(product)}>
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">Share</span>
                </Button>
                <Button variant="outline" className="ml-auto">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="ml-1">View Details</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }
  
  // Grid view (default)
  return (
    <Card className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="relative">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.is_new && (
          <Badge className="absolute top-2 left-2 bg-blue-500 text-white">New</Badge>
        )}
        {product.is_trending && (
          <Badge className="absolute top-2 right-2 bg-green-500 text-white">Trending</Badge>
        )}
        {product.sale_price !== null && (
          <Badge className="absolute bottom-2 left-2 bg-red-500 text-white">{discountPercentage}% OFF</Badge>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
          onClick={() => onAddToWishlist(product)}
          disabled={isAddingToWishlist === product.id}
        >
          {isAddingToWishlist === product.id ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Heart className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <CardContent className="p-4">
        <div className="mb-1">
          <div className="flex items-center space-x-1">
            {renderStars(product.rating)}
            <span className="text-xs text-gray-500">({product.review_count})</span>
          </div>
        </div>
        
        <h3 className="text-sm font-medium mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">{product.name}</h3>
        
        <div className="flex items-baseline mb-2">
          {product.sale_price !== null ? (
            <>
              <span className="text-lg font-bold text-red-600">${product.sale_price.toFixed(2)}</span>
              <span className="ml-2 text-sm text-gray-500 line-through">${product.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
          )}
        </div>
        
        <div className="text-xs text-green-600 mb-3">
          Free Delivery
        </div>
        
        <div className="flex justify-between space-x-2">
          <Button
            className="flex-1"
            size="sm"
            onClick={() => onAddToCart(product)}
            disabled={isAddingToCart === product.id}
          >
            {isAddingToCart === product.id ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <ShoppingCart className="h-3 w-3" />
            )}
            <span className="ml-1">Add</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="px-2">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onShare(product)}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ArrowUpRight className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchProductCard;

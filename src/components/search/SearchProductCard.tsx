
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Heart, Loader2, MoreVertical, Share2, ShoppingCart } from 'lucide-react';

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
}

const SearchProductCard: React.FC<SearchProductCardProps> = ({
  product,
  isAddingToCart,
  isAddingToWishlist,
  onAddToCart,
  onAddToWishlist,
  onShare
}) => {
  return (
    <Card className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.is_new && (
          <Badge className="absolute top-2 left-2 bg-blue-500 text-white">New</Badge>
        )}
        {product.is_trending && (
          <Badge className="absolute top-2 right-2 bg-green-500 text-white">Trending</Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-2">{product.description.substring(0, 50)}...</p>
        <div className="flex items-center justify-between">
          <div>
            {product.sale_price !== null ? (
              <>
                <span className="text-red-500 line-through">${product.price}</span>
                <span className="text-xl font-bold ml-2">${product.sale_price}</span>
              </>
            ) : (
              <span className="text-xl font-bold">${product.price}</span>
            )}
          </div>
          <div className="flex items-center">
            <svg
              className="w-4 h-4 text-yellow-500 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 1l2.939 4.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
            <span>{product.rating} ({product.review_count})</span>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <Button
            size="sm"
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
            size="sm"
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
                Wishlist
              </>
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onShare(product)}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchProductCard;

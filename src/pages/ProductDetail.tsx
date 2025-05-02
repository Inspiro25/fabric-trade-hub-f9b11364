import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '@/lib/products/types';
import { formatCurrency } from '@/lib/utils';
import { Star } from 'lucide-react';
import ImageGallery from '@/components/ui/ImageGallery';
import ProductReviews from '@/components/products/ProductReviews';
import RelatedProducts from '@/components/products/RelatedProducts';
import { useCart } from '@/hooks/use-cart';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Skeleton } from '@/components/ui/skeleton';
import { useProducts } from '@/hooks/use-products';

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProducts({ id: productId || '' });
  const { addToCart } = useCart();
  
  const [selectedColor, setSelectedColor] = useState<string | undefined>(product?.colors ? product.colors[0] : undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(product?.sizes ? product.sizes[0] : undefined);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  
  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors ? product.colors[0] : undefined);
      setSelectedSize(product.sizes ? product.sizes[0] : undefined);
    }
  }, [product]);
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Skeleton className="w-full aspect-square rounded-lg" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product) {
      const options = {
        color: selectedColor,
        size: selectedSize
      };
      addToCart(product, selectedQuantity, options);
      toast.success(`${product.name} added to cart!`);
    }
  };
  
  const handleBuyNow = () => {
    if (product) {
      const options = {
        color: selectedColor,
        size: selectedSize
      };
      addToCart(product, selectedQuantity, options);
      navigate('/checkout');
    }
  };
  
  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image Gallery */}
        <div>
          <ImageGallery images={product.images} alt={product.name} />
        </div>
        
        {/* Product Details */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-gray-500">Category: {product.category}</p>
          
          {/* Rating and Reviews */}
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star}
                className={`h-5 w-5 ${star <= Math.round(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-500">
              {product.reviewCount} reviews
            </span>
          </div>
          
          {/* Price */}
          <div className="text-xl font-semibold">
            {product.salePrice ? (
              <>
                <span className="line-through text-gray-500 mr-2">
                  {formatCurrency(product.price)}
                </span>
                {formatCurrency(product.salePrice)}
              </>
            ) : (
              formatCurrency(product.price)
            )}
          </div>
          
          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <Label htmlFor="color">Color</Label>
              <Select value={selectedColor} onValueChange={setSelectedColor}>
                <SelectTrigger id="color">
                  <SelectValue placeholder="Select a color" />
                </SelectTrigger>
                <SelectContent>
                  {product.colors.map((color) => (
                    <SelectItem key={color} value={color}>{color}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <Label htmlFor="size">Size</Label>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger id="size">
                  <SelectValue placeholder="Select a size" />
                </SelectTrigger>
                <SelectContent>
                  {product.sizes.map((size) => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Quantity Selector */}
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              type="number"
              id="quantity"
              value={selectedQuantity}
              onChange={(e) => setSelectedQuantity(Number(e.target.value))}
              min="1"
              className="w-24"
            />
          </div>
          
          {/* Add to Cart Button */}
          <div className="flex space-x-4">
            <Button onClick={handleAddToCart}>Add to Cart</Button>
            <Button variant="secondary" onClick={handleBuyNow}>Buy Now</Button>
          </div>
          
          {/* Product Description */}
          <div>
            <h2 className="text-lg font-semibold">Description</h2>
            <p className="text-gray-700">{product.description}</p>
          </div>
        </div>
      </div>
      
      {/* Product Reviews */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Reviews</h2>
        <ProductReviews productId={product.id} rating={product.rating} reviewCount={product.reviewCount} />
      </div>
      
      {/* Related Products */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Related Products</h2>
        <RelatedProducts currentProductId={product.id} categoryId={product.category_id} />
      </div>
    </div>
  );
};

export default ProductDetail;

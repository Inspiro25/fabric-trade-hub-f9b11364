import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '@/lib/products/base';
import { Product } from '@/lib/products/types';
import { useCart } from '@/hooks/use-cart';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductReviews from '@/components/products/ProductReviews';
import RelatedProducts from '@/components/products/RelatedProducts';
import { Helmet } from 'react-helmet';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import ImageGallery from '@/components/ui/ImageGallery';

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { isDarkMode } = useTheme();
  
  useEffect(() => {
    async function fetchProduct() {
      if (productId) {
        try {
          const productData = await getProductById(productId);
          setProduct(productData);
          // If product has colors, select the first one
          if (productData?.colors && productData.colors.length > 0) {
            setSelectedColor(productData.colors[0]);
          }
          // If product has sizes, select the first one
          if (productData?.sizes && productData.sizes.length > 0) {
            setSelectedSize(productData.sizes[0]);
          }
        } catch (error) {
          console.error('Error fetching product:', error);
          toast.error('Failed to load product details');
        } finally {
          setLoading(false);
        }
      }
    }
    
    fetchProduct();
  }, [productId]);

  // Handle adding to cart
  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.salePrice || product.price,
        image: product.images[0],
        quantity,
        color: selectedColor || undefined,
        size: selectedSize || undefined
      });
      toast.success(`${product.name} added to cart!`);
    }
  };

  // Handle buying now
  const handleBuyNow = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.salePrice || product.price,
        image: product.images[0],
        quantity,
        color: selectedColor || undefined,
        size: selectedSize || undefined
      });
      navigate('/checkout');
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    } else {
      toast.error('Maximum available quantity selected');
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-1/3" />
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-1/3" />
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-8 w-12" />
              </div>
            </div>
            <div className="flex space-x-2 pt-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <p className="mt-2">The product you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/products')} className="mt-4">
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product.name} | E-Commerce Store</title>
        <meta name="description" content={product.description} />
      </Helmet>
      
      <div className={cn(
        "container mx-auto px-4 py-8",
        isDarkMode ? "text-gray-100" : "text-gray-800"
      )}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="sticky top-24 self-start">
            <ImageGallery images={product.images} alt={product.name} />
          </div>
          
          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              
              <div className="flex items-center mt-2 space-x-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.round(product.rating) ? "text-yellow-400" : "text-gray-300"}>
                      ★
                    </span>
                  ))}
                  <span className="ml-2 text-sm">
                    ({product.reviewCount || product.review_count || 0} reviews)
                  </span>
                </div>
                
                {product.isNew && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">New</Badge>
                )}
                
                {product.isTrending && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-200">Trending</Badge>
                )}
              </div>
            </div>
            
            <div className="text-xl font-bold">
              {product.salePrice ? (
                <div className="flex items-center space-x-2">
                  <span className="text-red-600">{formatCurrency(product.salePrice)}</span>
                  <span className="text-gray-400 line-through text-sm">{formatCurrency(product.price)}</span>
                  <span className="text-green-600 text-sm">
                    {Math.round((1 - product.salePrice / product.price) * 100)}% off
                  </span>
                </div>
              ) : (
                <span>{formatCurrency(product.price)}</span>
              )}
            </div>
            
            <p className="text-gray-600 dark:text-gray-300">{product.description}</p>
            
            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColor === color 
                          ? 'border-blue-500 ring-2 ring-blue-300' 
                          : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1 border rounded-md ${
                        selectedSize === size 
                          ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quantity Selector */}
            <div>
              <h3 className="font-medium mb-2">Quantity</h3>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={incrementQuantity}
                  disabled={product.stock <= quantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                  {product.stock} available
                </span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={handleAddToCart} 
                className="flex-1"
                variant="outline"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <Button 
                onClick={handleBuyNow} 
                className="flex-1"
              >
                Buy Now
              </Button>
            </div>
            
            {/* Product Metadata */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2 text-sm">
              {product.sku && (
                <p><span className="font-medium">SKU:</span> {product.sku}</p>
              )}
              {product.category && (
                <p><span className="font-medium">Category:</span> {product.category}</p>
              )}
              {product.brand && (
                <p><span className="font-medium">Brand:</span> {product.brand}</p>
              )}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  <span className="font-medium">Tags:</span>
                  {product.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="ml-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4 p-4">
              <div className="prose dark:prose-invert max-w-none">
                <p>{product.description}</p>
              </div>
            </TabsContent>
            <TabsContent value="specifications" className="mt-4 p-4">
              {product.specifications ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="border-b pb-2">
                      <span className="font-medium">{key}:</span> {value}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No specifications available for this product.</p>
              )}
            </TabsContent>
            <TabsContent value="reviews" className="mt-4">
              <ProductReviews 
                productId={product.id} 
                rating={product.rating} 
                reviewCount={product.reviewCount || product.review_count} 
              />
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You might also like</h2>
          <RelatedProducts 
            currentProductId={product.id} 
            categoryId={product.categoryId || product.category_id} 
          />
        </div>
      </div>
    </>
  );
};

export default ProductDetail;

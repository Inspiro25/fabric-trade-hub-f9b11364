import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getProductById } from '@/lib/products/base';
import { Product } from '@/lib/products/types';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Star, TruckIcon, ShieldCheck, Heart, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import ProductReviews from '@/components/reviews/ProductReviews';
import { isProductInWishlist } from '@/lib/supabase/wishlist';
import { addToCart } from '@/lib/cart-operations';
import { CartItem } from '@/types/cart';

// Type definition for similar product
interface SimilarProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  rating: number;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const { addToCart: addToCartContext } = useCart();
  const { addToWishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string>('');
  const [inWishlist, setInWishlist] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [similarProducts, setSimilarProducts] = useState<SimilarProduct[]>([]);
  const [expandedSpecs, setExpandedSpecs] = useState<boolean>(true);
  const [expandedDesc, setExpandedDesc] = useState<boolean>(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        if (id) {
          const productData = await getProductById(id);
          if (productData) {
            console.log('Product fetched:', productData);
            setProduct(productData);
            setMainImage(productData.images?.[0] || '/placeholder.png');
            
            // Set default selections if available
            if (productData.colors && productData.colors.length > 0) {
              setSelectedColor(productData.colors[0]);
            }
            
            if (productData.sizes && productData.sizes.length > 0) {
              setSelectedSize(productData.sizes[0]);
            }
            
            // Fetch similar products (mock data for now)
            // This would typically be a backend call to get similar products
            const mockSimilar = [
              {
                id: 'sim1',
                name: 'Similar Product 1',
                image: '/placeholder.png',
                price: productData.price * 0.9,
                rating: 4.3
              },
              {
                id: 'sim2',
                name: 'Similar Product 2',
                image: '/placeholder.png',
                price: productData.price * 1.1,
                rating: 4.5
              },
              {
                id: 'sim3',
                name: 'Similar Product 3',
                image: '/placeholder.png',
                price: productData.price * 0.95,
                rating: 4.1
              }
            ];
            setSimilarProducts(mockSimilar);
            
            // Check if product is in wishlist
            if (currentUser) {
              const wishlistStatus = await isProductInWishlist(currentUser.id, id);
              setInWishlist(wishlistStatus);
            }
          } else {
            toast.error('Product not found');
            navigate('/products');
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id, currentUser, navigate]);
  
  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    
    try {
      if (currentUser) {
        await addToCart(
          currentUser.id,
          product,
          quantity,
          selectedColor || undefined,
          selectedSize || undefined
        );
        
        toast.success('Added to cart');
      } else {
        // Create the cart item object for the context function
        const cartItem: CartItem = {
          id: `guest-${Date.now()}`,
          productId: product.id,
          name: product.name,
          image: product.images[0] || '/placeholder.png',
          price: product.salePrice || product.price,
          quantity,
          color: selectedColor || undefined,
          size: selectedSize || undefined,
          stock: product.stock,
          shopId: product.shop_id,
          total: (product.salePrice || product.price) * quantity
        };
        
        addToCartContext(cartItem);
        toast.success('Added to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  const handleBuyNow = async () => {
    if (!product) return;
    
    try {
      if (currentUser) {
        await addToCart(
          currentUser.id,
          product,
          quantity,
          selectedColor || undefined,
          selectedSize || undefined
        );
      } else {
        // Create cart item for context
        const cartItem: CartItem = {
          id: `guest-${Date.now()}`,
          productId: product.id,
          name: product.name,
          image: product.images[0] || '/placeholder.png',
          price: product.salePrice || product.price,
          quantity,
          color: selectedColor || undefined,
          size: selectedSize || undefined,
          stock: product.stock,
          shopId: product.shop_id,
          total: (product.salePrice || product.price) * quantity
        };
        
        addToCartContext(cartItem);
      }
      
      // Navigate to checkout immediately
      navigate('/checkout');
    } catch (error) {
      console.error('Error proceeding to checkout:', error);
      toast.error('Failed to proceed to checkout');
    }
  };
  
  const handleToggleWishlist = async () => {
    if (!product) return;
    
    setIsAddingToWishlist(true);
    
    try {
      if (!currentUser) {
        toast.error('Please log in to add to wishlist');
        navigate('/auth/login');
        return;
      }
      
      if (inWishlist) {
        await removeFromWishlist(product.id);
        setInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(product.id);
        setInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Failed to update wishlist');
    } finally {
      setIsAddingToWishlist(false);
    }
  };
  
  // Handle image change
  const handleImageClick = (image: string) => {
    setMainImage(image);
  };
  
  // Handle quantity changes
  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    } else {
      toast.error('Maximum available quantity reached');
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Image skeleton */}
          <div className="lg:w-2/5">
            <Skeleton className="w-full aspect-square rounded-lg" />
            <div className="flex mt-4 gap-2 overflow-x-auto">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="w-16 h-16 rounded" />
              ))}
            </div>
          </div>
          
          {/* Details skeleton */}
          <div className="lg:w-3/5">
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2 mb-4" />
            <Skeleton className="h-10 w-1/3 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </div>
            <div className="flex gap-4 mt-8">
              <Skeleton className="h-12 w-36" />
              <Skeleton className="h-12 w-36" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-semibold">Product not found</h2>
        <p className="text-gray-600 mt-2">The product you're looking for doesn't exist or has been removed.</p>
        <Button className="mt-4" asChild>
          <Link to="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Images Section */}
        <div className="lg:w-2/5 sticky top-24 self-start">
          {/* Main image */}
          <div className="border rounded-lg overflow-hidden bg-white p-4 flex items-center justify-center h-96">
            <img 
              src={mainImage} 
              alt={product.name} 
              className="max-h-full max-w-full object-contain"
            />
          </div>
          
          {/* Thumbnail images */}
          <div className="flex mt-4 gap-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <div 
                key={index}
                className={`w-16 h-16 border rounded cursor-pointer ${mainImage === image ? 'border-blue-500 border-2' : 'border-gray-200'}`}
                onClick={() => setMainImage(image)}
              >
                <img 
                  src={image} 
                  alt={`${product.name} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          
          {/* Action buttons (Flipkart style) */}
          <div className="flex gap-2 mt-6">
            <Button 
              size="lg" 
              className="flex-1 bg-orange-500 hover:bg-orange-600"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            
            <Button 
              size="lg" 
              className="flex-1 bg-blue-500 hover:bg-blue-600"
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>
          </div>
        </div>
        
        {/* Product Details Section */}
        <div className="lg:w-3/5">
          {/* Breadcrumbs */}
          <div className="text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:underline">Home</Link> &gt; 
            <Link to={`/categories/${product.category}`} className="hover:underline ml-1">{product.category}</Link> &gt; 
            <span className="ml-1">{product.name}</span>
          </div>
          
          {/* Product title and basic info */}
          <h1 className="text-2xl font-semibold mb-1">{product.name}</h1>
          
          {/* Ratings */}
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-green-600 text-white text-sm px-2 py-0.5 rounded flex items-center">
              {product.rating}
              <Star className="h-3 w-3 ml-1 fill-current" />
            </div>
            <span className="text-gray-500">
              {product.reviewCount} ratings & reviews
            </span>
          </div>
          
          {/* Price */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">
                {formatCurrency(product.salePrice || product.price)}
              </span>
              
              {product.salePrice && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 line-through">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="text-green-600">
                    {Math.round((1 - product.salePrice / product.price) * 100)}% off
                  </span>
                </div>
              )}
            </div>
            {product.stock <= 5 && (
              <p className="text-orange-600 text-sm mt-1">Only {product.stock} left in stock!</p>
            )}
          </div>
          
          {/* Color selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-gray-700 mb-2">Color</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className={`border rounded-md px-4 py-2 ${
                      selectedColor === color 
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : 'border-gray-300'
                    }`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Size selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-gray-700 mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`border rounded-md px-4 py-2 ${
                      selectedSize === size 
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : 'border-gray-300'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Quantity selector */}
          <div className="mb-6">
            <h3 className="text-gray-700 mb-2">Quantity</h3>
            <div className="flex items-center">
              <button 
                className="border border-gray-300 rounded-l-md p-2"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                <ChevronDown className="h-4 w-4" />
              </button>
              <input
                type="number"
                className="border-t border-b border-gray-300 py-2 px-3 w-16 text-center"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val > 0 && val <= product.stock) {
                    setQuantity(val);
                  }
                }}
                min="1"
                max={product.stock}
              />
              <button 
                className="border border-gray-300 rounded-r-md p-2"
                onClick={incrementQuantity}
                disabled={quantity >= product.stock}
              >
                <ChevronUp className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Wishlist button */}
          <Button
            variant="outline"
            className="mb-6"
            onClick={handleToggleWishlist}
            disabled={isAddingToWishlist}
          >
            <Heart className={`mr-2 h-5 w-5 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
            {inWishlist ? 'Saved in Wishlist' : 'Add to Wishlist'}
          </Button>
          
          {/* Delivery and services */}
          <div className="mb-6 border rounded-lg p-4">
            <div className="flex items-start gap-2 mb-4">
              <TruckIcon className="h-5 w-5 text-gray-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Free Delivery</h4>
                <p className="text-gray-500 text-sm">Delivery by 3-5 business days</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <ShieldCheck className="h-5 w-5 text-gray-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Warranty</h4>
                <p className="text-gray-500 text-sm">{product.specifications?.warranty || '1 Year manufacturer warranty'}</p>
              </div>
            </div>
          </div>
          
          {/* Collapsible description */}
          <div className="border rounded-lg overflow-hidden mb-4">
            <button 
              className="w-full flex justify-between items-center p-4 bg-gray-50"
              onClick={() => setExpandedDesc(!expandedDesc)}
            >
              <h3 className="font-medium">Product Description</h3>
              {expandedDesc ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            
            {expandedDesc && (
              <div className="p-4">
                <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
              </div>
            )}
          </div>
          
          {/* Specifications */}
          <div className="border rounded-lg overflow-hidden mb-4">
            <button 
              className="w-full flex justify-between items-center p-4 bg-gray-50"
              onClick={() => setExpandedSpecs(!expandedSpecs)}
            >
              <h3 className="font-medium">Specifications</h3>
              {expandedSpecs ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            
            {expandedSpecs && (
              <div className="p-4">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                  {product.specifications ? (
                    Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-2 gap-2">
                        <dt className="font-medium text-gray-700">{key}</dt>
                        <dd className="text-gray-600">{value}</dd>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-gray-600 italic">
                      No specifications available
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>
          
          {/* Reviews section */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Ratings & Reviews</h3>
            <ProductReviews 
              productId={product.id} 
              rating={product.rating} 
              reviewCount={product.reviewCount || 0}
            />
          </div>
          
          {/* Similar products */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Similar Products</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {similarProducts.map((similarProduct) => (
                <Link 
                  key={similarProduct.id} 
                  to={`/product/${similarProduct.id}`}
                  className="border rounded-lg p-3 hover:shadow-md transition-shadow"
                >
                  <img 
                    src={similarProduct.image} 
                    alt={similarProduct.name}
                    className="w-full h-32 object-contain mb-2" 
                  />
                  <h4 className="font-medium truncate">{similarProduct.name}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-bold">{formatCurrency(similarProduct.price)}</span>
                    <div className="flex items-center bg-green-600 text-white text-xs px-1 py-0.5 rounded">
                      {similarProduct.rating}
                      <Star className="h-2 w-2 ml-0.5 fill-current" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

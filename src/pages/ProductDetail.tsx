import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductGrid from '@/components/features/ProductGrid';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Share2, 
  Truck, 
  RefreshCw, 
  Check, 
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  StarHalf,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { getProductById, getRelatedProducts, Product } from '@/lib/products';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import ProductReviews from '@/components/reviews/ProductReviews';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Drawer,
  DrawerContent,
  DrawerTrigger
} from '@/components/ui/drawer';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  
  const [mainImage, setMainImage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [isFavorited, setIsFavorited] = useState(false);
  
  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) {
        navigate('/not-found');
        return;
      }
      
      setIsLoading(true);
      try {
        const productData = await getProductById(id);
        if (!productData) {
          navigate('/not-found');
          return;
        }
        
        setProduct(productData);
        
        setMainImage(productData.images[0]);
        setSelectedColor(productData.colors[0]);
        setSelectedSize(productData.sizes[0]);
        
        const relatedProductsData = await getRelatedProducts(productData.id, productData.category);
        setRelatedProducts(relatedProductsData);
        
        const timer = setTimeout(() => {
          setIsLoaded(true);
          setIsLoading(false);
        }, 100);
        
        window.scrollTo(0, 0);
        
        return () => clearTimeout(timer);
      } catch (error) {
        console.error('Error fetching product:', error);
        setIsLoading(false);
        navigate('/not-found');
      }
    };
    
    fetchProductData();
  }, [id, navigate]);

  useEffect(() => {
    if (product && isInWishlist(product.id)) {
      setIsFavorited(true);
    } else {
      setIsFavorited(false);
    }
  }, [product, isInWishlist]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kutuku-primary"></div>
      </div>
    );
  }
  
  if (!product) {
    return null;
  }
  
  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    toast.success(`${product.name} added to cart`);
  };
  
  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prevQty => prevQty + 1);
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQty => prevQty - 1);
    }
  };
  
  const toggleFavorite = () => {
    if (isFavorited) {
      removeFromWishlist(product.id);
      setIsFavorited(false);
    } else {
      addToWishlist(product.id);
      setIsFavorited(true);
    }
    
    toast.success(
      isFavorited 
        ? `${product.name} removed from wishlist` 
        : `${product.name} added to wishlist`
    );
  };
  
  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="w-4 h-4 fill-kutuku-primary text-kutuku-primary" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="w-4 h-4 fill-kutuku-primary text-kutuku-primary" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="w-4 h-4 text-muted-foreground" />);
    }
    
    return stars;
  };

  const MobileHeader = () => (
    <div className="fixed top-0 left-0 right-0 z-10 bg-white shadow-sm border-b p-3">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 text-kutuku-dark" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="ml-2 text-sm font-medium truncate flex-1">
          {product.name}
        </h1>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`h-9 w-9 ${isFavorited ? 'text-kutuku-primary' : 'text-kutuku-dark'}`}
          onClick={toggleFavorite}
        >
          <Heart className={`h-5 w-5 ${isFavorited ? 'fill-kutuku-primary' : ''}`} />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 text-kutuku-dark ml-1"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: product.name,
                text: product.description,
                url: window.location.href,
              }).catch(err => {
                console.error('Error sharing:', err);
              });
            } else {
              navigator.clipboard.writeText(window.location.href);
              toast.success('Link copied to clipboard');
            }
          }}
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );

  const MobileBottomBar = () => (
    <div className="fixed bottom-0 left-0 right-0 z-10 bg-white shadow-lg border-t p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col">
          {product.salePrice ? (
            <>
              <span className="text-lg font-bold text-kutuku-primary">${product.salePrice.toFixed(2)}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 line-through">${product.price.toFixed(2)}</span>
                <span className="text-xs bg-kutuku-light text-kutuku-primary px-1.5 py-0.5 rounded-sm">
                  {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                </span>
              </div>
            </>
          ) : (
            <span className="text-xl font-bold text-kutuku-primary">${product.price.toFixed(2)}</span>
          )}
        </div>
        
        <Button 
          className="flex-1 bg-kutuku-primary hover:bg-kutuku-secondary h-12 rounded-full"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );

  const MobileVariantSelector = () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full mt-4 border-kutuku-primary text-kutuku-primary hover:bg-kutuku-light"
        >
          Select Size & Color
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-4 pt-0 max-h-[80vh] rounded-t-xl">
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-3"></div>
        
        <div className="mb-6 mt-4">
          <h3 className="font-medium mb-3">Color: <span className="text-kutuku-primary">{selectedColor}</span></h3>
          <div className="flex flex-wrap gap-3">
            {product.colors.map(color => (
              <button
                key={color}
                type="button"
                className={`w-14 h-14 rounded-full border-2 transition-all flex items-center justify-center ${
                  selectedColor === color 
                    ? 'border-kutuku-primary' 
                    : 'border-muted hover:border-kutuku-primary/50'
                }`}
                onClick={() => setSelectedColor(color)}
                aria-label={`Select ${color} color`}
              >
                <span 
                  className="w-12 h-12 rounded-full" 
                  style={{ backgroundColor: color.toLowerCase() }}
                />
                {selectedColor === color && (
                  <Check className="absolute w-5 h-5 text-white drop-shadow-md" />
                )}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Size: <span className="text-kutuku-primary">{selectedSize}</span></h3>
            <Button variant="link" className="p-0 h-auto text-kutuku-primary" asChild>
              <Link to="/sizing">
                Size Guide
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {product.sizes.map(size => (
              <button
                key={size}
                type="button"
                className={`h-14 rounded-lg border-2 transition-all ${
                  selectedSize === size 
                    ? 'border-kutuku-primary bg-kutuku-light' 
                    : 'border-muted hover:border-kutuku-primary/50'
                }`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-medium mb-3">Quantity:</h3>
          <div className="flex items-center border border-gray-200 rounded-lg w-full">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={decrementQuantity}
              disabled={quantity <= 1}
              className="h-14 w-14 text-kutuku-primary"
            >
              <Minus className="w-5 h-5" />
            </Button>
            <span className="flex-1 text-center font-medium">{quantity}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={incrementQuantity}
              disabled={quantity >= product.stock}
              className="h-14 w-14 text-kutuku-primary"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {product.stock > 10 
              ? 'In stock, ready to ship' 
              : product.stock > 0 
                ? `Limited stock: only ${product.stock} left` 
                : 'Out of stock'}
          </p>
        </div>
        
        <Button 
          className="w-full h-14 bg-kutuku-primary hover:bg-kutuku-secondary rounded-full"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Add to Cart
        </Button>
      </DrawerContent>
    </Drawer>
  );

  return (
    <div className="animate-page-transition pb-24">
      {isMobile ? (
        <>
          <MobileHeader />
          <div className="pt-16 pb-24">
            <div className="relative aspect-[4/5] bg-gray-50">
              <img 
                src={mainImage} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs">
                {product.images.indexOf(mainImage) + 1}/{product.images.length}
              </div>
            </div>
            
            <div className="flex gap-2 p-2 overflow-x-auto hide-scrollbar">
              {product.images.map((image, index) => (
                <div 
                  key={index}
                  className={`cursor-pointer flex-shrink-0 w-16 h-16 rounded overflow-hidden transition-all ${
                    mainImage === image ? 'ring-2 ring-kutuku-primary' : 'opacity-70'
                  }`}
                  onClick={() => setMainImage(image)}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} - View ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            
            <div className="p-4">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="bg-kutuku-light text-kutuku-primary text-xs px-2 py-0.5 rounded-full">
                  {product.category}
                </span>
                {product.isNew && (
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">New</span>
                )}
                {product.isTrending && (
                  <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full">Trending</span>
                )}
              </div>
              
              <h1 className="text-xl font-bold mb-2">{product.name}</h1>
              
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  {renderRatingStars(product.rating)}
                </div>
                <span className="text-sm text-gray-500">
                  ({product.reviewCount})
                </span>
              </div>
              
              <div className="border-t border-gray-100 my-3 pt-3">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
              
              <MobileVariantSelector />
              
              <div className="mt-5 space-y-3 border-t border-gray-100 pt-4">
                <div className="flex items-center text-sm">
                  <Truck className="w-4 h-4 text-kutuku-primary mr-3" />
                  <span>Free shipping on orders over $100</span>
                </div>
                <div className="flex items-center text-sm">
                  <RefreshCw className="w-4 h-4 text-kutuku-primary mr-3" />
                  <span>Free returns within 30 days</span>
                </div>
                <div className="flex items-center text-sm">
                  <Check className="w-4 h-4 text-kutuku-primary mr-3" />
                  <span>
                    {product.stock > 10 
                      ? 'In stock, ready to ship' 
                      : product.stock > 0 
                        ? `Limited stock: only ${product.stock} left` 
                        : 'Out of stock'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-2 px-4">
              <ProductReviews 
                productId={product.id} 
                rating={product.rating} 
                reviewCount={product.reviewCount}
              />
            </div>
            
            <div className="mt-6 px-4">
              <h2 className="text-lg font-bold mb-4">You Might Also Like</h2>
              <ProductGrid 
                products={relatedProducts.slice(0, 4)}
                columns={2}
                showPagination={false}
                title=""
                subtitle=""
              />
              
              {relatedProducts.length > 4 && (
                <div className="text-center mt-4">
                  <Button 
                    variant="outline" 
                    className="border-kutuku-primary text-kutuku-primary hover:bg-kutuku-light"
                  >
                    View More
                  </Button>
                </div>
              )}
            </div>
          </div>
          <MobileBottomBar />
        </>
      ) : (
        <>
          <Navbar />
          
          <main className="pt-24 pb-20">
            <div className="container mx-auto px-4 md:px-6">
              <nav className="flex items-center text-sm mb-8">
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
                <ChevronRight className="w-4 h-4 mx-2 text-muted-foreground" />
                <Link to={`/category/${product.category.toLowerCase()}`} className="text-muted-foreground hover:text-foreground transition-colors">
                  {product.category}
                </Link>
                <ChevronRight className="w-4 h-4 mx-2 text-muted-foreground" />
                <span className="text-foreground">{product.name}</span>
              </nav>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div 
                  className={`transition-all duration-500 ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
                    <img 
                      src={mainImage} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4">
                    {product.images.map((image, index) => (
                      <div


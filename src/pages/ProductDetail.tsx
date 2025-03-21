
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
  StarHalf
} from 'lucide-react';
import { toast } from 'sonner';
import { getProductById, getRelatedProducts, Product } from '@/lib/products';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
          // Product not found, redirect to 404
          navigate('/not-found');
          return;
        }
        
        setProduct(productData);
        
        // Initialize state with product data
        setMainImage(productData.images[0]);
        setSelectedColor(productData.colors[0]);
        setSelectedSize(productData.sizes[0]);
        
        // Fetch related products
        const relatedProductsData = await getRelatedProducts(productData.id, productData.category);
        setRelatedProducts(relatedProductsData);
        
        // Simulate loading
        const timer = setTimeout(() => {
          setIsLoaded(true);
          setIsLoading(false);
        }, 100);
        
        // Scroll to top
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
    // Update favorite status when product changes
    if (product && isInWishlist(product.id)) {
      setIsFavorited(true);
    } else {
      setIsFavorited(false);
    }
  }, [product, isInWishlist]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!product) {
    return null; // Will redirect in useEffect
  }
  
  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    // Toast is now handled by CartContext's addToCart
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
      stars.push(<Star key={`star-${i}`} className="w-4 h-4 fill-primary text-primary" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="w-4 h-4 fill-primary text-primary" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="w-4 h-4 text-muted-foreground" />);
    }
    
    return stars;
  };

  return (
    <div className="animate-page-transition">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb */}
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
          
          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
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
                    key={index}
                    className={`cursor-pointer aspect-square rounded-md overflow-hidden transition-all ${
                      mainImage === image ? 'ring-2 ring-primary' : 'hover:opacity-80'
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
            </div>
            
            {/* Product Info */}
            <div 
              className={`transition-all duration-500 delay-300 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="category-chip">{product.category}</span>
                {product.isNew && (
                  <span className="category-chip bg-primary text-primary-foreground">New Arrival</span>
                )}
                {product.isTrending && (
                  <span className="category-chip bg-accent text-accent-foreground">Trending</span>
                )}
              </div>
              
              <h1 className="heading-lg mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {renderRatingStars(product.rating)}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.reviewCount} reviews)
                </span>
              </div>
              
              <div className="mb-6">
                {product.salePrice ? (
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold">${product.salePrice.toFixed(2)}</span>
                    <span className="text-lg text-muted-foreground line-through">${product.price.toFixed(2)}</span>
                    <span className="bg-destructive/10 text-destructive text-sm px-2 py-0.5 rounded">
                      {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                )}
              </div>
              
              <p className="text-muted-foreground mb-8">
                {product.description}
              </p>
              
              {/* Color Selection */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Color: <span className="text-muted-foreground">{selectedColor}</span></h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center ${
                        selectedColor === color 
                          ? 'border-primary' 
                          : 'border-muted hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedColor(color)}
                      aria-label={`Select ${color} color`}
                    >
                      <span 
                        className="w-10 h-10 rounded-full" 
                        style={{ backgroundColor: color.toLowerCase() }}
                      />
                      {selectedColor === color && (
                        <Check className="absolute w-4 h-4 text-white drop-shadow-md" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Size Selection */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Size: <span className="text-muted-foreground">{selectedSize}</span></h3>
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <Link to="/sizing">
                      Size Guide
                    </Link>
                  </Button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      type="button"
                      className={`min-w-[3rem] h-12 rounded-md border-2 transition-all ${
                        selectedSize === size 
                          ? 'border-primary bg-primary/5' 
                          : 'border-muted hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Quantity and Add to Cart */}
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center border rounded-md">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="h-12 w-12"
                  >
                    <Minus className="w-4 h-4" />
                    <span className="sr-only">Decrease quantity</span>
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                    className="h-12 w-12"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="sr-only">Increase quantity</span>
                  </Button>
                </div>
                
                <Button 
                  size="lg" 
                  className="flex-1"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={`h-12 w-12 ${isFavorited ? 'text-destructive border-destructive' : ''}`}
                  onClick={toggleFavorite}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-destructive' : ''}`} />
                  <span className="sr-only">
                    {isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
                  </span>
                </Button>
                
                <Button variant="outline" size="icon" className="h-12 w-12">
                  <Share2 className="w-4 h-4" />
                  <span className="sr-only">Share product</span>
                </Button>
              </div>
              
              {/* Product Info */}
              <div className="space-y-4 border-t border-border pt-6">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-muted-foreground" />
                  <span>Free shipping on orders over $100</span>
                </div>
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-muted-foreground" />
                  <span>Free returns within 30 days</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-muted-foreground" />
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
          </div>
          
          {/* Related Products */}
          <section className="mt-20">
            <ProductGrid 
              products={relatedProducts}
              title="You Might Also Like"
              subtitle="Similar items that complement your selection"
            />
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;


import { useState, useEffect } from 'react';
import { Product as ImportedProduct } from '@/lib/types/product';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { SearchPageProduct } from '@/components/search/SearchProductCard';

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'rating';

interface Category {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
}

interface Shop {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  cover_image: string | null;
  rating: number | null;
  review_count: number | null;
  is_verified: boolean | null;
  address: string | null;
  owner_name: string | null;
  owner_email: string | null;
  shop_id: string | null;
  status: string | null;
}

export const useSearch = (query: string) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<SearchPageProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [rating, setRating] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState<string | null>(null);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<SearchPageProduct | null>(null);
  
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const { currentUser } = useAuth();

  // Convert SearchPageProduct to ImportedProduct
  const convertToImportedProduct = (product: SearchPageProduct): ImportedProduct => {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      salePrice: product.sale_price || undefined,
      images: product.images,
      category: product.category_id || "uncategorized",
      colors: product.colors || [],
      sizes: product.sizes || [],
      isNew: product.is_new,
      isTrending: product.is_trending,
      rating: product.rating,
      reviewCount: product.review_count,
      stock: 10, // Default value for stock
      tags: [], // Default empty tags
      shopId: product.shop_id
    };
  };

  // Fetch products on mount and when query changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const productsResponse = await fetch(`/api/products?q=${query}`);
        if (!productsResponse.ok) {
          throw new Error(`Failed to fetch products: ${productsResponse.status}`);
        }
        const productsData = await productsResponse.json();
        setProducts(productsData);

        const categoriesResponse = await fetch('/api/categories');
        if (!categoriesResponse.ok) {
          throw new Error(`Failed to fetch categories: ${categoriesResponse.status}`);
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        const shopsResponse = await fetch('/api/shops');
        if (!shopsResponse.ok) {
          throw new Error(`Failed to fetch shops: ${shopsResponse.status}`);
        }
        const shopsData = await shopsResponse.json();
        setShops(shopsData);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  // Filter and sort products
  const filteredProducts = products.filter(product => {
    if (selectedCategory && product.category_id !== selectedCategory) {
      return false;
    }
    if (selectedShop && product.shop_id !== selectedShop) {
      return false;
    }
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    if (rating && product.rating !== rating) {
      return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case 'newest':
        return 0;
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  // Handler functions
  const handleAddToCart = async (product: SearchPageProduct) => {
    if (!currentUser) {
      setSelectedProduct(product);
      setIsDialogOpen(true);
      return;
    }

    setIsAddingToCart(product.id);
    try {
      // Convert to imported Product type before passing to addToCart
      const convertedProduct = convertToImportedProduct(product);
      await addToCart(convertedProduct, 1, convertedProduct.colors[0] || null, convertedProduct.sizes[0] || null);
      toast({
        title: "Success",
        description: `${product.name} added to cart.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add item to cart.",
      });
    } finally {
      setIsAddingToCart(null);
    }
  };

  const handleAddToWishlist = async (product: SearchPageProduct) => {
    if (!currentUser) {
      setSelectedProduct(product);
      setIsDialogOpen(true);
      return;
    }

    setIsAddingToWishlist(product.id);
    try {
      // Convert to imported Product type before passing to addToWishlist
      const convertedProduct = convertToImportedProduct(product);
      await addToWishlist(convertedProduct);
      toast({
        title: "Success",
        description: `${product.name} added to wishlist.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add item to wishlist.",
      });
    } finally {
      setIsAddingToWishlist(null);
    }
  };

  const handleShareProduct = (product: SearchPageProduct) => {
    const productLink = `${window.location.origin}/product/${product.id}`;
    setShareableLink(productLink);
    setIsShareDialogOpen(true);
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleShopChange = (shop: string | null) => {
    setSelectedShop(shop);
  };

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value);
  };

  const handleRatingChange = (rating: number | null) => {
    setRating(rating);
  };

  const handleSortChange = (value: string) => {
    setSortOption(value as SortOption);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedShop(null);
    setPriceRange([0, 1000]);
    setRating(null);
  };

  const handleAuthDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleLogin = () => {
    setIsDialogOpen(false);
    navigate('/auth');
  };

  return {
    products: sortedProducts,
    categories,
    shops,
    loading,
    error,
    selectedCategory,
    selectedShop,
    priceRange,
    rating,
    sortOption,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    mobileSortOpen,
    setMobileSortOpen,
    isAddingToCart,
    isAddingToWishlist,
    isDialogOpen,
    setIsDialogOpen,
    selectedProduct,
    isShareDialogOpen,
    setIsShareDialogOpen,
    shareableLink,
    handleAddToCart,
    handleAddToWishlist,
    handleShareProduct,
    handleCategoryChange,
    handleShopChange,
    handlePriceRangeChange,
    handleRatingChange,
    handleSortChange,
    clearFilters,
    handleAuthDialogClose,
    handleLogin,
  };
};

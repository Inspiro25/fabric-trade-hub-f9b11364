
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Product } from '@/lib/products/types';

export interface SearchPageProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  sale_price?: number | null;
  salePrice?: number | null;
  images: string[];
  category?: string;
  category_id?: string;
  colors?: string[];
  sizes?: string[];
  available_colors?: string[];
  available_sizes?: string[];
  stock?: number;
  rating?: number;
  review_count?: number;
  reviewCount?: number;
  shop_id?: string | null;
  shopId?: string | null;
  is_new?: boolean;
  isNew?: boolean;
  is_trending?: boolean;
  isTrending?: boolean;
  tags?: string[];
  brand?: string;
}

const useSearch = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<SearchPageProduct[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState<string | null>(null);
  
  // Mock data for search functionality
  const [categories, setCategories] = useState<Array<{id: string, name: string, image?: string}>>([]);
  const [shops, setShops] = useState<Array<{id: string, name: string}>>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [rating, setRating] = useState<number>(0);
  const [sortOption, setSortOption] = useState<string>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  const [searchHistory, setSearchHistory] = useState<Array<{id: string, query: string, timestamp: Date}>>([]);
  const [recommendations, setRecommendations] = useState<SearchPageProduct[]>([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [recentlyViewed, setRecentlyViewed] = useState<SearchPageProduct[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>(['Shoes', 'Electronics', 'Fashion', 'Home']);
  
  // Additional filter states
  const [availabilityFilters, setAvailabilityFilters] = useState<{inStock: boolean, outOfStock: boolean}>({
    inStock: false,
    outOfStock: false
  });
  const [brandFilters, setBrandFilters] = useState<{[key: string]: boolean}>({});
  const [discountFilters, setDiscountFilters] = useState<{[key: string]: boolean}>({});
  
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const itemsPerPage = parseInt(searchParams.get('items') || '20', 10);
  const sort = searchParams.get('sort') || '';
  const viewModeParam = searchParams.get('view');

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Simulate fetching data from an API
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock categories
        setCategories([
          {id: '1', name: 'Electronics', image: '/placeholder.svg'},
          {id: '2', name: 'Fashion', image: '/placeholder.svg'},
          {id: '3', name: 'Home', image: '/placeholder.svg'},
          {id: '4', name: 'Sports', image: '/placeholder.svg'},
          {id: '5', name: 'Books', image: '/placeholder.svg'},
        ]);
        
        // Mock shops
        setShops([
          {id: '1', name: 'ElectroHub'},
          {id: '2', name: 'Fashion World'},
          {id: '3', name: 'Home Essentials'},
        ]);

        const mockProducts: SearchPageProduct[] = Array.from({ length: itemsPerPage }, (_, i) => ({
          id: `product-${i + (page - 1) * itemsPerPage}`,
          name: `${query || 'Sample'} Product ${i + (page - 1) * itemsPerPage}`,
          description: 'This is a sample product description.',
          price: Math.floor(Math.random() * 100) + 20,
          sale_price: Math.random() > 0.5 ? Math.floor(Math.random() * 50) + 10 : null,
          salePrice: Math.random() > 0.5 ? Math.floor(Math.random() * 50) + 10 : null,
          images: ['/placeholder.svg'],
          category: category || 'All',
          category_id: category || 'All',
          colors: ['red', 'blue', 'green'],
          sizes: ['S', 'M', 'L'],
          is_new: Math.random() > 0.5,
          isNew: Math.random() > 0.5,
          is_trending: Math.random() > 0.5,
          isTrending: Math.random() > 0.5,
          rating: Math.floor(Math.random() * 5) + 1,
          review_count: Math.floor(Math.random() * 100),
          reviewCount: Math.floor(Math.random() * 100),
          stock: Math.floor(Math.random() * 50),
          tags: ['sample', 'product'],
          shop_id: 'shop-123',
          shopId: 'shop-123',
        }));

        setProducts(mockProducts);
        setTotalProducts(100); // Simulate total number of products
        
        // Mock recommendations
        setRecommendations(mockProducts.slice(0, 4));
        
        // Mock recently viewed
        setRecentlyViewed(mockProducts.slice(4, 8));
        
        // Set initial load to false after first load
        setInitialLoad(false);
        
        if (category) {
          setSelectedCategory(category);
        }
        
        if (viewModeParam === 'list' || viewModeParam === 'grid') {
          setViewMode(viewModeParam);
        }
        
      } catch (err: any) {
        setError(err.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, category, page, itemsPerPage, sort, viewModeParam]);

  const handleAddToCart = (product: SearchPageProduct) => {
    setIsAddingToCart(product.id);

    // Convert SearchPageProduct to the Product type expected by addToCart
    const productForCart: Product = {
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.images || [],
      // Add any other required properties
      sale_price: product.sale_price || product.salePrice,
      description: product.description || '',
      category_id: product.category_id || product.category || '',
      // Default values for required properties that might not be in SearchPageProduct
      colors: product.colors || [],
      sizes: product.sizes || [],
      stock: product.stock || 0,
      rating: product.rating || 0,
      review_count: product.review_count || product.reviewCount || 0,
      shop_id: product.shop_id || product.shopId || null,
      is_new: product.is_new || product.isNew || false,
      is_trending: product.is_trending || product.isTrending || false,
      tags: product.tags || []
    };

    addToCart(productForCart, 1);
    
    setTimeout(() => {
      setIsAddingToCart(null);
      // Fix toast call to match expected arguments
      toast.success(`${product.name} added to cart`);
    }, 500);
  };

  const handleAddToWishlist = (product: SearchPageProduct) => {
    setIsAddingToWishlist(product.id);
    
    setTimeout(() => {
      addToWishlist(product.id);
      setIsAddingToWishlist(null);
      // Fix toast call to match expected arguments
      toast.success(`${product.name} added to wishlist`);
    }, 500);
  };

  const handleShareProduct = (product: SearchPageProduct) => {
    setShareableLink(window.location.origin + '/product/' + product.id);
    setIsShareDialogOpen(true);
  };
  
  const handleRetry = () => {
    navigate(0); // Refresh the current page
  };
  
  // Filter handling functions
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };
  
  const handleShopChange = (shopId: string) => {
    setSelectedShop(shopId === selectedShop ? null : shopId);
  };
  
  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range);
  };
  
  const handleRatingChange = (value: number) => {
    setRating(value === rating ? 0 : value);
  };
  
  const handleSortChange = (option: string) => {
    setSortOption(option);
  };
  
  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };
  
  const handleAvailabilityFilterChange = (filter: 'inStock' | 'outOfStock', value: boolean) => {
    setAvailabilityFilters(prev => ({...prev, [filter]: value}));
  };
  
  const toggleBrandFilter = (brand: string) => {
    setBrandFilters(prev => ({...prev, [brand]: !prev[brand]}));
  };
  
  const toggleDiscountFilter = (discount: string) => {
    setDiscountFilters(prev => ({...prev, [discount]: !prev[discount]}));
  };
  
  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedShop(null);
    setPriceRange([0, 1000]);
    setRating(0);
    setAvailabilityFilters({inStock: false, outOfStock: false});
    setBrandFilters({});
    setDiscountFilters({});
  };
  
  // Search history functions
  const saveSearchHistory = (searchQuery: string) => {
    const newHistoryItem = {
      id: Date.now().toString(),
      query: searchQuery,
      timestamp: new Date()
    };
    
    setSearchHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]);
  };
  
  const clearSearchHistoryItem = (id: string) => {
    setSearchHistory(prev => prev.filter(item => item.id !== id));
  };
  
  const clearAllSearchHistory = () => {
    setSearchHistory([]);
  };
  
  // Auth related
  const handleLogin = () => {
    setIsDialogOpen(false);
    // Navigate to login page or perform other auth actions
  };
  
  // Mocking fetch data function for retrying
  const fetchData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return {
    loading,
    error,
    products,
    totalProducts,
    isAddingToCart,
    isAddingToWishlist,
    handleAddToCart,
    handleAddToWishlist,
    handleShareProduct,
    handleRetry,
    query,
    category,
    page,
    itemsPerPage,
    sort,
    viewMode,
    createQueryString,
    categories,
    shops,
    isLoading: loading,
    selectedCategory,
    selectedShop,
    priceRange,
    rating,
    sortOption,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    mobileSortOpen,
    setMobileSortOpen,
    isDialogOpen,
    setIsDialogOpen,
    isShareDialogOpen,
    setIsShareDialogOpen,
    shareableLink,
    searchHistory,
    recommendations,
    initialLoad,
    recentlyViewed,
    popularSearches,
    availabilityFilters,
    handleAvailabilityFilterChange,
    brandFilters,
    toggleBrandFilter,
    discountFilters,
    toggleDiscountFilter,
    handleCategoryChange,
    handleShopChange,
    handlePriceRangeChange,
    handleRatingChange,
    handleSortChange,
    handleViewModeChange,
    clearFilters,
    handleLogin,
    fetchData,
    clearSearchHistoryItem,
    clearAllSearchHistory,
    saveSearchHistory
  };
};

export default useSearch;

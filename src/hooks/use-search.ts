
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

export interface Category {
  id: string;
  name: string;
  image: string;  // Make this required to match Search.tsx
  description: string;
}

export interface Shop {
  id: string;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  cover_image: string;
  address: string;
  rating: number;
  reviewCount: number;
  review_count: number;
  isVerified: boolean;
  is_verified: boolean;
  ownerName?: string;
  owner_name?: string;
  ownerEmail?: string;
  owner_email?: string;
  status?: 'pending' | 'active' | 'suspended';
  shopId: string;  // Make this required to match Search.tsx
  shop_id: string; // Add this to match Search.tsx
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
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
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
        await new Promise(resolve => setTimeout(resolve, 500));

        setCategories([
          {id: '1', name: 'Electronics', image: '/placeholder.svg', description: 'Electronic devices and gadgets'},
          {id: '2', name: 'Fashion', image: '/placeholder.svg', description: 'Clothing and accessories'},
          {id: '3', name: 'Home', image: '/placeholder.svg', description: 'Home appliances and furniture'},
          {id: '4', name: 'Sports', image: '/placeholder.svg', description: 'Sports equipment and gear'},
          {id: '5', name: 'Books', image: '/placeholder.svg', description: 'Books and reading materials'},
        ]);
        
        setShops([
          {
            id: '1', 
            name: 'ElectroHub', 
            description: 'Best electronics store',
            logo: '/placeholder.svg',
            coverImage: '/placeholder.svg',
            cover_image: '/placeholder.svg',
            address: '123 Tech Street',
            rating: 4.5,
            reviewCount: 120,
            review_count: 120,
            isVerified: true,
            is_verified: true,
            ownerName: 'John Doe',
            owner_name: 'John Doe',
            ownerEmail: 'john@electrohub.com',
            owner_email: 'john@electrohub.com',
            status: 'active',
            shopId: 'shop-1',
            shop_id: 'shop-1'
          },
          {
            id: '2', 
            name: 'Fashion World', 
            description: 'Trendy fashion items',
            logo: '/placeholder.svg',
            coverImage: '/placeholder.svg',
            cover_image: '/placeholder.svg',
            address: '456 Style Avenue',
            rating: 4.3,
            reviewCount: 98,
            review_count: 98,
            isVerified: true,
            is_verified: true,
            ownerName: 'Jane Smith',
            owner_name: 'Jane Smith',
            ownerEmail: 'jane@fashionworld.com',
            owner_email: 'jane@fashionworld.com',
            status: 'active',
            shopId: 'shop-2',
            shop_id: 'shop-2'
          },
          {
            id: '3', 
            name: 'Home Essentials', 
            description: 'Everything for your home',
            logo: '/placeholder.svg',
            coverImage: '/placeholder.svg',
            cover_image: '/placeholder.svg',
            address: '789 Home Street',
            rating: 4.2,
            reviewCount: 76,
            review_count: 76,
            isVerified: true,
            is_verified: true,
            ownerName: 'Bob Johnson',
            owner_name: 'Bob Johnson',
            ownerEmail: 'bob@homeessentials.com',
            owner_email: 'bob@homeessentials.com',
            status: 'active',
            shopId: 'shop-3',
            shop_id: 'shop-3'
          },
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
        setTotalProducts(100);
        
        setRecommendations(mockProducts.slice(0, 4));
        
        setRecentlyViewed(mockProducts.slice(4, 8));
        
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

    const productForCart: Product = {
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.images || [],
      sale_price: product.sale_price || product.salePrice,
      description: product.description || '',
      category_id: product.category_id || product.category || '',
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
      // Fix the toast call by providing all required arguments
      toast(`${product.name} added to cart`, {
        description: "You can view it in your cart",
        action: {
          label: "View Cart",
          onClick: () => navigate('/cart')
        }
      });
    }, 500);
  };

  const handleAddToWishlist = (product: SearchPageProduct) => {
    setIsAddingToWishlist(product.id);
    
    setTimeout(() => {
      addToWishlist(product.id);
      setIsAddingToWishlist(null);
      // Fix the toast call by providing all required arguments
      toast(`${product.name} added to wishlist`, {
        description: "You can view it in your wishlist",
        action: {
          label: "View Wishlist",
          onClick: () => navigate('/wishlist')
        }
      });
    }, 500);
  };

  const handleShareProduct = (product: SearchPageProduct) => {
    setShareableLink(window.location.origin + '/product/' + product.id);
    setIsShareDialogOpen(true);
  };
  
  const handleRetry = () => {
    navigate(0);
  };
  
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
  
  const handleLogin = () => {
    setIsDialogOpen(false);
  };
  
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

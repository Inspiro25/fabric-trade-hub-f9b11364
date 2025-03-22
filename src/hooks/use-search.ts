import { useState, useEffect, useCallback } from 'react';
import { Product as ImportedProduct } from '@/lib/types/product';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { SearchPageProduct } from '@/components/search/SearchProductCard';
import { supabase } from '@/integrations/supabase/client';
import { getPersonalizedRecommendations } from '@/services/recommendationService';

const mockProducts: SearchPageProduct[] = [
  {
    id: "1",
    name: "Smartphone X",
    description: "Latest smartphone with advanced features",
    price: 599,
    sale_price: 499,
    images: ["/placeholder.svg"],
    category_id: "electronics",
    shop_id: "1",
    is_new: true,
    is_trending: true,
    colors: ["Black", "White", "Blue"],
    sizes: [],
    rating: 4.5,
    review_count: 120
  },
  {
    id: "2",
    name: "Laptop Pro",
    description: "Powerful laptop for professionals",
    price: 1299,
    sale_price: null,
    images: ["/placeholder.svg"],
    category_id: "electronics",
    shop_id: "1",
    is_new: false,
    is_trending: true,
    colors: ["Silver", "Space Gray"],
    sizes: [],
    rating: 4.8,
    review_count: 85
  },
  {
    id: "3",
    name: "Casual T-Shirt",
    description: "Comfortable cotton t-shirt",
    price: 29.99,
    sale_price: 19.99,
    images: ["/placeholder.svg"],
    category_id: "fashion",
    shop_id: "2",
    is_new: true,
    is_trending: false,
    colors: ["Red", "Blue", "Black", "White"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.2,
    review_count: 210
  },
  {
    id: "4",
    name: "Coffee Maker",
    description: "Automatic coffee maker with timer",
    price: 89.99,
    sale_price: null,
    images: ["/placeholder.svg"],
    category_id: "home",
    shop_id: "3",
    is_new: false,
    is_trending: false,
    colors: ["Black", "Silver"],
    sizes: [],
    rating: 4.0,
    review_count: 67
  }
];

const mockCategories = [
  { id: "electronics", name: "Electronics", description: "Electronic devices and gadgets", image: null },
  { id: "fashion", name: "Fashion", description: "Clothing and accessories", image: null },
  { id: "home", name: "Home & Kitchen", description: "Home and kitchen products", image: null },
  { id: "beauty", name: "Beauty", description: "Beauty and personal care products", image: null }
];

const mockShops = [
  { id: "1", name: "TechHub", description: "Your one-stop shop for technology", logo: null, cover_image: null, rating: 4.6, review_count: 245, is_verified: true, address: "123 Tech St, San Francisco", owner_name: "John Doe", owner_email: "john@techhub.com", shop_id: "th001", status: "active" },
  { id: "2", name: "Fashion Forward", description: "Latest fashion trends", logo: null, cover_image: null, rating: 4.3, review_count: 189, is_verified: true, address: "456 Style Ave, New York", owner_name: "Jane Smith", owner_email: "jane@fashionforward.com", shop_id: "ff002", status: "active" },
  { id: "3", name: "Home Essentials", description: "Everything for your home", logo: null, cover_image: null, rating: 4.1, review_count: 132, is_verified: false, address: "789 Home Blvd, Chicago", owner_name: "Mike Johnson", owner_email: "mike@homeessentials.com", shop_id: "he003", status: "active" }
];

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popularity' | 'relevance';

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

interface SearchHistoryItem {
  id: string;
  query: string;
  searched_at: string;
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
  const [sortOption, setSortOption] = useState<SortOption>('relevance');
  
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState<string | null>(null);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<SearchPageProduct | null>(null);
  
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [recommendations, setRecommendations] = useState<SearchPageProduct[]>([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [recentlyViewed, setRecentlyViewed] = useState<SearchPageProduct[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  
  const [availabilityFilters, setAvailabilityFilters] = useState({
    inStock: false,
    fastDelivery: false,
    dealOfDay: false,
    amazonFulfilled: false
  });
  
  const [brandFilters, setBrandFilters] = useState<string[]>([]);
  const [discountFilters, setDiscountFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const { currentUser } = useAuth();

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
      stock: 10,
      tags: [],
      shopId: product.shop_id
    };
  };

  const fetchData = async () => {
    if (initialLoad && !query) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      let productsQuery = supabase
        .from('products')
        .select('*');
      
      if (query) {
        productsQuery = productsQuery.ilike('name', `%${query}%`);
      }
      
      const { data: productsData, error: productsError } = await productsQuery;
      
      if (productsError) {
        throw new Error(`Failed to fetch products: ${productsError.message}`);
      }
      
      const formattedProducts: SearchPageProduct[] = productsData.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: Number(product.price),
        sale_price: product.sale_price ? Number(product.sale_price) : null,
        images: product.images || ['/placeholder.svg'],
        category_id: product.category_id || '',
        shop_id: product.shop_id,
        is_new: product.is_new || false,
        is_trending: product.is_trending || false,
        colors: product.colors || [],
        sizes: product.sizes || [],
        rating: product.rating || 0,
        review_count: product.review_count || 0
      }));
      
      setProducts(formattedProducts);

      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*');
      
      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
        setCategories([]);
      } else {
        setCategories(categoriesData || []);
      }

      const { data: shopsData, error: shopsError } = await supabase
        .from('shops')
        .select('*');
      
      if (shopsError) {
        console.error('Error fetching shops:', shopsError);
        setShops([]);
      } else {
        setShops(shopsData || []);
      }
      
      if (query && currentUser) {
        try {
          await supabase.from('search_history').upsert(
            { 
              user_id: currentUser.uid,
              query: query.toLowerCase().trim(),
              searched_at: new Date().toISOString() 
            },
            { onConflict: 'user_id,query', ignoreDuplicates: false }
          );
          
          fetchSearchHistory();
        } catch (historyError) {
          console.error('Error saving search history:', historyError);
        }
      }
      
      setInitialLoad(false);
    } catch (err: any) {
      console.error('Search error:', err);
      
      const errorMessage = err?.message || '';
      if (errorMessage.includes('HTML') || errorMessage.includes('API endpoint')) {
        setError("API endpoint is currently unavailable. Using mock data instead.");
        
        toast({
          title: "API Unavailable",
          description: "Using mock product data instead",
          variant: "destructive"
        });
        
        setProducts(mockProducts);
        setCategories(mockCategories);
        setShops(mockShops);
      } else {
        setError(errorMessage || 'Failed to fetch data');
        
        setProducts(mockProducts);
        setCategories(mockCategories);
        setShops(mockShops);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchHistory = async () => {
    if (!currentUser) return;
    
    try {
      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_id', currentUser.uid)
        .order('searched_at', { ascending: false })
        .limit(5);
        
      if (error) {
        console.error('Error fetching search history:', error);
        return;
      }
      
      setSearchHistory(data || []);
    } catch (err) {
      console.error('Error fetching search history:', err);
    }
  };
  
  const fetchRecommendations = async () => {
    if (!currentUser) {
      return;
    }
    
    try {
      const recommendedProducts = await getPersonalizedRecommendations(currentUser.uid, 4);
      
      const formattedRecommendations: SearchPageProduct[] = recommendedProducts.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: Number(product.price),
        salePrice: product.salePrice ? Number(product.salePrice) : null,
        images: product.images || ['/placeholder.svg'],
        category: product.category || '',
        colors: product.colors || [],
        sizes: product.sizes || [],
        rating: product.rating || 0,
        reviewCount: product.reviewCount || 0
      }));
      
      setRecommendations(formattedRecommendations);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    }
  };

  const fetchRecentlyViewed = async () => {
    if (!currentUser) return;
    
    try {
      const { data, error } = await supabase
        .from('product_view_history')
        .select('*, products(*)')
        .eq('user_id', currentUser.uid)
        .order('last_viewed_at', { ascending: false })
        .limit(4);
      
      if (error) {
        console.error('Error fetching recently viewed products:', error);
        return;
      }
      
      if (data && data.length > 0) {
        const formattedProducts: SearchPageProduct[] = data.map(item => ({
          id: item.products.id,
          name: item.products.name,
          description: item.products.description || '',
          price: Number(item.products.price),
          sale_price: item.products.sale_price ? Number(item.products.sale_price) : null,
          images: item.products.images || ['/placeholder.svg'],
          category_id: item.products.category_id || '',
          shop_id: item.products.shop_id || '',
          is_new: item.products.is_new || false,
          is_trending: item.products.is_trending || false,
          colors: item.products.colors || [],
          sizes: item.products.sizes || [],
          rating: item.products.rating || 0,
          review_count: item.products.review_count || 0
        }));
        
        setRecentlyViewed(formattedProducts);
      }
    } catch (err) {
      console.error('Error fetching recently viewed products:', err);
    }
  };
  
  const fetchPopularSearches = async () => {
    try {
      const { data, error } = await supabase
        .from('search_history')
        .select('query, count(*) as count')
        .group('query')
        .order('count', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error('Error fetching popular searches:', error);
        return;
      }
      
      if (data && data.length > 0) {
        setPopularSearches(data.map(item => item.query));
      } else {
        setPopularSearches(['smartphone', 'headphones', 'laptop', 'watch', 'camera']);
      }
    } catch (err) {
      console.error('Error fetching popular searches:', err);
    }
  };

  const clearSearchHistoryItem = async (id: string) => {
    if (!currentUser) return;
    
    try {
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('id', id)
        .eq('user_id', currentUser.uid);
        
      if (error) {
        console.error('Error deleting search history item:', error);
        return;
      }
      
      setSearchHistory(prevHistory => 
        prevHistory.filter(item => item.id !== id)
      );
    } catch (err) {
      console.error('Error deleting search history item:', err);
    }
  };
  
  const clearAllSearchHistory = async () => {
    if (!currentUser) return;
    
    try {
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('user_id', currentUser.uid);
        
      if (error) {
        console.error('Error clearing search history:', error);
        return;
      }
      
      setSearchHistory([]);
      toast({
        title: "Search history cleared",
        description: "Your search history has been deleted"
      });
    } catch (err) {
      console.error('Error clearing search history:', err);
    }
  };

  const saveSearchHistory = async (query: string) => {
    if (!currentUser) return;
    
    try {
      const { data, error } = await supabase
        .from('search_history')
        .upsert(
          { 
            user_id: currentUser.uid,
            query: query.toLowerCase().trim(),
            searched_at: new Date().toISOString() 
          },
          { onConflict: 'user_id,query', ignoreDuplicates: false }
        );
      
      fetchSearchHistory();
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  const handleAvailabilityFilterChange = (key: keyof typeof availabilityFilters) => {
    setAvailabilityFilters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const toggleBrandFilter = (brand: string) => {
    setBrandFilters(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand) 
        : [...prev, brand]
    );
  };
  
  const toggleDiscountFilter = (discount: string) => {
    setDiscountFilters(prev => 
      prev.includes(discount) 
        ? prev.filter(d => d !== discount) 
        : [...prev, discount]
    );
  };

  useEffect(() => {
    fetchData();
  }, [query]);
  
  useEffect(() => {
    if (currentUser) {
      fetchSearchHistory();
    }
    fetchRecommendations();
  }, [currentUser]);

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
    if (rating && (!product.rating || product.rating < rating)) {
      return false;
    }
    if (availabilityFilters.inStock && (!product.stock || product.stock <= 0)) {
      return false;
    }
    if (brandFilters.length > 0 && !brandFilters.includes(product.shop_id)) {
      return false;
    }
    if (discountFilters.length > 0) {
      if (!product.sale_price) return false;
      
      const discountPercent = Math.round((1 - product.sale_price / product.price) * 100);
      
      if (discountFilters.includes('10+') && discountPercent < 10) return false;
      if (discountFilters.includes('25+') && discountPercent < 25) return false;
      if (discountFilters.includes('50+') && discountPercent < 50) return false;
      if (discountFilters.includes('70+') && discountPercent < 70) return false;
    }
    
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case 'newest':
        return 0;
      case 'price-asc':
        return (a.sale_price || a.price) - (b.sale_price || b.price);
      case 'price-desc':
        return (b.sale_price || b.price) - (a.sale_price || a.price);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'popularity':
        return (b.review_count || 0) - (a.review_count || 0);
      case 'relevance':
      default:
        return 0;
    }
  });

  const handleAddToCart = async (product: SearchPageProduct) => {
    if (!currentUser) {
      setSelectedProduct(product);
      setIsDialogOpen(true);
      return;
    }

    setIsAddingToCart(product.id);
    try {
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
    viewMode,
    setViewMode,
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
    fetchData,
    clearSearchHistoryItem,
    clearAllSearchHistory,
    saveSearchHistory,
  };
};

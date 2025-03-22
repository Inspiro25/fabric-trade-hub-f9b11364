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

// Mock data for fallback when API is unavailable
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

// Mock categories for fallback
const mockCategories = [
  { id: "electronics", name: "Electronics", description: "Electronic devices and gadgets", image: null },
  { id: "fashion", name: "Fashion", description: "Clothing and accessories", image: null },
  { id: "home", name: "Home & Kitchen", description: "Home and kitchen products", image: null },
  { id: "beauty", name: "Beauty", description: "Beauty and personal care products", image: null }
];

// Mock shops for fallback
const mockShops = [
  { id: "1", name: "TechHub", description: "Your one-stop shop for technology", logo: null, cover_image: null, rating: 4.6, review_count: 245, is_verified: true, address: "123 Tech St, San Francisco", owner_name: "John Doe", owner_email: "john@techhub.com", shop_id: "th001", status: "active" },
  { id: "2", name: "Fashion Forward", description: "Latest fashion trends", logo: null, cover_image: null, rating: 4.3, review_count: 189, is_verified: true, address: "456 Style Ave, New York", owner_name: "Jane Smith", owner_email: "jane@fashionforward.com", shop_id: "ff002", status: "active" },
  { id: "3", name: "Home Essentials", description: "Everything for your home", logo: null, cover_image: null, rating: 4.1, review_count: 132, is_verified: false, address: "789 Home Blvd, Chicago", owner_name: "Mike Johnson", owner_email: "mike@homeessentials.com", shop_id: "he003", status: "active" }
];

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
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  
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

  // Fetch products function that can be called to retry
  const fetchData = async () => {
    if (initialLoad && !query) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      // Fetch products from Supabase
      let productsQuery = supabase
        .from('products')
        .select('*');
      
      // Add search filter if query is provided
      if (query) {
        productsQuery = productsQuery.ilike('name', `%${query}%`);
      }
      
      const { data: productsData, error: productsError } = await productsQuery;
      
      if (productsError) {
        throw new Error(`Failed to fetch products: ${productsError.message}`);
      }
      
      // Format data to match SearchPageProduct type
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

      // Fetch categories from Supabase
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*');
      
      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
        setCategories([]);
      } else {
        setCategories(categoriesData || []);
      }

      // Fetch shops from Supabase
      const { data: shopsData, error: shopsError } = await supabase
        .from('shops')
        .select('*');
      
      if (shopsError) {
        console.error('Error fetching shops:', shopsError);
        setShops([]);
      } else {
        setShops(shopsData || []);
      }
      
      // Save search to history if there's a query and user is logged in
      if (query && currentUser) {
        try {
          await supabase.from('search_history').upsert(
            { 
              user_id: currentUser.id, 
              query: query.toLowerCase().trim(),
              searched_at: new Date().toISOString() 
            },
            { onConflict: 'user_id,query', ignoreDuplicates: false }
          );
          
          // Refresh search history
          fetchSearchHistory();
        } catch (historyError) {
          console.error('Error saving search history:', historyError);
        }
      }
      
      setInitialLoad(false);
    } catch (err: any) {
      console.error('Search error:', err);
      
      // Check if the error is related to HTML response or API unavailability
      const errorMessage = err?.message || '';
      if (errorMessage.includes('HTML') || errorMessage.includes('API endpoint')) {
        setError("API endpoint is currently unavailable. Using mock data instead.");
        
        // Log toast notification for API unavailability
        toast({
          title: "API Unavailable",
          description: "Using mock product data instead",
          variant: "destructive"
        });
        
        // Use mock data as fallback
        setProducts(mockProducts);
        setCategories(mockCategories);
        setShops(mockShops);
      } else {
        setError(errorMessage || 'Failed to fetch data');
        
        // Use mock data as fallback even for other errors
        setProducts(mockProducts);
        setCategories(mockCategories);
        setShops(mockShops);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch search history
  const fetchSearchHistory = async () => {
    if (!currentUser) return;
    
    try {
      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_id', currentUser.id)
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
  
  // Fetch recommendations
  const fetchRecommendations = async () => {
    if (!currentUser) {
      // For non-logged in users, show trending products
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_trending', true)
          .limit(4);
          
        if (error) {
          console.error('Error fetching trending products:', error);
          return;
        }
        
        const formattedRecommendations: SearchPageProduct[] = (data || []).map(product => ({
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
        
        setRecommendations(formattedRecommendations);
      } catch (err) {
        console.error('Error fetching trending products:', err);
      }
      return;
    }
    
    try {
      // Get personalized recommendations
      const recommendedProducts = await getPersonalizedRecommendations(currentUser.id, 4);
      
      // Format to SearchPageProduct type
      const formattedRecommendations: SearchPageProduct[] = recommendedProducts.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: Number(product.price),
        sale_price: product.salePrice ? Number(product.salePrice) : null,
        images: product.images || ['/placeholder.svg'],
        category_id: product.category || '',
        shop_id: product.shopId || '',
        is_new: product.isNew || false,
        is_trending: product.isTrending || false,
        colors: product.colors || [],
        sizes: product.sizes || [],
        rating: product.rating || 0,
        review_count: product.reviewCount || 0
      }));
      
      setRecommendations(formattedRecommendations);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    }
  };

  // Clear search history item
  const clearSearchHistoryItem = async (id: string) => {
    if (!currentUser) return;
    
    try {
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('id', id)
        .eq('user_id', currentUser.id);
        
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
  
  // Clear all search history
  const clearAllSearchHistory = async () => {
    if (!currentUser) return;
    
    try {
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('user_id', currentUser.id);
        
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

  // Fetch products on mount and when query changes
  useEffect(() => {
    fetchData();
  }, [query]);
  
  // Fetch search history and recommendations on mount
  useEffect(() => {
    if (currentUser) {
      fetchSearchHistory();
    }
    fetchRecommendations();
  }, [currentUser]);

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
    searchHistory,
    recommendations,
    initialLoad,
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
  };
};

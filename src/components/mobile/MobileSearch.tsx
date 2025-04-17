import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, X, ArrowLeft, Mic, Camera, 
  TrendingUp, History, Tag, Sparkles, 
  ChevronRight, Heart, ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/use-debounce';
import { Product } from '@/lib/types/product';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MobileSearch = () => {
  console.log('Rendering updated MobileSearch component');
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 400);

  // Trending searches
  const trendingSearches = [
    "Summer dresses", "Casual shirts", "Sneakers", 
    "Denim jackets", "Sunglasses", "Watches", "Handbags"
  ];

  // Popular categories with images
  const popularCategories = [
    { 
      name: "Women", 
      image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=400&auto=format&fit=crop",
      color: "from-pink-500/80 to-rose-500/80" 
    },
    { 
      name: "Men", 
      image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=400&auto=format&fit=crop",
      color: "from-blue-500/80 to-indigo-500/80" 
    },
    { 
      name: "Kids", 
      image: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=400&auto=format&fit=crop",
      color: "from-purple-500/80 to-violet-500/80" 
    },
    { 
      name: "Accessories", 
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400&auto=format&fit=crop",
      color: "from-yellow-500/80 to-amber-500/80" 
    }
  ];

  // Featured brands
  const featuredBrands = [
    { name: "Nike", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png" },
    { name: "Adidas", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/1200px-Adidas_Logo.svg.png" },
    { name: "Zara", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Zara_Logo.svg/1200px-Zara_Logo.svg.png" },
    { name: "H&M", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/H%26M-Logo.svg/1200px-H%26M-Logo.svg.png" },
    { name: "Gucci", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/1960s_Gucci_Logo.svg/1200px-1960s_Gucci_Logo.svg.png" },
    { name: "Puma", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Puma_logo.svg/1200px-Puma_logo.svg.png" }
  ];

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = (search: string) => {
    if (!search.trim()) return;
    
    const updatedSearches = [
      search,
      ...recentSearches.filter(item => item !== search)
    ].slice(0, 5);
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  // Handle search
  useEffect(() => {
    if (debouncedQuery.trim()) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        // Mock search results - in a real app, this would be an API call
        const mockResults: Product[] = Array(8).fill(null).map((_, i) => ({
          id: `result-${i}`,
          name: `${debouncedQuery} ${i % 2 === 0 ? 'Premium' : 'Classic'} ${i % 3 === 0 ? 'Collection' : 'Edition'}`,
          price: 29.99 + i * 10,
          salePrice: i % 3 === 0 ? (29.99 + i * 10) * 0.8 : undefined,
          images: [
            `https://picsum.photos/seed/${debouncedQuery}${i}/300/300`
          ],
          description: `This is a product matching "${debouncedQuery}"`,
          category: i % 2 === 0 ? "clothing" : "accessories",
          rating: 3.5 + (i % 5) * 0.3,
          brand: featuredBrands[i % featuredBrands.length].name
        }));
        setSearchResults(mockResults);
        setIsLoading(false);
      }, 600);
    } else {
      setSearchResults([]);
    }
  }, [debouncedQuery]);

  const handleSearch = () => {
    if (query.trim()) {
      saveRecentSearch(query);
      navigate(`/search-results?q=${encodeURIComponent(query)}`);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSearchResults([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const removeRecentSearch = (search: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedSearches = recentSearches.filter(item => item !== search);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  const handleVoiceSearch = () => {
    // In a real app, this would trigger the Web Speech API
    alert('Voice search activated');
  };

  const handleCameraSearch = () => {
    // In a real app, this would trigger the device camera
    alert('Camera search activated');
  };

  return (
    <div className={cn(
      "min-h-screen pb-16",
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    )}>
      {/* Search header */}
      <div className={cn(
        "sticky top-0 z-50 px-3 py-3 flex items-center gap-2",
        isDarkMode ? "bg-gray-900/95 backdrop-blur-md" : "bg-white/95 backdrop-blur-md",
        isDarkMode ? "border-b border-gray-800" : "shadow-sm"
      )}>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 rounded-full" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="relative flex-1">
          <motion.div 
            className={cn(
              "flex items-center rounded-full overflow-hidden",
              isDarkMode ? "bg-gray-800" : "bg-gray-100"
            )}
            animate={{ 
              scale: isFocused ? 1 : 0.98,
              boxShadow: isFocused ? (isDarkMode ? "0 0 0 2px rgba(255,255,255,0.2)" : "0 0 0 2px rgba(0,0,0,0.1)") : "none"
            }}
            transition={{ duration: 0.2 }}
          >
            <Search className={cn(
              "h-4 w-4 absolute left-3",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )} />
            
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search products, brands, categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className={cn(
                "border-none pl-9 pr-9 py-2 h-10 focus-visible:ring-0 focus-visible:ring-offset-0",
                isDarkMode ? "bg-gray-800 text-white placeholder:text-gray-400" : "bg-gray-100 text-gray-900"
              )}
            />
            
            {query && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 absolute right-10"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </motion.div>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-9 w-9 rounded-full",
                isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"
              )}
              onClick={handleVoiceSearch}
            >
              <Mic className="h-5 w-5" />
            </Button>
          </motion.div>
          
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-9 w-9 rounded-full",
                isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"
              )}
              onClick={handleCameraSearch}
            >
              <Camera className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="p-4">
        {/* Search results */}
        <AnimatePresence>
          {debouncedQuery && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mb-6"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className={cn(
                  "text-lg font-semibold",
                  isDarkMode ? "text-white" : "text-gray-900"
                )}>
                  Results for "{debouncedQuery}"
                </h2>
                {isLoading ? (
                  <Skeleton className="h-5 w-16" />
                ) : (
                  <span className={cn(
                    "text-sm",
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  )}>
                    {searchResults.length} items
                  </span>
                )}
              </div>

              {/* Filter tabs */}
              <div className="mb-4">
                <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className={cn(
                    "w-full h-9 grid grid-cols-4 rounded-full p-0.5",
                    isDarkMode ? "bg-gray-800" : "bg-gray-100"
                  )}>
                    <TabsTrigger 
                      value="all" 
                      className={cn(
                        "rounded-full text-xs h-8",
                        activeTab === "all" && (isDarkMode ? "bg-gray-700" : "bg-white")
                      )}
                    >
                      All
                    </TabsTrigger>
                    <TabsTrigger 
                      value="products" 
                      className={cn(
                        "rounded-full text-xs h-8",
                        activeTab === "products" && (isDarkMode ? "bg-gray-700" : "bg-white")
                      )}
                    >
                      Products
                    </TabsTrigger>
                    <TabsTrigger 
                      value="brands" 
                      className={cn(
                        "rounded-full text-xs h-8",
                        activeTab === "brands" && (isDarkMode ? "bg-gray-700" : "bg-white")
                      )}
                    >
                      Brands
                    </TabsTrigger>
                    <TabsTrigger 
                      value="shops" 
                      className={cn(
                        "rounded-full text-xs h-8",
                        activeTab === "shops" && (isDarkMode ? "bg-gray-700" : "bg-white")
                      )}
                    >
                      Shops
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={cn(
                      "rounded-lg overflow-hidden",
                      isDarkMode ? "bg-gray-800" : "bg-white"
                    )}>
                      <Skeleton className="h-40 w-full" />
                      <div className="p-2">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {searchResults.map((result) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        "rounded-lg overflow-hidden",
                        isDarkMode ? "bg-gray-800" : "bg-white",
                        "shadow-sm"
                      )}
                      onClick={() => navigate(`/product/${result.id}`)}
                    >
                      <div className="relative">
                        <AspectRatio ratio={1/1}>
                          <img 
                            src={result.images?.[0]} 
                            alt={result.name} 
                            className="w-full h-full object-cover"
                          />
                        </AspectRatio>
                        {result.salePrice && (
                          <Badge className="absolute top-2 left-2 bg-red-500">
                            {Math.round(((result.price - result.salePrice) / result.price) * 100)}% OFF
                          </Badge>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add to wishlist logic
                          }}
                        >
                          <Heart className="h-4 w-4 text-gray-700" />
                        </Button>
                      </div>
                      <div className="p-3">
                        <div className="flex items-center mb-1">
                          <span className={cn(
                            "text-xs font-medium",
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          )}>
                            {result.brand}
                          </span>
                        </div>
                        <h3 className={cn(
                          "font-medium text-sm line-clamp-1",
                          isDarkMode ? "text-white" : "text-gray-900"
                        )}>
                          {result.name}
                        </h3>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1">
                            {result.salePrice ? (
                              <>
                                <span className={cn(
                                  "font-bold",
                                  isDarkMode ? "text-white" : "text-gray-900"
                                )}>
                                  ${result.salePrice.toFixed(2)}
                                </span>
                                <span className="text-xs line-through text-gray-500">
                                  ${result.price.toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <span className={cn(
                                "font-bold",
                                isDarkMode ? "text-white" : "text-gray-900"
                              )}>
                                ${result.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <Button 
                            size="icon" 
                            className="h-7 w-7 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Add to cart logic
                            }}
                          >
                            <ShoppingBag className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              
              {!isLoading && searchResults.length > 0 && (
                <div className="mt-4 text-center">
                  <Button 
                    variant="outline" 
                    className={cn(
                      "rounded-full",
                      isDarkMode ? "border-gray-700 text-gray-300" : "border-gray-200 text-gray-700"
                    )}
                    onClick={() => navigate(`/search-results?q=${encodeURIComponent(query)}`)}
                  >
                    View all results
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* When no search query */}
        {!debouncedQuery && (
          <>
            {/* Recent searches */}
            {recentSearches.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <h2 className={cn(
                    "text-lg font-semibold flex items-center",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}>
                    <History className="h-4 w-4 mr-2" />
                    Recent Searches
                  </h2>
                  {recentSearches.length > 0 && (
                    <Button 
                      variant="ghost" 
                      className="text-xs h-7 px-2"
                      onClick={() => {
                        setRecentSearches([]);
                        localStorage.removeItem('recentSearches');
                      }}
                    >
                      Clear all
                    </Button>
                  )}
                </div>
                
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <motion.div
                      key={index}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg",
                        isDarkMode ? "bg-gray-800" : "bg-white",
                        isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                      )}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => {
                        setQuery(search);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <History className={cn(
                          "h-4 w-4",
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        )} />
                        <span className={cn(
                          isDarkMode ? "text-gray-200" : "text-gray-700"
                        )}>
                          {search}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={(e) => removeRecentSearch(search, e)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Popular categories */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
              className="mb-6"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className={cn(
                  "text-lg font-semibold flex items-center",
                  isDarkMode ? "text-white" : "text-gray-900"
                )}>
                  <Tag className="h-4 w-4 mr-2" />
                  Popular Categories
                </h2>
                <Button 
                  variant="ghost" 
                  className="text-xs h-7 px-2 flex items-center"
                  onClick={() => navigate('/categories')}
                >
                  View all
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {popularCategories.map((category, index) => (
                  <motion.div
                    key={index}
                    className="relative rounded-lg overflow-hidden h-24"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate(`/category/${category.name.toLowerCase()}`)}
                  >
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-tr",
                      category.color
                    )} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white font-bold text-lg drop-shadow-md">
                        {category.name}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Trending searches */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
              className="mb-6"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className={cn(
                  "text-lg font-semibold flex items-center",
                  isDarkMode ? "text-white" : "text-gray-900"
                )}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Trending Now
                </h2>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((search, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setQuery(search);
                    }}
                  >
                    <Badge 
                      className={cn(
                        "px-3 py-1.5 cursor-pointer",
                        isDarkMode 
                          ? "bg-gray-800 hover:bg-gray-700 text-gray-200" 
                          : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                      )}
                    >
                      {search}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Featured brands */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className={cn(
                  "text-lg font-semibold flex items-center",
                  isDarkMode ? "text-white" : "text-gray-900"
                )}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Featured Brands
                </h2>
                <Button 
                  variant="ghost" 
                  className="text-xs h-7 px-2 flex items-center"
                  onClick={() => navigate('/brands')}
                >
                  View all
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {featuredBrands.map((brand, index) => (
                  <motion.div
                    key={index}
                    className={cn(
                      "p-3 rounded-lg flex flex-col items-center justify-center",
                      isDarkMode ? "bg-gray-800" : "bg-white",
                      "cursor-pointer"
                    )}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate(`/brands/${brand.name.toLowerCase()}`)}
                  >
                    <Avatar className="h-12 w-12 mb-2 bg-transparent">
                      <img src={brand.logo} alt={brand.name} className="object-contain" />
                    </Avatar>
                    <span className={cn(
                      "text-xs font-medium text-center",
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    )}>
                      {brand.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileSearch;
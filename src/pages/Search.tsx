import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/ProductCard';
import { useSearchParams } from 'react-router-dom';
import { useSearchData } from '@/hooks/use-search-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useCategories } from '@/hooks/use-categories';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Filter, SlidersHorizontal, Search as SearchIcon, Clock, Star, Truck, Package, Tag, X, ChevronDown } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SearchPageProduct } from '@/hooks/search/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { products, loading, totalProducts } = useSearchData(query);
  const { categories } = useCategories();
  const { isDarkMode } = useTheme();
  const isMobile = useIsMobile();
  
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [availability, setAvailability] = useState({
    inStock: false,
    fastDelivery: false,
    onSale: false
  });
  
  // Search suggestions
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  // Calculate active filters
  useEffect(() => {
    let count = 0;
    if (selectedCategories.length > 0) count++;
    if (priceRange[0] > 0 || priceRange[1] < 1000) count++;
    if (minRating !== null) count++;
    if (availability.inStock || availability.fastDelivery || availability.onSale) count++;
    setActiveFilters(count);
  }, [selectedCategories, priceRange, minRating, availability]);

  // Load recent searches
  useEffect(() => {
    const loadRecentSearches = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (session?.session?.user) {
          const { data } = await supabase
            .from('search_history')
            .select('query, searched_at')
            .eq('user_id', session.session.user.id)
            .order('searched_at', { ascending: false })
            .limit(5);
          
          if (data) {
            setRecentSearches(data.map(item => item.query));
          }
        }
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    };
    
    loadRecentSearches();
  }, []);

  // Generate suggestions based on query
  useEffect(() => {
    if (query.length > 2) {
      setIsTyping(true);
      const generateSuggestions = async () => {
        try {
          const { data } = await supabase
            .from('products')
            .select('name, category_id')
            .ilike('name', `%${query}%`)
            .limit(5);
          
          if (data) {
            setSuggestions(data.map(item => item.name));
          }
        } catch (error) {
          console.error('Error generating suggestions:', error);
        } finally {
          setIsTyping(false);
        }
      };
      
      const debounceTimer = setTimeout(() => {
        generateSuggestions();
      }, 300);
      
      return () => clearTimeout(debounceTimer);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSearch = (value: string) => {
    if (value) {
      setSearchParams({ q: value });
      setShowSuggestions(false);
      
      // Save to search history
      const saveToHistory = async () => {
        try {
          const { data: session } = await supabase.auth.getSession();
          if (session?.session?.user) {
            await supabase
              .from('search_history')
              .insert([
                { 
                  user_id: session.session.user.id,
                  query: value,
                  searched_at: new Date().toISOString()
                }
              ]);
          }
        } catch (error) {
          console.error('Error saving search history:', error);
        }
      };
      
      saveToHistory();
    } else {
      setSearchParams({});
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSearch(suggestion);
  };

  const handleRecentSearchClick = (search: string) => {
    handleSearch(search);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 1000]);
    setMinRating(null);
    setAvailability({
      inStock: false,
      fastDelivery: false,
      onSale: false
    });
  };

  const filteredProducts = products
    .filter(product => {
      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category_id || '')) {
        return false;
      }
      
      // Price range filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }
      
      // Rating filter
      if (minRating !== null && (product.rating || 0) < minRating) {
        return false;
      }
      
      // Availability filters
      if (availability.inStock && !product.stock) {
        return false;
      }
      if (availability.fastDelivery && !product.is_trending) {
        return false;
      }
      if (availability.onSale && !product.sale_price) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0);
      }
    });

  return (
    <div className={cn(
      "min-h-screen",
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    )}>
      {/* Search Header */}
      <div className={cn(
        "sticky top-0 z-20",
        isDarkMode ? "bg-gray-900/95" : "bg-white/95",
        "backdrop-blur-sm border-b shadow-sm"
      )}>
        <div className="container mx-auto px-4 py-4">
          <div className="relative max-w-2xl mx-auto">
            <Input
              type="search"
              placeholder="Search for products..."
              className={cn(
                "w-full text-base pr-10 pl-10 rounded-full transition-all duration-200",
                isDarkMode 
                  ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-orange-500" 
                  : "bg-gray-50 border-gray-200 focus:border-orange-500"
              )}
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => {
                // Delay hiding suggestions to allow for click events
                setTimeout(() => setShowSuggestions(false), 200);
              }}
            />
            <SearchIcon className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )} />
            
            {/* Search Suggestions */}
            {showSuggestions && (suggestions.length > 0 || recentSearches.length > 0 || isTyping) && (
              <div className={cn(
                "absolute top-full left-0 right-0 mt-2 rounded-xl shadow-lg border overflow-hidden",
                "transform transition-all duration-200 ease-in-out",
                isDarkMode 
                  ? "bg-gray-800 border-gray-700" 
                  : "bg-white border-gray-200"
              )}>
                {isTyping ? (
                  <div className="p-4 flex items-center justify-center">
                    <div className={cn(
                      "animate-spin rounded-full h-5 w-5 border-2",
                      isDarkMode ? "border-orange-500" : "border-orange-500"
                    )} />
                  </div>
                ) : (
                  <>
                    {suggestions.length > 0 && (
                      <div className="p-2">
                        <div className={cn(
                          "text-xs font-medium mb-1 px-2 flex items-center",
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        )}>
                          <SearchIcon className="h-3 w-3 mr-1" />
                          Suggestions
                        </div>
                        {suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200",
                              "hover:bg-gray-100 active:bg-gray-200",
                              isDarkMode 
                                ? "text-gray-300 hover:bg-gray-700 active:bg-gray-600" 
                                : "text-gray-700"
                            )}
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {recentSearches.length > 0 && (
                      <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                        <div className={cn(
                          "text-xs font-medium mb-1 px-2 flex items-center justify-between",
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        )}>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            Recent Searches
                          </div>
                          <button
                            className={cn(
                              "text-xs hover:underline",
                              isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"
                            )}
                            onClick={() => setRecentSearches([])}
                          >
                            Clear
                          </button>
                        </div>
                        {recentSearches.map((search, index) => (
                          <button
                            key={index}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200",
                              "hover:bg-gray-100 active:bg-gray-200",
                              isDarkMode 
                                ? "text-gray-300 hover:bg-gray-700 active:bg-gray-600" 
                                : "text-gray-700"
                            )}
                            onClick={() => handleRecentSearchClick(search)}
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Mobile Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden mb-4 w-full">
                <Filter className="h-4 w-4 mr-2" />
                Filters {activeFilters > 0 && `(${activeFilters})`}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className={cn(
                      "text-lg font-semibold",
                      isDarkMode ? "text-white" : "text-gray-900"
                    )}>Filters</h2>
                    {activeFilters > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={clearFilters}
                        className="text-sm"
                      >
                        Clear all
                      </Button>
                    )}
                  </div>
                  <FiltersSidebar
                    categories={categories}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    minRating={minRating}
                    setMinRating={setMinRating}
                    availability={availability}
                    setAvailability={setAvailability}
                  />
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>

          {/* Desktop Filters */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className={cn(
              "sticky top-24 rounded-xl border p-4",
              isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            )}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={cn(
                  "text-lg font-semibold",
                  isDarkMode ? "text-white" : "text-gray-900"
                )}>Filters</h2>
                {activeFilters > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={clearFilters}
                    className="text-sm"
                  >
                    Clear all
                  </Button>
                )}
              </div>
              <FiltersSidebar
                categories={categories}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                sortBy={sortBy}
                setSortBy={setSortBy}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                minRating={minRating}
                setMinRating={setMinRating}
                availability={availability}
                setAvailability={setAvailability}
              />
            </div>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className={cn(
                  "text-xl font-semibold",
                  isDarkMode ? "text-white" : "text-gray-900"
                )}>
                  {query ? `Results for "${query}"` : 'All Products'}
                </h2>
                <p className={cn(
                  "text-sm mt-1",
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                )}>
                  {filteredProducts.length} products found
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={cn(
                    "aspect-square rounded-lg animate-pulse",
                    isDarkMode ? "bg-gray-800" : "bg-gray-200"
                  )} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={{
                        ...product,
                        stock: product.stock || 0
                      }}
                      className="h-full"
                    />
                  ))
                ) : (
                  <div className={cn(
                    "col-span-full text-center py-12 rounded-lg",
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  )}>
                    <Package className={cn(
                      "h-12 w-12 mx-auto mb-4",
                      isDarkMode ? "text-gray-600" : "text-gray-400"
                    )} />
                    <h3 className={cn(
                      "text-lg font-medium mb-2",
                      isDarkMode ? "text-white" : "text-gray-900"
                    )}>No products found</h3>
                    <p className={cn(
                      "text-sm mb-4",
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}>
                      Try adjusting your filters or search term
                    </p>
                    <Button 
                      variant="outline"
                      onClick={clearFilters}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface FiltersSidebarProps {
  categories: any[];
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  minRating: number | null;
  setMinRating: (rating: number | null) => void;
  availability: {
    inStock: boolean;
    fastDelivery: boolean;
    onSale: boolean;
  };
  setAvailability: (availability: any) => void;
}

function FiltersSidebar({
  categories,
  selectedCategories,
  setSelectedCategories,
  sortBy,
  setSortBy,
  priceRange,
  setPriceRange,
  minRating,
  setMinRating,
  availability,
  setAvailability
}: FiltersSidebarProps) {
  const { isDarkMode } = useTheme();

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className={cn(
          "font-medium mb-3",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          Categories
        </h3>
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center">
                <Checkbox
                  id={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCategories([...selectedCategories, category.id]);
                    } else {
                      setSelectedCategories(selectedCategories.filter(id => id !== category.id));
                    }
                  }}
                />
                <label
                  htmlFor={category.id}
                  className={cn(
                    "ml-2 text-sm",
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  )}
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h3 className={cn(
          "font-medium mb-3",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          Price Range
        </h3>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={0}
          max={1000}
          step={10}
          className="mb-2"
        />
        <div className={cn(
          "text-sm flex justify-between",
          isDarkMode ? "text-gray-400" : "text-gray-600"
        )}>
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div>

      <Separator />

      {/* Rating */}
      <div>
        <h3 className={cn(
          "font-medium mb-3",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          Rating
        </h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center">
              <Checkbox
                id={`rating-${rating}`}
                checked={minRating === rating}
                onCheckedChange={(checked) => {
                  setMinRating(checked ? rating : null);
                }}
              />
              <label
                htmlFor={`rating-${rating}`}
                className={cn(
                  "ml-2 text-sm flex items-center",
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                )}
              >
                {rating} <Star className="h-3 w-3 ml-1 text-yellow-500" /> & up
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Availability */}
      <div>
        <h3 className={cn(
          "font-medium mb-3",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          Availability
        </h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <Checkbox
              id="in-stock"
              checked={availability.inStock}
              onCheckedChange={(checked) => {
                setAvailability({ ...availability, inStock: !!checked });
              }}
            />
            <label
              htmlFor="in-stock"
              className={cn(
                "ml-2 text-sm flex items-center",
                isDarkMode ? "text-gray-300" : "text-gray-700"
              )}
            >
              <Package className="h-3 w-3 mr-1" /> In Stock
            </label>
          </div>
          <div className="flex items-center">
            <Checkbox
              id="fast-delivery"
              checked={availability.fastDelivery}
              onCheckedChange={(checked) => {
                setAvailability({ ...availability, fastDelivery: !!checked });
              }}
            />
            <label
              htmlFor="fast-delivery"
              className={cn(
                "ml-2 text-sm flex items-center",
                isDarkMode ? "text-gray-300" : "text-gray-700"
              )}
            >
              <Truck className="h-3 w-3 mr-1" /> Fast Delivery
            </label>
          </div>
          <div className="flex items-center">
            <Checkbox
              id="on-sale"
              checked={availability.onSale}
              onCheckedChange={(checked) => {
                setAvailability({ ...availability, onSale: !!checked });
              }}
            />
            <label
              htmlFor="on-sale"
              className={cn(
                "ml-2 text-sm flex items-center",
                isDarkMode ? "text-gray-300" : "text-gray-700"
              )}
            >
              <Tag className="h-3 w-3 mr-1" /> On Sale
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

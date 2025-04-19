import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { useSearchParams } from 'react-router-dom';
import { useSearchData } from '@/hooks/use-search-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useCategories } from '@/hooks/use-categories';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Filter, SlidersHorizontal, Clock, Star, Truck, Package, Tag, X, ChevronDown } from 'lucide-react';
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
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [availability, setAvailability] = useState({
    inStock: false,
    fastDelivery: false,
    onSale: false
  });
  
  // Search suggestions
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
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

  return (
    <div className={cn(
      "min-h-screen",
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    )}>
      {/* Search Results Header */}
      <div className={cn(
        "sticky top-0 z-20",
        isDarkMode ? "bg-gray-900/95" : "bg-white/95",
        "backdrop-blur-sm border-b shadow-sm"
      )}>
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-semibold line-clamp-1">
                {query ? `Search results for "${query}"` : 'All Products'}
              </h1>
              {totalProducts > 0 && (
                <Badge variant="outline" className="ml-2">
                  {totalProducts} results
                </Badge>
              )}
            </div>
            
            {/* Filters and Sort */}
            <div className="flex items-center gap-2 sm:gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[120px] sm:w-[180px] text-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 text-sm h-9">
                    <Filter className="h-4 w-4" />
                    Filters
                    {activeFilters > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {activeFilters}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh] sm:h-auto">
                  <ScrollArea className="h-full">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between sticky top-0 bg-background pb-2">
                        <h3 className="text-lg font-semibold">Filters</h3>
                        <Button variant="ghost" onClick={clearFilters} size="sm">
                          Clear all
                        </Button>
                      </div>
                      
                      {/* Filter options */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Categories</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
                            {categories.map((category) => (
                              <div key={category.id} className="flex items-center space-x-2">
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
                                <label htmlFor={category.id} className="text-sm">
                                  {category.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h4 className="font-medium mb-2">Price Range</h4>
                          <Slider
                            value={priceRange}
                            onValueChange={setPriceRange}
                            max={1000}
                            step={10}
                            className="my-4"
                          />
                          <div className="flex justify-between text-sm">
                            <span>${priceRange[0]}</span>
                            <span>${priceRange[1]}</span>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h4 className="font-medium mb-2">Rating</h4>
                          <Select value={minRating?.toString() || ''} onValueChange={(value) => setMinRating(value ? Number(value) : null)}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Minimum rating" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="4">4 stars & above</SelectItem>
                              <SelectItem value="3">3 stars & above</SelectItem>
                              <SelectItem value="2">2 stars & above</SelectItem>
                              <SelectItem value="1">1 star & above</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h4 className="font-medium mb-2">Availability</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="inStock"
                                checked={availability.inStock}
                                onCheckedChange={(checked) => setAvailability({...availability, inStock: !!checked})}
                              />
                              <label htmlFor="inStock" className="text-sm">In Stock</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="fastDelivery"
                                checked={availability.fastDelivery}
                                onCheckedChange={(checked) => setAvailability({...availability, fastDelivery: !!checked})}
                              />
                              <label htmlFor="fastDelivery" className="text-sm">Fast Delivery</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="onSale"
                                checked={availability.onSale}
                                onCheckedChange={(checked) => setAvailability({...availability, onSale: !!checked})}
                              />
                              <label htmlFor="onSale" className="text-sm">On Sale</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {Array(8).fill(null).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-48 sm:h-64 rounded-lg"></div>
                <div className="mt-3 sm:mt-4 space-y-2">
                  <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={{
                  ...product,
                  stock: product.stock || 0
                }} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <h3 className="text-base sm:text-lg font-medium">No products found</h3>
            <p className="text-sm sm:text-base text-gray-500 mt-2">
              {query ? `No results found for "${query}"` : 'No products available'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

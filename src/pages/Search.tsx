
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search as SearchIcon, X, Grid, List, Filter, ShoppingBag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useShopSearch } from '@/hooks/use-shop-search';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import ProductCard from '@/components/ui/ProductCard';

type SortOption = 'relevance' | 'price-low' | 'price-high' | 'rating' | 'newest';

const Search = () => {
  // Query parameters
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q') || '';
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // State
  const [query, setQuery] = useState(searchQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(isMobile ? 'grid' : 'grid');
  
  // Initialize filter states from URL
  const initialFilters = {
    category: queryParams.get('category') || 'all',
    priceRange: queryParams.get('price') || 'all',
    sort: (queryParams.get('sort') as SortOption) || 'relevance',
    inStock: queryParams.get('inStock') === 'true',
    onSale: queryParams.get('onSale') === 'true'
  };
  
  // Use the custom hook for search functionality
  const { 
    products: filteredProducts, 
    categories,
    isLoading,
    filters,
    setFilters,
    clearFilters
  } = useShopSearch(searchQuery, initialFilters);
  
  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update query parameters
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (filters.category !== 'all') params.set('category', filters.category);
    if (filters.priceRange !== 'all') params.set('price', filters.priceRange);
    if (filters.sort !== 'relevance') params.set('sort', filters.sort);
    if (filters.inStock) params.set('inStock', 'true');
    if (filters.onSale) params.set('onSale', 'true');
    
    // Navigate with new search params
    navigate(`/search?${params.toString()}`);
    
    // Close filters on mobile after search
    setShowFilters(false);
    
    // Show toast notification
    toast({
      title: "Search updated",
      description: `Found ${filteredProducts.length} products for "${query}"`,
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16">
      {/* Header - Added more spacing at the top */}
      <header className="bg-white dark:bg-gray-800 px-3 py-3 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2 mt-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8 pr-8 py-1.5 h-9 w-full rounded-full text-sm bg-gray-50 dark:bg-gray-700 border-gray-200"
            />
            <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2">
              <SearchIcon className="h-3.5 w-3.5 text-gray-400" />
            </div>
            {query && (
              <button 
                type="button"
                className="absolute right-2.5 top-1/2 transform -translate-y-1/2"
                onClick={() => setQuery('')}
              >
                <X className="h-3.5 w-3.5 text-gray-400" />
              </button>
            )}
          </form>
          
          <Button 
            variant={showFilters ? "secondary" : "ghost"}
            size="icon"
            className={`h-8 w-8 flex-shrink-0 ${showFilters ? "text-kutuku-primary bg-kutuku-light" : ""}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Category Pills - Horizontal scrollable with better alignment */}
        {!showFilters && categories && categories.length > 0 && (
          <div className="pt-3 overflow-x-auto whitespace-nowrap -mx-3 px-3 scrollbar-hide">
            <div className="flex gap-1.5 pb-1">
              <Button
                size="sm"
                variant={filters.category === 'all' ? "default" : "outline"}
                onClick={() => setFilters({...filters, category: 'all'})}
                className="rounded-full h-7 text-xs px-3 py-0 bg-kutuku-primary hover:bg-kutuku-secondary"
              >
                All
              </Button>
              
              {categories.map(category => (
                <Button
                  key={category}
                  size="sm"
                  variant={filters.category === category.toLowerCase() ? "default" : "outline"}
                  onClick={() => setFilters({...filters, category: category.toLowerCase()})}
                  className="rounded-full h-7 text-xs px-3 py-0 flex-shrink-0 bg-kutuku-primary hover:bg-kutuku-secondary"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        )}
      </header>
      
      <div className="flex flex-col lg:flex-row">
        {/* Filters sidebar - Fixed alignment issues */}
        {showFilters && (
          <aside className={`${isMobile ? 'fixed inset-0 z-20 bg-black/60' : 'w-64 sticky top-[61px]'}`}>
            <div 
              className={`
                ${isMobile ? 'absolute bottom-0 left-0 right-0 rounded-t-xl max-h-[85vh] overflow-y-auto' : 'min-h-[calc(100vh-61px)]'} 
                bg-white dark:bg-gray-800 p-4 border-r animate-slide-in-right
              `}
            >
              <div className="flex items-center justify-between mb-4 sticky top-0 bg-white z-10 pb-2 border-b">
                <h2 className="font-medium text-base">Filters</h2>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
                    Clear All
                  </Button>
                  {isMobile && (
                    <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)} className="h-8 text-xs">
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Category filter */}
              <div className="mb-5">
                <h3 className="text-sm font-medium mb-2">Category</h3>
                <RadioGroup 
                  value={filters.category} 
                  onValueChange={(value) => setFilters({...filters, category: value})}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="category-all" className="h-4 w-4" />
                    <Label htmlFor="category-all" className="text-sm">All Categories</Label>
                  </div>
                  
                  {categories?.map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={category.toLowerCase()} 
                        id={`category-${category.toLowerCase()}`}
                        className="h-4 w-4" 
                      />
                      <Label htmlFor={`category-${category.toLowerCase()}`} className="text-sm">{category}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              {/* Price filter */}
              <div className="mb-5">
                <h3 className="text-sm font-medium mb-2">Price Range</h3>
                <RadioGroup 
                  value={filters.priceRange} 
                  onValueChange={(value) => setFilters({...filters, priceRange: value})}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="price-all" className="h-4 w-4" />
                    <Label htmlFor="price-all" className="text-sm">All Prices</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0-500" id="price-0-500" className="h-4 w-4" />
                    <Label htmlFor="price-0-500" className="text-sm">Under ₹500</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="500-1000" id="price-500-1000" className="h-4 w-4" />
                    <Label htmlFor="price-500-1000" className="text-sm">₹500 - ₹1,000</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1000-2000" id="price-1000-2000" className="h-4 w-4" />
                    <Label htmlFor="price-1000-2000" className="text-sm">₹1,000 - ₹2,000</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2000-5000" id="price-2000-5000" className="h-4 w-4" />
                    <Label htmlFor="price-2000-5000" className="text-sm">₹2,000 - ₹5,000</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="5000" id="price-5000" className="h-4 w-4" />
                    <Label htmlFor="price-5000" className="text-sm">Above ₹5,000</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Sort filter */}
              <div className="mb-5">
                <h3 className="text-sm font-medium mb-2">Sort By</h3>
                <RadioGroup 
                  value={filters.sort} 
                  onValueChange={(value) => setFilters({...filters, sort: value})}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="relevance" id="sort-relevance" className="h-4 w-4" />
                    <Label htmlFor="sort-relevance" className="text-sm">Relevance</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="price-low" id="sort-price-low" className="h-4 w-4" />
                    <Label htmlFor="sort-price-low" className="text-sm">Price: Low to High</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="price-high" id="sort-price-high" className="h-4 w-4" />
                    <Label htmlFor="sort-price-high" className="text-sm">Price: High to Low</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rating" id="sort-rating" className="h-4 w-4" />
                    <Label htmlFor="sort-rating" className="text-sm">Highest Rated</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="newest" id="sort-newest" className="h-4 w-4" />
                    <Label htmlFor="sort-newest" className="text-sm">Newest First</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Other filters */}
              <div className="space-y-3 mb-5">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="in-stock" 
                    checked={filters.inStock}
                    onCheckedChange={(checked) => 
                      setFilters({...filters, inStock: checked as boolean})
                    }
                    className="h-4 w-4 rounded-sm"
                  />
                  <Label htmlFor="in-stock" className="text-sm">In Stock</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="on-sale" 
                    checked={filters.onSale}
                    onCheckedChange={(checked) => 
                      setFilters({...filters, onSale: checked as boolean})
                    }
                    className="h-4 w-4 rounded-sm"
                  />
                  <Label htmlFor="on-sale" className="text-sm">On Sale</Label>
                </div>
              </div>
              
              <div className="sticky bottom-0 pt-2 pb-4 bg-white border-t">
                <Button 
                  className="w-full text-sm rounded-full bg-kutuku-primary hover:bg-kutuku-secondary" 
                  onClick={handleSearch}
                >
                  Apply Filters
                </Button>
              </div>

              {isMobile && (
                <div className="h-safe-area-bottom" />
              )}
            </div>
          </aside>
        )}
        
        {/* Main content */}
        <main className={`flex-1 p-3 ${showFilters && !isMobile ? 'ml-64' : ''}`}>
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs text-gray-500">
              {isLoading ? 'Loading...' : (
                <>
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'}
                  {searchQuery ? ` for "${searchQuery}"` : ''}
                </>
              )}
            </p>
            
            {/* View mode toggle - hidden on mobile */}
            {!isMobile && (
              <div className="flex items-center gap-1">
                <Button
                  variant={viewMode === 'grid' ? "secondary" : "outline"}
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-3.5 w-3.5" />
                  <span className="sr-only">Grid view</span>
                </Button>
                <Button
                  variant={viewMode === 'list' ? "secondary" : "outline"}
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-3.5 w-3.5" />
                  <span className="sr-only">List view</span>
                </Button>
              </div>
            )}
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="border-none shadow-sm rounded-xl overflow-hidden">
                  <div className="bg-gray-200 dark:bg-gray-700 h-32 animate-pulse"></div>
                  <CardContent className="p-2">
                    <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded mb-2 w-3/4 animate-pulse"></div>
                    <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-1/2 animate-pulse"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className={`grid ${viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'} gap-3`}>
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant="default"
                  layout={viewMode === 'list' ? 'horizontal' : 'vertical'}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-sm text-gray-500 mb-4">
                We couldn't find any products matching your criteria.
              </p>
              <Button 
                onClick={clearFilters} 
                className="text-sm rounded-full bg-kutuku-primary hover:bg-kutuku-secondary"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Search;

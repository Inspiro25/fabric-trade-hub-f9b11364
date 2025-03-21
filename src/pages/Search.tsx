import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search as SearchIcon, Sliders, X, Grid, List, Filter, ShoppingBag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductCard from '@/components/ui/ProductCard';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { fetchProducts, getAllCategories, Product } from '@/lib/products';
import { useIsMobile } from '@/hooks/use-mobile';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

const Search = () => {
  // Query parameters
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q') || '';
  const { toast } = useToast();
  
  // State
  const [query, setQuery] = useState(searchQuery);
  const [filter, setFilter] = useState({
    category: queryParams.get('category') || 'all',
    priceRange: queryParams.get('price') || 'all',
    sort: queryParams.get('sort') || 'relevance',
    inStock: queryParams.get('inStock') === 'true',
    onSale: queryParams.get('onSale') === 'true'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const isMobile = useIsMobile();
  
  // React Query for fetching products and categories
  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Apply filters to products
  const filteredProducts = useMemo(() => {
    if (!productsQuery.data || productsQuery.isLoading) return [];
    
    let filtered = [...productsQuery.data];
    
    // Search query filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(lowerQuery) || 
        product.description.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
      );
    }
    
    // Category filter
    if (filter.category && filter.category !== 'all') {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === filter.category.toLowerCase()
      );
    }
    
    // Price range filter
    if (filter.priceRange && filter.priceRange !== 'all') {
      const [min, max] = filter.priceRange.split('-').map(Number);
      filtered = filtered.filter(product => {
        const price = product.salePrice || product.price;
        if (!max) {
          return price >= min;
        }
        return price >= min && price <= max;
      });
    }
    
    // In stock filter
    if (filter.inStock) {
      filtered = filtered.filter(product => product.stock > 0);
    }
    
    // On sale filter
    if (filter.onSale) {
      filtered = filtered.filter(product => !!product.salePrice);
    }
    
    // Sort results
    switch(filter.sort) {
      case 'price-low':
        filtered.sort((a, b) => {
          const priceA = a.salePrice || a.price;
          const priceB = b.salePrice || b.price;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const priceA = a.salePrice || a.price;
          const priceB = b.salePrice || b.price;
          return priceB - priceA;
        });
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => {
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return 0;
        });
        break;
      default: // relevance or fallback
        // Keep original order for relevance (it's already sorted by search match)
        break;
    }
    
    return filtered;
  }, [productsQuery.data, searchQuery, filter]);
  
  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update query parameters
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (filter.category !== 'all') params.set('category', filter.category);
    if (filter.priceRange !== 'all') params.set('price', filter.priceRange);
    if (filter.sort !== 'relevance') params.set('sort', filter.sort);
    if (filter.inStock) params.set('inStock', 'true');
    if (filter.onSale) params.set('onSale', 'true');
    
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
  
  // Clear all filters
  const clearFilters = () => {
    setFilter({
      category: 'all',
      priceRange: 'all',
      sort: 'relevance',
      inStock: false,
      onSale: false
    });
    
    // Only keep the search query
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    navigate(`/search?${params.toString()}`);
    
    toast({
      title: "Filters cleared",
      description: "All search filters have been reset",
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 px-3 py-2 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Input
              type="text"
              placeholder="Search products, brands..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8 pr-8 py-1.5 h-8 w-full rounded-full text-sm bg-gray-50 dark:bg-gray-700 border-kutuku-gray focus:border-kutuku-primary"
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
            variant="ghost" 
            size="icon"
            className={`h-8 w-8 ${showFilters ? "text-kutuku-primary" : ""}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Filter chips - Mobile */}
        {!showFilters && categoriesQuery.data && (
          <div className="pt-2 overflow-x-auto whitespace-nowrap -mx-3 px-3 no-scrollbar">
            <div className="flex gap-1.5">
              <Button
                size="sm"
                variant={filter.category === 'all' ? "default" : "outline"}
                onClick={() => setFilter({...filter, category: 'all'})}
                className="rounded-full h-7 text-xs px-3 py-0 bg-kutuku-primary hover:bg-kutuku-secondary"
              >
                All
              </Button>
              
              {categoriesQuery.data.map(category => (
                <Button
                  key={category}
                  size="sm"
                  variant={filter.category === category.toLowerCase() ? "default" : "outline"}
                  onClick={() => setFilter({...filter, category: category.toLowerCase()})}
                  className="rounded-full h-7 text-xs px-3 py-0 bg-kutuku-primary hover:bg-kutuku-secondary"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        )}
      </header>
      
      <div className="flex flex-col lg:flex-row">
        {/* Filters sidebar */}
        {showFilters && (
          <aside className={`${isMobile ? 'fixed inset-0 z-40 bg-black/50' : 'w-64 sticky top-[53px]'}`}>
            <div className={`${isMobile ? 'absolute bottom-0 left-0 right-0 rounded-t-xl' : 'min-h-[calc(100vh-53px)]'} bg-white dark:bg-gray-800 p-3 border-r animate-slide-in-right`}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-medium text-sm">Filters</h2>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs px-2">
                    Clear All
                  </Button>
                  {isMobile && (
                    <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)} className="h-7 text-xs px-2">
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Category filter */}
              <div className="mb-4">
                <h3 className="text-xs font-medium mb-1.5">Category</h3>
                <RadioGroup 
                  value={filter.category} 
                  onValueChange={(value) => setFilter({...filter, category: value})}
                  className="space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="category-all" className="h-3.5 w-3.5" />
                    <Label htmlFor="category-all" className="text-xs">All Categories</Label>
                  </div>
                  
                  {categoriesQuery.data?.map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={category.toLowerCase()} 
                        id={`category-${category.toLowerCase()}`}
                        className="h-3.5 w-3.5" 
                      />
                      <Label htmlFor={`category-${category.toLowerCase()}`} className="text-xs">{category}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              {/* Price filter */}
              <div className="mb-4">
                <h3 className="text-xs font-medium mb-1.5">Price Range</h3>
                <RadioGroup 
                  value={filter.priceRange} 
                  onValueChange={(value) => setFilter({...filter, priceRange: value})}
                  className="space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="price-all" className="h-3.5 w-3.5" />
                    <Label htmlFor="price-all" className="text-xs">All Prices</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0-500" id="price-0-500" className="h-3.5 w-3.5" />
                    <Label htmlFor="price-0-500" className="text-xs">Under ₹500</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="500-1000" id="price-500-1000" className="h-3.5 w-3.5" />
                    <Label htmlFor="price-500-1000" className="text-xs">₹500 - ₹1,000</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1000-2000" id="price-1000-2000" className="h-3.5 w-3.5" />
                    <Label htmlFor="price-1000-2000" className="text-xs">₹1,000 - ₹2,000</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2000-5000" id="price-2000-5000" className="h-3.5 w-3.5" />
                    <Label htmlFor="price-2000-5000" className="text-xs">₹2,000 - ₹5,000</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="5000" id="price-5000" className="h-3.5 w-3.5" />
                    <Label htmlFor="price-5000" className="text-xs">Above ₹5,000</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Sort filter */}
              <div className="mb-4">
                <h3 className="text-xs font-medium mb-1.5">Sort By</h3>
                <RadioGroup 
                  value={filter.sort} 
                  onValueChange={(value) => setFilter({...filter, sort: value})}
                  className="space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="relevance" id="sort-relevance" className="h-3.5 w-3.5" />
                    <Label htmlFor="sort-relevance" className="text-xs">Relevance</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="price-low" id="sort-price-low" className="h-3.5 w-3.5" />
                    <Label htmlFor="sort-price-low" className="text-xs">Price: Low to High</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="price-high" id="sort-price-high" className="h-3.5 w-3.5" />
                    <Label htmlFor="sort-price-high" className="text-xs">Price: High to Low</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rating" id="sort-rating" className="h-3.5 w-3.5" />
                    <Label htmlFor="sort-rating" className="text-xs">Highest Rated</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="newest" id="sort-newest" className="h-3.5 w-3.5" />
                    <Label htmlFor="sort-newest" className="text-xs">Newest First</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Other filters */}
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="in-stock" 
                    checked={filter.inStock}
                    onCheckedChange={(checked) => 
                      setFilter({...filter, inStock: checked as boolean})
                    }
                    className="h-3.5 w-3.5 rounded-sm"
                  />
                  <Label htmlFor="in-stock" className="text-xs">In Stock</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="on-sale" 
                    checked={filter.onSale}
                    onCheckedChange={(checked) => 
                      setFilter({...filter, onSale: checked as boolean})
                    }
                    className="h-3.5 w-3.5 rounded-sm"
                  />
                  <Label htmlFor="on-sale" className="text-xs">On Sale</Label>
                </div>
              </div>
              
              <div className="mt-4">
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
              {productsQuery.isLoading ? 'Loading...' : (
                <>
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'}
                  {searchQuery ? ` for "${searchQuery}"` : ''}
                </>
              )}
            </p>
            
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
          </div>
          
          {productsQuery.isLoading ? (
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
            <div className={`grid ${viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'} gap-3`}>
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
            <div className="text-center py-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <ShoppingBag className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <h3 className="text-base font-medium mb-1">No products found</h3>
              <p className="text-xs text-gray-500 mb-3">
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

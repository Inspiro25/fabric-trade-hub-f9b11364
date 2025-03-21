import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search as SearchIcon, Sliders, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ui/ProductCard';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { fetchProducts, getAllCategories, Product } from '@/lib/products';

const Search = () => {
  // Query parameters
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q') || '';
  
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState(searchQuery);
  const [filter, setFilter] = useState({
    category: queryParams.get('category') || 'all',
    priceRange: queryParams.get('price') || 'all',
    sort: queryParams.get('sort') || 'relevance',
    inStock: queryParams.get('inStock') === 'true',
    onSale: queryParams.get('onSale') === 'true'
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Fetch products and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await fetchProducts();
        const categoriesData = await getAllCategories();
        
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Apply filters to products
  const filteredProducts = useMemo(() => {
    if (!products.length) return [];
    
    let filtered = [...products];
    
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
  }, [products, searchQuery, filter]);
  
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
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <header className="bg-white px-4 py-3 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Input
              type="text"
              placeholder="Search products, brands..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-full"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <SearchIcon className="h-4 w-4 text-gray-400" />
            </div>
            {query && (
              <button 
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setQuery('')}
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </form>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "text-primary" : ""}
          >
            <Sliders className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Filters bar - Mobile */}
        {showFilters && (
          <div className="pt-3 pb-2 border-t mt-2 overflow-x-auto whitespace-nowrap -mx-4 px-4">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={filter.category === 'all' ? "default" : "outline"}
                onClick={() => setFilter({...filter, category: 'all'})}
                className="rounded-full"
              >
                All
              </Button>
              
              {categories.map(category => (
                <Button
                  key={category}
                  size="sm"
                  variant={filter.category === category.toLowerCase() ? "default" : "outline"}
                  onClick={() => setFilter({...filter, category: category.toLowerCase()})}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        )}
      </header>
      
      <div className="flex">
        {/* Filters sidebar - Desktop */}
        {showFilters && (
          <aside className="w-64 bg-white p-4 border-r min-h-screen sticky top-16">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium">Filters</h2>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
            
            {/* Category filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Category</h3>
              <RadioGroup 
                value={filter.category} 
                onValueChange={(value) => setFilter({...filter, category: value})}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="category-all" />
                    <Label htmlFor="category-all">All Categories</Label>
                  </div>
                  
                  {categories.map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={category.toLowerCase()} 
                        id={`category-${category.toLowerCase()}`} 
                      />
                      <Label htmlFor={`category-${category.toLowerCase()}`}>{category}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
            
            {/* Price filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Price Range</h3>
              <RadioGroup 
                value={filter.priceRange} 
                onValueChange={(value) => setFilter({...filter, priceRange: value})}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="price-all" />
                    <Label htmlFor="price-all">All Prices</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0-500" id="price-0-500" />
                    <Label htmlFor="price-0-500">Under ₹500</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="500-1000" id="price-500-1000" />
                    <Label htmlFor="price-500-1000">₹500 - ₹1,000</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1000-2000" id="price-1000-2000" />
                    <Label htmlFor="price-1000-2000">₹1,000 - ₹2,000</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2000-5000" id="price-2000-5000" />
                    <Label htmlFor="price-2000-5000">₹2,000 - ₹5,000</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="5000" id="price-5000" />
                    <Label htmlFor="price-5000">Above ₹5,000</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
            
            {/* Sort filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Sort By</h3>
              <RadioGroup 
                value={filter.sort} 
                onValueChange={(value) => setFilter({...filter, sort: value})}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="relevance" id="sort-relevance" />
                    <Label htmlFor="sort-relevance">Relevance</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="price-low" id="sort-price-low" />
                    <Label htmlFor="sort-price-low">Price: Low to High</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="price-high" id="sort-price-high" />
                    <Label htmlFor="sort-price-high">Price: High to Low</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rating" id="sort-rating" />
                    <Label htmlFor="sort-rating">Highest Rated</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="newest" id="sort-newest" />
                    <Label htmlFor="sort-newest">Newest First</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
            
            {/* Other filters */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="in-stock" 
                  checked={filter.inStock}
                  onCheckedChange={(checked) => 
                    setFilter({...filter, inStock: checked as boolean})
                  }
                />
                <Label htmlFor="in-stock">In Stock</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="on-sale" 
                  checked={filter.onSale}
                  onCheckedChange={(checked) => 
                    setFilter({...filter, onSale: checked as boolean})
                  }
                />
                <Label htmlFor="on-sale">On Sale</Label>
              </div>
            </div>
            
            <div className="mt-6">
              <Button className="w-full" onClick={handleSearch}>
                Apply Filters
              </Button>
            </div>
          </aside>
        )}
        
        {/* Main content */}
        <main className={`flex-1 p-4 ${showFilters ? '' : 'w-full'}`}>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-3 animate-pulse">
                  <div className="bg-gray-200 h-40 rounded-md mb-3"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2 w-3/4"></div>
                  <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-sm text-gray-500">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'}
                  {searchQuery ? ` for "${searchQuery}"` : ''}
                </p>
              </div>
              
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      variant="default"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <h3 className="text-lg font-medium mb-2">No products found</h3>
                  <p className="text-gray-500 mb-6">
                    We couldn't find any products matching your criteria.
                  </p>
                  <Button onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Search;

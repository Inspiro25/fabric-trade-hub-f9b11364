import React, { useState, useEffect } from 'react';
import { products, Product } from '@/lib/products';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ui/ProductCard';
import { Search as SearchIcon, Sliders, ArrowLeft, X, History, Tag, SlidersHorizontal, Filter } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { getAllCategories } from '@/lib/products';
const SEARCH_HISTORY_KEY = 'search_history';
const Search = () => {
  // Get query params
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const queryTerm = queryParams.get('q') || '';
  const navigate = useNavigate();
  const {
    toast
  } = useToast();

  // State
  const [searchTerm, setSearchTerm] = useState(queryTerm);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{
    categories: string[];
    priceRange: [number, number];
    sortBy: string;
  }>({
    categories: [],
    priceRange: [0, 1000],
    sortBy: 'relevance'
  });

  // Get all categories for filter options
  const allCategories = getAllCategories();

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  // Initial search when page loads
  useEffect(() => {
    if (queryTerm) {
      performSearch(queryTerm);
    } else {
      setSearchResults(products);
    }
  }, [queryTerm]);

  // Apply filters whenever they change
  useEffect(() => {
    applyFilters();
  }, [activeFilters]);
  const performSearch = (term: string) => {
    setIsSearching(true);
    setSearchTerm(term);

    // Update URL if needed
    if (term !== queryTerm) {
      navigate(`/search${term ? `?q=${encodeURIComponent(term)}` : ''}`, {
        replace: true
      });
    }

    // Add to search history
    if (term.trim() !== '') {
      const updatedHistory = [term, ...searchHistory.filter(item => item !== term)].slice(0, 10); // Keep only 10 most recent searches

      setSearchHistory(updatedHistory);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
    }
    let results = term.trim() === '' ? products : products.filter(product => product.name.toLowerCase().includes(term.toLowerCase()) || product.description.toLowerCase().includes(term.toLowerCase()) || product.category.toLowerCase().includes(term.toLowerCase()) || product.tags.some(tag => tag.toLowerCase().includes(term.toLowerCase())));

    // Apply any active filters to the results
    applyFilters(results);
    setIsSearching(false);
  };
  const applyFilters = (results = searchResults) => {
    let filteredResults = results.length ? [...results] : searchTerm.trim() === '' ? [...products] : [];

    // Filter by categories
    if (activeFilters.categories.length > 0) {
      filteredResults = filteredResults.filter(product => activeFilters.categories.includes(product.category));
    }

    // Filter by price range
    filteredResults = filteredResults.filter(product => {
      const effectivePrice = product.salePrice || product.price;
      return effectivePrice >= activeFilters.priceRange[0] && effectivePrice <= activeFilters.priceRange[1];
    });

    // Sort products
    switch (activeFilters.sortBy) {
      case 'price-low':
        filteredResults.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'price-high':
        filteredResults.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case 'newest':
        filteredResults.sort((a, b) => a.isNew ? -1 : b.isNew ? 1 : 0);
        break;
      case 'rating':
        filteredResults.sort((a, b) => b.rating - a.rating);
        break;
      // 'relevance' is default, no sorting needed for simple search
    }
    setSearchResults(filteredResults);
  };
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchTerm);
  };
  const clearSearch = () => {
    setSearchTerm('');
    performSearch('');
    setShowHistory(false);
  };
  const selectHistoryItem = (term: string) => {
    setSearchTerm(term);
    performSearch(term);
    setShowHistory(false);
  };
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
    toast({
      title: "Search history cleared",
      description: "Your search history has been removed"
    });
  };
  const toggleCategoryFilter = (category: string) => {
    setActiveFilters(prev => {
      const isSelected = prev.categories.includes(category);
      return {
        ...prev,
        categories: isSelected ? prev.categories.filter(c => c !== category) : [...prev.categories, category]
      };
    });
  };
  const handlePriceRangeChange = (min: number, max: number) => {
    setActiveFilters(prev => ({
      ...prev,
      priceRange: [min, max]
    }));
  };
  const handleSortChange = (value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      sortBy: value
    }));
  };
  const clearFilters = () => {
    setActiveFilters({
      categories: [],
      priceRange: [0, 1000],
      sortBy: 'relevance'
    });
    toast({
      title: "Filters cleared",
      description: "All filters have been reset to default"
    });
  };
  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters.categories.length > 0) count++;
    if (activeFilters.priceRange[0] > 0 || activeFilters.priceRange[1] < 1000) count++;
    if (activeFilters.sortBy !== 'relevance') count++;
    return count;
  };
  return <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="sticky top-0 z-10 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-gray-700">
            <ArrowLeft size={22} />
          </Link>
          
          <div className="relative flex-1">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative flex items-center">
                <Input type="text" placeholder="Search for products, brands..." value={searchTerm} onChange={e => {
                setSearchTerm(e.target.value);
                setShowHistory(e.target.value.length > 0);
              }} autoComplete="off" onFocus={() => setShowHistory(searchTerm.length > 0 && searchHistory.length > 0)} className="kutuku-searchbar pr-10 pl-9 h-10 py-[10px]" />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                  <SearchIcon className="h-4 w-4 text-gray-400" />
                </div>
                
                {searchTerm && <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center h-5 w-5 text-gray-400">
                    <X size={16} />
                  </button>}
              </div>
            </form>
            
            {/* Search History Dropdown */}
            {showHistory && searchHistory.length > 0 && <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-20 max-h-60 overflow-y-auto">
                <div className="flex items-center justify-between p-2 border-b">
                  <div className="flex items-center text-sm text-gray-600">
                    <History size={14} className="mr-1" /> Recent searches
                  </div>
                  <Button variant="ghost" size="sm" onClick={clearHistory} className="text-xs">
                    Clear all
                  </Button>
                </div>
                <ul>
                  {searchHistory.map((item, index) => <li key={index}>
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center" onClick={() => selectHistoryItem(item)}>
                        <History size={14} className="mr-2 text-gray-400" />
                        <span className="line-clamp-1">{item}</span>
                      </button>
                    </li>)}
                </ul>
              </div>}
          </div>
          
          {/* Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-gray-700">
                <Filter size={20} />
                {getActiveFilterCount() > 0 && <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                    {getActiveFilterCount()}
                  </span>}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Filters & Sort</SheetTitle>
              </SheetHeader>
              
              <div className="mt-6 flex flex-col gap-6">
                {/* Sort Options */}
                <div>
                  <h3 className="font-medium mb-2">Sort By</h3>
                  <Select value={activeFilters.sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sort option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                {/* Price Range */}
                <div>
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <div className="flex gap-4 items-center">
                    <div className="flex-1">
                      <Label htmlFor="min-price">Min ($)</Label>
                      <Input id="min-price" type="number" min={0} max={activeFilters.priceRange[1]} value={activeFilters.priceRange[0]} onChange={e => handlePriceRangeChange(Number(e.target.value), activeFilters.priceRange[1])} className="mt-1" />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="max-price">Max ($)</Label>
                      <Input id="max-price" type="number" min={activeFilters.priceRange[0]} max={1000} value={activeFilters.priceRange[1]} onChange={e => handlePriceRangeChange(activeFilters.priceRange[0], Number(e.target.value))} className="mt-1" />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Categories */}
                <div>
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-2">
                    {allCategories.map(category => <div key={category} className="flex items-center space-x-2">
                        <Checkbox id={`category-${category}`} checked={activeFilters.categories.includes(category)} onCheckedChange={() => toggleCategoryFilter(category)} />
                        <Label htmlFor={`category-${category}`} className="text-sm cursor-pointer">
                          {category}
                        </Label>
                      </div>)}
                  </div>
                </div>
              </div>
              
              <SheetFooter className="mt-6 gap-2 sm:justify-between">
                <Button variant="outline" onClick={clearFilters} className="w-full sm:w-auto">
                  Clear Filters
                </Button>
                <SheetClose asChild>
                  <Button className="w-full sm:w-auto">Apply Filters</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Active Filters */}
      {getActiveFilterCount() > 0 && <div className="bg-white border-t border-gray-100 px-4 py-2 overflow-x-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 whitespace-nowrap">Active filters:</span>
            <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1">
              {activeFilters.categories.map(category => <Badge key={category} variant="outline" className="whitespace-nowrap">
                  {category}
                  <button className="ml-1" onClick={() => toggleCategoryFilter(category)}>
                    <X size={14} />
                  </button>
                </Badge>)}
              
              {(activeFilters.priceRange[0] > 0 || activeFilters.priceRange[1] < 1000) && <Badge variant="outline" className="whitespace-nowrap">
                  ${activeFilters.priceRange[0]} - ${activeFilters.priceRange[1]}
                  <button className="ml-1" onClick={() => handlePriceRangeChange(0, 1000)}>
                    <X size={14} />
                  </button>
                </Badge>}
              
              {activeFilters.sortBy !== 'relevance' && <Badge variant="outline" className="whitespace-nowrap">
                  Sort: {activeFilters.sortBy.replace('-', ' ')}
                  <button className="ml-1" onClick={() => handleSortChange('relevance')}>
                    <X size={14} />
                  </button>
                </Badge>}
            </div>
          </div>
        </div>}

      {/* Search Content */}
      <div className="p-4">
        {isSearching ? <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-pulse-subtle mb-4">Searching...</div>
          </div> : searchResults.length === 0 ? <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 text-gray-400">
              <SearchIcon size={48} />
            </div>
            <h3 className="text-lg font-medium mb-2">No results found</h3>
            <p className="text-gray-500 max-w-xs mb-4">
              We couldn't find any products matching your search. Try different keywords or adjust your filters.
            </p>
            {activeFilters.categories.length > 0 && <Button variant="outline" onClick={clearFilters} className="mt-2">
                Clear Filters
              </Button>}
          </div> : <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
                {searchTerm ? ` for "${searchTerm}"` : ''}
              </p>
              
              <Select value={activeFilters.sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[140px] h-8 text-xs">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {searchResults.map(product => <ProductCard key={product.id} product={product} variant="compact" gridCols={2} />)}
            </div>
          </>}
      </div>
    </div>;
};
export default Search;
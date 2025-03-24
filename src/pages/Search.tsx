import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon, X, Filter, SortAsc, ArrowLeft } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import useSearch from '@/hooks/use-search';
import SearchResults from '@/components/search/SearchResults';
import SearchRecommendations from '@/components/search/SearchRecommendations';

const SearchLoadingState = () => (
  <div className="space-y-4">
    <Skeleton className="h-10 w-full" />
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <Skeleton key={i} className="h-32" />
      ))}
    </div>
  </div>
);

const SearchErrorState = ({ error, onRetry }) => (
  <div className="text-center py-8">
    <p className="text-red-500 mb-2">Error: {error}</p>
    <Button onClick={onRetry}>Retry</Button>
  </div>
);

const SearchEmptyState = ({ query }) => (
  <div className="text-center py-8">
    <p className="text-gray-500">No results found for "{query}"</p>
  </div>
);

const Search = () => {
  const search = useSearch();
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState(search.query || '');
  
  const createQueryString = search.createQueryString;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const query = createQueryString('query', searchTerm);
      navigate(`/search?${query}`);
      search.saveSearchHistory(searchTerm);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    const query = createQueryString('query', '');
    navigate(`/search?${query}`);
  };
  
  // Initialize the search when the component mounts
  useEffect(() => {
    search.fetchData();
  }, []);

  
  return (
    <div className={cn(
      "min-h-screen pb-16 md:pb-0",
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    )}>
      
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" asChild className="mr-2">
              <Link to="/" aria-label="Back to home">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <form onSubmit={handleSearchSubmit} className="flex items-center w-full">
              <Input
                type="search"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="rounded-none rounded-l-md shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-gray-900"
              />
              {searchTerm && (
                <Button type="button" variant="ghost" size="icon" onClick={handleClearSearch} className="rounded-none">
                  <X className="h-4 w-4" />
                </Button>
              )}
              <Button type="submit" className="rounded-none rounded-r-md shadow-none dark:bg-gray-700 dark:hover:bg-gray-600">
                <SearchIcon className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
      
      <main className="container mx-auto pt-4 px-4">
        
        {search.searchHistory.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Recent Searches</h3>
              <Button variant="link" size="sm" onClick={search.clearAllSearchHistory} className="text-muted-foreground">
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {search.searchHistory.map(item => (
                <Badge
                  key={item}
                  variant="secondary"
                  className="cursor-pointer dark:bg-gray-700 dark:text-gray-300"
                  onClick={() => {
                    setSearchTerm(item);
                    const query = createQueryString('query', item);
                    navigate(`/search?${query}`);
                  }}
                >
                  {item}
                  <Button variant="ghost" size="icon" onClick={(e) => {
                    e.stopPropagation();
                    search.clearSearchHistoryItem(item);
                  }} className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        
        <div className="flex flex-col md:flex-row md:gap-6">
          
          <div className="w-full md:w-1/4 lg:w-1/5">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-sm">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Apply filters to refine your search results.
                  </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[80vh] mt-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium">Category</h4>
                      <Select value={search.selectedCategory || undefined} onValueChange={search.handleCategoryChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={null}>All Categories</SelectItem>
                          {search.categories.map(category => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium">Shop</h4>
                      <Select value={search.selectedShop || undefined} onValueChange={search.handleShopChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="All Shops" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={null}>All Shops</SelectItem>
                          {search.shops.map(shop => (
                            <SelectItem key={shop.id} value={shop.id}>
                              {shop.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium">Price Range</h4>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={search.priceRange[0]}
                          onChange={e => search.handlePriceRangeChange([Number(e.target.value), search.priceRange[1]])}
                          className="w-24 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-gray-900"
                        />
                        <span className="text-gray-500">-</span>
                        <Input
                          type="number"
                          placeholder="Max"
                          value={search.priceRange[1]}
                          onChange={e => search.handlePriceRangeChange([search.priceRange[0], Number(e.target.value)])}
                          className="w-24 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-gray-900"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium">Rating</h4>
                      <div className="flex items-center gap-2">
                        {[5, 4, 3, 2, 1].map(num => (
                          <Button
                            key={num}
                            variant="outline"
                            className={cn(
                              "rounded-md",
                              search.rating === num ? "bg-primary text-primary-foreground hover:bg-primary/80" : ""
                            )}
                            onClick={() => search.handleRatingChange(search.rating === num ? null : num)}
                          >
                            {num} <StarIcon className="h-4 w-4 ml-1" />
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium">Availability</h4>
                      <div className="flex flex-col gap-2">
                        <label className="inline-flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded-sm border-gray-200 shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:checked:bg-primary dark:focus:ring-primary"
                            checked={search.availabilityFilters.inStock}
                            onChange={e => search.handleAvailabilityFilterChange('inStock', e.target.checked)}
                          />
                          <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            In Stock
                          </span>
                        </label>
                        <label className="inline-flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded-sm border-gray-200 shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:checked:bg-primary dark:focus:ring-primary"
                            checked={search.availabilityFilters.outOfStock}
                            onChange={e => search.handleAvailabilityFilterChange('outOfStock', e.target.checked)}
                          />
                          <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Out of Stock
                          </span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium">Brands</h4>
                      <div className="flex flex-col gap-2">
                        {search.shops.map(shop => (
                          <label key={shop.id} className="inline-flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded-sm border-gray-200 shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:checked:bg-primary dark:focus:ring-primary"
                              checked={search.brandFilters[shop.id] || false}
                              onChange={() => search.toggleBrandFilter(shop.id)}
                            />
                            <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              {shop.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium">Discount</h4>
                      <div className="flex flex-col gap-2">
                        <label className="inline-flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded-sm border-gray-200 shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:checked:bg-primary dark:focus:ring-primary"
                            checked={search.discountFilters.discounted}
                            onChange={() => search.toggleDiscountFilter('discounted')}
                          />
                          <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Discounted
                          </span>
                        </label>
                        <label className="inline-flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded-sm border-gray-200 shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:checked:bg-primary dark:focus:ring-primary"
                            checked={search.discountFilters.nonDiscounted}
                            onChange={() => search.toggleDiscountFilter('nonDiscounted')}
                          />
                          <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Non-Discounted
                          </span>
                        </label>
                      </div>
                    </div>
                    
                    <Button variant="link" onClick={search.clearFilters} className="justify-start">
                      Clear All Filters
                    </Button>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
          
          
          <div className="w-full md:w-3/4 lg:w-4/5">
            {search.loading ? (
              <SearchLoadingState />
            ) : search.error ? (
              <SearchErrorState
                error={search.error}
                onRetry={search.handleRetry}
              />
            ) : search.products.length > 0 ? (
              <SearchResults
                products={search.products}
                isLoading={search.loading}
                error={search.error}
                totalProducts={search.totalProducts}
                isAddingToCart={search.isAddingToCart}
                isAddingToWishlist={search.isAddingToWishlist}
                onAddToCart={search.handleAddToCart}
                onAddToWishlist={search.handleAddToWishlist}
                onShareProduct={search.handleShareProduct}
                onSelectProduct={id => navigate(`/product/${id}`)}
                onRetry={search.handleRetry}
                currentPage={search.page}
                onPageChange={page => {
                  const query = createQueryString('page', page.toString());
                  navigate(`/search?${query}`);
                }}
                itemsPerPage={search.itemsPerPage}
                onItemsPerPageChange={count => {
                  const query = createQueryString('itemsPerPage', count.toString());
                  navigate(`/search?${query}`);
                }}
                viewMode={search.viewMode}
                onViewModeChange={search.handleViewModeChange}
              />
            ) : (
              <SearchEmptyState query={search.query} />
            )}
            
            
            {search.recommendations.length > 0 && search.products.length === 0 && (
              <div className="mt-8">
                <SearchRecommendations
                  recommendedProducts={search.recommendations}
                  isAddingToCart={search.isAddingToCart}
                  isAddingToWishlist={search.isAddingToWishlist}
                  onAddToCart={search.handleAddToCart}
                  onAddToWishlist={search.handleAddToWishlist}
                  onShareProduct={search.handleShareProduct}
                  onSelectProduct={id => navigate(`/product/${id}`)}
                  title="Recommended products"
                />
              </div>
            )}
            
            
            {search.recentlyViewed.length > 0 && (
              <div className="mt-8">
                <SearchRecommendations
                  recommendedProducts={search.recentlyViewed}
                  isAddingToCart={search.isAddingToCart}
                  isAddingToWishlist={search.isAddingToWishlist}
                  onAddToCart={search.handleAddToCart}
                  onAddToWishlist={search.handleAddToWishlist}
                  onShareProduct={search.handleShareProduct}
                  onSelectProduct={id => navigate(`/product/${id}`)}
                  title="Recently viewed"
                  emptyStateMessage="No recently viewed products"
                />
              </div>
            )}
          </div>
        </div>
      </main>
      
      
      {/* Login Dialog */}
      <Dialog open={search.isDialogOpen} onOpenChange={search.setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Authentication required</DialogTitle>
            <DialogDescription>
              Please log in to continue with your action.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button onClick={search.handleLogin}>
              Login
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Share Dialog */}
      <Dialog open={search.isShareDialogOpen} onOpenChange={search.setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share Product</DialogTitle>
            <DialogDescription>
              Share this product with your friends.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input type="text" value={search.shareableLink} readOnly />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Search;

import { Star as StarIcon } from 'lucide-react';

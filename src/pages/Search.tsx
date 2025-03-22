import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSearch } from '@/hooks/use-search';
import SearchFilters from '@/components/search/SearchFilters';
import SearchSort from '@/components/search/SearchSort';
import SearchResults from '@/components/search/SearchResults';
import ShareDialog from '@/components/search/ShareDialog';
import AuthDialog from '@/components/search/AuthDialog';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';
const Search = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';
  const isMobile = useIsMobile();

  // View mode state (grid or list)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const {
    products,
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
    isShareDialogOpen,
    setIsShareDialogOpen,
    shareableLink,
    handleAddToCart,
    handleAddToWishlist,
    handleShareProduct,
    handleCategoryChange,
    handleShopChange,
    handlePriceRangeChange,
    handleRatingChange,
    handleSortChange,
    clearFilters,
    handleLogin,
    fetchData
  } = useSearch(query);
  const handleRetry = () => {
    toast({
      title: "Retrying",
      description: "Attempting to fetch products again..."
    });
    fetchData();
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Handle view mode change
  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  // Paginate products
  const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Render mobile filter buttons
  const renderMobileFilterButtons = () => <div className="flex items-center space-x-2 self-end md:self-auto">
      <Button variant="outline" size="sm" onClick={() => setMobileFiltersOpen(true)}>
        <SlidersHorizontal className="mr-2 h-4 w-4" />
        Filters
      </Button>
      <Button variant="outline" size="sm" onClick={() => setMobileSortOpen(true)}>
        <ArrowUpDown className="mr-2 h-4 w-4" />
        Sort
      </Button>
    </div>;

  // Render desktop filter buttons
  const renderDesktopFilterButtons = () => <div className="flex items-center space-x-2">
      <SearchFilters isMobile={false} categories={categories} shops={shops} selectedCategory={selectedCategory} selectedShop={selectedShop} priceRange={priceRange} rating={rating} mobileFiltersOpen={mobileFiltersOpen} setMobileFiltersOpen={setMobileFiltersOpen} handleCategoryChange={handleCategoryChange} handleShopChange={handleShopChange} handlePriceRangeChange={handlePriceRangeChange} handleRatingChange={handleRatingChange} clearFilters={clearFilters} />
      <SearchSort isMobile={false} sortOption={sortOption} mobileSortOpen={mobileSortOpen} setMobileSortOpen={setMobileSortOpen} handleSortChange={handleSortChange} />
    </div>;
  return <div className="container mx-auto px-4 py-[50px]">
      {/* Search header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Search Results for "{query}"</h1>
          <p className="text-gray-500 text-sm">
            {products.length} {products.length === 1 ? 'result' : 'results'} found
          </p>
        </div>
        
        {isMobile ? renderMobileFilterButtons() : renderDesktopFilterButtons()}
      </div>
      
      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar filters for desktop */}
        {!isMobile && <div className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-lg shadow p-4 sticky top-4">
              <h2 className="font-semibold text-lg mb-4">Filters</h2>
              <SearchFilters isMobile={false} categories={categories} shops={shops} selectedCategory={selectedCategory} selectedShop={selectedShop} priceRange={priceRange} rating={rating} mobileFiltersOpen={mobileFiltersOpen} setMobileFiltersOpen={setMobileFiltersOpen} handleCategoryChange={handleCategoryChange} handleShopChange={handleShopChange} handlePriceRangeChange={handlePriceRangeChange} handleRatingChange={handleRatingChange} clearFilters={clearFilters} expanded={true} />
            </div>
          </div>}
        
        {/* Search results */}
        <div className="flex-1">
          <SearchResults loading={loading} error={error} products={paginatedProducts} isAddingToCart={isAddingToCart} isAddingToWishlist={isAddingToWishlist} handleAddToCart={handleAddToCart} handleAddToWishlist={handleAddToWishlist} handleShareProduct={handleShareProduct} onRetry={handleRetry} totalItems={products.length} currentPage={currentPage} onPageChange={handlePageChange} itemsPerPage={itemsPerPage} onItemsPerPageChange={handleItemsPerPageChange} viewMode={viewMode} onViewModeChange={handleViewModeChange} />
        </div>
      </div>

      {/* Mobile dialogs */}
      <SearchFilters isMobile={true} categories={categories} shops={shops} selectedCategory={selectedCategory} selectedShop={selectedShop} priceRange={priceRange} rating={rating} mobileFiltersOpen={mobileFiltersOpen} setMobileFiltersOpen={setMobileFiltersOpen} handleCategoryChange={handleCategoryChange} handleShopChange={handleShopChange} handlePriceRangeChange={handlePriceRangeChange} handleRatingChange={handleRatingChange} clearFilters={clearFilters} />
      
      <SearchSort isMobile={true} sortOption={sortOption} mobileSortOpen={mobileSortOpen} setMobileSortOpen={setMobileSortOpen} handleSortChange={handleSortChange} />

      <AuthDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} onLogin={handleLogin} />

      <ShareDialog isOpen={isShareDialogOpen} onOpenChange={setIsShareDialogOpen} shareableLink={shareableLink} />
    </div>;
};
export default Search;
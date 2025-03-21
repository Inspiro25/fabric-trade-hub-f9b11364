
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSearch } from '@/hooks/use-search';
import SearchFilters from '@/components/search/SearchFilters';
import SearchSort from '@/components/search/SearchSort';
import SearchResults from '@/components/search/SearchResults';
import ShareDialog from '@/components/search/ShareDialog';
import AuthDialog from '@/components/search/AuthDialog';
import { toast } from '@/hooks/use-toast';

const Search = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';
  const isMobile = useIsMobile();
  
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
      description: "Attempting to fetch products again...",
    });
    fetchData();
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Search Results for "{query}"</h1>
        <div className="flex items-center space-x-2">
          {isMobile ? (
            <>
              <SearchFilters
                isMobile={true}
                categories={categories}
                shops={shops}
                selectedCategory={selectedCategory}
                selectedShop={selectedShop}
                priceRange={priceRange}
                rating={rating}
                mobileFiltersOpen={mobileFiltersOpen}
                setMobileFiltersOpen={setMobileFiltersOpen}
                handleCategoryChange={handleCategoryChange}
                handleShopChange={handleShopChange}
                handlePriceRangeChange={handlePriceRangeChange}
                handleRatingChange={handleRatingChange}
                clearFilters={clearFilters}
              />
              <SearchSort
                isMobile={true}
                sortOption={sortOption}
                mobileSortOpen={mobileSortOpen}
                setMobileSortOpen={setMobileSortOpen}
                handleSortChange={handleSortChange}
              />
            </>
          ) : (
            <>
              <SearchFilters
                isMobile={false}
                categories={categories}
                shops={shops}
                selectedCategory={selectedCategory}
                selectedShop={selectedShop}
                priceRange={priceRange}
                rating={rating}
                mobileFiltersOpen={mobileFiltersOpen}
                setMobileFiltersOpen={setMobileFiltersOpen}
                handleCategoryChange={handleCategoryChange}
                handleShopChange={handleShopChange}
                handlePriceRangeChange={handlePriceRangeChange}
                handleRatingChange={handleRatingChange}
                clearFilters={clearFilters}
              />
              <SearchSort
                isMobile={false}
                sortOption={sortOption}
                mobileSortOpen={mobileSortOpen}
                setMobileSortOpen={setMobileSortOpen}
                handleSortChange={handleSortChange}
              />
            </>
          )}
        </div>
      </div>

      <SearchResults
        loading={loading}
        error={error}
        products={products}
        isAddingToCart={isAddingToCart}
        isAddingToWishlist={isAddingToWishlist}
        handleAddToCart={handleAddToCart}
        handleAddToWishlist={handleAddToWishlist}
        handleShareProduct={handleShareProduct}
        onRetry={handleRetry}
      />

      <AuthDialog 
        isOpen={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        onLogin={handleLogin} 
      />

      <ShareDialog
        isOpen={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        shareableLink={shareableLink}
      />
    </div>
  );
};

export default Search;

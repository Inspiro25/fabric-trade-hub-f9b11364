import React from 'react';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { X, Star } from 'lucide-react';

export interface SearchFiltersProps {
  selectedCategory: string | null;
  categories: any[];
  selectedShop: string | null;
  shops: any[];
  priceRange: [number, number];
  rating: number;
  onCategoryChange?: (category: string) => void;
  onShopChange?: (shop: string) => void;
  onPriceRangeChange?: (range: [number, number]) => void;
  onRatingChange?: (rating: number) => void;
  onClearFilters?: () => void;
  isDarkMode?: boolean;
  // Legacy props for backward compatibility
  handleCategoryChange?: (category: string) => void;
  handleShopChange?: (shop: string) => void;
  handlePriceRangeChange?: (range: [number, number]) => void;
  handleRatingChange?: (rating: number) => void;
  clearFilters?: () => void;
  isMobile?: boolean;
  mobileFiltersOpen?: boolean;
  setMobileFiltersOpen?: (open: boolean) => void;
}

export function SearchFilters({
  selectedCategory,
  categories,
  selectedShop,
  shops,
  priceRange,
  rating,
  onCategoryChange,
  onShopChange,
  onPriceRangeChange,
  onRatingChange,
  onClearFilters,
  isDarkMode,
  handleCategoryChange,
  handleShopChange,
  handlePriceRangeChange,
  handleRatingChange,
  clearFilters,
  isMobile,
  mobileFiltersOpen,
  setMobileFiltersOpen
}: SearchFiltersProps) {
  // Use either new or legacy handlers
  const handleCategory = onCategoryChange || handleCategoryChange || (() => {});
  const handleShop = onShopChange || handleShopChange || (() => {});
  const handlePriceRange = onPriceRangeChange || handlePriceRangeChange || (() => {});
  const handleRating = onRatingChange || handleRatingChange || (() => {});
  const handleClearFilters = onClearFilters || clearFilters || (() => {});

  // Mobile dialog content - same as desktop but in a dialog
  const filtersContent = (
    <div className="space-y-6">
      {/* Price Range Filter */}
      <div>
        <h3 className="font-medium mb-2">Price Range</h3>
        <div className="space-y-4">
          <Slider 
            value={[priceRange[0], priceRange[1]]} 
            min={0} 
            max={1000} 
            step={10} 
            onValueChange={(value) => handlePriceRange([value[0], value[1]])}
          />
          <div className="flex justify-between text-sm">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>
      
      {/* Rating Filter */}
      <div>
        <h3 className="font-medium mb-2">Rating</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((value) => (
            <div 
              key={value}
              className="flex items-center cursor-pointer"
              onClick={() => handleRating(value === rating ? 0 : value)}
            >
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    fill={i < value ? "gold" : "none"} 
                    stroke={i < value ? "gold" : "currentColor"}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm">
                & Up
              </span>
              {rating === value && (
                <Badge variant="outline" className="ml-2">
                  <X className="h-3 w-3" onClick={(e) => { 
                    e.stopPropagation();
                    handleRating(0);
                  }} />
                </Badge>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Categories Filter */}
      {categories && categories.length > 0 && (
        <div>
          <h3 className="font-medium mb-2">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`category-${category.id}`}
                  checked={selectedCategory === category.id}
                  onCheckedChange={() => handleCategory(
                    selectedCategory === category.id ? '' : category.id
                  )}
                />
                <label 
                  htmlFor={`category-${category.id}`}
                  className="text-sm cursor-pointer"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Shops Filter */}
      {shops && shops.length > 0 && (
        <div>
          <h3 className="font-medium mb-2">Shops</h3>
          <div className="space-y-2">
            {shops.map((shop) => (
              <div key={shop.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`shop-${shop.id}`}
                  checked={selectedShop === shop.id}
                  onCheckedChange={() => handleShop(
                    selectedShop === shop.id ? '' : shop.id
                  )}
                />
                <label 
                  htmlFor={`shop-${shop.id}`}
                  className="text-sm cursor-pointer"
                >
                  {shop.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Clear Filters Button */}
      <Button 
        onClick={handleClearFilters}
        variant="outline" 
        className="w-full"
      >
        Clear All Filters
      </Button>
    </div>
  );

  // Render as mobile dialog or desktop filters
  if (isMobile) {
    return (
      <Dialog open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <DialogContent className={cn(
          "sm:max-w-[425px]", 
          isDarkMode ? "bg-gray-900 text-white" : ""
        )}>
          <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
          </DialogHeader>
          
          {filtersContent}
          
          <DialogFooter>
            <Button onClick={() => setMobileFiltersOpen?.(false)}>
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Desktop mode
  return (
    <div className={cn(
      "p-4 border rounded-lg",
      isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
    )}>
      <h2 className="font-bold text-lg mb-4">Filters</h2>
      {filtersContent}
    </div>
  );
}

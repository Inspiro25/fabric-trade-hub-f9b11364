
import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { 
  ChevronDown, 
  ChevronUp, 
  Star, 
  StarHalf, 
  Filter as FilterIcon,
  X
} from 'lucide-react';

export interface SearchFiltersProps {
  className?: string;
  clearFilters: () => void;
  activeFilters?: string[];
  toggleFilter?: (filter: string) => void;
  categories?: Array<{ id: string, name: string, count: number }>;
  brands?: Array<{ id: string, name: string, count: number }>;
  priceRange?: [number, number];
  onPriceChange?: (range: [number, number]) => void;
  onCategoryChange?: (categoryId: string) => void;
  onBrandChange?: (brandId: string) => void;
  onRatingChange?: (rating: number) => void;
  selectedRating?: number;
  darkMode?: boolean;
}

export function SearchFilters({
  className,
  clearFilters,
  activeFilters = [],
  toggleFilter,
  categories = [],
  brands = [],
  priceRange = [0, 1000],
  onPriceChange,
  onCategoryChange,
  onBrandChange,
  onRatingChange,
  selectedRating = 0,
  darkMode = false,
}: SearchFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    brands: true,
    rating: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleFilterToggle = (filter: string) => {
    if (toggleFilter) {
      toggleFilter(filter);
    }
  };

  // Mock data if no real data is provided
  const mockCategories = categories.length ? categories : [
    { id: 'electronics', name: 'Electronics', count: 120 },
    { id: 'clothing', name: 'Clothing', count: 95 },
    { id: 'home', name: 'Home & Kitchen', count: 78 },
    { id: 'beauty', name: 'Beauty & Personal Care', count: 63 },
    { id: 'sports', name: 'Sports & Outdoors', count: 54 },
  ];

  const mockBrands = brands.length ? brands : [
    { id: 'apple', name: 'Apple', count: 42 },
    { id: 'samsung', name: 'Samsung', count: 38 },
    { id: 'nike', name: 'Nike', count: 31 },
    { id: 'adidas', name: 'Adidas', count: 27 },
    { id: 'sony', name: 'Sony', count: 24 },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleRatingClick = (rating: number) => {
    if (onRatingChange) {
      onRatingChange(rating === selectedRating ? 0 : rating);
    }
  };

  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={cn(
              "mr-0.5",
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            )}
          />
        ))}
        <span className="ml-1 text-sm">{rating === 1 ? '& Up' : '& Up'}</span>
      </div>
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className={cn(
          "font-medium text-sm",
          darkMode ? "text-white" : "text-gray-900"
        )}>
          Filters
        </h3>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 text-xs"
          onClick={clearFilters}
        >
          Clear All
        </Button>
      </div>

      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <div 
              key={filter}
              className={cn(
                "flex items-center px-2 py-1 rounded-full text-xs",
                darkMode 
                  ? "bg-gray-700 text-gray-200" 
                  : "bg-gray-100 text-gray-800"
              )}
            >
              <span>{filter}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 p-0"
                onClick={() => handleFilterToggle(filter)}
              >
                <X size={12} className="text-gray-500" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Categories Section */}
      <div>
        <div 
          className="flex items-center justify-between mb-2 cursor-pointer"
          onClick={() => toggleSection('categories')}
        >
          <h4 className={cn(
            "text-sm font-medium",
            darkMode ? "text-white" : "text-gray-900"
          )}>
            Categories
          </h4>
          <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
            {expandedSections.categories ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </Button>
        </div>

        {expandedSections.categories && (
          <div className="space-y-1">
            {mockCategories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`category-${category.id}`} 
                  checked={activeFilters.includes(`category:${category.id}`)}
                  onCheckedChange={() => handleFilterToggle(`category:${category.id}`)}
                />
                <Label 
                  htmlFor={`category-${category.id}`}
                  className={cn(
                    "text-sm cursor-pointer flex-1",
                    darkMode ? "text-gray-300" : "text-gray-700"
                  )}
                >
                  {category.name}
                </Label>
                <span className={cn(
                  "text-xs",
                  darkMode ? "text-gray-400" : "text-gray-500"
                )}>
                  ({category.count})
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Section */}
      <div>
        <div 
          className="flex items-center justify-between mb-2 cursor-pointer"
          onClick={() => toggleSection('price')}
        >
          <h4 className={cn(
            "text-sm font-medium",
            darkMode ? "text-white" : "text-gray-900"
          )}>
            Price Range
          </h4>
          <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
            {expandedSections.price ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </Button>
        </div>

        {expandedSections.price && (
          <div className="pt-2 px-1">
            <div className="mb-4">
              <Slider
                defaultValue={priceRange}
                min={0}
                max={1000}
                step={10}
                onValueChange={(value) => {
                  if (onPriceChange && Array.isArray(value) && value.length === 2) {
                    onPriceChange(value as [number, number]);
                  }
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className={cn(
                "text-xs",
                darkMode ? "text-gray-300" : "text-gray-700"
              )}>
                {formatPrice(priceRange[0])}
              </span>
              <span className={cn(
                "text-xs",
                darkMode ? "text-gray-300" : "text-gray-700"
              )}>
                {formatPrice(priceRange[1])}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Brands Section */}
      <div>
        <div 
          className="flex items-center justify-between mb-2 cursor-pointer"
          onClick={() => toggleSection('brands')}
        >
          <h4 className={cn(
            "text-sm font-medium",
            darkMode ? "text-white" : "text-gray-900"
          )}>
            Brands
          </h4>
          <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
            {expandedSections.brands ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </Button>
        </div>

        {expandedSections.brands && (
          <div className="space-y-1">
            {mockBrands.map((brand) => (
              <div key={brand.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`brand-${brand.id}`} 
                  checked={activeFilters.includes(`brand:${brand.id}`)}
                  onCheckedChange={() => handleFilterToggle(`brand:${brand.id}`)}
                />
                <Label 
                  htmlFor={`brand-${brand.id}`}
                  className={cn(
                    "text-sm cursor-pointer flex-1",
                    darkMode ? "text-gray-300" : "text-gray-700"
                  )}
                >
                  {brand.name}
                </Label>
                <span className={cn(
                  "text-xs",
                  darkMode ? "text-gray-400" : "text-gray-500"
                )}>
                  ({brand.count})
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ratings Section */}
      <div>
        <div 
          className="flex items-center justify-between mb-2 cursor-pointer"
          onClick={() => toggleSection('rating')}
        >
          <h4 className={cn(
            "text-sm font-medium",
            darkMode ? "text-white" : "text-gray-900"
          )}>
            Ratings
          </h4>
          <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
            {expandedSections.rating ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </Button>
        </div>

        {expandedSections.rating && (
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                className={cn(
                  "flex items-center w-full py-1 px-1.5 rounded",
                  rating === selectedRating 
                    ? darkMode 
                      ? "bg-gray-700" 
                      : "bg-gray-100" 
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                )}
                onClick={() => handleRatingClick(rating)}
              >
                {renderRatingStars(rating)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

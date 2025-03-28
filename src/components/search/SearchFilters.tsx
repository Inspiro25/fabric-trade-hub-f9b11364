
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Category } from '@/hooks/search/types';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export interface SearchFiltersProps {
  categories: Category[];
  activeCategories: string[];
  setActiveCategories: React.Dispatch<React.SetStateAction<string[]>>;
  priceRange: [number, number];
  setPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  applyFilters: () => void;
  clearFilters: () => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  categories,
  activeCategories,
  setActiveCategories,
  priceRange,
  setPriceRange,
  applyFilters,
  clearFilters,
}) => {
  const { isDarkMode } = useTheme();

  const handleCategoryChange = (categoryId: string) => {
    if (activeCategories.includes(categoryId)) {
      setActiveCategories(activeCategories.filter((id) => id !== categoryId));
    } else {
      setActiveCategories([...activeCategories, categoryId]);
    }
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  return (
    <div className={cn(
      "space-y-6 sticky top-4",
      isDarkMode && "text-gray-100"
    )}>
      <div>
        <h3 className={cn(
          "text-lg font-semibold mb-3",
          isDarkMode && "text-gray-100"
        )}>Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={activeCategories.includes(category.id)}
                onCheckedChange={() => handleCategoryChange(category.id)}
                className={isDarkMode ? "border-gray-600" : ""}
              />
              <label
                htmlFor={`category-${category.id}`}
                className={cn(
                  "text-sm cursor-pointer",
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                )}
              >
                {category.name}
                {category.product_count !== undefined && (
                  <span className={cn(
                    "ml-1",
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  )}>({category.product_count})</span>
                )}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className={cn(
          "text-lg font-semibold mb-3",
          isDarkMode && "text-gray-100"
        )}>Price Range</h3>
        <div className="px-2">
          <Slider
            defaultValue={[priceRange[0], priceRange[1]]}
            max={1000}
            step={10}
            value={[priceRange[0], priceRange[1]]}
            onValueChange={handlePriceChange}
            className={isDarkMode ? "data-[disabled]:bg-gray-700" : ""}
          />
          <div className={cn(
            "flex justify-between mt-2 text-sm",
            isDarkMode ? "text-gray-300" : "text-gray-700"
          )}>
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-2 pt-4">
        <Button 
          onClick={applyFilters} 
          className={cn(
            "w-full",
            isDarkMode && "bg-orange-600 hover:bg-orange-700 text-white"
          )}
        >
          Apply Filters
        </Button>
        <Button 
          variant={isDarkMode ? "outline" : "outline"} 
          onClick={clearFilters} 
          className={cn(
            "w-full",
            isDarkMode && "border-gray-600 text-gray-300 hover:bg-gray-800"
          )}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

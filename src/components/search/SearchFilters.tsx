
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Category } from '@/hooks/search/types';

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
    <div className="space-y-6 sticky top-4">
      <div>
        <h3 className="text-lg font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={activeCategories.includes(category.id)}
                onCheckedChange={() => handleCategoryChange(category.id)}
              />
              <label
                htmlFor={`category-${category.id}`}
                className="text-sm cursor-pointer"
              >
                {category.name}
                {category.product_count && (
                  <span className="text-gray-500 ml-1">({category.product_count})</span>
                )}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Price Range</h3>
        <div className="px-2">
          <Slider
            defaultValue={[priceRange[0], priceRange[1]]}
            max={1000}
            step={10}
            value={[priceRange[0], priceRange[1]]}
            onValueChange={handlePriceChange}
          />
          <div className="flex justify-between mt-2 text-sm">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-2 pt-4">
        <Button onClick={applyFilters} className="w-full">
          Apply Filters
        </Button>
        <Button variant="outline" onClick={clearFilters} className="w-full">
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

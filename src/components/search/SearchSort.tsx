
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { SortOption } from '@/lib/types/search';

const sortOptions: SortOption[] = [
  { id: 'featured', name: 'Featured', value: 'featured' },
  { id: 'newest', name: 'Newest', value: 'newest' },
  { id: 'price-low', name: 'Price: Low to High', value: 'price-low' },
  { id: 'price-high', name: 'Price: High to Low', value: 'price-high' },
  { id: 'rating', name: 'Highest Rated', value: 'rating' },
];

interface SearchSortProps {
  activeSortOption: string;
  onSortChange: (option: string) => void;
}

const SearchSort: React.FC<SearchSortProps> = ({ activeSortOption, onSortChange }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className="flex items-center">
      <Select value={activeSortOption} onValueChange={onSortChange}>
        <SelectTrigger className={cn(
          "h-8 pl-2 pr-1 py-1 gap-1",
          isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white"
        )}>
          <SlidersHorizontal className="h-3.5 w-3.5 mr-1" />
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
          {sortOptions.map((option) => (
            <SelectItem key={option.id} value={option.value}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SearchSort;

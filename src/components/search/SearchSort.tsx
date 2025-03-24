
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

interface SearchSortProps {
  activeSortOption: string;
  onSortChange: (option: string) => void;
}

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Rating' },
];

const SearchSort: React.FC<SearchSortProps> = ({ activeSortOption, onSortChange }) => {
  const { isDarkMode } = useTheme();
  
  // Get the label of the active sort option
  const activeSortLabel = SORT_OPTIONS.find(option => option.value === activeSortOption)?.label || 'Sort';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={cn(
            "h-8",
            isDarkMode ? "border-gray-700 bg-gray-800" : ""
          )}
        >
          <span className="mr-1 text-xs">{activeSortLabel}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end"
        className={cn(
          isDarkMode ? "bg-gray-800 border-gray-700" : ""
        )}
      >
        {SORT_OPTIONS.map(option => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onSortChange(option.value)}
            className={cn(
              "flex items-center justify-between",
              isDarkMode ? "focus:bg-gray-700" : ""
            )}
          >
            <span>{option.label}</span>
            {activeSortOption === option.value && (
              <Check className="h-4 w-4 ml-2" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SearchSort;

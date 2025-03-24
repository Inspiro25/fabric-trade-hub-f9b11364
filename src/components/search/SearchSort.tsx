
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export interface SortOption {
  label: string;
  value: string;
}

interface SearchSortProps {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const SearchSort: React.FC<SearchSortProps> = ({ 
  options, 
  value, 
  onChange, 
  className = '' 
}) => {
  return (
    <div className={`${className}`}>
      <div className="flex items-center gap-2">
        <Label htmlFor="sort-select" className="whitespace-nowrap text-sm">
          Sort by:
        </Label>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger id="sort-select" className="h-8 w-[180px]">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SearchSort;


import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface SearchViewToggleProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const SearchViewToggle: React.FC<SearchViewToggleProps> = ({
  viewMode,
  onViewModeChange
}) => {
  const { isDarkMode } = useTheme();
  
  return (
    <ToggleGroup 
      type="single" 
      value={viewMode} 
      onValueChange={(value) => value && onViewModeChange(value as 'grid' | 'list')}
      className={cn(
        "border",
        isDarkMode ? "border-gray-700" : "border-gray-200"
      )}
    >
      <ToggleGroupItem 
        value="grid" 
        className={cn(
          "h-8 w-8 p-0 border-r",
          isDarkMode 
            ? "border-gray-700 data-[state=on]:bg-orange-900/50 data-[state=on]:text-orange-300" 
            : "border-gray-200 data-[state=on]:bg-orange-100 data-[state=on]:text-kutuku-primary"
        )}
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="sr-only">Grid View</span>
      </ToggleGroupItem>
      <ToggleGroupItem 
        value="list" 
        className={cn(
          "h-8 w-8 p-0",
          isDarkMode 
            ? "data-[state=on]:bg-orange-900/50 data-[state=on]:text-orange-300" 
            : "data-[state=on]:bg-orange-100 data-[state=on]:text-kutuku-primary"
        )}
      >
        <List className="h-4 w-4" />
        <span className="sr-only">List View</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default SearchViewToggle;

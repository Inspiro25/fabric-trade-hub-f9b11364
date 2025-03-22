
import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useTheme } from '@/contexts/ThemeContext';

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
    <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && onViewModeChange(value as 'grid' | 'list')}>
      <ToggleGroupItem 
        value="grid" 
        className={`h-8 w-8 p-0 border-r ${
          isDarkMode 
            ? 'data-[state=on]:bg-orange-900/50 data-[state=on]:text-orange-300' 
            : 'data-[state=on]:bg-orange-100 data-[state=on]:text-kutuku-primary'
        }`}
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="sr-only">Grid View</span>
      </ToggleGroupItem>
      <ToggleGroupItem 
        value="list" 
        className={`h-8 w-8 p-0 ${
          isDarkMode 
            ? 'data-[state=on]:bg-orange-900/50 data-[state=on]:text-orange-300' 
            : 'data-[state=on]:bg-orange-100 data-[state=on]:text-kutuku-primary'
        }`}
      >
        <List className="h-4 w-4" />
        <span className="sr-only">List View</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default SearchViewToggle;

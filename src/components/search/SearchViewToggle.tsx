
import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface SearchViewToggleProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const SearchViewToggle: React.FC<SearchViewToggleProps> = ({
  viewMode,
  onViewModeChange
}) => {
  return (
    <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && onViewModeChange(value as 'grid' | 'list')}>
      <ToggleGroupItem value="grid" className="h-8 w-8 p-0 data-[state=on]:bg-[#E5DEFF] data-[state=on]:text-[#9b87f5] border-r">
        <LayoutGrid className="h-4 w-4" />
        <span className="sr-only">Grid View</span>
      </ToggleGroupItem>
      <ToggleGroupItem value="list" className="h-8 w-8 p-0 data-[state=on]:bg-[#E5DEFF] data-[state=on]:text-[#9b87f5]">
        <List className="h-4 w-4" />
        <span className="sr-only">List View</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default SearchViewToggle;

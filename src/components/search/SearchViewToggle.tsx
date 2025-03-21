
import React from 'react';
import { Grid, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchViewToggleProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const SearchViewToggle: React.FC<SearchViewToggleProps> = ({
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="flex items-center space-x-1 border rounded-md">
      <Button
        variant={viewMode === 'grid' ? 'default' : 'ghost'}
        size="icon"
        className="h-8 w-8 rounded-none rounded-l-md"
        onClick={() => onViewModeChange('grid')}
      >
        <Grid className="h-4 w-4" />
        <span className="sr-only">Grid view</span>
      </Button>
      <Button
        variant={viewMode === 'list' ? 'default' : 'ghost'}
        size="icon"
        className="h-8 w-8 rounded-none rounded-r-md"
        onClick={() => onViewModeChange('list')}
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="sr-only">List view</span>
      </Button>
    </div>
  );
};

export default SearchViewToggle;

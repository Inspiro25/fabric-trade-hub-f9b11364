
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SearchViewToggle from './SearchViewToggle';
import { SlidersHorizontal, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SearchHeaderProps {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onItemsPerPageChange: (items: number) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  currentPage,
  itemsPerPage,
  totalItems,
  onItemsPerPageChange,
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-lg shadow-sm mb-4 gap-3 border-b">
      <div className="text-sm text-gray-600 flex items-center">
        <Badge variant="outline" className="mr-2 bg-[#E5DEFF] text-[#9b87f5] border-[#9b87f5]">
          <CheckCircle className="h-3 w-3 mr-1" />
          {totalItems} items
        </Badge>
        Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-gray-500" />
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => onItemsPerPageChange(Number(value))}
          >
            <SelectTrigger className="w-[120px] h-8 text-xs border-gray-200">
              <SelectValue placeholder="20 per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <SearchViewToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
      </div>
    </div>
  );
};

export default SearchHeader;

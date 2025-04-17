
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SearchViewToggle from './SearchViewToggle';
import { SlidersHorizontal, CheckCircle, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

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
  const isMobile = useIsMobile();
  const { isDarkMode } = useTheme();
  
  return (
    <div className={cn(
      "flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg shadow-sm mb-3 gap-2 border-b",
      isDarkMode 
        ? "bg-gray-800/90 backdrop-blur-sm border-gray-700" 
        : "bg-white border-orange-100"
    )}>
      <div className={cn(
        "text-sm flex flex-wrap items-center",
        isDarkMode ? "text-gray-300" : "text-gray-600"
      )}>
        <Badge variant="outline" className={cn(
          "mr-2",
          isDarkMode 
            ? "bg-orange-900/50 text-orange-300 border-orange-700" 
            : "bg-orange-50 text-vyoma-primary border-orange-200"
        )}>
          <CheckCircle className="h-3 w-3 mr-1" />
          <span className="flex items-center">
            {totalItems} items
            <Sparkles className="h-2 w-2 ml-1 text-amber-500" />
          </span>
        </Badge>
        <span className={cn(
          "text-xs",
          isDarkMode ? "text-gray-400" : ""
        )}>
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
        </span>
      </div>
      
      <div className="flex items-center gap-3 mt-1 sm:mt-0">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className={cn(
            "h-4 w-4",
            isDarkMode ? "text-orange-300" : "text-vyoma-primary"
          )} />
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => onItemsPerPageChange(Number(value))}
          >
            <SelectTrigger className={cn(
              `${isMobile ? 'w-[90px] h-8 text-xs' : 'w-[120px] text-sm'}`,
              isDarkMode 
                ? "border-gray-700 bg-gray-800 text-gray-200 focus:ring-orange-500" 
                : "border-gray-200 focus:ring-vyoma-primary"
            )}>
              <SelectValue placeholder="20 per page" />
            </SelectTrigger>
            <SelectContent className={isDarkMode ? "bg-gray-800 border-gray-700 text-gray-200" : ""}>
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

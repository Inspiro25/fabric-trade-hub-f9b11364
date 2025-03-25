
import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  showFirstLastButtons?: boolean;
  maxVisiblePages?: number;
}

export const PaginationComponent: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  showFirstLastButtons = false,
  maxVisiblePages = 5,
}) => {
  const { isDarkMode } = useTheme();
  const totalPages = Math.ceil(totalItems / pageSize);
  
  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null;
  
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Calculate the range of pages to display
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    
    if (totalPages <= maxVisiblePages) {
      // If we have fewer pages than our max, show all of them
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate the start and end of the visible range
      let start = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
      let end = Math.min(totalPages - 1, start + maxVisiblePages - 3);
      
      // Adjust start if end is at its maximum
      if (end === totalPages - 1) {
        start = Math.max(2, end - (maxVisiblePages - 3));
      }
      
      // Add ellipsis if needed at the beginning
      if (start > 2) {
        pages.push('ellipsis');
      }
      
      // Add the visible range
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed at the end
      if (end < totalPages - 1) {
        pages.push('ellipsis');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <nav className="flex justify-center items-center space-x-1">
      {/* Previous button */}
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className={cn(
          "h-8 w-8",
          isDarkMode ? "border-gray-700 text-gray-300" : ""
        )}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous Page</span>
      </Button>
      
      {/* Page numbers */}
      {getPageNumbers().map((page, index) => {
        if (page === 'ellipsis') {
          return (
            <span 
              key={`ellipsis-${index}`}
              className={cn(
                "flex items-center justify-center h-8 w-8",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}
            >
              <MoreHorizontal className="h-4 w-4" />
            </span>
          );
        }
        
        return (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="icon"
            onClick={() => handlePageChange(page)}
            className={cn(
              "h-8 w-8",
              currentPage === page 
                ? (isDarkMode ? "bg-orange-600 text-white hover:bg-orange-700" : "") 
                : (isDarkMode ? "border-gray-700 text-gray-300" : "")
            )}
          >
            {page}
          </Button>
        );
      })}
      
      {/* Next button */}
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className={cn(
          "h-8 w-8",
          isDarkMode ? "border-gray-700 text-gray-300" : ""
        )}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next Page</span>
      </Button>
    </nav>
  );
};

// For backward compatibility
export const Pagination = PaginationComponent;

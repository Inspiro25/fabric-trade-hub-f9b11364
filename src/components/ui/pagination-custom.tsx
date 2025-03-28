
import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

export interface PaginationComponentProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export function PaginationComponent({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  siblingCount = 1,
}: PaginationComponentProps) {
  // Ensure all values are valid to prevent undefined errors
  const safeCurrentPage = Math.max(1, currentPage || 1);
  const safeTotalItems = Math.max(0, totalItems || 0);
  const safePageSize = Math.max(1, pageSize || 10);
  const totalPages = Math.ceil(safeTotalItems / safePageSize);
  const { isDarkMode } = useTheme();
  
  // Safety check - if we don't have any items, don't render pagination
  if (safeTotalItems <= 0 || totalPages <= 1) {
    return null;
  }
  
  // Generate page numbers
  const generatePagination = () => {
    // If total pages is 7 or less, show all pages
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Calculate range based on current page and siblings
    const leftSiblingIndex = Math.max(safeCurrentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(safeCurrentPage + siblingCount, totalPages);
    
    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;
    
    if (showLeftDots && showRightDots) {
      // Show first, last, current, and siblings
      return [
        1,
        'leftEllipsis',
        ...Array.from(
          { length: rightSiblingIndex - leftSiblingIndex + 1 },
          (_, i) => leftSiblingIndex + i
        ),
        'rightEllipsis',
        totalPages,
      ];
    }
    
    if (!showLeftDots && showRightDots) {
      // Show first pages and ellipsis
      return [
        ...Array.from({ length: rightSiblingIndex + 1 }, (_, i) => i + 1),
        'rightEllipsis',
        totalPages,
      ];
    }
    
    if (showLeftDots && !showRightDots) {
      // Show ellipsis and last pages
      return [
        1,
        'leftEllipsis',
        ...Array.from(
          { length: totalPages - leftSiblingIndex + 1 },
          (_, i) => leftSiblingIndex + i
        ),
      ];
    }
    
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  };

  const pageNumbers = generatePagination();

  return (
    <nav className="flex justify-center items-center space-x-1">
      {safeCurrentPage > 1 && (
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "h-8 w-8",
            isDarkMode ? "border-gray-700 text-gray-300" : ""
          )}
          onClick={() => onPageChange(1)}
          aria-label="Go to first page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
      )}
      
      {safeCurrentPage > 1 && (
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "h-8 w-8",
            isDarkMode ? "border-gray-700 text-gray-300" : ""
          )}
          onClick={() => onPageChange(safeCurrentPage - 1)}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      {pageNumbers.map((page, i) => {
        if (page === 'leftEllipsis' || page === 'rightEllipsis') {
          return (
            <span 
              key={`ellipsis-${i}`}
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
            variant={safeCurrentPage === page ? "default" : "outline"}
            size="icon"
            className={cn(
              "h-8 w-8",
              safeCurrentPage === page 
                ? (isDarkMode ? "bg-orange-600 text-white hover:bg-orange-700" : "") 
                : (isDarkMode ? "border-gray-700 text-gray-300" : "")
            )}
            onClick={() => onPageChange(page as number)}
            aria-label={`Go to page ${page}`}
            aria-current={safeCurrentPage === page ? "page" : undefined}
          >
            {page}
          </Button>
        );
      })}
      
      {safeCurrentPage < totalPages && (
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "h-8 w-8",
            isDarkMode ? "border-gray-700 text-gray-300" : ""
          )}
          onClick={() => onPageChange(safeCurrentPage + 1)}
          aria-label="Go to next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
      
      {safeCurrentPage < totalPages && (
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "h-8 w-8",
            isDarkMode ? "border-gray-700 text-gray-300" : ""
          )}
          onClick={() => onPageChange(totalPages)}
          aria-label="Go to last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      )}
    </nav>
  );
}

// Export needed components for other pagination-related imports
export const Pagination: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex justify-center">{children}</div>
);

export const PaginationContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-1">{children}</div>
);

export const PaginationItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div>{children}</div>
);

export const PaginationLink: React.FC<{ 
  children: React.ReactNode; 
  isActive?: boolean; 
  onClick?: () => void;
}> = ({ children, isActive, onClick }) => (
  <Button
    variant={isActive ? "default" : "outline"}
    size="icon"
    className={isActive ? "font-bold" : ""}
    onClick={onClick}
  >
    {children}
  </Button>
);

export const PaginationNext: React.FC<{ 
  onClick?: () => void; 
  className?: string;
}> = ({ onClick, className }) => (
  <Button 
    variant="outline"
    size="icon"
    className={className}
    onClick={onClick}
  >
    <ChevronRight className="h-4 w-4" />
    <span className="sr-only">Next</span>
  </Button>
);

export const PaginationPrevious: React.FC<{ 
  onClick?: () => void; 
  className?: string;
}> = ({ onClick, className }) => (
  <Button 
    variant="outline"
    size="icon"
    className={className}
    onClick={onClick}
  >
    <ChevronLeft className="h-4 w-4" />
    <span className="sr-only">Previous</span>
  </Button>
);

export const PaginationFirst: React.FC<{ 
  onClick?: () => void; 
  className?: string;
}> = ({ onClick, className }) => (
  <Button 
    variant="outline"
    size="icon"
    className={className}
    onClick={onClick}
  >
    <ChevronsLeft className="h-4 w-4" />
    <span className="sr-only">First</span>
  </Button>
);

export const PaginationLast: React.FC<{ 
  onClick?: () => void; 
  className?: string;
}> = ({ onClick, className }) => (
  <Button 
    variant="outline"
    size="icon"
    className={className}
    onClick={onClick}
  >
    <ChevronsRight className="h-4 w-4" />
    <span className="sr-only">Last</span>
  </Button>
);

export const PaginationEllipsis: React.FC = () => (
  <div className="flex h-9 w-9 items-center justify-center">
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </div>
);

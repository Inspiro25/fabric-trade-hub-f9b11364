
import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
} from './pagination';

interface PaginationComponentProps {
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
  const totalPages = Math.ceil(totalItems / pageSize);
  
  // Generate page numbers
  const generatePagination = () => {
    // If total pages is 7 or less, show all pages
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Calculate range based on current page and siblings
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
    
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
    <Pagination>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationFirst
              aria-label="Go to first page"
              onClick={() => onPageChange(1)}
              role="button"
            />
          </PaginationItem>
        )}
        
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious
              aria-label="Go to previous page"
              onClick={() => onPageChange(currentPage - 1)}
              role="button"
            />
          </PaginationItem>
        )}

        {pageNumbers.map((page, i) => {
          if (page === 'leftEllipsis' || page === 'rightEllipsis') {
            return (
              <PaginationItem key={`ellipsis-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => onPageChange(page as number)}
                role="button"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext
              aria-label="Go to next page"
              onClick={() => onPageChange(currentPage + 1)}
              role="button"
            />
          </PaginationItem>
        )}
        
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationLast
              aria-label="Go to last page"
              onClick={() => onPageChange(totalPages)}
              role="button"
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}

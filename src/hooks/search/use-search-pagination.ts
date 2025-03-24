
import { useState } from 'react';

export interface UseSearchPaginationResult {
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
}

export function useSearchPagination(initialPage = 1, initialItemsPerPage = 12): UseSearchPaginationResult {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  return {
    currentPage,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage
  };
}

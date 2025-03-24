
import { useState } from 'react';
import { SortOption } from '@/lib/types/search';

export function useSearchFilters() {
  const [filters, setFilters] = useState<string[]>([]);

  const clearFilters = () => {
    setFilters([]);
  };

  const addFilter = (filter: string) => {
    if (!filters.includes(filter)) {
      setFilters([...filters, filter]);
    }
  };

  const removeFilter = (filter: string) => {
    setFilters(filters.filter(f => f !== filter));
  };

  return {
    filters,
    setFilters,
    addFilter,
    removeFilter,
    clearFilters
  };
}

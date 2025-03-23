import { useCallback } from 'react';
import { useSearchParams as useReactRouterSearchParams, useNavigate } from 'react-router-dom';

export const useSearchUrlParams = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useReactRouterSearchParams();
  
  // Get common search parameters
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const itemsPerPage = parseInt(searchParams.get('items') || '20', 10);
  const sort = searchParams.get('sort') || '';
  const viewModeParam = searchParams.get('view');

  // Create a query string helper
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  // Navigate to search with parameters
  const navigateToSearch = useCallback(
    (params: Record<string, string>) => {
      const urlParams = new URLSearchParams();
      
      // Add all params to URL
      Object.entries(params).forEach(([key, value]) => {
        if (value) urlParams.set(key, value);
      });
      
      navigate(`/search?${urlParams.toString()}`);
    },
    [navigate]
  );

  return {
    // Search parameters
    query,
    category,
    page,
    itemsPerPage,
    sort,
    viewModeParam,
    
    // Helper methods
    createQueryString,
    navigateToSearch,
    
    // Raw access to React Router's search params
    searchParams,
    setSearchParams,
    navigate
  };
};

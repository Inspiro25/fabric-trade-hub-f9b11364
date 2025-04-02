
import { useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export function useSearchUrlParams() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get('q') || '';
  const category = searchParams.get('category');
  const shop = searchParams.get('shop');
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const minRating = searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined;
  const sort = searchParams.get('sort') || 'relevance';
  const page = Number(searchParams.get('page')) || 1;
  const itemsPerPage = Number(searchParams.get('limit')) || 12;
  const viewModeParam = searchParams.get('view') || 'grid';

  const createQueryString = useCallback((params: Record<string, string | number | null>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    
    // Update or remove params based on value
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, String(value));
      }
    });
    
    return newSearchParams.toString();
  }, [searchParams]);

  return {
    query,
    category,
    shop,
    minPrice,
    maxPrice,
    minRating,
    sort,
    page,
    itemsPerPage,
    viewModeParam,
    createQueryString,
    navigate
  };
}

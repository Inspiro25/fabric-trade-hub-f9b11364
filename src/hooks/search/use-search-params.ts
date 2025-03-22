
import { useState, useCallback } from 'react';
import { useSearchParams as useReactRouterSearchParams, useNavigate } from 'react-router-dom';

export const useSearchUrlParams = () => {
  const navigate = useNavigate();
  const [searchParams] = useReactRouterSearchParams();
  
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const itemsPerPage = parseInt(searchParams.get('items') || '20', 10);
  const sort = searchParams.get('sort') || '';
  const viewModeParam = searchParams.get('view');

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  return {
    query,
    category,
    page,
    itemsPerPage,
    sort,
    viewModeParam,
    createQueryString,
    navigate
  };
};

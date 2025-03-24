
import { useState, useEffect } from 'react';
import { SearchPageProduct, Shop } from './types';
import { mockProducts } from '@/lib/products/mockData';

export interface UseSearchMockDataResult {
  searchResults: SearchPageProduct[];
  isLoading: boolean;
  error: string | null;
  totalResults: number;
}

// Helper function to convert Product to SearchPageProduct
const convertToSearchPageProduct = (product: any): SearchPageProduct => {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    sale_price: product.sale_price || product.salePrice,
    images: product.images || [],
    description: product.description || '',
    category_id: product.category_id || product.category,
    colors: product.colors || [],
    sizes: product.sizes || [],
    rating: product.rating || 0,
    review_count: product.review_count || product.reviewCount || 0,
    stock: product.stock || 0,
    shop_id: product.shop_id || product.shopId || '',
    is_new: product.is_new || product.isNew || false,
    is_trending: product.is_trending || product.isTrending || false,
    tags: product.tags || []
  };
};

export const useSearchMockData = (
  query: string,
  page: number = 1,
  limit: number = 10,
  filters?: string[] | number
): UseSearchMockDataResult => {
  const [searchResults, setSearchResults] = useState<SearchPageProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState<number>(0);

  useEffect(() => {
    const fetchMockResults = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        if (!query.trim()) {
          setSearchResults([]);
          setTotalResults(0);
          return;
        }

        // Filter mock products based on search query
        let filtered = mockProducts.filter(product =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );

        // Apply category filters if provided
        if (filters && Array.isArray(filters) && filters.length > 0) {
          filtered = filtered.filter(product => {
            // Check each filter
            for (const filter of filters) {
              if (filter.startsWith('category:')) {
                const category = filter.split(':')[1];
                if (product.category !== category && product.category_id !== category) {
                  return false;
                }
              } else if (filter.startsWith('price:')) {
                const [min, max] = filter.split(':')[1].split('-').map(Number);
                if (product.price < min || product.price > max) {
                  return false;
                }
              }
            }
            return true;
          });
        }

        setTotalResults(filtered.length);

        // Apply pagination
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginatedResults = filtered.slice(start, end);

        // Convert to SearchPageProduct type
        const convertedResults = paginatedResults.map(convertToSearchPageProduct);

        setSearchResults(convertedResults);
      } catch (err) {
        console.error('Error in mock search:', err);
        setError('An error occurred while searching');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMockResults();
  }, [query, page, limit, filters]);

  return { searchResults, isLoading, error, totalResults };
};

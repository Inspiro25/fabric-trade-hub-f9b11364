import { useQuery } from '@tanstack/react-query';
import { Product, fetchProducts, getAllCategories } from '@/lib/products';
import { useState, useMemo } from 'react';

type SortOption = 'relevance' | 'price-low' | 'price-high' | 'rating' | 'newest';

interface SearchFilters {
  category: string;
  priceRange: string;
  sort: SortOption;
  inStock: boolean;
  onSale: boolean;
}

export function useShopSearch(searchQuery: string, initialFilters: Partial<SearchFilters> = {}) {
  // State for filters
  const [filters, setFilters] = useState<SearchFilters>({
    category: initialFilters.category || 'all',
    priceRange: initialFilters.priceRange || 'all',
    sort: initialFilters.sort || 'relevance',
    inStock: initialFilters.inStock || false,
    onSale: initialFilters.onSale || false
  });

  // Fetch products
  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch categories
  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Apply filters to products
  const filteredProducts = useMemo(() => {
    if (!productsQuery.data || productsQuery.isLoading) return [];
    
    let filtered = [...productsQuery.data];
    
    // Search query filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(lowerQuery) || 
        product.description.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
      );
    }
    
    // Category filter
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === filters.category.toLowerCase()
      );
    }
    
    // Price range filter
    if (filters.priceRange && filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(product => {
        const price = product.salePrice || product.price;
        if (!max) {
          return price >= min;
        }
        return price >= min && price <= max;
      });
    }
    
    // In stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => product.stock > 0);
    }
    
    // On sale filter
    if (filters.onSale) {
      filtered = filtered.filter(product => !!product.salePrice);
    }
    
    // Sort results
    switch(filters.sort) {
      case 'price-low':
        filtered.sort((a, b) => {
          const priceA = a.salePrice || a.price;
          const priceB = b.salePrice || b.price;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const priceA = a.salePrice || a.price;
          const priceB = b.salePrice || b.price;
          return priceB - priceA;
        });
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => {
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return 0;
        });
        break;
      default: // relevance
        // Keep original order for relevance
        break;
    }
    
    return filtered;
  }, [productsQuery.data, searchQuery, filters]);

  return {
    products: filteredProducts,
    categories: categoriesQuery.data || [],
    isLoading: productsQuery.isLoading || categoriesQuery.isLoading,
    error: productsQuery.error || categoriesQuery.error,
    filters,
    setFilters,
    clearFilters: () => setFilters({
      category: 'all',
      priceRange: 'all',
      sort: 'relevance',
      inStock: false,
      onSale: false
    })
  };
}


import { useState, useEffect, useCallback } from 'react';
import { Shop, fetchShops } from '@/lib/shops';
import { shops as mockShops } from '@/lib/shops/mockData';

export function useShopSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load shops on component mount
  useEffect(() => {
    const loadShops = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const shopsData = await fetchShops();
        setShops(shopsData);
      } catch (error) {
        console.error("Failed to fetch shops:", error);
        setError("Failed to load shops. Using mock data instead.");
        setShops(mockShops); // Fallback to mock data
      } finally {
        setIsLoading(false);
      }
    };
    
    loadShops();
  }, []);

  // Memoized search filter function
  const getFilteredShops = useCallback(() => {
    if (!searchTerm.trim()) {
      return shops;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    return shops.filter(shop => 
      shop.name.toLowerCase().includes(searchLower) || 
      shop.description.toLowerCase().includes(searchLower) || 
      shop.address.toLowerCase().includes(searchLower)
    );
  }, [searchTerm, shops]);

  // Get filtered shops
  const filteredShops = getFilteredShops();

  // Clear search function
  const clearSearch = useCallback(() => setSearchTerm(''), []);

  return {
    searchTerm,
    setSearchTerm,
    shops: filteredShops,
    allShops: shops,
    isLoading,
    error,
    clearSearch
  };
}


import { useState, useEffect } from 'react';
import { Shop, fetchShops } from '@/lib/shops';
import { shops as mockShops } from '@/lib/shops/mockData';

export function useShopSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Filtered shops based on search term
  const filteredShops = shops.filter(shop => {
    const searchLower = searchTerm.toLowerCase();
    return (
      shop.name.toLowerCase().includes(searchLower) || 
      shop.description.toLowerCase().includes(searchLower) || 
      shop.address.toLowerCase().includes(searchLower)
    );
  });

  return {
    searchTerm,
    setSearchTerm,
    shops: filteredShops,
    allShops: shops,
    isLoading,
    error,
    clearSearch: () => setSearchTerm('')
  };
}

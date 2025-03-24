
import { useState, useEffect } from 'react';
import { fetchShops } from '@/lib/supabase/shops';
import mockShops from '@/lib/shops/mockData';
import { Shop } from '@/lib/shops/types';

export function useShopSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShopsData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real app, you would fetch from a real API
        // Here we're using our mock data or Supabase if connected
        let shopsData: Shop[];
        
        try {
          shopsData = await fetchShops();
          
          if (!shopsData || shopsData.length === 0) {
            // Fallback to mock data if no real data found
            shopsData = mockShops;
          }
        } catch (e) {
          console.error('Error fetching from API, falling back to mock data:', e);
          shopsData = mockShops;
        }
        
        setShops(shopsData);
      } catch (err) {
        console.error('Error in useShopSearch:', err);
        setError('Failed to fetch shops data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchShopsData();
  }, []);

  // Filter shops based on search term
  const filteredShops = searchTerm
    ? shops.filter(shop => 
        shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.address?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : shops;

  const clearSearch = () => {
    setSearchTerm('');
  };

  return {
    searchTerm,
    setSearchTerm,
    shops: filteredShops,
    isLoading,
    error,
    clearSearch
  };
}

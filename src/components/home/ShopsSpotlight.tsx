
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

interface Shop {
  id: string;
  name: string;
  logo: string | null;
  review_count: number | null;
  rating: number | null;
}

export const fetchTopShops = async (): Promise<Shop[]> => {
  // Fetch shops ordered by review count (as a proxy for followers/popularity)
  const { data, error } = await supabase
    .from('shops')
    .select('id, name, logo, review_count, rating')
    .order('review_count', { ascending: false })
    .limit(6);
  
  if (error) {
    console.error('Error fetching shops:', error);
    throw error;
  }
  
  return data || [];
};

const ShopsSpotlight = () => {
  const { data: shops, isLoading, error } = useQuery({
    queryKey: ['shops', 'top'],
    queryFn: fetchTopShops,
    staleTime: 10 * 60 * 1000, // 10 minutes cache
  });
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <Skeleton className="w-20 h-20 md:w-24 md:h-24 rounded-full mb-2" />
            <Skeleton className="w-16 h-3 mb-1" />
            <Skeleton className="w-12 h-2" />
          </div>
        ))}
      </div>
    );
  }
  
  if (error || !shops || shops.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No shops available at the moment.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
      {shops.map(shop => (
        <Link key={shop.id} to={`/shops/${shop.id}`} className="flex flex-col items-center">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white shadow-sm flex items-center justify-center p-2 mb-2 hover:shadow-md transition-shadow">
            {shop.logo ? (
              <img 
                src={shop.logo} 
                alt={shop.name} 
                className="w-full h-full object-cover rounded-full" 
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                {shop.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <h3 className="text-sm font-medium text-center">{shop.name}</h3>
          <div className="flex items-center mt-1">
            <span className="text-amber-500 text-xs mr-1">★</span>
            <span className="text-xs text-gray-600">{shop.rating?.toFixed(1) || '0.0'}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ShopsSpotlight;

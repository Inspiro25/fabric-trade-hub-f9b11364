
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { normalizeProduct, Product } from '@/lib/types/product';
import { useState, useEffect } from 'react';

// Mock data for when database connection fails
const mockCategories = [
  { id: '1', name: 'Fashion', image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=500&auto=format' },
  { id: '2', name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&auto=format' },
  { id: '3', name: 'Home', image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=500&auto=format' },
  { id: '4', name: 'Beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format' },
  { id: '5', name: 'Toys', image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b40?w=500&auto=format' },
  { id: '6', name: 'Sports', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500&auto=format' }
];

// Sample products for fallback
const mockProducts: Product[] = Array.from({ length: 12 }, (_, i) => ({
  id: `product-${i + 1}`,
  name: `Product ${i + 1}`,
  description: `This is a sample product ${i + 1}`,
  price: 19.99 + i * 10,
  salePrice: i % 3 === 0 ? 14.99 + i * 8 : null,
  images: [`https://placehold.co/600x400?text=Product+${i + 1}`],
  category: 'category-' + Math.floor(i / 2 + 1),
  colors: ['red', 'blue', 'black'],
  sizes: ['S', 'M', 'L'],
  isNew: i < 4,
  isTrending: i >= 4 && i < 8,
  rating: 3.5 + (i % 3) * 0.5,
  reviewCount: 10 + i * 5,
  stock: 50 - i,
  tags: ['trending', 'new arrival'],
  shopId: `shop-${Math.floor(i / 4) + 1}`,
  brand: `Brand ${Math.floor(i / 3) + 1}`,
  shopName: `Shop ${Math.floor(i / 4) + 1}`,
  categoryId: `category-${Math.floor(i / 2) + 1}`,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

export function useHomeData() {
  const [dataLoaded, setDataLoaded] = useState(false);

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from('categories').select('*');
        if (error) throw error;
        return data || mockCategories;
      } catch (error) {
        console.error('Error fetching categories:', error);
        return mockCategories;
      }
    }
  });

  const newArrivalsQuery = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_new', true)
          .order('created_at', { ascending: false })
          .limit(8);
        
        if (error) throw error;
        return data?.map(normalizeProduct) || mockProducts.slice(0, 8);
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
        return mockProducts.slice(0, 8);
      }
    }
  });

  const bestSellersQuery = useQuery({
    queryKey: ['best-sellers'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('sold_count', { ascending: false })
          .limit(8);
        
        if (error) throw error;
        return data?.map(normalizeProduct) || mockProducts.slice(4, 12);
      } catch (error) {
        console.error('Error fetching best sellers:', error);
        return mockProducts.slice(4, 12);
      }
    }
  });

  const topRatedQuery = useQuery({
    queryKey: ['top-rated'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('rating', { ascending: false })
          .limit(8);
        
        if (error) throw error;
        return data?.map(normalizeProduct) || mockProducts.slice(2, 10);
      } catch (error) {
        console.error('Error fetching top rated products:', error);
        return mockProducts.slice(2, 10);
      }
    }
  });

  const discountedQuery = useQuery({
    queryKey: ['discounted'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .not('sale_price', 'is', null)
          .order('sale_price', { ascending: true })
          .limit(8);
        
        if (error) throw error;
        return data?.map(normalizeProduct) || mockProducts.filter(p => p.salePrice).slice(0, 8);
      } catch (error) {
        console.error('Error fetching discounted products:', error);
        return mockProducts.filter(p => p.salePrice).slice(0, 8);
      }
    }
  });

  useEffect(() => {
    if (
      categoriesQuery.isSuccess && 
      newArrivalsQuery.isSuccess && 
      bestSellersQuery.isSuccess && 
      topRatedQuery.isSuccess && 
      discountedQuery.isSuccess
    ) {
      setDataLoaded(true);
    }
  }, [
    categoriesQuery.isSuccess,
    newArrivalsQuery.isSuccess,
    bestSellersQuery.isSuccess,
    topRatedQuery.isSuccess,
    discountedQuery.isSuccess
  ]);

  return {
    categoriesQuery,
    newArrivalsQuery,
    bestSellersQuery,
    topRatedQuery,
    discountedQuery,
    dataLoaded
  };
}

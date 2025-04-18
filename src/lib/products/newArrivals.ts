
import { Product } from '../types/product';
import { supabase } from '@/integrations/supabase/client';

export const fetchNewArrivals = async (limit = 8): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_new', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    return [];
  }
};

export const fetchNewArrivalsForCategory = async (categoryId: string, limit = 8): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_new', true)
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching new arrivals for category:', error);
    return [];
  }
};

// Alias for backwards compatibility - ensure this is exported
export const getNewArrivals = fetchNewArrivals;

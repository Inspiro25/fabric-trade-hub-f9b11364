import { Product } from '@/lib/products';
import { supabase } from '@/integrations/supabase/client';

export const getNewArrivals = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};
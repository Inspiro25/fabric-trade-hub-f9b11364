
import { supabase } from '@/integrations/supabase/client';

export async function getCategoriesWithDetails() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching categories with details:', error);
    return [];
  }
}

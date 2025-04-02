
import { supabase } from '@/integrations/supabase/client';
import { productStore } from '@/lib/types/product';

export const getAllCategories = async (): Promise<string[]> => {
  try {
    // Fetch categories from Supabase database
    const { data: categories, error } = await supabase
      .from('categories')
      .select('name')
      .order('name');
    
    if (error) {
      console.error('Error fetching categories from Supabase:', error);
      throw error;
    }
    
    if (categories && categories.length > 0) {
      // Map category objects to just their names
      return categories.map(category => category.name);
    }
    
    // Fallback to local data if no categories found
    const localCategories = new Set(productStore.products.map(product => product.category));
    return Array.from(localCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    
    // Fallback to local data on error
    const categories = new Set(productStore.products.map(product => product.category));
    return Array.from(categories);
  }
};

// New function to fetch full category data including images
export const getCategoriesWithDetails = async () => {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('id, name, description, image')
      .order('name');
    
    if (error) {
      console.error('Error fetching categories with details:', error);
      throw error;
    }
    
    return categories || [];
  } catch (error) {
    console.error('Error fetching category details:', error);
    return [];
  }
};

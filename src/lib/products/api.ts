
import { supabase } from '@/integrations/supabase/client';
import { Product } from './types';

// Fetch all products
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    
    return data as Product[];
  } catch (err) {
    console.error('Error in fetchProducts:', err);
    return [];
  }
};

// Fetch a product by ID
export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }
    
    return data as Product;
  } catch (err) {
    console.error('Error in fetchProductById:', err);
    return null;
  }
};

// Fetch products by shop
export const fetchProductsByShop = async (shopId: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching products by shop:', error);
      return [];
    }
    
    return data as Product[];
  } catch (err) {
    console.error('Error in fetchProductsByShop:', err);
    return [];
  }
};

// Fetch products by category
export const fetchProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
    
    return data as Product[];
  } catch (err) {
    console.error('Error in fetchProductsByCategory:', err);
    return [];
  }
};


import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/lib/types/product";

// Function to fetch all products from Supabase
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*');

    if (error) throw error;
    return products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const fetchCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const createProduct = async (productData: Partial<Product>): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        ...productData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (error) throw error;
    return data?.[0]?.id || null;
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
};

export const updateProduct = async (id: string, productData: Partial<Product>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .update({
        ...productData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating product:', error);
    return false;
  }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};

export const getShopProducts = async (shopId: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching shop products:', error);
    return [];
  }
};

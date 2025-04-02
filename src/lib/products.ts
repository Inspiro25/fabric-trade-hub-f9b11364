import { supabase } from '@/lib/supabase';

export async function addProduct(productData: any) {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        ...productData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
}

export async function getAllCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

export async function fetchProductById(id: string) {
  try {
    // First, get the product
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    console.log('Product query result:', product, productError);

    if (productError) throw productError;
    if (!product) return null;

    // Then get the category if there's a category_id
    if (product.category_id) {
      const { data: category, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('id', product.category_id)
        .single();

      console.log('Category query result:', category, categoryError);

      if (!categoryError && category) {
        return { ...product, category };
      }
    }

    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

export async function getAllProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:category_id (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function updateProduct(id: string, productData: any) {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({
        ...productData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function deleteProduct(id: string) {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

export async function getProductById(id: string) {
  return fetchProductById(id); // Use the existing fetchProductById function
}
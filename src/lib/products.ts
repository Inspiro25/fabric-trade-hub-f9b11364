
import { supabase } from '@/lib/supabase';
import { Json } from './types/json';
import { Product } from '@/types/product';

export async function addProduct(productData: any) {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        ...productData,
        created_at: new Date().toISOString()
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

export async function createProduct(productData: any): Promise<string> {
  return addProduct(productData);
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

    if (productError) throw productError;
    if (!product) return null;

    // Then get the category if there's a category_id
    if (product.category_id) {
      const { data: category, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('id', product.category_id)
        .single();

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
    // Convert camelCase to snake_case for Supabase
    const formattedData = {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      sale_price: productData.salePrice,
      category_id: productData.category,
      images: productData.images,
      colors: productData.colors,
      sizes: productData.sizes,
      tags: productData.tags,
      stock: productData.stock,
      is_new: productData.isNew,
      is_trending: productData.isTrending,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('products')
      .update(formattedData)
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

export async function fetchProducts(options?: any) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(options?.limit || 10);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

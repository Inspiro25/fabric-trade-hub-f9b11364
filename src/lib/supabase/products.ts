
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/products/types';

// Fetch all products
export async function fetchProducts(options: any = {}) {
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

// Fetch a product by ID
export async function fetchProductById(id: string) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name),
        shop:shops(id, name, logo)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
}

// Get product by ID (alias)
export async function getProductById(id: string) {
  return fetchProductById(id);
}

// Add a new product
export async function addProduct(productData: any) {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        sale_price: productData.salePrice,
        category_id: productData.category,
        images: productData.images || [],
        colors: productData.colors || [],
        sizes: productData.sizes || [],
        tags: productData.tags || [],
        stock: productData.stock || 0,
        is_new: productData.isNew || false,
        is_trending: productData.isTrending || false,
        rating: 0,
        review_count: 0,
        shop_id: productData.shopId,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
}

// Create a product (alias for addProduct)
export async function createProduct(productData: any): Promise<string> {
  return addProduct(productData);
}

// Update a product
export async function updateProduct(id: string, productData: any) {
  try {
    const updates = {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      sale_price: productData.salePrice,
      category_id: productData.category,
      images: productData.images || [],
      colors: productData.colors || [],
      sizes: productData.sizes || [],
      tags: productData.tags || [],
      stock: productData.stock || 0,
      is_new: productData.isNew || false,
      is_trending: productData.isTrending || false,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('products')
      .update(updates)
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

// Delete a product
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
    return false;
  }
}

// Get all products
export async function getAllProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name),
        shop:shops(id, name, logo)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching all products:', error);
    return [];
  }
}

// Get all categories
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
    return [];
  }
}

// Fetch categories
export async function fetchCategories() {
  return getAllCategories();
}

// Fetch products for a specific shop
export async function getShopProducts(shopId: string) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name)
      `)
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching shop products:', error);
    return [];
  }
}

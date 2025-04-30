
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/lib/products/types';

export async function getProductById(id: string): Promise<Product> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Product not found');

    // Map the data to the Product type
    const product: Product = {
      id: data.id,
      name: data.name,
      description: data.description || '',
      price: data.price,
      salePrice: data.sale_price,
      sale_price: data.sale_price,
      images: data.images || [],
      category: data.category_id || '',
      category_id: data.category_id,
      rating: data.rating || 0,
      reviewCount: data.review_count || 0,
      review_count: data.review_count || 0,
      stock: data.stock || 0,
      colors: data.colors || [],
      sizes: data.sizes || [],
      tags: data.tags || [],
      isNew: data.is_new || false,
      is_new: data.is_new || false,
      isTrending: data.is_trending || false,
      is_trending: data.is_trending || false,
      created_at: data.created_at
    };

    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

export async function getShopProducts(shopId: string): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId);

    if (error) throw error;

    // Map the data to the Product type
    return (data || []).map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      price: item.price,
      salePrice: item.sale_price,
      sale_price: item.sale_price,
      images: item.images || [],
      category: item.category_id || '',
      category_id: item.category_id,
      rating: item.rating || 0,
      reviewCount: item.review_count || 0,
      review_count: item.review_count || 0,
      stock: item.stock || 0,
      colors: item.colors || [],
      sizes: item.sizes || [],
      tags: item.tags || [],
      isNew: item.is_new || false,
      is_new: item.is_new || false,
      isTrending: item.is_trending || false,
      is_trending: item.is_trending || false,
      created_at: item.created_at
    }));
  } catch (error) {
    console.error('Error fetching shop products:', error);
    return [];
  }
}

// Add the missing exported functions
export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      price: item.price,
      salePrice: item.sale_price,
      sale_price: item.sale_price,
      images: item.images || [],
      category: item.category_id || '',
      category_id: item.category_id,
      rating: item.rating || 0,
      reviewCount: item.review_count || 0,
      review_count: item.review_count || 0,
      stock: item.stock || 0,
      colors: item.colors || [],
      sizes: item.sizes || [],
      tags: item.tags || [],
      isNew: item.is_new || false,
      is_new: item.is_new || false,
      isTrending: item.is_trending || false,
      is_trending: item.is_trending || false,
      created_at: item.created_at
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function createProduct(productData: Partial<Product>): Promise<string | null> {
  try {
    // Convert from client-side model to database model
    const dbProduct = {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      sale_price: productData.salePrice || productData.sale_price,
      images: productData.images || [],
      category_id: productData.category || productData.category_id,
      rating: productData.rating || 0,
      review_count: productData.reviewCount || productData.review_count || 0,
      stock: productData.stock || 0,
      colors: productData.colors || [],
      sizes: productData.sizes || [],
      tags: productData.tags || [],
      is_new: productData.isNew || productData.is_new || false,
      is_trending: productData.isTrending || productData.is_trending || false,
      shop_id: productData.shop_id,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('products')
      .insert([dbProduct])
      .select('id')
      .single();

    if (error) {
      console.error('Error creating product:', error);
      throw error;
    }

    return data?.id || null;
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
}

export async function updateProduct(id: string, productData: Partial<Product>): Promise<boolean> {
  try {
    // Convert from client-side model to database model
    const dbProduct: any = {};
    
    if (productData.name !== undefined) dbProduct.name = productData.name;
    if (productData.description !== undefined) dbProduct.description = productData.description;
    if (productData.price !== undefined) dbProduct.price = productData.price;
    if (productData.salePrice !== undefined || productData.sale_price !== undefined) {
      dbProduct.sale_price = productData.salePrice || productData.sale_price;
    }
    if (productData.images !== undefined) dbProduct.images = productData.images;
    if (productData.category !== undefined || productData.category_id !== undefined) {
      dbProduct.category_id = productData.category || productData.category_id;
    }
    if (productData.rating !== undefined) dbProduct.rating = productData.rating;
    if (productData.reviewCount !== undefined || productData.review_count !== undefined) {
      dbProduct.review_count = productData.reviewCount || productData.review_count;
    }
    if (productData.stock !== undefined) dbProduct.stock = productData.stock;
    if (productData.colors !== undefined) dbProduct.colors = productData.colors;
    if (productData.sizes !== undefined) dbProduct.sizes = productData.sizes;
    if (productData.tags !== undefined) dbProduct.tags = productData.tags;
    if (productData.isNew !== undefined || productData.is_new !== undefined) {
      dbProduct.is_new = productData.isNew || productData.is_new;
    }
    if (productData.isTrending !== undefined || productData.is_trending !== undefined) {
      dbProduct.is_trending = productData.isTrending || productData.is_trending;
    }

    const { error } = await supabase
      .from('products')
      .update(dbProduct)
      .eq('id', id);

    if (error) {
      console.error('Error updating product:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error updating product:', error);
    return false;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
}

export async function fetchCategories(): Promise<{id: string, name: string}[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}


import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/lib/products";

// Function to fetch all products from Supabase
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    // @ts-ignore - TypeScript doesn't recognize 'products' table in Supabase client type
    const { data: products, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
    
    if (!products) return [];
    
    return products.map((product: any) => ({
      id: product?.id || '',
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      salePrice: product?.sale_price,
      images: product?.images || [],
      category: product?.category_id || '',
      colors: product?.colors || [],
      sizes: product?.sizes || [],
      isNew: product?.is_new || false,
      isTrending: product?.is_trending || false,
      rating: product?.rating || 0,
      reviewCount: product?.review_count || 0,
      stock: product?.stock || 0,
      tags: product?.tags || [],
      shopId: product?.shop_id || '',
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product | undefined> => {
  try {
    // @ts-ignore - TypeScript doesn't recognize 'products' table in Supabase client type
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching product ${id}:`, error);
      return undefined;
    }
    
    if (!product) return undefined;
    
    return {
      id: product?.id || '',
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      salePrice: product?.sale_price,
      images: product?.images || [],
      category: product?.category_id || '',
      colors: product?.colors || [],
      sizes: product?.sizes || [],
      isNew: product?.is_new || false,
      isTrending: product?.is_trending || false,
      rating: product?.rating || 0,
      reviewCount: product?.review_count || 0,
      stock: product?.stock || 0,
      tags: product?.tags || [],
      shopId: product?.shop_id || '',
    };
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return undefined;
  }
};

// Get products by shop ID
export const getShopProducts = async (shopId: string): Promise<Product[]> => {
  try {
    // @ts-ignore - TypeScript doesn't recognize 'products' table in Supabase client type
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId);
    
    if (error) {
      console.error(`Error fetching products for shop ${shopId}:`, error);
      return [];
    }
    
    if (!products) return [];
    
    return products.map((product: any) => ({
      id: product?.id || '',
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      salePrice: product?.sale_price,
      images: product?.images || [],
      category: product?.category_id || '',
      colors: product?.colors || [],
      sizes: product?.sizes || [],
      isNew: product?.is_new || false,
      isTrending: product?.is_trending || false,
      rating: product?.rating || 0,
      reviewCount: product?.review_count || 0,
      stock: product?.stock || 0,
      tags: product?.tags || [],
      shopId: product?.shop_id || '',
    }));
  } catch (error) {
    console.error(`Error fetching products for shop ${shopId}:`, error);
    return [];
  }
};

// Create a new product
export const createProduct = async (productData: Omit<Product, 'id'>): Promise<string | null> => {
  try {
    // @ts-ignore - TypeScript doesn't recognize 'products' table in Supabase client type
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        sale_price: productData.salePrice,
        images: productData.images,
        category_id: productData.category,
        shop_id: productData.shopId,
        colors: productData.colors,
        sizes: productData.sizes,
        is_new: productData.isNew,
        is_trending: productData.isTrending,
        stock: productData.stock,
        tags: productData.tags,
      } as any)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating product:', error);
      return null;
    }
    
    return data?.id || null;
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
};

// Update a product
export const updateProduct = async (id: string, productData: Partial<Product>): Promise<boolean> => {
  try {
    // @ts-ignore - TypeScript doesn't recognize 'products' table in Supabase client type
    const { error } = await supabase
      .from('products')
      .update({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        sale_price: productData.salePrice,
        images: productData.images,
        category_id: productData.category,
        colors: productData.colors,
        sizes: productData.sizes,
        is_new: productData.isNew,
        is_trending: productData.isTrending,
        stock: productData.stock,
        tags: productData.tags,
      } as any)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating product:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating product:', error);
    return false;
  }
};

// Delete a product
export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    // @ts-ignore - TypeScript doesn't recognize 'products' table in Supabase client type
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting product:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};

// Fetch categories
export const fetchCategories = async () => {
  try {
    // @ts-ignore - TypeScript doesn't recognize 'categories' table in Supabase client type
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, description, image');
      
    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Fallback to fetching from local categories if available
    return [];
  }
};

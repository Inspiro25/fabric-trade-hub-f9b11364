
import { Product, productStore } from '@/lib/types/product';
import { supabase } from '@/integrations/supabase/client';

// Function to get related products
export const getRelatedProducts = async (currentProductId: string, category: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', category)
      .neq('id', currentProductId)
      .limit(4);
    
    if (error) {
      console.error('Error fetching related products:', error);
      throw error;
    }
    
    if (data && data.length > 0) {
      return data.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: product.price,
        salePrice: product.sale_price,
        images: product.images || [],
        category: product.category_id || '',
        colors: product.colors || [],
        sizes: product.sizes || [],
        isNew: product.is_new || false,
        isTrending: product.is_trending || false,
        rating: product.rating || 0,
        reviewCount: product.review_count || 0,
        stock: product.stock || 0,
        tags: product.tags || [],
        shopId: product.shop_id || '',
      }));
    }
    
    // Fallback to local data
    return productStore.products
      .filter(product => product.id !== currentProductId && product.category === category)
      .slice(0, 4);
  } catch (error) {
    console.error('Error fetching related products:', error);
    return productStore.products
      .filter(product => product.id !== currentProductId && product.category === category)
      .slice(0, 4);
  }
};

// Utility functions to get filtered products
export const getNewArrivals = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_new', true)
      .order('created_at', { ascending: false })
      .limit(8);
    
    if (error) {
      console.error('Error fetching new arrivals:', error);
      throw error;
    }
    
    if (data && data.length > 0) {
      return data.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: product.price,
        salePrice: product.sale_price,
        images: product.images || [],
        category: product.category_id || '',
        colors: product.colors || [],
        sizes: product.sizes || [],
        isNew: product.is_new || false,
        isTrending: product.is_trending || false,
        rating: product.rating || 0,
        reviewCount: product.review_count || 0,
        stock: product.stock || 0,
        tags: product.tags || [],
        shopId: product.shop_id || '',
      }));
    }
    
    // Fallback to local data
    return productStore.products.filter(product => product.isNew).slice(0, 8);
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    return productStore.products.filter(product => product.isNew).slice(0, 8);
  }
};

export const getTrendingProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_trending', true)
      .order('review_count', { ascending: false })
      .limit(8);
    
    if (error) {
      console.error('Error fetching trending products:', error);
      throw error;
    }
    
    if (data && data.length > 0) {
      return data.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: product.price,
        salePrice: product.sale_price,
        images: product.images || [],
        category: product.category_id || '',
        colors: product.colors || [],
        sizes: product.sizes || [],
        isNew: product.is_new || false,
        isTrending: product.is_trending || false,
        rating: product.rating || 0,
        reviewCount: product.review_count || 0,
        stock: product.stock || 0,
        tags: product.tags || [],
        shopId: product.shop_id || '',
      }));
    }
    
    // Fallback to local data
    return productStore.products.filter(product => product.isTrending).slice(0, 8);
  } catch (error) {
    console.error('Error fetching trending products:', error);
    return productStore.products.filter(product => product.isTrending).slice(0, 8);
  }
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', category);
    
    if (error) {
      console.error(`Error fetching products for category ${category}:`, error);
      throw error;
    }
    
    if (data && data.length > 0) {
      return data.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: product.price,
        salePrice: product.sale_price,
        images: product.images || [],
        category: product.category_id || '',
        colors: product.colors || [],
        sizes: product.sizes || [],
        isNew: product.is_new || false,
        isTrending: product.is_trending || false,
        rating: product.rating || 0,
        reviewCount: product.review_count || 0,
        stock: product.stock || 0,
        tags: product.tags || [],
        shopId: product.shop_id || '',
      }));
    }
    
    // Fallback to local data
    return productStore.products.filter(product => product.category === category);
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    return productStore.products.filter(product => product.category === category);
  }
};

export const getProductsByTags = async (tag: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .contains('tags', [tag])
      .limit(8);
      
    if (error) {
      console.error(`Error fetching products with tag ${tag}:`, error);
      throw error;
    }
    
    if (data && data.length > 0) {
      return data.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: product.price,
        salePrice: product.sale_price,
        images: product.images || [],
        category: product.category_id || '',
        colors: product.colors || [],
        sizes: product.sizes || [],
        isNew: product.is_new || false,
        isTrending: product.is_trending || false,
        rating: product.rating || 0,
        reviewCount: product.review_count || 0,
        stock: product.stock || 0,
        tags: product.tags || [],
        shopId: product.shop_id || '',
      }));
    }
    
    // Fallback to local data
    return productStore.products.filter(product => product.tags.includes(tag)).slice(0, 8);
  } catch (error) {
    console.error(`Error fetching products with tag ${tag}:`, error);
    return productStore.products.filter(product => product.tags.includes(tag)).slice(0, 8);
  }
};

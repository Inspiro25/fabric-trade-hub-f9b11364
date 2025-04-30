
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/lib/products/types';
import { toast } from 'sonner';

// Define the base query with all necessary fields
const baseProductQuery = `
  id,
  name,
  description,
  price,
  sale_price,
  rating,
  views,
  created_at,
  category_id,
  images,
  stock,
  colors,
  sizes,
  tags,
  review_count,
  shop_id
`;

// Helper function to transform database product to client Product type
export const transformProduct = (item: any): Product => {
  return {
    id: item.id,
    name: item.name,
    description: item.description || '',
    price: item.price,
    sale_price: item.sale_price,
    salePrice: item.sale_price,
    images: item.images || [],
    category_id: item.category_id,
    category: item.category_id, // For compatibility
    rating: item.rating || 0,
    review_count: item.review_count || 0,
    reviewCount: item.review_count || 0,
    stock: item.stock || 0,
    colors: item.colors || [],
    sizes: item.sizes || [],
    tags: item.tags || [],
    is_new: item.is_new,
    isNew: item.is_new,
    is_trending: item.is_trending,
    isTrending: item.is_trending,
    shop_id: item.shop_id,
    shopId: item.shop_id
  };
};

// Function to fetch all products from the database
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(baseProductQuery)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map(item => transformProduct(item));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Get a single product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(baseProductQuery)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;
    
    return transformProduct(data);
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
};

// Get products for a specific shop
export const getShopProducts = async (shopId: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(baseProductQuery)
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map(item => transformProduct(item));
  } catch (error) {
    console.error(`Error fetching products for shop ${shopId}:`, error);
    return [];
  }
};

// Update a product in the database
export const updateProduct = async (productId: string, productData: Partial<Product>): Promise<Product | null> => {
  try {
    // Convert shopId to shop_id if it exists
    if (productData.shopId && !productData.shop_id) {
      productData.shop_id = productData.shopId;
      delete productData.shopId;
    }
    
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', productId)
      .select()
      .single();

    if (error) throw error;
    
    return transformProduct(data);
  } catch (error) {
    console.error(`Error updating product ${productId}:`, error);
    toast.error('Failed to update product');
    return null;
  }
};

// Delete a product from the database
export const deleteProduct = async (productId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Error deleting product ${productId}:`, error);
    toast.error('Failed to delete product');
    return false;
  }
};

export const createProduct = async (productData: Partial<Product>): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (error) throw error;
    
    return transformProduct(data);
  } catch (error) {
    console.error('Error creating product:', error);
    toast.error('Failed to create product');
    return null;
  }
};

// Get featured or highlighted products
export const getFeaturedProducts = async (limit = 8): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(baseProductQuery)
      .order('rating', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    return data.map(item => transformProduct(item));
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
};

// Function to fetch categories
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
    throw error;
  }
};

// Export this function to update Vyoma clothing images - needed for Index.tsx
export const updateVyomaClothingImages = async () => {
  // This is just a dummy function to satisfy the import in Index.tsx
  // In a real app, this would contain logic to update images
  console.log('Updating Vyoma clothing images');
  return true;
};

// Add a utility function to format currency values
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

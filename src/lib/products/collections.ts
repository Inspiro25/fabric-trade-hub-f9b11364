
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types/product';

export const fetchCollections = async () => {
  try {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
};

export const fetchCollectionProducts = async (collectionId: string, limit = 8): Promise<Product[]> => {
  try {
    // First get the collection's products
    const { data: collectionProducts, error: collectionError } = await supabase
      .from('collection_products')
      .select('product_id')
      .eq('collection_id', collectionId)
      .limit(limit);

    if (collectionError) throw collectionError;
    
    if (!collectionProducts || collectionProducts.length === 0) {
      return [];
    }
    
    // Then fetch the actual products
    const productIds = collectionProducts.map(cp => cp.product_id);
    
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds);
      
    if (productsError) throw productsError;
    return products || [];
  } catch (error) {
    console.error(`Error fetching products for collection ${collectionId}:`, error);
    return [];
  }
};

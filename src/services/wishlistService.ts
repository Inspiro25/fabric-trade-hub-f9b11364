
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Product } from '@/lib/products';

// Fetch user wishlist
export const fetchUserWishlist = async (userId: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('user_wishlists')
      .select('*, product:products(*)')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching wishlist:', error);
      return [];
    }
    
    // Transform to product format
    return data.map(item => {
      const product = item.product as any;
      return {
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
      };
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return [];
  }
};

// Add product to wishlist
export const addToWishlist = async (userId: string, productId: string): Promise<boolean> => {
  try {
    // Check if already in wishlist
    const { data: existingItem, error: checkError } = await supabase
      .from('user_wishlists')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking wishlist:', checkError);
      return false;
    }
    
    if (existingItem) {
      toast.info('Product is already in your wishlist');
      return true;
    }
    
    // Add to wishlist
    const { error } = await supabase
      .from('user_wishlists')
      .insert({
        user_id: userId,
        product_id: productId
      });
    
    if (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    }
    
    toast.success('Added to wishlist');
    return true;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return false;
  }
};

// Remove from wishlist
export const removeFromWishlist = async (userId: string, productId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_wishlists')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);
    
    if (error) {
      console.error('Error removing from wishlist:', error);
      return false;
    }
    
    toast.success('Removed from wishlist');
    return true;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return false;
  }
};

// Check if product is in wishlist
export const isInWishlist = async (userId: string, productId: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    const { data, error } = await supabase
      .from('user_wishlists')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking wishlist:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return false;
  }
};

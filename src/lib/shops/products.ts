
import { Product } from '@/lib/products';
import { getShopById } from './crud';
import { getShopProducts as supabaseGetShopProducts } from '@/lib/supabase/products';
import { shops } from './mockData';
import { supabase } from '@/integrations/supabase/client';

// Function to get products for a shop
export const getShopProducts = async (shopId: string, allProducts?: Product[]): Promise<Product[]> => {
  if (!shopId) {
    console.error('No shopId provided to getShopProducts');
    return [];
  }

  try {
    console.log('Fetching products for shop:', shopId);
    
    // Direct query to Supabase
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId);
    
    if (error) {
      console.error('Error fetching products from Supabase:', error);
      throw error;
    }
    
    console.log(`Found ${data?.length || 0} products for shop ${shopId} in Supabase:`, data);
    
    if (data && data.length > 0) {
      // Map the data to match the Product type
      return data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        price: item.price,
        salePrice: item.sale_price,
        sale_price: item.sale_price,
        images: item.images || [],
        category: item.category_id || '',
        category_id: item.category_id,
        colors: item.colors || [],
        sizes: item.sizes || [],
        isNew: item.is_new || false,
        is_new: item.is_new,
        isTrending: item.is_trending || false,
        is_trending: item.is_trending,
        rating: item.rating || 0,
        reviewCount: item.review_count || 0,
        review_count: item.review_count,
        stock: item.stock || 0,
        tags: item.tags || [],
        shopId: item.shop_id,
        shop_id: item.shop_id,
        brand: '',
        shopName: '',
        categoryId: item.category_id,
        created_at: item.created_at,
        updated_at: item.created_at,
      }));
    }

    // If we get here, no products were found in Supabase
    console.log('No products found in Supabase for shop', shopId);
    
    // Use fallback methods
    try {
      const shop = await getShopById(shopId);
      if (!shop) {
        console.error('Shop not found:', shopId);
        return [];
      }
      
      console.log('Shop found:', shop.name);
      
      // Fallback to mockProducts for development
      console.log('Using mock products for development');
      const mockShopProducts = shops
        .find(s => s.id === shopId)?.productIds
        .slice(0, 5)
        .map(pid => ({
          id: pid,
          name: `Product for ${shop?.name || 'Shop'}`,
          description: 'This is a sample product description',
          price: 99.99,
          salePrice: null,
          sale_price: null,
          images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e'],
          category: 'general',
          category_id: 'general',
          colors: ['Black', 'White'],
          sizes: ['One Size'],
          isNew: false,
          is_new: false,
          isTrending: false,
          is_trending: false,
          rating: 4.5,
          reviewCount: 10,
          review_count: 10,
          stock: 100,
          tags: ['sample'],
          shopId: shopId,
          shop_id: shopId,
          brand: '',
          shopName: shop?.name || '',
          categoryId: 'general',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })) || [];
        
      return mockShopProducts;
    } catch (error) {
      console.error('Error in fallback logic:', error);
      return [];
    }
  } catch (error) {
    console.error(`Error in getShopProducts for shop ${shopId}:`, error);
    return [];
  }
};

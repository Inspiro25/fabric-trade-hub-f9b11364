
import { Product } from '@/lib/products';
import { getShopById } from './crud';
import { getShopProducts as supabaseGetShopProducts } from '@/lib/supabase/products';
import { shops } from './mockData';
import { supabase } from '@/integrations/supabase/client';

// Function to get products for a shop
export const getShopProducts = async (shopId: string, allProducts?: Product[]): Promise<Product[]> => {
  try {
    const shop = await getShopById(shopId);
    if (!shop) return [];

    // First try directly from Supabase
    try {
      console.log('Fetching products directly from Supabase for shop:', shopId);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('shop_id', shopId);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        console.log(`Found ${data.length} products directly from Supabase for shop ${shopId}`);
        
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
          shopName: shop?.name || '',
          categoryId: item.category_id,
          created_at: item.created_at,
          updated_at: item.created_at,
        }));
      }
    } catch (directError) {
      console.error('Error fetching products directly from Supabase:', directError);
    }
    
    // Try using the supabaseGetShopProducts function as a backup
    try {
      const products = await supabaseGetShopProducts(shopId);
      
      if (products && products.length > 0) {
        console.log(`Found ${products.length} products via supabaseGetShopProducts for shop ${shopId}`);
        return products;
      }
    } catch (error) {
      console.error(`Error fetching products for shop ${shopId} via supabaseGetShopProducts:`, error);
    }
    
    // If allProducts was provided, use it for the fallback
    if (allProducts && shop.productIds && shop.productIds.length > 0) {
      console.log('Using provided allProducts as fallback');
      return allProducts.filter(product => shop.productIds.includes(product.id));
    }
    
    // Final fallback to mock data
    console.log('Using mock data as last resort');
    return shops
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
  } catch (error) {
    console.error(`Error in getShopProducts for shop ${shopId}:`, error);
    
    // Fallback to filtering by productIds if allProducts was provided
    if (allProducts) {
      const shop = shops.find(s => s.id === shopId);
      if (shop && shop.productIds && shop.productIds.length > 0) {
        return allProducts.filter(product => shop.productIds.includes(product.id));
      }
    }
    
    return [];
  }
};

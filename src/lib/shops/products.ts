
import { Shop } from "./types";
import { supabase } from "@/integrations/supabase/client";

// This is a mock function to fetch products for a shop
export const getShopProducts = async (shopId: string) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId);
      
    if (error) {
      console.error('Error fetching shop products:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getShopProducts:', error);
    return [];
  }
};

// The logic for adding and removing a product to/from a shop was previously 
// using a productIds property which doesn't exist. Let's fix that:

export const addProductToShop = async (shop: Shop, productId: string) => {
  // In a real app, you would update the database
  try {
    // Update the product to set its shop_id to the current shop's id
    const { error } = await supabase
      .from('products')
      .update({ shop_id: shop.id })
      .eq('id', productId);
      
    if (error) {
      console.error('Error adding product to shop:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in addProductToShop:', error);
    return false;
  }
};

export const removeProductFromShop = async (shop: Shop, productId: string) => {
  // In a real app, you would update the database
  try {
    // Update the product to remove its shop_id
    const { error } = await supabase
      .from('products')
      .update({ shop_id: null })
      .eq('id', productId)
      .eq('shop_id', shop.id); // Only if it belongs to this shop
      
    if (error) {
      console.error('Error removing product from shop:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in removeProductFromShop:', error);
    return false;
  }
};

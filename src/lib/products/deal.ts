
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/lib/products/types';
import { productStore } from '@/lib/types/product';

export interface DealProduct extends Omit<Product, 'created_at'> {
  discountPercentage: number;
  endTime: Date;
  created_at?: string;
}

/**
 * Fetches the product with the highest discount percentage
 * Returns a product with discount percentage and deal end time
 */
export const getDealOfTheDay = async (): Promise<DealProduct | null> => {
  try {
    // Fetch products with both price and sale_price from Supabase
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .not('sale_price', 'is', null)
      .order('price', { ascending: false }) // Higher original price first for better deals
      .limit(10); // Limit to 10 products for efficiency
    
    if (error) {
      console.error('Error fetching deal products:', error);
      return getFallbackDeal();
    }
    
    if (!products || products.length === 0) {
      // Fallback to local data
      return getFallbackDeal();
    }
    
    // Calculate discount percentage for each product and find the best deal
    const productsWithDiscounts = products.map(product => {
      const price = product.price || 0;
      const salePrice = product.sale_price || 0;
      const discountPercentage = price > 0 ? Math.round(((price - salePrice) / price) * 100) : 0;
      
      return {
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: price,
        salePrice: salePrice,
        sale_price: salePrice,
        images: product.images || [],
        category: product.category_id || '',
        category_id: product.category_id || '',
        colors: product.colors || [],
        sizes: product.sizes || [],
        isNew: product.is_new || false,
        is_new: product.is_new || false,
        isTrending: product.is_trending || false,
        is_trending: product.is_trending || false,
        rating: product.rating || 0,
        reviewCount: product.review_count || 0,
        review_count: product.review_count || 0,
        stock: product.stock || 0,
        tags: product.tags || [],
        shopId: product.shop_id || '',
        shop_id: product.shop_id || '',
        created_at: product.created_at,
        discountPercentage,
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // Deal ends in 24 hours
      };
    });
    
    // Sort by discount percentage (highest first)
    productsWithDiscounts.sort((a, b) => b.discountPercentage - a.discountPercentage);
    
    return productsWithDiscounts[0] || getFallbackDeal();
  } catch (error) {
    console.error('Error getting deal of the day:', error);
    
    // Fallback to local data on error
    return getFallbackDeal();
  }
};

/**
 * Fallback to provide a deal from local data when database fetch fails
 */
const getFallbackDeal = (): DealProduct | null => {
  // Get products from local store that have both regular price and sale price
  const productsWithDiscount = productStore.products.filter(p => p.price && p.sale_price);
  
  if (productsWithDiscount.length === 0) {
    // Create a default product as last resort
    const defaultProduct: DealProduct = {
      id: "default-deal-1",
      name: "Premium Cotton T-Shirt",
      description: "Made from 100% organic cotton, this premium t-shirt offers exceptional comfort and durability.",
      price: 29.99,
      sale_price: 19.99,
      salePrice: 19.99,
      images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2080"],
      category: "T-Shirts",
      category_id: "t-shirts",
      colors: ["White", "Black", "Navy", "Gray"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      isNew: true,
      is_new: true,
      isTrending: false,
      is_trending: false,
      rating: 4.5,
      reviewCount: 128,
      review_count: 128,
      stock: 50,
      tags: ["cotton", "casual", "summer"],
      shop_id: "shop-1",
      shopId: "shop-1",
      discountPercentage: 33,
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000)
    };
    
    return defaultProduct;
  }
  
  // Calculate discount and find best deal
  const productsWithDiscounts = productsWithDiscount.map(product => {
    const discountPercentage = Math.round(((product.price - (product.sale_price || 0)) / product.price) * 100);
    return {
      ...product,
      sale_price: product.sale_price,
      category_id: product.category || '',
      is_new: product.isNew,
      is_trending: product.isTrending,
      review_count: product.reviewCount,
      shop_id: product.shopId,
      discountPercentage,
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // Deal ends in 24 hours
    };
  });
  
  // Sort by discount percentage (highest first)
  productsWithDiscounts.sort((a, b) => b.discountPercentage - a.discountPercentage);
  
  return productsWithDiscounts[0] || null;
};

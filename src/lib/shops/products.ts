import { doc, collection, getDocs, query, where } from '@/lib/firebase';
import { Product } from '@/lib/products';
import { shops } from './mockData';
import { getShopById } from './crud';

// Function to get products for a shop
export const getShopProducts = async (shopId: string, allProducts?: Product[]): Promise<Product[]> => {
  try {
    const shop = await getShopById(shopId);
    if (!shop) return [];
    
    // First try to get products from database
    const productsQuery = query(collection(db, 'products'), where('shopId', '==', shopId));
    const productsSnapshot = await getDocs(productsQuery);
    
    if (!productsSnapshot.empty) {
      return productsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          description: data.description,
          price: data.price,
          salePrice: data.salePrice,
          images: data.images || [],
          category: data.category,
          colors: data.colors || [],
          sizes: data.sizes || [],
          isNew: data.isNew,
          isTrending: data.isTrending,
          rating: data.rating,
          reviewCount: data.reviewCount,
          stock: data.stock,
          tags: data.tags || [],
        } as Product;
      });
    }
    
    // If allProducts was provided, use it for the fallback
    if (allProducts && shop.productIds) {
      return allProducts.filter(product => shop.productIds.includes(product.id));
    }
    
    // Otherwise just return an empty array
    return [];
  } catch (error) {
    console.error(`Error fetching products for shop ${shopId}:`, error);
    
    // Fallback to filtering by productIds if allProducts was provided
    if (allProducts) {
      const shop = shops.find(s => s.id === shopId);
      if (shop && shop.productIds) {
        return allProducts.filter(product => shop.productIds.includes(product.id));
      }
    }
    
    return [];
  }
};

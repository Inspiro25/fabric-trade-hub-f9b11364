
import { db, collection, getDocs } from '@/lib/firebase';
import { Product, productStore } from '@/lib/types/product';

export const getTopRatedProducts = async (): Promise<Product[]> => {
  try {
    const productsSnapshot = await getDocs(collection(db, 'products'));
    
    if (!productsSnapshot.empty) {
      return productsSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Product))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8);
    }
    
    // Fallback to local data
    return [...productStore.products].sort((a, b) => b.rating - a.rating).slice(0, 8);
  } catch (error) {
    console.error('Error fetching top rated products:', error);
    return [...productStore.products].sort((a, b) => b.rating - a.rating).slice(0, 8);
  }
};

export const getDiscountedProducts = async (): Promise<Product[]> => {
  try {
    const productsSnapshot = await getDocs(collection(db, 'products'));
    
    if (!productsSnapshot.empty) {
      return productsSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Product))
        .filter(product => product.salePrice !== undefined)
        .slice(0, 8);
    }
    
    // Fallback to local data
    return productStore.products.filter(product => product.salePrice !== undefined).slice(0, 8);
  } catch (error) {
    console.error('Error fetching discounted products:', error);
    return productStore.products.filter(product => product.salePrice !== undefined).slice(0, 8);
  }
};

export const getBestSellingProducts = async (): Promise<Product[]> => {
  try {
    const productsSnapshot = await getDocs(collection(db, 'products'));
    
    if (!productsSnapshot.empty) {
      return productsSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Product))
        .sort((a, b) => b.reviewCount - a.reviewCount) // Sort by review count as a proxy for popularity
        .slice(0, 8);
    }
    
    // Fallback to local data
    return [...productStore.products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 8);
  } catch (error) {
    console.error('Error fetching best selling products:', error);
    return [...productStore.products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 8);
  }
};

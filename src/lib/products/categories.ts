
import { db, collection, getDocs } from '@/lib/firebase';
import { products } from '@/lib/types/product';

export const getAllCategories = async (): Promise<string[]> => {
  try {
    const productsSnapshot = await getDocs(collection(db, 'products'));
    
    if (!productsSnapshot.empty) {
      const categories = new Set(
        productsSnapshot.docs.map(doc => doc.data().category as string)
      );
      return Array.from(categories);
    }
    
    // Fallback to local data
    const categories = new Set(products.map(product => product.category));
    return Array.from(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    const categories = new Set(products.map(product => product.category));
    return Array.from(categories);
  }
};

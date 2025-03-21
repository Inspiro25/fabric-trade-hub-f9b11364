
import { db, collection, getDocs, query, where } from '@/lib/firebase';
import { Product, products } from '@/lib/types/product';

// Function to get related products
export const getRelatedProducts = async (currentProductId: string, category: string): Promise<Product[]> => {
  try {
    const relatedQuery = query(
      collection(db, 'products'), 
      where('category', '==', category)
    );
    
    const relatedSnapshot = await getDocs(relatedQuery);
    
    if (!relatedSnapshot.empty) {
      return relatedSnapshot.docs
        .map(doc => {
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
            shopId: data.shopId,
          } as Product;
        })
        .filter(product => product.id !== currentProductId)
        .slice(0, 4);
    }
    
    // Fallback to local data
    return products
      .filter(product => product.id !== currentProductId && product.category === category)
      .slice(0, 4);
  } catch (error) {
    console.error('Error fetching related products:', error);
    return products
      .filter(product => product.id !== currentProductId && product.category === category)
      .slice(0, 4);
  }
};

// Utility functions to get filtered products
export const getNewArrivals = async (): Promise<Product[]> => {
  try {
    const newArrivalsQuery = query(
      collection(db, 'products'), 
      where('isNew', '==', true)
    );
    
    const snapshot = await getDocs(newArrivalsQuery);
    
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        } as Product;
      }).slice(0, 8);
    }
    
    // Fallback to local data
    return products.filter(product => product.isNew).slice(0, 8);
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    return products.filter(product => product.isNew).slice(0, 8);
  }
};

export const getTrendingProducts = async (): Promise<Product[]> => {
  try {
    const trendingQuery = query(
      collection(db, 'products'), 
      where('isTrending', '==', true)
    );
    
    const snapshot = await getDocs(trendingQuery);
    
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        } as Product;
      }).slice(0, 8);
    }
    
    // Fallback to local data
    return products.filter(product => product.isTrending).slice(0, 8);
  } catch (error) {
    console.error('Error fetching trending products:', error);
    return products.filter(product => product.isTrending).slice(0, 8);
  }
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const categoryQuery = query(
      collection(db, 'products'), 
      where('category', '==', category)
    );
    
    const snapshot = await getDocs(categoryQuery);
    
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        } as Product;
      });
    }
    
    // Fallback to local data
    return products.filter(product => product.category === category);
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    return products.filter(product => product.category === category);
  }
};

export const getProductsByTags = async (tag: string): Promise<Product[]> => {
  try {
    const productsSnapshot = await getDocs(collection(db, 'products'));
    
    if (!productsSnapshot.empty) {
      return productsSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Product))
        .filter(product => product.tags.includes(tag))
        .slice(0, 8);
    }
    
    // Fallback to local data
    return products.filter(product => product.tags.includes(tag)).slice(0, 8);
  } catch (error) {
    console.error(`Error fetching products with tag ${tag}:`, error);
    return products.filter(product => product.tags.includes(tag)).slice(0, 8);
  }
};

import { Product } from './products';
import { db, collection, getDocs, getDoc, addDoc, updateDoc, doc, query, where, deleteDoc } from '@/lib/firebase';

export interface Shop {
  id: string;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  address: string;
  rating: number;
  reviewCount: number;
  productIds: string[];
  isVerified: boolean;
  createdAt: string;
}

// Local mock data for fallback and initial development
export const mockShops: Shop[] = [
  {
    id: 'shop-1',
    name: 'Electronics Hub',
    description: 'Your one-stop destination for all electronic gadgets and accessories.',
    logo: '/placeholder.svg',
    coverImage: '/placeholder.svg',
    address: '123 Tech Street, Silicon Valley, CA',
    rating: 4.7,
    reviewCount: 342,
    productIds: ['product-1', 'product-2', 'product-5', 'product-9'],
    isVerified: true,
    createdAt: '2023-01-15'
  },
  {
    id: 'shop-2',
    name: 'Fashion Trends',
    description: 'The latest in fashion for every season and occasion.',
    logo: '/placeholder.svg',
    coverImage: '/placeholder.svg',
    address: '456 Style Avenue, New York, NY',
    rating: 4.5,
    reviewCount: 218,
    productIds: ['product-3', 'product-4', 'product-8'],
    isVerified: true,
    createdAt: '2023-03-22'
  },
  {
    id: 'shop-3',
    name: 'Home Essentials',
    description: 'Everything you need to make your house a home.',
    logo: '/placeholder.svg',
    coverImage: '/placeholder.svg',
    address: '789 Comfort Lane, Chicago, IL',
    rating: 4.3,
    reviewCount: 176,
    productIds: ['product-6', 'product-7', 'product-10'],
    isVerified: false,
    createdAt: '2023-05-07'
  }
];

// Function to fetch all shops from Firestore
export const fetchShops = async (): Promise<Shop[]> => {
  try {
    const shopsSnapshot = await getDocs(collection(db, 'shops'));
    
    if (shopsSnapshot.empty) {
      console.log('No shops found in database, using mock data');
      return mockShops;
    }
    
    return shopsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        description: data.description,
        logo: data.logo,
        coverImage: data.coverImage,
        address: data.address,
        rating: data.rating,
        reviewCount: data.reviewCount,
        productIds: data.productIds || [],
        isVerified: data.isVerified,
        createdAt: data.createdAt,
      } as Shop;
    });
  } catch (error) {
    console.error('Error fetching shops:', error);
    return mockShops; // Fallback to mock data
  }
};

// Temporary local reference to shops - also export for direct access
export let shops: Shop[] = [...mockShops];

// Initialize shops from database
(async () => {
  try {
    shops = await fetchShops();
  } catch (error) {
    console.error('Failed to initialize shops from database:', error);
  }
})();

// Function to get a shop by ID
export const getShopById = async (id: string): Promise<Shop | undefined> => {
  try {
    const shopDoc = await getDoc(doc(db, 'shops', id));
    
    if (shopDoc.exists()) {
      const data = shopDoc.data();
      return {
        id: shopDoc.id,
        name: data.name,
        description: data.description,
        logo: data.logo,
        coverImage: data.coverImage,
        address: data.address,
        rating: data.rating,
        reviewCount: data.reviewCount,
        productIds: data.productIds || [],
        isVerified: data.isVerified,
        createdAt: data.createdAt,
      } as Shop;
    }
    
    // Try to find in local cache if not in database
    return shops.find(shop => shop.id === id);
  } catch (error) {
    console.error(`Error fetching shop ${id}:`, error);
    return shops.find(shop => shop.id === id); // Fallback to local shops array
  }
};

// Function to update a shop
export const updateShop = async (id: string, shopData: Partial<Shop>): Promise<boolean> => {
  try {
    await updateDoc(doc(db, 'shops', id), {
      ...shopData,
      // Prevent updating these fields directly
      id: undefined,
      createdAt: undefined,
    });
    
    console.info('Shop details updated:', shopData);
    
    // Update local cache
    shops = shops.map(shop => shop.id === id ? { ...shop, ...shopData } : shop);
    
    return true;
  } catch (error) {
    console.error('Error updating shop:', error);
    return false;
  }
};

// Function to create a new shop
export const createShop = async (shopData: Omit<Shop, 'id'>): Promise<string | null> => {
  try {
    const newShopRef = await addDoc(collection(db, 'shops'), {
      ...shopData,
      createdAt: new Date().toISOString(),
    });
    
    const newShop = {
      id: newShopRef.id,
      ...shopData,
      createdAt: new Date().toISOString(),
    };
    
    // Update local cache
    shops = [...shops, newShop];
    
    return newShopRef.id;
  } catch (error) {
    console.error('Error creating shop:', error);
    return null;
  }
};

// Function to delete a shop
export const deleteShop = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'shops', id));
    
    // Update local cache
    shops = shops.filter(shop => shop.id !== id);
    
    return true;
  } catch (error) {
    console.error('Error deleting shop:', error);
    return false;
  }
};

// Function to get products for a shop
// Modified to make the second parameter optional
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

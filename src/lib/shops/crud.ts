import { db, collection, getDocs, getDoc, addDoc, updateDoc, doc, deleteDoc } from '@/lib/firebase';
import { Shop } from './types';
import { mockShops, shops } from './mockData';

// Function to fetch all shops from Firestore
export const fetchShops = async (): Promise<Shop[]> => {
  try {
    const shopsSnapshot = await getDocs(collection(db, 'shops'));
    
    if (shopsSnapshot.empty) {
      console.log('No shops found in database, using mock data');
      return mockShops;
    }
    
    const fetchedShops = shopsSnapshot.docs.map(doc => {
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
    
    // Update the shops reference
    Object.assign(shops, fetchedShops);
    
    return fetchedShops;
  } catch (error) {
    console.error('Error fetching shops:', error);
    return mockShops; // Fallback to mock data
  }
};

// Initialize shops from database
(async () => {
  try {
    const fetchedShops = await fetchShops();
    Object.assign(shops, fetchedShops);
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
        shopId: data.shopId,
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
    const shopIndex = shops.findIndex(shop => shop.id === id);
    if (shopIndex !== -1) {
      shops[shopIndex] = { ...shops[shopIndex], ...shopData };
    }
    
    return true;
  } catch (error) {
    console.error('Error updating shop:', error);
    return false;
  }
};

// Function to create a new shop
export const createShop = async (shopData: Omit<Shop, 'id'>): Promise<string | null> => {
  try {
    // Generate a simple shop ID (in a real app, this would be more sophisticated)
    const shopId = `shop-${Math.floor(Math.random() * 10000)}`;
    
    const newShopRef = await addDoc(collection(db, 'shops'), {
      ...shopData,
      shopId: shopId, // Add the shop ID for admin access
      createdAt: new Date().toISOString(),
    });
    
    const newShop = {
      id: newShopRef.id,
      shopId: shopId,
      ...shopData,
      createdAt: new Date().toISOString(),
    };
    
    // Update local cache
    shops.push(newShop);
    
    // In a real app, you would save these credentials securely and send them to the shop owner
    console.info('New shop created with credentials:', {
      shopId: shopId,
      password: `password${Math.floor(Math.random() * 10000)}` // This is just for demo
    });
    
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
    const shopIndex = shops.findIndex(shop => shop.id === id);
    if (shopIndex !== -1) {
      shops.splice(shopIndex, 1);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting shop:', error);
    return false;
  }
};

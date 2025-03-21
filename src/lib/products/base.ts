
import { db, collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc } from '@/lib/firebase';
import { Product, mockProducts, productStore } from '@/lib/types/product';

// Function to fetch all products from Firestore
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const productsSnapshot = await getDocs(collection(db, 'products'));
    
    if (productsSnapshot.empty) {
      console.log('No products found in database, using mock data');
      return mockProducts;
    }
    
    const fetchedProducts = productsSnapshot.docs.map(doc => {
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
    });
    
    // Update the product store
    productStore.updateProducts(fetchedProducts);
    return fetchedProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
    return mockProducts;
  }
};

// Initialize products from database
(async () => {
  try {
    await fetchProducts();
  } catch (error) {
    console.error('Failed to initialize products from database:', error);
  }
})();

// Get product by ID
export const getProductById = async (id: string): Promise<Product | undefined> => {
  try {
    const productDoc = await getDoc(doc(db, 'products', id));
    
    if (productDoc.exists()) {
      const data = productDoc.data();
      return {
        id: productDoc.id,
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
    }
    
    // Fallback to local cache
    return productStore.products.find(product => product.id === id);
  } catch (error) {
    console.error('Error fetching product:', error);
    return productStore.products.find(product => product.id === id);
  }
};

// Create a new product
export const createProduct = async (productData: Omit<Product, 'id'>): Promise<string | null> => {
  try {
    const newProductRef = await addDoc(collection(db, 'products'), productData);
    
    const newProduct = {
      id: newProductRef.id,
      ...productData,
    };
    
    // Update local cache
    productStore.addProduct(newProduct);
    
    return newProductRef.id;
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
};

// Update a product
export const updateProduct = async (id: string, productData: Partial<Product>): Promise<boolean> => {
  try {
    await updateDoc(doc(db, 'products', id), {
      ...productData,
      id: undefined, // Prevent updating the ID
    });
    
    // Update local cache
    productStore.updateProduct(id, productData);
    
    return true;
  } catch (error) {
    console.error('Error updating product:', error);
    return false;
  }
};

// Delete a product
export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'products', id));
    
    // Update local cache
    productStore.removeProduct(id);
    
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};

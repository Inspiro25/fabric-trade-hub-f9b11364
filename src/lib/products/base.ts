
import { Product } from '@/lib/types/product';
import { 
  fetchProducts as supabaseFetchProducts,
  getProductById as supabaseGetProductById,
  createProduct as supabaseCreateProduct,
  updateProduct as supabaseUpdateProduct,
  deleteProduct as supabaseDeleteProduct
} from '@/lib/supabase/products';
import { productStore } from '@/lib/types/product';

// Function to fetch all products
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const products = await supabaseFetchProducts();
    // Update the product store
    productStore.updateProducts(products);
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return productStore.products; // Fallback to local cache
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
    const product = await supabaseGetProductById(id);
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return productStore.products.find(product => product.id === id);
  }
};

// Create a new product
export const createProduct = async (productData: Omit<Product, 'id'>): Promise<string | null> => {
  try {
    const productId = await supabaseCreateProduct(productData);
    
    if (productId) {
      const newProduct = {
        id: productId,
        ...productData,
      };
      
      // Update local cache
      productStore.addProduct(newProduct);
    }
    
    return productId;
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
};

// Update a product
export const updateProduct = async (id: string, productData: Partial<Product>): Promise<boolean> => {
  try {
    const success = await supabaseUpdateProduct(id, productData);
    
    if (success) {
      // Update local cache
      productStore.updateProduct(id, productData);
    }
    
    return success;
  } catch (error) {
    console.error('Error updating product:', error);
    return false;
  }
};

// Delete a product
export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const success = await supabaseDeleteProduct(id);
    
    if (success) {
      // Update local cache
      productStore.removeProduct(id);
    }
    
    return success;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};

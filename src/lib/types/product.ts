
// Re-export from products/types.ts for compatibility
export type { Product } from '@/lib/products/types';
import { Product, adaptProduct } from '@/lib/products/types';

// Add the productStore implementation
export const productStore = {
  products: [] as Product[],
  updateProducts: function(products: Product[]) {
    this.products = products.map(product => {
      // Ensure all products are properly adapted to the Product interface
      return adaptProduct(product);
    });
  },
  addProduct: function(product: Product) {
    const adaptedProduct = adaptProduct(product);
    const existingIndex = this.products.findIndex(p => p.id === adaptedProduct.id);
    if (existingIndex >= 0) {
      this.products[existingIndex] = adaptedProduct;
    } else {
      this.products.push(adaptedProduct);
    }
  },
  updateProduct: function(id: string, productData: Partial<Product>) {
    const existingIndex = this.products.findIndex(p => p.id === id);
    if (existingIndex >= 0) {
      this.products[existingIndex] = { ...this.products[existingIndex], ...productData };
    }
  },
  removeProduct: function(id: string) {
    this.products = this.products.filter(p => p.id !== id);
  }
};

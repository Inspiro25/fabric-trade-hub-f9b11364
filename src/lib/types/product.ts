
// Re-export from products/types.ts for compatibility
export type { Product } from '@/lib/products/types';

// Add the productStore implementation
export const productStore = {
  products: [] as Product[],
  updateProducts: function(products: Product[]) {
    this.products = products;
  },
  addProduct: function(product: Product) {
    const existingIndex = this.products.findIndex(p => p.id === product.id);
    if (existingIndex >= 0) {
      this.products[existingIndex] = product;
    } else {
      this.products.push(product);
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

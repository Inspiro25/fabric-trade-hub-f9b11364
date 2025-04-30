
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  salePrice?: number;
  quantity: number;
  color?: string;
  size?: string;
  product?: any; // Allow both productId and product to be used
  stock?: number; // Add stock property
  total?: number; // Add total property
  shopId?: string; // Add shopId property
}

export interface CartContextProps {
  cart: CartItem[];
  total: number;
  addToCart: (product: any, quantity?: number, color?: string, size?: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  isLoading: boolean;
  // Add other methods as needed
}

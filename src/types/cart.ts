
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
  product?: any;
  stock?: number;
  total?: number;
  shopId?: string;
  selectedOptions?: Record<string, any>;
}

export interface CartContextProps {
  cart: CartItem[];
  total: number;
  addToCart: (cartItem: CartItem) => void;
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

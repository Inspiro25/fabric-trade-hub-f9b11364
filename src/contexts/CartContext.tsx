
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  shopId?: string;
  stock: number;
  total: number;
}

interface CartContextProps {
  cartItems: CartItem[];
  addToCart: (
    productId: string,
    name: string,
    image: string,
    price: number,
    stockQuantity: number,
    shopId?: string,
    salePrice?: number | null,
    color?: string,
    size?: string
  ) => void;
  removeFromCart: (id: string) => void;
  updateCartItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  // Add missing properties being used in components
  updateQuantity: (id: string, quantity: number) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  getCartCount: () => number;
  getCartTotal: () => number;
  isLoading: boolean;
  cart: CartItem[];
  total: number;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

interface CartProviderProps {
  children: React.ReactNode;
}

const generateId = () => uuidv4();

const getLocalCartItems = (): CartItem[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  const storedCartItems = localStorage.getItem('cartItems');
  return storedCartItems ? JSON.parse(storedCartItems) : [];
};

const setLocalCartItems = (cartItems: CartItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, setState] = useState({
    cartItems: getLocalCartItems(),
    isLoading: true,
  });

  useEffect(() => {
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      setState(prevState => ({ 
        ...prevState, 
        cartItems: JSON.parse(storedCartItems),
        isLoading: false 
      }));
    } else {
      setState(prevState => ({ ...prevState, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    setLocalCartItems(state.cartItems);
  }, [state.cartItems]);

  const addToCart = (
    productId: string,
    name: string,
    image: string,
    price: number,
    stockQuantity: number,
    shopId?: string,
    salePrice?: number | null,
    color?: string,
    size?: string
  ) => {
    const finalPrice = salePrice ?? price;
    
    // Check if the item is already in the cart
    const existingItemIndex = state.cartItems.findIndex(item =>
      item.productId === productId && item.color === color && item.size === size
    );
    
    if (existingItemIndex !== -1) {
      // Item is already in the cart, update quantity
      const updatedItems = [...state.cartItems];
      const newQuantity = updatedItems[existingItemIndex].quantity + 1;
      
      // Make sure we don't exceed stock
      if (newQuantity <= stockQuantity) {
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: newQuantity,
          total: newQuantity * finalPrice
        };
        setLocalCartItems(updatedItems);
        setState(prev => ({ ...prev, cartItems: updatedItems }));
      } else {
        toast({
          title: "Stock limit reached",
          description: `Sorry, there are only ${stockQuantity} units available.`,
          variant: "destructive",
        });
      }
    } else {
      // Item is not in the cart, add it
      const newItem: CartItem = {
        id: generateId(),
        productId,
        name,
        image,
        price: finalPrice,
        quantity: 1,
        stock: stockQuantity,
        shopId,
        color,
        size,
        total: finalPrice
      };
      
      const updatedItems = [...state.cartItems, newItem];
      setLocalCartItems(updatedItems);
      setState(prev => ({ ...prev, cartItems: updatedItems }));
    }
  };

  const removeFromCart = (id: string) => {
    const updatedItems = state.cartItems.filter(item => item.id !== id);
    setLocalCartItems(updatedItems);
    setState(prev => ({ ...prev, cartItems: updatedItems }));
  };

  const updateCartItemQuantity = (id: string, quantity: number) => {
    const updatedItems = state.cartItems.map(item => {
      if (item.id === id) {
        return {
          ...item,
          quantity: quantity,
          total: item.price * quantity,
        };
      }
      return item;
    });
    setLocalCartItems(updatedItems);
    setState(prev => ({ ...prev, cartItems: updatedItems }));
  };

  // Add alias functions with same implementation
  const updateQuantity = updateCartItemQuantity;

  const increaseQuantity = (id: string) => {
    const item = state.cartItems.find(item => item.id === id);
    if (item) {
      updateCartItemQuantity(id, item.quantity + 1);
    }
  };

  const decreaseQuantity = (id: string) => {
    const item = state.cartItems.find(item => item.id === id);
    if (item && item.quantity > 1) {
      updateCartItemQuantity(id, item.quantity - 1);
    }
  };

  const clearCart = () => {
    setLocalCartItems([]);
    setState(prev => ({ ...prev, cartItems: [] }));
  };

  const getItemQuantity = (productId: string): number => {
    const item = state.cartItems.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };

  const getTotalItems = useCallback(() => {
    return state.cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [state.cartItems]);

  const getTotalPrice = useCallback(() => {
    return state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [state.cartItems]);

  // Add alias for getTotalItems
  const getCartCount = getTotalItems;

  // Add alias for getTotalPrice
  const getCartTotal = getTotalPrice;

  // Calculate total for checkout
  const total = getTotalPrice();

  const value: CartContextProps = {
    cartItems: state.cartItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    getItemQuantity,
    getTotalItems,
    getTotalPrice,
    // Add the missing properties
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    getCartCount,
    getCartTotal,
    isLoading: state.isLoading,
    cart: state.cartItems,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

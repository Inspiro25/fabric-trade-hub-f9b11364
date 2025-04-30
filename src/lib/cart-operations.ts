
import { CartItem } from "@/types/cart";
import { Product } from "@/lib/types/product";

// Add a product to the cart with the given quantity
export const addToCart = (product: Product, quantity: number = 1): CartItem => {
  if (!product) {
    throw new Error("Cannot add undefined product to cart");
  }
  
  // Construct the cart item from the product
  const cartItem: CartItem = {
    id: product.id,
    productId: product.id,
    quantity: quantity,
    name: product.name,
    image: product.images?.[0] || "",
    price: product.price,
    stock: product.stock || 10,
    shopId: product.shop_id,
    total: product.price * quantity,
    selectedOptions: []
  };
  
  return cartItem;
};

// Update an existing cart item's quantity
export const updateCartItemQuantity = (
  cartItem: CartItem,
  quantity: number
): CartItem => {
  if (!cartItem) {
    throw new Error("Cannot update undefined cart item");
  }
  
  if (quantity < 1) {
    throw new Error("Quantity must be at least 1");
  }
  
  if (cartItem.stock && quantity > cartItem.stock) {
    throw new Error(`Only ${cartItem.stock} items available`);
  }
  
  // Create a new cart item with the updated quantity
  return {
    ...cartItem,
    quantity: quantity,
    total: cartItem.price * quantity
  };
};

// Calculate the total price of all items in the cart
export const calculateCartTotal = (cartItems: CartItem[]): number => {
  return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Calculate the number of items in the cart
export const calculateCartItemCount = (cartItems: CartItem[]): number => {
  return cartItems.reduce((count, item) => count + item.quantity, 0);
};

// Group cart items by shop
export const groupCartItemsByShop = (
  cartItems: CartItem[]
): Record<string, CartItem[]> => {
  return cartItems.reduce((shops, item) => {
    const shopId = item.shopId || "unknown";
    
    if (!shops[shopId]) {
      shops[shopId] = [];
    }
    
    shops[shopId].push(item);
    return shops;
  }, {} as Record<string, CartItem[]>);
};

// Calculate shipping cost - this is a placeholder implementation
export const calculateShippingCost = (
  cartItems: CartItem[],
  distance: number = 5
): number => {
  const baseShippingCost = 5;
  const itemCount = calculateCartItemCount(cartItems);
  const distanceFactor = Math.max(1, distance / 5);
  
  return baseShippingCost + (itemCount * 0.5) * distanceFactor;
};

// Validate that all items in the cart are available in the required quantity
export const validateCartItems = (
  cartItems: CartItem[],
  availableProducts: Product[]
): { valid: boolean; invalidItems: CartItem[] } => {
  const invalidItems: CartItem[] = [];
  
  for (const item of cartItems) {
    const product = availableProducts.find(p => p.id === item.productId);
    
    // If the product doesn't exist or is out of stock
    if (!product || product.stock === 0) {
      invalidItems.push(item);
      continue;
    }
    
    // If requested quantity is greater than available stock
    if (product.stock && item.quantity > product.stock) {
      invalidItems.push({
        ...item,
        quantity: product.stock // Suggest the available quantity
      });
    }
  }
  
  return {
    valid: invalidItems.length === 0,
    invalidItems
  };
};

// Format the cart total price as currency
export const formatCartTotal = (
  total: number,
  currency: string = "INR"
): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency
  }).format(total);
};

// Serialize cart for storage
export const serializeCart = (cartItems: CartItem[]): string => {
  return JSON.stringify(cartItems);
};

// Deserialize cart from storage
export const deserializeCart = (serialized: string): CartItem[] => {
  try {
    return JSON.parse(serialized);
  } catch (error) {
    console.error("Failed to parse cart", error);
    return [];
  }
};


// Define JSON type to satisfy Supabase's JSON type requirements
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Define order item type as a specific JSON object
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
  [key: string]: Json | undefined; // Add index signature for compatibility with Json type
}

// Define AdminOrderSummary type
export interface AdminOrderSummary {
  id: string;
  created_at: string;
  status: string;
  total: number;
  customer_name?: string;
  customer_email?: string;
  shop_id?: string;
  payment_status?: string;
  order_number?: string;
}

// Define AdminOrderDetails type
export interface AdminOrderDetails {
  id: string;
  created_at: string;
  updated_at: string;
  status: string;
  total: number;
  payment_method?: string;
  payment_status?: string;
  tracking_number?: string;
  notes?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  shipping_address?: string;
  shipping_method?: string;
  items?: OrderItem[];
  shop_id?: string;
  user_id?: string;
}

// Utility function to convert OrderItem arrays to Json[] for DB operations
export const itemsToJsonArray = (items: OrderItem[]): Json[] => {
  return items.map(item => ({
    id: item.id,
    order_id: item.order_id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price,
    color: item.color,
    size: item.size
  }));
};

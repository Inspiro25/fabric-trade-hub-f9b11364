import { Product } from './product';

export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
  total: number;
}

export interface ShippingAddress {
  id: string;
  name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  tracking_id?: string;
  expected_delivery?: string;
  cancellation_reason?: string;
  return_reason?: string;
} 
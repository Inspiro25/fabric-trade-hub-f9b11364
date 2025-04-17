export interface Offer {
  id: string;
  title: string;
  code: string;
  type: 'percentage' | 'fixed';
  discount: number;
  is_active: boolean;
  expiry: string;
  created_at: string;
  updated_at: string;
} 
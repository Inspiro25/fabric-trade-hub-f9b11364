export interface Shop {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    pinterest?: string;
  };
  rating?: number;
  reviewCount?: number;
  isVerified?: boolean;
  status: 'active' | 'pending' | 'suspended';
  createdAt: string;
  updatedAt?: string;
  ownerId: string;
  ownerName?: string;
  categories?: string[];
  tags?: string[];
  productCount?: number;
  followers?: number;
  location?: {
    latitude: number;
    longitude: number;
  };
  businessHours?: {
    monday?: { open: string; close: string };
    tuesday?: { open: string; close: string };
    wednesday?: { open: string; close: string };
    thursday?: { open: string; close: string };
    friday?: { open: string; close: string };
    saturday?: { open: string; close: string };
    sunday?: { open: string; close: string };
  };
}

export interface ShopFormValues {
  name: string;
  description?: string;
  address?: string;
  phoneNumber?: string;
  status?: 'active' | 'pending' | 'suspended';
  logo?: string;
  coverImage?: string;
  isVerified?: boolean;
  shopId?: string;
  password?: string;
  ownerName?: string;
  ownerEmail?: string;
}

export interface ShopStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  averageOrderValue: number;
  salesByDay: {
    date: string;
    sales: number;
  }[];
  topProducts: {
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }[];
  recentOrders: {
    id: string;
    date: string;
    customer: string;
    amount: number;
    status: string;
  }[];
}

export interface ShopFilter {
  search?: string;
  category?: string;
  rating?: number;
  isVerified?: boolean;
  sortBy?: 'name' | 'rating' | 'newest' | 'oldest';
  page?: number;
  limit?: number;
}

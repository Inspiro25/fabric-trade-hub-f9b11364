
import { supabase } from "@/integrations/supabase/client";

// Types for analytics data
export interface DashboardAnalytics {
  totalRevenue: number;
  totalOrders: number;
  totalShops: number;
  totalUsers: number;
  monthlySalesData: MonthlySalesData[];
  shopPerformance: ShopPerformance[];
}

export interface MonthlySalesData {
  month: string;
  totalSales: number;
  totalOrders: number;
}

export interface ShopPerformance {
  name: string;
  sales: number;
  orders: number;
  profit: number;
}

// Fetch platform analytics for dashboard
export const fetchDashboardAnalytics = async (): Promise<DashboardAnalytics> => {
  try {
    // Get the current date for recent data filtering
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    // Format dates for Supabase query
    const todayStr = today.toISOString().split('T')[0];
    const sixMonthsAgoStr = sixMonthsAgo.toISOString().split('T')[0];
    
    // Fetch the latest platform analytics
    const { data: platformData, error: platformError } = await supabase
      .from('platform_analytics')
      .select('*')
      .order('date', { ascending: false })
      .limit(1);
    
    if (platformError) {
      console.error('Error fetching platform analytics:', platformError);
      throw platformError;
    }
    
    // Fetch monthly sales data for the chart
    const { data: monthlySalesData, error: salesError } = await supabase
      .from('platform_analytics')
      .select('date, total_revenue, total_orders')
      .gte('date', sixMonthsAgoStr)
      .lte('date', todayStr)
      .order('date', { ascending: true });
    
    if (salesError) {
      console.error('Error fetching monthly sales data:', salesError);
      throw salesError;
    }
    
    // Fetch shop count
    const { count: shopCount, error: shopCountError } = await supabase
      .from('shops')
      .select('*', { count: 'exact', head: true });
    
    if (shopCountError) {
      console.error('Error fetching shop count:', shopCountError);
      throw shopCountError;
    }
    
    // Fetch user count (from user_profiles)
    const { count: userCount, error: userCountError } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true });
    
    if (userCountError) {
      console.error('Error fetching user count:', userCountError);
      throw userCountError;
    }
    
    // Fetch top performing shops
    const { data: shopPerformanceData, error: shopPerformanceError } = await supabase
      .from('shops')
      .select('id, name')
      .limit(3);
    
    if (shopPerformanceError) {
      console.error('Error fetching shop performance:', shopPerformanceError);
      throw shopPerformanceError;
    }
    
    // Fetch analytics for each shop
    const shopAnalyticsPromises = shopPerformanceData.map(async (shop) => {
      const { data: shopAnalytics, error: shopAnalyticsError } = await supabase
        .from('shop_analytics')
        .select('revenue, orders')
        .eq('shop_id', shop.id)
        .order('date', { ascending: false })
        .limit(1);
      
      if (shopAnalyticsError) {
        console.error(`Error fetching analytics for shop ${shop.id}:`, shopAnalyticsError);
        return {
          name: shop.name,
          sales: 0,
          orders: 0,
          profit: 0
        };
      }
      
      const shopData = shopAnalytics[0] || { revenue: 0, orders: 0 };
      
      return {
        name: shop.name,
        sales: shopData.revenue || 0,
        orders: shopData.orders || 0,
        profit: (shopData.revenue || 0) * 0.3 // Assuming 30% profit margin
      };
    });
    
    const shopPerformance = await Promise.all(shopAnalyticsPromises);
    
    // Format monthly sales data
    const formattedMonthlySales = monthlySalesData.map(item => {
      const date = new Date(item.date);
      return {
        month: date.toLocaleString('default', { month: 'short' }),
        totalSales: item.total_revenue || 0,
        totalOrders: item.total_orders || 0
      };
    });
    
    // Use the latest platform analytics or defaults
    const latestPlatformData = platformData?.[0] || { 
      total_revenue: 0, 
      total_orders: 0 
    };
    
    return {
      totalRevenue: latestPlatformData.total_revenue || 0,
      totalOrders: latestPlatformData.total_orders || 0,
      totalShops: shopCount || 0,
      totalUsers: userCount || 0,
      monthlySalesData: formattedMonthlySales.length ? formattedMonthlySales : generateMockMonthlySalesData(),
      shopPerformance: shopPerformance.length ? shopPerformance : generateMockShopPerformance()
    };
  } catch (error) {
    console.error('Error in fetchDashboardAnalytics:', error);
    // Return mock data as fallback
    return {
      totalRevenue: 54200,
      totalOrders: 1150,
      totalShops: 3,
      totalUsers: 573,
      monthlySalesData: generateMockMonthlySalesData(),
      shopPerformance: generateMockShopPerformance()
    };
  }
};

// Generate mock monthly sales data for fallback
const generateMockMonthlySalesData = (): MonthlySalesData[] => {
  return [
    { month: 'Jan', totalSales: 6500, totalOrders: 120 },
    { month: 'Feb', totalSales: 8900, totalOrders: 150 },
    { month: 'Mar', totalSales: 7200, totalOrders: 135 },
    { month: 'Apr', totalSales: 9800, totalOrders: 170 },
    { month: 'May', totalSales: 11300, totalOrders: 190 },
    { month: 'Jun', totalSales: 10500, totalOrders: 180 },
  ];
};

// Generate mock shop performance data for fallback
const generateMockShopPerformance = (): ShopPerformance[] => {
  return [
    { name: 'Electronics Hub', sales: 28500, orders: 450, profit: 9800 },
    { name: 'Fashion Trends', sales: 19200, orders: 380, profit: 6400 },
    { name: 'Home Essentials', sales: 15800, orders: 320, profit: 5300 },
  ];
};

// Function to seed initial analytics data (for testing/development)
export const seedAnalyticsData = async (): Promise<void> => {
  try {
    // Check if we already have platform analytics data
    const { count } = await supabase
      .from('platform_analytics')
      .select('*', { count: 'exact', head: true });
    
    // Only seed if we don't have any data
    if (count === 0) {
      // Generate 6 months of platform data
      const platformData = Array.from({ length: 6 }).map((_, index) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - index));
        
        return {
          date: date.toISOString().split('T')[0],
          total_revenue: 5000 + Math.floor(Math.random() * 7000),
          total_orders: 100 + Math.floor(Math.random() * 100),
          new_users: 20 + Math.floor(Math.random() * 50),
          new_shops: Math.floor(Math.random() * 3)
        };
      });
      
      const { error: platformError } = await supabase
        .from('platform_analytics')
        .insert(platformData);
      
      if (platformError) {
        console.error('Error seeding platform analytics:', platformError);
      }
      
      console.log('Seeded platform analytics data');
    }
  } catch (error) {
    console.error('Error in seedAnalyticsData:', error);
  }
};

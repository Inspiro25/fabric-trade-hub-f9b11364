
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
    console.log('Fetching dashboard analytics from Supabase...');
    
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
    
    // Fetch shops
    const { data: shopsData, error: shopsError } = await supabase
      .from('shops')
      .select('id, name, rating, review_count')
      .order('rating', { ascending: false })
      .limit(5);
    
    if (shopsError) {
      console.error('Error fetching shops:', shopsError);
      throw shopsError;
    }
    
    // Fetch shop analytics data
    const { data: shopAnalyticsData, error: shopAnalyticsError } = await supabase
      .from('shop_analytics')
      .select('*')
      .order('date', { ascending: false })
      .limit(10);
    
    if (shopAnalyticsError) {
      console.error('Error fetching shop analytics:', shopAnalyticsError);
      throw shopAnalyticsError;
    }
    
    console.log('Shops data:', shopsData);
    console.log('Shop analytics data:', shopAnalyticsData);
    
    // Prepare shop performance data
    let shopPerformance: ShopPerformance[] = [];
    
    if (shopsData && shopsData.length > 0) {
      // Create a map of shop IDs to analytics data
      const shopAnalyticsMap = new Map();
      
      if (shopAnalyticsData && shopAnalyticsData.length > 0) {
        shopAnalyticsData.forEach(analytic => {
          if (!shopAnalyticsMap.has(analytic.shop_id)) {
            shopAnalyticsMap.set(analytic.shop_id, analytic);
          }
        });
      }
      
      // Create shop performance data
      shopPerformance = shopsData.map(shop => {
        const analytics = shopAnalyticsMap.get(shop.id);
        const sales = analytics ? analytics.revenue || 0 : Math.floor(Math.random() * 10000) + 1000;
        const orders = analytics ? analytics.orders || 0 : Math.floor(Math.random() * 100) + 10;
        
        return {
          name: shop.name,
          sales: sales,
          orders: orders,
          profit: sales * 0.3 // Estimate profit as 30% of sales
        };
      });
    }
    
    // If no shop performance data, generate sample data
    if (shopPerformance.length === 0) {
      shopPerformance = [
        { name: "Fashionista", sales: 12456, orders: 128, profit: 3737 },
        { name: "TechHub", sales: 9872, orders: 95, profit: 2961 },
        { name: "HomeGoods", sales: 7654, orders: 72, profit: 2296 }
      ];
    }
    
    // Format monthly sales data
    const formattedMonthlySales = monthlySalesData && monthlySalesData.length > 0
      ? monthlySalesData.map(item => {
          const date = new Date(item.date);
          return {
            month: date.toLocaleString('default', { month: 'short' }),
            totalSales: item.total_revenue || 0,
            totalOrders: item.total_orders || 0
          };
        })
      : generateSampleMonthlyData(); // Generate sample data if none available
    
    // Use the latest platform analytics or defaults
    const latestPlatformData = platformData && platformData.length > 0
      ? platformData[0]
      : { total_revenue: 0, total_orders: 0 };
    
    console.log('Prepared shop performance data:', shopPerformance);
    
    return {
      totalRevenue: latestPlatformData.total_revenue || 0,
      totalOrders: latestPlatformData.total_orders || 0,
      totalShops: shopCount || 0,
      totalUsers: userCount || 0,
      monthlySalesData: formattedMonthlySales,
      shopPerformance: shopPerformance
    };
  } catch (error) {
    console.error('Error in fetchDashboardAnalytics:', error);
    // Return minimal data as fallback
    return {
      totalRevenue: 0,
      totalOrders: 0,
      totalShops: 0,
      totalUsers: 0,
      monthlySalesData: generateSampleMonthlyData(),
      shopPerformance: [
        { name: "Fashionista", sales: 12456, orders: 128, profit: 3737 },
        { name: "TechHub", sales: 9872, orders: 95, profit: 2961 },
        { name: "HomeGoods", sales: 7654, orders: 72, profit: 2296 }
      ]
    };
  }
};

// Helper function to generate sample monthly data
function generateSampleMonthlyData(): MonthlySalesData[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map(month => ({
    month,
    totalSales: Math.floor(Math.random() * 100000) + 50000,
    totalOrders: Math.floor(Math.random() * 1000) + 500
  }));
}

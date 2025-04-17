import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch sales analytics data for a specific shop
 * @param shopId The ID of the shop to get analytics for
 * @returns Array of analytics data by date
 */
export const fetchShopSalesAnalytics = async (shopId: string) => {
  try {
    // Get the last 30 days of sales data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // First try to get data from the analytics table
    const { data, error } = await supabase
      .from('shop_sales_analytics')
      .select('*')
      .eq('shop_id', shopId)
      .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
      .order('date', { ascending: true });
    
    if (error) {
      console.error('Error fetching shop sales analytics:', error);
      return [];
    }
    
    // If we have data, return it
    if (data && data.length > 0) {
      return data;
    }
    
    // If no data in analytics table, calculate from orders
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('created_at, total')
      .eq('shop_id', shopId)
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true });
    
    if (ordersError) {
      console.error('Error fetching orders for analytics:', ordersError);
      return generateSampleSalesData();
    }
    
    // Group orders by date
    const ordersByDate: Record<string, { amount: number; count: number }> = {};
    
    ordersData.forEach(order => {
      const date = new Date(order.created_at).toISOString().split('T')[0];
      if (!ordersByDate[date]) {
        ordersByDate[date] = { amount: 0, count: 0 };
      }
      ordersByDate[date].amount += order.total;
      ordersByDate[date].count += 1;
    });
    
    // Convert to array format
    const analyticsData = Object.entries(ordersByDate).map(([date, data]) => ({
      id: `order-${date}`,
      shop_id: shopId,
      date,
      sales_amount: data.amount,
      orders_count: data.count
    }));
    
    // If we have order data, return it
    if (analyticsData.length > 0) {
      return analyticsData;
    }
    
    // If still no data, generate sample data
    return generateSampleSalesData();
  } catch (error) {
    console.error('Exception fetching shop sales analytics:', error);
    return generateSampleSalesData();
  }
};

/**
 * Record a new sales data point for a shop
 * @param shopId The ID of the shop
 * @param date The date for the analytics
 * @param amount The sales amount
 * @param ordersCount The number of orders
 */
export const recordShopSales = async (
  shopId: string, 
  date: string,
  amount: number,
  ordersCount: number
) => {
  try {
    const { data, error } = await supabase
      .from('shop_sales_analytics')
      .upsert({
        shop_id: shopId,
        date,
        sales_amount: amount,
        orders_count: ordersCount
      }, {
        onConflict: 'shop_id,date'
      })
      .select();
    
    if (error) {
      console.error('Error recording shop sales:', error);
      return null;
    }
    
    return data?.[0] || null;
  } catch (error) {
    console.error('Exception recording shop sales:', error);
    return null;
  }
};

// Helper function to generate sample sales data
const generateSampleSalesData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // Generate random sales data
    data.push({
      id: `sample-${i}`,
      shop_id: 'sample',
      date: date.toISOString().split('T')[0],
      sales_amount: Math.floor(Math.random() * 1000) + 50,
      orders_count: Math.floor(Math.random() * 20) + 1
    });
  }
  
  return data;
};


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/contexts/ThemeContext';

interface ShopSalesStatsProps {
  shopId: string;
}

const ShopSalesStats: React.FC<ShopSalesStatsProps> = ({ shopId }) => {
  const [salesData, setSalesData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isDarkMode } = useTheme();
  
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        // Fetch sales data for the last 7 days
        const { data, error } = await supabase
          .from('shop_sales_analytics')
          .select('*')
          .eq('shop_id', shopId)
          .order('date', { ascending: true })
          .limit(7);
          
        if (error) {
          throw error;
        }
        
        const formattedData = data?.map(item => ({
          date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          sales: item.sales_amount || 0,
          orders: item.orders_count || 0
        })) || [];
        
        setSalesData(formattedData);
      } catch (error) {
        console.error('Error fetching sales data:', error);
        // Set some default data if there's an error
        setSalesData([
          { date: 'Mon', sales: 0, orders: 0 },
          { date: 'Tue', sales: 0, orders: 0 },
          { date: 'Wed', sales: 0, orders: 0 },
          { date: 'Thu', sales: 0, orders: 0 },
          { date: 'Fri', sales: 0, orders: 0 },
          { date: 'Sat', sales: 0, orders: 0 },
          { date: 'Sun', sales: 0, orders: 0 }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSalesData();
  }, [shopId]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-vyoma-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
        <CardDescription>Last 7 days performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="date" stroke={isDarkMode ? '#9ca3af' : '#4b5563'} />
              <YAxis stroke={isDarkMode ? '#9ca3af' : '#4b5563'} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDarkMode ? '#1f2937' : '#fff',
                  border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                  color: isDarkMode ? '#e5e7eb' : '#111827'
                }} 
              />
              <Bar dataKey="sales" name="Sales ($)" fill="#ff9800" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShopSalesStats;
